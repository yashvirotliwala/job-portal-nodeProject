# Job Portal Backend API

A role-based Job Portal backend built with **Node.js, Express.js, MongoDB and Mongoose**. The system allows recruiters to manage job postings, candidates to search and apply for jobs, and admins to manage users, categories and job approvals.

## Table of Contents

1. Project Overview
2. Features
3. Technology Stack
4. Project Structure
5. Requirements
6. Installation and Setup
7. Environment Variables
8. Running the Project
9. User Roles and Permissions
10. API Endpoints
11. Job Approval Workflow
12. Job Application Workflow
13. Testing with Postman
14. Error Handling
15. Security
16. Future Enhancements

## 1. Project Overview

The Job Portal is a backend application designed to simplify the recruitment process. It provides separate access and permissions for Admin, Recruiter and Candidate users.

Recruiters can create company profiles and job postings. Admins review job postings before they become visible to candidates. Candidates can browse approved jobs, submit applications with resumes and track their application status.

The project uses a modular structure so new features can be added in future versions.

## 2. Features

### Authentication and User Management
- User registration and login.
- Password hashing.
- JWT-based authentication.
- Role-based access control.
- Admin user management.
- Active and inactive account status.

### Company Management
- Create and update company profiles.
- Store company name, description, industry and location.
- Add website and company image.
- Restrict company management to authorized recruiters.

### Candidate Profile Management
- Create and update candidate profiles.
- Store skills, education and work experience.
- Maintain professional information.

### Job Category Management
- Create, view, update and delete categories.
- Organize jobs into categories such as Software Development, Design, Marketing, Finance and Sales.

### Job Management
- Create and edit job postings.
- Store job description, location, employment type and salary range.
- Store required skills and experience level.
- Set an application deadline.
- Restrict recruiters to managing their own jobs.
- Submit jobs for admin approval.

### Job Approval
- Support Draft, Pending, Approved and Rejected states.
- Allow admins to approve or reject submitted jobs.
- Store the rejection reason.
- Allow recruiters to edit rejected jobs and resubmit them.

### Job Applications
- Allow candidates to apply for approved jobs.
- Associate applications with candidates, jobs and resumes.
- Prevent duplicate applications.
- Allow recruiters to view applications for their own jobs.
- Allow candidates to view their application history.
- Track application statuses.

### Resume Management
- Store resume details.
- Support PDF/DOCX uploads when upload functionality is configured.
- Validate file types and file sizes.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | MongoDB object modelling |
| JWT | Authentication |
| bcrypt / bcryptjs | Password hashing |
| dotenv | Environment variables |
| Multer | File uploads, if configured |
| Postman | API testing |

## 4. Project Structure

The following is the recommended structure. File names may differ in the existing project.

```text
job-portal/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── companyController.js
│   ├── candidateController.js
│   ├── categoryController.js
│   ├── jobController.js
│   ├── resumeController.js
│   └── applicationController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── uploadMiddleware.js
├── models/
│   ├── User.js
│   ├── Company.js
│   ├── Candidate.js
│   ├── Category.js
│   ├── Job.js
│   ├── Resume.js
│   └── Application.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── companyRoutes.js
│   ├── candidateRoutes.js
│   ├── categoryRoutes.js
│   ├── jobRoutes.js
│   ├── resumeRoutes.js
│   └── applicationRoutes.js
├── uploads/
├── .env
├── .gitignore
├── package.json
├── server.js
├── index.js
└── createAdmin.js
```

The `server.js` or `index.js` file starts the application. Use whichever entry point is configured in `package.json`.

## 5. Requirements

Install the following before starting:

- Node.js and npm
- MongoDB local server or MongoDB Atlas account
- Visual Studio Code
- Postman

Check your installations:

```bash
node -v
npm -v
```

## 6. Installation and Setup

### Step 1: Get the project

Clone the repository or open your existing project folder in VS Code.

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd job-portal
```

Replace the repository URL with your actual GitHub repository URL. If the project is already on your computer, open its folder directly instead.

### Step 2: Install dependencies

Run this command from the folder containing `package.json`.

```bash
npm install
```

If the project does not already have the required dependencies, install the packages that its code uses. A typical setup may include:

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

Install Multer or other packages only if the project uses them. Check the existing `package.json` before adding dependencies.

### Step 3: Configure MongoDB

Start your local MongoDB service or create a MongoDB Atlas database.

Copy your database connection URL. Keep the URL private and store it in your `.env` file.

### Step 4: Create the environment file

Create a `.env` file in the project root.

Example:

```env
PORT=5000
MODE=DEVELOPMENT

DEV_DB_URL=mongodb://127.0.0.1:27017/job_portal
PRO_DB_URL=YOUR_MONGODB_ATLAS_CONNECTION_STRING

