import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";

const app = express();

// Configuración para permitir que el servidor procese JSON y parámetros en URLs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para verificar si el servidor está funcionando
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Rutas principales para productos y carritos
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

// Configuración del puerto
const SERVER_PORT = 8080;

// Inicio del servidor
app.listen(SERVER_PORT, () => {
  console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});
