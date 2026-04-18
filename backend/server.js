const fs = require("fs");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
let adminOTP = "";
let otpEmail = "";

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//mongo
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("✅ MongoDB Connected");

  const adminCount = await AdminModel.countDocuments();

if (adminCount === 0) {
  await AdminModel.create({
    username: "admin",
    password: "admin123"
  });

  console.log("✅ Default Admin Created");
}

const count = await GameModel.countDocuments();
})
.catch(err => console.log("❌ Error:", err));

//muuulter
  const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },

  filename: function (req, file, cb) {
    const generatedName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");

    cb(null, generatedName);
  }
});

const upload = multer({ storage });

  // ===== USER MODEL =====
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  profileImage: { type: String, default: "" },

  totalStars: { type: Number, default: 0 },
  kidsStars: { type: Number, default: 0 },
  gameStars: { type: Number, default: 0 },

  totalPoints: { type: Number, default: 0 },
  totalPlayed: { type: Number, default: 0 },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema, "users");
//assignment
const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  teacherId: String,
  teacherName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Assignment = mongoose.model("Assignment", assignmentSchema, "assignments");
//new mongo stu
const studentSchema = new mongoose.Schema({
  name: String,
  class: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const submissionSchema = new mongoose.Schema({
  studentName: String,
  assignmentTitle: String,
  fileName: String,
  filePath: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
//teacher uload schema 
const materialSchema = new mongoose.Schema({
  title: String,
  fileName: String,
  filePath: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Material = mongoose.model("Material", materialSchema, "materials");


const Submission = mongoose.model("Submission", submissionSchema, "submissions");

const Student = mongoose.model("Student", studentSchema, "students");

const teacherSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,

  status: {
    type: String,
    default: "Active"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Teacher = mongoose.model("Teacher", teacherSchema, "teachers");
//admin pass
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    default: "admin"
  },
  password: {
    type: String,
    default: "admin123"
  }
});

const AdminModel = mongoose.model("Admin", adminSchema, "admins");

//login history
const loginHistorySchema = new mongoose.Schema({
  userName: String,
  role: String,
  loginTime: Date,
  logoutTime: Date,
  status: {
    type: String,
    default: "Active"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const LoginHistory = mongoose.model(
  "LoginHistory",
  loginHistorySchema,
  "loginhistory"
);

//contact msg
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  msg: String,
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model("Message", messageSchema, "messages");
//classes
const classSchema = new mongoose.Schema({
  name: String,

  status: {
    type: String,
    default: "Active"
  },

  icon: {
    type: String,
    default: "📘"
  },

  color: {
    type: String,
    default: "linear-gradient(135deg,#6366f1,#06b6d4)"
  }
});

const ClassModel = mongoose.model("ClassModel", classSchema, "classes");

//games section admin
// ===== GAME MODEL =====
const gameSchema = new mongoose.Schema({
  name: String,
  category: String,
  status: {
    type: String,
    default: "Enabled"
  }
});

const GameModel = mongoose.model("GameModel", gameSchema, "games");

(async () => {
  const count = await GameModel.countDocuments();

  if (count === 0) {
    await GameModel.insertMany([
      { name:"Animal Memory Match", category:"Animals" },
      { name:"Animal Quiz", category:"Animals" },
      { name:"Animal Spelling", category:"Animals" },

      { name:"Ocean Memory Match", category:"Water" },
      { name:"Ocean Quiz", category:"Water" },
      { name:"Sea Creature Spelling", category:"Water" },

      { name:"Veggie Memory Match", category:"Veggies" },
      { name:"Veggie Quiz", category:"Veggies" },
      { name:"Veggie Spelling", category:"Veggies" },

      { name:"Letter Memory Match", category:"Alphabet" },
      { name:"Letter Quiz", category:"Alphabet" },
      { name:"Alphabet Order", category:"Alphabet" },

      { name:"Sort It Out", category:"Mixed" },
      { name:"Word Search", category:"Mixed" }
    ]);

    console.log("✅ Games Added");
  }
})();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://smart-kids-jet.vercel.app"
  ],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});


// =============================
// 🔐 AUTH ROUTES
// =============================

// 👨‍🏫 TEACHER LOGIN
app.post("/teacher-login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const teacher = await Teacher.findOne({
      username,
      password
    });

    if (!teacher) {
      return res.json({
        success: false,
        message: "Invalid username or password"
      });
    }

    if (teacher.status === "Inactive") {
      return res.json({
        success: false,
        message: "You are currently disabled by admin. Contact admin."
      });
    }

    const log = await LoginHistory.create({
      userName: teacher.name,
      role: "Teacher",
      loginTime: new Date(),
      status: "Active"
    });

    res.json({
      success: true,
      teacher,
      logId: log._id
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
//googgllo
app.post("/google-login", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.json({ success: false, message: "No token provided" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name;

    let role = "student";

    if (email.endsWith("@school.com")) {
      role = "teacher";
    }

    // ✅ CHECK USER IN DB
    let user = await User.findOne({ email });

    // ✅ CREATE IF NOT EXISTS
    if (!user) {
      user = await User.create({ name, email, role });
    }

    await LoginHistory.updateMany(
  {
    userName: user.name,
    role: "Student",
    status: "Active"
  },
  {
    status: "Inactive",
    logoutTime: new Date()
  }
);

    const log = await LoginHistory.create({
  userName: user.name,
  role: "Student",
  loginTime: new Date(),
  status: "Active"
});

res.json({
  success: true,
  user,
  logId: log._id
});

  } catch (err) {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Google login failed"
  });
}
});



// 👶 STUDENT LOGIN
app.post("/student-login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "All fields required"
      });
    }

    // Demo Login
    if (username === "student" && password === "1234") {
      await LoginHistory.updateMany(
  {
    userName: "Demo Student",
    role: "Student",
    status: "Active"
  },
  {
    status: "Inactive",
    logoutTime: new Date()
  }
);

      const log = await LoginHistory.create({
        userName: "Demo Student",
        role: "Student",
        loginTime: new Date(),
        status: "Active"
      });

      return res.json({
        success: true,
        role: "student",
        logId: log._id
      });
    }

    res.json({
      success: false,
      message: "Invalid student credentials"
    });

  } catch (err) {
    res.json({
      success: false,
      message: "Server error"
    });
  }
});

