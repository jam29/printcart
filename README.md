# Installer forever en global

sudo npm install forever -g 

# Créer un repertoire print dans /home/pi et se positionner dans ce répertoire 

cd /home/pi

mkdir print

cd print

#  cloner l'appli node 

git clone https://github.com/jam29/printcart.git

nmp install

/usr/local/bin/forever start -o /home/pi/print/logs/out.log -e /home/pi/print/logs/err.log /home/pi/print/app.js -p /home/pi/print


# Rajouter dans /etc/rc.local

/usr/local/bin/forever start -o /home/pi/print/logs/out.log -e /home/pi/print/logs/err.log /home/pi/print/app.js -p /home/pi/print
