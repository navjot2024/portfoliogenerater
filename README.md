# AI-Based Portfolio Generator

## Executive Summary

The **AI-Based Portfolio Generator** is an advanced, intelligent web application that enables students, professionals, and freelancers to create polished, responsive, and engaging portfolio websites without requiring any coding knowledge. Built on the MERN stack (MongoDB, Express.js, React, Node.js) and powered by sophisticated AI content generation, this system delivers professional-quality portfolios through an intuitive, automated workflow.

### 🎉 NEW: Sample Portfolios Available!

Three professional sample portfolios are now included. **[View them instantly →](#quick-start)**
- **John Doe**: Full-Stack Developer (Modern Theme)
- **Sarah Chen**: UI/UX Designer (Creative Theme)
- **Alex Kumar**: Data Scientist (Corporate Theme)

---

## Table of Contents

1. [Quick Start](#quick-start) ⭐ **NEW**
2. [Problem Statement](#problem-statement)
3. [System Features](#system-features)
4. [Technology Stack](#technology-stack)
5. [System Architecture](#system-architecture)
6. [Installation Guide](#installation-guide)
7. [Deployment Guide](#deployment-guide)
8. [Usage Instructions](#usage-instructions)
9. [API Documentation](#api-documentation)
10. [Project Structure](#project-structure)
11. [Academic Documentation](#academic-documentation)
12. [Contributing](#contributing)
13. [License](#license)

---

## Quick Start

### View Sample Portfolios Instantly 🚀

The application includes 3 professional sample portfolios ready to view:

```
http://localhost:3000/p/john-doe       (Full-Stack Developer)
http://localhost:3000/p/sarah-chen     (UI/UX Designer)
http://localhost:3000/p/alex-kumar     (Data Scientist)
```

### Login to Sample Accounts 🔑

Try any of these credentials:

```
Email: john.doe@example.com      | sarah.chen@example.com    | alex.kumar@example.com
Password: password123             | password123                | password123
```

### Start Servers 💻

```bash
# Make sure MongoDB is running, then:
npm run dev
```

**📖 For detailed instructions, see [QUICK_START.md](./QUICK_START.md)**

---

## Problem Statement

### Real-World Challenges

Students and professionals face significant barriers when creating portfolio websites:

**1. Limited Design Knowledge**
- Lack of UI/UX expertise leads to unprofessional layouts
- Difficulty understanding modern design principles
- Inconsistent visual hierarchy and branding

**2. Weak Professional Writing**
- Inability to articulate achievements effectively
- Generic, uninspiring content that fails to stand out
- Poor grammar and inconsistent tone

**3. Technical Complexity**
- Modern frameworks (React, Vue, Angular) have steep learning curves
- Responsive design requires advanced CSS knowledge
- Hosting and deployment add additional complexity

**4. Existing Solutions Fall Short**
- Template-based builders lack customization
- No intelligent content generation or optimization
- Limited theme variety and inflexible designs
- Poor mobile responsiveness

**5. Time and Resource Constraints**
- Creating a quality portfolio manually takes weeks
- Hiring professionals is expensive ($500-$5000)
- Maintaining and updating portfolios is labor-intensive

### Solution Requirements

An AI-driven system must:

✅ **Accept structured user input** (education, skills, projects, experience, achievements, links)  
✅ **Use AI to refine and professionalize** all written content  
✅ **Automatically generate complete portfolio layouts** with optimal design  
✅ **Provide multiple modern themes** (minimal, creative, corporate, dark mode)  
✅ **Enable real-time preview and editing** with drag-and-drop customization  
✅ **Export portfolios** as responsive HTML/CSS/JS, React templates, or PDF resumes  
✅ **Deliver professional results** without requiring coding knowledge  

---

## System Features

### Core Functionality

#### 1. Intelligent Content Generation
- **AI-Powered Content Refinement**: Transforms basic inputs into polished, professional narratives
- **Context-Aware Writing**: Adapts tone and style based on user's career level and industry
- **Section-Specific Optimization**: Tailored AI prompts for About, Skills, Projects, Experience sections
- **Consistency Control**: Maintains coherent voice and messaging throughout the portfolio

#### 2. Professional Themes & Templates
- **Multiple Design Styles**: Minimal, Creative, Corporate, Modern, Dark Mode
- **Responsive Layouts**: Mobile-first design with perfect rendering across all devices
- **Customizable Color Schemes**: Pre-defined palettes with custom color picker
- **Typography Excellence**: Professional font combinations optimized for readability

#### 3. Advanced Customization
- **Drag-and-Drop Section Ordering**: Rearrange portfolio sections intuitively
- **Live Preview**: Real-time rendering of changes without page refresh
- **Component-Level Editing**: Modify individual elements (skills, projects, experiences)
- **Media Management**: Upload and optimize profile images and project screenshots

#### 4. Export Capabilities
- **Static HTML/CSS/JS**: Single-page applications ready for any hosting
- **React Template**: Full React component structure for developers
- **PDF Resume**: Professionally formatted, ATS-friendly PDF documents
- **Code Package**: Downloadable ZIP with all assets and dependencies

#### 5. User Management
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Portfolio Library**: Save multiple portfolio versions and variations
- **Version Control**: Track changes and restore previous versions
- **Sharing Options**: Generate shareable links with custom domains

#### 6. Performance & Optimization
- **Fast Load Times**: Optimized bundle sizes and lazy loading
- **SEO-Ready**: Meta tags, semantic HTML, and structured data
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Progressive Enhancement**: Works without JavaScript for basic content

---

## Technology Stack

### Frontend
- **React 18.2**: Modern component-based UI library
- **React Router v6**: Client-side routing and navigation
- **Tailwind CSS 3.3**: Utility-first CSS framework for rapid UI development
- **Axios**: Promise-based HTTP client
- **React Context API**: Global state management
- **React Icons**: Comprehensive icon library
- **jsPDF & html2canvas**: PDF generation from HTML
- **React-Beautiful-DnD**: Drag-and-drop functionality

### Backend
- **Node.js 18.x**: JavaScript runtime environment
- **Express.js 4.18**: Fast, minimalist web framework
- **MongoDB 6.x**: NoSQL database for flexible data storage
- **Mongoose 7.x**: ODM for MongoDB with schema validation
- **JWT (jsonwebtoken)**: Secure authentication tokens
- **bcrypt**: Password hashing and security
- **express-validator**: Input validation and sanitization
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### AI Integration
- **OpenAI GPT-4**: Advanced language model for content generation
- **Custom Prompt Engineering**: Specialized prompts for portfolio optimization
- **Response Validation**: Ensures AI output quality and consistency
- **Fallback Mechanisms**: Handles API failures gracefully

### Development Tools
- **ESLint**: Code quality and style enforcement
- **Prettier**: Automated code formatting
- **Nodemon**: Auto-restart development server
- **Concurrently**: Run frontend and backend simultaneously
- **Git**: Version control system

### Deployment & Infrastructure
- **Vercel**: Frontend hosting with automatic deployments
- **Render/Railway**: Backend hosting with CI/CD
- **MongoDB Atlas**: Cloud-hosted MongoDB database
- **Cloudinary**: Image hosting and optimization
- **Docker**: Containerization for consistent environments

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Frontend (Port 3000)                               │  │
│  │  - Authentication UI                                       │  │
│  │  - Portfolio Creation Wizard                              │  │
│  │  - Theme Selector & Live Preview                          │  │
│  │  - Export Manager                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTPS/REST API
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express.js Backend (Port 5000)                           │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────┐ │  │
│  │  │ Auth Service   │  │ Portfolio API  │  │ Export API │ │  │
│  │  └────────────────┘  └────────────────┘  └────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │           AI Content Generation Service            │  │  │
│  │  │  - Prompt Engineering Module                       │  │  │
│  │  │  - Content Refinement Engine                       │  │  │
│  │  │  - Layout Recommendation System                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                   MongoDB Connection
                              │
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MongoDB Database (Atlas)                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │ Users        │  │ Portfolios   │  │ Templates    │   │  │
│  │  │ Collection   │  │ Collection   │  │ Collection   │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                         External APIs
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ OpenAI GPT-4   │  │ Cloudinary     │  │ Email Service  │   │
│  │ API            │  │ (Images)       │  │ (SendGrid)     │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

**Portfolio Creation Workflow:**

```
User Input → Validation → AI Processing → Content Generation → 
Layout Selection → Theme Application → Preview Rendering → 
User Approval → Export Generation → Download/Deploy
```

**Detailed Flow:**

1. **User Registration/Login**
   - Frontend sends credentials to `/api/auth/register` or `/api/auth/login`
   - Backend validates, hashes password (bcrypt), generates JWT
   - Token stored in frontend localStorage, sent with subsequent requests

2. **Portfolio Data Collection**
   - User fills multi-step form (personal info, education, skills, projects, experience)
   - Frontend validates inputs, sends to backend
   - Backend stores raw data in MongoDB `portfolios` collection

3. **AI Content Enhancement**
   - Backend sends raw content to AI service with specialized prompts
   - AI generates professional versions of each section
   - Response validated for quality, consistency, and relevance
   - Enhanced content stored alongside original

4. **Layout & Theme Selection**
   - AI analyzes user profile to recommend optimal theme
   - User previews multiple themes in real-time
   - Selected theme configuration saved with portfolio

5. **Export Generation**
   - User triggers export (HTML/React/PDF)
   - Backend generates files based on selected theme
   - Static assets bundled, HTML minified
   - ZIP file created and sent to client

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  profileImage: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

#### Portfolios Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  title: String,
  personalInfo: {
    fullName: String,
    tagline: String,
    email: String,
    phone: String,
    location: String,
    profileImage: String,
    bio: String,
    aiEnhancedBio: String
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    description: String,
    aiEnhancedDescription: String
  }],
  skills: [{
    category: String,
    name: String,
    proficiency: Number (1-100),
    yearsOfExperience: Number
  }],
  projects: [{
    title: String,
    description: String,
    aiEnhancedDescription: String,
    technologies: [String],
    liveUrl: String,
    githubUrl: String,
    images: [String],
    startDate: Date,
    endDate: Date
  }],
  experience: [{
    company: String,
    position: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String,
    aiEnhancedDescription: String,
    achievements: [String]
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    portfolio: String,
    medium: String
  },
  theme: {
    name: String,
    colorScheme: String,
    layout: String
  },
  sectionOrder: [String],
  published: Boolean,
  slug: String (unique),
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Installation Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) - Comes with Node.js
- **MongoDB** (v6.x or higher) - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **Git** - [Download](https://git-scm.com/downloads)
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/api-keys)

### Local Development Setup

#### Step 1: Clone the Repository

```bash
cd ~/Desktop
git clone <repository-url>
cd "feb 10-2"
```

#### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio-generator
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio-generator

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Email Configuration (Optional - for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary Configuration (Optional - for image hosting)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Step 3: Frontend Setup

```bash
# Navigate to frontend directory from project root
cd ../frontend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

#### Step 4: Database Setup

If using local MongoDB:

```bash
# Start MongoDB service
sudo systemctl start mongodb

# Or on macOS
brew services start mongodb-community
```

If using MongoDB Atlas:
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP address
4. Copy the connection string to `MONGODB_URI` in backend `.env`

#### Step 5: Start the Application

**Option A: Run Both Servers Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

**Option B: Run Concurrently (Recommended)**

From project root:
```bash
npm install
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/docs

---

## Deployment Guide

### Production Deployment

#### Backend Deployment (Render/Railway)

**Using Render:**

1. **Create Render Account**: Sign up at [render.com](https://render.com)

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `portfolio-generator-api`
     - Environment: `Node`
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`
     - Instance Type: Free or Starter

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<generate-strong-secret>
   OPENAI_API_KEY=<your-openai-key>
   CLIENT_URL=<your-frontend-url>
   ```

4. **Deploy**: Click "Create Web Service"

**Using Railway:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Add environment variables
railway variables set MONGODB_URI=<your-uri>
railway variables set JWT_SECRET=<secret>
railway variables set OPENAI_API_KEY=<key>

# Deploy
railway up
```

#### Frontend Deployment (Vercel)

**Using Vercel CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Using Vercel Dashboard:**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   REACT_APP_ENV=production
   ```
6. Click "Deploy"

#### Database Setup (MongoDB Atlas)

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free M0 cluster
   - Choose your preferred cloud provider and region

2. **Configure Network Access**:
   - Database Access → Add New Database User
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

3. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

4. **Configure Backend**:
   - Add connection string to backend environment variables

### Docker Deployment (Optional)

**Create Dockerfile for Backend:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./
EXPOSE 5000
CMD ["npm", "start"]
```

**Create Dockerfile for Frontend:**

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose:**

```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/portfolio-generator
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - mongo
  
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
  
  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

Run with:
```bash
docker-compose up -d
```

---

## Usage Instructions

### For End Users

#### 1. Create Account
- Navigate to the application
- Click "Sign Up"
- Enter name, email, and password
- Verify email (if enabled)

#### 2. Create Portfolio

**Step 1: Personal Information**
- Enter your full name
- Add a professional tagline (e.g., "Full-Stack Developer | AI Enthusiast")
- Upload a profile photo
- Provide contact details
- Write a brief bio (AI will enhance this)

**Step 2: Education**
- Add your educational background
- Include institution name, degree, field of study
- Specify dates
- Add brief descriptions (AI will make them professional)

**Step 3: Skills**
- Organize skills by category (Programming Languages, Frameworks, Tools, etc.)
- Add skill proficiency levels (1-100)
- Include years of experience

**Step 4: Projects**
- Add your best projects
- Provide title, description, and technologies used
- Include live URLs and GitHub repositories
- Upload project screenshots

**Step 5: Experience**
- Add work experience in chronological order
- Include company, position, dates, and location
- Describe responsibilities and achievements
- Mark if currently employed

**Step 6: Social Links**
- Add LinkedIn, GitHub, Twitter profiles
- Include personal website or blog

#### 3. Select Theme
- Preview available themes (Minimal, Creative, Corporate, Modern, Dark)
- Customize colors if desired
- Rearrange sections using drag-and-drop

#### 4. AI Enhancement
- Click "Enhance with AI" to refine content
- Review AI-generated improvements
- Accept or manually edit

#### 5. Preview & Export
- View live preview of your portfolio
- Make final adjustments
- Export as:
  - **HTML/CSS/JS**: Download ZIP file, upload to any hosting
  - **React Template**: Get complete React project
  - **PDF Resume**: Download professional PDF

#### 6. Publish & Share
- Get shareable link (e.g., `portfolio-gen.com/yourname`)
- Share on social media
- Update anytime from dashboard

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Portfolio Endpoints

#### Create Portfolio
```http
POST /api/portfolios
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Portfolio",
  "personalInfo": { ... },
  "education": [ ... ],
  "skills": [ ... ],
  "projects": [ ... ],
  "experience": [ ... ]
}

Response: 201 Created
{
  "success": true,
  "portfolio": { ... }
}
```

#### Get User Portfolios
```http
GET /api/portfolios
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "count": 3,
  "portfolios": [ ... ]
}
```

#### Update Portfolio
```http
PUT /api/portfolios/:id
Authorization: Bearer <token>
Content-Type: application/json

Response: 200 OK
{
  "success": true,
  "portfolio": { ... }
}
```

### AI Enhancement Endpoints

#### Enhance Content
```http
POST /api/ai/enhance
Authorization: Bearer <token>
Content-Type: application/json

{
  "section": "bio",
  "content": "I am a developer who likes coding",
  "context": {
    "careerLevel": "mid",
    "industry": "software"
  }
}

Response: 200 OK
{
  "success": true,
  "enhanced": "Experienced software engineer with a passion for building scalable applications..."
}
```

### Export Endpoints

#### Export HTML
```http
POST /api/export/html
Authorization: Bearer <token>
Content-Type: application/json

{
  "portfolioId": "portfolio_id",
  "theme": "minimal"
}

Response: 200 OK
Content-Type: application/zip
[ZIP file download]
```

---

## Project Structure

```
feb 10-2/
├── README.md
├── DOCUMENTATION.md
├── ACADEMIC_REPORT.md
├── PRESENTATION.md
├── package.json
├── .gitignore
│
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── server.js
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── config.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Portfolio.js
│   │   └── Template.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── portfolioController.js
│   │   ├── aiController.js
│   │   └── exportController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── portfolioRoutes.js
│   │   ├── aiRoutes.js
│   │   └── exportRoutes.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   ├── exportService.js
│   │   └── emailService.js
│   │
│   └── utils/
│       ├── promptTemplates.js
│       ├── validators.js
│       └── helpers.js
│
├── frontend/
│   ├── package.json
│   ├── .env.example
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── index.css
│       │
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── Button.jsx
│       │   │   ├── Input.jsx
│       │   │   └── Modal.jsx
│       │   │
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   └── PrivateRoute.jsx
│       │   │
│       │   ├── portfolio/
│       │   │   ├── PortfolioWizard.jsx
│       │   │   ├── PersonalInfoStep.jsx
│       │   │   ├── EducationStep.jsx
│       │   │   ├── SkillsStep.jsx
│       │   │   ├── ProjectsStep.jsx
│       │   │   ├── ExperienceStep.jsx
│       │   │   └── ReviewStep.jsx
│       │   │
│       │   ├── themes/
│       │   │   ├── ThemeSelector.jsx
│       │   │   ├── MinimalTheme.jsx
│       │   │   ├── CreativeTheme.jsx
│       │   │   ├── CorporateTheme.jsx
│       │   │   └── DarkTheme.jsx
│       │   │
│       │   └── preview/
│       │       ├── LivePreview.jsx
│       │       └── PreviewControls.jsx
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Dashboard.jsx
│       │   ├── CreatePortfolio.jsx
│       │   ├── EditPortfolio.jsx
│       │   └── NotFound.jsx
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── PortfolioContext.jsx
│       │
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── portfolioService.js
│       │   └── exportService.js
│       │
│       └── utils/
│           ├── validators.js
│           ├── formatters.js
│           └── constants.js
│
└── docs/
    ├── ARCHITECTURE.md
    ├── AI_SYSTEM.md
    ├── DEPLOYMENT.md
    └── USER_GUIDE.md
```

---

## Academic Documentation

This project includes comprehensive academic documentation:

1. **ACADEMIC_REPORT.md** - Complete academic project report covering:
   - Problem Understanding & Critical Analysis
   - AI Architecture & Logic
   - Technical Architecture
   - UI/UX Design Principles
   - Performance Analysis
   - Testing & Validation

2. **DOCUMENTATION.md** - Technical documentation including:
   - Detailed system architecture
   - AI prompt engineering strategies
   - API specifications
   - Database design

3. **PRESENTATION.md** - Presentation materials for viva/defense:
   - 12-slide presentation content
   - Demo script
   - Key talking points
   - Innovation highlights

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact & Support

For questions, issues, or contributions:

- **Email**: support@portfolio-generator.com
- **GitHub Issues**: [Submit an issue](https://github.com/yourusername/portfolio-generator/issues)
- **Documentation**: [Full Documentation](./DOCUMENTATION.md)

---

## Acknowledgments

- OpenAI for GPT-4 API
- MongoDB team for excellent database solution
- React and Node.js communities
- All contributors and testers

---

**Built with ❤️ for students and professionals worldwide**

*Last Updated: February 10, 2026*
