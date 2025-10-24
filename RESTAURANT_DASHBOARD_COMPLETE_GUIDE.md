# Restaurant Dashboard - Complete Integration Guide

## 📋 Overview

This guide documents the complete integration between the Angular frontend and Spring Boot backend for the Restaurant Dashboard module.

---

## 🎯 What Was Implemented

### **Dashboard Features:**
- ✅ Real-time statistics (Today's Orders, Today's Earnings, Total Orders, Total Earnings)
- ✅ Incoming Orders management (Accept/Reject functionality)
- ✅ Order History with status filtering
- ✅ Monthly revenue chart (last 6 months)
- ✅ Auto-refresh every 30 seconds
- ✅ Status-based order counting

---

## 🗂️ Files Modified

### **Frontend (Angular):**

1. **`dashboard-content.ts`**
   - Calculates all statistics from order history API
   - Implements Accept/Reject order functionality
   - Monthly earnings calculation
   - Auto-refresh mechanism

2. **`order-history.ts`**
   - Displays all orders with filtering
   - Status-based color coding
   - Auto-refresh integration

3. **`restaurant.service.ts`**
   - `getOrderHistory()` - Fetches all orders
   - `updateOrderStatus(orderId, action)` - Accept/Reject orders

4. **`proxy.conf.json`**
   - Proxies `/api/*` requests to `http://localhost:8080`

5. **`restaurant.routes.ts`**
   - Routes configured for dashboard and order history

### **Backend (Spring Boot):**

**No changes needed!** Using existing APIs:
- `GET /api/v1/restaurant/order-history`
- `PUT /api/v1/restaurant/update-status/{orderId}?action=accept|reject`

---

## 🔄 Data Flow

```
1. User logs in as RESTAURANT
   ↓
2. Navigates to /restaurant/dashboard
   ↓
3. Frontend calls GET /api/v1/restaurant/order-history
   ↓
4. Backend returns all orders with:
   - orderId, orderTime, totalAmount, customerName, customerPhone, status, specialReq
   ↓
5. Frontend calculates:
   - Total Earnings (sum of all totalAmount)
   - Total Orders (count)
   - Today's Orders (filter by today's date)
   - Today's Earnings (sum of today's orders)
   - Pending Orders (status: PLACED, PENDING)
   - Completed Orders (status: PREPARING, OUT_FOR_DELIVERY, DELIVERED)
   - Rejected Orders (status: NOT_ACCEPTED, FAILED)
   - Monthly Earnings (group by last 6 months)
   ↓
6. Display in UI with auto-refresh every 30 seconds
```

---

## 🚀 How to Start the Application

### **Step 1: Start Backend (Terminal 1)**

```powershell
cd "C:\Users\2440611\Downloads\fullstack\ISG25JFA003_Online-Food-Delivery-System"
.\mvnw clean spring-boot:run
```

**Wait for:** "Started OnlineFoodDeliverySystemApplication..."  
**Running on:** http://localhost:8080

### **Step 2: Start Frontend (Terminal 2)**

```powershell
cd "C:\Users\2440611\Downloads\fullstack\ISG25JFA003_Online-Food-Delivery-System-Web"
npm start
```

**Wait for:** "Angular Live Development Server is listening on localhost:4200"  
**Running on:** http://localhost:4200

### **Step 3: Access the Application**

Open browser: http://localhost:4200

---

## 📊 Dashboard Components

### **1. Statistics Cards**
- **Today's Orders:** Count of orders placed today
- **Today's Earnings:** Sum of today's order amounts
- **Total Orders:** Count of all orders
- **Total Earnings:** Sum of all order amounts

### **2. Incoming Orders Table**
Shows orders with status: `PLACED` or `PENDING`

**Actions:**
- **Accept Button** → Changes status to `PREPARING` → Removed from incoming orders
- **Reject Button** → Changes status to `NOT_ACCEPTED` → Removed from incoming orders

**After Accept/Reject:**
- Order is removed from "Incoming Orders"
- Order still visible in "Order History" with updated status
- Statistics are recalculated automatically

### **3. Monthly Revenue Chart**
- Bar chart showing last 6 months earnings
- Calculates from order history data
- Updates automatically

### **4. Order History Page**
- Shows ALL orders regardless of status
- Filter dropdown: All Status, Delivered, Preparing, Placed, Pending, Rejected, Failed
- Color-coded status badges:
  - 🟢 Green: DELIVERED
  - 🟡 Yellow: PLACED, PREPARING, PENDING, OUT_FOR_DELIVERY
  - 🔴 Red: NOT_ACCEPTED, FAILED

---

## 🔧 Status Flow

```
1. New Order Arrives
   Status: PLACED
   ├─ Shows in "Incoming Orders" ✅
   ├─ Shows in "Order History" ✅
   └─ Counted in "Pending Orders"

2. Restaurant Accepts
   Status: PLACED → PREPARING
   ├─ Removed from "Incoming Orders" ❌
   ├─ Shows in "Order History" ✅
   └─ Counted in "Completed Orders"

3. Restaurant Rejects
   Status: PLACED → NOT_ACCEPTED
   ├─ Removed from "Incoming Orders" ❌
   ├─ Shows in "Order History" ✅
   └─ Counted in "Rejected Orders"

4. Delivery in Progress
   Status: OUT_FOR_DELIVERY
   ├─ Not in "Incoming Orders" ❌
   ├─ Shows in "Order History" ✅
   └─ Counted in "Completed Orders"

5. Order Delivered
   Status: DELIVERED
   ├─ Not in "Incoming Orders" ❌
   ├─ Shows in "Order History" ✅
   └─ Counted in "Completed Orders"
```

