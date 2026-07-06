# ZymGo — Gym Management CRM

ZymGo is a full-stack gym management and CRM platform built to simplify day-to-day gym operations. It supports role-based access for Super Admins, Gym Owners, Staff, and Members, with modules for gym onboarding, memberships, subscriptions, attendance, payments, analytics, and audit logs.

## Features

### Role-Based Access Control

* Super Admin, Gym Owner, Staff, and Member roles
* JWT-based authentication and protected APIs
* Role-specific dashboard access
* Permission-based module visibility

### Gym Management

* Gym onboarding and approval workflow
* Gym profile and business information management
* Gym subscription purchase and renewal
* Gym status management

### Member Management

* Add, edit, view, and manage gym members
* Membership status tracking
* Member search and filtering
* Member profile management

### Subscription Plans

* Create and manage subscription plans
* Plan duration, pricing, and feature configuration
* Gym subscription history
* Active, expired, and pending subscription tracking

### Attendance Management

* Record member attendance
* Track daily attendance activity
* Attendance analytics for gym operations

### Payment Management

* Record membership payments
* Track pending and completed payments
* Payment history and transaction records
* Revenue-related dashboard metrics

### Dashboard Analytics

* Total gyms and members
* Active subscriptions
* Monthly revenue
* Attendance statistics
* Pending payments
* Recent activity logs

### Admin Features

* Gym approval and rejection workflow
* User and role management
* Subscription audit records
* Activity and audit trail management
* CMS and banner management support

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* JSON Web Token (JWT)
* bcrypt
* Multer
* dotenv

### Database

* MySQL

## Project Structure

```text
ZymGo/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/satwik12dev/ZymGo.git
cd ZymGo
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=zymgo

JWT_SECRET=your_secure_jwt_secret

FRONTEND_URL=http://localhost:5173
```

## Database Setup

1. Create a MySQL database named `zymgo`.
2. Import the project SQL schema file if available.
3. Update the database values in `backend/.env`.
4. Start the backend server.

```sql
CREATE DATABASE zymgo;
```

## Run the Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

By default:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

## Core Modules

| Module             | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| Authentication     | Login, signup, JWT authentication, and protected routes          |
| Gym Management     | Gym registration, approval, profile, and subscription management |
| Members            | Member onboarding, profiles, memberships, and status tracking    |
| Staff              | Staff management and role-based access                           |
| Subscription Plans | Plan creation, pricing, duration, and feature management         |
| Payments           | Payment records, pending payments, and transaction history       |
| Attendance         | Daily member attendance tracking                                 |
| Analytics          | Revenue, memberships, attendance, and dashboard metrics          |
| Audit Trail        | Admin activity and subscription audit logs                       |
| CMS                | Banner and content management support                            |

## Example API Endpoints

### Authentication

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/auth/register` | Register a new user            |
| POST   | `/auth/login`    | Log in and receive a JWT token |
| GET    | `/auth/profile`  | Get logged-in user profile     |

### Gym Management

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | `/gym/create`      | Create a gym       |
| GET    | `/gym/list`        | Get gym list       |
| GET    | `/gym/:id`         | Get gym details    |
| PATCH  | `/gym/:id`         | Update gym details |
| PATCH  | `/gym/approve/:id` | Approve a gym      |

### Subscription Plans

| Method | Endpoint                 | Description                 |
| ------ | ------------------------ | --------------------------- |
| GET    | `/subscription/plans`    | Get all subscription plans  |
| POST   | `/subscription/add-plan` | Create a subscription plan  |
| POST   | `/subscription/buy`      | Purchase a gym subscription |
| GET    | `/subscription/history`  | Get subscription history    |

### Members and Attendance

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/members`             | Get all members          |
| POST   | `/members`             | Add a member             |
| PATCH  | `/members/:id`         | Update member details    |
| POST   | `/attendance/check-in` | Record member attendance |
| GET    | `/attendance`          | Get attendance records   |

## Screenshots

Create a `screenshots` folder in the root directory and add application screenshots.

```text
screenshots/
├── login.png
├── admin-dashboard.png
├── gym-management.png
├── member-management.png
├── subscription-plans.png
└── analytics.png
```

Then add them to this README:

```md
![Admin Dashboard](./screenshots/admin-dashboard.png)
![Gym Management](./screenshots/gym-management.png)
```

## Future Improvements

* QR-based attendance check-in
* Automated membership renewal reminders
* Payment gateway integration
* Advanced analytics and downloadable reports
* SMS and email notifications
* Multi-branch gym support
* Mobile application for members
* Trainer workout-plan management
* Diet-plan and progress tracking

## Contributing

Contributions are welcome.

```bash
git checkout -b feature/your-feature-name
git commit -m "Add your feature"
git push origin feature/your-feature-name
```

Create a pull request after pushing your branch.

## Author

**Satwik Saxena**

* GitHub: https://github.com/satwik12dev
* Portfolio: https://satwik-12-dev.vercel.app/

## License

This project is available for learning and portfolio purposes.
