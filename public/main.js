$(document).ready(function () {
    $("#hidden").hide();
    var username = prompt("What is your name?");
    var socket = io.connect();
    var name;
    if (username) {
        $("#hidden").show();
        name = username
        // console.log("name:" + name)
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
        socket.on('updated_message', function (data) {
            if (data.message != ""){
                $("#messages").append("<tr><td class='font-weight-bold'>" + data.name + ":</td><td>" + data.message + "</td></tr>");
            }
        });
    }
    else if (username == "") {
        alert("YOU MUST ENTER A NAME! THIS WEBPAGE WILL RELOAD AFTER YOUR PRESS 'OK'");
        location.reload();
    }
});