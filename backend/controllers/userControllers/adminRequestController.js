import { connection } from '../../db.js';

//GetRequest
export const adminRequestsAll = async (req, res) => {
    try {
        const query = 'SELECT * FROM collect_request';
        connection.query(query, (err , result)=>{
            if(err){
                console.error("GetRequest Error:",err);
                res.status(500).json({error:"GetRequest Error"});
                return;
            }
            res.status(200).json(result);
        })

       
    } catch (error) {
        console.error("Error fetching:", error);
        res.status(500).json({ message: error.message });
    }
};

//Approve
export const approveAdmin = async (req,res)=>{

    const {uid} = req.params;

    try {
        const queryReq = 'UPDATE collect_request SET req_status = "2" WHERE users_uid = ?';
        connection.query(queryReq, [uid], (err,resultReq)=>{

            if(err){
                console.error("Update Error:",err);
                res.status(500).json({error:"Update Error"});
                return;
            }

            const queryUser = 'UPDATE users SET user_status = "1" WHERE uid = ?'
            connection.query(queryUser, [uid], (err, resultUser)=>{
                if (err) {
                    console.error("Update Error:",err);
                    res.status(500).json({error:"Update Error"});
                    return;
                }
            });
            res.status(200).json({ message: "Approve Successfuly" });
        });

    } catch (error) {
        console.error("Error approving admin:", error);
        res.status(500).json({message:`approve error`})
    }
};

//refuse
export const refuseAdmin = async (req,res)=>{

    const {uid} = req.params;

    try {
        const queryReq = 'UPDATE collect_request SET req_status = "1" WHERE users_uid = ?';
        connection.query(queryReq, [uid], (err,resultReq)=>{

            if(err){
                console.error("Update Error:",err);
                res.status(500).json({error:"Update Error"});
                return;
            }

            const queryUser = 'UPDATE users SET user_status = "0" WHERE uid = ?'
            connection.query(queryUser, [uid], (err, resultUser)=>{
                if (err) {
                    console.error("Update Error:",err);
                    res.status(500).json({error:"Update Error"});
                    return;
                }
            });
            res.status(200).json({ message: "Refuse Successfuly" });
        });
    } catch (error) {
        console.error("Error Refuse admin:", error);
        res.status(500).json({message:`refuse error`})
    }
};

//Delete
export const deleteAdminRequest = async (req, res) => {
    const { uid } = req.params;

    try {
        const query = 'DELETE FROM collect_request WHERE users_uid = ?';
        connection.query(query , [uid], (err , result)=>{

            if(err){
                console.error("Delete Error:",err);
                res.status(500).json({error:"Delete Error"});
                return;
            }

            res.status(200).json({ message: "delete Successfuly" });
        });
        
    } catch (error) {
        console.error("Error Delete:", error);
        res.status(500).json({ message: error.message });
    }
};