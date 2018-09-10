$(document).ready(function () {

    $('#searchBtn').on('click', search);

});


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