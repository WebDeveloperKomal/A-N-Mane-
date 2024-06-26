(function (factory) { 'use strict'; if (typeof define === 'function' && define.amd) { define(['jquery'], factory); } else if (typeof exports !== 'undefined') { module.exports = factory(require('jquery')); } else { factory(jQuery); } })(function ($) {
    'use strict'; function Hoverdir(element, options) { this.$el = $(element); this.options = $.extend(true, {}, this.defaults, options); this.isVisible = false; this.$hoverElem = this.$el.find(this.options.hoverElem); this.transitionProp = 'all ' + this.options.speed + 'ms ' + this.options.easing; this.support = this._supportsTransitions(); this._loadEvents(); }
    Hoverdir.prototype = {
        defaults: { speed: 300, easing: 'ease', hoverDelay: 0, inverse: false, hoverElem: 'div' }, constructor: Hoverdir, _supportsTransitions: function () {
            if (typeof Modernizr !== 'undefined') { return Modernizr.csstransitions; } else {
                var b = document.body || document.documentElement, s = b.style, p = 'transition'; if (typeof s[p] === 'string') { return true; }
                var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms']; p = p.charAt(0).toUpperCase() + p.substr(1); for (var i = 0; i < v.length; i++) { if (typeof s[v[i] + p] === 'string') { return true; } }
                return false;
            }
        }, _loadEvents: function () {
            this.$el.on('mouseenter.hoverdir mouseleave.hoverdir', $.proxy(function (event) {
                this.direction = this._getDir({ x: event.pageX, y: event.pageY }); if (event.type === 'mouseenter') { this._showHover(); }
                else { this._hideHover(); }
            }, this));
        }, _showHover: function () {
            var styleCSS = this._getStyle(this.direction); if (this.support) { this.$hoverElem.css('transition', ''); }
            this.$hoverElem.hide().css(styleCSS.from); clearTimeout(this.tmhover); this.tmhover = setTimeout($.proxy(function () {
                this.$hoverElem.show(0, $.proxy(function () {
                    if (this.support) { this.$hoverElem.css('transition', this.transitionProp); }
                    this._applyAnimation(styleCSS.to);
                }, this));
            }, this), this.options.hoverDelay); this.isVisible = true;
        }, _hideHover: function () {
            var styleCSS = this._getStyle(this.direction); if (this.support) { this.$hoverElem.css('transition', this.transitionProp); }
            clearTimeout(this.tmhover); this._applyAnimation(styleCSS.from); this.isVisible = false;
        }, _getDir: function (coordinates) { var w = this.$el.width(), h = this.$el.height(), x = (coordinates.x - this.$el.offset().left - (w / 2)) * (w > h ? (h / w) : 1), y = (coordinates.y - this.$el.offset().top - (h / 2)) * (h > w ? (w / h) : 1), direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4; return direction; }, _getStyle: function (direction) {
            var fromStyle, toStyle, slideFromTop = { 'left': '0', 'top': '-100%' }, slideFromBottom = { 'left': '0', 'top': '100%' }, slideFromLeft = { 'left': '-100%', 'top': '0' }, slideFromRight = { 'left': '100%', 'top': '0' }, slideTop = { 'top': '0' }, slideLeft = { 'left': '0' }; switch (direction) { case 0: case 'top': fromStyle = !this.options.inverse ? slideFromTop : slideFromBottom; toStyle = slideTop; break; case 1: case 'right': fromStyle = !this.options.inverse ? slideFromRight : slideFromLeft; toStyle = slideLeft; break; case 2: case 'bottom': fromStyle = !this.options.inverse ? slideFromBottom : slideFromTop; toStyle = slideTop; break; case 3: case 'left': fromStyle = !this.options.inverse ? slideFromLeft : slideFromRight; toStyle = slideLeft; break; }
            return { from: fromStyle, to: toStyle };
        }, _applyAnimation: function (styleCSS) { $.fn.applyStyle = this.support ? $.fn.css : $.fn.animate; this.$hoverElem.stop().applyStyle(styleCSS, $.extend(true, [], { duration: this.options.speed })); }, show: function (direction) { this.$el.off('mouseenter.hoverdir mouseleave.hoverdir'); if (!this.isVisible) { this.direction = direction || 'top'; this._showHover(); } }, hide: function (direction) { this.rebuild(); if (this.isVisible) { this.direction = direction || 'bottom'; this._hideHover(); } }, setOptions: function (options) { this.options = $.extend(true, {}, this.defaults, this.options, options); }, destroy: function () { this.$el.off('mouseenter.hoverdir mouseleave.hoverdir'); this.$el.data('hoverdir', null); }, rebuild: function (options) {
            if (typeof options === 'object') { this.setOptions(options); }
            this._loadEvents();
        }
    }; $.fn.hoverdir = function (option, parameter) {
        return this.each(function () {
            var data = $(this).data('hoverdir'); var options = typeof option === 'object' && option; if (!data) { data = new Hoverdir(this, options); $(this).data('hoverdir', data); }
            if (typeof option === 'string') { data[option](parameter); if (option === 'destroy') { $(this).data('hoverdir', false); } }
        });
    }; $.fn.hoverdir.Constructor = Hoverdir;
});