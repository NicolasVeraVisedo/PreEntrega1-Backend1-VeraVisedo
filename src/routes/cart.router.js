import { Router } from "express";
import { CartManager } from "../services/CartManager.js";

const cartsRouter = Router();

const cartsManager = new CartManager();

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    const cart = await cartsManager.getCartById(id);
    if (!cart)
      return res.status(404).send(`El id: ${id} no pertenece a ningún carrito`);
    res.json(cart);
  } catch (error) {
    console.log(error);
  }
});

// Crear carrito
cartsRouter.post("/", async (req, res) => {
  try {
    const cartEmpty = [];
    const newCart = await cartsManager.createCart(cartEmpty);
    res.status(201).json({ message: "Carrito creado correctamente", cart: newCart });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

//Agregar producto al carrito
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const prodId = parseInt(req.params.pid);

  try {
    const checkId = await cartsManager.checkProductId(prodId);
    const checkIdCart = await cartsManager.checkCartId(cartId);

    if (!checkId) {
      return res
        .status(400)
        .json({ error: "Debe seleccionar un ID de producto existente" });
    }
    if (!checkIdCart) {
      return res
        .status(400)
        .json({ error: "Debe seleccionar un ID de carrito existente" });
    }

    await cartsManager.addProductToCart(cartId, prodId);

    res.status(201).json({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

export default cartsRouter;
