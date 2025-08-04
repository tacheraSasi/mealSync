import { AppDataSource } from "../utils/data-source";
import { MealTemplate } from "../entities/MealTemplate";
import { Repository } from "typeorm";

export class MealTemplateSeeder {
  private mealTemplateRepository: Repository<MealTemplate>;

  constructor() {
    this.mealTemplateRepository = AppDataSource.getRepository(MealTemplate);
  }

  async seed(): Promise<MealTemplate[]> {
    console.log("🌱 Seeding meal templates...");

    // Check if meal templates already exist
    const count = await this.mealTemplateRepository.count();
    if (count > 0) {
      console.log("⚠️  Meal templates already exist, skipping seeding");
      return await this.mealTemplateRepository.find();
    }

  const mealTemplates = [
    // Main Course - Tanzanian
    {
      name: "Ugali na Nyama",
      description: "Traditional cornmeal staple served with beef or chicken stew",
      category: "Main Course",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Pilau",
      description: "Spiced rice dish with meat, flavored with cardamom, cinnamon, and cloves",
      category: "Main Course",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Wali wa Nazi",
      description: "Coconut rice - fragrant rice cooked in coconut milk",
      category: "Main Course",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Nyama Choma",
      description: "Grilled meat (beef, goat, or chicken) served with ugali",
      category: "Main Course",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Mishkaki",
      description: "Marinated beef skewers grilled to perfection",
      category: "Main Course",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Mchuzi wa Kuku",
      description: "Tanzanian chicken curry with coconut milk and spices",
      category: "Main Course",
      createdBy: "Admin",
      isActive: true,
    },

    // Soup - Tanzanian
    {
      name: "Supu ya Kuku",
      description: "Traditional Tanzanian chicken soup with vegetables",
      category: "Soup",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Supu ya Nyama",
      description: "Hearty beef soup with local spices",
      category: "Soup",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Supu ya Mboga",
      description: "Vegetable soup with local greens and herbs",
      category: "Soup",
      createdBy: "Admin",
      isActive: true,
    },

    // Salad/Vegetables - Tanzanian
    {
      name: "Kachumbari",
      description: "Fresh tomato and onion salad with lime and chili",
      category: "Salad",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Sukuma Wiki",
      description: "Sautéed collard greens with onions and tomatoes",
      category: "Salad",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Mchicha",
      description: "Spinach cooked with groundnut sauce or coconut milk",
      category: "Salad",
      createdBy: "Admin",
      isActive: true,
    },

    // Snacks/Light Meals - Tanzanian
    {
      name: "Samosa",
      description: "Crispy triangular pastries filled with spiced meat or vegetables",
      category: "Snack",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Chapati",
      description: "Soft flatbread perfect for scooping up stews",
      category: "Snack",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Ndizi Kaanga",
      description: "Fried green bananas, a popular Tanzanian side dish",
      category: "Snack",
      createdBy: "Admin",
      isActive: true,
    },

    // Dessert - Tanzanian
    {
      name: "Kashata",
      description: "Sweet coconut candy made with coconut and sugar",
      category: "Dessert",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Kaimati",
      description: "Sweet fried doughnuts served with sugar syrup",
      category: "Dessert",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Tropical Fruit Salad",
      description: "Fresh mangoes, pineapples, and bananas",
      category: "Dessert",
      createdBy: "Admin",
      isActive: true,
    },

    // Beverage - Tanzanian
    {
      name: "Chai ya Tangawizi",
      description: "Spiced ginger tea with milk and cardamom",
      category: "Beverage",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Kahawa",
      description: "Traditional Tanzanian coffee",
      category: "Beverage",
      createdBy: "Admin",
      isActive: true,
    },
    {
      name: "Passion Fruit Juice",
      description: "Fresh passion fruit juice",
      category: "Beverage",
      createdBy: "Admin",
      isActive: true,
    },
  ];

  try {
    const createdTemplates = this.mealTemplateRepository.create(mealTemplates);
    const savedTemplates = await this.mealTemplateRepository.save(createdTemplates);
    console.log(`✅ Meal templates seeded successfully! Created ${savedTemplates.length} templates.`);
    return savedTemplates;
  } catch (error) {
    console.error("❌ Error seeding meal templates:", error);
    throw error;
  }
}

  async clear(): Promise<void> {
    const mealTemplateRepository = AppDataSource.getRepository(MealTemplate);
    await mealTemplateRepository.clear();
    console.log("✅ Meal templates cleared successfully");
  }
}
