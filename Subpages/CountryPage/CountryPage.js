document.addEventListener("DOMContentLoaded", function () {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get("country");

    // Reference HTML elements
    const countryTitle = document.getElementById("country-title");
    const countryRecipes = document.querySelector(".country-recipes");

    // Country data
    const countryData = {
        General: {
            title: "General Recipes",
            recipes: ["Baked", "Boiled", "Deviled", "Omelette","Over Easy", "Poached", "Scrambled", "Sunny Side Up"]
        },
        America: { 
            title: "American Recipes",
            recipes: ["Avocado Toast", "Breakfast Burrito", "Eggs Benedict"]
        },
        Brazil: { 
            title: "Brazilian Recipes",
            recipes: ["Feijao Tropeiro", "Moqueca de Ovos", "Ovos Mexidos com Chouriço"]
        },
        China: { 
            title: "Chinese Recipes",
            recipes: ["Century Egg and Tofu", "Egg Foo Young", "Egg Fried Rice", "Steamed Egg Custard"]
        },
        France: { 
            title: "French Recipes",
            recipes: ["Croque Madame", "French Omelette", "Quiche Lorraine", "Sous Vide"]
        },
        Mexico: { 
            title: "Mexican Recipes",
            recipes: ["Chilaquiles con Huevos", "Huevos Divorciados", "Huevos Rancheros"]
        },
        Morocco: { 
            title: "Moroccan Recipes",
            recipes: ["Kefta Mkaouara", "Shakshuka", "Vegetable and Egg Tagine"]
        }
    };

    // Set country title
    countryTitle.textContent = countryData[country].title;

    // Populate recipe links/images
    countryRecipes.innerHTML = ""; // Clear previous content
    countryData[country].recipes.forEach(recipe => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

        const recipeLink = document.createElement("a");
        recipeLink.href = `../RecipePage/RecipePage.html?recipe=${encodeURIComponent(recipe)}`;

        const recipeImg = document.createElement("img");
        recipeImg.src = `../../Pictures/Recipes/${country}/${recipe}.jpg`;
        recipeImg.alt = `${recipe} Image`;

        recipeLink.appendChild(recipeImg);
        recipeLink.innerHTML += `<br>${recipe}`;

        recipeDiv.appendChild(recipeLink);
        countryRecipes.appendChild(recipeDiv);
    });
});
