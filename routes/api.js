const express = require('express');

const AuthMiddleware = require('../app/middleware/auth-guard');
const { register, login, logout } = require('../app/controllers/Api/auth/authenticate.controller');
const { getAllProduct, searchProductByName, getProductById, getProductCategoryTenda, getProductCategoryAlatCamping, getProductCategoryLainnya, getProductCategoryRekomendasi } = require('../app/controllers/Api/product.controller');
const { getFavoritProductUser, setFavoritProductUser, deleteFavoritProductUser } = require('../app/controllers/Api/favorit.controller');
const { insertPurchased, getKeranjang, tambahSatuBarang, hapusSatuBarang, checkoutKeranjang, getCheckoutTotal, hapusSemuaBarang, getRiwayatPembelian, getRiwayatPembelianUser, editAttempPurchased } = require('../app/controllers/Api/userpurchased.controller');
// define route object 
const Route = express.Router();

// authenticate
Route.post('/register', register);
Route.post('/login', login);
Route.post('/logout', AuthMiddleware.checkAuth,logout);

// product API
Route.get('/products',AuthMiddleware.checkAuth, getAllProduct);
Route.get('/products/search',AuthMiddleware.checkAuth, searchProductByName);
Route.get('/products/:id', AuthMiddleware.checkAuth,getProductById);
Route.get('/products/category/tenda', AuthMiddleware.checkAuth,getProductCategoryTenda);
Route.get('/products/category/alat-camping', AuthMiddleware.checkAuth,getProductCategoryAlatCamping);
Route.get('/products/category/lainnya',AuthMiddleware.checkAuth, getProductCategoryLainnya);
Route.get('/products/category/rekomendasi', AuthMiddleware.checkAuth,getProductCategoryRekomendasi);

// favorit API 
Route.get('/favorit', AuthMiddleware.checkAuth, getFavoritProductUser);
Route.post('/favorit', AuthMiddleware.checkAuth, setFavoritProductUser);
Route.delete('/favorit', AuthMiddleware.checkAuth, deleteFavoritProductUser);

// user purchased API 
Route.post('/puchased/masuk-keranjang',  AuthMiddleware.checkAuth,insertPurchased);
Route.get('/purchased/keranjang',  AuthMiddleware.checkAuth,getKeranjang);
Route.post('/purchased/keranjang/:id/tambah',  AuthMiddleware.checkAuth,tambahSatuBarang);
Route.delete('/purchased/keranjang/:id/hapus',  AuthMiddleware.checkAuth,hapusSatuBarang);
Route.patch('/purchased/keranjang/checkout', AuthMiddleware.checkAuth, checkoutKeranjang);
Route.get('/purchased/keranjang/checkout/total',  AuthMiddleware.checkAuth,getCheckoutTotal);
Route.delete('/purchased/keranjang/hapus-semua/:id',  AuthMiddleware.checkAuth,hapusSemuaBarang);
Route.get('/purchased/riwayat',  AuthMiddleware.checkAuth,getRiwayatPembelian);
Route.get('/purchased/riwayat/pembelian',  AuthMiddleware.checkAuth,getRiwayatPembelianUser);
// admin user changed authentifikasi 
Route.patch('/admin/edit/attemp-purchased/:valueCheckout/:userId', editAttempPurchased);

module.exports = Route;

