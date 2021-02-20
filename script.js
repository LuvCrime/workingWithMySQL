const fs = require("fs");
const mysql = require("mysql");
const csv = require("fast-csv");

importCsvData2MySQL("file.csv");

function importCsvData2MySQL(filename) {
  let stream = fs.createReadStream("file.csv");
  let csvData = [];
  let csvStream = csv
    .parse()
    .on("data", function (data) {
      csvData.push(data);
    })

    .on("end", function () {

      csvData.shift();

      const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "rootpassword",
        database: "testdb",
      });

      function isIdExist(id) {
        return new Promise((resolve, reject) => {
          let query = `SELECT * FROM users where id = ${id}`;
          connection.query(query, null, (error, response) => {
            if (error) {
              reject(error);
            }
            if (response.length === 0) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      }

      connection.connect((error) => {
        if (error) {
          console.error(error);
        }
        csvData.forEach((user) => {
          let id = user[0];
          isIdExist(id).then((exists) => {
            if (exists) {
              let query = `UPDATE users SET name = '${user[1]}', val1 = '${user[2]}', val2 = '${user[3]}', val3 = '${user[4]}' WHERE id = ${id}`;
              connection.query(query, [csvData], (error, response) => {
                console.log(error || response);
                console.log("UPDATED", user);
              });
            } else {
              let query =
                "INSERT INTO users (id, name, val1, val2, val3) VALUES ?";
              connection.query(query, [[user]], (error, response) => {
                console.log(error || response);
              });
              console.log("SHOULD INSERT", user);
            }
          });
        });
      });
    });

  stream.pipe(csvStream);
}
