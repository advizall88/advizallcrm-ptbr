import {
  $t,
  Et,
  H,
  It,
  Lt,
  Ot,
  T,
  Wt,
  Ye,
  Yr,
  Yt,
  _t,
  animated,
  arc_default,
  c,
  fn,
  gn,
  hn,
  j,
  k,
  line_default,
  o,
  pie_default,
  pr,
  qr,
  r,
  to,
  un,
  useTransition,
  xt,
  yn,
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
  __toESM
} from "./chunk-WOOG5QLI.js";

// node_modules/@nivo/pie/dist/nivo-pie.mjs
var import_react2 = __toESM(require_react(), 1);

// node_modules/@nivo/arcs/dist/nivo-arcs.mjs
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var import_react = __toESM(require_react(), 1);
function b() {
  return b = Object.assign ? Object.assign.bind() : function(n2) {
    for (var t2 = 1; t2 < arguments.length; t2++) {
      var e2 = arguments[t2];
      for (var r3 in e2) ({}).hasOwnProperty.call(e2, r3) && (n2[r3] = e2[r3]);
    }
    return n2;
  }, b.apply(null, arguments);
}
var L = { pointerEvents: "none" };
var P = function(t2) {
  var e2 = t2.label, r3 = t2.style, o3 = k();
  return (0, import_jsx_runtime.jsx)(animated.g, { transform: r3.transform, opacity: r3.progress, style: L, children: (0, import_jsx_runtime.jsx)(c, { textAnchor: "middle", dominantBaseline: "central", style: b({}, o3.labels.text, { fill: r3.textColor }), children: e2 }) });
};
var O = function(n2) {
  var t2 = n2 % (2 * Math.PI);
  return t2 < 0 && (t2 += 2 * Math.PI), t2;
};
var E = function(n2, t2) {
  return n2.filter(function(n3) {
    return Math.abs(It(n3.arc.endAngle - n3.arc.startAngle)) >= t2;
  });
};
var W = { startAngle: { enter: function(n2) {
  return b({}, n2, { endAngle: n2.startAngle });
}, update: function(n2) {
  return n2;
}, leave: function(n2) {
  return b({}, n2, { startAngle: n2.endAngle });
} }, middleAngle: { enter: function(n2) {
  var t2 = n2.startAngle + (n2.endAngle - n2.startAngle) / 2;
  return b({}, n2, { startAngle: t2, endAngle: t2 });
}, update: function(n2) {
  return n2;
}, leave: function(n2) {
  var t2 = n2.startAngle + (n2.endAngle - n2.startAngle) / 2;
  return b({}, n2, { startAngle: t2, endAngle: t2 });
} }, endAngle: { enter: function(n2) {
  return b({}, n2, { startAngle: n2.endAngle });
}, update: function(n2) {
  return n2;
}, leave: function(n2) {
  return b({}, n2, { endAngle: n2.startAngle });
} }, innerRadius: { enter: function(n2) {
  return b({}, n2, { outerRadius: n2.innerRadius });
}, update: function(n2) {
  return n2;
}, leave: function(n2) {
  return b({}, n2, { innerRadius: n2.outerRadius });
} }, centerRadius: { enter: function(n2) {
  var t2 = n2.innerRadius + (n2.outerRadius - n2.innerRadius) / 2;
  return b({}, n2, { innerRadius: t2, outerRadius: t2 });
}, update: function(n2) {
  return n2;
}, leave: function(n2) {
  var t2 = n2.innerRadius + (n2.outerRadius - n2.innerRadius) / 2;
  return b({}, n2, { innerRadius: t2, outerRadius: t2 });
} }, outerRadius: { enter: function(n2) {
  return b({}, n2, { innerRadius: n2.outerRadius });
}, update: function(n2) {
  return n2;
}, leave: function(n2) {
  return b({}, n2, { outerRadius: n2.innerRadius });
} }, pushIn: { enter: function(n2) {
  return b({}, n2, { innerRadius: n2.innerRadius - n2.outerRadius + n2.innerRadius, outerRadius: n2.innerRadius });
}, update: function(n2) {
  return n2;
}, leave: function(n2) {
  return b({}, n2, { innerRadius: n2.outerRadius, outerRadius: n2.outerRadius + n2.outerRadius - n2.innerRadius });
} }, pushOut: { enter: function(n2) {
  return b({}, n2, { innerRadius: n2.outerRadius, outerRadius: n2.outerRadius + n2.outerRadius - n2.innerRadius });
}, update: function(n2) {
  return n2;
}, leave: function(n2) {
  return b({}, n2, { innerRadius: n2.innerRadius - n2.outerRadius + n2.innerRadius, outerRadius: n2.innerRadius });
} } };
var j2 = function(n2, t2) {
  return (0, import_react.useMemo)(function() {
    var e2 = W[n2];
    return { enter: function(n3) {
      return b({ progress: 0 }, e2.enter(n3.arc), t2 ? t2.enter(n3) : {});
    }, update: function(n3) {
      return b({ progress: 1 }, e2.update(n3.arc), t2 ? t2.update(n3) : {});
    }, leave: function(n3) {
      return b({ progress: 0 }, e2.leave(n3.arc), t2 ? t2.leave(n3) : {});
    } };
  }, [n2, t2]);
};
var w = function(n2, t2) {
  var e2 = Lt(n2) - Math.PI / 2, r3 = n2.innerRadius + (n2.outerRadius - n2.innerRadius) * t2;
  return Yt(e2, r3);
};
var B = function(n2) {
  return function(e2, r3, i2, a2) {
    return to([e2, r3, i2, a2], function(t2, e3, r4, i3) {
      var a3 = w({ startAngle: t2, endAngle: e3, innerRadius: r4, outerRadius: i3 }, n2);
      return "translate(" + a3.x + "," + a3.y + ")";
    });
  };
};
var S = function(n2, t2, r3, i2) {
  void 0 === t2 && (t2 = 0.5), void 0 === r3 && (r3 = "innerRadius");
  var a2 = Yr(), o3 = a2.animate, u = a2.config, s2 = j2(r3, i2);
  return { transition: useTransition(n2, { keys: function(n3) {
    return n3.id;
  }, initial: s2.update, from: s2.enter, enter: s2.update, update: s2.update, leave: s2.leave, config: u, immediate: !o3 }), interpolate: B(t2) };
};
var G = function(n2) {
  var t2 = n2.data, e2 = n2.offset, r3 = void 0 === e2 ? 0.5 : e2, i2 = n2.skipAngle, a2 = void 0 === i2 ? 0 : i2, o3 = n2.computeExtraProps, u = void 0 === o3 ? function() {
    return {};
  } : o3;
  return (0, import_react.useMemo)(function() {
    return E(t2, a2).map(function(n3) {
      var t3 = w(n3.arc, r3);
      return b({}, u(n3), { x: t3.x, y: t3.y, data: n3 });
    });
  }, [t2, r3, a2, u]);
};
var q = function(n2) {
  var t2 = n2.center, e2 = n2.data, r3 = n2.transitionMode, a2 = n2.label, o3 = n2.radiusOffset, u = n2.skipAngle, l2 = n2.skipRadius, f2 = n2.textColor, p = n2.component, h = void 0 === p ? P : p, v = un(a2), R = k(), x = Ye(f2, R), m = (0, import_react.useMemo)(function() {
    return e2.filter(function(n3) {
      var t3 = Math.abs(It(n3.arc.endAngle - n3.arc.startAngle)), e3 = Math.abs(n3.arc.outerRadius - n3.arc.innerRadius);
      return t3 >= u && e3 >= l2;
    });
  }, [e2, u, l2]), y2 = S(m, o3, r3), k2 = y2.transition, C = y2.interpolate, L2 = h;
  return (0, import_jsx_runtime.jsx)("g", { transform: "translate(" + t2[0] + "," + t2[1] + ")", children: k2(function(n3, t3) {
    return (0, import_react.createElement)(L2, { key: t3.id, datum: t3, label: v(t3), style: b({}, n3, { transform: C(n3.startAngle, n3.endAngle, n3.innerRadius, n3.outerRadius), textColor: x(t3) }) });
  }) });
};
var z2 = function(n2, t2, e2) {
  r(n2, e2.labels.text), n2.textAlign = "center", n2.textBaseline = "middle", t2.forEach(function(t3) {
    o(n2, b({}, e2.labels.text, { fill: t3.textColor }), String(t3.label), t3.x, t3.y);
  });
};
var D = function(n2) {
  var t2 = n2.data, e2 = n2.offset, r3 = n2.skipAngle, a2 = n2.label, o3 = n2.textColor, u = un(a2), s2 = k(), l2 = Ye(o3, s2), d2 = (0, import_react.useCallback)(function(n3) {
    return { label: u(n3), textColor: l2(n3) };
  }, [u, l2]);
  return G({ data: t2, offset: e2, skipAngle: r3, computeExtraProps: d2 });
};
var H2 = function(t2) {
  var e2 = t2.label, r3 = t2.style, o3 = k();
  return (0, import_jsx_runtime.jsxs)(animated.g, { opacity: r3.opacity, children: [(0, import_jsx_runtime.jsx)(animated.path, { fill: "none", stroke: r3.linkColor, strokeWidth: r3.thickness, d: r3.path }), (0, import_jsx_runtime.jsx)(c, { transform: r3.textPosition, textAnchor: r3.textAnchor, dominantBaseline: "central", style: b({}, o3.labels.text, { fill: r3.textColor }), children: e2 })] });
};
var J = function(n2) {
  var t2 = O(n2.startAngle + (n2.endAngle - n2.startAngle) / 2 - Math.PI / 2);
  return t2 < Math.PI / 2 || t2 > 1.5 * Math.PI ? "start" : "end";
};
var K = function(n2, t2, e2, r3) {
  var i2, a2, o3 = O(n2.startAngle + (n2.endAngle - n2.startAngle) / 2 - Math.PI / 2), u = Yt(o3, n2.outerRadius + t2), s2 = Yt(o3, n2.outerRadius + t2 + e2);
  return o3 < Math.PI / 2 || o3 > 1.5 * Math.PI ? (i2 = "after", a2 = { x: s2.x + r3, y: s2.y }) : (i2 = "before", a2 = { x: s2.x - r3, y: s2.y }), { side: i2, points: [u, s2, a2] };
};
var N = line_default().x(function(n2) {
  return n2.x;
}).y(function(n2) {
  return n2.y;
});
var Q = function(n2, e2, r3, i2, a2, o3, u) {
  return to([n2, e2, r3, i2, a2, o3, u], function(n3, t2, e3, r4, i3, a3, o4) {
    var u2 = K({ startAngle: n3, endAngle: t2, innerRadius: e3, outerRadius: r4 }, i3, a3, o4).points;
    return N(u2);
  });
};
var U = function(n2, e2, r3, i2) {
  return to([n2, e2, r3, i2], function(n3, t2, e3, r4) {
    return J({ startAngle: n3, endAngle: t2, innerRadius: e3, outerRadius: r4 });
  });
};
var V = function(n2, e2, r3, i2, a2, o3, u, s2) {
  return to([n2, e2, r3, i2, a2, o3, u, s2], function(n3, t2, e3, r4, i3, a3, o4, u2) {
    var s3 = K({ startAngle: n3, endAngle: t2, innerRadius: e3, outerRadius: r4 }, i3, a3, o4), l2 = s3.points, d2 = s3.side, c3 = l2[2];
    return "before" === d2 ? c3.x -= u2 : c3.x += u2, "translate(" + c3.x + "," + c3.y + ")";
  });
};
var X = function(n2) {
  var t2 = n2.data, r3 = n2.offset, a2 = void 0 === r3 ? 0 : r3, o3 = n2.diagonalLength, u = n2.straightLength, s2 = n2.skipAngle, l2 = void 0 === s2 ? 0 : s2, c3 = n2.textOffset, f2 = n2.linkColor, g = n2.textColor, p = Yr(), h = p.animate, v = p.config, A = k(), x = Ye(f2, A), m = Ye(g, A), y2 = function(n3, t3) {
    return (0, import_react.useMemo)(function() {
      return E(n3, t3);
    }, [n3, t3]);
  }(t2, l2), k2 = function(n3) {
    var t3 = n3.offset, e2 = n3.diagonalLength, r4 = n3.straightLength, i2 = n3.textOffset, a3 = n3.getLinkColor, o4 = n3.getTextColor;
    return (0, import_react.useMemo)(function() {
      return { enter: function(n4) {
        return { startAngle: n4.arc.startAngle, endAngle: n4.arc.endAngle, innerRadius: n4.arc.innerRadius, outerRadius: n4.arc.outerRadius, offset: t3, diagonalLength: 0, straightLength: 0, textOffset: i2, linkColor: a3(n4), textColor: o4(n4), opacity: 0 };
      }, update: function(n4) {
        return { startAngle: n4.arc.startAngle, endAngle: n4.arc.endAngle, innerRadius: n4.arc.innerRadius, outerRadius: n4.arc.outerRadius, offset: t3, diagonalLength: e2, straightLength: r4, textOffset: i2, linkColor: a3(n4), textColor: o4(n4), opacity: 1 };
      }, leave: function(n4) {
        return { startAngle: n4.arc.startAngle, endAngle: n4.arc.endAngle, innerRadius: n4.arc.innerRadius, outerRadius: n4.arc.outerRadius, offset: t3, diagonalLength: 0, straightLength: 0, textOffset: i2, linkColor: a3(n4), textColor: o4(n4), opacity: 0 };
      } };
    }, [e2, r4, i2, a3, o4, t3]);
  }({ offset: a2, diagonalLength: o3, straightLength: u, textOffset: c3, getLinkColor: x, getTextColor: m });
  return { transition: useTransition(y2, { keys: function(n3) {
    return n3.id;
  }, initial: k2.update, from: k2.enter, enter: k2.update, update: k2.update, leave: k2.leave, config: v, immediate: !h }), interpolateLink: Q, interpolateTextAnchor: U, interpolateTextPosition: V };
};
var Y = function(n2) {
  var t2 = n2.center, e2 = n2.data, r3 = n2.label, i2 = n2.skipAngle, a2 = n2.offset, o3 = n2.diagonalLength, u = n2.straightLength, l2 = n2.strokeWidth, d2 = n2.textOffset, f2 = n2.textColor, g = n2.linkColor, p = n2.component, h = void 0 === p ? H2 : p, v = un(r3), R = X({ data: e2, skipAngle: i2, offset: a2, diagonalLength: o3, straightLength: u, textOffset: d2, linkColor: g, textColor: f2 }), x = R.transition, m = R.interpolateLink, y2 = R.interpolateTextAnchor, M = R.interpolateTextPosition, k2 = h;
  return (0, import_jsx_runtime.jsx)("g", { transform: "translate(" + t2[0] + "," + t2[1] + ")", children: x(function(n3, t3) {
    return (0, import_react.createElement)(k2, { key: t3.id, datum: t3, label: v(t3), style: b({}, n3, { thickness: l2, path: m(n3.startAngle, n3.endAngle, n3.innerRadius, n3.outerRadius, n3.offset, n3.diagonalLength, n3.straightLength), textAnchor: y2(n3.startAngle, n3.endAngle, n3.innerRadius, n3.outerRadius), textPosition: M(n3.startAngle, n3.endAngle, n3.innerRadius, n3.outerRadius, n3.offset, n3.diagonalLength, n3.straightLength, n3.textOffset) }) });
  }) });
};
var Z = function(n2, t2, e2, r3) {
  n2.textBaseline = "middle", r(n2, e2.labels.text), t2.forEach(function(t3) {
    n2.textAlign = Et.canvas.align[t3.textAnchor], o(n2, b({}, e2.labels.text, { fill: t3.textColor }), String(t3.label), t3.x, t3.y), n2.beginPath(), n2.strokeStyle = t3.linkColor, n2.lineWidth = r3, t3.points.forEach(function(t4, e3) {
      0 === e3 ? n2.moveTo(t4.x, t4.y) : n2.lineTo(t4.x, t4.y);
    }), n2.stroke();
  });
};
var $ = function(n2) {
  var t2 = n2.data, e2 = n2.skipAngle, r3 = void 0 === e2 ? 0 : e2, i2 = n2.offset, a2 = void 0 === i2 ? 0.5 : i2, o3 = n2.diagonalLength, u = n2.straightLength, s2 = n2.computeExtraProps, l2 = void 0 === s2 ? function() {
    return {};
  } : s2, c3 = (0, import_react.useMemo)(function() {
    return t2.filter(function(n3) {
      return Math.abs(It(n3.arc.endAngle - n3.arc.startAngle)) >= r3;
    }).map(function(n3) {
      return b({}, K(n3.arc, a2, o3, u), { data: n3 });
    });
  }, [t2, r3, a2, o3, u]);
  return (0, import_react.useMemo)(function() {
    return c3.map(function(n3) {
      return b({}, l2(n3), n3);
    });
  }, [c3, l2]);
};
var _ = function(n2) {
  var t2 = n2.data, e2 = n2.skipAngle, r3 = n2.offset, a2 = n2.diagonalLength, o3 = n2.straightLength, u = n2.textOffset, s2 = void 0 === u ? 0 : u, l2 = n2.label, d2 = n2.linkColor, c3 = n2.textColor, g = un(l2), p = k(), h = Ye(d2, p), v = Ye(c3, p), R = (0, import_react.useCallback)(function(n3) {
    var t3, e3 = { x: n3.points[2].x, y: n3.points[2].y };
    return "before" === n3.side ? (e3.x -= s2, t3 = "end") : (e3.x += s2, t3 = "start"), b({}, e3, { label: g(n3.data), linkColor: h(n3.data), textAnchor: t3, textColor: v(n3.data) });
  }, [g, h, v, s2]);
  return $({ data: t2, skipAngle: e2, offset: r3, diagonalLength: a2, straightLength: o3, computeExtraProps: R });
};
var rn = function(t2) {
  var e2 = t2.datum, r3 = t2.style, i2 = t2.onClick, a2 = t2.onMouseEnter, o3 = t2.onMouseMove, u = t2.onMouseLeave, l2 = (0, import_react.useCallback)(function(n2) {
    return null == i2 ? void 0 : i2(e2, n2);
  }, [i2, e2]), d2 = (0, import_react.useCallback)(function(n2) {
    return null == a2 ? void 0 : a2(e2, n2);
  }, [a2, e2]), c3 = (0, import_react.useCallback)(function(n2) {
    return null == o3 ? void 0 : o3(e2, n2);
  }, [o3, e2]), g = (0, import_react.useCallback)(function(n2) {
    return null == u ? void 0 : u(e2, n2);
  }, [u, e2]);
  return (0, import_jsx_runtime.jsx)(animated.path, { d: r3.path, opacity: r3.opacity, fill: e2.fill || r3.color, stroke: r3.borderColor, strokeWidth: r3.borderWidth, onClick: i2 ? l2 : void 0, onMouseEnter: a2 ? d2 : void 0, onMouseMove: o3 ? c3 : void 0, onMouseLeave: u ? g : void 0, "data-testid": "arc." + e2.id });
};
var an = function(n2, e2, r3, i2, a2) {
  return to([n2, e2, r3, i2], function(n3, t2, e3, r4) {
    return a2({ startAngle: n3, endAngle: t2, innerRadius: Math.max(0, e3), outerRadius: Math.max(0, r4) });
  });
};
var on = function(n2, t2, r3) {
  void 0 === t2 && (t2 = "innerRadius");
  var i2 = Yr(), a2 = i2.animate, o3 = i2.config, u = j2(t2, r3);
  return { transition: useTransition(n2, { keys: function(n3) {
    return n3.id;
  }, initial: u.update, from: u.enter, enter: u.update, update: u.update, leave: u.leave, config: o3, immediate: !a2 }), interpolate: an };
};
var un2 = function(n2) {
  var t2 = n2.center, e2 = n2.data, r3 = n2.arcGenerator, a2 = n2.borderWidth, o3 = n2.borderColor, u = n2.onClick, l2 = n2.onMouseEnter, d2 = n2.onMouseMove, f2 = n2.onMouseLeave, g = n2.transitionMode, p = n2.component, h = void 0 === p ? rn : p, v = k(), R = Ye(o3, v), A = on(e2, g, { enter: function(n3) {
    return { opacity: 0, color: n3.color, borderColor: R(n3) };
  }, update: function(n3) {
    return { opacity: 1, color: n3.color, borderColor: R(n3) };
  }, leave: function(n3) {
    return { opacity: 0, color: n3.color, borderColor: R(n3) };
  } }), x = A.transition, m = A.interpolate, y2 = h;
  return (0, import_jsx_runtime.jsx)("g", { transform: "translate(" + t2[0] + "," + t2[1] + ")", children: x(function(n3, t3) {
    return (0, import_react.createElement)(y2, { key: t3.id, datum: t3, style: b({}, n3, { borderWidth: a2, path: m(n3.startAngle, n3.endAngle, n3.innerRadius, n3.outerRadius, r3) }), onClick: u, onMouseEnter: l2, onMouseMove: d2, onMouseLeave: f2 });
  }) });
};
var sn = function(n2, t2, e2, r3, i2, a2) {
  void 0 === a2 && (a2 = true);
  var o3 = [], u = Yt(Wt(r3), e2);
  o3.push([u.x, u.y]);
  var s2 = Yt(Wt(i2), e2);
  o3.push([s2.x, s2.y]);
  for (var l2 = Math.round(Math.min(r3, i2)); l2 <= Math.round(Math.max(r3, i2)); l2++) if (l2 % 90 == 0) {
    var d2 = Yt(Wt(l2), e2);
    o3.push([d2.x, d2.y]);
  }
  o3 = o3.map(function(e3) {
    var r4 = e3[0], i3 = e3[1];
    return [n2 + r4, t2 + i3];
  }), a2 && o3.push([n2, t2]);
  var c3 = o3.map(function(n3) {
    return n3[0];
  }), f2 = o3.map(function(n3) {
    return n3[1];
  }), g = Math.min.apply(Math, c3), v = Math.max.apply(Math, c3), R = Math.min.apply(Math, f2);
  return { points: o3, x: g, y: R, width: v - g, height: Math.max.apply(Math, f2) - R };
};
var ln = function(n2, t2, e2, r3, i2, a2) {
  var o3 = fn(i2, a2, n2, t2);
  return o3 < e2 && o3 > r3;
};
var dn = function(n2, t2, e2, r3, i2, a2, o3) {
  if (ln(n2, t2, e2, r3, a2, o3)) {
    var u = hn(a2, o3, n2, t2);
    return i2.find(function(n3) {
      var t3 = n3.startAngle, e3 = n3.endAngle;
      return u >= t3 && u < e3;
    });
  }
};
var fn2 = function(n2) {
  var t2 = void 0 === n2 ? {} : n2, e2 = t2.cornerRadius, r3 = void 0 === e2 ? 0 : e2, i2 = t2.padAngle, a2 = void 0 === i2 ? 0 : i2;
  return (0, import_react.useMemo)(function() {
    return arc_default().innerRadius(function(n3) {
      return n3.innerRadius;
    }).outerRadius(function(n3) {
      return n3.outerRadius;
    }).cornerRadius(r3).padAngle(a2);
  }, [r3, a2]);
};

