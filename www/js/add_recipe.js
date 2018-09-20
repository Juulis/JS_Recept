let webpageHandler = new WebpageHandler();

let ingrList = RecipeHandler.getIngridientList();

webpageHandler.addOptions();

$('#add_recipe_field').on('click', webpageHandler.addRecipeField(ingrList));

$('#input-submit').on('click', webpageHandler.submitRecipe);

$('.ingredient').on('focus', webpageHandler.autoCompleteIngredient(ingrList));