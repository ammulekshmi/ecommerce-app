# Laravel React E-commerce Application

This is a full-stack e-commerce application built with **Laravel** (for the backend API and session management) and **React.js** (for the dynamic frontend user interface), leveraging **Vite** for a fast development experience.

-----

## Table of Contents

  * [Features](https://www.google.com/search?q=%23features)
  * [Technologies Used](https://www.google.com/search?q=%23technologies-used)
  * [Prerequisites](https://www.google.com/search?q=%23prerequisites)
  * [Installation](https://www.google.com/search?q=%23installation)
  * [Running the Application](https://www.google.com/search?q=%23running-the-application)
  * [Authentication](https://www.google.com/search?q=%23authentication)
  * [Project Structure](https://www.google.com/search?q=%23project-structure)
  * [Deployment](https://www.google.com/search?q=%23deployment)

-----

## Features

  * **Product Listing:** Browse through various products.
  * **Product Details:** View detailed information for each product.
  * **Categories:** Filter products by categories.
  * **Shopping Cart:** Add, update, and remove items from the cart.
  * **Order Management:** View past orders (for logged-in users).
  * **User Authentication:** Secure login, registration, and logout.
  * **Responsive Design:** (Assumed with Bootstrap) Adapts to different screen sizes.

-----

## Technologies Used

  * **Backend:**
      * **Laravel 10.x:** PHP Framework for robust APIs, database management, and authentication.
      * **MySQL/PostgreSQL/SQLite:** Database for storing application data.
      * **Composer:** PHP dependency management.
  * **Frontend:**
      * **React 18.x:** JavaScript library for building user interfaces.
      * **React Router DOM v6:** For client-side routing.
      * **Axios:** Promise-based HTTP client for API requests.
      * **Vite:** Next-generation frontend tooling for fast development and optimized builds.
      * **Bootstrap 5:** (Assumed) CSS framework for styling and responsive design.
  * **Development Tools:**
      * **Node.js:** JavaScript runtime.
      * **NPM/Yarn:** Package managers for Node.js.

-----

## Prerequisites

Before you begin, ensure you have the following installed on your system:

  * **PHP:** \>= 8.1
  * **Composer:** [Get Composer](https://getcomposer.org/download/)
  * **Node.js:** \>= 16 (LTS recommended)
  * **NPM** (comes with Node.js) or **Yarn**
  * **A Database Server:** MySQL, PostgreSQL, or SQLite. (MySQL is commonly used)
  * **Git:** For cloning the repository.

-----

## Installation

Follow these steps to set up the project locally:

1.  **Clone the Repository:**

    ```bash
    git clone <your-repository-url>
    cd <your-project-directory>
    ```

2.  **Install PHP Dependencies:**

    ```bash
    composer install
    ```

3.  **Create and Configure Environment File:**

    ```bash
    cp .env.example .env
    ```

    Open the newly created `.env` file and configure your database connection and other environment variables.

    ```dotenv
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_user
    DB_PASSWORD=your_database_password
    ```

4.  **Generate Application Key:**

    ```bash
    php artisan key:generate
    ```

5.  **Run Database Migrations:**

    ```bash
    php artisan migrate
    ```

    If you want to seed initial data (e.g., sample products, categories, or a test user), run:

    ```bash
    php artisan db:seed
    ```

6.  **Install Node.js Dependencies:**

    ```bash
    npm install # or yarn install
    ```

-----

## Running the Application

To run the application, you'll need to start both the Laravel backend server and the Vite frontend development server.

1.  **Start Laravel Development Server:**
    Open your terminal and run:

    ```bash
    php artisan serve
    ```

    This will typically start the server at `http://127.0.0.1:8000`.

2.  **Start Vite Development Server:**
    Open a **new terminal window** in the project root and run:

    ```bash
    npm run dev # or yarn dev
    ```

    Vite will start its development server, usually at `http://localhost:5173` or `http://[::1]:5173`. It will also watch your React files for changes and provide hot-module reloading.

3.  **Access the Application:**
    Open your web browser and navigate to the Laravel server URL (e.g., `http://127.0.0.1:8000`). Your React application should load, and all routing will be handled by React Router DOM.

-----

## Authentication

This application uses Laravel's session-based authentication for the backend and integrates with React for a seamless single-page application experience.

  * **Login & Registration:** The frontend React components (`resources/js/components/Auth/Login.jsx`, `resources/js/components/Auth/Register.jsx`) send `POST` requests to Laravel's `/login` and `/register` routes.
  * **Session Management:** Laravel handles creating and managing the user session via HTTP cookies.
  * **Status Check:** The `App.jsx` component makes an Axios `GET` request to `/api/user` to check the user's authentication status and fetch user details after a page load or successful login.
  * **Logout:** The frontend sends a `POST` request to Laravel's `/logout` route.

**Important Laravel API Route:**
Ensure you have the following route in `routes/api.php` to allow your React frontend to check the authenticated user:

```php
// routes/api.php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
```

-----

## Project Structure

  * `app/`: Laravel application logic (Models, Controllers, etc.).
  * `routes/`: API and web routes.
      * `web.php`: Contains the catch-all route for the React SPA.
      * `api.php`: Contains backend API endpoints.
  * `resources/`: Frontend assets and Blade views.
      * `resources/js/app.jsx`: The main entry point for your React application.
      * `resources/js/components/`: Your React components (e.g., `Home.jsx`, `Products.jsx`, `Auth/Login.jsx`).
      * `resources/sass/app.scss`: Main SASS/CSS file for styling.
      * `resources/views/layouts/app.blade.php`: The single Blade layout file that loads your React application.
  * `public/`: Publicly accessible assets (after `npm run build`).
      * `public/build/`: Directory for compiled frontend assets (ignored by Git, generated on build).
  * `database/`: Database migrations, seeders, factories.
  * `storage/`: Application logs, file uploads, and session files (ignored by Git).
  * `.env`: Environment configuration (ignored by Git).
  * `.gitignore`: Specifies files and directories to be ignored by Git.

-----

## Deployment

To deploy this application to a production server:

1.  **Configure Environment:** Set up your `.env` file for the production environment (database credentials, app URL, etc.).
2.  **Install PHP Dependencies:** Run `composer install --optimize-autoloader --no-dev`.
3.  **Run Migrations:** `php artisan migrate --force`.
4.  **Build Frontend Assets:** Run `npm run build` (or `yarn build`). This will compile your React application and place the optimized assets in `public/build`.
5.  **Configure Web Server:** Configure your web server (Nginx/Apache) to point to the `public` directory of your Laravel application.
6.  **Storage Symlink:** Create a symbolic link for `public/storage` if you use user-uploaded files: `php artisan storage:link`.
7.  **Cache Configuration:** Clear and cache Laravel configurations:
    ```bash
    php artisan optimize:clear
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

Refer to the Laravel deployment documentation for more in-depth information on specific server configurations.