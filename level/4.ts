export default {
  width: 7,
  height: 7,

  crates: [
    {type: 'blue', x: 3, y: 3},
    {type: 'red', x: 2, y: 3}
  ],

  frames: [
    {type: 'red', x: 4, y: 3},
    {type: 'blue', x: 2, y: 4}
  ],

  player: {x: 1, y: 3},

  map: [
    0, 1, 1, 1, 1, 1, 0,
    1, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 1,
    0, 1, 1, 1, 1, 1, 0,
  ]
}