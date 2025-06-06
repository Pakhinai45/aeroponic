import { connection } from '../../db.js';

//SendRequest
export const requestAdmin = async (req,res)=>{
    const { note, user_name, phone, uid  } = req.body; 

    try {
        const checkQuery = 'SELECT * FROM collect_request WHERE users_uid = ?';
        connection.query(checkQuery, [uid] ,(err,checkResult)=>{
            if(err){
                console.error("Check Error:",err);
                res.status(500).json({error:"Check Error"});
                return;
            }

            if(checkResult.length > 0 ){
                res.status(400).json({ message: "already have it" });
                return;
            }

            const query = 'INSERT INTO collect_request(note, user_name, phone, req_status, users_uid) VALUES(?, ?, ?, ?, ?)'
            connection.query(query,[note,user_name,phone, 0, uid], (err,result)=>{
                if(err){
                    console.error("Send Error:",err);
                    res.status(500).json({error:"Send Error"});
                    return;
                }
            })
            res.status(200).json({ message: "Send Successfuly" });
        });

    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: error.message });
        return;
    }
};

//CheckRequest
export const checkRequestStatus = async (req,res) =>{
    const { uid } = req.params;

    try {
        const query = 'SELECT * FROM collect_request WHERE users_uid = ?';
        connection.query(query, [uid] ,(err,result)=>{
            if(err){
                console.error("Check Error:",err);
                    res.status(500).json({error:"Check Error"});
                    return;
            }
            res.json(result);
        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
        return;
    }
}

//cancelSendRequest
export const cancelAdminRequest = async (req,res)=>{
    const {uid} = req.params;

    try {
        const query = 'DELETE FROM collect_request WHERE users_uid = ?';
        connection.query(query, [uid] ,(err,result)=>{
            if(err){
                    console.error("Delete Error:",err);
                        res.status(500).json({error:"Delete Error"});
                        return;
                }
                res.json({message:"delete successfuly"});
        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
        return;
    }
    
}