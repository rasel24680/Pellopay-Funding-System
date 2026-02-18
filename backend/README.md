# Pellopay Backend API

Node.js + Express + MySQL backend for the Pellopay funding platform.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
```

### 3. Setup Database

```bash
# Login to MySQL and run the schema
mysql -u root -p < database/schema.sql
```

### 4. Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will be available at `http://localhost:3000`

---

## API Endpoints

### Authentication

| Method | Endpoint                    | Description                      |
| ------ | --------------------------- | -------------------------------- |
| POST   | `/api/auth/register`        | Register new user                |
| POST   | `/api/auth/login`           | Login user                       |
| GET    | `/api/auth/me`              | Get current user (auth required) |
| POST   | `/api/auth/forgot-password` | Request password reset           |
| POST   | `/api/auth/logout`          | Logout user                      |

### Funding Applications

| Method | Endpoint                       | Description                              |
| ------ | ------------------------------ | ---------------------------------------- |
| POST   | `/api/funding/submit`          | Submit new application (auth required)   |
| GET    | `/api/funding/my-applications` | Get user's applications (auth required)  |
| GET    | `/api/funding/application/:id` | Get specific application (auth required) |
| PUT    | `/api/funding/application/:id` | Update application (auth required)       |
| DELETE | `/api/funding/application/:id` | Delete application (auth required)       |

### Contact

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| POST   | `/api/contact/submit`    | Submit contact form       |
| GET    | `/api/contact/inquiries` | Get all inquiries (admin) |

### Health Check

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| GET    | `/api/health` | Server health status |

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Example Requests

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "companyName": "Acme Ltd"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Submit Funding Application

```bash
curl -X POST http://localhost:3000/api/funding/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "fundingAmount": 50000,
    "fundingPurpose": "Growth",
    "importance": "Fast approval",
    "annualTurnover": 250000,
    "tradingYears": "Yes",
    "homeowner": "Yes"
  }'
```

---

## Deployment on Hostinger VPS

### 1. SSH into your VPS

```bash
ssh root@your-vps-ip
```

### 2. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3. Install MySQL

```bash
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 4. Clone/Upload your project

```bash
cd /var/www
git clone your-repo-url pellopay
cd pellopay/backend
```

### 5. Configure environment

```bash
cp .env.example .env
nano .env  # Edit with production values
```

### 6. Setup database

```bash
mysql -u root -p < database/schema.sql
```

### 7. Install PM2 and start

```bash
npm install -g pm2
npm install
pm2 start server.js --name pellopay
pm2 startup
pm2 save
```

### 8. Setup Nginx (optional but recommended)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## License

ISC
