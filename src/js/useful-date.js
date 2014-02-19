/*
	Source:
	van Creij, Maurice (2012). "useful.color.js: Color input element", version 20130510, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	useful.Date = function (obj, cfg) {
		this.obj = obj;
		this.cfg = cfg;
		// update cascade
		this.start = function () {
			var context = this;
			// if the browser doesn't support ranges or is compelled to override the native ones
			if (!context.cfg.support) {
				// build the interface
				context.setup(context);
				// start the updates
				context.update(context);
			}
		};
		this.setup = function (context) {
			// measure the dimensions of the parent element if they are not given
			context.cfg.width = context.cfg.width || context.obj.offsetWidth;
			context.cfg.height = context.cfg.height || context.obj.offsetHeight;
			// create a container around the element
			context.cfg.container = document.createElement('span');
			context.cfg.container.className = 'date';
			// add the container into the label
			context.obj.parentNode.insertBefore(context.cfg.container, context.obj);
			// move the input element into the container
			context.cfg.container.appendChild(context.obj.parentNode.removeChild(context.obj));
			// add the pick button
			context.cfg.button = document.createElement('span');
			context.cfg.button.innerHTML = '<span>' + new Date().getDate() + '</span>';
			context.cfg.button.className = 'date_button date_passive';
			context.cfg.container.appendChild(context.cfg.button);
			// set the event handlers
			context.events.reverse(context.obj, context);
			context.events.pick(context.cfg.button, context);
			context.events.reset(document.body, context);
		};
		this.update = function (context) {
			// if there is a valid date
			if (context.cfg.date) {
				// update the value
				context.obj.value = context.cfg.format
					.replace('d', context.cfg.date.getDate())
					.replace('m', context.cfg.date.getMonth() + 1)
					.replace('M', context.cfg.months[context.cfg.date.getMonth()])
					.replace('y', context.cfg.date.getFullYear());
			}
			// else use today
			else {
				context.cfg.date = new Date();
			}
		};
		this.events = {};
		this.events.pick = function (element, context) {
			// set an event handler
			element.addEventListener('click', function (event) {
				// construct the popup
				context.popup.setup(context);
				// cancel the click
				event.preventDefault();
			}, false);
		};
		this.events.reset = function (element, context) {
			element.addEventListener('click', function (event) {
				// construct the popup
				context.popup.remove(context);
			}, false);
		};
		this.events.reverse = function (element, context) {
			element.addEventListener('keyup', function () {
				var inputValue, inputParts, inputDate;
				// preprocess problematic dates
				inputValue = element.value;
				switch (context.cfg.format) {
				case 'd/m/y':
					inputParts = inputValue.split('/');
					inputDate = (inputValue.length > 1) ? new Date(inputParts[2], inputParts[1] - 1, inputParts[0]) : new Date(inputValue);
					break;
				default :
					inputDate = new Date(inputValue);
				}
				// try to interpret and update the date
				if (!isNaN(inputDate)) {
					context.cfg.date = inputDate;
				}
			}, false);
		};
		this.popup = {};
		this.popup.setup = function (context) {
			// remove any existing popup
			if (context.cfg.popup) {
				context.cfg.popup.parentNode.removeChild(context.cfg.popup);
			}
			// reset its hover state
			context.cfg.hover = false;
			// build the popup container
			context.cfg.popup = document.createElement('div');
			context.cfg.popup.className = 'date_popup date_hidden';
			// build the title
			context.cfg.title = document.createElement('strong');
			context.cfg.title.innerHTML = '{title}';
			context.cfg.popup.appendChild(context.cfg.title);
			// build a space for the selectors
			context.cfg.selectors = document.createElement('div');
			context.cfg.selectors.className = 'date_selectors';
			context.cfg.popup.appendChild(context.cfg.selectors);
			// build the months selector
			context.popup.addMonthSelector(context);
			// build the years selector
			context.popup.addYearSelector(context);
			// build the previous month button
			context.cfg.previousMonth = document.createElement('button');
			context.cfg.previousMonth.className = 'button date_previous_month';
			context.cfg.previousMonth.innerHTML = '&lt;';
			context.cfg.popup.appendChild(context.cfg.previousMonth);
			context.popup.events.previousMonth(context.cfg.previousMonth, context);
			// build the next month button
			context.cfg.nextMonth = document.createElement('button');
			context.cfg.nextMonth.className = 'button date_next_month';
			context.cfg.nextMonth.innerHTML = '&gt;';
			context.cfg.popup.appendChild(context.cfg.nextMonth);
			context.popup.events.nextMonth(context.cfg.nextMonth, context);
			// build the previous year button
			context.cfg.previousYear = document.createElement('button');
			context.cfg.previousYear.innerHTML = '&lt;&lt;';
			context.cfg.previousYear.className = 'button date_previous_year';
			context.cfg.popup.appendChild(context.cfg.previousYear);
			context.popup.events.previousYear(context.cfg.previousYear, context);
			// build the next year button
			context.cfg.nextYear = document.createElement('button');
			context.cfg.nextYear.innerHTML = '&gt;&gt;';
			context.cfg.nextYear.className = 'button date_next_year';
			context.cfg.popup.appendChild(context.cfg.nextYear);
			context.popup.events.nextYear(context.cfg.nextYear, context);
			// build the today button
			context.cfg.today = document.createElement('button');
			context.cfg.today.innerHTML = 'Today';
			context.cfg.today.className = 'button date_today';
			context.cfg.popup.appendChild(context.cfg.today);
			context.popup.events.today(context.cfg.today, context);
			// build the clear button
			context.cfg.clear = document.createElement('button');
			context.cfg.clear.innerHTML = 'Clear';
			context.cfg.clear.className = 'button date_clear';
			context.cfg.popup.appendChild(context.cfg.clear);
			context.popup.events.clear(context.cfg.clear, context);
			// build the calendar
			context.popup.calendar.setup(context);
			// insert the popup into the document
			document.body.appendChild(context.cfg.popup);
			// position the popup
			context.cfg.position = useful.positions.object(context.cfg.button);
			context.cfg.limits = useful.positions.window();
			context.cfg.position.x -= (context.cfg.position.x + context.cfg.popup.offsetWidth > context.cfg.limits.x) ? context.cfg.popup.offsetWidth : 0;
			context.cfg.position.y -= (context.cfg.position.y + context.cfg.popup.offsetHeight > context.cfg.limits.y) ? context.cfg.popup.offsetHeight : 0;
			context.cfg.popup.style.left = context.cfg.position.x + 'px';
			context.cfg.popup.style.top = context.cfg.position.y + 'px';
			// update the popup once
			context.popup.update(context);
			// reveal the popup
			context.popup.reveal(context);
			// set the event handler
			context.popup.events.over(context.cfg.popup, context);
			context.popup.events.out(context.cfg.popup, context);
		};
		this.popup.addMonthSelector = function (context) {
			var a, b, option;
			// create a selector
			context.cfg.monthPicker = document.createElement('select');
			context.cfg.monthPicker.setAttribute('name', 'pickmonth');
			// for every listed month
			for (a = 0 , b = context.cfg.months.length; a < b; a += 1) {
				// add and option to the selector for it
				option = document.createElement('option');
				option.innerHTML = context.cfg.months[a];
				option.value = a;
				context.cfg.monthPicker.appendChild(option);
			}
			// add the event handler
			context.popup.events.selectMonth(context.cfg.monthPicker, context);
			// add the selector to the popup
			context.cfg.selectors.appendChild(context.cfg.monthPicker);
		};
		this.popup.addYearSelector = function (context) {
			var option, offset, year;
			// create a selector
			context.cfg.yearPicker = document.createElement('select');
			context.cfg.yearPicker.setAttribute('name', 'pickyear');
			// for the amount of years back
			offset = context.cfg.years[0];
			year = new Date().getFullYear();
			while (offset !== context.cfg.years[1]) {
				// add and option to the selector for it
				option = document.createElement('option');
				option.innerHTML = year + offset;
				option.value = year + offset;
				context.cfg.yearPicker.appendChild(option);
				// update the counter
				offset += (context.cfg.years[0] > context.cfg.years[1]) ? -1 : 1;
			}
			// add the event handler
			context.popup.events.selectYear(context.cfg.yearPicker, context);
			// add the selector to the popup
			context.cfg.selectors.appendChild(context.cfg.yearPicker);
		};
		this.popup.update = function (context) {
			var a, b, referenceMonth, referenceYear, options;
			// figure out the values
			referenceMonth = context.cfg.reference.getMonth();
			referenceYear = context.cfg.reference.getFullYear();
			// update the title
			context.cfg.title.innerHTML = context.cfg.months[referenceMonth] + ' ' + referenceYear;
			// update the the year picker
			options = context.cfg.yearPicker.getElementsByTagName('option');
			for (a = 0 , b = options.length; a < b; a += 1) {
				options[a].selected = (parseInt(options[a].value, 10) === referenceYear);
			}
			// update the month picker
			options = context.cfg.monthPicker.getElementsByTagName('option');
			for (a = 0 , b = options.length; a < b; a += 1) {
				options[a].selected = (parseInt(options[a].value, 10) === referenceMonth);
			}
			// update the calendar
			context.popup.calendar.update(context);
		};
		this.popup.doNotClose = function (context) {
			// prevent closing the popup
			context.cfg.hover = true;
			// revert after a while
			setTimeout(function () {
				context.cfg.hover = false;
			}, 100);
		};
		this.popup.reveal = function (context) {
			// reveal the popup
			setTimeout(function () {
				context.cfg.popup.className = context.cfg.popup.className.replace('date_hidden', 'date_visible');
			}, 100);
		};
		this.popup.remove = function (context) {
			// if the popup exists
			if (context.cfg.popup && !context.cfg.hover) {
				// hide the popup
				context.cfg.popup.className = context.cfg.popup.className.replace('date_visible', 'date_hidden');
			}
		};
		this.popup.events = {};
		this.popup.events.clear = function (element, context) {
			// set an event handler
			element.onclick = function () {
				// reset everything
				context.cfg.date = null;
				context.obj.value = '';
				context.cfg.hover = false;
				context.popup.remove(context);
				context.update(context);
				// cancel the click
				return false;
			};
		};
		this.popup.events.today = function (element, context) {
			// set an event handler
			element.onclick = function () {
				// set the date to today
				context.cfg.date = new Date();
				// update the component
				context.update(context);
				// close the popup
				context.cfg.hover = false;
				context.popup.remove(context);
				// cancel the click
				return false;
			};
		};
		this.popup.events.nextMonth = function (element, context) {
			// set an event handler
			element.onclick = function () {
				// reduce the date by one year
				context.cfg.reference = new Date(context.cfg.reference.getFullYear(), context.cfg.reference.getMonth() + 1, context.cfg.reference.getDate());
				// redraw
				context.popup.update(context);
				// cancel the click
				return false;
			};
		};
		this.popup.events.previousMonth = function (element, context) {
			// set an event handler
			element.onclick = function () {
				// reduce the date by one year
				context.cfg.reference = new Date(context.cfg.reference.getFullYear(), context.cfg.reference.getMonth() - 1, context.cfg.reference.getDate());
				// redraw
				context.popup.update(context);
				// cancel the click
				return false;
			};
		};
		this.popup.events.selectMonth = function (element, context) {
			// set an event handler
			element.onchange = function () {
				// keep the popup visible
				context.popup.doNotClose(context);
				// reduce the date by one year
				context.cfg.reference = new Date(context.cfg.reference.getFullYear(), parseInt(element.value, 10), context.cfg.reference.getDate());
				// redraw
				context.popup.update(context);
			};
		};
		this.popup.events.nextYear = function (element, context) {
			// set an event handler
			element.onclick = function () {
				// reduce the date by one year
				context.cfg.reference = new Date(context.cfg.reference.getFullYear() + 1, context.cfg.reference.getMonth(), context.cfg.reference.getDate());
				// redraw
				context.popup.update(context);
				// cancel the click
				return false;
			};
		};
		this.popup.events.previousYear = function (element, context) {
			// set an event handler
			element.onclick = function () {
				// reduce the date by one year
				context.cfg.reference = new Date(context.cfg.reference.getFullYear() - 1, context.cfg.reference.getMonth(), context.cfg.reference.getDate());
				// redraw
				context.popup.update(context);
				// cancel the click
				return false;
			};
		};
		this.popup.events.selectYear = function (element, context) {
			// set an event handler
			element.onchange = function () {
				// keep the popup visible
				context.popup.doNotClose(context);
				// reduce the date by one year
				context.cfg.reference = new Date(parseInt(element.value, 10), context.cfg.reference.getMonth(), context.cfg.reference.getDate());
				// redraw
				context.popup.update(context);
			};
		};
		this.popup.events.over = function (element, context) {
			// set an event handler
			element.onmouseover = function () {
				// set the hover state
				context.cfg.hover = true;
			};
		};
		this.popup.events.out = function (element, context) {
			// set an event handler
			element.onmouseout = function () {
				// reset the hover state
				context.cfg.hover = false;
			};
		};
		this.popup.calendar = {};
		this.popup.calendar.setup = function (context) {
			// set the browsed date to the same month as the selected date
			context.cfg.reference = new Date(context.cfg.date.getFullYear(), context.cfg.date.getMonth(), 1);
			// get the minimum and maximum dates
			context.cfg.minimum = new Date(context.obj.getAttribute('min'));
			if (isNaN(context.cfg.minimum)) {
				context.cfg.minimum = new Date(0);
			}
			context.cfg.maximum = new Date(context.obj.getAttribute('max'));
			if (isNaN(context.cfg.maximum) || context.cfg.maximum.getTime() === 0) {
				context.cfg.maximum = new Date(2200, 1, 1);
			}
			// build the calendar container
			context.cfg.calendar = document.createElement('div');
			context.cfg.calendar.className = 'date_calendar';
			context.cfg.popup.appendChild(context.cfg.calendar);
		};
		this.popup.calendar.update = function (context) {
			var a, b, offset, month, reference, count, table, thead, tbody, row, col, link, span;
			// create a working reference
			reference = new Date(context.cfg.reference.getFullYear(), context.cfg.reference.getMonth(), 1);
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
				col.innerHTML = context.cfg.days[a];
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
						if (reference.getTime() > context.cfg.minimum.getTime() && reference.getTime() < context.cfg.maximum.getTime()) {
							// fill the cell with the date
							link = document.createElement('a');
							link.innerHTML = reference.getDate();
							link.href = '#' + reference.getDate() +
								'-' + (reference.getMonth() + 1) +
								'-' + reference.getFullYear();
							col.appendChild(link);
							// set its click handler
							context.popup.calendar.events.dateClick(link, new Date(
								reference.getFullYear(),
								reference.getMonth(),
								reference.getDate()
							), context);
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
						reference.getFullYear() === context.cfg.date.getFullYear() &&
						reference.getMonth() === context.cfg.date.getMonth() &&
						reference.getDate() === context.cfg.date.getDate() + 1
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
			context.cfg.calendar.innerHTML = '';
			// add the table to the calendar
			context.cfg.calendar.appendChild(table);
		};
		this.popup.calendar.events = {};
		this.popup.calendar.events.dateClick = function (element, picked, context) {
			// set an event handler
			element.onclick = function () {
				// set the date from the picked cell
				context.cfg.date = picked;
				// update the component
				context.update(context);
				// close the popup
				context.cfg.hover = false;
				context.popup.remove(context);
				// cancel the click
				return false;
			};
		};
	};

}(window.useful = window.useful || {}));
