const jwt = require('jsonwebtoken')
// Middleware để xác minh token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Token is not valid" });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ error: "You are not authenticated" });
    }
};

// Middleware để xác minh token và phân quyền admin
const verifyAdminAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Token is not valid" });
            }
            if (decoded.role !== 'admin') {
                return res.status(403).json({ error: "Unauthorized access" });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ error: "You are not authenticated" });
    }
};

// Middleware để xác minh token và phân quyền staff
const verifyStaffAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Token is not valid" });
            }
            if (decoded.role !== 'staff') {
                return res.status(403).json({ error: "Unauthorized access" });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ error: "You are not authenticated" });
    }
};

// Middleware để xác minh token và phân quyền customer
const verifyCustomerAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Token is not valid" });
            }
            if (decoded.role !== 'customer') {
                return res.status(403).json({ error: "Unauthorized access" });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ error: "You are not authenticated" });
    }
};

module.exports = {
    verifyToken,
    verifyAdminAuth,
    verifyStaffAuth,
    verifyCustomerAuth
};
