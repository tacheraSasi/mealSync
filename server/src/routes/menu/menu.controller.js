const { menuCreate, allMenu, menuUpdate } = require("../../models/menu.model");

 async function getAllMenu (req, res) {
  try {
    return res.status(200).json(await allMenu());
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  };

 async function addMenu (req, res) {
  const menu = req.body;
  if (!menu.menuname || !menu.description || !menu.menudate) {
    return res.status(400).json({ error: "Missing required fields" });
  } else {
    return res.status(201).json(await menuCreate(menu));
  }
  };

 async function updateMenu (req, res) {
  const id = req.params.id;
  const menu = req.body;
  if (!menu.menuname || !menu.description || !menu.menudate) {
    return res.status(400).json({ error: "Missing required fields" });
  } else {
    return res.status(201).json(await menuUpdate(menu, id));
  }
  };

  module.exports = {addMenu, getAllMenu, updateMenu}