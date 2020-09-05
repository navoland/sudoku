import Cell from './Cell'

const size = 80
const grid: Grid = new PIXI.Graphics()
  .beginFill(0xffffff, .5)
  .lineStyle(4, 0x555555, 1, 1)
  .drawRect(0, 0, size * 9, size * 9)
grid.interactive = true
grid.pivot.set(grid.width / 2, 0)
grid.on('pointerdown', (e: IEvent) => {
  if (e.target.name !== 'cell') return
  const cell = e.target as Cell
  const {index} = cell
  inactivate()
  if (!cell.fixed) {
    cell.select()
    grid.activeCell = cell
  }
  activeCells(index.x, index.y)
})

let cells: Cell[]
let rows: Cell[][]
let cols: Cell[][]
let boxes: Cell[][]

/** 高亮关联的cell */
function activeCells(x: number, y: number) {
  for (const cell of rows[y]) {
    cell.activate()
  }
  for (const cell of cols[x]) {
    cell.activate()
  }
  const i = (x / 3 | 0) + (y / 3 | 0) * 3
  for (const cell of boxes[i]) {
    cell.activate()
  }
}

function inactivate() {
  for (const cell of cells) {
    cell.inactivate()
  }
}

grid.layout = function(data: ILevelData) {
  cells = []
  rows = []
  cols = []
  boxes = []
  this.data = data
  let num: number
  for (let i = 0; i < 81; i++) {
    const x = i % 9
    const y = i / 9 | 0
    num = +data[0][i]
    const cell = new Cell({
      num,
      size,
      lineWidth: .5,
      lineColor: 0xccd2dd,
      alignment: 0,
      fill: 0xffffff,
    })

    cell.name = 'cell'
    cell.index.x = x
    cell.index.y = y

    rows[y] ||= []
    rows[y].push(cell)
    cols[x] ||= []
    cols[x].push(cell)

    // 宫
    {
      const _x = x / 3 | 0
      const _y = y / 3 | 0
      const i = _y * 3 + _x
      boxes[i] ||= []
      boxes[i].push(cell)
    }

    cell.interactive = true

    cell.position.set(x * size, y * size)

    cells.push(cell)
    grid.addChild(cell)
  }

  for (let x = 0; x < 2; x++) {
    const line = new PIXI.Graphics()
      .beginFill(0x555555)
      .drawRect(0, 0, 2, size * 9)
      .endFill()

    line.position.set((x + 1) * size * 3 - 1, 0)
    grid.addChild(line)
  }

  for (let y = 0; y < 2; y++) {
    const line = new PIXI.Graphics()
      .beginFill(0x555555)
      .drawRect(0, 0, size * 9, 2)
      .endFill()

    line.position.set(0, (y + 1) * size * 3 - 1)
    grid.addChild(line)
  }
}

interface Grid extends PIXI.Graphics {
  data?: ILevelData
  activeCell?: Cell
  layout?(this: Grid, data: ILevelData): void
}


export default grid
