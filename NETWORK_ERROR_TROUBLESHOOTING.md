# Network Error Troubleshooting Guide

## 🔍 Understanding the Error

The "Network Error" you're experiencing typically indicates one of these issues:

1. **CORS (Cross-Origin Resource Sharing) Error**
2. **Backend Server Not Running**
3. **Incorrect Backend URL**
4. **Network Connectivity Issues**

## 🛠️ Step-by-Step Troubleshooting

### 1. Test Backend Connection

First, test if your backend is accessible:

1. **Open your browser** and go to: `https://gokrixo.onrender.com`
2. **Check if the server responds** (should show some response, even if it's an error page)
3. **Go to `/api-test`** in your React app and click "اختبار الاتصال بالخادم"

### 2. Check CORS Configuration

Your backend needs to allow requests from your frontend. Add this to your backend:

#### Node.js/Express:
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### Python/Flask:
```python
from flask_cors import CORS

CORS(app, origins=['http://localhost:5173', 'http://localhost:3000', 'https://your-frontend-domain.com'])
```

#### Python/Django:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-frontend-domain.com",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS'
]
```

### 3. Check Backend Endpoints

Make sure your backend has these exact endpoints:

- `POST /CreateCommand`
- `GET /GetCommands`
- `POST /CreateWorker`
- `GET /GetWorkers`
- `POST /Regestration`
- `GET /account/{id}`

### 4. Test with Postman/curl

Test your backend directly:

```bash
# Test CreateCommand
curl -X POST https://gokrixo.onrender.com/CreateCommand \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "test",
    "number": "01234567",
    "service": "test service",
    "workers": "1",
    "start": "test start",
    "distination": "test end"
  }'

# Test GetCommands
curl -X GET https://gokrixo.onrender.com/GetCommands
```

### 5. Check Browser Console

1. **Open Developer Tools** (F12)
2. **Go to Network tab**
3. **Try to submit the form**
4. **Look for the failed request** and check:
   - Request URL
   - Request method
   - Request headers
   - Response status
   - Response headers

### 6. Common Solutions

#### If CORS is the issue:
- Add proper CORS headers to your backend
- Make sure the origin matches your frontend URL exactly

#### If backend is not responding:
- Check if your backend server is running
- Verify the URL is correct
- Check if the server is accessible from the internet

#### If endpoints don't exist:
- Verify all required endpoints are implemented
- Check the HTTP methods (GET, POST, etc.)
- Ensure the endpoint paths match exactly

## 🔧 Quick Fixes to Try

### 1. Update Backend URL
If your backend is running locally, update `src/config/backend.js`:
```javascript
development: {
  baseURL: 'http://localhost:3000', // or your local backend URL
  timeout: 10000,
},
```

### 2. Add CORS Headers (Temporary)
Add this to your backend to allow all origins (for testing only):
```javascript
app.use(cors({
  origin: '*',
  credentials: false
}));
```

### 3. Check Network Tab
In browser DevTools → Network tab, look for:
- **Status 404**: Endpoint doesn't exist
- **Status 405**: Wrong HTTP method
- **Status 500**: Server error
- **CORS error**: Missing CORS headers

## 📞 Getting Help

If the issue persists:

1. **Check the browser console** for detailed error messages
2. **Test the backend directly** with Postman or curl
3. **Verify CORS configuration** on your backend
4. **Check if the backend server is running** and accessible

## 🎯 Expected Behavior

After fixing the issues:
- ✅ Connection test should pass
- ✅ Form submissions should work
- ✅ No network errors in console
- ✅ Data should be saved to your backend

---

**Need more help?** Check the browser console for specific error messages and share them for more targeted assistance. 