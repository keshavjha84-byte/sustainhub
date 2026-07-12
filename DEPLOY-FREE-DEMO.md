# SustainHub - FREE Demo Deployment Guide
# ========================================
# Cost: RM 0 | Time: 15-20 minutes | Platform: Vercel + Neon
#
# Kya chahiye: GitHub account, PC/laptop, internet
# Kya milega: https://sustainhub-xxx.vercel.app (live website)
# ================================================================


# ============================================
# STEP 1: LOCAL SETUP (5 minutes)
# ============================================
# Apne computer pe ye karo:

# 1a. Extract the downloaded files
# -------------------------------
# tar -xzf sustainhub-source.tar.gz
# cd sustainhub

# 1b. Install dependencies
# -------------------------
# npm install
# (ya bun install agar bun use karte ho)

# 1c. Test locally (optional, verify sab kaam kar raha hai)
# ---------------------------------------------------------
# cp .env.example .env
# openssl rand -base64 32   (ye secret copy karo .env mein)
# npx prisma db push
# npm run dev
# Open http://localhost:3000


# ============================================
# STEP 2: GITHUB PE UPLOAD KARO (3 minutes)
# ============================================

# 2a. GitHub pe naya repo banao
# -----------------------------
# 1. https://github.com pe jao
# 2. Sign up / Login
# 3. Top right "+" button > "New repository"
# 4. Repository name: sustainhub
# 5. "Public" select karo (Private bhi chal jayega)
# 6. "Create repository" click karo
# 7. NOTE: "sustainhub" repo name yaad rakho, next steps mein use hoga

# 2b. Apne local folder se GitHub pe push karo
# ---------------------------------------------
# Terminal/CMD open karo sustainhub folder mein, phir ye run karo:
#
# git init
# git add .
# git commit -m "Initial commit: SustainHub ESG Platform"
# git branch -M main
# git remote add origin https://github.com/YOUR_USERNAME/sustainhub.git
# git push -u origin main
#
# IMPORTANT: YOUR_USERNAME ko apne GitHub username se replace karo
# Example: git remote add origin https://github.com/ahmedkhan/sustainhub.git


# ============================================
# STEP 3: NEON DATABASE BANAO (FREE) (3 minutes)
# ============================================
# Vercel pe SQLite nahi chalta (filesystem read-only hai)
# Isliye hum Neon PostgreSQL use karenge (FREE - 0.5GB)

# 3a. Neon account banao
# ----------------------
# 1. https://neon.tech pe jao
# 2. "Sign Up" karo (GitHub se login sabse aasan hai)
# 3. Credit card NAHI chahiye
# 4. Free tier automatically milta hai

# 3b. Naya database banao
# -----------------------
# 1. Dashboard pe "Create Project" ya "New Project" click karo
# 2. Project name: sustainhub
# 3. Region: "Singapore" ya "Asia Pacific" select karo (Malaysia ke liye sabse close)
# 4. "Create Project" click karo
# 5. Wait 30 seconds - database ready!

# 3c. Connection string copy karo
# --------------------------------
# 1. Neon dashboard pe apne project kholein
# 2. "Connection Details" ya "Dashboard" tab pe jao
# 3. Connection string dikhegi, kuch aisi:
#    postgresql://neondb_owner:xxxxx@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
# 4. POORI STRING COPY KARO - ye Step 5 mein lagenge
#
# TIP: Agar "Pooled connection string" dikhe, woh use karo (Vercel ke liye better hai)
# Pooled string kuch aisi hoti hai:
#    postgresql://neondb_owner:xxxxx@ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require


# ============================================
# STEP 4: CODE MEIN 1 CHANGES KARO (1 minute)
# ============================================
# Sirf EK file mein EK line change karni hai

# 4a. prisma/schema.prisma mein change karo
# ------------------------------------------
# File kholo: prisma/schema.prisma
# Line 6 pe ye likha hoga:
#     provider = "sqlite"
#
# Isko change karo:
#     provider = "postgresql"
#
# BAKI SAB SAME RAHE! Sirf "sqlite" ko "postgresql" karo.
#
# BEFORE:
#   datasource db {
#     provider = "sqlite"
#     url      = env("DATABASE_URL")
#   }
#
# AFTER:
#   datasource db {
#     provider = "postgresql"
#     url      = env("DATABASE_URL")
#   }


# ============================================
# STEP 5: GITHUB PE UPDATE KARO (1 minute)
# ============================================
# Changes ko GitHub pe push karo:

# git add .
# git commit -m "Switch to PostgreSQL for Vercel deployment"
# git push


# ============================================
# STEP 6: VERCEL PE DEPLOY KARO (5 minutes)
# ============================================

# 6a. Vercel account banao
# ------------------------
# 1. https://vercel.com pe jao
# 2. "Sign Up" karo (GitHub se login - SABSE AASAN)
# 3. Free plan automatically hai
# 4. Credit card NAHI chahiye

