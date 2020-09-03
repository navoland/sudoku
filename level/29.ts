export default {
  width: 7,
  height: 8,

  crates: [
    {type: 'blue', x: 2, y: 2},
    {type: 'blue', x: 2, y: 4},
    {type: 'blue', x: 4, y: 5},
  ],

  frames: [
    {type: 'blue', x: 2, y: 3},
    {type: 'blue', x: 2, y: 4},
    {type: 'blue', x: 2, y: 6},
  ],

  player: {x: 4, y: 3},

  map: [
    0, 1, 1, 1, 1, 1, 0,
    1, 1, 2, 2, 2, 1, 0,
    1, 2, 2, 1, 2, 1, 0,
    1, 2, 2, 2, 2, 1, 1,
    1, 2, 2, 2, 2, 2, 1,
    1, 1, 2, 1, 2, 2, 1,
    0, 1, 2, 2, 2, 1, 1,
    0, 1, 1, 1, 1, 1, 0,
  ]
}