//save star 
app.post("/save-stars", async (req, res) => {
  try {
    const { email, totalStars, kidsStars, gameStars } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      {
        totalStars,
        kidsStars,
        gameStars
      },
      {
        upsert: true,
        returnDocument: "after"
      }
    );

    res.json({
      success: true,
      user
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});
//get star
app.post("/get-stars", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    res.json({
      success: true,
      user: user || {
        totalStars: 0,
        kidsStars: 0,
        gameStars: 0
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
});

// =============================
// 📚 STUDENT MANAGEMENT
// =============================


// GET all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ students });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error loading students"
    });
  }
});

// ADD student
app.post("/add-student", async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const studentClass = req.body.class?.trim();

    if (!name || !studentClass) {
      return res.json({
        success: false,
        message: "Missing fields"
      });
    }

    const newStudent = await Student.create({
      name,
      class: studentClass
    });

    res.json({
      success: true,
      student: newStudent
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error adding student"
    });
  }
});

// DELETE student
app.delete("/student/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error deleting student"
    });
  }
});

app.get("/test-save", async (req, res) => {
  const user = await User.create({
    name: "Test User",
    email: "test@gmail.com",
    role: "student"
  });

  res.json(user);
});

app.post("/add-assignment", async (req, res) => {
  try {

    const title = req.body.title?.trim();
const description = req.body.description?.trim();
const teacherId = req.body.teacherId;
const teacherName = req.body.teacherName;

    if (!title || !description) {
      return res.json({
        success:false,
        message:"All fields required"
      });
    }

    const newAssignment = await Assignment.create({
  title,
  description,
  teacherId,
  teacherName
});

    res.json({
      success:true,
      assignment:newAssignment
    });

  } catch(err) {
    res.status(500).json({
      success:false,
      message:"Error saving assignment"
    });
  }
});

app.get("/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });

    res.json({ assignments });

 } catch (err) {
  res.status(500).json({
    success: false,
    message: "Error loading assignments"
  });
}
});

app.delete("/assignment/:id", async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error deleting assignment"
    });
  }
});
//new multer
app.post("/submit-assignment", upload.single("file"), async (req, res) => {
  try {
    const studentName = req.body.studentName?.trim();
const assignmentTitle = req.body.assignmentTitle?.trim();

if (!studentName || !assignmentTitle || !req.file) {
  return res.json({
    success: false,
    message: "All fields required"
  });
}
    const newSubmission = await Submission.create({
      studentName,
      assignmentTitle,
      fileName: req.file.filename,
      filePath: "/uploads/" + req.file.filename
    });

    res.json({
      success: true,
      submission: newSubmission
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Upload failed"
    });
  }
});


