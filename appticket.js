//----------------------------------------------------------------------
// Kerawen © Juillet 2017. (Cavarec JB). TICKET et ENROLL ECRAN CAISSE
// Relais node pour impression de tickets (raspberryPi -> epson tickets).
// ➠ Détection adresse MAC et transformation (uppercase + trim ":")
// ➠ Connection socket au serveur node screen.kerawen.com:3040 
// ➠ enregistrement dans la table liaison macAddress:socketId 
// ➠  Attente de l'évènement d'impression "printkbox" avec les données
// ➠  Requête http vers le serveur php local pour impression  
// Septembre 2017
//----------------------------------------------------------------------
var io = require('socket.io-client');
var request = require('request');
var changeCase = require('change-case');
var fs = require('fs-extra');

require('getmac').getMac(function(err,macAddress){
  if (err)  throw err
    var MACADDRESS = changeCase.upperCase(macAddress).replace(/:/g, '');
    console.log("I AM KBOX:",MACADDRESS);

var socket = io.connect('https://screen.kerawen.com:3050', { secure: true, rejectUnauthorized: false,reconnect: true});
var socket2  = io.connect('https://screen.kerawen.com:3030', { secure: true, rejectUnauthorized: false,reconnect: true});

socket2.on('connect', function() { 
    socket2.emit("urlraspberry",MACADDRESS,function(data){ 

if(data) {
      fs.writeFile('/home/pi/printcart/urll',data.url_longue,function(err) { } )
} else {
	console.log("pas de MACADDRESS dans la table push");
	console.log("necessaire si écran affichage connecté à KBOX");
}
    })
  })

  socket.on('connect', function() { 
      console.log("emit enreg_mac:",MACADDRESS) ;
      console.log("SID:",socket.id) ;
      socket.emit("enreg_mac", MACADDRESS ) ;
  })

   socket.on("printkbox",function(data,fn){
      var data2 = JSON.parse(data);
      request({
        url:"http://127.0.0.1",
        method:"POST",	
        json:true,
        body:data2
      }, function(error,response,body) {
        if (error) { fn('ERREUR:',error); }
        //fn(response.body);
	else fn(body);
      });
   });

  })
