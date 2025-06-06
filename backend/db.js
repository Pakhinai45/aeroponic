import mysql from 'mysql2';

export const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"146900",
    database:"aeroponic",
    port:3307
})

connection.connect((err)=>{
    if(err){
        console.error("error connect to mysql",err);
    }
    console.log("connect successfuly");
    
})
