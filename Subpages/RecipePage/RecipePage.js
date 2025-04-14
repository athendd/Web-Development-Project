let foodNutrientData = {};

const GRAMS_TO_TEASPOONS = [6.8, 4.93, 3.47, 2.61, 4.49, 3.55, 6.31, 5];
const GRAMS_TO_TABLESPOONS =  [20.4, 14.79, 10.42, 7.8, 13.47, 10.65, 18.93, 15];
const GRAMS_TO_CUPS =  [326.49, 236.59, 166.79, 125.16, 215.53, 170.34, 302.83, 250];
const GRAMS_TO_OUNCES =  28.35;

const measurementDropdown = document.getElementById('measurement');
const measurementValueInput = document.getElementById('measurementValue');
const inputWarningMessage = document.getElementById('inputWarningMessage');
const measurementOutput = document.getElementById('measurementOutput');

const titleLink = document.getElementById("title");
const imageLink = document.getElementById("image");
const ingredientsLink = document.getElementById("ingredients");
const instructionsLink = document.getElementById("instructions");
const cookingTipsLink = document.getElementById("cooking-tips-list");
const referencesLink = document.getElementById("reference-list");
const nutritionSummaryLink = document.getElementById("nutrition-summary-container");
const spinnerContainerLink = document.getElementById("spinnerContainer");
const substitutionsDiv = document.getElementById('substitutionsDiv');

function convertGramsToUnit(grams, unit, types) {
    grams = Number(grams);
    switch (unit) {
        case "Teaspoon":
            let teaspoonCalculations = [];
            for (let i = 0; i < types.length; i++){
                teaspoonCalculations.push((grams/ GRAMS_TO_TEASPOONS[i]).toFixed(2))
            }
            return teaspoonCalculations;
        case "Tablespoon":
            let tablespoonCalculations = [];
            for (let i = 0; i < types.length; i++){
                tablespoonCalculations.push((grams/ GRAMS_TO_TABLESPOONS[i]).toFixed(2))
            }
            return tablespoonCalculations;
        case "Cups":
            let cupsCalculations = [];
            for (let i = 0; i < types.length; i++){
                cupsCalculations.push((grams/ GRAMS_TO_CUPS[i]).toFixed(2))
            }
            return cupsCalculations;
        case "Ounces":
            return (grams / GRAMS_TO_OUNCES).toFixed(2);
        default:
            return "Invalid unit";
    }
}

function updateMeasurementOutput(result, unit, types) {
    measurementOutput.innerHTML = '';

    if (unit === 'Ounces'){
        measurementOutput.innerHTML = `<span style=text-align: center; font-size: 1em;><strong>${unit}</strong></span> <br> <br>`;
        measurementOutput.innerHTML += `${result}`;
    }
    else{
        measurementOutput.innerHTML = `<span style=text-align: center; font-size: 1em;><strong>${unit}</strong></span> <br> <br>`;
        for (let i = 0; i < types.length; i++){
            measurementOutput.innerHTML += `${types[i]}: ${result[i]} <br>`;
        }
    }
    measurementOutput.style.color = "black";
}

function displayInputWarning(message) {
    inputWarningMessage.textContent = message;
    inputWarningMessage.style.color = 'red';
    measurementOutput.innerHTML = '';
    measurementOutput.style.color = "white";
}

function calculateMeasurement() {
    const measurementTypes =  ['Honey', 'Water', 'Sugar', 'Flour', 'Butter', 'Rice', 'Salt', 'General'];
    const measurementType = measurementDropdown.value;
    const inputValue = measurementValueInput.value.trim();

    if (inputValue === "") {
        displayInputWarning('Input a number with no unnecessary spaces or markings');
        return;
    }

    const numericValue = Number(inputValue);

    if (isNaN(numericValue)) {
        displayInputWarning('Invalid input. Please enter a valid number.');
        return;
    }

    const finalInput = numericValue.toFixed(2);

    if (finalInput > 1000000 || finalInput < 0) {
        displayInputWarning('Inputted number must be between 0 and 1000000');
        return;
    }

    inputWarningMessage.style.color = 'white'; 

    const conversionResult = convertGramsToUnit(finalInput, measurementType, measurementTypes);
    updateMeasurementOutput(conversionResult, measurementType, measurementTypes);
}

function turnOnCalculate(){
    nutritionSummaryLink.style.display = 'none';
    spinnerContainerLink.style.display = 'flex';
}

