const bcrypt = require("bcrypt");
const { User } = require("../../models");
const nodemailer = require("nodemailer");

const generateRandomPassword = (length = 8) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
};

const sendEmail = async (email, username, password) => {
  let transporter = nodemailer.createTransport({
    service: "Zoho", // Nama layanan
    host: "smtp.zoho.com", // Zoho SMTP server
    port: 465, // Port untuk SSL
    secure: true, // Menggunakan SSL
    auth: {
      user: "zakiymluthfi@zohomail.com", // Ganti dengan email Zoho Anda
      pass: "amatsukaze-chan", // Ganti dengan password Zoho Anda (atau app password jika menggunakan autentikasi dua faktor)
    },
  });

  const mailOptions = {
    from: "zakiymluthfi@zohomail.com",
    to: email,
    subject: "Your Account Details",
    text: `Greetings, ${email}!\n\nHere are your MyGrosir account details:\n\nUsername: ${username}\nPassword: ${password}\n\nDon't forget to change your password and fill in the personal data form so you can start working.
`,
  };

  // Mengirimkan email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

const userAdd = async (req, res) => {
  const { email, username, role } = req.body;
  const userId = req.user.id;
  // Usernam validation
  if (username.length > 16) {
    return res.status(400).json({ error: "Username is too long" });
  }

  const generatedPassword = generateRandomPassword(8);

  try {
    // Adding email domain to input
    const fullUsername = `${username}@mygrosir.com`;

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newUserData = {
      email,
      username: fullUsername,
      password: hashedPassword,
      role,
      created_by: userId,
      updated_by: userId,
    };

    // Making new user
    console.log("Data user yang ditambahkan adalah: ", newUserData);
    const newUser = await User.create(newUserData);

    console.log("Mengirim email...");
    await sendEmail(email, fullUsername, generatedPassword);
    console.log("Email berhasil dikirim!");

    res.status(201).json({ user: newUser, password: generatedPassword });
  } catch (error) {
    console.error("Error adding user", error);
    res.status(500).json({ error: "Error adding user" });
  }
};

module.exports = userAdd;
