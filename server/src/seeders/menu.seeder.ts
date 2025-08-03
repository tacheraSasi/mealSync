import { Repository } from "typeorm";
import { AppDataSource } from "../utils/data-source";
import { Menu } from "../entities/Menu";
import { format, addDays, subDays } from "date-fns";

export class MenuSeeder {
  private menuRepository: Repository<Menu>;

  constructor() {
    this.menuRepository = AppDataSource.getRepository(Menu);
  }

  async seed(): Promise<Menu[]> {
    console.log("🌱 Seeding menus...");

    const today = new Date();
    const yesterday = subDays(today, 1);
    const tomorrow = addDays(today, 1);
    const dayAfterTomorrow = addDays(today, 2);

    const menus = [
      // Yesterday's menu
      {
        menuname: "Chicken Teriyaki Bowl",
        description: "Grilled chicken with teriyaki sauce, steamed rice, and vegetables",
        menudate: format(yesterday, "d-MMM-yyyy"),
        createdby: "admin",
        isactive: false,
      },
      {
        menuname: "Vegetarian Pizza",
        description: "Fresh vegetables, mozzarella cheese, and tomato sauce on thin crust",
        menudate: format(yesterday, "d-MMM-yyyy"),
        createdby: "chef_maria",
        isactive: false,
      },
      
      // Today's menu (active)
      {
        menuname: "Beef Tacos",
        description: "Seasoned ground beef with lettuce, tomatoes, cheese, and sour cream",
        menudate: format(today, "d-MMM-yyyy"),
        createdby: "admin",
        isactive: true,
      },
      {
        menuname: "Caesar Salad",
        description: "Fresh romaine lettuce, croutons, parmesan cheese, and caesar dressing",
        menudate: format(today, "d-MMM-yyyy"),
        createdby: "chef_maria",
        isactive: true,
      },
      {
        menuname: "Grilled Salmon",
        description: "Atlantic salmon with lemon herbs, quinoa, and roasted vegetables",
        menudate: format(today, "d-MMM-yyyy"),
        createdby: "admin",
        isactive: true,
      },
      
      // Tomorrow's menu
      {
        menuname: "Pasta Carbonara",
        description: "Creamy pasta with bacon, eggs, parmesan cheese, and black pepper",
        menudate: format(tomorrow, "d-MMM-yyyy"),
        createdby: "chef_maria",
        isactive: false,
      },
      {
        menuname: "Thai Green Curry",
        description: "Spicy green curry with chicken, vegetables, and jasmine rice",
        menudate: format(tomorrow, "d-MMM-yyyy"),
        createdby: "admin",
        isactive: false,
      },
      {
        menuname: "Mediterranean Wrap",
        description: "Hummus, grilled vegetables, feta cheese, and olives in a tortilla wrap",
        menudate: format(tomorrow, "d-MMM-yyyy"),
        createdby: "chef_maria",
        isactive: false,
      },
      
      // Day after tomorrow
      {
        menuname: "BBQ Pulled Pork",
        description: "Slow-cooked pulled pork with coleslaw and sweet potato fries",
        menudate: format(dayAfterTomorrow, "d-MMM-yyyy"),
        createdby: "admin",
        isactive: false,
      },
      {
        menuname: "Quinoa Buddha Bowl",
        description: "Quinoa with roasted vegetables, chickpeas, avocado, and tahini dressing",
        menudate: format(dayAfterTomorrow, "d-MMM-yyyy"),
        createdby: "chef_maria",
        isactive: false,
      },
      {
        menuname: "Fish and Chips",
        description: "Beer-battered cod with crispy fries and mushy peas",
        menudate: format(dayAfterTomorrow, "d-MMM-yyyy"),
        createdby: "admin",
        isactive: false,
      },
    ];

    const createdMenus: Menu[] = [];

    for (const menuData of menus) {
      // Check if menu already exists
      const existingMenu = await this.menuRepository.findOne({
        where: {
          menuname: menuData.menuname,
          menudate: menuData.menudate,
        }
      });

      if (!existingMenu) {
        const menu = this.menuRepository.create(menuData);
        const savedMenu = await this.menuRepository.save(menu);
        createdMenus.push(savedMenu);
        console.log(`✅ Created menu: ${menuData.menuname} for ${menuData.menudate}`);
      } else {
        console.log(`⚠️  Menu already exists: ${menuData.menuname} for ${menuData.menudate}`);
        createdMenus.push(existingMenu);
      }
    }

    console.log(`🎉 Menu seeding completed! Created/Found ${createdMenus.length} menus.`);
    return createdMenus;
  }

  async clear(): Promise<void> {
    console.log("🧹 Clearing menus...");
    await this.menuRepository.clear();
    console.log("✅ Menus cleared!");
  }
}
