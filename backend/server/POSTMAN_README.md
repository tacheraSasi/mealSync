# MealSync API Postman Collection

This directory contains the complete Postman collection and environment for testing the MealSync API backend.

## Files

- `MealSync_API_Collection.postman_collection.json` - Complete API collection with all endpoints
- `MealSync_Development.postman_environment.json` - Development environment variables

## Setup Instructions

### 1. Import Collection and Environment

1. Open Postman
2. Click **Import** in the top left
3. Import both JSON files:
   - `MealSync_API_Collection.postman_collection.json`
   - `MealSync_Development.postman_environment.json`
4. Select the "MealSync Development" environment in the top right

### 2. Start the Server

Make sure the MealSync server is running:

```bash
cd server
npm run dev
```

The server should be running on `http://localhost:3001`

## API Endpoints Overview

### 🔐 Authentication
- `POST /user/login` - User login
- `POST /user/register` - User registration

### 👥 Users
- `GET /user` - Get all users
- `GET /user/{id}` - Get user by ID

### 🍽️ Menu Management
- `GET /menu` - Get all menus
- `POST /menu/add` - Add new menu item
- `PUT /menu/{id}` - Update menu item
- `POST /menu/generate-weekly` - Generate weekly menu (Admin only)

### 🥪 Lunch Choices
- `GET /lunchChoice/user/{userId}` - Get user's lunch choices
- `POST /lunchChoice/user/{userId}/select` - Select meal for user
- `GET /lunchChoice/{choiceId}` - Get specific meal selection
- `PUT /lunchChoice/{choiceId}` - Update meal selection
- `DELETE /lunchChoice/{choiceId}/user/{userId}` - Delete meal selection
- `GET /lunchChoice/export` - **Export weekly meal plan to Excel** 📊

### 🧩 Meal Templates
- `GET /mealTemplate` - Get all meal templates
- `GET /mealTemplate/category/{category}` - Get templates by category
- `GET /mealTemplate/{id}` - Get template by ID
- `POST /mealTemplate` - Create meal template
- `PUT /mealTemplate/{id}` - Update meal template
- `DELETE /mealTemplate/{id}` - Delete meal template

### 📅 Weekly Meal Planning
- `GET /weeklyMealPlan/info` - Get planning info (Friday check)
- `GET /weeklyMealPlan` - Get all weekly plans (Admin)
- `GET /weeklyMealPlan/summary` - Get weekly summary
- `GET /weeklyMealPlan/user/{userId}` - Get user's weekly plan
- `POST /weeklyMealPlan` - Create weekly selection (Friday only)
- `PUT /weeklyMealPlan/{id}/status` - Update plan status
- `DELETE /weeklyMealPlan/{id}` - Delete weekly plan

### ❤️ Health Check
- `GET /` - Server status

## Key Features

### 📊 Excel Export Feature
The `/lunchChoice/export` endpoint generates an Excel file with the weekly meal plan in the format:

| Username | Monday | Tuesday | Wednesday | Thursday | Friday |
|----------|---------|---------|-----------|----------|---------|
| john_doe | Grilled Chicken | Caesar Salad | Beef Stir Fry | Salmon | Turkey Sandwich |
| jane_smith | Caesar Salad | Vegetarian Pasta | Grilled Chicken | Soup | Fish Tacos |

### 🗓️ Weekly Planning System
The weekly meal planning system follows the office workflow:
- **Friday Selection**: Users select meals for the entire next week on Fridays
- **Comprehensive Planning**: Select meals for Monday through Friday
- **Template-Based**: Uses meal templates for consistency
- **Status Tracking**: Track planning, selection, and confirmation states

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `baseUrl` | API base URL | `http://localhost:3001` |
| `userId` | Sample user ID for testing | `1` |
| `menuId` | Sample menu ID for testing | `1` |
| `choiceId` | Sample choice ID for testing | `1` |
| `templateId` | Sample template ID for testing | `1` |
| `planId` | Sample plan ID for testing | `1` |
| `category` | Sample category for filtering | `Main Course` |
| `authToken` | JWT token (when implemented) | `` |

## Testing Workflow

### 1. Basic Setup
1. Test server status: `GET /`
2. Create/login user: `POST /user/register` or `POST /user/login`
3. Get all users: `GET /user`

### 2. Menu Management
1. Get all menus: `GET /menu`
2. Add new menu: `POST /menu/add`
3. Update menu: `PUT /menu/{id}`

### 3. Meal Templates
1. Get all templates: `GET /mealTemplate`
2. Filter by category: `GET /mealTemplate/category/Main Course`
3. Create new template: `POST /mealTemplate`

### 4. Lunch Selection
1. Select meal: `POST /lunchChoice/user/{userId}/select`
2. Get user choices: `GET /lunchChoice/user/{userId}`
3. Update selection: `PUT /lunchChoice/{choiceId}`

### 5. Weekly Planning
1. Check if it's Friday: `GET /weeklyMealPlan/info`
2. Create weekly plan: `POST /weeklyMealPlan`
3. Get user's plan: `GET /weeklyMealPlan/user/{userId}`

### 6. Export
1. Export to Excel: `GET /lunchChoice/export`

## Sample Data

The collection includes realistic sample data for testing:

### User Registration
```json
{
  "username": "newuser",
  "email": "newuser@example.com", 
  "password": "password123"
}
```

### Menu Item
```json
{
  "menuname": "Grilled Chicken Salad",
  "menudate": "2025-08-05",
  "description": "Fresh grilled chicken with mixed greens",
  "price": 12.99
}
```

### Meal Template
```json
{
  "name": "Spicy Tuna Roll",
  "description": "Fresh tuna with spicy mayo and cucumber",
  "category": "Main Course",
  "createdBy": "Admin"
}
```

### Weekly Selection
```json
{
  "userId": 1,
  "weeklySelections": {
    "Monday": [1, 5],
    "Tuesday": [2, 6], 
    "Wednesday": [3, 7],
    "Thursday": [4, 8],
    "Friday": [1, 9]
  }
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "status": "error",
  "error": "Error message description"
}
```

## Success Responses

Successful operations return:

```json
{
  "status": "success",
  "result": { /* data */ },
  "message": "Operation completed successfully"
}
```

## Notes

- **Authentication**: Currently simplified (JWT middleware commented out for testing)
- **Admin Features**: Some endpoints require admin privileges
- **Time Restrictions**: Meal selections have 10 AM cutoff times
- **Weekly Planning**: Friday-only restriction for weekly selections
- **Export Format**: Excel files with proper formatting and styling

## Support

For issues or questions about the API collection, refer to the main project documentation or the server code in the `src/` directory.
