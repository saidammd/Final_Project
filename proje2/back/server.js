const express = require("express");
const mysql = require('mysql2');
const cors = require("cors");
const bcrypt = require("bcrypt");
// const randomString = require("../randomString");
const randomString = () => `${Math.floor(Math.random() * 10000)}${Date.now()}`;

const bodyParser = require("body-parser");
// const randomString = require('./randomString');

const path = require("path"); // Required for serving static files
const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'saida123',
  database: `projectcoins`,
  waitForConnections: true
});
db.connect((err) => {
  console.log(err);
  if (err) return err;
});

app.get("/coins", (req, res) => {
  const GET_COINS_FROM_DB = `SELECT * FROM coins`;
  db.query(GET_COINS_FROM_DB, (err, results) => {
    if (err) res.sendStatus(500);
    res.send(results);
  });
});

app.get("/coinByType", (req, res) => {
  const { type } = req.query;
  const GET_BY_TYPE = `SELECT * FROM coins WHERE type='${type}'`;

  db.query(GET_BY_TYPE, (err, results) => {
    console.log(err, results);
    if (err) res.sendStatus(500);
    res.send(results);
  });
});

app.get("/coins/:id", (req, res) => {
  const { id } = req.params; // Получаем id монеты из параметров маршрута

  if (!id) {
    return res.status(400).send("ID монеты не указан");
  }

  // Используем подготовленное выражение для безопасности
  const GET_BY_ID = `SELECT * FROM coins WHERE id = ?`;

  // Выполняем запрос с подготовленным выражением
  db.query(GET_BY_ID, [id], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.sendStatus(500); // Внутренняя ошибка сервера
    }

    // Если результат пустой, возвращаем 404
    if (results.length === 0) {
      return res.status(404).send("Монета не найдена");
    }

    // Возвращаем результат
    res.send(results[0]); // Отправляем только первую найденную монету (если id уникальный)
  });
});

app.post("/registration", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required: name, email, password" });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const User = {
    name: name,
    email: email,
    salt: salt,
    hash: hash,
    role: "User",
  };

  const ADD_NEW_USER = `INSERT INTO users (name, email, salt, hash, role) VALUES('${User.name}', '${User.email}', '${User.salt}', '${User.hash}', '${User.role}')`;

  db.query("SELECT * FROM users WHERE email = ?", [User.email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    db.query(ADD_NEW_USER, (err1, results1) => {
      if (err1) {
        console.error(err1);
        return res.status(500).json({ message: "Failed to register user" });
      }

      res.status(201).json({ message: "User registered successfully" });
    });
  });
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const newToken = randomString();
  const FIND_USER_IN_DB = `SELECT email, hash, salt, role, name FROM users WHERE email = ?`;

  db.query(FIND_USER_IN_DB, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length > 0) {
      const user = results[0];
      const isPasswordValid = bcrypt.compareSync(password, user.hash);

      if (isPasswordValid) {
        const GIVE_TOKEN = `UPDATE users SET token = ? WHERE email = ?`;
        db.query(GIVE_TOKEN, [newToken, email], (err1) => {
          if (err1) {
            console.error(err1);
            return res.status(500).json({ message: "Failed to update token" });
          }
          console.log(user, 'user')
          return res.status(200).json({
            message: "Login successful",
            token: newToken,
            email: user.email,
            role: user.role,
            name: user.name,
          });
        });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});



app.get("/coinsSearch", (req, res) => {
  const { name, country, composition, priceFrom, priceTo, yearFrom, yearTo, type } = req.query;

  const conditions = [];
  const values = [];

  // Формируем условия
  if (name && name !== "undefined") {
    conditions.push("(name LIKE ? OR description LIKE ?)");
    values.push(`%${name}%`, `%${name}%`);
  }
  if (country) {
    conditions.push("country = ?");
    values.push(country);
  }
  if (composition) {
    conditions.push("composition = ?");
    values.push(composition);
  }
  if (priceFrom) {
    conditions.push("price >= ?");
    values.push(priceFrom);
  }
  if (priceTo) {
    conditions.push("price <= ?");
    values.push(priceTo);
  }
  if (yearFrom) {
    conditions.push("date >= ?");
    values.push(yearFrom);
  }
  if (yearTo) {
    conditions.push("date <= ?");
    values.push(yearTo);
  }
  if (type) {
    conditions.push("type = ?");
    values.push(type);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  let orderClause = "";

  // Добавляем сортировку по имени, если задано
  if (name && name !== "undefined") {
    orderClause = `ORDER BY CASE 
      WHEN name LIKE ? THEN 1 
      WHEN name LIKE ? THEN 3 
      ELSE 2 END`;
    values.push(`${name}%`, `%${name}`);
  }

  const SEARCH_SELECT = `SELECT * FROM coins ${whereClause} ${orderClause}`;

  // Логируем запрос для отладки
  console.log("SQL Query:", SEARCH_SELECT);
  console.log("Query Values:", values);

  // Выполняем запрос
  db.query(SEARCH_SELECT, values, (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.sendStatus(500); // Внутренняя ошибка сервера
    }
    res.send(results); // Возвращаем результаты
  });
});


