const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("./db");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// ════════════════════════════════════════════════════════════════
//  CREAR CARPETA UPLOADS SI NO EXISTE
// ════════════════════════════════════════════════════════════════
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ════════════════════════════════════════════════════════════════
//  CONFIGURACIÓN MULTER (subida de imágenes)
// ════════════════════════════════════════════════════════════════
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    // Nombre único: campo_timestamp.ext  (ej: foto_logo_1717000000000.jpg)
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5 MB por imagen
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Solo se permiten imágenes (jpg, png, webp, gif)"));
  },
});

// ════════════════════════════════════════════════════════════════
//  NODEMAILER
// ════════════════════════════════════════════════════════════════
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ════════════════════════════════════════════════════════════════
//  APP definir rutas para que funcione correctamente el servidor
// ════════════════════════════════════════════════════════════════
const app = express();
app.use(cors());
app.use(express.json());

// ── Archivos estáticos ──────────────────────────────────────
app.use(express.static(__dirname)); // sirve index.html desde la raíz
app.use(express.static("templates")); // HTMLs
app.use("/css", express.static("css")); // CSS
app.use("/js", express.static("js")); // JS
app.use("/images", express.static("images")); // Imágenes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ruta raíz → index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ════════════════════════════════════════════════════════════════
//  REGISTRO
//  Recibe multipart/form-data porque trae imágenes (foto_logo + portada)
// ════════════════════════════════════════════════════════════════
app.post(
  "/api/register",
  upload.fields([
    { name: "foto_logo", maxCount: 1 },
    { name: "portada", maxCount: 1 },
  ]),
  async (req, res) => {
    // Los campos de texto vienen en req.body, las imágenes en req.files
    const {
      nombre_completo,
      telefono,
      dui,
      correo,
      password,
      departamento,
      distrito,
      municipio,
      tipo,
      nombre_artistico,
      portafolio,
      spotify,
      instagram,
      youtube,
      tiktok,
      objetivo,
      etiquetas, // llega como string "Rock,Jazz,Guitarra"
    } = req.body;

    // Rutas de las imágenes (null si no se subieron)
    const foto_logo = req.files?.foto_logo?.[0]?.filename
      ? `uploads/${req.files.foto_logo[0].filename}`
      : null;

    const portada = req.files?.portada?.[0]?.filename
      ? `uploads/${req.files.portada[0].filename}`
      : null;

    try {
      const passwordHash = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO users (
          nombre_completo, telefono, dui, correo, password,
          departamento, distrito, municipio,
          tipo, nombre_artistico, portafolio,
          foto_logo, portada,
          spotify, instagram, youtube, tiktok,
          objetivo, etiquetas
        ) VALUES (
          $1,  $2,  $3,  $4,  $5,
          $6,  $7,  $8,
          $9,  $10, $11,
          $12, $13,
          $14, $15, $16, $17,
          $18, $19
        ) RETURNING id`,
        [
          nombre_completo,
          telefono,
          dui,
          correo,
          passwordHash,
          departamento,
          distrito || null,
          municipio,
          tipo || null,
          nombre_artistico || null,
          portafolio || null,
          foto_logo,
          portada,
          spotify || null,
          instagram || null,
          youtube || null,
          tiktok || null,
          objetivo || null,
          etiquetas || null,
        ],
      );

      res.json({
        success: true,
        mensaje: "Usuario registrado correctamente",
        id: result.rows[0].id,
      });
    } catch (err) {
      console.error(err);
      if (err.code === "23505") {
        res.status(400).json({
          success: false,
          mensaje: "El correo o DUI ya está registrado",
        });
      } else {
        res
          .status(500)
          .json({ success: false, mensaje: "Error en el servidor" });
      }
    }
  },
);

// ════════════════════════════════════════════════════════════════
//  LOGIN
// ════════════════════════════════════════════════════════════════
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
        tipo: user.tipo,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, mensaje: "Error en el servidor" });
  }
});

// ════════════════════════════════════════════════════════════════
//  ALMACÉN TEMPORAL DE CÓDIGOS
// ════════════════════════════════════════════════════════════════
const codigosPendientes = {};

// ════════════════════════════════════════════════════════════════
//  ENVIAR CÓDIGO DE VERIFICACIÓN
// ════════════════════════════════════════════════════════════════
app.post("/api/enviar-codigo", async (req, res) => {
  const { correo, nombre } = req.body;

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

  const codigo = Math.floor(1000 + Math.random() * 9000).toString();
  codigosPendientes[correo] = {
    codigo,
    expira: Date.now() + 10 * 60 * 1000,
  };

  try {
    await transporter.sendMail({
      from: `"DIMUSAL" <${process.env.GMAIL_USER}>`,
      to: correo,
      subject: "Código de verificación DIMUSAL",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;border-radius:12px;border:1px solid #eee;">
          <h1 style="color:#f97316;text-align:center;">DIMUSAL</h1>
          <h2 style="text-align:center;">Verifica tu correo</h2>
          <p>Hola <strong>${nombre}</strong>, usa este código para completar tu registro:</p>
          <div style="text-align:center;margin:30px 0;">
            <span style="font-size:48px;font-weight:bold;letter-spacing:12px;color:#f97316;">
              ${codigo}
            </span>
          </div>
          <p style="color:#888;font-size:13px;text-align:center;">
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

// ════════════════════════════════════════════════════════════════
//  VERIFICAR CÓDIGO
// ════════════════════════════════════════════════════════════════
app.post("/api/verificar-codigo", (req, res) => {
  const { correo, codigo } = req.body;
  const entrada = codigosPendientes[correo];

  if (!entrada) {
    return res.status(400).json({
      success: false,
      mensaje: "No hay código pendiente para este correo",
    });
  }

  if (Date.now() > entrada.expira) {
    delete codigosPendientes[correo];
    return res.status(400).json({
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

// ════════════════════════════════════════════════════════════════
//  OBTENER DATOS DE UN USUARIO
// ════════════════════════════════════════════════════════════════
app.get("/api/usuario/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, nombre_completo, telefono, dui, correo, departamento, distrito, municipio, tipo, nombre_artistico, portafolio, foto_logo, portada, spotify, instagram, youtube, tiktok, objetivo, etiquetas, biografia, instrumentos_niveles, disponible, created_at FROM users WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Usuario no encontrado" });
    }

    res.json({ success: true, usuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, mensaje: "Error en el servidor" });
  }
});

// ════════════════════════════════════════════════════════════════
//  ACTUALIZAR INFORMACIÓN DE CONTACTO Y UBICACIÓN
// ════════════════════════════════════════════════════════════════
app.put("/api/usuario/:id/informacion", async (req, res) => {
  const { id } = req.params;
  const { telefono, correo, departamento, distrito, municipio } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET
        telefono = $1,
        correo = $2,
        departamento = $3,
        distrito = $4,
        municipio = $5
       WHERE id = $6
       RETURNING id`,
      [telefono, correo, departamento, distrito || null, municipio, id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Usuario no encontrado" });
    }

    res.json({
      success: true,
      mensaje: "Información actualizada correctamente",
    });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ success: false, mensaje: "Ese correo ya está en uso" });
    }
    res.status(500).json({ success: false, mensaje: "Error en el servidor" });
  }
});

