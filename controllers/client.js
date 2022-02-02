const User = require("../models/user");
const Entry = require('../models/entry');

const mongoose = require('mongoose');

exports.getDashboard = (req, res, next) => {
  res.render("clients/dashboard.ejs", {
    path: "/dashboard",
    title: "Dashboard",
    user_name: req.user.name
  });
};

exports.getNewEntry = (req, res, next) => {
  const products = req.user.type.products;
  const customers = req.user.type.customers;

  console.log(products);

  res.render("clients/new-entry.ejs", {
    path: "/new-entry",
    title: "New Entry",
    products: products,
    customers: customers,
  });
};

exports.postNewEntry = (req, res, next) => {
  const givenDate = req.body.date;
  let date;
  if (!givenDate) {
    date = new Date();
  } else {
    date = new Date(givenDate);
  }

  const customer = req.body.customer;
  const product = req.body.productName;
  const rate = req.body.rate;
  const quantity = req.body.quantity;
  const slip = req.body.slip;
  const amount = req.body.amount;
  const customer_name = req.body.customerName;

  console.log(date);
  console.log(
    customer,
    product,
    rate,
    quantity,
    slip,
    amount,
    customer_name
  );

  const entry = new Entry ({
    product: product,
    rate: parseFloat(rate),
    quantity: parseFloat(quantity),
    amount: parseFloat(amount).toFixed(2),
    slip: slip,
    customer_id: customer,
    customer_name : customer_name,
    user_id: req.user._id,
    date: date
  });

  entry.save().then(result => {
    res.redirect('/new-entry');
  }).catch(err => {
    console.log(err);
  })


  // mongoose
  //   .connection(customer)
  //   .insert(entry)
  //   .then(() => {
  //     res.redirect("/new-entry");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  // res.redirect("/new-entry");
};

exports.getNewProduct = (req, res, next) => {
  res.render("clients/new-products.ejs", {
    path: "/new-product",
    title: "New Product",
  });
};

