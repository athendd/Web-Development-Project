const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = 'RecipesFile.json';

app.use(express.json());
app.use(cors());

// Read data
app.get('/data', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Write data
app.post('/data', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) return res.status(500).send('Error reading data');
        let jsonData = JSON.parse(data);
        const recipeName = req.body.name;
        if (jsonData.Recipes && jsonData.Recipes[recipeName]) {
            jsonData.Recipes[recipeName] = req.body.data;
            fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing data');
                res.json({ message: 'Data updated successfully' });
            });
        } else {
            res.status(404).send('Recipe not found');
        }
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));