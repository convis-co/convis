import { B as e, Fs as t, I as n, Is as r, Xi as i, Yr as a, br as o, ms as s, ro as c } from "./stage-C_LUPXd6.js";
// node_modules/three-mesh-bvh/src/core/Constants.js
var l = 0, u = 1, d = 2, f = 0, p = 1, m = 2, h = 3, g = 1.25, _ = 65535, v = -65536, y = 2 ** -24, b = Symbol("SKIP_GENERATION"), x = {
	strategy: 0,
	maxDepth: 40,
	targetLeafSize: 10,
	useSharedArrayBuffer: !1,
	setBoundingBox: !0,
	onProgress: null,
	indirect: !1,
	verbose: !0,
	range: null,
	[b]: !1
};
// node_modules/three-mesh-bvh/src/utils/ArrayBoxUtilities.js
function S(e, t, n) {
	return n.min.x = t[e], n.min.y = t[e + 1], n.min.z = t[e + 2], n.max.x = t[e + 3], n.max.y = t[e + 4], n.max.z = t[e + 5], n;
}
function C(e) {
	let t = -1, n = -Infinity;
	for (let r = 0; r < 3; r++) {
		let i = e[r + 3] - e[r];
		i > n && (n = i, t = r);
	}
	return t;
}
function w(e, t, n) {
	for (let r = 0; r < 3; r++) {
		let i = t[e + 2 * r], a = t[e + 2 * r + 1], o = i - a, s = i + a;
		o < n[r] && (n[r] = o), s > n[r + 3] && (n[r + 3] = s);
	}
}
function T(e) {
	let t = e[3] - e[0], n = e[4] - e[1], r = e[5] - e[2];
	return 2 * (t * n + n * r + r * t);
}
// node_modules/three-mesh-bvh/src/core/utils/nodeBufferUtils.js
function E(e, t) {
	return t[e + 15] === _;
}
function D(e, t) {
	return t[e + 6];
}
function O(e, t) {
	return t[e + 14];
}
function k(e) {
	return e + 8;
}
function A(e, t) {
	return e + t[e + 6] * 8;
}
function j(e, t) {
	return t[e + 7];
}
function M(e) {
	return e;
}
// node_modules/three-mesh-bvh/src/core/build/computeBoundsUtils.js
function ee(e, t, n, r, i) {
	let a = Infinity, o = Infinity, s = Infinity, c = -Infinity, l = -Infinity, u = -Infinity, d = Infinity, f = Infinity, p = Infinity, m = -Infinity, h = -Infinity, g = -Infinity, _ = e.offset || 0;
	for (let r = (t - _) * 6, i = (t + n - _) * 6; r < i; r += 6) {
		let t = e[r + 0], n = e[r + 1], i = t - n, _ = t + n;
		i < a && (a = i), _ > c && (c = _), t < d && (d = t), t > m && (m = t);
		let v = e[r + 2], y = e[r + 3], b = v - y, x = v + y;
		b < o && (o = b), x > l && (l = x), v < f && (f = v), v > h && (h = v);
		let S = e[r + 4], C = e[r + 5], w = S - C, T = S + C;
		w < s && (s = w), T > u && (u = T), S < p && (p = S), S > g && (g = S);
	}
	r[0] = a, r[1] = o, r[2] = s, r[3] = c, r[4] = l, r[5] = u, i[0] = d, i[1] = f, i[2] = p, i[3] = m, i[4] = h, i[5] = g;
}
// node_modules/three-mesh-bvh/src/core/build/splitUtils.js
var te = 8, ne = 8, re = /* @__PURE__ */ new Int32Array(te), N = /* @__PURE__ */ new Float32Array(48), ie = /* @__PURE__ */ new Float32Array(48), P = /* @__PURE__ */ new Float32Array(6), ae = /* @__PURE__ */ new Float32Array(6), F = /* @__PURE__ */ new Int32Array(ne), oe = /* @__PURE__ */ new Float32Array(48);
function se(e, t, n, r) {
	for (let i = 0; i < 3; i++) {
		let a = t[e + 2 * i], o = t[e + 2 * i + 1], s = a - o, c = a + o;
		s < n[r + i] && (n[r + i] = s), c > n[r + i + 3] && (n[r + i + 3] = c);
	}
}
function ce(e, t) {
	let n = e[t + 3] - e[t], r = e[t + 4] - e[t + 1], i = e[t + 5] - e[t + 2];
	return 2 * (n * r + r * i + i * n);
}
function le(e, t, n, r, i, a) {
	let o = -1, s = 0;
	if (a === 0) o = C(t), o !== -1 && (s = (t[o] + t[o + 3]) / 2);
	else if (a === 1) o = C(e), o !== -1 && (s = ue(n, r, i, o));
	else if (a === 2) {
		let a = T(e), c = g * i, l = n.offset || 0, u = (r - l) * 6, d = (r + i - l) * 6;
		for (let e = 0; e < 3; e++) {
			let r = t[e], l = (t[e + 3] - r) / te;
			if (i < ne) {
				for (let t = 0; t < i; t++) {
					let r = u + t * 6, i = n[r + 2 * e], a = t;
					for (; a > 0 && n[F[a - 1] + 2 * e] > i;) F[a] = F[a - 1], a--;
					F[a] = r;
				}
				for (let e = 0; e < 3; e++) P[e] = Infinity, P[e + 3] = -Infinity, ae[e] = Infinity, ae[e + 3] = -Infinity;
				for (let e = i - 1; e >= 0; e--) w(F[e], n, ae), oe.set(ae, e * 6);
				for (let t = 0; t < i - 1; t++) {
					w(F[t], n, P);
					let r = n[F[t + 1] + 2 * e];
					if (n[F[t] + 2 * e] === r) continue;
					let l = t + 1, u = i - l, d = T(P) / a, f = ce(oe, l * 6) / a, p = 1 + g * (d * l + f * u);
					p < c && (o = e, c = p, s = r);
				}
			} else {
				for (let e = 0; e < te; e++) {
					re[e] = 0;
					for (let t = 0; t < 3; t++) N[e * 6 + t] = Infinity, N[e * 6 + t + 3] = -Infinity;
				}
				for (let t = u; t < d; t += 6) {
					let i = ~~((n[t + 2 * e] - r) / l);
					i >= te && (i = 7), re[i]++, se(t, n, N, i * 6);
				}
				for (let e = 0; e < 6; e++) ie[42 + e] = N[42 + e];
				for (let e = 6; e >= 0; e--) {
					let t = e * 6, n = t + 6;
					for (let e = 0; e < 3; e++) ie[t + e] = Math.min(N[t + e], ie[n + e]), ie[t + e + 3] = Math.max(N[t + e + 3], ie[n + e + 3]);
				}
				let t = 0;
				for (let n = 0; n < 7; n++) {
					let u = n * 6, d = re[n];
					if (d !== 0) for (let e = 0; e < 3; e++) t === 0 ? (P[e] = N[u + e], P[e + 3] = N[u + e + 3]) : (P[e] = Math.min(P[e], N[u + e]), P[e + 3] = Math.max(P[e + 3], N[u + e + 3]));
					t += d;
					let f = 0, p = 0;
					t !== 0 && (f = T(P) / a);
					let m = i - t;
					m !== 0 && (p = ce(ie, u + 6) / a);
					let h = 1 + g * (f * t + p * m);
					h < c && (o = e, c = h, s = r + l + n * l);
				}
			}
		}
	} else console.warn(`BVH: Invalid build strategy value ${a} used.`);
	return {
		axis: o,
		pos: s
	};
}
function ue(e, t, n, r) {
	let i = 0, a = e.offset;
	for (let o = t, s = t + n; o < s; o++) i += e[(o - a) * 6 + r * 2];
	return i / n;
}
// node_modules/three-mesh-bvh/src/core/build/sortUtils.js
function de(e, t, n, r, i, a) {
	let o = r, s = r + i - 1, c = a.pos, l = a.axis * 2, u = n.offset || 0;
	for (;;) {
		for (; o <= s && n[(o - u) * 6 + l] < c;) o++;
		for (; o <= s && n[(s - u) * 6 + l] >= c;) s--;
		if (o < s) {
			for (let n = 0; n < t; n++) {
				let r = e[o * t + n];
				e[o * t + n] = e[s * t + n], e[s * t + n] = r;
			}
			for (let e = 0; e < 6; e++) {
				let t = o - u, r = s - u, i = n[t * 6 + e];
				n[t * 6 + e] = n[r * 6 + e], n[r * 6 + e] = i;
			}
			o++, s--;
		} else return o;
	}
}
// node_modules/three-mesh-bvh/src/core/build/buildTree.js
var fe = 2 ** 32, I = /* @__PURE__ */ new Float32Array(6), pe = /* @__PURE__ */ new Float32Array(6);
function me(e, t, n, r, i, a) {
	let { maxDepth: o, verbose: s, targetLeafSize: c, _strictLeafSize: l = Infinity, strategy: u, onProgress: d, useSharedArrayBuffer: f = !1 } = i, p = e.primitiveBuffer, m = e.primitiveBufferStride, h = new (f ? SharedArrayBuffer : ArrayBuffer)(32 * Math.max(1, 2 * Math.ceil(r) - 1)), g = new Float32Array(h), v = new Uint32Array(h), y = new Uint16Array(h), b = 0, x = !1;
	return ee(t, n, r, I, pe), T(n, r, 0), h.slice(0, b * 32);
	function S(e) {
		d && d((e - a.offset) / a.count);
	}
	function w(e, t, n) {
		let r = e * 2;
		v[e + 6] = t, y[r + 14] = n, y[r + 15] = _, S(t + n);
	}
	function T(e, n, r) {
		let i = b++, a = i * 8;
		g.set(I, a), !x && r >= o && (x = !0, s && console.warn(`BVH: Max depth of ${o} reached when generating BVH. Consider increasing maxDepth.`));
		let d = n > l;
		if (n <= c && !d || r >= o) {
			w(a, e, n);
			return;
		}
		let f = le(I, pe, t, e, n, u), h = f.axis === -1 ? -1 : de(p, m, t, e, n, f);
		if (f.axis === -1 || h === e || h === e + n) {
			if (!d) {
				w(a, e, n);
				return;
			}
			f.axis = Math.max(0, C(I)), h = e + Math.max(1, Math.floor(n / 2));
		}
		v[a + 7] = f.axis;
		let _ = h - e;
		ee(t, e, _, I, pe), T(e, _, r + 1);
		let y = b - i;
		if (y > fe) throw Error("MeshBVH: Cannot store relative child node offset greater than 32 bits.");
		v[a + 6] = y;
		let S = n - _;
		ee(t, h, S, I, pe), T(h, S, r + 1);
	}
}
function he(e, t) {
	let n = e.getRootRanges(t.range), r = n[0], i = n[n.length - 1], a = {
		offset: r.offset,
		count: i.offset + i.count - r.offset
	}, o = new Float32Array(6 * a.count);
	o.offset = a.offset, e.computePrimitiveBounds(a.offset, a.count, o), e._roots = n.map((n) => me(e, o, n.offset, n.count, t, a));
}
// node_modules/three-mesh-bvh/src/utils/PrimitivePool.js
var ge = class {
	constructor(e) {
		this._getNewPrimitive = e, this._primitives = [];
	}
	getPrimitive() {
		let e = this._primitives;
		return e.length === 0 ? this._getNewPrimitive() : e.pop();
	}
	releasePrimitive(e) {
		this._primitives.push(e);
	}
}, L = /* @__PURE__ */ new class {
	constructor() {
		this.float32Array = null, this.uint16Array = null, this.uint32Array = null;
		let e = [], t = null;
		this.setBuffer = (n) => {
			t && e.push(t), t = n, this.float32Array = new Float32Array(n), this.uint16Array = new Uint16Array(n), this.uint32Array = new Uint32Array(n);
		}, this.clearBuffer = () => {
			t = null, this.float32Array = null, this.uint16Array = null, this.uint32Array = null, e.length !== 0 && this.setBuffer(e.pop());
		};
	}
}(), R, z, B = [], _e = /* @__PURE__ */ new ge(() => new n());
function ve(e, t, n, r, i, a) {
	R = _e.getPrimitive(), z = _e.getPrimitive(), B.push(R, z), L.setBuffer(e._roots[t]);
	let o = ye(0, e.geometry, n, r, i, a);
	L.clearBuffer(), _e.releasePrimitive(R), _e.releasePrimitive(z), B.pop(), B.pop();
	let s = B.length;
	return s > 0 && (z = B[s - 1], R = B[s - 2]), o;
}
function ye(e, t, n, r, i = null, a = 0, o = 0) {
	let { float32Array: s, uint16Array: c, uint32Array: l } = L, u = e * 2;
	if (E(u, c)) {
		let t = D(e, l), n = O(u, c);
		return S(M(e), s, R), r(t, n, !1, o, a + e / 8, R);
	}
	{
		let u = k(e), d = A(e, l), f = u, p = d, m, h, g, _;
		if (i && (g = R, _ = z, S(M(f), s, g), S(M(p), s, _), m = i(g), h = i(_), h < m)) {
			f = d, p = u;
			let e = m;
			m = h, h = e, g = _;
		}
		g || (g = R, S(M(f), s, g));
		let v = E(f * 2, c), y = n(g, v, m, o + 1, a + f / 8), b;
		if (y === 2) {
			let e = T(f);
			b = r(e, j(f) - e, !0, o + 1, a + f / 8, g);
		} else b = y && ye(f, t, n, r, i, a, o + 1);
		if (b) return !0;
		_ = z, S(M(p), s, _);
		let x = E(p * 2, c), C = n(_, x, h, o + 1, a + p / 8), w;
		if (C === 2) {
			let e = T(p);
			w = r(e, j(p) - e, !0, o + 1, a + p / 8, _);
		} else w = C && ye(p, t, n, r, i, a, o + 1);
		return !!w;
		function T(e) {
			let { uint16Array: t, uint32Array: n } = L, r = e * 2;
			for (; !E(r, t);) e = k(e), r = e * 2;
			return D(e, n);
		}
		function j(e) {
			let { uint16Array: t, uint32Array: n } = L, r = e * 2;
			for (; !E(r, t);) e = A(e, n), r = e * 2;
			return D(e, n) + O(r, t);
		}
	}
}
// node_modules/three-mesh-bvh/src/core/cast/bvhcast.js
var be = /* @__PURE__ */ new L.constructor(), xe = /* @__PURE__ */ new L.constructor(), V = /* @__PURE__ */ new ge(() => new n()), Se = /* @__PURE__ */ new n(), Ce = /* @__PURE__ */ new n(), we = /* @__PURE__ */ new n(), Te = /* @__PURE__ */ new n(), Ee = !1;
function De(e, t, n, r) {
	if (Ee) throw Error("MeshBVH: Recursive calls to bvhcast not supported.");
	Ee = !0;
	let i = e._roots, o = t._roots, s, c = 0, l = 0, u = new a().copy(n).invert();
	for (let e = 0, t = i.length; e < t; e++) {
		be.setBuffer(i[e]), l = 0;
		let t = V.getPrimitive();
		S(M(0), be.float32Array, t), t.applyMatrix4(u);
		for (let e = 0, i = o.length; e < i && (xe.setBuffer(o[e]), s = H(0, 0, n, u, r, c, l, 0, 0, t), xe.clearBuffer(), l += o[e].byteLength / 32, !s); e++);
		if (V.releasePrimitive(t), be.clearBuffer(), c += i[e].byteLength / 32, s) break;
	}
	return Ee = !1, s;
}
function H(e, t, n, r, i, a = 0, o = 0, s = 0, c = 0, l = null, u = !1) {
	let d, f;
	u ? (d = xe, f = be) : (d = be, f = xe);
	let p = d.float32Array, m = d.uint32Array, h = d.uint16Array, g = f.float32Array, _ = f.uint32Array, v = f.uint16Array, y = e * 2, b = t * 2, x = E(y, h), C = E(b, v), w = !1;
	if (C && x) w = u ? i(D(t, _), O(t * 2, v), D(e, m), O(e * 2, h), c, o + t / 8, s, a + e / 8) : i(D(e, m), O(e * 2, h), D(t, _), O(t * 2, v), s, a + e / 8, c, o + t / 8);
	else if (C) {
		let l = V.getPrimitive();
		S(M(t), g, l), l.applyMatrix4(n);
		let d = k(e), f = A(e, m);
		S(M(d), p, Se), S(M(f), p, Ce);
		let h = l.intersectsBox(Se), _ = l.intersectsBox(Ce);
		w = h && H(t, d, r, n, i, o, a, c, s + 1, l, !u) || _ && H(t, f, r, n, i, o, a, c, s + 1, l, !u), V.releasePrimitive(l);
	} else {
		let d = k(t), f = A(t, _);
		S(M(d), g, we), S(M(f), g, Te);
		let h = l.intersectsBox(we), v = l.intersectsBox(Te);
		if (h && v) w = H(e, d, n, r, i, a, o, s, c + 1, l, u) || H(e, f, n, r, i, a, o, s, c + 1, l, u);
		else if (h) {
			if (x) w = H(e, d, n, r, i, a, o, s, c + 1, l, u);
			else {
				let t = V.getPrimitive();
				t.copy(we).applyMatrix4(n);
				let l = k(e), f = A(e, m);
				S(M(l), p, Se), S(M(f), p, Ce);
				let h = t.intersectsBox(Se), g = t.intersectsBox(Ce);
				w = h && H(d, l, r, n, i, o, a, c, s + 1, t, !u) || g && H(d, f, r, n, i, o, a, c, s + 1, t, !u), V.releasePrimitive(t);
			}
		} else if (v) {
			if (x) w = H(e, f, n, r, i, a, o, s, c + 1, l, u);
			else {
				let t = V.getPrimitive();
				t.copy(Te).applyMatrix4(n);
				let l = k(e), d = A(e, m);
				S(M(l), p, Se), S(M(d), p, Ce);
				let h = t.intersectsBox(Se), g = t.intersectsBox(Ce);
				w = h && H(f, l, r, n, i, o, a, c, s + 1, t, !u) || g && H(f, d, r, n, i, o, a, c, s + 1, t, !u), V.releasePrimitive(t);
			}
		}
	}
	return w;
}
// node_modules/three-mesh-bvh/src/core/BVHTraversalHelper.js
var Oe = new class {
	constructor() {
		let e = null, t = null, n = null, r = !1;
		this.root = null, this.buffer = null, this.uint32Array = null, this.uint16Array = null, this.setBVH = (i, a) => {
			if (r) throw Error("BVHTraversalHelper: cannot call setBVH during an active traversal.");
			this.root = a, this.buffer = e = i._roots[a], this.uint16Array = n = new Uint16Array(e), this.uint32Array = t = new Uint32Array(e);
		}, this.reset = () => {
			this.root = null, this.buffer = e = null, this.uint16Array = n = null, this.uint32Array = t = null;
		}, this.getRangeStart = (e) => {
			let r = e * 2;
			for (; !E(r, n);) e = k(e), r = e * 2;
			return D(e, t);
		}, this.getRangeEnd = (e) => {
			let r = e * 2;
			for (; !E(r, n);) e = A(e, t), r = e * 2;
			return D(e, t) + O(r, n);
		};
		let i = (e, r, a) => {
			let o = E(r * 2, n);
			if (!e(a, o, r) && !o) {
				let n = k(r), o = A(r, t);
				i(e, n, a + 1), i(e, o, a + 1);
			}
		};
		this.traverseBuffer = (e) => {
			if (r) throw Error("BVHTraversalHelper: cannot start a traversal during an active traversal.");
			r = !0;
			try {
				i(e, 0, 0);
			} finally {
				r = !1;
			}
		}, this.traverse = (r) => {
			this.traverseBuffer((i, a, o) => {
				if (a) {
					let s = o * 2, c = t[o + 6], l = n[s + 14];
					return r(i, a, new Float32Array(e, o * 4, 6), c, l);
				}
				{
					let n = j(o, t);
					return r(i, a, new Float32Array(e, o * 4, 6), n);
				}
			});
		};
	}
}(), ke = /* @__PURE__ */ new n(), Ae = /* @__PURE__ */ new Float32Array(6), je = class {
	constructor() {
		this._roots = null, this.primitiveBuffer = null, this.primitiveBufferStride = null;
	}
	init(e) {
		e = {
			...x,
			...e
		}, "maxLeafSize" in e && (console.warn("BVH: \"maxLeafSize\" option has been deprecated. Use \"targetLeafSize\", instead."), e = {
			...e,
			targetLeafSize: e.maxLeafSize
		}), he(this, e);
	}
	getRootRanges() {
		throw Error("BVH: getRootRanges() not implemented");
	}
	writePrimitiveBounds() {
		throw Error("BVH: writePrimitiveBounds() not implemented");
	}
	writePrimitiveRangeBounds(e, t, n, r) {
		let i = Infinity, a = Infinity, o = Infinity, s = -Infinity, c = -Infinity, l = -Infinity;
		for (let n = e, r = e + t; n < r; n++) {
			this.writePrimitiveBounds(n, Ae, 0);
			let [e, t, r, u, d, f] = Ae;
			e < i && (i = e), u > s && (s = u), t < a && (a = t), d > c && (c = d), r < o && (o = r), f > l && (l = f);
		}
		return n[r + 0] = i, n[r + 1] = a, n[r + 2] = o, n[r + 3] = s, n[r + 4] = c, n[r + 5] = l, n;
	}
	computePrimitiveBounds(e, t, n) {
		let r = n.offset || 0;
		for (let i = e, a = e + t; i < a; i++) {
			this.writePrimitiveBounds(i, Ae, 0);
			let [e, t, a, o, s, c] = Ae, l = (e + o) / 2, u = (t + s) / 2, d = (a + c) / 2, f = (o - e) / 2, p = (s - t) / 2, m = (c - a) / 2, h = (i - r) * 6;
			n[h + 0] = l, n[h + 1] = f + (Math.abs(l) + f) * y, n[h + 2] = u, n[h + 3] = p + (Math.abs(u) + p) * y, n[h + 4] = d, n[h + 5] = m + (Math.abs(d) + m) * y;
		}
		return n;
	}
	shiftPrimitiveOffsets(e) {
		let t = this._indirectBuffer;
		if (t) for (let n = 0, r = t.length; n < r; n++) t[n] += e;
		else {
			let t = this._roots;
			for (let n = 0; n < t.length; n++) {
				let r = t[n], i = new Uint32Array(r), a = new Uint16Array(r), o = r.byteLength / 32;
				for (let t = 0; t < o; t++) {
					let n = 8 * t;
					E(2 * n, a) && (i[n + 6] += e);
				}
			}
		}
	}
	traverse(e, t = 0) {
		Oe.setBVH(this, t), Oe.traverse(e), Oe.reset();
	}
	refit() {
		let e = this._roots;
		for (let t = 0, n = e.length; t < n; t++) {
			let n = e[t], r = new Uint32Array(n), i = new Uint16Array(n), a = new Float32Array(n), o = n.byteLength / 32;
			for (let e = o - 1; e >= 0; e--) {
				let t = e * 8, n = t * 2;
				if (E(n, i)) {
					let e = D(t, r), o = O(n, i);
					this.writePrimitiveRangeBounds(e, o, Ae, 0), a.set(Ae, t);
				} else {
					let e = k(t), n = A(t, r);
					for (let r = 0; r < 3; r++) {
						let i = a[e + r], o = a[e + r + 3], s = a[n + r], c = a[n + r + 3];
						a[t + r] = i < s ? i : s, a[t + r + 3] = o > c ? o : c;
					}
				}
			}
		}
	}
	getBoundingBox(e) {
		return e.makeEmpty(), this._roots.forEach((t) => {
			S(0, new Float32Array(t), ke), e.union(ke);
		}), e;
	}
	shapecast(e) {
		let { boundsTraverseOrder: t, intersectsBounds: n, intersectsRange: r, intersectsPrimitive: i, scratchPrimitive: a, iterate: o } = e;
		if (r && i) {
			let e = r;
			r = (t, n, r, s, c) => e(t, n, r, s, c) ? !0 : o(t, n, this, i, r, s, a);
		} else r ||= i ? (e, t, n, r) => o(e, t, this, i, n, r, a) : (e, t, n) => n;
		let s = !1, c = 0, l = this._roots;
		for (let e = 0, i = l.length; e < i; e++) {
			let i = l[e];
			if (s = ve(this, e, n, r, t, c), s) break;
			c += i.byteLength / 32;
		}
		return s;
	}
	bvhcast(e, t, n) {
		let { intersectsRanges: r } = n;
		return De(this, e, t, r);
	}
};
// node_modules/three-mesh-bvh/src/utils/BufferUtils.js
function Me() {
	return typeof SharedArrayBuffer < "u";
}
function Ne(e, t) {
	if (e === null) return e;
	if (e.buffer) {
		let n = e.buffer;
		if (n.constructor === t) return e;
		let r = e.constructor, i = new r(new t(n.byteLength));
		return i.set(e), i;
	}
	{
		if (e.constructor === t) return e;
		let n = new t(e.byteLength);
		return new Uint8Array(n).set(new Uint8Array(e)), n;
	}
}
// node_modules/three-mesh-bvh/src/core/build/geometryUtils.js
function Pe(e) {
	return e.index ? e.index.count : e.attributes.position.count;
}
function Fe(e) {
	return Pe(e) / 3;
}
function Ie(e, t = ArrayBuffer) {
	return e > 65535 ? new Uint32Array(new t(4 * e)) : new Uint16Array(new t(2 * e));
}
function Le(t, n) {
	if (!t.index) {
		let r = t.attributes.position.count, i = Ie(r, n.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer);
		t.setIndex(new e(i, 1));
		for (let e = 0; e < r; e++) i[e] = e;
	}
}
function Re(e, t, n) {
	let r = Pe(e) / n, i = t || e.drawRange, a = i.start / n, o = (i.start + i.count) / n, s = Math.max(0, a), c = Math.min(r, o) - s;
	return {
		offset: Math.floor(s),
		count: Math.floor(c)
	};
}
function ze(e, t) {
	return e.groups.map((e) => ({
		offset: e.start / t,
		count: e.count / t
	}));
}
function Be(e, t, n) {
	let r = Re(e, t, n), i = ze(e, n);
	if (!i.length) return [r];
	let a = [], o = r.offset, s = r.offset + r.count, c = Pe(e) / n, l = [];
	for (let e of i) {
		let { offset: t, count: n } = e, r = t, i = t + (isFinite(n) ? n : c - t);
		r < s && i > o && (l.push({
			pos: Math.max(o, r),
			isStart: !0
		}), l.push({
			pos: Math.min(s, i),
			isStart: !1
		}));
	}
	l.sort((e, t) => e.pos === t.pos ? e.type === "end" ? -1 : 1 : e.pos - t.pos);
	let u = 0, d = null;
	for (let e of l) {
		let t = e.pos;
		u !== 0 && t !== d && a.push({
			offset: d,
			count: t - d
		}), u += e.isStart ? 1 : -1, d = t;
	}
	return a;
}
// node_modules/three-mesh-bvh/src/core/GeometryBVH.js
function Ve(e, t) {
	let n = e[e.length - 1], r = n.offset + n.count > 2 ** 16, i = e.reduce((e, t) => e + t.count, 0), a = r ? 4 : 2, o = t ? new SharedArrayBuffer(i * a) : new ArrayBuffer(i * a), s = r ? new Uint32Array(o) : new Uint16Array(o), c = 0;
	for (let t = 0; t < e.length; t++) {
		let { offset: n, count: r } = e[t];
		for (let e = 0; e < r; e++) s[c + e] = n + e;
		c += r;
	}
	return s;
}
var He = class extends je {
	get indirect() {
		return !!this._indirectBuffer;
	}
	get primitiveStride() {
		return null;
	}
	get primitiveBufferStride() {
		return this.indirect ? 1 : this.primitiveStride;
	}
	set primitiveBufferStride(e) {}
	get primitiveBuffer() {
		return this.indirect ? this._indirectBuffer : this.geometry.index.array;
	}
	set primitiveBuffer(e) {}
	constructor(e, t = {}) {
		if (!e.isBufferGeometry) throw Error("BVH: Only BufferGeometries are supported.");
		if (e.index && e.index.isInterleavedBufferAttribute) throw Error("BVH: InterleavedBufferAttribute is not supported for the index attribute.");
		if (t.useSharedArrayBuffer && !Me()) throw Error("BVH: SharedArrayBuffer is not available.");
		super(), this.geometry = e, this.resolvePrimitiveIndex = t.indirect ? (e) => this._indirectBuffer[e] : (e) => e, this.primitiveBuffer = null, this.primitiveBufferStride = null, this._indirectBuffer = null, t = {
			...x,
			...t
		}, t[b] || this.init(t);
	}
	init(e) {
		let { geometry: t, primitiveStride: r } = this;
		if (e.indirect) {
			let n = Ve(Be(t, e.range, r), e.useSharedArrayBuffer);
			this._indirectBuffer = n;
		} else Le(t, e);
		super.init(e), !t.boundingBox && e.setBoundingBox && (t.boundingBox = this.getBoundingBox(new n()));
	}
	getRootRanges(e) {
		return this.indirect ? [{
			offset: 0,
			count: this._indirectBuffer.length
		}] : Be(this.geometry, e, this.primitiveStride);
	}
	raycastObject3D() {
		throw Error("BVH: raycastObject3D() not implemented");
	}
}, U = class {
	constructor() {
		this.min = Infinity, this.max = -Infinity;
	}
	setFromPointsField(e, t) {
		let n = Infinity, r = -Infinity;
		for (let i = 0, a = e.length; i < a; i++) {
			let a = e[i][t];
			n = a < n ? a : n, r = a > r ? a : r;
		}
		this.min = n, this.max = r;
	}
	setFromPoints(e, t) {
		let n = Infinity, r = -Infinity;
		for (let i = 0, a = t.length; i < a; i++) {
			let a = t[i], o = e.dot(a);
			n = o < n ? o : n, r = o > r ? o : r;
		}
		this.min = n, this.max = r;
	}
	isSeparated(e) {
		return this.min > e.max || e.min > this.max;
	}
};
U.prototype.setFromBox = (function() {
	let e = /* @__PURE__ */ new r();
	return function(t, n) {
		let r = n.min, i = n.max, a = Infinity, o = -Infinity;
		for (let n = 0; n <= 1; n++) for (let s = 0; s <= 1; s++) for (let c = 0; c <= 1; c++) {
			e.x = r.x * n + i.x * (1 - n), e.y = r.y * s + i.y * (1 - s), e.z = r.z * c + i.z * (1 - c);
			let l = t.dot(e);
			a = Math.min(l, a), o = Math.max(l, o);
		}
		this.min = a, this.max = o;
	};
})();
// node_modules/three-mesh-bvh/src/math/MathUtilities.js
var Ue = (function() {
	let e = /* @__PURE__ */ new r(), t = /* @__PURE__ */ new r(), n = /* @__PURE__ */ new r();
	return function(r, i, a) {
		let o = r.start, s = e, c = i.start, l = t;
		n.subVectors(o, c), e.subVectors(r.end, r.start), t.subVectors(i.end, i.start);
		let u = n.dot(l), d = l.dot(s), f = l.dot(l), p = n.dot(s), m = s.dot(s) * f - d * d, h, g;
		h = m === 0 ? 0 : (u * d - p * f) / m, g = (u + h * d) / f, a.x = h, a.y = g;
	};
})(), We = (function() {
	let e = /* @__PURE__ */ new t(), n = /* @__PURE__ */ new r(), i = /* @__PURE__ */ new r();
	return function(t, r, a, o) {
		Ue(t, r, e);
		let s = e.x, c = e.y;
		if (s >= 0 && s <= 1 && c >= 0 && c <= 1) t.at(s, a), r.at(c, o);
		else if (s >= 0 && s <= 1) c < 0 ? r.at(0, o) : r.at(1, o), t.closestPointToPoint(o, !0, a);
		else if (c >= 0 && c <= 1) s < 0 ? t.at(0, a) : t.at(1, a), r.closestPointToPoint(a, !0, o);
		else {
			let e;
			e = s < 0 ? t.start : t.end;
			let l;
			l = c < 0 ? r.start : r.end;
			let u = n, d = i;
			if (t.closestPointToPoint(l, !0, n), r.closestPointToPoint(e, !0, i), u.distanceToSquared(l) <= d.distanceToSquared(e)) {
				a.copy(u), o.copy(l);
				return;
			}
			a.copy(e), o.copy(d);
			return;
		}
	};
})(), Ge = (function() {
	let e = /* @__PURE__ */ new r(), t = /* @__PURE__ */ new r(), n = /* @__PURE__ */ new i(), a = /* @__PURE__ */ new o();
	return function(r, i) {
		let { radius: o, center: s } = r, { a: c, b: l, c: u } = i;
		if (a.start = c, a.end = l, a.closestPointToPoint(s, !0, e).distanceTo(s) <= o || (a.start = c, a.end = u, a.closestPointToPoint(s, !0, e).distanceTo(s) <= o) || (a.start = l, a.end = u, a.closestPointToPoint(s, !0, e).distanceTo(s) <= o)) return !0;
		let d = i.getPlane(n);
		if (Math.abs(d.distanceToPoint(s)) <= o) {
			let e = d.projectPoint(s, t);
			if (i.containsPoint(e)) return !0;
		}
		return !1;
	};
})(), Ke = [
	"x",
	"y",
	"z"
], W = 1e-15, qe = W * W;
function G(e) {
	return Math.abs(e) < W;
}
var K = class extends s {
	constructor(...e) {
		super(...e), this.isExtendedTriangle = !0, this.satAxes = [
			,
			,
			,
			,
		].fill().map(() => new r()), this.satBounds = [
			,
			,
			,
			,
		].fill().map(() => new U()), this.points = [
			this.a,
			this.b,
			this.c
		], this.plane = new i(), this.isDegenerateIntoSegment = !1, this.isDegenerateIntoPoint = !1, this.degenerateSegment = new o(), this.needsUpdate = !0;
	}
	intersectsSphere(e) {
		return Ge(e, this);
	}
	update() {
		let e = this.a, t = this.b, n = this.c, r = this.points, i = this.satAxes, a = this.satBounds, o = i[0], s = a[0];
		this.getNormal(o), s.setFromPoints(o, r);
		let c = i[1], l = a[1];
		c.subVectors(e, t), l.setFromPoints(c, r);
		let u = i[2], d = a[2];
		u.subVectors(t, n), d.setFromPoints(u, r);
		let f = i[3], p = a[3];
		f.subVectors(n, e), p.setFromPoints(f, r);
		let m = c.length(), h = u.length(), g = f.length();
		this.isDegenerateIntoPoint = !1, this.isDegenerateIntoSegment = !1, m < W ? h < W || g < W ? this.isDegenerateIntoPoint = !0 : (this.isDegenerateIntoSegment = !0, this.degenerateSegment.start.copy(e), this.degenerateSegment.end.copy(n)) : h < W ? g < W ? this.isDegenerateIntoPoint = !0 : (this.isDegenerateIntoSegment = !0, this.degenerateSegment.start.copy(t), this.degenerateSegment.end.copy(e)) : g < W && (this.isDegenerateIntoSegment = !0, this.degenerateSegment.start.copy(n), this.degenerateSegment.end.copy(t)), this.plane.setFromNormalAndCoplanarPoint(o, e), this.needsUpdate = !1;
	}
};
K.prototype.closestPointToSegment = (function() {
	let e = /* @__PURE__ */ new r(), t = /* @__PURE__ */ new r(), n = /* @__PURE__ */ new o();
	return function(r, i = null, a = null) {
		this.needsUpdate && this.update();
		let { start: o, end: s } = r, c = this.points, l, u = Infinity;
		if (this.plane.distanceToPoint(o) * this.plane.distanceToPoint(s) < 0 && this.plane.intersectLine(r, e) !== null && this.containsPoint(e)) return i && i.copy(e), a && a.copy(e), 0;
		for (let o = 0; o < 3; o++) {
			let s = (o + 1) % 3;
			n.start.copy(c[o]), n.end.copy(c[s]), We(n, r, e, t), l = e.distanceToSquared(t), l < u && (u = l, i && i.copy(e), a && a.copy(t));
		}
		return this.closestPointToPoint(o, e), l = o.distanceToSquared(e), l < u && (u = l, i && i.copy(e), a && a.copy(o)), this.closestPointToPoint(s, e), l = s.distanceToSquared(e), l < u && (u = l, i && i.copy(e), a && a.copy(s)), Math.sqrt(u);
	};
})(), K.prototype.intersectsTriangle = (function() {
	let e = /* @__PURE__ */ new K(), n = /* @__PURE__ */ new U(), i = /* @__PURE__ */ new U(), a = /* @__PURE__ */ new r(), s = /* @__PURE__ */ new r(), c = /* @__PURE__ */ new r(), l = /* @__PURE__ */ new r(), u = /* @__PURE__ */ new o(), d = /* @__PURE__ */ new o(), f = /* @__PURE__ */ new r(), p = /* @__PURE__ */ new t(), m = /* @__PURE__ */ new t();
	function h(e, t, r, o) {
		let s = a;
		!e.isDegenerateIntoPoint && !e.isDegenerateIntoSegment ? s.copy(e.plane.normal) : s.copy(t.plane.normal);
		let c = e.satBounds, u = e.satAxes;
		for (let r = 1; r < 4; r++) {
			let a = c[r], o = u[r];
			if (n.setFromPoints(o, t.points), a.isSeparated(n) || (l.copy(s).cross(o), n.setFromPoints(l, e.points), i.setFromPoints(l, t.points), n.isSeparated(i))) return !1;
		}
		let d = t.satBounds, f = t.satAxes;
		for (let r = 1; r < 4; r++) {
			let a = d[r], o = f[r];
			if (n.setFromPoints(o, e.points), a.isSeparated(n) || (l.crossVectors(s, o), n.setFromPoints(l, e.points), i.setFromPoints(l, t.points), n.isSeparated(i))) return !1;
		}
		return r && (o || console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."), r.start.set(0, 0, 0), r.end.set(0, 0, 0)), !0;
	}
	function g(e, t, n, r, i, a, o, s, c, l, u) {
		let d = o / (o - s);
		l.x = r + (i - r) * d, u.start.subVectors(t, e).multiplyScalar(d).add(e), d = o / (o - c), l.y = r + (a - r) * d, u.end.subVectors(n, e).multiplyScalar(d).add(e);
	}
	function _(e, t, n, r, i, a, o, s, c, l, u) {
		if (i > 0) g(e.c, e.a, e.b, r, t, n, c, o, s, l, u);
		else if (a > 0) g(e.b, e.a, e.c, n, t, r, s, o, c, l, u);
		else if (s * c > 0 || o != 0) g(e.a, e.b, e.c, t, n, r, o, s, c, l, u);
		else if (s != 0) g(e.b, e.a, e.c, n, t, r, s, o, c, l, u);
		else if (c != 0) g(e.c, e.a, e.b, r, t, n, c, o, s, l, u);
		else return !0;
		return !1;
	}
	function v(e, t, n, r) {
		let i = t.degenerateSegment, o = e.plane.distanceToPoint(i.start), s = e.plane.distanceToPoint(i.end);
		return G(o) ? G(s) ? h(e, t, n, r) : (n && (n.start.copy(i.start), n.end.copy(i.start)), e.containsPoint(i.start)) : G(s) ? (n && (n.start.copy(i.end), n.end.copy(i.end)), e.containsPoint(i.end)) : e.plane.intersectLine(i, a) != null && (n && (n.start.copy(a), n.end.copy(a)), e.containsPoint(a));
	}
	function y(e, t, n) {
		let r = t.a;
		return G(e.plane.distanceToPoint(r)) && e.containsPoint(r) ? (n && (n.start.copy(r), n.end.copy(r)), !0) : !1;
	}
	function b(e, t, n) {
		let r = e.degenerateSegment, i = t.a;
		return r.closestPointToPoint(i, !0, a), i.distanceToSquared(a) < qe && (n && (n.start.copy(i), n.end.copy(i)), !0);
	}
	function x(e, t, n, r) {
		if (e.isDegenerateIntoSegment) {
			if (t.isDegenerateIntoSegment) {
				let r = e.degenerateSegment, i = t.degenerateSegment, o = s, l = c;
				r.delta(o), i.delta(l);
				let u = a.subVectors(i.start, r.start), d = o.x * l.y - o.y * l.x;
				if (G(d)) return !1;
				let f = (u.x * l.y - u.y * l.x) / d, p = -(o.x * u.y - o.y * u.x) / d;
				return f < 0 || f > 1 || p < 0 || p > 1 ? !1 : G(r.start.z + o.z * f - (i.start.z + l.z * p)) ? (n && (n.start.copy(r.start).addScaledVector(o, f), n.end.copy(r.start).addScaledVector(o, f)), !0) : !1;
			}
			return t.isDegenerateIntoPoint ? b(e, t, n) : v(t, e, n, r);
		}
		if (e.isDegenerateIntoPoint) return t.isDegenerateIntoPoint ? t.a.distanceToSquared(e.a) < qe && (n && (n.start.copy(e.a), n.end.copy(e.a)), !0) : t.isDegenerateIntoSegment ? b(t, e, n) : y(t, e, n);
		if (t.isDegenerateIntoPoint) return y(e, t, n);
		if (t.isDegenerateIntoSegment) return v(e, t, n, r);
	}
	return function(t, n = null, r = !1) {
		this.needsUpdate && this.update(), t.isExtendedTriangle ? t.needsUpdate && t.update() : (e.copy(t), e.update(), t = e);
		let i = x(this, t, n, r);
		if (i !== void 0) return i;
		let a = this.plane, o = t.plane, l = o.distanceToPoint(this.a), g = o.distanceToPoint(this.b), v = o.distanceToPoint(this.c);
		G(l) && (l = 0), G(g) && (g = 0), G(v) && (v = 0);
		let y = l * g, b = l * v;
		if (y > 0 && b > 0) return !1;
		let S = a.distanceToPoint(t.a), C = a.distanceToPoint(t.b), w = a.distanceToPoint(t.c);
		G(S) && (S = 0), G(C) && (C = 0), G(w) && (w = 0);
		let T = S * C, E = S * w;
		if (T > 0 && E > 0) return !1;
		s.copy(a.normal), c.copy(o.normal);
		let D = s.cross(c), O = 0, k = Math.abs(D.x), A = Math.abs(D.y);
		A > k && (k = A, O = 1), Math.abs(D.z) > k && (O = 2);
		let j = Ke[O], M = this.a[j], ee = this.b[j], te = this.c[j], ne = t.a[j], re = t.b[j], N = t.c[j];
		if (_(this, M, ee, te, y, b, l, g, v, p, u) || _(t, ne, re, N, T, E, S, C, w, m, d)) return h(this, t, n, r);
		if (p.y < p.x) {
			let e = p.y;
			p.y = p.x, p.x = e, f.copy(u.start), u.start.copy(u.end), u.end.copy(f);
		}
		if (m.y < m.x) {
			let e = m.y;
			m.y = m.x, m.x = e, f.copy(d.start), d.start.copy(d.end), d.end.copy(f);
		}
		return p.y < m.x || m.y < p.x ? !1 : (n && (m.x > p.x ? n.start.copy(d.start) : n.start.copy(u.start), m.y < p.y ? n.end.copy(d.end) : n.end.copy(u.end)), !0);
	};
})(), K.prototype.distanceToPoint = (function() {
	let e = /* @__PURE__ */ new r();
	return function(t) {
		return this.closestPointToPoint(t, e), t.distanceTo(e);
	};
})(), K.prototype.distanceToTriangle = (function() {
	let e = /* @__PURE__ */ new r(), t = /* @__PURE__ */ new r(), n = [
		"a",
		"b",
		"c"
	], i = /* @__PURE__ */ new o(), a = /* @__PURE__ */ new o();
	return function(r, o = null, s = null) {
		let c = o || s ? i : null;
		if (this.intersectsTriangle(r, c, !0)) return (o || s) && (o && c.getCenter(o), s && c.getCenter(s)), 0;
		let l = Infinity;
		for (let t = 0; t < 3; t++) {
			let i, a = n[t], c = r[a];
			this.closestPointToPoint(c, e), i = c.distanceToSquared(e), i < l && (l = i, o && o.copy(e), s && s.copy(c));
			let u = this[a];
			r.closestPointToPoint(u, e), i = u.distanceToSquared(e), i < l && (l = i, o && o.copy(u), s && s.copy(e));
		}
		for (let c = 0; c < 3; c++) {
			let u = n[c], d = n[(c + 1) % 3];
			i.set(this[u], this[d]);
			for (let c = 0; c < 3; c++) {
				let u = n[c], d = n[(c + 1) % 3];
				a.set(r[u], r[d]), We(i, a, e, t);
				let f = e.distanceToSquared(t);
				f < l && (l = f, o && o.copy(e), s && s.copy(t));
			}
		}
		return Math.sqrt(l);
	};
})();
// node_modules/three-mesh-bvh/src/math/OrientedBox.js
var q = class {
	constructor(e, t, n) {
		this.isOrientedBox = !0, this.min = new r(), this.max = new r(), this.matrix = new a(), this.invMatrix = new a(), this.points = Array(8).fill().map(() => new r()), this.satAxes = [
			,
			,
			,
		].fill().map(() => new r()), this.satBounds = [
			,
			,
			,
		].fill().map(() => new U()), this.alignedSatBounds = [
			,
			,
			,
		].fill().map(() => new U()), this.needsUpdate = !1, e && this.min.copy(e), t && this.max.copy(t), n && this.matrix.copy(n);
	}
	set(e, t, n) {
		this.min.copy(e), this.max.copy(t), this.matrix.copy(n), this.needsUpdate = !0;
	}
	copy(e) {
		this.min.copy(e.min), this.max.copy(e.max), this.matrix.copy(e.matrix), this.needsUpdate = !0;
	}
};
q.prototype.update = (function() {
	return function() {
		let e = this.matrix, t = this.min, n = this.max, r = this.points;
		for (let i = 0; i <= 1; i++) for (let a = 0; a <= 1; a++) for (let o = 0; o <= 1; o++) {
			let s = r[1 * i | 2 * a | 4 * o];
			s.x = i ? n.x : t.x, s.y = a ? n.y : t.y, s.z = o ? n.z : t.z, s.applyMatrix4(e);
		}
		let i = this.satBounds, a = this.satAxes, o = r[0];
		for (let e = 0; e < 3; e++) {
			let t = a[e], n = i[e], s = r[1 << e];
			t.subVectors(o, s), n.setFromPoints(t, r);
		}
		let s = this.alignedSatBounds;
		s[0].setFromPointsField(r, "x"), s[1].setFromPointsField(r, "y"), s[2].setFromPointsField(r, "z"), this.invMatrix.copy(this.matrix).invert(), this.needsUpdate = !1;
	};
})(), q.prototype.intersectsBox = (function() {
	let e = /* @__PURE__ */ new U();
	return function(t) {
		this.needsUpdate && this.update();
		let n = t.min, r = t.max, i = this.satBounds, a = this.satAxes, o = this.alignedSatBounds;
		if (e.min = n.x, e.max = r.x, o[0].isSeparated(e) || (e.min = n.y, e.max = r.y, o[1].isSeparated(e)) || (e.min = n.z, e.max = r.z, o[2].isSeparated(e))) return !1;
		for (let n = 0; n < 3; n++) {
			let r = a[n], o = i[n];
			if (e.setFromBox(r, t), o.isSeparated(e)) return !1;
		}
		return !0;
	};
})(), q.prototype.intersectsTriangle = (function() {
	let e = /* @__PURE__ */ new K(), t = [
		,
		,
		,
	], n = /* @__PURE__ */ new U(), i = /* @__PURE__ */ new U(), a = /* @__PURE__ */ new r();
	return function(r) {
		this.needsUpdate && this.update(), r.isExtendedTriangle ? r.needsUpdate && r.update() : (e.copy(r), e.update(), r = e);
		let o = this.satBounds, s = this.satAxes;
		t[0] = r.a, t[1] = r.b, t[2] = r.c;
		for (let e = 0; e < 3; e++) {
			let r = o[e], i = s[e];
			if (n.setFromPoints(i, t), r.isSeparated(n)) return !1;
		}
		let c = r.satBounds, l = r.satAxes, u = this.points;
		for (let e = 0; e < 3; e++) {
			let t = c[e], r = l[e];
			if (n.setFromPoints(r, u), t.isSeparated(n)) return !1;
		}
		for (let e = 0; e < 3; e++) {
			let r = s[e];
			for (let e = 0; e < 4; e++) {
				let o = l[e];
				if (a.crossVectors(r, o), n.setFromPoints(a, t), i.setFromPoints(a, u), n.isSeparated(i)) return !1;
			}
		}
		return !0;
	};
})(), q.prototype.closestPointToPoint = (function() {
	return function(e, t) {
		return this.needsUpdate && this.update(), t.copy(e).applyMatrix4(this.invMatrix).clamp(this.min, this.max).applyMatrix4(this.matrix), t;
	};
})(), q.prototype.distanceToPoint = (function() {
	let e = new r();
	return function(t) {
		return this.closestPointToPoint(t, e), t.distanceTo(e);
	};
})(), q.prototype.distanceToBox = (function() {
	let e = [
		"x",
		"y",
		"z"
	], t = /* @__PURE__ */ Array(12).fill().map(() => new o()), n = /* @__PURE__ */ Array(12).fill().map(() => new o()), i = /* @__PURE__ */ new r(), a = /* @__PURE__ */ new r();
	return function(r, o = 0, s = null, c = null) {
		if (this.needsUpdate && this.update(), this.intersectsBox(r)) return (s || c) && (r.getCenter(a), this.closestPointToPoint(a, i), r.closestPointToPoint(i, a), s && s.copy(i), c && c.copy(a)), 0;
		let l = o * o, u = r.min, d = r.max, f = this.points, p = Infinity;
		for (let e = 0; e < 8; e++) {
			let t = f[e];
			a.copy(t).clamp(u, d);
			let n = t.distanceToSquared(a);
			if (n < p && (p = n, s && s.copy(t), c && c.copy(a), n < l)) return Math.sqrt(n);
		}
		let m = 0;
		for (let r = 0; r < 3; r++) for (let i = 0; i <= 1; i++) for (let a = 0; a <= 1; a++) {
			let o = (r + 1) % 3, s = (r + 2) % 3, c = i << o | a << s, l = 1 << r | i << o | a << s, p = f[c], h = f[l];
			t[m].set(p, h);
			let g = e[r], _ = e[o], v = e[s], y = n[m], b = y.start, x = y.end;
			b[g] = u[g], b[_] = i ? u[_] : d[_], b[v] = a ? u[v] : d[v], x[g] = d[g], x[_] = i ? u[_] : d[_], x[v] = a ? u[v] : d[v], m++;
		}
		for (let e = 0; e <= 1; e++) for (let t = 0; t <= 1; t++) for (let n = 0; n <= 1; n++) {
			a.x = e ? d.x : u.x, a.y = t ? d.y : u.y, a.z = n ? d.z : u.z, this.closestPointToPoint(a, i);
			let r = a.distanceToSquared(i);
			if (r < p && (p = r, s && s.copy(i), c && c.copy(a), r < l)) return Math.sqrt(r);
		}
		for (let e = 0; e < 12; e++) {
			let r = t[e];
			for (let e = 0; e < 12; e++) {
				let t = n[e];
				We(r, t, i, a);
				let o = i.distanceToSquared(a);
				if (o < p && (p = o, s && s.copy(i), c && c.copy(a), o < l)) return Math.sqrt(o);
			}
		}
		return Math.sqrt(p);
	};
})();
var J = /* @__PURE__ */ new class extends ge {
	constructor() {
		super(() => new K());
	}
}(), Je = /* @__PURE__ */ new r(), Ye = /* @__PURE__ */ new r();
function Xe(e, t, n = {}, r = 0, i = Infinity) {
	let a = r * r, o = i * i, s = Infinity, c = null;
	if (e.shapecast({
		boundsTraverseOrder: (e) => (Je.copy(t).clamp(e.min, e.max), Je.distanceToSquared(t)),
		intersectsBounds: (e, t, n) => n < s && n < o,
		intersectsTriangle: (e, n) => {
			e.closestPointToPoint(t, Je);
			let r = t.distanceToSquared(Je);
			return r < s && (Ye.copy(Je), s = r, c = n), r < a;
		}
	}), s === Infinity) return null;
	let l = Math.sqrt(s);
	return n.point ? n.point.copy(Ye) : n.point = Ye.clone(), n.distance = l, n.faceIndex = c, n;
}
// node_modules/three-mesh-bvh/src/utils/ThreeRayIntersectUtilities.js
var Ze = !0, Y = /* @__PURE__ */ new r(), X = /* @__PURE__ */ new r(), Z = /* @__PURE__ */ new r(), Qe = /* @__PURE__ */ new t(), $e = /* @__PURE__ */ new t(), et = /* @__PURE__ */ new t(), tt = /* @__PURE__ */ new r(), nt = /* @__PURE__ */ new r(), rt = /* @__PURE__ */ new r(), it = /* @__PURE__ */ new r();
function at(e, t, n, r, i, a, o, s) {
	let c;
	if (c = a === 1 ? e.intersectTriangle(r, n, t, !0, i) : e.intersectTriangle(t, n, r, a !== 2, i), c === null) return null;
	let l = e.origin.distanceTo(i);
	return l < o || l > s ? null : {
		distance: l,
		point: i.clone()
	};
}
function ot(e, n, i, a, o, c, l, u, d, f, p) {
	Y.fromBufferAttribute(n, c), X.fromBufferAttribute(n, l), Z.fromBufferAttribute(n, u);
	let m = at(e, Y, X, Z, it, d, f, p);
	if (m) {
		if (a) {
			Qe.fromBufferAttribute(a, c), $e.fromBufferAttribute(a, l), et.fromBufferAttribute(a, u), m.uv = new t();
			let e = s.getInterpolation(it, Y, X, Z, Qe, $e, et, m.uv);
			Ze || (m.uv = e);
		}
		if (o) {
			Qe.fromBufferAttribute(o, c), $e.fromBufferAttribute(o, l), et.fromBufferAttribute(o, u), m.uv1 = new t();
			let e = s.getInterpolation(it, Y, X, Z, Qe, $e, et, m.uv1);
			Ze || (m.uv1 = e);
		}
		if (i) {
			tt.fromBufferAttribute(i, c), nt.fromBufferAttribute(i, l), rt.fromBufferAttribute(i, u), m.normal = new r();
			let t = s.getInterpolation(it, Y, X, Z, tt, nt, rt, m.normal);
			m.normal.dot(e.direction) > 0 && m.normal.multiplyScalar(-1), Ze || (m.normal = t);
		}
		let n = {
			a: c,
			b: l,
			c: u,
			normal: new r(),
			materialIndex: 0
		};
		if (s.getNormal(Y, X, Z, n.normal), m.face = n, m.faceIndex = c, Ze) {
			let e = new r();
			s.getBarycoord(it, Y, X, Z, e), m.barycoord = e;
		}
	}
	return m;
}
function st(e) {
	return e && e.isMaterial ? e.side : e;
}
function ct(e, t, n, r, i, a, o) {
	let s = r * 3, c = s + 0, l = s + 1, u = s + 2, { index: d, groups: f } = e;
	e.index && (c = d.getX(c), l = d.getX(l), u = d.getX(u));
	let { position: p, normal: m, uv: h, uv1: g } = e.attributes;
	if (Array.isArray(t)) {
		let e = r * 3;
		for (let s = 0, d = f.length; s < d; s++) {
			let { start: d, count: _, materialIndex: v } = f[s];
			if (e >= d && e < d + _) {
				let e = st(t[v]), s = ot(n, p, m, h, g, c, l, u, e, a, o);
				if (s) {
					if (s.faceIndex = r, s.face.materialIndex = v, i) i.push(s);
					else return s;
				}
			}
		}
	} else {
		let e = st(t), s = ot(n, p, m, h, g, c, l, u, e, a, o);
		if (s) {
			if (s.faceIndex = r, s.face.materialIndex = 0, i) i.push(s);
			else return s;
		}
	}
	return null;
}
// node_modules/three-mesh-bvh/src/utils/TriangleUtilities.js
function Q(e, t, n, r) {
	let i = e.a, a = e.b, o = e.c, s = t, c = t + 1, l = t + 2;
	n && (s = n.getX(s), c = n.getX(c), l = n.getX(l)), i.x = r.getX(s), i.y = r.getY(s), i.z = r.getZ(s), a.x = r.getX(c), a.y = r.getY(c), a.z = r.getZ(c), o.x = r.getX(l), o.y = r.getY(l), o.z = r.getZ(l);
}
var lt = /* @__PURE__ */ new r(), ut = /* @__PURE__ */ new r(), dt = /* @__PURE__ */ new r(), ft = /* @__PURE__ */ new t(), pt = /* @__PURE__ */ new t(), mt = /* @__PURE__ */ new t();
function ht(e, n, i, a) {
	let o = n.getIndex().array, c = n.getAttribute("position"), l = n.getAttribute("uv"), u = o[i * 3], d = o[i * 3 + 1], f = o[i * 3 + 2];
	lt.fromBufferAttribute(c, u), ut.fromBufferAttribute(c, d), dt.fromBufferAttribute(c, f);
	let p = 0, m = n.groups, h = i * 3;
	for (let e = 0, t = m.length; e < t; e++) {
		let t = m[e], { start: n, count: r } = t;
		if (h >= n && h < n + r) {
			p = t.materialIndex;
			break;
		}
	}
	let g = a && a.barycoord ? a.barycoord : new r();
	s.getBarycoord(e, lt, ut, dt, g);
	let _ = null;
	return l && (ft.fromBufferAttribute(l, u), pt.fromBufferAttribute(l, d), mt.fromBufferAttribute(l, f), _ = a && a.uv ? a.uv : new t(), s.getInterpolation(e, lt, ut, dt, ft, pt, mt, _)), a ? (a.face ||= {}, a.face.a = u, a.face.b = d, a.face.c = f, a.face.materialIndex = p, a.face.normal || (a.face.normal = new r()), s.getNormal(lt, ut, dt, a.face.normal), _ && (a.uv = _), a.barycoord = g, a) : {
		face: {
			a: u,
			b: d,
			c: f,
			materialIndex: p,
			normal: s.getNormal(lt, ut, dt, new r())
		},
		uv: _,
		barycoord: g
	};
}
// node_modules/three-mesh-bvh/src/core/utils/iterationUtils.generated.js
function gt(e, t, n, r, i, a, o, s) {
	let { geometry: c, _indirectBuffer: l } = e;
	for (let e = r, l = r + i; e < l; e++) ct(c, t, n, e, a, o, s);
}
function _t(e, t, n, r, i, a, o) {
	let { geometry: s, _indirectBuffer: c } = e, l = Infinity, u = null;
	for (let e = r, c = r + i; e < c; e++) {
		let r;
		r = ct(s, t, n, e, null, a, o), r && r.distance < l && (u = r, l = r.distance);
	}
	return u;
}
function vt(e, t, n, r, i, a, o) {
	let { geometry: s } = n, { index: c } = s, l = s.attributes.position;
	for (let n = e, s = t + e; n < s; n++) {
		let e;
		if (e = n, Q(o, e * 3, c, l), o.needsUpdate = !0, r(o, e, i, a)) return !0;
	}
	return !1;
}
// node_modules/three-mesh-bvh/src/core/cast/refit.generated.js
function yt(e, t = null) {
	t && Array.isArray(t) && (t = new Set(t));
	let n = e.geometry, r = n.index ? n.index.array : null, i = n.attributes.position, a, o, s, c, l = 0, u = e._roots;
	for (let e = 0, t = u.length; e < t; e++) a = u[e], o = new Uint32Array(a), s = new Uint16Array(a), c = new Float32Array(a), d(0, l), l += a.byteLength;
	function d(e, n, a = !1) {
		let l = e * 2;
		if (E(l, s)) {
			let t = D(e, o), n = O(l, s), a = Infinity, u = Infinity, d = Infinity, f = -Infinity, p = -Infinity, m = -Infinity;
			for (let e = 3 * t, o = 3 * (t + n); e < o; e++) {
				let t = r[e], n = i.getX(t), o = i.getY(t), s = i.getZ(t);
				n < a && (a = n), n > f && (f = n), o < u && (u = o), o > p && (p = o), s < d && (d = s), s > m && (m = s);
			}
			return c[e + 0] !== a || c[e + 1] !== u || c[e + 2] !== d || c[e + 3] !== f || c[e + 4] !== p || c[e + 5] !== m ? (c[e + 0] = a, c[e + 1] = u, c[e + 2] = d, c[e + 3] = f, c[e + 4] = p, c[e + 5] = m, !0) : !1;
		}
		{
			let r = k(e), i = A(e, o), s = a, l = !1, u = !1;
			if (t) {
				if (!s) {
					let e = r / 8 + n / 32, a = i / 8 + n / 32;
					l = t.has(e), u = t.has(a), s = !l && !u;
				}
			} else l = !0, u = !0;
			let f = s || l, p = s || u, m = !1;
			f && (m = d(r, n, s));
			let h = !1;
			p && (h = d(i, n, s));
			let g = m || h;
			if (g) for (let t = 0; t < 3; t++) {
				let n = r + t, a = i + t, o = c[n], s = c[n + 3], l = c[a], u = c[a + 3];
				c[e + t] = o < l ? o : l, c[e + t + 3] = s > u ? s : u;
			}
			return g;
		}
	}
}
// node_modules/three-mesh-bvh/src/core/utils/intersectUtils.js
function $(e, t, n, r, i) {
	let a, o, s, c, l, u, d = 1 / n.direction.x, f = 1 / n.direction.y, p = 1 / n.direction.z, m = n.origin.x, h = n.origin.y, g = n.origin.z, _ = t[e], v = t[e + 3], y = t[e + 1], b = t[e + 3 + 1], x = t[e + 2], S = t[e + 3 + 2];
	return d >= 0 ? (a = (_ - m) * d, o = (v - m) * d) : (a = (v - m) * d, o = (_ - m) * d), f >= 0 ? (s = (y - h) * f, c = (b - h) * f) : (s = (b - h) * f, c = (y - h) * f), a > c || s > o || ((s > a || isNaN(a)) && (a = s), (c < o || isNaN(o)) && (o = c), p >= 0 ? (l = (x - g) * p, u = (S - g) * p) : (l = (S - g) * p, u = (x - g) * p), a > u || l > o) ? !1 : ((l > a || a !== a) && (a = l), (u < o || o !== o) && (o = u), a <= i && o >= r);
}
// node_modules/three-mesh-bvh/src/core/utils/iterationUtils_indirect.generated.js
function bt(e, t, n, r, i, a, o, s) {
	let { geometry: c, _indirectBuffer: l } = e;
	for (let e = r, u = r + i; e < u; e++) ct(c, t, n, l ? l[e] : e, a, o, s);
}
function xt(e, t, n, r, i, a, o) {
	let { geometry: s, _indirectBuffer: c } = e, l = Infinity, u = null;
	for (let e = r, d = r + i; e < d; e++) {
		let r;
		r = ct(s, t, n, c ? c[e] : e, null, a, o), r && r.distance < l && (u = r, l = r.distance);
	}
	return u;
}
function St(e, t, n, r, i, a, o) {
	let { geometry: s } = n, { index: c } = s, l = s.attributes.position;
	for (let s = e, u = t + e; s < u; s++) {
		let e;
		if (e = n.resolveTriangleIndex(s), Q(o, e * 3, c, l), o.needsUpdate = !0, r(o, e, i, a)) return !0;
	}
	return !1;
}
// node_modules/three-mesh-bvh/src/core/cast/raycast.generated.js
function Ct(e, t, n, r, i, a, o) {
	L.setBuffer(e._roots[t]), $(0, L.float32Array, r, a, o) && wt(0, e, n, r, i, a, o), L.clearBuffer();
}
function wt(e, t, n, r, i, a, o) {
	let { float32Array: s, uint16Array: c, uint32Array: l } = L, u = e * 2;
	if (E(u, c)) gt(t, n, r, D(e, l), O(u, c), i, a, o);
	else {
		let c = k(e);
		$(c, s, r, a, o) && wt(c, t, n, r, i, a, o);
		let u = A(e, l);
		$(u, s, r, a, o) && wt(u, t, n, r, i, a, o);
	}
}
// node_modules/three-mesh-bvh/src/core/cast/raycastFirst.generated.js
var Tt = [
	"x",
	"y",
	"z"
];
function Et(e, t, n, r, i, a) {
	L.setBuffer(e._roots[t]);
	let o = null;
	return $(0, L.float32Array, r, i, a) && (o = Dt(0, e, n, r, i, a)), L.clearBuffer(), o;
}
function Dt(e, t, n, r, i, a) {
	let { float32Array: o, uint16Array: s, uint32Array: c } = L, l = e * 2;
	if (E(l, s)) return _t(t, n, r, D(e, c), O(l, s), i, a);
	{
		let s = j(e, c), l = Tt[s], u = r.direction[l] >= 0, d, f;
		u ? (d = k(e), f = A(e, c)) : (d = A(e, c), f = k(e));
		let p = $(d, o, r, i, a) ? Dt(d, t, n, r, i, a) : null;
		if (p) {
			let e = p.point[l];
			if (u ? e <= o[f + s] : e >= o[f + s + 3]) return p;
		}
		let m = $(f, o, r, i, a) ? Dt(f, t, n, r, i, a) : null;
		return p && m ? p.distance <= m.distance ? p : m : p || m || null;
	}
}
// node_modules/three-mesh-bvh/src/core/cast/intersectsGeometry.generated.js
var Ot = /* @__PURE__ */ new n(), kt = /* @__PURE__ */ new K(), At = /* @__PURE__ */ new K(), jt = /* @__PURE__ */ new a(), Mt = /* @__PURE__ */ new q(), Nt = /* @__PURE__ */ new q();
function Pt(e, t, n, r) {
	L.setBuffer(e._roots[t]);
	let i = Ft(0, e, n, r);
	return L.clearBuffer(), i;
}
function Ft(e, t, n, r, i = null) {
	let { float32Array: a, uint16Array: o, uint32Array: s } = L, c = e * 2;
	if (i === null && (n.boundingBox || n.computeBoundingBox(), Mt.set(n.boundingBox.min, n.boundingBox.max, r), i = Mt), E(c, o)) {
		let i = t.geometry, l = i.index, u = i.attributes.position, d = n.index, f = n.attributes.position, p = D(e, s), m = O(c, o);
		if (jt.copy(r).invert(), n.boundsTree) return S(M(e), a, Nt), Nt.matrix.copy(jt), Nt.needsUpdate = !0, n.boundsTree.shapecast({
			intersectsBounds: (e) => Nt.intersectsBox(e),
			intersectsTriangle: (e) => {
				e.a.applyMatrix4(r), e.b.applyMatrix4(r), e.c.applyMatrix4(r), e.needsUpdate = !0;
				for (let t = p * 3, n = (m + p) * 3; t < n; t += 3) if (Q(At, t, l, u), At.needsUpdate = !0, e.intersectsTriangle(At)) return !0;
				return !1;
			}
		});
		{
			let e = Fe(n);
			for (let t = p * 3, n = (m + p) * 3; t < n; t += 3) {
				Q(kt, t, l, u), kt.a.applyMatrix4(jt), kt.b.applyMatrix4(jt), kt.c.applyMatrix4(jt), kt.needsUpdate = !0;
				for (let t = 0, n = e * 3; t < n; t += 3) if (Q(At, t, d, f), At.needsUpdate = !0, kt.intersectsTriangle(At)) return !0;
			}
		}
	} else {
		let o = k(e), c = A(e, s);
		return S(M(o), a, Ot), !!(i.intersectsBox(Ot) && Ft(o, t, n, r, i) || (S(M(c), a, Ot), i.intersectsBox(Ot) && Ft(c, t, n, r, i)));
	}
}
// node_modules/three-mesh-bvh/src/core/cast/closestPointToGeometry.generated.js
var It = /* @__PURE__ */ new a(), Lt = /* @__PURE__ */ new q(), Rt = /* @__PURE__ */ new q(), zt = /* @__PURE__ */ new r(), Bt = /* @__PURE__ */ new r(), Vt = /* @__PURE__ */ new r(), Ht = /* @__PURE__ */ new r();
function Ut(e, t, n, r = {}, i = {}, a = 0, o = Infinity) {
	t.boundingBox || t.computeBoundingBox(), Lt.set(t.boundingBox.min, t.boundingBox.max, n), Lt.needsUpdate = !0;
	let s = e.geometry, c = s.attributes.position, l = s.index, u = t.attributes.position, d = t.index, f = J.getPrimitive(), p = J.getPrimitive(), m = zt, h = Bt, g = null, _ = null;
	i && (g = Vt, _ = Ht);
	let v = Infinity, y = null, b = null;
	return It.copy(n).invert(), Rt.matrix.copy(It), e.shapecast({
		boundsTraverseOrder: (e) => Lt.distanceToBox(e),
		intersectsBounds: (e, t, n) => n < v && n < o && (t && (Rt.min.copy(e.min), Rt.max.copy(e.max), Rt.needsUpdate = !0), !0),
		intersectsRange: (e, r) => {
			if (t.boundsTree) return t.boundsTree.shapecast({
				boundsTraverseOrder: (e) => Rt.distanceToBox(e),
				intersectsBounds: (e, t, n) => n < v && n < o,
				intersectsRange: (t, i) => {
					for (let o = t, s = t + i; o < s; o++) {
						Q(p, 3 * o, d, u), p.a.applyMatrix4(n), p.b.applyMatrix4(n), p.c.applyMatrix4(n), p.needsUpdate = !0;
						for (let t = e, n = e + r; t < n; t++) {
							Q(f, 3 * t, l, c), f.needsUpdate = !0;
							let e = f.distanceToTriangle(p, m, g);
							if (e < v && (h.copy(m), _ && _.copy(g), v = e, y = t, b = o), e < a) return !0;
						}
					}
				}
			});
			{
				let i = Fe(t);
				for (let t = 0, o = i; t < o; t++) {
					Q(p, 3 * t, d, u), p.a.applyMatrix4(n), p.b.applyMatrix4(n), p.c.applyMatrix4(n), p.needsUpdate = !0;
					for (let n = e, i = e + r; n < i; n++) {
						Q(f, 3 * n, l, c), f.needsUpdate = !0;
						let e = f.distanceToTriangle(p, m, g);
						if (e < v && (h.copy(m), _ && _.copy(g), v = e, y = n, b = t), e < a) return !0;
					}
				}
			}
		}
	}), J.releasePrimitive(f), J.releasePrimitive(p), v === Infinity ? null : (r.point ? r.point.copy(h) : r.point = h.clone(), r.distance = v, r.faceIndex = y, i && (i.point ? i.point.copy(_) : i.point = _.clone(), i.point.applyMatrix4(It), h.applyMatrix4(It), i.distance = h.sub(i.point).length(), i.faceIndex = b), r);
}
// node_modules/three-mesh-bvh/src/core/cast/refit_indirect.generated.js
function Wt(e, t = null) {
	t && Array.isArray(t) && (t = new Set(t));
	let n = e.geometry, r = n.index ? n.index.array : null, i = n.attributes.position, a, o, s, c, l = 0, u = e._roots;
	for (let e = 0, t = u.length; e < t; e++) a = u[e], o = new Uint32Array(a), s = new Uint16Array(a), c = new Float32Array(a), d(0, l), l += a.byteLength;
	function d(n, a, l = !1) {
		let u = n * 2;
		if (E(u, s)) {
			let t = D(n, o), a = O(u, s), l = Infinity, d = Infinity, f = Infinity, p = -Infinity, m = -Infinity, h = -Infinity;
			for (let n = t, o = t + a; n < o; n++) {
				let t = 3 * e.resolveTriangleIndex(n);
				for (let e = 0; e < 3; e++) {
					let n = t + e;
					n = r ? r[n] : n;
					let a = i.getX(n), o = i.getY(n), s = i.getZ(n);
					a < l && (l = a), a > p && (p = a), o < d && (d = o), o > m && (m = o), s < f && (f = s), s > h && (h = s);
				}
			}
			return c[n + 0] !== l || c[n + 1] !== d || c[n + 2] !== f || c[n + 3] !== p || c[n + 4] !== m || c[n + 5] !== h ? (c[n + 0] = l, c[n + 1] = d, c[n + 2] = f, c[n + 3] = p, c[n + 4] = m, c[n + 5] = h, !0) : !1;
		}
		{
			let e = k(n), r = A(n, o), i = l, s = !1, u = !1;
			if (t) {
				if (!i) {
					let n = e / 8 + a / 32, o = r / 8 + a / 32;
					s = t.has(n), u = t.has(o), i = !s && !u;
				}
			} else s = !0, u = !0;
			let f = i || s, p = i || u, m = !1;
			f && (m = d(e, a, i));
			let h = !1;
			p && (h = d(r, a, i));
			let g = m || h;
			if (g) for (let t = 0; t < 3; t++) {
				let i = e + t, a = r + t, o = c[i], s = c[i + 3], l = c[a], u = c[a + 3];
				c[n + t] = o < l ? o : l, c[n + t + 3] = s > u ? s : u;
			}
			return g;
		}
	}
}
// node_modules/three-mesh-bvh/src/core/cast/raycast_indirect.generated.js
function Gt(e, t, n, r, i, a, o) {
	L.setBuffer(e._roots[t]), $(0, L.float32Array, r, a, o) && Kt(0, e, n, r, i, a, o), L.clearBuffer();
}
function Kt(e, t, n, r, i, a, o) {
	let { float32Array: s, uint16Array: c, uint32Array: l } = L, u = e * 2;
	if (E(u, c)) bt(t, n, r, D(e, l), O(u, c), i, a, o);
	else {
		let c = k(e);
		$(c, s, r, a, o) && Kt(c, t, n, r, i, a, o);
		let u = A(e, l);
		$(u, s, r, a, o) && Kt(u, t, n, r, i, a, o);
	}
}
// node_modules/three-mesh-bvh/src/core/cast/raycastFirst_indirect.generated.js
var qt = [
	"x",
	"y",
	"z"
];
function Jt(e, t, n, r, i, a) {
	L.setBuffer(e._roots[t]);
	let o = null;
	return $(0, L.float32Array, r, i, a) && (o = Yt(0, e, n, r, i, a)), L.clearBuffer(), o;
}
function Yt(e, t, n, r, i, a) {
	let { float32Array: o, uint16Array: s, uint32Array: c } = L, l = e * 2;
	if (E(l, s)) return xt(t, n, r, D(e, c), O(l, s), i, a);
	{
		let s = j(e, c), l = qt[s], u = r.direction[l] >= 0, d, f;
		u ? (d = k(e), f = A(e, c)) : (d = A(e, c), f = k(e));
		let p = $(d, o, r, i, a) ? Yt(d, t, n, r, i, a) : null;
		if (p) {
			let e = p.point[l];
			if (u ? e <= o[f + s] : e >= o[f + s + 3]) return p;
		}
		let m = $(f, o, r, i, a) ? Yt(f, t, n, r, i, a) : null;
		return p && m ? p.distance <= m.distance ? p : m : p || m || null;
	}
}
// node_modules/three-mesh-bvh/src/core/cast/intersectsGeometry_indirect.generated.js
var Xt = /* @__PURE__ */ new n(), Zt = /* @__PURE__ */ new K(), Qt = /* @__PURE__ */ new K(), $t = /* @__PURE__ */ new a(), en = /* @__PURE__ */ new q(), tn = /* @__PURE__ */ new q();
function nn(e, t, n, r) {
	L.setBuffer(e._roots[t]);
	let i = rn(0, e, n, r);
	return L.clearBuffer(), i;
}
function rn(e, t, n, r, i = null) {
	let { float32Array: a, uint16Array: o, uint32Array: s } = L, c = e * 2;
	if (i === null && (n.boundingBox || n.computeBoundingBox(), en.set(n.boundingBox.min, n.boundingBox.max, r), i = en), E(c, o)) {
		let i = t.geometry, l = i.index, u = i.attributes.position, d = n.index, f = n.attributes.position, p = D(e, s), m = O(c, o);
		if ($t.copy(r).invert(), n.boundsTree) return S(M(e), a, tn), tn.matrix.copy($t), tn.needsUpdate = !0, n.boundsTree.shapecast({
			intersectsBounds: (e) => tn.intersectsBox(e),
			intersectsTriangle: (e) => {
				e.a.applyMatrix4(r), e.b.applyMatrix4(r), e.c.applyMatrix4(r), e.needsUpdate = !0;
				for (let n = p, r = m + p; n < r; n++) if (Q(Qt, 3 * t.resolveTriangleIndex(n), l, u), Qt.needsUpdate = !0, e.intersectsTriangle(Qt)) return !0;
				return !1;
			}
		});
		{
			let e = Fe(n);
			for (let n = p, r = m + p; n < r; n++) {
				Q(Zt, 3 * t.resolveTriangleIndex(n), l, u), Zt.a.applyMatrix4($t), Zt.b.applyMatrix4($t), Zt.c.applyMatrix4($t), Zt.needsUpdate = !0;
				for (let t = 0, n = e * 3; t < n; t += 3) if (Q(Qt, t, d, f), Qt.needsUpdate = !0, Zt.intersectsTriangle(Qt)) return !0;
			}
		}
	} else {
		let o = k(e), c = A(e, s);
		return S(M(o), a, Xt), !!(i.intersectsBox(Xt) && rn(o, t, n, r, i) || (S(M(c), a, Xt), i.intersectsBox(Xt) && rn(c, t, n, r, i)));
	}
}
// node_modules/three-mesh-bvh/src/core/cast/closestPointToGeometry_indirect.generated.js
var an = /* @__PURE__ */ new a(), on = /* @__PURE__ */ new q(), sn = /* @__PURE__ */ new q(), cn = /* @__PURE__ */ new r(), ln = /* @__PURE__ */ new r(), un = /* @__PURE__ */ new r(), dn = /* @__PURE__ */ new r();
function fn(e, t, n, r = {}, i = {}, a = 0, o = Infinity) {
	t.boundingBox || t.computeBoundingBox(), on.set(t.boundingBox.min, t.boundingBox.max, n), on.needsUpdate = !0;
	let s = e.geometry, c = s.attributes.position, l = s.index, u = t.attributes.position, d = t.index, f = J.getPrimitive(), p = J.getPrimitive(), m = cn, h = ln, g = null, _ = null;
	i && (g = un, _ = dn);
	let v = Infinity, y = null, b = null;
	return an.copy(n).invert(), sn.matrix.copy(an), e.shapecast({
		boundsTraverseOrder: (e) => on.distanceToBox(e),
		intersectsBounds: (e, t, n) => n < v && n < o && (t && (sn.min.copy(e.min), sn.max.copy(e.max), sn.needsUpdate = !0), !0),
		intersectsRange: (r, i) => {
			if (t.boundsTree) {
				let s = t.boundsTree;
				return s.shapecast({
					boundsTraverseOrder: (e) => sn.distanceToBox(e),
					intersectsBounds: (e, t, n) => n < v && n < o,
					intersectsRange: (t, o) => {
						for (let x = t, S = t + o; x < S; x++) {
							let t = s.resolveTriangleIndex(x);
							Q(p, 3 * t, d, u), p.a.applyMatrix4(n), p.b.applyMatrix4(n), p.c.applyMatrix4(n), p.needsUpdate = !0;
							for (let t = r, n = r + i; t < n; t++) {
								let n = e.resolveTriangleIndex(t);
								Q(f, 3 * n, l, c), f.needsUpdate = !0;
								let r = f.distanceToTriangle(p, m, g);
								if (r < v && (h.copy(m), _ && _.copy(g), v = r, y = t, b = x), r < a) return !0;
							}
						}
					}
				});
			}
			{
				let o = Fe(t);
				for (let t = 0, s = o; t < s; t++) {
					Q(p, 3 * t, d, u), p.a.applyMatrix4(n), p.b.applyMatrix4(n), p.c.applyMatrix4(n), p.needsUpdate = !0;
					for (let n = r, o = r + i; n < o; n++) {
						let r = e.resolveTriangleIndex(n);
						Q(f, 3 * r, l, c), f.needsUpdate = !0;
						let i = f.distanceToTriangle(p, m, g);
						if (i < v && (h.copy(m), _ && _.copy(g), v = i, y = n, b = t), i < a) return !0;
					}
				}
			}
		}
	}), J.releasePrimitive(f), J.releasePrimitive(p), v === Infinity ? null : (r.point ? r.point.copy(h) : r.point = h.clone(), r.distance = v, r.faceIndex = y, i && (i.point ? i.point.copy(_) : i.point = _.clone(), i.point.applyMatrix4(an), h.applyMatrix4(an), i.distance = h.sub(i.point).length(), i.faceIndex = b), r);
}
// node_modules/three-mesh-bvh/src/utils/GeometryRayIntersectUtilities.js
function pn(e, t, n) {
	return e === null ? null : (e.point.applyMatrix4(t.matrixWorld), e.distance = e.point.distanceTo(n.ray.origin), e.object = t, e);
}
// node_modules/three-mesh-bvh/src/core/MeshBVH.js
var mn = /* @__PURE__ */ new q(), hn = /* @__PURE__ */ new c(), gn = /* @__PURE__ */ new r(), _n = /* @__PURE__ */ new a(), vn = /* @__PURE__ */ new r(), yn = [
	"getX",
	"getY",
	"getZ"
], bn = class t extends He {
	static serialize(e, t = {}) {
		t = {
			cloneBuffers: !0,
			...t
		};
		let n = e.geometry, r = e._roots, i = e._indirectBuffer, a = n.getIndex(), o = {
			version: 1,
			roots: null,
			index: null,
			indirectBuffer: null
		};
		return t.cloneBuffers ? (o.roots = r.map((e) => e.slice()), o.index = a ? a.array.slice() : null, o.indirectBuffer = i ? i.slice() : null) : (o.roots = r, o.index = a ? a.array : null, o.indirectBuffer = i), o;
	}
	static deserialize(n, r, i = {}) {
		i = {
			setIndex: !0,
			indirect: !!n.indirectBuffer,
			...i
		};
		let { index: a, roots: o, indirectBuffer: s } = n;
		n.version || (console.warn("MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data."), l(o));
		let c = new t(r, {
			...i,
			[b]: !0
		});
		if (c._roots = o, c._indirectBuffer = s || null, i.setIndex) {
			let t = r.getIndex();
			if (t === null) {
				let t = new e(n.index, 1, !1);
				r.setIndex(t);
			} else t.array !== a && (t.array.set(a), t.needsUpdate = !0);
		}
		return c;
		function l(e) {
			for (let t = 0; t < e.length; t++) {
				let n = e[t], r = new Uint32Array(n), i = new Uint16Array(n);
				for (let e = 0, t = n.byteLength / 32; e < t; e++) {
					let t = 8 * e;
					E(2 * t, i) || (r[t + 6] = r[t + 6] / 8 - e);
				}
			}
		}
	}
	get primitiveStride() {
		return 3;
	}
	get resolveTriangleIndex() {
		return this.resolvePrimitiveIndex;
	}
	constructor(e, t = {}) {
		t.maxLeafTris && (console.warn("MeshBVH: \"maxLeafTris\" option has been deprecated. Use \"targetLeafSize\", instead."), t = {
			...t,
			targetLeafSize: t.maxLeafTris
		}), super(e, t);
	}
	shiftTriangleOffsets(e) {
		return super.shiftPrimitiveOffsets(e);
	}
	writePrimitiveBounds(e, t, n) {
		let r = this.geometry, i = this._indirectBuffer, a = r.attributes.position, o = r.index ? r.index.array : null, s = (i ? i[e] : e) * 3, c = s + 0, l = s + 1, u = s + 2;
		o && (c = o[c], l = o[l], u = o[u]);
		for (let e = 0; e < 3; e++) {
			let r = a[yn[e]](c), i = a[yn[e]](l), o = a[yn[e]](u), s = r;
			i < s && (s = i), o < s && (s = o);
			let d = r;
			i > d && (d = i), o > d && (d = o), t[n + e] = s, t[n + e + 3] = d;
		}
		return t;
	}
	computePrimitiveBounds(e, t, n) {
		let r = this.geometry, i = this._indirectBuffer, a = r.attributes.position, o = r.index ? r.index.array : null, s = a.normalized;
		if (e < 0 || t + e - n.offset > n.length / 6) throw Error("MeshBVH: compute triangle bounds range is invalid.");
		let c = a.array, l = a.offset || 0, u = 3;
		a.isInterleavedBufferAttribute && (u = a.data.stride);
		let d = [
			"getX",
			"getY",
			"getZ"
		], f = n.offset;
		for (let r = e, p = e + t; r < p; r++) {
			let e = (i ? i[r] : r) * 3, t = (r - f) * 6, p = e + 0, m = e + 1, h = e + 2;
			o && (p = o[p], m = o[m], h = o[h]), s || (p = p * u + l, m = m * u + l, h = h * u + l);
			for (let e = 0; e < 3; e++) {
				let r, i, o;
				s ? (r = a[d[e]](p), i = a[d[e]](m), o = a[d[e]](h)) : (r = c[p + e], i = c[m + e], o = c[h + e]);
				let l = r;
				i < l && (l = i), o < l && (l = o);
				let u = r;
				i > u && (u = i), o > u && (u = o);
				let f = (u - l) / 2, g = e * 2;
				n[t + g + 0] = l + f, n[t + g + 1] = f + (Math.abs(l) + f) * y;
			}
		}
		return n;
	}
	raycastObject3D(e, t, n = []) {
		let { material: r } = e;
		if (r === void 0) return;
		_n.copy(e.matrixWorld).invert(), hn.copy(t.ray).applyMatrix4(_n), vn.setFromMatrixScale(e.matrixWorld), gn.copy(hn.direction).multiply(vn);
		let i = gn.length(), a = t.near / i, o = t.far / i;
		if (t.firstHitOnly === !0) {
			let i = this.raycastFirst(hn, r, a, o);
			i = pn(i, e, t), i && n.push(i);
		} else {
			let i = this.raycast(hn, r, a, o);
			for (let r = 0, a = i.length; r < a; r++) {
				let a = pn(i[r], e, t);
				a && n.push(a);
			}
		}
		return n;
	}
	refit(e = null) {
		return (this.indirect ? Wt : yt)(this, e);
	}
	raycast(e, t = 0, n = 0, r = Infinity) {
		let i = this._roots, a = [], o = this.indirect ? Gt : Ct;
		for (let s = 0, c = i.length; s < c; s++) o(this, s, t, e, a, n, r);
		return a;
	}
	raycastFirst(e, t = 0, n = 0, r = Infinity) {
		let i = this._roots, a = null, o = this.indirect ? Jt : Et;
		for (let s = 0, c = i.length; s < c; s++) {
			let i = o(this, s, t, e, n, r);
			i != null && (a == null || i.distance < a.distance) && (a = i);
		}
		return a;
	}
	intersectsGeometry(e, t) {
		let n = !1, r = this._roots, i = this.indirect ? nn : Pt;
		for (let a = 0, o = r.length; a < o && (n = i(this, a, e, t), !n); a++);
		return n;
	}
	shapecast(e) {
		let t = J.getPrimitive(), n = super.shapecast({
			...e,
			intersectsPrimitive: e.intersectsTriangle,
			scratchPrimitive: t,
			iterate: this.indirect ? St : vt
		});
		return J.releasePrimitive(t), n;
	}
	bvhcast(e, n, r) {
		let { intersectsRanges: i, intersectsTriangles: a } = r, o = J.getPrimitive(), s = this.geometry.index, c = this.geometry.attributes.position, l = this.indirect ? (e) => {
			let t = this.resolveTriangleIndex(e);
			Q(o, t * 3, s, c);
		} : (e) => {
			Q(o, e * 3, s, c);
		}, u = J.getPrimitive(), d = e.geometry.index, f = e.geometry.attributes.position, p = e.indirect ? (t) => {
			let n = e.resolveTriangleIndex(t);
			Q(u, n * 3, d, f);
		} : (e) => {
			Q(u, e * 3, d, f);
		};
		if (a) {
			if (!(e instanceof t)) throw Error("MeshBVH: \"intersectsTriangles\" callback can only be used with another MeshBVH.");
			let r = (e, t, r, i, s, c, d, f) => {
				for (let m = r, h = r + i; m < h; m++) {
					p(m), u.a.applyMatrix4(n), u.b.applyMatrix4(n), u.c.applyMatrix4(n), u.needsUpdate = !0;
					for (let n = e, r = e + t; n < r; n++) if (l(n), o.needsUpdate = !0, a(o, u, n, m, s, c, d, f)) return !0;
				}
				return !1;
			};
			if (i) {
				let e = i;
				i = function(t, n, i, a, o, s, c, l) {
					return e(t, n, i, a, o, s, c, l) ? !0 : r(t, n, i, a, o, s, c, l);
				};
			} else i = r;
		}
		return super.bvhcast(e, n, { intersectsRanges: i });
	}
	intersectsBox(e, t) {
		return mn.set(e.min, e.max, t), mn.needsUpdate = !0, this.shapecast({
			intersectsBounds: (e) => mn.intersectsBox(e),
			intersectsTriangle: (e) => mn.intersectsTriangle(e)
		});
	}
	intersectsSphere(e) {
		return this.shapecast({
			intersectsBounds: (t) => e.intersectsBox(t),
			intersectsTriangle: (t) => t.intersectsSphere(e)
		});
	}
	closestPointToGeometry(e, t, n = {}, r = {}, i = 0, a = Infinity) {
		return (this.indirect ? fn : Ut)(this, e, t, n, r, i, a);
	}
	closestPointToPoint(e, t = {}, n = 0, r = Infinity) {
		return Xe(this, e, t, n, r);
	}
};
export { g as A, u as C, _ as D, p as E, b as M, h as N, v as O, S, m as T, E as _, He as a, A as b, Ie as c, Me as d, je as f, O as g, M as h, K as i, d as j, f as k, Pe as l, ge as m, ht as n, Ve as o, Oe as p, q as r, Le as s, bn as t, Ne as u, k as v, l as w, j as x, D as y };
