class WebpageHandler {

    addOptions() {
        let units = ["dl", "cl", "ml", "msk", "krdm", "kg", "g", "st", "liter"];
        let unitString = "";

        units.forEach(function (unit) {
            unitString += '<option value="' + unit + '">' + unit + '</option>';
        });

        let element = $('.unit');
        element.text("");
        element.append(unitString);
    }

    addRecipeField(list) {
        $('.ingredient_group').last().after(`
        <div class="ingredient_group">
        <input type="text" name="ingredient" class="ingredient ingredient_member" placeholder="ingr från lista"/>
        <input type="text" name="ingredient_name" class="ingredient_name ingredient_member" placeholder="ingr visningsnamn"/>
        <input type="text" name="amount" class="amount ingredient_member" placeholder="Mängd"/>
        <select type="text" name="unit" class="unit ingredient_member" placeholder="Enhet"></select>
        <hr>
        </div>
        `);
        this.addOptions();
        $('.ingredient').on('focus', this.autoCompleteIngredient(list));
    }

    search() {
        let webphandler = new WebpageHandler();
        let field = $("#searchfield");
        let input = field.val();
        webphandler.showRecipe(input);
    }

    autoCompleteSearch(list) {
        $('#searchfield').autocomplete({
            source: list
        });
        $('.ui-helper-hidden-accessible').css('display', 'none');
        $('.ui-autocomplete').css('max-width', '250px')
    }

    autoCompleteIngredient(list) {
        $('.ingredient').autocomplete({
            source: list
        });
        $('.ui-helper-hidden-accessible').css('display', 'none');
    }

    submitRecipe() {
        let recipeHandler = new RecipeHandler();
        let recipe = new Recipe();
        let ingredients = [];

        let tags = ($('.tags').val());
        let categories = ($('.categories').val());

        //check array inputs
        if (tags == undefined || tags == "") {
            recipe.tags = undefined;
        }
        if (categories == undefined || categories == "") {
            recipe.categories = undefined;
        }


        recipe.name = $('.recipe_name').val();
        recipe.description = $('.description').val();
        recipe.tags = $('.tags').val().split(',').map(item => item.trim());
        recipe.categories = $('.categories').val().split(',').map(item => item.trim());
        recipe.img = $('.imgsrc').val();

        $('.ingredient_group').each(function () {
            let $this = $(this);
            let ingredient = new Ingredient();
            $this.children('.ingredient_member').each(function () {
                let input = $(this);
                let val = input.val();

                if (val != undefined && val != "") {
                    if (input.attr('name') == "ingredient_name") {
                        ingredient.name = val;
                    } else if (input.attr('name') == "ingredient") {
                        ingredient.id = val;
                    } else if (input.attr('name') == "amount") {
                        ingredient.amount = val;
                    } else if (input.attr('name') == "unit") {
                        ingredient.unit = val;
                    }
                }
            });
            if (ingredient != undefined) {
                if (ingredient.name != undefined && ingredient.amount != undefined && ingredient.id != undefined) {
                    ingredients.push(ingredient);
                } else if (ingredient.name != undefined || ingredient.amount != undefined || ingredient.id != undefined) {
                    alert('Du måste fylla i alla 3 fält för varje ingredient!');
                    throw (new Error(`Du måste fylla i alla 3 fält för varje ingredient!`));
                }

            }
        });

        let ingrWithNutrition = recipeHandler.setNutritionValues(ingredients);
        recipe.ingredients = ingrWithNutrition;

        let recipeJson = JSON.stringify(recipe);
        $.ajax({
            type: "POST",
            url: 'http://localhost:3000/submit-recipe',
            contentType: "application/json",
            data: recipeJson,
            success: function (response) {
                if (response == 'done') {
                    alert('Ditt recept är tillagt!');
                }
            }
        });
    }

    showRecipe(recipeName) {
        let recipe = new Recipe();
        //get recipe object
        let foundRecipe = false;
        let getrecipe = (function () {
            let getrecipe = null;
            $.ajax({
                type: "GET",
                async: false,
                url: `http://localhost:3000/getrecipe/${recipeName}`,
                success: function (response) {
                    if (response != false) {
                        recipe = response;
                        foundRecipe = true;
                    }
                }
            });
        })();

        let ingrContainer = $('.ingredients-container');
        let instrContainer = $('.instructions-container');
        let imgContainer = $('.image-container');
        let headerContainer = $('#header');

        ingrContainer.text('');
        instrContainer.text('');
        imgContainer.text('');
        headerContainer.text('');

        if (foundRecipe == true) {
            Object.setPrototypeOf(recipe, Recipe.prototype)
            let ol = $('<ol></ol>');
            let ingredients = recipe.ingredients;
            for (const ingredient of ingredients) {
                let li = $(`<li>${ingredient._amount} ${ingredient._unit} ${ingredient._name}</li>`)
                ol.append(li);
            }

            let img = $(`<img src="${recipe.img}">`);

            ingrContainer.append(ol);
            instrContainer.append(recipe.description);
            headerContainer.append(recipe.name);
            if (recipe.img != undefined) {
                imgContainer.append(img);
            }
        } else {
            ingrContainer.text('');
            instrContainer.text('');
            instrContainer.append('Hittade inget recept med det namnet.')
        }
    }

    showCategories() {
        let catList = [];
        let getCategories = (function () {
            let getCategories = null;
            $.ajax({
                type: "GET",
                async: false,
                url: `http://localhost:3000/getcategories`,
                success: function (response) {
                    if (response != undefined) {
                        catList = response;
                    } else {
                        return null;
                    }
                }
            });
        })();

        let div = $('.panel-group');

        /* catList = [{name:'cat1',recepies:['rec1','rec2','rec3']},{name:'cat2',recepies:['rec1','rec2']}] */

        for (cat in catList) {
            let ul = $('<ul class="list-group"><ul/>');
            for (rec of catList.recepies) {
                let li = $(`<li class="list-group-item">${rec}</li>`);
                ul.append(li);
            }
            let catHeadDiv = $(`
            <div class="panel-heading" role="tab" id="collapseListGroupHeading${cat}">
              <h6 class="panel-title">
                <a class="collapsed" data-toggle="collapse" href="#collapseListGroup${cat}" aria-expanded="false" aria-controls="collapseListGroup1">
                  ${catList[cat].name}
                </a>
              </h6>
            </div>`
            );
            let recListDiv = $(`
            <div id="collapseListGroup${cat}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="collapseListGroupHeading${cat}">
              <ul class="list-group">
                <li class="list-group-item">Kladdkaka</li>
                <li class="list-group-item">Sockerkaka</li>
              </ul>
            </div>
            `);
            let categoryDiv = $(`<div class="panel panel-default"></div>`)
        }
        categoryDiv.append(catHeadDiv);
        categoryDiv.append(recListDiv);
        div.append(categoryDiv);
    }

}