// products page for Williams-Sonoma Coding Challenge
import WSIProdStore from './products.store.js';
import WSIProductsVM from './products.vue.js';
import OverlayCarousel from
    '../node_modules/image-gallery-overlay/build/js/carousel.js';
let carousel;

const JSON_FILE_NAME = 'wsi-products.json';
const PRODUCTS_URL = productsJsonUrl(JSON_FILE_NAME);
const prodStore = new WSIProdStore(PRODUCTS_URL);
const prodVM = WSIProductsVM('productsvm');

function addImageClickListener (cardsParent) {
  cardsParent.addEventListener('click', handleProductClick);
}

function addOverlayHideListener () {
  $('#carouselModal').on('hidden.bs.modal', () => {
    // no cleanup needed
  });
}

function addEscapeKeyListener () {
  document.addEventListener('keydown', (evt) => {
    if (evt.key !== 'Escape') { return; }
    if ($('#carouselModal').is(':visible')) { return; }
    if (document.activeElement) {
      document.activeElement.blur();
    }
  });
}

function productsJsonUrl (fileName) {
  const pathMinusFile = location.pathname.substring(0,
    location.pathname.lastIndexOf('/'));
  return `${location.protocol}//${location.hostname}:${location.port}` +
    `${pathMinusFile}/${fileName}`;
}

function handleProductClick (evt) {
  const isProductImage = (el) =>
    el.tagName === 'IMG' && typeof el.dataset.id !== 'undefined';
  const target = evt.target;
  if (isProductImage(target) === false) {
    return;
  }
  const thisProduct = prodStore.getProduct(target.dataset.id);
  const imgHrefs = thisProduct.images.map((image) => image.href);
  carousel.populate(thisProduct.name, imgHrefs)
    .then(() => {
      carousel.show();
    });
}

function addProdStoreToVM () {
  prodStore.productIds().forEach((id) => {
    prodVM.addProduct(prodStore.getVueProduct(id));
  });
}

function mapEnterKeysToClickEvent (cardsParent) {
  cardsParent.addEventListener('keydown', (e) => {
    const elem = e.target;
    if (e.key === 'Enter' && elem.tagName === 'IMG') {
      elem.click();
    }
  });
}

function addEventListeners () {
  const cardsParent = document.getElementById('products-container');
  addImageClickListener(cardsParent);
  mapEnterKeysToClickEvent(cardsParent);
  addOverlayHideListener();
  addEscapeKeyListener();
}

function pageInit () {

  addEventListeners();
  prodStore.readProducts()
    .then(result => {
      if (result !== true) {
        throw 'unable to read products';
      }
      addProdStoreToVM();
    })
    .catch(err => alert(err));
}

function initPageOnWindowLoad () {
  window.addEventListener('load', () => {
    carousel = new OverlayCarousel({
      thumbnailHoverOutline: '2px solid dodgerblue'
    });

    pageInit();
  });
}

initPageOnWindowLoad();

export default pageInit;
