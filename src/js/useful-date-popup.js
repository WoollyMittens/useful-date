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
useful.Date.prototype.Popup = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.cfg = parent.cfg;
	this.obj = parent.obj;
	// methods
	this.setup = function () {
		// remove any existing popup
		if (this.cfg.popup) {
			this.cfg.popup.parentNode.removeChild(this.cfg.popup);
		}
		// reset its hover state
		this.cfg.hover = false;
		// build the popup container
		this.cfg.popup = document.createElement('div');
		this.cfg.popup.className = 'date_popup date_hidden';
		// build the title
		this.cfg.title = document.createElement('strong');
		this.cfg.title.innerHTML = '{title}';
		this.cfg.popup.appendChild(this.cfg.title);
		// build a space for the selectors
		this.cfg.selectors = document.createElement('div');
		this.cfg.selectors.className = 'date_selectors';
		this.cfg.popup.appendChild(this.cfg.selectors);
		// build the months selector
		this.addMonthSelector();
		// build the years selector
		this.addYearSelector();
		// build the previous month button
		this.cfg.previousMonth = document.createElement('button');
		this.cfg.previousMonth.className = 'button date_previous_month';
		this.cfg.previousMonth.innerHTML = '&lt;';
		this.cfg.popup.appendChild(this.cfg.previousMonth);
		this.handlePreviousMonth(this.cfg.previousMonth);
		// build the next month button
		this.cfg.nextMonth = document.createElement('button');
		this.cfg.nextMonth.className = 'button date_next_month';
		this.cfg.nextMonth.innerHTML = '&gt;';
		this.cfg.popup.appendChild(this.cfg.nextMonth);
		this.handleNextMonth(this.cfg.nextMonth);
		// build the previous year button
		this.cfg.previousYear = document.createElement('button');
		this.cfg.previousYear.innerHTML = '&lt;&lt;';
		this.cfg.previousYear.className = 'button date_previous_year';
		this.cfg.popup.appendChild(this.cfg.previousYear);
		this.handlePreviousYear(this.cfg.previousYear);
		// build the next year button
		this.cfg.nextYear = document.createElement('button');
		this.cfg.nextYear.innerHTML = '&gt;&gt;';
		this.cfg.nextYear.className = 'button date_next_year';
		this.cfg.popup.appendChild(this.cfg.nextYear);
		this.handleNextYear(this.cfg.nextYear);
		// build the today button
		this.cfg.today = document.createElement('button');
		this.cfg.today.innerHTML = 'Today';
		this.cfg.today.className = 'button date_today';
		this.cfg.popup.appendChild(this.cfg.today);
		this.handleToday(this.cfg.today);
		// build the clear button
		this.cfg.clear = document.createElement('button');
		this.cfg.clear.innerHTML = 'Clear';
		this.cfg.clear.className = 'button date_clear';
		this.cfg.popup.appendChild(this.cfg.clear);
		this.handleClear(this.cfg.clear);
		// build the calendar
		this.parent.calendar.setup();
		// insert the popup into the document
		document.body.appendChild(this.cfg.popup);
		// position the popup
		this.cfg.position = useful.positions.object(this.cfg.button);
		this.cfg.limits = useful.positions.window();
		this.cfg.position.x -= (this.cfg.position.x + this.cfg.popup.offsetWidth > this.cfg.limits.x) ? this.cfg.popup.offsetWidth : 0;
		this.cfg.position.y -= (this.cfg.position.y + this.cfg.popup.offsetHeight > this.cfg.limits.y) ? this.cfg.popup.offsetHeight : 0;
		this.cfg.popup.style.left = this.cfg.position.x + 'px';
		this.cfg.popup.style.top = this.cfg.position.y + 'px';
		// update the popup once
		this.update();
		// reveal the popup
		this.reveal();
		// set the event handler
		this.handleOver(this.cfg.popup);
		this.handleOut(this.cfg.popup);
	};
	this.addMonthSelector = function () {
		var a, b, option;
		// create a selector
		this.cfg.monthPicker = document.createElement('select');
		this.cfg.monthPicker.setAttribute('name', 'pickmonth');
		// for every listed month
		for (a = 0 , b = this.cfg.months.length; a < b; a += 1) {
			// add and option to the selector for it
			option = document.createElement('option');
			option.innerHTML = this.cfg.months[a];
			option.value = a;
			this.cfg.monthPicker.appendChild(option);
		}
		// add the event handler
		this.handleSelectMonth(this.cfg.monthPicker);
		// add the selector to the popup
		this.cfg.selectors.appendChild(this.cfg.monthPicker);
	};
	this.addYearSelector = function () {
		var option, offset, year;
		// create a selector
		this.cfg.yearPicker = document.createElement('select');
		this.cfg.yearPicker.setAttribute('name', 'pickyear');
		// for the amount of years back
		offset = this.cfg.years[0];
		year = new Date().getFullYear();
		while (offset !== this.cfg.years[1]) {
			// add and option to the selector for it
			option = document.createElement('option');
			option.innerHTML = year + offset;
			option.value = year + offset;
			this.cfg.yearPicker.appendChild(option);
			// update the counter
			offset += (this.cfg.years[0] > this.cfg.years[1]) ? -1 : 1;
		}
		// add the event handler
		this.handleSelectYear(this.cfg.yearPicker);
		// add the selector to the popup
		this.cfg.selectors.appendChild(this.cfg.yearPicker);
	};
	this.update = function () {
		var a, b, referenceMonth, referenceYear, options;
		// figure out the values
		referenceMonth = this.cfg.reference.getMonth();
		referenceYear = this.cfg.reference.getFullYear();
		// update the title
		this.cfg.title.innerHTML = this.cfg.months[referenceMonth] + ' ' + referenceYear;
		// update the the year picker
		options = this.cfg.yearPicker.getElementsByTagName('option');
		for (a = 0 , b = options.length; a < b; a += 1) {
			options[a].selected = (parseInt(options[a].value, 10) === referenceYear);
		}
		// update the month picker
		options = this.cfg.monthPicker.getElementsByTagName('option');
		for (a = 0 , b = options.length; a < b; a += 1) {
			options[a].selected = (parseInt(options[a].value, 10) === referenceMonth);
		}
		// update the calendar
		this.parent.calendar.update();
	};
	this.doNotClose = function () {
		var _this = this;
		// prevent closing the popup
		this.cfg.hover = true;
		// revert after a while
		setTimeout(function () {
			_this.cfg.hover = false;
		}, 100);
	};
	this.reveal = function () {
		var _this = this;
		// reveal the popup
		setTimeout(function () {
			_this.cfg.popup.className = _this.cfg.popup.className.replace('date_hidden', 'date_visible');
		}, 100);
	};
	this.remove = function () {
		var _this = this;
		// if the popup exists
		if (_this.cfg.popup && !_this.cfg.hover) {
			// hide the popup
			_this.cfg.popup.className = _this.cfg.popup.className.replace('date_visible', 'date_hidden');
		}
	};
	this.handleClear = function (element) {
		var _this = this;
		// set an event handler
		element.onclick = function () {
			// reset everything
			_this.cfg.date = null;
			_this.obj.value = '';
			_this.cfg.hover = false;
			_this.remove();
			_this.parent.update();
			// cancel the click
			return false;
		};
	};
	this.handleToday = function (element) {
		var _this = this;
		// set an event handler
		element.onclick = function () {
			// set the date to today
			_this.cfg.date = new Date();
			// update the component
			_this.parent.update();
			// close the popup
			_this.cfg.hover = false;
			_this.remove();
			// cancel the click
			return false;
		};
	};
	this.handleNextMonth = function (element) {
		var _this = this;
		// set an event handler
		element.onclick = function () {
			// reduce the date by one year
			_this.cfg.reference = new Date(_this.cfg.reference.getFullYear(), _this.cfg.reference.getMonth() + 1, _this.cfg.reference.getDate());
			// redraw
			_this.update();
			// cancel the click
			return false;
		};
	};
	this.handlePreviousMonth = function (element) {
		var _this = this;
		// set an event handler
		element.onclick = function () {
			// reduce the date by one year
			_this.cfg.reference = new Date(_this.cfg.reference.getFullYear(), _this.cfg.reference.getMonth() - 1, _this.cfg.reference.getDate());
			// redraw
			_this.update();
			// cancel the click
			return false;
		};
	};
	this.handleSelectMonth = function (element) {
		var _this = this;
		// set an event handler
		element.onchange = function () {
			// keep the popup visible
			_this.doNotClose();
			// reduce the date by one year
			_this.cfg.reference = new Date(_this.cfg.reference.getFullYear(), parseInt(element.value, 10), _this.cfg.reference.getDate());
			// redraw
			_this.update();
		};
	};
	this.handleNextYear = function (element) {
		var _this = this;
		// set an event handler
		element.onclick = function () {
			// reduce the date by one year
			_this.cfg.reference = new Date(_this.cfg.reference.getFullYear() + 1, _this.cfg.reference.getMonth(), _this.cfg.reference.getDate());
			// redraw
			_this.update();
			// cancel the click
			return false;
		};
	};
	this.handlePreviousYear = function (element) {
		var _this = this;
		// set an event handler
		element.onclick = function () {
			// reduce the date by one year
			_this.cfg.reference = new Date(_this.cfg.reference.getFullYear() - 1, _this.cfg.reference.getMonth(), _this.cfg.reference.getDate());
			// redraw
			_this.update();
			// cancel the click
			return false;
		};
	};
	this.handleSelectYear = function (element) {
		var _this = this;
		// set an event handler
		element.onchange = function () {
			// keep the popup visible
			_this.doNotClose();
			// reduce the date by one year
			_this.cfg.reference = new Date(parseInt(element.value, 10), _this.cfg.reference.getMonth(), _this.cfg.reference.getDate());
			// redraw
			_this.update();
		};
	};
	this.handleOver = function (element) {
		var _this = this;
		// set an event handler
		element.onmouseover = function () {
			// set the hover state
			_this.cfg.hover = true;
		};
	};
	this.handleOut = function (element) {
		var _this = this;
		// set an event handler
		element.onmouseout = function () {
			// reset the hover state
			_this.cfg.hover = false;
		};
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Date.Popup;
}
