document.getElementById("toggleFocus").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: applyFocusMode
        });
    });
});

document.getElementById("summarize").addEventListener("click", async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        let result = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: extractText
        });

        let articleText = result[0].result;
        let response = await fetch("http://localhost:8000/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: articleText })
        });

        let data = await response.json();
        document.getElementById("summary").innerText = "Summary: " + data.summary;
    });
});

// Apply Focus Mode
function applyFocusMode() {
    document.body.style.backgroundColor = "#282c34";  
    document.body.style.color = "#ffffff";
    document.body.style.fontSize = "18px";
    document.body.style.fontFamily = "Arial, sans-serif";

    let elementsToRemove = ["header", "nav", "aside", "footer", "iframe", ".ads"];
    elementsToRemove.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
    });
}

// Extract text from webpage
function extractText() {
    return document.body.innerText;
}
