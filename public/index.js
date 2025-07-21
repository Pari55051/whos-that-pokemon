let gameData
const main = document.querySelector('main')
const pokemonImage = document.querySelector('#pokemon-image')
const textOverlay = document.querySelector('#text-overlay')
const choices = document.querySelector('#choices')
const playBtn = document.querySelector('#play')

playBtn.addEventListener('click', fetchData)
loadVoice()
addAnswerHandler()


async function fetchData() {
    resetImage()
    gameData = await window.getPokeData()
    showSilhouette()
    displayChoices()
}

function resetImage() {
    pokemonImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'
    main.classList.add('fetching')
    main.classList.remove('revealed')
}

function showSilhouette() {
    main.classList.remove('fetching')
    pokemonImage.src = gameData.correct.image
}

function displayChoices() {
    const { pokemonChoices } = gameData
    const choicesHTML = pokemonChoices.map(({ name }) => {
        return `<button data-name="${name}" class="choice">${name}</button>`
    }).join('')

    choices.innerHTML = choicesHTML
    // playBtn.disabled = true
}


function addAnswerHandler() {
    choices.addEventListener('click', e => {
        const { name } = e.target.dataset
        const resultClass = (name === gameData.correct.name) ?
        'correct' : 'incorrect'
        
        e.target.classList.add(resultClass)
        
        revealPokemon()
        speakAnswer()
        
        // console.log("reached here")
        const choice_btns = document.querySelectorAll('.choice')
        // console.log(choice_btns)

        choice_btns.forEach((choice) => {
            console.log(choice)
            if (choice !== e) {
                choice.disabled = true
            }
        })

        playBtn.disabled = false
        playBtn.innerHTML = `Play Again!`

    })
}

function revealPokemon() {
    main.classList.add('revealed')
    textOverlay.textContent = `${gameData.correct.name}!`
}

function loadVoice() {
    window.speechSynthesis.onvoiceschanged = () => {
        window.femaleVoice = speechSynthesis.getVoices()[4]
    }
}

function speakAnswer() {
    const utterance = new SpeechSynthesisUtterance(gameData.correct.name)
    utterance.voice = window.femaleVoice
    utterance.pitch = 0.9
    utterance.rate = 0.85
    speechSynthesis.speak(utterance)
}