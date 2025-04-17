// === DOM Elements ===
const form = document.getElementById("recipe-form");
const titleInput = document.getElementById("recipe-title");
const detailsInput = document.getElementById("recipe-details");
const list = document.getElementById("recipe-list");
const clearBtn = document.getElementById("clear-all");
const exportTxtBtn = document.getElementById("export-txt");

// === Load from localStorage ===
let recipes = JSON.parse(localStorage.getItem("recipe-box")) || [];
renderRecipes();

// === Form Submit ===
form.addEventListener("submit", e => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const details = detailsInput.value.trim();
  if (!title || !details) return;

  const recipe = {
    id: Date.now(),
    title,
    details
  };

  recipes.push(recipe);
  saveRecipes();
  renderRecipes();

  titleInput.value = "";
  detailsInput.value = "";
});

// === Delete Recipe ===
function deleteRecipe(id) {
  recipes = recipes.filter(r => r.id !== id);
  saveRecipes();
  renderRecipes();
}

// === Save to LocalStorage ===
function saveRecipes() {
  localStorage.setItem("recipe-box", JSON.stringify(recipes));
}

// === Render to DOM ===
function renderRecipes() {
  list.innerHTML = "";

  if (recipes.length === 0) {
    list.innerHTML = "<p>No recipes saved yet.</p>";
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    const title = document.createElement("h3");
    title.textContent = recipe.title;

    const details = document.createElement("p");
    details.textContent = recipe.details;

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.classList.add("delete");
    delBtn.addEventListener("click", () => deleteRecipe(recipe.id));

    card.appendChild(title);
    card.appendChild(details);
    card.appendChild(delBtn);
    list.appendChild(card);
  });
}

// === Clear All Recipes ===
clearBtn.addEventListener("click", () => {
  if (confirm("Clear all recipes?")) {
    recipes = [];
    saveRecipes();
    renderRecipes();
  }
});

exportTxtBtn.addEventListener("click", () => {
  if (!recipes.length) {
    alert("No recipes to export.");
    return;
  }

  const txt = recipes.map((r, i) => {
    return `📄 Recipe ${i + 1}: ${r.title}\n${r.details}\n`;
  }).join("\n---\n");

  const blob = new Blob([txt], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "my-recipe-box.txt";
  a.click();

  URL.revokeObjectURL(url);
});