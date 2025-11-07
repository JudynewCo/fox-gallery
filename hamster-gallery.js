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
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/hamster-gallery.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      posts: { type: Array },
      users: { type: Array },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }
        .post-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          margin-bottom: 1.5rem;
          padding: 1rem;
          max-width: 500px;
        }

        .post-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .profile-img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }

        .carousel {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 0.5rem;
        }

        .carousel img {
          width: 100%;
          border-radius: 12px;
          scroll-snap-align: start;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
        }

        button {
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1rem;
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadData();
  }

  async loadData() {
    try {
      const res = await fetch("./data/post.json");
      const data = await res.json();
      this.posts = data.posts.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      this.users = data.users;
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        ${!this.posts?.length
          ? html`<p>Loading hamster posts...</p>`
          : this.posts.map(
              (post) =>
                html`<div class="post-card">${this.renderPost(post)}</div>`
            )}
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
