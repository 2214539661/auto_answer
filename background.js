// 监听来自popup的消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.action) {
        case "start":
            sendMessage(message);
            break;
        case "stop":
            sendMessage(message);
            break;
        case "quickly_finish":
            sendMessage(message);
            break;
        case "starCt1":
            sendMessage(message);
            break;
        case "setStatus":
            setStatus(message.status);
            break;
    }
});


function sendMessage(param) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, param);
    });
}

// function sendMessage(param) {
//     // 获取当前所有标签页
//     chrome.tabs.query({}, function (tabs) {
//         console.log('tabs',tabs)
//         // 向所有标签页发送消息，更新开始状态
//         tabs.forEach(function (tab) {
//             console.log(tab)
//             chrome.tabs.sendMessage(tab.id, param);
//         });
//     });
// }