$(document).ready(function () {
    let webpageHandler = new WebpageHandler();
    let recipeHandler = new RecipeHandler();

    webpageHandler.addOptions();

    let list = recipeHandler.getIngridientList();

    $('#searchBtn').on('click', webpageHandler.search);

    $('#add_recipe_field').on('click', function(){
     webpageHandler.addRecipeField(list);
    });

    $('#input-submit').on('click', webpageHandler.submitRecipe);

    $('.ingredient').on('focus', webpageHandler.autoComplete(list));
    
});