---

## 🧮 Calculation Logic

### **Total Earnings Calculation:**
```typescript
// Location: dashboard-content.ts, line 109-111
totalEarnings += Number(order.totalAmount);
```
**Formula:** Sum of `totalAmount` from ALL orders (regardless of status or date)

### **Today's Earnings Calculation:**
```typescript
// Location: dashboard-content.ts, line 114-117
if (orderDate.getTime() === today.getTime()) {
  todayOrders++;
  todayEarnings += Number(order.totalAmount);
}
```
**Formula:** Sum of `totalAmount` from orders where `orderTime` = today's date

### **Status Counting:**
```typescript
// Location: dashboard-content.ts, line 120-133
if (status === 'PLACED' || status === 'PENDING') {
  pendingOrders++;  // Awaiting restaurant action
} else if (status === 'PREPARING' || status === 'OUT_FOR_DELIVERY') {
  completedOrders++;  // Accepted and in progress
} else if (status === 'DELIVERED') {
  completedOrders++;  // Successfully delivered
} else if (status === 'NOT_ACCEPTED' || status === 'FAILED') {
  rejectedOrders++;  // Rejected
}
```

### **Monthly Earnings:**
```typescript
// Location: dashboard-content.ts, line 147-175
// Groups orders by month for last 6 months
// Sums totalAmount for each month
```

---

## 🔒 Security & Authentication

- All APIs require JWT authentication
- JWT token stored in localStorage
- Token sent in Authorization header: `Bearer <token>`
- Role-based access: Only `ROLE_RESTAURANT` can access restaurant dashboard

---

## 🐛 Troubleshooting

### **Issue 1: API calls go to localhost:4200 instead of localhost:8080**
**Solution:** 
- Ensure `proxy.conf.json` exists
- Restart Angular dev server with `npm start`
- Check browser Network tab - requests should show proxy working

### **Issue 2: 400 Bad Request on Accept/Reject**
**Solution:**
- Backend must be running on port 8080
- Check backend logs for error details
- Verify JWT token is valid

### **Issue 3: Orders not updating after Accept/Reject**
**Solution:**
- Check browser console for errors
- Verify `loadDashboardData()` is being called after status update
- Check auto-refresh is working (every 30 seconds)

### **Issue 4: Total Earnings showing 0**
**Solution:**
- Ensure there are orders in database
- Check `totalAmount` field is not null in orders
- Verify data type conversion: `Number(order.totalAmount)`

---

## 📱 Testing Checklist

- [ ] Backend starts successfully on port 8080
- [ ] Frontend starts successfully on port 4200
- [ ] Login as restaurant user works
- [ ] Dashboard displays statistics correctly
- [ ] Incoming orders table shows PLACED orders
- [ ] Accept button changes status to PREPARING
- [ ] Reject button changes status to NOT_ACCEPTED
- [ ] Accepted/Rejected orders removed from incoming orders
- [ ] Order history shows all orders
- [ ] Filter dropdown works correctly
- [ ] Monthly revenue chart displays correctly
- [ ] Auto-refresh works (check after 30 seconds)
- [ ] Total earnings calculation is correct
- [ ] Today's earnings shows correct amount

---

## 📂 Project Structure

```
ISG25JFA003_Online-Food-Delivery-System-Web/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/
│   │   │       └── restaurant/
│   │   │           └── restaurant.service.ts  ← API calls
│   │   ├── features/
│   │   │   └── restaurant/
│   │   │       ├── dashboard-content/
│   │   │       │   ├── dashboard-content.ts  ← Main logic
│   │   │       │   ├── dashboard-content.html
│   │   │       │   └── dashboard-content.css
│   │   │       ├── order-history/
│   │   │       │   ├── order-history.ts  ← Order history
│   │   │       │   ├── order-history.html
│   │   │       │   └── order-history.css
│   │   │       └── restaurant.routes.ts  ← Routes
│   │   └── models/
│   │       └── restaurant.models.ts  ← Interfaces
│   └── proxy.conf.json  ← Proxy config
└── angular.json  ← Proxy enabled here

ISG25JFA003_Online-Food-Delivery-System/
└── src/
    └── main/
        └── java/
            └── com/
                └── cognizant/
                    └── onlinefooddeliverysystem/
                        ├── controller/
                        │   └── RestaurantController.java  ← Endpoints
                        ├── service/
                        │   └── implimentation/
                        │       └── RestaurantServiceImpl.java  ← Business logic
                        └── dto/
                            └── restaurant/
                                └── RestaurantOrderHistoryResponseDTO.java
```

---

## ✅ Summary

**Backend:**
- ✅ No changes needed
- ✅ Uses existing APIs

**Frontend:**
- ✅ Single API call to get all data
- ✅ Client-side calculations for statistics
- ✅ Real-time updates with auto-refresh
- ✅ Accept/Reject functionality
- ✅ Status-based filtering

**Key Achievement:**
- All dashboard features working with minimal backend changes
- Efficient data fetching (single API call)
- Real-time synchronization
- Clean separation of concerns

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify both servers are running
4. Clear browser cache and localStorage
5. Restart both servers

---

**Last Updated:** October 22, 2025  
**Version:** 1.0  
**Status:** ✅ Complete and Working
