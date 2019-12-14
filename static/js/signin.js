(function() {
    'use strict';

    window.SignIn = function(cfg) {

        var widget = {};

        var id = 'sign-in-' + createId();


        var styles = [
            // Add some
            createCssRule('#' + id + '{' +
                'display: grid;' +
                'background: var(--shadow);' +
                '}')
        ];

        widget.active = states.signin;

        widget.id = function() { return id; };

        widget.html = function() {
            var html = '<div id="' + id + '">' +
                '<div id="errMsg"></div>' +
                //Login
                '<form id="loginForm"  action="/login" method="POST">' +
                '<label for="user">Username</label>' +
                '<input name="username" id="user" autofocus="autofocus" required="required"/>' +
                '<label for="pwd">Password</label>' +
                '<input name="password" type="password" id="pwd" required="required"/>' +
                '<input name="Sign in" type="submit" value="Sign in"/>' +
                '</form>' +

                // register
                '<form id="registerForm" action="/register" method="POST">' +
                '<label for="user">Username</label>' +
                '<input name="username" id="user" autofocus="autofocus" required="required"/>' +
                '<label for="pwd">Password</label>' +
                '<input name="password" type="password" id="pwd" required="required" />' +
                '<label for="email">Email (for password reset)</label>' +
                '<input name="email" id="email" required="required" type="email"/>' +
                '<input name="Register" type="submit" value="Register"/>' +

                // Forgot password

                '</form>' +
                '</div>';
            return html;
        };

        // event, say buttons, handler initialization
        widget.events = function() {
            // jquery ui tooltips
            $(function() {
                $('#' + id).tooltip();
            });
            $('#' + id).hide();
            displayErrorMessage();
        };


        // some sub components resizes go here
        widget.resize = function(top, left, width, height) {
            $('#' + id).css({ top: top, left: left, position: 'absolute', height: height, width: width, 'grid-gap': height >> 4 });
        };

        function displayErrorMessage() {
            var urlQuery = window.location.search;
            var errIdx = urlQuery.indexOf("err=");
            if (errIdx != -1) {
                var eqIdx = urlQuery.indexOf('=', errIdx);
                if (eqIdx != -1) {
                    var ampIdx = urlQuery.indexOf('&', errIdx);
                    var errorMessage = ampIdx == -1 ? urlQuery.substring(eqIdx + 1) : urlQuery.substring(eqIdx + 1, ampIdx);
                    $('#errMsg').html(
                        errorMessage
                    ).css('display', 'inline');
                }
            }
        }

        return widget;
    }; // window.SignIn

}());