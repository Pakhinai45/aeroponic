import { connection } from '../../db.js';

//getDataUserByID
export const getDataUser = async (req , res) =>{
    const {uid} = req.params;
    try {
        const query = 'SELECT * FROM users WHERE uid = ?';
        connection.query(query, [uid], (err,result)=>{
            if (err) {
                console.error("Getdata Error:",err);
                res.status(500).json({error:"Getdata Error"});
                return;
            }
            res.json(result);
        })
    } catch (error) {
        console.error("Error GetData:", error);
        res.status(500).json({ message: error.message });
        return;
    }
}

//EidData
export const updateUser = async (req, res) => {
    const {uid} = req.params;
    const {user_name,email,phone} = req.body;
    try {
        const query = 'UPDATE users SET user_name = ?, email = ?, phone = ? WHERE uid = ?';
        connection.query(query, [user_name, email, phone, uid], (err, result)=>{
            if (err) {
                console.error("Edit Error:",err);
                res.status(500).json({error:"Edit Error"});
                return;
            }
            res.status(200).json({ success: true, message: "Update successful" });
        });
    } catch (error) {
        console.error("Error GetData:", error);
        res.status(500).json({ message: error.message });
        return;
    }
};

