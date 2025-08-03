import { Repository } from "typeorm";
import { AppDataSource } from "../utils/data-source";
import { LunchChoice } from "../entities/LunchChoice";
import { User } from "../entities/User";
import { Menu } from "../entities/Menu";

export class LunchChoiceSeeder {
  private lunchChoiceRepository: Repository<LunchChoice>;
  private userRepository: Repository<User>;
  private menuRepository: Repository<Menu>;

  constructor() {
    this.lunchChoiceRepository = AppDataSource.getRepository(LunchChoice);
    this.userRepository = AppDataSource.getRepository(User);
    this.menuRepository = AppDataSource.getRepository(Menu);
  }

  async seed(): Promise<LunchChoice[]> {
    console.log("🌱 Seeding lunch choices...");

    // Get all users and menus
    const users = await this.userRepository.find();
    const menus = await this.menuRepository.find();

    if (users.length === 0) {
      console.log("⚠️  No users found. Please seed users first.");
      return [];
    }

    if (menus.length === 0) {
      console.log("⚠️  No menus found. Please seed menus first.");
      return [];
    }

    const createdLunchChoices: LunchChoice[] = [];

    // Create some realistic lunch choices
    const choicePatterns = [
      // John Doe's choices
      { userIndex: 1, menuIndices: [0, 3, 6] }, // john_doe likes variety
      // Jane Smith's choices
      { userIndex: 2, menuIndices: [1, 4, 7] }, // jane_smith prefers vegetarian/healthy options
      // Mike Johnson's choices
      { userIndex: 3, menuIndices: [2, 5, 8] }, // mike_johnson likes hearty meals
      // Sarah Wilson's choices
      { userIndex: 4, menuIndices: [1, 3, 9] }, // sarah_wilson health-conscious
      // David Brown's choices
      { userIndex: 5, menuIndices: [0, 2, 6, 10] }, // david_brown big appetite
      // Lisa Garcia's choices
      { userIndex: 6, menuIndices: [4, 7, 9] }, // lisa_garcia international cuisine lover
    ];

    for (const pattern of choicePatterns) {
      if (pattern.userIndex < users.length) {
        const user = users[pattern.userIndex];

        for (const menuIndex of pattern.menuIndices) {
          if (menuIndex < menus.length) {
            const menu = menus[menuIndex];

            // Check if lunch choice already exists
            const existingChoice = await this.lunchChoiceRepository.findOne({
              where: {
                userid: user.id,
                menuid: menu.id,
              }
            });

            if (!existingChoice) {
              const lunchChoice = this.lunchChoiceRepository.create({
                userid: user.id,
                username: user.username,
                menuid: menu.id,
                menuname: menu.menuname,
                menudate: menu.menudate,
                user: user,
                menu: menu,
              });

              const savedChoice = await this.lunchChoiceRepository.save(lunchChoice);
              createdLunchChoices.push(savedChoice);
              console.log(`✅ Created lunch choice: ${user.username} chose ${menu.menuname} for ${menu.menudate}`);
            } else {
              console.log(`⚠️  Lunch choice already exists: ${user.username} - ${menu.menuname}`);
              createdLunchChoices.push(existingChoice);
            }
          }
        }
      }
    }

    // Add some random additional choices for today's active menus
    const todayMenus = menus.filter(menu => menu.isactive);
    const remainingUsers = users.slice(7); // Admin and chef might also make choices

    for (const user of remainingUsers) {
      if (todayMenus.length > 0) {
        // Randomly select 1-2 menus for each remaining user
        const numChoices = Math.floor(Math.random() * 2) + 1;
        const shuffledMenus = todayMenus.sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < Math.min(numChoices, shuffledMenus.length); i++) {
          const menu = shuffledMenus[i];
          
          const existingChoice = await this.lunchChoiceRepository.findOne({
            where: {
              userid: user.id,
              menuid: menu.id,
            }
          });

          if (!existingChoice) {
            const lunchChoice = this.lunchChoiceRepository.create({
              userid: user.id,
              username: user.username,
              menuid: menu.id,
              menuname: menu.menuname,
              menudate: menu.menudate,
              user: user,
              menu: menu,
            });

            const savedChoice = await this.lunchChoiceRepository.save(lunchChoice);
            createdLunchChoices.push(savedChoice);
            console.log(`✅ Created lunch choice: ${user.username} chose ${menu.menuname} for ${menu.menudate}`);
          }
        }
      }
    }

    console.log(`🎉 Lunch choice seeding completed! Created/Found ${createdLunchChoices.length} lunch choices.`);
    return createdLunchChoices;
  }

  async clear(): Promise<void> {
    console.log("🧹 Clearing lunch choices...");
    await this.lunchChoiceRepository.clear();
    console.log("✅ Lunch choices cleared!");
  }
}
