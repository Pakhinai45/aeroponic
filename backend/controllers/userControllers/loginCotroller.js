import { connection } from '../../db.js';
import bcrypt from 'bcrypt';
const saltRounds = 10;
import jwt from 'jsonwebtoken';
const secret = "enigma";


//api SingUp
export const signUp = async (req,res)=>{
    const { user_name, email, password, phone} = req.body;

    bcrypt.hash(password, saltRounds, function(err, hash) {

        const query = "INSERT INTO users(user_name, email, password, phone, user_status) VALUES(?, ?, ?, ?, ?)";

        connection.query(query, [user_name, email, hash, phone, 0], (err, results) => {
            if(err){
                console.error("Error insert data:",err);
                res.status(500).json({error:"Insert Server Error"});
                return;
            }

            res.status(200).json({
                msg:"Data insert successfuly",
            })
        });
    });
}

//api login
export const logIn = async (req,res)=>{
    const { email, password} = req.body;

     const query = "SELECT * FROM users WHERE email=?";
        connection.query(query, [ email ], (err, users, results) => {
            if(err){
                console.error("Error Login:",err);
                res.status(500).json({error:"Login Error"});
                return;
            }

            if(users.length === 0){
                console.error("Error No User Found:",err);
                res.status(500).json({error:"No User Found"});
                return;
            }

            bcrypt.compare(password, users[0].password, function(err, isLogin) {
                if(isLogin){
                    var token = jwt.sign({ 
                        email: users[0].email,
                        user_status: users[0].user_status,
                        uid: users[0].uid
                    }, secret);
                    res.status(200).json({status:'ok', message:"login success", token});
                    return;
                }else{
                     res.status(401).json({status:'error', message:"login failed"});
                     return;
                }
            });
        });
}

//api Authen
export const authen = async (req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        var decoded = jwt.verify(token, secret);
        res.json({status:"ok", decoded})
    } catch (error) {
        res.json({status:"error", message:error.message})
    }
}

export const getUser = async (req,res)=>{
    const {uid} = req.params;

    const query = 'SELECT user_name, phone  FROM users WHERE uid = ?';
    connection.query(query,[uid],(err,results)=>{
    if(err){
            console.error("data error:",err);
            res.status(500).json({error:"data error"});
            return;
        }
        res.json(results);
    })
}
