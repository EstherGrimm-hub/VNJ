# VN-J - Shop


## Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Seed dữ liệu](#seed-dữ-liệu)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [API Endpoints](#api-endpoints)
- [Cách sử dụng](#cách-sử-dụng)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

## Tính năng

### Backend (Node.js/Express)
- Xác thực người dùng (JWT)
- Quản lý sản phẩm (CRUD)
- Quản lý đơn hàng
- Hệ thống mã giảm giá (coupons)
- Đánh giá sản phẩm (reviews)
- Phân quyền (Admin/Customer)
- Kết nối MongoDB

### Frontend (React/Vite)
- Giao diện responsive
- Xác thực người dùng
- Danh sách sản phẩm
- Giỏ hàng nhanh
- Trang thanh toán
- Quản lý tài khoản
- Quản trị viên (Admin panel)
- Tìm kiếm sản phẩm

## Công nghệ sử dụng

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Cơ sở dữ liệu NoSQL
- **Mongoose** - ODM cho MongoDB
- **JWT** - Xác thực JSON Web Token
- **bcrypt** - Mã hóa mật khẩu
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 19** - Library JavaScript
- **Vite** - Build tool và dev server
- **React Router** - Routing cho SPA
- **ESLint** - Linting code

## Yêu cầu hệ thống

- **Node.js** >= 16.0.0
- **MongoDB** >= 4.0 (hoặc MongoDB Atlas)
- **npm** hoặc **yarn**

## Cài đặt

### 1. Clone repository
```bash
git clone https://github.com/EstherGrimm-hub/VNJ.git
cd VNJ
```

### 2. Cài đặt dependencies cho Backend
```bash
cd backend
npm install
```

### 3. Cài đặt dependencies cho Frontend
```bash
cd ../frontend
npm install
```

## Cấu hình

### Backend
1. Tạo file `.env` trong thư mục `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/foodapp
```

2. Đảm bảo MongoDB đang chạy trên máy local hoặc cập nhật `MONGO_URI` cho MongoDB Atlas.

### Frontend
Không cần cấu hình đặc biệt. Frontend sẽ kết nối tới backend qua `http://localhost:5000`.

## Chạy ứng dụng

### Chạy Backend
```bash
cd backend
npm run dev  # Chạy với nodemon (development)
# hoặc
npm start    # Chạy với node (production)
```

Backend sẽ chạy trên `http://localhost:5000`

### Chạy Frontend
```bash
cd frontend
npm run dev
```

Frontend sẽ chạy trên `http://localhost:5173` (mặc định của Vite)

### Truy cập ứng dụng
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Seed dữ liệu

Để tạo dữ liệu mẫu (sản phẩm, mã giảm giá, tài khoản admin):

```bash
cd backend
npm run seed
```

**Tài khoản mẫu:**
- **Admin:** admin@example.com / admin123
- **Customer:** customer1@example.com / pass123

## Cấu trúc dự án

```
VNJ/
├── backend/
│   ├── config/
│   │   └── db.js                 # Kết nối MongoDB
│   ├── controllers/              # Logic xử lý API
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── couponController.js
│   │   └── reviewController.js
│   ├── data/                     # Dữ liệu mẫu
│   │   ├── products.js
│   │   └── coupons.js
│   ├── middleware/
│   │   └── auth.js               # Middleware xác thực
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
│   ├── .env                      # Biến môi trường
│   ├── package.json
│   ├── seed.js                   # Script tạo dữ liệu mẫu
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
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Orders
- `GET /api/orders` - Lấy đơn hàng của user
- `GET /api/orders/user/:userId` - Lấy đơn hàng theo user
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id` - Cập nhật trạng thái đơn hàng (Admin)

### Users
- `GET /api/users` - Lấy danh sách users (Admin)
- `GET /api/users/:id` - Lấy thông tin user
- `PUT /api/users/:id` - Cập nhật user

### Coupons
- `GET /api/coupons` - Lấy danh sách mã giảm giá
- `POST /api/coupons` - Tạo mã giảm giá (Admin)
- `PUT /api/coupons/:id` - Cập nhật mã giảm giá (Admin)
- `DELETE /api/coupons/:id` - Xóa mã giảm giá (Admin)

### Reviews
- `GET /api/reviews/product/:productId` - Lấy reviews của sản phẩm
- `POST /api/reviews` - Tạo review
- `PUT /api/reviews/:id` - Cập nhật review
- `DELETE /api/reviews/:id` - Xóa review

## Cách sử dụng

### Cho người dùng thông thường:
1. Đăng ký tài khoản hoặc đăng nhập
2. Duyệt sản phẩm trên trang chủ
3. Thêm sản phẩm vào giỏ hàng
4. Áp dụng mã giảm giá (nếu có)
5. Thanh toán đơn hàng
6. Xem lịch sử đơn hàng trong tài khoản

### Cho Admin:
1. Đăng nhập với tài khoản admin
2. Truy cập trang Admin để:
   - Quản lý sản phẩm (thêm/sửa/xóa)
   - Quản lý đơn hàng (xem/cập nhật trạng thái)
   - Quản lý mã giảm giá
   - Xem danh sách khách hàng

### Tính năng tìm kiếm:
- Sử dụng thanh tìm kiếm trên navbar
- Tìm theo tên sản phẩm

### Giỏ hàng:
- Thêm sản phẩm từ trang chi tiết hoặc danh sách
- Xem giỏ hàng nhanh từ icon trên navbar
- Chỉnh sửa số lượng hoặc xóa sản phẩm

## Đóng góp

1. Fork dự án
2. Tạo branch cho feature mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Giấy phép

Dự án này sử dụng giấy phép ISC. Xem file `LICENSE` để biết thêm chi tiết.

---

**Lưu ý:** Đây là dự án demo cho mục đích học tập. Không sử dụng trong môi trường production mà chưa được kiểm tra bảo mật đầy đủ.</content>
<parameter name="filePath">e:\New Programming Language\VNJ\README.md