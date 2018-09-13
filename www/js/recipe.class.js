class Recipe {

  get name() {
    return this._name;
  }
  get nutrition() {
    return this._nutrition;
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
  get tags() {
    return this._tags;
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

  set tags(tags) {
    this.okOrError(
      'tags', tags,
      'Måste finnas minst en tag!',
      Array.isArray(tags) &&
      tags.length >= 1
    );
    this._tags = tags;
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
      'must be an object-array with nutrition info',
      Array.isArray(nutrition) &&
      nutrition.length >= 1
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