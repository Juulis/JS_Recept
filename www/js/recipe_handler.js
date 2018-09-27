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
                type: "GET",
                async: false,
                url: '/json/searchlist',
                success: function (data) {
                    list = data;
                }
            });
        });
        json();
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

    static setNutritionValues(ingredients) {
        //TODO get back a new list with nutritions set.
        let ingrList = null;
        let jsonIngrs = JSON.stringify(ingredients);
        $.ajax({
            async: false,
            type: "POST",
            url: '/setnutritions',
            contentType: "application/json",
            data: jsonIngrs,
            success: function (response) {
                ingrList = response;
            }
        });
        return ingrList;
    }
    static getRecipe(recepeID) {
        let recipe = new Recipe();
        let foundRecipe = false;
        let getrecipe = (function () {
            let getrecipe = null;
            $.ajax({
                type: "GET",
                async: false,
                url: `/getrecipe/${recepeID}`,
                success: function (response) {
                    if (response != false) {
                        recipe = response;
                        foundRecipe = true;
                    }
                }
            });
        })();
        if (foundRecipe == true) {
            return recipe;
        } else {
            return null
        }
    }

    static deleteRecipe(recepeID) {
        let resp = false;
        $.ajax({
            type: "POST",
            url: '/delete-recipe',
            data: recepeID,
            success: function (response) {
                if (response == 'done') {
                    resp = true;
                }
            }
        });
        return resp;
    }

    static submitRecipe(recipe) {
        let recipeJson = JSON.stringify(recipe);
        $.ajax({
            type: "POST",
            url: '/submit-recipe',
            contentType: "application/json",
            data: recipeJson,
            success: function (response) {
                if (response == 'done') {
                    alert('Ditt recept är tillagt!');
                }
            }
        });
    }

    static getCategories() {
        let catList = {};
        let getCategories = (function () {
            let getCategories = null;
            $.ajax({
                type: "GET",
                async: false,
                url: `/getcategories`,
                success: function (response) {
                    if (response != undefined) {
                        catList = response;
                    } else {
                        return null;
                    }
                }
            });
        })();
        return catList;
    }

    static getCategoryList() {
        let catList = [];
        let getCategorylist = (function () {
            let getCategorylist = null;
            $.ajax({
                type: "GET",
                async: false,
                url: `/getcategorylist`,
                success: function (response) {
                    catList = response;
                }
            });
        })();
        return catList;
    }
}