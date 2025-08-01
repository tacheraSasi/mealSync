# ![IPF Software Logo](https://ipfsoftware.com/assets/images/logo.svg)SmartMeal 🍽️

**Weekly Employee Food Selection System**

---

## Description

SmartMeal by **IPF Software** automates weekly meal planning in workplaces. Employees select meals in advance, receive reminders via email and SMS, and admins manage menus and generate catering reports.

This solution eliminates manual spreadsheets, reduces food wastage, and streamlines meal ordering.

---

## Problem

- Manual meal tracking via emails/spreadsheets causes delays and mistakes.
- Employees forget to submit meal choices without reminders.
- Caterers receive inaccurate counts, leading to waste.
- Admins spend hours consolidating orders.

---

## Features

- 🔒 Role-Based Authentication with JWT (Admin & Employee)
- 🗂️ Menu Management by Admins
- 🍽️ Employee Meal Selection per day/week
- ⏳ Deadline Locking for submissions
- 📧 Email Notifications (menu alerts, confirmations, reminders)
- 📱 SMS Notifications (submission reminders, confirmations)
- 📊 Catering Reports export
- 🌐 Responsive UI with React & TailwindCSS

---

## Tech Stack

- Frontend: React.js, TailwindCSS
- Backend: Express.js (Node.js)
- Database: PostgreSQL
- Authentication: JWT
- Notifications: Email & SMS APIs (e.g., SendGrid, Twilio)

---

## Getting Started

### Prerequisites

- Node.js >=16
- PostgreSQL running locally or cloud
- pnpm or npm package manager

### Setup

1. Clone repo:
   ```bash
   git clone https://github.com/yourusername/ipf-smartmeal.git
   cd ipf-smartmeal
2. Instal dependencies
   ```bash
   cd frontend
   pnpm install

   cd server
   pnpm install
3. For backend to work use .env.example to create your .env file
4.start your project
   ```bash
   cd server
   docker compose up
   pnpm dev

   cd frontend
   pnpm dev
5. Server & frontend should be running on
   ```bash
   https://localhost:5000
   https://localhost:5173
   ```
   respectively
