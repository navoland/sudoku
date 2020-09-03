export default {
  width: 7,
  height: 7,

  crates: [
    {type: 'red', x: 2, y: 3},
    {type: 'blue', x: 3, y: 2},
    {type: 'green', x: 4, y: 4},
  ],

  frames: [
    {type: 'red', x: 3, y: 3},
    {type: 'green', x: 3, y: 4},
    {type: 'blue', x: 2, y: 2},
  ],

  player: {x: 1, y: 3},

  map: [
    0, 1, 0, 0, 0, 1, 0,
    1, 2, 1, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 2, 1,
    0, 1, 0, 0, 0, 1, 0,
  ]
}
