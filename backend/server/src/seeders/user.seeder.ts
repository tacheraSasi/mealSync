import bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { AppDataSource } from "../utils/data-source";
import { User } from "../entities/User";

export class UserSeeder {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async seed(): Promise<User[]> {
    console.log("🌱 Seeding users...");

    const users = [
      {
        username: "admin",
        email: "admin@mealsync.com",
        password: "admin123",
        role: "admin",
      },
      {
        username: "john_doe",
        email: "john.doe@company.com",
        password: "password123",
        role: "user",
      },
      {
        username: "jane_smith",
        email: "jane.smith@company.com",
        password: "password123",
        role: "user",
      },
      {
        username: "mike_johnson",
        email: "mike.johnson@company.com",
        password: "password123",
        role: "user",
      },
      {
        username: "sarah_wilson",
        email: "sarah.wilson@company.com",
        password: "password123",
        role: "user",
      },
      {
        username: "david_brown",
        email: "david.brown@company.com",
        password: "password123",
        role: "user",
      },
      {
        username: "lisa_garcia",
        email: "lisa.garcia@company.com",
        password: "password123",
        role: "user",
      },
      {
        username: "chef_maria",
        email: "maria@mealsync.com",
        password: "chef123",
        role: "admin",
      },
    ];

    const createdUsers: User[] = [];

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: [
          { username: userData.username },
          { email: userData.email }
        ]
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const user = this.userRepository.create({
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
        });

        const savedUser = await this.userRepository.save(user);
        createdUsers.push(savedUser);
        console.log(`✅ Created user: ${userData.username} (${userData.email})`);
      } else {
        console.log(`⚠️  User already exists: ${userData.username}`);
        createdUsers.push(existingUser);
      }
    }

    console.log(`🎉 User seeding completed! Created/Found ${createdUsers.length} users.`);
    return createdUsers;
  }

  async clear(): Promise<void> {
    console.log("🧹 Clearing users...");
    await this.userRepository.clear();
    console.log("✅ Users cleared!");
  }
}
