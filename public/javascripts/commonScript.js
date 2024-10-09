let currentUser = undefined
let testEnded = false
let test = undefined
let handleKeyDown
let timer

const reset = document.getElementById("reset")
const input = document.querySelector("#userTxt")
const transparentBox = document.querySelector("#transparentBox")
let time = 15
let timeToStartWith = time
let timeTaken = 0
let started = false
let audio1 = new Audio("Assets/keyHit.mp3")
let audio2 = new Audio("Assets/keyError.mp3")

const sourceText = document.getElementById("sourceTxt")
const themes = {
  1: {
    "--flashLogo": "rgb(180, 244, 250)",
    "--mainBackground": "#030613",
    "--wordsTxt": "#4fcdb9",
    "--buttonTxt": "#3a6c97",
    "--buttonHover": "#fff",
    "--profileCard": "white",
  },
  2: {
    "--flashLogo": "#ffffff",
    "--mainBackground": "#000000",
    "--wordsTxt": "#d0d0d0",
    "--buttonTxt": "#ffffff",
    "--buttonHover": "#737373",
    "--profileCard": "white",
  },
  3: {
    "--flashLogo": "#d1ffcd",
    "--mainBackground": "#000000",
    "--wordsTxt": "#15ff00",
    "--buttonTxt": "#006500",
    "--buttonHover": "#d1ffcd",
    "--profileCard": "white",
  },
  4: {
    "--flashLogo": "#ffffff",
    "--mainBackground": "#0e0e0e",
    "--wordsTxt": "#db9730",
    "--buttonTxt": "#555555",
    "--buttonHover": "#c6c6c6",
    "--profileCard": "white",
  },
  5: {
    "--flashLogo": "#444444",
    "--mainBackground": "#ffffff",
    "--wordsTxt": "#444444",
    "--buttonTxt": "#898787",
    "--buttonHover": "#444444",
    "--profileCard": "white",
  },
  6: {
    "--flashLogo": "#ffa7a7",
    "--mainBackground": "#240000",
    "--wordsTxt": "#ea514b",
    "--buttonTxt": "#f36f6f",
    "--buttonHover": "#ffffff",
    "--profileCard": "white",
  },
}
const fontFamilies = [
  "Roboto", // fontFamily == "1"
  "Charm", // fontFamily == "2"
  "Cinzel", // fontFamily == "3"
  "Spicy Rice", // fontFamily == "4"
  "Cormorant Upright", // fontFamily == "5"
  "Amita", // fontFamily == "6"
  "Special Elite", // fontFamily == "7"
  "Cutive Mono", // fontFamily == "8"
]
const fontSizes = [
  "1.5rem", // fontSize == "1"
  "2rem", // fontSize == "2"
  "3rem", // fontSize == "3"
]

const defaultPreferences = {
  fontFamily: 1,
  fontSize: 2,
  theme: 1,
  tabRestart: false,
  proMode: false,
  keyHitSound: false,
  preferCustomWords: false,
  customWords: [],
}

async function fetchUserInfo() {
  try {
    const response = await fetch("/api")
    currentUser = await response.json()
    main()
  } catch (error) {
    console.error("Error fetching user info", error)
  }
}

// main ()
let isActive = false
let preferences =
  JSON.parse(localStorage.getItem("preferences")) || defaultPreferences
if (!localStorage.getItem("preferences")) {
  localStorage.setItem("preferences", JSON.stringify(defaultPreferences))
}

let fontSize = preferences.fontSize
let fontFamily = preferences.fontFamily
let theme = parseInt(preferences.theme)
sourceText.style.fontFamily = fontFamilies[fontFamily - 1]
sourceText.style.fontSize = fontSizes[fontSize - 1]
const selectedTheme = themes[theme]
const root = document.documentElement
for (const [property, value] of Object.entries(selectedTheme)) {
  root.style.setProperty(property, value)
}
const Allowed =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZBackspace' "

let words =
  "about above add after again air all almost along also always an and animal another answer any are around as ask at away back be because been before began begin being below between big book both boy but by call came can car carry change children city close come could country cut day did different do does don't down each earth eat end enough even every example eye face family far father feet few find first follow food for form found four from get girl give go good got great group grow had hand hard has have he head hear help her here high him his home house how idea if important in Indian into is it its it's just keep kind know land large last later learn leave left let letter life light like line list little live long look made make man many may me mean men might mile miss more most mother mountain move much must my name near need never new next night no not now number of off often oil old on once one only open or other our out over own page paper part people picture place plant play point put question quick quickly quite read really right river run said same saw say school sea second see seem sentence set she should show side small so some something sometimes song soon sound spell start state still stop story study such take talk tell than that the their them then there these they thing think this those thought three through time to together too took tree try turn two under until up us use very walk want was watch water way we well went were what when where which while white who why will with without word work world would write year you young your".split(
    " "
  )

let userWords = []

//function to shuffle given words
function shuffle(wordss) {
  //online algorithm to shuffle
  wordss.sort(() => Math.random() - 0.5)
  return wordss
}

// When user clicks on custom words button
const customWordsBtn = document.querySelector("#customWordsBtn")
if (preferences.preferCustomWords) {
  customWordsBtn.textContent = "Random Words"
  isActive = true
} else {
  customWordsBtn.textContent = "Custom Words"
  isActive = false
}

