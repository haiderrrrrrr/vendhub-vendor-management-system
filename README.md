# Vendhub Vendor Management System

A Node.js, Express, and MySQL vendor management platform for managing vendors, contracts, budgets, purchase orders, compliance checks, role-based users, performance ratings, PDF reports, contact messages, and an AI chatbot from one web dashboard.

## Live Demo

[Open Vendhub Vendor Management System](https://vendhub-vendor-management-system.vercel.app)

## Features

- Role-based login and dashboard routing with JWT authentication.
- Admin panel for users, vendors, budgets, purchase orders, contracts, compliance checks, and reports.
- Vendor lifecycle management with registration, updates, deletion, compliance certifications, and vendor reports.
- Contract management with creation, updates, contract lookup, expiry checks, and PDF report generation.
- Budget and department management with budget creation, updates, budget reports, and department budget alerts.
- Purchase order workflow with department/vendor selection, status tracking, and generated purchase-order reports.
- Vendor performance rating and historical performance report generation.
- Separate dashboard flows for Admin, Budget Manager, Finance Team, Department Heads, Procurement Team, Vendor Management Team, Contract Management Team, Procurement Manager, and Vendor Panel.
- Contact form email delivery through Nodemailer.
- Gemini-powered chatbot proxy that keeps the API key server-side.
- Static HTML, CSS, and vanilla JavaScript frontend served by Express.

## Tech Stack

| Part | Tech |
| --- | --- |
| Runtime | Node.js |
| Backend | Express |
| Database | MySQL |
| Driver | mysql2 |
| Auth | JSON Web Tokens, bcryptjs |
| Validation | express-validator, validator |
| Email | Nodemailer |
| AI Chatbot | Gemini API through server-side proxy |
| Reports | PDFKit, jsPDF, jsPDF AutoTable, pdf-lib |
| Frontend | HTML, CSS, Vanilla JavaScript |

## Screenshots

### Welcome Page

![Vendhub welcome page](<public/assets/Welcome Page.jpg>)

### Chatbot Interface

![Vendhub chatbot background](<public/assets/chatbot bg.webp>)

### Document Template

![Vendhub document template](public/assets/templateDoc.png)

### Token Expiration

![Vendhub token expiration state](<public/assets/Token Expiration.png>)

## Project Structure

```text
.
|-- config/                 # MySQL connection configuration
|-- controllers/            # Request handlers and business logic
|-- middleware/             # JWT authentication middleware
|-- routes/                 # Express route modules
|-- public/
|   |-- assets/             # Images and UI assets
|   |-- css/                # Page and dashboard styles
|   |-- html/               # Role-based dashboard pages
|   `-- js/                 # Frontend API and page scripts
|-- createAdmin.js          # Helper script for creating the default admin user
|-- server.js               # Express app entrypoint
|-- package.json            # Scripts and dependencies
|-- .env.sample             # Environment variable template
`-- README.md
```

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=vendhub_system
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
JWT_SECRET=replace-with-a-long-random-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
GEMINI_API_KEY=your-gemini-api-key
```

Required:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

Optional:

- `PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `GEMINI_API_KEY`

## Run Locally

Install dependencies:

```bash
npm install
```

Create `.env` from the sample:

```bash
cp .env.sample .env
```

Start the server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## MySQL Database

The backend expects a MySQL database with the project tables, relationships, and stored procedures used by the vendor, contract, purchase-order, budget, user, role, compliance, and performance modules.

The schema script is included in:

```text
Mysql Database Creation Script/Vendhub System DDL Scripts.sql
```

Run the script before starting the server. You can use either a local MySQL server or Aiven for MySQL.

Local MySQL option:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=vendhub_system
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
```

Hosted Aiven MySQL option:


```env
DB_HOST=<aiven-mysql-host>
DB_PORT=<aiven-mysql-port>
DB_USER=avnadmin
DB_PASSWORD=<aiven-password>
DB_NAME=vendhub_system
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

Use one of these configurations in `.env`, then start the Node server normally.

## Authentication Workflow

1. Register or create a user through `/api/signup` or the user creation dashboard.
2. Log in through `/api/login`.
3. Store the returned JWT token in the browser.
4. Use protected `/api/*` routes with:

```text
Authorization: Bearer <token>
```

The app rate-limits login attempts and protects all `/api` routes except signup and login.

## Default Admin Helper

The repo includes `createAdmin.js` for creating a default admin account against a running local server.

```bash
node createAdmin.js
```

Default helper credentials:

```text
Email: admin@gmail.com
Password: Admin123!
Role: Admin
```

Change these values before using the helper in any public or hosted environment.

## API Modules

| Module | Routes |
| --- | --- |
| Authentication | `/api/signup`, `/api/login`, `/api/profile`, `/api/verify-token` |
| Users and Roles | `/api/users`, `/api/roles`, `/api/generate-report` |
| Vendors | `/api/vendor/register`, `/api/vendors`, `/api/vendor/:vendorId`, `/api/update-vendor` |
| Contracts | `/api/contracts`, `/api/contracts/:contractId`, `/api/contracts/update`, `/api/expiring-contracts` |
| Budgets | `/api/budget/create-budget`, `/api/departments`, `/api/budget-report/:departmentId`, `/api/budget/update` |
| Purchase Orders | `/api/purchase-order`, `/api/get-purchase-orders`, `/api/generate-purchase-orders-report` |
| Compliance | `/api/check-compliance/:vendorId` |
| Performance Ratings | `/api/performance-evaluation/submit`, `/api/performance/:vendorId`, `/api/generate-performance-report/:vendorId` |
| Contact Form | `/send-contact-form` |
| Chatbot | `/api/chatbot/message` |

## Aiven MySQL Setup

Create a free Aiven for MySQL service, create/import the `vendhub_system` database, and use the Aiven host, port, user, password, and database name in `.env`.

```text
DB_HOST=<aiven-mysql-host>
DB_PORT=<aiven-mysql-port>
DB_USER=avnadmin
DB_PASSWORD=<aiven-password>
DB_NAME=vendhub_system
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

After the database is ready, run the app normally with `npm start` or `npm run dev`.

## Vercel Deployment

Deploy the repository as a Node.js project on Vercel and set the same environment variables from `.env.sample` in the Vercel project settings.

```text
Build command: npm install
Start command: npm start
```

For deployment, use Aiven MySQL instead of a local database because Vercel cannot connect to a MySQL server running only on your computer.

## Scripts

Start production server:

```bash
npm start
```

Start development server:

```bash
npm run dev
```
