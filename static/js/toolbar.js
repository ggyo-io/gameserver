(function() {
    'use strict';

    window.ToolBar = window.ToolBar || function(cfg) {
        var widget = {};

        var id = 'toolbar-' + createId(),
            logoutId = 'logout-' + createId(),
            formId = 'form-' + createId(),
            nameId = 'name-' + createId(),
            menuId = 'menu-' + createId(),
            buttonClass = "button-" + createId();

        var styles = [
            createCssRule('#' + id + '  {display: flex; align-items: center;}'),
            createCssRule('.' + buttonClass +
                ':hover {cursor: pointer; background-color: deepskyblue;}')
        ];

        widget.id = function() { return id; };

        widget.html = function() {
            var html = '<div id="' + id + '">' +
                '<img id="' + menuId + '" class="' + buttonClass + '" src="img/menu.svg" title="Menu"/>';
            if (UserName !== '') {

                html += '<span id="' + nameId + '" title="Hello, ' + UserName + '!" >' + UserName + '</span>';
                html += '<img id="' + logoutId + '" class="' + buttonClass + '" src="img/gear.svg" title="Sign out"/>';
                html += '<form id="' + formId + '" action="/logout" method="GET"/>';

            } else {
                //TODO: implement anon/login

            }
            html += '</div>';
            return html;
        };

        widget.resize = function(top, left, width, height) {
            $('#' + id).css({ top: top, left: left, position: 'absolute', width: width, height: height, 'font-size': height });
            $('#' + id + ' img ').attr('width', height);
            $('#' + id + ' img ').attr('height', height);
            $('#' + logoutId).css({ left: width - height, position: 'absolute' });
            if (UserName !== '') {
                $('#' + nameId).css({ left: (width - height - (height >> 2) - $('#' + nameId).outerWidth(true)), position: 'absolute' });
            }
        };

        widget.events = function() {
            // jquery ui tooltips
            $(function() {
                $(document).tooltip();
            });

            // Sign out action
            $('#' + logoutId).click(function(e) {
                console.log('toolbar logout click: ' + e);
                $('#' + formId).submit();
            });
        };

        return widget;

    }; // end of ToolBar

})(); // end anonymous wrapper