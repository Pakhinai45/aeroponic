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

        res.status(200).json({ token, uid });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid credentials: " + error.message });
    }
};

//สมัคสมาชิก-----------------------------------------------------------------------------------------------
export const signUp = async (req, res) => {
    const { name, phone, email, password } = req.body; 

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; 

        if (user) {
            await setDoc(doc(db, "users", user.uid), {
                user_name: name,
                phone: phone,
                email: email,
                user_status: 0,
            });
        }

        res.status(200).json({ message: "Account created successfully" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: error.message });
    }
};

//สมัคสมาชิกโดยroot-----------------------------------------------------------------------------------------------
export const signUpByRoot = async (req, res) => {
    const { user_name, phone, email, password, user_status } = req.body; 

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; 

        if (user) {
            await setDoc(doc(db, "users", user.uid), {
                user_name: user_name,
                phone: phone,
                email: email,
                user_status: user_status,
            });
        }

        res.status(200).json({ message: "Account created successfully" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: error.message });
    }
};

//เปลี่ยนหรัสผ่าน-----------------------------------------------------------------------------------------------
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Please enter your email address." });
    }
  
    try {
      await sendPasswordResetEmail(auth, email);
      res.json({ message: "A link to change your password has been sent to your email." });
      res.status(200);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error.message });
    }
};


//ดึงข้อมูลผู้ใช้ทั้งหมดตาม UID-------------------------------------------------------------------------------------
export const getUserByUid = async (req, res) => {
    const { uid } = req.params;

    try {
        const userDoc = await getDoc(doc(db, "users", uid));

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
    const { user_name, phone, uid  } = req.body; 

    try {
        await setDoc(doc(db, "collect_request" ,uid),{
            user_name:user_name,
            phone:phone,
            req_status:0,
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
        const docRef = doc(db, "collect_request", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            const req_status = data.req_status;

            res.status(200).json({ exists: true, req_status });
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
        const docRef = doc(db, "collect_request", uid);
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
        const querySnapshot = await getDocs(collection(db, "collect_request"));
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
        const requestRef = doc(db, "collect_request", uid);
        await updateDoc(requestRef,{
            req_status:2
        });

        const userRef  = doc(db, "users", uid);
        await updateDoc(userRef,{
            user_status:1
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
        const requestRef = doc(db, "collect_request", uid);
        await updateDoc(requestRef,{
            req_status:1
        });

        const userRef  = doc(db, "users", uid);
        await updateDoc(userRef,{
            user_status:0
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
        const userSnapshot = await getDocs(collection(db, "users"));
        
        const users = [];
        // วนลูปเพื่อดึงข้อมูลจากแต่ละเอกสารในคอลเลกชัน
        userSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.user_status !== 2) {
                users.push({ uid: doc.id, ...data });
            }
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
    const uid = req.params.uid; 
    const updatedUserData = req.body;
  
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // อัปเดตข้อมูลผู้ใช้ใน Firestore
      await setDoc(userRef, updatedUserData, { merge: true });
  
      res.json({ success: true, message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ success: false, message: error.message });
    }
};

//ลบบัญชีผู้ใข้
export const deleteUser = async (req, res)=>{
    const uid = req.params.uid;

    try {
        await adminDb.collection("users").doc(uid).delete();
        console.log(`Deleted Firestore document for UID: ${uid}`);

        await adminAuth.deleteUser(uid);
        console.log(`Deleted Auth account for UID: ${uid}`);

        return res.status(200).json({
            message: `User deleted successfully.`,
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
        error: error.message,
        });
    }
};

