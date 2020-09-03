export default {
  width: 8,
  height: 9,

  crates: [
    {type: 'blue', x: 3, y: 4},
    {type: 'blue', x: 3, y: 5},
    {type: 'blue', x: 4, y: 2},
    {type: 'blue', x: 4, y: 3},
    {type: 'blue', x: 5, y: 4},
  ],

  frames: [
    {type: 'blue', x: 3, y: 4},
    {type: 'blue', x: 4, y: 2},
    {type: 'blue', x: 4, y: 3},
    {type: 'blue', x: 4, y: 4},
    {type: 'blue', x: 4, y: 5},
  ],

  player: {x: 5, y: 2},

  map: [
    0, 0, 0, 1, 1, 0, 0, 0,
    0, 0, 1, 2, 2, 1, 1, 0,
    0, 0, 1, 2, 2, 2, 2, 1,
    0, 1, 1, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 1, 0,
    0, 1, 1, 2, 2, 1, 0, 0,
    0, 0, 1, 2, 2, 1, 0, 0,
    0, 0, 0, 1, 1, 0, 0, 0
  ]
}