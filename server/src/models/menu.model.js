const { client } = require("../utils/dbConnect");
const { format } = require("date-fns");

// GET ALL MENU MODEL
async function allMenu() {
  try {
    const query = `select * from menus`;
    const data = await client.query(query);
    client.end;

    const currentDate = format(new Date(), "d-MMM-yyyy");
    const menus = data.rows;

    for (const menu of menus) {
      if (menu.menudate === currentDate) {
        const updateQuery = `
                UPDATE menus
                SET isactive = true
                WHERE id = '${menu.id}'
                `;
        await client.query(updateQuery);
      } else {
        const updateQuery = `
                UPDATE menus
                SET isactive = false
                WHERE id = '${menu.id}'
                `;
        await client.query(updateQuery);
      }
    }
    const result = await client.query(query);
    return { status: "success", result: result.rows };
  } catch (error) {
    return { status: "error", error: error.message };
  }
}

// POST MODEL
async function menuCreate(menu) {
  const { menuname, description, menudate, createdby } = menu;

  let newMenu = { menuname, description, menudate, createdby };
  const currentDate = format(new Date(), "d-MMM-yyyy");
  if (menudate === currentDate) {
    newMenu["isactive"] = true;
  } else {
    newMenu["isactive"] = false;
  }

  let insertQuery = `insert into menus(menudate, menuname, description, createdby, isactive ) 
          values('${newMenu.menudate}', '${newMenu.menuname}', '${newMenu.description}', '${newMenu.createdby}', '${newMenu.isactive}')`;

  try {
    const result = await client.query(insertQuery);
    client.end;
    return { status: "created", result: newMenu };
  } catch (err) {
    return { status: "creation failed", error: err.message };
  }
}

// UPDATE MODEL
async function menuUpdate(menu, id) {
  const { menuname, description, menudate, createdby } = menu;

  let newMenu = { menuname, description, menudate, createdby };
  const currentDate = format(new Date(), "d-MMM-yyyy");

  if (menudate === currentDate) {
    newMenu["isactive"] = true;
  } else {
    newMenu["isactive"] = false;
  }
  let updateQuery = `UPDATE menus 
  SET menudate= '${newMenu.menudate}', menuname = '${newMenu.menuname}', description = '${newMenu.description}', createdby = '${newMenu.createdby}', isactive ='${newMenu.isactive}'
  WHERE id = '${id}'`;

  try {
    const result = await client.query(updateQuery);
    client.end;
    return { status: "updated", result: newMenu };
  } catch (err) {
    return { status: "creation failed", error: err.message };
  }
}

module.exports = {
  menuCreate,
  allMenu,
  menuUpdate,
};
