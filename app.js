// Kerawen © Juillet 2017. (Cavarec JB).
// Relais node pour impression d'étiquettes (raspberryPi->epson étiquettes).
// ➠ Détection adresse MAC et transformation (uppercase + trim ":")
// ➠ Connection socket au serveur node screen.kerawen.com:3040 
// ➠ enregistrement dans la table liaison macAddress:socketId 
// ➠  Attente de l'évènement d'impression "printkbox" avec les données
// ➠  Requête http vers le serveur php local pour impression  
//--------------------------------------------------------------------
var io = require('socket.io-client');
var request = require('request');
var changeCase = require("change-case");

require('getmac').getMac(function(err,macAddress){
    if (err)  throw err
    var MACADDRESS = changeCase.upperCase(macAddress).replace(/:/g, '');
   
    var socket = io.connect('https://screen.kerawen.com:3050', { secure: true, rejectUnauthorized: false,reconnect: true});

    // version http
    // var socket = io.connect('http://screen.kerawen.com:3040', { reconnect: true });

    socket.on('connect', function() { 
        console.log('Connection ',MACADDRESS);
        socket.emit("enreg_mac", MACADDRESS ) ;
    })

    socket.on("printkbox",function(data,fn){
    console.log(data);
    var data2 = JSON.parse(data);
    request({
      url:"http://127.0.0.1",
      method:"POST",	
      json:true,
      body:data2
     }, function(error,response,body) {
      if (error) { fn('ERREUR:',error); }
        fn(response.body);
    });
  });
})
