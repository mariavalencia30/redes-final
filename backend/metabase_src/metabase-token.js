const jwt = require("jsonwebtoken");

const METABASE_SITE_URL = "http://192.168.119.138:3008";  // Cambia la URL si es necesario
const METABASE_SECRET_KEY = "29758258f3212d92f901e010fd2fd94f68ea8ac742a17e5244d05fe2bd27f354"; // Tu clave secreta

const payload = {
  resource: { dashboard: 2 }, // Cambia el ID del dashboard si es diferente
  params: {},
  exp: Math.round(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 días de expiración
};

const token = jwt.sign(payload, METABASE_SECRET_KEY);

// Construir la URL del iframe
const iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

console.log(iframeUrl);  // Imprime la URL para usarla en el frontend
