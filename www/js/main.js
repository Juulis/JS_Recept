$(document).ready(function () {
    let webpageHandler = new WebpageHandler();
    let recipeHandler = new RecipeHandler();

    webpageHandler.addOptions();

    let recipeList = recipeHandler.getRecipeList();
    let ingrList = recipeHandler.getIngridientList();

    $('#searchBtn').on('click', webpageHandler.search);
    $('#searchfield').on('focus', webpageHandler.autoCompleteSearch(recipeList));

    $('#add_recipe_field').on('click', webpageHandler.addRecipeField(ingrList));

    $('#input-submit').on('click', webpageHandler.submitRecipe);

    $('.ingredient').on('focus', webpageHandler.autoCompleteIngredient(ingrList));
});