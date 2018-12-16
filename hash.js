exports.method = (s) => {
  let a = 0, c = 0, o;
  for (let h = s.length - 1; h >= 0; h--) {
    o = s.charCodeAt(h);
    a = (a << 6 & 268435455) + o + (o << 14);
    c = a & 266338304;
    a = c !== 0 ? a ^ c >> 21 : a;
  }
  return `${String(a).split("").reverse().join("")}hashedAF`;
};