//lolo
app.get("/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });

    res.json({ submissions });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error loading submissions"
    });
  }
});

//delete aassin f student

app.delete("/submission/:id", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });
    }

    // delete file from uploads folder
    const filePath = path.join(__dirname, submission.filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Submission.findByIdAndDelete(req.params.id);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
});
//upload teach
app.post("/upload-material", upload.single("file"), async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title || !req.file) {
      return res.json({
        success: false,
        message: "All fields required"
      });
    }

    const newMaterial = await Material.create({
      title,
      fileName: req.file.filename,
      filePath: "/uploads/" + req.file.filename
    });

    res.json({
      success: true,
      material: newMaterial
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Upload failed"
    });
  }
});

app.get("/materials", async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.json({ materials });
  } catch (err) {
    res.status(500).json({ success:false, message:"Error loading materials" });
  }
});

app.delete("/material/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ success:false });
    }

    const filePath = path.join(__dirname, material.filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Material.findByIdAndDelete(req.params.id);

    res.json({ success:true });

  } catch (err) {
    res.status(500).json({
      success:false,
      message:"Delete failed"
    });
  }
});

app.post("/update-game-data", async (req, res) => {
  try {
    const { email, gameStars, totalPoints, totalPlayed } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        gameStars: 0,
        kidsStars: 0,
        totalStars: 0,
        totalPoints: 0,
        totalPlayed: 0
      });
    }

    const kidsStars = user.kidsStars || 0;
    const totalStars = kidsStars + gameStars;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        gameStars,
        totalPoints,
        totalPlayed,
        totalStars
      },
     { returnDocument: "after" }
    );

    res.json({
      success: true,
      user: updatedUser
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Save failed"
    });
  }
});

//profile ke liye 
app.post("/save-profile-image", async (req, res) => {
  try {
    const { email, image } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { profileImage: image },
      { returnDocument: "after" }
    );

    res.json({
      success: true,
      user
    });

  } catch (err) {
    res.json({ success: false });
  }
});
//admin


app.post("/admin-login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await AdminModel.findOne({
    username,
    password
  });

  if (admin) {
    return res.json({
      success: true,
      role: "admin"
    });
  }

  res.json({
    success: false,
    message: "Invalid admin login"
  });
});

// GET teachers
app.get("/admin-teachers", async (req, res) => {
  const teachers = await Teacher.find().sort({ createdAt: -1 });
  res.json({ teachers });
});


// ADD teacher
app.post("/add-teacher", async (req, res) => {
  try {
    const { name, email, username, password, status } = req.body;

    const teacher = await Teacher.create({
      name,
      email,
      username,
      password,
      status
    });

    res.json({
      success: true,
      teacher
    });

  } catch (err) {
    res.json({
      success: false,
      message: "Error adding teacher"
    });
  }
});


// DELETE teacher
app.delete("/teacher/:id", async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id);

  res.json({
    success: true
  });
});


app.put("/update-teacher/:id", async (req, res) => {
  try {
    await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
     { returnDocument: "after" }
    );

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false });
  }
});

//admin stu
app.get("/admin-students", async (req, res) => {
  try {

    const students = await User.find({
      role: "student"
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      students
    });

  } catch (err) {
    res.json({
      success: false
    });
  }
});


app.delete("/delete-student/:id", async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true
    });

  } catch (err) {
    res.json({
      success: false
    });
  }
});

// GET LOGIN HISTORY
app.get("/login-history", async (req, res) => {
  try {
    const logs = await LoginHistory.find().sort({ loginTime: -1 });
    res.json({ success: true, logs });
  } catch (err) {
    res.json({ success: false, logs: [] });
  }
});

// LOGOUT USER
app.post("/logout-user", async (req, res) => {
  try {
    const { logId } = req.body;

    await LoginHistory.findByIdAndUpdate(logId, {
      logoutTime: new Date(),
      status: "Inactive"
    });

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false });
  }
});



app.get("/reset-login-history", async (req, res) => {
  try {

    await LoginHistory.updateMany(
      {},
      {
        status: "Offline",
        logoutTime: new Date()
      }
    );

    res.send("✅ All login history set to Offline");

  } catch (err) {
    res.send("❌ Failed");
  }
});
//admin msg 
app.post("/send-message", async (req, res) => {
  try {

    const { name, email, msg } = req.body;

    await Message.create({
      name,
      email,
      msg
    });

    res.json({
      success: true
    });

  } catch (err) {
    res.json({
      success: false
    });
  }
});


