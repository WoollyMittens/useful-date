/*
Source:
van Creij, Maurice (2014). "useful.date.js: Date input element", version 20141127, http://www.woollymittens.nl/.

License:
This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Date = useful.Date || function () {};

// extend the constructor
useful.Date.prototype.Main = function (parent, cfg) {
	// properties
	"use strict";
	this.parent = parent;
	this.cfg = cfg;
	this.obj = cfg.element;
	// methods
	this.start = function () {
		// build the interface
		this.setup();
		// start the updates
		this.update();
		// disable the start function so it can't be started twice
		this.init = function () {};
	};
	this.setup = function () {
		// measure the dimensions of the parent element if they are not given
		this.cfg.width = this.cfg.width || this.obj.offsetWidth;
		this.cfg.height = this.cfg.height || this.obj.offsetHeight;
		// create a container around the element
		this.cfg.container = document.createElement('span');
		this.cfg.container.className = 'date';
		// add the container into the label
		this.obj.parentNode.insertBefore(this.cfg.container, this.obj);
		// move the input element into the container
		this.cfg.container.appendChild(this.obj.parentNode.removeChild(this.obj));
		// add the pick button
		this.cfg.button = document.createElement('span');
		this.cfg.button.innerHTML = '<span>' + new Date().getDate() + '</span>';
		this.cfg.button.className = 'date_button date_passive';
		this.cfg.container.appendChild(this.cfg.button);
		// set the event handlers
		this.handleReverse(this.obj);
		this.handlePick(this.cfg.button);
		this.handleReset(document.body);
	};
	this.update = function () {
		// if there is a valid date
		if (this.cfg.date) {
			// update the value
			this.obj.value = this.cfg.format
				.replace('d', this.cfg.date.getDate())
				.replace('m', this.cfg.date.getMonth() + 1)
				.replace('M', this.cfg.months[this.cfg.date.getMonth()])
				.replace('y', this.cfg.date.getFullYear());
		}
		// else use today
		else {
			this.cfg.date = new Date();
		}
	};
	this.handlePick = function (element) {
		var _this = this;
		// set an event handler
		element.addEventListener('click', function (event) {
			// construct the popup
			_this.popup.setup();
			// cancel the click
			event.preventDefault();
		}, false);
	};
	this.handleReset = function (element) {
		var _this = this;
		element.addEventListener('click', function (event) {
			// construct the popup
			_this.popup.remove();
		}, false);
	};
	this.handleReverse = function (element) {
		var _this = this;
		element.addEventListener('keyup', function () {
			var inputValue, inputParts, inputDate;
			// preprocess problematic dates
			inputValue = element.value;
			switch (_this.cfg.format) {
			case 'd/m/y':
				inputParts = inputValue.split('/');
				inputDate = (inputValue.length > 1) ? new Date(inputParts[2], inputParts[1] - 1, inputParts[0]) : new Date(inputValue);
				break;
			default :
				inputDate = new Date(inputValue);
			}
			// try to interpret and update the date
			if (!isNaN(inputDate)) {
				_this.cfg.date = inputDate;
			}
		}, false);
	};
	// components
	this.popup = new this.parent.Popup(this);
	this.calendar = new this.parent.Calendar(this);
	// go
	this.start();
	return this;
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Date;
}
