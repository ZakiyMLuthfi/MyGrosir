const bcrypt = require("bcrypt");
const { User } = require("../../models");
const moment = require("moment-timezone");

const userAdd = async (req, res) => {
  const { email, username, password, role, created_by, updated_by } = req.body;

  // Usernam validation
  if (username.length > 16) {
    return res.status(400).json({ error: "Username is too long" });
  }
  if (password.length < 8 || password.length > 12) {
    return res
      .status(400)
      .json({ error: "Password must be 8 to 12 characters" });
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return res
      .status(400)
      .json({
        error:
          "Password must include a capital letter, a lowercase letter, and a number",
      });
  }

  console.log("Password data from postman:", password);

  try {
    // Adding email domain to input
    const fullUsername = `${username}@mygrosir.com`;

    // Hashing password before stored to database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData = {
      email,
      username: fullUsername,
      password: hashedPassword,
      role,
      created_by,
      updated_by,
      createdAt: moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss"),
    };

    // Making new user
    const newUser = await User.create(newUserData);

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error adding user", error);
    res.status(500).json({ error: "Error adding user" });
  }
};

module.exports = userAdd;
