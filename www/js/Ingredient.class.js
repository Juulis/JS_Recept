class Ingredient {
 /*   constructor(name, amount, unit) {
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }*/

    set name(name) {
        this.okOrError(
            'name', name,
            'must be a string with a length >= 2',
            typeof name == 'string'
            && name.length >= 2
        );
        this.name = name;
    }

    set amount(amount) {
        this.okOrError(
            'amount', amount,
            'must be a string with a length >= 2',
            typeof amount == 'string'
            && amount.length >= 2
        );
        this.amount = amount;
    }

    set unit(unit) {
        let units = ["dl", "cl", "ml", "msk", "krdm", "kg", "g", "st", "liter"];
        this.okOrError(
            'unit', unit,
            `must be any of the following ${units}`,
            typeof unit == 'string'
            && unit.length >= 2
            && units.includes(unit)
    );
        this.unit = unit;
    }

    okOrError(propName, propVal, errorMessage, ok) {
        if (ok) { return; }
        let className = this.constructor.name;
        throw (new Error(`
      Faulty value for ${className}.${propName}
      (${typeof propVal}) ${JSON.stringify(propVal)}
      ${propName} ${errorMessage}
    `));
    }
}