function chatResize(container) {
    var cheigth = container.offset().top - $(window).scrollTop()
    console.log($(window).height());
    console.log(cheigth);
    container.height($(window).height() - cheigth - 200);

}
$(window).resize(function () {
    var container = $("#chat-container");
    chatResize(container);
});
$(document).ready(function () {
    var container = $("#chat-container");
    chatResize(container);
});


String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

String.prototype.insert=function(i,str){
    return this.slice(0,i)+str+this.slice(i+1,this.length);
}

$("#userInput").change(startProcedure);

function startProcedure() {
    var value = $("#userInput").val();
    send(value);
    appentNewText(value, $("#message-send-text"));
    $("#userInput").val("");
}

function prepareInput(txt) {
    for (var i = 0; i < txt.length; i++)
        if (i % 30 == 0 && i!=0)
            txt=txt.insert(i, "<br>");
    return txt;
}

function appentNewText(txt, source) {
    var msg = source.html().replace("^", txt);
    var minutes = new Date().getMinutes();
    var hours = new Date().getHours();
    msg = msg.replace("§", hours + ":" + minutes);
    $(msg).appendTo("#chat-container");
    var div = $('#chat-container');
    div.scrollTop(div.prop('scrollHeight'));
}

function send(txt) {
    var cookie;
    var session = -1;
    if (session < 0) {
        var jqxhr = $.get("https://aulando-ayy-dialogflow-api.herokuapp.com/dialogflow_api/resolveQuery?requestQuery=" + txt, function () {})
            .done(function (res) {
                manageRes(res);
                session = 1;
                cookie = res.sessionId;
            })
            .fail(function (res) {
                $('#error').modal();
            });
    } else {
        var jqxhr = $.get("https://aulando-ayy-dialogflow-api.herokuapp.com/dialogflow_api/resolveQuery?requestQuery=" + txt + "&id=" + cookie, function () {})
            .done(function (res) {
                manageRes(res);
            })
            .fail(function (res) {
                $('#error').modal();
            });
    }
}

function manageRes(parsedData) {
    var textResult = parsedData.speech;

    if(parsedData.result){
        
        if(parsedData.result.length == 0){
            textResult += '<br>Nessun risultato :('
        }

        parsedData.result.forEach(function(element) {
        if(element.nome)
            textResult += '<br><b>' + element.nome + '</b>'
        if(element.materia)
            textResult += '<br><b>' + element.materia + '</b>'
        if(element.inizio && element.fine)
            textResult += ' dalle ' + element.inizio + " alle " + element.fine
        if(element.fino)
            textResult += ' fino alle: ' + element.fino
        
        });
        
    }
    appentNewText(textResult, $("#message-receive-text"));
}