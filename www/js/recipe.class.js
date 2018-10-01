class Recipe {

  get name() {
    return this._name;
  }

  get nutrition() {
    let nutritionSum = new Nutrition();
    let amountSum = 0;
    for (let item of this.ingredients) {
      if(item._gram == undefined){
        item._gram = item._amount;
      }
      amountSum += Number(item._gram);
    }
    console.log(amountSum);
    for (let item of this.ingredients) {
      Object.setPrototypeOf(item, Ingredient.prototype);
      console.log('vitA:', nutritionSum.vitaminA, '+',item._name,'vitA', item.nutrition.vitaminA);
      item.nutrition.vitaminA != 0 || '0' ? nutritionSum.vitaminA += (item.nutrition.vitaminA / amountSum) : false;
      item.nutrition.vitaminB6 != 0 || '0' ? nutritionSum.vitaminB6 += (item.nutrition.vitaminB6 / amountSum) : false;
      item.nutrition.vitaminB12 != 0 || '0' ? nutritionSum.vitaminB12 += (item.nutrition.vitaminB12 / amountSum) : false;
      item.nutrition.vitaminC != 0 || '0' ? nutritionSum.vitaminC += (item.nutrition.vitaminC / amountSum) : false;
      item.nutrition.vitaminD != 0 || '0' ? nutritionSum.vitaminD += (item.nutrition.vitaminD / amountSum) : false;
      item.nutrition.vitaminD != 0 || '0' ? nutritionSum.vitaminE += (item.nutrition.vitaminE / amountSum) : false;
      item.nutrition.energiKcal != 0 || '0' ? nutritionSum.energiKcal += (item.nutrition.energiKcal / amountSum) : false;
      item.nutrition.kolhydrater != 0 || '0' ? nutritionSum.kolhydrater += (item.nutrition.kolhydrater / amountSum) : false;
      item.nutrition.protein != 0 || '0' ? nutritionSum.protein += (item.nutrition.protein / amountSum) : false;
      item.nutrition.fett != 0 || '0' ? nutritionSum.fett += (item.nutrition.fett / amountSum) : false;
      item.nutrition.jarn != 0 || '0' ? nutritionSum.jarn += (item.nutrition.jarn / amountSum) : false;
    }
    return nutritionSum;
  }
  get ingredients() {
    return this._ingredients;
  }
  get description() {
    return this._description;
  }
  get categories() {
    return this._categories;
  }
  get img() {
    return this._img;
  }
  get portions() {
    return this._portions;
  }

  set categories(categories) {
    this.okOrError(
      'categories', categories,
      'Måste finnas minst en kategori!',
      Array.isArray(categories) &&
      categories.length >= 1
    );
    this._categories = categories;
  }

  set name(name) {
    this.okOrError(
      'name', name,
      'Måste finnas ett namn på receptet! Minst två bokstäver!',
      typeof name == 'string' &&
      name.length >= 2
    );
    this._name = name;
  }

  set nutrition(nutrition) {
    this.okOrError(
      'nutrition', nutrition,
      'Can not set this value, it is a calculated value',
      false
    );
    this._nutrition = nutrition;
  }

  set ingredients(ingredients) {
    let bool = function () {
      let arr = RecipeHandler.getIngridientList();
      let boole = true;
      for (let ingredient of ingredients) {
        if (!(arr.includes(ingredient._id))) {
          boole = false;
        }
      }
      return boole;
    };
    this.okOrError(
      'ingredients', ingredients,
      'Det måste finnas ingredienter och "ingr från lista" måste vara en produkt från livsmedelsverkets lista!',
      bool() &&
      Array.isArray(ingredients) &&
      ingredients.length >= 1
    );
    this._ingredients = ingredients;
  }

  set description(description) {
    this.okOrError(
      'description', description,
      'Du måste fylla i instruktioner, minst 20 tecken!',
      typeof description == 'string' &&
      description.length >= 20
    );
    this._description = description;
  }

  set img(img) {
    this.okOrError(
      'img', img,
      'Måste finnas ett namn på receptet! Minst två bokstäver!',
      typeof img == 'string' &&
      img.length >= 1
    );
    this._img = img;
  }

  set portions(portions) {
    this.okOrError(
      'portions', portions,
      'Du måste fylla i hur många antal portioner receptet gäller',
      portions >= 1
    );
    this._portions = portions;
  }

  okOrError(propName, propVal, errorMessage, ok) {
    if (ok) {
      return;
    }
    let className = this.constructor.name;
    alert(errorMessage);
    throw (new Error(`
      Faulty value for ${className}.${propName}
      (${typeof propVal}) ${JSON.stringify(propVal)}
      ${propName} ${errorMessage}
    `));
  }
}