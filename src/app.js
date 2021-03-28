import Autocomplete from './components/autocomplete';
import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import { configure, hits, searchBox, index } from 'instantsearch.js/es/widgets';

import {
  connectHits,
  connectRefinementList,
} from 'instantsearch.js/es/connectors';

const search = instantsearch({
  indexName: 'instant_search',
  searchClient: algoliasearch('F6UQOMGX2S', '4aee1de08ceb37e9f064f5e22b505eb3'),
});

// Customize UI of the Query Suggestion Hits
// eslint-disable-next-line no-shadow
const renderQSHits = ({ widgetParams, hits }, isFirstRender) => {
  const container = document.querySelector(widgetParams.container);
  container.innerHTML = `<ul>
  ${hits
    .map(
      item => `
      <li>${instantsearch.highlight({ hit: item, attribute: 'query' })}</li>
      `
    )
    .join('')}
      </ul>`;
};

const QSHits = connectHits(renderQSHits);
// Searchbox variable
// Customize UI of the facet column
const renderFederatedRefinement = ({ widgetParams, items }, isFirstRender) => {
  const container = document.querySelector(widgetParams.container);
  container.innerHTML = `<ul>
  ${items
    .map(
      item => `
      <li>${item.label}</li>
      `
    )
    .join('')}
      </ul>`;
};
const federatedRefinement = connectRefinementList(renderFederatedRefinement);

search.addWidgets([
  searchBox({
    container: '#searchbox',
    placeholder: 'Search for products',
    showReset: true,
    showSubmit: true,
    showLoadingIndicator: true,
  }),
  index({
    indexName: 'instant_search',
    indexId: 'products',
  }).addWidgets([
    configure({
      hitsPerPage: 3,
    }),
    hits({
      container: '#products',
      templates: {
        empty: 'No results',
        item: `
                <div class="item">
                    <figure class="hit-image-container"><div class="hit-image-container-box"><img class="hit-image" src="{{image}}" alt=""></div></figure>
                    <p class="hit-category">&#8203;​</p>
                    <div class="item-content">
                        <p class="brand hit-tag">{{{_highlightResult.brand.value}}}</p>
                        <p class="name">{{{_highlightResult.name.value}}}</p>
                        <div class="hit-description">{{{price}}}<b class="hit-currency">€</b></div>
                    </div>
                </div>
                <br>`,
      },
    }),
  ]),
  index({
    indexName: 'query_suggestions',
  }).addWidgets([
    configure({
      hitsPerPage: 16,
    }),
    QSHits({
      container: '#suggestions',
    }),
  ]),
  federatedRefinement({
    attribute: 'categories',
    container: '#categories',
    limit: 15,
  }),
]);

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

