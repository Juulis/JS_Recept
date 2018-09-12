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
        $('.ingredient_group').last().after(`<div class="ingredient_group">
        <input type="text" name="ingredient" class="ingredient ingredient_member"
            placeholder="Ingredient">
        <input type="text" name="amount" class="amount ingredient_member" placeholder="Mängd">
        <select type="text" name="unit" class="unit ingredient_member" placeholder="Enhet">
    </div>`);
        this.addOptions();
        $('.ingredient').on('focus', this.autoComplete(list));
    }

    search() {
        let field = $("#searchfield");
        let input = field.val();
        let p = $('<p></p>');
        p.append(`Searching for ${input}`);
        $('.middle').append(p);
        $('#searchfield').val("");
        console.log("searching");
    }

    autoComplete(list) {
        $('.ingredient').autocomplete({
            source: list
        });
        $('.ui-helper-hidden-accessible').css('display', 'none');
    }

    recipeToJson() {

        console.log("working");
        return true;
    }

    submitRecipe() {
        let recipe = new Recipe();
        let ingredients = [];

        recipe.name = $('.recipe_name').val();
        recipe.description = $('.description').val();

        $('.ingredient_group').each(function () {
            let $this = $(this);
            let ingredient = new Ingredient();
            $this.children('.ingredient_member').each(function () {
                let input = $(this);
                let val = input.val();

                if (val != undefined && val != "") {
                    if (input.attr('name') == "ingredient") {
                        ingredient.name = val;
                    } else if (input.attr('name') == "amount") {
                        ingredient.amount = val;
                    } else if (input.attr('name') == "unit") {
                        ingredient.unit = val;
                    }
                }
            });
            if (ingredient != undefined && ingredient.name != undefined) {
                ingredients.push(ingredient);
            }
        });
        recipe.ingredients = ingredients;
        console.log(recipe);

        var data = fs.readFileSync('/json/recipies.json');
        var json = JSON.parse(data);
        json.push(...recipe);
        
        fs.writeFile("/json/recipies.json", JSON.stringify(json));
    }
}