JWT_SECRET=YOUR_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=1d
```

Update the variable names to match those used by your actual code.

If your project uses `MODE` to select the database, ensure the value matches the condition in `db.js`. Never commit real database credentials or JWT secrets to GitHub.

### Step 5: Configure package.json scripts

Check the `scripts` section in your existing `package.json`. A typical configuration is:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

If your application starts from `index.js`, replace `server.js` with `index.js`. Keep the rest of your existing `package.json` fields and dependencies.

## 7. Running the Project

### Development mode

```bash
npm run dev
```

### Normal mode

```bash
npm start
```

If you have not configured scripts, you can run:

```bash
node server.js
```

After starting, check the terminal for the server and database connection messages.

For example, if the configured port is `5000`, the API base URL is:

```text
http://localhost:5000
```

If your application uses a prefix such as `/api`, include it in the endpoint URLs.

### Creating the Admin account

If the project contains a `createAdmin.js` script, inspect it and run:

```bash
node createAdmin.js
```

Use the environment variables and instructions expected by that script. Do not assume a default admin email or password unless your code explicitly defines one. Create the admin securely and avoid exposing admin credentials in the README.

## 8. User Roles and Permissions

| Feature | Admin | Recruiter | Candidate |
|---|---|---|---|
| Register and login | Login | Yes | Yes |
| Manage users | Yes | No | No |
| Manage account status | Yes | No | No |
| Manage company profile | As authorized | Own company | No |
| Manage candidate profile | As authorized | No | Own profile |
| Manage categories | Yes | No | No |
| Create job postings | As authorized | Yes | No |
| Edit own job postings | As authorized | Yes | No |
| Manage another recruiter's jobs | Yes | No | No |
| Approve or reject jobs | Yes | No | No |
| Browse approved jobs | Yes | Yes | Yes |
| Apply for jobs | No | No | Yes |
| View applications | All, if permitted | Own jobs | Own applications |
| Update application status | As authorized | Own jobs | No |

All permissions must be enforced by the backend, not only by the frontend.

## 9. API Endpoints

The following endpoint map is a proposed reference for the project. Verify each path against the actual route files before using it as a definitive API list.

Base URL:

```text
http://localhost:5000/api
```

For protected endpoints, send the JWT using the `Authorization: Bearer <token>` header.

### 9.1 Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Login and receive a JWT |
| GET | `/auth/me` | Get the current user's details |

Registration should accept only the roles permitted by the application. Public registration must not allow a user to create an Admin account.

### 9.2 User Management

Admin-only operations, except for any explicitly allowed self-service endpoint.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get a user by ID |
| PATCH | `/users/:id` | Update permitted user details |
| PATCH | `/users/:id/status` | Activate or deactivate an account |
| DELETE | `/users/:id` | Delete a user, if supported |

### 9.3 Company Management

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/companies` | Create a company profile |
| GET | `/companies` | List companies |
| GET | `/companies/:id` | Get company details |
| PATCH | `/companies/:id` | Update an owned company |
| DELETE | `/companies/:id` | Delete an owned company, if supported |

Recruiters should only be able to update or delete company records they own.

### 9.4 Candidate Profile Management

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/candidates/profile` | Create a candidate profile |
| GET | `/candidates/profile` | Get the logged-in candidate's profile |
| PATCH | `/candidates/profile` | Update the candidate's profile |
| GET | `/candidates/:id` | Get candidate details, subject to permissions |
| DELETE | `/candidates/profile` | Delete the profile, if supported |

### 9.5 Job Categories

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/categories` | Create a category |
| GET | `/categories` | List categories |
| GET | `/categories/:id` | Get category details |
| PATCH | `/categories/:id` | Update a category |
| DELETE | `/categories/:id` | Delete a category |

Category creation, editing and deletion should be restricted to Admin users.

### 9.6 Job Postings

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/jobs` | Create a job draft |
| GET | `/jobs` | List jobs according to access rules |
| GET | `/jobs/:id` | Get job details |
| PATCH | `/jobs/:id` | Update an owned job |
| DELETE | `/jobs/:id` | Delete an owned job, if supported |
| PATCH | `/jobs/:id/submit` | Submit a job for approval |
| PATCH | `/jobs/:id/approve` | Approve a job, Admin only |
| PATCH | `/jobs/:id/reject` | Reject a job, Admin only |
| GET | `/jobs/my-jobs` | List the recruiter's own jobs |
| GET | `/jobs/admin/all` | Admin views all jobs |

The exact workflow endpoints depend on the existing job routes. Candidates should only see approved jobs that are accepting applications.

### 9.7 Resume Management

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/resumes` | Create resume metadata, if supported |
| GET | `/resumes` | List the current user's resumes |
| GET | `/resumes/:id` | Get resume details |
| PATCH | `/resumes/:id` | Update resume metadata |
| DELETE | `/resumes/:id` | Delete an owned resume |
| POST | `/resumes/upload` | Upload a PDF/DOCX file, if implemented |

