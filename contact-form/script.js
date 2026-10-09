const form = document.getElementById("contact-form");
const message = document.getElementById("message");
const count = document.getElementById("count");
const counter = document.querySelector(".char-count");
const success = document.getElementById("success");
const againBtn = document.getElementById("again");
const intro = document.querySelector(".form-container > p");

// Live character counter for the message box
message.addEventListener("input", () => {
  count.textContent = message.value.length;
  counter.classList.toggle("near-limit", message.value.length >= 450);
});

// Show a thank-you message instead of reloading the page
form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.classList.add("hidden");
  intro.classList.add("hidden");
  success.classList.remove("hidden");
});

againBtn.addEventListener("click", () => {
  form.reset();
  count.textContent = 0;
  counter.classList.remove("near-limit");
  success.classList.add("hidden");
  form.classList.remove("hidden");
  intro.classList.remove("hidden");
});
