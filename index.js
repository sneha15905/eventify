const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Backend', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Define route to serve static files
app.use(express.static(path.join(__dirname, 'eventreg1')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/loginp.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'loginp.html'));
});
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});
app.get('/2ndpage.html', (req, res) => {
    res.sendFile(path.join(__dirname, '2ndpage.html'));
});
app.get('/student_cultural_registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'student_cultural_registration.html'));
});
app.get('/student_sports_registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'student_sports_registration.html'));
});
app.get('/student_technical_registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'student_technical_registration.html'));
});
app.get('/postreg.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'postreg.html'));
});
app.get('/upevents.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'upevents.html'));
});
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/achi.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'achi.html'));
});
app.get('/pricing.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pricing.html'));
});





app.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ fullName, email, passwordHash: hashedPassword });

        // Save the user to the database
        await user.save();

        // Respond with success message
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error('Error saving user:', err);
        // Respond with error message
        res.status(500).json({ success: false, message: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user with the provided email
        const user = await User.findOne({ email });
        if (!user) {
            // User not found
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        // Compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            // Passwords do not match
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        // User authenticated successfully
        res.status(200).json({ success: true, message: 'User authenticated successfully' });
    } catch (err) {
        console.error('Error during login:', err);
        // Respond with error message
        res.status(500).json({ success: false, message: 'Error during login' });
    }
});

const studentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    collegeName: { type: String, required: true },
    branch: { type: String, required: true },
    event: { type: String, required: true },
    paymentMethod: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// Define route to serve static files
app.use(express.static(path.join(__dirname, 'eventreg1')));

app.post('/sportsreg', async (req, res) => {
    const userId = req.userId; // Extract the user's identifier from the request (assuming it's stored in req.userId)
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const { name, email, phone, dob, collegeName, branch, event, paymentMethod } = req.body;

    try {
        // Create a new student registration associated with the logged-in user
        const student = new Student({ 
            userId,
            name, 
            email, 
            phone, 
            dob, 
            collegeName, 
            branch, 
            event, 
            paymentMethod 
        });

        // Save the student registration to the database
        await student.save();

        // Respond with success message
        res.status(201).json({ success: true, message: 'Student registered successfully' });
    } catch (err) {
        console.error('Error saving student registration:', err);
        // Respond with error message
        res.status(500).json({ success: false, message: 'Error registering student' });
    }
});


app.post('/techreg', async (req, res) => {
    const userId = req.userId; // Extract the user's identifier from the request (assuming it's stored in req.userId)
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const { name, email, phone, dob, college_name, branch, event, payment_method } = req.body;

    try {
        // Create a new student registration associated with the logged-in user
        const student = new Student({ 
            userId,
            name, 
            email, 
            phone, 
            dob, 
            collegeName: college_name, 
            branch, 
            event, 
            paymentMethod: payment_method 
        });

        // Save the student registration to the database
        await student.save();

        // Respond with success message
        res.status(201).json({ success: true, message: 'Student registered successfully' });
    } catch (err) {
        console.error('Error saving student registration:', err);
        // Respond with error message
        res.status(500).json({ success: false, message: 'Error registering student' });
    }
});

app.post('/culturalreg', async (req, res) => {
    const userId = req.userId; // Extract the user's identifier from the request (assuming it's stored in req.userId)
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const { name, email, phone, dob, college_name, branch, event, payment_method } = req.body;

    try {
        // Create a new student registration associated with the logged-in user
        const student = new Student({ 
            userId,
            name, 
            email, 
            phone, 
            dob, 
            collegeName: college_name, 
            branch, 
            event, 
            paymentMethod: payment_method 
        });

        // Save the student registration to the database
        await student.save();

        // Respond with success message
        res.status(201).json({ success: true, message: 'Student registered successfully' });
    } catch (err) {
        console.error('Error saving student registration:', err);
        // Respond with error message
        res.status(500).json({ success: false, message: 'Error registering student' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
