const { Pool } = require('pg');

const format = require('pg-format');




const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


const addOrderItems = (request, response) => {
  const values = request.body
  console.log(request.body)
  pool.query(format('INSERT INTO order_items (products_id, order_id, quantity) VALUES %L', values),[], (err, result)=>{
    response.status(200).json();
  });

}

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
  

const getAll = (request, response) => {
  const itemType = request.baseUrl.substring(5);
  pool.query(
    `SELECT *
    FROM ${itemType}
    ORDER BY id ASC
    `, (error, result) => {
    if (error) {
      throw error;
    }
    response.status(200).json(result.rows);
  })  
};

const createItem = (request, response, next) => {
  const itemType = request.baseUrl.substring(5);
  switch (itemType) {
    case 'products':
        pool.query (
          `INSERT INTO ${itemType}
          (name, price, description, stock, image_link)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
          `, [ request.body.name, request.body.price, request.body.description, request.body.stock, request.body.image_link], (error, result) => {
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
        (email, admin)
        VALUES ($1, $2)
        RETURNING id
        `, [ request.body.email, request.body.admin ], (error, result) => {
          if (error) {
            throw error
          }
          response.status(201).send(`${itemType} added with ID: ${result.rows[0].id}`)
        }
      )
      return;
    
    case 'register':
      pool.query (
        `INSERT INTO users
        (email, admin)
        VALUES ($1, $2)
        RETURNING id
        `, [ request.body.email, false ], (error, result) => {
          if (error) {
            throw error
          }
          // response.status(201).send(`User added with ID: ${result.rows[0].id}`)
        }
      )
      return next();

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
            response.status(201).send(`${itemType} added with ID: ${result.rows[0].id}`)
          }
        )
      return;

      case 'orders':
        pool.query (
          `INSERT INTO ${itemType}
          (user_email, total, status)
          VALUES ($1, $2, $3)
          RETURNING id
          `, [request.body.user_email, request.body.total, request.body.status], (error, result) => {
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

    default:
      return null;
  }
};


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

const getCartByEmail = (request, response) => {
  console.log(request.params)
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

const removeQuantityAddStock = (request, response) => {
  const productsId = parseInt(request.body.products_id)
  const quantity = parseInt(request.body.quantity)
  const user_email = request.body.user_email

  // somava sempre 1 ao stock qd fazia remove all
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

const getCartProducts = (request, response) => {
  const userEmail = request.params.email;

  
  pool.query(
    `SELECT products.id, products.name, price, description, quantity, image_link
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

const deleteProductByProductId = (request, response) => {
  const itemType = request.baseUrl.substring(5);
  const itemId = parseInt(request.params.id);
  pool.query(
    `DELETE FROM ${itemType}
    WHERE products_id = $1
    `, [itemId], (error, result) => {
      if(error) {
        throw error;
      }
      response.status(200).send(`ID: ${itemId} DELETED`);
    }
  )
}

const getTotalPrice = (request, response) => {
  const userEmail = request.params.email;
  
  pool.query(
    `SELECT SUM(quantity * price)
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


const updateItem = (request, response) => {
  const itemType = request.baseUrl.substring(5);
  const itemId = parseInt(request.params.id);

    switch (itemType) {
    case 'products':
        pool.query (
          `UPDATE ${itemType}
          SET name = $1, price = $2, description = $3, stock = $4, image_link = $5
          WHERE id = ${itemId}
          `, [ request.body.name, request.body.price, request.body.description, request.body.stock, request.body.image_link], (error, result) => {
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
        SET email = $1, admin = $2
        WHERE id = ${itemId}
        `, [ request.body.email, request.body.admin ], (error, result) => {
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
  deleteProductByProductId,
  removeStock,
  getTotalPrice,
  getItemTotal,
  addOrderItems,
  deleteAllFromCart,
  pool
};