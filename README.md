# backbone.dominus
A uses dominus instead of jQuery to allow Backbone to work with leaner dependencies.


## Installation
```
bower install backbone.dominus
```

### Loading
Will work with AMD, CommonJS, and also adds `Backbone.DomView` to the root Backbone object.

#### Loading Backbone.$
By default Backbone will try to `require('jquery')` and load the global jQuery object `$` into `Backbone.$`.  For AMD you can set up require path configs to point jquery to dominus, and for CommonJS you can use [aliasify](https://github.com/benbria/aliasify) to do the same.

### Dependencies
* [Dominus](https://github.com/bevacqua/dominus) for dom querying and view.$el abstractions
* [Reqwest](https://github.com/ded/reqwest) for Backbone.ajax functionality

## Usage
A new view type is exposed called Backbone.DomView and can be extended.  See [Backbone.NativeView](https://github.com/akre54/Backbone.NativeView) for other examples.
```
var view = Backbone.DomView.extend({
   //...
});
```


## For Development
```
git clone https://github.com/adamsea/backbone.dominus.git
npm install
bower install
```


### Run the Tests
```
npm test
```


## Why do this?
Backbone.NativeView is a great reference example for building a [jQuery-free Backbone](https://github.com/jashkenas/backbone/wiki/Using-Backbone-without-jQuery).  However, for ease of development within the Backbone ecosystem I was looking for lightweight jQuery replacements that could be useful on their own, while solving common problems.

[Dominus](https://github.com/bevacqua/dominus) is a good general-purpose DOM querying and manipulation library that will handle the following:

* Context-rooted queries in qSA - properly scoped lookup of view.$el sub-elements
* Event normalization - manages both attachEvent and addEventListener
* A jQuery-like fluent api for managing the DOM

[Reqwest](https://github.com/ded/reqwest) runs in jQuery-compat mode to work with Backbone Model and Collection instances, and gives you a solid api for making your own requests.
