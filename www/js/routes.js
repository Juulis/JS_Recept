module.exports = class Routes {

  constructor(app) {
    this.app = app;
    this.setRoutes();
  }

  setRoutes() {
    const fs = require('fs');
    
    /*  this.app.get(
       '/autocomplete-ingredient-name/:startOfName',
       (req, res) => {
         let start = req.params.startOfName.toLowerCase();
         if (start.length < 2) {
           res.json({
             error: 'Please provide at least two characters...'
           });
           return;
         }
         let result = this.ingredients.filter(
           ingredient => ingredient.Namn.toLowerCase().indexOf(start) == 0
         ).map(
           ingredient => ingredient.Namn
         );
         res.json(result);
       }
     );

     this.app.get(
       '/recipe-by-name/:name',
       async (req, res) => {
         let recipe = await Recipe.readFromFile(req.params.name)
         res.json(recipe);
       }
     ); */
    this.app.get(
      '/json/searchlist', (req, res) => {
        let list = [];
        let recepies = fs.readFileSync('./www/json/recepies.json');
        recepies = JSON.parse(recepies);
        for (let item of recepies){
          list.push(item._name);
        }
        res()
      });

    this.app.post(
      '/submit-recipe', (req, res) => {
        let rawData = fs.readFileSync('./www/json/recepies.json');
        let recepies = JSON.parse(rawData);
        recepies.push(req.body);
        fs.writeFileSync('./www/json/recepies.json', JSON.stringify(recepies));
        res.redirect('/');
      });
  }

}