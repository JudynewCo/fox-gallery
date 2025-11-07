import { html, fixture, expect } from '@open-wc/testing';
import "../hamster-gallery.js";

describe("HamsterGallery test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <hamster-gallery
        title="title"
      ></hamster-gallery>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
