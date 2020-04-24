//------------------------------------------------------------------------------
// JS Util Functions
//------------------------------------------------------------------------------

(function() {
    'use strict';
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    window.createId = function() {
        return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function(c) {
            var r = Math.random() * 16 | 0;
            return r.toString(16);
        });
    };

    window.createCssRule = function(text) {
        var cssStyle = document.createElement('style');
        cssStyle.type = 'text/css';
        var rules = document.createTextNode(text);
        cssStyle.appendChild(rules);
        document.getElementsByTagName("head")[0].appendChild(cssStyle);
        return cssStyle;
    };

    window.deleteCssRule = function(cssStyle) {
        document.getElementsByTagName("head")[0].removeChild(cssStyle);
    };

    window.itemByName = function(l, name) {
        var r = null;
        l.forEach(function(item, index) {
            if (item.name == name) {
                r = item;
            }
        });
        return r;
    };

    window.states = {
        signin: 1 << 0,
        choose_game: 1 << 1,
        playing: 1 << 2,
        browsing: 1 << 3,
    };

    /* Buttons html + events */

    window.buttonHtml = function(item) {
        var html = '';
        item.id = item.name + '-' + createId();
        html += '<li>';
        html += '<a id="' + item.id + '" title="' + item.title + '" class="btnClass">' + item.name + '</a>';
        html += '</li>';
        return html;
    };

    window.buttonEvent = function(item) {
        $('#' + item.id).on('click', item.onclick);
        if (item.onkey !== undefined) {
            var k = item.onkey;
            $(document).keydown(function(e) {
                switch (e.which) {
                    case k:
                        break;

                    default:
                        return; // exit this handler for other keys
                }
                e.preventDefault(); // prevent the default action (scroll / move caret)
                item.onclick();
            });
        } // item.onkey
    };

    window.displayErrorMessage = function() {
        var url = new URL(window.location.href);
        var errorMessage = url.searchParams.get("err");
        if (errorMessage) {
            $('#error-message').html(
                "Error: " + decodeURI(errorMessage)
            ).show();
        }
    };

    window.toggleModal = function (modalId) {
        var modal = document.querySelector('#' + modalId);
        var modalOverlay = document.querySelector("#modal-overlay");
        modal.classList.toggle("closed");
        modalOverlay.classList.toggle("closed");
    };

})(); // end anonymous wrapper