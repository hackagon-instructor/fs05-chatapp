const generateMessage = (from, content) => {
  return {
    from,
    content,
    createdAt: new Date()
  }
}

const generateLocation = (from, lat, lng) => {
  console.log("TCL: generateLocation -> from, lat, lng", from, lat, lng)
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
    createdAt: new Date()
  }
}

module.exports = {
  generateMessage, generateLocation
}