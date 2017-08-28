# Installer forever en global

sudo npm install forever -g 

# Se placer dans /home/pi 

cd /home/pi

#  cloner l'appli node 

git clone https://github.com/jam29/printcart.git

# installer les packages

npm install

# Rajouter dans /etc/rc.local

/usr/local/bin/forever start -o /home/pi/printcart/logs/out.log -e /home/pi/printcar/logs/err.log /home/pi/printcart/app.js -p /home/pi/printcart

# rebooter
