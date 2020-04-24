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
                    div.innerHTML += `
<div class='item hist-item'>
    <div class='item hist-time d-flex align-items-center'><a href='${hi.URL}'><span>${formatDate(hi.Time)}</span></a></div>
    <div class='item hist-result text-center d-flex align-items-center'><span>${hi.Outcome}</span></div>
    <div class='item hist-players d-flex align-items-center'><span><span class="white-space">${hi.White} (${hi.WhiteElo})</span> - <span class="white-space">${hi.Black} (${hi.BlackElo})</span></span></div>
</div>`;
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
