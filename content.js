let intervalId = null;
let intervalIds = [];
let intervalOutId = null;
let starIntervalOutId = null;
let thisIsWhile = false;
let isSubmit = false
// 开始测评按钮是否点击
let startButton = false
// 固定选项 -1随机
let fixed_question = -1

let statusDocument = document.getElementById('status');
let measureDocument = document.getElementById('measure');
setStatus(0)
setInterval(function () {
    setMeasure(getMeasureTitle())
}, 1000)

// 定义函数来随机选择元素并点击
function clickRandomElement() {
    // isSubmit = false;
    // 获取所有同时具有 class 是 'cursorP' 和 'questions' 的元素
    let elements = document.querySelectorAll('.questions');
    // 如果没有符合条件的元素，直接返回
    if (elements.length === 0) {
        setStatus(3)
        return;
    }
    // 随机选择一个元素的索引
    let randomIndex = getFixedQuestion(elements.length);

    // 模拟点击随机选择的元素  选择过当前题就不重复点击了
    if (isSubmit === false) {
        elements[randomIndex].click();
    }
    if (!hasClass('active_questions')) {
        isSubmit = false;
    }

    // 获取当前测评流程状态
    let item = getIsSubmitOrNext();

    // 无需执行后面动作
    // if (item.type === 1 || item.type === 0) {
    if (item.type === 1) {
        // 判断是否一直执行  一直执行者提交答案
        if (thisIsWhile) {
            // item.button.click();
            if (isSubmit === false) {
                isSubmit = true;
                textClick('提交答案', true)
            }
        } else {
            // 不一直执行者销毁动作结束任务
            stop()
        }
        setStatus(2);
        return;
    }

    // 存在下一题点击下一题
    if (item.type === 2) {
        setStatus(1)
        item.button.click();
    }

}

// 判断是否可以提交答案了
function getIsSubmitOrNext() {
    // 获取所有具有 class 是 'font14' 的元素
    let submitButtons = document.querySelectorAll('.font14');

    // 获取最后一个符合条件的 '.font14' 元素
    let lastSubmitButton = submitButtons[submitButtons.length - 1];

    // 检查最后一个 '.font14' 元素的文本内容是否为 "提交答案"
    if (lastSubmitButton) {
        if (lastSubmitButton.textContent.trim() === "提交答案") {
            return {type: 1, button: lastSubmitButton};
        } else if (lastSubmitButton.textContent.trim() === "开始测评") {
            return {type: 5, button: lastSubmitButton};
        } else if (lastSubmitButton.textContent.trim() === "下一题") {
            return {type: 2, button: lastSubmitButton};
        }
    }
    setStatus(3)
    return {type: 0, button: null};
}

// 获取量表名字
function getMeasureTitle() {
    // 获取所有具有 class 是 'font14' 的元素
    let submitButtons = document.querySelectorAll('.font14');

    if (submitButtons.length > 0) {
        // 获取最后一个符合条件的 '.font14' 元素
        let font14 = submitButtons[0];
        return font14.textContent.trim();
    }
    return '';
}


function start(time, IsWhile) {
    if (intervalId) return;
    setStatus(1);
    setMeasure(getMeasureTitle())
    IsInitStart();
    thisIsWhile = IsWhile;
    intervalId = setInterval(() => {
        // 判断是否在答题界面
        if (hasClass('huahua_box') || hasId('questAnswer') || hasClass('questAnswer')) {
            // 开始答题
            clickRandomElement();
            startButton = false
        } else if (startButton === true) {// 开始测评
            if (!HasText('开始测评')) {
                startButton = false
            }
            if (starIntervalOutId === null) {
                starIntervalOutId = setTimeout(() => {
                    startButton = null
                    starIntervalOutId = null
                    textClick('开始测评')
                }, 2000)
            }
        } else if (startButton === false && HasText('开始测评')) {// 是否是开始测评页面
            startButton = true;
        } else if (startButton === false && (textClick('自评项目', true) || textClick('自评量表', true))) {  //如果在首页先点击自评
            startButton = true;
            // 避免重复执行
            if (intervalOutId === null) {
                // 等待一会,页面加载有动画
                intervalOutId = setTimeout(() => {
                    textClick('自评项目', true, true)
                    localStorage.removeItem('workself')
                    // 进入测试
                    setTimeout(() => {
                        textClick('进 入')
                        startButton = true;
                        intervalOutId = null
                    }, 1000)
                }, 2000)
            }
        }

        if (hasClass('请检查网络问题或是否已提交')) {
            console.log('重新返回列表')
            textClick('测评管理');
        }
    }, time);
    intervalIds.push(intervalId)
}

