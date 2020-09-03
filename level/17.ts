export default {
  width: 9,
  height: 9,

  crates: [
    {type: 'blue', x: 4, y: 4},
    {type: 'blue', x: 3, y: 3},
    {type: 'blue', x: 3, y: 4},
    {type: 'blue', x: 5, y: 3},
  ],

  frames: [
    {type: 'blue', x: 4, y: 4},
    {type: 'blue', x: 3, y: 4},
    {type: 'blue', x: 3, y: 3},
    {type: 'blue', x: 6, y: 4},
  ],

  player: {x: 5, y: 7},

  map: [
    0, 0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 1, 2, 2, 1, 0, 0, 0,
    0, 1, 1, 2, 2, 1, 1, 1, 0,
    1, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 1,
    0, 1, 1, 2, 2, 1, 2, 1, 0,
    0, 0, 1, 2, 2, 1, 2, 1, 0,
    0, 0, 0, 1, 2, 2, 2, 1, 0,
    0, 0, 0, 0, 1, 1, 1, 0, 0,
  ]
}