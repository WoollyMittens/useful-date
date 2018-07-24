/*
Source:
van Creij, Maurice (2018). "positions.js: A library of useful functions to ease working with screen positions.", http://www.woollymittens.nl/.

License:
This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var positions = {

	// find the dimensions of the window
	window: function (parent) {
		// define a position object
		var dimensions = {x: 0, y: 0};
		// if an alternative was given to use as a window
		if (parent && parent !== window && parent !== document) {
			// find the current dimensions of surrogate window
			dimensions.x = parent.offsetWidth;
			dimensions.y = parent.offsetHeight;
		} else {
			// find the current dimensions of the window
			dimensions.x = window.innerWidth || document.body.clientWidth;
			dimensions.y = window.innerHeight || document.body.clientHeight;
		}
		// return the object
		return dimensions;
	},

	// find the scroll position of an element
	document: function (parent) {
		// define a position object
		var position = {x: 0, y: 0};
		// find the current position in the document
		if (parent && parent !== window && parent !== document) {
			position.x = parent.scrollLeft;
			position.y = parent.scrollTop;
		} else {
			position.x = (window.pageXOffset) ?
			window.pageXOffset :
			(document.documentElement) ?
			document.documentElement.scrollLeft :
			document.body.scrollLeft;
			position.y = (window.pageYOffset) ?
			window.pageYOffset :
			(document.documentElement) ?
			document.documentElement.scrollTop :
			document.body.scrollTop;
		}
		// return the object
		return position;
	},

	// finds the position of the element, relative to the document
	object: function (node) {
		// define a position object
		var position = {x: 0, y: 0};
		// if offsetparent exists
		if (node.offsetParent) {
			// add every parent's offset
			while (node.offsetParent) {
				position.x += node.offsetLeft;
				position.y += node.offsetTop;
				node = node.offsetParent;
			}
		}
		// return the object
		return position;
	},

	// find the position of the mouse cursor relative to an element
	cursor: function (evt, parent) {
		// define a position object
		var position = {x: 0, y: 0};
		// find the current position on the document
		if (evt.touches && evt.touches[0]) {
			position.x = evt.touches[0].pageX;
			position.y = evt.touches[0].pageY;
		} else if (evt.pageX !== undefined) {
			position.x = evt.pageX;
			position.y = evt.pageY;
		} else {
			position.x = evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
			position.y = evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
		}
		// if a parent was given
		if (parent) {
			// retrieve the position of the parent
			var offsets = this.object(parent);
			// adjust the coordinates to fit the parent
			position.x -= offsets.x;
			position.y -= offsets.y;
		}
		// return the object
		return position;
	}

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = positions;
}

/*
Source:
van Creij, Maurice (2018). "date.js: Date input element", http://www.woollymittens.nl/.

License:
This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var DatePicker = function (config) {

	this.only = function (config) {
		// start an instance of the script
		return new this.Main(config, this);
	};

	this.each = function (config) {
		var _config, _context = this, instances = [];
		// for all element
		for (var a = 0, b = config.elements.length; a < b; a += 1) {
			// clone the configuration
			_config = Object.create(config);
			// insert the current element
			_config.element = config.elements[a];
			// start a new instance of the object
			instances[a] = new this.Main(_config, _context);
		}
		// return the instances
		return instances;
	};

	return (config.elements) ? this.each(config) : this.only(config);

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = DatePicker;
}

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

// extend the class
DatePicker.prototype.Main = function (config, context) {

	// PROPERTIES

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

	// EVENTS

	this.init();

};

// extend the class
DatePicker.prototype.Popup = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;

	// METHODS

	this.setup = function () {
		// remove any existing popup
		if (this.config.popup) {
			this.config.popup.parentNode.removeChild(this.config.popup);
		}
		// reset its hover state
		this.config.hover = false;
		// build the popup container
		this.config.popup = document.createElement('div');
		this.config.popup.className = 'date_popup date_hidden';
		// build the title
		this.config.title = document.createElement('strong');
		this.config.title.innerHTML = '{title}';
		this.config.popup.appendChild(this.config.title);
		// build a space for the selectors
		this.config.selectors = document.createElement('div');
		this.config.selectors.className = 'date_selectors';
		this.config.popup.appendChild(this.config.selectors);
		// build the months selector
		this.addMonthSelector();
		// build the years selector
		this.addYearSelector();
		// build the previous month button
		this.config.previousMonth = document.createElement('button');
		this.config.previousMonth.className = 'button date_previous_month';
		this.config.previousMonth.innerHTML = '&lt;';
		this.config.popup.appendChild(this.config.previousMonth);
		this.handlePreviousMonth(this.config.previousMonth);
		// build the next month button
		this.config.nextMonth = document.createElement('button');
		this.config.nextMonth.className = 'button date_next_month';
		this.config.nextMonth.innerHTML = '&gt;';
		this.config.popup.appendChild(this.config.nextMonth);
		this.handleNextMonth(this.config.nextMonth);
		// build the previous year button
		this.config.previousYear = document.createElement('button');
		this.config.previousYear.innerHTML = '&lt;&lt;';
		this.config.previousYear.className = 'button date_previous_year';
		this.config.popup.appendChild(this.config.previousYear);
		this.handlePreviousYear(this.config.previousYear);
		// build the next year button
		this.config.nextYear = document.createElement('button');
		this.config.nextYear.innerHTML = '&gt;&gt;';
		this.config.nextYear.className = 'button date_next_year';
		this.config.popup.appendChild(this.config.nextYear);
		this.handleNextYear(this.config.nextYear);
		// build the today button
		this.config.today = document.createElement('button');
		this.config.today.innerHTML = 'Today';
		this.config.today.className = 'button date_today';
		this.config.popup.appendChild(this.config.today);
		this.handleToday(this.config.today);
		// build the clear button
		this.config.clear = document.createElement('button');
		this.config.clear.innerHTML = 'Clear';
		this.config.clear.className = 'button date_clear';
		this.config.popup.appendChild(this.config.clear);
		this.handleClear(this.config.clear);
		// build the calendar
		this.parent.calendar.setup();
		// insert the popup into the document
		document.body.appendChild(this.config.popup);
		// position the popup
		this.config.position = positions.object(this.config.button);
		this.config.limits = positions.window();
		this.config.position.x -= (this.config.position.x + this.config.popup.offsetWidth > this.config.limits.x) ? this.config.popup.offsetWidth : 0;
		this.config.position.y -= (this.config.position.y + this.config.popup.offsetHeight > this.config.limits.y) ? this.config.popup.offsetHeight : 0;
		this.config.popup.style.left = this.config.position.x + 'px';
		this.config.popup.style.top = this.config.position.y + 'px';
		// update the popup once
		this.update();
		// reveal the popup
		this.reveal();
		// set the event handler
		this.handleOver(this.config.popup);
		this.handleOut(this.config.popup);
	};

	this.addMonthSelector = function () {
		var a, b, option;
		// create a selector
		this.config.monthPicker = document.createElement('select');
		this.config.monthPicker.setAttribute('name', 'pickmonth');
		// for every listed month
		for (a = 0 , b = this.config.months.length; a < b; a += 1) {
			// add and option to the selector for it
			option = document.createElement('option');
			option.innerHTML = this.config.months[a];
			option.value = a;
			this.config.monthPicker.appendChild(option);
		}
		// add the event handler
		this.handleSelectMonth(this.config.monthPicker);
		// add the selector to the popup
		this.config.selectors.appendChild(this.config.monthPicker);
	};

	this.addYearSelector = function () {
		var option, offset, year;
		// create a selector
		this.config.yearPicker = document.createElement('select');
		this.config.yearPicker.setAttribute('name', 'pickyear');
		// for the amount of years back
		offset = this.config.years[0];
		year = new Date().getFullYear();
		while (offset !== this.config.years[1]) {
			// add and option to the selector for it
			option = document.createElement('option');
			option.innerHTML = year + offset;
			option.value = year + offset;
			this.config.yearPicker.appendChild(option);
			// update the counter
			offset += (this.config.years[0] > this.config.years[1]) ? -1 : 1;
		}
		// add the event handler
		this.handleSelectYear(this.config.yearPicker);
		// add the selector to the popup
		this.config.selectors.appendChild(this.config.yearPicker);
	};

	this.update = function () {
		var a, b, referenceMonth, referenceYear, options;
		// figure out the values
		referenceMonth = this.config.reference.getMonth();
		referenceYear = this.config.reference.getFullYear();
		// update the title
		this.config.title.innerHTML = this.config.months[referenceMonth] + ' ' + referenceYear;
		// update the the year picker
		options = this.config.yearPicker.getElementsByTagName('option');
		for (a = 0 , b = options.length; a < b; a += 1) {
			options[a].selected = (parseInt(options[a].value, 10) === referenceYear);
		}
		// update the month picker
		options = this.config.monthPicker.getElementsByTagName('option');
		for (a = 0 , b = options.length; a < b; a += 1) {
			options[a].selected = (parseInt(options[a].value, 10) === referenceMonth);
		}
		// update the calendar
		this.parent.calendar.update();
	};

	this.doNotClose = function () {
		var _this = this;
		// prevent closing the popup
		this.config.hover = true;
		// revert after a while
		setTimeout(function () {
			_this.config.hover = false;
		}, 100);
	};

	this.reveal = function () {
		var _this = this;
		// reveal the popup
		setTimeout(function () {
			_this.config.popup.className = _this.config.popup.className.replace('date_hidden', 'date_visible');
		}, 100);
	};

	this.remove = function () {
		var _this = this;
		// if the popup exists
		if (_this.config.popup && !_this.config.hover) {
			// hide the popup
			_this.config.popup.className = _this.config.popup.className.replace('date_visible', 'date_hidden');
		}
	};

	this.handleClear = function (element) {
		var _this = this;
		// set an event handler
		element.onclick = function () {
			// reset everything
			_this.config.date = null;
			_this.element.value = '';
			_this.config.hover = false;
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
			_this.config.date = new Date();
			// update the component
			_this.parent.update();
			// close the popup
			_this.config.hover = false;
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
			_this.config.reference = new Date(_this.config.reference.getFullYear(), _this.config.reference.getMonth() + 1, _this.config.reference.getDate());
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
			_this.config.reference = new Date(_this.config.reference.getFullYear(), _this.config.reference.getMonth() - 1, _this.config.reference.getDate());
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
			_this.config.reference = new Date(_this.config.reference.getFullYear(), parseInt(element.value, 10), _this.config.reference.getDate());
			// redraw
			_this.update();
		};
	};

	this.handleNextYear = function (element) {
		var _this = this;
		// set an event handler
		element.onclick = function () {
			// reduce the date by one year
			_this.config.reference = new Date(_this.config.reference.getFullYear() + 1, _this.config.reference.getMonth(), _this.config.reference.getDate());
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
			_this.config.reference = new Date(_this.config.reference.getFullYear() - 1, _this.config.reference.getMonth(), _this.config.reference.getDate());
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
			_this.config.reference = new Date(parseInt(element.value, 10), _this.config.reference.getMonth(), _this.config.reference.getDate());
			// redraw
			_this.update();
		};
	};

	this.handleOver = function (element) {
		var _this = this;
		// set an event handler
		element.onmouseover = function () {
			// set the hover state
			_this.config.hover = true;
		};
	};

	this.handleOut = function (element) {
		var _this = this;
		// set an event handler
		element.onmouseout = function () {
			// reset the hover state
			_this.config.hover = false;
		};
	};
};
