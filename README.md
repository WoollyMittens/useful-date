# useful.date.js: Date Picker

An alternative for the HTML5 date input element.

Try the <a href="http://www.woollymittens.nl/useful/default.php?url=useful-date">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/date.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/date.min.js"></script>
```

To enable the use of HTML5 tags in Internet Explorer 8 and lower, include *html5.js*. To provide an alternative for *document.querySelectorAll* and CSS3 animations in Internet Explorer 8 and lower, include *jQuery*.

```html
<!--[if lte IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<![endif]-->
```

## How to start the script

This is the safest way of starting the script, but allows for only one target element at a time.

```javascript
var date = new useful.Date( document.getElementById('id'), {
	'years' : [20, -120],
	'months' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	'days' : ['s', 'm', 't', 'w', 't', 'f', 's'],
	'format' : 'd/m/y',
	'support' : navigator.userAgent.match(/webkit|opera|msie 10/gi)
});
date.start();
```

**years : {array}** - The offsets between the current year and the maximum and minimum year.

**months : {array}** - The names of the months for use in labels.

**days : {array}** - The names of the days for use in labels.

**format : {string}** - The expected format of the date.

**support : {boolean}** - A test to determine which browsers have native support for the date input element.

### Using document.querySelectorAll

This method allows CSS Rules to be used to apply the script to one or more nodes at the same time.

```javascript
var dates = new useful.Instances(
	document.querySelectorAll('input.date'),
	useful.Date,
	{
		'years' : [20, -120],
		'months' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		'days' : ['s', 'm', 't', 'w', 't', 'f', 's'],
		'format' : 'd/m/y',
		'support' : navigator.userAgent.match(/webkit|opera|msie 10/gi)
	}
);
dates.wait();
```

The "Instances" function clones the settings for each element in the CSS rule.

### Using jQuery

This method is similar to the previous one, but uses jQuery for processing the CSS rule and cloning the settings.

```javascript
var dates = [];
$('input.date').each(function (index, element) {
	dates[index] = new useful.Date( element, {
		'years' : [20, -120],
		'months' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		'days' : ['s', 'm', 't', 'w', 't', 'f', 's'],
		'format' : 'd/m/y',
		'support' : navigator.userAgent.match(/webkit|opera|msie 10/gi)
	});
	dates[index].start();
});
```

## Prerequisites

To concatenate and minify the script yourself, the following prerequisites are required:
+ https://github.com/WoollyMittens/useful-positions
+ https://github.com/WoollyMittens/useful-interactions
+ https://github.com/WoollyMittens/useful-polyfills

## License
This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
