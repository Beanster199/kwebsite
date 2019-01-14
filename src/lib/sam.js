module.exports = {   
    // /If user is not logged in redirect to /login
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()){
            return next();
        }
    } 
}