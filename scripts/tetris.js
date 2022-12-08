const score_html = document.getElementById("score")
let score
const speed_html = document.getElementById("speed")
let freq

function update_score_speed() {
  score_html.textContent = "Score : " + score
  speed_html.textContent = "Speed : " + Math.floor(1/freq*10)
}

const grid_html = document.getElementById("tetris-grid")
let grid

const WIDTH = 10
const HEIGHT = 20

function clearGrid() {
  grid = []
  grid_html.textContent = ""
  for(let y=0; y<HEIGHT; y++) {
    let html_line = document.createElement("tr")
    let line = []
    grid_html.appendChild(html_line)
    grid.push(line)
    for(let x=0; x<WIDTH; x++) {
      let cell = document.createElement("th")
      cell.classList.add("cell")
      html_line.appendChild(cell)
      cell.textContent = "X"
      line.push(null)
    }
  }
}

let is_end
let piece

function newGame() {
  is_end = false
  clearGrid()
  piece = Piece.random()
  score = 0
  freq = 1/3
}

newGame()

function update() {
  setTimeout(update, freq*1000)
  if(is_end) {return}
  collided = piece.down1()
  if(collided) {
    piece = Piece.random()
  }
  update_score_speed()
}
update()

document.addEventListener("keydown", (e) => {
  if(is_end) {return}
  
  if (e.code == "ArrowLeft" || e.code == "KeyA") {
    piece.move_left()
  } else if (e.code == "ArrowRight" || e.code == "KeyD") {
    piece.move_right()
  } else if (e.code == "KeyQ") {
    piece.rotate_left()
  } else if (e.code == "KeyE" || e.code == "Space") {
    piece.rotate_right()
  } else if (e.code == "ArrowDown" || e.code == "KeyS") {
    nb_moves = piece.move_full_down()
    piece = Piece.random()
    score += nb_moves
  }
})

function end() {
  console.log("end")
  is_end = true

  let end_element = document.createElement("span")
  
  let game_over_text = document.createElement("h2")
  game_over_text.textContent = "Game Over ..."
  end_element.appendChild(game_over_text)
  
  let score_text = document.createElement("h3")
  score_text.textContent = "Your score : " + score
  end_element.appendChild(score_text)

  let newgame_button = document.createElement("button")
  newgame_button.onclick = () => {
    end_element.remove()
    newGame()
  }
  newgame_button.textContent = "-> New game"
  end_element.appendChild(newgame_button)
  
  end_element.classList.add("end-overlay")
  document.body.appendChild(end_element)
}
