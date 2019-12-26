(function() {
    'use strict';

    window.ToolBar = function(cfg) {
        var widget = {};

        var id = 'toolbar-' + createId(),
            logoutId = 'logout-' + createId(),
            formId = 'form-' + createId(),
            nameId = 'name-' + createId(),
            menuId = 'menu-' + createId(),
            buttonClass = "button-" + createId();


        widget.active = states.choose_game | states.playing | states.browsing;
        widget.id = function() { return id; };

        var styles = [
            createCssRule('#' + id + '  {' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content:space-between;' +
                '}'),
            createCssRule('.' + buttonClass +
                ':hover {cursor: pointer; opacity: 0.5;}')
        ];

        widget.html = function() {
            var html = '<div id="' + id + '">' +
                '<img id="' + menuId + '" class="' + buttonClass + '" src="img/menu.svg" title="Menu"/>';
            if (UserName !== '') {
                html += '<span id="' + nameId + '" title="Hello, ' + UserName + '!" >' + UserName + '&nbsp;';
                html += '<img id="' + logoutId + '" class="' + buttonClass + '" src="img/gear.svg" title="Sign out"/></span>';
                html += '<form id="' + formId + '" action="/logout" method="GET"/>';

            } else {
                //TODO: implement anon/login
                html += '<a href="/signin">Sign in</a>';

            }
            html += '</div>';
            return html;
        };

        widget.resize = function(top, left, width, height) {
            $('#' + id).css({ top: top, left: left, position: 'absolute', width: width, height: height, 'font-size': height });
            $('#' + id + ' img ').attr('width', height);
            $('#' + id + ' img ').attr('height', height);
        };

        widget.events = function() {
            // jquery ui tooltips
            $(function() {
                $('#' + id).tooltip();
            });

            // Sign out action
            $('#' + logoutId).click(function(e) {
                console.log('toolbar logout click: ' + e + ". Form id: " + formId);
                $('#' + formId).submit();
            });
        };

        return widget;

    }; // end of ToolBar

})(); // end anonymous wrapper