// node_modules/@nivo/pie/dist/nivo-pie.mjs
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
function E2() {
  return E2 = Object.assign ? Object.assign.bind() : function(e2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var t2 = arguments[i2];
      for (var a2 in t2) ({}).hasOwnProperty.call(t2, a2) && (e2[a2] = t2[a2]);
    }
    return e2;
  }, E2.apply(null, arguments);
}
function F(e2, i2) {
  if (null == e2) return {};
  var t2 = {};
  for (var a2 in e2) if ({}.hasOwnProperty.call(e2, a2)) {
    if (-1 !== i2.indexOf(a2)) continue;
    t2[a2] = e2[a2];
  }
  return t2;
}
var H3;
var X2 = function(e2) {
  var i2 = e2.width, t2 = e2.height, a2 = e2.legends, n2 = e2.data, r3 = e2.toggleSerie;
  return (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: a2.map(function(e3, a3) {
    var o3;
    return (0, import_jsx_runtime2.jsx)(H, E2({}, e3, { containerWidth: i2, containerHeight: t2, data: null != (o3 = e3.data) ? o3 : n2, toggleSerie: e3.toggleSerie ? r3 : void 0 }), a3);
  }) });
};
var Y2 = { id: "id", value: "value", sortByValue: false, innerRadius: 0, padAngle: 0, cornerRadius: 0, layers: ["arcs", "arcLinkLabels", "arcLabels", "legends"], startAngle: 0, endAngle: 360, fit: true, activeInnerRadiusOffset: 0, activeOuterRadiusOffset: 0, borderWidth: 0, borderColor: { from: "color", modifiers: [["darker", 1]] }, enableArcLabels: true, arcLabel: "formattedValue", arcLabelsSkipAngle: 0, arcLabelsSkipRadius: 0, arcLabelsRadiusOffset: 0.5, arcLabelsTextColor: { theme: "labels.text.fill" }, enableArcLinkLabels: true, arcLinkLabel: "id", arcLinkLabelsSkipAngle: 0, arcLinkLabelsOffset: 0, arcLinkLabelsDiagonalLength: 16, arcLinkLabelsStraightLength: 24, arcLinkLabelsThickness: 1, arcLinkLabelsTextOffset: 6, arcLinkLabelsTextColor: { theme: "labels.text.fill" }, arcLinkLabelsColor: { theme: "axis.ticks.line.stroke" }, colors: { scheme: "nivo" }, defs: [], fill: [], isInteractive: true, animate: true, motionConfig: "gentle", transitionMode: "innerRadius", tooltip: function(e2) {
  var i2 = e2.datum;
  return (0, import_jsx_runtime2.jsx)(T, { id: i2.id, value: i2.formattedValue, enableChip: true, color: i2.color });
}, legends: [], role: "img", pixelRatio: "undefined" != typeof window && null != (H3 = window.devicePixelRatio) ? H3 : 1 };
var P2 = ["points"];
var j3 = function(i2) {
  var t2 = i2.data, a2 = i2.id, n2 = void 0 === a2 ? Y2.id : a2, r3 = i2.value, o3 = void 0 === r3 ? Y2.value : r3, s2 = i2.valueFormat, c3 = i2.colors, u = void 0 === c3 ? Y2.colors : c3, v = un(n2), f2 = un(o3), g = xt(s2), L2 = pr(u, "id");
  return (0, import_react2.useMemo)(function() {
    return t2.map(function(e2) {
      var i3, t3 = v(e2), a3 = f2(e2), n3 = { id: t3, label: null != (i3 = e2.label) ? i3 : t3, hidden: false, value: a3, formattedValue: g(a3), data: e2 };
      return E2({}, n3, { color: L2(n3) });
    });
  }, [t2, v, f2, g, L2]);
};
var q2 = function(a2) {
  var n2 = a2.data, r3 = a2.startAngle, o3 = a2.endAngle, d2 = a2.innerRadius, l2 = a2.outerRadius, u = a2.padAngle, v = a2.sortByValue, f2 = a2.activeId, g = a2.activeInnerRadiusOffset, L2 = a2.activeOuterRadiusOffset, h = a2.hiddenIds, b2 = a2.forwardLegendData, A = (0, import_react2.useMemo)(function() {
    var e2 = pie_default().value(function(e3) {
      return e3.value;
    }).startAngle(Wt(r3)).endAngle(Wt(o3)).padAngle(Wt(u));
    return v || e2.sortValues(null), e2;
  }, [r3, o3, u, v]), p = (0, import_react2.useMemo)(function() {
    var e2 = n2.filter(function(e3) {
      return !h.includes(e3.id);
    });
    return { dataWithArc: A(e2).map(function(e3) {
      var i2 = Math.abs(e3.endAngle - e3.startAngle);
      return E2({}, e3.data, { arc: { index: e3.index, startAngle: e3.startAngle, endAngle: e3.endAngle, innerRadius: f2 === e3.data.id ? d2 - g : d2, outerRadius: f2 === e3.data.id ? l2 + L2 : l2, thickness: l2 - d2, padAngle: e3.padAngle, angle: i2, angleDeg: It(i2) } });
    }), legendData: n2.map(function(e3) {
      return { id: e3.id, label: e3.label, color: e3.color, hidden: h.includes(e3.id), data: e3 };
    }) };
  }, [A, n2, h, f2, d2, g, l2, L2]), k2 = p.legendData, R = (0, import_react2.useRef)(b2);
  return (0, import_react2.useEffect)(function() {
    "function" == typeof R.current && R.current(k2);
  }, [R, k2]), p;
};
var z3 = function(e2) {
  var i2 = e2.activeId, t2 = e2.onActiveIdChange, r3 = e2.defaultActiveId, o3 = void 0 !== i2, d2 = (0, import_react2.useState)(o3 ? null : void 0 === r3 ? null : r3), l2 = d2[0], s2 = d2[1];
  return { activeId: o3 ? i2 : l2, setActiveId: (0, import_react2.useCallback)(function(e3) {
    t2 && t2(e3), o3 || s2(e3);
  }, [o3, t2, s2]) };
};
var J2 = function(e2) {
  var i2 = e2.data, t2 = e2.radius, r3 = e2.innerRadius, o3 = e2.startAngle, d2 = void 0 === o3 ? Y2.startAngle : o3, l2 = e2.endAngle, c3 = void 0 === l2 ? Y2.endAngle : l2, u = e2.padAngle, v = void 0 === u ? Y2.padAngle : u, f2 = e2.sortByValue, g = void 0 === f2 ? Y2.sortByValue : f2, L2 = e2.cornerRadius, h = void 0 === L2 ? Y2.cornerRadius : L2, A = e2.activeInnerRadiusOffset, p = void 0 === A ? Y2.activeInnerRadiusOffset : A, k2 = e2.activeOuterRadiusOffset, R = void 0 === k2 ? Y2.activeOuterRadiusOffset : k2, m = e2.activeId, I = e2.onActiveIdChange, O2 = e2.defaultActiveId, C = e2.forwardLegendData, x = z3({ activeId: m, onActiveIdChange: I, defaultActiveId: O2 }), w2 = x.activeId, M = x.setActiveId, y2 = (0, import_react2.useState)([]), S3 = y2[0], W2 = y2[1], T2 = q2({ data: i2, startAngle: d2, endAngle: c3, innerRadius: r3, outerRadius: t2, padAngle: v, sortByValue: g, activeId: w2, activeInnerRadiusOffset: p, activeOuterRadiusOffset: R, hiddenIds: S3, forwardLegendData: C }), D2 = (0, import_react2.useCallback)(function(e3) {
    W2(function(i3) {
      return i3.indexOf(e3) > -1 ? i3.filter(function(i4) {
        return i4 !== e3;
      }) : [].concat(i3, [e3]);
    });
  }, []);
  return E2({}, T2, { arcGenerator: fn2({ cornerRadius: h, padAngle: Wt(v) }), setActiveId: M, toggleSerie: D2 });
};
var K2 = function(i2) {
  var t2 = i2.data, r3 = i2.width, o3 = i2.height, d2 = i2.innerRadius, l2 = void 0 === d2 ? Y2.innerRadius : d2, c3 = i2.startAngle, u = void 0 === c3 ? Y2.startAngle : c3, v = i2.endAngle, f2 = void 0 === v ? Y2.endAngle : v, g = i2.padAngle, L2 = void 0 === g ? Y2.padAngle : g, h = i2.sortByValue, p = void 0 === h ? Y2.sortByValue : h, k2 = i2.cornerRadius, R = void 0 === k2 ? Y2.cornerRadius : k2, m = i2.fit, I = void 0 === m ? Y2.fit : m, O2 = i2.activeInnerRadiusOffset, C = void 0 === O2 ? Y2.activeInnerRadiusOffset : O2, x = i2.activeOuterRadiusOffset, w2 = void 0 === x ? Y2.activeOuterRadiusOffset : x, M = i2.activeId, y2 = i2.onActiveIdChange, S3 = i2.defaultActiveId, W2 = i2.forwardLegendData, T2 = z3({ activeId: M, onActiveIdChange: y2, defaultActiveId: S3 }), D2 = T2.activeId, V2 = T2.setActiveId, B2 = (0, import_react2.useState)([]), G2 = B2[0], H4 = B2[1], X3 = (0, import_react2.useMemo)(function() {
    var e2, i3 = Math.min(r3, o3) / 2, t3 = i3 * Math.min(l2, 1), a2 = r3 / 2, n2 = o3 / 2;
    if (I) {
      var d3 = sn(a2, n2, i3, u - 90, f2 - 90), s2 = d3.points, c4 = F(d3, P2), v2 = Math.min(r3 / c4.width, o3 / c4.height), g2 = { width: c4.width * v2, height: c4.height * v2 };
      g2.x = (r3 - g2.width) / 2, g2.y = (o3 - g2.height) / 2, a2 = (a2 - c4.x) / c4.width * c4.width * v2 + g2.x, n2 = (n2 - c4.y) / c4.height * c4.height * v2 + g2.y, e2 = { box: c4, ratio: v2, points: s2 }, i3 *= v2, t3 *= v2;
    }
    return { centerX: a2, centerY: n2, radius: i3, innerRadius: t3, debug: e2 };
  }, [r3, o3, l2, u, f2, I]), j4 = q2({ data: t2, startAngle: u, endAngle: f2, innerRadius: X3.innerRadius, outerRadius: X3.radius, padAngle: L2, sortByValue: p, activeId: D2, activeInnerRadiusOffset: C, activeOuterRadiusOffset: w2, hiddenIds: G2, forwardLegendData: W2 }), J3 = (0, import_react2.useCallback)(function(e2) {
    H4(function(i3) {
      return i3.indexOf(e2) > -1 ? i3.filter(function(i4) {
        return i4 !== e2;
      }) : [].concat(i3, [e2]);
    });
  }, []);
  return E2({ arcGenerator: fn2({ cornerRadius: R, padAngle: Wt(L2) }), activeId: D2, setActiveId: V2, toggleSerie: J3 }, j4, X3);
};
var N2 = function(i2) {
  var t2 = i2.dataWithArc, a2 = i2.arcGenerator, n2 = i2.centerX, r3 = i2.centerY, o3 = i2.radius, d2 = i2.innerRadius;
  return (0, import_react2.useMemo)(function() {
    return { dataWithArc: t2, arcGenerator: a2, centerX: n2, centerY: r3, radius: o3, innerRadius: d2 };
  }, [t2, a2, n2, r3, o3, d2]);
};
var Q2 = function(i2) {
  var t2 = i2.center, a2 = i2.data, n2 = i2.arcGenerator, o3 = i2.borderWidth, d2 = i2.borderColor, l2 = i2.isInteractive, s2 = i2.onClick, c3 = i2.onMouseEnter, u = i2.onMouseMove, v = i2.onMouseLeave, f2 = i2.setActiveId, g = i2.tooltip, L2 = i2.transitionMode, h = z(), b2 = h.showTooltipFromEvent, A = h.hideTooltip, k2 = (0, import_react2.useMemo)(function() {
    if (l2) return function(e2, i3) {
      null == s2 || s2(e2, i3);
    };
  }, [l2, s2]), R = (0, import_react2.useMemo)(function() {
    if (l2) return function(e2, i3) {
      b2((0, import_react2.createElement)(g, { datum: e2 }), i3), f2(e2.id), null == c3 || c3(e2, i3);
    };
  }, [l2, b2, f2, c3, g]), m = (0, import_react2.useMemo)(function() {
    if (l2) return function(e2, i3) {
      b2((0, import_react2.createElement)(g, { datum: e2 }), i3), null == u || u(e2, i3);
    };
  }, [l2, b2, u, g]), I = (0, import_react2.useMemo)(function() {
    if (l2) return function(e2, i3) {
      A(), f2(null), null == v || v(e2, i3);
    };
  }, [l2, A, f2, v]);
  return (0, import_jsx_runtime2.jsx)(un2, { center: t2, data: a2, arcGenerator: n2, borderWidth: o3, borderColor: d2, transitionMode: L2, onClick: k2, onMouseEnter: R, onMouseMove: m, onMouseLeave: I });
};
var U2 = ["isInteractive", "animate", "motionConfig", "theme", "renderWrapper"];
var Z2 = function(e2) {
  var i2 = e2.data, t2 = e2.id, a2 = void 0 === t2 ? Y2.id : t2, n2 = e2.value, d2 = void 0 === n2 ? Y2.value : n2, l2 = e2.valueFormat, s2 = e2.sortByValue, c3 = void 0 === s2 ? Y2.sortByValue : s2, u = e2.layers, L2 = void 0 === u ? Y2.layers : u, h = e2.startAngle, b2 = void 0 === h ? Y2.startAngle : h, A = e2.endAngle, p = void 0 === A ? Y2.endAngle : A, m = e2.padAngle, I = void 0 === m ? Y2.padAngle : m, O2 = e2.fit, C = void 0 === O2 ? Y2.fit : O2, x = e2.innerRadius, w2 = void 0 === x ? Y2.innerRadius : x, M = e2.cornerRadius, S3 = void 0 === M ? Y2.cornerRadius : M, W2 = e2.activeInnerRadiusOffset, T2 = void 0 === W2 ? Y2.activeInnerRadiusOffset : W2, D2 = e2.activeOuterRadiusOffset, V2 = void 0 === D2 ? Y2.activeOuterRadiusOffset : D2, B2 = e2.width, G2 = e2.height, E3 = e2.margin, F2 = e2.colors, H4 = void 0 === F2 ? Y2.colors : F2, P3 = e2.borderWidth, q3 = void 0 === P3 ? Y2.borderWidth : P3, z4 = e2.borderColor, J3 = void 0 === z4 ? Y2.borderColor : z4, U3 = e2.enableArcLabels, Z3 = void 0 === U3 ? Y2.enableArcLabels : U3, $3 = e2.arcLabel, _3 = void 0 === $3 ? Y2.arcLabel : $3, ee2 = e2.arcLabelsSkipAngle, ie2 = void 0 === ee2 ? Y2.arcLabelsSkipAngle : ee2, te2 = e2.arcLabelsSkipRadius, ae2 = void 0 === te2 ? Y2.arcLabelsSkipRadius : te2, ne = e2.arcLabelsTextColor, re = void 0 === ne ? Y2.arcLabelsTextColor : ne, oe = e2.arcLabelsRadiusOffset, de = void 0 === oe ? Y2.arcLabelsRadiusOffset : oe, le = e2.arcLabelsComponent, se = e2.enableArcLinkLabels, ce = void 0 === se ? Y2.enableArcLinkLabels : se, ue = e2.arcLinkLabel, ve = void 0 === ue ? Y2.arcLinkLabel : ue, fe = e2.arcLinkLabelsSkipAngle, ge = void 0 === fe ? Y2.arcLinkLabelsSkipAngle : fe, Le = e2.arcLinkLabelsOffset, he = void 0 === Le ? Y2.arcLinkLabelsOffset : Le, be = e2.arcLinkLabelsDiagonalLength, Ae = void 0 === be ? Y2.arcLinkLabelsDiagonalLength : be, pe = e2.arcLinkLabelsStraightLength, ke = void 0 === pe ? Y2.arcLinkLabelsStraightLength : pe, Re = e2.arcLinkLabelsThickness, me = void 0 === Re ? Y2.arcLinkLabelsThickness : Re, Ie = e2.arcLinkLabelsTextOffset, Oe = void 0 === Ie ? Y2.arcLinkLabelsTextOffset : Ie, Ce = e2.arcLinkLabelsTextColor, xe = void 0 === Ce ? Y2.arcLinkLabelsTextColor : Ce, we = e2.arcLinkLabelsColor, Me = void 0 === we ? Y2.arcLinkLabelsColor : we, ye = e2.arcLinkLabelComponent, Se = e2.defs, We = void 0 === Se ? Y2.defs : Se, Te = e2.fill, De = void 0 === Te ? Y2.fill : Te, Ve = e2.isInteractive, Be = void 0 === Ve ? Y2.isInteractive : Ve, Ge = e2.onClick, Ee = e2.onMouseEnter, Fe = e2.onMouseMove, He = e2.onMouseLeave, Xe = e2.tooltip, Ye2 = void 0 === Xe ? Y2.tooltip : Xe, Pe = e2.activeId, je = e2.onActiveIdChange, qe = e2.defaultActiveId, ze = e2.transitionMode, Je = void 0 === ze ? Y2.transitionMode : ze, Ke = e2.legends, Ne = void 0 === Ke ? Y2.legends : Ke, Qe = e2.forwardLegendData, Ue = e2.role, Ze = void 0 === Ue ? Y2.role : Ue, $e = _t(B2, G2, E3), _e = $e.outerWidth, ei = $e.outerHeight, ii = $e.margin, ti = $e.innerWidth, ai = $e.innerHeight, ni = j3({ data: i2, id: a2, value: d2, valueFormat: l2, colors: H4 }), ri = K2({ data: ni, width: ti, height: ai, fit: C, innerRadius: w2, startAngle: b2, endAngle: p, padAngle: I, sortByValue: c3, cornerRadius: S3, activeInnerRadiusOffset: T2, activeOuterRadiusOffset: V2, activeId: Pe, onActiveIdChange: je, defaultActiveId: qe, forwardLegendData: Qe }), oi = ri.dataWithArc, di = ri.legendData, li = ri.arcGenerator, si = ri.centerX, ci = ri.centerY, ui = ri.radius, vi = ri.innerRadius, fi = ri.setActiveId, gi = ri.toggleSerie, Li = yn(We, oi, De), hi = { arcs: null, arcLinkLabels: null, arcLabels: null, legends: null };
  L2.includes("arcs") && (hi.arcs = (0, import_jsx_runtime2.jsx)(Q2, { center: [si, ci], data: oi, arcGenerator: li, borderWidth: q3, borderColor: J3, isInteractive: Be, onClick: Ge, onMouseEnter: Ee, onMouseMove: Fe, onMouseLeave: He, setActiveId: fi, tooltip: Ye2, transitionMode: Je }, "arcs")), ce && L2.includes("arcLinkLabels") && (hi.arcLinkLabels = (0, import_jsx_runtime2.jsx)(Y, { center: [si, ci], data: oi, label: ve, skipAngle: ge, offset: he, diagonalLength: Ae, straightLength: ke, strokeWidth: me, textOffset: Oe, textColor: xe, linkColor: Me, component: ye }, "arcLinkLabels")), Z3 && L2.includes("arcLabels") && (hi.arcLabels = (0, import_jsx_runtime2.jsx)(q, { center: [si, ci], data: oi, label: _3, radiusOffset: de, skipAngle: ie2, skipRadius: ae2, textColor: re, transitionMode: Je, component: le }, "arcLabels")), Ne.length > 0 && L2.includes("legends") && (hi.legends = (0, import_jsx_runtime2.jsx)(X2, { width: ti, height: ai, data: di, legends: Ne, toggleSerie: gi }, "legends"));
  var bi = N2({ dataWithArc: oi, arcGenerator: li, centerX: si, centerY: ci, radius: ui, innerRadius: vi });
  return (0, import_jsx_runtime2.jsx)($t, { width: _e, height: ei, margin: ii, defs: Li, role: Ze, children: L2.map(function(e3, i3) {
    return void 0 !== hi[e3] ? hi[e3] : "function" == typeof e3 ? (0, import_jsx_runtime2.jsx)(import_react2.Fragment, { children: (0, import_react2.createElement)(e3, bi) }, i3) : null;
  }) });
};
var $2 = function(e2) {
  var i2 = e2.isInteractive, t2 = void 0 === i2 ? Y2.isInteractive : i2, a2 = e2.animate, n2 = void 0 === a2 ? Y2.animate : a2, r3 = e2.motionConfig, o3 = void 0 === r3 ? Y2.motionConfig : r3, d2 = e2.theme, l2 = e2.renderWrapper, s2 = F(e2, U2);
  return (0, import_jsx_runtime2.jsx)(qr, { animate: n2, isInteractive: t2, motionConfig: o3, renderWrapper: l2, theme: d2, children: (0, import_jsx_runtime2.jsx)(Z2, E2({ isInteractive: t2 }, s2)) });
};
var _2 = function(e2) {
  return (0, import_jsx_runtime2.jsx)(Ot, { children: function(i2) {
    var t2 = i2.width, a2 = i2.height;
    return (0, import_jsx_runtime2.jsx)($2, E2({ width: t2, height: a2 }, e2));
  } });
};
var ee = ["isInteractive", "theme", "renderWrapper"];
var ie = function(a2) {
  var n2 = a2.data, o3 = a2.id, d2 = void 0 === o3 ? Y2.id : o3, l2 = a2.value, s2 = void 0 === l2 ? Y2.value : l2, c3 = a2.valueFormat, u = a2.sortByValue, f2 = void 0 === u ? Y2.sortByValue : u, g = a2.startAngle, L2 = void 0 === g ? Y2.startAngle : g, b2 = a2.endAngle, A = void 0 === b2 ? Y2.endAngle : b2, p = a2.padAngle, k2 = void 0 === p ? Y2.padAngle : p, R = a2.fit, w2 = void 0 === R ? Y2.fit : R, S3 = a2.innerRadius, W2 = void 0 === S3 ? Y2.innerRadius : S3, T2 = a2.cornerRadius, V2 = void 0 === T2 ? Y2.cornerRadius : T2, F2 = a2.activeInnerRadiusOffset, H4 = void 0 === F2 ? Y2.activeInnerRadiusOffset : F2, X3 = a2.activeOuterRadiusOffset, P3 = void 0 === X3 ? Y2.activeOuterRadiusOffset : X3, q3 = a2.width, z4 = a2.height, J3 = a2.margin, N3 = a2.pixelRatio, Q3 = void 0 === N3 ? Y2.pixelRatio : N3, U3 = a2.colors, Z3 = void 0 === U3 ? Y2.colors : U3, $3 = a2.borderWidth, _3 = void 0 === $3 ? Y2.borderWidth : $3, ee2 = a2.borderColor, ie2 = void 0 === ee2 ? Y2.borderColor : ee2, te2 = a2.enableArcLabels, ae2 = void 0 === te2 ? Y2.enableArcLabels : te2, ne = a2.arcLabel, re = void 0 === ne ? Y2.arcLabel : ne, oe = a2.arcLabelsSkipAngle, de = void 0 === oe ? Y2.arcLabelsSkipAngle : oe, le = a2.arcLabelsTextColor, se = void 0 === le ? Y2.arcLabelsTextColor : le, ce = a2.arcLabelsRadiusOffset, ue = void 0 === ce ? Y2.arcLabelsRadiusOffset : ce, ve = a2.enableArcLinkLabels, fe = void 0 === ve ? Y2.enableArcLinkLabels : ve, ge = a2.arcLinkLabel, Le = void 0 === ge ? Y2.arcLinkLabel : ge, he = a2.arcLinkLabelsSkipAngle, be = void 0 === he ? Y2.arcLinkLabelsSkipAngle : he, Ae = a2.arcLinkLabelsOffset, pe = void 0 === Ae ? Y2.arcLinkLabelsOffset : Ae, ke = a2.arcLinkLabelsDiagonalLength, Re = void 0 === ke ? Y2.arcLinkLabelsDiagonalLength : ke, me = a2.arcLinkLabelsStraightLength, Ie = void 0 === me ? Y2.arcLinkLabelsStraightLength : me, Oe = a2.arcLinkLabelsThickness, Ce = void 0 === Oe ? Y2.arcLinkLabelsThickness : Oe, xe = a2.arcLinkLabelsTextOffset, we = void 0 === xe ? Y2.arcLinkLabelsTextOffset : xe, Me = a2.arcLinkLabelsTextColor, ye = void 0 === Me ? Y2.arcLinkLabelsTextColor : Me, Se = a2.arcLinkLabelsColor, We = void 0 === Se ? Y2.arcLinkLabelsColor : Se, Te = a2.isInteractive, De = void 0 === Te ? Y2.isInteractive : Te, Ve = a2.onClick, Be = a2.onMouseMove, Ge = a2.tooltip, Ee = void 0 === Ge ? Y2.tooltip : Ge, Fe = a2.activeId, He = a2.onActiveIdChange, Xe = a2.defaultActiveId, Ye2 = a2.legends, Pe = void 0 === Ye2 ? Y2.legends : Ye2, je = a2.forwardLegendData, qe = (0, import_react2.useRef)(null), ze = k(), Je = _t(q3, z4, J3), Ke = Je.margin, Ne = Je.innerWidth, Qe = Je.innerHeight, Ue = Je.outerWidth, Ze = Je.outerHeight, $e = j3({ data: n2, id: d2, value: s2, valueFormat: c3, colors: Z3 }), _e = K2({ data: $e, width: Ne, height: Qe, fit: w2, innerRadius: W2, startAngle: L2, endAngle: A, padAngle: k2, sortByValue: f2, cornerRadius: V2, activeInnerRadiusOffset: H4, activeOuterRadiusOffset: P3, activeId: Fe, onActiveIdChange: He, defaultActiveId: Xe, forwardLegendData: je }), ei = _e.dataWithArc, ii = _e.arcGenerator, ti = _e.centerX, ai = _e.centerY, ni = _e.radius, ri = _e.innerRadius, oi = _e.setActiveId, di = Ye(ie2, ze), li = D({ data: ei, label: re, skipAngle: de, offset: ue, textColor: se }), si = _({ data: ei, skipAngle: be, offset: pe, diagonalLength: Re, straightLength: Ie, label: Le, linkColor: We, textOffset: we, textColor: ye });
  (0, import_react2.useEffect)(function() {
    if (qe.current) {
      qe.current.width = Ue * Q3, qe.current.height = Ze * Q3;
      var e2 = qe.current.getContext("2d");
      e2.scale(Q3, Q3), e2.fillStyle = ze.background, e2.fillRect(0, 0, Ue, Ze), e2.save(), e2.translate(Ke.left, Ke.top), ii.context(e2), e2.save(), e2.translate(ti, ai), ei.forEach(function(i2) {
        e2.beginPath(), e2.fillStyle = i2.color, e2.strokeStyle = di(i2), e2.lineWidth = _3, ii(i2.arc), e2.fill(), _3 > 0 && e2.stroke();
      }), true === fe && Z(e2, si, ze, Ce), true === ae2 && z2(e2, li, ze), e2.restore(), Pe.forEach(function(i2) {
        j(e2, E2({}, i2, { data: ei, containerWidth: Ne, containerHeight: Qe, theme: ze }));
      });
    }
  }, [qe, Ne, Qe, Ue, Ze, Ke.top, Ke.left, Q3, ti, ai, ii, ei, _3, di, ae2, li, fe, si, Ce, Pe, ze]);
  var ci = (0, import_react2.useMemo)(function() {
    return ei.map(function(e2) {
      return E2({ id: e2.id }, e2.arc);
    });
  }, [ei]), ui = function(e2) {
    if (!qe.current) return null;
    var i2 = gn(qe.current, e2), t2 = i2[0], a3 = i2[1], n3 = dn(Ke.left + ti, Ke.top + ai, ni, ri, ci, t2, a3);
    return n3 ? ei.find(function(e3) {
      return e3.id === n3.id;
    }) : null;
  }, vi = z(), fi = vi.showTooltipFromEvent, gi = vi.hideTooltip, Li = function(e2) {
    var i2 = ui(e2);
    i2 ? (null == Be || Be(i2, e2), oi(i2.id), fi((0, import_react2.createElement)(Ee, { datum: i2 }), e2)) : (oi(null), gi());
  };
  return (0, import_jsx_runtime2.jsx)("canvas", { ref: qe, width: Ue * Q3, height: Ze * Q3, style: { width: Ue, height: Ze, cursor: De ? "auto" : "normal" }, onMouseEnter: De ? Li : void 0, onMouseMove: De ? Li : void 0, onMouseLeave: De ? function() {
    gi();
  } : void 0, onClick: De ? function(e2) {
    if (Ve) {
      var i2 = ui(e2);
      i2 && Ve(i2, e2);
    }
  } : void 0 });
};
var te = function(e2) {
  var i2 = e2.isInteractive, t2 = void 0 === i2 ? Y2.isInteractive : i2, a2 = e2.theme, n2 = e2.renderWrapper, r3 = F(e2, ee);
  return (0, import_jsx_runtime2.jsx)(qr, { isInteractive: t2, renderWrapper: n2, theme: a2, children: (0, import_jsx_runtime2.jsx)(ie, E2({ isInteractive: t2 }, r3)) });
};
var ae = function(e2) {
  return (0, import_jsx_runtime2.jsx)(Ot, { children: function(i2) {
    var t2 = i2.width, a2 = i2.height;
    return (0, import_jsx_runtime2.jsx)(te, E2({ width: t2, height: a2 }, e2));
  } });
};
export {
  $2 as Pie,
  te as PieCanvas,
  _2 as ResponsivePie,
  ae as ResponsivePieCanvas,
  Y2 as defaultProps,
  j3 as useNormalizedData,
  J2 as usePie,
  q2 as usePieArcs,
  K2 as usePieFromBox,
  N2 as usePieLayerContext
};
//# sourceMappingURL=@nivo_pie.js.map
