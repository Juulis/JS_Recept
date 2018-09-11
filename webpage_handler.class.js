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

    addRecipeField() {
        $('.ingredient_group').last().after(`<div class="ingredient_group">
        <input type="text" name="ingredient" class="ingredient ingredient_member"
            placeholder="Ingredient">
        <input type="text" name="amount" class="amount ingredient_member" placeholder="Mängd">
        <select type="text" name="unit" class="unit ingredient_member" placeholder="Enhet">
    </div>`);
    }

    search() {
        let field = $("#searchfield");
        let input = field.val();
        let p = $('<p></p>');
        p.append(`Searching for ${input}`);
        $('.middle').append(p);
        $('#searchfield').val("");
        console.log("searching");
        getIngridientList();
    }

    autoComplete() {
        let list = getIngridientList();
        $('.ingredient').autocomplete({
            source: list
        });
    }
}