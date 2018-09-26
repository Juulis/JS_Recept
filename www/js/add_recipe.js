WebpageHandler.addOptions();

$('#add_recipe_field').on('click', WebpageHandler.addRecipeField);

$('#input-submit').on('click', WebpageHandler.submitRecipe);

$('.ingredient').on('focus', WebpageHandler.autoCompleteIngredient);

$('.categories').on('focus', WebpageHandler.autoCompleteCat);

$('#editbtn').on('click', WebpageHandler.editRecipe);

$('.recipe_name').on('focus', WebpageHandler.autoCompleteName);