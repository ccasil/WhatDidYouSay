$(document).ready(function () {
    $("#hidden").hide();
    var username = prompt("What is your name?");
    var socket = io.connect();
    var name;
    var rand1 = Math.floor(Math.random() * 256);
    var rand2 = Math.floor(Math.random() * 256);
    var rand3 = Math.floor(Math.random() * 256);
    var randcol = "color: rgb(" + rand1 + ", " + rand2 + "," + rand3 + ");";
    var color;
    if (username) {
        $("#hidden").show();
        name = username;
        color = randcol;
        socket.emit("new_user", {
            name: name,
            color: color
        });
        $('#forms').submit(function () {
            socket.emit("createmessage", {
                message: $("#message").val(),
                name: name,
                color: color
            });
            $("#message").val("");
            return false
        });
        socket.on('updatedmessage', function (data) {
            if (data.message != ""){
                // $("#messages").append("<tr><td class='font-weight-bold' style='color:" + color + "'>" + data.name + ":</td><td>" + data.message + "</td></tr>");
                $("#messages").append("<tr><td class='font-weight-bold' style='" + data.color + "'>" + data.name + ":</td><td>" + data.message + "</td></tr>");
            }
        });
    }
    else if (username == "") {
        alert("A name is needed to send messages! This page will refresh after clicking 'OK'");
        location.reload();
    }
});