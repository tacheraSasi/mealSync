import { format } from "date-fns";
import { Repository } from "typeorm";
import { AppDataSource } from "../utils/data-source";
import { Menu } from "../entities/Menu";

const menuRepository = (): Repository<Menu> =>
  AppDataSource.getRepository(Menu);

interface MenuInput {
  menuname: string;
  description: string;
  menudate: string;
  createdby: string;
}

async function allMenu(): Promise<{
  status: string;
  result?: Menu[];
  error?: string;
}> {
  try {
    const currentDate = format(new Date(), "d-MMM-yyyy");

    // Fetch all menus
    const menus = await menuRepository().find();

    // Update isactive flag for each menu depending on the date
    for (const menu of menus) {
      const isActive = menu.menudate === currentDate;
      if (menu.isactive !== isActive) {
        menu.isactive = isActive;
        await menuRepository().save(menu);
      }
    }

    // Fetch updated menus
    const updatedMenus = await menuRepository().find();

    return { status: "success", result: updatedMenus };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

async function menuCreate(
  menu: MenuInput,
): Promise<{ status: string; result?: Menu; error?: string }> {
  try {
    const currentDate = format(new Date(), "d-MMM-yyyy");

    const newMenu = menuRepository().create({
      ...menu,
      isactive: menu.menudate === currentDate,
    });

    await menuRepository().save(newMenu);

    return { status: "created", result: newMenu };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

async function menuUpdate(
  menu: MenuInput,
  id: number,
): Promise<{ status: string; result?: Menu; error?: string }> {
  try {
    const currentDate = format(new Date(), "d-MMM-yyyy");

    const existingMenu = await menuRepository().findOneBy({ id });
    if (!existingMenu) return { status: "error", error: "Menu not found" };

    existingMenu.menuname = menu.menuname;
    existingMenu.description = menu.description;
    existingMenu.menudate = menu.menudate;
    existingMenu.createdby = menu.createdby;
    existingMenu.isactive = menu.menudate === currentDate;

    await menuRepository().save(existingMenu);

    return { status: "updated", result: existingMenu };
  } catch (error: any) {
    return { status: "error", error: error.message };
  }
}

export { allMenu, menuCreate, menuUpdate };
