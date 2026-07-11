import Product from "../models/ProductModel.js";

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al recibir productos" });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("category");
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ msg: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error al recibir producto" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ msg: "No se especifican todos los parámetros" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category, 
    });

    await newProduct.save();
    res.status(201).json({ msg: "Producto añadido", id: newProduct._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al agregar el producto" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    if (updatedData.category === "") {
      updatedData.category = undefined; 
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true }).populate("category");

    if (updatedProduct) {
      res.status(200).json({ msg: "Producto actualizado", product: updatedProduct });
    } else {
      res.status(404).json({ msg: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar el producto" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      res.status(200).json({ msg: "Producto eliminado" });
    } else {
      res.status(404).json({ msg: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el producto" });
  }
};

export { getProducts, getProductById, addProduct, updateProduct, deleteProduct };
