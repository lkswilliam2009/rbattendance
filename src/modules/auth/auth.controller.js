const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { uname, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO tusers (uname,email,password)
     VALUES ($1,$2,$3)`,
    [uname, email, hash]
  );

  res.json({ message: "User registered" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );

  if (!user.rows.length)
    return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(
    password,
    user.rows[0].password_hash
  );

  if (!valid)
    return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};