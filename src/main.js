

// setTimeout(() => {
//     const dom = document.getElementsByClassName("view-line") || [];
//     console.log("dom", dom)
//     Array.from(dom).forEach(dom => {
//         // console.log(dom.children[0].innerText)
        
//     })
// })


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
    const dom = document.getElementsByClassName("view-line");
    const codes = Array.from(dom)
    if (codes.length === 0) {
        setTimeout(() => {
            getCode();
        }, 1000)
    } else {
        loadStaus = true;
        let str = '';
        codes.slice(0, codes.length - 1).forEach(dom => {
            const text = dom.children[0].innerText;
            if (text.includes('chart.render();') || text.includes("@antv/g2")) {
                return;
            }
            str += dom.children[0].innerText + '\n';
        })
        transformCode({detail: str})
    }
}


getCode();