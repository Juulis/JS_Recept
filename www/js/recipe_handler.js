class RecipeHandler {
   static getIngridientList() {

        let list = [];
        let getlist = (function () {
            let getlist = null;
            $.ajax({
                type: "GET",
                async: false,
                url: '/json/livsmlist',
                success: function (response) {
                    list = response;
                }
            });
        })();

        return list;

    }

   static getRecipeList() {
        //TODO move this to BackEnd and return a list of names to FE
        let list = [];
        let json = (function () {
            let json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': '/json/recepies.json',
                'dataType': "json",
                'success': function (data) {
                    json = data;
                }
            });
            for (let item of json) {
                list.push(item._name);
            }
        })();
        return list;
    }

   static getJson(jsonFile) {
        let json = (function () {
            let json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': `/json/${jsonFile}.json`,
                'dataType': "json",
                'success': function (data) {
                    json = data;
                }
            });
        })();
        return json;
    }

   static setNutritionValues(ingrList) {
        //TODO get back a new list with nutritions set.
        let updIngrList = null;
        let ingrListJson = JSON.stringify(ingrList);
        $.ajax({
            async: false,
            type: "POST",
            url: '/setnutritions',
            contentType: "application/json",
            data: ingrListJson,
            success: function (response) {
                updIngrList = response;
            }
        });
        return updIngrList;
    }
}