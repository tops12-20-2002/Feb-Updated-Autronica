# Production Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Configuration Files
- [ ] Copy `config.production.php` to `config.php` and update all values
- [ ] Generate strong JWT secret: `openssl rand -hex 32`
- [ ] Set secure database credentials
- [ ] Update `CORS_ORIGIN` to production frontend URL
- [ ] Update `BASE_URL` to production backend URL
- [ ] Set `display_errors = 0` in config.php
- [ ] Create `logs/` directory with write permissions

### Frontend Configuration
- [ ] Create `.env.production` with `REACT_APP_API_URL`
- [ ] Update `frontend/src/config.js` if needed
- [ ] Build production bundle: `cd frontend && npm run build`
- [ ] Test production build locally

### Security
- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Verify `.htaccess` is in place
- [ ] Ensure `config.php` is in `.gitignore`
- [ ] Review CORS settings
- [ ] Enable HTTPS/SSL (recommended)

### Database
- [ ] Backup existing database
- [ ] Create production database
- [ ] Import `database.sql`
- [ ] Run `database_migration.sql` if needed
- [ ] Create database user with limited privileges
- [ ] Test database connection

### Code Quality
- [ ] Remove any test/debug code
- [ ] Review error messages (shouldn't expose sensitive info)
- [ ] Test all user flows
- [ ] Verify role-based access control works
- [ ] Test API endpoints

### Dependencies
- [ ] Run `composer install --no-dev` for backend
- [ ] Run `npm install` for frontend
- [ ] Verify all dependencies are production-ready

## Deployment

### Backend
- [ ] Upload backend files to server
- [ ] Set correct file permissions (755 for directories, 644 for files)
- [ ] Verify `vendor/` directory is uploaded
- [ ] Test API endpoints are accessible
- [ ] Check error logs are working

### Frontend
- [ ] Upload `frontend/build/` contents to web server
- [ ] Configure web server routing (all routes → index.html)
- [ ] Verify static assets load correctly
- [ ] Test API connection from frontend

### Database
- [ ] Import production database
- [ ] Update `config.php` with production DB credentials
- [ ] Test database connection
- [ ] Verify all tables exist

## Post-Deployment

### Testing
- [ ] Test user registration
- [ ] Test user login
- [ ] Test admin dashboard access
- [ ] Test mechanic dashboard access
- [ ] Test role-based access control (admin can't access mechanic dashboard)
- [ ] Test inventory CRUD operations
- [ ] Test job order CRUD operations
- [ ] Test dashboard statistics
- [ ] Test logout functionality

### Monitoring
- [ ] Set up error logging
- [ ] Monitor API response times
- [ ] Check for console errors in browser
- [ ] Verify database performance
- [ ] Set up automated backups

### Documentation
- [ ] Document production URLs
- [ ] Document database credentials (securely)
- [ ] Document any custom configurations
- [ ] Create rollback plan

## Security Review

- [ ] HTTPS is enabled
- [ ] JWT secret is strong and unique
- [ ] Database passwords are strong
- [ ] CORS is properly configured
- [ ] Error messages don't expose sensitive info
- [ ] File permissions are correct
- [ ] Sensitive files are protected (.htaccess)
- [ ] No debug code in production

## Performance

- [ ] Frontend bundle is optimized
- [ ] Images are optimized
- [ ] Database indexes are in place
- [ ] API responses are reasonable size
- [ ] Caching is configured (if applicable)

## Final Steps

- [ ] All tests pass
- [ ] No errors in logs
- [ ] Users can access the system
- [ ] All features work as expected
- [ ] Backup system is in place
- [ ] Monitoring is set up

---

**Remember**: Always test in a staging environment first before deploying to production!

