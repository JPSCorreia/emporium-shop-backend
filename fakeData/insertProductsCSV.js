const { Pool } = require('pg');
const fs = require("fs");
const fastcsv = require("fast-csv");
const dotenv = require('dotenv');
const path = require('path')

const inDevelopment = true;
const environmentFilename = (inDevelopment? 'set-env-variables-dev.env' : 'set-env-variables.env');
dotenv.config({ path: `${path.dirname(__dirname)}/${environmentFilename}` })

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
    "INSERT INTO products (name, price, description, stock, image_link) VALUES ($1, $2, $3, $4, $5)";

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