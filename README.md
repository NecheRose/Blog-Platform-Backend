# 🚀 Blog-Platform-API  

The **Blog-Platform-API** is a **secure and scalable Lifestyle and Travel Blog backend** built with **Node.js, Express, and MongoDB**.  
It supports **user management, role-based access control, CRUD operations for blog posts and comments, categories, and media uploads with Cloudinary**.  

---

## ✨ Key Features 
- **User Management:** Registration, login, password reset, profile update, etc. 
- **Authentication:** JWT-based 
- **Authorization:** Role-based access (Superadmin/Admin/User/editor) 
- **Token Management:** Store and validate refresh tokens (Cookies) 
- **Validation:** Input validation (via express-validator) 
- **Security:** Rate limiting to prevent brute-force attacks Password hashing 


---

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT, bcrypt, crypto  
- **Token Storage:** Cookies 
- **File Uploads:** Multer + Cloudinary  
- **Validation:** express-validator  
- **Email:** Nodemailer / SendGrid  
- **Security:** Rate limiting, bcrypt password hashing  
- **Environment Management:** dotenv  

---

## 📂 Project Structure  
```bash
 Blog-Platform-Backend/
│── controllers/ # Route controllers
│ ├── authController.js
│ ├── userController.js
│ ├── postController.js
│ ├── commentController.js
│ ├── categoryController.js
│ └── adminController.js
│
|│── lib/ # Database connections
│ ├── cloudinary.js
│ └── mongodb.js

│── middlewares/ # Middlewares
| ├── adminMiddleware.js
│ ├── authMiddleware.js
│ ├── multer.js
| └── rateLimiter.js
│
│── models/ # Mongoose schemas
│ ├── categorySchema.js
│ ├── commentSchema.js
│ ├── postSchema.js
│ └── userSchema.js
│
│── routes/ # API routes
| ├── adminRoutes.js
│ ├── authRoutes.js
│ ├── categoryRoutes.js
│ ├── commentRoutes.js
│ ├── postRoutes.js
│ └── userRoutes.js
|
│── scripts/ # Superadmin creation
│ └── createSuperAdmin.js
│
│── services/ # External services
│ └── emailService.js 
│
│── utils/ # Helpers (token)
│ └── tokenManagement.js
│
│── .env # Environment variables
│── package-lock.json
|── package.json
│── server.js # App entry point

```

---

## 🚀 Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/en/) v18.17+   
- [npm](https://www.npmjs.com/)  
- MongoDB Atlas or Compass

### 2. Installation

# Clone the repo
```bash
git clone https://github.com/NecheRose/Blog-Platform-Backend.git
cd Blog-Platform-Backend
```
# Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
   
   Create a `.env` file in the root of the project and add the following:

   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string

   # JWT setup
   ACCESS_TOKEN_SECRET
   REFRESH_TOKEN_SECRET

   # Email (Nodemailer/SendGrid)
   SENDGRID_HOST=sendgrid.net
   SENDGRID_PORT=465
   SENDGRID_SECURE=true
   SENDGRID_API_KEY
   EMAIL_USER=your_email

   # Cloudinary setup
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET

   ```

### 4. Start development server
   ```bash
   npm run dev
   ```

## 📖 API Documentation

The Blog-Platform-API is fully documented with Postman for easy testing and collaboration.  
Explore endpoints inside the Todo-API Workspace for request/response samples.

### Collections Included
- **Admin API** – Create admins, manage users, etc.
- **Auth APIs** – Register, login, logout, email verification, password reset, etc.  
- **Category APIs** – Create, update and delete categories.   
- **Comment APIs** – Comment on posts, etc.
- **post APIs** – Create, edit, delete posts, etc.  
- **User APIs** – Profile management, update, password change, account deletion. 


### Postman Links
- **Admin API** - [view](https://www.postman.com/necherose/workspace/blog-platform-backend/collection/45016489-868d565a-f790-40a5-9ca5-2a20597ea4e6?action=share&creator=45016489&active-environment=45016489-dd1a5e79-8c17-4571-8efe-00a38450578d)
- **Auth APIs** - [view](https://www.postman.com/necherose/workspace/blog-platform-backend/collection/45016489-95e4f95b-438b-43d7-ae82-b605d874928c?action=share&creator=45016489&active-environment=45016489-dd1a5e79-8c17-4571-8efe-00a38450578d)
- **Category APIs** - [view](https://www.postman.com/necherose/workspace/blog-platform-backend/collection/45016489-5c9c4f17-d359-4a7c-82c5-d401411b5a8c?action=share&creator=45016489&active-environment=45016489-dd1a5e79-8c17-4571-8efe-00a38450578d)
- **comment APIs** - [view](https://www.postman.com/necherose/workspace/blog-platform-backend/collection/45016489-23b58532-fe12-48be-b0b5-21838c02c37b?action=share&creator=45016489&active-environment=45016489-dd1a5e79-8c17-4571-8efe-00a38450578d)
- **Post APIs** - [view](https://www.postman.com/necherose/workspace/blog-platform-backend/collection/45016489-08d7e5c6-64c3-4110-9429-5300e92942e0?action=share&creator=45016489&active-environment=45016489-dd1a5e79-8c17-4571-8efe-00a38450578d)
- **User APIs** - [view](https://www.postman.com/necherose/workspace/blog-platform-backend/collection/45016489-9c620b2d-962c-4920-8bbc-4b1adb6eed31?action=share&creator=45016489&active-environment=45016489-dd1a5e79-8c17-4571-8efe-00a38450578d)


Each endpoint includes:
- Request method & URL  
- Required headers & parameters  
- Example request/response  
- Authentication details (if required)  

# 🛠️ Superadmin Creation Script  

This script allows testers to create a **Superadmin** account in the database for accessing superadmin endpoints. Each tester can create their own account with their email, password, and username.  

## 📂 File Location  
The script is located at:  

```
scripts/createSuperAdmin.js
```

## ⚡ How to Run  

### 1. Directly with Node  
From your project root, run on the terminal:  

```bash
node scripts/createSuperAdmin.js "Your username" your.email@example.com YourPassword123
```
Example:
```
node scripts/createSuperAdmin.js "Nechekay" rose@gmail.com neche222
```

### 2. Using NPM Script (Optional)
Add this to your package.json under "scripts":

```
"scripts": {
  "create-superadmin": "node scripts/createSuperAdmin.js"
}
```

Now you can run: 
```bash
npm run create-superadmin -- "Your username" your.email@example.com YourPassword123
```

# 👤 Creating Other Admins
Once the **superadmin** account has been created, you can use it to create other admins.

## How It Works
- Only the **superadmin** has permission to create new admins.
- The creation is done via the **normal registration API route** (e.g., `POST /api/auth/register`).
- When creating an admin, the superadmin specifies the role as `admin`.
- After registration:
  - The new admin will receive an **email with their login credentials** (email + temporary password).
  - On first login, they are required to **change their password** for security.

👉 For detailed request/response examples, see the postman documentation above (Admin API).

## 🤝 Contributing
   1. Fork the repo
   2. Create a feature branch (git checkout -b feature-name)
   3. Commit changes (git commit -m 'Add feature')
   4. Push branch (git push origin feature-name)
   5. Create a Pull Request

## License

No License yet
