document.addEventListener("DOMContentLoaded", function () {
    // random recipe button
    const dishes = [
        "Country Pages/GEN-Page.html",
        "Country Pages/USA-Page.html",
        "Country Pages/FRC-Page.html",
        "Country Pages/MOR-Page.html",
        "Country Pages/MXC-Page.html",
        "Country Pages/BRZ-Page.html",
        "Country Pages/CHN-Page.html"
    ];
    const button = document.getElementById("recipeButton");
    if (button) {
        button.addEventListener("click", function () {
            let chosenIndex = Math.floor(Math.random()*dishes.length);
            window.location.href = dishes[chosenIndex];
        });
    }

    // populates scolling egg images in top banner
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
});

/*
const dishes = ["Omelette", "Boiled Egg", "Scrambled Eggs", "Poached Egg", "Sunny Side Up Egg",
"Over Easy Egg", "Ovos Mexidos con Chourico", "Feijao Tropeiro", "Moqueca de Ovos", "Shakshuka",
"Kefa Mkaouara", "Vegetable and Egg Tagine", "Chilaquiles con Heuovs", "Heuvos Divorciados",
"Heuvos Rancheros", "Avocado Toast", "Breakfeast Burrito", "Eggs Benedict", "Century Egg and Tofu",
"Egg Foo Young", "Steamed Egg Custard", "Egg Fried Rice", "French Omlette", "Croque Madame", 
"Quiche Lorraine", "Sous Vide"];
*/