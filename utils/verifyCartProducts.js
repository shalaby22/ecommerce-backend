//this function change the primary array if not given spread
const verifyCartProducts = function (cart) {
  const myCart = [...cart];
  let indexes = [];
  let x = 0;
  let edited = false;
  myCart.forEach((ele, i) => {
    if (!ele.product) {
      indexes.push(i);
      x++;
      edited = true;
    }
  });

  while (x) {
    myCart.splice(indexes.pop(), 1);
    x--;
  }

  return { myCart, edited };
};

module.exports = {verifyCartProducts};