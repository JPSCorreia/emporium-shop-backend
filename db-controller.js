const { Pool } = require('pg');
const format = require('pg-format');


// node-postgres Pool configuration (configures database credentials)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


// PG queries
// get user_name from users by id.
const getUsernameById = (request, response) => {
  pool.query(
    `SELECT user_name
    FROM users
    WHERE id = $1
    `, [request.user.id], (error, result) => {
      if (error) {
        throw error;
      }
    response.json(user.rows[0])
  })
};


// get all rows from a table.
const getAllOrderItems = (request, response) => {
  const id = request.params.id;
  pool.query(
    `SELECT *
    FROM products
    JOIN order_items
    ON order_items.products_id = products.id
    WHERE order_items.order_id = $1
    `, [id], (error, result) => {
    if (error) {
      throw error;
    }
    response.status(200).json(result.rows);
  })  
};


const getNumberOfOrders = (request, response) => {
  const userEmail = request.params.email;
  pool.query(
    `SELECT count(*)
    FROM orders
    WHERE user_email = $1
    `, [userEmail], (error, result) => {
      if (error) {
        throw error;
      }
    response.json(result.rows[0])
  })
};

const getMonthAndYear = (request, response) => {
  const userEmail = request.params.email;
  pool.query(
    `SELECT
    TO_CHAR(
      TO_DATE (
        EXTRACT(MONTH FROM created_timestamp)::text, 'MM'), 'Month'
      ) AS "month",
      EXTRACT(YEAR FROM created_timestamp) AS "year"
      FROM users
      WHERE email = $1
      `, [userEmail], (error, result) => {
      if (error) {
        throw error;
      }
    response.json(result.rows[0])
  })
}

const getOrderMonthAndYear = (request, response) => {
  const userEmail = request.params.email;
  pool.query(
    `SELECT
    TO_CHAR(
      TO_DATE (
        EXTRACT(MONTH FROM created_timestamp)::text, 'MM'), 'Month'
      ) AS "month",
      EXTRACT(YEAR FROM created_timestamp) AS "year"
      FROM orders
      WHERE user_email = $1
      `, [userEmail], (error, result) => {
      if (error) {
        throw error;
      }
    response.json(result.rows[0])
  })
}

// insert all cart items into order_items table.
const addOrderItems = (request, response) => {
  const values = request.body
  pool.query(format('INSERT INTO order_items (products_id, order_id, quantity, discount) VALUES %L RETURNING order_id', values),[], (err, result)=>{
    response.status(200).json();
  });
}

// remove all cart_items belonging to a single user.
const deleteAllFromCart = (request, response) => {
  const userEmail = request.params.email;
  pool.query(
    `DELETE FROM cart_items
    WHERE user_email = $1
    `, [userEmail], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).send('removed cart items');
  })
};
  
// get all rows from a table.
const getAll = (request, response) => {
  const itemType = request.baseUrl.substring(5);
  pool.query(
    `SELECT *
    FROM $1
    ORDER BY id ASC
    `, [itemType], (error, result) => {
    if (error) {
      throw error;
    }
    response.status(200).json(result.rows);
  })  
};

// get all rows from a table.
const getAllUsers = (request, response) => {
  pool.query(
    `SELECT *
    FROM users
    ORDER BY id ASC
    `, (error, result) => {
    if (error) {
      throw error;
    }
    response.status(200).json(result.rows);
  })  
};

// get all orders by email
const getAllOrders = (request, response) => {
  const email = request.params.email
  pool.query(
    `SELECT *
    FROM orders
    WHERE user_email = $1
    ORDER BY id DESC
    `, [email], (error, result) => {
    if (error) {
      throw error;
    }
    response.status(200).json(result.rows);
  })  
};


// get all products from a page.
const getProductPage = (request, response) => {
  const page = request.params.page
  if (page > 0) {
    pool.query(
      `SELECT *
      FROM products
      ORDER BY id ASC
      LIMIT 9 OFFSET ((9*$1)-9)
      `, [page], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    })  
  }
  if (page == 0) {
    response.status(404).send()
  }
};


