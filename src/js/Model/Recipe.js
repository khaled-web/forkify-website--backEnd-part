import axios from 'axios';
import {
    elements
} from '../View/base';

export default class Recipe {
    constructor(id) {
        this.id = id;

    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            console.log(error);
            alert('somethings went wrong. :(')
        }
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {

        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g'];

        const newIngredient = this.ingredients.map(el => {

            // 01. uniform unit
            let ingredient = el.toLowerCase();
            unitLong.forEach((cur, i) => {
                ingredient = ingredient.replace(cur, unitShort[i]);
            });

            // 02. remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            // 03. parse ingredients into count, unit, ingredients(text)

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(cur => units.includes(cur));

            let objIng;

            if (unitIndex > -1) {
                // there is unit.

                const arrCount = arrIng.slice(0, unitIndex); // 4 1/2 cups >> arrCount = [4, 1/2]
                let count;

                if (arrCount === 1) {
                    count = eval(arrIng[0].replace('-', '+'));

                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));

                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {

                // there is no unit, but the 1th element is number 
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }


            } else if (unitIndex === -1) {
                // there is no unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }

            }

            return objIng;

        });

        this.ingredients = newIngredient;
    }
}