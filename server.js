const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");

app.use("/", express.static(__dirname));

app.get("/data", function(req, res){
    res.set("Access-Control-Allow-Origin", "*");
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rootpassword',
        database: 'testdb'
      });

      connection.connect((error) => {
        if (error) {
          console.error(error);
        } else {
          let query =
            "SELECT * FROM users";
          connection.query(query, null, (error, response) => {
            console.log(error || response);
            res.send(response);
          });
        }
      });
});

app.listen(3000);