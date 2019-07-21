module.exports = {   
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()){
            console.log('estas logeado')
            next();
        }else{
            console.log('no estas logeado')
            res.redirect('/login')
        }
    },
    NotLoggedIn: (req,res,next) =>{
        if(req.isUnauthenticated()){
            return next()
        }else{
            return res.redirect('/')
        }
    }
}