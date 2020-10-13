import axios from 'axios';

async function getResult(query){

const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=pasta`)
const recipes = res.data.recipes;
console.log(recipes);
}

getResult();
//https://forkify-api.herokuapp.com/api/search

