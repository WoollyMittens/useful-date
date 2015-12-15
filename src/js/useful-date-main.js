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
useful.Date.prototype.Main = function (config, context) {

	// PROPERTIES
	
	"use strict";
	this.config = config;
	this.context = context;
	this.element = config.element;

	// METHODS
	
	this.init = function () {
		// build the interface
		this.setup();
		// start the updates
		this.update();
		// return the object
		return this;
	};
	
	this.setup = function () {
		// measure the dimensions of the parent element if they are not given
		this.config.width = this.config.width || this.element.offsetWidth;
		this.config.height = this.config.height || this.element.offsetHeight;
		// create a container around the element
		this.config.container = document.createElement('span');
		this.config.container.className = 'date';
		// add the container into the label
		this.element.parentNode.insertBefore(this.config.container, this.element);
		// move the input element into the container
		this.config.container.appendChild(this.element.parentNode.removeChild(this.element));
		// add the pick button
		this.config.button = document.createElement('span');
		this.config.button.innerHTML = '<span>' + new Date().getDate() + '</span>';
		this.config.button.className = 'date_button date_passive';
		this.config.container.appendChild(this.config.button);
		// set the event handlers
		this.handleReverse(this.element);
		this.handlePick(this.config.button);
		this.handleReset(document.body);
	};
	
	this.update = function () {
		// if there is a valid date
		if (this.config.date) {
			// update the value
			this.element.value = this.config.format
				.replace('d', this.config.date.getDate())
				.replace('m', this.config.date.getMonth() + 1)
				.replace('M', this.config.months[this.config.date.getMonth()])
				.replace('y', this.config.date.getFullYear());
		}
		// else use today
		else {
			this.config.date = new Date();
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
			switch (_this.config.format) {
			case 'd/m/y':
				inputParts = inputValue.split('/');
				inputDate = (inputValue.length > 1) ? new Date(inputParts[2], inputParts[1] - 1, inputParts[0]) : new Date(inputValue);
				break;
			default :
				inputDate = new Date(inputValue);
			}
			// try to interpret and update the date
			if (!isNaN(inputDate)) {
				_this.config.date = inputDate;
			}
		}, false);
	};

	// COMPONENTS
	
	this.popup = new this.context.Popup(this);
	this.calendar = new this.context.Calendar(this);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Date.Main;
}
