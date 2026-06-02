const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("./db");
require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
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

// Almacén temporal de códigos
const codigosPendientes = {};

// ── ENVIAR CÓDIGO DE VERIFICACIÓN ─────────────────────────────
app.post("/api/enviar-codigo", async (req, res) => {
  const { correo, nombre } = req.body;

  // Verificar si el correo ya está registrado
  try {
    const existe = await pool.query("SELECT id FROM users WHERE correo = $1", [
      correo,
    ]);
    if (existe.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, mensaje: "El correo ya está registrado" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, mensaje: "Error en el servidor" });
  }

  // Generar código de 4 dígitos
  const codigo = Math.floor(1000 + Math.random() * 9000).toString();

  // Guardarlo con expiración de 10 minutos
  codigosPendientes[correo] = {
    codigo,
    expira: Date.now() + 10 * 60 * 1000,
  };

  // Enviar correo
  try {
    await transporter.sendMail({
      from: `"DIMUSAL" <${process.env.GMAIL_USER}>`,
      to: correo,
      subject: "Código de verificación DIMUSAL",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border-radius: 12px; border: 1px solid #eee;">
          <h1 style="color: #f97316; text-align: center;">DIMUSAL</h1>
          <h2 style="text-align: center;">Verifica tu correo</h2>
          <p>Hola <strong>${nombre}</strong>, usa este código para completar tu registro:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: #f97316;">
              ${codigo}
            </span>
          </div>
          <p style="color: #888; font-size: 13px; text-align: center;">
            Este código expira en 10 minutos.<br/>
            Si no creaste una cuenta en DIMUSAL, ignora este correo.
          </p>
        </div>
      `,
    });

    res.json({ success: true, mensaje: "Código enviado al correo" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, mensaje: "Error al enviar el correo" });
  }
});

// ── VERIFICAR CÓDIGO ──────────────────────────────────────────
app.post("/api/verificar-codigo", (req, res) => {
  const { correo, codigo } = req.body;
  const entrada = codigosPendientes[correo];

  if (!entrada) {
    return res
      .status(400)
      .json({
        success: false,
        mensaje: "No hay código pendiente para este correo",
      });
  }

  if (Date.now() > entrada.expira) {
    delete codigosPendientes[correo];
    return res
      .status(400)
      .json({
        success: false,
        mensaje: "El código expiró. Solicita uno nuevo.",
      });
  }

  if (entrada.codigo !== codigo) {
    return res
      .status(400)
      .json({ success: false, mensaje: "Código incorrecto" });
  }

  delete codigosPendientes[correo];
  res.json({ success: true, mensaje: "Código verificado correctamente" });
});