/**
 * CT1选项模拟点击
 * @param time
 */
function starCt1(time) {
    if (intervalId) return;
    intervalId = setInterval(() => {
        const title = document.querySelector('.answer-content-layout').querySelector('.title').querySelector('p').innerText
        sendMessage({action: 'setMeasure', title: title});
        // 1. 选择所有具有 class 'fa fa-square-o' 的元素
        const elements = document.querySelectorAll('.fa.fa-square-o');

        // 2. 确保选择到了元素
        if (elements.length > 0) {
            // 3. 随机选择一个元素
            const randomIndex = getFixedQuestion(elements.length);
            const randomElement = elements[randomIndex];
            // 4. 模拟点击事件
            randomElement.click();
        }
    }, time)
    intervalIds.push(intervalId)

}

function getFixedQuestion(max) {
    return fixed_question === -1 ? Math.floor(Math.random() * max) : fixed_question;
}

/**
 * 整合评估模拟点击
 * @param time
 */
function starCtZhpg(time) {
    if (intervalId) return;
    setStatus(1)
    intervalId = setInterval(() => {
        // 设定一个函数来模拟点击
        // 选择所有符合条件的元素
        const elements = document.querySelectorAll('.flex.cursorP.sorts');
        if (elements.length > 0) {
            // 随机选择一个元素的索引
            const randomIndex = getFixedQuestion(elements.length);

            // 获取随机选择的元素
            const randomElement = elements[randomIndex];

            // 模拟点击该元素
            randomElement.click();
            textClick('下一题')
            if (HasText('提交答案')) {
                stop();
            }
        }
    }, time)
    intervalIds.push(intervalId)

}

function stop() {
    intervalId && clearInterval(intervalId)
    intervalId = null;
    intervalIds.forEach((i) => {
        clearInterval(i)
    })
    intervalIds = [];
    setStatus(4);
}


function IsInitStart() {
    let init = getIsSubmitOrNext();
    if (init.type === 5) {
        init.button.click();
        setStatus(5);
    }

}

function setStatus(status) {
    sendMessage({action: 'setStatus', status: status});
    switch (status) {
        case 0:
            updateText(statusDocument, '初始化')
            break;
        case 1:
            updateText(statusDocument, '启用中')
            break;
        case 2:
            updateText(statusDocument, '已结束')
            break;
        case 3:
            updateText(statusDocument, '异常')
            break;
        case 4:
            updateText(statusDocument, '暂停')
            break;
        case 5:
            updateText(statusDocument, '开始')
            break;
        default:
            updateText(statusDocument, status || '无')
            break;
    }
}

function setMeasure(title, bool = false) {
    sendMessage({action: 'setMeasure', title: bool ? title : getMeasureTitle()});
    if (measureDocument && title) {
        measureDocument.innerText = title;
    }
}

function updateText(obj, text) {
    if (obj) {
        obj.innerText = text
    }
}

function getValue() {
    let value = document.getElementById('myInput')
    if (value) {
        return value.value;
    }
    return 200;
}

function getQuestions() {
    const selectedOption = document.querySelector('input[name="fixed_questions"]:checked');
    return selectedOption ? selectedOption.value : null;
}

/**
 * 匹配文字标签，执行点击事件
 * @param text 需要点击的文字标签
 * @param once 是否只用点击一次
 * @param random 只点击一次时是否随机点击
 */
function textClick(text = '', once = true, random = false) {
    if (text === '') return null;
    const xpath = "//text()[normalize-space(.)='" + text + "']/parent::*";
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (result.snapshotLength === 0) return;
    // 只点击一次
    if (once) {
        const randomInt = random ? getRandomInt(1, result.snapshotLength) : 0;
        result.snapshotItem(randomInt).click();
    } else {
        // 点击全部
        for (let i = 0; i < result.snapshotLength; i++) {
            const node = result.snapshotItem(i);
            node.click()
        }
    }
    return true;
}

/**
 * 判断某个文字标签是否存在
 * @param text
 * @returns {boolean|null}
 * @constructor
 */
function HasText(text = '') {
    if (text === '') return null;
    const xpath = "//text()[normalize-space(.)='" + text + "']/parent::*";
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return result.snapshotLength > 0;
}

/**
 * 判断class元素是否存在
 * @param className
 * @returns {boolean}
 */
function hasClass(className) {
    return document.getElementsByClassName(className).length > 0;
}

/**
 * 判断id元素是否存在
 * @param Name
 * @returns {boolean}
 */
