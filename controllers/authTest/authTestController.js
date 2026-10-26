const getMyProfile = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Authentication successful",
        data: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            status: req.user.status
        }
    });
};

module.exports = { getMyProfile };
