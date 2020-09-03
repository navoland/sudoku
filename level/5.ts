export default {
  width: 7,
  height: 7,

  crates: [
    {type: 'red', x: 4, y: 2},
    {type: 'blue', x: 4, y: 4},
    {type: 'green', x: 2, y: 2},
    {type: 'blue', x: 2, y: 4},
  ],

  frames: [
    {type: 'blue', x: 5, y: 5},
    {type: 'red', x: 5, y: 1},
    {type: 'blue', x: 1, y: 5},
    {type: 'green', x: 1, y: 1}
  ],

  player: {x: 3, y: 1},

  map: [
    0, 1, 1, 1, 1, 1, 0,
    1, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 1,
    0, 1, 1, 1, 1, 1, 0,
  ]
}
