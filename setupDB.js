const dotenv = require('dotenv');
const inDevelopment = true;
const environmentFilename = (inDevelopment? 'set-env-variables-dev.env' : 'set-env-variables.env');
dotenv.config({ path: `${__dirname}/${environmentFilename}` })

const { Client } = require('pg');
console.log("starting setupDB");
(async () => {
  
  const productsTable = `
  CREATE TABLE IF NOT EXISTS products (
    id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name            VARCHAR(250)     NOT NULL,
    price           INT           NOT NULL,
    description     VARCHAR(250)     NOT NULL,
    stock           INT,
    image_link      VARCHAR(250)    NOT NULL,
    constraint stock_notnegative check (stock >= 0)  
  );
  `
  const usersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email        VARCHAR(250)     UNIQUE NOT NULL,
    admin           BOOL            NOT NULL
  );
  `
  // const cartsTable = `
  // CREATE TABLE IF NOT EXISTS carts (
  //   id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  //   user_id         INT             NOT NULL,
  //   FOREIGN KEY (user_id) REFERENCES users(id)
  // );
  // `

  const cartItemsTable = `
  CREATE TABLE IF NOT EXISTS cart_items (
    id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    products_id     INT             NOT NULL,
    user_email      VARCHAR(250)    NOT NULL,
    quantity        INT,
    FOREIGN KEY (products_id) REFERENCES products(id),
    FOREIGN KEY (user_email) REFERENCES users(email),
    constraint quantity_notnegative check (quantity >= 0) 
  );
  `
  const ordersTable = `
  CREATE TABLE IF NOT EXISTS orders (
    id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_email      VARCHAR(250)    NOT NULL,
    total           INT           NOT NULL,
    status          VARCHAR(250)     NOT NULL,
    FOREIGN KEY (user_email) REFERENCES users(email)
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
    // await db.query(cartsTable);
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