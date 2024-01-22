const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    name: String,
    age: Number,
    position: String
})

const employeeModel = mongoose.model('employees', employeeSchema)

module.exports = employeeModel