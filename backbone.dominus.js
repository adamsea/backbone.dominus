//
// Backbone adapter for the dominus DOM manipulation framework.
// Structured to match the Backbone.NativeView method of mixins,
// but this will be extended directly into Backbone.View.prototype.
// @author Eric Adams
// @copyright (c) 2015
//
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['backbone', 'dominus'], factory);
	}
	else if (typeof exports === 'object') {
		module.exports = factory(require('backbone'), require('dominus'));
	}
	else {
		factory(Backbone, dominus);
	}
}(function (Backbone, dominus) {

	// DomView is the view mixin used to integrate
	// dominus-based views into your backbone application
	Backbone.DomView = {

		// List of cached dom events for later removal
		// hash of 'eventName.cid' => [listener1, listener2, listenerN]
		_domEvents = null,

		// Constructor, sets up the domEvents object
		constructor: function() {
			this._domEvents = {};
			return Backbone.View.apply(this, arguments);
		},

		// View-scoped element lookup.
		// Takes a string selector and returns an array-like object
		// (i.e. an object with a numeric length property, like an
		// NodeList, an Array, or a jQuery context) for easy iteration.
		$: function(selector) {
			return dominus.find(selector, this.el);
		},

		// Add a single event listener to the view's element (or a child element
		// using `selector`). This only works for delegate-able events: not `focus`,
		// `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
		delegate: function(eventName, selector, listener) {
			// Cache for later undelegation
			var uniqEventName = eventName + '.' + this.cid;
			if (!this._domEvents[uniqEventName]) {
				this._domEvents[uniqEventName] = [];
			}
			this._domEvents[uniqEventName].push({selector: selector, listener: listener});

			// Add the event to dominus
			this.$el.on(eventName, selector, listener);
			return this;
		},

		// A finer-grained `undelegateEvents` for removing a single delegated event.
		// `selector` and `listener` are both optional.
		undelegate: function(eventName, selector, listener) {
			var item,
				uniqEventName = eventName + '.' + this.cid;
			if (this._domEvents[uniqEventName]) {
				// Find any handlers in the event namespace
				var handlers = this._domEvents[uniqEventName].slice();
				for (var i = 0, len = handlers.length; i < len; i++) {
					// Remove any events macthing the selector and listener
					item = handlers[i];
					if (item.selector === selector && item.listener === listener) {
						this.$el.off(eventName, selector, listener);
						this._domEvents[uniqEventName].splice(indexOf(handlers, item), 1);
					}
				}
			}
			return this;
		},

		// Clears all callbacks previously bound to the view by `delegateEvents`.
		// You usually don't need to use this, but may wish to if you have multiple
		// Backbone views attached to the same DOM element.
		undelegateEvents: function() {
			var item, eventList;
			for (var uniqEventName in this._domEvents) {
				if (this._domEvents.hasOwnProperty[uniqEventName]) {
					var handlers = this._domEvents[uniqEventName].slice();
					var eventName = uniqEventName.split('.')[0];
					for (var i = 0, len = handlers.length; i < len; i++) {
						item = handlers[i];
						this.$el.off(eventName, item.selector, item.listener);
					}
					this._domEvents[uniqEventName] = null;
				}
			}
			this._domEvents = {};
			return this;
		}

	};

}));
