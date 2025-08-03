import { AppDataSource } from "../utils/data-source";
import { MealTemplate } from "../entities/MealTemplate";

export async function seedMealTemplates() {
  const mealTemplateRepository = AppDataSource.getRepository(MealTemplate);

  // Check if meal templates already exist
  const count = await mealTemplateRepository.count();
  if (count > 0) {
    console.log("Meal templates already exist, skipping seeding");
    return;
  }

  const mealTemplates = [
    // Main Course
    {
      name: "Grilled Chicken Breast",
      description: "Tender grilled chicken breast with herbs and spices",
      category: "Main Course",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Beef Stir Fry",
      description: "Savory beef stir fry with mixed vegetables",
      category: "Main Course",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Salmon Teriyaki",
      description: "Fresh salmon glazed with teriyaki sauce",
      category: "Main Course",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Vegetarian Pasta",
      description: "Creamy pasta with seasonal vegetables",
      category: "Main Course",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Turkey Sandwich",
      description: "Sliced turkey with fresh vegetables on whole grain bread",
      category: "Main Course",
      createdBy: "Admin",
      isActive: true,
    },

    // Soup
    {
      name: "Tomato Basil Soup",
      description: "Classic tomato soup with fresh basil",
      category: "Soup",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Chicken Noodle Soup",
      description: "Hearty chicken soup with noodles and vegetables",
      category: "Soup",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Mushroom Bisque",
      description: "Creamy mushroom soup with herbs",
      category: "Soup",
      createdBy: "Admin",
      isActive: true,
    },

    // Salad
    {
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing and croutons",
      category: "Salad",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Greek Salad",
      description: "Mixed greens with feta cheese, olives, and Greek dressing",
      category: "Salad",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Asian Chicken Salad",
      description: "Mixed greens with grilled chicken and Asian dressing",
      category: "Salad",
      createdBy: "Admin",
      isActive: true,
    },

    // Dessert
    {
      name: "Chocolate Cake",
      description: "Rich chocolate cake with chocolate frosting",
      category: "Dessert",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Fresh Fruit Bowl",
      description: "Seasonal fresh fruits",
      category: "Dessert",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee and mascarpone",
      category: "Dessert",
      createdBy: "Admin",
      isActive: true,
    },

    // Beverage
    {
      name: "Fresh Orange Juice",
      description: "Freshly squeezed orange juice",
      category: "Beverage",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Green Tea",
      description: "Premium green tea",
      category: "Beverage",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Coffee",
      description: "Freshly brewed coffee",
      category: "Beverage",
      createdBy: "Admin",
      isActive: true,
    },
  ];

  try {
    const createdTemplates = mealTemplateRepository.create(mealTemplates);
    await mealTemplateRepository.save(createdTemplates);
    console.log("Meal templates seeded successfully");
  } catch (error) {
    console.error("Error seeding meal templates:", error);
    throw error;
  }
}
