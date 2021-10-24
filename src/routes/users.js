const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res)=>{
    res.render('users/sign-in');
});

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}
));

router.get('/users/signup', (req, res)=>{
    res.render('users/sign-up');
});

router.post('/users/signup', async (req, res)=>{
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    console.log(req.body)
    if(!name){
        errors.push({text: 'Porfavor inserte un nombre'});
    }
    if(password !== confirm_password){
        errors.push({text: 'Las constraseñas no coinciden'})
    }
    if(password.length < 4){
        errors.push({text: 'La contraseña debe ser mayor a 4 caracteres'});
    }
    if(errors.length > 0){
        res.render('users/signup',  { name, email, errors });
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'El email ya esta en uso');
            res.redirect('/users/signup');
        }else{
            const user = new User({name, email, password});
            user.password = await user.encryptPassword(password);
            await user.save();
            req.flash('success_msg', 'Ya estas registrado');
            res.redirect('/users/signin');
        }
    }
});

router.get('/users/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

module.exports = router;