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
    get id(){
        return this._id;
    }
    set id(id){
        let recHandler = new RecipeHandler();
        let arr = recHandler.getIngridientList();
        console.log(arr);
        this.okOrError(
            'id', id,
            `must be any of the following ${arr}`,
            typeof id == 'string' &&
            id.length >= 2 &&
            arr.includes(id)
        );
        this._id = id;
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

    set amount(amount) {
        this.okOrError(
            'amount', amount,
            'must be a string with a length >= 2',
            typeof amount == 'string' &&
            amount.length >= 2
        );
        this._amount = amount;
    }

    set unit(unit) {
        let units = ["dl", "cl", "ml", "msk", "krdm", "kg", "g", "st", "liter"];
        this.okOrError(
            'unit', unit,
            `must be any of the following ${units}`,
            typeof unit == 'string' &&
            unit.length >= 2 &&
            units.includes(unit)
        );
        this._unit = unit;
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