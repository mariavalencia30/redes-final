const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const comprasController = require("./controllers/comprasController");

//crear la app express
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// CORS configurado correctamente
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Rutas
app.use("/api/compras", comprasController);

// Ruta de prueba
app.get("/api/compras/test", (req, res) => {
    res.status(200).json({ message: "Ruta de prueba funcionando" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3006;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Microservicio de Compras escuchando en 0.0.0.0:${PORT}`);
});
