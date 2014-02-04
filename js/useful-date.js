/*
	Source:
	van Creij, Maurice (2012). "useful.positions.js: A library of useful functions to ease working with screen positions.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var positions = positions || {};

	// find the dimensions of the window
	positions.window = function (parent) {
		// define a position object
		var dimensions = {x : 0, y : 0};
		// if an alternative was given to use as a window
		if (parent && parent !== window) {
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
	};

	// find the scroll position of an element
	positions.document = function (parent) {
		// define a position object
		var position = {x : 0, y : 0};
		// find the current position in the document
		if (parent && parent !== window) {
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
	};

	// finds the position of the element, relative to the document
	positions.object = function (node) {
		// define a position object
		var position = {x : 0, y : 0};
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
	};

	// find the position of the mouse cursor relative to an element
	positions.cursor = function (event, parent) {
		// get the event properties
		event = event || window.event;
		// define a position object
		var position = {x : 0, y : 0};
		// find the current position on the document
		position.x = event.pageX || event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		position.y = event.pageY || event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		// if a parent was given
		if (parent) {
			// retrieve the position of the parent
			var offsets = positions.object(parent);
			// adjust the coordinates to fit the parent
			position.x -= offsets.x;
			position.y -= offsets.y;
		}
		// return the object
		return position;
	};

	// public functions
	useful.positions = useful.positions || {};
	useful.positions.window = positions.window;
	useful.positions.document = positions.document;
	useful.positions.object = positions.object;
	useful.positions.cursor = positions.cursor;

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.instances.js: A library of useful functions to ease working with instances of constructors.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Usage:
	var instances = new useful.Instances(document.querySelectorAll('#id.classname'), Constructor, {'foo':'bar'});
	instances.wait(); or instances.start();
	object = instances.get(element);
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// public functions
	useful.Instances = function (objs, constructor, cfgs) {
		// properties
		this.objs = objs;
		this.constructor = constructor;
		this.cfgs = cfgs;
		this.constructs = [];
		this.delay = 200;
		// keeps trying until the DOM is ready
		this.wait = function () {
			var scope = this;
			scope.timeout = (document.readyState.match(/interactive|loaded|complete/i)) ?
				scope.start():
				setTimeout(function () { scope.wait(); }, scope.delay);
		};
		// starts and stores an instance of the constructor for every element
		this.start = function () {
			for (var a = 0, b = this.objs.length; a < b; a += 1) {
				// store a constructed instance with cloned cfgs object
				this.constructs[a] = new this.constructor(this.objs[a], Object.create(this.cfgs));
				this.constructs[a].start();
			}
			return null;
		};
		// returns the constructs
		this.getAll = function () {
			return this.constructs;
		};
		// returns the object that goes with the element
		this.getByObject = function (element) {
			return this.constructs[this.constructs.indexOf(element)];
		};
		// returns the object that goes with the index
		this.getByIndex = function (index) {
			return this.constructs[index];
		};
	};

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var polyfills = polyfills || {};

	// enabled the use of HTML5 elements in Internet Explorer
	polyfills.html5 = function () {
		var a, b, elementsList;
		elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
		if (navigator.userAgent.match(/msie/gi)) {
			for (a = 0 , b = elementsList.length; a < b; a += 1) {
				document.createElement(elementsList[a]);
			}
		}
	};

	// allow array.indexOf in older browsers
	polyfills.arrayIndexOf = function () {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i += 1) {
					if (this[i] === obj) { return i; }
				}
				return -1;
			};
		}
	};

	// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
	polyfills.querySelectorAll = function () {
		if (!document.querySelectorAll) {
			document.querySelectorAll = function (a) {
				var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
				return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
			};
		}
	};

	// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
	polyfills.addEventListener = function () {
		!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
			WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
				var target = this;
				registry.unshift([target, type, listener, function (event) {
					event.currentTarget = target;
					event.preventDefault = function () { event.returnValue = false; };
					event.stopPropagation = function () { event.cancelBubble = true; };
					event.target = event.srcElement || target;
					listener.call(target, event);
				}]);
				this.attachEvent("on" + type, registry[0][3]);
			};
			WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
				for (var index = 0, register; register = registry[index]; ++index) {
					if (register[0] == this && register[1] == type && register[2] == listener) {
						return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
					}
				}
			};
			WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
				return this.fireEvent("on" + eventObject.type, eventObject);
			};
		})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
	};

	// allow console.log
	polyfills.consoleLog = function () {
		if (!window.console) {
			window.console = {};
			window.console.log = function () {
				// if the reporting panel doesn't exist
				var a, b, messages = '', reportPanel = document.getElementById('reportPanel');
				if (!reportPanel) {
					// create the panel
					reportPanel = document.createElement('DIV');
					reportPanel.id = 'reportPanel';
					reportPanel.style.background = '#fff none';
					reportPanel.style.border = 'solid 1px #000';
					reportPanel.style.color = '#000';
					reportPanel.style.fontSize = '12px';
					reportPanel.style.padding = '10px';
					reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
					reportPanel.style.right = '10px';
					reportPanel.style.bottom = '10px';
					reportPanel.style.width = '180px';
					reportPanel.style.height = '320px';
					reportPanel.style.overflow = 'auto';
					reportPanel.style.zIndex = '100000';
					reportPanel.innerHTML = '&nbsp;';
					// store a copy of this node in the move buffer
					document.body.appendChild(reportPanel);
				}
				// truncate the queue
				var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
				// process the arguments
				for (a = 0, b = arguments.length; a < b; a += 1) {
					messages += arguments[a] + '<br/>';
				}
				// output the queue to the panel
				reportPanel.innerHTML = messages + reportString;
			};
		}
	};

	// allows Object.create (https://gist.github.com/rxgx/1597825)
	polyfills.objectCreate = function () {
		if (typeof Object.create !== "function") {
			Object.create = function (original) {
				function Clone() {}
				Clone.prototype = original;
				return new Clone();
			};
		}
	};

	// allows String.trim (https://gist.github.com/eliperelman/1035982)
	polyfills.stringTrim = function () {
		if (!String.prototype.trim) {
			String.prototype.trim = function () { return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ''); };
		}
		if (!String.prototype.ltrim) {
			String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
		}
		if (!String.prototype.rtrim) {
			String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
		}
		if (!String.prototype.fulltrim) {
			String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
		}
	};

	// for immediate use
	polyfills.html5();
	polyfills.arrayIndexOf();
	polyfills.querySelectorAll();
	polyfills.addEventListener();
	polyfills.consoleLog();
	polyfills.objectCreate();
	polyfills.stringTrim();

}(window.useful = window.useful || {}));

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
