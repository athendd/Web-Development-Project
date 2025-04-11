let gramCounts;
let categories;
let ingredients;
let foodData;
let optionsDictionary = {};

function calculateMeasurement(){
    const typeOfMeasurement = document.getElementById('measurement');
    const measurementValue = document.getElementById('measurementValue');
    let warningMessage = document.getElementById('inputWarningMessage');
    let output = document.getElementById('measurementOutput');
    if (measurementValue.value === ""){
        warningMessage.textContent = 'Need to input a number with no uncessary spaces or markings';
        warningMessage.style.color='red';
        output.style.color = "white";
    }
    else{
        let givenInput = Number(measurementValue.value).toFixed(2);
        const finalInput = Number(givenInput);

        if (finalInput > 1000000 || finalInput < 0){
            warningMessage.textContent = 'Inputted number must be between 0 and 1000000';
            warningMessage.style.color='red';
            output.style.color = "white";
        }
        else{
            warningMessage.style.color='white';

            if(typeOfMeasurement.value === "Teaspoon"){
                output.textContent = gramsToTeaspoons(finalInput) + ' Teaspoons';
                output.style.color = "black"; 
            }
            else if(typeOfMeasurement.value === "Tablespoon"){
                output.textContent = gramsToTablespoons(finalInput) + ' Tablespoons';
                output.style.color = "black";
            }
            else if(typeOfMeasurement.value === "Cups"){
                output.textContent = gramsToCups(finalInput) + ' Cups';
                output.style.color = "black";
            }
            else{
                output.textContent = gramsToOunces(finalInput) + ' Ounces';
                output.style.color = "black";
            }
        }
    }
}

function gramsToCups(currentGrams){
    const cups = (currentGrams / 250).toFixed(2);
    return cups;
}
function gramsToTeaspoons(currentGrams){
    const teaspoons = (currentGrams / 5.69).toFixed(2);
    return teaspoons;

}
function gramsToTablespoons(currentGrams){
    const tablespoons = (currentGrams / 21.25).toFixed(2);
    return tablespoons;

}
function gramsToOunces(currentGrams){
    const ounces = (currentGrams / 0.035).toFixed(2);
    return ounces;
}

function turnOnCalculate(){
    document.getElementById("nutrition-summary-container").style.display = 'none';
    document.getElementById("spinnerContainer").style.display = 'flex';
}

function turnOffCalculate(){
    document.getElementById('nutrition-summary-container').style.display = 'block';
    document.getElementById('spinnerContainer').style.display = 'none';
}

function createOptionsList(options){
    optionsList = [];
    for (const option of options){
        optionsList.push(option.foodName);
    }

    return optionsList;
}

function createButton(div){
    const substitutionButton = document.createElement('button');
    substitutionButton.style = 'margin-bottom: 5%;';
    substitutionButton.textContent = 'Calculate';
    substitutionButton.onclick = calculateNutrients;
    div.appendChild(substitutionButton);
}

function createParagraph(div, ingredient){
    const newParagraph = document.createElement('p');
    newParagraph.style = 'padding-left: 1%; font-weight: bold; font-size: 1.5em;'
    const paragraphText = document.createTextNode(ingredient);
    newParagraph.appendChild(paragraphText);
    div.appendChild(newParagraph);
}

function createDropDown(div, ingredient, options){
    const dropdown = document.createElement('select');
    dropdown.style = 'width: 40%; height: 10%; margin-left: 10%; margin-top: 5%;';
    options.forEach(item => {
        const option = document.createElement('option');
        option.textContent = item;         
        dropdown.appendChild(option);
    });
    dropdown.id = `dropDownFor${ingredient}`;

    div.appendChild(dropdown)
}

function createSubstitutionBlock(){
    const substitutions = document.getElementById('substitutionsDiv');

    for (const ingredient in optionsDictionary){
        const optionsList = createOptionsList(optionsDictionary[ingredient]);
        const newDiv = document.createElement('div');
        newDiv.style.display = 'flex';
        createParagraph(newDiv, ingredient);
        createDropDown(newDiv, ingredient, optionsList);
        substitutions.appendChild(newDiv);
    }
    createButton(substitutions);
}

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

function calculateNutrients(){
    turnOnCalculate();
    const updatedFoodDictionary = getUpdatedNutritionDictionary(false);
    console.log(updatedFoodDictionary);
    setNutritionTable(updatedFoodDictionary);
    turnOffCalculate();

}

