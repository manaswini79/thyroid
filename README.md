
# 🧠 ThyroLead: Thyroid Disease Detection Platform

**ThyroLead** is an end-to-end full-stack web application designed to help users detect the likelihood of thyroid disease using machine learning. It integrates a React frontend, a Node.js/Express backend, a Python-based Flask API for prediction, and MongoDB for storage—all orchestrated using Docker.

---

## 🔧 Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js with Express  
- **ML Model**: Flask API (Python, scikit-learn, XGBoost, etc.)  
- **Database**: MongoDB  
- **Containerization**: Docker & Docker Compose  

---

## 📁 Project Structure

```
thyroid/
│
├── frontend/           # React frontend for user interaction
├── backend/            # Express.js API for handling form submission & DB
├── ml_model/           # Flask ML API that returns predictions
├── docker-compose.yml  # Multi-service Docker configuration
├── related_files       # Project ppt and research paper(not published) just demo
└── README.md
```

---

## 🌐 Application Flow

1. Users fill out a form on the **React frontend** with medical parameters like TSH, FTI and other blood test results.
2. The **Express backend** receives this data and forwards it to the ML API.
3. The **Flask ML API** predicts the likelihood of thyroid disease.
4. The **MongoDB database** stores submitted data and results.

---
### Steps to run the application:

### 🔄 Clone the Repository

```bash
git clone https://github.com/manaswini79/thyroid.git
cd thyroid
```
---

### ▶️ Run the Application with Docker

```bash
docker-compose up --build
```

- The app will be available at: [http://localhost:3000](http://localhost:3000)
- Flask ML API runs at: [http://localhost:5002](http://localhost:5002)
- Express backend runs at: [http://localhost:5001](http://localhost:5001)
- MongoDB exposed at: [localhost:27017](http://localhost:27017)

---

## 🧠 Model Info

The ML model is trained on a publicly available thyroid dataset using algorithms like Random Forest and XGBoost. It returns `hypothyroid` or `normal` predictions based on input parameters like TSH, T3, T4, etc.

---

## 🛠️ Customization

To retrain or modify the ML model:
- Update model training code and re-export `model.pkl`
- Place it in the `ml_model/` directory
- Restart Docker services

---

## 🙋‍♀️ Maintained by

**Manaswini S**  
[GitHub](https://github.com/manaswini79)
