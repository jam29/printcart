# installer node raspberry

```
sudo wget https://nodejs.org/dist/v8.4.0/node-v8.4.0-linux-armv7l.tar.gz

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
/usr/local/bin/forever start /home/pi/printcart/appticket.js -p /home/pi/printcart > /tmp/errFileForever 2>&1
/usr/local/bin/forever start /home/pi/printcart/applabel.js -p /home/pi/printcart > /tmp/errFileForever2 2>&1
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

/usr/local/bin/forever start /home/pi/printcart/appticket.js -p /home/pi/printcart > /tmp/errFileForever 2>&1
/usr/local/bin/forever start /home/pi/printcart/applabel.js -p /home/pi/printcart > /tmp/errFileForever2 2>&1

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
mkdir /home/pi/.config/autostart
sudo nano /home/pi/.config/autostart/auto-chrome.desktop

```

Insérer ces paramètres 

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
Reboot

Creation lien symbolique imprimante 

```

Lien symbolique pour associer n'importe quel /dev/usb/lp* à une imprimante

Rajouter dans /etc/udev/rules.d/60-persistent-printer.rules

ACTION=="remove", GOTO="persistent_printer_end"

 # This should not be necessary
 #KERNEL!="lp*", GOTO="persistent_printer_end"

SUBSYSTEMS=="usb", IMPORT{builtin}="usb_id"
ENV{ID_TYPE}!="printer", GOTO="persistent_printer_end"

ENV{ID_SERIAL}=="?*", SYMLINK+="lp/by-id/$env{ID_BUS}-$env{ID_SERIAL}"

IMPORT{builtin}="path_id"
ENV{ID_PATH}=="?*", SYMLINK+="lp/by-path/$env{ID_PATH}"

LABEL="persistent_printer_end"


 # udevadm control --reload-rules && udevadm trigger
 # modifer variable LP dans /var/www/html/config.php , exemple : define('LP', '/dev/lp/by-id/usb-EPSON_TM-T20II_544338590809750000'); 


# --(o)-- Afficheur oxhoo 

Lenovo LT1421 USB DisplayLink monitor on a RaspberryPi

I created a file named 60-plugable.conf in the /usr/share/X11/xorg.conf.d directory with the following content:
 /usr/share/X11/xorg.conf.d/60-plugable.conf
Section "Device" 
  Identifier "uga" 
  driver "fbdev" 
  Option "fbdev" "/dev/fb1" 
  Option "ShadowFB" "off"
EndSection 
Section "Monitor" 
  Identifier "monitor" 
EndSection 
Section "Screen" 
  Identifier "screen" 
  Device "uga" 
  Monitor "monitor" 
EndSection 
Section "ServerLayout" 
  Identifier "default" 
  Screen 0 "screen" 0 0 
EndSection






voir toutes les taches cups:
lpstat -o
supprimer toutes les taches d'une imprimante
cancel -a {printer}
exemple : cancel -a zebra 

