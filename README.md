# HFiles - Medical File Management System

This README provides instructions on how to run the HFiles Medical File Management System, which consists of a Next.js frontend and an ASP.NET Core backend.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Node.js** (version 18 or later recommended for Next.js) and **npm** for the frontend. You can download it from [https://nodejs.org/](https://nodejs.org/).
* **.NET SDK** (version 8.0 as specified in the `.csproj` file). You can download it from [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download).
* **A code editor** (e.g., Visual Studio Code, Sublime Text, JetBrains Rider).
* **MySQL Server** (version compatible with `MySql.Data` 8.0.11 and `Pomelo.EntityFrameworkCore.MySql` 8.0.3 as indicated in the `.csproj` file).
* **(Optional) A database management tool** (e.g., MySQL Workbench).

## Running the Frontend (Next.js)

1.  **Navigate to the frontend directory:**

    ```bash
    cd your-project-directory/front-end
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env.local` file in your `front-end` directory (if it doesn't exist) and add any necessary environment variables, such as the base URL of your backend API (if it's not the default `http://localhost:5242`). For example:

    ```env
    NEXTAUTH_URL=http://localhost:3000
    NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5242
    # Add other environment variables as needed
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start the Next.js development server, usually on `http://localhost:3000`. Open this URL in your web browser to access the frontend.

## Running the Backend (ASP.NET Core)

1.  **Navigate to the backend directory:**

    ```bash
    cd your-project-directory/back-end
    ```

2.  **Restore NuGet packages:**

    ```bash
    dotnet restore
    ```

    This command downloads all the necessary dependencies for your ASP.NET Core project, including MySQL-related packages.

3.  **Configure database connection:**

    Open the `appsettings.json` file in your `back-end` directory and ensure the `ConnectionStrings` section is correctly configured to connect to your MySQL database. For example:

    ```json
    {
      "Logging": {
        "LogLevel": {
          "Default": "Information",
          "Microsoft.AspNetCore": "Warning"
        }
      },
      "AllowedHosts": "*",
      "ConnectionStrings": {
        "DefaultConnection": "Server=localhost;Port=3306;Database=your_database_name;User=your_user;Password=your_password;"
      }
    }
    ```

    Replace `your_database_name`, `your_user`, and `your_password` with your actual MySQL database credentials.

4.  **Apply database migrations (if any):**

    If your backend uses Entity Framework Core for database interactions, you might need to apply migrations to create or update your database schema. Ensure you have the `dotnet ef` tool installed globally (`dotnet tool install --global dotnet-ef`).

    ```bash
    dotnet ef database update --project back-end --startup-project back-end
    ```

5.  **Run the backend application:**

    ```bash
    dotnet run --project back-end
    ```

    This will start the ASP.NET Core web server, usually on `http://localhost:5242` (as configured in your `launchSettings.json` or `Program.cs`). You should see output in your terminal indicating that the server has started.

## Accessing the Application

Once both the frontend and backend are running:

* Open your web browser and navigate to the address where your frontend is running (usually `http://localhost:3000`).
* The frontend will then communicate with the backend API running on `http://localhost:5242` for user authentication, data fetching, and file uploads.

## Important Notes

* **CORS (Cross-Origin Resource Sharing):** Ensure that your ASP.NET Core backend is configured to allow requests from your Next.js frontend's origin (`http://localhost:3000`). This is typically handled in your backend's `Program.cs` or a similar configuration file.
* **Database Configuration:** Double-check your database connection string in the backend's `appsettings.json` to ensure it points to your MySQL database instance.
* **Environment Variables:** Review both the frontend (`.env.local`) and backend (`appsettings.json`, `.env` if used) for any sensitive information or configuration that needs to be set up correctly.
* **File Storage:** The backend code saves uploaded files to a `wwwroot/uploads` directory within the `back-end` project. Ensure that the backend application has write permissions to this directory.

## Stopping the Servers

To stop the development servers:

* In the terminal where the frontend is running, press `Ctrl + C`.
* In the terminal where the backend is running, press `Ctrl + C`.