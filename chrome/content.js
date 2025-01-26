chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "solveMCQs") {
    solveMCQs(request.apiKey);
  }
});

async function solveMCQs(apiKey) {
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
              text: "Give only the answers with full option text. If the question is personal (e.g., name, register number, section, department), return 'personal' as the answer. For multiple choice questions with multiple answers, separate each answer with ' | '. Do not include the question in the response:\n" + questions,
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

    // Process each question one at a time with a delay
    for (let i = 0; i < questionsElements.length; i++) {
      const questionElement = questionsElements[i];
      if (validAnswers[i] === "personal") {
        continue;
      }

      const radioButtons = questionElement.querySelectorAll('[role="radio"]');
      if (radioButtons.length > 0) {
        const correctAnswer = validAnswers[i].trim();
        for (const radio of radioButtons) {
          const radioText = radio.getAttribute("aria-label");
          if (radioText === correctAnswer) {
            await new Promise(resolve => setTimeout(resolve, 100));
            radio.click();
          }
        }
      }

      const checkboxes = questionElement.querySelectorAll('[role="checkbox"]');
      if (checkboxes.length > 0) {
        const correctAnswers = validAnswers[i].split(" | ");
        for (const checkbox of checkboxes) {
          const checkboxText = checkbox.getAttribute("aria-label");
          // First uncheck all checkboxes
          if (checkbox.getAttribute("aria-checked") === "true") {
            await new Promise(resolve => setTimeout(resolve, 200));
            checkbox.click();
          }
        }
        // Then check only the correct ones with exact matching
        for (const checkbox of checkboxes) {
          const checkboxText = checkbox.getAttribute("aria-label");
          if (correctAnswers.some(answer => checkboxText === answer.trim())) {
            await new Promise(resolve => setTimeout(resolve, 200));
            checkbox.click();
          }
        }
      }
      
      // Add delay between processing each question
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Send a message back to the popup to show success
    chrome.runtime.sendMessage({ action: "showMessage", message: "MCQs solved successfully!", isSuccess: true });
  } catch (error) {
    console.error("Error:", error);
    chrome.runtime.sendMessage({ action: "showMessage", message: "An error occurred. Check the console for details.", isSuccess: false });
  }
}