# 6b. Naya project import karo
# ----------------------------
# 1. Vercel dashboard pe "Add New" > "Project" click karo
# 2. Apna "sustainhub" repo dikhoga, "Import" click karo
# 3. Framework Preset: "Next.js" (automatically detect hoga)
# 4. Root Directory: "." (default, mat change karo)

# 6c. Environment Variables set karo
# -----------------------------------
# "Environment Variables" section mein 3 variables add karo:
#
# | Name              | Value                                                                    |
# |-------------------|--------------------------------------------------------------------------|
# | DATABASE_URL      | [Step 3c mein copy ki Neon connection string yahan paste karo]           |
# | NEXTAUTH_SECRET   | [Koi random string - generate karo: openssl rand -base64 32]             |
# | NEXTAUTH_URL      | [Chhod do - Vercel automatically set kar dega]                           |
#
# TIPS:
# - DATABASE_URL: Neon ka connection string paste karo EXACTLY jaise copy kiya
# - NEXTAUTH_SECRET: Terminal mein "openssl rand -base64 32" run karo, output copy karo
# - NEXTAUTH_URL: KHAI MAT DALO, Vercel khud handle karega

# 6d. Deploy click karo
# ---------------------
# "Deploy" button click karo
# 2-3 minute lagenge (first build thoda slow hota hai)
# "Building..." dikhega, phir "Ready!" dikhega
# CONGRATULATIONS! Aapki site live hai!
# URL kuch aisi hogi: https://sustainhub-xxxxx.vercel.app


# ============================================
# STEP 7: DATABASE TABLES BANAO (2 minutes)
# ============================================
# Site live hai lekin database mein tables nahi hain.
# Ye EK BAR karna hai:

# 7a. Vercel CLI install karo (Terminal mein)
# ------------------------------------------
# npm i -g vercel

# 7b. Apne project se link karo
# -----------------------------
# sustainhub folder mein jao, phir:
# vercel link
# (Puchega: "Set up and deploy?" > Y
#  "Which project?" > apna sustainhub project select karo)

# 7c. Environment variables pull karo
# -----------------------------------
# vercel env pull .env.local
# (Ye Vercel ke env vars local .env.local file mein download karega)

# 7d. Prisma tables create karo
# ------------------------------
# npx prisma db push
# (Dikhega: "Your database is now in sync with your Prisma schema.")
# (Ye tables Neon database mein create kar dega)

# 7e. Re-deploy karo (agar zaroorat ho)
# --------------------------------------
# vercel --prod
# (Optional - agar pehli deploy pe kuch error aaya toh)


# ============================================
# STEP 8: TEST KARO
# ============================================
# 1. Apni Vercel URL kholo (e.g. https://sustainhub-xxxxx.vercel.app)
# 2. "Get Started" click karo
# 3. "Sign Up" karo (koi bhi email/password)
# 4. Onboarding complete karo
# 5. Dashboard dekho - sab kaam karna chahiye!
# 6. CEO ko URL bhej do - DONE!


# ============================================
# CEO KO KEHNE KE LIYE
# ============================================
# "SustainHub live demo ready hai. URL: https://sustainhub-xxxxx.vercel.app
#  Free hosting pe hai, production ke liye custom domain bhi laga sakte hain."


# ============================================
# TROUBLESHOOTING (Agar kuch problem aaye)
# ============================================

# PROBLEM: "Build failed" on Vercel
# SOLUTION:
#   1. Check karo prisma/schema.prisma mein "postgresql" likha hai (not "sqlite")
#   2. Check karo DATABASE_URL correct hai (Neon wali)
#   3. Vercel pe jaake "Redeploy" try karo

# PROBLEM: "Prisma Client not generated" error
# SOLUTION:
#   1. Vercel > Project > Settings > General
#   2. Build Command: npx prisma generate && next build
#   3. Redeploy

# PROBLEM: "Database connection failed"
# SOLUTION:
#   1. Neon dashboard se check karo database active hai
#   2. Connection string EXACTLY copy karo (ek bhi space galat nahi)
#   3. Pooled connection string use karo (Step 3c)

# PROBLEM: "Sign up nahi ho raha" / "Auth error"
# SOLUTION:
#   1. NEXTAUTH_SECRET set hai Vercel mein? (Step 6c)
#   2. NEXTAUTH_URL mat set karo, Vercel handle karega

# PROBLEM: "Vercel CLI install nahi ho raha"
# SOLUTION:
#   1. Node.js installed hona chahiye: https://nodejs.org
#   2. Phir: npm i -g vercel
#   3. Alternative: npx vercel (install bina direct run)


# ============================================
# SUMMARY - QUICK REFERENCE
# ============================================
# GitHub:  https://github.com/YOUR_USERNAME/sustainhub
# Neon DB: https://console.neon.tech (free PostgreSQL)
# Vercel:  https://vercel.com (free hosting)
# URL:     https://sustainhub-xxxxx.vercel.app
#
# Total Cost: RM 0
# Total Time: ~20 minutes (first time)
#
# Production ke liye (baad mein):
# - Custom domain: ~RM50-100/year
# - Vercel Pro: $20/month (optional)
# - Ya Hostinger VPS: ~RM25/month