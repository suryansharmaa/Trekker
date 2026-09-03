# Trekker - Competitive Programming Dashboard

Trekker is a full-stack application designed for aggregating and analyzing competitive programming performance metrics across LeetCode, Codeforces, and GeeksForGeeks.

The application utilizes a distributed architecture with a React-based frontend and a Java/Spring Boot backend. Data is sourced concurrently via public GraphQL endpoints, REST APIs, and fallback DOM scraping, aggregated into a unified schema, and cached in MongoDB.

## Architecture & Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts
- **Backend**: Java 17, Spring Boot 3.3, Maven
- **Database**: MongoDB (Spring Data MongoDB)
- **Deployment**: Monorepo structured for independent builds (Frontend via Netlify, Backend via Render)

## Core Capabilities
- **Concurrent Data Aggregation**: Leverages `CompletableFuture` to execute multi-platform data fetching, normalizing platform-specific schemas into a standard difficulty model.
- **Caching Mechanism**: Implements an in-memory caching layer with 1-hour TTL to minimize external API rate-limiting and reduce latency on recurring dashboard loads.
- **Data Visualization**: Real-time component rendering using Recharts to visualize milestone progression.
- **Algorithm Visualization**: Includes a native browser implementation of the Merge Sort algorithm for algorithmic demonstration.

## Local Development

### Requirements
- Java 17+
- Maven 3.8+
- MongoDB Instance (optional — backend degrades gracefully without it)

### Backend Setup
1. Navigate to the `backend` directory.
2. Provide standard environment configuration:
    ```env
    MONGODB_URI=mongodb://localhost:27017/dsa_dashboard
    PORT=5000
    ```
3. Build and run:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies and start the Vite development server:
    ```bash
    npm install
    npm run dev
    ```
