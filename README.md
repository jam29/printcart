# installer node

sudo wget https://nodejs.org/dist/latest/node-v8.4.0-linux-armv7l.tar.gz

sudo tar xvf node-v8.4.0-linux-armv7l.tar.gz

cd node-v8.4.0-linux-armv7l/

sudo cp -R * /usr/local/


# Installer forever en global

sudo npm install forever -g 

# Se placer dans /home/pi 

cd /home/pi

#  cloner l'appli node 

git clone https://github.com/jam29/printcart.git

# installer les packages

npm install

# Rajouter dans /etc/rc.local

/usr/local/bin/forever start /home/pi/printcart/app.js -p /home/pi/printcart 

# rebooter

# vérifier le process

sudo forever list

