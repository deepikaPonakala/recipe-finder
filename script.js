const resultsDiv = document.getElementById("results");
const searchInput = document.getElementById("searchInput");

// Modal elements
const modal = document.getElementById("recipeModal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalArea = document.getElementById("modalArea");
const modalInstructions = document.getElementById("modalInstructions");
const modalIngredients = document.getElementById("modalIngredients");

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

function searchRecipes() {
  const query = searchInput.value.trim();

  if (query === "") {
    alert("Please enter a recipe name!");
    return;
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayResults(data.meals);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      resultsDiv.innerHTML = "<p>Something went wrong. Try again later!</p>";
    });
}

function displayResults(meals) {
  resultsDiv.innerHTML = "";

  if (!meals) {
    resultsDiv.innerHTML = "<p>No recipes found. Try another search!</p>";
    return;
  }

  meals.forEach(meal => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="card-content">
        <h3 onclick="showRecipe('${meal.idMeal}')">${meal.strMeal}</h3>
        <p><b>Category:</b> ${meal.strCategory}</p>
        <p><b>Area:</b> ${meal.strArea}</p>
      </div>
    `;

    resultsDiv.appendChild(card);
  });
}

function showRecipe(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];

      modalTitle.textContent = meal.strMeal;
      modalImage.src = meal.strMealThumb;
      modalCategory.textContent = `Category: ${meal.strCategory}`;
      modalArea.textContent = `Area: ${meal.strArea}`;
      modalInstructions.textContent = meal.strInstructions;

      // Build ingredients list
      modalIngredients.innerHTML = "";
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
          const li = document.createElement("li");
          li.textContent = `${ingredient} - ${measure}`;
          modalIngredients.appendChild(li);
        }
      }

      modal.style.display = "flex";
    });
}

function closeModal() {
  modal.style.display = "none";
}
