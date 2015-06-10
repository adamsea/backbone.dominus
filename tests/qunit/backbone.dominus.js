(function(QUnit, Backbone, dominus, reqwest) {

    // Module setup
    QUnit.module('Backbone.Dominus', {
        setup: function() {
            this.view = Backbone.DomView.extend({});
        },
        teardown: function() {
            this.view = null;
        }
    });

    // Test of constructor
    QUnit.test('Test constructor', function(assert) {
        var view = new this.view();
        assert.ok(this.view.prototype._domEvents === null, 'Property not initialized');
        assert.deepEqual(view._domEvents, {}, 'Property initialized');
    });

    // Test the view-scoped $ function
    QUnit.test('Test $ for retrieving elements', function(assert) {
        var view = new this.view();
        this.stub(dominus, 'find');
        view.el = document.createElement('div');
        view.$('.my-selector');
        assert.deepEqual(dominus.find.args[0], ['.my-selector', view.el], 'Element was selected');
    });

    // Test event delegation for the view
    QUnit.test('Test delegate', function(assert) {
        var view = new this.view();
        var listener = function() {};
        this.stub(view.$el, 'on');
        view.cid = 'test';
        view.delegate('click', '.my-selector', listener);
        assert.deepEqual(view._domEvents, {
            'click.test': [{selector: '.my-selector', listener: listener}]
        });
        assert.deepEqual(view.$el.on.args[0], [
            'click', '.my-selector', listener
        ], 'The event was added to the dom');
    });

    // Test event undelegate
    QUnit.test('Test undelegate no provided listener/selector', function(assert) {
        var view = new this.view();
        var listener = function() {};
        var listener2 = function() {};
        this.stub(view.$el, 'off');
        view._domEvents = {
            'click.test': [
                {selector: null, listener: listener},
                {selector: null, listener: listener2}
            ]
        };
        view.cid = 'test';
        view.undelegate('click');
        assert.deepEqual(view._domEvents, {'click.test': []}, 'The events were removed from memory');
        assert.deepEqual(view.$el.off.args, [
            ['click', null, listener2],
            ['click', null, listener]
        ], 'The events were removed from the dom');
    });

    // Test event undelegate with selector/listener
    QUnit.test('Test undelegate with provided listener/selector', function(assert) {
        var view = new this.view();
        var listener = function() {};
        var listener2 = function() {};
        this.stub(view.$el, 'off');
        view._domEvents = {
            'click.test': [
                {selector: '.my-selector', listener: listener},
                {selector: '.my-selector', listener: listener2}
            ]
        };
        view.cid = 'test';
        view.undelegate('click', '.my-selector', listener2);
        assert.deepEqual(view._domEvents, {
            'click.test': [{selector: '.my-selector', listener: listener}]
        }, 'The event was removed from memory');
        assert.deepEqual(view.$el.off.args, [
            ['click', '.my-selector', listener2]
        ], 'The event was removed from the dom');
    });

    // Test undelegateEvents - all events for this.el
    QUnit.test('Test undelegateEvents', function(assert) {
        var view = new this.view();
        view._domEvents = {
            'click.test': [
                {selector: null, listener: function() {}},
                {selector: '.my-selector', listener: function() {}}
            ],
            'mouseleave.test': [
                {selector: '.other-selector', listener: function() {}}
            ]
        };
        view.cid = 'test';
        this.stub(view.$el, 'off');
        view.undelegateEvents();
        assert.deepEqual(view._domEvents, {}, 'No dom events are left in memory for the view');
        assert.ok(view.$el.off.calledThrice, 'All events were removed from the dom for the view');
    });

    // Test setElement through dominus
    QUnit.test('Test _setElement', function(assert) {
        var fixture = document.getElementById('qunit-fixture');
        var elem = document.createElement('div');
        elem.className = 'my-element';
        elem.textContent = 'Here is some text';
        fixture.appendChild(elem);
        var view = new this.view();

        // With dom element instance
        view._setElement(elem);
        assert.deepEqual(view.$el, [elem], 'The collection is used for the view $el');
        assert.deepEqual(view.el, elem, 'The element is used for the view el');

        // With selector
        view.$el = view.el = null;
        view._setElement('.my-element');
        assert.deepEqual(view.$el, [elem], 'The collection is used for the view $el');
        assert.deepEqual(view.el, elem, 'The element is used for the view el');
    });

    // Test Backbone.ajax
    QUnit.test('Test Backbone.ajax', function(assert) {
        this.stub(reqwest, 'compat')
            .returns('ret');
        var ret = Backbone.ajax({url: 'http://www.example.com'});
        assert.equal(ret, 'ret', 'The reqwest return is returned from Backbone.ajax');
        assert.deepEqual(reqwest.compat.args[0][0], {
            url: 'http://www.example.com'
        }, 'The Backbone.ajax args are passed to reqwest');
    });

}(window.QUnit, window.Backbone, window.dominus, window.reqwest));
