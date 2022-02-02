const express = require('express');
const router = express.Router();

const clientRoutes = require('../controllers/client');
const isAuthRoute = require('../middlewares/is-auth');

router.get('/new-entry', isAuthRoute, clientRoutes.getNewEntry);

router.post('/new-entry', isAuthRoute, clientRoutes.postNewEntry);

router.get('/dashboard', isAuthRoute, clientRoutes.getDashboard);

router.get('/new-product', isAuthRoute, clientRoutes.getNewProduct);

router.post('/new-product', isAuthRoute, clientRoutes.postNewProduct);

router.get('/new-customer', isAuthRoute, clientRoutes.getNewCustomer);

router.post('/new-customer', isAuthRoute, clientRoutes.postNewCustomer);

router.get('/customers', isAuthRoute, clientRoutes.getCustomers);

router.post('/customers', isAuthRoute, clientRoutes.postCustomers);

router.get('/update-price', isAuthRoute, clientRoutes.getUpdatePrice);

router.post('/update-price', isAuthRoute, clientRoutes.postUpdatePrice);

router.get('/payment', clientRoutes.getPayment);

router.post('/payment', clientRoutes.postPayment);

router.get('/bill', clientRoutes.getBills);

router.post('/bill', clientRoutes.postBills);

module.exports = router;