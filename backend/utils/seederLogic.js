const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const sampleProducts = [
  {
    title: 'Apple iPhone 15 Pro Max',
    description: 'The most powerful iPhone ever. Apple A17 Pro chip, titanium design, 48MP camera system with 5x optical zoom.',
    price: 134900,
    originalPrice: 149900,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    ],
    category: 'Electronics',
    brand: 'Apple',
    stock: 50,
    rating: 4.8,
    numReviews: 120,
    isFeatured: true,
  },
  {
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI is here. 200MP quad-camera, built-in S Pen, Snapdragon 8 Gen 3 processor.',
    price: 124999,
    originalPrice: 134999,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
    category: 'Electronics',
    brand: 'Samsung',
    stock: 30,
    rating: 4.7,
    numReviews: 89,
    isFeatured: true,
  },
  {
    title: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with 8 microphones and two processors. 30-hour battery life.',
    price: 26990,
    originalPrice: 34990,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    brand: 'Sony',
    stock: 100,
    rating: 4.9,
    numReviews: 234,
    isFeatured: true,
  },
  {
    title: 'MacBook Pro 14" M3 Pro',
    description: 'Supercharged by M3 Pro chip with 12-core CPU and 18-core GPU. Up to 18 hours battery life.',
    price: 199900,
    originalPrice: 219900,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    category: 'Electronics',
    brand: 'Apple',
    stock: 20,
    rating: 4.9,
    numReviews: 67,
    isFeatured: true,
  },
  {
    title: 'Nike Air Max 270',
    description: 'Lifestyle shoe inspired by Air Max icons. Max Air heel unit for all-day comfort and bold style.',
    price: 12995,
    originalPrice: 14995,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Fashion',
    brand: 'Nike',
    stock: 200,
    rating: 4.5,
    numReviews: 312,
    isFeatured: true,
  },
  {
    title: 'Atomic Habits by James Clear',
    description: 'Tiny changes, remarkable results. The definitive guide to breaking bad habits and building good ones.',
    price: 499,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
    category: 'Books',
    brand: 'Penguin',
    stock: 500,
    rating: 4.8,
    numReviews: 1200,
    isFeatured: true,
  },
  {
    title: 'Instant Pot Duo 7-in-1',
    description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker and warmer. 6 quart capacity.',
    price: 6499,
    originalPrice: 8999,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
    category: 'Home & Kitchen',
    brand: 'Instant Pot',
    stock: 75,
    rating: 4.6,
    numReviews: 445,
    isFeatured: false,
  },
  {
    title: 'Adidas Ultraboost 23',
    description: 'The most responsive Ultraboost yet. BOOST midsole returns energy with every stride.',
    price: 17999,
    originalPrice: 21999,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
    category: 'Fashion',
    brand: 'Adidas',
    stock: 150,
    rating: 4.6,
    numReviews: 189,
    isFeatured: false,
  },
  {
    title: 'iPad Air 5th Gen',
    description: 'Powerful. Colorful. Wonderful. M1 chip, 10.9-inch Liquid Retina display, 5G capable.',
    price: 59900,
    originalPrice: 64900,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    category: 'Electronics',
    brand: 'Apple',
    stock: 40,
    rating: 4.7,
    numReviews: 98,
    isFeatured: true,
  },
  {
    title: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. 19 short stories about money.',
    price: 399,
    originalPrice: 649,
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500',
    category: 'Books',
    brand: 'Jaico',
    stock: 400,
    rating: 4.7,
    numReviews: 890,
    isFeatured: false,
  },
  {
    title: 'Logitech MX Master 3S',
    description: 'Advanced wireless mouse with ultra-fast MagSpeed scrolling. Works on any surface including glass.',
    price: 9995,
    originalPrice: 12995,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Electronics',
    brand: 'Logitech',
    stock: 80,
    rating: 4.8,
    numReviews: 267,
    isFeatured: false,
  },
  {
    title: 'Yoga Mat Premium',
    description: 'Eco-friendly 6mm thick non-slip yoga mat. Perfect for yoga, pilates and floor exercises.',
    price: 1299,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1601925228008-a0d506c9f8b4?w=500',
    category: 'Sports',
    brand: 'HealthSense',
    stock: 300,
    rating: 4.3,
    numReviews: 156,
    isFeatured: false,
  },
  {
    title: 'Digital Air Fryer 5L',
    description: 'Crispy, fried taste with 90% less oil. 8 preset programs and touch control.',
    price: 5499,
    originalPrice: 7999,
    image: 'https://images.unsplash.com/photo-1594833211511-0985c638367a?w=500',
    category: 'Home & Kitchen',
    brand: 'Philips',
    stock: 45,
    rating: 4.7,
    numReviews: 156,
    isFeatured: false,
  },
  {
    title: 'Double Wall Glass Coffee Mug (Set of 2)',
    description: 'Keep your coffee hot and your hands cool. Elegant design for the perfect morning.',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500',
    category: 'Home & Kitchen',
    brand: 'Bormioli',
    stock: 120,
    rating: 4.5,
    numReviews: 88,
    isFeatured: false,
  },
  {
    title: 'Adjustable Dumbbells (Pair)',
    description: 'Switch between 2.5kg to 24kg with a turn of a dial. Space-saving home gym solution.',
    price: 18999,
    originalPrice: 24999,
    image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500',
    category: 'Sports',
    brand: 'Bowflex',
    stock: 25,
    rating: 4.8,
    numReviews: 92,
    isFeatured: false,
  },
  {
    title: 'Anti-Pollution Face Serum',
    description: 'Vitamin C and Hyaluronic Acid for glowing, protected skin. 30ml bottle.',
    price: 699,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
    category: 'Beauty',
    brand: 'Minimalist',
    stock: 200,
    rating: 4.6,
    numReviews: 342,
    isFeatured: true,
  },
  {
    title: 'Hydrating Night Cream',
    description: 'Deep moisture replenishment with ceramides and peptides. Wake up to soft skin.',
    price: 1249,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=500',
    category: 'Beauty',
    brand: 'Cetaphil',
    stock: 150,
    rating: 4.7,
    numReviews: 215,
    isFeatured: false,
  },
  {
    title: 'Remote Control Supercar',
    description: '1:14 scale high-speed racing car with working lights and rechargeable battery.',
    price: 2499,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500',
    category: 'Toys',
    brand: 'Maisto',
    stock: 60,
    rating: 4.4,
    numReviews: 103,
    isFeatured: true,
  },
  {
    title: 'Belgian Dark Chocolate Box',
    description: 'Assorted premium dark chocolates with 70% cocoa content. Perfect for gifting.',
    price: 1199,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd5dc?w=500',
    category: 'Food',
    brand: 'Lindt',
    stock: 300,
    rating: 4.9,
    numReviews: 541,
    isFeatured: false,
  },
];

const seedData = async (silent = false) => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();

    if (!silent) console.log('🗑️  Cleared existing data');

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@zestora.com',
      password: 'admin123',
      isAdmin: true,
    });

    // Create sample customer
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user1234',
      isAdmin: false,
    });

    // Insert products
    await Product.insertMany(sampleProducts);

    if (!silent) {
      console.log('✅ Data seeded successfully!');
      console.log('👤 Admin: admin@zestora.com / admin123');
      console.log('👤 User:  john@example.com / user1234');
    }
  } catch (error) {
    if (!silent) console.error('❌ Seeding error:', error.message);
    throw error;
  }
};

const destroyData = async (silent = false) => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    if (!silent) console.log('🗑️  All data destroyed');
  } catch (error) {
    if (!silent) console.error('❌ Error:', error.message);
    throw error;
  }
};

module.exports = { seedData, destroyData };
