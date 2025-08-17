const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Append message to chat
function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle send
sendBtn.addEventListener("click", async () => {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  userInput.value = "";

  // Show temporary bot response
  const loadingMsg = document.createElement("div");
  loadingMsg.classList.add("message", "bot");
  loadingMsg.innerText = "Thinking...";
  chatBox.appendChild(loadingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "HTTP-Referer": "http://localhost:3000", // Change this to your site URL later
        "X-Title": "Chatbot Test",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1-0528:free",
        "messages": [
          {
            "role": "user",
            "content": text
          }
        ]
      })
    });

    const data = await response.json();
    console.log("API response:", data);

    if (data.choices && data.choices.length > 0) {
      loadingMsg.innerText = data.choices[0].message.content;
    } else {
      loadingMsg.innerText = "No response from bot.";
    }
  } catch (error) {
    console.error("Error:", error);
    loadingMsg.innerText = "Error: Unable to connect.";
  }
});

// Allow Enter key to send
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
