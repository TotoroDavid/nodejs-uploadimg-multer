const express = require('express')
const ejs = require('ejs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

//-----initialization
const app = express()

//------setting 
app.set('port', 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
const multer = require('multer')


//------middlewares
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/upload'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname).toLocaleLowerCase)
    }
})

app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/upload'),
    limits: { fieldSize: 100000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname))
        if (mimetype && extname) {
            return cb(null, true)
        }
        cb('error:the file is not valid')
    }
}).single('image'))


//-----route
app.use(require('./routes/index.route'))

// ----static files 
app.use(express.static(path.join(__dirname, 'public')))

//-------start the server 
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`)
})