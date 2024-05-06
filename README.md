# date.js: Date Picker

*DEPRICATION WARNING: the functionality in this script has been superceeded / trivialised by updated web standards.*

An alternative for the HTML5 date input element.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="css/date.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="lib/positions.js"></script>
<script src="js/date.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	'lib/positions.js',
	'js/date.js'
], function(positions, DatePicker) {
	...
});
```

Or use imported as a component in existing projects.

```js
@import {positions = require('lib/positions.js";
@import {DatePicker} from "js/date.js";
```

## How to start the script

```javascript
var dates = new  DatePicker({
	'elements' : document.querySelectorAll('input.date'),
	// names
	'years' : [20, -120],
	'months' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	'days' : ['s', 'm', 't', 'w', 't', 'f', 's'],
	// format of the output date options: d, m, M, y
	'format' : 'd/m/y'
});
```

**years : {array}** - The offsets between the current year and the maximum and minimum year.

**months : {array}** - The names of the months for use in labels.

**days : {array}** - The names of the days for use in labels.

**format : {string}** - The expected format of the date.

**support : {boolean}** - A test to determine which browsers have native support for the date input element.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens).
