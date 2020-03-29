(function () {
    'use strict';
    window.GameHistory = function (cfg) {
        var widget = {};
        widget.name = 'GameHistory';
        widget.active = states.choose_game;
        widget.id = function () {
            return cfg.id;
        };
        widget.events = function () {
        };
        widget.visible = false;
        widget.show = function (yesno) {
            if (!widget.visible && yesno) {
                // load history
                $.get("/history").done(widget.render).fail(function (err) {
                        console.log("error loading history: " + err);
                    });
            }
            widget.visible = yesno;
        };

        widget.render = function (result) {
            console.log(result);
            let div = document.getElementById(widget.id());
            div.innerHTML = "";
            if (result.History.constructor === Array) {
                for (var i = 0; i < result.History.length; i++) {
                    var hi = result.History[i];
                    div.innerHTML += "<div class='item hist-item'>\n" +
                        "  <span class='item hist-time'><a href='" + hi.URL+"'>" + formatDate(hi.Time) + "</a></span>\n" +
                        "  <span class='item hist-result'>" + hi.Outcome + "</span>\n" +
                        "  <span class='item hist-players'>" + hi.White + "(1500) - " + hi.Black + "(1500)</span>\n" +
                        "</div>";
                }
            }
        };
        return widget;
    };

    function formatDate(ts) {
        let now = new Date();
        let d = new Date(ts * 1000);
        let str = "";
        let day = ("0" +  d.getDate()).substr(-2);
        let month = ("0" + d.getMonth()).substr(-2);
        if (now.toLocaleDateString() != d.toLocaleDateString()) {
            str = day + "/" + month + " ";
        }
        let hours = ("0" + d.getHours()).substr(-2);
        let minutes = ("0" + d.getMinutes()).substr(-2);
        str += hours + ":" + minutes;
        return str;
    }

}());
