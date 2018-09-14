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

    getJson(jsonFile) {
        let json = (function () {
            let json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': `/json/${jsonFile}.json`,
                'dataType': "json",
                'success': function (data) {
                    json = data;
                }
            });
        })();
        return json;
    }

    setNutrition(ingredient) {
        let nutrition = new Nutrition();
        let json = (function () {
            let json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': `/json/livsmedelsdata.json`,
                'dataType': "json",
                'success': function (data) {
                    loop1:
                    for (let item of data) {
                        if (item.Namn == ingredient) {
                            loop2:
                            for (let n of item.Naringsvarden.Naringsvarde) {
                                let val = Number(n.Varde.replace(',','.'));
                                if (n.Namn == "Energi (kJ)") {
                                    nutrition.energiKj = val;
                                    continue loop2;
                                }
                                if (n.Namn == "Energi (kcal)") {
                                    nutrition.energiKcal = val;
                                    continue loop2;
                                }
                                if (n.Namn == "Kolhydrater") {
                                    nutrition.kolhydrater = val;
                                    continue loop2;
                                }
                                if (n.Namn == "Protein") {
                                    nutrition.protein = val;
                                    continue loop2;
                                }
                                if (n.Namn == "Fett") {
                                    nutrition.fett = val;
                                    continue loop2;
                                }
                                if (n.Namn == "Järn") {
                                    nutrition.jarn = val;
                                    continue loop2;
                                }
                                if (n.Namn == "Vitamin A") {
                                    nutrition.vitaminA = val;
                                    continue loop2;
                                }
                                if (n.Namn == "Vitamin B6") {
                                    nutrition.vitaminB6 = val;
                                    continue loop2;
                                }
                                if (n.Namn == "Vitamin B12") {
                                    nutrition.vitaminB12 = val;
                                    continue loop2;
                                }
                                if (n.Namn == "Vitamin C") {
                                    nutrition.vitaminC = val;
                                    continue loop2;
                                }
                                if (n.Namn == "Vitamin D") {
                                    nutrition.vitaminD = val;
                                    continue loop2;
                                }
                                if (n.Namn == "Vitamin E") {
                                    nutrition.vitaminE = val;
                                    continue loop2;
                                }
                            }
                            break loop1;
                        }
                    }
                }
            });
        })();
        return nutrition;
    }

    setRecepieJson(recipe) {
        let json = (function () {
            $.ajax({
                'async': false,
                'global': false,
                'url': '/json/recepies.json',
                'dataType': "json",
                'success': function (data) {
                    data.push(recipe);
                    //Write to file when changing this code to backend
                }
            });
        })();
    }
}