import http from './http';
//----------------------------------

export const login = async (payload) => {
  const { data } = await http.post(`/auth/login`, payload);
  return data;
};
export const register = async (payload) => {
  const { data } = await http.post(`/auth/register`, payload);
  return data;
};
export const getUserCategories = async () => {
  const { data } = await http.get(`/categories`);
  return data;
};
export const getProducts = async (query = '', cat, rate) => {
  const { data } = await http.get(`/products${query || '?'}&rate=${rate}`);
  return data;
};
export const getProductDetails = async (pid) => {
  const { data } = await http.get(`/products/${pid}`);
  return data;
};

export const getProductsByCategory = async (query = '', category, rate) => {
  const { data } = await http.get(`/category/products/${category}${query || '?'}&rate=${rate}`);
  return data;
};
export const getProductsByCompaign = async (query = '', slug, rate) => {
  const { data } = await http.get(`/compaign/products/${slug}${query || '?'}&rate=${rate}`);
  return data;
};

export const getProductSlugs = async () => {
  const { data } = await http.get(`/products-slugs`);
  return data;
};
export const getProductsBySubCategory = async (query = '', subcategory, rate) => {
  const { data } = await http.get(`/subcategory/products/${subcategory}${query || '?'}&rate=${rate}`);
  return data;
};

export const getProductsByShop = async (query = '', shop, rate) => {
  const { data } = await http.get(`/shop/products/${shop}${query || '?'}&rate=${rate}`);
  return data;
};

export const getAllProducts = async () => {
  const { data } = await http.get(`/products/all`);
  return data;
};
export const getAllFilters = async () => {
  const { data } = await http.get(`/products/filters`);
  return data;
};
export const getFiltersByCategory = async (category) => {
  const { data } = await http.get(`/filters/${category}`);
  return data;
};
export const getFiltersBySubCategory = async (category, subcategory) => {
  const { data } = await http.get(`/filters/${category}/${subcategory}`);
  return data;
};
export const getNewProducts = async () => {
  const { data } = await http.get(`/products/new`);
  return data;
};
export const getFiltersByShop = async (shop) => {
  const { data } = await http.get(`/filters/${shop}`);
  return data;
};

export const getNewArrivels = async () => {
  const { data } = await http.get('/new-arrivals');
  return data;
};
export const getRelatedProducts = async (pid) => {
  const { data } = await http.get(`/related-products/${pid}`);
  return data;
};
export const getProductBySlug = async (slug) => {
  const { data } = await http.get(`/products/${slug}`);
  return data;
};
export const getVendorProductBySlug = async (slug) => {
  const { data } = await http.get(`/vendor/products/${slug}`);
  return data;
};
export const getVendorShop = async () => {
  const { data } = await http.get(`/vendor/shop`);
  return data;
};

export const getProductReviews = async (pid) => {
  const { data } = await http.get(`/reviews/${pid}`);
  return data;
};
export const addReview = async (payload) => {
  const { data } = await http.post(`/reviews`, payload);
  return data;
};

export const getUserInvoice = async (page) => {
  const { data: response } = await http.get(`/users/invoice${page}`);
  return response;
};

export const updateProfile = async ({ ...payload }) => {
  const { data } = await http.put(`/users/profile`, payload);
  return data;
};
export const changerPassword = async ({ ...payload }) => {
  const { data } = await http.put(`/users/change-password`, payload);
  return data;
};
export const forgetPassword = async (payload) => {
  const { data } = await http.post('/auth/forget-password', payload);
  return data;
};
export const resetPassword = async ({ newPassword, token }) => {
  const { data } = await http.post('/auth/reset-password', {
    newPassword: newPassword,
    token: token
  });
  return data;
};
export const getAddress = async (payload) => {
  const { data } = await http.get(`/users/addresses?id=${payload}`);
  return data;
};
export const updateAddress = async ({ _id, ...payload }) => {
  const { data } = await http.put(`/users/addresses/${_id}`, payload);
  return data;
};
export const createAddress = async ({ ...payload }) => {
  const { data } = await http.post(`/users/addresses/`, payload);
  return data;
};
export const deleteAddress = async ({ _id }) => {
  const { data } = await http.delete(`/users/addresses/${_id}`);
  return data;
};
export const search = async (payload) => {
  const { data } = await http.post(`/search`, payload);
  return data;
};
export const getSearchFilters = async () => {
  const { data } = await http.get(`/search-filters`);
  return data;
};
export const getInvoices = async () => {
  const { data } = await http.get(`/users/invoice`);
  return data;
};
export const placeOrder = async (payload) => {
  const { data } = await http.post(`/orders`, payload);
  return data;
};
export const getLayout = async () => {
  const { data } = await http.get(`/layout`);
  return data;
};
export const singleDeleteFile = async (id) => {
  const { data } = await http.delete(`/delete-file/${id}`);
  return data;
};

