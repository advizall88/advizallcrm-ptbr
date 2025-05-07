import {
  D,
  O,
  R,
  ln as ln2,
  z as z2
} from "./chunk-XGAQ76QW.js";
import {
  $t,
  E,
  Fr,
  H,
  Jr,
  Ot,
  T,
  V,
  Ye,
  Yr,
  _n,
  _t,
  animated,
  area_default,
  fn,
  gn,
  j,
  k,
  line_default,
  ln,
  nn,
  pn,
  pr,
  qr,
  require_toString,
  rn,
  useSpring,
  w,
  xt,
  yn,
  yt,
  z
} from "./chunk-EFKILSXK.js";
import {
  require_jsx_runtime
} from "./chunk-X3VLT5EQ.js";
import "./chunk-PV7ZWGTI.js";
import {
  require_react
} from "./chunk-2CLD7BNN.js";
import {
  __commonJS,
  __toESM
} from "./chunk-WOOG5QLI.js";

// node_modules/lodash/uniqueId.js
var require_uniqueId = __commonJS({
  "node_modules/lodash/uniqueId.js"(exports, module) {
    var toString = require_toString();
    var idCounter = 0;
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }
    module.exports = uniqueId;
  }
});

// node_modules/@nivo/line/dist/nivo-line.mjs
var import_react2 = __toESM(require_react(), 1);
var import_uniqueId = __toESM(require_uniqueId(), 1);
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);

// node_modules/@nivo/voronoi/dist/nivo-voronoi.mjs
var import_react = __toESM(require_react(), 1);

// node_modules/robust-predicates/esm/util.js
var epsilon = 11102230246251565e-32;
var splitter = 134217729;
var resulterrbound = (3 + 8 * epsilon) * epsilon;
function sum(elen, e3, flen, f, h) {
  let Q, Qnew, hh, bvirt;
  let enow = e3[0];
  let fnow = f[0];
  let eindex = 0;
  let findex = 0;
  if (fnow > enow === fnow > -enow) {
    Q = enow;
    enow = e3[++eindex];
  } else {
    Q = fnow;
    fnow = f[++findex];
  }
  let hindex = 0;
  if (eindex < elen && findex < flen) {
    if (fnow > enow === fnow > -enow) {
      Qnew = enow + Q;
      hh = Q - (Qnew - enow);
      enow = e3[++eindex];
    } else {
      Qnew = fnow + Q;
      hh = Q - (Qnew - fnow);
      fnow = f[++findex];
    }
    Q = Qnew;
    if (hh !== 0) {
      h[hindex++] = hh;
    }
    while (eindex < elen && findex < flen) {
      if (fnow > enow === fnow > -enow) {
        Qnew = Q + enow;
        bvirt = Qnew - Q;
        hh = Q - (Qnew - bvirt) + (enow - bvirt);
        enow = e3[++eindex];
      } else {
        Qnew = Q + fnow;
        bvirt = Qnew - Q;
        hh = Q - (Qnew - bvirt) + (fnow - bvirt);
        fnow = f[++findex];
      }
      Q = Qnew;
      if (hh !== 0) {
        h[hindex++] = hh;
      }
    }
  }
  while (eindex < elen) {
    Qnew = Q + enow;
    bvirt = Qnew - Q;
    hh = Q - (Qnew - bvirt) + (enow - bvirt);
    enow = e3[++eindex];
    Q = Qnew;
    if (hh !== 0) {
      h[hindex++] = hh;
    }
  }
  while (findex < flen) {
    Qnew = Q + fnow;
    bvirt = Qnew - Q;
    hh = Q - (Qnew - bvirt) + (fnow - bvirt);
    fnow = f[++findex];
    Q = Qnew;
    if (hh !== 0) {
      h[hindex++] = hh;
    }
  }
  if (Q !== 0 || hindex === 0) {
    h[hindex++] = Q;
  }
  return hindex;
}
function estimate(elen, e3) {
  let Q = e3[0];
  for (let i3 = 1; i3 < elen; i3++) Q += e3[i3];
  return Q;
}
function vec(n3) {
  return new Float64Array(n3);
}

