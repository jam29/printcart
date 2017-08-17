# Installer forever en global

sudo npm install forever -g 

# Rajouter dans /etc/rc.local

/usr/local/bin/forever start -o /home/pi/print/logs/out.log -e /home/pi/print/logs/err.log /home/pi/print/app.js -p /home/pi/print
