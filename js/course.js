(function() {
    // Map any possible language code to the actual filename (without .json)
    const langMap = {
        "en": "en_us",
        "en_us": "en_us",
        "ar": "ar_eg",
        "ar_eg": "ar_eg",
        "es": "es_es",
        "es_es": "es_es"
    };

    let currentLang = "en_us";
    let gradeData = null;

    const container = document.getElementById("gradesContainer");
    const langSelect = document.getElementById("langSelect");

    // Ensure the select options use the correct values (in case HTML is wrong)
    if (langSelect) {
        // Fix options if they have wrong values
        const options = langSelect.options;
        for (let i = 0; i < options.length; i++) {
            const val = options[i].value;
            if (langMap[val]) {
                options[i].value = langMap[val];
            }
        }
        // Set default to en_us if not set
        if (!langSelect.value || !langMap[langSelect.value]) {
            langSelect.value = "en_us";
        }
    }

    async function loadLanguageFile(langCode) {
        // Normalize the language code using the map
        const normalized = langMap[langCode] || "en_us";
        const url = `../json/lang/${normalized}.json`;
        console.log("Fetching:", url);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status} – ${url}`);
            return await response.json();
        } catch (err) {
            console.error("Failed to load language file:", err);
            container.innerHTML = `<div class="error">Unable to load course data (${url}). Please check that the JSON files exist in /json/lang/.</div>`;
            return null;
        }
    }

    function renderCards() {
        if (!gradeData) return;
        const grades = Object.keys(gradeData).sort((a,b) => {
            if (a === "K") return -1;
            if (b === "K") return 1;
            return parseInt(a) - parseInt(b);
        });
        let html = '';
        for (let grade of grades) {
            const sections = gradeData[grade];
            const options = sections.map(s => `<option value="${s}">${s}</option>`).join('');
            html += `
                <div class="grade-card">
                    <div class="grade-title">
                        <span class="material-icons">school</span>
                        ${getGradeLabel(grade, currentLang)}
                    </div>
                    <div class="dropdown-container">
                        <select class="grade-select">
                            <option disabled selected>${getSelectPrompt(currentLang)}</option>
                            ${options}
                        </select>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
        document.querySelectorAll('.grade-select').forEach(select => {
            select.addEventListener('change', (e) => {
                if (e.target.value) {
                    alert(`📚 "${e.target.value}" – This section is part of the upcoming full curriculum.`);
                }
            });
        });
    }

    function getGradeLabel(grade, langCode) {
        const normalized = langMap[langCode] || "en_us";
        const labels = {
            en_us: `Grade ${grade}`,
            ar_eg: grade === "K" ? "روضة" : `الصف ${grade}`,
            es_es: `Grado ${grade}`
        };
        return labels[normalized] || `Grade ${grade}`;
    }

    function getSelectPrompt(langCode) {
        const normalized = langMap[langCode] || "en_us";
        const prompts = {
            en_us: "Select a section",
            ar_eg: "اختر قسم",
            es_es: "Seleccionar sección"
        };
        return prompts[normalized];
    }

    async function switchLanguage(langCode) {
        const normalized = langMap[langCode] || "en_us";
        currentLang = normalized;
        container.innerHTML = '<div class="loading">Loading courses...</div>';
        const data = await loadLanguageFile(normalized);
        if (data) {
            gradeData = data;
            renderCards();
        }
    }

    async function init() {
        if (langSelect) {
            // Remove any existing listeners to avoid duplicates
            const newSelect = langSelect.cloneNode(true);
            langSelect.parentNode.replaceChild(newSelect, langSelect);
            window.langSelect = newSelect;
            newSelect.addEventListener("change", (e) => switchLanguage(e.target.value));
        }
        // Start with English
        await switchLanguage("en_us");
    }

    init();
})();