// get the 3 most discounted products.
const getMostDiscountedProducts = (request, response) => {
  const number = parseInt(request.params.number);
  pool.query(
    `SELECT *
    FROM products
    ORDER BY discount DESC
    LIMIT $1
    `, [number], (error, result) => {
    if (error) {
      throw error;
    }
    response.status(200).json(result.rows);
  })  
};






// get search results.
const getSearchResults = (request, response) => {

  // putting search string into an array and capitalizing first letter
  const searchParam = request.body.search
  const searchParamCap = searchParam.split(" ")

  // creating search query
  let searchString = ''
  searchParamCap.forEach((word, index) => {
    if (index === 0) {
      searchString = searchString + `SELECT * FROM products WHERE LOWER(name) LIKE '%${word}%' OR LOWER(description) LIKE '%${word}%'`
    } else {
      searchString = searchString + ` UNION SELECT * FROM products WHERE LOWER(name) LIKE '%${word}%' OR LOWER(description) LIKE '%${word}%'`
    }
  })
  pool.query(searchString, (error, result) => {
    if (error) {
      throw error;
    }
    response.status(200).json(result.rows);
  })  
};


// get all rows from a table.
const getNumberOfProducts = (request, response) => {
  pool.query(
    `SELECT COUNT (*)
    FROM products
    `, (error, result) => {
    if (error) {
      throw error;
    }
    response.status(200).json(result.rows[0].count);
  })  
};



// insert new row in a table.
const createItem = (request, response, next) => {
  const itemType = request.baseUrl.substring(5);
  switch (itemType) {
    case 'products':
        pool.query (
          `INSERT INTO $1
          (name, price, description, stock, image_link, discount)
          VALUES ($2, $3, $4, $5, $6)
          RETURNING id
          `, [ itemType, request.body.name, request.body.price, request.body.description, request.body.stock, request.body.image_link, request.body.discount], (error, result) => {
            if (error) {
              throw error
            }
            response.status(201).send(`${itemType} added with ID: ${result.rows[0].id}`)
          }
        )
    return;

    case 'users':
      pool.query (
        `INSERT INTO ${itemType}
        (email, admin, image_link)
        VALUES ($1, $2, $3)
        RETURNING id
        `, [ request.body.email, request.body.admin, request.body.image_link ], (error, result) => {
          if (error) {
            throw error
          }
          response.status(201).send(`${itemType} added with ID: ${result.rows[0].id}`)
        }
      )
      return;
    
      case 'cart_items':
        pool.query (
          `INSERT INTO ${itemType}
          (products_id, user_email, quantity)
          VALUES ($1, $2, $3)
          RETURNING id
          `, [request.body.products_id, request.body.user_email, request.body.quantity], (error, result) => {
            if (error) {
              throw error;
            }
            response.status(201).send(`${result.rows[0].id}`)
          }
        )
      return;


      case 'reviews':
        console.log(request.body)
        pool.query (
          `INSERT INTO ${itemType}
          (products_id, user_email, full_name, comment, rating, image_link)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
          `, [request.body.data.products_id, 
              request.body.data.user_email, 
              request.body.data.full_name,
              request.body.data.comment,
              request.body.data.rating,
              request.body.data.image_link,
            ], (error, result) => {
            if (error) {
              throw error;
            }
            response.status(201).send(`${result.rows[0].id}`)
          }
        )
      return;

      case 'orders':
        pool.query (
          `INSERT INTO ${itemType}
          (user_email, total, status, full_name, street_address, city, postcode, phone_number, country)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
          `, [
              request.body.user_email, 
              request.body.total, 
              request.body.status,
              request.body.full_name,
              request.body.street_address,
              request.body.city,
              request.body.postcode,
              request.body.phone_number,
              request.body.country,
            ], (error, result) => {
            if (error) {
              throw error;
            }
            response.status(201).send(`${result.rows[0].id}`)
          }
        )
      return;

      case 'order_items':
        pool.query (
          `INSERT INTO ${itemType}
          (products_id, order_id, quantity)
          VALUES ($1, $2, $3)
          RETURNING id
          `, [request.body.products_id, request.body.order_id, request.body.quantity], (error, result) => {
            if (error) {
              throw error;
            }
            response.status(201).send(`${itemType} added with ID: ${result.rows[0].id}`)
          }
        )
      return;

      case 'addresses':
        pool.query (
          `INSERT INTO ${itemType}
          (user_email, full_name, street_address, city, postcode, phone_number, country)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
          `,  [ request.body.data.user_email, 
                request.body.data.full_name, 
                request.body.data.street_address,
                request.body.data.city, 
                request.body.data.postcode, 
                request.body.data.phone_number,
                request.body.data.country,
              ], (error, result) => {
            if (error) {
              throw error
            }
            response.status(201).send(`${itemType} added with ID: ${result.rows[0].id}`)
          }
        )
        return;

    default:
      return null;
  }
};

