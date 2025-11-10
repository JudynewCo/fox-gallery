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
    const res = await fetch(new URL("./public/hamster.json", import.meta.url).href);
    const data = await res.json();
    this.users = data.users.map((user) => ({
      ...user,
      profileImage: new URL('./public/' + user.profileImage, import.meta.url).href,
    }));

    this.posts = data.posts
      .map((post) => ({
        ...post,
        postImages: Array.isArray(post.postImages)
          ? post.postImages.map((img) => new URL('public/' + img, import.meta.url).href)
          : new URL('./public/' + post.postImages, import.meta.url).href,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

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

        @media (prefers-color-scheme: dark) {
          :host {
            background-color: var(--ddd-theme-default-black);
            color: var(--ddd-theme-default-white);
          }
        }

        .hamster-gallery {
          margin: var(--ddd-spacing-24);
        }

        .container {
          display: flex;
          flex-direction: row;
          gap: 1rem;
          margin-inline: var(--ddd-spacing-24);
        }

        /* Side Nav (Desktop) */
        .user-nav {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 180px;
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-md);
          padding-inline: var(--ddd-spacing-6);
          padding-block: var(--ddd-spacing-12);
          gap: 1.5rem;
        }

        .user-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: var(--ddd-spacing-2);
          cursor: pointer;
        }

        .user-item img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 0.5rem;
        }
        .user-item span {
          font-size: var(--ddd-font-size-sm);
        }

        /* Post Feed */
        .post-card {
          display: flex;
          flex-direction: column;
          margin-inline: var(--ddd-spacing-6);
          margin-bottom: var(--ddd-spacing-6);
        }

        .single-post {
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-md);
          padding-inline: var(--ddd-spacing-24);
          padding-block: var(--ddd-spacing-6);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-6);
        }

        .post-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
        }

        .profile-img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .user-name {
          font-size: var(--ddd-font-size-m);
          margin: 0;
          font-weight: medium;
        }

        .user-role {
          font-size: var(--ddd-font-size-s);
          color: var(--ddd-theme-default-gray);
          margin: 0;
        }

        .carousel {
          display: flex;
          overflow-x: auto;
          gap: 0.5rem;
          scroll-snap-type: x mandatory;
        }

        .carousel img {
          width: 100%;
          border-radius: var(--ddd-radius-md);
          scroll-snap-align: start;
        }

        .single-image img {
          width: 100%;
          border-radius: var(--ddd-radius-md);
        }

        .caption {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          line-height: 1.4;
        }

        .post-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .time {
          display: inline-block;
          font-size: var(--ddd-font-size-sm);
        }
        .btns {
          display: flex;
        }
        .like-btn,
        .share-btn {
          background: none;
          border: none;
          font-size: var(--ddd-font-size-s);
          cursor: pointer;
          color: var(--ddd-theme-default-coalyGray);
        }

        .like-btn.liked {
          color: red;
        }

        .like-btn:active,
        .share-btn:active {
          transform: scale(1.1);
        }

        .load-more {
          display: block;
          font-size: var(--ddd-font-size-m);
          background: var(--ddd-theme-primary);

          width: stretch;
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-md);
          margin: var(--ddd-spacing-12);
          padding: var(--ddd-spacing-6);
          cursor: pointer;
        }

        .load-more:hover {
          background: var(--ddd-theme-primary-hover);
        }
        /* Mobile view */
        @media (max-width: 1280px) {
          .container {
            margin: var(--ddd-spacing-6);
          }

          .load-more {
            display: block;
            font-size: var(--ddd-font-size-s);
            width: stretch;
            margin: 0 var(--ddd-spacing-12);
          }
        }

        /* Mobile view */
        @media (max-width: 1080px) {
          .container {
            margin: var(--ddd-spacing-6);
          }
          .user-item img {
            width: 48px;
            height: 48px;
          }
          .post-card {
            margin-inline: var(--ddd-spacing-1);
          }

          .single-post {
            padding-inline: var(--ddd-spacing-12);
            padding-block: var(--ddd-spacing-6);
            display: flex;
            flex-direction: column;
            gap: var(--ddd-spacing-6);
          }

          .post-header {
            gap: var(--ddd-spacing-3);
          }

          .profile-img {
            width: 48px;
            height: 48px;
          }

          .user-name {
            font-size: var(--ddd-font-size-s);
          }

          .user-role {
            font-size: var(--ddd-font-size-sm);
          }

          .caption {
            font-size: var(--ddd-font-size-sm);
          }

          .like-btn,
          .share-btn {
            font-size: var(--ddd-font-size-sm);
          }

          .like-btn.liked {
            color: red;
          }

          .like-btn:active,
          .share-btn:active {
            transform: scale(1.1);
          }

          .load-more {
            display: block;
            font-size: var(--ddd-font-size-s);
            width: stretch;
            margin: 0 var(--ddd-spacing-2);
          }
        }

        @media (max-width: 800px) {
          .container {
            flex-direction: column;
            margin-inline: var(--ddd-spacing-12);
          }

          .user-nav {
            flex-direction: row;
            width: stretch;
            overflow-x: auto;
            justify-content: start;
            gap: 0.75rem;
          }
          .post-card {
            margin-inline: 0;
          }
          .user-item {
            flex-direction: column;
            min-width: 80px;
          }
          .user-item img {
            width: 48px;
            height: 48px;
          }
          .user-item span {
            font-size: var(--ddd-font-size-xxs);
          }
        }
        @media (max-width: 480px) {
          .container {
            flex-direction: column;
            margin: var(--ddd-spacing-2);
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

  // render a single post
  renderPost(post) {
    const user = this.users.find((u) => u.id === post.userId) || {};
    const date = new Date(post.date);

    return html`
      <article class="post-card">
        <div class="single-post">
          <!-- HEADER -->
          <header class="post-header">
            <img
              src="${user.profileImage}"
              alt="${user.name}"
              class="profile-img"
            />
            <div class="user-info">
              <h4 class="user-name">${user.name}</h4>
              <p class="user-role">${user.role}</p>
            </div>
          </header>

          <!-- POST IMAGE(S) -->
          ${Array.isArray(post.postImages)
            ? html`
                <div class="carousel">
                  ${post.postImages.map(
                    (img) => html`<img src="${img}" alt="Post image" />`
                  )}
                </div>
              `
            : html`
                <div class="single-image">
                  <img src="${post.postImages}" alt="Post image" />
                </div>
              `}

          <!-- CAPTION -->
          <p class="caption">${post.desc}</p>

          <!-- FOOTER -->
          <footer class="post-actions">
            <span class="time">
              ${date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span class="btns">
              <button class="like-btn" @click=${() => this.toggleLike(post)}>
                ${post.likedByUser ? "❤️" : "🤍"} ${post.likes}
              </button>
              <button class="share-btn" @click=${() => this.sharePost(post)}>
                🔗 share
              </button>
            </span>
          </footer>
        </div>
      </article>
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
