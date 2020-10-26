import axios from 'axios';
export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResult() {
    try {
      const rec = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
      this.result = rec.data.recipes;
      //console.log(this.result);
    } catch (error) {
      alert(error);
    }
  }
}