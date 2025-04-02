function compareNutritionDics(scraped, current)
{
    const keys = Object.keys(current);
    for (const key of keys)
    {
        if (scraped[key] != 0 && scraped[key] != current[key])
        {
            current[key] = scraped[key];
        }
    }
    return current;
}

function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}

function filterFoods(foods, currentFood, categories)
{
    let updatedFoods = new Array();
    console.log(currentFood);
    const currentCategories = categories[currentFood];
    console.log(currentCategories);
    for (const food of foods)
    {
        if (currentCategories.includes(food.foodCategory) && (food.servingSizeUnit == "g" || !food.hasOwnProperty("servingSize")))
        {
            updatedFoods.push(food);
        }
    }
    
    return updatedFoods;
}

async function searchFood(query)
{
    const apiKey = "ubzgeM1ViKn4aGfow4lahmRexcHWLMUkYaYgE9SV";
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${apiKey}`;
    try
    {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.foods || data.foods.length == 0)
        {
            console.log("Unable to find " + query +  " in database");
            return null;
        }
        return data;
    } 
    catch(error)
    {
        console.log("Error getting the food", error);
        return null;
    }
}

function checkData(nutrientIds, ids, food, nutrientMap)
{
    for (const id of ids)
    {
        if (!nutrientIds.includes(Number(id)))
        {   
            console.log(food + " does not have a value for " + nutrientMap[id])
        }
    }
}

function getFoodData(data, currentFood, gramCalculations, foodDictionary, categories)
{
    const updatedFoods = filterFoods(data.foods, currentFood, categories);
    const firstFoodItem = updatedFoods[0];
    const foodNutrients = firstFoodItem.foodNutrients;
    let nutrientMap = {
        1063: "Sugars",
        1004: "Total Fat",
        1258: "Saturated Fat",
        1079: "Fiber",
        1093: "Sodium",
        1005: "Carbohydrate",
        1008: "Calories",
        1253: "Cholesterol",
        1003: "Protein"
    };

    const nutrientIds = foodNutrients.map(obj => obj["nutrientId"]);

    if (!nutrientIds.includes(1005))
    {
        delete nutrientMap[1005];
        nutrientMap[1050] = "Carbohydrate";
    }
    console.log(firstFoodItem);

    /*
    Only use to check if an ingredient contains all necessary nutrients
    Typically, if an ingredient is missing a nutrient that is because the ingredient has 0 for that nutrient

    const ids = Object.keys(nutrientMap);
    checkData(nutrientIds, ids, currentFood, nutrientMap);
    */

    foodNutrients.forEach(attr =>{
        if (nutrientMap[attr.nutrientId]) {
            let newValue = 0;
            newValue = ((attr.value * gramCalculations[currentFood])/100);
            foodDictionary[nutrientMap[attr.nutrientId]] += newValue;
        }
    });
}   

async function processAllFoods(queries, gramCalculations, categories)
{
   let foodDictionary = {
        "Protein": 0,
        "Cholesterol": 0,
        "Total Fat": 0,
        "Sugars": 0,
        "Calories": 0,
        "Sodium": 0, 
        "Saturated Fat": 0,
        "Fiber": 0,
        "Carbohydrate": 0
   };

    const foodPromises = Object.values(queries).map(query => searchFood(query));    
    const results = await Promise.all(foodPromises);

    Object.keys(queries).forEach((key, index) => {
        if (results[index] != null){
            getFoodData(results[index], key, gramCalculations, foodDictionary, categories);
        }
    });   
    
    
    return foodDictionary;
}

async function addNewData(data) {

    await fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

function daysBetween(date1, date2)
{
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}

function setNutritionTable(nutritionDictionary)
{
    document.querySelector("#proteinRow td:last-child").textContent = nutritionDictionary["Protein"].toFixed(2) + " G";
    document.querySelector("#sugarsRow td:last-child").textContent = nutritionDictionary["Sugars"].toFixed(2) + " G";
    document.querySelector("#saturatedFatRow td:last-child").textContent = nutritionDictionary["Saturated Fat"].toFixed(2) + " G";
    document.querySelector("#totalFatRow td:last-child").textContent =  nutritionDictionary["Total Fat"].toFixed(2) + " G";
    document.querySelector("#sodiumRow td:last-child").textContent = nutritionDictionary["Sodium"].toFixed(2) + " MG";
    document.querySelector("#carbohydrateRow td:last-child").textContent = nutritionDictionary["Carbohydrate"].toFixed(2) + " G";
    document.querySelector("#caloriesRow td:last-child").textContent = nutritionDictionary["Calories"].toFixed(2) + " KCAL";
    document.querySelector("#cholesterolRow td:last-child").textContent = nutritionDictionary["Cholesterol"].toFixed(2) + " MG";
    document.querySelector("#fiberRow td:last-child").textContent = nutritionDictionary["Fiber"].toFixed(2) + " G";  
}

document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch('http://localhost:3000/data');
    const data = await response.json();
    const urlParams = new URLSearchParams(window.location.search);
    const recipeName = urlParams.get("recipe");
    let currentRecipe = data.Recipes[recipeName];
    console.log(currentRecipe);
    let titleLink = document.getElementById("title");
    let imageLink = document.getElementById("image");
    let ingredientsLink = document.getElementById("ingredients");
    let instructionsLink = document.getElementById("instructions");
    let cookingTipsLink = document.getElementById("cooking-tips-list");
    let referencesLink = document.getElementById("reference-list");
    titleLink.textContent = currentRecipe["name"];
    imageLink.src = currentRecipe["image"];
    currentRecipe["ingredients"].forEach(item => {
        const li = document.createElement("li"); 
        li.textContent = item; 
        ingredientsLink.appendChild(li); 
    });
    currentRecipe["instructions"].forEach(item => {
        const li = document.createElement("li"); 
        li.textContent = item; 
        instructionsLink.appendChild(li); 
    });
    currentRecipe["cooking tips"].forEach(item => {
        const li = document.createElement("li"); 
        li.textContent = item; 
        cookingTipsLink.appendChild(li); 
    });
    currentRecipe["references"].forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item;      
        a.textContent = item; 
        // Opens the link in a new tab
        a.target = "_blank";  
        li.appendChild(a);   
        referencesLink.appendChild(li); 
    })

    let nutritionDictionary = currentRecipe["nutrition"];

    const currentDate = new Date();
    const lastUpdate = new Date(currentRecipe["lastUpdate"]);
    const diff = daysBetween(currentDate, lastUpdate);
    if (diff >= 30)
    {
        let nutritionTable = document.getElementById("nutrition-summary-container");
        let spinnerContainer = document.getElementById("spinnerContainer");
        nutritionTable.style.display = "none";
        spinnerContainer.style.display="flex";
        

        currentRecipe["lastUpdate"] = currentDate.toString();
        const foodDictionary = await processAllFoods(currentRecipe["queries"], currentRecipe["gram calculations"], currentRecipe["categories"]);

        if (deepEqual(nutritionDictionary, foodDictionary) == false)
        {
            nutritionDictionary = compareNutritionDics(foodDictionary, nutritionDictionary);
        }
        /*
        fetch('http://localhost:3000/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentRecipe)
        });
        */
        fetch('http://localhost:3000/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: recipeName, // Ensure this is defined in your frontend
                data: currentRecipe // The actual recipe data
            })
        });
        

        spinnerContainer.style.display="none";
        nutritionTable.style.display = "block";
    }

    
    setNutritionTable(nutritionDictionary);
});

