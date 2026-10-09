const addBookmarkBtn = document.getElementById("add-bookmark");
const bookmarkList = document.getElementById("bookmark-list");
const bookmarkNameInput = document.getElementById("bookmark-name");
const bookmarkUrlInput = document.getElementById("bookmark-url");
	
document.addEventListener("DOMContentLoaded", loadBookmarks);

const formMessage = document.getElementById("form-message");
const searchInput = document.getElementById("bookmark-search");
const emptyNote = document.getElementById("empty-note");

addBookmarkBtn.addEventListener("click", function () {
  const name = bookmarkNameInput.value.trim();
  let url = bookmarkUrlInput.value.trim();

  if (!name || !url) {
    formMessage.textContent = "Please enter both a name and a URL.";
    return;
  }

  // Be forgiving: if the user forgets https://, add it for them
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    new URL(url);
  } catch {
    formMessage.textContent = "That does not look like a valid web address.";
    return;
  }

  formMessage.textContent = "";
  addBookmark(name, url);
  saveBookmark(name, url);
  bookmarkNameInput.value = "";
  bookmarkUrlInput.value = "";
  updateEmptyNote();
});

// Search: hide bookmarks that do not match what the user types
searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();
  bookmarkList.querySelectorAll("li").forEach((li) => {
    const text = li.querySelector("a").textContent.toLowerCase();
    li.style.display = text.includes(term) ? "" : "none";
  });
  updateEmptyNote();
});

function updateEmptyNote() {
  const visible = [...bookmarkList.querySelectorAll("li")].filter((li) => li.style.display !== "none");
  emptyNote.style.display = visible.length === 0 ? "block" : "none";
}

function addBookmark(name, url) {
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.href = url;
  link.textContent = name;
  link.target = "_blank";

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", function () {
    bookmarkList.removeChild(li);
    removeBookmarkFromStorage(name, url);
    updateEmptyNote();
  });

  li.appendChild(link);
  li.appendChild(removeButton);

  bookmarkList.appendChild(li);
}

function getBookmarksFromStorage() {
  const bookmarks = localStorage.getItem("bookmarks");
  return bookmarks ? JSON.parse(bookmarks) : [];
}

function saveBookmark(name, url) {
  const bookmarks = getBookmarksFromStorage();
  bookmarks.push({ name, url });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function loadBookmarks() {
  const bookmarks = getBookmarksFromStorage();
  bookmarks.forEach((bookmark) => addBookmark(bookmark.name, bookmark.url));
  updateEmptyNote();
}

function removeBookmarkFromStorage(name, url) {
  let bookmarks = getBookmarksFromStorage();
  bookmarks = bookmarks.filter((bookmark) => bookmark.name !== name || bookmark.url !== url);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
