# 🧠 OptiChoice AI 🧠

## ✨ Ace Your Google Forms MCQs with OptiChoice AI! ✨

Tired of spending precious time on tedious multiple-choice questions in Google Forms? Let **OptiChoice AI**, your personal AI assistant, do the heavy lifting! This handy Chrome extension leverages the power of **Google's Gemini API** to solve MCQs quickly and accurately, giving you more time for the things that matter most.

---

## 🚀 Features

- **Effortless Solving:** Automatically solves multiple-choice questions on Google Forms.
- **Smart Detection:** Skips personal questions (e.g., name, ID).
- **Multiple Answer Support:** Handles MCQs with single or multiple correct answers. 
- **User-Friendly Interface:** A clean and simple popup for easy API key management.
- **Seamless Integration:** Works directly within Google Forms, displaying results instantly on the page.

---

## 🧰 Getting Started

Follow these steps to set up and start using OptiChoice AI:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/boredom1234/OptiChoice-AI.git
```

### 2️⃣ Install Dependencies
- Navigate to the project directory:
  ```bash
  cd OptiChoice-AI
  ```
- This project doesn't require external dependencies, but ensure you have a suitable code editor to modify the code if needed.

### 3️⃣ Get Your Google Gemini API Key
- Visit the [Google Gemini API Console](https://developers.google.com/gemini/docs/api/rest).
- Create a new project and enable the **Gemini API**.
- Generate an API key and store it securely.

### 4️⃣ Load the Extension in Chrome
- Open Chrome and type `chrome://extensions` in the address bar.
- Enable **Developer mode** in the top-right corner.
- Click **Load unpacked** and select the `OptiChoice-AI/chrome` folder.

### 5️⃣ Enter Your API Key
- Click on the **OptiChoice AI** extension icon in the browser toolbar.
- Paste your Google Gemini API Key into the provided field and click **Save API Key**.

### 6️⃣ Solve Your Google Form MCQs
- Open a Google Form with multiple-choice questions.
- Click the **OptiChoice AI** extension icon and press **Solve MCQs**. Watch as OptiChoice AI works its magic!

---

## ⚙️ How It Works

1. **Content Analysis:** The extension scans the Google Form to identify and extract multiple-choice questions.
2. **API Magic:** Extracted questions are sent to the Google Gemini API.
3. **Answer Processing:** The API returns answers, which are processed and used to select the correct options directly on the form.

---

## ⚠️ Disclaimer

- This project is for **educational and demonstration purposes only**.
- Ensure compliance with your institution's or organization's policies before using this tool.

---

Take the hassle out of MCQs with **OptiChoice AI** and make your time count where it truly matters. Let us know if you have questions or feedback!
