# KenaKata E-Commerce Platform

Welcome to the KenaKata E-Commerce Platform, a modern, feature-rich online store built with Next.js and Firebase. This application provides a seamless shopping experience for users and a powerful management dashboard for administrators.

## Features Implemented

### Core
- **Next.js 15 App Router**: Built using the latest Next.js features for optimal performance and developer experience.
- **Firebase Integration**: Deeply integrated with Firebase for authentication and database services.
- **Real-time Database**: Leverages Firestore `onSnapshot` listeners to ensure data is always up-to-date across the application without needing to refresh.
- **Role-Based Access Control**: Differentiates between regular `user` and `admin` roles to provide appropriate access to features and data.
- **Component-Based UI**: Built with React and ShadCN for a consistent and modern user interface.

### User-Facing
- **User Authentication**: Secure user registration and login functionality.
- **Dynamic Product Listings**: Products are fetched in real-time from the Firestore database.
- **Wishlist**: Users can add products to a personal wishlist, which is saved to their account.
- **Account Dashboard**: A dedicated area for users to view their order history and manage their profile.
- **Shopping Cart**: A functional client-side cart to add and manage products before checkout.

### Admin Panel
- **Admin Authentication**: Admins can log in to access a separate, feature-rich dashboard.
- **User Promotion**: A command-line tool to promote an existing user to an admin role.

## Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS with ShadCN UI components
- **Database**: Firestore
- **Authentication**: Firebase Authentication
- **Icons**: Lucide React
- **Development Tooling**: TypeScript, `tsx`

## Available NPM Scripts

### Development
- **`npm run dev`**: Starts the Next.js development server. The application will be available at `http://localhost:9002`.

### Production
- **`npm run build`**: Builds the application for production.
- **`npm run start`**: Starts the production server after a build.

### Database
- **`npm run db:seed`**: Populates the Firestore database with initial product data from `src/lib/data.ts`. This is essential to run once after setting up the project to see products in the store. *Note: This requires temporarily open security rules to function.*

### Administration
- **`npm run make:admin -- <user@example.com>`**: Promotes an existing user to an administrator. The user must already be registered in the database. *Note: This requires temporarily open security rules to function.*
  - **Example**: `npm run make:admin -- user@example.com`

## Next Steps & Roadmap

This project is being developed in phases. We are currently progressing through the user and admin panel features. Key upcoming features include:
- A complete admin dashboard for managing products, orders, and users.
- A fully functional checkout process.
- Coupon and discount management.
- Advanced analytics for store performance.
- AI-powered features for inventory analysis and more.