$(document).ready(function () {
    let webpageHandler = new WebpageHandler();

    $('#searchBtn').on('click', webpageHandler.search);

    $('#add_recipe_field').on('click', function () {
        webpageHandler.addRecipeField();
        webpageHandler.addOptions();
    });

    $('#input-submit').on('click', submitRecipe);

    webpageHandler.addOptions();
    $('.ingredient').on('focus', webpageHandler.autoComplete());


});



function submitRecipe() {

    $('Form').submit(function () {
        let $inputs = $('.ingredient_member');
        let values = {};
        $inputs.each(function () {
            values.ingredient = ($(this).val());
        });
    });

}

function getIngridientList(){
    let list = [];
    let json = (function () {
        let json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': '/livsmedelsdata.json',
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        for(let item of json){
            list.push(item.Namn);
        }
    })(); 
    return list;
}

/*
function getIngridientList() {
    $.getJSON('/livsmedelsdata.json', start);

    let list = [];

    function start(ingredient) {
        for (let item of ingredient) {
            list.push(item.Namn);
        }
        console.log("returnerar lista", list);
        return list;
    }
}
*/

function wait(x) {
    setTimeout(function () {
        wait();
    }, x);
    console.log("waiting");
}

function getJsonList() {
    let ourData = "";
    let ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', '/livsmedelsdata.json');
    ourRequest.onload = function () {
        ourData = JSON.parse(ourRequest.responseText);
    };
    ourRequest.send();
    return ourData;
}

/* creating list from json
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


}*/