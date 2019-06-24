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
let users = [];

app.get('/', function (req, res) {
    console.log("Session ID:", req.sessionID);
    res.render("login");
})

app.post('/chat', function (req, res) {
    var rand1 = Math.floor(Math.random() * 256),
        rand2 = Math.floor(Math.random() * 256),
        rand3 = Math.floor(Math.random() * 256);
    var randcol = "color: rgb(" + rand1 + ", " + rand2 + "," + rand3 + ");";
    req.session.color = randcol;
    req.session.body = req.body;
    console.log(req.session.color, "Username: " + req.session.body.username);
    res.redirect("/chat");
})

app.get('/chat', function (req, res) {
    if(req.session.body == undefined){
        res.render("login");
    }
    res.render("index", { color: req.session.color, body: req.session.body, key: messages });
})

const server = app.listen(8000, function () {
    console.log("Listening on port 8000");
});

// socket.io
const io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {

    users.push(socket.id);
    console.log("Socket ID:", socket.id);
    console.log("Current Users: ", users);

    socket.on('disconnect', function () {
        console.log('User Disconnected:', socket.id);
        for (var i = 0; i < users.length; i++) {
            if (users[i] == socket.id) {
                users.splice(i, 1);
            }
        }
        console.log("Current Users: ", users);
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