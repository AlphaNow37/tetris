
let username_input = document.getElementById("username-input")

let stored = localStorage.getItem("scores")
let _scores = JSON.parse(stored ?? "[]")
const GOD = ["AlphaNow", Math.max(_scores.map(
  ([_, s]) => s
)) + 1]

let _scores_html = document.getElementById("scores")

function addBar(username, score) {
    let elt = document.createElement("p")
    elt.classList.add("user-score")
    elt.textContent = username + ": " + score
    _scores_html.appendChild(elt)
}

function update_scores() {
  let to_store = JSON.stringify(_scores)
  localStorage.setItem("scores", to_store)
  
  _scores_html.innerHTML = ""
  addBar(...GOD)
  for(let [username, score] of _scores) {
    addBar(username, score)
  }
}
function addScore(username, score) {
  let found = false
  for(let [idx, [name, lscore]] of _scores.entries()) {
    if(name === username) {
      found = true
      if(score > lscore) {
        _scores[idx][1] = score
      }
    }
  }
  if(!found) {
    _scores.push([username, score])
  }
  if(score > GOD[1]) {
    GOD[1] = score + 1
  }
  _scores.sort((a, b) => b[1] - a[1])
  update_scores()
}

update_scores()

function addUserScore(score) {
  addScore(username_input.value || "You", score)
}
