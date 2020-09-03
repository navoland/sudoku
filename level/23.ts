export default {
  width: 8,
  height: 7,

  crates: [
    {type: 'red', x: 3, y: 2},
    {type: 'red', x: 4, y: 3},
    {type: 'red', x: 4, y: 4},
  ],

  frames: [
    {type: 'red', x: 1, y: 1},
    {type: 'red', x: 5, y: 1},
    {type: 'red', x: 5, y: 3},
  ],

  player: {x: 4, y: 1},

  map: [
    1, 1, 1, 1, 1, 1, 1, 0,
    1, 2, 2, 2, 2, 2, 1, 0,
    1, 2, 2, 2, 1, 2, 1, 1,
    1, 2, 1, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 1, 2, 1,
    1, 1, 1, 1, 2, 2, 2, 1,
    0, 0, 0, 1, 1, 1, 1, 1,
  ]
}