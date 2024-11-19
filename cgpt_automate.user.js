// ==UserScript==
// @name         chatGPT automation
// @namespace    http://tampermonkey.net/
// @version      2024-11-17
// @description  If you want to automate chat with chatGPT-web, try this !
// @author       sushigadaisuki (https://github.com/sushigadaisuki/automate_chatgpt_web)
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(() => {
    let isChatAvailable = () => !document.querySelector("#composer-background > div > button");

    let chat = async function (text) {
        const chatInput = document.querySelector("#prompt-textarea");
        if (chatInput) {
            let new_element = document.createElement('p');
            new_element.textContent = text;
            chatInput.removeChild(chatInput.firstChild);
            chatInput.appendChild(new_element);
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.error("Chatbox not found.");
        }
        await sleep(300);
        const sendButton = document.querySelector("#composer-background > div > button");
        if (sendButton) {
            sendButton.click();
        } else {
            console.error("Send button not found");
        }
    };

    let responseFinishCallBack = () => { };
    let callWhenChatAvailable = (callback) => {
        responseFinishCallBack = callback;
    }

    let chatBulkArr = [];
    let chatBulk = (bulk) => {
        chatBulkArr = bulk
    }

    setInterval(() => {
        if (isChatAvailable()) {
            if (chatBulkArr.length > 0) {
                let txt = chatBulkArr.shift();
                chat(txt);
            } else {
                responseFinishCallBack(chat);
            }
        }
    }, 500);

    window.cgpt = {
        chat: chat,
        chatBulk: chatBulk,
        callWhenChatAvailable: callWhenChatAvailable,
        isChatAvailable: isChatAvailable
    };
})();