exports.postNewProduct = (req, res, next) => {
  const name = req.body.name;
  const price = parseFloat(req.body.price);

  User.findById(req.user._id)
    .then((user) => {
      const updatedProducts = [
        ...user.type.products,
        {
          name: name,
          price: price,
        },
      ];
      user.type.products = updatedProducts;
      return user.save();
    })
    .then((result) => {
      console.log("New Product is added");
      res.redirect("/new-product");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getNewCustomer = (req, res, next) => {
  res.render("clients/new-customer.ejs", {
    path: "/new-customer",
    title: "New Customer",
  });
};

exports.postNewCustomer = (req, res, next) => {
  const customer_name = req.body.name;

  User.findById(req.user._id)
    .then((user) => {
      let updatedCustomers = [
        ...user.type.customers,
        {
          customer_name: customer_name,
        },
      ];
      user.type.customers = updatedCustomers;
      return user.save();
    })
    .then((result) => {
      console.log("New Customer Added");
      res.redirect("/new-customer");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCustomers = (req, res, next) => {

  const customers = req.user.type.customers;

  res.render('clients/customer.ejs', {
    path: '/customers',
    title: 'Customers',
    customers: customers
  })

}

exports.postCustomers = (req, res, next) => {

  const customer_id = req.body.customer;
  const user_id = req.user._id.toString();

  const startDate = req.body.startingDate;
  const endDate = req.body.endingDate;

  // console.log(startingDate, endingDate);
  // console.log(new Date(startingDate), new Date(endingDate));

  // console.log(customer_id, 'i m here');
  // console.log(user_id, 'i m here');

  if(startDate !== '' && endDate !== '') {
  Entry.find({customer_id: customer_id, user_id: user_id,date : { 
    $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
    $lt: new Date(new Date(endDate).setHours(23, 59, 59))}}).sort({date: 1}).then(entries => {
    // console.log(entries);
    
      if(entries[0] === undefined) {
        console.log(req.user.type.customers);
        const customer = req.user.type.customers.filter(customeR => customeR._id.toString() === customer_id);
        entries = customer
      }
      res.render('clients/entry.ejs', {
        entries: entries,
        title: 'Entry',
        path: '/entry',
        startDate: startDate,
        endDate: endDate
      });
  }).catch(err => {
    console.log(err);
  })
} else {
  Entry.find({customer_id: customer_id, user_id: user_id}).sort({date: 1}).then(entries => {
      if(entries[0] === undefined) {
        console.log(req.user.type.customers);
        const customer = req.user.type.customers.filter(customeR => customeR._id.toString() === customer_id);
        entries = customer
      }
      res.render('clients/entry.ejs', {
        entries: entries,
        title: 'Entry',
        path: '/entry',
        startDate: null,
        endDate: null
      });
  }).catch(err => {
    console.log(err);
  })
}
}

exports.getUpdatePrice = (req, res, next) => {

  const products = req.user.type.products;

  res.render('clients/update-price.ejs', {
    path: '/update-price',
    title: 'Update Price',
    products: products
  })

}

exports.postUpdatePrice = (req, res, next) => {

  const product_id = req.body.products;
  const price = req.body.price;

  console.log(product_id, price);

  const productIndex = req.user.type.products.findIndex(cp => {
    return cp._id.toString() === product_id;
  });

  req.user.type.products[productIndex].price = price;
  req.user.save().then(result => {
    res.redirect('/update-price');
  }).catch(err => {
    console.log(err);
  })

  // User.findById(req.user._id).then(user => {
  //   user.
  // }).catch(err => {
  //   console.log(err);
  // })
}

exports.getPayment = (req, res, next) => {

  const customers = req.user.type.customers;
  res.render('clients/payment.ejs', {
    path: '/payment',
    title: 'Payment',
    customers: customers
  });

}

exports.postPayment = (req, res, next) => {

  const givenDate = req.body.date;
  let date;
  if (!givenDate) {
    date = new Date();
  } else {
    date = new Date(givenDate);
  }

  const customer_id = req.body.customer;
  const amount = -1 * (req.body.amount);
  const user_id = req.user._id;
  const customerName = req.body.customerName;

  console.log(customer_id, amount, customerName);
  const entry = new Entry({
    customer_id: customer_id,
    user_id: user_id,
    amount: amount,
    customer_name : customerName,
    date: date
  });
  entry.save().then(result => {
    res.redirect('payment');
  }).catch(err => {
    console.log(err);
  })
  
  // res.redirect('/payment');

}

exports.getBills = (req, res, next) => {

  const customers = req.user.type.customers;

  res.render('clients/bill.ejs', {
    path: '/customers',
    title: 'Customers',
    customers: customers
  })

}

exports.postBills = (req, res, next) => {

  const customer_id = req.body.customer;
  const user_id = req.user._id.toString();
  const user_name = req.user.name;

  const startDate = req.body.startingDate;
  const endDate = req.body.endingDate;

  // console.log(startingDate, endingDate);
  // console.log(new Date(startingDate), new Date(endingDate));

  // console.log(customer_id, 'i m here');
  // console.log(user_id, 'i m here');

  if(startDate !== '' && endDate !== '') {
  Entry.find({customer_id: customer_id, user_id: user_id,date : { 
    $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
    $lt: new Date(new Date(endDate).setHours(23, 59, 59))}}).sort({date: 1}).then(entries => {
    // console.log(entries);
    
      if(entries[0] === undefined) {
        console.log(req.user.type.customers);
        const customer = req.user.type.customers.filter(customeR => customeR._id.toString() === customer_id);
        entries = customer
      }
      res.render('clients/print-bill.ejs', {
        entries: entries,
        title: 'Entry',
        path: '/entry',
        startDate: startDate,
        endDate: endDate,
        user_name : user_name
      });
  }).catch(err => {
    console.log(err);
  })
} else {
  Entry.find({customer_id: customer_id, user_id: user_id}).sort({date: 1}).then(entries => {
      if(entries[0] === undefined) {
        console.log(req.user.type.customers);
        const customer = req.user.type.customers.filter(customeR => customeR._id.toString() === customer_id);
        entries = customer
      }
      res.render('clients/print-bill.ejs', {
        entries: entries,
        title: 'Entry',
        path: '/entry',
        startDate: null,
        endDate: null,
        user_name : user_name
      });
  }).catch(err => {
    console.log(err);
  })
}
}