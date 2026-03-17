# 🍊 Zestora — Modern eCommerce Platform

Zestora is a high-performance, full-stack eCommerce platform built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS. It features a stunning, responsive design with dark mode support, real-time cart functionality, and an advanced administrative dashboard.

![Zestora Preview](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80)

## ✨ Key Features

- **🛍️ Complete Shopping Experience**: Search, filter, and sort through products with ease.
- **🌓 Dynamic UI**: Beautifully designed with dark and light mode support using Tailwind CSS.
- **🚀 Zero-Setup Database**: Automatically falls back to an **In-Memory MongoDB** if no local database is detected — works instantly!
- **📦 Advanced Admin Console**: Manage products, orders, and users through a professional dashboard.
- **💳 Secure Checkout**: Simulated Razorpay integration for a realistic payment experience.
- **🔐 Robust Auth**: JWT-based authentication with secure password hashing and account recovery.
- **📱 Fully Responsive**: Optimized for Mobile, Tablet, and Desktop views.

---

## 🛠️ Technology Stack

| Frontend | Backend | Database |
| :--- | :--- | :--- |
| React 18 + Vite | Node.js | MongoDB |
| Tailwind CSS | Express.js | Mongoose |
| Framer Motion | JWT | mongodb-memory-server |

---

## 🚀 Getting Started (Live View)

The project is pre-configured to run with **Zero Setup**.

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/sayanpal514-hue/Zestora.git
    cd Zestora
    ```

2.  **Start the Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```

3.  **Start the Frontend**:
    ```bash
    # In a new terminal
    cd frontend
    npm install
    npm run dev
    ```

4.  **View Local App**:
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👤 Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@zestora.com` | `admin123` |
| **Customer** | `john@example.com` | `user1234` |

---

## ☁️ Deployment

For instructions on how to host this project on **Vercel**, **Render**, and **MongoDB Atlas**, check out the [Hosting Guide](./brain/hosting_guide.md).

---

## 📝 License
This project is licensed under the MIT License.
