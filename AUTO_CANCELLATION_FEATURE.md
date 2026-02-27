# Auto-Cancellation Feature Documentation

## Overview
Bookings are automatically cancelled after 1 hour if the user doesn't reach the charging station. The slot is then released back to the station's available slots.

---

## 🔧 Backend Implementation

### 1. **Booking Model Update** (`models/Booking.js`)

**Added Fields:**
```javascript
expiresAt: {
  type: Date,
  required: true
}
```

**MongoDB TTL Index:**
```javascript
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

This creates a Time-To-Live (TTL) index that automatically deletes documents when `expiresAt` time is reached.

---

### 2. **Booking Creation** (`routes/bookingRoutes.js`)

**Expiry Time Calculation:**
```javascript
const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
```

When a booking is created, the `expiresAt` field is set to 1 hour from the current time.

---

### 3. **Auto-Cleanup Service** (`server.js`)

**Background Job:**
```javascript
setInterval(async () => {
  try {
    // Find all expired bookings
    const expiredBookings = await Booking.find({
      expiresAt: { $lte: new Date() }
    });

    // For each expired booking
    for (const booking of expiredBookings) {
      // Restore the slot to the station
      const station = await Station.findById(booking.stationId);
      if (station) {
        station.availableSlots += 1;
        await station.save();
      }
      
      // Delete the expired booking
      await Booking.findByIdAndDelete(booking._id);
      console.log(`🔄 Auto-cancelled expired booking: ${booking._id}`);
    }
  } catch (err) {
    console.log("Auto-cleanup error:", err);
  }
}, 60000); // Runs every 60 seconds (1 minute)
```

**How It Works:**
1. Runs every 60 seconds
2. Finds bookings where `expiresAt` is less than or equal to current time
3. Restores the slot count to the station
4. Deletes the expired booking
5. Logs the cancellation

---

## 🎨 Frontend Implementation

### 1. **Payment Success Message** (`pages/Payment.js`)

**Updated Success Screen:**
```javascript
<p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '15px', fontSize: '1.1rem' }}>
  Your slot is reserved for 1 hour
</p>
```

Informs users that their booking is valid for 1 hour.

---

### 2. **Bookings Display** (`pages/Bookings.js`)

**Added Expiry Information:**
```javascript
<p style={{ marginBottom: '0', fontSize: '0.95rem' }}>
  <strong>⏰ Expires:</strong><br/>
  {new Date(booking.expiresAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })}
</p>
```

**Warning Banner:**
```javascript
<div style={{ 
  background: 'rgba(255, 193, 7, 0.15)',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 193, 7, 0.3)',
  marginBottom: '15px',
  textAlign: 'center'
}}>
  <p style={{ marginBottom: '0', color: '#ffc107', fontWeight: '600' }}>
    ⏱️ Slot valid for 1 hour | Auto-cancels if not used
  </p>
</div>
```

---

## 🔄 How It Works (User Flow)

### Step 1: User Books a Slot
1. User selects a charging station
2. Completes payment and OTP verification
3. Booking is created with `expiresAt = currentTime + 1 hour`
4. Station's `availableSlots` is decreased by 1

### Step 2: During the 1-Hour Window
- User can see their booking in "My Bookings"
- Booking shows expiry time
- User can manually cancel if needed

### Step 3: If User Reaches Station (Within 1 Hour)
- User uses the charging slot
- User can manually cancel the booking after charging

### Step 4: If User Doesn't Reach (After 1 Hour)
- Auto-cleanup service detects expired booking
- Station's `availableSlots` is increased by 1
- Booking is automatically deleted from database
- Slot becomes available for other users

---

## ⚙️ Technical Details

### MongoDB TTL Index
- **Purpose**: Automatically delete documents after expiry
- **Advantage**: Database-level automation, no manual cleanup needed
- **Limitation**: May take up to 60 seconds after expiry to delete

### Background Cleanup Job
- **Frequency**: Every 60 seconds
- **Purpose**: Restore slots immediately when bookings expire
- **Advantage**: Ensures slots are available quickly

### Why Both Methods?
1. **TTL Index**: Handles document deletion at database level
2. **Cleanup Job**: Ensures slot restoration happens immediately

---

## 🎯 Benefits

### For Users:
- ✅ Clear expiry time displayed
- ✅ Automatic cancellation if they can't make it
- ✅ No manual intervention needed
- ✅ Fair booking system

### For System:
- ✅ Prevents slot hoarding
- ✅ Maximizes station utilization
- ✅ Automatic resource management
- ✅ No orphaned bookings

### For Other Users:
- ✅ Slots become available quickly
- ✅ Fair access to charging stations
- ✅ Reduced waiting time

---

## 📊 Example Timeline

```
12:00 PM - User books a slot
          └─ expiresAt = 1:00 PM
          └─ availableSlots: 5 → 4

12:30 PM - User can still use the slot
          └─ Booking is active

1:00 PM  - Booking expires
          └─ Auto-cleanup runs (within 1 minute)
          └─ availableSlots: 4 → 5
          └─ Booking deleted from database

1:01 PM  - Slot is available for other users
```

---

## 🔍 Monitoring

**Server Logs:**
```
🔄 Auto-cancelled expired booking: 507f1f77bcf86cd799439011
```

This log appears whenever a booking is automatically cancelled.

---

## 🛠️ Configuration

**To Change Expiry Duration:**

In `routes/bookingRoutes.js`:
```javascript
// Current: 1 hour
const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

// For 30 minutes:
const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

// For 2 hours:
const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
```

**To Change Cleanup Frequency:**

In `server.js`:
```javascript
// Current: Every 60 seconds
setInterval(async () => { ... }, 60000);

// For every 30 seconds:
setInterval(async () => { ... }, 30000);

// For every 2 minutes:
setInterval(async () => { ... }, 120000);
```

---

## 🚀 Testing

### Test Scenario 1: Normal Booking
1. Create a booking
2. Check "My Bookings" - should show expiry time
3. Wait for 1 hour
4. Refresh "My Bookings" - booking should be gone
5. Check station - slot should be restored

### Test Scenario 2: Manual Cancellation
1. Create a booking
2. Manually cancel before expiry
3. Slot should be restored immediately

### Test Scenario 3: Multiple Bookings
1. Create multiple bookings at different times
2. Each should expire independently
3. All slots should be restored correctly

---

## 📝 Database Schema

**Before:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  stationId: ObjectId,
  chargingType: String,
  energyRequired: Number,
  totalAmount: Number,
  createdAt: Date
}
```

**After:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  stationId: ObjectId,
  chargingType: String,
  energyRequired: Number,
  totalAmount: Number,
  expiresAt: Date,        // NEW: Expiry timestamp
  createdAt: Date
}
```

---

## ⚠️ Important Notes

1. **Server Must Be Running**: Auto-cleanup only works when the server is running
2. **Database Connection**: Requires active MongoDB connection
3. **Time Sync**: Server time should be accurate
4. **Cleanup Delay**: May take up to 1 minute after expiry to process

---

**Last Updated**: 2026
**Feature**: Auto-Cancellation System
**Status**: ✅ Implemented and Active
