$(document).ready(function () {

    $('#searchBtn').on('click', search);
    $('#add_recipe_field').on('click', addRecipeField);
    $('#input-submit').on('click', submitRecipe);
    addOptions();
});

function addOptions() {
    let units = ["dl", "cl", "ml", "msk", "krdm", "kg", "g", "st", "liter"];
    let unitString = "";

    units.forEach(function (unit) {
        unitString += '<option value="' + unit + '">' + unit + '</option>';
    });

    let element = $('.unit');
    element.text("");
    element.append(unitString);

}

function submitRecipe() {

    $('Form').submit(function () {
        let $inputs = $('.ingredient');
        let values = [];
        $inputs.each(function () {
            values.push($(this).val());
        });
        console.log(values);
    });

}

function addRecipeField() {

    $('.ingredient_group').last().after(`<div class="ingredient_group">
    <input type="text" name="ingredient" class="ingredient ingredient_member"
        placeholder="Ingredient">
    <input type="text" name="amount" class="amount ingredient_member" placeholder="Mängd">
    <select type="text" name="unit" class="unit ingredient_member" placeholder="Enhet">
</div>`);

    addOptions();

}



function search() {
    let field = $("#searchfield");
    let input = field.val();
    let p = $('<p></p>');
    p.append(`Searching for ${input}`);
    $('.middle').append(p);
    $('#searchfield').val("");
    getIngridientList();
}

function getIngridientList() {
    $.getJSON('/livsmedelsdata.json', start);

    function start(ingredient) {
        let ul = $('<ul></ul>');
        ul.addClass('recipe');
        for (let item of ingredient) {
            let li = $('<li></li>');
            li.text(item.Namn);
            li.data('Ingredient', item);
            ul.append(li);
        }
        $('.middle').append(ul);
    }

}

function getIngredientListAjax() {
    let ingrList = [];

    $.ajax({
        url: '/livsmedelsdata.json',
        dataType: 'json',
        type: 'get',
        cache: true,
        success: function (data) {
            $(data).each(function (index, value) {
                ingrList.push(value.Namn);
            });
        }
    });
    return ingrList;
}

function getSpecific() {
    return list.find(function (element) {
        return element == "Talg nöt";
    });
}