export const sendNewsletter = async (payload) => {
  const { data } = await http.post(`/newsletter`, payload);
  return data;
};

export const getWishlist = async () => {
  const { data } = await http.get(`/wishlist`);
  return data;
};
export const updateWishlist = async (pid) => {
  const { data } = await http.post(`/wishlist`, { pid });
  return data;
};

export const getSliders = async () => {
  const { data } = await http.get(`/sliders/primary`);
  return data;
};

export const getProfile = async () => {
  const { data } = await http.get(`/users/profile`);
  return data;
};

export const verifyOTP = async (payload) => {
  const { data } = await http.post(`/auth/verify-otp`, payload);
  return data;
};
export const resendOTP = async (payload) => {
  const { data } = await http.post(`/auth/resend-otp`, payload);
  return data;
};

export const getHeaderData = async () => {
  const { data } = await http.get(`/header`);
  return data;
};
export const getCart = async (ids) => {
  const { data } = await http.post(`/cart`, {
    products: ids
  });
  return data;
};
// admin
export const dashboardAnalytics = async () => {
  const { data } = await http.get(`/admin/dashboard-analytics`);
  return data;
};
export const vendorAnalytics = async () => {
  const { data } = await http.get(`/vendor/dashboard-analytics`);
  return data;
};

export const getNotification = async (page) => {
  const { data } = await http.get(`/admin/notifications?limit=${page}`, {});
  return data;
};

// brands
export const getBrands = async (page, search) => {
  const { data } = await http.get(`/admin/brands?search=${search}&page=${page}`);
  return data;
};
export const getBrandByAdmin = async (id) => {
  const { data } = await http.get(`/admin/brands/${id}`);
  return data;
};
export const getAllBrands = async () => {
  const { data } = await http.get(`/admin/all-brands`);
  return data;
};

