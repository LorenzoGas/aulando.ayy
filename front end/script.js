String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

$("#userInput").change(function () {
    send(this.value);
    appentNewText(this.value, $("#message-send-text"));
    this.value = "";
});

var appentNewText = function (txt, source) {
    var msg = source.html().replace("^", txt);
    var minutes = new Date().getMinutes();
    var hours = new Date().getHours();
    msg = msg.replace("§", hours + ":" + minutes);
    $(msg).appendTo("#chat-container");
    var div= $('#chat-container');
    div.scrollTop(div.prop('scrollHeight'));
}

var send = function (txt) {
    var cookie;
    var session = -1;
    if (session < 0) {
        var jqxhr = $.get("https://aulando-ayy-dialogflow-api.herokuapp.com/dialogflow_api/resolveQuery?requestQuery=" + txt, function () {})
            .done(function (res) {
                manageRes(res);
                session=1;
                cookie=res.sessionId;
            })
            .fail(function (res) {
                $('#error').modal();
            });
    } else {
        var jqxhr = $.get("https://aulando-ayy-dialogflow-api.herokuapp.com/dialogflow_api/resolveQuery?requestQuery=" + txt+"&id="+cookie, function () {})
            .done(function (res) {
                manageRes(res);
            })
            .fail(function (res) {
                $('#error').modal();
            });
    }
}

var manageRes=function(res){
    var text=res.speech;
    if(res.result){
        text+="<ul>";
        res.result.forEach(function(item,i){
            text+="<li>"+item.nome+"</li>";
        });
        text+="</ul>";
    }
    appentNewText(text,$("#message-receive-text"));
}