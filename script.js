const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  userInput.value = "";

  const loadingMsg = document.createElement("div");
  loadingMsg.classList.add("message", "bot");
  loadingMsg.innerText = "Thinking...";
  chatBox.appendChild(loadingMsg);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",  // 👈 put your key here
        "HTTP-Referer": "",         // 👈 your site URL (for rankings)
        "X-Title": "Chatbot Test",                       // 👈 app/site name
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    console.log("API response:", data);

    if (data?.choices?.length > 0 && data.choices[0].message?.content) {
      loadingMsg.innerText = data.choices[0].message.content;
    } else if (data?.error) {
      loadingMsg.innerText = "⚠️ API Error: " + data.error.message;
    } else {
      loadingMsg.innerText = "⚠️ No response from bot.";
    }
  } catch (err) {
    console.error("Fetch error:", err);
    loadingMsg.innerText = "❌ Error connecting to API.";
  }
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
