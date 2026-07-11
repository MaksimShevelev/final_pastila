import Category from "../models/CategoryModel.js";

const getCategorys = async (req, res) => {
    try {
        const categorys = await Category.find();
        res.status(200).json(categorys);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener categorías" });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ msg: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener categoría" });
    }
};

const addCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json({ msg: "Categoría agregada", data: newCategory });
    } catch (error) {
        res.status(500).json({ msg: "Error al agregar categoría" });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });
        if (updatedCategory) {
            res.status(200).json({ msg: "Categoría actualizada", data: updatedCategory });
        } else {
            res.status(404).json({ msg: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar categoría" });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (deletedCategory) {
            res.status(200).json({ msg: "Categoría eliminada" });
        } else {
            res.status(404).json({ msg: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar categoría" });
    }
};

export { getCategorys, getCategoryById, addCategory, updateCategory, deleteCategory };
