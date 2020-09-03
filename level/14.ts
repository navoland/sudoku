export default {
  width: 8,
  height: 8,

  crates: [
    {type: 'green', x: 4, y: 3},
    {type: 'green', x: 3, y: 4},
    {type: 'green', x: 4, y: 5},
    {type: 'green', x: 5, y: 5},
  ],

  frames: [
    {type: 'green', x: 3, y: 1},
    {type: 'green', x: 4, y: 1},
    {type: 'green', x: 4, y: 2},
    {type: 'green', x: 5, y: 3},
  ],

  player: {x: 3, y: 6},

  map: [
    0, 0, 1, 1, 1, 1, 0, 0,
    0, 0, 1, 2, 2, 1, 0, 0,
    0, 1, 1, 2, 2, 1, 1, 0,
    0, 1, 2, 2, 2, 2, 1, 0,
    1, 1, 2, 2, 2, 2, 1, 1,
    1, 2, 2, 1, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
  ]
}