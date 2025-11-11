🛒 UniMall — E-Commerce Platform

UniMall is a modern e-commerce platform built for seamless buying, selling, and vendor management within a university environment.
This repository contains the frontend application implemented with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Supabase authentication.

🚀 Features
👤 Auth & User Roles (Supabase)

Email/password authentication

Three user roles:

Buyer – standard shopping interface

Seller/Vendor – vendor dashboard for managing products

Admin – restricted access to admin panel

Row Level Security (RLS) enabled

🛍 Buyer Experience

Fully responsive homepage

Product listing & filtering

Search, categories, spotlight products

Product details page with:

Vendor profile section

Distance/Location display

Add to cart & wishlist

🏪 Vendor Dashboard

Add/Edit/Delete products

Upload product images

Create custom categories (instantly updates on main site)

Track product performance

🛡 Admin Dashboard

Admin-only login with Supabase role verification

Manage users, vendors, and products

Monitoring tools / system activity

🧱 Tech Stack
Layer	Technology
Frontend	React + TypeScript
Bundler	Vite
UI	Tailwind CSS + shadcn/ui
Icons	Lucide React
Backend	Supabase
Auth	Supabase Auth
Storage	Supabase Storage (product images)
Routing	React Router
📂 Project Structure
src/
 ├── components/
 ├── pages/
 ├── admin/
 ├── vendor/
 ├── buyer/
 ├── integrations/supabase/
 ├── hooks/
 ├── lib/
 └── App.tsx

🛠 Local Development
1. Clone the repository
git clone <YOUR_REPO_URL>
cd <YOUR_PROJECT_NAME>

1. Install dependencies
npm install

1. Start development server
npm run dev

🔐 Supabase Setup (Important)

You must configure:

Tables

users

user_roles

categories

products

Authentication

Email/Password auth enabled

Admin must be manually inserted (Seed SQL provided)

Storage

Bucket: product-images

RLS Policies

Public product images access

Vendors can upload only their images

Buyers can read products publicly

Admin full control

🧑‍💻 Admin Account Seeding (SQL)

Use this in Supabase SQL Editor:

select auth.admin.update_user(
  uid := 'YOUR_ADMIN_USER_ID',
  email := 'admin@gmail.com',
  password := 'admin123'
);

insert into user_roles (user_id, admin)
values ('YOUR_ADMIN_USER_ID', 'admin');

🌍 Deployment

You can deploy the frontend on:

Vercel

Netlify

Cloudflare Pages

Render

Make sure to set environment variables:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

📌 Current Status

Buyer UI ✔️

Vendor dashboard ✔️ (category creation included)

Admin login working ✔️

Admin dashboard routing in progress

Fixing protected routes and role-based redirects

👤 Author

Felix Gyabaah
Email: felixic360@gmail.com

GitHub: https://github.com/gyabaahfelix

LinkedIn: https://www.linkedin.com/in/felix-best