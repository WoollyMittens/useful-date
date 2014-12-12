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
			if (event.touches && event.touches[0]) {
				position.x = event.touches[0].pageX;
				position.y = event.touches[0].pageY;
			} else if (event.pageX !== undefined) {
				position.x = event.pageX;
				position.y = event.pageY;
			} else {
				position.x = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
				position.y = event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
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
	this.config = parent.config;
	this.element = parent.element;
	// methods
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
useful.Date.prototype.Main = function (config, context) {
	// properties
	"use strict";
	this.config = config;
	this.context = context;
	this.element = config.element;
	// methods
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
	// components
	this.popup = new this.context.Popup(this);
	this.calendar = new this.context.Calendar(this);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Date.Main;
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
	this.config = parent.config;
	this.element = parent.element;
	// methods
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
		this.config.position = useful.positions.object(this.config.button);
		this.config.limits = useful.positions.window();
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
useful.Date.prototype.init = function (config) {
	// properties
	"use strict";
	// methods
	this.only = function (config) {
		// start an instance of the script
		return new this.Main(config, this).init();
	};
	this.each = function (config) {
		var _config, _context = this, instances = [];
		// for all element
		for (var a = 0, b = config.elements.length; a < b; a += 1) {
			// clone the configuration
			_config = Object.create(config);
			// insert the current element
			_config.element = config.elements[a];
			// delete the list of elements from the clone
			delete _config.elements;
			// start a new instance of the object
			instances[a] = new this.Main(_config, _context).init();
		}
		// return the instances
		return instances;
	};
	// return a single or multiple instances of the script
	return (config.elements) ? this.each(config) : this.only(config);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Date;
}
