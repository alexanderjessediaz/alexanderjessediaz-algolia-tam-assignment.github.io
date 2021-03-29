import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';

// Instant Search Widgets
import { hits, configure, searchBox, index } from 'instantsearch.js/es/widgets';

import {
  connectHits,
  connectRefinementList,
} from 'instantsearch.js/es/connectors';

// can't get my api to work. I thought this is the correct appID, but I get a 404 error eacht time I test it
// const search = instantsearch({
//   indexName: 'instant_search',
//   searchClient: algoliasearch('F6UQOMGX2S', '4aee1de08ceb37e9f064f5e22b505eb3'),
// });

/**
 * @class Autocomplete
 * @description Instant Search class to display content in the page's autocomplete
 */
class Autocomplete {
  /**
   * @constructor
   */
  constructor() {
    this._registerClient();
    this._registerWidgets();
    this._startSearch();
  }

  /**
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @return {void}
   */

  // using default data to show something
  _registerClient() {
    this._searchClient = algoliasearch(
      'VYLEWMPKEZ',
      '8940a18fde155adf3f74b0912c267aa4'
    );

    this._searchInstance = instantsearch({
      indexName: 'ecommerce-v2',
      searchClient: this._searchClient,
    });
  }

  /**
   * @private
   * Adds widgets to the Algolia instant search instance
   * @return {void}
   */
  _registerWidgets() {
    const renderQSHits = ({ widgetParams, hits }, isFirstRender) => {
      const container = document.querySelector(widgetParams.container);
      container.innerHTML = `<ul>
        ${hits
          .map(
            item => `
            <li>${instantsearch.highlight({
              hit: item,
              attribute: 'query',
            })}</li>
            `
          )
          .join('')}
            </ul>`;
    };

    const QSHits = connectHits(renderQSHits);

    const renderFederatedRefinement = (
      { widgetParams, items },
      isFirstRender
    ) => {
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
    const federatedRefinement = connectRefinementList(
      renderFederatedRefinement
    );
    this._searchInstance.addWidgets([
      searchBox({
        container: '#searchbox',
        placeholder: 'Search for products',
        showReset: true,
        showSubmit: true,
        showLoadingIndicator: true,
      }),
      index({
        indexName: 'ecommerce-v2',
        indexId: this._searchClient,
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
  }

  /**
   * @private
   * Starts instant search after widgets are registered
   * @return {void}
   */
  _startSearch() {
    this._searchInstance.start();
  }
}

export default Autocomplete;
