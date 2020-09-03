export default {
  width: 6,
  height: 6,

  crates: [
    {type: 'blue', x: 3, y: 3},
    {type: 'red', x: 2, y: 2},
  ],

  frames: [
    {type: 'red', x: 4, y: 1},
    {type: 'blue', x: 4, y: 2},
  ],

  player: {x: 2, y: 3},

  map: [
    0, 0, 1, 1, 1, 1,
    1, 1, 1, 2, 2, 1,
    1, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 1,
    1, 1, 2, 2, 1, 1,
    0, 1, 1, 1, 1, 0,
  ]
}