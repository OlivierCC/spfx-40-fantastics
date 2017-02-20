/*!
 * Interpolate
 *
 * Copyright (c) 2013-2016 Martijn W. van der Lee
 * Licensed under the MIT.
 */
(function(a,h){a.fn.interpolate=function(d,c,b,e){var f=this;a.isPlainObject(d)?(e=b||"linear",b=a.isNumeric(c)?c:.5,a.each(d,function(c,d){a.each(f,function(){a.Tween(this,{duration:1},c,d,e).run(b)})})):(b=a.isNumeric(b)?b:.5,a.each(f,function(){a.Tween(this[0],{duration:1},d,c,e||"linear").run(b)}));return this};a.interpolate=function(d,c,b,e){var f=a("<span/>"),g=a.extend({},d);f.css(g).interpolate(c,b,e);a.each(c,function(a,b){g[a]=f.css(a)});return g}})(jQuery);