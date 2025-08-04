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
        menuname: "Ugali na Nyama",
        description: "Traditional  cornmeal staple served with tender beef stew and vegetables",
        menudate: format(yesterday, "d-MMM-yyyy"),
        createdby: "admin",
        isactive: false,
      },
      {
        menuname: "Pilau ya Kuku",
        description: "Aromatic spiced rice with chicken, cardamom, cinnamon, and cloves",
        menudate: format(yesterday, "d-MMM-yyyy"),
        createdby: "chef_maria",
        isactive: false,
      },
      
      // Today's menu (active)
      {
        menuname: "Wali wa Nazi na Samaki",
        description: "Coconut rice served with grilled tilapia fish and sukuma wiki (collard greens)",
        menudate: format(today, "d-MMM-yyyy"),
        createdby: "admin",
        isactive: true,
      },
      {
        menuname: "Mchuzi wa Kuku",
        description: " chicken curry with coconut milk, tomatoes, and spices served with rice",
        menudate: format(today, "d-MMM-yyyy"),
        createdby: "chef_maria",
        isactive: true,
      },
      {
        menuname: "Ndizi na Nyama",
        description: "Green bananas cooked with beef in rich tomato and onion sauce",
        menudate: format(today, "d-MMM-yyyy"),
        createdby: "admin",
        isactive: true,
      },
      
      // Tomorrow's menu
      {
        menuname: "Mishkaki na Chapati",
        description: "Grilled marinated beef skewers with  flatbread and salad",
        menudate: format(tomorrow, "d-MMM-yyyy"),
        createdby: "chef_maria",
        isactive: false,
      },
      {
        menuname: "Maharage ya Nazi",
        description: "Red kidney beans cooked in coconut milk with spices, served with rice",
        menudate: format(tomorrow, "d-MMM-yyyy"),
        createdby: "admin",
        isactive: false,
      },
      {
        menuname: "Samosa na Chai",
        description: "Crispy triangular pastries filled with spiced meat or vegetables with  tea",
        menudate: format(tomorrow, "d-MMM-yyyy"),
        createdby: "chef_maria",
        isactive: false,
      },
      
      // Day after tomorrow
      {
        menuname: "Nyama Choma na Ugali",
        description: "Traditional  grilled meat with ugali and kachumbari salad",
        menudate: format(dayAfterTomorrow, "d-MMM-yyyy"),
        createdby: "admin",
        isactive: false,
      },
      {
        menuname: "Mchicha na Dagaa",
        description: "Spinach cooked with small dried fish (dagaa) and coconut milk",
        menudate: format(dayAfterTomorrow, "d-MMM-yyyy"),
        createdby: "chef_maria",
        isactive: false,
      },
      {
        menuname: "Makande",
        description: "Traditional dish of maize and beans cooked together with coconut milk",
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
    const menuRepository = AppDataSource.getRepository(Menu);
    await menuRepository.clear();
    console.log("✅ Menus cleared successfully");
  }
}
