# User Api

# General Purpose

The `User API` is designed to perform essential tasks related to user authentication and management within the system. The key functionalities include:

- **User Login**:
The User API facilitates user login by providing specific routes that are called by the UI. This process allows users to securely log in using their credentials, specifically utilizing Lightweight Directory Access Protocol (LDAP) data for authentication.

- **LDAP Tags**:
Upon the user's initial login, the User API retrieves LDAP data to fetch all relevant tags. Subsequently, these tags are associated with the user's profile. This ensures that, during the first login, the system gathers LDAP-related information and assigns appropriate tags to the user, enhancing the user's profile with relevant data.



## Getting Started

### Prerequisite 

- Node.js Version 16
- npm Version 8

### Dev-Setup

1. Clone the repo
```bash
  git clone git@github.com:News-Center/ldap-authenticator.git 
```
2. Install dependencies
```bash
  npm install
```
3. Setup your .env file (For a Quickstart copy the example from the `.env.example` file)
4. Start the application
```bash
  make up
```
5. While the Application is running run the migrations against your database
```bash
  npx prisma migrate dev
```

# Production-Setup

Use `news-kraken` to deploy the entire application to a server. For more information see refer to the news-kraken repository.

