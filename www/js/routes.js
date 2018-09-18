module.exports = class Routes {

  constructor(app, nutrition) {
    this.app = app;
    this.setRoutes();
    this.nutrition = nutrition;
  }

  setRoutes() {
    const fs = require('fs');

    this.app.get(
      '/json/searchlist', (req, res) => {
        let list = [];
        let recepies = fs.readFileSync('./www/json/recepies.json');
        recepies = JSON.parse(recepies);
        for (let item of recepies) {
          list.push(item._name);
        }
        res.send(list);
      });

    this.app.get(
      '/json/livsmlist', (req, res) => {
        let list = [];
        let data = fs.readFileSync('./www/json/livsmedelsdata.json');
        data = JSON.parse(data);
        for (let item of data) {
          list.push(item.Namn);
        }
        res.send(list);
      });

    this.app.post(
      '/submit-recipe', (req, res) => {
        let rawData = fs.readFileSync('./www/json/recepies.json');
        let recepies = JSON.parse(rawData);
        recepies.push(req.body);
        fs.writeFileSync('./www/json/recepies.json', JSON.stringify(recepies));
        res.send("done");
      });

    this.app.post(
      '/setnutritions', (req, res) => {
        let nutrition = this.nutrition;
        let ingredientList = req.body;
        for (let ingredient of ingredientList) {
          ingredient.nutrition = setNutrition(ingredient._id);
        }

        function setNutrition(ingredientID) {
          let rawData = fs.readFileSync('./www/json/livsmedelsdata.json');
          let livsmdata = JSON.parse(rawData);

          loop1: for (let item of livsmdata) {
            if (item.Namn == ingredientID) {
              loop2: for (let n of item.Naringsvarden.Naringsvarde) {
                let val = Number(n.Varde.replace(',', '.').replace(/\s+/g, ''));
                if (n.Namn == "Energi (kJ)") {
                  nutrition.energiKj = val;
                  continue loop2;
                }
                if (n.Namn == "Energi (kcal)") {
                  nutrition.energiKcal = val;
                  continue loop2;
                }
                if (n.Namn == "Kolhydrater") {
                  nutrition.kolhydrater = val;
                  continue loop2;
                }
                if (n.Namn == "Protein") {
                  nutrition.protein = val;
                  continue loop2;
                }
                if (n.Namn == "Fett") {
                  nutrition.fett = val;
                  continue loop2;
                }
                if (n.Namn == "Järn") {
                  nutrition.jarn = val;
                  continue loop2;
                }
                if (n.Namn == "Vitamin A") {
                  nutrition.vitaminA = val;
                  continue loop2;
                }
                if (n.Namn == "Vitamin B6") {
                  nutrition.vitaminB6 = val;
                  continue loop2;
                }
                if (n.Namn == "Vitamin B12") {
                  nutrition.vitaminB12 = val;
                  continue loop2;
                }
                if (n.Namn == "Vitamin C") {
                  nutrition.vitaminC = val;
                  continue loop2;
                }
                if (n.Namn == "Vitamin D") {
                  nutrition.vitaminD = val;
                  continue loop2;
                }
                if (n.Namn == "Vitamin E") {
                  nutrition.vitaminE = val;
                  continue loop2;
                }
              }
              break loop1;
            }
          }
          return nutrition;
        }
        res.send(ingredientList);
      });
  }
}