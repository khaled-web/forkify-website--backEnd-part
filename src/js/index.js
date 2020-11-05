import Search from './Model/Search';
import Recipe from './Model/Recipe'
import * as searchView from './View/searchView';
import {
  elements,
  renderLoading,
  clearLoader
} from './View/base';

/* 
Global state of app:-
01. search object
02. current recipe object
03. shopping list object
04. liked recipes
*/

const state = {};

const controlSearch = async () => {

  // 1. get query from view
  const query = searchView.getInput();

  if (query) {

    //2. new search object and add to state
    state.Search = new Search(query);

    //3. prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoading(elements.searchResult)

    //4. search for recipes
    await state.Search.getResult();

    //5. Render result on UI
    clearLoader();
    searchView.renderResult(state.Search.result)

  }
}

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline')
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResult(state.Search.result, goToPage)

  }
});

// RECIPE CONTROLLER

const controlRecipe = async () => {
  // get Id from URL
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    // prepare UI for changes.

    // create new recipe object.
    state.recipe = new Recipe(id);

    // Get recipe data and parse ingredients.
    await state.recipe.getRecipe();
    state.recipe.parseIngredients();

    // calculate serving and time.
    state.recipe.calcServings();
    state.recipe.calcTime();

    // Render recipe.
    console.log(state.recipe);
  }

}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe)
['hashchange', 'load'].forEach(cur => window.addEventListener(cur, controlRecipe));