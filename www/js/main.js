WebpageHandler.showCategories();

$('#searchBtn').on('click', WebpageHandler.search);
$('#searchfield').on('focus', WebpageHandler.autoCompleteSearch);
$('#about_us').on('click', WebpageHandler.showAbout);

$('.list-group-item').on('click', function (e) {
    let text = $(e.target).text();
    WebpageHandler.showRecipe(text);
});

$('#edit-recipe-btn').on('click', function () {
    let recepe = RecipeHandler.getRecipe($('#edit-recipe-id').val());
    WebpageHandler.editRecipe(recepe);
});

let strArr = location.search.split('=');
if (strArr[0] == 'edit_recipe.html?id' && strArr > 1) {
    WebpageHandler.editRecipe(RecipeHandler.getRecipe(strArr[1]));
}