function filterFoods(foods, currentFood)
{
    let updatedFoods = new Array();
    const currentCategories = categories[currentFood];
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

function daysBetween(date1, date2)
{
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}

function updateRecipeNutrition(updatedDic, currDic){
    if (deepEqual(currDic, updatedDic) === false) {
        currDic = compareNutritionDics(updatedDic, currDic);
    }
}

function getDropDownData(food){
    let dropdown = document.getElementById(`dropDownFor${food}`);
    const selectedIndex = dropdown.selectedIndex;
    return selectedIndex;
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

function updateDatabase(recipe){
    fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: recipe['name'],
            data: recipe
        })
    });
}

function populateOptionsDictionary(recipe){
    for (const food in recipe['queries']){
        if (foodData[food] && foodData[food].foods){
            optionsDictionary[food] = processFoodDataForOptions(food);
        }
        else{
            optionsDictionary[food] = [];
        }
    }
}

function getUpdatedNutritionDictionary(initialRun){
    let newNutritionDictionary = {
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

    try{
        for (const food of ingredients){
            if (foodData[food]){
                const foodNutrientData = processFoodDataForNutrition(food, initialRun);
                for (const nutrient in foodNutrientData){
                    newNutritionDictionary[nutrient] += foodNutrientData[nutrient];
                }
            }
        }
    }catch (error) {
        console.error("Error processing food data or timeout:", error);
        return NaN;
    }finally {
        turnOffCalculate();
        return newNutritionDictionary;
    }
}

function processFoodDataForOptions(currentFood) {
    const updatedFoods = filterFoods(foodData[currentFood].foods, currentFood);
    const options = [];
    for (let food of updatedFoods) {
        const option = {};
        let foodToAdd = food.description;
        if (Object.keys(food).includes('brandName')) {
            foodToAdd += ' ' + food.brandName;
        }
        option['foodName'] = foodToAdd;
        option['foodNutrients'] = food.foodNutrients;
        options.push(option);
    }
    return options;
}

function processFoodDataForNutrition(currentFood, initialRun) {
    const updatedFoods = filterFoods(foodData[currentFood].foods, currentFood);
    let foodItem;
    if (!updatedFoods || updatedFoods.length === 0) {
        return {};
    }
    if (initialRun === true){
        foodItem = updatedFoods[0];
    }
    else{
        foodItem = updatedFoods[getDropDownData(currentFood)];
    }
    const foodNutrients = foodItem.foodNutrients;
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

    if (!nutrientIds.includes(1005)) {
        delete nutrientMap[1005];
        nutrientMap[1050] = "Carbohydrate";
    }

    const foodNutrientValues = {};
    foodNutrients.forEach(attr => {
        if (nutrientMap[attr.nutrientId]) {
            let newValue = ((attr.value * gramCounts[currentFood]) / 100);
            foodNutrientValues[nutrientMap[attr.nutrientId]] = newValue;
        }
    });
    return foodNutrientValues;
}

async function fetchFoodData(queries){
    const apiKey = "ubzgeM1ViKn4aGfow4lahmRexcHWLMUkYaYgE9SV";
    const results = {};
    const foodPromises = Object.entries(queries).map(async ([foodName, query]) => {
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!data.foods || data.foods.length === 0) {
                console.log(`Unable to find ${query} in database`);
                results[foodName] = null;
            } else {
                results[foodName] = data;
            }
        } catch (error) {
            console.error(`Error getting food data for ${query}`, error);
            results[foodName] = null;
        }
    });
    await Promise.all(foodPromises);
    return results;
}

document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch('http://localhost:3000/data');
    const data = await response.json();
    const urlParams = new URLSearchParams(window.location.search);
    const recipeName = urlParams.get("recipe");
    let currentRecipe = data.Recipes[recipeName];
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
        a.target = "_blank";  
        li.appendChild(a);   
        referencesLink.appendChild(li); 
    })

    const currentDate = new Date();
    const lastUpdate = new Date(currentRecipe["lastUpdate"]);
    const diff = daysBetween(currentDate, lastUpdate);

    gramCounts = currentRecipe['gram calculations'];
    categories = currentRecipe['categories'];
    ingredients = Object.keys(currentRecipe['categories']);

    if (diff >= 30){
        currentRecipe['lastUpdate'] = currentDate.toString();
        turnOnCalculate();
        foodData = await fetchFoodData(currentRecipe['queries']);
        const updatedFoodDictionary = getUpdatedNutritionDictionary(true);
        updateRecipeNutrition(updatedFoodDictionary, currentRecipe['nutrition']);
        setNutritionTable(currentRecipe['nutrition']);
        updateDatabase(currentRecipe);
    }
    else{
        setNutritionTable(currentRecipe['nutrition']);
        foodData = await fetchFoodData(currentRecipe['queries']);
    }
    populateOptionsDictionary(currentRecipe);
    createSubstitutionBlock();
});

