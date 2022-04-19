const Pool = require("pg").Pool;
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("test_retriever.csv");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// open the PostgreSQL connection
pool.connect((err, client, done) => {
  if (err) throw err;

  client.query("SELECT username, password, first_name, last_name, admin FROM users", (err, res) => {
    done();

    if (err) {
      console.log(err.stack);
    } else {
      const jsonData = JSON.parse(JSON.stringify(res.rows));
      console.log("jsonData", jsonData);

      fastcsv
        .write(jsonData, { headers: true })
        .on("finish", function() {
          console.log("Write to test_retriever.csv successfully!");
        })
        .pipe(ws);
    }
  });
});