$(document).ready(async function() {
    var socket = io.connect(sessionStorage.getItem("address"))
    socket.emit("getPublicRooms")
    socket.on("publicRooms", (response) => {
        console.log(response)
    })
})