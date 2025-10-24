# 🚀 How to Start Both Servers

## ⚠️ IMPORTANT: Both servers MUST be running for the app to work!

### Step 1: Start Backend (Terminal 1)
```powershell
cd "C:\Users\2440611\Downloads\fullstack\ISG25JFA003_Online-Food-Delivery-System"
.\mvnw spring-boot:run
```
**Wait for:** `Started OnlineFoodDeliverySystemApplication...`  
**Backend will run on:** http://localhost:8080

---

### Step 2: Start Frontend (Terminal 2)
```powershell
cd "C:\Users\2440611\Downloads\fullstack\ISG25JFA003_Online-Food-Delivery-System-Web"
npm start
```
**Wait for:** `Angular Live Development Server is listening on localhost:4200`  
**Frontend will run on:** http://localhost:4200

---

### Step 3: Access the Application
Open browser: **http://localhost:4200**

---

## ✅ Verification Checklist

After starting both servers, check:

1. **Backend Console** - Should show Spring Boot startup logs
2. **Frontend Console** - Should show "Compiled successfully"
3. **Browser Network Tab** - API calls should go to `/api/v1/...` and return JSON
4. **Browser Console** - Should show logs with 📦 and 🔔 emojis

---

## 🐛 If Incoming Orders Still Don't Show

Check browser console for these logs:
- `📦 Received order history from backend`
- `📊 Number of orders received`
- `🔔 Pending orders after filter`

If you see errors:
1. Verify backend is running (check Terminal 1)
2. Verify frontend proxy is working (restart Angular server)
3. Check that you're logged in as a RESTAURANT user
4. Verify there are orders with status "PLACED" or "PENDING" in the database

---

## 📝 Current Status

- ✅ Proxy configuration fixed
- ✅ Frontend code with robust status handling
- ✅ Comprehensive logging added
- ⏳ **ACTION NEEDED**: Restart Angular server (Ctrl+C then `npm start`)
- ⏳ **ACTION NEEDED**: Ensure backend is running
