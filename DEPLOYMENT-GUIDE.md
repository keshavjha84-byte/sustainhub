# SustainHub - Deployment Guide
# ================================

## PHASE 1: Free Demo (Vercel + Free Domain)

### Step 1: Push to GitHub
```bash
# On your local machine after extracting the archive:
cd sustainhub
git init
git add .
git commit -m "Initial commit: SustainHub ESG Platform"

# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/sustainhub.git
git push -u origin main
```

### Step 2: Deploy to Vercel (FREE)
1. Go to https://vercel.com and sign up with your GitHub account
2. Click "New Project" > Import your sustainhub repo
3. Framework Preset: Next.js (auto-detected)
4. Root Directory: . (leave default)
5. Environment Variables (add these):
   - `NEXTAUTH_SECRET` = generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` = leave blank (Vercel sets it automatically)
   - `DATABASE_URL` = `file:./db/custom.db`
6. Click "Deploy"

### Step 3: Get Your Free Domain
Vercel gives you a free subdomain like: `sustainhub-xxx.vercel.app`
You can use this for your CEO demo.

### Step 4: Setup Database on Vercel
Vercel's serverless functions are read-only for the filesystem.
For a demo, you need an external database:

**Option A: Turso (FREE - Recommended)**
1. Go to https://turso.tech and sign up (free tier = 500MB)
2. Create a database: `turso db create sustainhub`
3. Get your URL: `turso db show sustainhub --url`
4. Create auth token: `turso db tokens create sustainhub`
5. Update Vercel env var:
   - `DATABASE_URL` = `libsql://sustainhub-xxx.turso.io?authToken=your-token`

**Option B: Supabase (FREE)**
1. Go to https://supabase.com and create a free project
2. Go to Settings > Database > Connection string (URI)
3. Copy the connection string and set as `DATABASE_URL` in Vercel

### Step 5: Run Prisma Migrations
After setting up the database, go to Vercel > Settings > Environment Variables
and add a build command override or use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Set env vars locally
vercel env pull .env.local

# Push Prisma schema to database
npx prisma db push

# Redeploy
vercel --prod
```

### Step 6: Test
Visit your Vercel URL. Register, onboard, test all features.

---

## PHASE 2: Production (Hostinger + Real Domain)

### Option A: Hostinger VPS Hosting
Best for full control. VPS starts at ~RM25/month.

1. **Buy Hostinger VPS** at https://hostinger.com/vps-hosting
   - Choose KVM 1 plan (2GB RAM is sufficient)
   - Select a data center near Malaysia (Singapore or India)

2. **Setup the Server**
```bash
# SSH into your VPS
ssh root@your-server-ip

# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt-get install -y nginx
```

3. **Deploy the App**
```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/sustainhub.git
cd sustainhub

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values:
# NEXTAUTH_SECRET=generated-secret
# NEXTAUTH_URL=https://yourdomain.com
# DATABASE_URL=file:./db/custom.db  (or PostgreSQL)

# Push database schema
npx prisma db push

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "sustainhub" -- start
pm2 save
pm2 startup
```

4. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/sustainhub
```
Paste this (replace yourdomain.com):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/sustainhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. **Setup SSL (Free with Let's Encrypt)**
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

6. **Connect Your Domain**
   - Buy domain from Hostinger, Namecheap, or any registrar
   - Point A record to your VPS IP
   - DNS propagation takes 1-24 hours

### Option B: Hostinger Web Hosting (Shared)
If using shared hosting (cheaper but limited):

1. Use **Hostinger Website Builder** won't work for Next.js
2. Instead use Hostinger VPS (above) or deploy to Vercel with custom domain

### Connecting Custom Domain to Vercel (Easiest Production Path)
If you want Hostinger domain + Vercel hosting:

1. Buy domain on Hostinger
2. In Vercel > Project > Settings > Domains
3. Add your domain
4. Vercel gives you DNS records to add
5. Go to Hostinger > DNS > Add these records:
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
   - Type: A, Name: @, Value: 76.76.21.21
6. Wait for DNS propagation (1-24 hours)
7. Vercel auto-provisions SSL

---

## RECOMMENDED DEPLOYMENT PLAN

| Phase | Hosting | Database | Domain | Cost |
|-------|---------|----------|--------|------|
| Demo (now) | Vercel Free | Turso Free | *.vercel.app | RM0 |
| Production | Vercel Pro OR Hostinger VPS | Turso/Supabase | Real domain | RM30-100/mo |

### My Recommendation for CEO Demo:
1. Deploy to **Vercel Free** with **Turso Free** database
2. Use the free `*.vercel.app` URL
3. This costs RM0 and takes 15 minutes to set up
4. Your CEO sees a working, live product on a real URL

### My Recommendation for Production:
1. Buy domain (~RM50-100/year from Namecheap/Hostinger)
2. Deploy on **Vercel Pro** ($20/month) for best Next.js performance
3. OR deploy on **Hostinger VPS** (~RM25/month) for full control
4. Use **Turso** (free tier) or **Supabase** (free tier) for database

---

## QUICK START (LOCAL)

```bash
# Extract the archive
tar -xzf sustainhub-source.tar.gz
cd sustainhub

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env - set NEXTAUTH_SECRET (openssl rand -base64 32)

# Push database
npx prisma db push

# Run development server
npm run dev

# Open http://localhost:3000
```

## TROUBLESHOOTING

**Database on Vercel**: Vercel's filesystem is read-only. You MUST use an external
database (Turso, Supabase, PlanetScale, or a VPS with PostgreSQL).

**Build fails**: Make sure Node.js version is 18+ (Vercel uses 18.x by default).

**Port already in use**: Change port in package.json scripts or kill the process:
`lsof -ti:3000 | xargs kill`

**Prisma error**: Run `npx prisma generate` then `npx prisma db push`.