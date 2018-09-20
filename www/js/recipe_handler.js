class RecipeHandler {
    getIngridientList() {

        let list = [];
        let getlist = (function () {
            let getlist = null;
            $.ajax({
                type: "GET",
                async: false,
                url: 'http://localhost:3000/json/livsmlist',
                success: function (response) {
                    list = response;
                }
            });
        })();

        return list;

    }

    getRecipeList() {

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

    getJson(jsonFile) {
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

    setNutritionValues(ingrList) {
        //TODO get back a new list with nutritions set.
        let updIngrList = null;
        let ingrListJson = JSON.stringify(ingrList);
        $.ajax({
            async: false,
            type: "POST",
            url: 'http://localhost:3000/setnutritions',
            contentType: "application/json",
            data: ingrListJson,
            success: function (response) {
                updIngrList = response;
            }
        });
        return updIngrList;    
    }
}