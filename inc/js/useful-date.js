/*
	Source:
	van Creij, Maurice (2014). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.polyfills = {

		// enabled the use of HTML5 elements in Internet Explorer
		html5 : function () {
			var a, b, elementsList;
			elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
			if (navigator.userAgent.match(/msie/gi)) {
				for (a = 0 , b = elementsList.length; a < b; a += 1) {
					document.createElement(elementsList[a]);
				}
			}
		},

		// allow array.indexOf in older browsers
		arrayIndexOf : function () {
			if (!Array.prototype.indexOf) {
				Array.prototype.indexOf = function (obj, start) {
					for (var i = (start || 0), j = this.length; i < j; i += 1) {
						if (this[i] === obj) { return i; }
					}
					return -1;
				};
			}
		},

		// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
		querySelectorAll : function () {
			if (!document.querySelectorAll) {
				document.querySelectorAll = function (a) {
					var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
					return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
				};
			}
		},

		// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
		addEventListener : function () {
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
		},

		// allow console.log
		consoleLog : function () {
			var overrideTest = new RegExp('console-log', 'i');
			if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
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
					// add a break after the message
					messages += '<hr/>';
					// output the queue to the panel
					reportPanel.innerHTML = messages + reportString;
				};
			}
		},

		// allows Object.create (https://gist.github.com/rxgx/1597825)
		objectCreate : function () {
			if (typeof Object.create !== "function") {
				Object.create = function (original) {
					function Clone() {}
					Clone.prototype = original;
					return new Clone();
				};
			}
		},

		// allows String.trim (https://gist.github.com/eliperelman/1035982)
		stringTrim : function () {
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
		},

		// allows localStorage support
		localStorage : function () {
			if (!window.localStorage) {
				if (/MSIE 8|MSIE 7|MSIE 6/i.test(navigator.userAgent)){
					window.localStorage = {
						getItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return null;
							}
							return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
						},
						key: function(nKeyId) {
							return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
						},
						setItem: function(sKey, sValue) {
							if (!sKey) {
								return;
							}
							document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
							this.length = document.cookie.match(/\=/g).length;
						},
						length: 0,
						removeItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return;
							}
							document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
							this.length--;
						},
						hasOwnProperty: function(sKey) {
							return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
						}
					};
					window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
				} else {
				    Object.defineProperty(window, "localStorage", new(function() {
				        var aKeys = [],
				            oStorage = {};
				        Object.defineProperty(oStorage, "getItem", {
				            value: function(sKey) {
				                return sKey ? this[sKey] : null;
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "key", {
				            value: function(nKeyId) {
				                return aKeys[nKeyId];
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "setItem", {
				            value: function(sKey, sValue) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "length", {
				            get: function() {
				                return aKeys.length;
				            },
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "removeItem", {
				            value: function(sKey) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        this.get = function() {
				            var iThisIndx;
				            for (var sKey in oStorage) {
				                iThisIndx = aKeys.indexOf(sKey);
				                if (iThisIndx === -1) {
				                    oStorage.setItem(sKey, oStorage[sKey]);
				                } else {
				                    aKeys.splice(iThisIndx, 1);
				                }
				                delete oStorage[sKey];
				            }
				            for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
				                oStorage.removeItem(aKeys[0]);
				            }
				            for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
				                aCouple = aCouples[nIdx].split(/\s*=\s*/);
				                if (aCouple.length > 1) {
				                    oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
				                    aKeys.push(iKey);
				                }
				            }
				            return oStorage;
				        };
				        this.configurable = false;
				        this.enumerable = true;
				    })());
				}
			}
		}

	};

	// startup
	useful.polyfills.html5();
	useful.polyfills.arrayIndexOf();
	useful.polyfills.querySelectorAll();
	useful.polyfills.addEventListener();
	useful.polyfills.consoleLog();
	useful.polyfills.objectCreate();
	useful.polyfills.stringTrim();
	useful.polyfills.localStorage();

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.polyfills;
	}

})();

/*
	Source:
	van Creij, Maurice (2014). "useful.positions.js: A library of useful functions to ease working with screen positions.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.positions = {

		// find the dimensions of the window
		window : function (parent) {
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
		},

		// find the scroll position of an element
		document : function (parent) {
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
		},

		// finds the position of the element, relative to the document
		object : function (node) {
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
		},

		// find the position of the mouse cursor relative to an element
		cursor : function (event, parent) {
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
		exports = module.exports = useful.positions;
	}

})();

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
useful.Date.prototype.Main = function (cfg, parent) {
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
useful.Date.prototype.init = function (cfg) {
	// properties
	"use strict";
	// methods
	this.only = function (cfg) {
		// start an instance of the script
		return new this.Main(cfg, this);
	};
	this.each = function (cfg) {
		var _cfg, instances = [];
		// for all element
		for (var a = 0, b = cfg.elements.length; a < b; a += 1) {
			// clone the cfguration
			_cfg = Object.create(cfg);
			// insert the current element
			_cfg.element = cfg.elements[a];
			// delete the list of elements from the clone
			delete _cfg.elements;
			// start a new instance of the object
			instances[a] = new this.Main(_cfg, this);
		}
		// return the instances
		return instances;
	};
	// return a single or multiple instances of the script
	return (cfg.elements) ? this.each(cfg) : this.only(cfg);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Date;
}
