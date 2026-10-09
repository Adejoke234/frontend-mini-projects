const searchInput = document.getElementById("team-search");
const cards = document.querySelectorAll(".team-card");
const noResults = document.getElementById("no-results");

// Filter the team cards as the user types (matches name or role)
searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();
  let visible = 0;

  cards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    const role = card.querySelector(".role").textContent.toLowerCase();
    const match = name.includes(term) || role.includes(term);
    card.classList.toggle("hidden", !match);
    if (match) visible++;
  });

  noResults.classList.toggle("hidden", visible !== 0);
});
