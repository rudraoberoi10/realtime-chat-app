# 💬 Real-Time React Native Chat Application

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

A full-stack, cross-platform mobile chat application demonstrating real-time bidirectional communication. Built as a technical assessment to showcase proficiency in modern JavaScript frameworks, event-driven architecture, and cross-platform UI development.

## 🚀 Technical Architecture

This project is separated into a decoupled client-server architecture:

*   **Frontend (Mobile Client):** Built with **React Native (Expo)**. Manages local component state, handles cross-platform UI differences (iOS vs. Android Keyboard Avoiding Views), and establishes a persistent WebSocket connection to the server.
*   **Backend (WebSocket Server):** Built with **Node.js** and **Express**. Utilizes **Socket.io** to manage an event-driven, real-time message broadcasting system.

## ✨ Key Features

*   **Real-Time Messaging:** Instantaneous message delivery and rendering via WebSockets, eliminating the need for HTTP polling.
*   **Dynamic State Management:** Intelligently distinguishes between local and remote clients to dynamically style message bubbles (Self vs. Other).
*   **Session Management:** Ephemeral mock authentication allowing users to join the broadcast room with a custom identifier.
*   **Cross-Platform UI/UX:** Implements `SafeAreaView` and `KeyboardAvoidingView` to ensure a native-feeling, responsive interface on both iOS and Android physical devices.
*   **Fault Tolerance:** Graceful handling of network disconnects and input validation to prevent empty payloads.

---

## 🛠️ Tech Stack & Libraries

**Frontend Dependencies:**
*   `react-native`: Core UI framework.
*   `expo`: Development toolkit and bundler.
*   `socket.io-client`: Client-side WebSocket API.

**Backend Dependencies:**
*   `express`: Lightweight HTTP server framework.
*   `socket.io`: Real-time, bidirectional, event-based communication engine.
*   `cors`: Cross-Origin Resource Sharing middleware.

---

## 💻 Local Development Setup

Follow these steps to run the application locally on your network.

### Prerequisites
*   Node.js installed (v14+ recommended)
*   Expo Go app installed on a physical iOS or Android device
*   *Note: Both the host machine and the physical mobile device must be connected to the exact same Wi-Fi network.*

### 1. Initialize the Backend
Navigate to the backend directory, install the required packages, and spin up the Node.js server.
```bash
cd backend
npm install
node server.js
```
The server will initialize on port 3000.

### 2. Configure the Frontend
Before starting the frontend, you must point the app to your local server.

*  Open frontend/App.js.
*  Locate the SERVER_URL constant.
*  Replace the placeholder IP address with your host machine's actual local IPv4 address (e.g., http://192.168.1.19:3000).

### 3. Initialize the Frontend
Open a new terminal window, navigate to the frontend directory, and start the Expo development server.
```bash
cd frontend
npm install
npx expo start
```

### 4. Launch on Device
*  Android: Scan the QR code displayed in the terminal using the Expo Go application.
*  iOS: Scan the QR code using the native Camera app and open the prompt in Expo Go.

### 👤 Author
Rudra Oberoi

*  GitHub: @rudraoberoi10
