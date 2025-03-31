document.addEventListener("DOMContentLoaded", function () {
    // Populate scolling egg images in top banner
    const bannerImages = document.querySelector(".banner-images");
    const imageFolder = "../Pictures/ScrollingEggs/";
    const imageCount = 20;
    const imageExtension = ".jpg";
    for (let i = 1; i <= imageCount; i++) {
        let img = document.createElement("img");
        img.src = `${imageFolder}Egg${i}${imageExtension}`;
        img.alt = `Egg ${i}`;
        bannerImages.appendChild(img);
    }
    // Duplicate images for smooth infinite scrolling
    for (let i = 1; i <= imageCount; i++) {
        let img = document.createElement("img");
        img.src = `${imageFolder}Egg${i}${imageExtension}`;
        img.alt = `Egg ${i}`;
        bannerImages.appendChild(img);
    }


    // Random recipe button funtionality
    const recipes = [
        // General
        "Baked",
        "Boiled",
        "Deviled",
        "Omelette",
        "Over Easy",
        "Poached",
        "Scrambled",
        "Sunny Side Up",
        // America
        "Avocado Toast",
        "Breakfast Burrito",
        "Eggs Benedict",
        // Brazil
        "Feijao Tropeiro",
        "Moqueca de Ovos",
        "Ovos Mexidos com Chorizo",
        // China
        "Century Egg and Tofu",
        "Egg Foo Young",
        "Egg Fried Rice",
        "Steamed Egg Custard",
        // France
        "Croque Madame",
        "French Omelette",
        "Quiche Lorraine",
        "Sous Vide",
        // Mexican
        "Chilaquiles con Heuvos",
        "Huevos Divorciados",
        "Heuvos Rancheros",
        // Morocco
        "Kefta Mkaouara",
        "Shakshuka",
        "Vegetable and Egg Tagine"
    ];
    const button = document.getElementById("recipeButton");
    button.addEventListener("click", function () {
        let chosenIndex = Math.round(Math.random() * recipes.length);
        window.location.href = `../Subpages/RecipePage/RecipePage.html?recipe=${encodeURIComponent(recipes[chosenIndex])}`;
    });


    // Populate country links/images
    const contries = ["General", "America", "Brazil", "China", "France", "Mexico", "Morocco"];
    const countryPages = document.querySelector(".country-flags");
    countryPages.innerHTML = ""; // Clear previous content
    contries.forEach(country => {
        const countryDiv = document.createElement("div");

        const countryLink = document.createElement("a");
        countryLink.href = `../Subpages/CountryPage/CountryPage.html?country=${encodeURIComponent(country)}`;

        const countryImg = document.createElement("img");
        countryImg.src = `../Pictures/CountryFlags/${country}.png`;
        countryImg.alt = `${country} Flag`;

        countryLink.appendChild(countryImg);
        countryLink.innerHTML += `<br>${country}`;

        countryDiv.appendChild(countryLink);
        countryPages.appendChild(countryDiv);
    });
});

/*
const dishes = ["Omelette", "Boiled Egg", "Scrambled Eggs", "Poached Egg", "Sunny Side Up Egg",
"Over Easy Egg", "Ovos Mexidos com Chouriço", "Feijao Tropeiro", "Moqueca de Ovos", "Shakshuka",
"Kefa Mkaouara", "Vegetable and Egg Tagine", "Chilaquiles con Heuovs", "Heuvos Divorciados",
"Heuvos Rancheros", "Avocado Toast", "Breakfeast Burrito", "Eggs Benedict", "Century Egg and Tofu",
"Egg Foo Young", "Steamed Egg Custard", "Egg Fried Rice", "French Omlette", "Croque Madame", 
"Quiche Lorraine", "Sous Vide"];
*/