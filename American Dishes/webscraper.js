let foodDictionary;
/*
let foodDictionary = new Map([
    ["Protein", 0],
    ["Cholesterol", 0],
    ["Total Fat", 0],
    ["Sugars", 0],
    ["Calories", 0],
    ["Sodium", 0], 
    ["Saturated Fat", 0],
    ["Fiber", 0],
    ["Carbohydrates", 0]
]);
const gramCalculations = [30, 60, 28, 200, 50, 40, 28, 80];
const queries = ["Eggs, Grade A, Large, egg whole", "chorizo", "bacon", "tater tots", "yellow onion", "cheddar cheese", "sour cream", "flour tortilla"];
*/
window.processAllFoods = processAllFoods;
const event = new Event('dataLoaded');

//processAllFoods();

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

function getFoodData(data, index, gramCalculations)
{
    const unitDic = new Map([])
    const firstFoodItem = data.foods[0];
    const foodNutrients = firstFoodItem.foodNutrients;
    console.log(foodNutrients);

    for (const attr of foodNutrients)
    {
        let currentKey = attr.nutrientName;
        let value = attr.value;
        switch (currentKey)
        {
            case "Sugars, Total":
                let roundedSugars = parseFloat(((value * gramCalculations[index]) / 100).toFixed(2));
                let currentSugars = foodDictionary.get("Sugars") || 0; 
                let newSugars = parseFloat((currentSugars + roundedSugars).toFixed(2));
                foodDictionary.set("Sugars", newSugars); 
                break;
            case "Total lipid (fat)":
                let roundedTotalFat = parseFloat(((value * gramCalculations[index]) / 100).toFixed(2));
                let currentTotalFat = foodDictionary.get("Total Fat") || 0; 
                let newTotalFat = parseFloat((currentTotalFat + roundedTotalFat).toFixed(2));
                foodDictionary.set("Total Fat", newTotalFat); 
                break;
            case "Fatty acids, total saturated":
                let roundedSaturatedFat = parseFloat(((value * gramCalculations[index]) / 100).toFixed(2));
                let currentSaturatedFat = foodDictionary.get("Saturated Fat") || 0; 
                let newSaturatedFat = parseFloat((currentSaturatedFat + roundedSaturatedFat).toFixed(2));
                foodDictionary.set("Saturated Fat", newSaturatedFat); 
                break;
            case "Fiber, total dietary":
                let roundedFiber = parseFloat(((value * gramCalculations[index]) / 100).toFixed(2));
                let currentFiber = foodDictionary.get("Fiber") || 0; 
                let newFiber = parseFloat((currentFiber + roundedFiber).toFixed(2));
                foodDictionary.set("Fiber", newFiber); 
                break;
            case "Sodium, Na":
                let roundedSodium = parseFloat(((value * gramCalculations[index]) / 100).toFixed(2));
                let currentSodium = foodDictionary.get("Sodium") || 0; 
                let newSodium = parseFloat((currentSodium + roundedSodium).toFixed(2));
                foodDictionary.set("Sodium", newSodium); 
                break;
            case "Carbohydrate, by summation":
                let roundedCarbohydrates = parseFloat(((value * gramCalculations[index]) / 100).toFixed(2));
                let currentCarbohydrates = foodDictionary.get("Carbohydrates") || 0; 
                let newCarbohydrates = parseFloat((currentCarbohydrates + roundedCarbohydrates).toFixed(2));
                foodDictionary.set("Carbohydrates", newCarbohydrates); 
                break;
            case "Energy":
                if (attr.nutrientNumber == "208")
                {
                    let roundedCalories = parseFloat(((value * gramCalculations[index]) / 100).toFixed(2));
                    let currentCalories = foodDictionary.get("Calories") || 0; 
                    let newCalories = parseFloat((currentCalories + roundedCalories).toFixed(2));
                    foodDictionary.set("Calories", newCalories); 
                    break;
                }
            case "Cholesterol":
                let roundedCholesterol = parseFloat(((value * gramCalculations[index]) / 100).toFixed(2));
                let currentCholesterol = foodDictionary.get("Cholesterol") || 0; 
                let newCholesterol = parseFloat((currentCholesterol + roundedCholesterol).toFixed(2));
                foodDictionary.set("Cholesterol", newCholesterol); 
                break;
            case "Protein":
                let roundedProtein = parseFloat(((value * gramCalculations[index]) / 100).toFixed(2));
                let currentProtein = foodDictionary.get("Protein") || 0; 
                let newProtein = parseFloat((currentProtein + roundedProtein).toFixed(2)); 
                foodDictionary.set("Protein", newProtein); 
                break;
        }
    }
}   


async function processAllFoods(queries, gramCalculations)
{
    foodDictionary = new Map([
        ["Protein", 0],
        ["Cholesterol", 0],
        ["Total Fat", 0],
        ["Sugars", 0],
        ["Calories", 0],
        ["Sodium", 0], 
        ["Saturated Fat", 0],
        ["Fiber", 0],
        ["Carbohydrates", 0]
    ]);
    console.log(queries);
    const foodPromises = queries.map(query => searchFood(query));
    const results = await Promise.all(foodPromises);
    let index;
    let data;
    for (index = 0; index < results.length; index++)
    {
        data = results[index];
        getFoodData(data, index, gramCalculations);
    }
    document.dispatchEvent(event);
}


