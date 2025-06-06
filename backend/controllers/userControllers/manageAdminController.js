import { connection } from '../../db.js';
import bcrypt from 'bcrypt';
const saltRounds = 10;


//getUserAll
export const getUserAll = async (req, res) => {
    try {
        const query = 'SELECT * FROM users WHERE user_status != 2';
        connection.query(query, (err,result)=>{
            if(err){
                console.error("GetUser Error:",err);
                res.status(500).json({error:"Check Error"});
                return;
            }

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: "No users found" });
            }
            res.json(result);
        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//EidData
export const updateUserByRoot = async (req, res) => {
    const {uid} = req.params;
    const {user_name,email,phone,user_status} = req.body;
    try {
        const query = 'UPDATE users SET user_name = ?, email = ?, phone = ?, user_status = ? WHERE uid = ?';
        connection.query(query, [user_name, email, phone, user_status, uid], (err, result)=>{
            if (err) {
                console.error("Edit Error:",err);
                res.status(500).json({error:"Edit Error"});
                return;
            }
            res.status(200).json({ success: true, message: "Update successful" });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
        return;
    }
};

//Delete Usaer
export const deleteUser = async (req, res) => {
    const {uid} = req.params;

    try {
        const query = 'DELETE FROM users WHERE uid = ?'
        connection.query(query, [uid], (err)=>{
            if (err) {
                console.error("Delete Error:",err);
                res.status(500).json({error:"Edit Error"});
                return;
            }
            res.json({message:"Delete Successfuly"});
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
        return;
    }
}

//signUpByRoot
export const signUpByRoot = async (req,res)=>{
    const { user_name, email, password, phone, user_status} = req.body;

    bcrypt.hash(password, saltRounds, function(err, hash) {

        const query = "INSERT INTO users(user_name, email, password, phone, user_status) VALUES(?, ?, ?, ?, ?)";

        connection.query(query, [user_name, email, hash, phone, user_status], (err, results) => {
            if(err){
                console.error("Error insert data:",err);
                res.status(500).json({error:"Insert Server Error"});
                return;
            }

            res.status(200).json({
                message:"Create successfuly",
            })
        });
    });
}