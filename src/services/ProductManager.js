import fs from "fs/promises";
import path from "path";

const productosFilePath = path.resolve("data", "productos.json");

export default class ProductManager {
  //  Constructor
  constructor() {
    this.products = [];
    this.init();
  }

  // Leer el archivo de productos al iniciar
  async init() {
    try {
      const data = await fs.readFile(productosFilePath, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  // ** METODOS **
  // saveToFile: Guardar los productos en el archivo
  async saveToFile() {
    const jsonData = JSON.stringify(this.products, null, 2);
    await fs.writeFile(productosFilePath, jsonData);
  }

  // getAllProducts: Obtener todos los productos, con límite opcional
  async getAllProducts(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    }
    return this.products;
  }

  // getProductById: Buscar un producto por ID
  async getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  // addProduct: Agregar un nuevo producto
  async addProduct(product) {
    const newProduct = {
      id: this.products.length
        ? this.products[this.products.length - 1].id + 1
        : 1,
      ...product,
      status: true,
    };

    this.products.push(newProduct);
    // hacer guardado en el archivo
    this.saveToFile();

    return newProduct;
  }

  // updateProduct: Actualizar un producto por ID
  async updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex === -1) return null;

    const updatedProduct = {
      ...this.products[productIndex],
      ...updatedFields,
      id: this.products[productIndex].id, // Aseguramos que el ID no se actualice
    };

    this.products[productIndex] = updatedProduct;
    this.saveToFile();
    return updatedProduct;
  }
  // deleteProduct: Eliminar un producto por ID
  deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex === -1) return null; // Producto no encontrado

    const deletedProduct = this.products.splice(productIndex, 1);
    this.saveToFile();
    return deletedProduct[0];
  }
}
