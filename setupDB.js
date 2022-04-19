const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/set-env-variables-dev.env` })

const { Client } = require('pg');
console.log("starting setupDB");
(async () => {
  
  const productsTable = `
  CREATE TABLE IF NOT EXISTS products (
    id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name            VARCHAR(50)     NOT NULL,
    price           MONEY           NOT NULL,
    description     VARCHAR(50)     NOT NULL,
    stock           INT            
  );
  `
  const usersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username        VARCHAR(50)     NOT NULL,
    password        VARCHAR(250)     NOT NULL,
    first_name      VARCHAR(50)     NOT NULL,
    last_name       VARCHAR(50)     NOT NULL,
    admin           BOOL            NOT NULL
  );
  `
  const cartsTable = `
  CREATE TABLE IF NOT EXISTS carts (
    id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id         INT             NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  `
  const cartItemsTable = `
  CREATE TABLE IF NOT EXISTS cart_items (
    id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    products_id     INT             NOT NULL,
    cart_id         INT             NOT NULL,
    quantity        INT,
    FOREIGN KEY (products_id) REFERENCES products(id),
    FOREIGN KEY (cart_id) REFERENCES carts(id)
  );
  `
  const ordersTable = `
  CREATE TABLE IF NOT EXISTS orders (
    id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id         INT             NOT NULL,
    total           MONEY           NOT NULL,
    status          VARCHAR(50)     NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  `
  const orderItemsTable = `
  CREATE TABLE IF NOT EXISTS order_items (
    id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    products_id     INT             NOT NULL,
    order_id        INT             NOT NULL,
    quantity        INT,
    FOREIGN KEY (products_id) REFERENCES products(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );
  `
  
  try {
    
    const db = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await db.connect();

    // Create tables on database
    await db.query(productsTable);
    await db.query(usersTable);
    await db.query(cartsTable);
    await db.query(cartItemsTable);
    await db.query(ordersTable);
    await db.query(orderItemsTable);

    await db.end();

  } catch(err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }
})();
console.log("finish setupDB");

/*
products table: tabela com os produtos todos disponiveis para venda
users table: tabela com todos os utilizadores registados
carts table: tabela com todos os carts (faz a coneçao entre os items de um cart e o utilizador)
cart items table: tabela com todos os productos k estão num cart
orders table: tabela com todas as orders (faz a coneçao entre as orders e o utilizador)
order items table: tabela com todos os items de uma order.
*/