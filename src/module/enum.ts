export enum Mode {
  Pen,
  Pencil
}

export enum Color {
  Border = 0xccd2dd,
  Gray = 0x555555,
  Blue = 0x2256b0,
  Black = 0x080808,
  White = 0xffffff,
  /** 行了宫 cell */
  Connect = 0xf0ffff,
  /** 选中可编辑的 cell */
  Select = 0xc0f0f0,
  /** 选中数字相同的 cell */
  Same = 0xffffcb,
  Button = 0x488fdf
}

export enum Grade {
  Easy = '容易',
  Medium = '普通',
  Hard = '困难',
  Expert = '专家'
}
