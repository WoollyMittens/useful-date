# date.js: Date Picker

An alternative for the HTML5 date input element.

Try the <a href="http://www.woollymittens.nl/default.php?url=useful-date">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/date.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/date.js"></script>
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

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
