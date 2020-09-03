export default {
  width: 8,
  height: 8,

  crates: [
    {type: 'red', x: 2, y: 3},
    {type: 'red', x: 2, y: 4},
    {type: 'red', x: 3, y: 2},
    {type: 'red', x: 4, y: 3},
    {type: 'red', x: 4, y: 5},
  ],

  frames: [
    {type: 'red', x: 2, y: 4},
    {type: 'red', x: 4, y: 4},
    {type: 'red', x: 5, y: 4},
    {type: 'red', x: 6, y: 4},
    {type: 'red', x: 3, y: 6},
  ],

  player: {x: 1, y: 3},

  map: [
    0, 1, 1, 1, 0, 0, 0, 0,
    1, 2, 2, 2, 1, 0, 0, 0,
    1, 2, 1, 2, 1, 1, 1, 0,
    1, 2, 2, 2, 2, 2, 2, 1,
    0, 1, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 1, 1, 1, 0,
    0, 1, 1, 1, 0, 0, 0, 0
  ]
}