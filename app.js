const express = require('express')
const { engine } = require('express-handlebars')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')
// require('dotenv').config()

const app = express()
const PORT = 3000
const SECRET = process.env.SECRET || 'skibidibopbopbopyesyesyes'

// initialize handlebars engine
app.engine('handlebars', engine({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, 'views', 'partials'),
}))

app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

// middlewares
app.disable('x-powered-by')

app.use(cookieParser(SECRET))

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: SECRET, // In production, use environment variable
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true
    }
}))

app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    // Copy flash from session to res.locals (accessible in views)
    if (req.session.flash) {
        res.locals.flash = req.session.flash

        // Clear flash from session after copying
        req.session.flash = null
    } else {
        // Initialize empty flash if none exists
        res.locals.flash = {}
    }

    // Copy themes to res.locals
    if (req.signedCookies.theme) {
        res.locals.theme = req.signedCookies.theme
    } else {
        res.locals.theme = 'light'
    }

    next()
})

app.use((req, res, next) => {
    req.setFlash = (type, message) => {
        req.session.flash = req.session.flash || {}
        req.session.flash[type] = message
    }

    next()
})

// authentication middleware function
const checkAuth = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/login')
    }
}

// data
const users = {
    "admin": {
        username: "admin",
        password: "password123",
        fullName: "System Administrator",
        email: "admin@university.edu",
        bio: "Managing the campus network infrastructure."
    },
    "student_dev": {
        username: "student_dev",
        password: "dev_password",
        fullName: "Jane Developer",
        email: "jane.d@student.edu",
        bio: "Full-stack enthusiast and coffee drinker."
    }
};

// home route
app.get('/', (req, res) => {
    res.status(200).render('home')
})

// login route
app.get('/login', (req, res) => {
    res.status(200).render('login')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body

    if (users.admin.username === username && users.admin.password === password) {
        req.session.user = users.admin
    }
    else if (users.student_dev.username === username && users.student_dev.password === password) {
        req.session.user = users.student_dev
    }
    else {
        req.setFlash('error', 'Login failed! Incorrect username or password.')
        res.status(202)
        return res.redirect('/login')
    }
    
    req.setFlash('success', 'Login successful!')
    res.status(202)
    return res.redirect('/profile')
})

// logout route
app.get('/logout', (req, res) => {
    req.session.destroy()
    res.clearCookie('connect.sid')
    res.redirect('/login')
})

// profile route
app.get('/profile', checkAuth, (req, res) => {
    const context = req.session.user
    res.status(200).render('profile', context)
})

// toggle theme route
app.get('/toggle-theme', (req, res) => {
    const theme = req.signedCookies.theme

    // toggle between light and dark
    if(theme === 'light') {
        res.cookie('theme', 'dark', {signed: true, httpOnly: true, maxAge: 1000 * 60 * 60 * 24})
    }
    else {
        res.cookie('theme', 'light', {signed: true, httpOnly: true, maxAge: 1000 * 60 * 60 * 24})
    }

    res.redirect('/')
})

// catch-all
app.use((req, res) => {
    res.status(404)
    res.render('404')
})

// error catcher
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500)
    res.render('500')
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))