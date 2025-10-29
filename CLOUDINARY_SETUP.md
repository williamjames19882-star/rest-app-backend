# Cloudinary Setup Guide

## Configuration Added

Cloudinary is now configured in your project with the following credentials:

- **Cloud Name**: di3cqje8p
- **API Key**: 197532798489139
- **API Secret**: hD1slFRuY_WGWtEcPP4OYd7pIEQ

## Installation

Install the required packages:

```bash
cd rest-app-backend
npm install
```

This will install:
- `cloudinary` - Cloudinary SDK for Node.js
- `multer` - Middleware for handling file uploads

## Environment Variables

The Cloudinary credentials are already in your `env.example` file. Make sure your `.env` file has these values:

```env
CLOUDINARY_CLOUD_NAME=di3cqje8p
CLOUDINARY_API_KEY=197532798489139
CLOUDINARY_API_SECRET=hD1slFRuY_WGWtEcPP4OYd7pIEQ
CLOUDINARY_URL=cloudinary://197532798489139:hD1slFRuY_WGWtEcPP4OYd7pIEQ@di3cqje8p
```

## Usage

### 1. Upload Single Image

**API Endpoint**: `POST /api/upload/image`

**Request**: 
- Use `multipart/form-data`
- Field name: `image`

**Example with curl**:
```bash
curl -X POST http://localhost:5000/api/upload/image \
  -F "image=@path/to/image.jpg"
```

**Response**:
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/di3cqje8p/image/upload/v1/restaurant/image.jpg",
  "public_id": "restaurant/image",
  "format": "jpg",
  "bytes": 123456
}
```

### 2. Upload Multiple Images

**API Endpoint**: `POST /api/upload/images`

**Request**:
- Use `multipart/form-data`
- Field name: `images`

**Example**:
```bash
curl -X POST http://localhost:5000/api/upload/images \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

**Response**:
```json
{
  "success": true,
  "uploads": [
    {
      "url": "https://res.cloudinary.com/di3cqje8p/image/upload/v1/restaurant/image1.jpg",
      "public_id": "restaurant/image1",
      "format": "jpg",
      "bytes": 123456
    }
  ]
}
```

### 3. Using in Menu Items

Example to upload menu item image:

```javascript
// Frontend example
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/upload/image', {
  method: 'POST',
  body: formData
});

const data = await response.json();
// Use data.url as the menu item's image_url
```

## Features

- ✅ Image optimization (auto-crop and auto-quality)
- ✅ Max file size: 5MB
- ✅ Only image files allowed
- ✅ Uploads stored in `restaurant` folder on Cloudinary
- ✅ Returns secure URL (HTTPS)

## Security Notes

⚠️ **Important**: 
1. Never commit `.env` file with real credentials to Git
2. The credentials are already in `.gitignore`
3. For production on Render, add these environment variables in the Render dashboard

## Cloudinary Dashboard

Manage your uploads at:
https://console.cloudinary.com/

Login with your credentials to view uploaded images and manage your account.

## Testing

Test the upload functionality:

```bash
# Make sure backend is running
npm start

# Test upload (replace image path)
curl -X POST http://localhost:5000/api/upload/image \
  -F "image=@test-image.jpg"
```

## Integration with Menu Items

To add image upload to menu items, update the Menu model:

```javascript
// In routes/menu.js or create route
router.post('/items', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    let image_url = null;
    
    // Upload image if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'menu');
      image_url = result.secure_url;
    }
    
    // Create menu item with image_url
    // ...
  });
});
```

