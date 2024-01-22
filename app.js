const express = require("express");
const app = express();
const exbs = require("express-handlebars");
const bodyparser = require("body-parser");
const EmployeeModel = require("./models/employeeModel");
const database = require("./db");
database();

app.engine(
  "hbs",
  exbs.engine({
    layoutsDir: "./views",
    defaultLayout: "main",
    extname: "hbs",
    runtimeOptions: {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    let message, employeeList, employee;
    employeeList = await EmployeeModel.find({});

    switch (req.query.status) {
      case "1":
        message = "Added Employee Successfully";
        break;
      case "2":
        message = "Updated Employee Successfully";
      case "3":
        message = "Deleted Employee Successfully";
      default:
        break;
    }

    if (req.query.edit_id) {
      employee = await EmployeeModel.findOne({ _id: req.query.edit_id });
    }

    if (req.query.delete_id) {
      await EmployeeModel.deleteOne({ _id: req.query.delete_id });
      res.redirect("/?status=3");
    }

    res.render("main", { message, employeeList, employee });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/add-employee", async (req, res) => {
  try {
    let employee = {
      name: req.body.name,
      age: req.body.age,
      position: req.body.position,
    };
    const addEmployee = new EmployeeModel(employee);
    await addEmployee.save();
    res.redirect("/?status=1");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/update-employee/:id", async (req, res) => {
  try {
    let employee = {
      name: req.body.name,
      age: req.body.age,
      position: req.body.position,
    };
    await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: employee },
      { new: true }
    );
    res.redirect("/?status=2");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen("8000", () => console.log("Listening Port: 8000"));
