/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { LitElement, html } from '../../node_modules/@polymer/lit-element/lit-element.js';
import { repeat } from '../../node_modules/lit-html/lib/repeat.js';
import { unsafeHTML } from '../../node_modules/lit-html/lib/unsafe-html.js';
import items, { currentItemSelector } from '../reducers/items.js';
import favorites from '../reducers/favorites.js';
import { store } from '../store.js';
import './hn-loading-button.js';
import './hn-summary.js';
import './hn-comment.js';
import { fetchItem, fetchItemIfNeeded } from '../actions/items.js';
import { loadFavorites } from '../actions/favorites.js';
import { connect } from '../../lib/connect-mixin.js';
import { sharedStyles } from './shared-styles.js';

store.addReducers({
  favorites,
  items
});

store.dispatch(loadFavorites());

export class HnItemElement extends connect(store)(LitElement) {
  render({ favorites, item }) {
    const comments = item.comments || [];
    return html`
    <style>${sharedStyles}</style>
    <style>
      hn-summary {
        padding-bottom: 16px;
        border-bottom: 1px solid #e5e5e5;
      }
    </style>
    <hn-loading-button
        loading="${item.isFetching}"
        on-click="${() => store.dispatch(fetchItem(item))}">
    </hn-loading-button>
    <div hidden="${item.failure}">
      <hn-summary
          item="${item}"
          isFavorite="${favorites && item && favorites[item.id]}">
      </hn-summary>
      <div hidden="${!item.content}">${unsafeHTML(item.content)}</div>
      ${repeat(comments, (comment) => html`
        <hn-comment id="${comment.id}" comment="${comment}" itemId="${item.id}"></hn-comment>
      `)}
    </div>
    ${item.failure ? html`<p>Item not found</p>` : ''}
    `;
  }

  static get properties() {
    return {
      item: Object,

      favorites: Array
    }
  }

  update(state) {
    const item = currentItemSelector(state);
    if (item) {
      document.title = item.title;
      this.favorites = state.favorites;
      this.item = item;
    }
  }
}

customElements.define('hn-item', HnItemElement);

export { currentItemSelector, fetchItemIfNeeded };
