// extend the class
DatePicker.prototype.Calendar = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;

	// METHODS

	this.setup = function () {
		// set the browsed date to the same month as the selected date
		this.config.reference = new Date(this.config.date.getFullYear(), this.config.date.getMonth(), 1);
		// get the minimum and maximum dates
		this.config.minimum = new Date(this.element.getAttribute('min'));
		if (isNaN(this.config.minimum)) {
			this.config.minimum = new Date(0);
		}
		this.config.maximum = new Date(this.element.getAttribute('max'));
		if (isNaN(this.config.maximum) || this.config.maximum.getTime() === 0) {
			this.config.maximum = new Date(2200, 1, 1);
		}
		// build the calendar container
		this.config.calendar = document.createElement('div');
		this.config.calendar.className = 'date_calendar';
		this.config.popup.appendChild(this.config.calendar);
	};

	this.update = function () {
		var a, b, offset, month, reference, count, table, thead, tbody, row, col, link, span;
		// create a working reference
		reference = new Date(this.config.reference.getFullYear(), this.config.reference.getMonth(), 1);
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
			col.innerHTML = this.config.days[a];
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
					if (reference.getTime() > this.config.minimum.getTime() && reference.getTime() < this.config.maximum.getTime()) {
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
					reference.getFullYear() === this.config.date.getFullYear() &&
					reference.getMonth() === this.config.date.getMonth() &&
					reference.getDate() === this.config.date.getDate() + 1
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
		this.config.calendar.innerHTML = '';
		// add the table to the calendar
		this.config.calendar.appendChild(table);
	};

	this.handleDateClick = function (element, picked) {
		var _this = this;
		// set an event handler
		element.onclick = function () {
			// set the date from the picked cell
			_this.config.date = picked;
			// update the component
			_this.parent.update();
			// close the popup
			_this.config.hover = false;
			_this.parent.popup.remove();
			// cancel the click
			return false;
		};
	};
};
