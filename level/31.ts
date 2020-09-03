export default {
  width: 8,
  height: 8,

  crates: [
    {type: 'red', x: 5, y: 2},
    {type: 'red', x: 4, y: 3},
    {type: 'red', x: 3, y: 5},
  ],

  frames: [
    {type: 'red', x: 4, y: 1},
    {type: 'red', x: 4, y: 3},
    {type: 'red', x: 6, y: 2},
  ],

  player: {x: 5, y: 1},

  map: [
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 2, 2, 2, 2, 1, 1,
    0, 1, 2, 2, 2, 2, 2, 1,
    0, 1, 1, 1, 2, 1, 2, 1,
    1, 1, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 1, 1,
    1, 2, 2, 2, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 0, 0, 0,
  ]
}