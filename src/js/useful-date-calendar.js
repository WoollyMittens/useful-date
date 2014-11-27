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
useful.Date.prototype.Calendar = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.cfg = parent.cfg;
	this.obj = parent.obj;
	// methods
	this.setup = function () {
		// set the browsed date to the same month as the selected date
		this.cfg.reference = new Date(this.cfg.date.getFullYear(), this.cfg.date.getMonth(), 1);
		// get the minimum and maximum dates
		this.cfg.minimum = new Date(this.obj.getAttribute('min'));
		if (isNaN(this.cfg.minimum)) {
			this.cfg.minimum = new Date(0);
		}
		this.cfg.maximum = new Date(this.obj.getAttribute('max'));
		if (isNaN(this.cfg.maximum) || this.cfg.maximum.getTime() === 0) {
			this.cfg.maximum = new Date(2200, 1, 1);
		}
		// build the calendar container
		this.cfg.calendar = document.createElement('div');
		this.cfg.calendar.className = 'date_calendar';
		this.cfg.popup.appendChild(this.cfg.calendar);
	};
	this.update = function () {
		var a, b, offset, month, reference, count, table, thead, tbody, row, col, link, span;
		// create a working reference
		reference = new Date(this.cfg.reference.getFullYear(), this.cfg.reference.getMonth(), 1);
		// create a table
		table = document.createElement('table');
		// create a table thead
		thead = document.createElement('thead');
		// add a row to the thead
		row = document.createElement('tr');
		// for all seven days
		for (a = 0 , b = 7; a < b; a += 1) {
			// create a cell
			col = document.createElement('th');
			col.innerHTML = this.cfg.days[a];
			// if this is the first day in the week
			if (a === 0) {
				// assign it a classname
				col.className = 'date_first';
			}
			// if this is the last day in the week
			else if (a === 6) {
				// assign it a classname
				col.className = 'date_last';
			}
			// add the cell to the row in the thead
			row.appendChild(col);
		}
		// add the row to the thead
		thead.appendChild(row);
		// add the thead to the table
		table.appendChild(thead);
		// create a table tbody
		tbody = document.createElement('tbody');
		// start a cell count
		count = 1;
		offset = 7 - reference.getDay() + 1;
		if (offset > 6) {
			offset = 0;
		}
		month = reference.getMonth();
		// while there are days in this month left
		while (month === reference.getMonth() && count < 32) {
			// create a row
			row = document.createElement('tr');
			// for all days in the week
			for (a = 0 , b = 7; a < b; a += 1) {
				// create a cell
				col = document.createElement('td');
				// if this cell has a date in this month (at an offset)
				if (count - offset === reference.getDate()) {
					// if this date is not before the minimum or after the maximum
					if (reference.getTime() > this.cfg.minimum.getTime() && reference.getTime() < this.cfg.maximum.getTime()) {
						// fill the cell with the date
						link = document.createElement('a');
						link.innerHTML = reference.getDate();
						link.href = '#' + reference.getDate() +
						'-' + (reference.getMonth() + 1) +
						'-' + reference.getFullYear();
						col.appendChild(link);
						// set its click handler
						this.handleDateClick(link, new Date(
							reference.getFullYear(),
							reference.getMonth(),
							reference.getDate()
						));
					}
					// else
					else {
						// fill the cell with the date
						span = document.createElement('span');
						span.innerHTML = reference.getDate();
						col.appendChild(span);
					}
					// update the reference date
					reference = new Date(
						reference.getFullYear(),
						reference.getMonth(),
						reference.getDate() + 1
					);
				}
				// else
				else {
					// fill the cell with a blank
					col.innerHTML = '';
				}
				// if this is the first day in the week
				if (a === 0) {
					// assign it a classname
					col.className = 'date_first';
				}
				// if this is the last day in the week
				else if (a === 6) {
					// assign it a classname
					col.className = 'date_last';
				}
				// if this is the current day
				if (
					reference.getFullYear() === this.cfg.date.getFullYear() &&
					reference.getMonth() === this.cfg.date.getMonth() &&
					reference.getDate() === this.cfg.date.getDate() + 1
				) {
					// assign it a classname
					col.className += ' date_current';
				}
				// add the cell to the row
				row.appendChild(col);
				// update the counter
				count += 1;
			}
			// add the row to the tbody
			tbody.appendChild(row);
		}
		// add the tbody to the table
		table.appendChild(tbody);
		// clear the old content from the calendar
		this.cfg.calendar.innerHTML = '';
		// add the table to the calendar
		this.cfg.calendar.appendChild(table);
	};
	this.handleDateClick = function (element, picked) {
		var _this = this;
		// set an event handler
		element.onclick = function () {
			// set the date from the picked cell
			_this.cfg.date = picked;
			// update the component
			_this.parent.update();
			// close the popup
			_this.cfg.hover = false;
			_this.parent.popup.remove();
			// cancel the click
			return false;
		};
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Date.Calendar;
}
