class RecipeHandler {
    getIngridientList() {
        let list = [];
        let json = (function () {
            let json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': '/json/livsmedelsdata.json',
                'dataType': "json",
                'success': function (data) {
                    json = data;
                }
            });
            for (let item of json) {
                list.push(item.Namn);
            }
        })();
        return list;
    }
}