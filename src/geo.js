var geoip = require('geoip-lite')
const externalip = require('externalip')

/*

const externalIp = new Promise((res, error) => {
  externalip(function(err, ip) {
    res(ip)
  });
})
  



externalIp.then((res) => {
  console.log(res)
  var city = geoip.lookup(res).city
 // console.log(city)
}).catch((err) => {
	console.log('error', err)
})


var ip = '84.195.172.217'
var c = geoip.lookup(ip).city
console.log('c', c)
*/


var ip = ' 84.195.172.217'

  const city = new Promise((res, error) => {
    // console.log(ip)
    res(geoip.lookup(ip.trim()).city)
  })


city.then((res) => {
    console.log('res', res)
}).catch((err) => {
  // console.log('error', err)
 })


//getCity(ip)
