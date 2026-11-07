import { t as e } from "./rolldown-runtime-CGnMp29N.js";
import { A as t, M as n, O as r, S as i, _ as a, a as o, c as s, d as c, f as l, g as u, h as d, i as f, l as p, m, n as h, o as g, r as _, t as v, x as y, y as ee } from "./MeshBVH-DinRuPeE.js";
import { An as te, Ao as ne, As as b, B as x, Er as re, Es as ie, Fo as ae, Fs as S, I as C, Is as w, Jn as T, Jr as oe, Ls as se, Ns as ce, Nt as le, Pi as ue, Qr as de, Tr as fe, U as pe, V as E, Yr as D, Zr as O, ba as me, br as he, eo as ge, j as _e, ms as k, oo as ve, pi as A, pn as j, ro as ye, so as be, ta as xe, to as Se, xa as Ce, xr as we, yr as Te } from "./stage-C_LUPXd6.js";
// node_modules/three-mesh-bvh/src/core/LineBVH.js
var Ee = /* @__PURE__ */ new D(), M = /* @__PURE__ */ new ye(), De = /* @__PURE__ */ new m(() => new he()), Oe = /*@__PURE__*/ new w(), ke = /*@__PURE__*/ new w(), Ae = /* @__PURE__ */ new C(), je = /* @__PURE__ */ new w(), Me = [
	"getX",
	"getY",
	"getZ"
], Ne = class extends o {
	get primitiveStride() {
		return 2;
	}
	writePrimitiveBounds(e, t, n) {
		let r = this._indirectBuffer, { geometry: i, primitiveStride: a } = this, o = i.attributes.position, s = i.index, c = s ? s.count : o.count, l = (r ? r[e] : e) * a, u = (l + 1) % c;
		s && (l = s.getX(l), u = s.getX(u));
		for (let e = 0; e < 3; e++) {
			let r = o[Me[e]](l), i = o[Me[e]](u), a = r < i ? r : i, s = r > i ? r : i;
			t[n + e] = a, t[n + e + 3] = s;
		}
		return t;
	}
	shapecast(e) {
		let t = De.getPrimitive(), n = super.shapecast({
			...e,
			intersectsPrimitive: e.intersectsLine,
			scratchPrimitive: t,
			iterate: Ie
		});
		return De.releasePrimitive(t), n;
	}
	raycastObject3D(e, t, n = []) {
		let { matrixWorld: r } = e, { firstHitOnly: i } = t;
		Ee.copy(r).invert(), M.copy(t.ray).applyMatrix4(Ee);
		let a = t.params.Line.threshold / ((e.scale.x + e.scale.y + e.scale.z) / 3), o = a * a, s = null, c = Infinity;
		return this.shapecast({
			boundsTraverseOrder: (e) => e.distanceToPoint(M.origin),
			intersectsBounds: (e) => {
				if (Ae.copy(e).expandByScalar(a), i) {
					if (!M.intersectBox(Ae, je)) return 0;
					let e;
					return Ae.containsPoint(M.origin) ? e = 0 : (je.applyMatrix4(r), e = t.ray.origin.distanceTo(je)), +(e < c);
				}
				return +!!M.intersectsBox(Ae);
			},
			intersectsLine: (a, l) => {
				if (M.distanceSqToSegment(a.start, a.end, Oe, ke) > o) return;
				Oe.applyMatrix4(e.matrixWorld);
				let u = t.ray.origin.distanceTo(Oe);
				u < t.near || u > t.far || i && u >= c || (c = u, l = this.resolvePrimitiveIndex(l), s = {
					distance: u,
					point: ke.clone().applyMatrix4(r),
					index: l * this.primitiveStride,
					face: null,
					faceIndex: null,
					barycoord: null,
					object: e
				}, i || n.push(s));
			}
		}), i && s && n.push(s), n;
	}
}, Pe = class extends Ne {
	get primitiveStride() {
		return 1;
	}
	constructor(e, t = {}) {
		t = {
			...t,
			indirect: !0
		}, super(e, t);
	}
}, Fe = class extends Pe {
	getRootRanges(...e) {
		let t = super.getRootRanges(...e);
		return t.forEach((e) => e.count--), t;
	}
};
function Ie(e, t, n, r, i, a, o) {
	let { geometry: s, primitiveStride: c } = n, { index: l } = s, u = s.attributes.position, d = l ? l.count : u.count;
	for (let s = e, f = t + e; s < f; s++) {
		let e = n.resolvePrimitiveIndex(s) * c, t = (e + 1) % d;
		if (l && (e = l.getX(e), t = l.getX(t)), o.start.fromBufferAttribute(u, e), o.end.fromBufferAttribute(u, t), r(o, s, i, a)) return !0;
	}
	return !1;
}
// node_modules/three-mesh-bvh/src/core/PointsBVH.js
var Le = /* @__PURE__ */ new D(), N = /* @__PURE__ */ new ye(), Re = /* @__PURE__ */ new m(() => new w()), ze = /* @__PURE__ */ new C(), Be = /* @__PURE__ */ new w(), Ve = class extends o {
	get primitiveStride() {
		return 1;
	}
	writePrimitiveBounds(e, t, n) {
		let r = this._indirectBuffer, { geometry: i } = this, a = i.attributes.position, o = i.index, s = r ? r[e] : e;
		o && (s = o.getX(s));
		let c = a.getX(s), l = a.getY(s), u = a.getZ(s);
		return t[n + 0] = c, t[n + 1] = l, t[n + 2] = u, t[n + 3] = c, t[n + 4] = l, t[n + 5] = u, t;
	}
	shapecast(e) {
		let t = Re.getPrimitive(), n = super.shapecast({
			...e,
			intersectsPrimitive: e.intersectsPoint,
			scratchPrimitive: t,
			iterate: He
		});
		return Re.releasePrimitive(t), n;
	}
	raycastObject3D(e, t, n = []) {
		let { geometry: r } = this, { matrixWorld: i } = e, { firstHitOnly: a } = t;
		Le.copy(i).invert(), N.copy(t.ray).applyMatrix4(Le);
		let o = t.params.Points.threshold / ((e.scale.x + e.scale.y + e.scale.z) / 3), s = o * o, c = null, l = Infinity;
		return this.shapecast({
			boundsTraverseOrder: (e) => e.distanceToPoint(N.origin),
			intersectsBounds: (e) => {
				if (ze.copy(e).expandByScalar(o), a) {
					if (!N.intersectBox(ze, Be)) return 0;
					let e;
					return ze.containsPoint(N.origin) ? e = 0 : (Be.applyMatrix4(i), e = t.ray.origin.distanceTo(Be)), +(e < l);
				}
				return +!!N.intersectsBox(ze);
			},
			intersectsPoint: (o, u) => {
				let d = N.distanceSqToPoint(o);
				if (d < s) {
					let s = new w();
					N.closestPointToPoint(o, s), s.applyMatrix4(i);
					let f = t.ray.origin.distanceTo(s);
					if (f < t.near || f > t.far || a && f >= l) return;
					l = f, u = this.resolvePrimitiveIndex(u), c = {
						distance: f,
						distanceToRay: Math.sqrt(d),
						point: s,
						index: r.index ? r.index.getX(u) : u,
						face: null,
						faceIndex: null,
						barycoord: null,
						object: e
					}, a || n.push(c);
				}
			}
		}), a && c && n.push(c), n;
	}
};
function He(e, t, n, r, i, a, o) {
	let { geometry: s } = n, { index: c } = s, l = s.attributes.position;
	for (let s = e, u = t + e; s < u; s++) {
		let e = n.resolvePrimitiveIndex(s), t = c ? c.array[e] : e;
		if (o.fromBufferAttribute(l, t), r(o, s, i, a)) return !0;
	}
	return !1;
}
// node_modules/three-mesh-bvh/src/core/ObjectBVH.js
var P = /* @__PURE__ */ new E(), F = /* @__PURE__ */ new D(), I = /* @__PURE__ */ new D(), Ue = /* @__PURE__ */ new C(), L = /* @__PURE__ */ new ae(), R = /* @__PURE__ */ new w(), z = /* @__PURE__ */ new ye(), B = /* @__PURE__ */ new O(), We = {}, Ge = class extends l {
	constructor(e, t = {}) {
		t = {
			precise: !1,
			includeInstances: !0,
			matrixWorld: Array.isArray(e) ? new D() : e.matrixWorld,
			targetLeafSize: 1,
			...t
		}, super();
		let n = /* @__PURE__ */ new Set();
		Je(e, n);
		let r = Array.from(n), i = Math.ceil(Math.log2(r.length)), a = (1 << i) - 1;
		this.objects = r, this.idBits = i, this.idMask = a, this.primitiveBuffer = null, this.primitiveBufferStride = 1, this.precise = t.precise, this.includeInstances = t.includeInstances, this.matrixWorld = t.matrixWorld, this.init(t);
	}
	getObjectFromId(e) {
		let { idMask: t, objects: n } = this;
		return n[Ke(e, t)];
	}
	getInstanceFromId(e) {
		let { idMask: t, idBits: n } = this;
		return qe(e, n, t);
	}
	init(e) {
		let { objects: t, idBits: n, matrixWorld: r } = this;
		I.copy(r).invert(), this.primitiveBuffer = new Uint32Array(this._countPrimitives(t)), this._fillPrimitiveBuffer(t, n, this.primitiveBuffer), super.init(e);
	}
	refit(...e) {
		I.copy(this.matrixWorld).invert(), super.refit(...e);
	}
	writePrimitiveBounds(e, t, n) {
		let { primitiveBuffer: r } = this;
		this._getPrimitiveBoundingBox(r[e], I, Ue);
		let { min: i, max: a } = Ue;
		t[n + 0] = i.x, t[n + 1] = i.y, t[n + 2] = i.z, t[n + 3] = a.x, t[n + 4] = a.y, t[n + 5] = a.z;
	}
	getRootRanges() {
		return [{
			offset: 0,
			count: this.primitiveBuffer.length
		}];
	}
	shapecast(e) {
		return super.shapecast({
			...e,
			intersectsPrimitive: e.intersectsObject,
			scratchPrimitive: null,
			iterate: Xe
		});
	}
	raycast(e, t = []) {
		let { matrixWorld: n, includeInstances: r } = this, { firstHitOnly: i } = e, a = [];
		I.copy(n).invert(), z.copy(e.ray).applyMatrix4(I);
		let o = Infinity, s = null;
		return this.shapecast({
			boundsTraverseOrder: (e) => e.distanceToPoint(z.origin),
			intersectsBounds: (t) => {
				if (i) {
					if (!z.intersectBox(t, R)) return 0;
					let r;
					return t.containsPoint(z.origin) ? r = 0 : (R.applyMatrix4(n), r = e.ray.origin.distanceTo(R)), +(r < o);
				}
				return +!!z.intersectsBox(t);
			},
			intersectsObject(n, c) {
				if (n.visible) {
					if (a.length = 0, n.isInstancedMesh && r) B.geometry = n.geometry, B.material = n.material, n.getMatrixAt(c, B.matrixWorld), B.matrixWorld.premultiply(n.matrixWorld), B.raycast(e, a), a.forEach((e) => {
						e.object = n, e.instanceId = c;
					}), B.material = null;
					else if (n.isBatchedMesh && r) {
						if (!n.getVisibleAt(c)) return;
						let t = n.getGeometryIdAt(c), r = n.getGeometryRangeAt(t, We);
						P.index = n.geometry.index, P.attributes = n.geometry.attributes, P.setDrawRange(r.start, r.count), B.geometry = P, B.material = n.material, n.getMatrixAt(c, B.matrixWorld), B.matrixWorld.premultiply(n.matrixWorld), B.raycast(e, a), a.forEach((e) => {
							e.object = n, e.batchId = c;
						}), B.material = null, P.index = null, P.attributes = null, P.setDrawRange(0, Infinity);
					} else n.raycast(e, a);
					i ? a.forEach((e) => {
						e.distance < o && (o = e.distance, s = e);
					}) : t.push(...a);
				}
			}
		}), i && s && t.push(s), t;
	}
	_getPrimitiveBoundingBox(e, t, n) {
		let { objects: r, idMask: i, idBits: a, precise: o, includeInstances: s } = this, c = Ke(e, i), l = qe(e, a, i), u = r[c];
		if (!s && (u.isInstancedMesh || u.isBatchedMesh)) u.boundingBox || u.computeBoundingBox(), u.boundingSphere || u.computeBoundingSphere(), F.copy(u.matrixWorld).premultiply(t), L.copy(u.boundingSphere).applyMatrix4(F), n.copy(u.boundingBox).applyMatrix4(F), Ze(n, L);
		else if (o) {
			if (u.isInstancedMesh) u.getMatrixAt(l, F), F.premultiply(u.matrixWorld).premultiply(t), Ye(u.geometry, F, n);
			else if (u.isBatchedMesh) {
				let e = u.getGeometryIdAt(l), r = u.getGeometryRangeAt(e, We);
				P.index = u.geometry.index, P.attributes = u.geometry.attributes, P.setDrawRange(r.start, r.count), u.getMatrixAt(l, F), F.premultiply(u.matrixWorld).premultiply(t), Ye(P, F, n), P.attributes = null;
			} else F.copy(u.matrixWorld).premultiply(t), n.setFromObject(u, !0).applyMatrix4(t);
		} else if (u.isInstancedMesh) u.geometry.boundingBox || u.geometry.computeBoundingBox(), u.geometry.boundingSphere || u.geometry.computeBoundingSphere(), u.getMatrixAt(l, F), F.premultiply(u.matrixWorld).premultiply(t), L.copy(u.geometry.boundingSphere).applyMatrix4(F), n.copy(u.geometry.boundingBox).applyMatrix4(F), Ze(n, L);
		else if (u.isBatchedMesh) {
			let e = u.getGeometryIdAt(l);
			u.getMatrixAt(l, F), F.premultiply(u.matrixWorld).premultiply(t), u.getBoundingSphereAt(e, L).applyMatrix4(F), u.getBoundingBoxAt(e, n).applyMatrix4(F), Ze(n, L);
		} else n.setFromObject(u, !1).applyMatrix4(t);
	}
	_countPrimitives(e) {
		let { includeInstances: t } = this, n = 0;
		return e.forEach((e) => {
			if (e.isInstancedMesh && t) n += e.count;
			else if (e.isBatchedMesh && t) {
				if (!("instanceCount" in e)) throw Error("ObjectBVH: Three.js revision >= r169 is required to use BatchedMesh.");
				n += e.instanceCount;
			} else n++;
		}), n;
	}
	_fillPrimitiveBuffer(e, t, n) {
		let { includeInstances: r } = this, i = 0;
		e.forEach((e, a) => {
			if (e.isInstancedMesh && r) {
				let r = e.count;
				for (let e = 0; e < r; e++) n[i] = e << t | a, i++;
			} else if (e.isBatchedMesh && r) {
				let { instanceCount: r, maxInstanceCount: o } = e, s = 0, c = 0;
				for (; s < r && c < o;) {
					try {
						e.getVisibleAt(c), n[i] = c << t | a, s++, i++;
					} catch {}
					c++;
				}
			} else n[i] = a, i++;
		});
	}
};
function Ke(e, t) {
	return e & t;
}
function qe(e, t, n) {
	return (e & ~n) >>> t;
}
function Je(e, t = /* @__PURE__ */ new Set()) {
	Array.isArray(e) ? e.forEach((e) => Je(e, t)) : e.traverse((e) => {
		(e.isMesh || e.isLine || e.isPoints) && t.add(e);
	});
}
function Ye(e, t, n) {
	n.makeEmpty();
	let r = e.drawRange, i = e.index, a = e.attributes.position, o = r.start, s = i ? i.count : a.count, c = Math.min(s - o, r.count);
	for (let e = o, r = o + c; e < r; e++) {
		let r = e;
		i && (r = i.getX(r)), R.fromBufferAttribute(a, r).applyMatrix4(t), n.expandByPoint(R);
	}
	return n;
}
function Xe(e, t, n, r, i, a) {
	let { primitiveBuffer: o, objects: s, idMask: c, idBits: l } = n;
	for (let n = e, u = t + e; n < u; n++) {
		let e = o[n], t = Ke(e, c), u = qe(e, l, c), d = s[t];
		if (r(d, u, i, a)) return !0;
	}
	return !1;
}
function Ze(e, t) {
	R.copy(t.center).addScalar(-t.radius), e.min.max(R), R.copy(t.center).addScalar(t.radius), e.max.min(R);
}
// node_modules/three-mesh-bvh/src/core/SkinnedMeshBVH.js
var Qe = /* @__PURE__ */ new w(), $e = /* @__PURE__ */ new w(), et = /* @__PURE__ */ new w(), V = /* @__PURE__ */ new ye(), tt = /* @__PURE__ */ new D(), H = /* @__PURE__ */ new w(), nt = /* @__PURE__ */ new w(), rt = [
	"x",
	"y",
	"z"
], U = !0, W = /* @__PURE__ */ new S(), it = /* @__PURE__ */ new S(), at = /* @__PURE__ */ new S(), ot = /* @__PURE__ */ new w(), st = /* @__PURE__ */ new w(), ct = /* @__PURE__ */ new w(), lt = class extends o {
	get primitiveStride() {
		return 3;
	}
	constructor(e, t = {}) {
		if (!e.isMesh) throw Error("SkinnedMeshBVH: First argument must be a Mesh.");
		super(e.geometry, {
			...t,
			[n]: !0
		}), this.mesh = e, t[n] || this.init(t);
	}
	writePrimitiveBounds(e, t, n) {
		let { mesh: r, geometry: i } = this, a = this._indirectBuffer, o = i.index ? i.index.array : null, s = (a ? a[e] : e) * 3, c = s + 0, l = s + 1, u = s + 2;
		o && (c = o[c], l = o[l], u = o[u]), r.getVertexPosition(c, Qe), r.getVertexPosition(l, $e), r.getVertexPosition(u, et);
		for (let e = 0; e < 3; e++) {
			let r = rt[e], i = Qe[r], a = $e[r], o = et[r], s = i;
			a < s && (s = a), o < s && (s = o);
			let c = i;
			a > c && (c = a), o > c && (c = o), t[n + e] = s, t[n + e + 3] = c;
		}
		return t;
	}
	shapecast(e) {
		let t = new f();
		return super.shapecast({
			...e,
			intersectsPrimitive: e.intersectsTriangle,
			scratchPrimitive: t,
			iterate: ut
		});
	}
	raycastObject3D(e, t, n = []) {
		let { material: r } = e;
		if (r === void 0) return;
		let { matrixWorld: i } = e, { firstHitOnly: a } = t;
		tt.copy(i).invert(), V.copy(t.ray).applyMatrix4(tt);
		let o = null, s = Infinity;
		return this.shapecast({
			boundsTraverseOrder: (e) => e.distanceToPoint(V.origin),
			intersectsBounds: (e) => {
				if (a) {
					if (!V.intersectBox(e, nt)) return 0;
					let n;
					return e.containsPoint(V.origin) ? n = 0 : (nt.applyMatrix4(i), n = t.ray.origin.distanceTo(nt)), +(n < s);
				}
				return +!!V.intersectsBox(e);
			},
			intersectsTriangle: (c, l) => {
				let u = null;
				if (u = r.side === 0 ? V.intersectTriangle(c.a, c.b, c.c, !0, H) : r.side === 1 ? V.intersectTriangle(c.c, c.b, c.a, !0, H) : V.intersectTriangle(c.a, c.b, c.c, !1, H), !u) return;
				u = u.clone().applyMatrix4(i);
				let d = t.ray.origin.distanceTo(u);
				if (d >= t.near && d <= t.far) {
					if (a && d >= s) return;
					let { geometry: t } = this, { index: r } = t, i = this.resolvePrimitiveIndex(l), f = i * 3, p = f + 0, m = f + 1, h = f + 2;
					r && (p = r.array[p], m = r.array[m], h = r.array[h]);
					let g = {
						distance: d,
						point: u.clone(),
						object: e,
						uv: null,
						uv1: null,
						normal: null,
						face: {
							a: p,
							b: m,
							c: h,
							normal: k.getNormal(c.a, c.b, c.c, new w()),
							materialIndex: 0
						},
						faceIndex: i
					};
					if (U) {
						let e = new w();
						k.getBarycoord(H, c.a, c.b, c.c, e), g.barycoord = e;
					}
					let _ = t.attributes.uv, v = t.attributes.uv1, y = t.attributes.normal;
					if (_) {
						W.fromBufferAttribute(_, p), it.fromBufferAttribute(_, m), at.fromBufferAttribute(_, h), g.uv = new S();
						let e = k.getInterpolation(H, c.a, c.b, c.c, W, it, at, g.uv);
						U || (g.uv = e);
					}
					if (v) {
						W.fromBufferAttribute(v, p), it.fromBufferAttribute(v, m), at.fromBufferAttribute(v, h), g.uv1 = new S();
						let e = k.getInterpolation(H, c.a, c.b, c.c, W, it, at, g.uv1);
						U || (g.uv1 = e);
					}
					if (y) {
						ot.fromBufferAttribute(y, p), st.fromBufferAttribute(y, m), ct.fromBufferAttribute(y, h), g.normal = new w();
						let e = k.getInterpolation(H, c.a, c.b, c.c, ot, st, ct, g.normal);
						g.normal.dot(V.direction) > 0 && g.normal.multiplyScalar(-1), U || (g.normal = e);
					}
					s = g.distance, o = g, a || n.push(g);
				}
			}
		}), a && o && n.push(o), n;
	}
};
function ut(e, t, n, r, i, a, o) {
	let { mesh: s, geometry: c } = n, l = c.index ? c.index.array : null;
	for (let c = e, u = t + e; c < u; c++) {
		let e = n.resolvePrimitiveIndex(c), t = 3 * e + 0, u = 3 * e + 1, d = 3 * e + 2;
		if (l && (t = l[t], u = l[u], d = l[d]), s.getVertexPosition(t, o.a), s.getVertexPosition(u, o.b), s.getVertexPosition(d, o.c), o.needsUpdate = !0, r(o, c, i, a)) return !0;
	}
	return !1;
}
// node_modules/three-mesh-bvh/src/objects/BVHHelper.js
var G = /* @__PURE__ */ new C(), dt = /* @__PURE__ */ new D(), ft = /* @__PURE__ */ new w(), pt = class extends ue {
	get isMesh() {
		return !this.displayEdges;
	}
	get isLineSegments() {
		return this.displayEdges;
	}
	get isLine() {
		return this.displayEdges;
	}
	getVertexPosition(...e) {
		return O.prototype.getVertexPosition.call(this, ...e);
	}
	constructor(e, t, n = 10, r = 0) {
		super(), this.material = t, this.geometry = new E(), this.name = "BVHRootHelper", this.depth = n, this.displayParents = !1, this.bvh = e, this.displayEdges = !0, this._group = r;
	}
	raycast() {}
	intersectsFrustum(e) {
		return e.intersectsObject(this);
	}
	update() {
		let e = this.bvh;
		this.geometry.dispose(), this.visible = !1, e && (this.geometry = this.getGeometry(e), this.visible = !0);
	}
	getGeometry(e) {
		let t = this._group, n = null;
		if (t !== -1) n = this.getBVHBoundPositions(e, t);
		else {
			let t = e._roots.map((t, n) => this.getBVHBoundPositions(e, n)), r = t.reduce((e, t) => e + t.length, 0);
			n = new Float32Array(r);
			let i = 0;
			t.forEach((e) => {
				n.set(e, i), i += e.length;
			});
		}
		let r = this.getBVHBoundIndices(n), i = new E();
		return i.setIndex(new x(r, 1, !1)), i.setAttribute("position", new x(n, 3, !1)), i;
	}
	getBVHBoundIndices(e) {
		let t = e.length / 24, n, r;
		r = this.displayEdges ? new Uint8Array([
			0,
			4,
			1,
			5,
			2,
			6,
			3,
			7,
			0,
			2,
			1,
			3,
			4,
			6,
			5,
			7,
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7
		]) : new Uint8Array([
			0,
			1,
			2,
			2,
			1,
			3,
			4,
			6,
			5,
			6,
			7,
			5,
			1,
			4,
			5,
			0,
			4,
			1,
			2,
			3,
			6,
			3,
			7,
			6,
			0,
			2,
			4,
			2,
			6,
			4,
			1,
			5,
			3,
			3,
			5,
			7
		]), n = e.length > 65535 ? new Uint32Array(r.length * t) : new Uint16Array(r.length * t);
		let i = r.length;
		for (let e = 0; e < t; e++) {
			let t = e * 8, a = e * i;
			for (let e = 0; e < i; e++) n[a + e] = t + r[e];
		}
		return n;
	}
	getBVHBoundPositions(e, t = 0, n = null) {
		let r = this.depth - 1, a = this.displayParents, o = 0;
		e.traverse((e, t, n) => {
			if (i(0, n, G), G.isEmpty()) return !0;
			if (e >= r || t) return o++, !0;
			a && o++;
		}, t);
		let s = 0, c = new Float32Array(24 * o);
		return e.traverse((e, t, o) => {
			if (i(0, o, G), G.isEmpty()) return !0;
			let l = e >= r || t;
			if (l || a) {
				let { min: e, max: t } = G;
				for (let r = -1; r <= 1; r += 2) {
					let i = r < 0 ? e.x : t.x;
					for (let r = -1; r <= 1; r += 2) {
						let a = r < 0 ? e.y : t.y;
						for (let r = -1; r <= 1; r += 2) {
							let o = r < 0 ? e.z : t.z;
							ft.set(i, a, o), n && ft.applyMatrix4(n), ft.toArray(c, s), s += 3;
						}
					}
				}
				return l;
			}
		}, t), c;
	}
}, mt = class e extends te {
	get color() {
		return this.edgeMaterial.color;
	}
	get opacity() {
		return this.edgeMaterial.opacity;
	}
	set opacity(e) {
		this.edgeMaterial.opacity = e, this.meshMaterial.opacity = e;
	}
	get objectIndex() {
		return console.warn("BVHHelper: \"objectIndex\" has been renamed \"instanceId\"."), this.instanceId;
	}
	set objectIndex(e) {
		console.warn("BVHHelper: \"objectIndex\" has been renamed \"instanceId\"."), this.instanceId = e;
	}
	constructor(e = null, t = null, n = 10) {
		e instanceof v && (n = t || 10, t = e, e = null), typeof t == "number" && (n = t, t = null), super(), this.name = "BVHHelper", this.depth = n, this.mesh = e, this.bvh = t, this.displayParents = !1, this.displayEdges = !0, this.instanceId = 0, this._roots = [];
		let r = new we({
			color: 65416,
			transparent: !0,
			opacity: .3,
			depthWrite: !1
		}), i = new de({
			color: 65416,
			transparent: !0,
			opacity: .3,
			depthWrite: !1
		});
		i.color = r.color, this.edgeMaterial = r, this.meshMaterial = i, this.update();
	}
	update() {
		let e = this.mesh, t = this.instanceId, n = this.bvh || e.boundsTree || e.geometry && e.geometry.boundsTree || null;
		if (e && e.isBatchedMesh && e.boundsTrees && !n && t >= 0) {
			let r = e._drawInfo[t];
			r && (n = e.boundsTrees[r.geometryIndex] || n);
		}
		let r = n ? n._roots.length : 0;
		for (; this._roots.length > r;) {
			let e = this._roots.pop();
			e.geometry.dispose(), this.remove(e);
		}
		for (let e = 0; e < r; e++) {
			let { depth: t, edgeMaterial: r, meshMaterial: i, displayParents: a, displayEdges: o } = this;
			if (e >= this._roots.length) {
				let i = new pt(n, r, t, e);
				this.add(i), this._roots.push(i);
			}
			let s = this._roots[e];
			s.bvh = n, s.depth = t, s.displayParents = a, s.displayEdges = o, s.material = o ? r : i, s.update();
		}
	}
	updateMatrixWorld(...e) {
		let t = this.mesh, n = this.parent, r = this.instanceId;
		t !== null && (t.updateWorldMatrix(!0, !1), n ? this.matrix.copy(n.matrixWorld).invert().multiply(t.matrixWorld) : this.matrix.copy(t.matrixWorld), (t.isInstancedMesh || t.isBatchedMesh) && r >= 0 && (t.getMatrixAt(r, dt), this.matrix.multiply(dt)), this.matrix.decompose(this.position, this.quaternion, this.scale)), super.updateMatrixWorld(...e);
	}
	copy(e) {
		this.depth = e.depth, this.mesh = e.mesh, this.bvh = e.bvh, this.opacity = e.opacity, this.color.copy(e.color);
	}
	clone() {
		return new e().copy(this);
	}
	dispose() {
		this.edgeMaterial.dispose(), this.meshMaterial.dispose();
		let e = this.children;
		for (let t = 0, n = e.length; t < n; t++) e[t].geometry.dispose();
	}
}, ht = class extends mt {
	constructor(...e) {
		console.warn("MeshBVHHelper: Class has been deprecated. Use BVHHelper instead."), super(...e);
	}
}, gt = /* @__PURE__ */ new C(), K = /* @__PURE__ */ new C();
function _t(e) {
	switch (typeof e) {
		case "number": return 8;
		case "string": return e.length * 2;
		case "boolean": return 4;
		default: return 0;
	}
}
function vt(e) {
	return /(Uint|Int|Float)(8|16|32)Array/.test(e.constructor.name);
}
function yt(e, n) {
	let r = {
		nodeCount: 0,
		leafNodeCount: 0,
		depth: {
			min: Infinity,
			max: -Infinity
		},
		primitives: {
			min: Infinity,
			max: -Infinity
		},
		splits: [
			0,
			0,
			0
		],
		surfaceAreaScore: 0
	};
	return e.traverse((e, n, i, a, o) => {
		let s = i[3] - i[0], c = i[4] - i[1], l = i[5] - i[2], u = 2 * (s * c + c * l + l * s);
		r.nodeCount++, n ? (r.leafNodeCount++, r.depth.min = Math.min(e, r.depth.min), r.depth.max = Math.max(e, r.depth.max), r.primitives.min = Math.min(o, r.primitives.min), r.primitives.max = Math.max(o, r.primitives.max), r.surfaceAreaScore += u * t * o) : (r.splits[a]++, r.surfaceAreaScore += u * 1);
	}, n), r.primitives.min === Infinity && (r.primitives.min = 0, r.primitives.max = 0), r.depth.min === Infinity && (r.depth.min = 0, r.depth.max = 0), r;
}
function bt(e) {
	return e._roots.map((t, n) => yt(e, n));
}
function xt(e) {
	let t = /* @__PURE__ */ new Set(), n = [e], r = 0;
	for (; n.length;) {
		let e = n.pop();
		if (!t.has(e)) {
			t.add(e);
			for (let t in e) {
				if (!Object.hasOwn(e, t)) continue;
				r += _t(t);
				let i = e[t];
				i && (typeof i == "object" || typeof i == "function") ? vt(i) || c() && i instanceof SharedArrayBuffer || i instanceof ArrayBuffer ? r += i.byteLength : n.push(i) : r += _t(i);
			}
		}
	}
	return r;
}
function St(e) {
	let t = [], n = /* @__PURE__ */ new Float32Array(6), r = !0;
	return e.traverse((a, o, s, c, l) => {
		t[a] = {
			depth: a,
			isLeaf: o,
			boundingData: s,
			offset: c,
			count: l
		}, i(0, s, gt);
		let u = t[a - 1];
		if (o) {
			e.writePrimitiveRangeBounds(c, l, n, 0), K.min.set(n[0], n[1], n[2]), K.max.set(n[3], n[4], n[5]);
			let t = gt.containsBox(K);
			console.assert(t, "Leaf bounds does not fully contain primitives."), r &&= t;
		}
		if (u) {
			i(0, u.boundingData, K);
			let e = K.containsBox(gt);
			console.assert(e, "Parent bounds does not fully contain child."), r &&= e;
		}
	}), r;
}
function Ct(e) {
	let t = [];
	return e.traverse((e, n, r, a, o) => {
		let s = { bounds: i(0, r, new C()) };
		n ? (s.count = o, s.offset = a) : (s.left = null, s.right = null), t[e] = s;
		let c = t[e - 1];
		c && (c.left === null ? c.left = s : c.right = s);
	}), t[0];
}
// node_modules/three-mesh-bvh/src/utils/ExtensionUtilities.js
var wt = !0, q = {
	Mesh: O.prototype.raycast,
	Line: Te.prototype.raycast,
	LineSegments: re.prototype.raycast,
	LineLoop: fe.prototype.raycast,
	Points: xe.prototype.raycast,
	BatchedMesh: _e.prototype.raycast
}, J = /* @__PURE__ */ new O(), Tt = [];
function Et(e, t) {
	if (this.isBatchedMesh) Dt.call(this, e, t);
	else {
		let { geometry: n } = this;
		if (n.boundsTree) n.boundsTree.raycastObject3D(this, e, t);
		else {
			let n;
			if (this instanceof O) n = q.Mesh;
			else if (this instanceof re) n = q.LineSegments;
			else if (this instanceof fe) n = q.LineLoop;
			else if (this instanceof Te) n = q.Line;
			else if (this instanceof xe) n = q.Points;
			else throw Error("BVH: Fallback raycast function not found.");
			n.call(this, e, t);
		}
	}
}
function Dt(e, t) {
	if (this.boundsTrees) {
		let n = this.boundsTrees, r = this._drawInfo || this._instanceInfo, i = this._drawRanges || this._geometryInfo, a = this.matrixWorld;
		J.material = this.material, J.geometry = this.geometry;
		let o = J.geometry.boundsTree, s = J.geometry.drawRange;
		J.geometry.boundingSphere === null && (J.geometry.boundingSphere = new ae());
		for (let o = 0, s = r.length; o < s; o++) {
			if (!this.getVisibleAt(o)) continue;
			let s = r[o].geometryIndex;
			if (J.geometry.boundsTree = n[s], this.getMatrixAt(o, J.matrixWorld).premultiply(a), !J.geometry.boundsTree) {
				this.getBoundingBoxAt(s, J.geometry.boundingBox), this.getBoundingSphereAt(s, J.geometry.boundingSphere);
				let e = i[s];
				J.geometry.setDrawRange(e.start, e.count);
			}
			J.raycast(e, Tt);
			for (let e = 0, n = Tt.length; e < n; e++) {
				let n = Tt[e];
				n.object = this, n.batchId = o, t.push(n);
			}
			Tt.length = 0;
		}
		J.geometry.boundsTree = o, J.geometry.drawRange = s, J.material = null, J.geometry = null;
	} else q.BatchedMesh.call(this, e, t);
}
function Ot(e = {}) {
	let { type: t = v } = e;
	return this.boundsTree = new t(this, e), this.boundsTree;
}
function kt() {
	this.boundsTree = null;
}
function At(e = -1, t = {}) {
	if (!wt) throw Error("BatchedMesh: Three r166+ is required to compute bounds trees.");
	t = {
		...t,
		range: null
	};
	let n = this._drawRanges || this._geometryInfo, r = this._geometryCount;
	this.boundsTrees ||= Array(r).fill(null);
	let i = this.boundsTrees;
	for (; i.length < r;) i.push(null);
	if (e < 0) {
		for (let e = 0; e < r; e++) t.range = n[e], i[e] = new v(this.geometry, t);
		return i;
	}
	return e < n.length && (t.range = n[e], i[e] = new v(this.geometry, t)), i[e] || null;
}
function jt(e = -1) {
	e < 0 ? this.boundsTrees.fill(null) : e < this.boundsTrees.length && (this.boundsTrees[e] = null);
}
// node_modules/three-mesh-bvh/src/webgl/VertexAttributeTexture.js
function Mt(e) {
	switch (e) {
		case 1: return "R";
		case 2: return "RG";
		case 3: return "RGBA";
		case 4: return "RGBA";
	}
	throw Error();
}
function Nt(e) {
	switch (e) {
		case 1: return ve;
		case 2: return ge;
		case 3: return me;
		case 4: return me;
	}
}
function Pt(e) {
	switch (e) {
		case 1: return be;
		case 2: return Se;
		case 3: return Ce;
		case 4: return Ce;
	}
}
var Ft = class extends le {
	constructor() {
		super(), this.minFilter = A, this.magFilter = A, this.generateMipmaps = !1, this.overrideItemSize = null, this._forcedType = null;
	}
	updateFrom(e) {
		let t = this.overrideItemSize, n = e.itemSize, r = e.count;
		if (t !== null) {
			if (n * r % t !== 0) throw Error("VertexAttributeTexture: overrideItemSize must divide evenly into buffer length.");
			e.itemSize = t, e.count = r * n / t;
		}
		let i = e.itemSize, a = e.count, o = e.normalized, s = e.array.constructor, c = s.BYTES_PER_ELEMENT, l = this._forcedType, u = i;
		if (l === null) switch (s) {
			case Float32Array:
				l = j;
				break;
			case Uint8Array:
			case Uint16Array:
			case Uint32Array:
				l = b;
				break;
			case Int8Array:
			case Int16Array:
			case Int32Array: l = T;
		}
		let d, f, p, m, h = Mt(i);
		switch (l) {
			case j:
				p = 1, f = Nt(i), o && c === 1 ? (m = s, h += "8", s === Uint8Array ? d = ie : (d = pe, h += "_SNORM")) : (m = Float32Array, h += "32F", d = j);
				break;
			case T:
				h += c * 8 + "I", p = o ? 2 ** (s.BYTES_PER_ELEMENT * 8 - 1) : 1, f = Pt(i), c === 1 ? (m = Int8Array, d = pe) : c === 2 ? (m = Int16Array, d = ne) : (m = Int32Array, d = T);
				break;
			case b: h += c * 8 + "UI", p = o ? 2 ** (s.BYTES_PER_ELEMENT * 8 - 1) : 1, f = Pt(i), c === 1 ? (m = Uint8Array, d = ie) : c === 2 ? (m = Uint16Array, d = ce) : (m = Uint32Array, d = b);
		}
		u === 3 && (f === 1023 || f === 1033) && (u = 4);
		let g = Math.ceil(Math.sqrt(a)) || 1, _ = u * g * g, v = new m(_), y = e.normalized;
		e.normalized = !1;
		for (let t = 0; t < a; t++) {
			let n = u * t;
			v[n] = e.getX(t) / p, i >= 2 && (v[n + 1] = e.getY(t) / p), i >= 3 && (v[n + 2] = e.getZ(t) / p, u === 4 && (v[n + 3] = 1)), i >= 4 && (v[n + 3] = e.getW(t) / p);
		}
		e.normalized = y, this.internalFormat = h, this.format = f, this.type = d, this.image.width = g, this.image.height = g, this.image.data = v, this.needsUpdate = !0, this.dispose(), e.itemSize = n, e.count = r;
	}
}, It = class extends Ft {
	constructor() {
		super(), this._forcedType = b;
	}
}, Lt = class extends Ft {
	constructor() {
		super(), this._forcedType = T;
	}
}, Rt = class extends Ft {
	constructor() {
		super(), this._forcedType = j;
	}
}, zt = class {
	constructor() {
		this.index = new It(), this.position = new Rt(), this.bvhBounds = new le(), this.bvhContents = new le(), this._cachedIndexAttr = null, this.index.overrideItemSize = 3;
	}
	updateFrom(e) {
		let { geometry: t } = e;
		if (Vt(e, this.bvhBounds, this.bvhContents), this.position.updateFrom(t.attributes.position), e.indirect) {
			let n = e._indirectBuffer;
			if (this._cachedIndexAttr === null || this._cachedIndexAttr.count !== n.length) {
				if (t.index) this._cachedIndexAttr = t.index.clone();
				else {
					let e = s(p(t));
					this._cachedIndexAttr = new x(e, 1, !1);
				}
			}
			Bt(t, n, this._cachedIndexAttr), this.index.updateFrom(this._cachedIndexAttr);
		} else this.index.updateFrom(t.index);
	}
	dispose() {
		let { index: e, position: t, bvhBounds: n, bvhContents: r } = this;
		e && e.dispose(), t && t.dispose(), n && n.dispose(), r && r.dispose();
	}
};
function Bt(e, t, n) {
	let r = n.array, i = e.index ? e.index.array : null;
	for (let e = 0, n = t.length; e < n; e++) {
		let n = 3 * e, a = 3 * t[e];
		for (let e = 0; e < 3; e++) r[n + e] = i ? i[a + e] : a + e;
	}
}
function Vt(e, t, n) {
	let i = e._roots;
	if (i.length !== 1) throw Error("MeshBVHUniformStruct: Multi-root BVHs not supported.");
	let o = i[0], s = new Uint16Array(o), c = new Uint32Array(o), l = new Float32Array(o), f = o.byteLength / 32, p = 2 * Math.ceil(Math.sqrt(f / 2)), m = new Float32Array(4 * p * p), h = Math.ceil(Math.sqrt(f)), g = new Uint32Array(2 * h * h);
	for (let e = 0; e < f; e++) {
		let t = e * 32 / 4, n = t * 2, i = d(t);
		for (let t = 0; t < 3; t++) m[8 * e + 0 + t] = l[i + 0 + t], m[8 * e + 4 + t] = l[i + 3 + t];
		if (a(n, s)) {
			let i = u(n, s), a = ee(t, c), o = r | i;
			g[e * 2 + 0] = o, g[e * 2 + 1] = a;
		} else {
			let n = c[t + 6], r = y(t, c);
			g[e * 2 + 0] = r, g[e * 2 + 1] = n;
		}
	}
	t.image.data = m, t.image.width = p, t.image.height = p, t.format = me, t.type = j, t.internalFormat = "RGBA32F", t.minFilter = A, t.magFilter = A, t.generateMipmaps = !1, t.needsUpdate = !0, t.dispose(), n.image.data = g, n.image.width = h, n.image.height = h, n.format = Se, n.type = b, n.internalFormat = "RG32UI", n.minFilter = A, n.magFilter = A, n.generateMipmaps = !1, n.needsUpdate = !0, n.dispose();
}
// node_modules/three-mesh-bvh/src/utils/StaticGeometryGenerator.js
var Y = /*@__PURE__*/ new w(), X = /*@__PURE__*/ new w(), Z = /*@__PURE__*/ new w(), Ht = /*@__PURE__*/ new se(), Ut = /*@__PURE__*/ new w(), Wt = /*@__PURE__*/ new w(), Gt = /*@__PURE__*/ new se(), Kt = /*@__PURE__*/ new se(), qt = /*@__PURE__*/ new D(), Jt = /*@__PURE__*/ new D();
function Q(e, t) {
	if (!e && !t) return;
	let n = e.count === t.count, r = e.normalized === t.normalized, i = e.array.constructor === t.array.constructor, a = e.itemSize === t.itemSize;
	if (!n || !r || !i || !a) throw Error();
}
function $(e, t = null) {
	let n = e.array.constructor, r = e.normalized, i = e.itemSize, a = t === null ? e.count : t;
	return new x(new n(i * a), i, r);
}
function Yt(e, t, n = 0) {
	if (e.isInterleavedBufferAttribute) {
		let r = e.itemSize;
		for (let i = 0, a = e.count; i < a; i++) {
			let a = i + n;
			t.setX(a, e.getX(i)), r >= 2 && t.setY(a, e.getY(i)), r >= 3 && t.setZ(a, e.getZ(i)), r >= 4 && t.setW(a, e.getW(i));
		}
	} else {
		let r = t.array, i = r.constructor, a = r.BYTES_PER_ELEMENT * e.itemSize * n;
		new i(r.buffer, a, e.array.length).set(e.array);
	}
}
function Xt(e, t, n) {
	let r = e.elements, i = t.elements;
	for (let e = 0, t = i.length; e < t; e++) r[e] += i[e] * n;
}
function Zt(e, t, n) {
	let r = e.skeleton, i = e.geometry, a = r.bones, o = r.boneInverses;
	Gt.fromBufferAttribute(i.attributes.skinIndex, t), Kt.fromBufferAttribute(i.attributes.skinWeight, t), qt.elements.fill(0);
	for (let e = 0; e < 4; e++) {
		let t = Kt.getComponent(e);
		if (t !== 0) {
			let n = Gt.getComponent(e);
			Jt.multiplyMatrices(a[n].matrixWorld, o[n]), Xt(qt, Jt, t);
		}
	}
	return qt.multiply(e.bindMatrix).premultiply(e.bindMatrixInverse), n.transformDirection(qt), n;
}
function Qt(e, t, n, r, i) {
	Ut.set(0, 0, 0);
	for (let a = 0, o = e.length; a < o; a++) {
		let o = t[a], s = e[a];
		o !== 0 && (Wt.fromBufferAttribute(s, r), n ? Ut.addScaledVector(Wt, o) : Ut.addScaledVector(Wt.sub(i), o));
	}
	i.add(Ut);
}
function $t(e, t = {
	useGroups: !1,
	updateIndex: !1,
	skipAttributes: []
}, n = new E()) {
	let r = e[0].index !== null, { useGroups: i = !1, updateIndex: a = !1, skipAttributes: o = [] } = t, s = new Set(Object.keys(e[0].attributes)), c = {}, l = 0;
	n.clearGroups();
	for (let t = 0; t < e.length; ++t) {
		let a = e[t], o = 0;
		if (r !== (a.index !== null)) throw Error("StaticGeometryGenerator: All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.");
		for (let e in a.attributes) {
			if (!s.has(e)) throw Error("StaticGeometryGenerator: All geometries must have compatible attributes; make sure \"" + e + "\" attribute exists among all geometries, or in none of them.");
			c[e] === void 0 && (c[e] = []), c[e].push(a.attributes[e]), o++;
		}
		if (o !== s.size) throw Error("StaticGeometryGenerator: Make sure all geometries have the same number of attributes.");
		if (i) {
			let e;
			if (r) e = a.index.count;
			else if (a.attributes.position !== void 0) e = a.attributes.position.count;
			else throw Error("StaticGeometryGenerator: The geometry must have either an index or a position attribute");
			n.addGroup(l, e, t), l += e;
		}
	}
	if (r) {
		let t = !1;
		if (!n.index) {
			let r = 0;
			for (let t = 0; t < e.length; ++t) r += e[t].index.count;
			n.setIndex(new x(new Uint32Array(r), 1, !1)), t = !0;
		}
		if (a || t) {
			let t = n.index, r = 0, i = 0;
			for (let n = 0; n < e.length; ++n) {
				let a = e[n], s = a.index;
				if (o[n] !== !0) for (let e = 0; e < s.count; ++e) t.setX(r, s.getX(e) + i), r++;
				i += a.attributes.position.count;
			}
		}
	}
	for (let e in c) {
		let t = c[e];
		if (!(e in n.attributes)) {
			let r = 0;
			for (let e in t) r += t[e].count;
			n.setAttribute(e, $(c[e][0], r));
		}
		let r = n.attributes[e], i = 0;
		for (let e = 0, n = t.length; e < n; e++) {
			let n = t[e];
			o[e] !== !0 && Yt(n, r, i), i += n.count;
		}
	}
	return n;
}
function en(e, t) {
	if (e === null || t === null) return e === t;
	if (e.length !== t.length) return !1;
	for (let n = 0, r = e.length; n < r; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function tn(e) {
	let { index: t, attributes: n } = e;
	if (t) for (let e = 0, n = t.count; e < n; e += 3) {
		let n = t.getX(e), r = t.getX(e + 2);
		t.setX(e, r), t.setX(e + 2, n);
	}
	else for (let e in n) {
		let t = n[e], r = t.itemSize;
		for (let e = 0, n = t.count; e < n; e += 3) for (let n = 0; n < r; n++) {
			let r = t.getComponent(e, n), i = t.getComponent(e + 2, n);
			t.setComponent(e, n, i), t.setComponent(e + 2, n, r);
		}
	}
	return e;
}
var nn = class {
	constructor(e) {
		this.matrixWorld = new D(), this.geometryHash = null, this.boneMatrices = null, this.primitiveCount = -1, this.mesh = e, this.update();
	}
	update() {
		let e = this.mesh, t = e.geometry, n = e.skeleton, r = (t.index ? t.index.count : t.attributes.position.count) / 3;
		if (this.matrixWorld.copy(e.matrixWorld), this.geometryHash = t.attributes.position.version, this.primitiveCount = r, n) {
			n.boneTexture || n.computeBoneTexture(), n.update();
			let e = n.boneMatrices;
			!this.boneMatrices || this.boneMatrices.length !== e.length ? this.boneMatrices = e.slice() : this.boneMatrices.set(e);
		} else this.boneMatrices = null;
	}
	didChange() {
		let e = this.mesh, t = e.geometry, n = (t.index ? t.index.count : t.attributes.position.count) / 3;
		return !(this.matrixWorld.equals(e.matrixWorld) && this.geometryHash === t.attributes.position.version && en(e.skeleton && e.skeleton.boneMatrices || null, this.boneMatrices) && this.primitiveCount === n);
	}
}, rn = class {
	constructor(e) {
		Array.isArray(e) || (e = [e]);
		let t = [];
		e.forEach((e) => {
			e.traverseVisible((e) => {
				e.isMesh && t.push(e);
			});
		}), this.meshes = t, this.useGroups = !0, this.applyWorldTransforms = !0, this.attributes = [
			"position",
			"normal",
			"color",
			"tangent",
			"uv",
			"uv2"
		], this._intermediateGeometry = Array(t.length).fill().map(() => new E()), this._diffMap = /* @__PURE__ */ new WeakMap();
	}
	getMaterials() {
		let e = [];
		return this.meshes.forEach((t) => {
			Array.isArray(t.material) ? e.push(...t.material) : e.push(t.material);
		}), e;
	}
	generate(e = new E()) {
		let t = [], { meshes: n, useGroups: r, _intermediateGeometry: i, _diffMap: a } = this;
		for (let e = 0, r = n.length; e < r; e++) {
			let r = n[e], o = i[e], s = a.get(r);
			!s || s.didChange(r) ? (this._convertToStaticGeometry(r, o), t.push(!1), s ? s.update() : a.set(r, new nn(r))) : t.push(!0);
		}
		if (i.length === 0) {
			e.setIndex(null);
			let t = e.attributes;
			for (let n in t) e.deleteAttribute(n);
			for (let t in this.attributes) e.setAttribute(this.attributes[t], new x(/* @__PURE__ */ new Float32Array(), 4, !1));
		} else $t(i, {
			useGroups: r,
			skipAttributes: t
		}, e);
		for (let t in e.attributes) e.attributes[t].needsUpdate = !0;
		return e;
	}
	_convertToStaticGeometry(e, t = new E()) {
		let n = e.geometry, r = this.applyWorldTransforms, i = this.attributes.includes("normal"), a = this.attributes.includes("tangent"), o = n.attributes, s = t.attributes;
		!t.index && n.index && (t.index = n.index.clone()), s.position || t.setAttribute("position", $(o.position)), i && !s.normal && o.normal && t.setAttribute("normal", $(o.normal)), a && !s.tangent && o.tangent && t.setAttribute("tangent", $(o.tangent)), Q(n.index, t.index), Q(o.position, s.position), i && Q(o.normal, s.normal), a && Q(o.tangent, s.tangent);
		let c = o.position, l = i ? o.normal : null, u = a ? o.tangent : null, d = n.morphAttributes.position, f = n.morphAttributes.normal, p = n.morphAttributes.tangent, m = n.morphTargetsRelative, h = e.morphTargetInfluences, g = new oe();
		g.getNormalMatrix(e.matrixWorld), n.index && t.index.array.set(n.index.array);
		for (let t = 0, n = o.position.count; t < n; t++) Y.fromBufferAttribute(c, t), l && X.fromBufferAttribute(l, t), u && (Ht.fromBufferAttribute(u, t), Z.fromBufferAttribute(u, t)), h && (d && Qt(d, h, m, t, Y), f && Qt(f, h, m, t, X), p && Qt(p, h, m, t, Z)), e.isSkinnedMesh && (e.applyBoneTransform(t, Y), l && Zt(e, t, X), u && Zt(e, t, Z)), r && Y.applyMatrix4(e.matrixWorld), s.position.setXYZ(t, Y.x, Y.y, Y.z), l && (r && X.applyNormalMatrix(g), s.normal.setXYZ(t, X.x, X.y, X.z)), u && (r && Z.transformDirection(e.matrixWorld), s.tangent.setXYZW(t, Z.x, Z.y, Z.z, Ht.w));
		for (let e in this.attributes) {
			let n = this.attributes[e];
			n !== "position" && n !== "tangent" && n !== "normal" && n in o && (s[n] || t.setAttribute(n, $(o[n])), Q(o[n], s[n]), Yt(o[n], s[n]));
		}
		return e.matrixWorld.determinant() < 0 && tn(t), t;
	}
}, an = "\n\n// A stack of uint32 indices can can store the indices for\n// a perfectly balanced tree with a depth up to 31. Lower stack\n// depth gets higher performance.\n//\n// However not all trees are balanced. Best value to set this to\n// is the trees max depth.\n#ifndef BVH_STACK_DEPTH\n#define BVH_STACK_DEPTH 60\n#endif\n\n#ifndef INFINITY\n#define INFINITY 1e20\n#endif\n\n// Utilities\nuvec4 uTexelFetch1D( usampler2D tex, uint index ) {\n\n	uint width = uint( textureSize( tex, 0 ).x );\n	uvec2 uv;\n	uv.x = index % width;\n	uv.y = index / width;\n\n	return texelFetch( tex, ivec2( uv ), 0 );\n\n}\n\nivec4 iTexelFetch1D( isampler2D tex, uint index ) {\n\n	uint width = uint( textureSize( tex, 0 ).x );\n	uvec2 uv;\n	uv.x = index % width;\n	uv.y = index / width;\n\n	return texelFetch( tex, ivec2( uv ), 0 );\n\n}\n\nvec4 texelFetch1D( sampler2D tex, uint index ) {\n\n	uint width = uint( textureSize( tex, 0 ).x );\n	uvec2 uv;\n	uv.x = index % width;\n	uv.y = index / width;\n\n	return texelFetch( tex, ivec2( uv ), 0 );\n\n}\n\nvec4 textureSampleBarycoord( sampler2D tex, vec3 barycoord, uvec3 faceIndices ) {\n\n	return\n		barycoord.x * texelFetch1D( tex, faceIndices.x ) +\n		barycoord.y * texelFetch1D( tex, faceIndices.y ) +\n		barycoord.z * texelFetch1D( tex, faceIndices.z );\n\n}\n\nvoid ndcToCameraRay(\n	vec2 coord, mat4 cameraWorld, mat4 invProjectionMatrix,\n	out vec3 rayOrigin, out vec3 rayDirection\n) {\n\n	// get camera look direction and near plane for camera clipping\n	vec4 lookDirection = cameraWorld * vec4( 0.0, 0.0, - 1.0, 0.0 );\n	vec4 nearVector = invProjectionMatrix * vec4( 0.0, 0.0, - 1.0, 1.0 );\n	float near = abs( nearVector.z / nearVector.w );\n\n	// get the camera direction and position from camera matrices\n	vec4 origin = cameraWorld * vec4( 0.0, 0.0, 0.0, 1.0 );\n	vec4 direction = invProjectionMatrix * vec4( coord, 0.5, 1.0 );\n	direction /= direction.w;\n	direction = cameraWorld * direction - origin;\n\n	// slide the origin along the ray until it sits at the near clip plane position\n	origin.xyz += direction.xyz * near / dot( direction, lookDirection );\n\n	rayOrigin = origin.xyz;\n	rayDirection = direction.xyz;\n\n}\n", on = "\n\nfloat dot2( vec3 v ) {\n\n	return dot( v, v );\n\n}\n\n// implementation from https://www.shadertoy.com/view/ttfGWl, though method 2 has been removed\n// and is now available at this fork: https://www.shadertoy.com/view/WlB3zW\nvec3 closestPointToTriangle( vec3 p, vec3 v0, vec3 v1, vec3 v2, out vec3 barycoord ) {\n\n    vec3 v10 = v1 - v0;\n    vec3 v21 = v2 - v1;\n    vec3 v02 = v0 - v2;\n\n	vec3 p0 = p - v0;\n	vec3 p1 = p - v1;\n	vec3 p2 = p - v2;\n\n    vec3 nor = cross( v10, v02 );\n\n    // method 2, in barycentric space\n    vec3  q = cross( nor, p0 );\n    float d = 1.0 / dot2( nor );\n    float u = d * dot( q, v02 );\n    float v = d * dot( q, v10 );\n    float w = 1.0 - u - v;\n\n	if( u < 0.0 ) {\n\n		w = clamp( dot( p2, v02 ) / dot2( v02 ), 0.0, 1.0 );\n		u = 0.0;\n		v = 1.0 - w;\n\n	} else if( v < 0.0 ) {\n\n		u = clamp( dot( p0, v10 ) / dot2( v10 ), 0.0, 1.0 );\n		v = 0.0;\n		w = 1.0 - u;\n\n	} else if( w < 0.0 ) {\n\n		v = clamp( dot( p1, v21 ) / dot2( v21 ), 0.0, 1.0 );\n		w = 0.0;\n		u = 1.0 - v;\n\n	}\n\n	// output the barycoord in v0, v1, v2 weight order\n	barycoord = vec3( w, u, v );\n    return u * v1 + v * v2 + w * v0;\n\n}\n\nfloat distanceToTriangles(\n	// geometry info and triangle range\n	sampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,\n\n	// point and cut off range\n	vec3 point, float closestDistanceSquared,\n\n	// outputs\n	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord, inout float side, inout vec3 outPoint\n) {\n\n	bool found = false;\n	vec3 localBarycoord;\n	for ( uint i = offset, l = offset + count; i < l; i ++ ) {\n\n		uvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;\n		vec3 a = texelFetch1D( positionAttr, indices.x ).rgb;\n		vec3 b = texelFetch1D( positionAttr, indices.y ).rgb;\n		vec3 c = texelFetch1D( positionAttr, indices.z ).rgb;\n\n		// get the closest point and barycoord\n		vec3 closestPoint = closestPointToTriangle( point, a, b, c, localBarycoord );\n		vec3 delta = point - closestPoint;\n		float sqDist = dot2( delta );\n		if ( sqDist < closestDistanceSquared ) {\n\n			// set the output results\n			closestDistanceSquared = sqDist;\n			faceIndices = uvec4( indices.xyz, i );\n			faceNormal = normalize( cross( a - b, b - c ) );\n			barycoord = localBarycoord;\n			outPoint = closestPoint;\n			side = sign( dot( faceNormal, delta ) );\n\n		}\n\n	}\n\n	return closestDistanceSquared;\n\n}\n\nfloat distanceSqToBounds( vec3 point, vec3 boundsMin, vec3 boundsMax ) {\n\n	vec3 clampedPoint = clamp( point, boundsMin, boundsMax );\n	vec3 delta = point - clampedPoint;\n	return dot( delta, delta );\n\n}\n\nfloat distanceSqToBVHNodeBoundsPoint( vec3 point, sampler2D bvhBounds, uint currNodeIndex ) {\n\n	uint cni2 = currNodeIndex * 2u;\n	vec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;\n	vec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;\n	return distanceSqToBounds( point, boundsMin, boundsMax );\n\n}\n\n// use a macro to hide the fact that we need to expand the struct into separate fields\n#define	bvhClosestPointToPoint(		bvh,		point, maxDistance, faceIndices, faceNormal, barycoord, side, outPoint	)	_bvhClosestPointToPoint(		bvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,		point, maxDistance, faceIndices, faceNormal, barycoord, side, outPoint	)\n\nfloat _bvhClosestPointToPoint(\n	// bvh info\n	sampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,\n\n	// point to check\n	vec3 point, float maxDistance,\n\n	// output variables\n	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,\n	inout float side, inout vec3 outPoint\n ) {\n\n	// stack needs to be twice as long as the deepest tree we expect because\n	// we push both the left and right child onto the stack every traversal\n	int pointer = 0;\n	uint stack[ BVH_STACK_DEPTH ];\n	stack[ 0 ] = 0u;\n\n	float closestDistanceSquared = maxDistance * maxDistance;\n	bool found = false;\n	while ( pointer > - 1 && pointer < BVH_STACK_DEPTH ) {\n\n		uint currNodeIndex = stack[ pointer ];\n		pointer --;\n\n		// check if we intersect the current bounds\n		float boundsHitDistance = distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, currNodeIndex );\n		if ( boundsHitDistance > closestDistanceSquared ) {\n\n			continue;\n\n		}\n\n		uvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;\n		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );\n		if ( isLeaf ) {\n\n			uint count = boundsInfo.x & 0x0000ffffu;\n			uint offset = boundsInfo.y;\n			closestDistanceSquared = distanceToTriangles(\n				bvh_position, bvh_index, offset, count, point, closestDistanceSquared,\n\n				// outputs\n				faceIndices, faceNormal, barycoord, side, outPoint\n			);\n\n		} else {\n\n			uint leftIndex = currNodeIndex + 1u;\n			uint splitAxis = boundsInfo.x & 0x0000ffffu;\n			uint rightIndex = currNodeIndex + boundsInfo.y;\n			bool leftToRight = distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, leftIndex ) < distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, rightIndex );//rayDirection[ splitAxis ] >= 0.0;\n			uint c1 = leftToRight ? leftIndex : rightIndex;\n			uint c2 = leftToRight ? rightIndex : leftIndex;\n\n			// set c2 in the stack so we traverse it later. We need to keep track of a pointer in\n			// the stack while we traverse. The second pointer added is the one that will be\n			// traversed first\n			pointer ++;\n			stack[ pointer ] = c2;\n			pointer ++;\n			stack[ pointer ] = c1;\n\n		}\n\n	}\n\n	return sqrt( closestDistanceSquared );\n\n}\n", sn = "\n\n#ifndef TRI_INTERSECT_EPSILON\n#define TRI_INTERSECT_EPSILON 1e-5\n#endif\n\n// Raycasting\nbool intersectsBounds( vec3 rayOrigin, vec3 rayDirection, vec3 boundsMin, vec3 boundsMax, out float dist ) {\n\n	// https://www.reddit.com/r/opengl/comments/8ntzz5/fast_glsl_ray_box_intersection/\n	// https://tavianator.com/2011/ray_box.html\n	vec3 invDir = 1.0 / rayDirection;\n\n	// find intersection distances for each plane\n	vec3 tMinPlane = invDir * ( boundsMin - rayOrigin );\n	vec3 tMaxPlane = invDir * ( boundsMax - rayOrigin );\n\n	// get the min and max distances from each intersection\n	vec3 tMinHit = min( tMaxPlane, tMinPlane );\n	vec3 tMaxHit = max( tMaxPlane, tMinPlane );\n\n	// get the furthest hit distance\n	vec2 t = max( tMinHit.xx, tMinHit.yz );\n	float t0 = max( t.x, t.y );\n\n	// get the minimum hit distance\n	t = min( tMaxHit.xx, tMaxHit.yz );\n	float t1 = min( t.x, t.y );\n\n	// set distance to 0.0 if the ray starts inside the box\n	dist = max( t0, 0.0 );\n\n	return t1 >= dist;\n\n}\n\nbool intersectsTriangle(\n	vec3 rayOrigin, vec3 rayDirection, vec3 a, vec3 b, vec3 c,\n	out vec3 barycoord, out vec3 norm, out float dist, out float side\n) {\n\n	// https://stackoverflow.com/questions/42740765/intersection-between-line-and-triangle-in-3d\n	vec3 edge1 = b - a;\n	vec3 edge2 = c - a;\n	norm = cross( edge1, edge2 );\n\n	float det = - dot( rayDirection, norm );\n	float invdet = 1.0 / det;\n\n	vec3 AO = rayOrigin - a;\n	vec3 DAO = cross( AO, rayDirection );\n\n	vec4 uvt;\n	uvt.x = dot( edge2, DAO ) * invdet;\n	uvt.y = - dot( edge1, DAO ) * invdet;\n	uvt.z = dot( AO, norm ) * invdet;\n	uvt.w = 1.0 - uvt.x - uvt.y;\n\n	// set the hit information\n	barycoord = uvt.wxy; // arranged in A, B, C order\n	dist = uvt.z;\n	side = sign( det );\n	norm = side * normalize( norm );\n\n	// add an epsilon to avoid misses between triangles\n	uvt += vec4( TRI_INTERSECT_EPSILON );\n\n	return all( greaterThanEqual( uvt, vec4( 0.0 ) ) );\n\n}\n\nbool intersectTriangles(\n	// geometry info and triangle range\n	sampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,\n\n	// ray\n	vec3 rayOrigin, vec3 rayDirection,\n\n	// outputs\n	inout float minDistance, inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,\n	inout float side, inout float dist\n) {\n\n	bool found = false;\n	vec3 localBarycoord, localNormal;\n	float localDist, localSide;\n	for ( uint i = offset, l = offset + count; i < l; i ++ ) {\n\n		uvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;\n		vec3 a = texelFetch1D( positionAttr, indices.x ).rgb;\n		vec3 b = texelFetch1D( positionAttr, indices.y ).rgb;\n		vec3 c = texelFetch1D( positionAttr, indices.z ).rgb;\n\n		if (\n			intersectsTriangle( rayOrigin, rayDirection, a, b, c, localBarycoord, localNormal, localDist, localSide )\n			&& localDist < minDistance\n		) {\n\n			found = true;\n			minDistance = localDist;\n\n			faceIndices = uvec4( indices.xyz, i );\n			faceNormal = localNormal;\n\n			side = localSide;\n			barycoord = localBarycoord;\n			dist = localDist;\n\n		}\n\n	}\n\n	return found;\n\n}\n\nbool intersectsBVHNodeBounds( vec3 rayOrigin, vec3 rayDirection, sampler2D bvhBounds, uint currNodeIndex, out float dist ) {\n\n	uint cni2 = currNodeIndex * 2u;\n	vec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;\n	vec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;\n	return intersectsBounds( rayOrigin, rayDirection, boundsMin, boundsMax, dist );\n\n}\n\n// use a macro to hide the fact that we need to expand the struct into separate fields\n#define	bvhIntersectFirstHit(		bvh,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)	_bvhIntersectFirstHit(		bvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)\n\nbool _bvhIntersectFirstHit(\n	// bvh info\n	sampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,\n\n	// ray\n	vec3 rayOrigin, vec3 rayDirection,\n\n	// output variables split into separate variables due to output precision\n	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,\n	inout float side, inout float dist\n) {\n\n	// stack needs to be twice as long as the deepest tree we expect because\n	// we push both the left and right child onto the stack every traversal\n	int pointer = 0;\n	uint stack[ BVH_STACK_DEPTH ];\n	stack[ 0 ] = 0u;\n\n	float triangleDistance = INFINITY;\n	bool found = false;\n	while ( pointer > - 1 && pointer < BVH_STACK_DEPTH ) {\n\n		uint currNodeIndex = stack[ pointer ];\n		pointer --;\n\n		// check if we intersect the current bounds\n		float boundsHitDistance;\n		if (\n			! intersectsBVHNodeBounds( rayOrigin, rayDirection, bvh_bvhBounds, currNodeIndex, boundsHitDistance )\n			|| boundsHitDistance > triangleDistance\n		) {\n\n			continue;\n\n		}\n\n		uvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;\n		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );\n\n		if ( isLeaf ) {\n\n			uint count = boundsInfo.x & 0x0000ffffu;\n			uint offset = boundsInfo.y;\n\n			found = intersectTriangles(\n				bvh_position, bvh_index, offset, count,\n				rayOrigin, rayDirection, triangleDistance,\n				faceIndices, faceNormal, barycoord, side, dist\n			) || found;\n\n		} else {\n\n			uint leftIndex = currNodeIndex + 1u;\n			uint splitAxis = boundsInfo.x & 0x0000ffffu;\n			uint rightIndex = currNodeIndex + boundsInfo.y;\n\n			bool leftToRight = rayDirection[ splitAxis ] >= 0.0;\n			uint c1 = leftToRight ? leftIndex : rightIndex;\n			uint c2 = leftToRight ? rightIndex : leftIndex;\n\n			// set c2 in the stack so we traverse it later. We need to keep track of a pointer in\n			// the stack while we traverse. The second pointer added is the one that will be\n			// traversed first\n			pointer ++;\n			stack[ pointer ] = c2;\n\n			pointer ++;\n			stack[ pointer ] = c1;\n\n		}\n\n	}\n\n	return found;\n\n}\n", cn = "\nstruct BVH {\n\n	usampler2D index;\n	sampler2D position;\n\n	sampler2D bvhBounds;\n	usampler2D bvhContents;\n\n};\n", ln = /* @__PURE__ */ e({
	bvh_distance_functions: () => on,
	bvh_ray_functions: () => sn,
	bvh_struct_definitions: () => cn,
	common_functions: () => an
}), un = /* @__PURE__ */ e({
	AVERAGE: () => 1,
	BVH: () => l,
	BVHHelper: () => mt,
	BVHShaderGLSL: () => ln,
	CENTER: () => 0,
	CONTAINED: () => 2,
	ExtendedTriangle: () => f,
	FloatVertexAttributeTexture: () => Rt,
	GeometryBVH: () => o,
	INTERSECTED: () => 1,
	IntVertexAttributeTexture: () => Lt,
	LineBVH: () => Fe,
	LineLoopBVH: () => Pe,
	LineSegmentsBVH: () => Ne,
	MeshBVH: () => v,
	MeshBVHHelper: () => ht,
	MeshBVHUniformStruct: () => zt,
	NOT_INTERSECTED: () => 0,
	ObjectBVH: () => Ge,
	OrientedBox: () => _,
	PointsBVH: () => Ve,
	SAH: () => 2,
	SKIP_GENERATION: () => n,
	STOP_TRAVERSAL: () => 3,
	SkinnedMeshBVH: () => lt,
	StaticGeometryGenerator: () => rn,
	UIntVertexAttributeTexture: () => It,
	VertexAttributeTexture: () => Ft,
	acceleratedRaycast: () => Et,
	computeBatchedBoundsTree: () => At,
	computeBoundsTree: () => Ot,
	disposeBatchedBoundsTree: () => jt,
	disposeBoundsTree: () => kt,
	estimateMemoryInBytes: () => xt,
	generateIndirectBuffer: () => g,
	getBVHExtremes: () => bt,
	getJSONStructure: () => Ct,
	getTriangleHitPointInfo: () => h,
	shaderDistanceFunction: () => fn,
	shaderIntersectFunction: () => pn,
	shaderStructs: () => dn,
	validateBounds: () => St
}), dn = cn, fn = on, pn = `
	${an}
	${sn}
`;
export { lt as n, un as t };
