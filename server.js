const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("./db");
require("dotenv").config();

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("templates"));

// ── REGISTRO ──────────────────────────────────────
app.post("/api/register", async (req, res) => {
  const {
    nombre_completo,
    telefono,
    dui,
    correo,
    password,
    departamento,
    municipio,
  } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (nombre_completo, telefono, dui, correo, password, departamento, municipio)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        nombre_completo,
        telefono,
        dui,
        correo,
        passwordHash,
        departamento,
        municipio,
      ],
    );

    res.json({
      success: true,
      mensaje: "Usuario registrado correctamente",
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error(err); // ya está
    if (err.code === "23505") {
      res.status(400).json({
        success: false,
        mensaje: "El correo o DUI ya está registrado",
      });
    } else {
      res.status(500).json({ success: false, mensaje: "Error en el servidor" });
    }
  }
});

// ── LOGIN ─────────────────────────────────────────
app.post("/api/login", async (req, res) => {
  const { correo, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE correo = $1", [
      correo,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, mensaje: "Correo no encontrado" });
    }

    const user = result.rows[0];
    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      return res
        .status(400)
        .json({ success: false, mensaje: "Contraseña incorrecta" });
    }

    res.json({
      success: true,
      mensaje: "Login exitoso",
      usuario: {
        id: user.id,
        nombre: user.nombre_completo,
        correo: user.correo,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, mensaje: "Error en el servidor" });
  }
});

// ── INICIAR SERVIDOR ──────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
