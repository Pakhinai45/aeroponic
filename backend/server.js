import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import sensorRoutes from './controllers/sensor.js'; 

import { auth, db, signInWithEmailAndPassword } from "./firebase/firebaseConfig.js";
import { createUserWithEmailAndPassword , sendPasswordResetEmail } from "firebase/auth";
import { setDoc, doc, getDoc, deleteDoc, collection, getDocs, updateDoc} from 'firebase/firestore';


// กำหนดตัวแปรที่จำเป็น
const app = express();
const PORT = 3300;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(sensorRoutes);
dotenv.config();

//API//

//เข้าสู่ระบบ
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();

        const uid = userCredential.user.uid; 

        res.json({ token, uid }); 
        res.status(200);
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid credentials: " + error.message });
    }
});

//สมัคสมาชิก
app.post('/signUp', async (req, res) => {
    const { name, phon, email, password } = req.body; 

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; 

        if (user) {
            await setDoc(doc(db, "Users", user.uid), {
                name: name,
                phon: phon,
                email: email,
                status: 0,
                tokenline: "null",
                createdAt: new Date().toISOString(),
            });
        }

        res.status(200).json({ message: "สร้างบัญชีสำเร็จ" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: error.message });
    }
});

//เปลี่ยนหรัสผ่าน
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "กรุณากรอกอีเมล" });
    }
  
    try {
      await sendPasswordResetEmail(auth, email);
      res.json({ message: "ลิงก์รีเซตรหัสผ่านถูกส่งไปที่อีเมลของคุณ" });
      res.status(200);
    } catch (error) {
      res.status(500).json({ message: "เกิดข้อผิดพลาด: " + error.message });
    }
  });


//ดึงข้อมูลผู้ใช้ทั้งหมดตาม UID
app.get("/getUser/:uid", async (req, res) => {
    const { uid } = req.params;

    try {
        const userDoc = await getDoc(doc(db, "Users", uid));

        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: userDoc.data() });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


//ส่งคำขอเป็น Admin
app.post('/request-admin', async (req,res)=>{
    const { name, phon, uid  } = req.body; 

    try {
        await setDoc(doc(db, "admin_request" ,uid),{
            name:name,
            phon:phon,
            statusRequest:0,
        });
        res.status(201).json({ message: "ส่งคำขอสำเร็จ" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: error.message });
    }
});

// ตรวจสอบคำขอเป็น Admin ใน Database และส่ง status กลับ
app.get('/check-admin-request/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const docRef = doc(db, "admin_request", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // console.log("Document data:", data); 

            const statusRequest = data.statusRequest;

            res.status(200).json({ exists: true, statusRequest });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).json({ message: error.message });
    }
});


//ลบคำขอเป็น Admin
app.delete('/cancel-admin-request/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const docRef = doc(db, "admin_request", uid);
        await deleteDoc(docRef);

        res.status(200).json({ message: "คำขอถูกยกเลิกแล้ว" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: error.message });
    }
});

//ดึงคำขอเป็น Admin ทั้งหมด
app.get('/admin-requests-all', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "admin_request"));
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: error.message });
    }
});

//อนุมัติการเป็น Admin
app.post('/approve-admin/:uid', async (req,res)=>{

    const {uid} = req.params;

    try {
        const requestRef = doc(db, "admin_request", uid);
        await updateDoc(requestRef,{
            statusRequest:2
        });

        const userRef  = doc(db, "Users", uid);
        await updateDoc(userRef,{
            status:1
        });

        console.log(`User ${uid} has been approved as admin.`);
        res.status(200).json({message:`approve ok`})
    } catch (error) {
        console.error("Error approving admin:", error);
        res.status(500).json({message:`approve error`})
    }
});

//ปฏิเสธการเป็น Admin
app.post('/refuse-admin/:uid', async (req,res)=>{

    const {uid} = req.params;

    try {
        const requestRef = doc(db, "admin_request", uid);
        await updateDoc(requestRef,{
            statusRequest:1
        });

        const userRef  = doc(db, "Users", uid);
        await updateDoc(userRef,{
            status:0
        });

        console.log(`User ${uid} has been approved as admin.`);
        res.status(200).json({message:`refuse ok`})
    } catch (error) {
        console.error("Error approving admin:", error);
        res.status(500).json({message:`refuse error`})
    }
});


//ดึงข้อมูลผู้ใช้ทั้งหมด
app.get("/getUser", async (req, res) => {
    try {
        // ดึงข้อมูลจากคอลเลกชัน Users
        const userSnapshot = await getDocs(collection(db, "Users"));
        
        const users = [];
        // วนลูปเพื่อดึงข้อมูลจากแต่ละเอกสารในคอลเลกชัน
        userSnapshot.forEach(doc => {
            // เพิ่ม uid (id ของเอกสาร) ไปในข้อมูลของผู้ใช้
            users.push({ id: doc.id, ...doc.data() }); // doc.id คือ uid
        });

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        res.json({ success: true, users: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});



// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
app.put("/updateUser/:id", async (req, res) => {
    const uid = req.params.id; // รับ ID จาก URL
    const updatedUserData = req.body; // ข้อมูลผู้ใช้ที่อัปเดต
  
    try {
      // เข้าถึงข้อมูลผู้ใช้จาก Firestore โดยใช้ ID
      const userRef = doc(db, "Users", uid);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // อัปเดตข้อมูลผู้ใช้ใน Firestore
      await setDoc(userRef, updatedUserData, { merge: true });
  
      // ส่งข้อความตอบกลับ
      res.json({ success: true, message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ success: false, message: error.message });
    }
});


  
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
