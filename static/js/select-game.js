(function() {
    'use strict';

    window.SelectGame = function(cfg) {

        var widget = {};

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
            html += '</ul></div>';
            return html;
        };

        // event, say buttons, handler initialization
        widget.events = function() {
            // jquery ui tooltips
            $(function() {
                $('#' + id).tooltip();
            });
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

        return widget;
    }; // window.SelectGame

}());