For actual file uploads, configure the endpoint to accept `multipart/form-data`. Validate file types and sizes on the server. Do not expose private resumes publicly.

### 9.8 Job Applications

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/applications/apply` | Apply for a job |
| GET | `/applications/my-applications` | Candidate views application history |
| GET | `/applications/recruiter` | Recruiter views applications for owned jobs |
| PATCH | `/applications/:applicationId/status` | Recruiter updates application status |
| GET | `/applications/admin/all` | Admin views all applications |

A candidate's application should contain the job reference, candidate reference, resume reference and current status. The backend should reject duplicate applications and verify resume ownership.

Recruiters must be checked against the owner of the job connected to each application.

## 10. Job Approval Workflow

The expected workflow is:

1. A recruiter creates a job in Draft status.
2. The recruiter completes the job details and submits it for approval.
3. The job moves to Pending.
4. An admin reviews the job.
5. The admin approves or rejects the job.
6. Approved jobs become visible to candidates.
7. Rejected jobs store a rejection reason.
8. The recruiter edits the rejected job and submits it again.

Suggested job statuses:

```text
Draft
Pending
Approved
Rejected
```

The actual status names must match the enum in the existing `Job` model.

## 11. Job Application Workflow

1. The candidate logs in.
2. The candidate browses approved jobs.
3. The candidate selects a job and an eligible resume.
4. The candidate submits the application.
5. The system stores the application with its initial status.
6. The recruiter views applications for their own jobs.
7. The recruiter updates the application status.
8. The candidate views the updated status in their application history.

Suggested application statuses:

```text
Applied
Under Review
Shortlisted
Rejected
Hired
```

The actual status values must match the `Application` model.

The backend should reject applications for unapproved jobs, expired deadlines and duplicate candidate-job combinations.

## 12. Testing with Postman

### Step 1: Start the server

```bash
npm run dev
```

### Step 2: Register and login

Call the registration endpoint for a Recruiter and a Candidate. Then call the login endpoint and copy each returned JWT.

Create the Admin account through the project's secure admin creation process.

### Step 3: Configure authentication

In Postman:

1. Open a request.
2. Select the **Authorization** tab.
3. Select **Bearer Token**.
4. Paste the JWT for the role being tested.

Use separate tokens for Admin, Recruiter and Candidate.

### Step 4: Test the main workflow

1. Admin creates job categories.
2. Recruiter creates a company profile.
3. Recruiter creates a job draft.
4. Recruiter submits the job for approval.
5. Admin approves the job.
6. Candidate creates a profile and saves a resume.
7. Candidate applies for the approved job.
8. Recruiter views the application.
9. Recruiter updates its status.
10. Candidate checks the updated status.

### Step 5: Test authorization

Check that:

- A Candidate cannot create or approve jobs.
- A Recruiter cannot update another recruiter's jobs.
- A Recruiter cannot update applications for another recruiter's jobs.
- A Candidate cannot read another candidate's application history.
- A Candidate cannot use another candidate's resume.
- An inactive user cannot access protected endpoints.
- A duplicate application is rejected.
- A job past its deadline cannot receive new applications.

### Expected HTTP status codes

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Missing or invalid authentication |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Duplicate application or conflict |
| 500 | Internal server error |

Actual status codes depend on the implementation.

## 13. Error Handling

The API should return clear error messages for invalid data, missing records, duplicate applications, expired job deadlines and unauthorized actions.

Example error response:

```json
{
  "success": false,
  "message": "You have already applied for this job"
}
```

Avoid exposing database credentials, JWT secrets, stack traces or other internal information in production responses.

## 14. Security

- Hash passwords before storing them.
- Verify JWT tokens on protected routes.
- Check roles and account status on every protected request.
- Validate MongoDB ObjectIds and request data.
- Enforce recruiter ownership for jobs and applications.
- Validate uploaded files and enforce file-size limits.
- Store secrets in environment variables.
- Keep `.env` and private uploaded files out of public GitHub repositories.
- Do not allow public registration to assign the Admin role.
- Prevent unauthorized access to resumes and personal data.

## 15. Future Enhancements

The first version focuses on the core recruitment workflow. Future versions may include:

- Email notifications.
- Online interviews.
- Recruiter-candidate chat.
- Automated resume screening.
- Recruitment analytics and reports.
- Pagination and advanced search.

These features are outside the initial scope.

## 16. Author

**Project:** Job Portal Backend API

**Purpose:** To manage job postings, recruiter and candidate profiles, job approvals, applications and application statuses through a role-based backend.

---

**Note:** Before publishing this README, compare the endpoint table, model names, environment variables and npm scripts with the actual source code. Remove or update any endpoints that have not been implemented.
