# Ultimate Trivia Game

A real-time trivia game application built with Next.js (frontend) and FastAPI (backend). Create game rooms, join with friends, and test your knowledge!

## Project Structure

```
ultimate-trivia/
├── frontend/          # Frontend React components and utilities
│   ├── components/    # React components
│   └── lib/          # Frontend utilities (API client)
├── app/              # Next.js routes (App Router)
├── backend/          # Python FastAPI backend
│   ├── redis/          # Database models, store, and client
│   └── apis/        # API endpoints and business logic
```

## Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Python** 3.14+
- **Redis** (for database - can use local Redis or cloud service like Redis Cloud, Upstash)

## Getting Started

### 1. Frontend Setup

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend Setup

#### a. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### b. Install Dependencies

```bash
pip install -r requirements.txt
```

#### c. Install and Configure Redis

**Option 1: Local Redis (Recommended for Development)**

Install Redis on your system:

- **macOS**: `brew install redis` then `brew services start redis`
- **Linux**: `sudo apt-get install redis-server` (Ubuntu/Debian) or `sudo yum install redis` (CentOS/RHEL)
- **Windows**: Download from [Redis for Windows](https://github.com/microsoftarchive/redis/releases) or use WSL

Start Redis:
```bash
redis-server
```

**Option 2: Redis Cloud (For Production)**

1. Sign up for [Redis Cloud](https://redis.com/try-free/) or [Upstash](https://upstash.com/)
2. Create a database and get your connection URL

#### d. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

**For Local Redis:**
```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
# REDIS_PASSWORD=  # Leave empty for local Redis without password
```

**For Redis Cloud/Upstash:**
```
REDIS_URL=redis://default:your-password@your-redis-host:6379
# Or for Redis Cloud:
# REDIS_URL=rediss://default:your-password@your-redis-host:6379
```

**Additional Required Variables:**
```
GEMINI_MODEL_NAME=gemini-2.0-flash
GEMINI_API_KEY=your-gemini-api-key
```

#### e. Run the Backend Server

```bash
cd backend
source venv/bin/activate  # If not already activated
uvicorn apis.main:app --reload --port 8000
```

The API will be available at [http://localhost:8000](http://localhost:8000)

### 3. Environment Variables

Make sure the frontend knows where the backend is:

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the Full Application

You need to run both frontend and backend:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn apis.main:app --reload --port 8000
```

## API Documentation

Once the backend is running, you can access:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Additional Documentation

- **Backend API Docs**: See `backend/README.md` for API endpoint documentation

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Redis Documentation](https://redis.io/docs)
