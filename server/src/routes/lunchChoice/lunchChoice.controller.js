const { lunchChoiceCreate, allLunchChoice, deleteLunchChoice } = require("../../models/lunchChoice.model");

// GET
 async function getAllLunchChoice (req, res) {
  try {
    return res.status(200).json(await allLunchChoice());
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  };

  // POST
 async function addLunchChoice (req, res) {
  const lunchChoice = req.body;
  if (!lunchChoice.userid || !lunchChoice.menuid ) {
    return res.status(400).json({ error: "Missing required fields" });
  } else {
    return res.status(201).json(await lunchChoiceCreate(lunchChoice));
  }
  };

  // DELETE
 async function deleteLunch (req, res) {
  const id = req.params.id;
  try {
    return res.status(200).json(await deleteLunchChoice(id));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  };

  module.exports = {addLunchChoice, getAllLunchChoice, deleteLunch}