export const addBrand = async (payload) => {
  const { data } = await http.post(`/admin/brands`, payload);
  return data;
};
export const updateBrand = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/brands/${currentSlug}`, payload);
  return data;
};
export const deleteBrand = async (slug) => {
  const { data } = await http.delete(`/admin/brands/${slug}`);
  return data;
};

// categories
export const getCategories = async (page, search) => {
  const { data } = await http.get(`/admin/categories?search=${search}&page=${page}`);
  return data;
};
export const getCategoryByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/categories/${slug}`);
  return data;
};
export const deleteCategory = async (slug) => {
  const { data } = await http.delete(`/admin/categories/${slug}`);
  return data;
};
export const addCategory = async (payload) => {
  const { data } = await http.post(`/admin/categories`, payload);
  return data;
};
export const updateCategory = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/categories/${currentSlug}`, payload);
  return data;
};
export const getAllCategories = async () => {
  const { data } = await http.get(`/all-categories`);
  return data;
};
export const getAllCategoriesByAdmin = async () => {
  const { data } = await http.get(`/admin/all-categories`);
  return data;
};

export const homeCategroies = async () => {
  const { data } = await http.get(`/home/categories`);
  return data;
};
export const getHomeShops = async () => {
  const { data } = await http.get(`/shops?limit=9`);
  return data;
};
export const getHomeCompaigns = async () => {
  const { data } = await http.get(`/compaigns`);
  return data;
};
export const getBestSellingProducts = async () => {
  const { data } = await http.get(`/home/products/best-selling`);
  return data;
};
export const getFeaturedProducts = async () => {
  const { data } = await http.get(`/home/products/featured`);
  return data;
};

export const getTopRatedProducts = async () => {
  const { data } = await http.get(`/home/products/top`);
  return data;
};
export const getHomeBrands = async () => {
  const { data } = await http.get(`/home/brands`);
  return data;
};
export const getUserBrands = async () => {
  const { data } = await http.get(`/brands`);
  return data;
};
// sub categories
export const getSubCategoryByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/subcategories/${slug}`);
  return data;
};
export const getSubCategories = async (params) => {
  const { data } = await http.get(`/admin/subcategories?${params}`);
  return data;
};
export const deleteSubCategory = async (slug) => {
  const { data } = await http.delete(`/admin/subcategories/${slug}`);
  return data;
};
export const addSubCategory = async (payload) => {
  const { data } = await http.post(`/admin/subcategories`, payload);
  return data;
};
export const updateSubCategory = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/subcategories/${currentSlug}`, payload);
  return data;
};

export const getAdminProducts = async (params) => {
  const { data: response } = await http.get(`/admin/products?${params}`);
  return response;
};

export const getAdminLowStockProducts = async (page) => {
  const { data: response } = await http.get(`/admin/low-stock-products?page=${page}`);
  return response;
};
export const getVendorLowStockProducts = async (page) => {
  const { data: response } = await http.get(`/vendor/low-stock-products?page=${page}`);
  return response;
};

export const getShopsByAdmin = async (page, search) => {
  const { data: response } = await http.get(`/admin/shops?search=${search}&page=${page}`);
  return response;
};

export const getVendorProducts = async (page, search) => {
  const { data: response } = await http.get(`/vendor/products?search=${search}&page=${page}`);
  return response;
};
export const deleteProduct = async (slug) => {
  const { data: response } = await http.delete(`/admin/products/${slug}`);
  return response;
};
export const deleteVendorProduct = async (slug) => {
  const { data: response } = await http.delete(`/vendor/products/${slug}`);
  return response;
};
export const newProduct = async (payload) => {
  const { data: response } = await http.post(`/admin/products`, payload);
  return response;
};
export const updateProduct = async ({ currentSlug, ...payload }) => {
  const { data: response } = await http.put(`/admin/products/${currentSlug}`, payload);
  return response;
};
export const createVendorProduct = async (payload) => {
  const { data: response } = await http.post(`/vendor/products`, payload);
  return response;
};
export const updateVendorProduct = async ({ currentSlug, ...payload }) => {
  const { data: response } = await http.put(`/vendor/products/${currentSlug}`, payload);
  return response;
};

// orders

export const getOrdersByAdmin = async (payload) => {
  const { data } = await http.get(`/admin/orders?${payload}`);
  return data;
};
export const getOrdersByVendor = async (payload) => {
  const { data } = await http.get(`/vendor/orders?${payload}`);
  return data;
};
export const getOrderByAdmin = async (id) => {
  const { data } = await http.get(`/admin/orders/${id}`);
  return data;
};
export const deleteOrder = async (id) => {
  const { data } = await http.delete(`/admin/orders/${id}`);
  return data;
};
export const updateOrderStatus = async ({ id, ...payload }) => {
  const { data } = await http.put(`/admin/orders/${id}`, payload);
  return data;
};

// users
export const getUsers = async (page, search) => {
  const { data: response } = await http.get(`/admin/users?search=${search}&page=${page}`);
  return response;
};
export const getUser = async (id) => {
  const { data: response } = await http.get(`/admin/users/${id}`);
  return response;
};
export const userStatus = async ({ id, ...payload }) => {
  const { data: response } = await http.put(`/admin/users/${id}`, payload);
  return response;
};
export const userDelete = async (id) => {
  const { data: response } = await http.delete(`/admin/users/${id}`);
  return response;
};

// coupon code

export const applyCouponCode = async (code) => {
  const { data: response } = await http.get(`/coupon-codes/${code}`);
  return response;
};
export const getCouponCodeByAdmin = async (id) => {
  const { data: response } = await http.get(`/admin/coupon-codes/${id}`);
  return response;
};

export const getCouponCodes = async (page, search) => {
  const { data: response } = await http.get(`/admin/coupon-codes?search=${search}&page=${page}`);
  return response;
};
export const addCouponCode = async (payload) => {
  const { data: response } = await http.post(`/admin/coupon-codes`, payload);
  return response;
};

export const updateCouponCode = async ({ currentId, ...others }) => {
  const { data: response } = await http.put(`/admin/coupon-codes/${currentId}`, others);
  return response;
};
export const deleteCouponCode = async (id) => {
  const { data: response } = await http.delete(`/admin/coupon-codes/${id}`);
  return response;
};

// user

export const updateUserRole = async (id) => {
  const { data: response } = await http.post(`/admin/users/role/${id}`);
  return response;
};
// newsletter
export const getNewsletter = async (page) => {
  const { data } = await http.get(`/admin/newsletter?page=${page}`);
  return data;
};

export const paymentIntents = async (amount, currency) => {
  const { data } = await http.post(`/payment-intents`, {
    amount,
    currency
  });
  return data;
};

// shop
export const addShop = async (payload) => {
  const { data } = await http.post(`/vendor/shops`, payload);
  return data;
};

export const updateShop = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/vendor/shops/${currentSlug}`, payload);

  return data;
};

// shops

