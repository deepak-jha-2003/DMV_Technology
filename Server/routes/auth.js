const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const passport = require('../config/passport');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Password validation function
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
        return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!hasUpperCase) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!hasLowerCase) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!hasNumbers) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }
    if (!hasSpecialChar) {
        return { isValid: false, message: 'Password must contain at least one special character' };
    }
    
    return { isValid: true };
};

// Email configuration
const transporter = nodemailer.createTransport({
    // Option 1: Gmail (requires app password)
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    
    // Option 2: Outlook/Hotmail
    // service: 'hotmail',
    // auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    // }
    
    // Option 3: Custom SMTP (like SendGrid, Mailgun, etc.)
    // host: 'smtp.sendgrid.net',
    // port: 587,
    // secure: false,
    // auth: {
    //     user: 'apikey',
    //     pass: process.env.SENDGRID_API_KEY
    // }
});

// Create password reset tokens table if it doesn't exist
const createPasswordResetTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            token VARCHAR(255) NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            used BOOLEAN DEFAULT FALSE
        )
    `;
    
    db.query(query, (err) => {
        if (err) {
            console.error('Error creating password_reset_tokens table:', err);
        } else {
            console.log('Password reset tokens table ready');
        }
    });
};

// Initialize the password reset table
createPasswordResetTable();

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    // Input validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    
    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return res.status(400).json({ error: passwordValidation.message });
    }

    try {
        // Check if user already exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error occurred' });
            }
            
            if (result.length > 0) {
                return res.status(409).json({ error: 'An account with this email already exists' });
            }

            // Hash password
            const saltRounds = 12; // Increased from 10 for better security
            const hashed = await bcrypt.hash(password, saltRounds);
            
            // Insert new user
            db.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
                [name, email, hashed], 
                (err, result) => {
                    if (err) {
                        console.error('Signup error:', err);
                        return res.status(500).json({ error: 'Failed to create account. Please try again.' });
                    }
                    
                    res.status(201).json({ 
                        message: 'Account created successfully! You can now sign in.',
                        userId: result.insertId
                    });
                }
            );
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password, rememberMe } = req.body;
    
    // Input validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    try {
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error occurred' });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = results[0];
            
            try {
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                // Set token expiration based on remember me
                const tokenExpiry = rememberMe ? '30d' : '1d';
                
                const token = jwt.sign(
                    { 
                        id: user.id, 
                        email: user.email, 
                        name: user.name 
                    }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: tokenExpiry }
                );
                
                res.status(200).json({ 
                    message: 'Sign in successful', 
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    },
                    expiresIn: tokenExpiry
                });
            } catch (compareError) {
                console.error('Password comparison error:', compareError);
                res.status(500).json({ error: 'Authentication error' });
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Forgot Password - Send reset email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    try {
        // Check if user exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error occurred' });
            }
            
            // Always return success message for security (don't reveal if email exists)
            if (results.length === 0) {
                return res.status(200).json({ 
                    message: 'If an account with this email exists, you will receive a password reset link.' 
                });
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Store reset token in database
            db.query(
                'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
                [email, hashedToken, expiresAt],
                async (err) => {
                    if (err) {
                        console.error('Error storing reset token:', err);
                        return res.status(500).json({ error: 'Failed to process reset request' });
                    }

                    // Create reset URL
                    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${email}`;

                    // Email content
                    const mailOptions = {
                        from: process.env.EMAIL_USER || 'noreply@dmvtechnology.com',
                        to: email,
                        subject: 'Password Reset Request - DMV Technology',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #2563eb;">Password Reset Request</h2>
                                <p>Hello,</p>
                                <p>We received a request to reset your password for your DMV Technology account.</p>
                                <p>Click the button below to reset your password:</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${resetURL}" 
                                       style="background-color: #2563eb; color: white; padding: 12px 24px; 
                                              text-decoration: none; border-radius: 6px; display: inline-block;">
                                        Reset Password
                                    </a>
                                </div>
                                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                                <p style="word-break: break-all; color: #2563eb;">${resetURL}</p>
                                <p><strong>This link will expire in 10 minutes for security reasons.</strong></p>
                                <p>If you didn't request this password reset, please ignore this email.</p>
                                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                                <p style="color: #6b7280; font-size: 14px;">
                                    Best regards,<br>
                                    DMV Technology Team
                                </p>
                            </div>
                        `
                    };

                    // Send email
                    try {
                        await transporter.sendMail(mailOptions);
                        res.status(200).json({ 
                            message: 'If an account with this email exists, you will receive a password reset link.',
                            // For development only - remove in production
                            ...(process.env.NODE_ENV === 'development' && { resetURL })
                        });
                    } catch (emailError) {
                        console.error('Email sending error:', emailError);
                        // Delete the token since email failed
                        db.query('DELETE FROM password_reset_tokens WHERE email = ? AND token = ?', [email, hashedToken]);
                        res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
                    }
                }
            );
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset Password - Verify token and update password
router.post('/reset-password', async (req, res) => {
    const { token, email, newPassword } = req.body;
    
    if (!token || !email || !newPassword) {
        return res.status(400).json({ error: 'Token, email, and new password are required' });
    }
    
    // Password validation
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
        return res.status(400).json({ error: passwordValidation.message });
    }

    try {
        // Hash the token to compare with database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        // Find valid reset token
        db.query(
            'SELECT * FROM password_reset_tokens WHERE email = ? AND token = ? AND expires_at > NOW() AND used = FALSE ORDER BY created_at DESC LIMIT 1',
            [email, hashedToken],
            async (err, tokenResults) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error occurred' });
                }
                
                if (tokenResults.length === 0) {
                    return res.status(400).json({ error: 'Invalid or expired reset token' });
                }

                // Verify user exists
                db.query('SELECT * FROM users WHERE email = ?', [email], async (err, userResults) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Database error occurred' });
                    }
                    
                    if (userResults.length === 0) {
                        return res.status(404).json({ error: 'User not found' });
                    }

                    try {
                        // Hash new password
                        const saltRounds = 12;
                        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
                        
                        // Update user password
                        db.query(
                            'UPDATE users SET password = ? WHERE email = ?',
                            [hashedPassword, email],
                            (err, result) => {
                                if (err) {
                                    console.error('Password update error:', err);
                                    return res.status(500).json({ error: 'Failed to update password' });
                                }
                                
                                if (result.affectedRows === 0) {
                                    return res.status(404).json({ error: 'User not found' });
                                }

                                // Mark token as used
                                db.query(
                                    'UPDATE password_reset_tokens SET used = TRUE WHERE email = ? AND token = ?',
                                    [email, hashedToken],
                                    (err) => {
                                        if (err) {
                                            console.error('Token update error:', err);
                                        }
                                    }
                                );

                                res.status(200).json({ 
                                    message: 'Password reset successful! You can now sign in with your new password.' 
                                });
                            }
                        );
                    } catch (hashError) {
                        console.error('Password hashing error:', hashError);
                        res.status(500).json({ error: 'Failed to process password reset' });
                    }
                });
            }
        );
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Protected profile route
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: 'Protected profile data', user: req.user });
});

// Change password (for logged-in users)
router.post('/change-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    // Password validation
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
        return res.status(400).json({ error: passwordValidation.message });
    }

    try {
        // Get user's current password
        db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error occurred' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = results[0];
            
            try {
                // Verify current password
                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    return res.status(400).json({ error: 'Current password is incorrect' });
                }

                // Hash new password
                const saltRounds = 12;
                const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
                
                // Update password
                db.query(
                    'UPDATE users SET password = ? WHERE id = ?',
                    [hashedNewPassword, userId],
                    (err, result) => {
                        if (err) {
                            console.error('Password update error:', err);
                            return res.status(500).json({ error: 'Failed to update password' });
                        }
                        
                        res.status(200).json({ message: 'Password changed successfully' });
                    }
                );
            } catch (compareError) {
                console.error('Password comparison error:', compareError);
                res.status(500).json({ error: 'Authentication error' });
            }
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test email endpoint (for development only)
router.post('/test-email', async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ error: 'Test endpoint only available in development' });
    }

    const { to } = req.body;
    if (!to) {
        return res.status(400).json({ error: 'Email address required' });
    }

    try {
        const testEmail = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'DMV Technology - Email Test',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Email Configuration Test</h2>
                    <p>Hello!</p>
                    <p>If you're reading this, your email configuration is working correctly!</p>
                    <p>✅ SMTP connection successful</p>
                    <p>✅ Authentication successful</p>
                    <p>✅ Email delivery successful</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px;">
                        This is a test email from DMV Technology Server<br>
                        Timestamp: ${new Date().toISOString()}
                    </p>
                </div>
            `
        };

        await transporter.sendMail(testEmail);
        res.status(200).json({ message: 'Test email sent successfully!' });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ 
            error: 'Failed to send test email', 
            details: error.message 
        });
    }
});

// OAuth Routes

// Google OAuth
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173' }),
    (req, res) => {
        console.log('Google OAuth callback - User:', req.user);
        
        // Successful authentication
        const user = req.user;
        
        if (!user) {
            console.error('Google OAuth callback - No user found');
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=no_user`);
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                name: user.name 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        
        console.log('Google OAuth callback - Token generated:', token.substring(0, 20) + '...');
        
        // Redirect to frontend with token
        const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }))}`;
        
        console.log('Google OAuth callback - Redirecting to:', redirectUrl);
        res.redirect(redirectUrl);
    }
);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173' }),
    (req, res) => {
        // Successful authentication
        const user = req.user;
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                name: user.name 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        
        // Redirect to frontend with token
        const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }))}`;
        
        res.redirect(redirectUrl);
    }
);

// OAuth logout
router.post('/logout', authMiddleware, (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Signed out successfully' });
        });
    });
});

module.exports = router;
