/*
Use this code to see what categories your ingredient is apart of in the API. Also to find out how you should write your query in order to get the 
type of ingredient that you desire
*/

import readline from "readline";


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

async function main() {
    const query = "Ginger Root";
    let foodData = null;
    foodData = await searchFood(query);
    console.log(foodData.foods); // Inspect the data here
    // Keep the process alive until the user presses the stop button
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Press Enter to exit...", () => {
        rl.close();
    });
}

main(); 