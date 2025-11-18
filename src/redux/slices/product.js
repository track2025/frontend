import { sum, map, filter, uniqBy } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const shippingFee = parseInt(process.env.SHIPPING_FEE);
const initialState = {
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: shippingFee,
    billing: null
  }
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload || [];

      // normalize shop on every item: if shop is not an object, convert to { id: shop }
      const normalizedCart = cart.map((p) => {
        const shop = p.shop && typeof p.shop === 'object'
          ? p.shop
          : p.shop
            ? { id: p.shop } // at least keep the id
            : null;
        return { ...p, shop };
      });

      const subtotal = sum(normalizedCart.map((product) => (product.priceSale || product.price) * product.quantity));
      const discount = normalizedCart.length === 0 ? 0 : state.checkout.discount;
      const shipping = (normalizedCart.length === 0 || normalizedCart[0].checkoutType === "product") ? 0 : shippingFee;
      const billing = normalizedCart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = normalizedCart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal;
    },


    addPhysicalCart(state, action) {
      const product = action.payload;
      const updatedProduct = {
        ...product,
        checkoutType: 'physical-product',
        sku: `${product.pid}`
      };

      // ✅ Remove all normal products before adding physical product
      state.checkout.cart = filter(state.checkout.cart, (item) => item.checkoutType !== 'product');

      const isEmptyCart = state.checkout.cart.length === 0;
      if (isEmptyCart) {
        state.checkout.cart = [updatedProduct];
      } else {
        state.checkout.cart = map(state.checkout.cart, (_product) => {
          const isExisted = _product.sku === updatedProduct.sku;
          if (isExisted) {
            return {
              ..._product,
              quantity: 1
            };
          }
          return _product;
        });
      }

      state.checkout.cart = uniqBy([...state.checkout.cart, updatedProduct], 'sku');
    },

    addCart(state, action) {
      const product = action.payload;
      const updatedProduct = {
        ...product,
        checkoutType: 'product',
        sku: `${product.pid}`,
        shop: product.shop
      };

      // ✅ Remove all physical products before adding normal product
      state.checkout.cart = filter(state.checkout.cart, (item) => item.checkoutType !== 'physical-product');

      const isEmptyCart = state.checkout.cart.length === 0;
      if (isEmptyCart) {
        state.checkout.cart = [updatedProduct];
      } else {
        state.checkout.cart = map(state.checkout.cart, (_product) => {
          const isExisted = _product.sku === updatedProduct.sku;
          if (isExisted) {
            return {
              ..._product,
              quantity: 1,
              shop: updatedProduct.shop,
            };
          }
          return _product;
        });
      }

      state.checkout.cart = uniqBy([...state.checkout.cart, updatedProduct], 'sku');
    },

    clearCart(state, action) {
      const updateCart = filter(state.checkout.cart, (item) => item.sku !== action.payload);
      state.checkout.cart = updateCart;

      // For physical
      const updatePhysicalCart = filter(state.checkout.cart, (item) => item.sku !== action.payload);
      state.checkout.cart = updatePhysicalCart;
    },
    deleteCart(state, action) {
      const updateCart = filter(state.checkout.cart, (item) => item.sku !== action.payload);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.billing = null;
    },

    increaseQuantity(state, action) {
      const productSku = action.payload;
      const updateCart = map(state.checkout.cart, (product) => {
        if (product.sku === productSku) {
          return {
            ...product,
            quantity: product.quantity + 1
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productSku = action.payload;
      const updateCart = map(state.checkout.cart, (product) => {
        if (product.sku === productSku) {
          return {
            ...product,
            quantity: product.quantity - 1
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  addPhysicalCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  clearCart,
  deleteCart,
  createBilling,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity
} = slice.actions;
