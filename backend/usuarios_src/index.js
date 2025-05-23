// index.js

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const usuariosController = require("./controllers/usuariosController");

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Configurar CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Registrar rutas
app.use("/api/usuarios", usuariosController);



// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Microservicio de usuarios escuchando en 0.0.0.0:${PORT}`);
});
