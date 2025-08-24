import * as as from "../services/authService.js";
import { sendVerificationEmail } from "../services/emailService.js";
import { addUser, deleteToken, findByToken, verifyUser, findByEmail } from "../services/userService.js";

export async function register(req, res) {
    const { fullname, username, email, password: plainPassword } = req.body;

    try {
        const existingUser = await findByEmail(email);

        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const userId = await addUser({ fullname, username, email, plainPassword });
        
        const user = await findByEmail(email);
        
        await sendVerificationEmail(user);

        res.status(201).json({ message: "User registered successfully. Please check your email for verification.", userId });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.is_verified) {
            await sendVerificationEmail(user);
            return res.status(403).json({ error: 'Email not verified. A new verification email has been sent.' });
        }

        const token = await as.login({ email, password });
        return res.json({ message: 'Login successful', token });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function verifyEmail(req, res) {
    const { token } = req.query;
    
    try {
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }
        
        const user = await findByToken(token);
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid Verification Token' })
        }
        
        await verifyUser(user.id);
        await deleteToken(user.id);

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' })
    }
}