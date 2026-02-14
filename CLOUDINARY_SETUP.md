# ☁️ Cloudinary Setup Guide

Cloudinary is a free cloud service for hosting and managing images. Perfect for portfolio profile pictures and project images!

## Step 1: Create Free Cloudinary Account

1. Go to: **https://cloudinary.com/users/register/free**
2. Sign up with:
   - Email address
   - Or Google account
   - Or GitHub account
3. Verify your email

## Step 2: Get Your API Credentials

1. After login, you'll see the **Dashboard**
2. You'll immediately see your credentials:

```
┌─────────────────────────────────────────┐
│  Account Details                        │
├─────────────────────────────────────────┤
│  Cloud Name:    your-cloud-name         │
│  API Key:       123456789012345         │
│  API Secret:    abcdefghijklmnopqrstuvwx│
└─────────────────────────────────────────┘
```

3. **Copy these three values:**
   - ☁️ **Cloud Name** (e.g., `dz8xy9abc`)
   - 🔑 **API Key** (e.g., `123456789012345`)
   - 🔐 **API Secret** (e.g., `abcD-EfGhIjKlMnOpQrStUv`)

## Step 3: Update Your .env File

Replace these lines in `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

With your actual credentials:

```env
CLOUDINARY_CLOUD_NAME=dz8xy9abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcD-EfGhIjKlMnOpQrStUv
```

## Step 4: Restart Your Application

```bash
npm run dev
```

## ✅ That's it!

Now users can upload:
- Profile pictures
- Project screenshots
- Portfolio images

All images will be stored in Cloudinary (not your server).

---

## 🎯 Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited

Perfect for portfolios!

---

## 🔒 Security Notes

- Never commit your API Secret to Git
- Keep your .env file private
- API credentials are in your Cloudinary dashboard

---

## 📚 Quick Links

- **Dashboard**: https://cloudinary.com/console
- **Documentation**: https://cloudinary.com/documentation
- **Image Transformations**: https://cloudinary.com/documentation/image_transformations

---

**Note:** Cloudinary is OPTIONAL. Your portfolio app will work without it, but users won't be able to upload images.
