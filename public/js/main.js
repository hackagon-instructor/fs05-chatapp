const socket = io();

socket.on('connect', () => {
  console.log("Welcome to the chat app")
})


socket.on("fromServer", msg => {
  const olTag = $("#messages");

  let liTag = $(`<li>${msg.content}</li>`)
  olTag.append(liTag)
})

socket.on('disconnect', () => {
  console.log("Disconect !!!")
})

$("#message-form").on("submit", (e) => {
  e.preventDefault();

  socket.emit("clientMessage", {
    from: "User",
    content: $("[name=message]").val(),
    createdAt: new Date()
  })

  $("[name=message]").val("")
})

$("#send-location").on("click", () => {
  if (!navigator.geolocation) return alert("Your browser does not support GEOLOCATION")

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit("sendLocation", {
      from: "User",
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  })
})

socket.on("sendLocationToOthers", msg => {
  const olTag = $("#messages");

  let liTag = $(`<li></li>`)
  let aTag = $(`<a>My location</a>`)
  aTag.attr("href", msg.url)
  aTag.attr("target", "_blank")
  liTag.append(aTag)

  olTag.append(liTag)
})