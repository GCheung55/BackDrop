/**
 * BackDrop, a Class to help create and control the veil that often appears with modals or lightboxes
 *
 * @requires [MooTools-Core (https://github.com/mootools/mootools-core/),
 *            PowerTools/Class.Binds.js (https://github.com/cpojer/mootools-class-extras/blob/master/Source/Class.Binds.js),
 *            PowerTools/Class.Singleton.js (https://github.com/cpojer/mootools-class-extras/blob/master/Source/Class.Singleton.js)]
 *
 * @param {Element} element [optional] The element to act as the BackDrop. If none is passed, one will be created
 * @param {Object} options [optional] The options for the class.
 *
 * @return {Class}
 */
(function(context){
    var isIE = Browser.ie && Browser.version <= 9;

    context.BackDrop = new Class({
        Implements: [Class.Binds, Class.Singleton, Events, Options],

        options: {
            /**
             * Reference point for BackDrop element injection
             * @type {Element} Default to document.body if one is not passed. Can also be set using setReference method
             */
            reference: undefined,
            /**
             * Element options to build BackDrop element if one is not passed during BackDrop instantiation
             * @type {Object}
             */
            elementOpts: {
                tag: 'div',
                attributes: {
                    id: 'backDrop'
                }
            },
            /**
             * CSS class for hiding BackDrop element
             * Removed when showing, applied when hiding
             * @type {String}
             */
            hideClass: 'hidden',
            /**
             * CSS class for showing BackDrop element
             * Removed when hiding, applied when showing
             * @type {String}
             */
            showClass: 'visible',
            /**
             * CSS class used when page is loading
             * @type {String}
             */
            loadClass: 'load',
            /**
             * Selector used for Fx.Morph when CSS3 transitions/translations are unavailable
             * show/hide Selector's need to be by themselves because of a bug in MT 1.3.2 Fx.CSS.search is buggy
             * @type {String}
             */
            hideSelector: '.bd_hidden',
            showSelector: '.bd_visible'
        },

        initialize: function(element, options){
            return this.check() || this.setup(element, options);
        },

        setup: function(element, options){
            this.setOptions(options);

            options = this.options;

            // Create and store the BackDrop element if one does not exist
            this.element = element = (document.id(element) || new Element(options.elementOpts.tag, options.elementOpts.attributes)).removeClass(options.loadClass).dispose();

            // IE needs to have a starting point loaded
            // Else 'show' will be jumpy on first morph
            if (isIE) { element.get('morph').set(options.hideSelector); }

            // Store the reference point for injection
            this.setReference(options.reference);

            this.attachEvents(element);
        },

        attachEvents: function(element){
            element.addEvent('click', this.bound('hide'));

            return this;
        },

        /**
         * Show the BackDrop
         * @return {Class} Instance
         */
        show: function() {
            // Inject element into the reference element
            this.element.inject(this.reference);

            // resize the BackDrop element based on the reference element
            this.resize();

            // Remove hide css class and apply show css class
            this.toggle('show', 'hide');

            // Call custom show events attached to the BackDrop instance
            this.fireEvent('show');

            return this;
        },

        /**
         * Hide the BackDrop
         * @return {Class} Instance
         */
        hide: function() {
            // Remove show css class and apply hide css class
            this.toggle('hide', 'show');

            // Remove the element
            this.element.dispose();

            // Call custom hide events attached to the BackDrop instance
            this.fireEvent('hide');

            return this;
        },

        /**
         * Toggle between show/hide css class or selectors for Fx.Morph
         * @param  {String} to   The reference key used to retrieve the correct value to be applied. Eg. 'show' for 'show' + 'Selector', which becomes 'showSelector'
         * @param  {String} from The reference key used to retrieve the correct value to be removed. Eg. 'hide' for 'hide' + 'Selector', which becomes 'hideSelector'
         * @return {Class} Instance
         */
        toggle: ( isIE ? function(to, from){
            this.element.morph( this.options[to + 'Selector'] );

            return this;
        } : function(to, from){
            this.element.removeClass( this.options[from + 'Class'] ).addClass( this.options[to + 'Class'] );

            return this;
        }),

        /**
         * Resize the BackDrop element to the size of it's reference element
         * @return {Class} Instance
         */
        resize: function() {
            var size = this.reference.getScrollSize();

            this.element.setStyles({
                'height': size.y,
                'width': size.x
            });

            return this;
        },

        /**
         * Set the reference element to be used for resizing and placement of the BackDrop element
         * @param {Element || String} element Id of an element or an Element. Defaults to document.body
         * @return {Class} Instance
         */
        setReference: function(element){
            this.reference = document.id(element) || document.id(document.body);

            return this;
        },

        /**
         * Get the reference element
         * @return {Element}
         */
        getReference: function(){
            return this.reference;
        }
    });

})(typeof exports != 'undefined' ? exports : window);