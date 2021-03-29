import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import { configure, hits, searchBox, index } from 'instantsearch.js/es/widgets';

import {
  connectHits,
  connectRefinementList,
} from 'instantsearch.js/es/connectors';

let appID = 'F6UQOMGX2S';
let apiKey = '4aee1de08ceb37e9f064f5e22b505eb3';

const search = instantsearch({
  indexName: 'instant_search',
  searchClient: algoliasearch(appID, apiKey),
});

// Customize UI of the Query Suggestion Hits
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
    indexName: 'ecommerce-v2',
    indexID: 'products',
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
    indexName: 'ecommerce-v2',
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

search.on('render', () => {
  const federatedResults = document.querySelector(
    '.federated-results-container'
  );
  const searchBox = document.querySelector('.ais-SearchBox-wrapper');

  searchBox.querySelector('input').addEventListener('focus', () => {
    federatedResults.style.display = 'grid';
    searchBox.classList.add('is-open');
  });
  window.addEventListener('click', () => {
    federatedResults.style.display = 'none';
  });
  searchBox.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  federatedResults.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});