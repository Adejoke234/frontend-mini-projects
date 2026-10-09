const form = document.getElementById("signup-form");
const emailInput = form.querySelector("input[type='email']");
const button = document.getElementById("subscribe-btn");
const errorText = document.getElementById("form-error");
const thanks = document.getElementById("thanks");
const subscriber = document.getElementById("subscriber");
const benefits = document.querySelector(".benefits");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  if (!emailRegex.test(email)) {
    errorText.textContent = "Please enter a valid email address.";
    emailInput.focus();
    return;
  }

  errorText.textContent = "";
  button.classList.add("loading");
  button.innerHTML = 'Subscribing... <i class="fas fa-spinner fa-spin"></i>';

  // pretend to call a server, then show the thank-you state
  setTimeout(() => {
    subscriber.textContent = email;
    form.classList.add("hidden");
    benefits.classList.add("hidden");
    thanks.classList.remove("hidden");
  }, 1200);
});

emailInput.addEventListener("input", () => (errorText.textContent = ""));
