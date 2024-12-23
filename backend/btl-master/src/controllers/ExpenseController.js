const ExpenseService = require('../services/ExpenseService')

const createExpense = async  (req, res) =>{
    try{
        const { userId, category, amount, date, note } = req.body
        if ( !userId || !category || !amount || !date ){
            return res.status(200).json({
                status: "ERR" ,
                message: "The input is required"
            })
        }
        const response = await ExpenseService.createExpense(req.body) // chạy hàm duy nhất createUser trong UserService 
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const updateExpense = async  (req, res) =>{
    try{
        const expenseId = req.params.id
        const data = req.body
        if (!expenseId){
            return res.status(200).json({
                status: "ERR" ,
                message: "The expenseId is required"
            })
        }
        const response = await ExpenseService.updateExpense(expenseId, data) // chạy hàm duy nhất createUser trong UserService 
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const deleteExpense = async  (req, res) =>{
    try{
        const expenseId = req.params.id
        if (!expenseId){
            return res.status(200).json({
                status: "ERR" ,
                message: "The expenseId is required"
            })
        }
        const response = await ExpenseService.deleteExpense(expenseId) // chạy hàm duy nhất createUser trong UserService 
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailExpense = async (req, res) =>{
    try {
        const expenseId = req.params.id
        if(!expenseId){
            return res.status(200).json({
                status: "ERR",
                message: "The expenseId is required"
            })
        }
        const response = await ExpenseService.getDetailExpense(expenseId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getAllExpense = async (req, res) =>{
    try {
        const filter = req.query.filter // trả về kq dưới dạng array và truy cập vào filter 
        const response = await ExpenseService.getAllExpense()
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = { 
    createExpense,
    updateExpense,
    deleteExpense,
    getDetailExpense,
    getAllExpense
}