// node_modules/robust-predicates/esm/orient2d.js
var ccwerrboundA = (3 + 16 * epsilon) * epsilon;
var ccwerrboundB = (2 + 12 * epsilon) * epsilon;
var ccwerrboundC = (9 + 64 * epsilon) * epsilon * epsilon;
var B = vec(4);
var C1 = vec(8);
var C2 = vec(12);
var D2 = vec(16);
var u = vec(4);
function orient2dadapt(ax, ay, bx, by, cx, cy, detsum) {
  let acxtail, acytail, bcxtail, bcytail;
  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u32;
  const acx = ax - cx;
  const bcx = bx - cx;
  const acy = ay - cy;
  const bcy = by - cy;
  s1 = acx * bcy;
  c = splitter * acx;
  ahi = c - (c - acx);
  alo = acx - ahi;
  c = splitter * bcy;
  bhi = c - (c - bcy);
  blo = bcy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acy * bcx;
  c = splitter * acy;
  ahi = c - (c - acy);
  alo = acy - ahi;
  c = splitter * bcx;
  bhi = c - (c - bcx);
  blo = bcx - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  B[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  B[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u32 = _j + _i;
  bvirt = u32 - _j;
  B[2] = _j - (u32 - bvirt) + (_i - bvirt);
  B[3] = u32;
  let det = estimate(4, B);
  let errbound = ccwerrboundB * detsum;
  if (det >= errbound || -det >= errbound) {
    return det;
  }
  bvirt = ax - acx;
  acxtail = ax - (acx + bvirt) + (bvirt - cx);
  bvirt = bx - bcx;
  bcxtail = bx - (bcx + bvirt) + (bvirt - cx);
  bvirt = ay - acy;
  acytail = ay - (acy + bvirt) + (bvirt - cy);
  bvirt = by - bcy;
  bcytail = by - (bcy + bvirt) + (bvirt - cy);
  if (acxtail === 0 && acytail === 0 && bcxtail === 0 && bcytail === 0) {
    return det;
  }
  errbound = ccwerrboundC * detsum + resulterrbound * Math.abs(det);
  det += acx * bcytail + bcy * acxtail - (acy * bcxtail + bcx * acytail);
  if (det >= errbound || -det >= errbound) return det;
  s1 = acxtail * bcy;
  c = splitter * acxtail;
  ahi = c - (c - acxtail);
  alo = acxtail - ahi;
  c = splitter * bcy;
  bhi = c - (c - bcy);
  blo = bcy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acytail * bcx;
  c = splitter * acytail;
  ahi = c - (c - acytail);
  alo = acytail - ahi;
  c = splitter * bcx;
  bhi = c - (c - bcx);
  blo = bcx - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  u[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  u[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u32 = _j + _i;
  bvirt = u32 - _j;
  u[2] = _j - (u32 - bvirt) + (_i - bvirt);
  u[3] = u32;
  const C1len = sum(4, B, 4, u, C1);
  s1 = acx * bcytail;
  c = splitter * acx;
  ahi = c - (c - acx);
  alo = acx - ahi;
  c = splitter * bcytail;
  bhi = c - (c - bcytail);
  blo = bcytail - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acy * bcxtail;
  c = splitter * acy;
  ahi = c - (c - acy);
  alo = acy - ahi;
  c = splitter * bcxtail;
  bhi = c - (c - bcxtail);
  blo = bcxtail - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  u[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  u[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u32 = _j + _i;
  bvirt = u32 - _j;
  u[2] = _j - (u32 - bvirt) + (_i - bvirt);
  u[3] = u32;
  const C2len = sum(C1len, C1, 4, u, C2);
  s1 = acxtail * bcytail;
  c = splitter * acxtail;
  ahi = c - (c - acxtail);
  alo = acxtail - ahi;
  c = splitter * bcytail;
  bhi = c - (c - bcytail);
  blo = bcytail - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = acytail * bcxtail;
  c = splitter * acytail;
  ahi = c - (c - acytail);
  alo = acytail - ahi;
  c = splitter * bcxtail;
  bhi = c - (c - bcxtail);
  blo = bcxtail - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  u[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  u[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u32 = _j + _i;
  bvirt = u32 - _j;
  u[2] = _j - (u32 - bvirt) + (_i - bvirt);
  u[3] = u32;
  const Dlen = sum(C2len, C2, 4, u, D2);
  return D2[Dlen - 1];
}
function orient2d(ax, ay, bx, by, cx, cy) {
  const detleft = (ay - cy) * (bx - cx);
  const detright = (ax - cx) * (by - cy);
  const det = detleft - detright;
  const detsum = Math.abs(detleft + detright);
  if (Math.abs(det) >= ccwerrboundA * detsum) return det;
  return -orient2dadapt(ax, ay, bx, by, cx, cy, detsum);
}

// node_modules/robust-predicates/esm/orient3d.js
var o3derrboundA = (7 + 56 * epsilon) * epsilon;
var o3derrboundB = (3 + 28 * epsilon) * epsilon;
var o3derrboundC = (26 + 288 * epsilon) * epsilon * epsilon;
var bc = vec(4);
var ca = vec(4);
var ab = vec(4);
var at_b = vec(4);
var at_c = vec(4);
var bt_c = vec(4);
var bt_a = vec(4);
var ct_a = vec(4);
var ct_b = vec(4);
var bct = vec(8);
var cat = vec(8);
var abt = vec(8);
var u2 = vec(4);
var _8 = vec(8);
var _8b = vec(8);
var _16 = vec(8);
var _12 = vec(12);
var fin = vec(192);
var fin2 = vec(192);

// node_modules/robust-predicates/esm/incircle.js
var iccerrboundA = (10 + 96 * epsilon) * epsilon;
var iccerrboundB = (4 + 48 * epsilon) * epsilon;
var iccerrboundC = (44 + 576 * epsilon) * epsilon * epsilon;
var bc2 = vec(4);
var ca2 = vec(4);
var ab2 = vec(4);
var aa = vec(4);
var bb = vec(4);
var cc = vec(4);
var u3 = vec(4);
var v = vec(4);
var axtbc = vec(8);
var aytbc = vec(8);
var bxtca = vec(8);
var bytca = vec(8);
var cxtab = vec(8);
var cytab = vec(8);
var abt2 = vec(8);
var bct2 = vec(8);
var cat2 = vec(8);
var abtt = vec(4);
var bctt = vec(4);
var catt = vec(4);
var _82 = vec(8);
var _162 = vec(16);
var _16b = vec(16);
var _16c = vec(16);
var _32 = vec(32);
var _32b = vec(32);
var _48 = vec(48);
var _64 = vec(64);
var fin3 = vec(1152);
var fin22 = vec(1152);

// node_modules/robust-predicates/esm/insphere.js
var isperrboundA = (16 + 224 * epsilon) * epsilon;
var isperrboundB = (5 + 72 * epsilon) * epsilon;
var isperrboundC = (71 + 1408 * epsilon) * epsilon * epsilon;
var ab3 = vec(4);
var bc3 = vec(4);
var cd = vec(4);
var de = vec(4);
var ea = vec(4);
var ac = vec(4);
var bd = vec(4);
var ce = vec(4);
var da = vec(4);
var eb = vec(4);
var abc = vec(24);
var bcd = vec(24);
var cde = vec(24);
var dea = vec(24);
var eab = vec(24);
var abd = vec(24);
var bce = vec(24);
var cda = vec(24);
var deb = vec(24);
var eac = vec(24);
var adet = vec(1152);
var bdet = vec(1152);
var cdet = vec(1152);
var ddet = vec(1152);
var edet = vec(1152);
var abdet = vec(2304);
var cddet = vec(2304);
var cdedet = vec(3456);
var deter = vec(5760);
var _83 = vec(8);
var _8b2 = vec(8);
var _8c = vec(8);
var _163 = vec(16);
var _24 = vec(24);
var _482 = vec(48);
var _48b = vec(48);
var _96 = vec(96);
var _192 = vec(192);
var _384x = vec(384);
var _384y = vec(384);
var _384z = vec(384);
var _768 = vec(768);
var xdet = vec(96);
var ydet = vec(96);
var zdet = vec(96);
var fin4 = vec(1152);

// node_modules/delaunator/index.js
var EPSILON = Math.pow(2, -52);
var EDGE_STACK = new Uint32Array(512);
var Delaunator = class _Delaunator {
  static from(points, getX = defaultGetX, getY = defaultGetY) {
    const n3 = points.length;
    const coords = new Float64Array(n3 * 2);
    for (let i3 = 0; i3 < n3; i3++) {
      const p = points[i3];
      coords[2 * i3] = getX(p);
      coords[2 * i3 + 1] = getY(p);
    }
    return new _Delaunator(coords);
  }
  constructor(coords) {
    const n3 = coords.length >> 1;
    if (n3 > 0 && typeof coords[0] !== "number") throw new Error("Expected coords to contain numbers.");
    this.coords = coords;
    const maxTriangles = Math.max(2 * n3 - 5, 0);
    this._triangles = new Uint32Array(maxTriangles * 3);
    this._halfedges = new Int32Array(maxTriangles * 3);
    this._hashSize = Math.ceil(Math.sqrt(n3));
    this._hullPrev = new Uint32Array(n3);
    this._hullNext = new Uint32Array(n3);
    this._hullTri = new Uint32Array(n3);
    this._hullHash = new Int32Array(this._hashSize);
    this._ids = new Uint32Array(n3);
    this._dists = new Float64Array(n3);
    this.update();
  }
  update() {
    const { coords, _hullPrev: hullPrev, _hullNext: hullNext, _hullTri: hullTri, _hullHash: hullHash } = this;
    const n3 = coords.length >> 1;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i3 = 0; i3 < n3; i3++) {
      const x = coords[2 * i3];
      const y2 = coords[2 * i3 + 1];
      if (x < minX) minX = x;
      if (y2 < minY) minY = y2;
      if (x > maxX) maxX = x;
      if (y2 > maxY) maxY = y2;
      this._ids[i3] = i3;
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    let i0, i1, i22;
    for (let i3 = 0, minDist = Infinity; i3 < n3; i3++) {
      const d = dist(cx, cy, coords[2 * i3], coords[2 * i3 + 1]);
      if (d < minDist) {
        i0 = i3;
        minDist = d;
      }
    }
    const i0x = coords[2 * i0];
    const i0y = coords[2 * i0 + 1];
    for (let i3 = 0, minDist = Infinity; i3 < n3; i3++) {
      if (i3 === i0) continue;
      const d = dist(i0x, i0y, coords[2 * i3], coords[2 * i3 + 1]);
      if (d < minDist && d > 0) {
        i1 = i3;
        minDist = d;
      }
    }
    let i1x = coords[2 * i1];
    let i1y = coords[2 * i1 + 1];
    let minRadius = Infinity;
    for (let i3 = 0; i3 < n3; i3++) {
      if (i3 === i0 || i3 === i1) continue;
      const r3 = circumradius(i0x, i0y, i1x, i1y, coords[2 * i3], coords[2 * i3 + 1]);
      if (r3 < minRadius) {
        i22 = i3;
        minRadius = r3;
      }
    }
    let i2x = coords[2 * i22];
    let i2y = coords[2 * i22 + 1];
    if (minRadius === Infinity) {
      for (let i3 = 0; i3 < n3; i3++) {
        this._dists[i3] = coords[2 * i3] - coords[0] || coords[2 * i3 + 1] - coords[1];
      }
      quicksort(this._ids, this._dists, 0, n3 - 1);
      const hull = new Uint32Array(n3);
      let j3 = 0;
      for (let i3 = 0, d0 = -Infinity; i3 < n3; i3++) {
        const id = this._ids[i3];
        const d = this._dists[id];
        if (d > d0) {
          hull[j3++] = id;
          d0 = d;
        }
      }
      this.hull = hull.subarray(0, j3);
      this.triangles = new Uint32Array(0);
      this.halfedges = new Uint32Array(0);
      return;
    }
    if (orient2d(i0x, i0y, i1x, i1y, i2x, i2y) < 0) {
      const i3 = i1;
      const x = i1x;
      const y2 = i1y;
      i1 = i22;
      i1x = i2x;
      i1y = i2y;
      i22 = i3;
      i2x = x;
      i2y = y2;
    }
    const center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
    this._cx = center.x;
    this._cy = center.y;
    for (let i3 = 0; i3 < n3; i3++) {
      this._dists[i3] = dist(coords[2 * i3], coords[2 * i3 + 1], center.x, center.y);
    }
    quicksort(this._ids, this._dists, 0, n3 - 1);
    this._hullStart = i0;
    let hullSize = 3;
    hullNext[i0] = hullPrev[i22] = i1;
    hullNext[i1] = hullPrev[i0] = i22;
    hullNext[i22] = hullPrev[i1] = i0;
    hullTri[i0] = 0;
    hullTri[i1] = 1;
    hullTri[i22] = 2;
    hullHash.fill(-1);
    hullHash[this._hashKey(i0x, i0y)] = i0;
    hullHash[this._hashKey(i1x, i1y)] = i1;
    hullHash[this._hashKey(i2x, i2y)] = i22;
    this.trianglesLen = 0;
    this._addTriangle(i0, i1, i22, -1, -1, -1);
    for (let k2 = 0, xp, yp; k2 < this._ids.length; k2++) {
      const i3 = this._ids[k2];
      const x = coords[2 * i3];
      const y2 = coords[2 * i3 + 1];
      if (k2 > 0 && Math.abs(x - xp) <= EPSILON && Math.abs(y2 - yp) <= EPSILON) continue;
      xp = x;
      yp = y2;
      if (i3 === i0 || i3 === i1 || i3 === i22) continue;
      let start = 0;
      for (let j3 = 0, key = this._hashKey(x, y2); j3 < this._hashSize; j3++) {
        start = hullHash[(key + j3) % this._hashSize];
        if (start !== -1 && start !== hullNext[start]) break;
      }
      start = hullPrev[start];
      let e3 = start, q;
      while (q = hullNext[e3], orient2d(x, y2, coords[2 * e3], coords[2 * e3 + 1], coords[2 * q], coords[2 * q + 1]) >= 0) {
        e3 = q;
        if (e3 === start) {
          e3 = -1;
          break;
        }
      }
      if (e3 === -1) continue;
      let t3 = this._addTriangle(e3, i3, hullNext[e3], -1, -1, hullTri[e3]);
      hullTri[i3] = this._legalize(t3 + 2);
      hullTri[e3] = t3;
      hullSize++;
      let n4 = hullNext[e3];
      while (q = hullNext[n4], orient2d(x, y2, coords[2 * n4], coords[2 * n4 + 1], coords[2 * q], coords[2 * q + 1]) < 0) {
        t3 = this._addTriangle(n4, i3, q, hullTri[i3], -1, hullTri[n4]);
        hullTri[i3] = this._legalize(t3 + 2);
        hullNext[n4] = n4;
        hullSize--;
        n4 = q;
      }
      if (e3 === start) {
        while (q = hullPrev[e3], orient2d(x, y2, coords[2 * q], coords[2 * q + 1], coords[2 * e3], coords[2 * e3 + 1]) < 0) {
          t3 = this._addTriangle(q, i3, e3, -1, hullTri[e3], hullTri[q]);
          this._legalize(t3 + 2);
          hullTri[q] = t3;
          hullNext[e3] = e3;
          hullSize--;
          e3 = q;
        }
      }
      this._hullStart = hullPrev[i3] = e3;
      hullNext[e3] = hullPrev[n4] = i3;
      hullNext[i3] = n4;
      hullHash[this._hashKey(x, y2)] = i3;
      hullHash[this._hashKey(coords[2 * e3], coords[2 * e3 + 1])] = e3;
    }
    this.hull = new Uint32Array(hullSize);
    for (let i3 = 0, e3 = this._hullStart; i3 < hullSize; i3++) {
      this.hull[i3] = e3;
      e3 = hullNext[e3];
    }
    this.triangles = this._triangles.subarray(0, this.trianglesLen);
    this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  _hashKey(x, y2) {
    return Math.floor(pseudoAngle(x - this._cx, y2 - this._cy) * this._hashSize) % this._hashSize;
  }
  _legalize(a2) {
    const { _triangles: triangles, _halfedges: halfedges, coords } = this;
    let i3 = 0;
    let ar = 0;
    while (true) {
      const b2 = halfedges[a2];
      const a0 = a2 - a2 % 3;
      ar = a0 + (a2 + 2) % 3;
      if (b2 === -1) {
        if (i3 === 0) break;
        a2 = EDGE_STACK[--i3];
        continue;
      }
      const b0 = b2 - b2 % 3;
      const al = a0 + (a2 + 1) % 3;
      const bl = b0 + (b2 + 2) % 3;
      const p0 = triangles[ar];
      const pr2 = triangles[a2];
      const pl = triangles[al];
      const p1 = triangles[bl];
      const illegal = inCircle(
        coords[2 * p0],
        coords[2 * p0 + 1],
        coords[2 * pr2],
        coords[2 * pr2 + 1],
        coords[2 * pl],
        coords[2 * pl + 1],
        coords[2 * p1],
        coords[2 * p1 + 1]
      );
      if (illegal) {
        triangles[a2] = p1;
        triangles[b2] = p0;
        const hbl = halfedges[bl];
        if (hbl === -1) {
          let e3 = this._hullStart;
          do {
            if (this._hullTri[e3] === bl) {
              this._hullTri[e3] = a2;
              break;
            }
            e3 = this._hullPrev[e3];
          } while (e3 !== this._hullStart);
        }
        this._link(a2, hbl);
        this._link(b2, halfedges[ar]);
        this._link(ar, bl);
        const br = b0 + (b2 + 1) % 3;
        if (i3 < EDGE_STACK.length) {
          EDGE_STACK[i3++] = br;
        }
      } else {
        if (i3 === 0) break;
        a2 = EDGE_STACK[--i3];
      }
    }
    return ar;
  }
  _link(a2, b2) {
    this._halfedges[a2] = b2;
    if (b2 !== -1) this._halfedges[b2] = a2;
  }
  // add a new triangle given vertex indices and adjacent half-edge ids
  _addTriangle(i0, i1, i22, a2, b2, c) {
    const t3 = this.trianglesLen;
    this._triangles[t3] = i0;
    this._triangles[t3 + 1] = i1;
    this._triangles[t3 + 2] = i22;
    this._link(t3, a2);
    this._link(t3 + 1, b2);
    this._link(t3 + 2, c);
    this.trianglesLen += 3;
    return t3;
  }
};
function pseudoAngle(dx, dy) {
  const p = dx / (Math.abs(dx) + Math.abs(dy));
  return (dy > 0 ? 3 - p : 1 + p) / 4;
}
function dist(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}
function inCircle(ax, ay, bx, by, cx, cy, px, py) {
  const dx = ax - px;
  const dy = ay - py;
  const ex = bx - px;
  const ey = by - py;
  const fx = cx - px;
  const fy = cy - py;
  const ap = dx * dx + dy * dy;
  const bp = ex * ex + ey * ey;
  const cp = fx * fx + fy * fy;
  return dx * (ey * cp - bp * fy) - dy * (ex * cp - bp * fx) + ap * (ex * fy - ey * fx) < 0;
}
function circumradius(ax, ay, bx, by, cx, cy) {
  const dx = bx - ax;
  const dy = by - ay;
  const ex = cx - ax;
  const ey = cy - ay;
  const bl = dx * dx + dy * dy;
  const cl = ex * ex + ey * ey;
  const d = 0.5 / (dx * ey - dy * ex);
  const x = (ey * bl - dy * cl) * d;
  const y2 = (dx * cl - ex * bl) * d;
  return x * x + y2 * y2;
}
function circumcenter(ax, ay, bx, by, cx, cy) {
  const dx = bx - ax;
  const dy = by - ay;
  const ex = cx - ax;
  const ey = cy - ay;
  const bl = dx * dx + dy * dy;
  const cl = ex * ex + ey * ey;
  const d = 0.5 / (dx * ey - dy * ex);
  const x = ax + (ey * bl - dy * cl) * d;
  const y2 = ay + (dx * cl - ex * bl) * d;
  return { x, y: y2 };
}
function quicksort(ids, dists, left, right) {
  if (right - left <= 20) {
    for (let i3 = left + 1; i3 <= right; i3++) {
      const temp = ids[i3];
      const tempDist = dists[temp];
      let j3 = i3 - 1;
      while (j3 >= left && dists[ids[j3]] > tempDist) ids[j3 + 1] = ids[j3--];
      ids[j3 + 1] = temp;
    }
  } else {
    const median = left + right >> 1;
    let i3 = left + 1;
    let j3 = right;
    swap(ids, median, i3);
    if (dists[ids[left]] > dists[ids[right]]) swap(ids, left, right);
    if (dists[ids[i3]] > dists[ids[right]]) swap(ids, i3, right);
    if (dists[ids[left]] > dists[ids[i3]]) swap(ids, left, i3);
    const temp = ids[i3];
    const tempDist = dists[temp];
    while (true) {
      do
        i3++;
      while (dists[ids[i3]] < tempDist);
      do
        j3--;
      while (dists[ids[j3]] > tempDist);
      if (j3 < i3) break;
      swap(ids, i3, j3);
    }
    ids[left + 1] = ids[j3];
    ids[j3] = temp;
    if (right - i3 + 1 >= j3 - left) {
      quicksort(ids, dists, i3, right);
      quicksort(ids, dists, left, j3 - 1);
    } else {
      quicksort(ids, dists, left, j3 - 1);
      quicksort(ids, dists, i3, right);
    }
  }
}
function swap(arr, i3, j3) {
  const tmp = arr[i3];
  arr[i3] = arr[j3];
  arr[j3] = tmp;
}
function defaultGetX(p) {
  return p[0];
}
function defaultGetY(p) {
  return p[1];
}

// node_modules/d3-delaunay/src/path.js
var epsilon2 = 1e-6;
var Path = class {
  constructor() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null;
    this._ = "";
  }
  moveTo(x, y2) {
    this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y2}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  }
  lineTo(x, y2) {
    this._ += `L${this._x1 = +x},${this._y1 = +y2}`;
  }
  arc(x, y2, r3) {
    x = +x, y2 = +y2, r3 = +r3;
    const x0 = x + r3;
    const y0 = y2;
    if (r3 < 0) throw new Error("negative radius");
    if (this._x1 === null) this._ += `M${x0},${y0}`;
    else if (Math.abs(this._x1 - x0) > epsilon2 || Math.abs(this._y1 - y0) > epsilon2) this._ += "L" + x0 + "," + y0;
    if (!r3) return;
    this._ += `A${r3},${r3},0,1,1,${x - r3},${y2}A${r3},${r3},0,1,1,${this._x1 = x0},${this._y1 = y0}`;
  }
  rect(x, y2, w3, h) {
    this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y2}h${+w3}v${+h}h${-w3}Z`;
  }
  value() {
    return this._ || null;
  }
};

// node_modules/d3-delaunay/src/polygon.js
var Polygon = class {
  constructor() {
    this._ = [];
  }
  moveTo(x, y2) {
    this._.push([x, y2]);
  }
  closePath() {
    this._.push(this._[0].slice());
  }
  lineTo(x, y2) {
    this._.push([x, y2]);
  }
  value() {
    return this._.length ? this._ : null;
  }
};

// node_modules/d3-delaunay/src/voronoi.js
var Voronoi = class {
  constructor(delaunay, [xmin, ymin, xmax, ymax] = [0, 0, 960, 500]) {
    if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin))) throw new Error("invalid bounds");
    this.delaunay = delaunay;
    this._circumcenters = new Float64Array(delaunay.points.length * 2);
    this.vectors = new Float64Array(delaunay.points.length * 2);
    this.xmax = xmax, this.xmin = xmin;
    this.ymax = ymax, this.ymin = ymin;
    this._init();
  }
  update() {
    this.delaunay.update();
    this._init();
    return this;
  }
  _init() {
    const { delaunay: { points, hull, triangles }, vectors } = this;
    let bx, by;
    const circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);
    for (let i3 = 0, j3 = 0, n3 = triangles.length, x, y2; i3 < n3; i3 += 3, j3 += 2) {
      const t1 = triangles[i3] * 2;
      const t22 = triangles[i3 + 1] * 2;
      const t3 = triangles[i3 + 2] * 2;
      const x12 = points[t1];
      const y12 = points[t1 + 1];
      const x2 = points[t22];
      const y22 = points[t22 + 1];
      const x3 = points[t3];
      const y3 = points[t3 + 1];
      const dx = x2 - x12;
      const dy = y22 - y12;
      const ex = x3 - x12;
      const ey = y3 - y12;
      const ab4 = (dx * ey - dy * ex) * 2;
      if (Math.abs(ab4) < 1e-9) {
        if (bx === void 0) {
          bx = by = 0;
          for (const i4 of hull) bx += points[i4 * 2], by += points[i4 * 2 + 1];
          bx /= hull.length, by /= hull.length;
        }
        const a2 = 1e9 * Math.sign((bx - x12) * ey - (by - y12) * ex);
        x = (x12 + x3) / 2 - a2 * ey;
        y2 = (y12 + y3) / 2 + a2 * ex;
      } else {
        const d = 1 / ab4;
        const bl = dx * dx + dy * dy;
        const cl = ex * ex + ey * ey;
        x = x12 + (ey * bl - dy * cl) * d;
        y2 = y12 + (dx * cl - ex * bl) * d;
      }
      circumcenters[j3] = x;
      circumcenters[j3 + 1] = y2;
    }
    let h = hull[hull.length - 1];
    let p0, p1 = h * 4;
    let x0, x1 = points[2 * h];
    let y0, y1 = points[2 * h + 1];
    vectors.fill(0);
    for (let i3 = 0; i3 < hull.length; ++i3) {
      h = hull[i3];
      p0 = p1, x0 = x1, y0 = y1;
      p1 = h * 4, x1 = points[2 * h], y1 = points[2 * h + 1];
      vectors[p0 + 2] = vectors[p1] = y0 - y1;
      vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
    }
  }
  render(context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { delaunay: { halfedges, inedges, hull }, circumcenters, vectors } = this;
    if (hull.length <= 1) return null;
    for (let i3 = 0, n3 = halfedges.length; i3 < n3; ++i3) {
      const j3 = halfedges[i3];
      if (j3 < i3) continue;
      const ti = Math.floor(i3 / 3) * 2;
      const tj = Math.floor(j3 / 3) * 2;
      const xi = circumcenters[ti];
      const yi = circumcenters[ti + 1];
      const xj = circumcenters[tj];
      const yj = circumcenters[tj + 1];
      this._renderSegment(xi, yi, xj, yj, context);
    }
    let h0, h1 = hull[hull.length - 1];
    for (let i3 = 0; i3 < hull.length; ++i3) {
      h0 = h1, h1 = hull[i3];
      const t3 = Math.floor(inedges[h1] / 3) * 2;
      const x = circumcenters[t3];
      const y2 = circumcenters[t3 + 1];
      const v2 = h0 * 4;
      const p = this._project(x, y2, vectors[v2 + 2], vectors[v2 + 3]);
      if (p) this._renderSegment(x, y2, p[0], p[1], context);
    }
    return buffer && buffer.value();
  }
  renderBounds(context) {
    const buffer = context == null ? context = new Path() : void 0;
    context.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
    return buffer && buffer.value();
  }
  renderCell(i3, context) {
    const buffer = context == null ? context = new Path() : void 0;
    const points = this._clip(i3);
    if (points === null || !points.length) return;
    context.moveTo(points[0], points[1]);
    let n3 = points.length;
    while (points[0] === points[n3 - 2] && points[1] === points[n3 - 1] && n3 > 1) n3 -= 2;
    for (let i4 = 2; i4 < n3; i4 += 2) {
      if (points[i4] !== points[i4 - 2] || points[i4 + 1] !== points[i4 - 1])
        context.lineTo(points[i4], points[i4 + 1]);
    }
    context.closePath();
    return buffer && buffer.value();
  }
  *cellPolygons() {
    const { delaunay: { points } } = this;
    for (let i3 = 0, n3 = points.length / 2; i3 < n3; ++i3) {
      const cell = this.cellPolygon(i3);
      if (cell) cell.index = i3, yield cell;
    }
  }
  cellPolygon(i3) {
    const polygon = new Polygon();
    this.renderCell(i3, polygon);
    return polygon.value();
  }
  _renderSegment(x0, y0, x1, y1, context) {
    let S2;
    const c0 = this._regioncode(x0, y0);
    const c1 = this._regioncode(x1, y1);
    if (c0 === 0 && c1 === 0) {
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
    } else if (S2 = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
      context.moveTo(S2[0], S2[1]);
      context.lineTo(S2[2], S2[3]);
    }
  }
  contains(i3, x, y2) {
    if ((x = +x, x !== x) || (y2 = +y2, y2 !== y2)) return false;
    return this.delaunay._step(i3, x, y2) === i3;
  }
  *neighbors(i3) {
    const ci = this._clip(i3);
    if (ci) for (const j3 of this.delaunay.neighbors(i3)) {
      const cj = this._clip(j3);
      if (cj) loop: for (let ai = 0, li = ci.length; ai < li; ai += 2) {
        for (let aj = 0, lj = cj.length; aj < lj; aj += 2) {
          if (ci[ai] === cj[aj] && ci[ai + 1] === cj[aj + 1] && ci[(ai + 2) % li] === cj[(aj + lj - 2) % lj] && ci[(ai + 3) % li] === cj[(aj + lj - 1) % lj]) {
            yield j3;
            break loop;
          }
        }
      }
    }
  }
  _cell(i3) {
    const { circumcenters, delaunay: { inedges, halfedges, triangles } } = this;
    const e0 = inedges[i3];
    if (e0 === -1) return null;
    const points = [];
    let e3 = e0;
    do {
      const t3 = Math.floor(e3 / 3);
      points.push(circumcenters[t3 * 2], circumcenters[t3 * 2 + 1]);
      e3 = e3 % 3 === 2 ? e3 - 2 : e3 + 1;
      if (triangles[e3] !== i3) break;
      e3 = halfedges[e3];
    } while (e3 !== e0 && e3 !== -1);
    return points;
  }
  _clip(i3) {
    if (i3 === 0 && this.delaunay.hull.length === 1) {
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    }
    const points = this._cell(i3);
    if (points === null) return null;
    const { vectors: V2 } = this;
    const v2 = i3 * 4;
    return this._simplify(V2[v2] || V2[v2 + 1] ? this._clipInfinite(i3, points, V2[v2], V2[v2 + 1], V2[v2 + 2], V2[v2 + 3]) : this._clipFinite(i3, points));
  }
  _clipFinite(i3, points) {
    const n3 = points.length;
    let P2 = null;
    let x0, y0, x1 = points[n3 - 2], y1 = points[n3 - 1];
    let c0, c1 = this._regioncode(x1, y1);
    let e0, e1 = 0;
    for (let j3 = 0; j3 < n3; j3 += 2) {
      x0 = x1, y0 = y1, x1 = points[j3], y1 = points[j3 + 1];
      c0 = c1, c1 = this._regioncode(x1, y1);
      if (c0 === 0 && c1 === 0) {
        e0 = e1, e1 = 0;
        if (P2) P2.push(x1, y1);
        else P2 = [x1, y1];
      } else {
        let S2, sx0, sy0, sx1, sy1;
        if (c0 === 0) {
          if ((S2 = this._clipSegment(x0, y0, x1, y1, c0, c1)) === null) continue;
          [sx0, sy0, sx1, sy1] = S2;
        } else {
          if ((S2 = this._clipSegment(x1, y1, x0, y0, c1, c0)) === null) continue;
          [sx1, sy1, sx0, sy0] = S2;
          e0 = e1, e1 = this._edgecode(sx0, sy0);
          if (e0 && e1) this._edge(i3, e0, e1, P2, P2.length);
          if (P2) P2.push(sx0, sy0);
          else P2 = [sx0, sy0];
        }
        e0 = e1, e1 = this._edgecode(sx1, sy1);
        if (e0 && e1) this._edge(i3, e0, e1, P2, P2.length);
        if (P2) P2.push(sx1, sy1);
        else P2 = [sx1, sy1];
      }
    }
    if (P2) {
      e0 = e1, e1 = this._edgecode(P2[0], P2[1]);
      if (e0 && e1) this._edge(i3, e0, e1, P2, P2.length);
    } else if (this.contains(i3, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    }
    return P2;
  }
  _clipSegment(x0, y0, x1, y1, c0, c1) {
    const flip = c0 < c1;
    if (flip) [x0, y0, x1, y1, c0, c1] = [x1, y1, x0, y0, c1, c0];
    while (true) {
      if (c0 === 0 && c1 === 0) return flip ? [x1, y1, x0, y0] : [x0, y0, x1, y1];
      if (c0 & c1) return null;
      let x, y2, c = c0 || c1;
      if (c & 8) x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y2 = this.ymax;
      else if (c & 4) x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y2 = this.ymin;
      else if (c & 2) y2 = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax;
      else y2 = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x = this.xmin;
      if (c0) x0 = x, y0 = y2, c0 = this._regioncode(x0, y0);
      else x1 = x, y1 = y2, c1 = this._regioncode(x1, y1);
    }
  }
  _clipInfinite(i3, points, vx0, vy0, vxn, vyn) {
    let P2 = Array.from(points), p;
    if (p = this._project(P2[0], P2[1], vx0, vy0)) P2.unshift(p[0], p[1]);
    if (p = this._project(P2[P2.length - 2], P2[P2.length - 1], vxn, vyn)) P2.push(p[0], p[1]);
    if (P2 = this._clipFinite(i3, P2)) {
      for (let j3 = 0, n3 = P2.length, c0, c1 = this._edgecode(P2[n3 - 2], P2[n3 - 1]); j3 < n3; j3 += 2) {
        c0 = c1, c1 = this._edgecode(P2[j3], P2[j3 + 1]);
        if (c0 && c1) j3 = this._edge(i3, c0, c1, P2, j3), n3 = P2.length;
      }
    } else if (this.contains(i3, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
      P2 = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax];
    }
    return P2;
  }
  _edge(i3, e0, e1, P2, j3) {
    while (e0 !== e1) {
      let x, y2;
      switch (e0) {
        case 5:
          e0 = 4;
          continue;
        case 4:
          e0 = 6, x = this.xmax, y2 = this.ymin;
          break;
        case 6:
          e0 = 2;
          continue;
        case 2:
          e0 = 10, x = this.xmax, y2 = this.ymax;
          break;
        case 10:
          e0 = 8;
          continue;
        case 8:
          e0 = 9, x = this.xmin, y2 = this.ymax;
          break;
        case 9:
          e0 = 1;
          continue;
        case 1:
          e0 = 5, x = this.xmin, y2 = this.ymin;
          break;
      }
      if ((P2[j3] !== x || P2[j3 + 1] !== y2) && this.contains(i3, x, y2)) {
        P2.splice(j3, 0, x, y2), j3 += 2;
      }
    }
    return j3;
  }
  _project(x0, y0, vx, vy) {
    let t3 = Infinity, c, x, y2;
    if (vy < 0) {
      if (y0 <= this.ymin) return null;
      if ((c = (this.ymin - y0) / vy) < t3) y2 = this.ymin, x = x0 + (t3 = c) * vx;
    } else if (vy > 0) {
      if (y0 >= this.ymax) return null;
      if ((c = (this.ymax - y0) / vy) < t3) y2 = this.ymax, x = x0 + (t3 = c) * vx;
    }
    if (vx > 0) {
      if (x0 >= this.xmax) return null;
      if ((c = (this.xmax - x0) / vx) < t3) x = this.xmax, y2 = y0 + (t3 = c) * vy;
    } else if (vx < 0) {
      if (x0 <= this.xmin) return null;
      if ((c = (this.xmin - x0) / vx) < t3) x = this.xmin, y2 = y0 + (t3 = c) * vy;
    }
    return [x, y2];
  }
  _edgecode(x, y2) {
    return (x === this.xmin ? 1 : x === this.xmax ? 2 : 0) | (y2 === this.ymin ? 4 : y2 === this.ymax ? 8 : 0);
  }
  _regioncode(x, y2) {
    return (x < this.xmin ? 1 : x > this.xmax ? 2 : 0) | (y2 < this.ymin ? 4 : y2 > this.ymax ? 8 : 0);
  }
  _simplify(P2) {
    if (P2 && P2.length > 4) {
      for (let i3 = 0; i3 < P2.length; i3 += 2) {
        const j3 = (i3 + 2) % P2.length, k2 = (i3 + 4) % P2.length;
        if (P2[i3] === P2[j3] && P2[j3] === P2[k2] || P2[i3 + 1] === P2[j3 + 1] && P2[j3 + 1] === P2[k2 + 1]) {
          P2.splice(j3, 2), i3 -= 2;
        }
      }
      if (!P2.length) P2 = null;
    }
    return P2;
  }
};

// node_modules/d3-delaunay/src/delaunay.js
var tau = 2 * Math.PI;
var pow = Math.pow;
function pointX(p) {
  return p[0];
}
function pointY(p) {
  return p[1];
}
function collinear(d) {
  const { triangles, coords } = d;
  for (let i3 = 0; i3 < triangles.length; i3 += 3) {
    const a2 = 2 * triangles[i3], b2 = 2 * triangles[i3 + 1], c = 2 * triangles[i3 + 2], cross = (coords[c] - coords[a2]) * (coords[b2 + 1] - coords[a2 + 1]) - (coords[b2] - coords[a2]) * (coords[c + 1] - coords[a2 + 1]);
    if (cross > 1e-10) return false;
  }
  return true;
}
function jitter(x, y2, r3) {
  return [x + Math.sin(x + y2) * r3, y2 + Math.cos(x - y2) * r3];
}
var Delaunay = class _Delaunay {
  static from(points, fx = pointX, fy = pointY, that) {
    return new _Delaunay("length" in points ? flatArray(points, fx, fy, that) : Float64Array.from(flatIterable(points, fx, fy, that)));
  }
  constructor(points) {
    this._delaunator = new Delaunator(points);
    this.inedges = new Int32Array(points.length / 2);
    this._hullIndex = new Int32Array(points.length / 2);
    this.points = this._delaunator.coords;
    this._init();
  }
  update() {
    this._delaunator.update();
    this._init();
    return this;
  }
  _init() {
    const d = this._delaunator, points = this.points;
    if (d.hull && d.hull.length > 2 && collinear(d)) {
      this.collinear = Int32Array.from({ length: points.length / 2 }, (_2, i3) => i3).sort((i3, j3) => points[2 * i3] - points[2 * j3] || points[2 * i3 + 1] - points[2 * j3 + 1]);
      const e3 = this.collinear[0], f = this.collinear[this.collinear.length - 1], bounds = [points[2 * e3], points[2 * e3 + 1], points[2 * f], points[2 * f + 1]], r3 = 1e-8 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);
      for (let i3 = 0, n3 = points.length / 2; i3 < n3; ++i3) {
        const p = jitter(points[2 * i3], points[2 * i3 + 1], r3);
        points[2 * i3] = p[0];
        points[2 * i3 + 1] = p[1];
      }
      this._delaunator = new Delaunator(points);
    } else {
      delete this.collinear;
    }
    const halfedges = this.halfedges = this._delaunator.halfedges;
    const hull = this.hull = this._delaunator.hull;
    const triangles = this.triangles = this._delaunator.triangles;
    const inedges = this.inedges.fill(-1);
    const hullIndex = this._hullIndex.fill(-1);
    for (let e3 = 0, n3 = halfedges.length; e3 < n3; ++e3) {
      const p = triangles[e3 % 3 === 2 ? e3 - 2 : e3 + 1];
      if (halfedges[e3] === -1 || inedges[p] === -1) inedges[p] = e3;
    }
    for (let i3 = 0, n3 = hull.length; i3 < n3; ++i3) {
      hullIndex[hull[i3]] = i3;
    }
    if (hull.length <= 2 && hull.length > 0) {
      this.triangles = new Int32Array(3).fill(-1);
      this.halfedges = new Int32Array(3).fill(-1);
      this.triangles[0] = hull[0];
      inedges[hull[0]] = 1;
      if (hull.length === 2) {
        inedges[hull[1]] = 0;
        this.triangles[1] = hull[1];
        this.triangles[2] = hull[1];
      }
    }
  }
  voronoi(bounds) {
    return new Voronoi(this, bounds);
  }
  *neighbors(i3) {
    const { inedges, hull, _hullIndex, halfedges, triangles, collinear: collinear2 } = this;
    if (collinear2) {
      const l3 = collinear2.indexOf(i3);
      if (l3 > 0) yield collinear2[l3 - 1];
      if (l3 < collinear2.length - 1) yield collinear2[l3 + 1];
      return;
    }
    const e0 = inedges[i3];
    if (e0 === -1) return;
    let e3 = e0, p0 = -1;
    do {
      yield p0 = triangles[e3];
      e3 = e3 % 3 === 2 ? e3 - 2 : e3 + 1;
      if (triangles[e3] !== i3) return;
      e3 = halfedges[e3];
      if (e3 === -1) {
        const p = hull[(_hullIndex[i3] + 1) % hull.length];
        if (p !== p0) yield p;
        return;
      }
    } while (e3 !== e0);
  }
  find(x, y2, i3 = 0) {
    if ((x = +x, x !== x) || (y2 = +y2, y2 !== y2)) return -1;
    const i0 = i3;
    let c;
    while ((c = this._step(i3, x, y2)) >= 0 && c !== i3 && c !== i0) i3 = c;
    return c;
  }
  _step(i3, x, y2) {
    const { inedges, hull, _hullIndex, halfedges, triangles, points } = this;
    if (inedges[i3] === -1 || !points.length) return (i3 + 1) % (points.length >> 1);
    let c = i3;
    let dc = pow(x - points[i3 * 2], 2) + pow(y2 - points[i3 * 2 + 1], 2);
    const e0 = inedges[i3];
    let e3 = e0;
    do {
      let t3 = triangles[e3];
      const dt = pow(x - points[t3 * 2], 2) + pow(y2 - points[t3 * 2 + 1], 2);
      if (dt < dc) dc = dt, c = t3;
      e3 = e3 % 3 === 2 ? e3 - 2 : e3 + 1;
      if (triangles[e3] !== i3) break;
      e3 = halfedges[e3];
      if (e3 === -1) {
        e3 = hull[(_hullIndex[i3] + 1) % hull.length];
        if (e3 !== t3) {
          if (pow(x - points[e3 * 2], 2) + pow(y2 - points[e3 * 2 + 1], 2) < dc) return e3;
        }
        break;
      }
    } while (e3 !== e0);
    return c;
  }
  render(context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { points, halfedges, triangles } = this;
    for (let i3 = 0, n3 = halfedges.length; i3 < n3; ++i3) {
      const j3 = halfedges[i3];
      if (j3 < i3) continue;
      const ti = triangles[i3] * 2;
      const tj = triangles[j3] * 2;
      context.moveTo(points[ti], points[ti + 1]);
      context.lineTo(points[tj], points[tj + 1]);
    }
    this.renderHull(context);
    return buffer && buffer.value();
  }
  renderPoints(context, r3) {
    if (r3 === void 0 && (!context || typeof context.moveTo !== "function")) r3 = context, context = null;
    r3 = r3 == void 0 ? 2 : +r3;
    const buffer = context == null ? context = new Path() : void 0;
    const { points } = this;
    for (let i3 = 0, n3 = points.length; i3 < n3; i3 += 2) {
      const x = points[i3], y2 = points[i3 + 1];
      context.moveTo(x + r3, y2);
      context.arc(x, y2, r3, 0, tau);
    }
    return buffer && buffer.value();
  }
  renderHull(context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { hull, points } = this;
    const h = hull[0] * 2, n3 = hull.length;
    context.moveTo(points[h], points[h + 1]);
    for (let i3 = 1; i3 < n3; ++i3) {
      const h2 = 2 * hull[i3];
      context.lineTo(points[h2], points[h2 + 1]);
    }
    context.closePath();
    return buffer && buffer.value();
  }
  hullPolygon() {
    const polygon = new Polygon();
    this.renderHull(polygon);
    return polygon.value();
  }
  renderTriangle(i3, context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { points, triangles } = this;
    const t0 = triangles[i3 *= 3] * 2;
    const t1 = triangles[i3 + 1] * 2;
    const t22 = triangles[i3 + 2] * 2;
    context.moveTo(points[t0], points[t0 + 1]);
    context.lineTo(points[t1], points[t1 + 1]);
    context.lineTo(points[t22], points[t22 + 1]);
    context.closePath();
    return buffer && buffer.value();
  }
  *trianglePolygons() {
    const { triangles } = this;
    for (let i3 = 0, n3 = triangles.length / 3; i3 < n3; ++i3) {
      yield this.trianglePolygon(i3);
    }
  }
  trianglePolygon(i3) {
    const polygon = new Polygon();
    this.renderTriangle(i3, polygon);
    return polygon.value();
  }
};
function flatArray(points, fx, fy, that) {
  const n3 = points.length;
  const array = new Float64Array(n3 * 2);
  for (let i3 = 0; i3 < n3; ++i3) {
    const p = points[i3];
    array[i3 * 2] = fx.call(that, p, i3, points);
    array[i3 * 2 + 1] = fy.call(that, p, i3, points);
  }
  return array;
}
function* flatIterable(points, fx, fy, that) {
  let i3 = 0;
  for (const p of points) {
    yield fx.call(that, p, i3, points);
    yield fy.call(that, p, i3, points);
    ++i3;
  }
}

// node_modules/@nivo/voronoi/dist/nivo-voronoi.mjs
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var y = function(n3) {
  return [n3.x, n3.y];
};
var D3 = yt;
var w2 = "cursor";
var L = "top";
var T2 = function(n3) {
  var o3 = n3.points, e3 = n3.getNodePosition, i3 = void 0 === e3 ? y : e3, t3 = n3.margin, l3 = void 0 === t3 ? D3 : t3;
  return o3.map(function(n4) {
    var o4 = i3(n4), e4 = o4[0], t4 = o4[1];
    return [e4 + l3.left, t4 + l3.top];
  });
};
var P = function(n3) {
  var o3 = n3.points, e3 = n3.width, i3 = n3.height, t3 = n3.margin, l3 = void 0 === t3 ? D3 : t3, r3 = n3.debug, u4 = Delaunay.from(o3), a2 = r3 ? u4.voronoi([0, 0, l3.left + e3 + l3.right, l3.top + i3 + l3.bottom]) : void 0;
  return { points: o3, delaunay: u4, voronoi: a2 };
};
var E2 = function(o3) {
  var e3 = o3.points, i3 = o3.getNodePosition, t3 = void 0 === i3 ? y : i3, l3 = o3.width, r3 = o3.height, u4 = o3.margin, a2 = void 0 === u4 ? D3 : u4, d = o3.debug;
  return (0, import_react.useMemo)(function() {
    return P({ points: T2({ points: e3, margin: a2, getNodePosition: t3 }), width: l3, height: r3, margin: a2, debug: d });
  }, [e3, l3, r3, a2, d]);
};
var S = function(l3) {
  var r3 = l3.elementRef, u4 = l3.nodes, s2 = l3.getNodePosition, c = void 0 === s2 ? y : s2, h = l3.delaunay, v2 = l3.setCurrent, f = l3.margin, p = void 0 === f ? D3 : f, g2 = l3.detectionRadius, m2 = void 0 === g2 ? 1 / 0 : g2, b2 = l3.isInteractive, k2 = void 0 === b2 || b2, C = l3.onMouseEnter, T3 = l3.onMouseMove, P2 = l3.onMouseLeave, E3 = l3.onMouseDown, W = l3.onMouseUp, x = l3.onClick, S2 = l3.onDoubleClick, R3 = l3.onTouchStart, U = l3.onTouchMove, A = l3.onTouchEnd, N = l3.enableTouchCrosshair, O2 = void 0 !== N && N, I2 = l3.tooltip, j3 = l3.tooltipPosition, z4 = void 0 === j3 ? w2 : j3, F2 = l3.tooltipAnchor, H3 = void 0 === F2 ? L : F2, B2 = (0, import_react.useState)(null), q = B2[0], G = B2[1], J = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(function() {
    J.current = q;
  }, [J, q]);
  var K = (0, import_react.useCallback)(function(n3) {
    if (!r3.current || 0 === u4.length) return null;
    var o3 = gn(r3.current, n3), e3 = o3[0], i3 = o3[1], t3 = h.find(e3, i3), l4 = void 0 !== t3 ? u4[t3] : null;
    if (l4 && m2 !== 1 / 0) {
      var s3 = c(l4), v3 = s3[0], f2 = s3[1];
      fn(e3, i3, v3 + p.left, f2 + p.top) > m2 && (t3 = null, l4 = null);
    }
    return null === t3 || null === l4 ? null : [t3, l4];
  }, [r3, h, u4, c, p, m2]), Q = z(), V2 = Q.showTooltipAt, X2 = Q.showTooltipFromEvent, Y = Q.hideTooltip, Z2 = (0, import_react.useMemo)(function() {
    if (I2) return "cursor" === z4 ? function(n3, o3) {
      X2(I2(n3), o3, H3);
    } : function(n3) {
      var o3 = c(n3), e3 = o3[0], i3 = o3[1];
      V2(I2(n3), [e3 + p.left, i3 + p.top], H3);
    };
  }, [V2, X2, I2, z4, H3, c, p]), $2 = (0, import_react.useCallback)(function(n3) {
    var o3 = K(n3);
    if (G(o3), null == v2 || v2(o3 ? o3[1] : null), o3) {
      var e3 = o3[1];
      null == Z2 || Z2(e3, n3), null == C || C(o3[1], n3);
    }
  }, [K, G, v2, Z2, C]), _2 = (0, import_react.useCallback)(function(n3) {
    var o3 = K(n3);
    if (G(o3), o3) {
      var e3 = o3[0], i3 = o3[1];
      if (null == v2 || v2(i3), null == Z2 || Z2(i3, n3), J.current) {
        var t3 = J.current, l4 = t3[0], r4 = t3[1];
        e3 !== l4 ? null == P2 || P2(r4, n3) : null == T3 || T3(i3, n3);
      } else null == C || C(i3, n3);
    } else null == v2 || v2(null), null == Y || Y(), J.current && (null == P2 || P2(J.current[1], n3));
  }, [K, G, J, C, T3, P2, Z2, Y]), nn2 = (0, import_react.useCallback)(function(n3) {
    G(null), null == v2 || v2(null), Y(), P2 && J.current && P2(J.current[1], n3);
  }, [G, v2, J, Y, P2]), on = (0, import_react.useCallback)(function(n3) {
    var o3 = K(n3);
    G(o3), o3 && (null == E3 || E3(o3[1], n3));
  }, [K, G, E3]), en = (0, import_react.useCallback)(function(n3) {
    var o3 = K(n3);
    G(o3), o3 && (null == W || W(o3[1], n3));
  }, [K, G, W]), tn = (0, import_react.useCallback)(function(n3) {
    var o3 = K(n3);
    G(o3), o3 && (null == x || x(o3[1], n3));
  }, [K, G, x]), ln3 = (0, import_react.useCallback)(function(n3) {
    var o3 = K(n3);
    G(o3), o3 && (null == S2 || S2(o3[1], n3));
  }, [K, G, S2]), rn2 = (0, import_react.useCallback)(function(n3) {
    var o3 = K(n3);
    O2 && (G(o3), null == v2 || v2(o3 ? o3[1] : null)), o3 && (null == R3 || R3(o3[1], n3));
  }, [K, G, v2, O2, R3]), un = (0, import_react.useCallback)(function(n3) {
    var o3 = K(n3);
    O2 && (G(o3), null == v2 || v2(o3 ? o3[1] : null)), o3 && (null == U || U(o3[1], n3));
  }, [K, G, v2, O2, U]), an = (0, import_react.useCallback)(function(n3) {
    O2 && (G(null), null == v2 || v2(null)), A && J.current && A(J.current[1], n3);
  }, [O2, G, v2, A, J]);
  return { current: q, handleMouseEnter: k2 ? $2 : void 0, handleMouseMove: k2 ? _2 : void 0, handleMouseLeave: k2 ? nn2 : void 0, handleMouseDown: k2 ? on : void 0, handleMouseUp: k2 ? en : void 0, handleClick: k2 ? tn : void 0, handleDoubleClick: k2 ? ln3 : void 0, handleTouchStart: k2 ? rn2 : void 0, handleTouchMove: k2 ? un : void 0, handleTouchEnd: k2 ? an : void 0 };
};
var I = function(o3) {
  var i3 = o3.nodes, t3 = o3.width, l3 = o3.height, r3 = o3.margin, u4 = void 0 === r3 ? D3 : r3, a2 = o3.getNodePosition, d = o3.setCurrent, s2 = o3.onMouseEnter, c = o3.onMouseMove, h = o3.onMouseLeave, v2 = o3.onMouseDown, f = o3.onMouseUp, p = o3.onClick, M = o3.onDoubleClick, k2 = o3.onTouchStart, C = o3.onTouchMove, y2 = o3.onTouchEnd, T3 = o3.enableTouchCrosshair, P2 = void 0 !== T3 && T3, W = o3.detectionRadius, x = void 0 === W ? 1 / 0 : W, R3 = o3.tooltip, U = o3.tooltipPosition, A = void 0 === U ? w2 : U, N = o3.tooltipAnchor, O2 = void 0 === N ? L : N, I2 = o3.debug, j3 = (0, import_react.useRef)(null), z4 = E2({ points: i3, getNodePosition: a2, width: t3, height: l3, margin: u4, debug: I2 }), F2 = z4.delaunay, H3 = z4.voronoi, B2 = S({ elementRef: j3, nodes: i3, delaunay: F2, margin: u4, detectionRadius: x, setCurrent: d, onMouseEnter: s2, onMouseMove: c, onMouseLeave: h, onMouseDown: v2, onMouseUp: f, onClick: p, onDoubleClick: M, onTouchStart: k2, onTouchMove: C, onTouchEnd: y2, enableTouchCrosshair: P2, tooltip: R3, tooltipPosition: A, tooltipAnchor: O2 }), q = B2.current, G = B2.handleMouseEnter, J = B2.handleMouseMove, K = B2.handleMouseLeave, Q = B2.handleMouseDown, V2 = B2.handleMouseUp, X2 = B2.handleClick, Y = B2.handleDoubleClick, Z2 = B2.handleTouchStart, $2 = B2.handleTouchMove, _2 = B2.handleTouchEnd, nn2 = (0, import_react.useMemo)(function() {
    if (I2 && H3) return H3.render();
  }, [I2, H3]);
  return (0, import_jsx_runtime.jsxs)("g", { ref: j3, transform: "translate(" + -u4.left + "," + -u4.top + ")", children: [I2 && H3 && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)("path", { d: nn2, stroke: "red", strokeWidth: 1, opacity: 0.75 }), x < 1 / 0 && (0, import_jsx_runtime.jsx)("path", { stroke: "red", strokeWidth: 0.35, fill: "none", d: F2.renderPoints(void 0, x) }), q && (0, import_jsx_runtime.jsx)("path", { fill: "pink", opacity: 0.35, d: H3.renderCell(q[0]) })] }), (0, import_jsx_runtime.jsx)("rect", { "data-ref": "mesh-interceptor", width: u4.left + t3 + u4.right, height: u4.top + l3 + u4.bottom, fill: "red", opacity: 0, style: { cursor: "auto" }, onMouseEnter: G, onMouseMove: J, onMouseLeave: K, onMouseDown: Q, onMouseUp: V2, onTouchStart: Z2, onTouchMove: $2, onTouchEnd: _2, onClick: X2, onDoubleClick: Y })] });
};
var j2 = function(n3, o3) {
  n3.save(), n3.globalAlpha = 0.75, n3.beginPath(), o3.render(n3), n3.strokeStyle = "red", n3.lineWidth = 1, n3.stroke(), n3.restore();
};
var F = function(n3, o3, e3) {
  n3.save(), n3.globalAlpha = 0.35, n3.beginPath(), o3.renderCell(e3, n3), n3.fillStyle = "pink", n3.fill(), n3.restore();
};

// node_modules/@nivo/line/dist/nivo-line.mjs
function Z() {
  return Z = Object.assign ? Object.assign.bind() : function(e3) {
    for (var o3 = 1; o3 < arguments.length; o3++) {
      var i3 = arguments[o3];
      for (var n3 in i3) ({}).hasOwnProperty.call(i3, n3) && (e3[n3] = i3[n3]);
    }
    return e3;
  }, Z.apply(null, arguments);
}
function $(e3, o3) {
  if (null == e3) return {};
  var i3 = {};
  for (var n3 in e3) if ({}.hasOwnProperty.call(e3, n3)) {
    if (-1 !== o3.indexOf(n3)) continue;
    i3[n3] = e3[n3];
  }
  return i3;
}
var _;
var ee = { xScale: { type: "point" }, yScale: { type: "linear", min: 0, max: "auto" }, curve: "linear", colors: { scheme: "nivo" }, lineWidth: 2, layers: ["grid", "markers", "axes", "areas", "crosshair", "lines", "points", "slices", "mesh", "legends"], enablePoints: true, pointSize: 6, pointColor: { from: "series.color" }, pointBorderWidth: 0, pointBorderColor: { theme: "background" }, enableArea: false, areaBaselineValue: 0, areaOpacity: 0.2, enableGridX: true, enableGridY: true, legends: [], isInteractive: true, tooltip: (0, import_react2.memo)(function(e3) {
  var o3 = e3.point;
  return (0, import_jsx_runtime2.jsx)(T, { id: (0, import_jsx_runtime2.jsxs)("span", { children: ["x: ", (0, import_jsx_runtime2.jsx)("strong", { children: o3.data.xFormatted }), ", y:", " ", (0, import_jsx_runtime2.jsx)("strong", { children: o3.data.yFormatted })] }), enableChip: true, color: o3.seriesColor });
}), sliceTooltip: (0, import_react2.memo)(function(e3) {
  var o3 = e3.slice, i3 = e3.axis, n3 = k(), r3 = "x" === i3 ? "y" : "x";
  return (0, import_jsx_runtime2.jsx)(E, { rows: o3.points.map(function(e4) {
    return [(0, import_jsx_runtime2.jsx)(w, { color: e4.seriesColor, style: n3.tooltip.chip }, "chip"), e4.seriesId, (0, import_jsx_runtime2.jsx)("span", { style: n3.tooltip.tableCellValue, children: e4.data[r3 + "Formatted"] }, "value")];
  }) });
}), debugMesh: false, renderWrapper: true };
var oe = Z({}, ee, { defs: [], fill: [], enablePointLabel: false, pointLabel: "data.yFormatted", areaBlendMode: "normal", axisBottom: {}, axisLeft: {}, useMesh: false, enableSlices: false, debugSlices: false, enableCrosshair: true, crosshairType: "bottom-left", enableTouchCrosshair: false, initialHiddenIds: [], animate: true, motionConfig: "gentle", role: "img", isFocusable: false });
var ie = Z({}, ee, { pixelRatio: "undefined" != typeof window && null != (_ = window.devicePixelRatio) ? _ : 1, axisBottom: {}, axisLeft: {} });
function ne(e3) {
  return (0, import_react2.useMemo)(function() {
    return line_default().defined(function(e4) {
      return null !== e4.x && null !== e4.y;
    }).x(function(e4) {
      return e4.x;
    }).y(function(e4) {
      return e4.y;
    }).curve(Jr(e3));
  }, [e3]);
}
function re(e3) {
  var i3 = e3.curve, n3 = e3.yScale, r3 = e3.areaBaselineValue;
  return (0, import_react2.useMemo)(function() {
    return area_default().defined(function(e4) {
      return null !== e4.x && null !== e4.y;
    }).x(function(e4) {
      return e4.x;
    }).y1(function(e4) {
      return e4.y;
    }).curve(Jr(i3)).y0(n3(r3));
  }, [i3, n3, r3]);
}
var te = function(e3) {
  var i3 = e3.componentId, n3 = e3.enableSlices, r3 = e3.points, t3 = e3.width, a2 = e3.height;
  return (0, import_react2.useMemo)(function() {
    if ("x" === n3) {
      var e4 = /* @__PURE__ */ new Map();
      return r3.forEach(function(o4) {
        null !== o4.data.x && null !== o4.data.y && (e4.has(o4.x) ? e4.get(o4.x).push(o4) : e4.set(o4.x, [o4]));
      }), Array.from(e4.entries()).sort(function(e5, o4) {
        return e5[0] - o4[0];
      }).map(function(e5, o4, n4) {
        var r4, l3, s2 = e5[0], d = e5[1], u4 = n4[o4 - 1], c = n4[o4 + 1];
        return r4 = u4 ? s2 - (s2 - u4[0]) / 2 : s2, l3 = c ? s2 - r4 + (c[0] - s2) / 2 : t3 - r4, { id: "slice:" + i3 + ":" + s2, x0: r4, x: s2, y0: 0, y: 0, width: l3, height: a2, points: d.reverse() };
      });
    }
    if ("y" === n3) {
      var o3 = /* @__PURE__ */ new Map();
      return r3.forEach(function(e5) {
        null !== e5.data.x && null !== e5.data.y && (o3.has(e5.y) ? o3.get(e5.y).push(e5) : o3.set(e5.y, [e5]));
      }), Array.from(o3.entries()).sort(function(e5, o4) {
        return e5[0] - o4[0];
      }).map(function(e5, o4, i4) {
        var n4, r4, l3 = e5[0], s2 = e5[1], d = i4[o4 - 1], u4 = i4[o4 + 1];
        return n4 = d ? l3 - (l3 - d[0]) / 2 : l3, r4 = u4 ? l3 - n4 + (u4[0] - l3) / 2 : a2 - n4, { id: l3, x0: 0, x: 0, y0: n4, y: l3, width: t3, height: r4, points: s2.reverse() };
      });
    }
    return [];
  }, [i3, n3, a2, r3, t3]);
};
var ae = "line";
var le = function(e3) {
  var r3 = e3.data, t3 = e3.xScale, a2 = void 0 === t3 ? ee.xScale : t3, l3 = e3.xFormat, s2 = e3.yScale, d = void 0 === s2 ? ee.yScale : s2, c = e3.yFormat, h = e3.width, f = e3.height, p = e3.colors, v2 = void 0 === p ? ee.colors : p, b2 = e3.curve, g2 = void 0 === b2 ? ee.curve : b2, m2 = e3.areaBaselineValue, y2 = void 0 === m2 ? ee.areaBaselineValue : m2, x = e3.pointColor, M = void 0 === x ? ee.pointColor : x, C = e3.pointBorderColor, S2 = void 0 === C ? ee.pointBorderColor : C, B2 = e3.enableSlices, w3 = void 0 === B2 ? oe.enableSlices : B2, k2 = e3.initialHiddenIds, T3 = void 0 === k2 ? oe.initialHiddenIds : k2, L2 = (0, import_react2.useState)((0, import_uniqueId.default)(ae))[0], D4 = xt(l3), W = xt(c), I2 = pr(v2, "id"), F2 = k(), E3 = Ye(M, F2), G = Ye(S2, F2), P2 = (0, import_react2.useState)(null != T3 ? T3 : []), O2 = P2[0], X2 = P2[1], R3 = (0, import_react2.useMemo)(function() {
    return ln2(r3.filter(function(e4) {
      return -1 === O2.indexOf(e4.id);
    }), a2, d, h, f);
  }, [r3, O2, a2, d, h, f]), z4 = R3.xScale, j3 = R3.yScale, q = R3.series, J = (0, import_react2.useMemo)(function() {
    var e4 = r3.map(function(e5) {
      return { id: e5.id, label: "" + e5.id, color: I2(e5) };
    }), o3 = e4.map(function(e5) {
      return Z({}, q.find(function(o4) {
        return o4.id === e5.id;
      }), { color: e5.color });
    }).filter(function(e5) {
      return Boolean(e5.id);
    });
    return { legendData: e4.map(function(e5) {
      return Z({}, e5, { hidden: !o3.find(function(o4) {
        return o4.id === e5.id;
      }) });
    }).reverse(), series: o3 };
  }, [r3, q, I2]), K = J.legendData, N = J.series, Q = (0, import_react2.useCallback)(function(e4) {
    X2(function(o3) {
      return o3.indexOf(e4) > -1 ? o3.filter(function(o4) {
        return o4 !== e4;
      }) : [].concat(o3, [e4]);
    });
  }, []), $2 = function(e4) {
    var i3 = e4.series, n3 = e4.getPointColor, r4 = e4.getPointBorderColor, t4 = e4.formatX, a3 = e4.formatY;
    return (0, import_react2.useMemo)(function() {
      return i3.reduce(function(e5, o3, i4) {
        return [].concat(e5, o3.data.filter(function(e6) {
          return null !== e6.position.x && null !== e6.position.y;
        }).map(function(l4, s3) {
          var d2 = { id: o3.id + "." + s3, indexInSeries: s3, absIndex: e5.length + s3, seriesIndex: i4, seriesId: o3.id, seriesColor: o3.color, x: l4.position.x, y: l4.position.y, data: Z({}, l4.data, { xFormatted: t4(l4.data.x), yFormatted: a3(l4.data.y) }) };
          return d2.color = n3({ series: o3, point: d2 }), d2.borderColor = r4(d2), d2;
        }));
      }, []);
    }, [i3, n3, r4, t4, a3]);
  }({ series: N, getPointColor: E3, getPointBorderColor: G, formatX: D4, formatY: W }), _2 = te({ componentId: L2, enableSlices: w3, points: $2, width: h, height: f });
  return { legendData: K, toggleSeries: Q, lineGenerator: ne(g2), areaGenerator: re({ curve: g2, yScale: j3, areaBaselineValue: y2 }), getColor: I2, series: N, xScale: z4, yScale: j3, slices: _2, points: $2 };
};
var se = function(e3) {
  var o3 = e3.areaBlendMode, i3 = e3.areaOpacity, n3 = e3.color, r3 = e3.fill, t3 = e3.path, a2 = Yr(), l3 = a2.animate, s2 = a2.config, d = Fr(t3), u4 = useSpring({ color: n3, config: s2, immediate: !l3 });
  return (0, import_jsx_runtime2.jsx)(animated.path, { d, fill: r3 || u4.color, fillOpacity: i3, strokeWidth: 0, style: { mixBlendMode: o3 } });
};
var de2 = (0, import_react2.memo)(function(e3) {
  var o3 = e3.areaGenerator, i3 = e3.areaOpacity, n3 = e3.areaBlendMode, r3 = e3.series.slice(0).reverse();
  return (0, import_jsx_runtime2.jsx)("g", { children: r3.map(function(e4) {
    return (0, import_jsx_runtime2.jsx)(se, Z({ path: o3(e4.data.map(function(e5) {
      return e5.position;
    })) }, Z({ areaOpacity: i3, areaBlendMode: n3 }, e4)), "" + e4.id);
  }) });
});
var ue = (0, import_react2.memo)(function(e3) {
  var i3 = e3.lineGenerator, n3 = e3.points, r3 = e3.color, t3 = e3.thickness, a2 = (0, import_react2.useMemo)(function() {
    return i3(n3);
  }, [i3, n3]), l3 = Fr(a2);
  return (0, import_jsx_runtime2.jsx)(animated.path, { d: l3, fill: "none", strokeWidth: t3, stroke: r3 });
});
var ce2 = (0, import_react2.memo)(function(e3) {
  var o3 = e3.series, i3 = e3.lineGenerator, n3 = e3.lineWidth;
  return (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: o3.slice(0).reverse().map(function(e4) {
    var o4 = e4.id, r3 = e4.data, t3 = e4.color;
    return (0, import_jsx_runtime2.jsx)(ue, { points: r3.map(function(e5) {
      return e5.position;
    }), lineGenerator: i3, color: t3, thickness: n3 }, o4);
  }) });
});
var he = (0, import_react2.memo)(function(e3) {
  var o3 = e3.slice, i3 = e3.slices, t3 = e3.axis, a2 = e3.debug, l3 = e3.tooltip, s2 = e3.isCurrent, d = e3.setCurrent, u4 = e3.onMouseEnter, c = e3.onMouseMove, h = e3.onMouseLeave, f = e3.onMouseDown, p = e3.onMouseUp, v2 = e3.onClick, b2 = e3.onDoubleClick, g2 = e3.onTouchStart, m2 = e3.onTouchMove, y2 = e3.onTouchEnd, x = z(), M = x.showTooltipFromEvent, C = x.hideTooltip, S2 = (0, import_react2.useCallback)(function(e4) {
    M((0, import_react2.createElement)(l3, { slice: o3, axis: t3 }), e4, "right"), d(o3), u4 && u4(o3, e4);
  }, [M, l3, o3, t3, d, u4]), B2 = (0, import_react2.useCallback)(function(e4) {
    M((0, import_react2.createElement)(l3, { slice: o3, axis: t3 }), e4, "right"), c && c(o3, e4);
  }, [M, l3, o3, t3, c]), w3 = (0, import_react2.useCallback)(function(e4) {
    C(), d(null), h && h(o3, e4);
  }, [C, d, h, o3]), k2 = (0, import_react2.useCallback)(function(e4) {
    f && f(o3, e4);
  }, [o3, f]), T3 = (0, import_react2.useCallback)(function(e4) {
    p && p(o3, e4);
  }, [o3, p]), L2 = (0, import_react2.useCallback)(function(e4) {
    v2 && v2(o3, e4);
  }, [o3, v2]), D4 = (0, import_react2.useCallback)(function(e4) {
    b2 && b2(o3, e4);
  }, [o3, b2]), W = (0, import_react2.useCallback)(function(e4) {
    M((0, import_react2.createElement)(l3, { slice: o3, axis: t3 }), e4, "right"), d(o3), g2 && g2(o3, e4);
  }, [t3, g2, d, M, o3, l3]), I2 = (0, import_react2.useCallback)(function(e4) {
    var n3 = e4.touches[0], a3 = document.elementFromPoint(n3.clientX, n3.clientY), s3 = null == a3 ? void 0 : a3.getAttribute("data-ref");
    if (s3) {
      var u5 = i3.find(function(e5) {
        return e5.id === s3;
      });
      u5 && (M((0, import_react2.createElement)(l3, { slice: u5, axis: t3 }), e4, "right"), d(u5));
    }
    m2 && m2(o3, e4);
  }, [t3, m2, d, M, o3, i3, l3]), F2 = (0, import_react2.useCallback)(function(e4) {
    C(), d(null), y2 && y2(o3, e4);
  }, [C, d, y2, o3]);
  return (0, import_jsx_runtime2.jsx)("rect", { x: o3.x0, y: o3.y0, width: o3.width, height: o3.height, stroke: "red", strokeWidth: a2 ? 1 : 0, strokeOpacity: 0.75, fill: "red", fillOpacity: s2 && a2 ? 0.35 : 0, onMouseEnter: S2, onMouseMove: B2, onMouseLeave: w3, onMouseDown: k2, onMouseUp: T3, onClick: L2, onDoubleClick: D4, onTouchStart: W, onTouchMove: I2, onTouchEnd: F2, "data-ref": o3.id });
});
var fe = (0, import_react2.memo)(function(e3) {
  var o3 = e3.slices, i3 = e3.axis, n3 = e3.debug, r3 = e3.tooltip, t3 = e3.current, a2 = e3.setCurrent, l3 = e3.onMouseEnter, s2 = e3.onMouseMove, d = e3.onMouseLeave, u4 = e3.onMouseDown, c = e3.onMouseUp, h = e3.onClick, f = e3.onDoubleClick, p = e3.onTouchStart, v2 = e3.onTouchMove, b2 = e3.onTouchEnd;
  return (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: o3.map(function(e4) {
    return (0, import_jsx_runtime2.jsx)(he, { slice: e4, slices: o3, axis: i3, debug: n3, tooltip: r3, setCurrent: a2, isCurrent: null !== t3 && t3.id === e4.id, onMouseEnter: l3, onMouseMove: s2, onMouseLeave: d, onMouseDown: u4, onMouseUp: c, onClick: h, onDoubleClick: f, onTouchStart: p, onTouchMove: v2, onTouchEnd: b2 }, e4.id);
  }) });
});
var pe = (0, import_react2.memo)(function(e3) {
  var o3 = e3.points, i3 = e3.symbol, n3 = e3.size, t3 = e3.borderWidth, a2 = e3.enableLabel, l3 = e3.label, s2 = e3.labelYOffset, d = e3.isFocusable, u4 = e3.setCurrentPoint, c = e3.tooltip, h = e3.margin, v2 = e3.ariaLabel, b2 = e3.ariaLabelledBy, g2 = e3.ariaDescribedBy, m2 = e3.ariaHidden, y2 = e3.ariaDisabled, x = ln(l3), M = z(), C = M.showTooltipAt, S2 = M.hideTooltip, B2 = o3.slice(0).sort(function(e4, o4) {
    return e4.indexInSeries - o4.indexInSeries;
  }).sort(function(e4, o4) {
    return o4.seriesIndex - e4.seriesIndex;
  }).map(function(e4) {
    return { id: e4.id, x: e4.x, y: e4.y, datum: e4.data, fill: e4.color, stroke: e4.borderColor, label: a2 ? x(e4) : null, ariaLabel: v2 ? v2(e4) : void 0, ariaLabelledBy: b2 ? b2(e4) : void 0, ariaDescribedBy: g2 ? g2(e4) : void 0, ariaHidden: m2 ? m2(e4) : void 0, ariaDisabled: y2 ? y2(e4) : void 0, onFocus: d ? function() {
      u4(e4), C((0, import_react2.createElement)(c, { point: e4 }), [h.left + e4.x, h.top + e4.y], "top");
    } : void 0, onBlur: d ? function() {
      u4(null), S2();
    } : void 0 };
  });
  return (0, import_jsx_runtime2.jsx)("g", { children: B2.map(function(e4) {
    return (0, import_jsx_runtime2.jsx)(rn, { x: e4.x, y: e4.y, datum: e4.datum, symbol: i3, size: n3, color: e4.fill, borderWidth: t3, borderColor: e4.stroke, label: e4.label, labelYOffset: s2, ariaLabel: e4.ariaLabel, ariaLabelledBy: e4.ariaLabelledBy, ariaDescribedBy: e4.ariaDescribedBy, ariaHidden: e4.ariaHidden, ariaDisabled: e4.ariaDisabled, isFocusable: d, onFocus: e4.onFocus, onBlur: e4.onBlur, testId: "line.point." + e4.id }, e4.id);
  }) });
});
var ve = (0, import_react2.memo)(function(e3) {
  var o3 = e3.points, i3 = e3.width, t3 = e3.height, a2 = e3.margin, l3 = e3.setCurrent, s2 = e3.onMouseEnter, d = e3.onMouseMove, u4 = e3.onMouseLeave, c = e3.onMouseDown, h = e3.onMouseUp, f = e3.onClick, p = e3.onDoubleClick, v2 = e3.onTouchStart, b2 = e3.onTouchMove, g2 = e3.onTouchEnd, m2 = e3.tooltip, y2 = e3.debug, x = e3.enableTouchCrosshair, M = z(), C = M.showTooltipAt, S2 = M.hideTooltip, B2 = (0, import_react2.useCallback)(function(e4, o4) {
    C((0, import_react2.createElement)(m2, { point: e4 }), [e4.x + a2.left, e4.y + a2.top], "top"), s2 && s2(e4, o4);
  }, [C, m2, s2, a2]), w3 = (0, import_react2.useCallback)(function(e4, o4) {
    C((0, import_react2.createElement)(m2, { point: e4 }), [e4.x + a2.left, e4.y + a2.top], "top"), d && d(e4, o4);
  }, [C, m2, a2.left, a2.top, d]), k2 = (0, import_react2.useCallback)(function(e4, o4) {
    S2(), u4 && u4(e4, o4);
  }, [S2, u4]), T3 = (0, import_react2.useCallback)(function(e4, o4) {
    c && c(e4, o4);
  }, [c]), L2 = (0, import_react2.useCallback)(function(e4, o4) {
    h && h(e4, o4);
  }, [h]), D4 = (0, import_react2.useCallback)(function(e4, o4) {
    f && f(e4, o4);
  }, [f]), W = (0, import_react2.useCallback)(function(e4, o4) {
    p && p(e4, o4);
  }, [p]), I2 = (0, import_react2.useCallback)(function(e4, o4) {
    C((0, import_react2.createElement)(m2, { point: e4 }), [e4.x + a2.left, e4.y + a2.top], "top"), v2 && v2(e4, o4);
  }, [a2.left, a2.top, v2, C, m2]), F2 = (0, import_react2.useCallback)(function(e4, o4) {
    C((0, import_react2.createElement)(m2, { point: e4 }), [e4.x + a2.left, e4.y + a2.top], "top"), b2 && b2(e4, o4);
  }, [a2.left, a2.top, b2, C, m2]), G = (0, import_react2.useCallback)(function(e4, o4) {
    S2(), g2 && g2(e4, o4);
  }, [g2, S2]);
  return (0, import_jsx_runtime2.jsx)(I, { nodes: o3, width: i3, height: t3, setCurrent: l3, onMouseEnter: B2, onMouseMove: w3, onMouseLeave: k2, onMouseDown: T3, onMouseUp: L2, onClick: D4, onDoubleClick: W, onTouchStart: I2, onTouchMove: F2, onTouchEnd: G, enableTouchCrosshair: x, debug: y2 });
});
var be = ["isInteractive", "animate", "motionConfig", "theme", "renderWrapper"];
function ge(e3) {
  var n3 = e3.data, r3 = e3.xScale, a2 = void 0 === r3 ? oe.xScale : r3, l3 = e3.xFormat, s2 = e3.yScale, d = void 0 === s2 ? oe.yScale : s2, u4 = e3.yFormat, c = e3.curve, h = void 0 === c ? oe.curve : c, f = e3.margin, p = e3.width, v2 = e3.height, x = e3.colors, M = void 0 === x ? oe.colors : x, C = e3.lineWidth, S2 = void 0 === C ? oe.lineWidth : C, k2 = e3.layers, T3 = void 0 === k2 ? oe.layers : k2, D4 = e3.enableArea, W = void 0 === D4 ? oe.enableArea : D4, I2 = e3.areaBaselineValue, F2 = void 0 === I2 ? oe.areaBaselineValue : I2, E3 = e3.areaOpacity, P2 = void 0 === E3 ? oe.areaOpacity : E3, O2 = e3.areaBlendMode, H3 = void 0 === O2 ? oe.areaBlendMode : O2, A = e3.enablePoints, V2 = void 0 === A ? oe.enablePoints : A, Y = e3.pointSymbol, U = e3.pointSize, R3 = void 0 === U ? oe.pointSize : U, z4 = e3.pointColor, j3 = void 0 === z4 ? oe.pointColor : z4, q = e3.pointBorderWidth, J = void 0 === q ? oe.pointBorderWidth : q, K = e3.pointBorderColor, N = void 0 === K ? oe.pointBorderColor : K, Q = e3.enablePointLabel, $2 = void 0 === Q ? oe.enablePointLabel : Q, _2 = e3.pointLabel, ee2 = void 0 === _2 ? oe.pointLabel : _2, ie2 = e3.pointLabelYOffset, ne2 = e3.enableGridX, re2 = void 0 === ne2 ? oe.enableGridX : ne2, te2 = e3.gridXValues, ae2 = e3.enableGridY, se2 = void 0 === ae2 ? oe.enableGridY : ae2, ue2 = e3.gridYValues, he2 = e3.axisTop, be2 = e3.axisRight, ge2 = e3.axisBottom, me2 = void 0 === ge2 ? oe.axisBottom : ge2, ye2 = e3.axisLeft, xe2 = void 0 === ye2 ? oe.axisLeft : ye2, Me2 = e3.defs, Ce2 = void 0 === Me2 ? oe.defs : Me2, Se2 = e3.fill, Be2 = void 0 === Se2 ? oe.fill : Se2, we2 = e3.markers, ke = e3.legends, Te = void 0 === ke ? oe.legends : ke, Le = e3.isInteractive, De = void 0 === Le ? oe.isInteractive : Le, We = e3.useMesh, Ie = void 0 === We ? oe.useMesh : We, Fe = e3.debugMesh, Ee = void 0 === Fe ? oe.debugMesh : Fe, Ge = e3.onMouseEnter, Pe = e3.onMouseMove, Oe = e3.onMouseLeave, He = e3.onMouseDown, Ae = e3.onMouseUp, Ve = e3.onClick, Ye2 = e3.onDoubleClick, Ue = e3.onTouchStart, Xe = e3.onTouchMove, Re = e3.onTouchEnd, ze = e3.tooltip, je = void 0 === ze ? oe.tooltip : ze, qe = e3.enableSlices, Je = void 0 === qe ? oe.enableSlices : qe, Ke = e3.debugSlices, Ne = void 0 === Ke ? oe.debugSlices : Ke, Qe = e3.sliceTooltip, Ze = void 0 === Qe ? oe.sliceTooltip : Qe, $e = e3.enableCrosshair, _e = void 0 === $e ? oe.enableCrosshair : $e, eo = e3.crosshairType, oo = void 0 === eo ? oe.crosshairType : eo, io = e3.enableTouchCrosshair, no = void 0 === io ? oe.enableTouchCrosshair : io, ro = e3.role, to = void 0 === ro ? oe.role : ro, ao = e3.ariaLabel, lo = e3.ariaLabelledBy, so = e3.ariaDescribedBy, uo = e3.isFocusable, co = void 0 === uo ? oe.isFocusable : uo, ho = e3.pointAriaLabel, fo = e3.pointAriaLabelledBy, po = e3.pointAriaDescribedBy, vo = e3.pointAriaHidden, bo = e3.pointAriaDisabled, go = e3.initialHiddenIds, mo = void 0 === go ? oe.initialHiddenIds : go, yo = _t(p, v2, f), xo = yo.margin, Mo = yo.innerWidth, Co = yo.innerHeight, So = yo.outerWidth, Bo = yo.outerHeight, wo = le({ data: n3, xScale: a2, xFormat: l3, yScale: d, yFormat: u4, width: Mo, height: Co, colors: M, curve: h, areaBaselineValue: F2, pointColor: j3, pointBorderColor: N, enableSlices: Je, initialHiddenIds: mo }), ko = wo.legendData, To = wo.toggleSeries, Lo = wo.lineGenerator, Do = wo.areaGenerator, Wo = wo.series, Io = wo.xScale, Fo = wo.yScale, Eo = wo.slices, Go = wo.points, Po = (0, import_react2.useState)(null), Oo = Po[0], Ho = Po[1], Ao = (0, import_react2.useState)(null), Vo = Ao[0], Yo = Ao[1], Uo = { grid: null, markers: null, axes: null, areas: null, crosshair: null, lines: null, points: null, slices: null, mesh: null, legends: null };
  T3.includes("grid") && (re2 || se2) && (Uo.grid = (0, import_jsx_runtime2.jsx)(z2, { width: Mo, height: Co, xScale: re2 ? Io : null, yScale: se2 ? Fo : null, xValues: te2, yValues: ue2 }, "grid")), T3.includes("markers") && Array.isArray(we2) && we2.length > 0 && (Uo.markers = (0, import_jsx_runtime2.jsx)(nn, { markers: we2, width: Mo, height: Co, xScale: Io, yScale: Fo }, "markers")), T3.includes("axes") && (Uo.axes = (0, import_jsx_runtime2.jsx)(O, { xScale: Io, yScale: Fo, width: Mo, height: Co, top: he2, right: be2, bottom: me2, left: xe2 }, "axes")), T3.includes("lines") && (Uo.lines = (0, import_jsx_runtime2.jsx)(ce2, { series: Wo, lineGenerator: Lo, lineWidth: S2 }, "lines")), T3.includes("legends") && Te.length > 0 && (Uo.legends = (0, import_jsx_runtime2.jsx)(import_react2.Fragment, { children: Te.map(function(e4, o3) {
    return (0, import_jsx_runtime2.jsx)(H, Z({}, e4, { containerWidth: Mo, containerHeight: Co, data: e4.data || ko, toggleSerie: e4.toggleSerie ? To : void 0 }), o3);
  }) }, "legends"));
  var Xo = yn(Ce2, Wo, Be2);
  W && (Uo.areas = (0, import_jsx_runtime2.jsx)(de2, { areaGenerator: Do, areaOpacity: P2, areaBlendMode: H3, series: Wo }, "areas")), De && false !== Je && (Uo.slices = (0, import_jsx_runtime2.jsx)(fe, { slices: Eo, axis: Je, debug: Ne, tooltip: Ze, current: Vo, setCurrent: Yo, onMouseEnter: Ge, onMouseMove: Pe, onMouseLeave: Oe, onMouseDown: He, onMouseUp: Ae, onClick: Ve, onDoubleClick: Ye2, onTouchStart: Ue, onTouchMove: Xe, onTouchEnd: Re }, "slices")), V2 && (Uo.points = (0, import_jsx_runtime2.jsx)(pe, { points: Go, symbol: Y, size: R3, borderWidth: J, enableLabel: $2, label: ee2, labelYOffset: ie2, isFocusable: co, setCurrentPoint: Ho, tooltip: je, margin: xo, ariaLabel: ho, ariaLabelledBy: fo, ariaDescribedBy: po, ariaHidden: vo, ariaDisabled: bo }, "points")), De && _e && (null !== Oo && (Uo.crosshair = (0, import_jsx_runtime2.jsx)(V, { width: Mo, height: Co, x: Oo.x, y: Oo.y, type: oo }, "crosshair")), null !== Vo && Je && (Uo.crosshair = (0, import_jsx_runtime2.jsx)(V, { width: Mo, height: Co, x: Vo.x, y: Vo.y, type: Je }, "crosshair"))), De && Ie && false === Je && (Uo.mesh = (0, import_jsx_runtime2.jsx)(ve, { points: Go, width: Mo, height: Co, margin: xo, setCurrent: Ho, onMouseEnter: Ge, onMouseMove: Pe, onMouseLeave: Oe, onMouseDown: He, onMouseUp: Ae, onClick: Ve, onDoubleClick: Ye2, onTouchStart: Ue, onTouchMove: Xe, onTouchEnd: Re, tooltip: je, enableTouchCrosshair: no, debug: Ee }, "mesh"));
  var Ro = (0, import_react2.useMemo)(function() {
    return { innerWidth: Mo, innerHeight: Co, series: Wo, slices: Eo, points: Go, xScale: Io, yScale: Fo, lineGenerator: Lo, areaGenerator: Do, currentPoint: Oo, setCurrentPoint: Ho, currentSlice: Vo, setCurrentSlice: Yo };
  }, [Mo, Co, Wo, Eo, Go, Io, Fo, Lo, Do, Oo, Ho, Vo, Yo]);
  return (0, import_jsx_runtime2.jsx)($t, { defs: Xo, width: So, height: Bo, margin: xo, role: to, ariaLabel: ao, ariaLabelledBy: lo, ariaDescribedBy: so, isFocusable: co, children: T3.map(function(e4, o3) {
    return "function" == typeof e4 ? (0, import_jsx_runtime2.jsx)(import_react2.Fragment, { children: e4(Ro) }, o3) : Uo[e4];
  }) });
}
function me(e3) {
  var o3 = e3.isInteractive, i3 = void 0 === o3 ? oe.isInteractive : o3, n3 = e3.animate, r3 = void 0 === n3 ? oe.animate : n3, t3 = e3.motionConfig, a2 = void 0 === t3 ? oe.motionConfig : t3, l3 = e3.theme, s2 = e3.renderWrapper, d = $(e3, be);
  return (0, import_jsx_runtime2.jsx)(qr, { animate: r3, isInteractive: i3, motionConfig: a2, renderWrapper: s2, theme: l3, children: (0, import_jsx_runtime2.jsx)(ge, Z({ isInteractive: i3 }, d)) });
}
var ye = function(e3) {
  return (0, import_jsx_runtime2.jsx)(Ot, { children: function(o3) {
    var i3 = o3.width, n3 = o3.height;
    return (0, import_jsx_runtime2.jsx)(me, Z({ width: i3, height: n3 }, e3));
  } });
};
var xe = ["isInteractive", "renderWrapper", "theme"];
var Me = function(e3) {
  var t3 = e3.width, a2 = e3.height, d = e3.margin, u4 = e3.pixelRatio, c = void 0 === u4 ? ie.pixelRatio : u4, h = e3.data, f = e3.xScale, p = void 0 === f ? ie.xScale : f, v2 = e3.xFormat, g2 = e3.yScale, m2 = void 0 === g2 ? ie.yScale : g2, y2 = e3.yFormat, x = e3.curve, B2 = void 0 === x ? ie.curve : x, w3 = e3.layers, L2 = void 0 === w3 ? ie.layers : w3, W = e3.colors, I2 = void 0 === W ? ie.colors : W, F2 = e3.lineWidth, G = void 0 === F2 ? ie.lineWidth : F2, P2 = e3.enableArea, O2 = void 0 === P2 ? ie.enableArea : P2, H3 = e3.areaBaselineValue, V2 = void 0 === H3 ? ie.areaBaselineValue : H3, Y = e3.areaOpacity, U = void 0 === Y ? ie.areaOpacity : Y, R3 = e3.enablePoints, z4 = void 0 === R3 ? ie.enablePoints : R3, j3 = e3.pointSize, q = void 0 === j3 ? ie.pointSize : j3, J = e3.pointColor, $2 = void 0 === J ? ie.pointColor : J, _2 = e3.pointBorderWidth, ee2 = void 0 === _2 ? ie.pointBorderWidth : _2, oe2 = e3.pointBorderColor, ne2 = void 0 === oe2 ? ie.pointBorderColor : oe2, re2 = e3.enableGridX, te2 = void 0 === re2 ? ie.enableGridX : re2, ae2 = e3.gridXValues, se2 = e3.enableGridY, de3 = void 0 === se2 ? ie.enableGridY : se2, ue2 = e3.gridYValues, ce3 = e3.axisTop, he2 = e3.axisRight, fe2 = e3.axisBottom, pe2 = void 0 === fe2 ? ie.axisBottom : fe2, ve2 = e3.axisLeft, be2 = void 0 === ve2 ? ie.axisLeft : ve2, ge2 = e3.legends, me2 = void 0 === ge2 ? ie.legends : ge2, ye2 = e3.isInteractive, xe2 = void 0 === ye2 ? ie.isInteractive : ye2, Me2 = e3.debugMesh, Ce2 = void 0 === Me2 ? ie.debugMesh : Me2, Se2 = e3.onMouseLeave, Be2 = e3.onMouseDown, we2 = e3.onMouseUp, ke = e3.onClick, Te = e3.onDoubleClick, Le = e3.tooltip, De = void 0 === Le ? ie.tooltip : Le, We = e3.forwardedRef, Ie = (0, import_react2.useRef)(null), Fe = _t(t3, a2, d), Ee = Fe.margin, Ge = Fe.innerWidth, Pe = Fe.innerHeight, Oe = Fe.outerWidth, He = Fe.outerHeight, Ae = k(), Ve = (0, import_react2.useState)(null), Ye2 = Ve[0], Ue = Ve[1], Xe = le({ data: h, xScale: p, xFormat: v2, yScale: m2, yFormat: y2, width: Ge, height: Pe, colors: I2, curve: B2, areaBaselineValue: V2, pointColor: $2, pointBorderColor: ne2 }), Re = Xe.lineGenerator, ze = Xe.areaGenerator, je = Xe.series, qe = Xe.xScale, Je = Xe.yScale, Ke = Xe.points, Ne = (0, import_react2.useMemo)(function() {
    return { innerWidth: Ge, innerHeight: Pe, series: je, points: Ke, xScale: qe, yScale: Je, lineWidth: G, lineGenerator: Re, areaGenerator: ze, currentPoint: Ye2, setCurrentPoint: Ue };
  }, [Ge, Pe, je, Ke, qe, Je, G, Re, ze, Ye2]), Qe = E2({ points: Ke, width: Ge, height: Pe, debug: Ce2 }), Ze = Qe.delaunay, $e = Qe.voronoi;
  (0, import_react2.useEffect)(function() {
    if (null !== Ie.current) {
      Ie.current.width = Oe * c, Ie.current.height = He * c;
      var e4 = Ie.current.getContext("2d");
      e4.scale(c, c), e4.fillStyle = Ae.background, e4.fillRect(0, 0, Oe, He), e4.translate(Ee.left, Ee.top), L2.forEach(function(o3) {
        if ("function" == typeof o3 && o3(e4, Ne), "grid" === o3 && (Ae.grid.line.strokeWidth || 0) > 0 && (e4.lineWidth = Ae.grid.line.strokeWidth, e4.strokeStyle = Ae.grid.line.stroke, te2 && R(e4, { width: Ge, height: Pe, scale: qe, axis: "x", values: ae2 }), de3 && R(e4, { width: Ge, height: Pe, scale: Je, axis: "y", values: ue2 })), "axes" === o3 && D(e4, { xScale: qe, yScale: Je, width: Ge, height: Pe, top: ce3, right: he2, bottom: pe2, left: be2, theme: Ae }), "areas" === o3 && true === O2) {
          e4.save(), e4.globalAlpha = U, ze.context(e4);
          for (var i3 = je.length - 1; i3 >= 0; i3--) e4.fillStyle = je[i3].color, e4.beginPath(), ze(je[i3].data.map(function(e5) {
            return e5.position;
          })), e4.fill();
          e4.restore();
        }
        if ("lines" === o3 && (Re.context(e4), je.forEach(function(o4) {
          e4.strokeStyle = o4.color, e4.lineWidth = G, e4.beginPath(), Re(o4.data.map(function(e5) {
            return e5.position;
          })), e4.stroke();
        })), "points" === o3 && true === z4 && q > 0 && Ke.forEach(function(o4) {
          e4.fillStyle = o4.color, e4.beginPath(), e4.arc(o4.x, o4.y, q / 2, 0, 2 * Math.PI), e4.fill(), ee2 > 0 && (e4.strokeStyle = o4.borderColor, e4.lineWidth = ee2, e4.stroke());
        }), "mesh" === o3 && true === Ce2 && void 0 !== $e && (j2(e4, $e), Ye2 && F(e4, $e, Ye2.absIndex)), "legends" === o3) {
          var n3 = je.map(function(e5) {
            return { id: e5.id, label: e5.id, color: e5.color };
          }).reverse();
          me2.forEach(function(o4) {
            j(e4, Z({}, o4, { data: o4.data || n3, containerWidth: Ge, containerHeight: Pe, theme: Ae }));
          });
        }
      });
    }
  }, [Ie, Oe, He, L2, Ae, Re, je, qe, Je, te2, ae2, de3, ue2, ce3, he2, pe2, be2, me2, Ke, z4, q, Ye2]);
  var _e = (0, import_react2.useCallback)(function(e4) {
    if (!Ie.current) return null;
    var o3 = gn(Ie.current, e4), i3 = o3[0], n3 = o3[1];
    if (!pn(Ee.left, Ee.top, Ge, Pe, i3, n3)) return null;
    var r3 = Ze.find(i3 - Ee.left, n3 - Ee.top);
    return Ke[r3];
  }, [Ie, Ee, Ge, Pe, Ze]), eo = z(), oo = eo.showTooltipFromEvent, io = eo.hideTooltip, no = (0, import_react2.useCallback)(function(e4) {
    var o3 = _e(e4);
    Ue(o3), o3 ? oo((0, import_react2.createElement)(De, { point: o3 }), e4) : io();
  }, [_e, Ue, oo, io, De]), ro = (0, import_react2.useCallback)(function(e4) {
    io(), Ue(null), Ye2 && Se2 && Se2(Ye2, e4);
  }, [io, Ue, Se2]), to = (0, import_react2.useCallback)(function(e4) {
    if (Be2) {
      var o3 = _e(e4);
      o3 && Be2(o3, e4);
    }
  }, [_e, Be2]), ao = (0, import_react2.useCallback)(function(e4) {
    if (we2) {
      var o3 = _e(e4);
      o3 && we2(o3, e4);
    }
  }, [_e, we2]), lo = (0, import_react2.useCallback)(function(e4) {
    if (ke) {
      var o3 = _e(e4);
      o3 && ke(o3, e4);
    }
  }, [_e, ke]), so = (0, import_react2.useCallback)(function(e4) {
    if (Te) {
      var o3 = _e(e4);
      o3 && Te(o3, e4);
    }
  }, [_e, Te]);
  return (0, import_jsx_runtime2.jsx)("canvas", { ref: _n(Ie, We), width: Oe * c, height: He * c, style: { width: Oe, height: He, cursor: xe2 ? "auto" : "normal" }, onMouseEnter: xe2 ? no : void 0, onMouseMove: xe2 ? no : void 0, onMouseLeave: xe2 ? ro : void 0, onMouseDown: xe2 ? to : void 0, onMouseUp: xe2 ? ao : void 0, onClick: xe2 ? lo : void 0, onDoubleClick: xe2 ? so : void 0 });
};
var Ce = (0, import_react2.forwardRef)(function(e3, o3) {
  var i3 = e3.isInteractive, n3 = e3.renderWrapper, r3 = e3.theme, t3 = $(e3, xe);
  return (0, import_jsx_runtime2.jsx)(qr, { isInteractive: i3, renderWrapper: n3, theme: r3, animate: false, children: (0, import_jsx_runtime2.jsx)(Me, Z({}, t3, { forwardedRef: o3 })) });
});
var Se = (0, import_react2.forwardRef)(function(e3, o3) {
  return (0, import_jsx_runtime2.jsx)(Ot, { children: function(i3) {
    var n3 = i3.width, r3 = i3.height;
    return (0, import_jsx_runtime2.jsx)(Ce, Z({ width: n3, height: r3 }, e3, { ref: o3 }));
  } });
});
function Be(e3) {
  return void 0 !== e3.seriesId;
}
function we(e3) {
  return void 0 !== e3.points;
}
export {
  ae as LINE_UNIQUE_ID_PREFIX,
  me as Line,
  Ce as LineCanvas,
  ye as ResponsiveLine,
  Se as ResponsiveLineCanvas,
  ie as canvasDefaultProps,
  ee as commonDefaultProps,
  Be as isPoint,
  we as isSliceData,
  oe as svgDefaultProps,
  re as useAreaGenerator,
  le as useLine,
  ne as useLineGenerator,
  te as useSlices
};
//# sourceMappingURL=@nivo_line.js.map
