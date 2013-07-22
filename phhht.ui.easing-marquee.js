(function ($) {
    $.widget( "phhht.easing_marquee", {
        // These options will be used as defaults
        options: { 
            dir: 'rtl', //'rtl', 'ltr', 'btt', 'ttb'
            easingIn: 'easeOutBounce',
            easingOut: 'swing',
            durationIn: 2000,
            durationFreeze: 5000,
            durationOut: 1000
        },
        _init: function() {
            var that = this,
                el = $(this.element),
                doc = $(document);
            var phId = el.attr("id") || "";
            var clId = phId ? "#" + phId : "";

            el.css("position", "relative");

            this.items = el.children("div");
            this.items.css("position", "absolute").hide();

            var classes = "<style owner='phhht" + phId +"'>";
            for (var x = 0, len = this.items.length; x < len; x++) {
                var item = $(this.items[x]);
                var opts = this._getOptions(item);

                //set up start, freeze, and end class for item; create classes and store names in data attributes
                var direction = opts.dir;

                switch (direction) {
                    case "rtl":
                        var sLeft = el.outerWidth() + 1;
                        var sTop = fTop = eTop = Math.round(el.height() / 2 - item.height() / 2);
                        var fLeft = Math.round(el.width() / 2 - item.width() / 2);
                        var eLeft = -(item.outerWidth() + 1);
                        break;
                    case "ltr":
                        var eLeft = el.outerWidth() + 1;
                        var sTop = fTop = eTop = Math.round(el.height() / 2 - item.height() / 2);
                        var fLeft = Math.round(el.width() / 2 - item.width() / 2);
                        var sLeft = -(item.outerWidth() + 1);
                        break;
                    case "btt":
                        var sLeft = fLeft = eLeft = Math.round(el.width() / 2 - item.width() / 2);
                        var sTop = el.outerHeight() + 1;
                        var fTop = Math.round(el.height() / 2 - item.height() / 2);
                        var eTop = -(item.outerHeight() + 1);
                        break;
                    case "ttb":
                        var sLeft = fLeft = eLeft = Math.round(el.width() / 2 - item.width() / 2);
                        var eTop = el.outerHeight() + 1;
                        var fTop = Math.round(el.height() / 2 - item.height() / 2);
                        var sTop = -(item.outerHeight() + 1);
                        break;
                }

                var cStart = "phhht_start_" + x;
                item.data("phhht-start", cStart);
                var cFreeze = "phhht_freeze_" + x;
                item.data("phhht-freeze", cFreeze);
                var cEnd = "phhht_end_" + x;
                item.data("phhht-end", cEnd);

                classes += "\n" + clId + " ." + cStart + " { top: " + sTop + "px; left: " + sLeft + "px; }\n" +
                    clId + " ." + cFreeze + " { top: " + fTop + "px; left: " + fLeft + "px; }\n" +
                    clId + " ." + cEnd + " { top: " + eTop + "px; left: " + eLeft + "px; }\n";
            }

            classes += "</style>";
            $("html > head > style[owner='phhht" + phId + "']").remove();

            if (MSApp && MSApp.execUnsafeLocalFunction) {
                MSApp.execUnsafeLocalFunction(function () {
                    $("html > head").append($(classes));
                });
            }
            else {
                $("html > head").append($(classes));
            }
        },
        _getOptions: function(i) {
            var d_options = i.data("phhht-options"); //must be in proper json format
            var opts = d_options ? $.extend({}, this.options, d_options) : this.options;
            return opts;
        },
        _create: function () {
            // The _create method is where you set up the widget
            this._init();
            var that = this;

            $(window).resize(function () {
                that._init();
            });
        },
        // Keep various pieces of logic in separate methods
        go: function() {
            // Methods without an underscore are "public"
            this.stopIt = false;
            var that = this;
            var x = 0;
            var len = this.items.length;

            var runit = function () {
                if (!that.stopIt) {
                    var item = $(that.items[x % len]);
                    x += 1;
                    var opts = that._getOptions(item);
                    item.show().addClass(item.data("phhht-start"), { duration: 0 }); //put at start
                    item.addClass(item.data("phhht-freeze"), {
                        duration: opts.durationIn, easing: opts.easingIn
                    }
                    ).delay(opts.durationFreeze);
                    item.addClass(item.data("phhht-end"), {
                        duration: opts.durationOut, easing: opts.easingOut,
                        complete: function () {
                            item.hide().removeClass(item.data("phhht-end")).removeClass(item.data("phhht-freeze")).removeClass(item.data("phhht-start")); //reset item
                        }
                    });

                    if (!that.stopIt) {
                        setTimeout(runit, opts.durationFreeze + opts.durationIn);
                    }
                }
            };
            runit();
        },
        stop: function () {
            this.stopIt = true;
        },
        _setOption: function( key, value ) {
            // Use the _setOption method to respond to changes to options
            this.options[key] = value;
            // and call the parent function too!
            return this._superApply( arguments );
        },
        _destroy: function() {
            // Use the destroy method to reverse everything your plugin has applied
            $(window).unbind('resize', this._init);
            return this._super();
        }
    });
})(jQuery);