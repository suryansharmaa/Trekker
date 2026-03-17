# DSA & Competitive Programming Portfolio Dashboard

A full-stack web application designed to act as a centralized hub for aggregating, visualizing, and analyzing algorithmic problem-solving progress across multiple platforms (LeetCode, Codeforces, GeeksForGeeks). 

Built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS, utilizing a custom IntelliJ IDEA Dark (Darcula) theme.

## Features
*   **Platform Integrations:** Fetches profile data, contest ratings, and total solved problem counts.
*   **Data Aggregation Engine:** Unified MongoDB schema standardizing problem difficulty.
*   **Milestone Tracker:** Interactive React component tracking the journey approaching 400 solved questions.
*   **Algorithm Visualizer:** Interactive Merge Sort visualizer demonstrating computer science fundamentals natively in the browser.

## Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB Instance (Local or MongoDB Atlas)

## Setup Instructions

### 1. Database Configuration
1.  Navigate to the `backend` directory.
2.  Create a file named `.env` in the root of the `backend` directory.
3.  Add your MongoDB connection string to the `.env` file:
    ```env
    MONGODB_URI=mongodb://localhost:27017/dsa_dashboard
    PORT=5000
    ```
    *(Replace the URI with your MongoDB Atlas connection string if using a cloud database).*

### 2. Backend Setup
1.  Open a terminal and navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The backend will run on `http://localhost:5000`.*

### 3. Frontend Setup
1.  Open a new terminal window and navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
    *The frontend will typically run on `http://localhost:5173`.*

## Usage
1.  Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
2.  On the Landing Page, enter your usernames for LeetCode, Codeforces, and/or GeeksForGeeks.
3.  Click "Run configuration" to aggregate your data and view your dashboard metrics!
4.  Navigate to the "Merge Sort visualizer()" link in the top bar to explore the sorting animation.
