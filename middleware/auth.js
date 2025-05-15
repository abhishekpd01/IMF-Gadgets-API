const { getUser } = require("../service/auth");

function restrictedToLoggedIn(req, res, next) {
    const userUid = req.cookies?.TOKEN;
    if (!userUid) {
        return res.status(401).json({ message: "Access Denied! First Login" });
    }

    const user = getUser(userUid);
    if(!user) {
        return res.status(401).json({ message: "Access Denied!" });
    }
    req.user = user;
    next();
}

module.exports = {restrictedToLoggedIn};