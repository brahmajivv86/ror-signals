# COLREGs & IALA Signals Quiz & Trainer

A premium, interactive web application designed to help seafarers master the **Rules of the Road (COLREGs)** day/night collision regulations and the **IALA Buoyage System**. This app helps you prepare for maritime competency examinations by providing both structured study aids and randomized self-assessment quizzes.

👉 **Repository Link:** [https://github.com/brahmajivv86/COLREGS_IALA_Flashcard_Trainer](https://github.com/brahmajivv86/COLREGS_IALA_Flashcard_Trainer)

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

## 🛠️ How to Run Locally

If you clone or download this repository to run it on your own computer, you will need to host it using a local static web server.

> [!IMPORTANT]
> Because modern web browsers block loading the local database file (`cards.json`) directly from the filesystem (via the `file://` protocol) due to security policies (CORS), you **cannot** run this app by simply double-clicking the `index.html` file.

To host and run it locally:

1.  **Using Python (Quickest):**
    *   Open your terminal or command prompt in the project folder.
    *   Start a lightweight static server:
        ```bash
        python -m http.server 8000
        ```
    *   Open your web browser and navigate to: `http://localhost:8000`

2.  **Using VS Code Live Server:**
    *   Open the project folder in VS Code.
    *   Right-click `index.html` and select **Open with Live Server**.

3.  **Using Node.js:**
    *   Run `npx serve` inside the folder.

---

## ⚠️ Disclaimer

*   **Source Material:** Extracted from **Bandharkar ROR Cards**.
*   **Purpose:** Generated for educational and training purposes only as cards are available.
*   **Accuracy:** While every effort was made to ensure accuracy, errors might be present. Please analyze each signal and shape for yourself to confirm the regulations.
*   **Feedback & Contributions:** If you find any errors or have suggestions, please send an email to **[brahmajivv86@protonmail.com](mailto:brahmajivv86@protonmail.com)**. I will try to correct them when ashore to help other seafarers. Thanks!
