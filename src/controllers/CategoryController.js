import Category from "../models/Category.js";

const CategoryController = {
  getAll: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ message: "Category not found" });
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: "Category deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  softDelete: async (req, res) => {
    try {
      const updated = await Category.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  restore: async (req, res) => {
    try {
      const updated = await Category.findByIdAndUpdate(req.params.id, { is_active: true }, { new: true });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default CategoryController;
