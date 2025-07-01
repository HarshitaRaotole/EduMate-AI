# EduMateAI - Your AI-Powered Study Companion

A full-stack web application built with React + Vite frontend and Node.js + Express backend, designed to help students organize their subjects, track assignments, and stay on top of their academic goals.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with password hashing
- **Subject Management**: Create, organize, and color-code academic subjects
- **Assignment Tracking**: Full CRUD operations with priority levels and status tracking
- **Dashboard Analytics**: Real-time statistics and progress visualization with Chart.js
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Email Reminders**: NodeMailer integration for assignment deadline notifications

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **React Router** for navigation
- **Axios** for API communication
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express framework
- **MySQL** database with proper relationships
- **JWT** for authentication
- **bcryptjs** for password hashing
- **NodeMailer** for email services
- **Helmet** and **CORS** for security

## 📁 Project Structure

\`\`\`
edumate-ai/
├── package.json                 # Root package.json for monorepo
├── vercel.json                 # Vercel deployment configuration
├── README.md                   # Project documentation
├── database/
│   └── setup.sql              # Database schema and sample data
├── backend/                   # Node.js + Express API
│   ├── package.json
│   ├── server.js             # Main server file
│   ├── config/
│   │   └── database.js       # Database connection
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── subjects.js
│   │   ├── assignments.js
│   │   └── dashboard.js
│   └── utils/
│       └── emailService.js   # Email functionality
└── frontend/                 # React + Vite application
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── contexts/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── LoadingSpinner.jsx
        │   └── DashboardLayout.jsx
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── Dashboard.jsx
        │   ├── Subjects.jsx
        │   └── Assignments.jsx
        └── utils/
            └── api.js
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd edumate-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm run install:all
   \`\`\`

3. **Set up the database**
   - Create a MySQL database
   - Run the SQL script in `database/setup.sql`

4. **Configure environment variables**
   
   **Backend** (`backend/.env`):
   \`\`\`env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   
   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=edumate_ai
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   
   # Email (optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   \`\`\`

   **Frontend** (`frontend/.env`):
   \`\`\`env
   VITE_API_URL=http://localhost:5000/api
   \`\`\`

5. **Start development servers**
   \`\`\`bash
   npm run dev
   \`\`\`
   
   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 🌐 Deployment on Vercel

This project is optimized for Vercel deployment with the included `vercel.json` configuration.

### Deploy Steps:

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Set Environment Variables**
   In your Vercel dashboard, add these environment variables:
   \`\`\`
   NODE_ENV=production
   DB_HOST=your-production-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=edumate_ai
   JWT_SECRET=your-production-jwt-secret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   \`\`\`

4. **Deploy**
   - Click "Deploy" in Vercel
   - Your app will be live at `https://your-app-name.vercel.app`

### Database Setup for Production

For production, consider using:
- **PlanetScale** (MySQL-compatible)
- **Railway** (PostgreSQL/MySQL)
- **Supabase** (PostgreSQL)
- **AWS RDS** or **Google Cloud SQL**

## 📱 Features Overview

### Authentication
- Secure user registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes and auto-logout

### Dashboard
- Real-time statistics (subjects, assignments, completion rates)
- Interactive charts showing assignment status
- Recent assignments overview
- Quick action buttons

### Subject Management
- Create and organize subjects
- Color-coded categorization
- Delete subjects (with cascade delete for assignments)

### Assignment Tracking
- Create, edit, and delete assignments
- Priority levels (Low, Medium, High)
- Status tracking (Pending, In Progress, Submitted)
- Deadline management with overdue indicators
- Subject association

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Subjects
- `GET /api/subjects` - Get user's subjects
- `POST /api/subjects` - Create new subject
- `DELETE /api/subjects/:id` - Delete subject

### Assignments
- `GET /api/assignments` - Get user's assignments
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive design with smooth animations
- **Dark/Light Theme**: Consistent color scheme throughout
- **Interactive Charts**: Visual progress tracking with Chart.js
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Smooth loading indicators and skeleton screens

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation and sanitization
- SQL injection prevention
- XSS protection with Helmet

## 📧 Email Integration

The application includes email reminder functionality using NodeMailer:
- Assignment deadline reminders
- HTML email templates
- SMTP configuration for various providers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for better student organization tools
- Thanks to the open-source community for the amazing libraries used

---

**EduMateAI** - Empowering students to achieve their academic goals through intelligent organization and tracking.
