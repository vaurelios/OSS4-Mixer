OSS4-Mixer
==========
OSS4-Mixer is a gnome-shell extension to control OSS4 output(vmix0-outvol or other) volume.

<h3> Installation </h3>
Run install.sh (recommend)
<pre>
git clone git://github.com/hotvic/OSS4-Mixer.git OSS4-Mixer
cd OSS4-Mixer
chmod +x install.sh
./install.sh
</pre>
or detailed installation
<pre>
git clone git://github.com/hotvic/OSS4-Mixer.git OSS4-Mixer
mkdir -p ~/.local/share/gnome-shell/extensions/OSS4-Mixer\@so-dicas.info
cp OSS4-Mixer/extension.js ~/.local/share/gnome-shell/extensions/OSS4-Mixer\@so-dicas.info/
cp OSS4-Mixer/metadata.json ~/.local/share/gnome-shell/extensions/OSS4-Mixer\@so-dicas.info/
rm -rf OSS4-Mixer/
</pre>

Copyright © 2012 - Victor Aurélio Santos

License GPLv3
