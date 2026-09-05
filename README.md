# HireFlow

HireFlow is a web-based recruitment platform that connects companies and candidates through a centralized hiring system.

The platform provides separate functionalities for **Candidates, Companies, and Administrators**, with role-based authentication and access control.


## Key Features

- Candidate registration and profile management
- Company registration and profile management
- Admin dashboard for managing users and companies
- Email verification for user accounts
- JWT-based authentication
- Role-based access control
- Company approval and rejection management
- User account activation and suspension management
- Password reset functionality
- Google authentication
- Candidate resume upload
- Candidate profile picture upload
- Company document and logo upload
- AI-powered resume functionality
- AI-powered interview functionality
- Credit-based AI interview usage

## User Roles

### Candidate

Candidates can:

- Create an account and verify their email
- Complete and manage their profile
- Upload a profile picture
- Upload and manage their resume
- Access candidate-specific features
- Use AI-powered resume functionality
- Participate in AI-powered interviews using credits

### Company

Companies can:

- Create a company account
- Complete their company profile
- Upload company logo and verification documents
- Wait for admin approval
- Access company-specific features after approval
- Use the recruitment functionality provided by the platform

### Admin

Administrators can:

- Access the admin dashboard
- View and manage candidates
- View and manage companies
- Review pending company registrations
- Approve or reject companies
- Suspend and reactivate user accounts
- Access admin-only functionality


## Technology Stack

### Frontend

- React.js
- React Router
- Axios
- Tailwind CSS
- Sonner
- Google OAuth

### Backend

- Django
- Django REST Framework
- Simple JWT
- PostgreSQL

### Storage & Services

- Cloudinary for media storage
- Gmail SMTP for email services
- Google OAuth for authentication

### Development Tools

- Git
- GitHub
- VS Code

## Project Architecture

HireFlow follows a layered architecture to keep the application organized and maintainable.

### Frontend Architecture

The frontend is built using React and is organized into:

- Pages
- Components
- Routes
- Services
- Utilities

### Backend Architecture

The backend is built using Django REST Framework and follows a layered structure:

- Views
- Services
- Repositories
- Serializers
- Models

The **View** layer handles HTTP requests and responses.

The **Service** layer contains the application/business logic.

The **Repository** layer handles database-related operations.

The **Serializer** layer handles data validation and serialization.

The **Model** layer defines the database entities and relationships.


## Authentication & Authorization

HireFlow uses JWT (JSON Web Token) based authentication to securely authenticate users.

The authentication system supports:

- Email and password authentication
- Google authentication
- JWT access and refresh tokens
- Token refresh mechanism
- Email verification
- Password reset
- Logout and token blacklisting

### Role-Based Access Control

Users are assigned one of the following roles:

- `CANDIDATE`
- `COMPANY`
- `ADMIN`

Access to protected pages and APIs is restricted according to the user's role.

For example:

- Candidate users cannot access company or admin functionality.
- Company users cannot access admin functionality.
- Admin users can access admin-only functionality.

Protected backend APIs use authentication and role-based permissions to prevent unauthorized access.



## API Structure

The backend exposes REST APIs for authentication, candidate operations, company operations, and admin operations.

### Authentication APIs

```text```
/api/auth/


## Database

HireFlow uses **PostgreSQL** as its relational database.

The backend uses Django ORM to manage database models and relationships.

The main entities include:

- User
- Candidate Profile
- Candidate Job Preferences
- Company
- Company-related recruitment data
- AI interview and related data

Database operations are handled through Django models, repositories, and services to maintain separation of responsibilities.


## Environment Configuration

Sensitive information and environment-specific configuration values are stored in environment variables instead of being hardcoded in the source code.

### Backend Environment Variables

```text```
SECRET_KEY
DEBUG
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT
EMAIL_HOST
EMAIL_PORT
EMAIL_HOST_USER
EMAIL_HOST_PASSWORD
DEFAULT_FROM_EMAIL
GOOGLE_CLIENT_ID
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET


## Installation & Setup

### Backend

1. Navigate to the `backend` directory.
2. Create and activate a Python virtual environment.
3. Install dependencies using:

```bash```
pip install -r requirements.txt



## Project Structure

```text```
HireFlow/
├── backend/
│   ├── hireflow/
│   ├── users/
│   ├── user_auth/
│   ├── candidate_app/
│   ├── company_app/
│   ├── admin_app/
│   └── core/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── utils/
│
└── README.md



## Security & Access Control

HireFlow implements authentication and authorization to protect user data and application resources.

- JWT is used for user authentication.
- Access tokens are used to access protected APIs.
- Refresh tokens are used to obtain new access tokens.
- User access is controlled based on their assigned role.
- Admin-only APIs are protected from unauthorized users.
- Company accounts are restricted from accessing admin functionality.
- Sensitive configuration values are stored in environment variables.
- Passwords are securely handled using Django's authentication system.



## Project Status

HireFlow is currently under active development.

The core authentication, candidate, company, and admin functionalities have been implemented. Additional recruitment and AI-powered features are being developed and integrated as part of the project roadmap.




