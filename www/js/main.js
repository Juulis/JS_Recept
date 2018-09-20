WebpageHandler.showCategories();

$('#searchBtn').on('click', WebpageHandler.search);
$('#searchfield').on('focus', WebpageHandler.autoCompleteSearch);


$('.list-group-item').on('click',function(e){
    let text = $(e.target).text();
    WebpageHandler.showRecipe(text);
});
