(function() {
    'use strict';

    window.SignIn = function(cfg) {

        var widget = {};

        var id = 'sign-in-' + createId(),
            errMsgId = 'err-msg-' + createId(),
            formsId = 'forms-' + createId();

        var styles = [
            // Add some
            createCssRule('#' + id + '{' +
                'background: var(--primary);' +
                'color: var(--dark);' +
                'box-shadow: var(--shadow);' +
                'text-align: center;' +
                '}'),

            // div containing error message
            createCssRule('#' + errMsgId + '{' +
                'display: block;' +
                'text-align: center;' +
                '}'),

            // div containing login and register form side by side
            createCssRule('#' + formsId + '{' +
                'display: grid;' +
                'grid-template-columns: 1fr 1fr;' +
                'grid-gap: 5%;' +
                '}'),

            // format inputs
            createCssRule('#' + id +
                /* Full-width input fields */
                ' input[type=text], input[type=password], input[type=email] {' +
                '    width: 100%;' +
                '    display: inline-block;' +
                '    background-color: var(--light) !important;' +
                '  }'),
            /* Set a style for all buttons */
            createCssRule('#' + id +
                ' button {' +
                '    background: var(--light);' +
                '    color: var(--dark);' +
                '    box-shadow: var(--shadow);' +
                '    cursor: pointer;' +
                '    display: block;' +
                '    text-align: center;' +
                '    width: 100%;' +
                '  }'),
            createCssRule('#' + id +
                ' button:hover{' +
                '    background: var(--dark);' +
                '    color: var(--light);}'),

        ];

        widget.active = states.signin;

        widget.id = function() { return id; };

        widget.html = function() {
            var html = '<div id="' + id + '">' +
                '<div id="' + errMsgId + '"></div>' +

                '<div id="' + formsId + '">' + /* forms */
                //Login
                '<form action="/login" method="post">' +
                '<div>' +
                '<label for="username-s"><b>Username</b></label>' +
                '<input type="text" placeholder="Enter Username" name="username-s" required>' +

                '<label for="password-s"><b>Password</b></label>' +
                '<input type="password" placeholder="Enter Password" name="password-s" required>' +

                '<button type="submit">Login</button>' +
                '</div>' +
                '</form>' +
                // register
                '<form action="/register" method="post">' +
                '<div>' +
                '<label for="username-r"><b>Username</b></label>' +
                '<input type="text" placeholder="Enter Username" name="username-r" required>' +

                '<label for="password-r"><b>Password</b></label>' +
                '<input type="password" placeholder="Enter Password" name="password-r" required>' +

                '<label for="email"><b>Email</b></label>' +
                '<input type="email" placeholder="Enter Email" name="email" required="required" />' +

                '<button type="submit">Register</button>' +
                '</div>' +
                '</form>' +
                '</div>' + /* end of forms div */
                '</div>'; /* end of signin/register */
            return html;
        };

        // event, say buttons, handler initialization
        widget.events = function() {
            // jquery ui tooltips
            $(function() {
                $('#' + id).tooltip();
            });

            displayErrorMessage();
        };


        // some sub components resizes go here
        widget.resize = function(top, left, width, height) {
            $('#' + id).css({ top: top, left: left, position: 'absolute', height: height, width: width, 'grid-gap': height >> 4 });
        };

        function displayErrorMessage() {
            var url = new URL(window.location.href);
            var errorMessage = url.searchParams.get("err");
            if (errorMessage) {
                $('#' + errMsgId).html(
                    "Error: " + decodeURI(errorMessage)
                ).show();
            }
        }

        return widget;
    }; // window.SignIn

}());