# **Modbus Frontend (React + Vite + TypeScript)**

This project is a **React Vite + TypeScript** application that serves as the frontend for a **Spring Boot + J2Mod** backend. The backend communicates with a **pymodbus slave**, allowing the user to read/write Modbus registers via an HTTP API.

## **📌 Features**

- Communicates with a **Spring Boot backend** over HTTP.
- Sends and retrieves data from a **Modbus slave** via the backend.
- Uses **React, Vite, and TypeScript** for a fast and scalable frontend.
- Configurable API base URL via `.env` file.

---

## **🚀 Getting Started**

### **1️⃣ Prerequisites**

Make sure you have the following installed:

- **Node.js** (>= 16.x) – [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) OR **yarn** (optional)
- **Git** – [Download here](https://git-scm.com/)

---

### **2️⃣ Clone the Repository**

```sh
git clone https://github.com/yourusername/modbus-frontend.git
cd modbus-frontend
```

### **3️⃣ Install Dependencies**

```sh
npm install
yarn install
```

### **4️⃣ Create a .env File**

##### Make sure to create the .env file in the root.

```sh
VITE_API_URL=http://localhost:8081
```

### **5️⃣ Start the Development Server**

```sh
npm run dev
```

Make sure to run the backend and pyModSlave before interacting with the web page as detailed in the README for backend.

### 📡 API Endpoints

The frontend communicates with the backend through the following HTTP endpoints:

- Write Single Register
- Endpoint: POST /modbus/slave/write-single

## 📜 License

This project is licensed under the **MIT License**.
MIT License

Copyright (c) 2025 Grupp-5

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

### Notes:

- Replace `2025` with the current year.
- Replace `Grupp-5` with your name or your organization's name.

This is the standard **MIT License** format used in open-source projects. 🚀
