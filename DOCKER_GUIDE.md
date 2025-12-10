# 🐳 Docker Setup Guide

## Quick Start (Recommended)

### Windows
```powershell
# Double-click this file or run:
.\docker-manager.bat
```
Select option **1** for first-time setup.

### Manual Commands
```powershell
# Start everything (first time)
docker-compose up -d --build

# Wait for database to be ready (10 seconds)
Start-Sleep -Seconds 10

# Run migrations
docker-compose exec app npx prisma migrate dev --name init

# View logs
docker-compose logs -f
```

## What's Running?

| Service | Port | URL | Credentials |
|---------|------|-----|-------------|
| Next.js App | 3000 | http://localhost:3000 | - |
| PostgreSQL 18 | 5432 | localhost:5432 | postgres/postgres |
| pgAdmin | 5050 | http://localhost:5050 | admin@trth.local/admin |

## Common Commands

### Start/Stop Services
```powershell
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs (live)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f app
docker-compose logs -f postgres
```

### Database Management

#### Using pgAdmin (GUI)
1. Open http://localhost:5050
2. Login: `admin@trth.local` / `admin`
3. Add New Server:
   - Name: `TRTH Local`
   - Host: `postgres`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`

#### Using psql (Command Line)
```powershell
# Connect to database
docker exec -it trth-postgres psql -U postgres -d trth_assessment

# Inside psql:
\dt              # List tables
\d employees     # Describe employees table
SELECT * FROM employees LIMIT 10;
\q               # Quit
```

#### Using Prisma Studio (GUI)
```powershell
# Start Prisma Studio
docker-compose exec app npx prisma studio

# Opens at http://localhost:5555
```

### Prisma Commands

```powershell
# Generate Prisma Client
docker-compose exec app npx prisma generate

# Run migrations
docker-compose exec app npx prisma migrate dev

# Reset database (warning: deletes all data)
docker-compose exec app npx prisma migrate reset

# Seed database with sample data
docker-compose exec app npm run db:seed

# Open Prisma Studio
docker-compose exec app npx prisma studio
```

### Development

```powershell
# Hot reload is enabled - just edit files and save
# Changes will be reflected immediately

# If you need to rebuild:
docker-compose up -d --build app

# If dependencies changed:
docker-compose exec app npm install
docker-compose restart app
```

## Troubleshooting

### Port Already in Use
```powershell
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5432
netstat -ano | findstr :5050

# Stop the process or change port in docker-compose.yml
```

### Database Connection Issues
```powershell
# Check if database is ready
docker-compose ps
docker-compose logs postgres

# Restart database
docker-compose restart postgres

# Wait 10 seconds then try again
```

### App Won't Start
```powershell
# Check logs
docker-compose logs app

# Common fixes:
docker-compose exec app npx prisma generate
docker-compose restart app
```

### Clean Slate (Reset Everything)
```powershell
# Stop and remove everything including data
docker-compose down -v

# Start fresh
docker-compose up -d --build
```

## Environment Variables

Edit `.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trth_assessment?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## Data Persistence

Data is stored in Docker volumes:
- `postgres_data` - Database files
- `pgadmin_data` - pgAdmin settings

To backup data:
```powershell
# Backup database
docker exec trth-postgres pg_dump -U postgres trth_assessment > backup.sql

# Restore database
docker exec -i trth-postgres psql -U postgres trth_assessment < backup.sql
```

## Production Deployment

For production, use separate docker-compose.prod.yml with:
- Environment-specific configs
- Production-grade secrets
- SSL certificates
- Proper volumes
- Resource limits

## Tips

1. **First run takes 5-10 minutes** (downloading images)
2. **Use pgAdmin** for visual database management
3. **Use Prisma Studio** for quick data editing
4. **Check logs** if something doesn't work
5. **docker-manager.bat** has all common tasks

## Need Help?

Check logs first:
```powershell
docker-compose logs -f
```

Common issues usually show up there!