// ════════════════════════════════════════════════════════════════
//  ACTUALIZAR ETIQUETAS
// ════════════════════════════════════════════════════════════════
app.put("/api/usuario/:id/etiquetas", async (req, res) => {
  const { id } = req.params;
  const { etiquetas } = req.body; // array

  try {
    await pool.query("UPDATE users SET etiquetas = $1 WHERE id = $2", [
      JSON.stringify(etiquetas || []),
      id,
    ]);
    res.json({
      success: true,
      mensaje: "Etiquetas actualizadas correctamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, mensaje: "Error en el servidor" });
  }
});

// ════════════════════════════════════════════════════════════════
//  ACTUALIZAR BIOGRAFÍA
// ════════════════════════════════════════════════════════════════
app.put("/api/usuario/:id/biografia", async (req, res) => {
  const { id } = req.params;
  const { biografia } = req.body;

  try {
    await pool.query("UPDATE users SET biografia = $1 WHERE id = $2", [
      biografia || null,
      id,
    ]);
    res.json({ success: true, mensaje: "Biografía actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, mensaje: "Error en el servidor" });
  }
});

// ════════════════════════════════════════════════════════════════
//  TRADUCIR TEXTO (Google Translate gratuito)
// ════════════════════════════════════════════════════════════════
app.post("/api/traducir", async (req, res) => {
  const { texto, idioma } = req.body;
  if (!texto) return res.json({ traduccion: "" });
  if (idioma === "es") return res.json({ traduccion: texto });

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(texto)}`;
    const response = await fetch(url);
    const data = await response.json();

    // Google devuelve un array anidado, unimos todos los fragmentos
    const traduccion = data[0].map((item) => item[0]).join("") || texto;
    res.json({ traduccion });
  } catch (err) {
    console.error("Error al traducir:", err);
    res.json({ traduccion: texto });
  }
});

// ════════════════════════════════════════════════════════════════
//  ACTUALIZAR NIVELES DE INSTRUMENTOS
// ════════════════════════════════════════════════════════════════
app.put("/api/usuario/:id/instrumentos-niveles", async (req, res) => {
  const { id } = req.params;
  const { instrumentos_niveles } = req.body;

  try {
    await pool.query(
      "UPDATE users SET instrumentos_niveles = $1 WHERE id = $2",
      [JSON.stringify(instrumentos_niveles || {}), id],
    );
    res.json({ success: true, mensaje: "Niveles actualizados correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, mensaje: "Error en el servidor" });
  }
});

// ════════════════════════════════════════════════════════════════
//  ACTUALIZAR REDES SOCIALES
// ════════════════════════════════════════════════════════════════
app.put("/api/usuario/:id/redes", async (req, res) => {
  const { id } = req.params;
  const { spotify, instagram, youtube, tiktok } = req.body;

  try {
    await pool.query(
      `UPDATE users SET spotify = $1, instagram = $2, youtube = $3, tiktok = $4 WHERE id = $5`,
      [spotify || null, instagram || null, youtube || null, tiktok || null, id],
    );
    res.json({
      success: true,
      mensaje: "Redes sociales actualizadas correctamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, mensaje: "Error en el servidor" });
  }
});

// ════════════════════════════════════════════════════════════════
//  ACTUALIZAR DISPONIBILIDAD
// ════════════════════════════════════════════════════════════════
app.put("/api/usuario/:id/disponibilidad", async (req, res) => {
  const { id } = req.params;
  const { disponible } = req.body;

  try {
    await pool.query("UPDATE users SET disponible = $1 WHERE id = $2", [
      disponible,
      id,
    ]);
    res.json({ success: true, mensaje: "Disponibilidad actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, mensaje: "Error en el servidor" });
  }
});

// ════════════════════════════════════════════════════════════════
//  ACTUALIZAR PORTADA
// ════════════════════════════════════════════════════════════════
app.put(
  "/api/usuario/:id/portada",
  upload.single("portada"),
  async (req, res) => {
    const { id } = req.params;

    try {
      // Obtener portada anterior para borrarla
      const anterior = await pool.query(
        "SELECT portada FROM users WHERE id = $1",
        [id],
      );
      const portadaAnterior = anterior.rows[0]?.portada;

      const nuevaPortada = req.file ? `uploads/${req.file.filename}` : null;

      if (!nuevaPortada) {
        return res
          .status(400)
          .json({ success: false, mensaje: "No se recibió imagen" });
      }

      await pool.query("UPDATE users SET portada = $1 WHERE id = $2", [
        nuevaPortada,
        id,
      ]);

      // Borrar imagen anterior si existía y no es la default
      if (portadaAnterior && portadaAnterior.startsWith("uploads/")) {
        const rutaAnterior = path.join(__dirname, portadaAnterior);
        if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
      }

      res.json({ success: true, portada: nuevaPortada });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, mensaje: "Error en el servidor" });
    }
  },
);

// ════════════════════════════════════════════════════════════════
//  ACTUALIZAR FOTO/LOGO
// ════════════════════════════════════════════════════════════════
app.put(
  "/api/usuario/:id/foto-logo",
  upload.single("foto_logo"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const anterior = await pool.query(
        "SELECT foto_logo FROM users WHERE id = $1",
        [id],
      );
      const fotoAnterior = anterior.rows[0]?.foto_logo;

      const nuevaFoto = req.file ? `uploads/${req.file.filename}` : null;

      if (!nuevaFoto) {
        return res
          .status(400)
          .json({ success: false, mensaje: "No se recibió imagen" });
      }

      await pool.query("UPDATE users SET foto_logo = $1 WHERE id = $2", [
        nuevaFoto,
        id,
      ]);

      // Borrar imagen anterior si existía
      if (fotoAnterior && fotoAnterior.startsWith("uploads/")) {
        const rutaAnterior = path.join(__dirname, fotoAnterior);
        if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
      }

      res.json({ success: true, foto_logo: nuevaFoto });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, mensaje: "Error en el servidor" });
    }
  },
);

// ════════════════════════════════════════════════════════════════
//  RECUPERAR CONTRASEÑA — ENVIAR CÓDIGO
// ════════════════════════════════════════════════════════════════
app.post("/api/recuperar-password", async (req, res) => {
  const { correo } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, nombre_completo FROM users WHERE correo = $1",
      [correo],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "No existe una cuenta con ese correo.",
      });
    }

    const usuario = result.rows[0];
    const codigo = Math.floor(1000 + Math.random() * 9000).toString();
    codigosPendientes[correo] = { codigo, expira: Date.now() + 10 * 60 * 1000 };

    await transporter.sendMail({
      from: `"DIMUSAL" <${process.env.GMAIL_USER}>`,
      to: correo,
      subject: "Recuperación de contraseña DIMUSAL",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;border-radius:12px;border:1px solid #eee;">
          <h1 style="color:#f97316;text-align:center;">DIMUSAL</h1>
          <h2 style="text-align:center;">Recupera tu contraseña</h2>
          <p>Hola <strong>${usuario.nombre_completo}</strong>, usa este código para restablecer tu contraseña:</p>
          <div style="text-align:center;margin:30px 0;">
            <span style="font-size:48px;font-weight:bold;letter-spacing:12px;color:#f97316;">${codigo}</span>
          </div>
          <p style="color:#888;font-size:13px;text-align:center;">
            Este código expira en 10 minutos.<br/>
            Si no solicitaste esto, ignora este correo.
          </p>
        </div>
      `,
    });

    res.json({ success: true, mensaje: "Código enviado al correo." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, mensaje: "Error en el servidor." });
  }
});

