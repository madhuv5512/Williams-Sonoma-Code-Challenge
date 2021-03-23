function WSIProdStore (url) {
  let products;
  let jsonURL = url;
  const groupsToObject = (obj, group) => {
    obj[group.id] = group;
    return obj;
  };

  function fetchJSON (fileURL) {
    const fetchOptions = { method: 'GET' };
    return fetch(fileURL, fetchOptions)
      .then(response => {
        return response.json();
      })
      .catch(err => {
        console.error('fetchJSON fetch err:', err);
        throw err;
      });
  }

  function readProducts () {
    return fetchJSON(jsonURL)
      .then(rawData => {
        products = rawData.groups.reduce(groupsToObject, {});
        return true;
      })
      .catch(err => {
        console.error('readProducts err:', err);
        return false;
      })
  }

  function productIds () {
    return Object.keys(products);
  }

  function getProduct (productId) {
    return products[productId];
  }

  function getVueProduct (productId) {
    const product = products[productId];
    if (typeof product === 'undefined') {
      return undefined;
    }
    const vueProduct = {
      id: product.id,
      name: product.name,
      heroHref: product.hero.href
    };
    if (product.priceRange) {
      vueProduct.priceRange = product.priceRange;
    } else if (product.price) {
      vueProduct.price = product.price;
    }
    return vueProduct;
  }

  return {
    readProducts,
    productIds,
    getProduct,
    getVueProduct
  }
}

export default WSIProdStore;
