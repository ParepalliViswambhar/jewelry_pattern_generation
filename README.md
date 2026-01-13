# ✨ Lustre Jewelry - AI-Powered Jewelry Design Generator

Transform your jewelry sketches into stunning realistic designs using our custom-trained GAN (Generative Adversarial Network) model.

![Python](https://img.shields.io/badge/python-3.8+-green.svg)
![Node.js](https://img.shields.io/badge/node.js-16+-green.svg)
![TensorFlow](https://img.shields.io/badge/tensorflow-2.15-orange.svg)

## 🎯 Overview

Lustre Jewelry is a full-stack web application that leverages deep learning to convert hand-drawn jewelry sketches into photorealistic jewelry images. The core of this application is a custom GAN model trained specifically for jewelry design generation.

## 🧠 GAN Model Details

### Architecture
- **Model Type:** Generative Adversarial Network (GAN)
- **Framework:** TensorFlow/Keras
- **Input Resolution:** 1024x1024 pixels
- **Output Resolution:** 1024x1024 pixels

### Training Details
- **Training Dataset:** 2,500+ curated jewelry images
- **Image Pairs:** Sketch-to-realistic jewelry mappings
- **Training Epochs:** Multiple checkpoints saved (40, 50, 60 epochs)
- **Model Files:**
  - `generator_final.keras` - Final model variant 
  

### Image Processing Pipeline
1. **Background Detection** - Automatically detects dominant background color
2. **Background Refinement** - Converts background to white for consistency
3. **Sketch Conversion** - Transforms input to pencil sketch using edge detection
4. **GAN Processing** - Generates realistic jewelry from sketch
5. **Post-processing** - Applies final color corrections and format conve
- OAuth credentials (Google, GitHub, LinkedIn)

## Setup Instructionsi

### Supported Output Formats
- JPEG
- PNG
- WEBP
- AVIF

## 🏗️ Project Structure

```
lustre-jewelry/
├── backend/                 # Node.js/Express REST API
│   ├── config/              # Database & OAuth configuration
│   ├── middleware/          # Authentication & file upload middleware
│   ├── models/              # MongoDB/Mongoose schemas
│   ├── routes/              # API route handlers
│   └── server.js            # Express server entry point
│
├── frontend/                # React.js Web Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   └── pages/           # Page components
│   └── public/              # Static assets
│
├── ml-service/              #ython Flask ML Service
│   ├── app.py               # Flask API with GAN inference
│   ├── *.keras              # Trained GAN model files
│   ├── generated/           # Output directory for generated images
│   └── requirements.txt     # Python dependencies
│
└── uploaded/                # User uploaded images storage
```

## ⚡ Tech Stack

### Backend
- **Runtime:** Node.js v16+
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT, Passport.js (Google, GitHub OAuth)
- **File Storage:** Cloudinary, Multer
- **Email:** Nodemailer

### Frontend
- **Framework:** React 18
- **Routing:** React Router v7
- **Icons:** FontAwesome
- **HTTP Client:** Axios

### ML Service
- **Runtime:** Python 3.8+
- **Framework:** Flask
- **Deep Learning:** TensorFlow 2.15
- **Image Processing:** OpenCV, Pillow
- **CORS:** Flask-CORS

## 🚀 Getting Started

### Prerequisites
- Node.js v16 or higher
- Python 3.8 or higher
- MongoDB Atlas account
- OAuth credentials (Google, GitHub)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/lustre-jewelry.git
cd lustre-jewelry
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env with your credentials
npm run dev
```
Server runs on **http://localhost:3001**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
App runs on **http://localhost:3000**

### 4. ML Service Setup
```bash
cd ml-service
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
ML Service runs on **http://localhost:5000**

## ⚙️ Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=your_backend_api_url
REACT_APP_ML_SERVICE_URL=your_ml_service_url
```

### ML Service (.env)
```env
MODEL_PATH=generator_folder_50.keras
FLASK_PORT=5000
GENERATED_DIR=generated
ALLOWED_ORIGINS=your_frontend_url,your_backend_url
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/create` | Register new user |
| POST | `/auth/login` | Login with credentials |
| GET | `/auth/google` | Google OAuth |
| GET | `/auth/github` | GitHub OAuth |

### Image Processing
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/image/upload` | Upload sketch image |
| GET | `/api/image/:filename` | Retrieve image |
| POST | `/api/image/process` | Process with GAN |

### ML Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/process-image` | Generate jewelry from sketch |

## 🎨 Features

- **AI-Powered Generation** - Custom GAN model trained on 2,500+ jewelry images
- **Multiple Model Checkpoints** - Choose from different training stages
- **User Authentication** - Secure login with email/password or OAuth
- **Image Gallery** - Save and manage your generated designs
- **Multiple Output Formats** - Export in JPEG, PNG, WEBP, or AVIF
- **Real-time Processing** - Fast inference with optimized TensorFlow
- **Responsive Design** - Works on desktop and mobile devices

## 🔧 Model Selection

You can switch between different model checkpoints by updating the `MODEL_PATH` in `ml-service/.env`:

```env
# Available models:
MODEL_PATH=generator_final1.keras      # Final model v1

```

## 📊 Model Performance

The GAN model was trained with the following characteristics:
- **Dataset Size:** 2,500+ paired images (sketches + realistic jewelry)
- **Training Time:** Multiple training sessions with checkpoint saving
- **Input Processing:** Automatic sketch conversion with edge detection
- **Output Quality:** High-resolution 1024x1024 photorealistic images

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using TensorFlow, React, and Node.js
