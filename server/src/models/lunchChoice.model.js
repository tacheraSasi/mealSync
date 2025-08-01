const { client } = require("../utils/dbConnect");

// GET ALL LunchChoice MODEL
async function allLunchChoice() {
  try {
    menunameQuery = `select * from menus where `;
    const query = `select * from lunchchoice`;
    const result = await client.query(query);
    client.end;
    return { status: "success", result: result.rows };
  } catch (error) {
    return { status: "error", error: error.message };
  }
}

// POST MODEL
async function lunchChoiceCreate(lunchChoice) {
  const { userid, menuid } = lunchChoice;

  const checkQuery = `select * from lunchchoice where menuid = '${menuid} ' and userid = '${userid}'`;
  const checkResult = await client.query(checkQuery);

  if (checkResult.rows.length > 0) {
    return { status: "creation failed", error: "Already added this menu item" };
  }

  try {
    const userQuery = await client.query(
      `select username from users where id = '${userid}'`
    );
    const username = userQuery.rows[0].username;
    const menuQuery = await client.query(
      `select menuname, menudate from menus where id = '${menuid}'`
    );
    const menuname = menuQuery.rows[0].menuname;
    const menudate = menuQuery.rows[0].menudate;
      console.log(menudate);
    const newLunchChoice = { userid, username, menuid, menuname, menudate };
    const insertQuery = `
            INSERT INTO lunchchoice(userid,username, menuid, menuname, menudate)
            values('${userid}','${username}', '${menuid}', '${menuname}', '${menudate}')`;
    const result = await client.query(insertQuery);
    return { status: "created", result: newLunchChoice };
  } catch (err) {
    return { status: "creation failed", error: err.message };
  }
}

// DELETE LunchChoice MODEL
async function deleteLunchChoice(id) {
  try {
    const query = `DELETE FROM lunchchoice WHERE id = '${id}'`;
    const result = await client.query(query);
    if (result.rowCount === 0) {
      return { status: "error", error: "LunchChoice not found" };
    }
    client.end;
    return { status: "success", result: result.rows[0] };
  } catch (error) {
    return { status: "error", error: error.message };
  }
}

module.exports = {
  lunchChoiceCreate,
  allLunchChoice,
  deleteLunchChoice
};