app.get("/admin-messages", async (req, res) => {
  try {

    const messages = await Message.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      messages
    });

  } catch (err) {
    res.json({
      success: false,
      messages: []
    });
  }
});


app.delete("/delete-message/:id", async (req, res) => {
  try {

    await Message.findByIdAndDelete(req.params.id);

    res.json({
      success: true
    });

  } catch (err) {
    res.json({
      success: false
    });
  }
});
//msg
app.post("/contact-message", async (req, res) => {
  try {

    const { name, email, msg } = req.body;

    if (!name || !email || !msg) {
      return res.json({
        success: false
      });
    }

    await Message.create({
      name,
      email,
      msg
    });

    res.json({
      success: true
    });

  } catch (err) {
    console.log("CONTACT ERROR:", err);
    res.json({
      success: false
    });
  }
});

// GET CLASSES
app.get("/classes-status", async (req, res) => {
  try {

    let classes = await ClassModel.find();
    res.json({
      success: true,
      classes
    });

  } catch (err) {
    res.json({
      success: false,
      classes: []
    });
  }
});

// TOGGLE CLASS
app.post("/toggle-class", async (req, res) => {
  try {

    const { id } = req.body;

    const cls = await ClassModel.findById(id);

    const newStatus =
      cls.status === "Active"
      ? "Inactive"
      : "Active";

    await ClassModel.findByIdAndUpdate(id, {
      status: newStatus
    });

    res.json({
      success: true
    });

  } catch (err) {
    res.json({
      success: false
    });
  }
});

//admin game control
// GET ALL GAMES
app.get("/games-status", async (req,res)=>{

 const games = await GameModel.find();
 res.json({success:true,games});

});

//error game sln
app.get("/api/games", async (req, res) => {
  try {
    const games = await GameModel.find();
    res.json(games);
  } catch (err) {
    res.status(500).json([]);
  }
});

// TOGGLE GAME
app.post("/toggle-game", async (req,res)=>{

 const {id} = req.body;

 const game = await GameModel.findById(id);

 const newStatus =
 game.status === "Enabled"
 ? "Disabled"
 : "Enabled";

 await GameModel.findByIdAndUpdate(id,{
   status:newStatus
 });

 res.json({success:true});

});
//pass chng
app.post("/change-admin-password", async (req,res)=>{

 const { currentPassword, newPassword } = req.body;

 const admin = await AdminModel.findOne();

 if(!admin){
   return res.json({
     success:false,
     message:"Admin not found"
   });
 }

 if(admin.password !== currentPassword){
   return res.json({
     success:false,
     message:"Current password wrong"
   });
 }

 admin.password = newPassword;
 await admin.save();

 res.json({
   success:true,
   message:"Password changed permanently"
 });
});

//otp 
app.post("/send-admin-otp", async (req, res) => {

  const { email } = req.body;

 if (email !== process.env.ADMIN_EMAIL) {
    return res.json({
      success: false,
      message: "Please enter correct Gmail"
    });
  }

  adminOTP = Math.floor(100000 + Math.random() * 900000).toString();
  otpEmail = email;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Smart Kids Admin OTP",
    text: "Your OTP is: " + adminOTP
  });

  res.json({
    success: true,
    message: "OTP sent successfully"
  });

});
//ot2 
app.post("/reset-admin-password", async (req, res) => {

  const { email, otp, newPassword } = req.body;

  if (email !== otpEmail || otp !== adminOTP) {
    return res.json({
      success: false,
      message: "Invalid OTP"
    });
  }

  const admin = await AdminModel.findOne();

  if (!admin) {
    return res.json({
      success: false,
      message: "Admin not found"
    });
  }

  admin.password = newPassword;
  await admin.save();

  adminOTP = "";
  otpEmail = "";

  res.json({
    success: true,
    message: "Password reset successful"
  });

});
//o v
app.post("/verify-admin-otp", async (req, res) => {

  const { email, otp } = req.body;

  if (email !== otpEmail || otp !== adminOTP) {
    return res.json({
      success: false,
      message: "Invalid OTP"
    });
  }

  res.json({
    success: true,
    message: "OTP Verified"
  });

});



// =============================
// 🚀 START SERVER
// =============================

app.listen(PORT, () => {
 console.log(`🚀 Server running on port ${PORT}`);
});