import Search from './Model/search';
/*
// TODO: Global state of the app.
- search object.
- current recipe object.
- shopping list object.
- liked recipes.

 */

const state = {};

const controlSearch = async () => {
  // 01. get the query from the view.
  const query = 'pasta';

  if (query) {
    // 02. new search object and add to state.
    state.search = new Search(query);

    // 03. prepare UI for result

    //04. search for recipes
    await state.search.getResult()

    // 05. Render results on UI
     console.log(state.search.result);
  }
}

document.querySelector('.search').addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});
