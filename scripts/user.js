
const GOD = ["AlphaNow", 1]
let _scores = [
  GOD
]

let _scores_html = document.getElementById("scores")

function update_scores() {
  _scores_html.innerHTML = ""
  for(let [username, score] of _scores) {
    let elt = document.createElement("p")
    elt.classList.add("user-score")
    elt.textContent = username + ": " + score
    _scores_html.appendChild(elt)
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
addScore("AA", 12)
addScore("AA", 15)
addScore("BB", 5)

