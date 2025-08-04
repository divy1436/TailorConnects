# Tailoring Service Platform

A full-stack web application for managing tailor services, order tracking, and customer interactions.  
This platform enables users to place tailoring orders, track status, and view tailor details, while tailors can manage requests efficiently.

---

## 🚀 Features

- 📦 **Order Management**: Customers can place and track orders.
- 👔 **Tailor Profiles**: View details of available tailors.
- 🔐 **Secure API Endpoints**: Ensures safe communication between client and server.
- 📱 **Responsive UI**: Built with Tailwind CSS for a modern look across devices.
- ⚡ **Fast Performance**: Powered by Vite and TypeScript.
- 🗄️ **Database Integration**: Using Drizzle ORM for schema and migrations.
- ♻️ **Shared Utilities**: Common types and functions between client & server.

---

## 🏗️ Project Structure

```bash
├── attached_assets/      # Static files (images, docs, etc.)
├── client/               # Frontend (React + Vite + Tailwind)
├── server/               # Backend (Node.js + Express + Drizzle ORM)
├── shared/               # Shared utilities, constants, and types
├── .gitignore            # Git ignored files
├── .replit               # Replit environment configuration
├── components.json       # UI components config
├── drizzle.config.ts     # Drizzle ORM setup
├── package.json          # Project dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