app.get("/checkToken", (req, res) => {
  const { login } = req.query;
  const FIND_USER = `SELECT token,role FROM users WHERE username='${login}'`;
  db.query(FIND_USER, (err, results) => {
    if (err) res.sendStatus(500);
    res.send(results);
  });
});
app.put("/edit", (req, res) => {
  const id = req.query.id;
  const values = { ...req.body };

  const EDIT_COIN = `UPDATE coins SET ? WHERE id=${id}`;
  db.query(EDIT_COIN, [values], (err, results) => {
    if (err) res.sendStatus(500);
    res.send(results);
  });
});
app.post("/add", (req, res) => {
  const values = { ...req.body };
  const ADD_COIN = `INSERT INTO coins (name,imgFrontUrl,imgBackUrl,country,composition,quality,denomination,date,weight,price,description,type,short)
  VALUES('${values.name}','${values.imgFrontUrl}','${values.imgBackUrl}','${values.country}','${values.composition}','${values.quality}','${values.denomination}','${values.date}','${values.weight}','${values.price}','${values.description}','${values.type}','${values.short}')
  `;
  db.query(ADD_COIN, (err, results) => {
    if (err) res.sendStatus(500);
    console.log(results);
    res.send(results);
  });
});

app.delete("/delete", (req, res) => {
  const { id } = req.body;
  const DELETE_COIN = `DELETE FROM coins WHERE id = ${id};`;

  db.query(DELETE_COIN, (err, results) => {
    if (err) res.sendStatus(500);
    console.log(results);
    res.send(results);
  });
});
app.get("/userInfo", (req, res) => {
  const { username } = req.query;

  const GET_USER_INFO = `SELECT fullName,email,age FROM users WHERE username='${username}'`;

  db.query(GET_USER_INFO, (err, results) => {
    if (err) res.sendStatus(500);
    res.json(results);
  });
});
app.put("/updateInfo", (req, res) => {
  const { value, target, username } = req.body;

  const SET_NEW_INFO = `UPDATE users SET ${target} ='${value}'  WHERE username='${username}';`;
  db.query(SET_NEW_INFO, (err, results) => {
    if (err) res.sendStatus(500);
  });
});

app.post("/history", (req, res) => {
  const id = req.query.id;
  const { username } = req.body;

  const ADD_USER_HISTORY = `INSERT INTO historyview (username,coin_id) VALUES ('${username}',${id})`;

  db.query(ADD_USER_HISTORY, (err, results) => {
    if (err) res.sendStatus(500);
  });
});
app.get("/getUserHistory", (req, res) => {
  const { username } = req.query;

  // const GET_USER_HISTORY_COINS = `SELECT * FROM historyview WHERE username='${username}'`;
  const GET_USER_HISTORY_COINS = `SELECT
  coins.id, 
  coins.name, 
  coins.imgFrontUrl, 
  coins.imgBackUrl, 
  coins.country,
  coins.composition, 
  coins.quality, 
  coins.denomination, 
  coins.date, 
  coins.weight, 
  coins.price, 
  coins.description, 
  coins.type, 
  coins.short,
  historyview.coin_id,
  historyview.username,
  historyview.id
  FROM coins
  INNER JOIN historyview
  ON coins.id = historyview.coin_id WHERE historyview.username='${username}'
  ORDER BY historyview.id DESC;`;
  db.query(GET_USER_HISTORY_COINS, (err, results) => {
    if (err) res.sendStatus(500);
    res.json(results);
  });
});
app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
