# Notes App

Copy `backend/.env.example` to `backend/.env` and provide a new, rotated MongoDB Atlas connection string and a long `ACCESS_TOKEN_SECRET`. Copy `frontend/.env.example` to `frontend/.env` if the API is not running at `http://localhost:8000`.

Install all dependencies with `npm run install:apps`, then start both applications with `npm run dev`.

Backend variables: `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`, `CORS_ORIGIN`, and `PORT`. The first two are required. Frontend variable: `VITE_API_URL`.
