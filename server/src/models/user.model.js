const { client } = require("../utils/dbConnect");
const bcrypt = require("bcrypt");

// GET MODEL
async function allUser(){
  try {
    const query = `select id, username, email, role from users`;
  const result = await client.query(query);
  client.end;
  return { status: "success", result: result.rows };
  } catch (error) {
    return { status: "error", error: error.message };
  }
}
// GET ONE USER MODEL
async function userById(id){
  try {
  const query = `select id, username, email, role from users where id = ${id}`;
  const result = await client.query(query);
  if(result.rows.length === 0) {
    return { status: "error", error: "user not found" };
  }
  client.end;
  return { status: "success", result: result.rows };
  } catch (error) {
    return { status: "error", error: error.message };
  }
}


// POST LOGIN MODEL
async function getUser(user) {
  const { email, password } = user;
  const checkQuery = `select * from users where email = '${email}'`;
  const checkResult = await client.query(checkQuery);


  if (checkResult.rows.length > 0) {
    if(await bcrypt.compare(password, checkResult.rows[0].password)){
      const data = {
        id: checkResult.rows[0].id,
        username: checkResult.rows[0].username,
        email: checkResult.rows[0].email,
        role: checkResult.rows[0].role
      }
      return {status: "success", result: data};
    }
    return {status: "error", error: "Invalid password"}
  } else{
    return {status: "error", error: "Please register first"}
  }
}

// POST MODEL
async function userCreate(user) {
  const { username, email, password } = user;
  const passwordHash = await bcrypt.hash(password, 10);

  const checkQuery = `select * from users where username = '${username}' or email = '${email}'`;
  const checkResult = await client.query(checkQuery);

  if (checkResult.rows.length > 0) {
    return { status: "creation failed", error: "user already exists. please login" };
  }

  const newUser = { username, email };
  let insertQuery = `insert into users(username, password, email ) 
        values('${username}', '${passwordHash}', '${email}')`;

  try {
    const result = await client.query(insertQuery);
    client.end;
    return { status: "created", result: newUser };
  } catch (err) {
    return { status: "creation failed", error: err.message };
  }
}

module.exports = {
  userCreate,
  allUser,
  userById,
  getUser
};
