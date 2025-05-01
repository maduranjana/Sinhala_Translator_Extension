let popup;

document.addEventListener("mouseup", async (event) => {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText || selectedText.includes(" ")) return;

    chrome.runtime.sendMessage(
        { type: "FETCH_TRANSLATION", word: selectedText },
        (response) => {
            if (!response || !response.success) {
                console.error("Translation failed", response?.error);
                return;
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(response.html, "text/html");
            const rows = doc.querySelectorAll("table.tb tr");

            let translations = [];
            rows.forEach(row => {
                const cells = row.querySelectorAll("td");
                if (cells.length === 3) {
                    const meaning = cells[2].textContent.trim();
                    if (meaning) translations.push(meaning);
                }
            });

            if (!translations.length) return;

            if (popup) popup.remove();
            popup = document.createElement("div");
            popup.textContent = translations.join(", ");
            Object.assign(popup.style, {
                position: "absolute",
                left: `${event.pageX + 10}px`,
                top: `${event.pageY + 10}px`,
                background: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                padding: "8px",
                fontSize: "13px",
                maxWidth: "300px",
                zIndex: 999999,
                boxShadow: "0px 0px 6px rgba(0,0,0,0.2)",
                borderRadius: "6px"
            });

            document.body.appendChild(popup);
            setTimeout(() => popup?.remove(), 6000);
        }
    );
});
