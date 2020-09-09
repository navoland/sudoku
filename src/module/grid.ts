import {Color, Mode} from './enum'
import Cell from './Cell'
import {sound} from '.'

/** 选中的可输入格子 */
let mode = Mode.Pen
let selected: Cell
let cells: Cell[] = []
let rows: Cell[][] = []
let cols: Cell[][] = []
let regions: Cell[][] = []
let grid: Grid = new PIXI.Graphics()

grid.interactive = true
grid.on('pointerdown', (e: IEvent) => {
  if (!(e.target instanceof Cell)) return
  const cell = e.target
  const {coord} = cell
  unhighlight()
  highlight(coord.x, coord.y)
  alike(cell.value)
  if (!cell.selectable) return selected = null
  selected = cell
  cell.select()
})

grid.init = function(opt) {
  const {size} = opt
  this
    .clear()
    .lineStyle(4, Color.Black, 1, 1)
    .beginFill(Color.White)
    .drawRect(0, 0, size * 9, size * 9)
    .endFill()

  for (let i = 0; i < 81; i++) {
    const x = i % 9
    const y = i / 9 | 0
    const cell = new Cell({size, y, x})
    cell.interactive = true
    cells.push(cell)
    cols[x] ||= []
    rows[y] ||= []
    cols[x].push(cell)
    rows[y].push(cell)

    {
      const dx = x / 3 | 0
      const dy = y / 3 | 0
      const i = dy * 3 + dx
      regions[i] ||= []
      regions[i].push(cell)
    }

    this.addChild(cell)
  }

  // 横竖两条线
  for (let x = 0; x < 2; x++) {
    const line = new PIXI.Graphics()
      .beginFill(Color.Black)
      .drawRect(0, 0, 2, size * 9)
      .endFill()

    line.position.set((x + 1) * size * 3 - 1, 0)
    grid.addChild(line)
  }

  for (let y = 0; y < 2; y++) {
    const line = new PIXI.Graphics()
      .beginFill(Color.Black)
      .drawRect(0, 0, size * 9, 2)
      .endFill()

    line.position.set(0, (y + 1) * size * 3 - 1)
    grid.addChild(line)
  }
}

grid.refresh = function({data}) {
  for (let i = 0; i < 81; i++) {
    const num = +data[0][i]
    num && cells[i].preset(num)
  }
}

grid.on('input', (v: number) => {
  if (!selected) return
  mode === Mode.Pen ? selected.value = v : selected.note(v)
  sound.play(`${mode === Mode.Pen ? 'pen' : 'pencil'}.ogg`)
}).on('mode', (v: Mode) => {
  mode = v
  sound.play(`${mode === Mode.Pen ? 'pen' : 'pencil'}.ogg`)
})

/** 高亮相同数字的cell */
function alike(v: number) {
  if (!v) return
  for (const cell of cells) {
    if (cell.value === v) cell.highlight(Color.Same, true)
  }
}

/** 高亮关联的cell */
function highlight(x: number, y: number) {
  for (const cell of rows[y]) {
    cell.highlight()
  }
  for (const cell of cols[x]) {
    cell.highlight()
  }
  const i = (x / 3 | 0) + (y / 3 | 0) * 3
  for (const cell of regions[i]) {
    cell.highlight()
  }
}

function unhighlight() {
  for (const cell of cells) cell.unhighlight()
}

interface IOption {
  // 方格尺寸
  size: number
}

interface Grid extends PIXI.Graphics {
  init?(this: Grid, opt: IOption): void
  refresh?(this: Grid, opt: {data: ILevelData}): void
}

export default grid
