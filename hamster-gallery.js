/**
 * Copyright 2025 “jubileejost”
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `hamster-gallery`
 *
 * @demo index.html
 * @element hamster-gallery
 */
export class HamsterGallery extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "hamster-gallery";
  }

  constructor() {
    super();
    this.posts = [];
    this.users = [];
    this.visiblePosts = [];
    this.postsPerLoad = 3;
  }
  async loadData() {
    const res = await fetch("data/hamster.json");
    const data = await res.json();
    this.users = data.users;
    this.posts = data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    this.visiblePosts = this.posts.slice(0, this.postsPerLoad);
  }

  loadMorePosts() {
    const next = this.visiblePosts.length + this.postsPerLoad;
    this.visiblePosts = this.posts.slice(0, next);
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      posts: { type: Array },
      users: { type: Array },
      visiblePosts: { type: Array },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          background: var(--ddd-theme-default-white);
          color: var(--ddd-theme-default-coalyGray);
          min-height: 100vh;
        }

        .container {
          display: flex;
          flex-direction: row;
          gap: 1rem;
          margin: var(--ddd-spacing-3);
        }

        /* Side Nav (Desktop) */
        .user-nav {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 150px;
          background: var(--ddd-accent-1);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-2);
        }

        .user-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: var(--ddd-spacing-2);
          cursor: pointer;
        }

        .user-item img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 0.5rem;
        }

        /* Post Feed */
        .post-feed {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .load-more {
          align-self: center;
          margin-top: var(--ddd-spacing-4);
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          background: var(--ddd-theme-primary);
          color: white;
          border: none;
          border-radius: var(--ddd-radius-md);
          cursor: pointer;
        }

        .load-more:hover {
          background: var(--ddd-theme-primary-hover);
        }

        /* Mobile view */
        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }

          .user-nav {
            flex-direction: row;
            width: 100%;
            overflow-x: auto;
            justify-content: start;
            gap: 1rem;
          }

          .user-item {
            flex-direction: column;
            min-width: 80px;
          }
        }
      `,
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    this.loadData();
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="container">
        <!-- Sidebar or Horizontal Nav -->
        <nav class="user-nav">
          ${this.users.map(
            (user) => html`
              <div class="user-item">
                <img src="${user.profileImage}" alt="${user.name}" />
                <span>${user.name}</span>
              </div>
            `
          )}
        </nav>

        <!-- Post Feed -->
        <main class="post-feed">
          ${this.visiblePosts.map(
            (post) =>
              html`<div class="post-card">${this.renderPost(post)}</div>`
          )}
          <button class="load-more" @click=${this.loadMorePosts}>
            Load More
          </button>
        </main>
      </div>
    `;
  }

  // rende r a single post
  renderPost(post) {
    const user = this.users.find((u) => u.id === post.userId) || {};
    return html`
      <div class="post-header">
        <img
          src="${user.profileImage}"
          alt="${user.name}"
          class="profile-img"
        />
        <div>
          <h4>${user.name}</h4>
          <small>${new Date(post.date).toLocaleDateString()}</small>
        </div>
      </div>

      ${Array.isArray(post.postImages)
        ? html`
            <div class="carousel">
              ${post.postImages.map(
                (img) => html`<img src="${img}" alt="Hamster photo" />`
              )}
            </div>
          `
        : html`<img src="${post.postImages}" alt="Hamster photo" />`}

      <p>${post.desc}</p>
      <div class="actions">
        <button @click=${() => this.toggleLike(post)}>
          ${post.likedByUser ? "❤️" : "🤍"} ${post.likes}
        </button>
        <button @click=${() => this.sharePost(post)}>🔗 Share</button>
      </div>
    `;
  }

  //share and like functions
  toggleLike(post) {
    post.likedByUser = !post.likedByUser;
    post.likes += post.likedByUser ? 1 : -1;
    this.requestUpdate();
  }

  sharePost(post) {
    if (navigator.share) {
      navigator.share({
        title: "Hamstergram Post",
        text: post.desc,
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported on this browser.");
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(HamsterGallery.tag, HamsterGallery);
