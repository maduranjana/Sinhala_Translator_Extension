document.getElementById("translateBtn").addEventListener("click", translateWord);
document.getElementById("wordInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") translateWord();
});

function translateWord() {
    const word = document.getElementById("wordInput").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.textContent = "Translating...";

    if (!word) {
        resultDiv.textContent = "Please enter a word.";
        return;
    }

    chrome.runtime.sendMessage(
        { type: "FETCH_TRANSLATION", word },
        (response) => {
            if (!response || !response.success) {
                resultDiv.textContent = "Error fetching translation.";
                return;
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(response.html, "text/html");
            const rows = doc.querySelectorAll("table.tb tr");

            const translations = [];
            rows.forEach(row => {
                const cells = row.querySelectorAll("td");
                if (cells.length === 3) {
                    const type = cells[1].textContent.trim(); // like "n."
                    const meaning = cells[2].textContent.trim(); // Sinhala translation

                    if (meaning) {
                        const entry = type ? `<strong>${type}</strong> ${meaning}` : meaning;
                        translations.push(entry);
                    }
                }
            });

            resultDiv.innerHTML = translations.length
                ? `<ul>${translations.map(t => `<li>${t}</li>`).join('')}</ul>`
                : "No translation found.";

        }
    );
}
