const { changePasswordService, sendResetEmail, resetPasswordService } = require('../services/authService')
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        await changePasswordService(userId, currentPassword, newPassword);

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Send reset email
        const resetToken = await sendResetEmail(email);
        console.log(resetToken);

        // Return success response
        return res.status(200).json({ message: 'Reset email sent successfully', resetToken });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send reset email' });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const result = await resetPasswordService(token, newPassword);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to reset password' });
    }
};
module.exports = {
    changePassword, forgotPassword, resetPassword
}