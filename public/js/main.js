const socket = io();

socket.on('connect', () => {
  const { name, room } = $.deparam(window.location.search);
  socket.emit('clientConnection', {
    name, room
  })
})

socket.on("fromServer", msg => {
  let template = $("#message-template").html();
  let html = Mustache.render(template, {
    from: msg.from,
    createdAt: moment(msg.createdAt).format('h:mm a'),
    content: msg.content
  })
  $("#messages").append(html);
})

socket.on('disconnect', () => {
  console.log("Disconect !!!")
})

$("#message-form").on("submit", (e) => {
  e.preventDefault();
  const { name } = $.deparam(window.location.search);

  socket.emit("clientMessage", {
    from: name,
    content: $("[name=message]").val(),
    createdAt: new Date()
  })

  $("[name=message]").val("")
})

$("#send-location").on("click", () => {
  const { name } = $.deparam(window.location.search);
  if (!navigator.geolocation) return alert("Your browser does not support GEOLOCATION")

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit("sendLocation", {
      from: name,
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

socket.on("userList", msg => {
  const { userList } = msg
  const olTag = $('<ol></ol>')
  userList.forEach(user => {
    const liTag = $(`<li>${user.name}</li>`)
    olTag.append(liTag)
  })

  $("#users").html(olTag)
})