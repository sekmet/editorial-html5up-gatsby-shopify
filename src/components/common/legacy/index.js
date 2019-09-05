import React from "react"
//import PropTypes from "prop-types"
import { navigate } from "gatsby"

import $ from "jquery"
const browser = require("./browser.js")
const breakpoints = require("./breakpoints.js")

class Legacy extends React.Component {

  componentDidMount() {

    //##############################################################

    /**
     * Generate an indented list of links from a nav. Meant for use with panel().
     * @return {jQuery} jQuery object.
     */
    $.fn.navList = function() {

      var $this = $(this);
      var $a = $this.find('a'), b = [];

      $a.each(function() {

        var $this = $(this),
          indent = Math.max(0, $this.parents('li').length - 1),
          href = $this.attr('href'),
          target = $this.attr('target');

        b.push(
          '<a ' +
          'class="link depth-' + indent + '"' +
          ((typeof target !== 'undefined' && target !== '') ? ' target="' + target + '"' : '') +
          ((typeof href !== 'undefined' && href !== '') ? ' href="' + href + '"' : '') +
          '>' +
          '<span class="indent-' + indent + '"></span>' +
          $this.text() +
          '</a>'
        );

      });

      return b.join('');

    };


    /**
     * Panel-ify an element.
     * @param {object} userConfig User config.
     * @return {jQuery} jQuery object.
     */
    $.fn.panel = function(userConfig) {

      // Vars.
      var $this = $(this),
        $body = $('body'),
        $window = $(window),
        id = $this.attr('id'),
        config;

      // No elements?
      if (this.length === 0)
        return $this;

      // Multiple elements?
      if (this.length > 1) {

        for (var i = 0; i < this.length; i++)
          $(this[i]).panel(userConfig);

        return $this;

      }


      // Config.
      config = $.extend({

        // Delay.
        delay: 0,

        // Hide panel on link click.
        hideOnClick: false,

        // Hide panel on escape keypress.
        hideOnEscape: false,

        // Hide panel on swipe.
        hideOnSwipe: false,

        // Reset scroll position on hide.
        resetScroll: false,

        // Reset forms on hide.
        resetForms: false,

        // Side of viewport the panel will appear.
        side: null,

        // Target element for "class".
        target: $this,

        // Class to toggle.
        visibleClass: 'visible'

      }, userConfig);

      // Expand "target" if it's not a jQuery object already.

      if (typeof config.target !== 'object')
        config.target = $(config.target);

      // Panel.

      // Methods.
      $this._hide = function(event) {

        // Already hidden? Bail.
        if (!config.target.hasClass(config.visibleClass))
          return;

        // If an event was provided, cancel it.
        if (event) {

          event.preventDefault();
          event.stopPropagation();

        }

        // Hide.
        config.target.removeClass(config.visibleClass);

        // Post-hide stuff.
        window.setTimeout(function() {

          // Reset scroll position.
          if (config.resetScroll)
            $this.scrollTop(0);

          // Reset forms.
          if (config.resetForms)
            $this.find('form').each(function() {
              this.reset();
            });

        }, config.delay);

      };

      // Vendor fixes.
      $this
        .css('-ms-overflow-style', '-ms-autohiding-scrollbar')
        .css('-webkit-overflow-scrolling', 'touch');

      // Hide on click.
      if (config.hideOnClick) {

        $this.find('a')
          .css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

        $this
          .on('click', 'a', function(event) {

            var $a = $(this),
              href = $a.attr('href'),
              target = $a.attr('target');

            if (!href || href === '#' || href === '' || href === '#' + id)
              return;

            // Cancel original event.
            event.preventDefault();
            event.stopPropagation();

            // Hide panel.
            $this._hide();

            // Redirect to href.
            window.setTimeout(function() {

              if (target === '_blank')
                //window.open(href);
                navigate(href);
              else
                //window.location.href = href;
                navigate(href);

            }, config.delay + 10);

          });

      }

      // Event: Touch stuff.
      $this.on('touchstart', function(event) {

        $this.touchPosX = event.originalEvent.touches[0].pageX;
        $this.touchPosY = event.originalEvent.touches[0].pageY;

      })

      $this.on('touchmove', function(event) {

        if ($this.touchPosX === null
          || $this.touchPosY === null)
          return;

        var diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
          diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
          th = $this.outerHeight(),
          ts = ($this.get(0).scrollHeight - $this.scrollTop());

        // Hide on swipe?
        if (config.hideOnSwipe) {

          var result = false,
            boundary = 20,
            delta = 50;

          switch (config.side) {

            case 'left':
              result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
              break;

            case 'right':
              result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
              break;

            case 'top':
              result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
              break;

            case 'bottom':
              result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
              break;

            default:
              break;

          }

          if (result) {

            $this.touchPosX = null;
            $this.touchPosY = null;
            $this._hide();

            return false;

          }

        }

        // Prevent vertical scrolling past the top or bottom.
        if (($this.scrollTop() < 0 && diffY < 0)
          || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

          event.preventDefault();
          event.stopPropagation();

        }

      });

      // Event: Prevent certain events inside the panel from bubbling.
      $this.on('click touchend touchstart touchmove', function(event) {
        event.stopPropagation();
      });

      // Event: Hide panel if a child anchor tag pointing to its ID is clicked.
      $this.on('click', 'a[href="#' + id + '"]', function(event) {

        event.preventDefault();
        event.stopPropagation();

        config.target.removeClass(config.visibleClass);

      });

      // Body.

      // Event: Hide panel on body click/tap.
      $body.on('click touchend', function(event) {
        $this._hide(event);
      });

      // Event: Toggle.
      $body.on('click', 'a[href="#' + id + '"]', function(event) {

        event.preventDefault();
        event.stopPropagation();

        config.target.toggleClass(config.visibleClass);

      });

      // Window.

      // Event: Hide on ESC.
      if (config.hideOnEscape)
        $window.on('keydown', function(event) {

          if (event.keyCode === 27)
            $this._hide(event);

        });

      return $this;

    };

    // Vars.
    var $this = $(this);

    /**
     * Apply "placeholder" attribute polyfill to one or more forms.
     * @return {jQuery} jQuery object.
     */
    $.fn.placeholder = function() {

      // Browser natively supports placeholders? Bail.
      if (typeof (document.createElement('input')).placeholder != 'undefined')
        return $(this);

      // No elements?
      if (this.length === 0)
        return $this;

      // Multiple elements?
      if (this.length > 1) {

        for (var i = 0; i < this.length; i++)
          $(this[i]).placeholder();

        return $this;

      }


      // Text, TextArea.
      $this.find('input[type=text],textarea')
        .each(function() {

          var i = $(this);

          if (i.val() === ''
            || i.val() === i.attr('placeholder'))
            i
              .addClass('polyfill-placeholder')
              .val(i.attr('placeholder'));

        })
        .on('blur', function() {

          var i = $(this);

          if (i.attr('name').match(/-polyfill-field$/))
            return;

          if (i.val() === '')
            i
              .addClass('polyfill-placeholder')
              .val(i.attr('placeholder'));

        })
        .on('focus', function() {

          var i = $(this);

          if (i.attr('name').match(/-polyfill-field$/))
            return;

          if (i.val() === i.attr('placeholder'))
            i
              .removeClass('polyfill-placeholder')
              .val('');

        });

      // Password.
      $this.find('input[type=password]')
        .each(function() {

          var i = $(this);
          var x = $(
            $('<div>')
              .append(i.clone())
              .remove()
              .html()
              .replace(/type="password"/i, 'type="text"')
              .replace(/type=password/i, 'type=text')
          );

          if (i.attr('id') !== '')
            x.attr('id', i.attr('id') + '-polyfill-field');

          if (i.attr('name') !== '')
            x.attr('name', i.attr('name') + '-polyfill-field');

          x.addClass('polyfill-placeholder')
            .val(x.attr('placeholder')).insertAfter(i);

          if (i.val() === '')
            i.hide();
          else
            x.hide();

          i
            .on('blur', function(event) {

              event.preventDefault();

              var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

              if (i.val() === '') {

                i.hide();
                x.show();

              }

            });

          x
            .on('focus', function(event) {

              event.preventDefault();

              var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');

              x.hide();

              i
                .show()
                .focus();

            })
            .on('keypress', function(event) {

              event.preventDefault();
              x.val('');

            });

        });

      // Events.
      $this
        .on('submit', function() {

          $this.find('input[type=text],input[type=password],textarea')
            .each(function(event) {

              var i = $(this);

              if (i.attr('name').match(/-polyfill-field$/))
                i.attr('name', '');

              if (i.val() === i.attr('placeholder')) {

                i.removeClass('polyfill-placeholder');
                i.val('');

              }

            });

        })
        .on('reset', function(event) {

          event.preventDefault();

          $this.find('select')
            .val($('option:first').val());

          $this.find('input,textarea')
            .each(function() {

              var i = $(this),
                x;

              i.removeClass('polyfill-placeholder');

              switch (this.type) {

                case 'submit':
                case 'reset':
                  break;

                case 'password':
                  i.val(i.attr('defaultValue'));

                  x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

                  if (i.val() === '') {
                    i.hide();
                    x.show();
                  }
                  else {
                    i.show();
                    x.hide();
                  }

                  break;

                case 'checkbox':
                case 'radio':
                  i.attr('checked', i.attr('defaultValue'));
                  break;

                case 'text':
                case 'textarea':
                  i.val(i.attr('defaultValue'));

                  if (i.val() === '') {
                    i.addClass('polyfill-placeholder');
                    i.val(i.attr('placeholder'));
                  }

                  break;

                default:
                  i.val(i.attr('defaultValue'));
                  break;

              }
            });

        });

      return $this;

    };

    /**
     * Moves elements to/from the first positions of their respective parents.
     * @param {jQuery} $elements Elements (or selector) to move.
     * @param {bool} condition If true, moves elements to the top. Otherwise, moves elements back to their original locations.
     */
    $.prioritize = function($elements, condition) {

      var key = '__prioritize';

      // Expand $elements if it's not already a jQuery object.
      //  if (typeof $elements !== 'jQuery')
      //    $elements = $($elements);

      // Step through elements.
      $elements.each(function() {

        var $e = $(this), $p,
          $parent = $e.parent();

        // No parent? Bail.
        if ($parent.length === 0)
          return;

        // Not moved? Move it.
        if (!$e.data(key)) {

          // Condition is false? Bail.
          if (!condition)
            return;

          // Get placeholder (which will serve as our point of reference for when this element needs to move back).
          $p = $e.prev();

          // Couldn't find anything? Means this element's already at the top, so bail.
          if ($p.length === 0)
            return;

          // Move element to top of parent.
          $e.prependTo($parent);

          // Mark element as moved.
          $e.data(key, $p);

        }

        // Moved already?
        else {

          // Condition is true? Bail.
          if (condition)
            return;

          $p = $e.data(key);

          // Move element back to its original location (using our placeholder).
          $e.insertAfter($p);

          // Unmark element as moved.
          $e.removeData(key);

        }

      });

    };


    //TODO BETTER CUSTOM THEME $ FUNCTIONS hide mobile keyboad
    //https://stackoverflow.com/questions/8335834/how-can-i-hide-the-android-keyboard-using-javascript
    function hideKeyboard() {
      //this set timeout needed for case when hideKeyborad
      //is called inside of 'onfocus' event handler
      setTimeout(function() {

        //creating temp field
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        //hiding temp field from peoples eyes
        //-webkit-user-modify is nessesary for Android 4.x
        field.setAttribute('style', 'position:absolute; top: 0px; opacity: 0; -webkit-user-modify: read-write-plaintext-only; left:0px;');
        document.body.appendChild(field);

        //adding onfocus event handler for out temp field
        field.onfocus = function(){
          //this timeout of 200ms is nessasary for Android 2.3.x
          setTimeout(function() {

            field.setAttribute('style', 'display:none;');
            setTimeout(function() {
              document.body.removeChild(field);
              document.body.focus();
            }, 14);

          }, 200);
        };
        //focusing it
        field.focus();

      }, 50);
    }

    //##############################################################


    var $window = $(window),
      $head = $('head'),
      $body = $('body'),
      $searchbox = $('input#searchboxid');
    //hack searchbox input


    // Breakpoints.
    breakpoints({
      xlarge: ['1281px', '1680px'],
      large: ['981px', '1280px'],
      medium: ['737px', '980px'],
      small: ['481px', '736px'],
      xsmall: ['361px', '480px'],
      xxsmall: [null, '360px'],
      'xlarge-to-max': '(min-width: 1681px)',
      'small-to-xlarge': '(min-width: 481px) and (max-width: 1680px)'
    });

    // Stops animations/transitions until the page has ...

    // ... loaded.
    //$window.on('load', function() {
    window.setTimeout(function() {
      $body.removeClass('is-preload');
      hideKeyboard();
    }, 100);
    // });

    // ... stopped resizing.
    var resizeTimeout;

    $window.on('resize', function() {

      // Mark as resizing.
      $body.addClass('is-resizing');

      // Unmark after delay.
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(function() {
        $body.removeClass('is-resizing');
      }, 100);

    });

    // Fixes.

    // Object fit images.
    if (!browser.canUse('object-fit')
      || browser.name === 'safari')
      $('.image.object').each(function() {

        var $this = $(this),
          $img = $this.children('img');

        // Hide original image.
        $img.css('opacity', '0');

        // Set background.
        $this
          .css('background-image', 'url("' + $img.attr('src') + '")')
          .css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
          .css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');

      });

    // Sidebar.
    var $sidebar = $('#sidebar'),
      $sidebar_inner = $sidebar.children('.inner');

    // Inactive by default on <= large.
    breakpoints.on('<=large', function() {
      $sidebar.addClass('inactive');
    });

    breakpoints.on('>large', function() {
      $sidebar.removeClass('inactive');
    });

    // Hack: Workaround for Chrome/Android scrollbar position bug.
    if (browser.os === 'android'
      && browser.name === 'chrome')
      $('<style>#sidebar .inner::-webkit-scrollbar { display: none; }</style>')
        .appendTo($head);

    // Toggle.
    $('<a href="#sidebar" class="toggle">Toggle</a>')
      .appendTo($sidebar)
      .on('click', function(event) {

        // Prevent default.
        event.preventDefault();
        event.stopPropagation();

        // Toggle.
        $sidebar.toggleClass('inactive');

      });

    // Events.
    //TODO FIX SIDEBAR LINKS EVENT ISSUE
    // Link clicks.
    $sidebar.on('click', 'a', function(event) {

      // >large? Bail.
      if (breakpoints.active('>large'))
        return;

      // Vars.
      var $a = $(this),
        href = $a.attr('href'),
        target = $a.attr('target');

      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Check URL.
      if (!href || href === '#' || href === '')
        return;

      // Hide sidebar.
      $sidebar.addClass('inactive');

      // Redirect to href.
      //setTimeout(function() {

        if (target === '_blank')
          //window.open(href);
          navigate(href)
        else
          navigate(href)

      //}, 3);

    });

    // Prevent certain events inside the panel from bubbling.
    $sidebar.on('click touchend touchstart touchmove',  function(event) {

      // >large? Bail.
      if (breakpoints.active('>large'))
        return;

      // Prevent propagation.
      event.stopPropagation();

    });

    // Hide panel on body click/tap.
    $body.on('click touchend', function(event) {

      // >large? Bail.
      if (breakpoints.active('>large'))
        return;

      // Deactivate.
      $sidebar.addClass('inactive');

    });

    //TODO BETTER CUSTOM THEME $ FUNCTIONS
    // Hide panel on $searchboxid click/tap.
    $searchbox.on('keydown', function(event) {

      // >large? Bail.
      if (breakpoints.active('>large'))
        return;

      // Deactivate.
      if (event.which === 13) {
        $sidebar.addClass('inactive');
        $searchbox.select();
        hideKeyboard();
      }

    });

    // Select input content on click/tap.
    $searchbox.on('click touchend', function(event) {
      $searchbox.select();
    });




    // Scroll lock.
    // Note: If you do anything to change the height of the sidebar's content, be sure to
    // trigger 'resize.sidebar-lock' on $window so stuff doesn't get out of sync.

    $window.on('load.sidebar-lock', function() {

      var sh, wh/*, st*/;

      // Reset scroll position to 0 if it's 1.
      if ($window.scrollTop() === 1)
        $window.scrollTop(0);

      $window
        .on('scroll.sidebar-lock', function() {

          var x, y;

          // <=large? Bail.
          if (breakpoints.active('<=large')) {

            $sidebar_inner
              .data('locked', 0)
              .css('position', '')
              .css('top', '');

            return;

          }

          // Calculate positions.
          x = Math.max(sh - wh, 0);
          y = Math.max(0, $window.scrollTop() - x);

          // Lock/unlock.
          if ($sidebar_inner.data('locked') === 1) {

            if (y <= 0)
              $sidebar_inner
                .data('locked', 0)
                .css('position', '')
                .css('top', '');
            else
              $sidebar_inner
                .css('top', -1 * x);

          }
          else {

            if (y > 0)
              $sidebar_inner
                .data('locked', 1)
                .css('position', 'fixed')
                .css('top', -1 * x);

          }

        })
        .on('resize.sidebar-lock', function() {

          // Calculate heights.
          wh = $window.height();
          sh = $sidebar_inner.outerHeight() + 30;

          // Trigger scroll.
          $window.trigger('scroll.sidebar-lock');

        })
        .trigger('resize.sidebar-lock');

    });

    // Menu.
    var $menu = $('#menu'),
      $menu_openers = $menu.children('ul').find('.opener');

    // Openers.
    $menu_openers.each(function() {

      var $this = $(this);

      $this.on('click', function(event) {

        // Prevent default.
        event.preventDefault();

        // Toggle.
        $menu_openers.not($this).removeClass('active');
        $this.toggleClass('active');

        // Trigger resize (sidebar lock).
        $window.triggerHandler('resize.sidebar-lock');

      });

    });

  }

  render() {
    return (<div></div>)
  }

}


/*Legacy.propTypes = {
  children: PropTypes.node.isRequired,
}*/

export default Legacy