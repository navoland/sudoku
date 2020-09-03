export default {
  width: 6,
  height: 9,

  crates: [
    {type: 'red', x: 2, y: 2},
    {type: 'red', x: 2, y: 3},
    {type: 'red', x: 2, y: 4},
    {type: 'red', x: 2, y: 5},
    {type: 'red', x: 2, y: 6},
  ],

  frames: [
    {type: 'red', x: 2, y: 3},
    {type: 'red', x: 2, y: 4},
    {type: 'red', x: 2, y: 5},
    {type: 'red', x: 2, y: 6},
    {type: 'red', x: 2, y: 7},
  ],

  player: {x: 3, y: 3},

  map: [
    1, 1, 1, 1, 1, 1,
    1, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 1,
    1, 1, 2, 2, 2, 1,
    1, 2, 2, 2, 1, 1,
    1, 2, 2, 2, 1, 0,
    1, 2, 2, 2, 1, 0,
    1, 2, 2, 2, 1, 0,
    1, 1, 1, 1, 1, 0,
  ]
}