const express = require("express"),
    path = require("path"),
    session = require("express-session"),
    bodyParser = require('body-parser'),
    app = express();

app.use(session({ 
    secret: 'myname',
    resave: true,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

let messages = [];

app.get('/', function (req, res) {
    console.log("Session ID:", req.sessionID);
    res.render("login");
})

app.post('/chat', function (req, res) {
    req.session.body = req.body;
    console.log("Username:", req.session.body);
    res.redirect("/chat");
})

app.get('/chat', function (req, res) {
    if(req.session.body == undefined){
        res.render("login");
    }
    res.render("index", { body: req.session.body, key: messages });
})

const server = app.listen(8000, function () {
    console.log("Listening on port 8000");
});

// socket.io
const io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {

    console.log("Socket ID:", socket.id);

    socket.on('disconnect', function () {
        console.log('User Disconnected');
    });

    socket.on("createmessage", function (data) {
        let n = data.name;
        let m = data.message;
        let c = data.color;

        messages.push({
            name: n,
            message: m,
            color: c
        });

        io.emit('updatedmessage', {
            name: data.name,
            message: data.message,
            color: data.color,
            allmessages: messages
        });
    })
})