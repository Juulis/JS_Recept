module.exports = class Routes {

  constructor(app, fs) {
    this.app = app;
    this.fs = fs;
    this.setRoutes();
    this.list = this.getList();
  }

  getList() {
    let list = [];
    let data = this.fs.readFileSync('./www/json/livsmedelsdata.json');
    data = JSON.parse(data);
    for (let item of data) {
      list.push(item.Namn);
    }
    return list;
  }

  setRoutes() {
    const path = require('path');
    const fs = this.fs;

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

    this.app.get(
      '/add_recipe?id/:recipeid', (req, res) => {
        res.send('index');
        return res.sendFile(path.join(__dirname + '/www/add_recipe.html'));
      });

    this.app.get(
      '/json/searchlist', (req, res) => {
        let list = [];
        let recepies = fs.readFileSync('./www/json/recepies.json');
        recepies = JSON.parse(recepies);
        for (let item of recepies) {
          list.push(item._name);
        }
        return res.send(list);
      });

    this.app.get(
      '/json/livsmlist', (req, res) => {
        res.send(this.list);
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
      '/delete-recipe', (req, res) => {
        let rawData = fs.readFileSync('./www/json/recepies.json');
        let recepies = JSON.parse(rawData);
        let name = Object.getOwnPropertyNames(req.body)[0];
        let newRecepies = recepies.filter(el => el._name !== name);
        fs.writeFileSync('./www/json/recepies.json', JSON.stringify(newRecepies));
        res.send("done");
      });

    this.app.post(
      '/setnutritions', (req, res) => {
        let ingredientList = req.body;
          let rawData = fs.readFileSync('./www/json/livsmedelsdata.json');
          let livsmdata = JSON.parse(rawData);
        for (let ingredient of ingredientList) {
          let nutrition = {};
          loop1: for (let item of livsmdata) {
            if (item.Namn == ingredient._id) {
              loop2: for (let n of item.Naringsvarden.Naringsvarde) {
                let val = Number(n.Varde.replace(',', '.').replace(/\s+/g, ''));
                //don't add nutrition if it's 0
                if (val != 0 && val != undefined && val != '0') {
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
          ingredient._nutrition = nutrition;
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
            return res.send(item);
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

    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, './www/index.html'));
    });
  }
}