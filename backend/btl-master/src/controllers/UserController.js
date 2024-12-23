const UserService = require('../services/UserService')

const createUser = async  (req, res) =>{
    try{
        const { name, email, password, confirmPassword, phone } = req.body
        const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        const isCheckEmail = regexEmail.test(email)
        if ( !name || !email || !password || !confirmPassword || !phone ){
            return res.status(200).json({
                status: "ERR" ,
                message: "The input is required"
            })
        }else if(!isCheckEmail){
            return res.status(200).json({
                status: "ERR" ,
                message: "The input is email"
            })
        }else if(password !== confirmPassword){
            return res.status(200).json({
                status: "ERR" ,
                message: "The password is equal confirmPassword"
            })
        }
        const response = await UserService.createUser(req.body) // chạy hàm duy nhất createUser trong UserService 
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(200).json({
                status: "ERR",
                message: "Email and password are required"
            })
        }
        const response = await UserService.loginUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async  (req, res) =>{
    try{
        const userId = req.params.id;
        const data = req.body;
        if(!userId){
            return res.status(200).json({
                status: "ERR" ,
                message: "The userId is required"
            })
        }
        const response = await UserService.updateUser(userId, data) // chạy 1 hàm duy nhất updateUser trong UserService 
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async  (req, res) =>{
    try{
        const userId = req.params.id;
        if(!userId){
            return res.status(200).json({
                status: "ERR" ,
                message: "The userId is required"
            })
        }
        const response = await UserService.deleteUser(userId) // chạy 1 hàm duy nhất deleteUser trong UserService 
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async  (req, res) =>{
    try{
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailUser = async  (req, res) =>{
    try{
        const userId = req.params.id;
        if(!userId){
            return res.status(200).json({
                status: "ERR" ,
                message: "The userId is required"
            })
        }
        const response = await UserService.getDetailUser(userId) // chạy 1 hàm duy nhất deleteUser trong UserService 
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }   
}


module.exports = { 
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser
}