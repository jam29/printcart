//----------------------------------------------------------------------
// Kerawen © Juillet 2017. (Cavarec JB).
// Relais node pour impression de labels (raspberryPi -> zebra,dymo...etc...).
// ➠ Détection adresse MAC et transformation (uppercase + trim ":")
// ➠ Connection socket au serveur node screen.kerawen.com:3055 
// ➠ enregistrement dans la table liaison macAddress:socketId 
// ➠  Attente de l'évènement d'impression "printkboxlabel" avec les données
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

    var socket = io.connect('https://screen.kerawen.com:3055', { secure: true, rejectUnauthorized: false,reconnect: true});

    socket.on('connect', function() { 
      socket.emit("enreg_mac", MACADDRESS ) ;
    })

   socket.on("printkboxlabel",function(params,data,fn) {
    var argz = JSON.parse(params);

    console.log("print label on:",argz.printer);
    console.log("d2p:",data.data2print);
    console.log("raw:",data.lpraw);
    console.log("copies:",data.copies);
 
    var lp = spawn('/usr/bin/lpr', ['-P'+argz.printer, '-#'+data.copies]);

    exec.exec(`/usr/sbin/cupsenable ${argz.printer}`);

    if (data.lpraw == 1 ) { 
      lp = spawn('/usr/bin/lpr', ['-o raw','-P'+argz.printer, '-#'+data.copies]);
    }

    var dc =  data.data2print ;

    lp.stdin.write(dc);
    lp.stdin.write('\n');
    lp.stdin.end();

/*
    fs.writeFile('testout.pdf', dc , function (err) {
        if (err) throw err
                console.log('created testout.pdf')
    })
*/

    });
  })
