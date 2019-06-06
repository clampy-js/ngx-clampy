# ngx-clampy

### Angular (2+) directive that clamps the content of an element by adding an ellipsis to it if the content inside is too long.
[![Build Status](https://img.shields.io/travis/clampy-js/ngx-clampy.svg)](https://travis-ci.org/clampy-js/ngx-clampy)
[![GitHub issues](https://img.shields.io/github/issues/clampy-js/ngx-clampy.svg)](https://github.com/clampy-js/ngx-clampy/issues)
[![GitHub license](https://img.shields.io/github/license/clampy-js/ngx-clampy.svg)](https://github.com/clampy-js/ngx-clampy/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/dt/@clampy-js/ngx-clampy.svg)](https://www.npmjs.com/package/@clampy-js/ngx-clampy)

It uses [@clampy-js/clampy](https://github.com/clampy-js/clampy) library (a fork of [Clamp.js](https://github.com/josephschmitt/Clamp.js)) behind the scene to apply the ellipsis.

It automatically re-clamps itself when the element or the browser window change size.

You can also listen to 'originalContent' event which is emitting the original vlue uppon clamping. This can be useful if you want to display the original content in a tooltip for instance.
Example:

```typescript
<p clampy (originalContent)="getTooltipContent($event)">
...
</p>
```

#### Options
|Option   |Type   |Default   |Description   |
|---|---|---|---|
|clampy   |string   |auto   |This controls where and when to clamp the text of an element. Submitting a number controls the number of lines that should be displayed. Second, you can submit a CSS value (in px or em) that controls the height of the element as a String. Finally, you can submit the word 'auto' as a string. Auto will try to fill up the available space with the content and then automatically clamp once content no longer fits.   |
|clampyContent   |string   |undefined   |Sometimes you need to apply an ellipsis on HTML content. The prefered Angular way to usually do this is to bind the HTML content to the innerHTML attribute. However, this directive also modifies the innerHTML property and this may produce unexpected results. To counter this, you can instead bind it to the clampyContent attribute. The content will be automatically sanitized by the directive so that only safe HTML content will be present.|
|clampyTruncationCharacter   |string   |…   |The character to insert at the end of the HTML element after truncation is performed. This defaults to an ellipsis (…).   |
|clampyTruncationHTML   |string   |…   |A string of HTML to insert before the truncation character. This is useful if you'd like to add a "Read more" link or some such thing at the end of your clamped node.   |

#### Installation
For Angular 2 up to version 6, use version 1.3.x.
For angular 7, use version 7.0.x.

You can install @clampy-js/ngx-clampy using NPM or Yarn:

```
npm install @clampy-js/ngx-clampy
```

```
yarn install @clampy-js/ngx-clampy
```

Note: Starting from version 1.3.0, @clampy-js/ngx-clampy requires the following peer dependencies:

- @angular/common
- @angular/core
- @angular/platform-browser
- element-resize-detector
- lodash-es

Simply check the warnings in the console to know which exact versions are required.
