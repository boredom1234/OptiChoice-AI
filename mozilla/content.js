browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "solveMCQs") {
    solveMCQs(request.apiKey);
  }
});

function solveMCQs(apiKey) {
  (async () => {
    try {
      let questions = "";
      const questionsElements = document.querySelectorAll('[role="listitem"]');
      questionsElements.forEach((element) => {
        const text = element.innerText;
        questions += text + "\n";
      });

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: "Give only the answers with full option text. If the question is personal (e.g., name, register number, section, department), return 'personal' as the answer. Do not include the question in the response:\n" + questions,
              },
            ],
          },
        ],
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      const answers = generatedText.split("\n");
      const validAnswers = answers.filter((answer) => answer.trim() !== "");

      questionsElements.forEach((questionElement, index) => {
        if (validAnswers[index] === "personal") {
          return;
        }

        const radioButtons = questionElement.querySelectorAll('[role="radio"]');
        if (radioButtons.length > 0) {
          const correctAnswer = validAnswers[index].trim();
          radioButtons.forEach((radio) => {
            const radioText = radio.getAttribute("aria-label");
            if (radioText === correctAnswer) {
              radio.click();
            }
          });
        }

        const checkboxes = questionElement.querySelectorAll('[role="checkbox"]');
        if (checkboxes.length > 0) {
          const correctAnswers = validAnswers[index].split(",").map((answer) => answer.trim());
          checkboxes.forEach((checkbox) => {
            const checkboxText = checkbox.getAttribute("aria-label");
            if (correctAnswers.includes(checkboxText)) {
              checkbox.click();
            }
          });
        }
      });

      // Send a message back to the popup to show success
      browser.runtime.sendMessage({ action: "showMessage", message: "MCQs solved successfully!", isSuccess: true });
    } catch (error) {
      console.error("Error:", error);
      browser.runtime.sendMessage({ action: "showMessage", message: "An error occurred. Check the console for details.", isSuccess: false });
    }
  })();
}