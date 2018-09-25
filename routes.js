module.exports = class Routes {

  constructor(app, nutrition) {
    this.app = app;
    this.setRoutes();
    this.nutrition = nutrition;
  }

  setRoutes() {

    const path = require('path');
    const fs = require('fs');

    this.app.get(
      '/', (req, res) => {
        res.send('index');
      });

    this.app.get(
      '/getcategorylist', (req, res) => {
        let catlist = [];
        let categories = {};
        let data = fs.readFileSync('./www/json/recepies.json');
        data = JSON.parse(data);
        for (let recepe of data) {
          for (let category of recepe._categories) {
            //if category not exists in obj, create cat as prop in categories obj and add it to catlist
            if (categories[category] == undefined) {
              catlist.push(category);
              let key = category,
                obj = {
                  [key]: ['']
                };
              categories[category] = obj[category]
            }
          }
        }
        res.send(catlist);
      });

    this.app.post(
      '/authenticate/new', (req, res) => {
        const postBody = req.body;
        if (postBody.user == "Juulis" && postBody.password == "dannyking") {
          return res.sendFile(path.join(__dirname + '/www/add_recipe.html'));
        }
        res.send('<p>FEL LÖSEN, ÄR DU HACKARE ELLER!?</p>');
      });

    this.app.post(
      '/authenticate/edit', (req, res) => {
        const postBody = req.body;
        if (postBody.user == "Juulis" && postBody.password == "dannyking") {
          res.sendFile(path.join(__dirname + '/www/add_recipe.html'));
          res.send(true);
        } else
          res.send('<p>FEL LÖSEN, ÄR DU HACKARE ELLER!?</p>');
      });

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
        let nutrition = {};
        let recepe = req.body;
        let ingredientList = recepe._ingredients;
        for (let ingredient of ingredientList) {
          ingredient.nutrition = setNutrition(ingredient._id, ingredient._gram);
        }

        function setNutrition(ingredientID, amount) {
          let rawData = fs.readFileSync('./www/json/livsmedelsdata.json');
          let livsmdata = JSON.parse(rawData);

          loop1: for (let item of livsmdata) {
            if (item.Namn == ingredientID) {
              loop2: for (let n of item.Naringsvarden.Naringsvarde) {
                let val = (Number(n.Varde.replace(',', '.').replace(/\s+/g, '')) / 100) * amount;
                if (n.Enhet == 'g') {
                  val = (Number(n.Varde.replace(',', '.').replace(/\s+/g, '')) / 100) * amount;
                }
                if (n.Enhet == 'mg') {
                  val = (Number(n.Varde.replace(',', '.').replace(/\s+/g, '')) / 1000) * amount;
                }
                if (n.Enhet == 'µg') {
                  val = (Number(n.Varde.replace(',', '.').replace(/\s+/g, '')) / 1000000) * amount;
                }
                //don't add nutrition if it's 0
                if (val != 0 && val != undefined) {
                  if (n.Namn == "Energi (kcal)") {
                    nutrition.energiKcal = val;
                    continue loop2;
                  } else if (n.Namn == "Kolhydrater") {
                    nutrition.kolhydrater = val;
                    continue loop2;
                  } else if (n.Namn == "Protein") {
                    nutrition.protein = val;
                    continue loop2;
                  } else if (n.Namn == "Fett") {
                    nutrition.fett = val;
                    continue loop2;
                  } else if (n.Namn == "Järn") {
                    nutrition.jarn = val;
                    continue loop2;
                  } else if (n.Namn == "Vitamin A") {
                    nutrition.vitaminA = val;
                    continue loop2;
                  } else if (n.Namn == "Vitamin B6") {
                    nutrition.vitaminB6 = val;
                    continue loop2;
                  } else if (n.Namn == "Vitamin B12") {
                    nutrition.vitaminB12 = val;
                    continue loop2;
                  } else if (n.Namn == "Vitamin C") {
                    nutrition.vitaminC = val;
                    continue loop2;
                  } else if (n.Namn == "Vitamin D") {
                    nutrition.vitaminD = val;
                    continue loop2;
                  } else if (n.Namn == "Vitamin E") {
                    nutrition.vitaminE = val;
                    continue loop2;
                  }
                }
              }
              break loop1;
            }
          }
          return nutrition;
        }
        res.send(ingredientList);
      });


    this.app.get(
      '/getrecipe/:recipeid', (req, res) => {
        let data = fs.readFileSync('./www/json/recepies.json');
        data = JSON.parse(data);
        let found = false;
        for (let item of data) {
          if (item._name == req.params.recipeid) {
            found = true;
            res.send(item);
          }
        }
        if (found == false) {
          res.send(false);
        }
      });

    this.app.get(
      '/getcategories', (req, res) => {
        let categories = {};
        /* catList = [{name:'cat1',recepies:['rec1','rec2','rec3']},{name:'cat2',recepies:['rec1','rec2']}] */

        let data = fs.readFileSync('./www/json/recepies.json');
        data = JSON.parse(data);
        for (let recepe of data) {
          for (let category of recepe._categories) {
            //if category not exists, create it
            if (categories[category] == undefined) {
              let key = category,
                obj = {
                  [key]: [recepe._name]
                };
              categories[category] = obj[category]
            }
            //if category already exists, add recepe
            else {
              categories[category].push(recepe._name);
            }
          }
        }
        res.send(categories);
      });

  }
}