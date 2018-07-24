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
