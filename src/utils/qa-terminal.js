import { qaData } from "../data/qa-data.js";

export function initQATerminal() {
  const questionList = document.querySelector("#qa-question-list");
  const responseBox = document.querySelector("#qa-response-box");

  if (!questionList || !responseBox) return;

  // Render question buttons
  questionList.innerHTML = qaData
    .map(
      (q, idx) => `
      <button class="qa-q-btn ${idx === 0 ? "is-active" : ""}" data-qa-id="${q.id}" type="button">
        <span class="qa-category">${q.category}</span>
        <span class="qa-question-text">${q.question}</span>
        <span class="qa-arrow">➔</span>
      </button>
    `
    )
    .join("");

  let activeTypingTimeout = null;

  function loadQA(qaId) {
    const item = qaData.find((q) => q.id === qaId);
    if (!item) return;

    // Highlight active button
    const buttons = questionList.querySelectorAll(".qa-q-btn");
    buttons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-qa-id") === qaId);
    });

    if (activeTypingTimeout) {
      clearTimeout(activeTypingTimeout);
    }

    // Render response with terminal typing effect
    responseBox.innerHTML = `
      <div class="t-line prompt-line" style="margin-top: 12px;">
        <span class="t-user">sanjyot@arch-node</span>:<span class="t-path">~</span>$ <span class="t-cmd">explain --scenario="${item.id}"</span>
      </div>
      <div class="t-card">
        <div class="t-card-header">
          <span class="t-tag">${item.category}</span>
          <strong class="t-summary">${item.shortAnswer}</strong>
        </div>
        <p class="t-full-text" id="t-typing-target"></p>
        ${
          item.codeSnippet
            ? `<div class="t-code-wrapper"><pre><code>${escapeHTML(item.codeSnippet)}</code></pre></div>`
            : ""
        }
      </div>
    `;

    // Type text animation
    const target = responseBox.querySelector("#t-typing-target");
    if (!target) return;

    const fullText = item.fullAnswer;
    let index = 0;
    target.textContent = "";

    function typeChar() {
      if (index < fullText.length) {
        target.textContent += fullText.charAt(index);
        index++;
        activeTypingTimeout = setTimeout(typeChar, 8); // Fast, responsive typing
      }
    }

    typeChar();
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  questionList.addEventListener("click", (e) => {
    const btn = e.target.closest(".qa-q-btn");
    if (!btn) return;
    const id = btn.getAttribute("data-qa-id");
    loadQA(id);
  });

  // Default load first item
  if (qaData.length > 0) {
    loadQA(qaData[0].id);
  }
}
