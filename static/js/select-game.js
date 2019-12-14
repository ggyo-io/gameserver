(function() {
    'use strict';

    window.SelectGame = function(cfg) {

        var widget = cfg;

        var id = 'select-game-' + createId(),
            ulClass = 'horiz-ul-' + createId(),
            liClass = 'horiz-li-' + createId();
        var selectOpponent = 'Select_opponent';
        var selectColor = 'Color';
        var selectTimeControl = 'Time_Control';
        var selectNewGame = [{
                name: selectOpponent,
                label: 'Choose your opponent',
                options: ['stockfish', 'lc0', 'human']
            },
            {
                name: selectColor,
                label: 'Choose your color',
                options: ['any', 'white', 'black']
            },
            {
                name: selectTimeControl,
                label: 'Choose time control',
                options: ['900+15', '300+5', '60+1']
            },
        ];

        var buttons = [{
            name: 'start',
            onclick: startBtn,
            title: 'Start new game'
        }];

        widget.active = states.choose_game | states.browsing;
        widget.id = function() { return id; };

        var styles = [
            createCssRule('.' + ulClass + '{' +
                'list-style-type: none;' +
                'margin: 0;' +
                'padding: 0;}'),
            createCssRule('.' + liClass + ' {float: left;}')
        ];

        widget.html = function() {
            var html = '<div id="' + id + '" ><ul class="' + ulClass + '">';
            selectNewGame.forEach(function(item, index) {
                item.id = item.name + '-' + createId();
                html += '<li class="' + liClass + '" >' +
                    '<select id="' + item.id + '" title="' + item.label + '" class="nogame">';
                item.options.forEach(function(item, index) {
                    html += '<option value="' + item + '"';
                    if (index === 0) {
                        html += '  selected';
                    }
                    html += '>' + item + '</option>';
                });
                html += '</select></li>';
            });
            buttons.forEach(function(item, index) {
                html += '<li class="' + liClass + '" >';
                html += '<input id="' + item.id + '" type="button" value="' + item.name + '">';
                html += '</li>';
            });
            html += '</ul></div>';
            return html;
        };

        // event, say buttons, handler initialization
        widget.events = function() {
            // jquery ui tooltips
            $(function() {
                $('#' + id).tooltip();
            });

            buttons.forEach(function(item, index) {
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
            }); // buttons forEach

        };


        // some sub components resizes go here
        widget.resize = function(top, left, width, fontSize) {
            $('#' + id).css({ top: top, left: left, position: 'absolute', width: width });
            // for some strange reason, select option font size could be
            // changed only by external stylesheet
            var φ = 1.618; // ~ golden ratio
            var elemHeight = Math.floor(φ * fontSize);
            styleRule(fontSize, elemHeight);
        };

        widget.selected = function() {

            var el1 = document.getElementById(itemByName(selectNewGame, selectOpponent).id);
            var foeParam = el1.options[el1.selectedIndex].value;
            var el2 = document.getElementById(itemByName(selectNewGame, selectColor).id);
            var colorParam = el2.options[el2.selectedIndex].value;
            var el3 = document.getElementById(itemByName(selectNewGame, selectTimeControl).id);
            var tcParam = el3.options[el3.selectedIndex].value;

            return [foeParam, colorParam, tcParam];
        };

        var cssStyle = null;

        var styleRule = function(f, h) {
            if (cssStyle !== null) {
                document.getElementsByTagName("head")[0].removeChild(cssStyle);
            }
            cssStyle = document.createElement('style');
            cssStyle.type = 'text/css';
            //var rules = document.createTextNode('.' + CSS.styledSelect + ' select {font-size: ' + f + 'px;height: ' + h + 'px;}');
            var rules = document.createTextNode('select {font-size: ' + f + 'px;height: ' + h + 'px;}');
            cssStyle.appendChild(rules);
            document.getElementsByTagName("head")[0].appendChild(cssStyle);
        };

        function startBtn() {
            if (widget.game_started()) {
                printStatus("Ignore start, Move! The game is not over yet, resign if you'd like...");
                return;
            }

            widget.board().start();
            widget.printStatus("Waiting for a match...");

            var vals = widget.selected();
            var foeParam = vals[0];
            var colorParam = vals[1];
            var tcParam = vals[2];

            console.log("start with foe: " + foeParam + " color: " + colorParam + " time control: " + tcParam);
            wsConn.send({
                Cmd: "start",
                Params: foeParam,
                Color: colorParam,
                TimeControl: tcParam
            });
        }


        return widget;
    }; // window.SelectGame

}());