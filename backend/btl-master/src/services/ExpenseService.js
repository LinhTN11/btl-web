const Expense = require('../models/Expense')

const createExpense = (newExpense) => {
    return new Promise  ( async (resolve, reject) =>{
        const { userId, category, amount, date, note } = newExpense
        try{     
            const createdExpense = await Expense.create({
                userId,
                category,
                amount,
                date,
                note
            })
            if(createdExpense){
                resolve({
                    status: 'OK',
                    message: "Success",
                    data: createdExpense
                })
            }
        } catch(e){
            reject(e)
        }
    })
}

const updateExpense = (id, data) => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            const checkExpense = await Expense.findOne({_id : id}) // tìm giá trị _id khớp với id được truyền vào
            if (checkExpense === null){
                resolve({
                    status: "ERR",
                    message: "The expense is not defined"
                })
            }           
            const updateExpense = await Expense.findByIdAndUpdate( id, data, {new: true} )
                resolve({
                status: "OK",
                message: "Update Successful",
                data: updateExpense
            })  
        } catch(e){
            reject(e)
        }
    })
}

const deleteExpense = (id) => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            const checkExpense = await Expense.findOne({_id : id}) // tìm giá trị _id khớp với id được truyền vào
            if (checkExpense === null){
                resolve({
                    status: "ERR",
                    message: "The expense is not defined"
                })
            }           
            await Expense.findByIdAndDelete( id )
                resolve({
                status: "OK",
                message: "Delete Successful",
            })  
        } catch(e){
            reject(e)
        }
    })
}

const getDetailExpense = (id) => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            const expense = await Expense.findOne({_id : id})     // tìm giá trị _id khớp với id được truyền vào
            if (expense === null){
                resolve({
                    status: "ERR",
                    message: "The expense is not defined"
                })
            }          
            resolve({
                    status: "OK",
                    message: "Get Expense Successful",
                    data: expense
            })
        } catch(e){
            reject(e)
        }
    })
}

const getAllExpense = () => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            // if(filter) {
            //     const label = filter[0]
            //     const allObjectFilter = await Expense.find( { [label]: { '$regex': filter[1], $options: "i" }})
            //     resolve({
            //         status: "OK",
            //         message: "Success",
            //         data: allObjectFilter
            //     })
            // }
            const allExpense = await Expense.find()
            resolve({
                    status: "OK",
                    message: "Get All Expense Successful",
                    data: allExpense
            })
        } catch(e){
            reject(e)
        }
    })
}


module.exports = {
    createExpense,
    updateExpense,
    deleteExpense,
    getDetailExpense,
    getAllExpense
}