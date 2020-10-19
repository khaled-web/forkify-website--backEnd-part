import Search from './Model/Search';
import * as searchView from './View/searchView';
import {elements} from './View/base';

/* 
Global state of app:-
01. search object
02. current recipe object
03. shopping list object
04. liked recipes
*/

const state = {};

const controlSearch = async ()=>{

  // 1. get query from view
  const query = searchView.getInput();

  if(query){
    //2. new search object and add to state
    state.Search = new Search(query);
  //3. prepare UI for results
  searchView.clearInput();
  searchView.clearResults();
  //4. search for recipes
  await state.Search.getResult();

  //5. Render result on UI
  searchView.renderResult(state.Search.result)
  
  }
}

elements.searchForm.addEventListener('submit', (e)=>{
e.preventDefault();
controlSearch();
})
