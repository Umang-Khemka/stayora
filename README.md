# Stayora 🏡

A full-stack vacation rental platform that makes it easy for users to discover, book, and manage accommodations while allowing hosts to create and manage their property listings.

Stayora combines **JWT authentication, REST APIs, Zustand state management, Cloudinary media handling, and a responsive Tailwind CSS interface** to provide a complete property-booking experience.

---

## ✨ Features

### 🔐 Authentication & State Management

* Secure user registration and login using **JWT authentication**
* Protected routes for authenticated users
* Zustand for global client-side state management
* Session handling across the application
* Authentication and authorization middleware on the backend

---

### 🏠 Property Listing Management

Hosts can manage their properties through the platform:

* Create new property listings
* Edit existing listings
* Delete property listings
* Upload and manage property images
* Provide listing information for users to explore

---

### 🔎 Property Discovery

Users can discover accommodations based on:

* Location
* Property category
* Price
* Listing details

The interface is designed to make browsing and comparing available properties straightforward.

---

### 📅 Booking Management

Users can:

* Book available properties
* View booking information
* Track booking history
* Manage upcoming and previous reservations

Hosts can manage the properties associated with their listings and bookings.

---

### ❤️ Wishlist

Users can save properties they are interested in through the wishlist functionality, making it easier to return to listings later.

---

### ⭐ Reviews

Users can interact with property listings through the integrated review system, allowing guests to share their experience with accommodations.

---

### 🖼️ Cloudinary Media Management

Stayora integrates **Cloudinary** for property image handling.

This provides dedicated media storage and management for listing images instead of relying on the application server for image storage.

---

### 📱 Responsive UI

The frontend uses **Tailwind CSS** to provide a clean and responsive interface that works across different screen sizes.

---

## 🛠️ Tech Stack

### Frontend

* **React.js** — UI development
* **Zustand** — Global state management
* **Tailwind CSS** — Styling and responsive UI

### Backend

* **Node.js** — Server-side runtime
* **Express.js** — REST API framework
* **MongoDB** — Database
* **JWT** — Authentication
* **REST APIs** — Client-server communication

### Services

* **Cloudinary** — Property image upload and media management

---

## 🏗️ Architecture

Stayora follows a client-server architecture built around REST APIs.

```text
                    ┌──────────────────────┐
                    │       React.js       │
                    │   Tailwind CSS       │
                    │      Zustand         │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │      Express.js      │
                    │       Node.js        │
                    ├──────────────────────┤
                    │ Authentication       │
                    │ Authorization        │
                    │ Input Validation     │
                    │ Business Logic       │
                    └──────────┬───────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
        ┌──────────────────┐      ┌──────────────────┐
        │     MongoDB      │      │    Cloudinary    │
        │                  │      │                  │
        │ Users            │      │ Property Images  │
        │ Listings         │      │ Media Management │
        │ Bookings         │      │                  │
        │ Reviews          │      │                  │
        └──────────────────┘      └──────────────────┘
```

---

## 🔑 Authentication Flow

Stayora uses JWT-based authentication to protect user-specific functionality.

```text
User
 │
 │ Login / Signup
 ▼
Express API
 │
 │ Validate credentials
 ▼
JWT Authentication
 │
 ▼
Authenticated Session
 │
 ├── Protected Routes
 ├── Booking Management
 ├── Wishlist
 ├── Reviews
 └── Host Listing Management
```

Backend middleware handles authentication and authorization before allowing access to protected resources.

---

## 📡 REST API Architecture

The backend follows a REST API architecture to keep the application modular and maintainable.

The API layer is responsible for handling operations such as:

* Authentication
* User management
* Property listings
* Booking management
* Wishlist operations
* Reviews
* Media-related operations

Middleware is used to handle cross-cutting concerns such as authentication, authorization, and input validation.

---

## 🗂️ Core Application Workflows

### Guest

```text
Browse Listings
      ↓
Search / Filter
      ↓
View Property
      ↓
Login / Signup
      ↓
Book Property
```

### User

```text
Login
  ↓
Browse Properties
  ↓
Wishlist / Review
  ↓
Book Property
  ↓
Track Booking History
```

### Host

```text
Login
  ↓
Create Listing
  ↓
Upload Images
  ↓
Manage Property
  ↓
Edit / Delete Listing
```

---

## 📁 Project Structure

The project follows a separated frontend/backend architecture.

```text
Stayora/
│
├── frontend/
│   └── React application
│
├── backend/
│   └── Express / Node.js API
│
├── package.json
└── README.md
```

> The exact internal structure may vary depending on the implementation.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Stayora
```

### 2. Install dependencies

Install dependencies for both the frontend and backend according to their respective package configurations.

### 3. Configure environment variables

Configure the required environment variables for:

* MongoDB connection
* JWT authentication
* Cloudinary configuration
* Backend configuration

### 4. Start the backend

```bash
npm run dev
```

### 5. Start the frontend

```bash
npm run dev
```

The application can then be accessed through the local development server.

---

## 🔒 Security & Backend Design

Stayora uses middleware-based backend protection for:

* JWT authentication
* Authorization
* Input validation
* Protected resources

This keeps authentication and validation logic separate from the core business logic and makes the backend easier to maintain.

---

## 💡 Engineering Highlights

### REST-based Backend

The application separates frontend presentation from backend business logic through REST APIs, allowing the two layers to evolve independently.

### Global Client State

Zustand provides centralized client-side state management for authentication and application state without introducing unnecessary complexity.

### Media Handling

Cloudinary handles property image storage and management, keeping media operations separate from the application's core backend.

### Role-based Functionality

The platform supports different capabilities for users and hosts, allowing property owners to manage listings while users focus on discovering and booking accommodations.

---

## 🔮 Future Improvements

Potential improvements include:

* Advanced property search and filtering
* Map-based property discovery
* Availability calendar for listings
* Payment gateway integration
* Host analytics dashboard
* Booking cancellation and refund workflows
* Email notifications
* Real-time booking notifications
* Improved recommendation system
* Property image optimization and transformation

---

## 🎯 What This Project Demonstrates

Stayora demonstrates practical experience with:

* Full-stack application development
* React.js frontend architecture
* Node.js and Express.js backend development
* REST API design
* MongoDB data modeling
* JWT authentication
* Middleware-based authorization
* Global state management with Zustand
* Cloud-based media management with Cloudinary
* Responsive frontend development
* Multi-role application workflows
* Booking and listing management

---

## 👨‍💻 Author

**Umang Khemka**

Built as a full-stack project to explore real-world property listing, booking, authentication, and media-management workflows.
