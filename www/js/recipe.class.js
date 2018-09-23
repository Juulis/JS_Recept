class Recipe {

  get name() {
    return this._name;
  }
  
  get nutrition() {
    let nutritionSum = new Nutrition();
    for (let item of this.ingredients) {
      Object.setPrototypeOf(item, Ingredient.prototype);
      nutritionSum.vitaminA += item.nutrition.vitaminA;
      nutritionSum.vitaminB6 += item.nutrition.vitaminB6;
      nutritionSum.vitaminB12 += item.nutrition.vitaminB12;
      nutritionSum.vitaminC += item.nutrition.vitaminC;
      nutritionSum.vitaminD += item.nutrition.vitaminD;
      nutritionSum.vitaminE += item.nutrition.vitaminE;
      nutritionSum.energiKcal += item.nutrition.energiKcal;
      nutritionSum.kolhydrater += item.nutrition.kolhydrater;
      nutritionSum.protein += item.nutrition.protein;
      nutritionSum.fett += item.nutrition.fett;
      nutritionSum.jarn += item.nutrition.jarn;
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
  get img(){
    return this._img;
  }
  get portions(){
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
    let arr = RecipeHandler.getRecipeList();
    this.okOrError(
      'name', name,
      'Måste finnas ett namn på receptet! Minst två bokstäver!',
      typeof name == 'string' &&
      name.length >= 2 &&
      (!arr.includes(name))
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
    this.okOrError(
      'ingredients', ingredients,
      'Det måste finnas ingredienter!',
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