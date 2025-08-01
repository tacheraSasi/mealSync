const { userCreate, allUser, userById, getUser } = require("../../models/user.model");

// GET
async function getAllUsers(req, res) {
  try {
    return res.status(200).json(await allUser());
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
 
}

// GET ONE USER
async function getUserById(req, res) {
  const { id } = req.params;
  try {
    return res.status(200).json(await userById(id));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
 
}

// POST LOGIN
async function userLogin(req, res) {
  const user = req.body;
  const result = await getUser(user)
  if(result.status === "error") {
    return res.status(400).json(result);
  } else {
    return res.status(200).json(result);
  }
}

// POST
async function userRegister(req, res) {
  const user = req.body;
  if (!user.username || !user.email || !user.password) {
    return res.status(400).json({ error: "Missing required fields" });
  } else {
    return res.status(201).json(await userCreate(user));
  }
}


module.exports = { userRegister, userLogin, getAllUsers, getUserById };
