# installer node

```
sudo wget https://nodejs.org/dist/latest/node-v8.4.0-linux-armv7l.tar.gz

sudo tar xvf node-v8.4.0-linux-armv7l.tar.gz

cd node-v8.4.0-linux-armv7l/

sudo cp -R * /usr/local/

```

# Installer forever en global

```
sudo npm install forever -g 
```

# Se placer dans /home/pi 

```
cd /home/pi
```

#  cloner l'appli node 

```
git clone https://github.com/jam29/printcart.git
```

# installer les packages

```
cd /home/pi/printcart
npm install
```

# Rajouter dans /etc/rc.local

```
/usr/local/bin/forever start /home/pi/printcart/app.js -p /home/pi/printcart > /tmp/errFileForever 2>&1
```

Exemple de fichier rc.local:

```
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.

# Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi

/usr/local/bin/forever start /home/pi/printcart/app.js -p /home/pi/printcart > /tmp/errFileForever 2>&1

exit 0
```


# rebooter

# vérifier le process

```
sudo forever list
```

Donne une réponse du type:

```
info:    Forever processes running
data:        uid  command             script                                          forever pid  id logfile                 uptime       
data:    [0] 77z5 /usr/local/bin/node /home/pi/printcart/app.js -p /home/pi/printcart 941     1103    /root/.forever/77z5.log 0:0:40:33.64 
```


# Afficheur

* lancement de chromium en mode kiosk avec l'url:


```
cd /home/pi/.config/autostart

```

créer un fichier (ex: auto-chrome.desktop) et insérer ces paramètres 

```
[Desktop Entry]
Type=Application
Exec=/usr/bin /home/pi/printcart/lance.sh
Hidden=false
X-GNOME-Autostart-enabled=true
Name[en_US]=AutoChromium
Name=AutoChromium
```


* stopper screensaver

Ouvrir :

```
/etc/lightdm/lightdm.conf
```

Chercher :

```
#xserver-command=X
```

Remplacer par :

```
xserver-command=X -s 0 -dpms
```

