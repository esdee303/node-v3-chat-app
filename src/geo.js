var geoip = require('geoip-lite')
const externalip = require('externalip')



const externalIp = new Promise((res, error) => {
  externalip(function(err, ip) {
    res(ip)
  });
})
  



externalIp.then((res) => {
  console.log(res)
  var city = geoip.lookup(res).city
  console.log(city)
}).catch((err) => {
	console.log('error', err)
})