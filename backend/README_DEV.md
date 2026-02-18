Local development MongoDB — quick guide

If MongoDB Atlas blocks connections (IP whitelist, TLS issues), you can run a local MongoDB instance for development.

1) Start MongoDB with Docker Compose (from project root):

```bash
# from /home/navgurkul/Desktop/feb 10-2
docker-compose up -d
```

This will start a MongoDB server on `localhost:27017` and persist data to a Docker volume named `mongo_data`.

2) Update your `backend/.env` to use the local MongoDB URI (for development):

```
MONGODB_URI=mongodb://localhost:27017/portfolio-generator
```

3) Restart the backend server

```bash
cd backend
# if you have nodemon setup
npm run dev
# or
npm start
```

4) Verify health endpoint

```bash
curl -sS http://localhost:5000/api/health | jq
```

You should see `"checks": { "database": "OK" }` and an overall status of `OK`.

Notes
- This is intended for local development/debugging only. Do not use local MongoDB in production.
- To switch back to Atlas, update `MONGODB_URI` in `backend/.env` to your Atlas connection string and restart the backend.
- If you prefer a single command without docker-compose installed, you can run:
  `docker run -d -p 27017:27017 --name mongodb mongo:latest`
