$(document).ready(async function() {
    console.log("here")
    $("#connectForm").submit(function(e) {
        //Fuck a form submit we out here doing dynamic updating
        e.preventDefault()
    })
    $("#connectButton").click(function(){
        let host = $("#connectHost").val()
        let port = parseInt($("#connectPort").val())


        var socket = io.connect(host + ":" + port, {reconnection: false})
        socket.on("connect", function(){ 
            console.log("here")
            sessionStorage.setItem("address", host + ":" + port);
            window.location.href = "/home.html";
        })
    })
    
})