export const getShopDetailsByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/shops/${slug}`);

  return data;
};
export const getShopDetailsByVendor = async () => {
  const { data } = await http.get(`/vendor/shop/stats`);

  return data;
};

export const addShopByUser = async (payload) => {
  const { data } = await http.post(`/shops`, {
    ...payload
  });

  return data;
};
export const getShopByUser = async () => {
  const { data } = await http.get(`/user/shop`);
  return data;
};
export const addAdminShop = async (payload) => {
  const { data } = await http.post(`/admin/shops`, payload);
  return data;
};

export const updateAdminShop = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/shops/${currentSlug}`, payload);

  return data;
};
export const getIncomeByShop = async (slug, page) => {
  const { data } = await http.get(`/admin/shops/${slug}/income?page=${page || 1}`);

  return data;
};
export const getIncomeByVendor = async (slug, page) => {
  const { data } = await http.get(`/vendor/shops/income?page=${page || 1}`);

  return data;
};

export const getIncomeDetailsByAdmin = async (pid, page) => {
  const { data } = await http.get(`/admin/payments/${pid}?page=${page || 1}`);
  return data;
};
export const editPayment = async ({ pid, ...payload }) => {
  const { data } = await http.put(`/admin/payments/${pid}`, { ...payload });
  return data;
};
export const createPayment = async ({ ...payload }) => {
  const { data } = await http.post(`/admin/payments`, { ...payload });
  return data;
};
// payouts
export const getPayoutsByAdmin = async (params) => {
  const { data } = await http.get(`/admin/payouts?${params}`);
  return data;
};

export const getAllShopsByAdmin = async () => {
  const { data } = await http.get(`/admin/all-shops`);
  return data;
};
export const getAllShopsByUser = async () => {
  const { data } = await http.get(`/shops`);
  return data;
};
export const getAllCategoriesByUser = async () => {
  const { data } = await http.get(`/all-categories`);
  return data;
};
export const getAdminCurrencies = async (page, search) => {
  const { data } = await http.get(`/admin/currencies?page=${page || 1}&search=${search || ''}`);
  return data;
};

export const addCurrency = async (payload) => {
  const { data } = await http.post(`/admin/currencies`, payload);
  return data;
};

export const updateCurrency = async ({ _id, ...others }) => {
  const { data } = await http.put(`/admin/currencies/${_id}`, others);
  return data;
};

export const getCurrencyByAdmin = async (cid) => {
  const { data } = await http.get(`/admin/currencies/${cid}`);
  return data;
};
export const getCurrencies = async () => {
  const { data } = await http.get(`/currencies`);
  return data;
};
export const getCategoryTitle = async (category) => {
  const { data } = await http.get(`/category-title/${category}`);
  return data;
};

export const getCategoryBySlug = async (category) => {
  const { data } = await http.get(`/categories/${category}`);
  return data;
};

export const getCategorySlugs = async () => {
  const { data } = await http.get(`/categories-slugs`);
  return data;
};
export const getShopSlugs = async () => {
  const { data } = await http.get('/shops-slugs');
  return data;
};
export const getShopBySlug = async (shop) => {
  const { data } = await http.get(`/shops/${shop}`);
  return data;
};
export const getShopTitle = async (shop) => {
  const { data } = await http.get(`/shop-title/${shop}`);
  return data;
};

export const getSubCategoryTitle = async (subcategory) => {
  const { data } = await http.get(`/subcategory-title/${subcategory}`);
  return data;
};
export const getSubCategoryBySlug = async (subcategory) => {
  const { data } = await http.get(`/subcategories/${subcategory}`);
  return data;
};

export const getSubCategorySlugs = async () => {
  const { data } = await http.get(`/subcategories-slugs`);
  return data;
};
export const getAdminCompaigns = async (page, search) => {
  const { data } = await http.get(`/admin/compaigns?page=${page || 1}&search=${search || ''}`);
  return data;
};
export const addCompaign = async (payload) => {
  const { data } = await http.post(`/admin/compaigns`, payload);
  return data;
};

export const updateCompaign = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/compaigns/${currentSlug}`, payload);
  return data;
};
export const getCompaignByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/compaigns/${slug}`);
  return data;
};
export const deleteCompaign = async (slug) => {
  const { data } = await http.delete(`/admin/compaigns/${slug}`);
  return data;
};
export const getCompaignSlugs = async () => {
  const { data } = await http.get('/compaigns-slugs');
  return data;
};
export const getCompaignBySlug = async (slug) => {
  const { data } = await http.get(`/compaigns/${slug}`);
  return data;
};
export const getCompaignTitle = async (slug) => {
  const { data } = await http.get(`/compaign-title/${slug}`);
  return data;
};

export const followShop = async (shopId) => {
  const { data } = await http.put(`/shops/${shopId}/follow`);
  return data;
};
