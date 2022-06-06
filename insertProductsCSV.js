const { Pool } = require('pg');
const fs = require("fs");
const fastcsv = require("fast-csv");
const dotenv = require('dotenv');
const path = require('path')

// const inDevelopment = true;
// const environmentFilename = (inDevelopment? 'set-env-variables-dev.env' : 'set-env-variables.env');
// dotenv.config({ path: `${path.dirname(__dirname)}/${environmentFilename}` })
dotenv.config({ path: `${__dirname}/dev.env` })



let stream = fs.createReadStream("fakeData/realProducts.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });


    const query =
    "INSERT INTO products (name, description, stock, image_link, discount, price) VALUES ($1, $2, $3, $4, $5, $6)";

    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);