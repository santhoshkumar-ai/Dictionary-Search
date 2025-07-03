const searchBox = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");
const wordTxt = document.getElementById("word-txt");
const typeTxt = document.getElementById("type-txt");
const phoneticTxt = document.getElementById("phonetic-txt");
const soundBtn = document.getElementById("sound-btn");
const definitionTxt = document.getElementById("definition-txt");
const exampleElem = document.getElementById("example-elem");
const synonymsElem = document.getElementById("synonyms-elem");
const antonymsElem = document.getElementById("antonyms-elem");
const audio = new Audio();
const wordDetailsElem = document.querySelector(".word-details");
const errTxt = document.querySelector(".errTxt");
async function getWordDetails(word) {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    const wordData = data[0];
    const phonetics = wordData.phonetics || [];

    let phoneticTxt = "",
        phoneticAudio = "";

    for (const phonetic of phonetics) {
        if (phonetic.text && !phoneticTxt)
            phoneticTxt = phonetic.text
        if (phonetic.audio && !phoneticAudio)
            phoneticAudio = phonetic.audio;
        if (phoneticTxt && phoneticAudio) break;
    }

    const meaning = wordData.meanings[0];

    return {
        word: word.toLowerCase(),
        phonetic: {
            text: phoneticTxt,
            audio: phoneticAudio
        },
        speechPart: meaning.partOfSpeech,
        definition: meaning.definitions[0].definition,
        synonyms: meaning.synonyms,
        antonyms: meaning.antonyms,
        example: meaning.definitions[0].example || ""
    }
}
searchBox.addEventListener("submit", async e => {
    e.preventDefault();
    if (searchInput.value.trim() === "") {
        errTxt.textContent = "Please Enter a Word"
    } else {
        wordDetailsElem.classList.remove("active")
        try {
            errTxt.textContent = "";
            const wordDetails = await getWordDetails(searchInput.value);
            wordTxt.textContent = wordDetails.word;
            typeTxt.textContent = wordDetails.speechPart;
            phoneticTxt.textContent = wordDetails.phonetic.text;
            audio.src = wordDetails.phonetic.audio;
            definitionTxt.textContent = wordDetails.definition
            exampleElem.querySelector("p").textContent = wordDetails.example
            synonymsElem.querySelector("p").textContent = wordDetails.synonyms.join(", ");
            antonymsElem.querySelector("p").textContent = wordDetails.antonyms.join(", ");
            exampleElem.style.display = wordDetails.example === "" ? "none" : "block";
            synonymsElem.style.display = wordDetails.synonyms.length === 0 ? "none" : "block";
            antonymsElem.style.display = wordDetails.antonyms.length === 0 ? "none" : "block"
            wordDetailsElem.classList.add("active")
        } catch {
            errTxt.textContent = "Word Not Found";
        }
    }
})
soundBtn.addEventListener("click", () => {
    audio.play()
})