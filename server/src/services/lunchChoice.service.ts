import { AppDataSource } from "../utils/data-source";
import { LunchChoice } from "../entities/LunchChoice";
import { User } from "../entities/User";
import { Menu } from "../entities/Menu";

const lunchChoiceRepository = () => AppDataSource.getRepository(LunchChoice);
const userRepository = () => AppDataSource.getRepository(User);
const menuRepository = () => AppDataSource.getRepository(Menu);

interface LunchChoiceInput {
  userid: number;
  menuid: number;
}

async function allLunchChoice(): Promise<{
  status: string;
  result?: LunchChoice[];
  error?: string;
}> {
  try {
    const result = await lunchChoiceRepository().find();
    return { status: "success", result };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

async function lunchChoiceCreate(
  input: LunchChoiceInput,
): Promise<{ status: string; result?: LunchChoice; error?: string }> {
  const { userid, menuid } = input;

  try {
    // Check if already added
    const exists = await lunchChoiceRepository().findOneBy({ userid, menuid });
    if (exists) {
      return {
        status: "creation failed",
        error: "Already added this menu item",
      };
    }

    // Fetch related user and menu
    const user = await userRepository().findOneBy({ id: userid });
    if (!user) return { status: "error", error: "User not found" };

    const menu = await menuRepository().findOneBy({ id: menuid });
    if (!menu) return { status: "error", error: "Menu not found" };

    // Create LunchChoice entity
    const newLunchChoice = lunchChoiceRepository().create({
      userid: user.id,
      username: user.username,
      menuid: menu.id,
      menuname: menu.menuname,
      menudate: menu.menudate,
      user, // optional: set relation object
      menu, // optional: set relation object
    });

    await lunchChoiceRepository().save(newLunchChoice);

    return { status: "created", result: newLunchChoice };
  } catch (err: any) {
    return { status: "creation failed", error: err.message };
  }
}

async function deleteLunchChoice(
  id: number,
): Promise<{ status: string; result?: LunchChoice; error?: string }> {
  try {
    const lunchChoice = await lunchChoiceRepository().findOneBy({ id });
    if (!lunchChoice) {
      return { status: "error", error: "LunchChoice not found" };
    }

    await lunchChoiceRepository().remove(lunchChoice);

    return { status: "success", result: lunchChoice };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

export { lunchChoiceCreate, allLunchChoice, deleteLunchChoice };
