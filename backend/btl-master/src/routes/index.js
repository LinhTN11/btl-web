const UserRouter = require("./UserRoute")
const ExpenseRoute = require("./ExpenseRoute")
const MonthlyLimitRoute = require("./MonthlyLimitRoute")
const routes = (app) =>{
    app.use('/api/user', UserRouter)
    app.use('/api/expense', ExpenseRoute)
    app.use('/api/monthlyLimit', MonthlyLimitRoute)
}

module.exports = routes