//-------------------------------------------------------------------------------------------------
// Kerawen © Juillet 2017. (Cavarec JB).
// Relais node pour impression de labels (raspberryPi -> zebra,dymo...etc...).
// ➠ Détection adresse MAC et transformation (uppercase + trim ":")
// ➠ Connection socket au serveur node screen.kerawen.com:3055 
// ➠ enregistrement dans la table liaison macAddress:socketId 
// ➠  Attente de l'évènement d'impression "printkboxlabel" avec les données
// - modification 26Aout2021: envoi directement le fichier ZPL aux ZEBRAs et passe par cups pour les pdf (dymo)
//--------------------------------------------------------------------------------------------------
require('dotenv').config(); 
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

    var socket = io.connect('https://screen.kerawen.com:3055', { secure: true, rejectUnauthorized: false,reconnect: true});

    socket.on('connect', function() { 
      socket.emit("enreg_mac", MACADDRESS ) ;
    })

   socket.on("printkboxlabel",function(params,data,callback) {
    var argz = JSON.parse(params);

    console.log("print label on:",argz.printer);
    console.log("d2p:",data.data2print);
    console.log("raw:",data.lpraw);
    console.log("copies:",data.copies);
 
    if (data.lpraw == 0 ) { 
        var lp = spawn('/usr/bin/lp', ['-d'+argz.printer, '-n'+data.copies]);
        exec.exec(`/usr/sbin/cupsenable ${argz.printer}`);
        var dc = data.data2print
        lp.stdin.write(dc);
        lp.stdin.write('\n');
        lp.stdin.end();
        callback();
    }

    if (data.lpraw == 1 ) { 
	var argz = JSON.parse(params);
   	var dc = data.data2print.replace(/&#39;/g,"\'" ).replace(/&#34;/g, "\"").replace(/&amp;/g,"\&")
   	console.log(dc);  
   	for (var i=0 ; i < data.copies ; i++ ) {
        	console.log ('/dev/lp/by-id/'+process.env.ZEBRA,dc)
        	fs.writeFileSync('/dev/lp/by-id/usb-Zebra_Technologies_ZTC_ZD421-203dpi_ZPL_D8J213005052',dc)
   	}
   	callback();
    }

    }); // fin socket.on("printkboxlabel....

}) // fin require.getMac 
