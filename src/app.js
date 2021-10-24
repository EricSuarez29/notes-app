const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
// Initializations
const app = express();
require('./database');
require('./config/passport');
require('./config/config')

// Settings

app.set('port', process.env.PORT);
app.set('views', path.resolve(__dirname, './views'));
app.engine('.hbs', hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

// Middlewares

app.use(express.urlencoded({extended: false})); // sirve para entender las peticiones de tipo url-encoder
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables

app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
    next();
});

// Routes

app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// Static Files

app.use(express.static(path.resolve(__dirname, './public')));

// Server is Listenning

app.listen(app.get('port'), ()=>{
    console.log(`Server on port ${app.get('port')}`);
});