# Backend Integration Guide

This guide explains how to integrate and test your React frontend with the backend API endpoints.

## 🚀 Quick Start

1. **Start your backend server** (make sure it's running on the correct port)
2. **Update the backend URL** in `src/config/backend.js` if needed
3. **Start the React development server**
4. **Test the API endpoints** using the test page

## 📋 API Endpoints

Your backend should implement these endpoints:

### Commands
- `POST /CreateCommand` - Create a new service request
- `GET /GetCommands` - Get all commands
- `PUT /commands/{id}/status` - Update command status (approve/reject)
- `DELETE /commands/{id}` - Delete a command

### Workers
- `POST /CreateWorker` - Create a new worker registration
- `GET /GetWorkers` - Get all workers
- `PUT /workers/{id}/status` - Update worker status (approve/reject)
- `DELETE /workers/{id}` - Delete a worker

### Authentication
- `POST /Regestration` - User registration
- `GET /account/{id}` - Get account by ID
- `POST /login` - User login (optional)

## 🔧 Configuration

### Backend URL Configuration

Edit `src/config/backend.js` to match your backend server:

```javascript
export const BACKEND_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000', // Update this to your backend URL
    timeout: 10000,
  },
  // ... other environments
};
```

### CORS Configuration

Make sure your backend allows requests from your frontend. Here are examples for different backends:

#### Node.js/Express
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

#### Python/Flask
```python
from flask_cors import CORS

CORS(app, origins=['http://localhost:5173'])
```

#### Python/Django
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

## 🧪 Testing

### Using the API Test Page

1. Navigate to `/api-test` in your React app
2. Click individual test buttons to test specific endpoints
3. Click "اختبار جميع النقاط" to test all endpoints at once
4. Check the results for success/failure status

### Manual Testing

You can also test the endpoints manually using the integrated forms:

1. **Contact Page** (`/contact`) - Tests `/CreateCommand`
2. **Hire Us Page** (`/HireUs`) - Tests `/CreateWorker`
3. **Admin Panel** (`/Admin`) - Tests `/GetCommands` and `/GetWorkers`

## 📊 Expected Data Formats

### CreateCommand Request (Backend Format)
```javascript
{
  "firstName": "nasro",
  "number": "666666",
  "floor": "5",
  "itemtype": "Glass",
  "service": "miw",
  "workers": "3",
  "start": "bachar",
  "distination": "kenadsa"
}
```

### CreateWorker Request (Backend Format)
```javascript
{
  "fillname": "nasredine ghellale",
  "number": "01234567",
  "email": "SWILLE7500@gmail.com",
  "password": "azertyué&rezerA1!",
  "position": "azertyué&rezerA1!",
  "experience": "aerzrttyuyuioytrezaa  zerttyuyioilkjhfgdsffghjgfgdfsffgghjhjk",
  "message": "eazrertyjhfdfsfgndf",
  "isaccepted": false
}
```

### Registration Request (Backend Format)
```javascript
{
  "email": "SWILLE7500@gmail.com",
  "password": "azertyué&rezerA1!"
}
```

### Frontend to Backend Data Transformation

The API service automatically transforms frontend data to match backend format:

#### Command Transformation:
- `name` → `firstName`
- `phone` → `number`
- `services` → `service` (joined with commas)
- `workers` → `workers` (converted to string)
- `end` → `distination`

#### Worker Transformation:
- `name` → `fillname`
- `phone` → `number`
- `isAccepted` → `isaccepted`
- Adds default password if not provided

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure your backend allows requests from your frontend URL
   - Check that the backend is running and accessible

2. **Connection Refused**
   - Verify the backend URL in `src/config/backend.js`
   - Ensure your backend server is running

3. **404 Errors**
   - Check that your backend implements the exact endpoint paths
   - Verify the HTTP methods (GET, POST, PUT, DELETE)

4. **Authentication Errors**
   - If using JWT tokens, ensure they're properly handled
   - Check that the Authorization header is being sent correctly

### Debug Mode

Enable debug logging by checking the browser console for detailed error messages. The API service includes comprehensive error logging.

## 📝 API Service Structure

The API integration is organized in `src/services/api.js`:

- `commandAPI` - Handles all command-related operations
- `workerAPI` - Handles all worker-related operations  
- `authAPI` - Handles authentication and user management
- `testAPI` - Provides testing utilities

## 🎯 Next Steps

1. **Test all endpoints** using the `/api-test` page
2. **Verify data persistence** in your backend database
3. **Test the admin panel** functionality
4. **Implement additional features** as needed

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your backend server is running and accessible
3. Test the endpoints manually using tools like Postman
4. Ensure CORS is properly configured

---

**Happy Testing! 🚀** 