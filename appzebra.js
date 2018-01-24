//----------------------------------------------------------------------
// Kerawen © Juillet 2017. (Cavarec JB).
// Relais node pour impression de tickets (raspberryPi -> epson tickets).
// ➠ Détection adresse MAC et transformation (uppercase + trim ":")
// ➠ Connection socket au serveur node screen.kerawen.com:3040 
// ➠ enregistrement dans la table liaison macAddress:socketId 
// ➠  Attente de l'évènement d'impression "printkbox" avec les données
// ➠  Requête http vers le serveur php local pour impression  
// Septembre 2017
// ➠  Ajout generation automatique de l'url afficheur 
// Decembre 2017
// ➠  Ajout impression étiquettes dymo (pdf) 
// Janvier 2018
// ➠  Ajout impression étiquettes zebra (zpl) 
//----------------------------------------------------------------------
var io = require('socket.io-client');
var request = require('request');
var changeCase = require('change-case');
var fs = require('fs-extra');
var exec = require("child_process");
var spawn = require('child_process').spawn

require('getmac').getMac(function(err,macAddress){
  if (err)  throw err
    var MACADDRESS = changeCase.upperCase(macAddress).replace(/:/g, '');
    console.log("I AM KBOX:",MACADDRESS);

  //var socket  = io.connect('https://screen.kerawen.com:3050', { secure: true, rejectUnauthorized: false,reconnect: true});
  var socket  = io.connect('http://screen.kerawen.com:3040');
  var socket2  = io.connect('https://screen.kerawen.com:3030', { secure: true, rejectUnauthorized: false,reconnect: true});

  socket2.on('connect', function() { 
    socket2.emit("urlraspberry",MACADDRESS,function(data){ 
      fs.writeFile('/home/pi/printcart/urll',data.url_longue,function(err) { } )
    })
  })

  // version http
  // var socket = io.connect('http://screen.kerawen.com:3040', { reconnect: true });

    socket.on('connect', function() { 
      console.log("emit enreg_mac:",MACADDRESS) ;
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
        fn(response);
      });
   });

   socket.on("printkboxlabel",function(params,data,fn) {

    var args = JSON.parse(params);

    var raw = "";
    if (data.lpraw == 1 ) { raw='-o raw' };

    console.log("print label on ",args.printer);
  
    // var lp = spawn('/usr/bin/lpr',['-o raw','-P'+args.printer]);
    var lp = spawn('/usr/bin/lpr',[raw,'-P'+args.printer]);

    lp.stdin.write(data.data2print);
    lp.stdin.write('\n');
    lp.stdin.end();

    });

  })