function hasId(Name) {
    return document.getElementById(Name) !== null;
}

function sleep(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {
        // 空循环
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function quickly_finish() {
    const measure = new Measure;
    const list = await measure.getList();
    list.starAnswer()
    // console.log({list})
}


// 监听来自插件的消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    fixed_question = parseInt(message?.question || -1)
    switch (message.action) {
        case "start":
            start(message.time, message.IsWhile);
            break;
        case "stop":
            stop();
            break;
        case "quickly_finish":
            quickly_finish();
            break;
        case "getMeasure":
            sendMessage({action: 'setMeasure', title: getMeasureTitle()});
            break;
        case "starCt1":
            starCt1(message.time);
            break;
        case "starCtZhpg":
            starCtZhpg(message.time);
            break;
    }
});

// 监听来着页面的消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.action) {
        case "setStatus":
            setStatus(message.status);
            break;
        case "setMeasure":
            setMeasure(message.title);
            break;
    }
});


function sendMessage(data) {
    if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage(data);
    }
}

/**
 * 量表答题业务
 */
class Measure {
    constructor() {
        // token
        this.token = this.getToken();
        // 服务地址
        this.api = this.getApi();
        // 测评列表
        this.list = [];
    }

    /**
     * 获取token
     * @returns {string}
     */
    getToken() {
        return 'Bearer ' + localStorage.getItem('padtoken');
    }

    /**
     * 获取接口地址
     * @returns {string}
     */
    getApi() {
        let apiUrl = '';
        // 获取性能相关数据
        const performanceEntries = performance.getEntriesByType('resource');
        performanceEntries.forEach(entry => {
            // 找到 '/client/' 的索引位置
            const clientIndex = entry.name.indexOf('/client/');
            if (clientIndex !== -1) {
                // 截取 '/client/' 前面的内容
                apiUrl = entry.name.substring(0, clientIndex);
            }
        });
        return apiUrl;
    }

    /**
     * 获取量表列表
     * @returns {Measure}
     */
    async getList() {
        const list = await this.request('client/user_measure/get_all_evaluation');
        list.data.forEach((v) => {
            if (v.belong_to === 'self_assessment') {
                this.list.push(v);
            }
        })
        if (this.list.length === 0) {
            alert('没有需要测评的量表')
        }
        return this;
    }

    async starAnswer() {
        if (!this.list.length) return;
        const count = this.list.length
        for (const [index, v] of this.list.entries()) {
            const info = await this.getMeasureInfo(v.number);
            setMeasure(info.data.measure_info.main.alias_measure_title, true);
            await this.submit(info.data)
            setStatus((index + 1) + '/' + count)
        }
        if (confirm('已完成，是否刷新页面')) {
            location.reload()
        }
    }

    // 提交测评
    async submit(info) {
        if (!info.measure_info || !info.measure_info.questions || !info.user_measure_info) {
            return null;
        }
        // 题目列表
        const questions = info.measure_info.questions;
        // 提交的测评数据
        const param = {
            user_measure_number: info.user_measure_info.number,
            answers: {},
            answer_extra: {},
            use_time: info.measure_info.questions.length * 3
        }
        questions.forEach((v) => {
            param.answers[v.question_sort] = this.getOption(v.get_answers)
        })
        const res = await this.request('client/measure/measure_answer', param, 'POST')
        console.log(info.measure_info.main.alias_measure_title, res ? res.prompt : '无法提交')
    }

    /**
     * 获取选项中的一个
     * @param answers
     * @returns {*}
     */
    getOption(answers) {
        const randomIndex = getFixedQuestion(answers.length);
        return answers[randomIndex].answer_sort || '';
    }

    /**
     * 获取测评数据详情
     * @param number 测评编号
     * @returns {Promise<*>}
     */
    async getMeasureInfo(number) {
        return await this.request('client/measure/get_by_um_number', {number: number}, 'GET')
    }

    /**
     * 发送请求
     * @param {string} url - 请求的 URL
     * @param {Object|null} data - 请求的数据
     * @param {string} method - 请求的方法 (GET 或 POST)
     * @returns {Promise<any>} - 请求的响应数据
     */
    async request(url, data = null, method = 'GET') {
        url = this.api + '/' + url;
        if (method === 'GET' && data) {
            url += '?' + new URLSearchParams(data).toString()
        }
        // 使用 Fetch API 代替 XMLHttpRequest
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': this.token,
                'Source': 'Pad',
                'Content-Type': 'application/json'
            },
            body: method === 'POST' ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            return false;
        }

        return response.json();
    }
}