// get row from a table by id.
const getItemById = (request, response) => {
  const itemType = request.baseUrl.substring(5);
  const itemId = parseInt(request.params.id);
  pool.query(
    `SELECT *
    FROM ${itemType}
    WHERE id = $1
    `, [itemId], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}

// get row from a table by id.
const getReviewByUserAndId = (request, response) => {
  const id = parseInt(request.params.id);
  const email = request.params.user_email
  pool.query(
    `SELECT *
    FROM reviews
    WHERE products_id = $1 AND user_email = $2
    `, [id, email], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows[0]);
    }
  )
}

// get row from a table by id.
const getReviewByProductId = (request, response) => {
  const itemId = parseInt(request.params.id);
  pool.query(
    `SELECT *
    FROM reviews
    WHERE products_id = $1
    `, [itemId], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}

// get order reviews by order id.
const getOrderReviewsByOrderId = (request, response) => {
  const orderId = parseInt(request.params.id);
  const email = request.params.user_email
  pool.query(
    `SELECT reviews.id, reviews.products_id, reviews.user_email, reviews.full_name, reviews.comment, reviews.rating, reviews.image_link
    FROM reviews
    JOIN order_items
    ON reviews.products_id = order_items.products_id
    WHERE order_id = $1 AND user_email = $2
    `, [orderId, email], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}

// get row from users table by email.
const getUserByUsername = (request, response) => {
  const userUsername = request.params.username;
  pool.query(
    `SELECT *
    FROM users
    WHERE email = $1
    `, [userUsername], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}

// get cart item by email and product id.
const getCartByEmail = (request, response) => {
  const authenticatedEmail = request.params.email;
  const id = parseInt(request.params.products_id);
  pool.query(
    `SELECT *
    FROM cart_items
    WHERE user_email = $1 AND products_id = $2
    `, [authenticatedEmail, id], (error, result) => {
      if (error) {
        throw error;
      }
      
      response.status(200).json(result.rows);
    }
  )
}

// get all cart items by email.
const getCart = (request, response) => {
  const userEmail = request.params.email; 
  pool.query(
    `SELECT *
    FROM cart_items
    WHERE user_email = $1 
    `, [userEmail], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}


// get all addresses by email.
const getAddresses = (request, response) => {
  const userEmail = request.params.email; 
  pool.query(
    `SELECT *
    FROM addresses
    WHERE user_email = $1 
    `, [userEmail], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}


// add quantity to product in cart_items and remove from stock in products.
const removeStockAddQuantity = (request, response) => {
  const productsId = parseInt(request.body.products_id)
  const quantity = parseInt(request.body.quantity)
  const user_email = request.body.user_email
  pool.query(`
    WITH t AS (
      UPDATE products
      SET stock = (stock - $1)
      WHERE products.id = $2
    )
    UPDATE cart_items
    SET quantity = (quantity + $1)
    WHERE user_email = $3 AND products_id = $2
  `, [quantity, productsId, user_email], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}

// remove stock from product by product id.
const removeStock = (request, response) => {
  const productsId = parseInt(request.body.products_id)
  const quantity = parseInt(request.body.quantity)
  pool.query(`
      UPDATE products
      SET stock = (stock - $1)
      WHERE products.id = $2
  `, [quantity, productsId], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}

// add stock to product by product id.
const addStock = (request, response) => {
  const productsId = parseInt(request.body.products_id)
  const quantity = parseInt(request.body.quantity)
  pool.query(`
      UPDATE products
      SET stock = (stock + $1)
      WHERE products.id = $2
  `, [quantity, productsId], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}


// remove quantity from cart item by product id.
const removeQuantity = (request, response) => {
  const productsId = parseInt(request.body.products_id)
  const quantity = parseInt(request.body.quantity)
  const email = request.body.user_email
  pool.query(`
    UPDATE cart_items
    SET quantity = (quantity - $1)
    WHERE user_email = $3 AND products_id = $2
  `, [quantity, productsId, email], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}

// add quantity to cart item by product id.
const addQuantity = (request, response) => {
  const productsId = parseInt(request.body.products_id)
  const quantity = parseInt(request.body.quantity)
  const email = request.body.user_email
  pool.query(`
    UPDATE cart_items
    SET quantity = (quantity + $1)
    WHERE user_email = $3 AND products_id = $2
  `, [quantity, productsId, email], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}


// add stock to products and remove quantity from cart_items.
const removeQuantityAddStock = (request, response) => {
  const productsId = parseInt(request.body.products_id)
  const quantity = parseInt(request.body.quantity)
  const user_email = request.body.user_email

  pool.query(`
    WITH t AS (
      UPDATE products
      SET stock = (stock + $1)
      WHERE products.id = $2
    )
    UPDATE cart_items
    SET quantity = (quantity - $1)
    WHERE user_email = $3 AND products_id = $2
  `, [quantity, productsId, user_email], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}

// get product details for all items in cart_items.
const getCartProducts = (request, response) => {
  const userEmail = request.params.email;
  pool.query(
    `SELECT products.id, products.name, price, description, quantity, image_link, discount
    FROM products
    JOIN cart_items
    ON cart_items.products_id = products.id
    WHERE cart_items.user_email = $1
    ORDER BY products.id
    `, [userEmail], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}

// delete row from table by id.
const deleteItem = (request, response) => {
  const itemType = request.baseUrl.substring(5);
  const itemId = parseInt(request.params.id);
  pool.query(
    `DELETE FROM ${itemType}
    WHERE id = $1
    `, [itemId], (error, result) => {
      if(error) {
        throw error;
      }
      response.status(200).send(`ID: ${itemId} DELETED`);
    }
  )
}

// delete row from table by products_id
const deleteCartItem = (request, response) => {
  const products_id = parseInt(request.params.products_id);
  const user_email = request.params.user_email;
  pool.query(
    `DELETE FROM cart_items
    WHERE products_id = $1 AND user_email = $2
    RETURNING id, products_id, user_email, quantity
    `, [products_id, user_email], (error, result) => {
      if(error) {
        throw error;
      }
      response.status(200).send(result.rows);
    }
  )
}

// delete row from addresses table by email and products_id
const deleteAddress = (request, response) => {
  const id = parseInt(request.params.id);
  const user_email = request.params.user_email;
  pool.query(
    `DELETE FROM addresses
    WHERE id = $1 AND user_email = $2
    RETURNING id, user_email
    `, [id, user_email], (error, result) => {
      if(error) {
        throw error;
      }
      response.status(200).send(result.rows);
    }
  )
}


// get sum of the price of all items in cart_items belonging to a single user.
const getTotalPrice = (request, response) => {
  const userEmail = request.params.email;
  pool.query(
    `SELECT SUM((price - (price * discount/100)) * quantity)
    FROM cart_items
    JOIN products
    ON cart_items.products_id = products.id
    WHERE user_email = $1;
    `, [userEmail], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}

// get sum of the total quantity of items in cart_items belonging to a single user.
const getItemTotal = (request, response) => {
  const userEmail = request.params.email;
  pool.query(
    `SELECT SUM(quantity)
    FROM cart_items
    WHERE user_email = $1;
    `, [userEmail], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(200).json(result.rows);
    }
  )
}

// update row from a table by id.
const updateItem = (request, response) => {
  const itemType = request.baseUrl.substring(5);
  const itemId = parseInt(request.params.id);
    switch (itemType) {
    case 'products':
        pool.query (
          `UPDATE ${itemType}
          SET name = $1, price = $2, description = $3, stock = $4, image_link = $5, discount = $6
          WHERE id = ${itemId}
          `, [ request.body.name, request.body.price, request.body.description, request.body.stock, request.body.image_link, request.body.discount], (error, result) => {
            if (error) {
              throw error
            }
            response.status(200).send(`${itemType} with ID: ${itemId} updated`)
          }
        )
    return;

    case 'users':
      pool.query (
        `UPDATE ${itemType}
        SET email = $1, admin = $2, image_link = $3
        WHERE id = ${itemId}
        `, [ request.body.email, request.body.admin, request.body.image_link ], (error, result) => {
          if (error) {
            throw error
          }
          response.status(200).send(`${itemType} with ID: ${itemId} updated`)
        }
      )
      return;

      case 'cart_items':
        pool.query (
          `UPDATE ${itemType}
          SET products_id = $1, user_id = $2, quantity = $3
          WHERE id = ${itemId}
          `, [request.body.products_id, request.body.user_id, request.body.quantity], (error, result) => {
            if (error) {
              throw error;
            }
            response.status(200).send(`${itemType} with ID: ${itemId} updated`)
          }
        )
      return;

      case 'orders':
        pool.query (
          `UPDATE ${itemType}
          SET user_email = $1, total = $2, status = $3
          WHERE id = ${itemId}
          `, [request.body.user_email, request.body.total, request.body.status], (error, result) => {
            if (error) {
              throw error;
            }
            response.status(200).send(`${itemType} with ID: ${itemId} updated`)
          }
        )
      return;

      case 'order_items':
        pool.query (
          `UPDATE ${itemType}
          SET products_id = $1, order_id = $2, quantity = $3
          WHERE id = ${itemId}
          `, [request.body.products_id, request.body.order_id, request.body.quantity], (error, result) => {
            if (error) {
              throw error;
            }
            response.status(200).send(`${itemType} with ID: ${itemId} updated`)
          }
        )
      return;

      case 'addresses':
        pool.query (
          `UPDATE ${itemType}
          SET full_name = $1, street_address = $2, city = $3, postcode = $4, phone_number = $5, country = $6
          WHERE id = ${itemId}
          `, [request.body.data.full_name, 
              request.body.data.street_address, 
              request.body.data.city,
              request.body.data.postcode, 
              request.body.data.phone_number, 
              request.body.data.country,
            ], (error, result) => {
            if (error) {
              throw error;
            }
            response.status(200).send(`${itemType} with ID: ${itemId} updated`)
          }
        )
      return;

      case 'reviews':
        pool.query (
          `UPDATE ${itemType}
          SET full_name = $1, comment = $2, rating = $3, image_link = $4
          WHERE id = ${itemId}
          `, [request.body.data.full_name, request.body.data.comment, request.body.data.rating, request.body.data.image_link], (error, result) => {
            if (error) {
              throw error;
            }
            response.status(200).send(`${itemType} with ID: ${itemId} updated`)
          }
        )
      return;

    default:
      return null;
  }
}


module.exports = {
  getAll,
  createItem,
  getItemById,
  deleteItem,
  updateItem,
  getUserByUsername,
  getCartByEmail,
  removeStockAddQuantity,
  getCart,
  getCartProducts,
  removeQuantityAddStock,
  getTotalPrice,
  getItemTotal,
  addOrderItems,
  deleteAllFromCart,
  getUsernameById,
  getMonthAndYear,
  getNumberOfOrders,
  getAllOrders,
  getAllUsers,
  getAllOrderItems,
  addStock,
  removeStock,
  removeQuantity,
  addQuantity,
  deleteCartItem,
  getOrderMonthAndYear,
  getAddresses,
  deleteAddress,
  getProductPage,
  getNumberOfProducts,
  getSearchResults,
  getReviewByProductId,
  getReviewByUserAndId,
  getOrderReviewsByOrderId,
  getMostDiscountedProducts,
  pool
};