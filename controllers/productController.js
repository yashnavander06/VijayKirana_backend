const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find({});

        res.status(200).json({
            allProducts
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        res.status(200).json({
            product
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

exports.getProductsByColor = async (req, res) => {
    try {
        const products = await Product.find({ 
            $and: [
                { price: { $gte: req.body.lowest } },
                { price: { $lte: req.body.uppest } },
                { color: req.params.color }
            ]
         });

        res.status(200).json({
            products
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

exports.getProductsByCategoryId = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.id });

        res.status(200).json({
            products
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

exports.getProductsByGender = async (req, res) => {
    try {
        const products = await Product.find({
            $and: [
                { price: { $gte: req.body.lowest } },
                { price: { $lte: req.body.uppest } },
                { gender: req.params.gender }
            ]
        });


        res.status(200).json({
            products
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

exports.getProductsByPrice = async (req, res) => {
    try {
        const products = await Product.find({ $and: [{ price: { $gte: req.body.lowest } }, { price: { $lte: req.body.uppest } }] });

        res.status(200).json({
            products
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

exports.getProductsByStatus = async (req, res) => {
    try {
        const products = await Product.find({ status: req.params.status });

        res.status(200).json({
            products
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

exports.getProductsBySearch = async (req, res) => {
    try {
        const products = await Product.find({ name: { $regex: '.*' + req.params.search + '.*', "$options": "i" } });

        res.status(200).json({
            products
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

exports.getProductsByQueries = async (req, res) => {
    try {
        const products = await Product.find({
            $and:
                [
                    { price: { $gte: req.body.lowest } }, { price: { $lte: req.body.uppest } },
                    { color: req.body.color },
                    { gender: req.body.gender }
                ]
        });

        res.status(200).json({
            products
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);

        res.status(201).json({
            newProduct
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            product
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};


exports.deductInventory = async (req, res) => {
  try {
    const { cart } = req.body; // <- MUST be an array
    if (!Array.isArray(cart)) {
      return res.status(400).json({ success: false, message: 'Cart must be an array' });
    }

    for (const item of cart) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.id}` });
      }

      if (product.inventory >= item.amount) {
        product.inventory -= item.amount;
        await product.save();
      } else {
        return res.status(400).json({
          success: false,
          message: `Not enough inventory for product: ${product.name}. Available: ${product.inventory}`
        });
      }
    }

    res.status(200).json({ success: true, message: 'Inventory deducted successfully' });
  } catch (err) {
    console.error('Inventory deduction error:', err);
    res.status(500).json({ success: false, message: 'Inventory update failed' });
  }
};


exports.add_Product_inventory = async (req, res) => {
    try {
        const { productId, size_details } = req.body; // productId = existing product _id

        // Find the existing product by _id
        let existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update inventory for each size
        size_details.forEach(newSize => {
            const sizeEntry = existingProduct.size_details.find(s => s.sizes === newSize.sizes);
            if (sizeEntry) {
                // Add the new inventory to existing
                sizeEntry.inventory += newSize.inventory;
            } else {
                // If size doesn't exist, add as new size
                existingProduct.size_details.push(newSize);
            }
        });

        // Update total inventory
        existingProduct.inventory_total = existingProduct.size_details.reduce(
            (acc, s) => acc + s.inventory,
            0
        );

        await existingProduct.save();

        res.status(200).json({
            message: 'Inventory updated successfully',
            product: existingProduct
        });

    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

async function restoreInventoryHelper(cart = []) {
  for (const item of cart) {
    // Accept either { product: id } or { id }
    const productId = item.product ?? item.id;
    const amountToRestore = item.amount ?? item.quantity ?? 0;

    if (!productId || amountToRestore <= 0) continue;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) continue;

    // Restore inventory (if you have size-specific inventory, you should handle that here)
    existingProduct.inventory = (existingProduct.inventory ?? 0) + amountToRestore;
    await existingProduct.save();
  }
}

exports.restoreInventoryHelper = restoreInventoryHelper;

// Accept either POST body { cart: [...] } or an array body []
exports.restore_inventory = async (req, res) => {
  try {
    // normalize input: either array directly or { cart: array }
    const reqBody = req.body;
    const cart = Array.isArray(reqBody) ? reqBody : (reqBody.cart ?? []);
    if (!Array.isArray(cart)) {
      return res.status(400).json({ success: false, message: 'Invalid cart payload' });
    }

    await restoreInventoryHelper(cart);

    res.status(200).json({ success: true, message: 'Inventory restored successfully' });
  } catch (error) {
    console.error('Restore inventory error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};