/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
/*
 * extension.js
 * Copyright (C) 2012 Victor Aurélio Santos <admin@so-dicas.info>
 * 
 * Alsa Mixer is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Alsa Mixer is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along
 * with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const St = imports.gi.St;
const Lang = imports.lang;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;
const Util = imports.misc.util;
const Mainloop = imports.mainloop;

const VOLUME_STEP		= 5;				// Step on scroll, and olny on scroll
const MIXER_CONTROL		= "vmix0-outvol";	// Mixer control to get/set volume

const OSSMixer = new Lang.Class({
	Name: 'OSSMixer',
	Extends: PanelMenu.SystemStatusButton,

	_init: function(){
		this.parent('audio-volume-medium', _('Volume'));
		
		this.statusIcon = new St.Icon({
			icon_name: 'audio-volume-medium',
			style_class: 'status-icon'
		});
		this.actor.add_actor(this.statusIcon);
		
		this._onScrollId = this.actor.connect('scroll-event', Lang.bind(this, this._onScroll));
		
		this._cVolume = this._getVolume();
		this._muted = this._cVolume < 1 ? true : false;
		this._updateIcon(this._cVolume);
		
		this.pup = new PopupMenu.PopupSliderMenuItem(this._cVolume / 100);
		this._onSliderId = this.pup.connect('value-changed', Lang.bind(this, this._onSlider));
		this.menu.addMenuItem(this.pup);
		
		this._timeoutId = Mainloop.timeout_add_seconds(1, Lang.bind(this, this._onUpdate));
	},

	_getVolume: function(){
		let cmd = GLib.spawn_command_line_sync('ossmix ' + MIXER_CONTROL);
		let value = cmd[1].toString().split('set to ')[1].toString().split(' (')[0].toString();

		return value;
	},

	_setVolume: function(value){
		let cmd = GLib.spawn_command_line_async('amixer -q set Master ' + value + '%');
		
		this._cVolume = value;
		
		this._updateIcon(value);
	},

	_updateIcon: function(value){
		if (this.statusIcon.get_icon_name() != this._getIcon(value)){
			let icon = this._getIcon(value);
			this.statusIcon.set_icon_name(icon);
			this.setIcon(icon);
		}
	},

	_getIcon: function(volume){
		let rvalue = 'audio-volume-muted';
		if (volume < 1){
			rvalue = 'audio-volume-muted';
		}
		else{
			let num = Math.floor(3 * volume / 100) + 1;

			if (num >= 3)
				rvalue = 'audio-volume-high';
			else if(num < 2)
				rvalue = 'audio-volume-low';
			else
				rvalue = 'audio-volume-medium';
		}
		return rvalue;
	},

	_onScroll: function(widget, event){
		let di = event.get_scroll_direction();

		if (di == Clutter.ScrollDirection.DOWN && Number(this._cVolume) > VOLUME_STEP){
			this._setVolume(Number(this._cVolume) - VOLUME_STEP);
		}
		else if (di == Clutter.ScrollDirection.DOWN && Number(this._cVolume) <= VOLUME_STEP){
			this._setVolume(0);
		}
		else if(di == Clutter.ScrollDirection.UP && Number(this._cVolume) < 100 - VOLUME_STEP){
			this._setVolume(Number(this._cVolume) + VOLUME_STEP);
		}
		else if(di == Clutter.ScrollDirection.UP && Number(this._cVolume) >= 100 - VOLUME_STEP){
			this._setVolume(100);
		}
		this.pup.setValue(Number(this._cVolume) / 100);
	},

	_onSlider: function(slider, value){
		let volume = value * 100;
		this._setVolume(volume);
	},

	_onUpdate: function(){
		this._cVolume = this._getVolume();
		this._updateIcon(this._cVolume);
		this.pup.setValue(Number(this._cVolume) / 100);
		return true;
	},

	_AButtons: function(){
		this.btns = [];
		
		this.btns[0] = {
			title: "GNOME AlsaMixer",
			name: "galsamixer",
			command: "gnome-alsamixer",
			visible: true
		};
		
		for (i = 0; i <= this.btns.length; i++){
			let ret = 0;
			
			if (GLib.spawn_command_line_sync(this.btns[i].command)[3] != 0)
				btns[i].visible = false;
			else
				ret++;
		}
		
		return ret;
	},

	destroy: function(){
		this.parent();
		Mainloop.remove_source(this._timeoutId);
		this.actor.disconnect(this._onScrollId);
		this.pup.disconnect(this._onSliderId);
	}
});

function init(){

}

let AM;

function enable(){
	AM = new AlsaMixer();
	Main.panel.addToStatusArea('AlsaMixer', AM);
}

function disable(){
	AM.destroy();
	AM = null;
}
