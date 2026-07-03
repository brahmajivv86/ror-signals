# R.O.R. & IALA Signals Quiz & Trainer

A premium, interactive web application designed to help seafarers master the **Rules of the Road (R.O.R.)** day/night collision regulations and the **IALA Buoyage System**. This app helps you prepare for maritime competency examinations by providing both structured study aids and randomized self-assessment quizzes.

👉 **Repository Link:** [https://github.com/brahmajivv86/ror-signals](https://github.com/brahmajivv86/ror-signals)

---

## 🚀 Key Features

*   **Comprehensive Material:**
    *   **Night Signals:** Study and test on Night Lights and Collision Regulation Signals (Cards 1–225).
    *   **Day Signals:** Study and test on Day Shapes and Collision Regulation Signals (Cards 1–30).
    *   **IALA Buoyage System:** Study and test on Lateral, Cardinal, Safe Water, Isolated Danger, and Special Buoys/Markers (Cards 1–40).
*   **Trainer Mode:**
    *   Interactive flashcards with visual aids.
    *   Click or press `Space` to flip the card to see answers.
    *   Detailed breakdowns: Aspect Identification, Actions to be Taken, Corresponding Day/Night Signals, and Fog Sound Signals.
    *   Study sequentially or in shuffled order.
*   **Quiz Mode (Self-Testing):**
    *   Dynamic multiple-choice testing with customizable lengths (10, 20, 50 questions, or full deck).
    *   Immediate visual feedback on correct/incorrect answers.
    *   Custom step-by-step questions (e.g., identifying vessel aspect first, then required action, then day shape/fog signals).
*   **Progress Tracking & Review:**
    *   Shows overall accuracy, total answered, correct, and incorrect counts.
    *   Generates a dedicated **Vessels to Review** section listing any cards you answered incorrectly so you can study them again.
*   **Modern Premium Interface:** Beautiful glassmorphic dark-mode design with smooth animations, optimized for desktop and mobile browsers.

---

## 🛠️ Testing the Application Locally

You can test and run this application locally using either of the following two methods:

### Method 1: Using the Deployment Package (`github_upload` folder)
The `github_upload` folder contains all self-contained files (HTML, CSS, JS, and image assets) needed to run the app. 

> [!IMPORTANT]
> Because the browser blocks loading the local database file `cards.json` directly from the filesystem (via `file://` protocol) due to security policies (CORS), you **cannot** simply double-click the `index.html` file in your browser. You must host it using a local static server.

To host and test it locally:
1.  **Using Python (Quickest):**
    *   Open your terminal/command prompt.
    *   Navigate to the `github_upload` folder:
        ```bash
        cd github_upload
        ```
    *   Start a lightweight static server:
        ```bash
        python -m http.server 8000
        ```
    *   Open your browser and navigate to: `http://localhost:8000`
2.  **Using VS Code Live Server:**
    *   Open the `github_upload` folder in VS Code.
    *   Right-click `index.html` and select **Open with Live Server**.

---

### Method 2: Development Environment Setup
If you are running the project from the root folder during development:
1.  Double-click `run.bat` or run the following command in your terminal:
    ```bash
    python server.py
    ```
2.  This launches a custom local python HTTP server at `http://localhost:8000` which maps the `/images/day/` and `/images/night/` requests to your local study resources directory.
3.  The application will automatically open in your default browser.

---

## ⚠️ Disclaimer

*   **Source Material:** Extracted from **Bandharkar ROR Cards**.
*   **Purpose:** Generated for educational and training purposes only as cards are available.
*   **Accuracy:** While every effort was made to ensure accuracy, errors might be present. Please analyze each signal and shape for yourself to confirm the regulations.
*   **Feedback & Contributions:** If you find any errors or have suggestions, please send an email to **[brahmajivv86@protonmail.com](mailto:brahmajivv86@protonmail.com)**. I will try to correct them when ashore to help other seafarers. Thanks!
