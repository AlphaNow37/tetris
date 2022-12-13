function randomColor() {
  color = 60
  for(;(30 < color && color < 90);) {
    color = Math.random()*360
  }
  return `hsl(${Math.floor(color)}, 100%, 30%)`
}

function setAt(x, y, cell) {
  grid[y][x] = cell;
  th = grid_html.childNodes[y].childNodes[x]
  if (cell !== null) {
    cell.updateStyle(th)
  } else {
    th.style.backgroundColor = null;
  }
}

function swap(x1, y1, x2, y2) {
  c1 = grid[y1][x1]
  c2 = grid[y2][x2]
  setAt(x1, y1, c2)
  setAt(x2, y2, c1)
}

function generateRandomRels(n) {
  let actuals = [[0, 0]]
  for(let i=1; i<n; i++) {
    let pos = actuals[0]
    while(actuals.some(([x, y]) => x==pos[0] && y==pos[1])) {
      [x, y] = actuals[Math.floor(Math.random()*i)]
      let [x_, y_] = [[0, 1], [1, 0], [0, -1], [-1, 0]][Math.floor(Math.random()*4)]
      pos = [x+x_, y+y_]
    }
    actuals.push(pos)
  }
  return actuals
}

RELS = [
  // [[0, -1], [0, 0], [0, 1]],
  // [[0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]],
  // [[0, -1], [0, 0], [0, 1]],
  // [[0, -1], [0, 0], [1, 0]],
  [[-1, 0], [1, 0], [0, 0], [0, -1]]
]

function is_visible(x, y) {
  return x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT
}

function delete_full_rows() {
  let query_full_redraw = false
  for(let y = 0; y < HEIGHT;) {
    if(!grid[y].includes(null)) {
      score += 20
      empty_row = []
      for(let x = 0; x < WIDTH; x++) {
        empty_row.push(null)
      }
      grid.splice(y, 1)
      grid.splice(0, 0, empty_row)
      query_full_redraw = true
    } else {
      y++
    }
  }
  if(query_full_redraw) {
    for(let y = 0; y < HEIGHT; y++) {
      for(let x = 0; x < WIDTH; x++) {
        setAt(x, y, grid[y][x])
      }
    }
  }
}

class Piece {
  static random() {
    let n = Math.floor(Math.random() * RELS.length)
    let rels = generateRandomRels(5)
    return new Piece(rels, randomColor(), Math.random() * (WIDTH-4)+2)
  }
  constructor(rels, color, center_x) {
    this.rels = rels
    this.cell = new Cell(color)
    this.center = [center_x, -2]
  }
  down1() {
    if(this.doCollide(([x, y]) => [x, y+1])) {
      this.on_piece_freeze()
      return true
    } else {
      this.destroy()
      this.center[1] += 1
      this.redraw()
      return false
    }
  }
  get_abs_pos() {
    return this.rels.map(([x, y]) => {
      x += this.center[0]
      y += this.center[1]
      return [Math.floor(x), Math.floor(y)]
    })
  }
  get_visible_pos() {
    return this.get_abs_pos().filter(
      ([x, y]) => (is_visible(x, y))
    )
  }
  redraw() {
    for (let [x, y] of this.get_visible_pos()) {
      setAt(x, y, this.cell)
    }
  }
  destroy() {
    for (let [x, y] of this.get_visible_pos()) {
      setAt(x, y, null)
    }
  }
  doCollide(transform) {
    for (let [x, y] of this.get_visible_pos()) {
      [x, y] = transform([x, y])
      if(
        !is_visible(x, y) 
        || (grid[y][x] !== null && grid[y][x] !== this.cell)) {
          return true
      }
    }
    return false
  }

  rotate(transform) {
    let bef_rels = this.rels
    let new_rels = this.rels.map(transform)
    this.rels = new_rels
    let do_collide = this.doCollide(([x, y]) => [x, y]) || this.get_abs_pos().some(([x, y]) => !is_visible(x, y))
    this.rels = bef_rels
    if(!do_collide) {
      this.destroy()
      this.rels = new_rels
      console.log(this.rels)
      this.redraw()
    }              
  }
  rotate_left() {
    this.rotate(([x, y]) => [y, -x])
  }
  rotate_right() {
    this.rotate(([x, y]) => [-y, x])
  }

  move(by) {
    let transform = ([x, y]) => [x+by, y]
    if(!this.doCollide(transform)) {
      this.destroy()
      this.center[0] += by
      this.redraw()
    }
  }
  move_right(){this.move(1)}
  move_left(){this.move(-1)}

  move_full_down() {
    let nb_moves = 0
    for(;;) {
      if (this.down1()) {
        break
      }
      nb_moves += 1
    }
    return nb_moves
  }

  on_piece_freeze() {
    delete_full_rows()
    if(this.get_abs_pos().some(
      ([_, y]) => y < 0
    )) {
      end()
    }
    score += 10
    freq *= 0.95
  }
}