function turnOffCalculate(){
    nutritionSummaryLink.style.display = 'block';
    spinnerContainerLink.style.display = 'none';
}

function createButton(div){
    const substitutionButton = document.createElement('button');
    substitutionButton.style = 'margin-bottom: 5%; width: 25%; height: 2em; font-size:large;';
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
    for (const ingredient of Object.keys(foodNutrientData)){
        const optionsList = Object.keys(foodNutrientData[ingredient]);
        const newDiv = document.createElement('div');
        newDiv.style.display = 'flex';
        createParagraph(newDiv, ingredient);
        createDropDown(newDiv, ingredient, optionsList);
        substitutionsDiv.appendChild(newDiv);
    }
    createButton(substitutionsDiv);
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
    const updatedFoodDictionary = getUpdatedNutritionDictionary(false);
    setNutritionTable(updatedFoodDictionary);
}

function filterFoods(currentIngredient, foods, recipe)
{
    const gramCalculations = recipe['gram calculations'];
    const categories = recipe['categories'];
    foodNutrientData[currentIngredient] = {};
    currentFoodData = foodNutrientData[currentIngredient];
    const currentCategories = categories[currentIngredient];
    for (const food of foods)
    {
        if (currentCategories.includes(food.foodCategory) && (food.servingSizeUnit == "g" || !food.hasOwnProperty("servingSize")))
        {
            let key = food.description;
            if (food.brandName){
                key = food.brandName + ' ' + key;
            }
            else{
                if (food.brandOwner){
                    key = food.brandOwner + ' ' + key;
                }
            }

            if (Object.keys(currentFoodData).includes(key) === false){
                currentFoodData[key] = processNecessaryNutrition(food.foodNutrients, gramCalculations[currentIngredient]);
            }
            
        }
    }
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

    const ingredients = Object.keys(foodNutrientData);

    let indices = new Array(ingredients.length);

    if (initialRun){
        indices.fill(0);
    }
    else{
        for (let i = 0; i < ingredients.length; i++){
            indices[i] = getDropDownData(ingredients[i]);
        }
    }

    for (let i = 0; i < ingredients.length; i++){
        const currentIngredient = foodNutrientData[ingredients[i]];
        const keys = Object.keys(currentIngredient);
        const currentNutrition = currentIngredient[keys[indices[i]]];
        for (let nutrient of Object.keys(newNutritionDictionary)){
            if (currentNutrition[nutrient]){
                newNutritionDictionary[nutrient] += currentNutrition[nutrient];
            }
        }
    }

    turnOffCalculate();
    return newNutritionDictionary;
}

function processNecessaryNutrition(nutrients, gramCount) {
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

    const nutrientIds = nutrients.map(obj => obj["nutrientId"]);

    if (!nutrientIds.includes(1005)) {
        delete nutrientMap[1005];
        nutrientMap[1050] = "Carbohydrate";
    }

    const foodNutrientValues = {};
    nutrients.forEach(attr => {
        if (nutrientMap[attr.nutrientId]) {
            let newValue = ((attr.value * gramCount) / 100);
            foodNutrientValues[nutrientMap[attr.nutrientId]] = newValue;
        }
    });
    return foodNutrientValues;
}

async function fetchFoodData(recipe){
    const apiKey = "ubzgeM1ViKn4aGfow4lahmRexcHWLMUkYaYgE9SV";
    const results = {};
    const queries = recipe['queries'];
    const ingredients = Object.keys(recipe['queries']);
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

    for (let ingredient of ingredients){
        (filterFoods(ingredient, results[ingredient].foods, recipe));
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch('http://localhost:3000/data');
    const data = await response.json();
    const urlParams = new URLSearchParams(window.location.search);
    const recipeName = urlParams.get("recipe");
    const currentRecipe = data.Recipes[recipeName];
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

    ingredients = Object.keys(currentRecipe['categories']);

    if (diff >= 30){
        currentRecipe['lastUpdate'] = currentDate.toString();
        turnOnCalculate();
        await fetchFoodData(currentRecipe);
        const updatedFoodDictionary = getUpdatedNutritionDictionary(true);
        updateRecipeNutrition(updatedFoodDictionary, currentRecipe['nutrition']);
        setNutritionTable(currentRecipe['nutrition']);
        updateDatabase(currentRecipe);
    }
    else{
        setNutritionTable(currentRecipe['nutrition']);
        await fetchFoodData(currentRecipe);
    }
    createSubstitutionBlock();
});