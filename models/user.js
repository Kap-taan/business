const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    customers: [
      {
        customer_name: {
          type: String,
          required: true
        }
      }
    ],
    products: [
      {
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ]
  }

});

module.exports = mongoose.model('User', userSchema);