# VN-J - Shop

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Seeding Data](#seeding-data)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

### Backend (Node.js/Express)
- User authentication (JWT)
- Product management (CRUD)
- Order management
- Coupon system
- Product reviews
- Role-based access (Admin/Customer)
- MongoDB connection

### Frontend (React/Vite)
- Responsive interface
- User authentication
- Product listing
- Quick cart
- Checkout page
- Account management
- Admin panel
- Product search

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 19** - JavaScript library
- **Vite** - Build tool and dev server
- **React Router** - SPA routing
- **ESLint** - Code linting

## System Requirements

- **Node.js** >= 16.0.0
- **MongoDB** >= 4.0 (or MongoDB Atlas)
- **npm** or **yarn**

## Installation

### 1. Clone repository
```bash
git clone https://github.com/EstherGrimm-hub/VNJ.git
cd VNJ
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

## Configuration

### Backend
1. Create `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/foodapp
```

2. Ensure MongoDB is running locally or update `MONGO_URI` for MongoDB Atlas.

### Frontend
No special configuration needed. Frontend will connect to backend via `http://localhost:5000`.

## Running the Application

### Run Backend
```bash
cd backend
npm run dev  # Run with nodemon (development)
# or
npm start    # Run with node (production)
```

Backend will run on `http://localhost:5000`

### Run Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173` (Vite default)

### Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Seeding Data

To create sample data (products, coupons, admin accounts):

```bash
cd backend
npm run seed
```

**Sample accounts:**
- **Admin:** admin@example.com / admin123
- **Customer:** customer1@example.com / pass123

## Project Structure

```
VNJ/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # API logic handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── couponController.js
│   │   └── reviewController.js
│   ├── data/                     # Sample data
│   │   ├── products.js
│   │   └── coupons.js
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Coupon.js
│   │   └── Review.js
│   ├── routes/                   # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   ├── couponRoutes.js
│   │   └── reviewRoutes.js
│   ├── utils/
│   │   └── updateProductRating.js
│   ├── .env                      # Environment variables
│   ├── package.json
│   ├── seed.js                   # Sample data script
│   └── server.js                 # Entry point
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── assets/               # Images, styles
│   │   ├── components/           # React components
│   │   │   ├── AuthModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── QuickCart.jsx
│   │   │   └── Footer.jsx
│   │   ├── data/
│   │   │   └── siteContent.js    # Static content
│   │   ├── pages/                # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── Account.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   └── ...
│   │   ├── services/             # API service functions
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   └── ...
│   │   ├── utils/
│   │   │   └── storage.js        # Local storage utilities
│   │   ├── App.jsx               # Main App component
│   │   ├── main.jsx              # Entry point
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get product list
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/user/:userId` - Get orders by user
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (Admin)

### Users
- `GET /api/users` - Get user list (Admin)
- `GET /api/users/:id` - Get user info
- `PUT /api/users/:id` - Update user

### Coupons
- `GET /api/coupons` - Get coupon list
- `POST /api/coupons` - Create coupon (Admin)
- `PUT /api/coupons/:id` - Update coupon (Admin)
- `DELETE /api/coupons/:id` - Delete coupon (Admin)

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Usage

### For regular users:
1. Register an account or login
2. Browse products on the homepage
3. Add products to cart
4. Apply discount codes (if available)
5. Checkout order
6. View order history in account

### For Admin:
1. Login with admin account
2. Access Admin page to:
   - Manage products (add/edit/delete)
   - Manage orders (view/update status)
   - Manage discount codes
   - View customer list

### Search feature:
- Use the search bar on navbar
- Search by product name

### Cart:
- Add products from detail page or list
- View quick cart from navbar icon
- Edit quantity or remove products

## Contributing

1. Fork the project
2. Create a branch for new feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## License

This project uses the ISC license. See the `LICENSE` file for more details.

---

**Note:** This is a demo project for educational purposes. Do not use in production environment without thorough security checks.</content>
<parameter name="filePath">e:\New Programming Language\VNJ\README.md