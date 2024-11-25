import fs from "fs/promises";
import path from "path";

export class CartManager {
  constructor(
    filePathCart = path.resolve("./data/carts.json"),
    filePathProd = path.resolve("./data/productos.json")
  ) {
    this.carts = [];
    this.pathCart = filePathCart;
    this.pathProd = filePathProd;
  }

  // Leer productos del archivo y cargarlos en memoria
  async readProducts() {
    try {
      const data = await fs.readFile(this.pathProd, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  // Leer carritos del archivo y cargarlos en memoria
  async readCart() {
    try {
      const data = await fs.readFile(this.pathCart, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  // Escribir los carritos actuales en el archivo
  async writeCart() {
    const jsondata = JSON.stringify(this.carts, null, 2);
    await fs.writeFile(this.pathCart, jsondata);
  }

  // Crear un nuevo carrito
  async createCart() {
    try {
      await this.readCart(); // Asegurarse de tener la versión más actual de los carritos
      const newId =
        this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
      const newCart = { id: newId, products: [] }; // Estructura inicial del carrito
      this.carts.push(newCart);
      await this.writeCart();
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
    }
  }

  // Obtener un carrito por su ID
  async getCartById(cartId) {
    try {
      await this.readCart();
      return this.carts.find((cart) => cart.id === cartId) || null;
    } catch (error) {
      console.error("Error al buscar el carrito:", error);
    }
  }

  // Agregar un producto a un carrito
  async addProductToCart(cartId, prodId) {
    try {
      await this.readCart();
      await this.readProducts();

      // Verificar que el carrito y el producto existen
      const cart = this.carts.find((cart) => cart.id === cartId);
      const product = this.products.find((product) => product.id === prodId);

      if (!cart || !product) {
        return null;
      }

      // Buscar el producto dentro del carrito
      const productInCart = cart.products.find((item) => item.id === prodId);

      if (productInCart) {
        productInCart.quantity += 1; // Incrementar cantidad si ya está en el carrito
      } else {
        cart.products.push({ id: prodId, quantity: 1 }); // Agregar el producto al carrito
      }

      await this.writeCart();
      return cart;
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
    }
  }

  async checkCartId(id) {
    await this.readCart();
    return this.carts.some((cart) => cart.id === id);
  }

  async checkProductId(id) {
    await this.readProducts();
    return this.products.some((product) => product.id === id);
  }
}
