# ♻️ E-Waste Management Web App

A modern, full-stack web application that allows users to **schedule e-waste and plastic pickups** while giving admins the tools to **manage, update, and delete** requests easily.

Built with **Node.js + Express** for the backend and **HTML, CSS, JavaScript** for the frontend.

---

## 🌍 Overview

The goal of this project is to simplify the process of **recycling old electronics and plastic**.  
Users can submit pickup requests, and admins can track and update them in real time.

This app demonstrates:
- RESTful API design using Express  
- Frontend integration with `fetch()` for CRUD operations  
- Clean, mobile-friendly UI built with vanilla web technologies  

---

## ✨ Features

### 🧑‍💻 User Side
- Create new pickup requests  
- View all your submitted requests  
- Responsive and visually clean interface  

### 🛠️ Admin Side
- View all user requests  
- Update request status (`Pending`, `In Progress`, `Completed`)  
- Delete requests  
- Auto-refresh every 8 seconds for live updates  
- Protected by simple token check (`?token=admin`)

---

## 🧱 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6) |
| **Backend** | Node.js, Express.js |
| **Database** | JSON file (or easily extendable to MongoDB/Firebase) |
| **API Format** | REST (GET, POST, PUT, DELETE) |

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/e-waste-management.git
cd e-waste-management
