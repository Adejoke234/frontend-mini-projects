const switchBtn = document.getElementById("billing-switch");
const labelMonthly = document.getElementById("label-monthly");
const labelYearly = document.getElementById("label-yearly");
const amounts = document.querySelectorAll(".amount");
const periods = document.querySelectorAll(".period");

let yearly = false;

switchBtn.addEventListener("click", () => {
  yearly = !yearly;
  switchBtn.setAttribute("aria-pressed", yearly);
  switchBtn.setAttribute("aria-label", yearly ? "Switch to monthly billing" : "Switch to yearly billing");
  labelMonthly.classList.toggle("active", !yearly);
  labelYearly.classList.toggle("active", yearly);

  amounts.forEach((el) => {
    el.classList.add("fade");
    setTimeout(() => {
      el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly;
      el.classList.remove("fade");
    }, 150);
  });

  periods.forEach((el) => {
    el.textContent = yearly ? "/month, billed yearly" : "/month";
  });
});
