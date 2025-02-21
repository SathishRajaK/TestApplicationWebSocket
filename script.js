var ws;
var reconnectInterval = 5000;  

$(document).ready(function () {
    InitializeWebSocket();

});

function InitializeWebSocket() {
    if (ws) {
        ws.close();  
    }

    try {
        ws = new WebSocket('ws://localhost:8085/broadcast');
    }
    catch (ex) {

    }
    ws.onopen = function () {
        dispatchCustomEvent('', 'Connected')
        OnLoadGetRecords();
    };

    ws.onmessage = function (event) {
        dispatchCustomEvent(event.data, 'Available')
    };

    ws.onerror = function (error) {
        dispatchCustomEvent('', 'Error')

    };

    ws.onclose = function (event) {
        dispatchCustomEvent('', 'Disconnected')
        ReconnectionWebSocket();
    };
}


function dispatchCustomEvent(eventData, event_Status) {
    var message = JSON.stringify({
        response: eventData,
        eventstatus: event_Status
    });
    var event = new CustomEvent('subscribecallevents', {
        detail: message
    });
    document.dispatchEvent(event);
}


function ReconnectionWebSocket() {
    setTimeout(InitializeWebSocket, reconnectInterval);
}


function handleMessageEvent(event) {
    var _action = event.detail.action;
    var _values = event.detail.values == undefined ? "" : event.detail.values;
    var message = JSON.stringify({
        values: _values,
        action: _action
    });
    ws.send(message);
}

 

$(document).on('broadcastcallevents', handleMessageEvent);

function OnLoadGetRecords() {
    var message = JSON.stringify({
        action: 'AgentState'
    });
    ws.send(message);
}







