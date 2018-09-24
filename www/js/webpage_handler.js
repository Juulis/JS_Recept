class WebpageHandler {

    static addOptions() {
        let units = ["dl", "cl", "ml", "msk", "krdm", "kg", "g", "st", "liter"];
        let unitString = "";

        units.forEach(function (unit) {
            unitString += '<option value="' + unit + '">' + unit + '</option>';
        });

        let element = $('.unit');
        element.text("");
        element.append(unitString);
    }

    static addRecipeField() {
        $('.ingredient_group').last().after(`
        <div class="ingredient_group">
        <input type="text" name="ingredient" class="ingredient ingredient_member" placeholder="ingr från lista"/>
        <input type="text" name="ingredient_name" class="ingredient_name ingredient_member" placeholder="ingr visningsnamn"/>
        <br>
        <input type="text" name="amount" class="amount short ingredient_member" placeholder="Mängd"/>
        <select type="text" name="unit" class="unit short ingredient_member" placeholder="Enhet"></select>
        <input type="number" name="gram" class="gram short ingredient_member" placeholder="I gram"/>
        <hr>
        </div>
        `);
        WebpageHandler.addOptions();
        $('.ingredient').on('focus', WebpageHandler.autoCompleteIngredient);
    }

    static search() {
        //TODO wtf is wrong with this method? Can't call a sibling method with 'this'...
        let field = $("#searchfield");
        let input = field.val();
        field.val('');
        WebpageHandler.showRecipe(input);
    }

    static autoCompleteSearch() {
        $('#searchfield').autocomplete({
            source: RecipeHandler.getRecipeList()
        });
        $('.ui-helper-hidden-accessible').css('display', 'none');
        $('.ui-autocomplete').css('max-width', '250px')
    }

    static autoCompleteIngredient() {
        let ingrList = RecipeHandler.getIngridientList();
        $('.ingredient').autocomplete({
            source: ingrList
        });
        $('.ui-helper-hidden-accessible').css('display', 'none');
    }
    static autoCompleteCat() {
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

        $('.categories').autocomplete({
            source: catList
        });
        $('.ui-helper-hidden-accessible').css('display', 'none');



    }

    static capFirstLetter(string) {
        let formatedString = string.trim();
        formatedString = formatedString.charAt(0).toUpperCase() + formatedString.toLowerCase().substr(1);
        return formatedString;
    }

    static editRecipe(recepe) {
        $('#editprompt').
        ajaxForm({
            type: "POST",
            url: '/authenticate/edit',
            dataType: "json",
            success: function (auth) {
                if (auth) {
                    console.log('auth:', auth);
                    Object.setPrototypeOf(recepe, Recipe.prototype);
                    $('.recipe_name').val(recepe.name);
                    $('.description').val(recepe.description);
                    $('.categories').val(recepe.categories.join());
                    $('.imgsrc').val(recepe.img);
                    $('.portions').val(recepe.portions);

                    for (let i = 3; i < recepe.ingredients.length; i++) {
                        WebpageHandler.addRecipeField();
                    }

                    let ingrElArray = $('.ingredient_group').toArray();

                    for (let i in recepe.ingredients) {
                        $(`${ingrElArray[i]} input[name='ingredient']`).val(`${recepe.ingredients[i].id}`);
                    }
                } else console.log('nah, not auth');
            }
        });



    }

    static submitRecipe() {
        let recipe = new Recipe();
        let ingredients = [];

        let categoryinput = $('.categories').val();

        //Format and set recipe from inputs
        recipe.name = WebpageHandler.capFirstLetter($('.recipe_name').val());
        recipe.description = $('.description').val();
        if (categoryinput != undefined && categoryinput != '') {
            recipe.categories = categoryinput.split(',').map(string => WebpageHandler.capFirstLetter(string));
        } else {
            recipe.categories = undefined;
        }
        recipe.portions = $('.portions').val();
        if ($('.imgsrc').val() != '') {
            recipe.img = $('.imgsrc').val();
        }



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
                    } else if (input.attr('name') == "gram") {
                        //if unit is gram, no need to fill gram input
                        if (ingredient.unit == 'g') {
                            ingredient.gram = ingredient.unit;
                        } else {
                            ingredient.gram = val;
                        }
                    }
                }
            });
            //if ingredient exist, check if all inputs is filled out for each ingredient.
            if (ingredient != undefined) {
                //if ingredient exists and all fields are filled, go ahead and push ingredient to ingr list
                if (ingredient.name != undefined && ingredient.amount != undefined && ingredient.id != undefined && (ingredient.gram != undefined || ingredient.unit == 'g')) {
                    ingredients.push(ingredient);
                    //if ingredient exist and not all fields is filled out, alert! all but unit
                } else if (ingredient.name != undefined || ingredient.amount != undefined || ingredient.id != undefined || ingredient.gram != undefined) {
                    alert('Du måste fylla i alla 3 fält för varje ingredient!');
                    throw (new Error(`Du måste fylla i alla 3 fält för varje ingredient!`));
                }

            }
        });

        recipe.ingredients = ingredients;
        let ingrWithNutrition = RecipeHandler.setNutritionValues(recipe);
        recipe.ingredients = ingrWithNutrition;

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

    static showRecipe(recipeName) {

        //get recipe object
        let recipe = RecipeHandler.getRecipe(recipeName);
        let foundRecipe = recipe._name != undefined ? true : false;
        //Set HTML elements
        let ingrContainer = $('.ingredients-container');
        let instrContainer = $('.instructions-container');
        let imgContainer = $('.image-container');
        let headerContainer = $('#header');
        let nutrContainer = $('.nutritions-container');
        //empty HTML
        ingrContainer.text('');
        instrContainer.text('');
        imgContainer.text('');
        headerContainer.text('');
        headerContainer.attr('title','');
        nutrContainer.text('');
        //Apply HTML
        if (foundRecipe == true) {
            Object.setPrototypeOf(recipe, Recipe.prototype);
            let ol = $('<ol></ol>');
            let ingredients = recipe.ingredients;
            ol.append($(`<span id='portminus'><</span><span id='port'>${recipe.portions}</span><span> Port</span><span id='portplus'>></span>`));
            ol.append($('<hr><br>'));
            for (const ingredient of ingredients) {
                let li = $(`<li><span class="display-amount">${ingredient._amount}</span> ${ingredient._unit} ${ingredient._name}</li>`);
                ol.append(li);
            }

            ingrContainer.append(ol);
            ingrContainer.append(nutrContainer);
            instrContainer.append(recipe.description);
            headerContainer.append(recipe.name);
            if (recipe.img != undefined) {
                let img = $(`<img src="${recipe.img}">`);
                imgContainer.append(img);
            }

            //set edit-recipe-id for editingform loginprompt
            $('#edit-recipe-id').val(recipe.name);

            //set tooltip for nutritions on title
            let title = JSON.stringify(recipe.nutrition, null, 1);
            title = title.replace("{",'');
            title = title.replace("}",'');
            console.log(title);

            $('#header').attr('title', title);
            $('[data-toggle="tooltip"]').tooltip();
            //set eventlisteners on portion buttons
            $('#portminus').on('click', function () {
                let port = $('#port');
                let current = Number(port.text());
                if (current > 1) {
                    port.text(current - 1);
                    changeAmount(current - 1, current);
                }
            });
            $('#portplus').on('click', function () {
                let port = $('#port');
                let current = Number(port.text());
                port.text(current + 1);
                changeAmount(current + 1, current);
            });

            function changeAmount(newInt, currentInt) {
                $('.display-amount').each(function () {
                    let el = $(this);
                    let currentAmount = Number(el.text());
                    let newAmount = (currentAmount / currentInt) * newInt;
                    el.text(newAmount);
                });
            }

        } else {
            instrContainer.append('Hittade inget recept med det namnet.');
        }
    }

    static showCategories() {
        let catObj = {};
        let getCategories = (function () {
            let getCategories = null;
            $.ajax({
                type: "GET",
                async: false,
                url: `/getcategories`,
                success: function (response) {
                    if (response != undefined) {
                        catObj = response;
                    } else {
                        return null;
                    }
                }
            });
        })();

        let div = $('.panel-group');

        /* catList = [{name:'cat1',recepies:['rec1','rec2','rec3']},{name:'cat2',recepies:['rec1','rec2']}] */
        let catHeadDiv;
        let recListDiv;
        let categoryDiv;

        //For each category
        for (let cat in catObj) {
            let ul = $('<ul class="list-group"></ul>');
            for (let rec of catObj[cat]) {
                let li = $(`<li class="list-group-item">${rec}</li>`);
                ul.append(li);
            }
            catHeadDiv = $(`
            <div class="panel-heading" role="tab" id="collapseListGroupHeading${cat}">
            <a class="collapsed" data-toggle="collapse" href="#collapseListGroup${cat}" aria-expanded="false" aria-controls="collapseListGroup1">
            <h6 class="panel-title">
                  ${cat}
                  </h6>
                </a>
            </div>`);

            recListDiv = $(`<div id="collapseListGroup${cat}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="collapseListGroupHeading${cat}"></div>`);
            recListDiv.append(ul);
            categoryDiv = $(`<div class="panel panel-default"></div>`)
            categoryDiv.append(catHeadDiv);
            categoryDiv.append(recListDiv);
            div.append(categoryDiv);
        }
    }

}