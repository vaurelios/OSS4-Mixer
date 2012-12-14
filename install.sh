#!/bin/bash

echo "Clonning extension..."
git clone git://github.com/hotvic/OSS4-Mixer.git OSS4-Mixer
echo "Creating extension folder..."
mkdir -p ~/.local/share/gnome-shell/extensions/OSS4-Mixer\@so-dicas.info
echo "Installing extension..."
cp OSS4-Mixer/extension.js ~/.local/share/gnome-shell/extensions/OSS4-Mixer\@so-dicas.info/
cp OSS4-Mixer/metadata.json ~/.local/share/gnome-shell/extensions/OSS4-Mixer\@so-dicas.info/
echo "Cleaning..."
rm -rf Alsa-Mixer/
echo "Done!"
