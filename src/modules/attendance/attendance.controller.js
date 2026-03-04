const pool = require('../../config/db');
const { getDistance } = require('../../utils/geo');

exports.attend = async (req, res) => {
  const { type, mode, latitude, longitude } = req.body;
  const userId = req.user.id;

  const ip = req.ip;

  if (mode === "WFO") {
    if (!ip.startsWith(process.env.OFFICE_SUBNET))
      return res.status(403).json({ message: "Not office network" });
  }

  if (mode === "WFA") {
    if (!req.file)
      return res.status(400).json({ message: "Photo required" });

    const user = await pool.query(
      `SELECT home_lat, home_long FROM users WHERE id=$1`,
      [userId]
    );

    const dist = getDistance(
      latitude,
      longitude,
      user.rows[0].home_lat,
      user.rows[0].home_long
    );

    if (dist > 50)
      return res.status(403).json({ message: "Outside allowed radius" });
  }

  await pool.query(
    `INSERT INTO attendance
     (user_id,type,mode,latitude,longitude,ip_address,photo_path)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      userId,
      type,
      mode,
      latitude,
      longitude,
      ip,
      req.file?.path || null
    ]
  );

  res.json({ message: "Attendance success" });
};