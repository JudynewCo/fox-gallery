import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";


export class FoxApi extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "fox-api";
  }

  constructor() {
    super();
    this.title = "Fox Gallery";
    this.foxes = [];
    this.imageCount = 6;
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      foxes: { type: Array },
      imageCount: { type: Number },
    };
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        --text-primary: #37352f;
        --bg-primary: #ffffff;
        --border-color: #e9e9e7;
        --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica', Arial, sans-serif;
        --spacing-md: 16px;
        --spacing-lg: 32px;
        --radius: 3px;
      }
      .wrapper {
        padding: var(--spacing-md);
      }
      h2 {
        margin: 0 0 var(--spacing-lg) 0;
        font-size: 24px;
        font-weight: 600;
        color: var(--text-primary);
        font-family: var(--font-family);
      }
      .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: var(--spacing-md);
      }
      .fox-card {
        border-radius: var(--radius);
        overflow: hidden;
        background-color: var(--bg-primary);
        border: 1px solid var(--border-color);
        transition: all 0.2s;
        cursor: pointer;
      }
      .fox-card:hover {
        box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, 
                    rgba(15, 15, 15, 0.1) 0px 3px 6px, 
                    rgba(15, 15, 15, 0.1) 0px 9px 24px;
      }
      .fox-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
        display: block;
      }
    `];
  }

  async fetchFox() {
    try {
      const response = await fetch('https://randomfox.ca/floof/');
      const data = await response.json();
      return {
        id: Date.now() + Math.random(),
        image: data.image,
        link: data.link,
      };
    } catch (error) {
      console.error('Error fetching fox:', error);
      return null;
    }
  }

  async loadFoxes(count) {
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(this.fetchFox());
    }
    const newFoxes = await Promise.all(promises);
    this.foxes = [...this.foxes, ...newFoxes.filter(fox => fox !== null)];
  }

  handleFoxClick(link) {
    window.open(link, '_blank');
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.foxes.length === 0) {
      this.loadFoxes(this.imageCount);
    }
  }

  render() {
    return html`
      <div class="wrapper">
        <h2>${this.title}</h2>
        
        <div class="gallery">
          ${this.foxes.map(fox => html`
            <div class="fox-card" @click="${() => this.handleFoxClick(fox.link)}">
              <img 
                class="fox-image" 
                src="${fox.image}" 
                alt="Random fox" 
                loading="lazy"
              />
            </div>
          `)}
        </div>
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(FoxApi.tag, FoxApi);
