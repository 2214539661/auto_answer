// popup.js
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('start')) {
        document.getElementById('start').addEventListener('click', function () {
            sendMessage({action: 'start', time: getValue(), IsWhile: false});
        });
    }
    if (document.getElementById('startTrue')) {
        document.getElementById('startTrue').addEventListener('click', function () {
            sendMessage({action: 'start', time: getValue(), IsWhile: true});
        });
    }
    if (document.getElementById('stop')) {
        document.getElementById('stop').addEventListener('click', function () {
            sendMessage({action: 'stop'});
        });
    }
    if (document.getElementById('quickly_finish')) {
        document.getElementById('quickly_finish').addEventListener('click', function () {
            sendMessage({action: 'quickly_finish'});
        });
    }
    if (document.getElementById('starCt1')) {
        document.getElementById('starCt1').addEventListener('click', function () {
            sendMessage({action: 'starCt1', time: getValue()});
        });
    }
});


// 获取输入框元素
const input = document.getElementById('myInput');
if (input) {
// 添加失去焦点事件监听器
    input.addEventListener('blur', function () {
        let value = parseInt(this.value);
        // 验证输入的值是否为整数且不低于200
        if (isNaN(value) || value < 100) {
            this.value = 100; // 如果不合法，则设置为默认值200
        }
    });
}


