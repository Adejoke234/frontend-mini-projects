const lists = document.querySelectorAll(".list");
const addForm = document.getElementById("add-form");
const newTaskInput = document.getElementById("new-task");

const DEFAULT_BOARD = {
  todo: ["Wash dishes", "Buy groceries"],
  progress: ["Learn to code"],
  done: [],
};

// The whole board is stored as { todo: [...], progress: [...], done: [...] }
let board = JSON.parse(localStorage.getItem("kanban-board")) || DEFAULT_BOARD;

function save() {
  localStorage.setItem("kanban-board", JSON.stringify(board));
}

function render() {
  lists.forEach((list) => {
    list.querySelectorAll(".card").forEach((card) => card.remove());

    board[list.id].forEach((text, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.draggable = true;
      card.dataset.list = list.id;
      card.dataset.index = index;

      const label = document.createElement("span");
      label.textContent = text;

      const del = document.createElement("button");
      del.className = "delete-card";
      del.innerHTML = "&times;";
      del.setAttribute("aria-label", `Delete ${text}`);
      del.addEventListener("click", () => {
        board[list.id].splice(index, 1);
        save();
        render();
      });

      card.append(label, del);
      card.addEventListener("dragstart", dragStart);
      card.addEventListener("dragend", dragEnd);
      list.appendChild(card);
    });

    document.getElementById(`count-${list.id}`).textContent = board[list.id].length;
  });
}

function dragStart(e) {
  // remember which card (and which column) is being moved
  e.dataTransfer.setData("text/plain", JSON.stringify({ from: this.dataset.list, index: Number(this.dataset.index) }));
  this.classList.add("dragging");
}

function dragEnd() {
  this.classList.remove("dragging");
}

for (const list of lists) {
  list.addEventListener("dragover", (e) => e.preventDefault());
  list.addEventListener("dragenter", (e) => {
    e.preventDefault();
    list.classList.add("over");
  });
  list.addEventListener("dragleave", (e) => {
    if (!list.contains(e.relatedTarget)) list.classList.remove("over");
  });
  list.addEventListener("drop", (e) => {
    e.preventDefault();
    list.classList.remove("over");
    const { from, index } = JSON.parse(e.dataTransfer.getData("text/plain"));
    const [task] = board[from].splice(index, 1);
    board[list.id].push(task);
    save();
    render();
  });
}

// Add a new task to the To Do column
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = newTaskInput.value.trim();
  if (!text) return;
  board.todo.push(text);
  newTaskInput.value = "";
  save();
  render();
});

render();