const customWordsBox = document.querySelector("#customWordsBox")
const wordsOkBtn = document.querySelector("#TextBtn")
const customTextBox = document.querySelector("#customWords")
const customX_Btn = document.querySelector("#customX_Btn")
const leaderboardBtn = document.getElementById("leaderboardBtn")
const changeLayoutBtn = document.getElementById("changeLayoutBtn")

customWordsBtn.onclick = function () {
  if (!started) {
    isActive = !isActive
    if (isActive) {
      customWordsBtn.textContent = "Random Words"
      customX_Btn.onclick = function () {
        customWordsBox.classList.add("animation2")
        setTimeout(() => {
          transparentBox.style.display = "none"
        }, 300)
        input.focus()
        customWordsBtn.textContent = "Custom Words"
        isActive = !isActive
      }
      customWordsBox.classList.add("animation1")
      customWordsBox.classList.remove("animation2")
      transparentBox.style.display = "initial"
      customWordsBox.style.display = "flex"
      customTextBox.focus()
      if (preferences.customWords.length) {
        customTextBox.textContent = preferences.customWords.join(" ")
      }
      wordsOkBtn.onclick = function () {
        customTextBox.value = customTextBox.value.trim()
        customTextBox.value = customTextBox.value.replace(/\s+/g, " ")
        const validInput = /^[a-zA-Z\s]+$/
        userWords = customTextBox.value.split(" ")
        if (!validInput.test(customTextBox.value)) {
          alert("Please enter only alphabets separated by a single space")
          customTextBox.focus()
        } else if (userWords.length <= 1) {
          alert("Please enter atleast 2 words")
        } else {
          customWordsBox.classList.add("animation2")
          setTimeout(() => {
            transparentBox.style.display = "none"
          }, 300)
          input.focus()
          let previousPreferences = JSON.parse(
            localStorage.getItem("preferences")
          )
          previousPreferences.customWords = userWords
          previousPreferences.preferCustomWords = true
          previousPreferences = JSON.stringify(previousPreferences)
          localStorage.setItem("preferences", previousPreferences)
          keyboardstart(userWords)
        }
      }
    } else {
      customWordsBtn.textContent = "Custom Words"
      let previousPreferences = JSON.parse(localStorage.getItem("preferences"))
      previousPreferences.preferCustomWords = false
      previousPreferences = JSON.stringify(previousPreferences)
      localStorage.setItem("preferences", previousPreferences)
      keyboardstart(words)
    }
  }
}

// Function to select times with custom time
const times = document.querySelectorAll(".uncheck")
const customTime = document.getElementById("chooseTime")
const timeTxt = document.getElementById("timerTxt")
const timeOkBtn = document.getElementById("timeOkBtn")
function selectTime() {
  if (!started) {
    for (let i = 0; i < times.length; i++) {
      times[i].onclick = function () {
        for (let j = 0; j < times.length; j++) {
          times[j].classList.remove("check")
        }
        times[i].classList.toggle("check")
        timeTxt.innerHTML = times[i].value + "s"
        input.focus()
        time = times[i].value
        timeToStartWith = time
      }
    }
    timeTxt.innerHTML = time + "s"
    timeOkBtn.onclick = function () {
      if (customTime.value != "") {
        for (let j = 0; j < times.length; j++) {
          times[j].classList.remove("check")
        }
        if (Number(customTime.value) < 15) {
          time = 15
          customTime.value = 15
        } else if (Number(customTime.value) > 300) {
          time = 300
          customTime.value = 300
        } else {
          time = customTime.value
        }
        timeToStartWith = time
        timeTxt.innerHTML = time + "s"
        input.focus()
      }
    }
  }
}
function restart() {
  if (!test) {
    test = { timeTaken: timeTaken }

    sendModifiedData()
  }
  input.removeEventListener("keydown", handleKeyDown)
  location.reload()
  input.addEventListener("keydown", handleKeyDown)
}
reset.onclick = function () {
  restart()
}
sourceText.onclick = function () {
  input.focus()
}


const scrollPosition = refLetters[ind].offsetTop - sourceText.offsetTop
sourceText.scrollTop = scrollPosition


function formatDate(timestamp) {
  const date = new Date(timestamp)
  const day = date.getDate()
  const month = date.toLocaleString("default", { month: "short" })
  const year = date.getFullYear()

  // Function to get the ordinal suffix
  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th" // Handle teens (11th, 12th, 13th, ...)
    switch (day % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  const dayWithSuffix = day + getOrdinalSuffix(day)

  return `${dayWithSuffix} ${month} ${year}`
}

async function sendModifiedData() {
  if (!currentUser) {
    console.error("No user data to send.")
    return
  }
  const toReturn = {
    test: test,
    currentUser: currentUser,
    testEnded: testEnded,
  }

  // Modify the data as needed
  try {
    await fetch("/api", {
      method: "POST", // or 'PUT' depending on your API
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toReturn),
    })
  } catch (error) {
    console.error("Error sending modified data", error)
  }
}

//calling functions
input.focus()
selectTime()
keyboardstart(words)

// main() end
fetchUserInfo()
