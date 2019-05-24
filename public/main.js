$(document).ready(function () {
    $("#hidden").hide();
    var username = prompt("What is your name?");
    var socket = io.connect();
    var name;
    if (username) {
        $("#hidden").show();
        name = username
        var rand1 = Math.floor(Math.random() * 256);
        var rand2 = Math.floor(Math.random() * 256);
        var rand3 = Math.floor(Math.random() * 256);
        socket.emit("new_user", {
            name: name
        });
        $('#forms').submit(function () {
            socket.emit("createmessage", {
                message: $("#message").val(),
                name: name
            });
            $("#message").val("");
            return false
        });
        socket.on('updatedmessage', function (data) {
            if (data.message != ""){
                $("#messages").append("<tr><td class='font-weight-bold' style='color: rgb(" + rand1 + ", " + rand2 + "," + rand3 + ");'>" + data.name + ":</td><td>" + data.message + "</td></tr>");
            }
        });
    }
    else if (username == "") {
        alert("A name is needed to send messages! This page will refresh after clicking 'OK'");
        location.reload();
    }
});