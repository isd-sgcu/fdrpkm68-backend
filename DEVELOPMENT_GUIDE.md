# 🚨 CRITICAL: Backend Development Guide for Frontend Integration

## ⚠️ BREAKING CHANGES - READ BEFORE CODING

This backend has been adapted to work with a **dual-environment frontend** with strict routing conventions. **Violating these rules will break the entire system.**

---

## 🔥 THE GOLDEN RULE: NO /api PREFIX IN BACKEND ROUTES

### ❌ WRONG - This will break everything:
```typescript
// DON'T DO THIS
app.post('/api/register', handler);
app.get('/api/events', handler);
router.post('/api/auth/login', handler);
```

### ✅ CORRECT - This is how routes must be defined:
```typescript
// DO THIS
app.post('/register', handler);
app.get('/events', handler);
router.post('/auth/login', handler);
```

### Why? Here's how the routing works:
1. **Frontend calls**: `fetch('/api/register')`
2. **Load Balancer**: Strips `/api` → forwards `/register`
3. **Backend receives**: `/register` (NOT `/api/register`)

---

## 🏗️ Current Route Structure

All routes are mounted at root (`/`) in `src/app.ts`:

```typescript
app.use('/', apiRoutes);  // ✅ Correct
```

Your actual routes become:
- `POST /auth/login` (not `/api/auth/login`)
- `GET /users` (not `/api/users`)
- `POST /checkin` (not `/api/checkin`)
- `GET /health` (required health check)

---

## 🌐 Environment Configuration

### Port Requirements
```typescript
// Backend MUST run on port 8080
const PORT = config.PORT || 8080;  // ✅ Already configured
```

### CORS Configuration
```typescript
// Frontend domains are pre-configured
app.use(cors({
  origin: [
    'http://localhost:4321',           // Local frontend
    'https://dev.freshmenfest2025.com', // Dev frontend  
    'https://freshmenfest2025.com'      // Prod frontend
  ]
}));
```

---

## 🔧 Required Environment Variables

### Development (.env.local)
```bash
# Server Configuration
PORT=8080

# Database Configuration (Full URL - preferred)
DATABASE_URL="postgresql://postgres:admin@localhost:5433/mydb"

# JWT Configuration
SECRET_JWT_KEY=secret-example

# Redis Configuration (Full URL - preferred)
REDIS_URL="redis://default:changeme@localhost:6379"

# Environment
NODE_ENV=development

# Production URL (for production environment)
PRODUCTION_BASE_URL=https://freshmenfest2025.com

# Legacy individual variables (still supported for local dev)
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=admin
DB_NAME=mydb
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=changeme
REDIS_USER=default
```

### Production (GitHub Secrets)
```bash
# Database
PROD_DATABASE_URL=postgresql://user:pass@host:port/db

# JWT
PROD_SECRET_JWT_KEY=production-jwt-secret

# Redis
PROD_REDIS_URL=redis://user:pass@host:port

# GCP
GCP_SA_KEY={service account JSON}
```

---

## 🚀 Deployment Architecture

### Cloud Run Services
- **Development**: `freshmenfest2025-dev-api`
- **Production**: `freshmenfest2025-api`

### Branch Strategy
```
feature/* → dev (auto-deploy to dev environment)
dev → main (manual approval → production)
```

### Docker Requirements
```dockerfile
# Backend MUST expose port 8080
EXPOSE 8080
ENV PORT=8080
```

---

## 🩺 Health Check Endpoint

**REQUIRED**: The `/health` endpoint is mandatory for load balancer health checks:

```typescript
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
```

---

## 📝 Development Workflow

### Adding New Routes
1. **Define routes WITHOUT `/api` prefix**:
   ```typescript
   // In userRoutes.ts
   router.get('/profile', getUserProfile);  // ✅ Correct
   router.post('/update', updateUser);      // ✅ Correct
   ```

2. **Frontend will call with `/api` prefix**:
   ```typescript
   // Frontend code
   await fetch('/api/users/profile');  // Load balancer strips /api
   await fetch('/api/users/update');   // Backend receives /users/update
   ```

### Testing Locally
```bash
# Backend runs on 8080
npm run dev

# Frontend proxy configuration (in frontend repo)
# Vite automatically proxies /api/* to http://localhost:8080
```

---

## 🌍 Environment URLs

### Development
- **Frontend**: https://dev.freshmenfest2025.com
- **API**: https://dev.freshmenfest2025.com/api/*
- **Health Check**: https://dev.freshmenfest2025.com/api/health

### Production  
- **Frontend**: https://freshmenfest2025.com
- **API**: https://freshmenfest2025.com/api/*
- **Health Check**: https://freshmenfest2025.com/api/health

---

## ⚡ Quick Reference

### Route Definition Checklist
- [ ] No `/api` prefix in backend route definitions
- [ ] Routes mounted at `/` (not `/api`)
- [ ] Health endpoint at `/health` implemented
- [ ] Port 8080 configured
- [ ] CORS allows frontend domains

### Common Mistakes to Avoid
1. ❌ Adding `/api` prefix to routes
2. ❌ Changing port from 8080
3. ❌ Modifying CORS origins without updating frontend
4. ❌ Removing health endpoint
5. ❌ Not following branch strategy (dev → main)

---

## 🆘 Troubleshooting

### "CORS Error"
- Check frontend URL is in CORS origins list
- Verify frontend is calling correct domain

### "404 Not Found"  
- Ensure route is defined WITHOUT `/api` prefix
- Check route is properly mounted in `src/routes/index.ts`

### "Health Check Failed"
- Verify `/health` endpoint returns 200 status
- Check Cloud Run service is listening on port 8080

---

## 🔒 Security Notes

- All environment variables are managed through GitHub Secrets
- Never commit sensitive data to repository
- JWT secrets are environment-specific
- Database URLs are environment-specific

---

**Remember: The frontend is already deployed and working. The backend just needs to follow these conventions for everything to work seamlessly! 🎯**