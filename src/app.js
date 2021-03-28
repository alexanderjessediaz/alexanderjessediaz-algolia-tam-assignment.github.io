import Autocomplete from './components/autocomplete';
import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';

const search = instantsearch({
  indexName: 'instant_search',
  searchClient: algoliasearch(
    'F6UQOMGX2S',
    '4aee1de08ceb37e9f064f5e22b505eb3'
    ),
  });
  
  search.start();
  
class SpencerAndWilliamsSearch {
  constructor() {
    this._initSearch();
    this._registerEvents();
  }
  
  
  _initSearch() {
    this.autocompleteDropdown = new Autocomplete();
  }
  
  _registerEvents() {
    const autocomplete = document.querySelector('.autocomplete');
    const searchbox = document.querySelector('#searchbox input');
    
    searchbox.addEventListener('click', () => {
      autocomplete.style.display = 'block';
    });
    
    searchbox.addEventListener('blur', () => {
      autocomplete.style.display = 'none';
    });
  }
}

const app = new SpencerAndWilliamsSearch();


