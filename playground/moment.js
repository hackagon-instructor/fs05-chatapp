const moment = require('moment');

const time = Date.now();

console.log(time)
console.log(moment(time).format('h:mm a'))