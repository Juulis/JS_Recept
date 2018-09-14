class Ingredient {

    get name() {
        return this._name;
    }
    get amount() {
        return this._amount;
    }
    get unit() {
        return this._unit;
    }
    get id() {
        return this._id;
    }
    get nutrition(){
        return this._nutrition;
    }

    set id(id) {
        let recHandler = new RecipeHandler();
        let arr = recHandler.getIngridientList();
        this.okOrError(
            'id', id,
            `"ingr från lista" måste vara en produkt från livsmedelsverkets lista!`,
            typeof id == 'string' &&
            id.length >= 2 &&
            arr.includes(id)
        );
        this._id = id;
    }
    set name(name) {
        this.okOrError(
            'name', name,
            'ReceptNamn måste ha mer än 2 bokstäver!',
            typeof name == 'string' &&
            name.length >= 2
        );
        this._name = name;
    }

    set amount(amount) {
        this.okOrError(
            'amount', amount,
            'Du måste skriva in mängd! Enbart siffror!',
            typeof amount == 'string' &&
            amount.length >= 1
        );
        this._amount = amount;
    }

    set unit(unit) {
        let units = ["dl", "cl", "ml", "msk", "krdm", "kg", "g", "st", "liter"];
        this.okOrError(
            'unit', unit,
            `Något gick fel med enheterna`,
            typeof unit == 'string' &&
            unit.length >= 2 &&
            units.includes(unit)
        );
        this._unit = unit;
    }

    set nutrition(nutrition) {
        this.okOrError(
          'nutrition', nutrition,
          'must be an object with nutrition info',
          nutrition instanceof Nutrition
        );
        this._nutrition = nutrition;
      }

    okOrError(propName, propVal, errorMessage, ok) {
        if (ok) {
            return;
        }
        let className = this.constructor.name;
        alert("Kontrollera fälten! " + errorMessage);
        throw (new Error(`
      Faulty value for ${className}.${propName}
      (${typeof propVal}) ${JSON.stringify(propVal)}
      ${propName} ${errorMessage}
    `));

    }
}