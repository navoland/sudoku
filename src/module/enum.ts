export enum Mode {
  Pen,
  Pencil
}

export enum Color {
  Gray = 0x555555,
  Blue = 0x2256b0,
  Black = 0x080808,
  /** 行了宫 cell */
  Connect = 0xf0ffff,
  /** 选中可编辑的 cell */
  Select = 0xc0f0f0,
  /** 选中数字相同的 cell */
  Same = 0xffffcb,
  Button = 0x488fdf
}

export enum Difficulty {
  Easy,
  Medium,
  Hard,
  Expert
}
