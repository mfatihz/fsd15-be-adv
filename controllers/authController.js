import { v4 as uuidv4 } from "uuid";
import { login as loginService, logout as logoutService } from "../services/authService.js";
import { sendVerificationEmail } from "../services/emailService.js";
import { addUser, deleteToken, findByToken, verifyUser, findByEmail } from "../services/userService.js";

export async function register(req, res) {
    const { fullname, username, email, password: plainPassword } = req.body;

    try {
        const existingUser = await findByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered.'
            });
        }

        const token = uuidv4();
        const userId = await addUser({ fullname, username, email, plainPassword, token });

        await sendVerificationEmail({ email, token });

        const response = {
            success: true,
            message: "User registered successfully. Please check your email for verification.",
            userId
        };

        if (process.env.NODE_ENV === "development") {
            response.dev_register_token = token;
        }

        return res.status(201).json(response);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// GET version: verify-email
export async function checkVerifyToken(req, res) {
    const { token } = req.query;

    try {
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required"
            });
        }

        const user = await findByToken(token);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired verification token"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Token is valid",
            token
        });
    } catch (error) {
        console.error("checkVerifyToken error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// POST version: verify-email
export async function verifyEmail(req, res) {
    const { token } = req.body;
    try {
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required"
            });
        }

        const user = await findByToken(token);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired verification token"
            });
        }

        await verifyUser(user.id);
        await deleteToken(user.id);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        console.error("verifyEmail error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// GET + POST version: verify-email
export async function autoVerifyEmail(req, res) {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Token is required"
        });
    }

    //////////////////////////////////////////////////////////////
    // Forward ke POST
    //////////////////////////////////////////////////////////////
    // token diinject ke body untuk dipakai pada POST
    // NOTE:
    // jika menggunakan middleware express.json(),
    // token tidak bisa diinject langsung pada req seperti berikut ini
    // req.body.token = token;
    // karena req.body sudah diparsing sekali di awal dan dijadikan immutable
    // SALAH SATU solusinya adalah token dikirim menggunakan variabel baru
    const modReq = { body: { token } };
    return verifyEmail(modReq, res);
}

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (!user.is_verified) {
            const token = uuidv4();
            await sendVerificationEmail({ email, token });
            return res.status(403).json({
                success: false,
                message: 'Email not verified. A new verification email has been sent.'
            });
        }

        const token = await loginService({ email, password });
        return res.json({
            success: true,
            message: 'Login successful',
            token
        });
        
    } catch (error) {
        console.error("Login error: ", error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

export async function logout(req, res) {
    try {
        await logoutService({ userId: req.userId });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error: ", error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}