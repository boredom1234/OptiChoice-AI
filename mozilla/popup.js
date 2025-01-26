function showMessage(message, isSuccess) {
    const messageDiv = document.getElementById("message");
    if (!messageDiv) return;
    messageDiv.textContent = message;
    messageDiv.className = isSuccess ? "success" : "error";
    messageDiv.style.display = "block";
    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 3000);
  }
  
  // Use browser.storage instead of chrome.storage
  browser.storage.sync.get("apiKey").then((data) => {
    const apiKey = data.apiKey;
    const apiKeyInput = document.getElementById("api-key");
    const saveButton = document.getElementById("save-api-key");
    const removeButton = document.getElementById("remove-api-key");
    const solveButton = document.getElementById("solve");
  
    if (apiKey) {
      apiKeyInput.value = "********";
      apiKeyInput.style.color = "white";
      apiKeyInput.disabled = true;
      saveButton.disabled = true;
      removeButton.style.display = "inline-block";
      solveButton.style.display = "inline-block";
    }
  });
  
  document.getElementById("save-api-key").addEventListener("click", () => {
    const apiKey = document.getElementById("api-key").value.trim();
    if (apiKey) {
      browser.storage.sync.set({ apiKey }).then(() => {
        showMessage("API Key saved successfully!", true);
        document.getElementById("api-key").value = "********";
        document.getElementById("api-key").disabled = true;
        document.getElementById("save-api-key").disabled = true;
        document.getElementById("remove-api-key").style.display = "inline-block";
        document.getElementById("solve").style.display = "inline-block";
      });
    } else {
      showMessage("Please enter a valid API Key.", false);
    }
  });
  
  document.getElementById("remove-api-key").addEventListener("click", () => {
    browser.storage.sync.remove("apiKey").then(() => {
      showMessage("API Key removed successfully!", true);
      document.getElementById("api-key").value = "";
      document.getElementById("api-key").disabled = false;
      document.getElementById("save-api-key").disabled = false;
      document.getElementById("remove-api-key").style.display = "none";
      document.getElementById("solve").style.display = "none";
    });
  });
  
  document.getElementById("solve").addEventListener("click", () => {
    browser.storage.sync.get("apiKey").then((data) => {
      const apiKey = data.apiKey;
      if (!apiKey) {
        showMessage("Please save your API Key first.", false);
        return;
      }
  
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const tab = tabs[0];
        if (tab.url.startsWith("https://docs.google.com/forms/") || tab.url.startsWith("http://docs.google.com/forms/")) {
          // Inject the content script
          browser.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"],
          }).then(() => {
            // Send the API key to the content script
            browser.tabs.sendMessage(tab.id, { action: "solveMCQs", apiKey })
              .then(() => {
                console.log("Message sent successfully");
              })
              .catch((error) => {
                console.error("Failed to send message:", error);
              });
          }).catch((error) => {
            console.error("Failed to inject script:", error);
          });
        } else {
          showMessage("This extension only works on Google Forms pages.", false);
        }
      });
    });
  });
  
  // Listen for messages from the content script
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showMessage") {
      showMessage(request.message, request.isSuccess);
    }
  });