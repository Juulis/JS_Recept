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

    submitRecipe() {

        let ingredients = [];
        let ingredient = {};

        $('.middle Form .ingredient_group').each(function () {
            $('Form input, Form select').each(function () {
                let input = $(this);

                if (input.val() != "" && input.attr('name') == "ingredient") {
                    ingredient.name = input.val();
                } else if (input.val() != "" && input.attr('name') == "amount") {
                    ingredient.amount = input.val();
                } else if (input.val() != "" && input.attr('name') == "unit") {
                    ingredient.unit = input.val();
                }
            });
            ingredients.push(ingredient);
            console.log(ingredients);
        });
    }
}