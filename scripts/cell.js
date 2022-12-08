
class Cell {
  constructor(color) {
    this.color = color;
  }

  updateStyle(th) {
    th.style.backgroundColor = this.color;
  }
}
