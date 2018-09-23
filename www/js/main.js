WebpageHandler.showCategories();

$('#searchBtn').on('click', WebpageHandler.search);
$('#searchfield').on('focus', WebpageHandler.autoCompleteSearch);


$('.list-group-item').on('click', function (e) {
    let text = $(e.target).text();
    WebpageHandler.showRecipe(text);
});

$('#edit-recipe-btn').on('click', function(){
    let recepe = RecipeHandler.getRecipe($('#edit-recipe-id').val());
    WebpageHandler.editRecipe(recepe);
});


