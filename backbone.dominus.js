//
// Backbone adapter for the dominus DOM manipulation framework.
// Structured to match the Backbone.NativeView method of mixins.
// This also includes Backbone.ajax functionality through Reqwest.
// More about dominus: https://github.com/bevacqua/dominus
// and Reqwest: https://github.com/ded/reqwest
//
// @author Eric Adams
// @copyright (c) 2015
//
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'dominus', 'reqwest'], factory);
    }
    else if (typeof exports === 'object') {
        module.exports = factory(require('backbone'), require('dominus'), require('reqwest'));
    }
    else {
        factory(Backbone, dominus, reqwest);
    }
}(function (Backbone, dominus, reqwest) {

    // Backbone.DomViewMixin is the view mixin used to integrate
    // dominus-based views into your backbone application
    // The mixin approach inspired by Backbone.NativeView
    // See https://github.com/akre54/Backbone.NativeView#to-use
    Backbone.DomViewMixin = {

        // List of cached dom events for later removal
        // hash of 'eventName.cid' => [listener1, listener2, listenerN]
        _domEvents: null,

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
                for (var i = 0, len = handlers.length; i < len; i+=1) {
                    // Remove any events macthing the selector and listener
                    item = handlers[i];
                    if (item.selector === selector && item.listener === listener) {
                        this.$el.off(eventName, selector, listener);
                        this._domEvents[uniqEventName].splice(i, 1);
                    }
                    // Remove any event listeners for the eventName
                    else if (!listener) {
                        this.$el.off(eventName, (selector || item.selector), item.listener);
                        this._domEvents[uniqEventName].splice(i, 1);
                    }
                }
            }
            return this;
        },

        // Clears all callbacks previously bound to the view by `delegateEvents`.
        // You usually don't need to use this, but may wish to if you have multiple
        // Backbone views attached to the same DOM element.
        undelegateEvents: function() {
            var item;
            for (var uniqEventName in this._domEvents) {
                if (this._domEvents.hasOwnProperty[uniqEventName]) {
                    var handlers = this._domEvents[uniqEventName].slice();
                    var eventName = uniqEventName.split('.')[0];
                    for (var i = 0, len = handlers.length; i < len; i+=1) {
                        item = handlers[i];
                        this.$el.off(eventName, item.selector, item.listener);
                    }
                    this._domEvents[uniqEventName] = null;
                }
            }
            this._domEvents = {};
            return this;
        },

        // Creates the `this.el` and `this.$el` references for this view using the
        // given `el` and a hash of `attributes`. `el` can be a CSS selector or an
        // HTML string, a jQuery context or an element. Subclasses can override
        // this to utilize an alternative DOM manipulation API and are only required
        // to set the `this.el` property.
        _setElement: function(el) {
            this.$el = dominus(el);
            this.el = this.$el[0];
        }

    };

    // Setup ajax functionality for backbone-sans-jquery
    Backbone.ajax = function() {
        return reqwest.compat.apply(reqwest, arguments);
    };

    // Set the Backbone.DomView constructor for your application
    Backbone.DomView = Backbone.View.extend(Backbone.DomViewMixin);

    return Backbone.DomView;

}));
