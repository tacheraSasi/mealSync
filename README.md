# MealSync

> **Automated Weekly Meal Planning for Teams**

MealSync is a simple, automated solution to replace manual Google Sheets meal planning. It lets employees select meals for the upcoming week and automatically syncs the data with Google Sheets while sending automated Friday reminders.

---

## **Features**

* **Employee Meal Selection**

  * Pick meals for each day of the next week (e.g., Monday–Friday).
  * Auto-fills previous week’s choices for quick submission.

* **Automated Reminders**

  * Sends Slack/Email notifications every Friday morning to prompt meal selection.
  * Auto-locks entries Friday evening.

* **Admin Dashboard**

  * Summarize total counts (vegetarian, vegan, non-veg).
  * Export to CSV or sync directly to Google Sheets.

* **Integrations**

  * Google Sheets API for compatibility with existing workflows.
  * Slack or Microsoft Teams bot for quick inline meal selection.

---

## **Tech Stack**

* **Frontend:** Next.js (React)
* **Backend:** Node.js (NestJS)
* **Database:** PostgreSQL
* **Authentication:** Google OAuth (SSO)
* **Integrations:**

  * Google Sheets API
  * Slack API
* **Deployment:** Vercel (frontend) + Railway/Render (backend)

---

## **Architecture**

```
User → Web App → Backend API → Database → Google Sheets
                             ↘ Slack/Email Reminder Service
```

---

## **How It Works**

1. **Monday–Thursday:** No action required.
2. **Friday Morning:** Automated Slack/Email reminder.
3. **Friday Evening:** System locks form submissions, generates next week’s final meal plan, and syncs data to Google Sheets.
4. **Monday Morning:** Kitchen/Admin team accesses a clean meal summary.

---

## **Getting Started**

### **Prerequisites**

* Node.js >= 18
* PostgreSQL database
* Google Cloud project with Sheets API enabled
* Slack app (if Slack reminders are used)

### **Installation**

```bash
git clone https://github.com/your-org/mealsync.git
cd mealsync
npm install
```



## **Roadmap**

* [ ] Add mobile app support
* [ ] Advanced analytics (cost tracking)
* [ ] Machine learning for predictive meal suggestions

---