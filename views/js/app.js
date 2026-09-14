"use strict";
(() => {
  // node_modules/preact/dist/preact.module.js
  var n;
  var l;
  var u;
  var t;
  var i;
  var r;
  var o;
  var e;
  var f;
  var c;
  var a;
  var s;
  var h;
  var p;
  var v;
  var y;
  var d = {};
  var w = [];
  var _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  var g = Array.isArray;
  function m(n2, l3) {
    for (var u4 in l3) n2[u4] = l3[u4];
    return n2;
  }
  function b(n2) {
    n2 && n2.parentNode && n2.parentNode.removeChild(n2);
  }
  function k(l3, u4, t3) {
    var i3, r3, o3, e3 = {};
    for (o3 in u4) "key" == o3 ? i3 = u4[o3] : "ref" == o3 ? r3 = u4[o3] : e3[o3] = u4[o3];
    if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps) for (o3 in l3.defaultProps) void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
    return x(l3, e3, i3, r3, null);
  }
  function x(n2, t3, i3, r3, o3) {
    var e3 = { type: n2, props: t3, key: i3, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
    return null == o3 && null != l.vnode && l.vnode(e3), e3;
  }
  function S(n2) {
    return n2.children;
  }
  function C(n2, l3) {
    this.props = n2, this.context = l3;
  }
  function $(n2, l3) {
    if (null == l3) return n2.__ ? $(n2.__, n2.__i + 1) : null;
    for (var u4; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) return u4.__e;
    return "function" == typeof n2.type ? $(n2) : null;
  }
  function I(n2) {
    if (n2.__P && n2.__d) {
      var u4 = n2.__v, t3 = u4.__e, i3 = [], r3 = [], o3 = m({}, u4);
      o3.__v = u4.__v + 1, l.vnode && l.vnode(o3), q(n2.__P, o3, u4, n2.__n, n2.__P.namespaceURI, 32 & u4.__u ? [t3] : null, i3, null == t3 ? $(u4) : t3, !!(32 & u4.__u), r3), o3.__v = u4.__v, o3.__.__k[o3.__i] = o3, D(i3, o3, r3), u4.__e = u4.__ = null, o3.__e != t3 && P(o3);
    }
  }
  function P(n2) {
    if (null != (n2 = n2.__) && null != n2.__c) return n2.__e = n2.__c.base = null, n2.__k.some(function(l3) {
      if (null != l3 && null != l3.__e) return n2.__e = n2.__c.base = l3.__e;
    }), P(n2);
  }
  function A(n2) {
    (!n2.__d && (n2.__d = true) && i.push(n2) && !H.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(H);
  }
  function H() {
    try {
      for (var n2, l3 = 1; i.length; ) i.length > l3 && i.sort(e), n2 = i.shift(), l3 = i.length, I(n2);
    } finally {
      i.length = H.__r = 0;
    }
  }
  function L(n2, l3, u4, t3, i3, r3, o3, e3, f4, c3, a3) {
    var s3, h3, p3, v3, y3, _2, g2 = t3 && t3.__k || w, m3 = l3.length;
    for (f4 = T(u4, l3, g2, f4, m3), s3 = 0; s3 < m3; s3++) null != (p3 = u4.__k[s3]) && (h3 = -1 != p3.__i && g2[p3.__i] || d, p3.__i = s3, _2 = q(n2, p3, h3, i3, r3, o3, e3, f4, c3, a3), v3 = p3.__e, p3.ref && h3.ref != p3.ref && (h3.ref && J(h3.ref, null, p3), a3.push(p3.ref, p3.__c || v3, p3)), null == y3 && null != v3 && (y3 = v3), 4 & p3.__u ? (f4 = j(p3, f4, n2), h3.__e && (h3.__e = null)) : "function" == typeof p3.type && void 0 !== _2 ? f4 = _2 : v3 && (f4 = v3.nextSibling), p3.__u &= -7);
    return u4.__e = y3, f4;
  }
  function T(n2, l3, u4, t3, i3) {
    var r3, o3, e3, f4, c3, a3 = u4.length, s3 = a3, h3 = 0;
    for (n2.__k = new Array(i3), r3 = 0; r3 < i3; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? ("string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? o3 = n2.__k[r3] = x(null, o3, null, null, null) : g(o3) ? o3 = n2.__k[r3] = x(S, { children: o3 }, null, null, null) : void 0 === o3.constructor && o3.__b > 0 ? o3 = n2.__k[r3] = x(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : n2.__k[r3] = o3, f4 = r3 + h3, o3.__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = O(o3, u4, f4, s3)) && (s3--, (e3 = u4[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i3 > a3 ? h3-- : i3 < a3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f4 && (c3 == f4 - 1 ? h3-- : c3 == f4 + 1 ? h3++ : (c3 > f4 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
    if (s3) for (r3 = 0; r3 < a3; r3++) null != (e3 = u4[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = $(e3)), K(e3, e3));
    return t3;
  }
  function j(n2, l3, u4) {
    var t3, i3;
    if ("function" == typeof n2.type) {
      for (t3 = n2.__k, i3 = 0; t3 && i3 < t3.length; i3++) t3[i3] && (t3[i3].__ = n2, l3 = j(t3[i3], l3, u4));
      return l3;
    }
    n2.__e != l3 && (l3 && n2.type && !l3.parentNode && (l3 = $(n2)), l3 = u4.insertBefore(n2.__e, l3 || null));
    do {
      l3 = l3 && l3.nextSibling;
    } while (null != l3 && 8 == l3.nodeType);
    return l3;
  }
  function O(n2, l3, u4, t3) {
    var i3, r3, o3, e3 = n2.key, f4 = n2.type, c3 = l3[u4], a3 = null != c3 && 0 == (2 & c3.__u);
    if (null === c3 && null == e3 || a3 && e3 == c3.key && f4 == c3.type) return u4;
    if (t3 > (a3 ? 1 : 0)) {
      for (i3 = u4 - 1, r3 = u4 + 1; i3 >= 0 || r3 < l3.length; ) if (null != (c3 = l3[o3 = i3 >= 0 ? i3-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f4 == c3.type) return o3;
    }
    return -1;
  }
  function z(n2, l3, u4) {
    "-" == l3[0] ? n2.setProperty(l3, null == u4 ? "" : u4) : n2[l3] = null == u4 ? "" : "number" != typeof u4 || _.test(l3) ? u4 : u4 + "px";
  }
  function N(n2, l3, u4, t3, i3) {
    var r3, o3;
    n: if ("style" == l3) if ("string" == typeof u4) n2.style.cssText = u4;
    else {
      if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u4 && l3 in u4 || z(n2.style, l3, "");
      if (u4) for (l3 in u4) t3 && u4[l3] == t3[l3] || z(n2.style, l3, u4[l3]);
    }
    else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(s, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u4, u4 ? t3 ? u4[a] = t3[a] : (u4[a] = h, n2.addEventListener(l3, r3 ? v : p, r3)) : n2.removeEventListener(l3, r3 ? v : p, r3);
    else {
      if ("http://www.w3.org/2000/svg" == i3) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
        n2[l3] = null == u4 ? "" : u4;
        break n;
      } catch (n3) {
      }
      "function" == typeof u4 || (null == u4 || false === u4 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u4 ? "" : u4));
    }
  }
  function V(n2) {
    return function(u4) {
      if (this.l) {
        var t3 = this.l[u4.type + n2];
        if (null == u4[c]) u4[c] = h++;
        else if (u4[c] < t3[a]) return;
        return t3(l.event ? l.event(u4) : u4);
      }
    };
  }
  function q(n2, u4, t3, i3, r3, o3, e3, f4, c3, a3) {
    var s3, h3, p3, v3, y3, d3, _2, k3, x2, M, I2, P2, A2, H2, T2, j3, F = u4.type;
    if (void 0 !== u4.constructor) return null;
    128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f4 = u4.__e = t3.__e]), (s3 = l.__b) && s3(u4);
    n: if ("function" == typeof F) {
      h3 = e3.length;
      try {
        if (x2 = u4.props, M = F.prototype && F.prototype.render, I2 = (s3 = F.contextType) && i3[s3.__c], P2 = s3 ? I2 ? I2.props.value : s3.__ : i3, t3.__c ? k3 = (p3 = u4.__c = t3.__c).__ = p3.__E : (M ? u4.__c = p3 = new F(x2, P2) : (u4.__c = p3 = new C(x2, P2), p3.constructor = F, p3.render = Q), I2 && I2.sub(p3), p3.state || (p3.state = {}), p3.__n = i3, v3 = p3.__d = true, p3.__h = [], p3._sb = []), M && null == p3.__s && (p3.__s = p3.state), M && null != F.getDerivedStateFromProps && (p3.__s == p3.state && (p3.__s = m({}, p3.__s)), m(p3.__s, F.getDerivedStateFromProps(x2, p3.__s))), y3 = p3.props, d3 = p3.state, p3.__v = u4, v3) M && null == F.getDerivedStateFromProps && null != p3.componentWillMount && p3.componentWillMount(), M && null != p3.componentDidMount && p3.__h.push(p3.componentDidMount);
        else {
          if (M && null == F.getDerivedStateFromProps && x2 !== y3 && null != p3.componentWillReceiveProps && p3.componentWillReceiveProps(x2, P2), u4.__v == t3.__v || !p3.__e && null != p3.shouldComponentUpdate && false === p3.shouldComponentUpdate(x2, p3.__s, P2)) {
            u4.__v != t3.__v && (p3.props = x2, p3.state = p3.__s, p3.__d = false), u4.__e = t3.__e, u4.__k = t3.__k, u4.__k.some(function(n3) {
              n3 && (n3.__ = u4);
            }), w.push.apply(p3.__h, p3._sb), p3._sb = [], p3.__h.length && e3.push(p3), f4 = $(t3);
            break n;
          }
          null != p3.componentWillUpdate && p3.componentWillUpdate(x2, p3.__s, P2), M && null != p3.componentDidUpdate && p3.__h.push(function() {
            p3.componentDidUpdate(y3, d3, _2);
          });
        }
        if (p3.context = P2, p3.props = x2, p3.__P = n2, p3.__e = false, A2 = l.__r, H2 = 0, M) p3.state = p3.__s, p3.__d = false, A2 && A2(u4), s3 = p3.render(p3.props, p3.state, p3.context), w.push.apply(p3.__h, p3._sb), p3._sb = [];
        else do {
          p3.__d = false, A2 && A2(u4), s3 = p3.render(p3.props, p3.state, p3.context), p3.state = p3.__s;
        } while (p3.__d && ++H2 < 25);
        p3.state = p3.__s, null != p3.getChildContext && (i3 = m(m({}, i3), p3.getChildContext())), M && !v3 && null != p3.getSnapshotBeforeUpdate && (_2 = p3.getSnapshotBeforeUpdate(y3, d3)), T2 = null != s3 && s3.type === S && null == s3.key ? E(s3.props.children) : s3, f4 = L(n2, g(T2) ? T2 : [T2], u4, t3, i3, r3, o3, e3, f4, c3, a3), p3.base = u4.__e, u4.__u &= -161, p3.__h.length && e3.push(p3), k3 && (p3.__E = p3.__ = null);
      } catch (n3) {
        if (e3.length = h3, u4.__v = null, c3 || null != o3) {
          if (n3.then) {
            for (u4.__u |= c3 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; ) f4 = f4.nextSibling;
            null != o3 && (o3[o3.indexOf(f4)] = null), u4.__e = f4;
          } else if (null != o3) for (j3 = o3.length; j3--; ) b(o3[j3]);
        } else u4.__e = t3.__e;
        null == u4.__k && (u4.__k = t3.__k || []), n3.then || B(u4), l.__e(n3, u4, t3);
      }
    } else null == o3 && u4.__v == t3.__v ? (u4.__k = t3.__k, u4.__e = t3.__e) : f4 = u4.__e = G(t3.__e, u4, t3, i3, r3, o3, e3, c3, a3);
    return (s3 = l.diffed) && s3(u4), 128 & u4.__u ? void 0 : f4;
  }
  function B(n2) {
    n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(B));
  }
  function D(n2, u4, t3) {
    for (var i3 = 0; i3 < t3.length; i3++) J(t3[i3], t3[++i3], t3[++i3]);
    l.__c && l.__c(u4, n2), n2.some(function(u5) {
      try {
        n2 = u5.__h, u5.__h = [], n2.some(function(n3) {
          n3.call(u5);
        });
      } catch (n3) {
        l.__e(n3, u5.__v);
      }
    });
  }
  function E(n2) {
    return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : g(n2) ? n2.map(E) : void 0 !== n2.constructor ? null : m({}, n2);
  }
  function G(u4, t3, i3, r3, o3, e3, f4, c3, a3) {
    var s3, h3, p3, v3, y3, w3, _2, m3 = i3.props || d, k3 = t3.props, x2 = t3.type;
    if ("svg" == x2 ? o3 = "http://www.w3.org/2000/svg" : "math" == x2 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
      for (s3 = 0; s3 < e3.length; s3++) if ((y3 = e3[s3]) && "setAttribute" in y3 == !!x2 && (x2 ? y3.localName == x2 : 3 == y3.nodeType)) {
        u4 = y3, e3[s3] = null;
        break;
      }
    }
    if (null == u4) {
      if (null == x2) return document.createTextNode(k3);
      u4 = document.createElementNS(o3, x2, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
    }
    if (null == x2) m3 === k3 || c3 && u4.data == k3 || (u4.data = k3);
    else {
      if (e3 = "textarea" == x2 && null != k3.defaultValue ? null : e3 && n.call(u4.childNodes), !c3 && null != e3) for (m3 = {}, s3 = 0; s3 < u4.attributes.length; s3++) m3[(y3 = u4.attributes[s3]).name] = y3.value;
      for (s3 in m3) y3 = m3[s3], "dangerouslySetInnerHTML" == s3 ? p3 = y3 : "children" == s3 || s3 in k3 || "value" == s3 && "defaultValue" in k3 || "checked" == s3 && "defaultChecked" in k3 || N(u4, s3, null, y3, o3);
      for (s3 in k3) y3 = k3[s3], "children" == s3 ? v3 = y3 : "dangerouslySetInnerHTML" == s3 ? h3 = y3 : "value" == s3 ? w3 = y3 : "checked" == s3 ? _2 = y3 : c3 && "function" != typeof y3 || m3[s3] === y3 || N(u4, s3, y3, m3[s3], o3);
      if (h3) c3 || p3 && (h3.__html == p3.__html || h3.__html == u4.innerHTML) || (u4.innerHTML = h3.__html), t3.__k = [];
      else if (p3 && (u4.innerHTML = ""), L("template" == t3.type ? u4.content : u4, g(v3) ? v3 : [v3], t3, i3, r3, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o3, e3, f4, e3 ? e3[0] : i3.__k && $(i3, 0), c3, a3), null != e3) for (s3 = e3.length; s3--; ) b(e3[s3]);
      c3 && "textarea" != x2 || (s3 = "value", "progress" == x2 && null == w3 ? u4.removeAttribute("value") : null != w3 && (w3 !== u4[s3] || "progress" == x2 && !w3 || "option" == x2 && w3 != m3[s3]) && N(u4, s3, w3, m3[s3], o3), s3 = "checked", null != _2 && _2 != u4[s3] && N(u4, s3, _2, m3[s3], o3));
    }
    return u4;
  }
  function J(n2, u4, t3) {
    try {
      if ("function" == typeof n2) {
        var i3 = "function" == typeof n2.__u;
        i3 && n2.__u(), i3 && null == u4 || (n2.__u = n2(u4));
      } else n2.current = u4;
    } catch (n3) {
      l.__e(n3, t3);
    }
  }
  function K(n2, u4, t3) {
    var i3, r3;
    if (l.unmount && l.unmount(n2), (i3 = n2.ref) && (i3.current && i3.current != n2.__e || J(i3, null, u4)), null != (i3 = n2.__c)) {
      if (i3.componentWillUnmount) try {
        i3.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u4);
      }
      i3.base = i3.__P = i3.__n = null;
    }
    if (i3 = n2.__k) for (r3 = 0; r3 < i3.length; r3++) i3[r3] && K(i3[r3], u4, t3 || "function" != typeof n2.type);
    t3 || b(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
  }
  function Q(n2, l3, u4) {
    return this.constructor(n2, u4);
  }
  function R(u4, t3, i3) {
    var r3, o3, e3, f4;
    t3 == document && (t3 = document.documentElement), l.__ && l.__(u4, t3), o3 = (r3 = "function" == typeof i3) ? null : i3 && i3.__k || t3.__k, e3 = [], f4 = [], q(t3, u4 = (!r3 && i3 || t3).__k = k(S, null, [u4]), o3 || d, d, t3.namespaceURI, !r3 && i3 ? [i3] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i3 ? i3 : o3 ? o3.__e : t3.firstChild, r3, f4), D(e3, u4, f4), u4.props.children = null;
  }
  n = w.slice, l = { __e: function(n2, l3, u4, t3) {
    for (var i3, r3, o3; l3 = l3.__; ) if ((i3 = l3.__c) && !i3.__) try {
      if ((r3 = i3.constructor) && null != r3.getDerivedStateFromError && (i3.setState(r3.getDerivedStateFromError(n2)), o3 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n2, t3 || {}), o3 = i3.__d), o3) return i3.__E = i3;
    } catch (l4) {
      n2 = l4;
    }
    throw n2;
  } }, u = 0, t = function(n2) {
    return null != n2 && void 0 === n2.constructor;
  }, C.prototype.setState = function(n2, l3) {
    var u4;
    u4 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m({}, this.state), "function" == typeof n2 && (n2 = n2(m({}, u4), this.props)), n2 && m(u4, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), A(this));
  }, C.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), A(this));
  }, C.prototype.render = S, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
    return n2.__v.__b - l3.__v.__b;
  }, H.__r = 0, f = Math.random().toString(8), c = "__d" + f, a = "__a" + f, s = /(PointerCapture)$|Capture$/i, h = 0, p = V(false), v = V(true), y = 0;

  // node_modules/preact/hooks/dist/hooks.module.js
  var t2;
  var r2;
  var u2;
  var i2;
  var o2 = 0;
  var f2 = [];
  var c2 = l;
  var e2 = c2.__b;
  var a2 = c2.__r;
  var v2 = c2.diffed;
  var l2 = c2.__c;
  var m2 = c2.unmount;
  var p2 = c2.__;
  function s2(n2, t3) {
    c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
    var u4 = r2.__H || (r2.__H = { __: [], __h: [] });
    return n2 >= u4.__.length && u4.__.push({}), u4.__[n2];
  }
  function d2(n2) {
    return o2 = 1, y2(D2, n2);
  }
  function y2(n2, u4, i3) {
    var o3 = s2(t2++, 2);
    if (o3.t = n2, !o3.__c && (o3.__ = [i3 ? i3(u4) : D2(void 0, u4), function(n3) {
      var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
      t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
    }], o3.__c = r2, !r2.__f)) {
      var f4 = function(n3, t3, r3) {
        if (!o3.__c.__H) return true;
        var u5 = false, i4 = o3.__c.props !== n3;
        if (o3.__c.__H.__.some(function(n4) {
          if (n4.__N) {
            u5 = true;
            var t4 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i4 = true);
          }
        }), c3) {
          var f5 = c3.call(this, n3, t3, r3);
          return u5 ? f5 || i4 : f5;
        }
        return !u5 || i4;
      };
      r2.__f = true;
      var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
      r2.componentWillUpdate = function(n3, t3, r3) {
        if (this.__e) {
          var u5 = c3;
          c3 = void 0, f4(n3, t3, r3), c3 = u5;
        }
        e3 && e3.call(this, n3, t3, r3);
      }, r2.shouldComponentUpdate = f4;
    }
    return o3.__N || o3.__;
  }
  function h2(n2, u4) {
    var i3 = s2(t2++, 3);
    !c2.__s && C2(i3.__H, u4) && (i3.__ = n2, i3.u = u4, r2.__H.__h.push(i3));
  }
  function j2() {
    for (var n2; n2 = f2.shift(); ) {
      var t3 = n2.__H;
      if (n2.__P && t3) try {
        t3.__h.some(z2), t3.__h.some(B2), t3.__h = [];
      } catch (r3) {
        t3.__h = [], c2.__e(r3, n2.__v);
      }
    }
  }
  c2.__b = function(n2) {
    r2 = null, e2 && e2(n2);
  }, c2.__ = function(n2, t3) {
    n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), p2 && p2(n2, t3);
  }, c2.__r = function(n2) {
    a2 && a2(n2), t2 = 0;
    var i3 = (r2 = n2.__c).__H;
    i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.some(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
    })) : (i3.__h.some(z2), i3.__h.some(B2), i3.__h = [], t2 = 0)), u2 = r2;
  }, c2.diffed = function(n2) {
    v2 && v2(n2);
    var t3 = n2.__c;
    t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.some(function(n3) {
      n3.u && (n3.__H = n3.u, n3.u = void 0);
    })), u2 = r2 = null;
  }, c2.__c = function(n2, t3) {
    t3.some(function(n3) {
      try {
        n3.__h.some(z2), n3.__h = n3.__h.filter(function(n4) {
          return !n4.__ || B2(n4);
        });
      } catch (r3) {
        t3.some(function(n4) {
          n4.__h && (n4.__h = []);
        }), t3 = [], c2.__e(r3, n3.__v);
      }
    }), l2 && l2(n2, t3);
  }, c2.unmount = function(n2) {
    m2 && m2(n2);
    var t3, r3 = n2.__c;
    r3 && r3.__H && (r3.__H.__.some(function(n3) {
      try {
        z2(n3);
      } catch (n4) {
        t3 = n4;
      }
    }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
  };
  var k2 = "function" == typeof requestAnimationFrame;
  function w2(n2) {
    var t3, r3 = function() {
      clearTimeout(u4), k2 && cancelAnimationFrame(t3), setTimeout(n2);
    }, u4 = setTimeout(r3, 35);
    k2 && (t3 = requestAnimationFrame(r3));
  }
  function z2(n2) {
    var t3 = r2, u4 = n2.__c;
    "function" == typeof u4 && (n2.__c = void 0, u4()), r2 = t3;
  }
  function B2(n2) {
    var t3 = r2;
    n2.__c = n2.__(), r2 = t3;
  }
  function C2(n2, t3) {
    return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
      return t4 !== n2[r3];
    });
  }
  function D2(n2, t3) {
    return "function" == typeof t3 ? t3(n2) : t3;
  }

  // node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
  var f3 = 0;
  function u3(e3, t3, n2, o3, i3, u4) {
    t3 || (t3 = {});
    var a3, c3, p3 = t3;
    if ("ref" in p3) for (c3 in p3 = {}, t3) "ref" == c3 ? a3 = t3[c3] : p3[c3] = t3[c3];
    var l3 = { type: e3, props: p3, key: n2, ref: a3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i3, __self: u4 };
    if ("function" == typeof e3 && (a3 = e3.defaultProps)) for (c3 in a3) void 0 === p3[c3] && (p3[c3] = a3[c3]);
    return l.vnode && l.vnode(l3), l3;
  }

  // src/views/components/FlowStepper.tsx
  function FlowStepper({ hasInquiry }) {
    return /* @__PURE__ */ u3("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ u3(
        "div",
        {
          id: "step-flow-inq",
          className: `flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold transition-all ${hasInquiry ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-accent-50 text-accent-600 border border-accent-200/60"}`,
          children: hasInquiry ? /* @__PURE__ */ u3(S, { children: [
            /* @__PURE__ */ u3("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", children: [
              /* @__PURE__ */ u3("circle", { cx: "8", cy: "8", r: "7", fill: "#10b981" }),
              /* @__PURE__ */ u3(
                "path",
                {
                  d: "M5 8.2l2 2 4-4",
                  stroke: "#fff",
                  strokeWidth: "1.8",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              )
            ] }),
            /* @__PURE__ */ u3("span", { children: "Flow 1: Inquiry Selesai" })
          ] }) : /* @__PURE__ */ u3(S, { children: [
            /* @__PURE__ */ u3("span", { className: "w-5 h-5 rounded-full bg-accent-500 text-white flex items-center justify-center text-[10px] font-bold", children: "1" }),
            /* @__PURE__ */ u3("span", { children: "Flow 1: Inquiry (Cek Tagihan)" })
          ] })
        }
      ),
      /* @__PURE__ */ u3(
        "svg",
        {
          className: "text-ink-800/25 shrink-0",
          width: "14",
          height: "14",
          viewBox: "0 0 16 16",
          fill: "none",
          children: /* @__PURE__ */ u3(
            "path",
            {
              d: "M6 3l5 5-5 5",
              stroke: "currentColor",
              strokeWidth: "1.5",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        }
      ),
      /* @__PURE__ */ u3(
        "div",
        {
          id: "step-flow-pay",
          className: `flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold transition-all ${hasInquiry ? "bg-accent-50 text-accent-600 border border-accent-200/60" : "bg-black/[0.03] text-ink-800/45 border border-transparent"}`,
          children: [
            /* @__PURE__ */ u3(
              "span",
              {
                className: `w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${hasInquiry ? "bg-accent-500 text-white" : "bg-black/10 text-ink-800/60"}`,
                children: "2"
              }
            ),
            /* @__PURE__ */ u3("span", { children: [
              "Flow 2: ",
              hasInquiry ? "Siap Dibayar" : "Payment (Bayar Tagihan)"
            ] })
          ]
        }
      )
    ] });
  }

  // src/views/components/Header.tsx
  function Header({ currentTab }) {
    const title = currentTab === "inquiry" ? "Bayar Tagihan" : "Riwayat Transaksi";
    const subtitle = currentTab === "inquiry" ? "Inquiry & pembayaran tagihan PDAM" : "Daftar pembayaran & unduh struk transaksi";
    return /* @__PURE__ */ u3("header", { className: "print:hidden h-16 sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] flex items-center justify-between px-6", children: [
      /* @__PURE__ */ u3("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ u3(
          "a",
          {
            href: "/",
            className: "md:hidden flex items-center gap-2 shrink-0",
            title: "PT. Bimasakti Multi Sinergi",
            children: [
              /* @__PURE__ */ u3(
                "img",
                {
                  src: "/images/logo.png",
                  alt: "Bimasakti",
                  className: "h-7 w-auto object-contain shrink-0"
                }
              ),
              /* @__PURE__ */ u3("span", { className: "text-[12px] font-bold text-ink-950", children: "PT. Bimasakti" })
            ]
          }
        ),
        /* @__PURE__ */ u3("div", { className: "min-w-0", children: [
          /* @__PURE__ */ u3(
            "h1",
            {
              id: "page-title",
              className: "text-[15px] font-bold tracking-tight truncate",
              children: title
            }
          ),
          /* @__PURE__ */ u3(
            "p",
            {
              id: "page-subtitle",
              className: "text-[11px] text-ink-800/45 truncate",
              children: subtitle
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ u3("div", { className: "w-8 h-8 rounded-full bg-mist-200 flex items-center justify-center text-[11px] font-bold text-ink-800/70", children: "OP" }) })
    ] });
  }

  // src/views/components/ui/badge.tsx
  function Badge({
    variant = "default",
    className = "",
    children,
    ...props
  }) {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors";
    const variantClasses = {
      default: "bg-ink-950 text-white",
      success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
      warning: "bg-amber-50 text-amber-700 border border-amber-200/60",
      danger: "bg-red-50 text-red-700 border border-red-200/60",
      accent: "bg-accent-50 text-accent-600 border border-accent-200/60",
      outline: "bg-black/[0.04] text-ink-800/70 border border-black/[0.08]"
    }[variant];
    return /* @__PURE__ */ u3(
      "span",
      {
        className: `${baseClasses} ${variantClasses} ${className}`,
        ...props,
        children
      }
    );
  }

  // src/views/components/ui/button.tsx
  function Button({
    variant = "default",
    size = "md",
    isLoading = false,
    className = "",
    disabled = false,
    children,
    ...props
  }) {
    const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";
    const sizeClasses = {
      sm: "h-7 px-3 text-xs",
      md: "h-10 px-4 text-[13px]",
      lg: "h-11 px-5 text-sm",
      icon: "w-7 h-7 p-0 rounded-full"
    }[size];
    const variantClasses = {
      default: "bg-ink-950 hover:bg-black text-white shadow-xs",
      primary: "bg-accent-500 hover:bg-accent-600 text-white shadow-sm shadow-accent-500/20",
      outline: "border border-black/[0.1] hover:bg-mist-50 text-ink-900 shadow-xs",
      secondary: "bg-mist-50 hover:bg-mist-100/80 border border-black/[0.06] text-ink-900",
      ghost: "text-ink-800/60 hover:text-ink-900 hover:bg-black/[0.04]",
      danger: "bg-red-500 hover:bg-red-600 text-white shadow-xs"
    }[variant];
    return /* @__PURE__ */ u3(
      "button",
      {
        disabled: disabled || isLoading,
        className: `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`,
        ...props,
        children: [
          isLoading ? /* @__PURE__ */ u3(
            "svg",
            {
              className: "animate-spin -ml-1 mr-2 h-4 w-4 text-current",
              fill: "none",
              viewBox: "0 0 16 16",
              children: [
                /* @__PURE__ */ u3(
                  "circle",
                  {
                    cx: "8",
                    cy: "8",
                    r: "6.5",
                    stroke: "currentColor",
                    strokeOpacity: "0.25",
                    strokeWidth: "2"
                  }
                ),
                /* @__PURE__ */ u3(
                  "path",
                  {
                    d: "M14.5 8A6.5 6.5 0 0 0 8 1.5",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round"
                  }
                )
              ]
            }
          ) : null,
          children
        ]
      }
    );
  }

  // src/views/components/ui/card.tsx
  function Card({
    className = "",
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3(
      "div",
      {
        className: `bg-white rounded-2xl border border-black/[0.06] shadow-xs overflow-hidden ${className}`,
        ...props,
        children
      }
    );
  }

  // src/views/components/ui/dialog.tsx
  function Dialog({
    isOpen,
    onClose,
    children,
    id,
    className = ""
  }) {
    if (!isOpen) return null;
    return /* @__PURE__ */ u3(
      "div",
      {
        id,
        onClick: (e3) => {
          if (e3.target === e3.currentTarget) onClose();
        },
        className: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm print:static print:p-0 print:bg-transparent ${className}`,
        children
      }
    );
  }
  function DialogContent({
    className = "",
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3(
      "div",
      {
        className: `bg-white rounded-2xl max-w-md w-full shadow-2xl border border-black/[0.08] overflow-hidden print:w-full print:max-w-none print:shadow-none print:border-none print:p-0 ${className}`,
        ...props,
        children
      }
    );
  }
  function DialogHeader({
    className = "",
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3(
      "div",
      {
        className: `px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-mist-50/40 print:hidden ${className}`,
        ...props,
        children
      }
    );
  }
  function DialogTitle({
    className = "",
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3("h3", { className: `text-sm font-bold text-ink-900 ${className}`, ...props, children });
  }
  function DialogFooter({
    className = "",
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3(
      "div",
      {
        className: `px-6 py-4 border-t border-black/[0.06] flex items-center justify-end gap-2.5 bg-mist-50/30 print:hidden ${className}`,
        ...props,
        children
      }
    );
  }

  // src/views/components/ui/input.tsx
  function Input({
    label,
    error,
    className = "",
    id,
    ...props
  }) {
    return /* @__PURE__ */ u3("div", { className: "w-full", children: [
      label && /* @__PURE__ */ u3(
        "label",
        {
          htmlFor: id,
          className: "block text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-800/40 mb-1.5",
          children: label
        }
      ),
      /* @__PURE__ */ u3(
        "input",
        {
          id,
          className: `w-full h-11 px-3.5 rounded-xl bg-mist-50/60 border border-black/[0.08] focus:border-accent-500 focus:bg-white text-sm font-medium transition-all outline-none disabled:opacity-50 ${error ? "border-red-500" : ""} ${className}`,
          ...props
        }
      ),
      error && /* @__PURE__ */ u3("p", { className: "text-xs text-red-600 mt-1", children: error })
    ] });
  }

  // src/views/components/ui/select.tsx
  function Select({
    label,
    className = "",
    id,
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3("div", { className: "w-full", children: [
      label && /* @__PURE__ */ u3(
        "label",
        {
          htmlFor: id,
          className: "block text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-800/40 mb-1.5",
          children: label
        }
      ),
      /* @__PURE__ */ u3("div", { className: "relative", children: [
        /* @__PURE__ */ u3(
          "select",
          {
            id,
            className: `w-full h-11 px-3.5 pr-8 rounded-xl bg-mist-50/60 border border-black/[0.08] focus:border-accent-500 focus:bg-white text-sm font-medium transition-all outline-none appearance-none cursor-pointer ${className}`,
            ...props,
            children
          }
        ),
        /* @__PURE__ */ u3("div", { className: "pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink-800/40", children: /* @__PURE__ */ u3("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ u3(
          "path",
          {
            d: "M2.5 4.5L6 8L9.5 4.5",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ) }) })
      ] })
    ] });
  }

  // src/views/components/ui/stat-card.tsx
  function StatCard({
    label,
    value,
    unit,
    id,
    variant = "default"
  }) {
    const valueClasses = {
      default: "text-ink-900",
      success: "text-emerald-600",
      accent: "text-accent-600 tabular-nums"
    }[variant];
    return /* @__PURE__ */ u3(Card, { className: "p-5", children: [
      /* @__PURE__ */ u3("p", { className: "text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-800/40", children: label }),
      /* @__PURE__ */ u3("div", { className: "flex items-baseline gap-2 mt-1.5", children: [
        /* @__PURE__ */ u3(
          "span",
          {
            id,
            className: `text-2xl font-bold tracking-tight ${valueClasses}`,
            children: value
          }
        ),
        unit && /* @__PURE__ */ u3("span", { className: "text-xs text-ink-800/40 font-medium", children: unit })
      ] })
    ] });
  }

  // src/views/components/ui/table.tsx
  function Table({
    className = "",
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3("div", { className: "w-full overflow-x-auto", children: /* @__PURE__ */ u3("table", { className: `w-full text-left text-xs ${className}`, ...props, children }) });
  }
  function TableHeader({
    className = "",
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3(
      "thead",
      {
        className: `bg-mist-50/70 border-b border-black/[0.05] text-[11px] font-semibold text-ink-800/50 uppercase tracking-wider ${className}`,
        ...props,
        children
      }
    );
  }
  function TableBody({
    className = "",
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3(
      "tbody",
      {
        className: `divide-y divide-black/[0.04] text-ink-800/80 ${className}`,
        ...props,
        children
      }
    );
  }
  function TableRow({
    className = "",
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3(
      "tr",
      {
        className: `hover:bg-black/[0.02] transition-colors duration-150 ${className}`,
        ...props,
        children
      }
    );
  }
  function TableHead({
    className = "",
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3("th", { className: `py-2.5 px-4 font-semibold ${className}`, ...props, children });
  }
  function TableCell({
    className = "",
    children,
    ...props
  }) {
    return /* @__PURE__ */ u3("td", { className: `py-3 px-4 ${className}`, ...props, children });
  }

  // src/views/utils.ts
  var formatRupiah = (amount) => `Rp ${amount.toLocaleString("id-ID")}`;

  // src/views/components/HistoryTable.tsx
  function HistoryTable({
    records,
    products,
    searchQuery,
    selectedProduct,
    onChangeSearch,
    onChangeProduct,
    onRefresh,
    onViewReceipt
  }) {
    const filtered = records.filter((tx) => {
      const q2 = searchQuery.trim().toLowerCase();
      const matchKeyword = !q2 || tx.customerId.toLowerCase().includes(q2) || tx.customerName.toLowerCase().includes(q2) || tx.noResi.toLowerCase().includes(q2) || tx.pdamName.toLowerCase().includes(q2);
      const matchProduct = !selectedProduct || tx.productCode === selectedProduct;
      return matchKeyword && matchProduct;
    });
    const totalSuccess = records.filter((t3) => t3.status === "00").length;
    const totalVolume = records.filter((t3) => t3.status === "00").reduce((acc, t3) => acc + t3.totalAmount, 0);
    return /* @__PURE__ */ u3("section", { id: "section-history", className: "space-y-6", children: [
      /* @__PURE__ */ u3("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ u3(
          StatCard,
          {
            id: "stat-total-count",
            label: "Total Transaksi",
            value: records.length,
            unit: "record",
            variant: "default"
          }
        ),
        /* @__PURE__ */ u3(
          StatCard,
          {
            id: "stat-success-count",
            label: "Pembayaran Sukses",
            value: totalSuccess,
            unit: "berhasil",
            variant: "success"
          }
        ),
        /* @__PURE__ */ u3(
          StatCard,
          {
            id: "stat-total-value",
            label: "Total Volume (Sukses)",
            value: formatRupiah(totalVolume),
            variant: "accent"
          }
        )
      ] }),
      /* @__PURE__ */ u3(Card, { children: [
        /* @__PURE__ */ u3("div", { className: "p-4 border-b border-black/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-mist-50/30", children: [
          /* @__PURE__ */ u3("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ u3("h3", { className: "text-sm font-bold text-ink-900", children: "Riwayat Pembayaran" }),
            /* @__PURE__ */ u3(Badge, { id: "history-count-badge", variant: "outline", children: filtered.length })
          ] }),
          /* @__PURE__ */ u3("div", { className: "flex flex-wrap items-center gap-2.5", children: [
            /* @__PURE__ */ u3("div", { className: "relative", children: [
              /* @__PURE__ */ u3(
                "input",
                {
                  type: "text",
                  id: "history-search-input",
                  placeholder: "Cari IDPEL, Nama, Resi\u2026",
                  value: searchQuery,
                  onInput: (e3) => onChangeSearch(e3.target.value),
                  className: "h-9 pl-8 pr-3 w-56 rounded-xl bg-white border border-black/[0.08] text-xs focus:border-accent-500 focus:outline-none transition-all placeholder:text-ink-800/35"
                }
              ),
              /* @__PURE__ */ u3(
                "svg",
                {
                  className: "absolute left-2.5 top-2.5 text-ink-800/40",
                  width: "14",
                  height: "14",
                  viewBox: "0 0 16 16",
                  fill: "none",
                  children: [
                    /* @__PURE__ */ u3(
                      "circle",
                      {
                        cx: "7",
                        cy: "7",
                        r: "5.5",
                        stroke: "currentColor",
                        strokeWidth: "1.5"
                      }
                    ),
                    /* @__PURE__ */ u3(
                      "path",
                      {
                        d: "m11 11 3.5 3.5",
                        stroke: "currentColor",
                        strokeWidth: "1.5",
                        strokeLinecap: "round"
                      }
                    )
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u3(
              "select",
              {
                id: "history-product-filter",
                value: selectedProduct,
                onChange: (e3) => onChangeProduct(e3.target.value),
                className: "h-9 px-3 pr-7 rounded-xl bg-white border border-black/[0.08] text-xs font-medium focus:border-accent-500 focus:outline-none appearance-none cursor-pointer",
                children: [
                  /* @__PURE__ */ u3("option", { value: "", children: "Semua PDAM" }),
                  products.map((p3) => /* @__PURE__ */ u3("option", { value: p3.code, children: p3.name }, p3.code))
                ]
              }
            ),
            /* @__PURE__ */ u3(
              Button,
              {
                type: "button",
                id: "btn-refresh-history",
                variant: "outline",
                size: "sm",
                onClick: onRefresh,
                className: "h-9 gap-1.5",
                children: [
                  /* @__PURE__ */ u3("svg", { width: "12", height: "12", viewBox: "0 0 14 14", fill: "none", children: [
                    /* @__PURE__ */ u3(
                      "path",
                      {
                        d: "M13 2v4h-4M1 12V8h4",
                        stroke: "currentColor",
                        strokeWidth: "1.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                      }
                    ),
                    /* @__PURE__ */ u3(
                      "path",
                      {
                        d: "M2.5 5A5.5 5.5 0 0 1 12 6M11.5 9a5.5 5.5 0 0 1-9.5-1",
                        stroke: "currentColor",
                        strokeWidth: "1.5",
                        strokeLinecap: "round"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ u3("span", { children: "Refresh" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u3(Table, { children: [
          /* @__PURE__ */ u3(TableHeader, { children: /* @__PURE__ */ u3(TableRow, { children: [
            /* @__PURE__ */ u3(TableHead, { className: "pl-5 whitespace-nowrap", children: "Waktu" }),
            /* @__PURE__ */ u3(TableHead, { className: "whitespace-nowrap", children: "No. Resi" }),
            /* @__PURE__ */ u3(TableHead, { children: "PDAM" }),
            /* @__PURE__ */ u3(TableHead, { children: "ID Pelanggan" }),
            /* @__PURE__ */ u3(TableHead, { children: "Nama" }),
            /* @__PURE__ */ u3(TableHead, { className: "text-right", children: "Total Tagihan" }),
            /* @__PURE__ */ u3(TableHead, { className: "text-center", children: "Status" }),
            /* @__PURE__ */ u3(TableHead, { className: "text-right pr-5", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ u3(TableBody, { id: "history-tbody", children: filtered.length === 0 ? /* @__PURE__ */ u3("tr", { id: "history-empty-row", children: /* @__PURE__ */ u3("td", { colSpan: 8, className: "py-12 text-center text-ink-800/40", children: /* @__PURE__ */ u3("p", { className: "text-xs", children: "Belum ada data transaksi yang sesuai." }) }) }) : filtered.map((tx) => {
            const isSuccess = tx.status === "00";
            const badgeVariant = isSuccess ? "success" : tx.status === "33" ? "warning" : "danger";
            return /* @__PURE__ */ u3(TableRow, { children: [
              /* @__PURE__ */ u3(TableCell, { className: "pl-5 whitespace-nowrap text-ink-800/55 tabular-nums", children: tx.createdAt }),
              /* @__PURE__ */ u3(TableCell, { className: "font-mono text-[12px] font-medium text-ink-900", children: tx.noResi || tx.ref2 }),
              /* @__PURE__ */ u3(TableCell, { className: "font-medium text-ink-900", children: tx.pdamName }),
              /* @__PURE__ */ u3(TableCell, { className: "font-mono text-[12px] text-ink-800/65", children: tx.customerId }),
              /* @__PURE__ */ u3(TableCell, { className: "text-ink-800/80", children: tx.customerName || "-" }),
              /* @__PURE__ */ u3(TableCell, { className: "text-right font-semibold tabular-nums", children: formatRupiah(tx.totalAmount) }),
              /* @__PURE__ */ u3(TableCell, { className: "text-center", children: /* @__PURE__ */ u3(Badge, { variant: badgeVariant, children: isSuccess ? "SUKSES" : tx.statusDescription || "GAGAL" }) }),
              /* @__PURE__ */ u3(TableCell, { className: "text-right pr-5", children: /* @__PURE__ */ u3("div", { className: "flex items-center justify-end gap-2", children: [
                /* @__PURE__ */ u3(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: () => onViewReceipt(tx),
                    className: "btn-view-receipt",
                    children: "Struk"
                  }
                ),
                /* @__PURE__ */ u3(
                  "a",
                  {
                    href: `/api/transactions/${tx.id}/receipt`,
                    download: `struk_${tx.id}.txt`,
                    className: "w-7 h-7 rounded-full border border-black/[0.1] hover:bg-mist-50 text-ink-800/60 flex items-center justify-center transition-colors",
                    title: "Download TXT",
                    children: /* @__PURE__ */ u3(
                      "svg",
                      {
                        width: "12",
                        height: "12",
                        viewBox: "0 0 14 14",
                        fill: "none",
                        children: /* @__PURE__ */ u3(
                          "path",
                          {
                            d: "M7 1v8m0 0L3.5 5.5M7 9l3.5-3.5M1.5 12.5h11",
                            stroke: "currentColor",
                            strokeWidth: "1.5",
                            strokeLinecap: "round",
                            strokeLinejoin: "round"
                          }
                        )
                      }
                    )
                  }
                )
              ] }) })
            ] }, tx.id);
          }) })
        ] })
      ] })
    ] });
  }

  // src/views/components/InquiryForm.tsx
  function InquiryForm({
    products,
    selectedProduct,
    customerId,
    onChangeProduct,
    onChangeCustomerId,
    onSubmit,
    isLoading
  }) {
    return /* @__PURE__ */ u3("div", { className: "lg:col-span-5 space-y-5", children: [
      /* @__PURE__ */ u3(Card, { className: "p-6", children: [
        /* @__PURE__ */ u3("div", { className: "flex items-center gap-2.5 pb-4 border-b border-black/[0.05]", children: [
          /* @__PURE__ */ u3("span", { className: "w-6 h-6 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center text-xs font-bold", children: "1" }),
          /* @__PURE__ */ u3("h2", { className: "text-sm font-bold tracking-tight text-ink-900", children: "Form Inquiry Tagihan" })
        ] }),
        /* @__PURE__ */ u3(
          "form",
          {
            id: "form-inquiry",
            className: "mt-5 space-y-4",
            onSubmit: (e3) => {
              e3.preventDefault();
              onSubmit();
            },
            children: [
              /* @__PURE__ */ u3(
                Select,
                {
                  id: "product-select",
                  label: "Pilih Wilayah PDAM",
                  value: selectedProduct,
                  onChange: (e3) => onChangeProduct(e3.target.value),
                  children: products.map((p3) => /* @__PURE__ */ u3("option", { value: p3.code, children: [
                    p3.name,
                    " (",
                    p3.code,
                    ")"
                  ] }, p3.code))
                }
              ),
              /* @__PURE__ */ u3(
                Input,
                {
                  id: "customer-id-input",
                  label: "Nomor ID Pelanggan",
                  type: "text",
                  value: customerId,
                  onInput: (e3) => onChangeCustomerId(e3.target.value),
                  placeholder: "Contoh: 01002676",
                  className: "font-mono",
                  required: true
                }
              ),
              /* @__PURE__ */ u3(
                Button,
                {
                  type: "submit",
                  id: "btn-submit-inquiry",
                  variant: "default",
                  size: "lg",
                  isLoading,
                  className: "w-full",
                  children: "Cek Tagihan"
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ u3(Card, { className: "p-5", children: [
        /* @__PURE__ */ u3("p", { className: "text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-800/40 mb-3", children: "ID Pelanggan Contoh" }),
        /* @__PURE__ */ u3("div", { id: "preset-buttons", className: "space-y-2", children: products.map((p3) => /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            onClick: () => {
              onChangeProduct(p3.code);
              onChangeCustomerId(p3.defaultIdpel);
            },
            className: "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left bg-mist-50 hover:bg-mist-100/80 border border-black/[0.06] transition-all group cursor-pointer",
            children: [
              /* @__PURE__ */ u3("div", { className: "min-w-0 flex items-center gap-2.5", children: [
                /* @__PURE__ */ u3("span", { className: "w-7 h-7 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center text-[10px] font-bold shrink-0", children: p3.code.slice(0, 2) }),
                /* @__PURE__ */ u3("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ u3("span", { className: "block text-[12px] font-semibold text-ink-900 group-hover:text-accent-600 transition-colors truncate", children: [
                    p3.name,
                    " (",
                    p3.code,
                    ")"
                  ] }),
                  /* @__PURE__ */ u3("span", { className: "block text-[11px] font-mono text-ink-800/50", children: [
                    "IDPEL:",
                    " ",
                    /* @__PURE__ */ u3("span", { className: "text-ink-900 font-semibold", children: p3.defaultIdpel })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ u3("span", { className: "text-[11px] font-semibold text-accent-600 opacity-80 group-hover:opacity-100 shrink-0", children: "Pilih \u2192" })
            ]
          },
          p3.code
        )) })
      ] })
    ] });
  }

  // src/utils/terbilang.ts
  var UNITS = [
    "",
    "SATU",
    "DUA",
    "TIGA",
    "EMPAT",
    "LIMA",
    "ENAM",
    "TUJUH",
    "DELAPAN",
    "SEMBILAN",
    "SEPULUH",
    "SEBELAS"
  ];
  function convertNumberToWords(n2) {
    const num = Math.floor(Math.abs(n2));
    if (num === 0) return "";
    if (num < 12) return UNITS[num] ?? "";
    if (num < 20) return `${convertNumberToWords(num - 10)} BELAS`;
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const remainder2 = num % 10;
      return `${UNITS[tens]} PULUH ${convertNumberToWords(remainder2)}`.trim();
    }
    if (num < 200) {
      return `SERATUS ${convertNumberToWords(num - 100)}`.trim();
    }
    if (num < 1e3) {
      const hundreds = Math.floor(num / 100);
      const remainder2 = num % 100;
      return `${UNITS[hundreds]} RATUS ${convertNumberToWords(remainder2)}`.trim();
    }
    if (num < 2e3) {
      return `SERIBU ${convertNumberToWords(num - 1e3)}`.trim();
    }
    if (num < 1e6) {
      const thousands = Math.floor(num / 1e3);
      const remainder2 = num % 1e3;
      return `${convertNumberToWords(thousands)} RIBU ${convertNumberToWords(remainder2)}`.trim();
    }
    if (num < 1e9) {
      const millions = Math.floor(num / 1e6);
      const remainder2 = num % 1e6;
      return `${convertNumberToWords(millions)} JUTA ${convertNumberToWords(remainder2)}`.trim();
    }
    if (num < 1e12) {
      const billions = Math.floor(num / 1e9);
      const remainder2 = num % 1e9;
      return `${convertNumberToWords(billions)} MILYAR ${convertNumberToWords(remainder2)}`.trim();
    }
    const trillions = Math.floor(num / 1e12);
    const remainder = num % 1e12;
    return `${convertNumberToWords(trillions)} TRILIUN ${convertNumberToWords(remainder)}`.trim();
  }
  function terbilang(amount) {
    if (amount === 0) return "NOL RUPIAH";
    const words = convertNumberToWords(amount).replace(/\s+/g, " ").trim();
    return `${words} RUPIAH`;
  }

  // src/views/components/InquiryResult.tsx
  var MONTHS = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MEI",
    "JUN",
    "JUL",
    "AGS",
    "SEP",
    "OKT",
    "NOV",
    "DES"
  ];
  function InquiryResult({
    inquiry,
    isLoading,
    isPaying,
    selectedProductName,
    onProceedPayment,
    onCancel
  }) {
    if (isLoading) {
      return /* @__PURE__ */ u3("div", { className: "lg:col-span-7", children: /* @__PURE__ */ u3(
        Card,
        {
          id: "inquiry-loading-state",
          className: "p-12 text-center animate-card-in",
          children: [
            /* @__PURE__ */ u3("div", { className: "w-12 h-12 mx-auto rounded-full bg-accent-50 text-accent-600 flex items-center justify-center mb-4", children: /* @__PURE__ */ u3(
              "svg",
              {
                className: "animate-spin",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                  /* @__PURE__ */ u3(
                    "circle",
                    {
                      cx: "12",
                      cy: "12",
                      r: "9.5",
                      stroke: "currentColor",
                      strokeOpacity: "0.2",
                      strokeWidth: "2.5"
                    }
                  ),
                  /* @__PURE__ */ u3(
                    "path",
                    {
                      d: "M21.5 12A9.5 9.5 0 0 0 12 2.5",
                      stroke: "currentColor",
                      strokeWidth: "2.5",
                      strokeLinecap: "round"
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ u3("p", { className: "text-sm font-bold text-ink-900", children: "Menghubungi Server PDAM\u2026" }),
            /* @__PURE__ */ u3("p", { className: "text-xs text-ink-800/40 mt-1", children: "Mengambil rincian tagihan terbaru" })
          ]
        }
      ) });
    }
    if (!inquiry) {
      return /* @__PURE__ */ u3("div", { className: "lg:col-span-7", children: /* @__PURE__ */ u3(Card, { id: "inquiry-empty-state", className: "p-12 text-center", children: [
        /* @__PURE__ */ u3("div", { className: "w-12 h-12 mx-auto rounded-2xl bg-mist-100 flex items-center justify-center text-ink-800/30 mb-3", children: /* @__PURE__ */ u3("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ u3(
          "path",
          {
            d: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6m-6 9h6m-6 4h4",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ) }) }),
        /* @__PURE__ */ u3("p", { className: "text-sm font-semibold text-ink-900", children: "Belum Ada Data Inquiry" }),
        /* @__PURE__ */ u3("p", { className: "text-xs text-ink-800/40 mt-1 max-w-sm mx-auto", children: "Pilih wilayah PDAM dan masukkan nomor ID Pelanggan di form sebelah kiri untuk memeriksa tagihan." })
      ] }) });
    }
    let billEntries = [];
    if (inquiry.data_bill) {
      if (Array.isArray(inquiry.data_bill)) {
        billEntries = inquiry.data_bill.map((b2, i3) => [`blth${i3 + 1}`, b2]);
      } else {
        billEntries = Object.entries(inquiry.data_bill);
      }
    }
    const bills = billEntries.map(([, b2]) => b2);
    const hasNonair = bills.some((b2) => b2.nonair > 0);
    const hasMeter = bills.some((b2) => b2.meter_akhir > 0 || b2.meter_awal > 0);
    const penaltyTotal = bills.reduce((a3, b2) => a3 + b2.denda, 0);
    const miscTotal = bills.reduce((a3, b2) => a3 + b2.nonair, 0);
    return /* @__PURE__ */ u3("div", { className: "lg:col-span-7", children: /* @__PURE__ */ u3(Card, { id: "inquiry-result-card", className: "animate-card-in", children: [
      /* @__PURE__ */ u3("div", { className: "px-6 py-4 border-b border-black/[0.05] flex items-center justify-between bg-mist-50/40", children: [
        /* @__PURE__ */ u3("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ u3("span", { className: "w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold", children: "\u2713" }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3(
              "span",
              {
                id: "res-pdam-badge",
                className: "text-[11px] font-bold text-accent-600 uppercase tracking-wider block",
                children: selectedProductName
              }
            ),
            /* @__PURE__ */ u3("h3", { className: "text-sm font-bold tracking-tight text-ink-900", children: "Detail Tagihan Pelanggan" })
          ] })
        ] }),
        /* @__PURE__ */ u3(Badge, { id: "res-bill-count", variant: "default", children: [
          inquiry.jumlah_bulan,
          " Bulan Tagihan"
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { className: "p-6 space-y-6", children: [
        /* @__PURE__ */ u3("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-mist-50/50 border border-black/[0.04]", children: [
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("span", { className: "text-[11px] font-semibold text-ink-800/40 uppercase tracking-wider block", children: "ID Pelanggan" }),
            /* @__PURE__ */ u3(
              "span",
              {
                id: "res-customer-id",
                className: "text-sm font-mono font-bold text-ink-900",
                children: inquiry.idpel
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("span", { className: "text-[11px] font-semibold text-ink-800/40 uppercase tracking-wider block", children: "No. Meter" }),
            /* @__PURE__ */ u3(
              "span",
              {
                id: "res-nomet",
                className: "text-sm font-mono font-medium text-ink-900",
                children: inquiry.nomet || inquiry.nometer || "-"
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("span", { className: "text-[11px] font-semibold text-ink-800/40 uppercase tracking-wider block", children: "Nama" }),
            /* @__PURE__ */ u3(
              "span",
              {
                id: "res-customer-name",
                className: "text-sm font-bold text-ink-900 truncate block",
                children: inquiry.nama || "-"
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("span", { className: "text-[11px] font-semibold text-ink-800/40 uppercase tracking-wider block", children: "Alamat" }),
            /* @__PURE__ */ u3(
              "span",
              {
                id: "res-customer-address",
                className: "text-xs font-medium text-ink-800/70 truncate block",
                children: inquiry.alamat || "-"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("h4", { className: "text-xs font-bold uppercase tracking-wider text-ink-800/40 mb-2.5", children: "Rincian Tagihan per Periode" }),
          /* @__PURE__ */ u3("div", { className: "border border-black/[0.06] rounded-xl overflow-hidden", children: /* @__PURE__ */ u3(Table, { children: [
            /* @__PURE__ */ u3(TableHeader, { children: /* @__PURE__ */ u3(TableRow, { children: [
              /* @__PURE__ */ u3(TableHead, { className: "pl-4", children: "Periode" }),
              hasMeter && /* @__PURE__ */ u3(TableHead, { id: "th-meter", children: "Pemakaian" }),
              /* @__PURE__ */ u3(TableHead, { className: "text-right", children: "Tagihan Air" }),
              /* @__PURE__ */ u3(TableHead, { className: "text-right", children: "Denda" }),
              hasNonair && /* @__PURE__ */ u3(TableHead, { id: "th-misc", className: "text-right pr-4", children: "Non-Air / Beban" })
            ] }) }),
            /* @__PURE__ */ u3(TableBody, { id: "res-bills-tbody", children: billEntries.map(([blthKey, bill]) => {
              const meter = bill.meter_akhir - bill.meter_awal;
              const monthIdx = parseInt(bill.bulan, 10) - 1;
              const label = `${MONTHS[monthIdx] || bill.bulan} ${bill.tahun}`;
              return /* @__PURE__ */ u3(TableRow, { children: [
                /* @__PURE__ */ u3(TableCell, { className: "pl-4 font-semibold text-ink-900", children: label }),
                hasMeter && /* @__PURE__ */ u3(TableCell, { className: "text-ink-800/60 tabular-nums", children: meter > 0 ? `${meter} m\xB3` : "-" }),
                /* @__PURE__ */ u3(TableCell, { className: "text-right tabular-nums text-ink-900", children: formatRupiah(bill.air) }),
                /* @__PURE__ */ u3(
                  TableCell,
                  {
                    className: `text-right tabular-nums ${bill.denda > 0 ? "text-red-600 font-medium" : "text-ink-800/35"}`,
                    children: formatRupiah(bill.denda)
                  }
                ),
                hasNonair && /* @__PURE__ */ u3(TableCell, { className: "text-right tabular-nums text-ink-800/70 pr-4", children: formatRupiah(bill.nonair) })
              ] }, blthKey);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ u3("div", { className: "p-4 rounded-xl bg-mist-50/50 border border-black/[0.04] space-y-2.5 text-xs", children: [
          /* @__PURE__ */ u3("div", { className: "flex justify-between text-ink-800/70", children: [
            /* @__PURE__ */ u3("span", { children: "Tagihan Pokok (Nominal)" }),
            /* @__PURE__ */ u3(
              "span",
              {
                id: "res-nominal",
                className: "font-semibold tabular-nums text-ink-900",
                children: formatRupiah(inquiry.nominal)
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { className: "flex justify-between text-ink-800/70", children: [
            /* @__PURE__ */ u3("span", { children: "Total Denda" }),
            /* @__PURE__ */ u3(
              "span",
              {
                id: "res-penalty-total",
                className: `font-semibold tabular-nums ${penaltyTotal > 0 ? "text-red-600" : "text-ink-900"}`,
                children: formatRupiah(penaltyTotal)
              }
            )
          ] }),
          hasNonair && /* @__PURE__ */ u3(
            "div",
            {
              id: "row-misc-total",
              className: "flex justify-between text-ink-800/70",
              children: [
                /* @__PURE__ */ u3("span", { children: "Total Biaya Lain / Beban" }),
                /* @__PURE__ */ u3(
                  "span",
                  {
                    id: "res-misc-total",
                    className: "font-semibold tabular-nums text-ink-900",
                    children: formatRupiah(miscTotal)
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ u3("div", { className: "flex justify-between text-ink-800/70", children: [
            /* @__PURE__ */ u3("span", { children: "Biaya Admin" }),
            /* @__PURE__ */ u3(
              "span",
              {
                id: "res-admin-fee",
                className: "font-semibold tabular-nums text-ink-900",
                children: formatRupiah(inquiry.admin)
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { className: "pt-2 border-t border-black/[0.06] flex justify-between items-baseline", children: [
            /* @__PURE__ */ u3("span", { className: "text-sm font-bold text-ink-950", children: "Total Pembayaran" }),
            /* @__PURE__ */ u3(
              "span",
              {
                id: "res-total-amount",
                className: "text-lg font-bold text-accent-600 tabular-nums",
                children: formatRupiah(inquiry.total_bayar)
              }
            )
          ] }),
          /* @__PURE__ */ u3(
            "p",
            {
              id: "res-terbilang",
              className: "text-[11px] italic text-ink-800/40 text-right capitalize pt-1",
              children: [
                '"',
                terbilang(inquiry.total_bayar),
                '"'
              ]
            }
          )
        ] }),
        /* @__PURE__ */ u3("div", { className: "flex items-center gap-3 pt-2", children: [
          /* @__PURE__ */ u3(
            Button,
            {
              type: "button",
              id: "btn-cancel-inquiry",
              variant: "outline",
              size: "lg",
              onClick: onCancel,
              className: "w-1/3",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ u3(
            Button,
            {
              type: "button",
              id: "btn-proceed-payment",
              variant: "primary",
              size: "lg",
              disabled: isPaying,
              isLoading: isPaying,
              onClick: onProceedPayment,
              className: "flex-1",
              children: "Bayar Sekarang"
            }
          )
        ] })
      ] })
    ] }) });
  }

  // src/views/components/ReceiptModal.tsx
  function ReceiptModal({
    isOpen,
    receiptText,
    transactionId,
    onClose
  }) {
    const downloadUrl = transactionId ? `/api/transactions/${transactionId}/receipt` : receiptText ? URL.createObjectURL(
      new Blob([receiptText], { type: "text/plain;charset=utf-8" })
    ) : "#";
    const downloadFilename = transactionId ? `struk_${transactionId}.txt` : "struk_pembayaran.txt";
    return /* @__PURE__ */ u3(Dialog, { id: "receipt-modal", isOpen, onClose, children: /* @__PURE__ */ u3(DialogContent, { children: [
      /* @__PURE__ */ u3(DialogHeader, { children: [
        /* @__PURE__ */ u3("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ u3("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }),
          /* @__PURE__ */ u3(DialogTitle, { children: "Bukti Pembayaran (Struk)" })
        ] }),
        /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            id: "btn-close-receipt-modal",
            onClick: onClose,
            className: "text-ink-800/40 hover:text-ink-900 transition-colors p-1 cursor-pointer",
            children: /* @__PURE__ */ u3("svg", { width: "12", height: "12", viewBox: "0 0 14 14", fill: "none", children: /* @__PURE__ */ u3(
              "path",
              {
                d: "M1 1L13 13M13 1L1 13",
                stroke: "currentColor",
                strokeWidth: "1.8",
                strokeLinecap: "round"
              }
            ) })
          }
        )
      ] }),
      /* @__PURE__ */ u3("div", { className: "p-6 print:p-0", children: /* @__PURE__ */ u3(
        "div",
        {
          id: "modal-receipt-content",
          className: "receipt-paper bg-mist-50/70 p-5 rounded-xl border border-black/[0.07] font-mono text-xs text-ink-950 leading-relaxed overflow-x-auto whitespace-pre select-all print:bg-transparent print:border-none print:p-0 print:text-black print:text-[11pt] print:leading-snug",
          children: receiptText
        }
      ) }),
      /* @__PURE__ */ u3(DialogFooter, { children: [
        /* @__PURE__ */ u3(
          Button,
          {
            type: "button",
            id: "btn-print-receipt",
            variant: "outline",
            size: "md",
            onClick: () => window.print(),
            className: "gap-2",
            children: [
              /* @__PURE__ */ u3("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ u3(
                "path",
                {
                  d: "M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6v-7Z",
                  stroke: "currentColor",
                  strokeWidth: "1.7",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ) }),
              /* @__PURE__ */ u3("span", { children: "Cetak" })
            ]
          }
        ),
        /* @__PURE__ */ u3(
          "a",
          {
            id: "btn-download-receipt",
            href: downloadUrl,
            download: downloadFilename,
            className: "inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer h-10 px-4 text-[13px] bg-accent-500 hover:bg-accent-600 text-white shadow-sm shadow-accent-500/20 gap-2",
            children: [
              /* @__PURE__ */ u3("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ u3(
                "path",
                {
                  d: "M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
                  stroke: "currentColor",
                  strokeWidth: "1.7",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ) }),
              /* @__PURE__ */ u3("span", { children: "Unduh TXT" })
            ]
          }
        )
      ] })
    ] }) });
  }

  // src/views/components/Sidebar.tsx
  function Sidebar({
    currentTab,
    onSelectTab,
    products,
    onSelectProduct
  }) {
    return /* @__PURE__ */ u3("aside", { className: "print:hidden w-60 shrink-0 hidden md:flex flex-col fixed inset-y-0 left-0 bg-white border-r border-black/[0.06] z-40", children: [
      /* @__PURE__ */ u3("div", { className: "h-16 flex items-center px-4 border-b border-black/[0.05]", children: /* @__PURE__ */ u3(
        "a",
        {
          href: "/",
          className: "flex items-center gap-2.5 min-w-0",
          title: "PT. Bimasakti Multi Sinergi",
          children: [
            /* @__PURE__ */ u3(
              "img",
              {
                src: "/images/logo.png",
                alt: "Bimasakti",
                className: "h-8 w-auto object-contain shrink-0"
              }
            ),
            /* @__PURE__ */ u3("div", { className: "min-w-0 leading-tight", children: [
              /* @__PURE__ */ u3("span", { className: "text-[12px] font-bold tracking-tight text-ink-950 block truncate", children: "PT. Bimasakti" }),
              /* @__PURE__ */ u3("span", { className: "text-[10px] font-medium text-ink-800/50 block truncate", children: "Multi Sinergi" })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ u3("nav", { className: "flex-1 px-3 py-4 space-y-1", children: [
        /* @__PURE__ */ u3("p", { className: "px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-800/35", children: "Menu" }),
        /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            id: "nav-inquiry-btn",
            onClick: () => onSelectTab("inquiry"),
            className: `w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-[13px] font-semibold transition-all ${currentTab === "inquiry" ? "bg-ink-950 text-white" : "text-ink-800/60 hover:text-ink-900 hover:bg-black/[0.04]"}`,
            children: [
              /* @__PURE__ */ u3("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ u3(
                "path",
                {
                  d: "M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15.5L12 17l-6.5 3.5V5A1.5 1.5 0 0 1 7 3.5Z",
                  stroke: "currentColor",
                  strokeWidth: "1.5",
                  strokeLinejoin: "round"
                }
              ) }),
              /* @__PURE__ */ u3("span", { children: "Bayar Tagihan" })
            ]
          }
        ),
        /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            id: "nav-history-btn",
            onClick: () => onSelectTab("history"),
            className: `w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-[13px] font-semibold transition-all ${currentTab === "history" ? "bg-ink-950 text-white" : "text-ink-800/60 hover:text-ink-900 hover:bg-black/[0.04]"}`,
            children: [
              /* @__PURE__ */ u3("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", children: [
                /* @__PURE__ */ u3(
                  "circle",
                  {
                    cx: "12",
                    cy: "12",
                    r: "8.5",
                    stroke: "currentColor",
                    strokeWidth: "1.5"
                  }
                ),
                /* @__PURE__ */ u3(
                  "path",
                  {
                    d: "M12 7.5V12l3 2",
                    stroke: "currentColor",
                    strokeWidth: "1.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  }
                )
              ] }),
              /* @__PURE__ */ u3("span", { children: "Riwayat Transaksi" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ u3("div", { className: "px-3 pb-4", children: [
        /* @__PURE__ */ u3("p", { className: "px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-800/35", children: "Produk Aktif" }),
        /* @__PURE__ */ u3("div", { id: "sidebar-products", className: "space-y-1", children: products.map((p3) => /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            onClick: () => {
              onSelectTab("inquiry");
              onSelectProduct(p3.code, p3.defaultIdpel);
            },
            className: "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-black/[0.04] transition-colors text-left",
            children: [
              /* @__PURE__ */ u3("span", { className: "w-7 h-7 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center text-[10px] font-bold shrink-0", children: p3.code.slice(0, 2) }),
              /* @__PURE__ */ u3("span", { className: "min-w-0", children: [
                /* @__PURE__ */ u3("span", { className: "block text-[12px] font-semibold text-ink-900 truncate", children: p3.name }),
                /* @__PURE__ */ u3("span", { className: "block text-[10px] font-mono text-ink-800/45", children: p3.defaultIdpel })
              ] })
            ]
          },
          p3.code
        )) })
      ] })
    ] });
  }

  // src/views/components/Toast.tsx
  function Toast({ alert, onClose }) {
    if (!alert) return null;
    const bgClass = alert.type === "success" ? "bg-emerald-500 text-white" : alert.type === "error" ? "bg-red-500 text-white" : "bg-ink-900 text-white";
    return /* @__PURE__ */ u3(
      "div",
      {
        id: "alert-banner",
        className: `mx-6 mt-4 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-black/5 animate-toast-in ${bgClass}`,
        children: [
          /* @__PURE__ */ u3("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ u3("div", { id: "alert-icon", children: alert.type === "success" ? /* @__PURE__ */ u3("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", children: [
              /* @__PURE__ */ u3(
                "circle",
                {
                  cx: "12",
                  cy: "12",
                  r: "10",
                  stroke: "currentColor",
                  strokeWidth: "2"
                }
              ),
              /* @__PURE__ */ u3(
                "path",
                {
                  d: "m8.5 12.5 2.5 2.5 5-5",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              )
            ] }) : alert.type === "error" ? /* @__PURE__ */ u3("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", children: [
              /* @__PURE__ */ u3(
                "circle",
                {
                  cx: "12",
                  cy: "12",
                  r: "10",
                  stroke: "currentColor",
                  strokeWidth: "2"
                }
              ),
              /* @__PURE__ */ u3(
                "path",
                {
                  d: "m15 9-6 6M9 9l6 6",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round"
                }
              )
            ] }) : /* @__PURE__ */ u3("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", children: [
              /* @__PURE__ */ u3(
                "circle",
                {
                  cx: "12",
                  cy: "12",
                  r: "10",
                  stroke: "currentColor",
                  strokeWidth: "2"
                }
              ),
              /* @__PURE__ */ u3(
                "path",
                {
                  d: "M12 16v-4M12 8h.01",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round"
                }
              )
            ] }) }),
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("h4", { id: "alert-title", className: "text-[13px] font-bold leading-tight", children: alert.title }),
              /* @__PURE__ */ u3("p", { id: "alert-desc", className: "text-[12px] opacity-90", children: alert.message })
            ] })
          ] }),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              id: "alert-close-btn",
              onClick: onClose,
              className: "opacity-70 hover:opacity-100 transition-opacity p-1",
              children: /* @__PURE__ */ u3("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", children: /* @__PURE__ */ u3(
                "path",
                {
                  d: "M1 1L13 13M13 1L1 13",
                  stroke: "currentColor",
                  strokeWidth: "1.8",
                  strokeLinecap: "round"
                }
              ) })
            }
          )
        ]
      }
    );
  }

  // src/views/App.tsx
  function App() {
    const [currentTab, setCurrentTab] = d2(
      "inquiry"
    );
    const [products, setProducts] = d2([]);
    const [selectedProduct, setSelectedProduct] = d2("");
    const [customerId, setCustomerId] = d2("");
    const [isLoadingInquiry, setIsLoadingInquiry] = d2(false);
    const [inquiryData, setInquiryData] = d2(null);
    const [isPaying, setIsPaying] = d2(false);
    const [alert, setAlert] = d2(null);
    const [receiptModal, setReceiptModal] = d2({ isOpen: false, text: "" });
    const [transactions, setTransactions] = d2([]);
    const [historySearch, setHistorySearch] = d2("");
    const [historyProduct, setHistoryProduct] = d2("");
    const showAlert = (type, title, message) => {
      setAlert({ type, title, message });
      setTimeout(() => {
        setAlert(null);
      }, 6e3);
    };
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.rc === "00" && json.data && json.data.length > 0) {
          setProducts(json.data);
          setSelectedProduct(json.data[0].code);
          setCustomerId(json.data[0].defaultIdpel);
        }
      } catch (e3) {
        console.error(e3);
      }
    };
    const loadTransactions = async () => {
      try {
        const res = await fetch("/api/transactions?limit=100");
        const json = await res.json();
        if (json.rc === "00" && json.data) {
          setTransactions(json.data);
        }
      } catch (e3) {
        console.error(e3);
      }
    };
    h2(() => {
      loadProducts();
      loadTransactions();
    }, []);
    const handleInquirySubmit = async () => {
      setAlert(null);
      const idpel = customerId.trim();
      if (!idpel) {
        showAlert("error", "Validasi Gagal", "Nomor ID Pelanggan wajib diisi.");
        return;
      }
      setIsLoadingInquiry(true);
      try {
        const res = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productCode: selectedProduct,
            customerId: idpel
          })
        });
        const json = await res.json();
        if (json.rc !== "00" || !json.data) {
          throw new Error(json.ket || "Gagal melakukan inquiry tagihan.");
        }
        setInquiryData(json.data);
        showAlert(
          "success",
          "Inquiry Berhasil",
          `Data tagihan untuk ${json.data.nama} ditemukan.`
        );
      } catch (err) {
        setInquiryData(null);
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan jaringan.";
        showAlert("error", "Inquiry Gagal", msg);
      } finally {
        setIsLoadingInquiry(false);
      }
    };
    const handlePaymentSubmit = async () => {
      if (!inquiryData) {
        showAlert("error", "Error", "Silakan lakukan inquiry terlebih dahulu.");
        return;
      }
      setIsPaying(true);
      try {
        const res = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productCode: selectedProduct,
            customerId: inquiryData.idpel,
            ref1: inquiryData.ref1,
            ref2: inquiryData.ref2,
            nominal: inquiryData.nominal.toString()
          })
        });
        const json = await res.json();
        if (json.rc !== "00" || !json.data) {
          throw new Error(json.ket || "Pembayaran gagal diproses.");
        }
        showAlert("success", "Pembayaran Berhasil!", json.ket);
        setReceiptModal({
          isOpen: true,
          text: json.data.receiptText,
          txId: json.data.transaction.id
        });
        setInquiryData(null);
        loadTransactions();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat pembayaran.";
        showAlert("error", "Pembayaran Gagal", msg);
      } finally {
        setIsPaying(false);
      }
    };
    const handleViewReceipt = async (tx) => {
      try {
        const res = await fetch(`/api/transactions/${tx.id}`);
        const json = await res.json();
        if (json.rc === "00" && json.data?.receiptText) {
          setReceiptModal({
            isOpen: true,
            text: json.data.receiptText,
            txId: tx.id
          });
        }
      } catch (e3) {
        console.error(e3);
      }
    };
    const selectedProdObj = products.find((p3) => p3.code === selectedProduct);
    const selectedProductName = selectedProdObj ? `${selectedProdObj.name} (${selectedProdObj.code})` : selectedProduct;
    return /* @__PURE__ */ u3("div", { className: "flex min-h-screen", children: [
      /* @__PURE__ */ u3(
        Sidebar,
        {
          currentTab,
          onSelectTab: setCurrentTab,
          products,
          onSelectProduct: (code, idpel) => {
            setSelectedProduct(code);
            setCustomerId(idpel);
          }
        }
      ),
      /* @__PURE__ */ u3("div", { className: "flex-1 md:ml-60 flex flex-col min-w-0", children: [
        /* @__PURE__ */ u3(Header, { currentTab }),
        /* @__PURE__ */ u3(Toast, { alert, onClose: () => setAlert(null) }),
        /* @__PURE__ */ u3("main", { className: "flex-grow w-full max-w-6xl mx-auto px-6 py-6", children: currentTab === "inquiry" ? /* @__PURE__ */ u3("section", { id: "section-payment", children: [
          /* @__PURE__ */ u3(FlowStepper, { hasInquiry: !!inquiryData }),
          /* @__PURE__ */ u3("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-5 items-start", children: [
            /* @__PURE__ */ u3(
              InquiryForm,
              {
                products,
                selectedProduct,
                customerId,
                onChangeProduct: setSelectedProduct,
                onChangeCustomerId: setCustomerId,
                onSubmit: handleInquirySubmit,
                isLoading: isLoadingInquiry
              }
            ),
            /* @__PURE__ */ u3(
              InquiryResult,
              {
                inquiry: inquiryData,
                isLoading: isLoadingInquiry,
                isPaying,
                selectedProductName,
                onProceedPayment: handlePaymentSubmit,
                onCancel: () => setInquiryData(null)
              }
            )
          ] })
        ] }) : /* @__PURE__ */ u3(
          HistoryTable,
          {
            records: transactions,
            products,
            searchQuery: historySearch,
            selectedProduct: historyProduct,
            onChangeSearch: setHistorySearch,
            onChangeProduct: setHistoryProduct,
            onRefresh: loadTransactions,
            onViewReceipt: handleViewReceipt
          }
        ) }),
        /* @__PURE__ */ u3("footer", { className: "print:hidden border-t border-black/[0.05] py-4 px-6 text-center text-xs text-ink-800/35", children: "PDAM Multi-Biller Payment Gateway \xA9 2026 PT. Bimasakti Multi Sinergi." })
      ] }),
      /* @__PURE__ */ u3(
        ReceiptModal,
        {
          isOpen: receiptModal.isOpen,
          receiptText: receiptModal.text,
          transactionId: receiptModal.txId,
          onClose: () => setReceiptModal({ isOpen: false, text: "" })
        }
      )
    ] });
  }

  // src/views/main.tsx
  var root = document.getElementById("root");
  if (root) {
    R(/* @__PURE__ */ u3(App, {}), root);
  }
})();
