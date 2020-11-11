import Search from './Model/Search';
import Recipe from './Model/Recipe'
import List from './Model/List'
import * as searchView from './View/searchView';
import * as recipeView from './View/recipeView';
import * as listView from './View/listView';
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
window.state = state;

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
  const btn = e.target.closest('.btn-inline');
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
    recipeView.clearRecipe();
    renderLoading(elements.recipe);
    if (state.search) searchView.hightLightSelected(id);
    // highLight selected search item

    // create new recipe object.
    state.recipe = new Recipe(id);

    // Get recipe data and parse ingredients.
    await state.recipe.getRecipe();
    state.recipe.parseIngredients();

    // calculate serving and time.
    state.recipe.calcServings();
    state.recipe.calcTime();

    // Render recipe.
    clearLoader();
    recipeView.renderRecipe(state.recipe);
  }

}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe)
['hashchange', 'load'].forEach(cur => window.addEventListener(cur, controlRecipe));

// LIST CONTROLLER.

const controlList = () => {
  // create a new list If there in none yet.
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);

  });

}

// Handle delete and update list item events

elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {

    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);

    // Handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseInt(e.target.value, 10);
    state.list.updateCount(id, val);
  }

});





// Handling recipe button clicks.

elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }

  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);

  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  }
});

window.l = new List();