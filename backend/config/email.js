const nodemailer = require('nodemailer');

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  // Use App Password, not your regular password
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.log('Email service error:', error.message);
    } else {
        console.log('Email service ready');
    }
});

// Send password reset email
const sendPasswordResetEmail = async (to, resetCode) => {
    const mailOptions = {
        from: {
            name: 'Lustre Jewelry',
            address: process.env.EMAIL_USER
        },
        to: to,
        subject: 'Password Reset Code - Lustre Jewelry',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #d4af37; margin: 0;">Lustre Jewelry</h1>
                </div>
                
                <div style="background: #f8f9fa; border-radius: 10px; padding: 30px; text-align: center;">
                    <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
                    <p style="color: #666; font-size: 16px;">
                        You requested to reset your password. Use the code below to proceed:
                    </p>
                    
                    <div style="background: #d4af37; color: #000; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 40px; border-radius: 8px; display: inline-block; margin: 20px 0;">
                        ${resetCode}
                    </div>
                    
                    <p style="color: #999; font-size: 14px; margin-top: 20px;">
                        This code expires in <strong>10 minutes</strong>.
                    </p>
                    <p style="color: #999; font-size: 14px;">
                        If you didn't request this, please ignore this email.
                    </p>
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendPasswordResetEmail };
