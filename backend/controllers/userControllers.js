import { auth, db, signInWithEmailAndPassword } from "../firebase/firebaseConfig.js";
import { createUserWithEmailAndPassword , sendPasswordResetEmail } from "firebase/auth";
import { setDoc, doc, getDoc, deleteDoc, collection, getDocs, updateDoc} from 'firebase/firestore';

import {adminAuth , adminDb} from "../firebase/firebaseConfigAdmin.js";

//เข้าสู่ระบบ -----------------------------------------------------------------------------------------------
export const login = async (req, res) => {
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
};

//สมัคสมาชิก-----------------------------------------------------------------------------------------------
export const signUp = async (req, res) => {
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
};

//สมัคสมาชิกโดยroot-----------------------------------------------------------------------------------------------
export const signUpByRoot = async (req, res) => {
    const { name, phon, email, password, status, tokenline } = req.body; 

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; 

        if (user) {
            await setDoc(doc(db, "Users", user.uid), {
                name: name,
                phon: phon,
                email: email,
                status: status,
                tokenline: tokenline,
                createdAt: new Date().toISOString(),
            });
        }

        res.status(200).json({ message: "สร้างบัญชีสำเร็จ" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: error.message });
    }
};

//เปลี่ยนหรัสผ่าน-----------------------------------------------------------------------------------------------
export const forgotPassword = async (req, res) => {
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
  };


//ดึงข้อมูลผู้ใช้ทั้งหมดตาม UID-------------------------------------------------------------------------------------
export const getUserByUid = async (req, res) => {
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
};


//ส่งคำขอเป็น Admin-----------------------------------------------------------------------------------------------
export const requestAdmin = async (req,res)=>{
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
};

// ตรวจสอบคำขอเป็น Admin ใน Database และส่ง status กลับ--------------------------------------------------------------
export const checkAdminRequest = async (req, res) => {
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
};


//ลบคำขอเป็น Admin-----------------------------------------------------------------------------------------------
export const cancelAdminRequest = async (req, res) => {
    const { uid } = req.params;

    try {
        const docRef = doc(db, "admin_request", uid);
        await deleteDoc(docRef);

        res.status(200).json({ message: "คำขอถูกยกเลิกแล้ว" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: error.message });
    }
};

//ดึงคำขอเป็น Admin ทั้งหมด-----------------------------------------------------------------------------------------------
export const adminRequestsAll = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "admin_request"));
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: error.message });
    }
};

//อนุมัติการเป็น Admin-----------------------------------------------------------------------------------------------
export const approveAdmin = async (req,res)=>{

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
};

//ปฏิเสธการเป็น Admin-----------------------------------------------------------------------------------------------
export const refuseAdmin = async (req,res)=>{

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
};


//ดึงข้อมูลผู้ใช้ทั้งหมด-----------------------------------------------------------------------------------------------
export const getUser = async (req, res) => {
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
};


// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้หน้าโปรไฟล์---------------------------------------------------------------------------------
export const updateUser = async (req, res) => {
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
};

//ลบบัญชีผู้ใข้
export const deleteUser = async (req, res)=>{
    const uid = req.params.id;

    try {
        await adminDb.collection("Users").doc(uid).delete();
        console.log(`🔥 Deleted Firestore document for UID: ${uid}`);

        await adminAuth.deleteUser(uid);
        console.log(`✅ Deleted Auth account for UID: ${uid}`);

        return res.status(200).json({
            message: `User ${uid} deleted successfully.`,
        });

    } catch (error) {
        console.error("❌ Error deleting user:", error);
        return res.status(500).json({
        error: error.message,
        });
    }
};