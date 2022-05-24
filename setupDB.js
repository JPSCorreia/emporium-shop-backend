const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/dev.env` })

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
    discount        INT,
    constraint stock_notnegative check (stock >= 0)  
  );
  `
  const usersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id                INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email             VARCHAR(250)    UNIQUE NOT NULL,
    admin             BOOL            NOT NULL,
    created_timestamp TIMESTAMP       NOT NULL DEFAULT now(),
    image_link        VARCHAR(250)    NOT NULL
  );
  `
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
    // node-postgres Client configuration (configures database credentials)
    const db = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // open connection, try and create tables on database and then close connection.
    await db.connect();
    await db.query(productsTable);
    await db.query(usersTable);
    await db.query(cartItemsTable);
    await db.query(ordersTable);
    await db.query(orderItemsTable);
    await db.end();

  } catch(err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }
})();
console.log("finish setupDB");