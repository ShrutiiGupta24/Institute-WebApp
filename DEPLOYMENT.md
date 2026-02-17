# 🚀 Deployment Guide - Institute Management System

## Quick Start Options

### Option 1: Windows (Easy Start)
```bash
# Simply double-click this file:
START-APPLICATION.bat
```
This will automatically:
- Setup backend and frontend
- Install all dependencies
- Start both servers
- Open browser to http://localhost:3000

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd coaching
npm install
npm start
```

### Option 3: Docker (Recommended for Production)
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🌐 Production Deployment

### 1. Deploy Backend (FastAPI)

#### Option A: Heroku
```bash
cd backend
heroku login
heroku create your-institute-api
heroku addons:create heroku-postgresql:mini
git push heroku main
```

#### Option B: Railway.app
1. Visit https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `backend` folder
4. Add environment variables from `.env`
5. Railway auto-detects FastAPI and deploys

#### Option C: AWS EC2
```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install python3-pip nginx

# Clone repo
git clone your-repo-url
cd backend

# Install Python packages
pip3 install -r requirements.txt

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Option D: DigitalOcean App Platform
1. Connect GitHub repository
2. Select `backend` folder
3. Detects Python/FastAPI automatically
4. Add environment variables
5. Deploy

### 2. Deploy Frontend (React)

#### Option A: Netlify (Easiest)
```bash
cd coaching
npm run build

# Upload build/ folder to Netlify
# OR connect GitHub repo
# Build command: npm run build
# Publish directory: build
```

#### Option B: Vercel
```bash
cd coaching
npm install -g vercel
vercel login
vercel --prod
```

#### Option C: AWS S3 + CloudFront
```bash
# Build production
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --acl public-read

# Setup CloudFront distribution pointing to S3
```

#### Option D: Nginx (VPS/EC2)
```bash
# Build
npm run build

# Copy to web server
scp -r build/* user@server:/var/www/html/

# Nginx config
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔧 Production Configuration

### Backend Environment Variables

Create `.env` in production:
```env
# REQUIRED
SECRET_KEY=generate-a-strong-secret-key-here
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ALLOWED_ORIGINS=https://your-frontend-domain.com

# Security
DEBUG=False
ENVIRONMENT=production

# Optional services
RAZORPAY_KEY_ID=your_key
SMTP_USER=your@email.com
SMTP_PASSWORD=your_password
```

### Frontend Environment Variables

Update `src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-domain.com/api';
```

Or create `.env.production`:
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

---

## 🗄️ Database Setup

### PostgreSQL (Recommended for Production)

**1. Local PostgreSQL:**
```bash
# Install PostgreSQL
# Windows: Download from postgresql.org
# Linux: sudo apt install postgresql

# Create database
createdb institute_db

# Update .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/institute_db
```

**2. Cloud PostgreSQL:**

**Heroku Postgres:**
```bash
heroku addons:create heroku-postgresql:mini
# DATABASE_URL auto-set
```

**AWS RDS:**
1. Create RDS PostgreSQL instance
2. Note endpoint, username, password
3. Update DATABASE_URL

**DigitalOcean Managed Database:**
1. Create Managed PostgreSQL
2. Get connection string
3. Update DATABASE_URL

---

## 📦 Complete Deployment Checklist

### Pre-Deployment
- [ ] Test application locally
- [ ] Update all environment variables
- [ ] Change default admin password
- [ ] Set strong SECRET_KEY
- [ ] Switch to production database (PostgreSQL)
- [ ] Set DEBUG=False
- [ ] Update ALLOWED_ORIGINS with production URLs
- [ ] Test all API endpoints
- [ ] Test user flows (login, CRUD operations)

### Backend Deployment
- [ ] Deploy backend to hosting platform
- [ ] Setup database (PostgreSQL)
- [ ] Configure environment variables
- [ ] Test API endpoints (/health, /docs)
- [ ] Setup SSL certificate (HTTPS)
- [ ] Configure domain/subdomain
- [ ] Test CORS with frontend domain

### Frontend Deployment
- [ ] Update API URL in frontend
- [ ] Build production bundle
- [ ] Deploy to hosting platform
- [ ] Configure domain
- [ ] Setup SSL certificate
- [ ] Test all pages and features
- [ ] Verify API integration

### Post-Deployment
- [ ] Test complete user flows
- [ ] Verify all roles (Admin, Teacher, Student)
- [ ] Test on different devices/browsers
- [ ] Setup monitoring/logging
- [ ] Configure backups
- [ ] Setup error tracking (Sentry)
- [ ] Performance testing
- [ ] Security audit

---

## 🌍 Custom Domain Setup

### Frontend (Netlify example)
1. Add custom domain in Netlify settings
2. Update DNS records:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```
3. Enable HTTPS (automatic)

### Backend (Custom server)
1. Point subdomain to server IP:
   ```
   Type: A
   Name: api
   Value: your-server-ip
   ```
2. Setup SSL with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d api.yourdomain.com
   ```

---

## 📊 Monitoring & Maintenance

### Application Monitoring
- **Backend**: Use FastAPI's /health endpoint
- **Frontend**: Implement uptime monitoring
- **Database**: Monitor connection pool, query performance

### Logging
```python
# Backend logs
import logging
logging.basicConfig(level=logging.INFO)
```

### Backups
```bash
# Database backup (PostgreSQL)
pg_dump -U user dbname > backup_$(date +%Y%m%d).sql

# Automated backup (cron)
0 2 * * * pg_dump -U user dbname > /backups/db_$(date +\%Y\%m\%d).sql
```

### Updates
```bash
# Update dependencies
pip install --upgrade -r requirements.txt  # Backend
npm update  # Frontend

# Database migrations
alembic upgrade head
```

---

## 🆘 Troubleshooting

### Backend Issues

**CORS Errors:**
```python
# Add frontend URL to ALLOWED_ORIGINS in .env
ALLOWED_ORIGINS=https://your-frontend.com,https://www.your-frontend.com
```

**Database Connection:**
```bash
# Test connection
python -c "from app.database import engine; print(engine.connect())"
```

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux
lsof -ti:8000 | xargs kill
```

### Frontend Issues

**Build Fails:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API Connection:**
- Verify API URL in api.js
- Check CORS settings
- Ensure backend is accessible

---

## 🔐 Security Best Practices

1. **Never commit .env files** to version control
2. **Use strong SECRET_KEY** (32+ characters, random)
3. **Enable HTTPS** in production
4. **Regular security updates** for dependencies
5. **Implement rate limiting** on API endpoints
6. **Sanitize user inputs** (already done with Pydantic)
7. **Regular database backups**
8. **Monitor for suspicious activity**

---

## 📱 Mobile Responsiveness

The application is already mobile-responsive with:
- Responsive grid layouts
- Flexible containers
- Mobile-friendly navigation
- Touch-optimized buttons

Test on:
- Mobile devices (iOS/Android)
- Tablets
- Different screen sizes
- Different browsers

---

## 🎉 Success!

Your Institute Management System is now live!

**URLs:**
- Frontend: https://your-domain.com
- API: https://api.your-domain.com
- API Docs: https://api.your-domain.com/docs

---

For support or questions, refer to the main README.md
