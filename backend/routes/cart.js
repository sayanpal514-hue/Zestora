const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route  GET /api/cart
// @desc   Get user's cart with populated products
// @access Private
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/cart
// @desc   Add item to cart (or increase qty)
// @access Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId, qty } = req.body;
    console.log('Cart POST - productId:', productId, 'qty:', qty);

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [{ product: productId, qty: (qty || 1) }] });
    } else {
      // Filter out any corrupted items where product is undefined/null
      cart.items = cart.items.filter(i => i && i.product);
      
      const itemIndex = cart.items.findIndex(
        (i) => i.product && i.product.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].qty += (qty || 1);
      } else {
        cart.items.push({ product: productId, qty: (qty || 1) });
      }
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(populated);
  } catch (error) {
    console.error('Cart POST detailed error:', error);
    res.status(500).json({ message: error.message || 'Error adding to cart' });
  }
});

// @route  PUT /api/cart/:productId
// @desc   Update item quantity in cart
// @access Private
router.put('/:productId', protect, async (req, res) => {
  try {
    const { qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((i) => i.product && i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.qty = qty;
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  DELETE /api/cart/:productId
// @desc   Remove item from cart
// @access Private
router.delete('/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.product && i.product.toString() !== req.params.productId);
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  DELETE /api/cart
// @desc   Clear entire cart
// @access Private
router.delete('/', protect, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
