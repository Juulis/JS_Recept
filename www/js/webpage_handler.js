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
        <input type="amount" name="amount" class="amount short ingredient_member" placeholder="Mängd"/>
        <select type="text" name="unit" class="unit short ingredient_member" placeholder="Enhet"></select>
        <input type="number" name="gram" class="gram short ingredient_member" placeholder="I gram"/>
        <hr>
        </div>
        `);
        WebpageHandler.addOptions();
        $('.ingredient').on('focus', WebpageHandler.autoCompleteIngredient);
    }

    static search() {
        let field = $("#searchfield");
        let input = field.val();
        field.val('');
        WebpageHandler.showRecipe(input);
    }

    static autoCompleteSearch() {
        let list = RecipeHandler.getRecipeList();
        $('#searchfield').autocomplete({
            source: list
        });
        $('.ui-helper-hidden-accessible').css('display', 'none');
        $('.ui-autocomplete').css('max-width', '250px')
    }

    static autoCompleteName() {
        let recList = RecipeHandler.getRecipeList();
        $('.recipe_name').autocomplete({
            source: recList
        });
        $('.ui-helper-hidden-accessible').css('display', 'none');
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
        catList = RecipeHandler.getCategoryList();
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

    static editRecipe() {

        let recepe = RecipeHandler.getRecipe($('.recipe_name').val());

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
            let el = ingrElArray[i].children;
            let ingr = recepe.ingredients[i];
            el.ingredient.value = ingr._id;
            el.ingredient_name.value = ingr._name;
            el.amount.value = ingr._amount;
            el.unit.value = ingr._unit;
            el.gram.value = ingr._gram;
        }

    }

    static submitRecipe() {

        let recList = RecipeHandler.getRecipeList();

        let recipe = new Recipe();
        let ingredients = [];

        let okToSave = true;
        let editRecipe = false;

        //check if recipe already exist
        recipe.name = WebpageHandler.capFirstLetter($('.recipe_name').val());
        if (recList.includes(recipe.name)) {
            if (confirm(`Du skriver över befintligt recept: ${recipe.name}`)) {
                okToSave = true;
                editRecipe = true;
            } else {
                okToSave = false;
            }
        }

        if (editRecipe) {
            RecipeHandler.deleteRecipe(recipe.name);
        }

        if (okToSave) {
            //Format and set recipe from inputs
            let categoryinput = $('.categories').val();
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
                            ingredient.name = WebpageHandler.capFirstLetter(val);
                        } else if (input.attr('name') == "ingredient") {
                            ingredient.id = val;
                        } else if (input.attr('name') == "amount") {
                            ingredient.amount = val;
                        } else if (input.attr('name') == "unit") {
                            ingredient.unit = val;
                        } else if (input.attr('name') == "gram") {
                            //if unit is gram, fill 'gram' with amount
                            if (ingredient.unit != 'g') {
                                ingredient.gram = val;
                            } else {
                                ingredient.gram = ingredient.amount;
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

            recipe.ingredients = RecipeHandler.setNutritionValues(ingredients);
            RecipeHandler.submitRecipe(recipe);
            location.assign('/');
        }
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
        let nutrButton = $(`
            <p>
                <a class="btn btn-primary" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                Nutritions
                </a>
            </p>
            <div class="collapse" id="collapseExample">
                <div class="card card-body">
                </div>
            </div>
      `);
        //empty HTML
        ingrContainer.text('');
        instrContainer.text('');
        imgContainer.text('');
        headerContainer.text('');
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
            ingrContainer.append(nutrButton);
            instrContainer.append(recipe.description);
            headerContainer.append(recipe.name);
            if (recipe.img != undefined) {
                let img = $(`<img src="${recipe.img}">`);
                imgContainer.append(img);
            }

            //set edit-recipe-id for editingform loginprompt
            $('#edit-recipe-id').val(recipe.name);

            //setup nutrition display
            let decimals = 3;
            let nutrdiv = $('#collapseExample div');
            let nutrObj = recipe.nutrition;
            let ul = $('<ul></ul>');
            for (let item in nutrObj) {
                let n = nutrObj[item];
                if (n != 0 && n != '0' && !isNaN(n)) {
                    if (n.toString().length > decimals) {
                        let arr = n.toString().split('.');
                        if (arr[1].length > 2) {
                            arr[1] = arr[1].substring(0, decimals);
                        }
                        n = Number(arr[0] + '.' + arr[1]);
                    }

                    let u = '';
                    if (item.includes('kolhydrater')) {
                        u = 'g';
                    } else if (item.includes('energi')) {
                        u = 'kcal';
                    } else if (item.includes('protein')) {
                        u = 'g';
                    } else if (item.includes('fett')) {
                        u = 'g';
                    } else if (item.includes('jarn')) {
                        u = 'mg';
                        item = 'järn';
                    } else if (item.includes('vitaminA')) {
                        u = 'µg';
                    } else if (item.includes('vitaminB6')) {
                        u = 'mg';
                    } else if (item.includes('vitaminB12')) {
                        u = 'µg';
                    } else if (item.includes('vitaminC')) {
                        u = 'mg';
                    } else if (item.includes('vitaminD')) {
                        u = 'µg';
                    } else if (item.includes('vitaminE')) {
                        u = 'mg';
                    }
                    let li = $(`<li>${item}: <span class='nutrli'> ${n} ${u}</span></li>`);
                    ul.append(li);
                }
            }
            nutrdiv.append($('<p>per 100g</p>'));
            nutrdiv.append(ul);


            //removed, not need if showing per 100g
            /* function changeNutrition(currentInt, newInt) {
                let nrSpan = $('.nutrli');
                nrSpan.each(function () {
                    let nr = $(this).text();
                    nr = (Number(nr) / Number(currentInt)) * Number(newInt);
                    if (nr.toString().length > 5) {
                        let arr = nr.toString().split('.');
                        if (arr[1].length > 2) {
                            arr[1] = arr[1].substring(0, 2);
                        }
                        nr = Number(arr[0] + '.' + arr[1]);
                    }
                    $(this).text(nr);
                });

            } */




            //set eventlisteners on portion buttons
            $('#portminus').on('click', function () {
                let port = $('#port');
                let current = Number(port.text());
                if (current > 1) {
                    port.text(current - 1);
                    changeAmount(current, current - 1);
                }
            });
            $('#portplus').on('click', function () {
                let port = $('#port');
                let current = Number(port.text());
                port.text(current + 1);
                changeAmount(current, current + 1);
            });

            function changeAmount(currentInt, newInt) {
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
        let catObj = RecipeHandler.getCategories();

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

    static showAbout(){
        let main = $('main');
        main.text('');
        let p = $('<p><BR><BR><BR><HR>Detta är en websida skapad för en uppgift i skolan. Vi ska bygga en webapp med JS som ska skapa och visa recept.<BR> Sidan ska även jobba med JSON filer och hämta/skriva data till dessa.<BR><BR><BR> <b    >Denna sida är skapad av Danny P aka Juulis!<b><HR></p>');
        main.append(p);
    }

}