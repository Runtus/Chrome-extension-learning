let limit = 0;
// sendMessageToContentScript
const contentScriptLoadConfirm = async () => {
    limit++;
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    
    const res = await chrome.tabs.sendMessage(tab.id, {
        message: "confirm"
    })
    if (res.status) {
        return true;
    } else {
        if (limit > 5) {
            console.error("load error, please check your web.");
            return false;
        }
        setTimeout(() => {
            contentScriptLoadConfirm();
        }, 3000);
    }
}



const main = async () => {
    const status = await contentScriptLoadConfirm();
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    console.log("status",status)
    if (status) {
        const res = await chrome.tabs.sendMessage(tab.id, {
            message: "code"
        })
      
        setTimeout(() => {
            const sandboxDom = document.getElementById("theFrame");
            sandboxDom.contentWindow.postMessage(res.code, "*")
            console.log("send over")
        }, 500)
        // window.postMessage = sandboxDom.contentWindow.postMessage;
        
    }
}

main();

