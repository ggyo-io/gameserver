(function() {
    'use strict';

    window.Modal = function(cfg) {
        var widget = (cfg || {});

        var id = 'modal-' + createId(),
            contentId = 'content-' + createId(),
            offerId = "offer-" + createId(),
            offerYesId = "offer-yes-" + createId(),
            offerNoId = "offer-no-" + createId();

        var offerParams = null;

        var styles = [
            createCssRule('#' + id + '{' +
                'display: none;' +
                // Hidden by default 
                'position: fixed;' +
                // Stay in place 
                'z-index: 1;' +
                // Sit on top 
                'left: 0;' +
                'top: 0;' +
                'width: 100%;' +
                // Full width 
                'height: 100%;' +
                // Full height 
                'overflow: auto;' +
                // Enable scroll if needed 
                'background-color: rgb(0, 0, 0);' +
                // Fallback color 
                'background-color: rgba(0, 0, 0, 0.4);}'
                // Black w/ opacity 
            ),
            createCssRule('#' + contentId + '{' +
                'background-color: #fefefe;' +
                'text-align: center;' +
                'margin: 30% auto;' +
                'padding: 40px;' +
                'border: 1px solid #888;' +
                'width: 30%;}'
            ),


            createCssRule('#' + offerYesId + '{' +
                'color: green;' +
                'float: left;' +
                'font - size: 28 px;' + // TODO: make dynamic, in resize()
                'font - weight: bold;}'
            ),
            createCssRule(
                '#' + offerNoId + '{' +
                'color: red;' +
                'float: right;' +
                'font - size: 28 px;' + // TODO: make dynamic, in resize()
                'font - weight: bold;}'
            ),

            createCssRule(
                '#' + offerYesId + ':hover,' +
                '#' + offerYesId + ':focus {' +
                'color: black;' +
                'text - decoration: none;' +
                'cursor: pointer;}'
            ),
            createCssRule(
                '#' + offerNoId + ':hover,' +
                '#' + offerNoId + ':focus {' +
                'color: black;' +
                'text-decoration: none;' +
                'cursor: pointer;' +
                'overflow: scroll;}'
            )
        ];

        widget.html = function() {
            var html = '<div id="' + id + '">' +
                '<div id="' + contentId + '">' +
                '<p>Opponent offer: <span id="' + offerId + '"></span></p>' +
                '<span id="' + offerYesId + '" class="' + CSS.closeYes + '">✓</span>' +
                '<span id="' + offerNoId + '"  class="' + CSS.closeNo + '">×</span>' +
                '</div></div>';
            return html;

        };

        function offerYesBtn() {
            console.log("Offer accepted: " + offerParams);

            if (offerParams === 'draw') {
                widget.outcome(offerParams + ' is accepted');
                wsConn.send({
                    Cmd: "outcome",
                    Params: offerParams
                });
            } else if (offerParams === 'undo') {
                var msg = {
                    Cmd: 'accept_undo',
                    Params: '2'
                };
                wsConn.send(msg);
                widget.accept_undo(msg);
            }
            $('#' + id).hide(); // make invisible
        }

        function offerNoBtn() {
            $('#' + id).hide(); // make invisible
        }


        widget.offer = function(offer) {
            offerParams = offer;
            $('#' + offerId).html(offerParams);
            $('#' + id).show();
        };

        widget.resize = function(top, left, width, height) {
            $('#' + id).css({ top: top, left: left, position: 'absolute', height: height, width: width });
        };

        widget.events = function() {
            // Modal buttons
            $('#' + offerYesId).on('click', offerYesBtn);
            $('#' + offerNoId).on('click', offerNoBtn);
        };
        return widget;
    }; // window.Modal

}());