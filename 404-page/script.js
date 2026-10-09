// A different friendly message every time the page loads
const messages = [
  "Looks like you took a wrong turn. Let's head back!",
  "We looked everywhere, but this page is hiding from us.",
  "Even the best developers get lost sometimes.",
  "This link may be broken, or the page may have moved.",
  "Nothing to see here, but the rest of the site is lovely!",
];

document.getElementById("message").textContent =
  messages[Math.floor(Math.random() * messages.length)];

// "Go back" returns to the previous page, or goes home if there is no history
document.getElementById("go-back").addEventListener("click", (e) => {
  e.preventDefault();
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "https://adejoke234.github.io/nabilat-portfolio-/";
  }
});
