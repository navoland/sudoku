import {store} from '~/util'
import Cell from './Cell'
import {Color} from './enum'

const size = 80
const grid: Grid = new PIXI.Graphics()
  .beginFill(0xffffff, .5)
  .lineStyle(4, 0x555555, 1, 1)
  .drawRect(0, 0, size * 9, size * 9)
grid.interactive = true
grid.pivot.set(size * 4.5, 0)
grid.on('pointerdown', (e: IEvent) => {
  if (e.target.name !== 'cell') return
  const cell = e.target as Cell
  const {coord} = cell
  inactivate()
  highlight(coord.x, coord.y)
  alike(cell.num)
  if (cell.fixed) return grid.cell = null
  cell.select()
  grid.cell = cell
})

let cells: Cell[]
let rows: Cell[][]
let cols: Cell[][]
let boxes: Cell[][]

/** 高亮关联的cell */
function highlight(x: number, y: number) {
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

grid.check = function() {
  const {data} = this
  const answer = data[1]
  for (let i = 0, j = cells.length; i < j; i++) {
    const cell = cells[i]
    if (`${cell.num}` !== answer[i]) return false
  }
  return true
}

/** 高亮相同数字的cell */
function alike(v: number) {
  if (!v) return
  for (const item of cells) {
    if (item.num === v) item.activate(Color.Same, true)
  }
}

grid.layout = function(data: ILevelData, restore?: boolean) {
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
    cell.coord.x = x
    cell.coord.y = y

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

    if (!restore || !store.record.cells) continue

    // 继续上次
    const old = store.record.cells[i]
    if (old.fixed) continue
    if (old.num) cell.num = old.num
    else for (const x of old.items) x && cell.toggle(x)
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

grid.update = function(data: ILevelData) {
  for (let i = 0, j = cells.length; i < j; i++) {
    const cell = cells[i]
    const num = +data[0][i]
    cell.erase()
    num ? cell.fix(num) : cell.unfix()
  }
}

grid.save = function() {
  store.record.cells = cells.map(cell => {
    return {
      num: cell.num,
      fixed: cell.fixed,
      items: cell.items?.map(item => item.visible ? +item.text : 0)
    }
  })
}

interface Grid extends PIXI.Graphics {
  cell?: Cell
  data?: ILevelData
  save?(this: Grid): void
  check?(this: Grid): boolean
  alike?(this: Grid, v: number): void
  update?(this: Grid, data: ILevelData): void
  layout?(this: Grid, data: ILevelData, restore?: boolean): void
}


export default grid
