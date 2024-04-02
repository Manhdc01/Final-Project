const { changePasswordService } = require('../services/authService')
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
module.exports = {
    changePassword
}