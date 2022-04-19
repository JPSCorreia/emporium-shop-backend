const { Pool } = require('pg');
const { database } = require('pg/lib/defaults');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
  

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
          (name, price, description, stock)
          VALUES ($1, $2, $3, $4)
          RETURNING id
          `, [ request.body.name, request.body.price, request.body.description, request.body.stock], (error, result) => {
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
        (username, password, first_name, last_name, admin)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `, [ request.body.username, request.body.password, request.body.first_name, request.body.last_name, request.body.admin ], (error, result) => {
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
        (username, password, first_name, last_name, admin)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `, [ request.body.username, request.body.password, request.body.first_name, request.body.last_name, false ], (error, result) => {
          if (error) {
            throw error
          }
          // response.status(201).send(`User added with ID: ${result.rows[0].id}`)
        }
      )
      return next();

      case 'carts':
        pool.query (
          `INSERT INTO ${itemType}
          (user_id)
          VALUES ($1)
          RETURNING id
          `, [ request.body.user_id ], (error, result) => {
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
          (products_id, cart_id, quantity)
          VALUES ($1, $2, $3)
          RETURNING id
          `, [request.body.products_id, request.body.cart_id, request.body.quantity], (error, result) => {
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
          (user_id, total, status)
          VALUES ($1, $2, $3)
          RETURNING id
          `, [request.body.user_id, request.body.total, request.body.status], (error, result) => {
            if (error) {
              throw error;
            }
            response.status(201).send(`${itemType} added with ID: ${result.rows[0].id}`)
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


const updateItem = (request, response) => {
  const itemType = request.baseUrl.substring(5);
  const itemId = parseInt(request.params.id);

    switch (itemType) {
    case 'products':
        pool.query (
          `UPDATE ${itemType}
          SET name = $1, price = $2, description = $3, stock = $4
          WHERE id = ${itemId}
          `, [ request.body.name, request.body.price, request.body.description, request.body.stock], (error, result) => {
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
        SET username = $1, password = $2, first_name = $3, last_name = $4, admin = $5
        WHERE id = ${itemId}
        `, [ request.body.username, request.body.password, request.body.first_name, request.body.last_name, request.body.admin ], (error, result) => {
          if (error) {
            throw error
          }
          response.status(200).send(`${itemType} with ID: ${itemId} updated`)
        }
      )
      return;

      case 'carts':
        pool.query (
          `UPDATE ${itemType}
          SET user_id = $1
          WHERE id = ${itemId}
          `, [ request.body.user_id ], (error, result) => {
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
          SET products_id = $1, cart_id = $2, quantity = $3
          WHERE id = ${itemId}
          `, [request.body.products_id, request.body.cart_id, request.body.quantity], (error, result) => {
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
          SET user_id = $1, total = $2, status = $3
          WHERE id = ${itemId}
          `, [request.body.user_id, request.body.total, request.body.status], (error, result) => {
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
  pool
};