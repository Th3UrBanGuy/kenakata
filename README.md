# KenaKata E-Commerce Platform

Welcome to KenaKata, a modern, feature-rich, and deployment-ready e-commerce platform. Built with a professional-grade stack including Next.js, Firebase, and Tailwind CSS, this application provides a seamless shopping experience for users and a powerful management dashboard for administrators.

This project has been architected with best practices, ensuring it is secure, scalable, and ready to be deployed on modern hosting platforms like Vercel, Netlify, Render, and more.

## ⭐ Key Features

### Core Architecture
- **Next.js 15 App Router**: Leverages the latest Next.js features for optimal performance, Server Components, and a modern developer experience.
- **Firebase Integration**: Securely integrated with Firebase for authentication, Firestore database, and real-time data synchronization.
- **Role-Based Access Control**: Clear distinction between `user` and `admin` roles, providing protected routes and feature access appropriate for each.
- **Environment-based Configuration**: Securely loads Firebase credentials from environment variables, following production deployment best practices.
- **TypeScript & Type Safety**: Fully typed codebase for enhanced reliability and maintainability.

### User Experience
- **Secure Authentication**: Robust user registration and login system with integrated email verification.
- **Dynamic Product Catalog**: Products and their variants are fetched in real-time from the Firestore database.
- **Interactive Variant Selection**: Dynamically updates product images, price, and stock status when users select different colors or sizes.
- **Shopping Cart**: A fully functional client-side cart with quantity management and coupon support.
- **Wishlist**: Users can save their favorite items to a personal wishlist tied to their account.
- **Account Management**: A dedicated dashboard for users to view order history and manage their profile (name, password).
- **Protected Checkout**: A multi-step, secure checkout process that is only accessible to verified, logged-in users.

### Admin Panel
- **Protected Admin Routes**: A separate, secure dashboard accessible only to users with the 'admin' role.
- **Comprehensive Dashboards**: At-a-glance overview of sales, revenue, and recent customer activity.
- **Full Product Management**: Admins can create, read, update, and delete products and all their variants through an intuitive interface.
- **Coupon System**: Admins can create and manage percentage or fixed-amount promotional codes with expiration dates and usage limits.
- **Customer Management**: View all registered users, see their order history, and manage their roles (promote to admin).
- **Order Management**: A centralized view of all orders placed on the platform.

## 🚀 Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS with ShadCN UI components
- **Database**: Firestore (for real-time data)
- **Authentication**: Firebase Authentication
- **Icons**: Lucide React
- **Development**: TypeScript, `tsx` for command-line scripts

## ⚙️ Setup & Deployment

Follow these steps to get the project running locally and ready for deployment.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd kenakata-ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

This is the most important step for connecting to your Firebase project.

- Create a new file named `.env` in the root of your project.
- Copy the contents of `.env.example` into your new `.env` file.
- Log in to your [Firebase Console](https://console.firebase.google.com/).
- Go to **Project settings** (the gear icon) > **General**.
- Under "Your apps", find your web app and look for the `firebaseConfig` object.
- Copy the values from your `firebaseConfig` object into the corresponding variables in your `.env` file.

### 4. Seed the Database (Optional)

To populate your store with initial product data, run the following command. This is essential to see products in the store for the first time.

**Note**: You may need to temporarily open your Firestore security rules to allow writes from a script. A simple rule for seeding is:
`allow write: if true;`
**Remember to secure your rules again after seeding!**

```bash
npm run db:seed
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

### 6. Create an Admin User

To access the admin panel, you first need to create a regular user through the application's "Sign Up" page. Once the user is created and their email is verified, you can promote them to an admin using this command-line script.

```bash
npm run make:admin -- <user@example.com>
```

### 7. Deploying to Vercel/Netlify

- **Push your code to a GitHub repository.**
- **Import your project** on the Vercel or Netlify dashboard.
- **Configure Environment Variables**: In your Vercel/Netlify project settings, copy all the variables from your `.env` file. **Make sure to prefix all variable names with `NEXT_PUBLIC_`** as required by Next.js for client-side access.
- **Deploy!** The platforms will automatically detect it's a Next.js project and use the correct build commands.

## 📜 Available NPM Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server after a build.
- `npm run db:seed`: Populates the database with initial products.
- `npm run make:admin -- <email>`: Promotes an existing user to an admin.
