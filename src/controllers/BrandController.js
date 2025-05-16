import Brand from "../models/Brand.js";

const BrandController = {
  getAll: async (req, res) => {
    try {
      const brands = await Brand.find();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) return res.status(404).json({ message: "Brand not found" });
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const brand = await Brand.create(req.body);
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await Brand.findByIdAndDelete(req.params.id);
      res.json({ message: "Brand deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  softDelete: async (req, res) => {
    try {
      const updated = await Brand.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  restore: async (req, res) => {
    try {
      const updated = await Brand.findByIdAndUpdate(req.params.id, { is_active: true }, { new: true });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default BrandController;
