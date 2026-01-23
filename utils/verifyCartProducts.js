//this function change the primary array if not given spread
const verifyCartProducts = function (cart) {
  let indexes = [];
  let x = 0;
  let edited = false;
  cart.forEach((ele, i) => {
    if (!ele.product) {
      indexes.push(i);
      x++;
      edited = true;
    }
  });
  let removed = cart;
  while (x) {
    removed.splice(indexes.pop(), 1);
    x--;
  }
  return { removed, edited };
};

module.exports = {verifyCartProducts};