// ════════════════════════════════════════════════════════════════
//  RECUPERAR CONTRASEÑA — VERIFICAR CÓDIGO
// ════════════════════════════════════════════════════════════════
app.post("/api/verificar-codigo-recovery", (req, res) => {
  const { correo, codigo } = req.body;
  const entrada = codigosPendientes[correo];

  if (!entrada)
    return res
      .status(400)
      .json({ success: false, mensaje: "No hay código pendiente." });
  if (Date.now() > entrada.expira) {
    delete codigosPendientes[correo];
    return res
      .status(400)
      .json({ success: false, mensaje: "El código expiró." });
  }
  if (entrada.codigo !== codigo)
    return res
      .status(400)
      .json({ success: false, mensaje: "Código incorrecto." });

  delete codigosPendientes[correo];
  res.json({ success: true, mensaje: "Código verificado." });
});

// ════════════════════════════════════════════════════════════════
//  RECUPERAR CONTRASEÑA — CAMBIAR CONTRASEÑA
// ════════════════════════════════════════════════════════════════
app.post("/api/cambiar-password", async (req, res) => {
  const { correo, nuevaPassword } = req.body;

  try {
    const passwordHash = await bcrypt.hash(nuevaPassword, 10);
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE correo = $2 RETURNING id",
      [passwordHash, correo],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Usuario no encontrado." });
    }

    res.json({
      success: true,
      mensaje: "Contraseña actualizada correctamente.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, mensaje: "Error en el servidor." });
  }
});
// ════════════════════════════════════════════════════════════════
//  INICIAR SERVIDOR
// ════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
