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

  set name(name) {
    this.okOrError(
      'name', name,
      'must be a string with a length >= 2',
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
      'must be an object-array with ingredients',
      Array.isArray(ingredients) &&
      ingredients.length >= 1
    );
    this._ingredients = ingredients;
  }

  set description(description) {
    this.okOrError(
      'description', description,
      'must be a string with a length >= 2',
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
    throw (new Error(`
      Faulty value for ${className}.${propName}
      (${typeof propVal}) ${JSON.stringify(propVal)}
      ${propName} ${errorMessage}
    `));
  }
}