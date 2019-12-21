(function() {
    'use strict';

    window.Status = function(cfg) {

        var widget = cfg || {};

        var statusName = '📢';
        var gameIDName = '🆔';
        var fenName = '🎬';
        var statusItems = [{
                name: statusName,
                title: 'Game Status'
            },
            {
                name: gameIDName,
                class: 'game',
                title: 'Game ID'
            },
            {
                name: fenName,
                title: 'Game FEN'
            },
        ];

        var id = 'status-' + createId();

        widget.active = states.choose_game | states.playing | states.browsing;
        widget.id = function() { return id; };

        var styles = [
            //createCssRule('#' + id + ' {overflow: scroll;}')
        ];

        widget.html = function() {

            var html = '<div id="' + id + '">';
            statusItems.forEach(function(item, index) {
                item.id = item.name + '-' + createId();

                html += '<div id="' + item.id + '"';
                if (item.class !== undefined) {
                    html += ' class="' + item.class + '"';
                }
                html += ' title="' + item.title + '"';
                html += ' >' + item.name + '</div>';
            });
            html += '</div>';


            return html;
        };

        widget.resize = function(top, left, width, height) {

            var t = top;
            var l = left;
            var statusItemHeight = Math.floor(height / statusItems.length);
            var w = width;

            statusItems.forEach(function(item, index) {
                $('#' + item.id).css({ top: t, left: l, position: 'absolute', height: statusItemHeight, width: w });
                t += statusItemHeight;
            });
        };

        widget.events = function() {
            // jquery ui tooltips
            $(function() {
                $('#' + id).tooltip();
            });
        };

        widget.htmlStatus = function() {
            return $('#' + itemByName(statusItems, statusName).id).html();
        };

        function printItem(name, msg) {
            var i = itemByName(statusItems, name);
            $('#' + i.id).html(i.name + '&nbsp;' + msg);
        }

        widget.printStatus = function(msg) {
            printItem(statusName, msg);
        };

        widget.printFen = function(msg) {
            printItem(fenName, msg);
        };

        widget.printGameId = function(msg) {
            printItem(gameIDName, msg);
        };


        return widget;
    }; // window.Status

}());