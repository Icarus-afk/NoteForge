# NoteForge

**NoteForge** is a powerful note management system built with Node.js, Express, and MongoDB. It offers user authentication, secure file uploads, and note handling with options to create, update, and delete notes. Google OAuth is available for easy authentication, and JWT tokens are used for session management. Uses Google Storage bucket to store and retrieve files.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [APIs](#apis)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Process Management](#process-management)
- [Future Improvements](#future-improvements)

## Getting Started

### Prerequisites

- Node.js v14+
- MongoDB
- PM2 (for process management)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/noteforge.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root of the project and configure the following variables:
    ```
    MONGO_URI=your_mongo_connection_string
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

4. Start the server:
    ```bash
    pm2 start index.js
    ```

## Features

- User authentication (JWT, Google OAuth)
- Secure file uploads with Multer
- Create, update, delete, and retrieve notes
- Organize notes in folders
- User profiles with custom avatars
- Admin functionality for user management

## APIs

### User Routes

- `POST /signin`: Sign in the user
- `POST /signup`: Register a new user
- `POST /refresh-token`: Refresh the authentication token
- `DELETE /:id`: Delete a user by ID
- `PATCH /:id`: Update user details
- `GET /auth/google`: Google OAuth authentication

### Note Routes

- `POST /create`: Create a new note
- `GET /get`: Retrieve user notes
- `PUT /update/:id`: Update a note by ID
- `DELETE /delete/:id`: Delete a note by ID
- `GET /get/file/:id`: Retrieve a file associated with a note

## Database Models

### User Model

```javascript
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  phoneNumber: { type: String },
  isAdmin: { type: Boolean, default: false },
  userImage: { type: String },
  isActive: { type: Boolean, default: false, required: true },
  bio: { type: String }, 
  interests: [{ type: String }], 
  joinedAt: { type: Date, default: Date.now },
  googleId: { type: String },
});

```

### Folder Model
# NoteForge

**NoteForge** is a powerful note management system built with Node.js, Express, and MongoDB. It offers user authentication, secure file uploads, and note handling with options to create, update, and delete notes. Google OAuth is available for easy authentication, and JWT tokens are used for session management.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [APIs](#apis)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Process Management](#process-management)
- [Future Improvements](#future-improvements)

## Getting Started

### Prerequisites

- Node.js v14+
- MongoDB
- PM2 (for process management)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/noteforge.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root of the project and configure the following variables:
    ```
    MONGO_URI=your_mongo_connection_string
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

4. Start the server:
    ```bash
    pm2 start index.js
    ```

## Features

- User authentication (JWT, Google OAuth)
- Secure file uploads with Multer
- Create, update, delete, and retrieve notes
- Organize notes in folders
- User profiles with custom avatars
- Admin functionality for user management

## APIs

### User Routes

- `POST /signin`: Sign in the user
- `POST /signup`: Register a new user
- `POST /refresh-token`: Refresh the authentication token
- `DELETE /:id`: Delete a user by ID
- `PATCH /:id`: Update user details
- `GET /auth/google`: Google OAuth authentication

### Note Routes

- `POST /create`: Create a new note
- `GET /get`: Retrieve user notes
- `PUT /update/:id`: Update a note by ID
- `DELETE /delete/:id`: Delete a note by ID
- `GET /get/file/:id`: Retrieve a file associated with a note

## Database Models

### User Model

```javascript
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  phoneNumber: { type: String },
  isAdmin: { type: Boolean, default: false },
  userImage: { type: String },
  isActive: { type: Boolean, default: false, required: true },
  bio: { type: String }, 
  interests: [{ type: String }], 
  joinedAt: { type: Date, default: Date.now },
  googleId: { type: String },
});
```

### Folder Model

```javascript
const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
}, { timestamps: true });
``` 

### Note Model

```javascript
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /https?:\/\/[^\s]+/i.test(v);  
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
```


### Middleware

- **Auth Middleware:** Protect routes using JWT tokens.
- **Password Strength Middleware:** Ensures strong passwords on user registration.
- **Multer:** Handles file uploads and storage in memory.

## Process Management

Use PM2 to manage the server process:

- Start the server:
    ```bash
    pm2 start index.js
    ```
- Check the status:
    ```bash
    pm2 list
    ```
- Restart the server:
    ```bash
    pm2 restart index.js
    ```
- Stop the server:
    ```bash
    pm2 stop index.js
    ```
- Delete the server process from PM2:
    ```bash
    pm2 delete index.js
    ```

## Future Improvements

- [ ] **Add Tests**: Write unit and integration tests using Jest.
- [✓] **Implement Pagination**: Add pagination for retrieving large datasets.
- [✓] **Improve Error Handling**: Enhance error handling for specific cases.
- [✓] **Add Caching**: Use Redis for caching frequently accessed data.
- [ ] **Dockerize the Application**: Implement Docker for containerized deployment.
