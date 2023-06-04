const express = require("express");
const app = express();
const user = require("./models/user");
const expense=require('./models/expense')

const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res, next) => {
  user
    .findAll()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send("<h1>Page Not Found</h1>");
    });
});

app.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  user
    .findOne({ where: { email } })
    .then((response) => {
      if (response) {
        bcrypt.compare(password, response.password, (err, result) => {
          if (result) {
            return res.status(200).json({ message: "User login successful" });
          } else {
            return res.status(401).json({ error: "Password doesn't match" });
          }
        });
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/user", (req, res, next) => {
  const { name, sur, email, password } = req.body;
  user
    .findOne({ where: { email } })
    .then((response) => {
      if (response) {
        return res.status(400).json({ error: "User Already Exists" });
      } else {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          user
            .create({ name, sur, email, password: hashedPassword })
            .then((result) => {
              res.status(200).json(result);
            })
            .catch((err) => {
              res.status(500).json({ error: "Internal Server Error" });
            });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get('/expense',(req,res,next)=>{
  expense.findAll().then((result) => {
      res.json(result)
  }).catch((err) => {
      console.log(err);
  });
})

app.post('/expense',(req,res,next)=>{
  expense.create({
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category,
      userId: user.id
  }).then((result) => {
      res.status(200).send(result)
  }).catch((err) => {
      res.status(400).send(err)
  });
})

app.get('/expense/:id',(req,res,next)=>{
  // expense.findAll().then((result) => {
  //     result.forEach(element=>{
  //         if(element.id==req.params.id){
  //             res.json(element)
  //         }
  //     })
  // }).catch((err) => {
  //     res.status(400).send(err)
  // });
  expense.findByPk(req.params.id).then((result) => {
      if(result){
          res.json(result)
      }else{
          res.send('No Product Found to GET.')
      }
      
  }).catch((err) => {
      res.status(400).send(err)
  });
})

app.delete('/expense/:id',(req,res,next)=>{
  expense.findByPk(req.params.id).then((result) => {
      if(result){
          return result.destroy()
      }else{
          res.send('No Product Found to DELETE.')
      }
      
  }).then(result=>{
      res.status(200).send(result)
  }

  ).catch((err) => {
      console.log(err);
  });
})

user.hasMany(expense)

sequelize
  .sync()
  // .sync({force: true})
  .then((res) => {
    const hostname = "127.0.0.1";
    const port = 3000;
    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
