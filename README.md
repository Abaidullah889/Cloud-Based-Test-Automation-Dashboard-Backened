# ☁️ Cloud-Based Test Automation Dashboard — Backend

This repository contains the **backend service** for the Cloud-Based Test Automation Dashboard. It powers all test execution logic, runs system-level health-check scripts, and provides secure API endpoints for frontend communication.

The backend is deployed inside a private AWS EC2 instance, fully containerized via Docker, and only accessible within a VPC for maximum security.

---

## 🔐 Why This Backend Matters

- **Executes Real System Health Tests:** Monitors CPU usage, memory, disk space, container health, service uptime, network reachability, and more.
- **Private-Only Deployment:** Runs within a secure AWS VPC with no public IP.
- **API-Only Server:** Built with Node.js and Express.
- **Script-Driven Monitoring:** Uses Python and Bash scripts, returning structured JSON.
- **Works with Frontend via Nginx Proxy:** Requests are securely routed from the frontend EC2.

---

---

## 🔗 Live Dashboard

👉 **[Open the Dashboard](http://13.51.175.115/)**  

---


## 🔧 Technology Stack

- **Node.js + Express** – REST API server for running and returning test results
- **Python & Bash** – Standalone scripts for health and readiness checks
- **Docker** – Containerized deployment for consistency and scalability
- **AWS EC2 (Private)** – Hosted inside a private VPC subnet
- **GitHub Actions** – Automated CI/CD pipeline for seamless deployment

---

## 📦 API Endpoints

| Endpoint                  | Method | Description                                 |
|---------------------------|--------|---------------------------------------------|
| `/api/run-tests`          | POST   | Executes all available test scripts         |
| `/api/results`            | GET    | Returns a list of previous test results     |
| `/api/results/test/:name` | GET    | Returns results for a specific test         |
| `/api/results`            | DELETE | Clears all stored test results              |
| `/health`                 | GET    | Health check endpoint (used in CI/CD)       |

All scripts are executed **inside the Docker container** and return:
- `output`
- `duration`
- `statusCode`

---

## 🧪 Supported Test Scripts

Scripts are located in the `/tests/` folder and auto-detected by the server. Current supported scripts include:

- ✅ CPU usage check
- ✅ Memory usage check
- ✅ Disk space check
- ✅ Docker container health
- ✅ Files existence

➡️ You can add your own scripts under `/scripts/`, and they’ll be auto-integrated.

---

## 🔒 Security Model

- 🚫 **No public IP**
- 🔐 **Accessible only within the VPC** (from the frontend EC2 instance)
- 🔄 **All traffic goes through Nginx reverse proxy** on frontend
- 🔒 **No open ports to the internet**

---

## 🔄 CI/CD Pipeline (GitHub Actions)

1. Triggered on `push` to `main`
2. SSH into backend EC2 instance
3. Pull latest code
4. Stop old Docker container
5. Build & run new container image
6. Smoke test using `/health` endpoint

---

## 🌍 Related Frontend Repository

This backend works seamlessly with the frontend available at:

👉 [Frontend Repository](https://github.com/Abaidullah889/Cloud-Based-Test-Automation-Dashboard)


## 👨‍💻 Author

**Built by Abaidullah Asif [Connect](https://www.linkedin.com/in/abaidullahasif/)**  

---
