# 🍽️ SmartMeal by IPF Software

## 🏷️ Solution Name
**iPF Meal Sync: Weekly Employee Food Selection System**
*(Developed by IPF Software)*

---

## 📝 Description
SmartMeal is a **full-stack web application** by **IPF Software** that automates weekly meal planning in workplaces. It enables employees to select their meals in advance, sends **email and SMS reminders**, and provides administrators with tools to manage menus, enforce deadlines, and generate accurate catering reports.

By replacing manual spreadsheets and emails, SmartMeal reduces errors, confusion, and food wastage while improving workplace efficiency.

---

## ❓ Problem It Solves
Many organizations struggle with **manual and inefficient meal tracking**, leading to:
- Meal orders handled via **emails/spreadsheets**, causing delays and mistakes.
- Employees forgetting to submit choices without reminders.
- Caterers receiving **inaccurate counts**, resulting in waste.
- Admins spending hours consolidating requests.

✅ **SmartMeal solves this by:**
- Automating meal selection submissions.
- Sending **email & SMS notifications** for reminders and confirmations.
- Enforcing weekly cutoff times for submissions.
- Providing admins with **accurate, exportable meal reports**.

---

## 🚀 Key Features
- 🔒 **Role-Based Authentication (JWT):** Admin & Employee dashboards.
- 🗂️ **Menu Management:** Admins create and publish weekly menus.
- 🍽️ **Employee Meal Selection:** Daily meal choices (lunch/dinner) per week.
- ⏳ **Deadline Locking:** Automatic closure of selections after cutoff.
- 📧 **Email Notifications:**
  - Menu published alerts.
  - Meal confirmation emails.
  - Deadline reminders.
- 📱 **SMS Notifications:**
  - Submission reminders via SMS.
  - Confirmation SMS for successful meal selections.
- 📊 **Catering Reports:** Admin exports meal counts for caterers.
- 🌐 **Responsive UI:** Mobile & desktop friendly.

---

## 🔄 System Workflow Diagram
```mermaid
flowchart TD
    A[Admin Login] --> B[Create Weekly Menu]
    B --> C[Store Menu in DB]
    C --> D[Send Email & SMS: Menu Published]
    D --> E[Employee Login]
    E --> F[View Weekly Menu]
    F --> G[Select Meals Mon-Fri]
    G --> H[Submit Selections]
    H --> I[Send Email & SMS: Confirmation]
    I --> J[Selections Saved in DB]
    J --> K[Check Deadline]
    K -- Deadline Reached --> L[Lock Selection Access]
    L --> M[Admin Generates Report]
    M --> N[Send Email: Report Ready]
    N --> O[Catering Team Prepares Meals]
