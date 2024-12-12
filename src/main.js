

// setTimeout(() => {
//     const dom = document.getElementsByClassName("view-line") || [];
//     console.log("dom", dom)
//     Array.from(dom).forEach(dom => {
//         // console.log(dom.children[0].innerText)
        
//     })
// })

console.log("loading~~~~~");

let loadStaus = false;
let currentCode = '';

chrome.runtime.onMessage.addListener(
    (req, sender, sendResponse) => {
        console.log("recieve", req.message)
        if (req.message === 'confirm') {
            sendResponse({status: loadStaus})
        }

        if (req.message === 'code') {
            sendResponse({code: currentCode})
        }
    }
)

// TODO，transform的地点只能交给tab来做，content-script无法直接执行一些js代码
const transformCode = (e) => {
    currentCode = e.detail;
}


const getCode = () => {
    const dom = document.getElementsByClassName("view-lines")[0];
    const codes = dom ? Array.from(dom.children) : [];
    const copyBtn = document.getElementsByClassName("ant-typography-copy")[0];
    
    if (codes.length === 0 || !copyBtn) {
        setTimeout(() => {
            getCode();
        }, 200)
        console.log("加载失败，重新加载")
    } else {
        console.log(dom.children)
        copyBtn.click();
        setTimeout(() => {
            navigator.clipboard.readText().then(text => {
                const code = text.split("\n").filter(str => {
                    if (str.includes("chart.render()" || str.includes("import"))) {
                        return false;
                    } else {
                        return true;
                    }
                }).join("\n");
                console.log("code", code);
                transformCode({detail: code})
            }).catch(err => {
                console.error("请focus当前页面");
            })
        }, 500)
    }
}


getCode();