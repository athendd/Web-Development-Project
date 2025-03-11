document.addEventListener("DOMContentLoaded", function () {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get("country");

    // Reference elements
    const titleElement = document.getElementById("country-title");
    const contentElement = document.getElementById("country-content");

    // Country data
    const countryData = {
        GEN: { title: "General Recipes", content: "Here are some general egg recipes." },
        USA: { title: "American Recipes", content: "Enjoy classic American egg dishes like Eggs Benedict and Breakfast Burritos." },
        FRC: { title: "French Recipes", content: "Try delicious French egg dishes like Quiche Lorraine and French Omelette." },
        MOR: { title: "Moroccan Recipes", content: "Taste Moroccan egg dishes like Shakshuka and Egg Tagine." },
        MXC: { title: "Mexican Recipes", content: "Spice up your meal with Chilaquiles and Huevos Rancheros." },
        BRZ: { title: "Brazilian Recipes", content: "Enjoy Feijão Tropeiro and Moqueca de Ovos." },
        CHN: { title: "Chinese Recipes", content: "Explore Egg Fried Rice and Steamed Egg Custard." }
    };

    // Set content if country is found, otherwise show default
    if (countryData[country]) {
        titleElement.textContent = countryData[country].title;
        contentElement.textContent = countryData[country].content;
    } else {
        titleElement.textContent = "Unknown Country";
        contentElement.textContent = "Please select a valid country.";
    }
});
