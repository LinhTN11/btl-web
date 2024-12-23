const User = require('../models/User')
const bcrypt = require('bcrypt')
const { generalAccessToken, generalRefreshToken } = require('./JwtService')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {

            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: "Email already exists"
                })
                return;
            }
            
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email, 
                password: hash, 
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: "Success",
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: "The user is not defined"
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: "ERR", 
                    message: "The password or user is incorrect"
                })
            }
            resolve({
                status: "OK",
                message: "Login success",
                data: checkUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            const checkUser = await User.findOne({_id : id}) // tìm giá trị _id khớp với id được truyền vào
            if (checkUser === null){
                resolve({
                    status: "OK",
                    message: "The user is not defined"
                })
            }           
            const updateUser = await User.findByIdAndUpdate (id, data, {new: true})
                resolve({
                status: "OK",
                message: "Update Successful",
                data: updateUser
            })  
        } catch(e){
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            const checkUser = await User.findOne({_id : id}) // tìm giá trị _id khớp với id được truyền vào
            if (checkUser === null){
                resolve({
                    status: "OK",
                    message: "The user is not defined"
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "Delete Successful",
            })
        } catch(e){
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            const allUser =  await User.find()
            resolve({
                status: "OK",
                message: "Get All Users Successful",
                data: allUser
            })
        } catch(e){
            reject(e)
        }
    })
}

const getDetailUser = (id) => {
    return new Promise  ( async (resolve, reject) =>{
        try{
            const user = await User.findOne({_id : id}) // tìm giá trị _id khớp với id được truyền vào
            if (user === null){
                resolve({
                    status: "OK",
                    message: "The user is not defined"
                })
            }                                       
            resolve({
                status: "OK",
                message: "Get User Successful",
                data: user
            })
        } catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser
}