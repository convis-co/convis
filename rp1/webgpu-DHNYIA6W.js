import { t as e } from "./rolldown-runtime-CGnMp29N.js";
import { A as t, B as n, C as r, D as i, E as a, F as o, I as s, L as c, M as l, N as u, O as d, P as f, R as p, S as m, T as h, V as g, _, a as v, b as y, c as b, d as x, f as S, g as ee, h as C, i as w, j as T, k as E, l as te, m as D, n as ne, p as re, r as ie, s as ae, t as oe, u as se, v as ce, w as le, x as ue, y as O, z as de } from "./three.webgpu-CH4ORlUa.js";
import { n as fe } from "./src-Dful7grl.js";
import { D as pe, S as me, _ as he, a as ge, b as _e, f as ve, p as ye, t as be, v as xe } from "./MeshBVH-DinRuPeE.js";
import { An as Se, As as Ce, B as we, Co as Te, Dr as k, Fs as A, Ft as j, G as Ee, Gi as De, Gs as Oe, I as ke, Is as Ae, Jr as je, Kr as Me, Ls as Ne, Mn as Pe, No as Fe, Nt as M, Q as Ie, Qr as Le, V as Re, Ws as ze, Yi as Be, Yr as N, Zr as Ve, ba as P, cn as He, cs as Ue, ds as We, eo as Ge, et as Ke, fn as qe, fo as Je, kr as Ye, li as Xe, nt as Ze, oo as Qe, pi as $e, pn as et, sn as tt, so as nt, ua as rt, uo as it, us as at, wo as ot, y as st } from "./stage-C_LUPXd6.js";
// node_modules/three-mesh-bvh/src/webgpu/tsl/structs.js
var F = new C({
	min: "array<f32, 3>",
	max: "array<f32, 3>"
}, "BVHBoundingBox");
F.getLength = () => 6;
var ct = new C({
	leftBounds: "BVHBoundingBox",
	rightBounds: "BVHBoundingBox",
	rightChildOrTriangleOffset: "uint",
	splitAxisOrTriangleCount: "uint",
	_alignment0: "uint",
	_alignment1: "uint"
}, "BVHNode");
ct.getLength = () => 2 * F.getLength() + 4;
var lt = new C({
	matrixWorld: "mat4x4f",
	inverseMatrixWorld: "mat4x4f",
	visible: "uint",
	_alignment0: "uint",
	_alignment1: "uint",
	_alignment2: "uint"
}, "TransformStruct"), I = new C({
	origin: "vec3f",
	direction: "vec3f",
	maxDist: "float"
}, "Ray"), ut = new C({
	indices: "vec4u",
	normal: "vec3f",
	didHit: "bool",
	barycoord: "vec3f",
	objectIndex: "uint",
	side: "float",
	dist: "float"
}, "IntersectionResult"), dt = new C({
	faceIndices: "vec4u",
	closestPoint: "vec3f",
	found: "bool",
	barycoord: "vec3f",
	objectIndex: "uint",
	faceNormal: "vec3f",
	side: "float",
	distanceSq: "float"
}, "PointQueryResult"), ft = n("\n\n	const BVH_STACK_DEPTH = 60u;\n	const INFINITY = 1e20;\n	const TRI_INTERSECT_EPSILON = 1e-5;\n\n"), pt = n("\n	struct IntersectionResult {\n		indices: vec4u,\n		normal: vec3f,\n		didHit: bool,\n		barycoord: vec3f,\n		side: f32,\n		dist: f32,\n	};\n");
g("\n\n	fn getVertexAttribute(\n		barycoord: vec3f,\n		indices: vec3u,\n		attributeBuffer: ptr<storage, array<vec3f>, read>\n	) -> vec3f {\n\n		let n0 = attributeBuffer[ indices.x ];\n		let n1 = attributeBuffer[ indices.y ];\n		let n2 = attributeBuffer[ indices.z ];\n		return barycoord.x * n0 + barycoord.y * n1 + barycoord.z * n2;\n\n	}\n\n");
var mt = g("\n\n	fn intersectsBounds(\n		ray: Ray,\n		bounds: BVHBoundingBox,\n		dist: ptr<function, f32>\n	) -> bool {\n\n		let boundsMin = vec3( bounds.min[0], bounds.min[1], bounds.min[2] );\n		let boundsMax = vec3( bounds.max[0], bounds.max[1], bounds.max[2] );\n\n		let invDir = 1.0 / ray.direction;\n		let tMinPlane = ( boundsMin - ray.origin ) * invDir;\n		let tMaxPlane = ( boundsMax - ray.origin ) * invDir;\n\n		let tMinHit = vec3f(\n			min( tMinPlane.x, tMaxPlane.x ),\n			min( tMinPlane.y, tMaxPlane.y ),\n			min( tMinPlane.z, tMaxPlane.z )\n		);\n\n		let tMaxHit = vec3f(\n			max( tMinPlane.x, tMaxPlane.x ),\n			max( tMinPlane.y, tMaxPlane.y ),\n			max( tMinPlane.z, tMaxPlane.z )\n		);\n\n		let t0 = max( max( tMinHit.x, tMinHit.y ), tMinHit.z );\n		let t1 = min( min( tMaxHit.x, tMaxHit.y ), tMaxHit.z );\n\n		( *dist ) = max( t0, 0.0 );\n\n		return t1 >= ( *dist );\n\n	}\n\n", [I, F]), ht = g("\n\n	fn intersectsTriangle( ray: Ray, a: vec3f, b: vec3f, c: vec3f ) -> IntersectionResult {\n\n		var result: IntersectionResult;\n		result.didHit = false;\n\n		let edge1 = b - a;\n		let edge2 = c - a;\n		let n = cross( edge1, edge2 );\n\n		let det = - dot( ray.direction, n );\n\n		if ( abs( det ) < TRI_INTERSECT_EPSILON ) {\n\n			return result;\n\n		}\n\n		let invdet = 1.0 / det;\n\n		let AO = ray.origin - a;\n		let DAO = cross( AO, ray.direction );\n\n		let u = dot( edge2, DAO ) * invdet;\n		let v = -dot( edge1, DAO ) * invdet;\n		let t = dot( AO, n ) * invdet;\n\n		let w = 1.0 - u - v;\n\n		if ( u < - TRI_INTERSECT_EPSILON || v < - TRI_INTERSECT_EPSILON || w < - TRI_INTERSECT_EPSILON || t < TRI_INTERSECT_EPSILON ) {\n\n			return result;\n\n		}\n\n		result.didHit = true;\n		result.barycoord = vec3f( w, u, v );\n		result.dist = t;\n		result.side = sign( det );\n		result.normal = result.side * normalize( n );\n\n		return result;\n\n	}\n\n", [
	I,
	pt,
	ft
]), gt = g("\n\n	fn intersectTriangles(\n		bvh_position: ptr<storage, array<vec3f>, read>,\n		bvh_index: ptr<storage, array<vec3u>, read>,\n		offset: u32,\n		count: u32,\n		ray: Ray\n	) -> IntersectionResult {\n\n		var closestResult: IntersectionResult;\n\n		closestResult.didHit = false;\n		closestResult.dist = INFINITY;\n\n		for ( var i = offset; i < offset + count; i = i + 1u ) {\n\n			let indices = bvh_index[ i ];\n			let a = bvh_position[ indices.x ];\n			let b = bvh_position[ indices.y ];\n			let c = bvh_position[ indices.z ];\n\n			var triResult = intersectsTriangle( ray, a, b, c );\n\n			if ( triResult.didHit && triResult.dist < closestResult.dist ) {\n\n				closestResult = triResult;\n				closestResult.indices = vec4u( indices.xyz, i );\n\n			}\n\n		}\n\n		return closestResult;\n\n	}\n\n", [
	ht,
	I,
	pt,
	ft
]);
g("\n\n	fn bvhIntersectFirstHit(\n		bvh_index: ptr<storage, array<vec3u>, read>,\n		bvh_position: ptr<storage, array<vec3f>, read>,\n		bvh: ptr<storage, array<BVHNode>,read>,\n		ray: Ray,\n	) -> IntersectionResult {\n\n		var pointer = 0;\n		var stack: array<u32, BVH_STACK_DEPTH>;\n		stack[ 0 ] = 0u;\n\n		var bestHit: IntersectionResult;\n\n		bestHit.didHit = false;\n		bestHit.dist = INFINITY;\n\n		loop {\n\n			if ( pointer < 0 || pointer >= i32( BVH_STACK_DEPTH ) ) {\n\n				break;\n\n			}\n\n			let currNodeIndex = stack[ pointer ];\n			let node = bvh[ currNodeIndex ];\n\n			pointer = pointer - 1;\n\n			var boundsHitDistance: f32 = 0.0;\n\n			if ( ! intersectsBounds( ray, node.bounds, &boundsHitDistance ) || boundsHitDistance > bestHit.dist ) {\n\n				continue;\n\n			}\n\n			let boundsInfox = node.splitAxisOrTriangleCount;\n			let boundsInfoy = node.rightChildOrTriangleOffset;\n\n			let isLeaf = ( boundsInfox & 0xffff0000u ) != 0u;\n\n			if ( isLeaf ) {\n\n				let count = boundsInfox & 0x0000ffffu;\n				let offset = boundsInfoy;\n\n				let localHit = intersectTriangles(\n					bvh_position, bvh_index, offset,\n					count, ray\n				);\n\n				if ( localHit.didHit && localHit.dist < bestHit.dist ) {\n\n					bestHit = localHit;\n\n				}\n\n			} else {\n\n				let leftIndex = currNodeIndex + 1u;\n				let splitAxis = boundsInfox & 0x0000ffffu;\n				let rightIndex = currNodeIndex + boundsInfoy;\n\n				let leftToRight = ray.direction[splitAxis] >= 0.0;\n				let c1 = select( rightIndex, leftIndex, leftToRight );\n				let c2 = select( leftIndex, rightIndex, leftToRight );\n\n				pointer = pointer + 1;\n				stack[ pointer ] = c2;\n\n				pointer = pointer + 1;\n				stack[ pointer ] = c1;\n\n			}\n\n		}\n\n		return bestHit;\n\n	}\n\n", [
	gt,
	mt,
	I,
	ct,
	pt,
	ft
]);
// node_modules/three-mesh-bvh/src/webgpu/nodes/NodeProxy.js
var _t = class extends se {
	static get type() {
		return "ProxyCallNode";
	}
	constructor(e, t) {
		super(), this.proxyNode = e, this.params = t;
	}
	setup() {
		return this.proxyNode.proxyNode.call(...this.params);
	}
}, vt = class {
	get isNode() {
		return !0;
	}
	get proxyNode() {
		let { proxyObject: e, proxyProperty: t } = this, n = t.split("."), r = e;
		for (let e = 0, t = n.length; e < t; e++) r = r?.[n[e]];
		return r && "functionNode" in r ? r.functionNode : r ?? null;
	}
	constructor(e, t = null) {
		return this.proxyObject = t, this.proxyProperty = e, new Proxy(this, {
			get(e, t) {
				if (t in e) return Reflect.get(e, t);
				{
					let n = e.proxyNode;
					if (!n) return;
					let r = Reflect.get(n, t);
					return typeof r == "function" ? r.bind(n) : r;
				}
			},
			set(e, t, n) {
				if (t in e) return Reflect.set(e, t, n);
				throw Error("NodeProxy: Cannot set members of proxied nodes.");
			}
		});
	}
}, L = (...e) => new vt(...e), R = (...e) => {
	let t = new vt(...e);
	return ee.nodeProxyConstructor((...e) => new _t(t, e), t);
}, yt = class extends vt {
	get proxyNode() {
		return super.proxyNode || this.fallbackNode;
	}
	constructor(e, t) {
		super(e, null), Object.defineProperty(this, "fallbackNode", { value: t });
	}
	setup(e) {
		return this.proxyObject = e.getContext(), this.proxyNode.setup(e);
	}
}, z = (...e) => new yt(...e), B = (...e) => {
	let t = new yt(...e);
	return ee.nodeProxyConstructor((...e) => new _t(t, e), t);
}, bt = /* @__PURE__ */ new Ne(), V = /* @__PURE__ */ new Ne();
function xt(e, t, n, r) {
	let i = t * 8;
	for (let t = 0; t < 3; t++) {
		let a = e[i + t], o = e[i + t + 3];
		a > o ? (n[r + t] = 1, n[r + t + 3] = -1) : (n[r + t] = a, n[r + t + 3] = o);
	}
}
function St(e, t, n, r, i) {
	let a = n * 8;
	xt(e, n + 1, r, i), xt(e, n + t[a + 6], r, i + 6);
}
function Ct(e, t) {
	let n = e ? e.array : null, r = new Uint32Array(t.length * 3);
	for (let e = 0, i = t.length; e < i; e++) {
		let i = 3 * e, a = 3 * t[e];
		for (let e = 0; e < 3; e++) r[i + e] = n ? n[a + e] : a + e;
	}
	return r;
}
function wt(e, t, n, r) {
	let i = new Uint32Array(r), a = new Float32Array(r);
	e._roots.forEach((e) => {
		let r = new Uint16Array(e), o = new Uint32Array(e), s = new Float32Array(e);
		for (let c = 0, l = e.byteLength / 32; c < l; c++) {
			let e = c * 8, l = e * 2, u = n * 16, d = he(l, r);
			if (d || St(s, o, c, a, u), t === null) n++;
			else {
				if (d) {
					let n = o[e + 6], { transformSlot: a, nodeOffset: s } = r[l + 14] === 0 ? {
						transformSlot: 0,
						nodeOffset: 0
					} : t[n];
					if (a > 16777215) throw Error(`packBVHBufferUtils: transform slot ${a} exceeds the 24-bit TLAS leaf limit.`);
					i[u + 12] = s, i[u + 13] = 4278190080 | a & 16777215;
				} else i[u + 12] = o[e + 6], i[u + 13] = o[e + 7];
				n++;
			}
		}
	});
}
function Tt(e, t) {
	return Et(new Uint16Array(e), new Uint32Array(e), t);
}
function Et(e, t, n) {
	if (he(n * 8 * 2, e)) return 1;
	let r = t[n * 8 + 6];
	return r + Et(e, t, n + r);
}
function Dt(e, t = 0) {
	let n = new Uint16Array(e), r = new Uint32Array(e), i = 0;
	return a(t * 8, 1), i;
	function a(e, t) {
		let o = e, s = e * 2;
		if (he(s, n)) i = Math.max(t, i);
		else {
			let e = _e(o, r);
			a(xe(o), t + 1), a(e, t + 1);
		}
	}
}
function Ot(e, t, n, r, i, a) {
	let o = new Uint16Array(a), s = new Uint32Array(a), c = new Float32Array(a), l = new Uint16Array(e), u = new Uint32Array(e), d = new Float32Array(e);
	for (let e = 0; e < n; e++) {
		let n = t + e, a = n * 8, f = a * 2, p = i * 16, m = p * 2;
		he(f, l) ? (s[p + 12] = u[a + 6] + r, o[m + 26] = l[f + 14], o[m + 27] = pe) : (St(d, u, n, c, p), s[p + 12] = u[a + 6], s[p + 13] = u[a + 7]), i++;
	}
}
function kt(e, t, n, r, i) {
	let { geometry: a } = e, { start: o, count: s, vertexStart: c } = t;
	if (e.indirect) {
		let t = Ct(a.index, e._indirectBuffer);
		for (let e = 0; e < t.length; e++) i[e + r] = t[e] - c + n;
	} else if (a.index) for (let e = 0; e < s; e++) i[e + r] = a.index.getX(e + o) - c + n;
	else for (let e = 0; e < s; e++) i[e + r] = e + o + n;
}
function At(e, t, n, r, i, a) {
	let { geometry: o, mesh: s = null } = e, { vertexStart: c, vertexCount: l } = t, u = new Float32Array(r), d = i.getLength();
	i.membersLayout.forEach(({ name: e }, t) => {
		let r = o.attributes[e];
		a.getDefaultAttributeValue(e, bt);
		for (let i = 0; i < l; i++) {
			if (r) {
				switch (V.fromBufferAttribute(r, i + c), r.itemSize) {
					case 1:
						V.y = bt.y, V.z = bt.z, V.w = bt.w;
						break;
					case 2:
						V.z = bt.z, V.w = bt.w;
						break;
					case 3: V.w = bt.w;
				}
				s && (e === "position" || e === "normal" || e === "tangent") && s.applyBoneTransform(i + c, V);
			} else V.copy(bt);
			V.toArray(u, (n + i) * d + t * 4);
		}
	});
}
// node_modules/three-mesh-bvh/src/webgpu/nodes/WGSLTagFnNode.js
var jt = class extends se {
	constructor(e) {
		super(), this.literal = e;
	}
	build() {
		return this.literal;
	}
}, Mt = class extends se {
	constructor(e, t = "property") {
		super(), this.node = e, this.output = t;
	}
	build(e) {
		return this.node.build(e, this.output);
	}
};
function Nt(e) {
	return e.isNode ? new Mt(e) : null;
}
function Pt(e) {
	let t = [];
	for (let n of e) if (Array.isArray(n)) for (let e of n) {
		let n = Nt(e);
		n && t.push(n);
	}
	return t;
}
function Ft(e, t) {
	return e.map((e) => (e && !e.isNode && e instanceof Function && (e = e(t)), e && e.isNode ? (e.setup(t), e.isWGSLTagCodeNode ? new Mt(e, "inline") : new Mt(e)) : e));
}
function It(e, t, n) {
	let r = "";
	for (let i = 0, a = e.length; i < a; i++) if (r += e[i], i < t.length) {
		let e = t[i];
		Array.isArray(e) || (r += typeof e == "string" || typeof e == "number" ? String(e) : e.build(n));
	}
	return r;
}
var Lt = class extends te {
	static get type() {
		return "WGSLTagFnNode";
	}
	constructor(e, t, n = "wgsl") {
		super("", Pt(t), n), this.isWGSLTagFnNode = !0, this.tokens = e, this.args = t;
	}
	setup(e) {
		super.setup(e), this._normalizedArgs = Ft(this.args, e);
	}
	getNodeFunction(e) {
		let { tokens: t, _normalizedArgs: n } = this, r = e.getDataFromNode(this), i = r.nodeFunction;
		if (i === void 0) {
			let a = "";
			for (let r = 0, i = t.length; r < i; r++) if (a += t[r], r < n.length) {
				let t = n[r];
				Array.isArray(t) || (typeof t == "string" || typeof t == "number" ? a += String(t) : t.isStructLayoutNode ? a += t.getNodeType(e) : t.isStruct ? a += t.layout.getNodeType(e) : a += "_arg" + r);
			}
			a = a.replace(/\/\/.*[\n\r]/g, ""), i = e.parser.parseFunction(a), r.nodeFunction = i;
		}
		return i;
	}
	generate(e, t) {
		let n = super.generate(e, t), { _normalizedArgs: r } = this, i = It(this.tokens, r, e), { type: a } = this.getNodeFunction(e), o = e.getCodeFromNode(this, a);
		return o.code = i.replace(/\/\/.+[\n\r]/g, "").replace(/->\s*void/, "").trim(), n;
	}
}, Rt = class extends ae {
	static get type() {
		return "WGSLTagCodeNode";
	}
	constructor(e, t, n = "wgsl") {
		super("", Pt(t), n), this.isWGSLTagCodeNode = !0, this.tokens = e, this.args = t;
	}
	setup(e) {
		super.setup(e), this._normalizedArgs = Ft(this.args, e);
	}
	build(e, t) {
		return t === "inline" ? It(this.tokens, this._normalizedArgs, e) : super.build(e, t);
	}
	generate(e) {
		super.generate(e);
		let t = e.getCodeFromNode(this, this.getNodeType(e));
		return t.code = It(this.tokens, this._normalizedArgs, e), t.code;
	}
}, zt = (e) => ee.nodeProxyConstructor((...t) => {
	if (t.length === 1 && t[0] && typeof t[0] == "object" && !t[0].isNode) {
		let e = t[0];
		for (let t in e) typeof e[t] == "string" && (e[t] = new jt(e[t]));
	}
	return e.call(...t);
}, e), H = (e, ...t) => zt(new Lt(e, t)), Bt = (e, ...t) => new Rt(e, t), Vt = u(60);
// node_modules/three-mesh-bvh/src/webgpu/shapecastFns/getShapecastFn.js
function Ht(e, t) {
	let { name: n = `bvh_shapecast_fn_${Math.random().toString(36).substring(2, 7)}`, shapeStruct: r, resultStruct: i = null, prefixFn: a = null, boundsOrderFn: o = null, intersectsBoundsFn: s, intersectRangeFn: c, transformShapeFn: l = null, transformResultFn: u = null, resetShapeFn: d = null } = t, { nodes: f, transforms: p } = e.storage, m = "";
	a && (m = Bt`${a}();`);
	let h = "";
	u && (h = Bt`${u}( result, objectIndex );`);
	let g = "";
	l && (g = Bt`${l}( &localShape, objectIndex );`);
	let _ = "";
	d && (_ = Bt`${d}( objectIndex );`);
	let v = "";
	o && (v = Bt`
			let leftToRight = ${o}( localShape, splitAxis, node );
			c1 = select( rightIndex, leftIndex, leftToRight );
			c2 = select( leftIndex, rightIndex, leftToRight );
			hit1 = select( hitRight, hitLeft, leftToRight );
			hit2 = select( hitLeft, hitRight, leftToRight );
		`);
	let y = i ? Bt`result: ptr<function, ${i}>` : "", b = i ? "result" : "", x = H`
		// fn
		fn ${n}( shape: ${r}, ${y} ) -> bool {

			${m}

			var didHit = false;

			var isTLAS = true;
			var pointer: i32 = 0;
			var stack: array<u32, ${Vt}>;
			stack[ 0 ] = 0u;

			var blasDidHit: bool = false;
			var objectIndex: u32 = 0;
			var localShape: ${r} = shape;

			// the stack depth the current cluster's BLAS drains back down to once it is complete
			var tlasReset: i32 = 0;

			loop {

				// The cluster's BLAS has drained back to its TLAS leaf. Finalize the cluster that
				// was just traversed and resume the TLAS.
				if ( ! isTLAS && tlasReset == pointer ) {

					if ( blasDidHit ) {

						blasDidHit = false;
						didHit = true;
						${h}

					}

					${_}

					objectIndex = 0;
					isTLAS = true;
					localShape = shape;

				}

				// check if we've finished all nodes on the stack (or overrun the stack)
				if ( pointer < 0 || pointer >= i32( ${Vt} ) ) {

					break;

				}

				// a node's bounds were tested by its parent, so the popped node is always entered
				let nodeIndex = stack[ pointer ];
				let node = ${f}[ nodeIndex ];
				pointer = pointer - 1;

				let infoX = node.splitAxisOrTriangleCount;
				let infoY = node.rightChildOrTriangleOffset;
				let isLeaf = ( infoX & 0xffff0000u ) != 0u;

				if ( isLeaf ) {

					if ( isTLAS ) {

						// the leaf encodes the placement / transform slot in the low 24 bits of infoX
						// and the cluster subtree's absolute node offset in infoY, which is pushed
						// directly as the BLAS entry node. Each TLAS leaf references one cluster.
						objectIndex = infoX & 0x00ffffffu;

						let transform = ${p}[ objectIndex ];
						if ( transform.visible != 0u ) {

							tlasReset = pointer;
							isTLAS = false;
							blasDidHit = false;

							// Transform shape into object local space
							localShape = shape;
							${g}

							pointer = pointer + 1;
							stack[ pointer ] = infoY;

						}

					} else {

						let count = infoX & 0x0000ffffu;
						let offset = infoY;
						// Cast bool callbacks to u32 to preserve their existing hit / miss behavior.
						let rangeResult = u32( ${c}( localShape, offset, count, ${b} ) );
						blasDidHit = rangeResult != ${0}u || blasDidHit;
						if ( rangeResult == ${3}u ) {

							${h}
							${_}
							return true;

						}

					}

				} else {

					// test both children here, pushing the farther one first so the nearer is popped next
					let leftIndex = nodeIndex + 1u;
					let splitAxis = infoX & 0x0000ffffu;
					let rightIndex = nodeIndex + infoY;
					let hitLeft = ${s}( localShape, node.leftBounds, ${b} ) != 0u;
					let hitRight = ${s}( localShape, node.rightBounds, ${b} ) != 0u;

					var c1 = rightIndex;
					var c2 = leftIndex;
					var hit1 = hitRight;
					var hit2 = hitLeft;
					${v}

					if ( hit2 ) {

						pointer = pointer + 1;
						stack[ pointer ] = c2;

					}

					if ( hit1 ) {

						pointer = pointer + 1;
						stack[ pointer ] = c1;

					}

				}

			}

			return didHit;

		}
	`;
	return x.outputType = i, x.functionName = n, x;
}
// node_modules/three-mesh-bvh/src/webgpu/tsl/fns.js
var Ut = H`
	// fn
	fn closestPointToTriangle(
		p: vec3f,
		v0: vec3f,
		v1: vec3f,
		v2: vec3f
	) -> vec3f {

		let v10 = v1 - v0;
		let v21 = v2 - v1;
		let v02 = v0 - v2;
		let p0 = p - v0;
		let p1 = p - v1;
		let p2 = p - v2;

		let nor = cross( v10, v02 );
		let q = cross( nor, p0 );
		let d = 1.0 / dot( nor, nor );
		var u = d * dot( q, v02 );
		var v = d * dot( q, v10 );
		var w = 1.0 - u - v;

		if ( u < 0.0 ) {

			w = clamp( dot( p2, v02 ) / dot( v02, v02 ), 0.0, 1.0 );
			u = 0.0;
			v = 1.0 - w;

		} else if ( v < 0.0 ) {

			u = clamp( dot( p0, v10 ) / dot( v10, v10 ), 0.0, 1.0 );
			v = 0.0;
			w = 1.0 - u;

		} else if ( w < 0.0 ) {

			v = clamp( dot( p1, v21 ) / dot( v21, v21 ), 0.0, 1.0 );
			w = 0.0;
			u = 1.0 - v;

		}

		return vec3f( w, u, v );

	}
`, Wt = H`
	// fn
	fn intersectRayTriangle( ray: ${I}, a: vec3f, b: vec3f, c: vec3f, threshold: f32 ) -> ${ut} {

		const DET_EPSILON = 1e-15;

		var result: ${ut};
		result.didHit = false;

		let edge1 = b - a;
		let edge2 = c - a;
		let n = cross( edge1, edge2 );

		let det = - dot( ray.direction, n );
		if ( abs( det ) < DET_EPSILON ) {

			return result;

		}

		let invdet = 1.0 / det;

		let AO = ray.origin - a;
		let DAO = cross( AO, ray.direction );

		let u = dot( edge2, DAO ) * invdet;
		if ( u < 0.0 || u > 1.0 ) {

			return result;

		}

		let v = - dot( edge1, DAO ) * invdet;
		if ( v < 0.0 || u + v > 1.0 ) {

			return result;

		}

		let t = dot( AO, n ) * invdet;
		let w = 1.0 - u - v;
		if ( t < threshold ) {

			return result;

		}

		result.didHit = true;
		result.barycoord = vec3f( w, u, v );
		result.dist = t;
		result.side = sign( det );
		result.normal = result.side * normalize( n );

		return result;

	}
`, Gt = H`
	// fn
	fn ndcToCameraRay( ndc: vec2f, inverseModelViewProjection: mat4x4f ) -> ${I} {

		var homogeneous = vec4f();
		var ray: ${I};

		homogeneous = inverseModelViewProjection * vec4f( ndc, 0.0, 1.0 );
		ray.origin = homogeneous.xyz / homogeneous.w;

		homogeneous = inverseModelViewProjection * vec4f( ndc, 1.0, 1.0 );
		let toFarPlane = ( homogeneous.xyz / homogeneous.w ) - ray.origin;
		ray.maxDist = length( toFarPlane );
		ray.direction = toFarPlane / ray.maxDist;

		return ray;

	}
`, Kt = H`
	fn bvh_rayBoundsDistance( ray: ${I}, bounds: ${F} ) -> f32 {

		let boundsMin = vec3( bounds.min[0], bounds.min[1], bounds.min[2] );
		let boundsMax = vec3( bounds.max[0], bounds.max[1], bounds.max[2] );

		// Avoid 0 * infinity for rays parallel to a slab and on its boundary.
		let parallel = ray.direction == vec3f( 0.0 );
		if ( any( parallel & ( ( ray.origin < boundsMin ) | ( ray.origin > boundsMax ) ) ) ) {

			return - 1.0;

		}

		let invDir = 1.0 / select( ray.direction, vec3f( 1.0 ), parallel );
		let tMinPlane = ( boundsMin - ray.origin ) * invDir;
		let tMaxPlane = ( boundsMax - ray.origin ) * invDir;

		// parallel axes never limit the slab interval
		const FLT_MAX = 3.402823e38;
		let tMinHit = select( min( tMinPlane, tMaxPlane ), vec3f( - FLT_MAX ), parallel );
		let tMaxHit = select( max( tMinPlane, tMaxPlane ), vec3f( FLT_MAX ), parallel );

		let t0 = max( max( tMinHit.x, tMinHit.y ), tMinHit.z );
		let t1 = min( min( tMaxHit.x, tMaxHit.y ), tMaxHit.z );

		let dist = max( t0, 0.0 );
		return select( dist, - 1.0, t1 < dist );

	}
`;
// node_modules/three-mesh-bvh/src/webgpu/shapecastFns/getRaycastAnyHitFn.js
function qt(e) {
	let { index: t, attributes: n, transforms: r } = e.storage, i = O(1).toVar("bvh_rayScalarAnyHit");
	return e.getShapecastFn({
		name: "bvh_RaycastAnyHit",
		shapeStruct: I,
		intersectsBoundsFn: H`
			fn rayIntersectsBoundsAnyHit( ray: ${I}, bounds: ${F} ) -> u32 {

				let dist = ${Kt}( ray, bounds ) * ${i};
				return u32( dist >= 0.0 && ( ray.maxDist <= 0.0 || dist < ray.maxDist ) );

			}
		`,
		intersectRangeFn: H`
			fn intersectRangeAnyHit( ray: ${I}, offset: u32, count: u32 ) -> u32 {

				for ( var ti = offset; ti < offset + count; ti = ti + 1u ) {

					let a = ${n}[ ${t}[ ti * 3u ] ].position.xyz;
					let b = ${n}[ ${t}[ ti * 3u + 1u ] ].position.xyz;
					let c = ${n}[ ${t}[ ti * 3u + 2u ] ].position.xyz;

					let triResult = ${Wt}( ray, a, b, c, 0.0 );
					if ( triResult.didHit && ( ray.maxDist <= 0.0 || triResult.dist * ${i} < ray.maxDist ) ) {

						return ${3}u;

					}

				}

				return ${0}u;

			}
		`,
		transformShapeFn: H`
			fn transformRayAnyHit( ray: ptr<function, ${I}>, objectIndex: u32 ) -> void {

				let toLocal = ${r}[ objectIndex ].inverseMatrixWorld;
				ray.origin = ( toLocal * vec4f( ray.origin, 1.0 ) ).xyz;
				ray.direction = ( toLocal * vec4f( ray.direction, 0.0 ) ).xyz;

				let len = length( ray.direction );
				ray.direction /= len;
				${i} = 1.0 / len;

			}
		`,
		resetShapeFn: H`
			fn resetRayScalarAnyHit( objectIndex: u32 ) -> void {

				${i} = 1.0;

			}
		`
	});
}
// node_modules/three-mesh-bvh/src/webgpu/shapecastFns/getRaycastFirstHitFn.js
function Jt(e) {
	let { index: t, attributes: n, transforms: r } = e.storage, i = O(1).toVar("bvh_rayScalar");
	return e.getShapecastFn({
		name: "bvh_RaycastFirstHit",
		shapeStruct: I,
		resultStruct: ut,
		boundsOrderFn: H`
			fn getBoundsOrder( ray: ${I}, splitAxis: u32, node: ${ct} ) -> bool {

				return ray.direction[ splitAxis ] >= 0.0;

			}
		`,
		intersectsBoundsFn: H`
			fn rayIntersectsBounds( ray: ${I}, bounds: ${F}, result: ptr<function, ${ut}> ) -> u32 {

				let dist = ${Kt}( ray, bounds ) * ${i};
				if ( dist < 0.0 ) {

					return 0u;

				} else if ( ray.maxDist > 0.0 && dist >= ray.maxDist ) {

					return 0u;

				} else if ( result.didHit && dist >= result.dist ) {

					return 0u;

				} else {

					return 1u;

				}

			}

		`,
		intersectRangeFn: H`
			fn intersectRange( ray: ${I}, offset: u32, count: u32, result: ptr<function, ${ut}> ) -> bool {

				var didHit = false;
				for ( var ti = offset; ti < offset + count; ti = ti + 1u ) {

					let i0 = ${t}[ ti * 3u ];
					let i1 = ${t}[ ti * 3u + 1u ];
					let i2 = ${t}[ ti * 3u + 2u ];

					let a = ${n}[ i0 ].position.xyz;
					let b = ${n}[ i1 ].position.xyz;
					let c = ${n}[ i2 ].position.xyz;

					var triResult = ${Wt}( ray, a, b, c, 0.0 );
					triResult.dist *= ${i};
					if ( triResult.didHit && ( ray.maxDist <= 0.0 || triResult.dist < ray.maxDist ) && ( ! result.didHit || triResult.dist < result.dist ) ) {

						result.didHit = true;
						result.dist = triResult.dist;
						result.normal = triResult.normal;
						result.side = triResult.side;
						result.barycoord = triResult.barycoord;
						result.indices = vec4u( i0, i1, i2, ti );

						didHit = true;

					}

				}

				return didHit;

			}
		`,
		transformShapeFn: H`
			fn transformRay( ray: ptr<function, ${I}>, objectIndex: u32 ) -> void {

				let toLocal = ${r}[ objectIndex ].inverseMatrixWorld;
				ray.origin = ( toLocal * vec4f( ray.origin, 1.0 ) ).xyz;
				ray.direction = ( toLocal * vec4f( ray.direction, 0.0 ) ).xyz;

				let len = length( ray.direction );
				ray.direction /= len;
				${i} = 1.0 / len;

			}
		`,
		transformResultFn: H`
			fn transformResult( hit: ptr<function, ${ut}>, objectIndex: u32 ) -> void {

				let toLocal = ${r}[ objectIndex ].inverseMatrixWorld;
				hit.normal = normalize( ( transpose( toLocal ) * vec4f( hit.normal, 0.0 ) ).xyz );
				hit.objectIndex = objectIndex;

			}
		`,
		resetShapeFn: H`
			fn resetRayScalar( objectIndex: u32 ) -> void {

				${i} = 1.0;

			}
		`
	});
}
// node_modules/three-mesh-bvh/src/webgpu/shapecastFns/getSampleTrianglePointFn.js
function Yt(e) {
	let { storage: t, structs: n } = e, r = n.attributes.membersLayout.map(({ name: e }) => `result.${e} = a0.${e} * barycoord.x + a1.${e} * barycoord.y + a2.${e} * barycoord.z;`).join("\n");
	return H`
		// fn
		fn bvh_sampleTrianglePoint( barycoord: vec3f, indices: vec3u ) -> ${n.attributes} {

			var result: ${n.attributes};
			var a0 = ${t.attributes}[ indices.x ];
			var a1 = ${t.attributes}[ indices.y ];
			var a2 = ${t.attributes}[ indices.z ];
			${r}
			return result;

		}
	`;
}
// node_modules/three-mesh-bvh/src/webgpu/shapecastFns/getClosestPointToPointFn.js
function Xt(e) {
	let { index: t, attributes: n, transforms: i } = e.storage, a = r().toVar("bvh_toWorldMat");
	return e.getShapecastFn({
		name: "bvh_ClosestPointToPoint",
		shapeStruct: "vec3f",
		resultStruct: dt,
		boundsOrderFn: H`
			fn cppBoundsOrder( shape: vec3f, splitAxis: u32, node: ${ct} ) -> bool {

				let toWorld = ${a};
				let absX = abs( toWorld[ 0 ].xyz );
				let absY = abs( toWorld[ 1 ].xyz );
				let absZ = abs( toWorld[ 2 ].xyz );

				// squared distance from the point to each child's bounds in world space
				let lMin = vec3f( node.leftBounds.min[ 0 ], node.leftBounds.min[ 1 ], node.leftBounds.min[ 2 ] );
				let lMax = vec3f( node.leftBounds.max[ 0 ], node.leftBounds.max[ 1 ], node.leftBounds.max[ 2 ] );
				let lHalf = ( lMax - lMin ) * 0.5;
				let lCenter = ( toWorld * vec4f( ( lMin + lMax ) * 0.5, 1.0 ) ).xyz;
				let lExtent = absX * lHalf.x + absY * lHalf.y + absZ * lHalf.z;
				let lDelta = shape - clamp( shape, lCenter - lExtent, lCenter + lExtent );

				let rMin = vec3f( node.rightBounds.min[ 0 ], node.rightBounds.min[ 1 ], node.rightBounds.min[ 2 ] );
				let rMax = vec3f( node.rightBounds.max[ 0 ], node.rightBounds.max[ 1 ], node.rightBounds.max[ 2 ] );
				let rHalf = ( rMax - rMin ) * 0.5;
				let rCenter = ( toWorld * vec4f( ( rMin + rMax ) * 0.5, 1.0 ) ).xyz;
				let rExtent = absX * rHalf.x + absY * rHalf.y + absZ * rHalf.z;
				let rDelta = shape - clamp( shape, rCenter - rExtent, rCenter + rExtent );

				// the nearer child is traversed first
				return dot( lDelta, lDelta ) <= dot( rDelta, rDelta );

			}
		`,
		intersectsBoundsFn: H`
			fn cppIntersectsBounds( shape: vec3f, bounds: ${F}, result: ptr<function, ${dt}> ) -> u32 {

				// return 1u;
				// we need to check this no matter what if the result has not been found yet
				if ( ! result.found ) {

					return 1u;

				}

				let toWorld = ${a};

				// transform to world space
				let bMin = vec3f( bounds.min[ 0 ], bounds.min[ 1 ], bounds.min[ 2 ] );
				let bMax = vec3f( bounds.max[ 0 ], bounds.max[ 1 ], bounds.max[ 2 ] );
				let center = ( bMin + bMax ) * 0.5;
				let halfExtent = ( bMax - bMin ) * 0.5;
				let worldCenter = ( toWorld * vec4f( center, 1.0 ) ).xyz;
				let worldHalfExtent =
					abs( toWorld[ 0 ].xyz ) * halfExtent.x +
				    abs( toWorld[ 1 ].xyz ) * halfExtent.y +
				    abs( toWorld[ 2 ].xyz ) * halfExtent.z;
				let worldMin = worldCenter - worldHalfExtent;
				let worldMax = worldCenter + worldHalfExtent;

				// intersect if the distance to the bounds is not bigger than the already found
				let d = shape - clamp( shape, worldMin, worldMax );
				return select( 0u, 1u, dot( d, d ) < result.distanceSq );

			}
		`,
		intersectRangeFn: H`
			fn cppIntersectsRange( shape: vec3f, offset: u32, count: u32, result: ptr<function, ${dt}> ) -> bool {

				var didHit = false;
				let toWorld = ${a};

				for ( var i = offset; i < offset + count; i ++ ) {

					// transform the triangle to world space
					let i0 = ${t}[ i * 3u + 0u ];
					let i1 = ${t}[ i * 3u + 1u ];
					let i2 = ${t}[ i * 3u + 2u ];
					let a = ( toWorld * vec4f( ${n}[ i0 ].position.xyz, 1.0 ) ).xyz;
					let b = ( toWorld * vec4f( ${n}[ i1 ].position.xyz, 1.0 ) ).xyz;
					let c = ( toWorld * vec4f( ${n}[ i2 ].position.xyz, 1.0 ) ).xyz;

					let barycoord = ${Ut}( shape, a, b, c );
					let closestPoint = barycoord.x * a + barycoord.y * b + barycoord.z * c;
					let delta = shape - closestPoint;
					let distSq = dot( delta, delta );

					// copy the content over
					if ( ! result.found || distSq < result.distanceSq ) {

						let normal = normalize( cross( a - b, b - c ) );

						result.closestPoint = closestPoint;
						result.barycoord = barycoord;
						result.distanceSq = distSq;
						result.faceNormal = normal;
						result.side = sign( dot( normal, delta ) );
						result.faceIndices = vec4u( i0, i1, i2, i );
						result.found = true;
						didHit = true;

					}

				}

				return didHit;

			}
		`,
		resetShapeFn: H`
				fn cppResetShape( objectIndex: u32 ) -> void {

					// node bounds are transformed by "toWorld" during the bounds tests. Only the
					// object-local BLAS bounds need the object's world matrix - the top-level bounds
					// are already in world space - so restore identity before top-level traversal resumes.
					${a} = mat4x4f(
						1.0, 0.0, 0.0, 0.0,
						0.0, 1.0, 0.0, 0.0,
						0.0, 0.0, 1.0, 0.0,
						0.0, 0.0, 0.0, 1.0
					);

				}
			`,
		transformShapeFn: H`
			fn cppTransformShape( shape: ptr<function, vec3f>, objectIndex: u32 ) -> void {

				${a} = ${i}[ objectIndex ].matrixWorld;

			}
		`,
		transformResultFn: H`
			fn cppTransformResult( result: ptr<function, ${dt}>, objectIndex: u32 ) -> void {

				result.objectIndex = objectIndex;

			}
		`
	});
}
// node_modules/three-mesh-bvh/src/webgpu/ClusteredBVH.js
var Zt = 24, Qt = (1 << Zt) - 1, $t = 7, en = 127, tn = /* @__PURE__ */ new N(), nn = /* @__PURE__ */ new ke(), rn = /* @__PURE__ */ new N(), an = class extends ve {
	constructor(e, t) {
		super(), t = {
			getBVH: (e, t) => {
				throw Error("ClusteredBVH: getBVH callback must be provided ");
			},
			shouldCluster: (e) => e.isSkinnedMesh || e.isInstancedMesh || e.isBatchedMesh,
			primitiveLimit: 64,
			matrixWorld: Array.isArray(e) ? new N() : e.matrixWorld,
			includeInstances: !0,
			_strictLeafSize: 1,
			...t
		};
		let n = Array.from(sn(e)), r = Math.ceil(Math.log2(n.length)), i = (1 << r) - 1;
		this.objects = n, this.getBVH = t.getBVH, this.shouldCluster = t.shouldCluster, this.includeInstances = t.includeInstances, this.primitiveLimit = t.primitiveLimit, this.matrixWorld = t.matrixWorld, this.bvhMap = /* @__PURE__ */ new WeakMap(), this.idBits = r, this.idMask = i, this.primitiveBufferStride = 2, this.init(t);
	}
	init(e) {
		let t = 0, { objects: n, bvhMap: r, matrixWorld: i } = this;
		tn.copy(i).invert(), n.forEach((e) => {
			let n = [];
			for (let r = 0, i = this._getInstanceCount(e); r < i; r++) {
				let i = this.getBVH(e, r);
				n.push(i), i && (t += this.shouldCluster(e) ? i._roots.length : this._countRelevantLeafNodes(i));
			}
			r.set(e, n);
		}), this.primitiveBuffer = new Uint32Array(t * 2), this._fillPrimitiveBuffer(this.primitiveBuffer), super.init(e);
	}
	getRootRanges() {
		return [{
			offset: 0,
			count: this.primitiveBuffer.length / this.primitiveBufferStride
		}];
	}
	refit(...e) {
		tn.copy(this.matrixWorld).invert(), super.refit(...e);
	}
	writePrimitiveBounds(e, t, n) {
		let { primitiveBuffer: r, bvhMap: i, objects: a } = this, o = r[2 * e + 0], s = r[2 * e + 1], c = a[this.getObjectId(o)], l = this.getInstanceId(o), u = i.get(c)[l], d = this.getBVHRootIndex(s), f = this.getBVHNodeIndex(s);
		c.isInstancedMesh || c.isBatchedMesh ? (c.getMatrixAt(l, rn), rn.premultiply(c.matrixWorld)) : rn.copy(c.matrixWorld), rn.premultiply(tn), me(f, new Float32Array(u._roots[d]), nn), nn.applyMatrix4(rn);
		let { min: p, max: m } = nn;
		t[n + 0] = p.x, t[n + 1] = p.y, t[n + 2] = p.z, t[n + 3] = m.x, t[n + 4] = m.y, t[n + 5] = m.z;
	}
	getInstanceId(e) {
		let { idMask: t, idBits: n } = this;
		return (e & ~t) >>> n;
	}
	getObjectId(e) {
		let { idMask: t } = this;
		return e & t;
	}
	getBVHRootIndex(e) {
		return e >>> Zt;
	}
	getBVHNodeIndex(e) {
		return (e & Qt) * 8;
	}
	_getInstanceCount(e) {
		let { includeInstances: t } = this;
		return e.isInstancedMesh && t ? e.count : e.isBatchedMesh && t ? e.instanceCount : 1;
	}
	_fillPrimitiveBuffer(e) {
		let { objects: t, bvhMap: n, idBits: r, primitiveLimit: i } = this, a = 0, o = (t, n, i, o) => {
			if (o > Qt) throw Error(`ClusteredBVH: cluster node index ${o} exceeds the ${Zt}-bit packing limit and cannot be represented.`);
			if (i > en) throw Error(`ClusteredBVH: bvh root index ${i} exceeds the ${$t}-bit packing limit and cannot be represented.`);
			e[2 * a + 0] = t << r | n, e[2 * a + 1] = i << Zt | o & Qt, a++;
		};
		t.forEach((e, t) => {
			n.get(e).forEach((n, r) => {
				if (n) {
					if (this.shouldCluster(e)) for (let e = 0, i = n._roots.length; e < i; e++) o(r, t, e, 0);
					else on(n, i, (e, n) => {
						o(r, t, e, n / 8);
					});
				}
			});
		});
	}
	_countRelevantLeafNodes(e) {
		let { primitiveLimit: t } = this, n = 0;
		return on(e, t, (e, r, i, a) => {
			n++, a && i >= t && console.warn(`ClusteredBVH: a leaf node with ${i} primitives exceeds the cluster primitive limit of ${t} and cannot be subdivided further.`);
		}), n;
	}
};
function on(e, t, n) {
	let r = e._roots.length;
	for (let i = 0; i < r; i++) ye.setBVH(e, i), ye.traverseBuffer((e, r, a) => {
		let o = ye.getRangeStart(a), s = ye.getRangeEnd(a) - o;
		return s < t || r ? (n(i, a, s, r), !0) : !1;
	});
	ye.reset();
}
function sn(e, t = /* @__PURE__ */ new Set()) {
	return Array.isArray(e) ? e.forEach((e) => sn(e, t)) : e.traverse((e) => {
		e.isMesh && t.add(e);
	}), t;
}
// node_modules/three-mesh-bvh/src/webgpu/BVHComputeData.js
var cn = /* @__PURE__ */ new N(), ln = /* @__PURE__ */ new N(), un = {
	start: 0,
	count: 0,
	vertexStart: 0,
	vertexCount: 0
};
function dn(e) {
	let t = e;
	for (; t;) {
		if (t.visible === !1) return !1;
		t = t.parent;
	}
	return !0;
}
function fn(e) {
	return e._roots.reduce((e, t) => e + t.byteLength / 32, 0);
}
function pn(e, t) {
	return `${e}_${t}`;
}
var mn = class {
	constructor(e, t = {}) {
		let { attributes: n = { position: "vec4f" }, autogenerateBvh: r = !0 } = t;
		Array.isArray(e) || (e = [e]), e = e.map((e) => {
			if (e.isObject3D) return e;
			if (e.isBufferGeometry) return new Ve(e);
			if (e instanceof ge) {
				let t = new Ve();
				return t.geometry.boundsTree = e, t;
			}
		}), this._bvhCache = /* @__PURE__ */ new Map(), this.autogenerateBvh = r, this.attributes = n, this.objects = e, this.bvh = null, this.storage = new hn(), this.structs = new hn({ transform: lt }), this.fns = new hn({
			raycastFirstHit: Jt(this),
			raycastAnyHit: qt(this),
			closestPointToPoint: Xt(this),
			sampleTrianglePoint: null
		}, R);
	}
	getRootObject() {
		let { objects: e } = this;
		if (e.isObject3D) return e;
		Array.isArray(e) || (e = [e]), e = e.map((e) => {
			if (e.isObject3D) return e;
			if (e.isBufferGeometry) return new Ve(e);
			if (e instanceof ge) {
				let t = new Ve();
				return t.geometry.boundsTree = e, t;
			}
		});
		let t = new Se();
		return t.children = e, t;
	}
	getShapecastFn(e) {
		return Ht(this, e);
	}
	update() {
		let e = this.getRootObject(), t = 0;
		e.traverse((e) => {
			e.isMesh && t++;
		}), this.bvh = new an(e, {
			strategy: 2,
			getBVH: (e, t) => this._getBVHSync(e, t, un),
			primitiveLimit: t < 3 ? Infinity : 64
		}), this.dispose();
		let { attributes: n, structs: r, bvh: a } = this, o = [], s = [], c = /* @__PURE__ */ new Map(), l = fn(a) * 64, u = 0, d = 0, f = [], p = 0, m = this._getTransformMap(a), { primitiveBuffer: h, primitiveBufferStride: g } = a;
		for (let e = 0, t = h.length; e < t; e += g) {
			let t = h[e], n = h[e + 1], r = a.objects[a.getObjectId(t)], i = a.getInstanceId(t), g = {
				start: 0,
				count: 0,
				vertexStart: 0,
				vertexCount: 0
			}, _ = this._getBVHSync(r, i, g);
			if (!_) throw Error("BVHComputeData: BVH not found.");
			let v = o.find((e) => e.bvh === _);
			v || (v = {
				index: o.length,
				bvh: _,
				range: g,
				geometryOffset: 0
			}, u += v.range.count, d += v.range.vertexCount, o.push(v));
			let y = a.getBVHRootIndex(n), b = a.getBVHNodeIndex(n) / 8, x = `${v.index}_${y}_${b}`, S = c.get(x);
			if (S === void 0) {
				let e = Tt(_._roots[y], b);
				S = {
					data: v,
					root: y,
					node: b,
					size: e,
					base: 0
				}, c.set(x, S), s.push(S), l += e * 64, p = Math.max(p, Dt(_._roots[y], b));
			}
			f.push({
				transformSlot: m.get(pn(t, y)).slot,
				subtree: S
			});
		}
		if (Dt(a._roots[0]) + p - 1 > Vt.value) throw Error("BVHComputeData: BVH depth overruns the compute stack depth.");
		let _ = Math.max(m.size, 2);
		u = Math.max(u, 2), d = Math.max(d, 2);
		let v = new C(n, "bvh_GeometryStruct"), y = 0, b = 0, x = new Uint32Array(u), S = /* @__PURE__ */ new ArrayBuffer(d * v.getLength() * 4), ee = new ArrayBuffer(l);
		o.forEach((e) => {
			e.geometryOffset = b / 3, e.bvh.indirect || (e.geometryOffset -= e.range.start / 3), kt(e.bvh, e.range, y, b, x), At(e.bvh, e.range, y, S, v, this), b += e.range.count, y += e.range.vertexCount;
		});
		let w = fn(a);
		s.forEach((e) => {
			e.base = w, Ot(e.data.bvh._roots[e.root], e.node, e.size, e.data.geometryOffset, w, ee), w += e.size;
		}), f.forEach((e) => e.nodeOffset = e.subtree.base), wt(a, f, 0, ee);
		let T = /* @__PURE__ */ new ArrayBuffer(r.transform.getLength() * _ * 4), E = i(new D(new Uint32Array(ee), 1), ct).toReadOnly().setName("bvh_nodes"), te = new D(new Uint32Array(T), 1), ne = i(te, r.transform).toReadOnly().setName("bvh_transforms"), re = i(new D(x, 1), "uint").toReadOnly().setName("bvh_index"), ie = i(new D(new Uint32Array(S), v.getLength()), v).toReadOnly().setName("bvh_attributes");
		this.storage.transforms = ne, this.storage.nodes = E, this.storage.index = re, this.storage.attributes = ie, this.structs.attributes = v, ln.copy(a.matrixWorld).invert(), m.forEach((e) => {
			this.writeTransformData(e, ln, e.slot, T);
		}), this.fns.sampleTrianglePoint = Yt(this), this._bvhCache.clear();
	}
	async updateAsync() {
		let e = [];
		this.getRootObject().traverse((t) => {
			if (!t.isMesh) return;
			let n = 1;
			t.isInstancedMesh ? n = t.count : t.isBatchedMesh && (n = t.instanceCount);
			for (let r = 0; r < n; r++) e.push(this.getBVH(t, r, un));
		}), await Promise.all(e), this.update();
	}
	updateTransforms() {
		let { bvh: e, storage: t } = this;
		e.refit();
		let n = t.nodes.proxyNode.value;
		wt(e, null, 0, n.array.buffer), n.needsUpdate = !0;
		let r = t.transforms.proxyNode.value, i = r.array.buffer;
		ln.copy(e.matrixWorld).invert(), this._getTransformMap(e).forEach((e) => {
			this.writeTransformData(e, ln, e.slot, i);
		}), r.needsUpdate = !0;
	}
	writeTransformData(e, t, n, r) {
		let { structs: i } = this, a = new Float32Array(r), o = new Uint32Array(r), { object: s, instanceId: c } = e;
		s.isInstancedMesh || s.isBatchedMesh ? (s.getMatrixAt(c, cn), cn.premultiply(s.matrixWorld)) : cn.copy(s.matrixWorld), cn.premultiply(t), cn.toArray(a, n * i.transform.getLength()), cn.invert(), cn.toArray(a, n * i.transform.getLength() + 16);
		let l = dn(s);
		s.isBatchedMesh && (l &&= s.getVisibleAt(c)), o[n * i.transform.getLength() + 32] = +!!l;
	}
	getBVH(e, t, n) {
		let { autogenerateBvh: r, _bvhCache: i } = this, a = null;
		if (e.boundsTree || e.isSkinnedMesh) {
			let t = e.geometry;
			if (n.count = t.index ? t.index.count : t.attributes.position.count, n.vertexCount = t.attributes.position.count, a = e.boundsTree || null, a === null && r) {
				let t = e.uuid;
				a = i.get(t) || new fe(e), i.set(t, a);
			}
		} else if (e.isBatchedMesh) {
			let o = e.getGeometryIdAt(t), s = e.getGeometryRangeAt(o);
			if (Object.assign(n, s), a = e.boundsTrees[o] || null, a === null && r) {
				let t = `batched_${e.geometry.uuid}_${s.start}_${s.count}`;
				a = i.get(t) || new be(e.geometry, { range: { ...n } }), i.set(t, a);
			}
		} else {
			let t = e.geometry;
			if (n.count = t.index ? t.index.count : t.attributes.position.count, n.vertexCount = t.attributes.position.count, a = e.geometry.boundsTree || null, a === null && r) {
				let e = t.uuid;
				a = i.get(e) || new be(t), i.set(e, a);
			}
		}
		return a;
	}
	getDefaultAttributeValue(e, t) {
		switch (e) {
			case "position":
			case "color":
				t.set(1, 1, 1, 1);
				break;
			default: t.set(0, 0, 0, 0);
		}
		return t;
	}
	dispose() {
		let { storage: e } = this;
		for (let t in e) e[t].value?.dispose();
	}
	_getBVHSync(e, t, n) {
		let r = this.getBVH(e, t, n);
		if (r instanceof Promise) throw Error("BVHComputeData: \"getBVH\" returned a promise. Use \"updateAsync\" instead.");
		return r;
	}
	_getTransformMap(e) {
		let { primitiveBuffer: t, primitiveBufferStride: n } = e, r = /* @__PURE__ */ new Map();
		for (let i = 0, a = t.length; i < a; i += n) {
			let n = t[i], a = e.getBVHRootIndex(t[i + 1]), o = pn(n, a);
			if (r.has(o)) continue;
			let s = r.size, c = e.objects[e.getObjectId(n)], l = e.getInstanceId(n);
			r.set(o, {
				object: c,
				instanceId: l,
				compositeId: n,
				root: a,
				slot: s
			});
		}
		return r;
	}
}, hn = class {
	constructor(e = {}, t = L) {
		let n = {};
		return new Proxy({ ...e }, {
			get(e, r) {
				return n[r] || (n[r] = t(r, e)), n[r];
			},
			set(e, t, n) {
				return e[t] = n, !0;
			}
		});
	}
}, gn = new De(-1, 1, 1, -1, 0, 1), _n = new class extends Re {
	constructor() {
		super(), this.setAttribute("position", new qe([
			-1,
			3,
			0,
			-1,
			-1,
			0,
			3,
			-1,
			0
		], 3)), this.setAttribute("uv", new qe([
			0,
			2,
			0,
			0,
			2,
			0
		], 2));
	}
}(), vn = class {
	constructor(e) {
		this._mesh = new Ve(_n, e);
	}
	dispose() {
		this._mesh.geometry.dispose();
	}
	render(e) {
		e.render(this._mesh, gn);
	}
	get material() {
		return this._mesh.material;
	}
	set material(e) {
		this._mesh.material = e;
	}
}, yn = g("\n	fn sampleTexel( tex: texture_2d<f32>, coord: vec2f ) -> vec4f {\n\n		// Manual bilinear filtering using textureLoad to support filterable float32 textures\n		// on all devices\n		let size = vec2f( textureDimensions( tex, 0 ) );\n\n		// the path tracer stores its color rows top down\n		let pxCoord = vec2f( coord.x, 1.0 - coord.y ) * size - 0.5;\n		let px = vec2i( floor( pxCoord ) );\n		let fr = fract( pxCoord );\n\n		// get the four sibling samples\n		let s00 = textureLoad( tex, clamp( px,                 vec2i( 0 ), vec2i( size ) - 1 ), 0 );\n		let s10 = textureLoad( tex, clamp( px + vec2i( 1, 0 ), vec2i( 0 ), vec2i( size ) - 1 ), 0 );\n		let s01 = textureLoad( tex, clamp( px + vec2i( 0, 1 ), vec2i( 0 ), vec2i( size ) - 1 ), 0 );\n		let s11 = textureLoad( tex, clamp( px + vec2i( 1, 1 ), vec2i( 0 ), vec2i( size ) - 1 ), 0 );\n\n		// interpolate on the x axis\n		let y0 = mix( s00, s10, fr.x );\n		let y1 = mix( s01, s11, fr.x );\n\n		// then y\n		return mix( y0, y1, fr.y );\n\n	}\n"), bn = class extends ne {
	get texture() {
		return this._texNode.value;
	}
	set texture(e) {
		this._texNode.value = e;
	}
	get fromTexture() {
		return this._fromTexNode.value;
	}
	set fromTexture(e) {
		this._fromTexNode.value = e;
	}
	get toneMapping() {
		return this._toneMapping.toneMapping;
	}
	set toneMapping(e) {
		this._toneMapping.setToneMapping(e);
	}
	get transition() {
		return this._transitionUniform.value;
	}
	set transition(e) {
		this._transitionUniform.value = e;
	}
	get exposure() {
		return this._toneMapping.exposureNode.value;
	}
	set exposure(e) {
		this._toneMapping.exposureNode.value = e;
	}
	constructor(e) {
		super();
		let t = E(new v());
		this._texNode = t;
		let n = E(new v());
		this._fromTexNode = n;
		let r = c(s()), i = f(1);
		this._transitionUniform = i;
		let a = H`
			fn fade( uv: vec2f ) -> vec4f {

				if ( ${i} <= 0.0 ) {

					return ${yn}( ${n}, uv );

				} else if ( ${i} >= 1.0 ) {

					return ${yn}( ${t}, uv );

				} else {

					let col0 = ${yn}( ${n}, uv );
					let col1 = ${yn}( ${t}, uv );
					return mix( col0, col1, ${i} );

				}

			}
		`, o = l(0, 1, a(r));
		this._toneMapping = o, this.transparent = !0, this.colorNode = de(o.rgb, o.a), this.setValues(e);
	}
}, xn = H`
	fn debugHeatColor( t: f32 ) -> vec3f {

		let r = clamp( 1.5 - abs( 4.0 * t - 3.0 ), 0.0, 1.0 );
		let g = clamp( 1.5 - abs( 4.0 * t - 2.0 ), 0.0, 1.0 );
		let b = clamp( 1.5 - abs( 4.0 * t - 1.0 ), 0.0, 1.0 );
		return vec3f( r, g, b );

	}
`, Sn = new C({
	tlasCount: "uint",
	blasCount: "uint",
	didHit: "bool",
	dist: "float"
}, "DebugBoundsResult");
function Cn(e) {
	let { transforms: t, index: n, attributes: r, materials: i } = e.storage, a = f(new N()), o = f(new N()), s = f(1), c = f(1), l = f(0), d = f(64), p = u(0).toVar("bvh_debugBoundsLevel"), m = O(1).toVar("bvh_debugRayScalar"), h = O(0).toVar("bvh_debugMaterialSide"), g = H`
		fn debugGetBoundsOrder( ray: ${I}, splitAxis: u32, node: ${ct} ) -> bool {

			return ray.direction[ splitAxis ] >= 0.0;

		}
	`, _ = H`
		fn debugIntersectsBounds( ray: ${I}, bounds: ${F}, result: ptr<function, ${Sn}> ) -> u32 {

			let boundsMin = vec3( bounds.min[ 0 ], bounds.min[ 1 ], bounds.min[ 2 ] );
			let boundsMax = vec3( bounds.max[ 0 ], bounds.max[ 1 ], bounds.max[ 2 ] );

			let invDir = 1.0 / ray.direction;
			let tMinPlane = ( boundsMin - ray.origin ) * invDir;
			let tMaxPlane = ( boundsMax - ray.origin ) * invDir;

			let tMinHit = min( tMinPlane, tMaxPlane );
			let tMaxHit = max( tMinPlane, tMaxPlane );

			let t0 = max( max( tMinHit.x, tMinHit.y ), tMinHit.z );
			let t1 = min( min( tMaxHit.x, tMaxHit.y ), tMaxHit.z );

			let dist = max( t0, 0.0 );
			if ( t1 < dist ) {

				return 0u;

			} else if ( result.didHit && dist * ${m} >= result.dist ) {

				return 0u;

			}

			if ( ${p} == 1u ) {

				result.blasCount = result.blasCount + 1u;

			} else {

				result.tlasCount = result.tlasCount + 1u;

			}

			return 1u;

		}
	`, v = H`
		fn debugIntersectRange( ray: ${I}, offset: u32, count: u32, result: ptr<function, ${Sn}> ) -> bool {

			var didHit = false;
			if ( ${l} > 0.5 ) {

				for ( var ti = offset; ti < offset + count; ti = ti + 1u ) {

					let i0 = ${n}[ ti * 3u ];
					let i1 = ${n}[ ti * 3u + 1u ];
					let i2 = ${n}[ ti * 3u + 2u ];

					let a = ${r}[ i0 ].position.xyz;
					let b = ${r}[ i1 ].position.xyz;
					let c = ${r}[ i2 ].position.xyz;

					var triResult = ${ht}( ray, a, b, c );
					triResult.dist *= ${m};
					if ( triResult.didHit && ( ! result.didHit || triResult.dist < result.dist ) ) {

						// cull faces that don't match the material side
						if ( ${h} != 0.0 && triResult.side != ${h} ) {

							continue;

						}

						result.didHit = true;
						result.dist = triResult.dist;
						didHit = true;

					}

				}

			}

			return didHit;

		}
	`, y = H`
		fn debugTransformRay( ray: ptr<function, ${I}>, objectIndex: u32 ) -> void {

			let object = ${t}[ objectIndex ];
			let toLocal = object.inverseMatrixWorld;
			ray.origin = ( toLocal * vec4f( ray.origin, 1.0 ) ).xyz;
			ray.direction = ( toLocal * vec4f( ray.direction, 0.0 ) ).xyz;

			let len = length( ray.direction );
			ray.direction = ray.direction / len;
			${m} = 1.0 / len;

			${h} = ${i}[ object.materialIndex ].side;
			${p} = 1u;

		}
	`, b = H`
		fn debugResetLevel( objectIndex: u32 ) -> void {

			${m} = 1.0;
			${p} = 0u;

		}
	`, x = H`
		fn debugBounds( vUv: vec2f ) -> vec4f {

			let ndc = vUv * 2.0 - vec2f( 1.0 );
			var ray = ${Gt}( ndc, ${a} * ${o} );
			ray.direction = normalize( ray.direction );

			// count the boxes the ray crosses, pruning those behind the nearest hit surface
			var result: ${Sn};
			${e.getShapecastFn({
		name: "debugBoundsCount",
		shapeStruct: I,
		resultStruct: Sn,
		boundsOrderFn: g,
		intersectsBoundsFn: _,
		intersectRangeFn: v,
		transformShapeFn: y,
		resetShapeFn: b
	})}( ray, &result );

			let tlas = select( 0u, result.tlasCount, ${s} > 0.5 );
			let blas = select( 0u, result.blasCount, ${c} > 0.5 );
			let count = tlas + blas;

			let t = clamp( f32( count ) / max( ${d}, 1.0 ), 0.0, 1.0 );

			return vec4f( ${xn}( t ), 1.0 );

		}
	`;
	return x.uniforms = {
		cameraToModelMatrix: a,
		inverseProjectionMatrix: o,
		displayTLAS: s,
		displayBLAS: c,
		stopAtSurface: l,
		saturationCount: d
	}, x;
}
// node_modules/three-gpu-pathtracer/src/webgpu/compute/ComputeKernel.js
var U = class {
	get computeNode() {
		return this.kernel.computeNode;
	}
	get workgroupSize() {
		return this.kernel.workgroupSize;
	}
	set needsUpdate(e) {
		this.setWorkgroupSize(...this.workgroupSize);
	}
	constructor(e, t = {}) {
		let { workgroupSize: n = [64], context: r = {} } = t;
		this._fn = e, this.kernel = null, this.context = r, this.setWorkgroupSize(...n);
	}
	defineUniformAccessors(e) {
		for (let t in e) {
			if (t in this) throw Error(`ComputeNode: Uniform name ${t} is already defined.`);
			let n = e[t];
			n.isStorageBufferNode && !n.name && n.setName(`kernel_${t}`), "value" in n && Object.defineProperty(this, t, {
				get() {
					return e[t].value;
				},
				set(n) {
					e[t].value = n;
				}
			});
		}
	}
	setWorkgroupSize(e = 64, t = 1, n = 1) {
		let r = this._fn.context(this.context);
		return r.parameters = this._fn.parameters, this.kernel?.dispose(), this.kernel = r.computeKernel([
			e,
			t,
			n
		]), this;
	}
	dispose() {
		this.kernel?.dispose(), this.kernel = null;
	}
	getDispatchSize(e = 1, t = 1, n = 1, r = []) {
		let [i, a, o] = this.workgroupSize;
		return r.length = 3, r[0] = Math.ceil(e / i), r[1] = Math.ceil(t / a), r[2] = Math.ceil(n / o), r;
	}
}, W = n("\n\n	const PI: f32 = 3.141592653589793;\n	const EPSILON: f32 = 1e-5;\n	const MIN_ROUGHNESS: f32 = 1e-3;\n	const MIN_INCIDENT_COS: f32 = 1e-3;\n\n"), wn = new C({
	color: "vec3f",
	isTransmissive: "bool",
	direction: "vec3f",
	pdf: "float"
}, "ScatterRecord"), Tn = new C({
	reflectance: "vec3f",
	transmittance: "vec3f",
	reflectProbability: "float"
}, "TransmissionFresnel"), En = new C({
	color: "vec3",
	map: "int",
	metalness: "float",
	metalnessMap: "int",
	roughness: "float",
	roughnessMap: "int",
	ior: "float",
	transmission: "float",
	transmissionMap: "int",
	emissiveIntensity: "float",
	emissive: "vec3",
	emissiveMap: "int",
	normalMap: "int",
	normalScale: "vec2",
	clearcoat: "float",
	clearcoatMap: "int",
	clearcoatNormalMap: "int",
	clearcoatNormalScale: "vec2",
	clearcoatRoughness: "float",
	clearcoatRoughnessMap: "int",
	iridescenceMap: "int",
	iridescenceThicknessMap: "int",
	iridescence: "float",
	iridescenceIor: "float",
	iridescenceThicknessMinimum: "float",
	iridescenceThicknessMaximum: "float",
	diffuseRoughness: "float",
	dispersion: "float",
	specularColor: "vec3",
	specularColorMap: "int",
	specularIntensity: "float",
	specularIntensityMap: "int",
	thinWall: "int",
	attenuationColor: "vec3",
	attenuationDistance: "float",
	alphaMap: "int",
	castShadow: "int",
	opacity: "float",
	alphaTest: "float",
	side: "float",
	matte: "int",
	sheen: "float",
	sheenColor: "vec3",
	sheenColorMap: "int",
	sheenRoughness: "float",
	sheenRoughnessMap: "int",
	vertexColors: "int",
	flatShading: "int",
	transparent: "int",
	fogVolume: "int",
	anisotropy: "float",
	anisotropyRotation: "float",
	anisotropyMap: "int",
	mapTransform: "mat3",
	metalnessMapTransform: "mat3",
	roughnessMapTransform: "mat3",
	transmissionMapTransform: "mat3",
	emissiveMapTransform: "mat3",
	normalMapTransform: "mat3",
	clearcoatMapTransform: "mat3",
	clearcoatNormalMapTransform: "mat3",
	clearcoatRoughnessMapTransform: "mat3",
	sheenColorMapTransform: "mat3",
	sheenRoughnessMapTransform: "mat3",
	iridescenceMapTransform: "mat3",
	iridescenceThicknessMapTransform: "mat3",
	specularColorMapTransform: "mat3",
	specularIntensityMapTransform: "mat3",
	alphaMapTransform: "mat3",
	anisotropyMapTransform: "mat3",
	multiscatterColor: "vec3",
	scatterStrength: "float",
	scatterAnisotropy: "float"
}, "Material"), G = new C({
	volumeParticle: "bool",
	faceNormal: "vec3f",
	frontFace: "bool",
	normal: "vec3f",
	normalBasis: "mat3x3f",
	normalInvBasis: "mat3x3f",
	eta: "f32",
	f0: "f32",
	roughness: "f32",
	diffuseRoughness: "f32",
	metalness: "f32",
	anisotropy: "f32",
	color: "vec3f",
	emission: "vec3f",
	opacity: "f32",
	ior: "f32",
	transmission: "f32",
	thinWall: "bool",
	attenuationColor: "vec3f",
	attenuationDistance: " f32",
	clearcoatNormal: "vec3f",
	clearcoatBasis: "mat3x3f",
	clearcoatInvBasis: "mat3x3f",
	clearcoat: "f32",
	clearcoatRoughness: "f32",
	sheen: "f32",
	sheenColor: "vec3f",
	sheenRoughness: "f32",
	iridescence: "f32",
	iridescenceIor: "f32",
	iridescenceThickness: "f32",
	specularColor: "vec3f",
	specularIntensity: "f32"
}, "SurfaceRecord");
new C({
	rotation: "mat3x3f",
	intensity: "float",
	blur: "float",
	totalSum: "float"
}, "EnvironmentInfo");
var Dn = new C({
	color: "vec3f",
	direction: "vec3f",
	pdf: "float"
}, "EnvironmentSample"), On = new C({
	position: "vec3f",
	lightType: "int",
	color: "vec3f",
	intensity: "float",
	u: "vec3f",
	visibleToCameraRays: "int",
	v: "vec3f",
	area: "float",
	radius: "float",
	decay: "float",
	distance: "float",
	coneCos: "float",
	penumbraCos: "float",
	iesProfile: "int"
}, "Light"), kn = new C({
	dist: "float",
	direction: "vec3f",
	pdf: "float",
	emission: "vec3f",
	lightType: "int"
}, "LightRecord"), An = new C({
	diffuse: "float",
	specular: "float",
	transmission: "float",
	clearcoat: "float"
}, "LobeWeights"), jn = new C({
	V: "vec3f",
	L: "vec3f",
	H: "vec3f",
	VdotH: "float"
}, "BxDFContext"), Mn = H`

	fn isAuxSurface( surface: ${G}, scatterRec: ${wn} ) -> bool {

		let isMirror = surface.roughness <= ${.02} && surface.metalness >= ${.98};
		return ! scatterRec.isTransmissive && ! isMirror;

	}

`, Nn = H`

	fn unpackAuxAlbedo( packed: vec3u ) -> vec3f {

		return vec3f( unpack2x16float( packed.x ), unpack2x16float( packed.y ).x );

	}

`, Pn = H`

	fn unpackAuxNormal( packed: vec3u ) -> vec3f {

		return vec3f( unpack2x16float( packed.z ), unpack2x16float( packed.y ).y );

	}

`, Fn = H`

	fn blendAux( packed: vec3u, albedo: vec3f, normal: vec3f, weight: f32 ) -> vec3u {

		let meanAlbedo = mix( ${Nn}( packed ), albedo, weight );
		let meanNormal = mix( ${Pn}( packed ), normal * 0.5 + 0.5, weight );
		return vec3u(
			pack2x16float( meanAlbedo.rg ),
			pack2x16float( vec2f( meanAlbedo.b, meanNormal.z ) ),
			pack2x16float( meanNormal.xy ),
		);

	}

`;
// node_modules/three-gpu-pathtracer/src/webgpu/compute/targets.js
function In(e = "") {
	let t = new v(1, 1);
	return t.format = P, t.type = et, t.colorSpace = Ze.workingColorSpace, t.name = e, t.generateMipmaps = !1, t;
}
function Ln(e = "") {
	let t = new v(1, 1);
	return t.format = nt, t.type = Ce, t.name = e, t.generateMipmaps = !1, t;
}
function Rn(e = "") {
	let t = new w(1, 1, 3);
	return t.format = nt, t.type = Ce, t.name = e, t.generateMipmaps = !1, t;
}
function zn(e = "") {
	let t = new v(1, 1);
	return t.format = P, t.type = Pe, t.name = e, t.generateMipmaps = !1, t;
}
// node_modules/three-gpu-pathtracer/src/webgpu/nodes/rand/sobol.wgsl.js
var Bn = /* @__PURE__ */ e({
	rand1: () => $n,
	rand2: () => er,
	rand3: () => tr,
	rand4: () => nr,
	rngInit: () => rr,
	rngNextBounce: () => ir
}), Vn = u(65536), Hn = O(1 / 16777216), Un = n("\n\n	const SOBOL_DIRECTIONS_1 = array<u32, 32>(\n		0x80000000u, 0xc0000000u, 0xa0000000u, 0xf0000000u,\n		0x88000000u, 0xcc000000u, 0xaa000000u, 0xff000000u,\n		0x80800000u, 0xc0c00000u, 0xa0a00000u, 0xf0f00000u,\n		0x88880000u, 0xcccc0000u, 0xaaaa0000u, 0xffff0000u,\n		0x80008000u, 0xc000c000u, 0xa000a000u, 0xf000f000u,\n		0x88008800u, 0xcc00cc00u, 0xaa00aa00u, 0xff00ff00u,\n		0x80808080u, 0xc0c0c0c0u, 0xa0a0a0a0u, 0xf0f0f0f0u,\n		0x88888888u, 0xccccccccu, 0xaaaaaaaau, 0xffffffffu\n	);\n\n	const SOBOL_DIRECTIONS_2 = array<u32, 32>(\n		0x80000000u, 0xc0000000u, 0x60000000u, 0x90000000u,\n		0xe8000000u, 0x5c000000u, 0x8e000000u, 0xc5000000u,\n		0x68800000u, 0x9cc00000u, 0xee600000u, 0x55900000u,\n		0x80680000u, 0xc09c0000u, 0x60ee0000u, 0x90550000u,\n		0xe8808000u, 0x5cc0c000u, 0x8e606000u, 0xc5909000u,\n		0x6868e800u, 0x9c9c5c00u, 0xeeee8e00u, 0x5555c500u,\n		0x8000e880u, 0xc0005cc0u, 0x60008e60u, 0x9000c590u,\n		0xe8006868u, 0x5c009c9cu, 0x8e00eeeeu, 0xc5005555u\n	);\n\n	const SOBOL_DIRECTIONS_3 = array<u32, 32>(\n		0x80000000u, 0xc0000000u, 0x20000000u, 0x50000000u,\n		0xf8000000u, 0x74000000u, 0xa2000000u, 0x93000000u,\n		0xd8800000u, 0x25400000u, 0x59e00000u, 0xe6d00000u,\n		0x78080000u, 0xb40c0000u, 0x82020000u, 0xc3050000u,\n		0x208f8000u, 0x51474000u, 0xfbea2000u, 0x75d93000u,\n		0xa0858800u, 0x914e5400u, 0xdbe79e00u, 0x25db6d00u,\n		0x58800080u, 0xe54000c0u, 0x79e00020u, 0xb6d00050u,\n		0x800800f8u, 0xc00c0074u, 0x200200a2u, 0x50050093u\n	);\n\n	const SOBOL_DIRECTIONS_4 = array<u32, 32>(\n		0x80000000u, 0x40000000u, 0x20000000u, 0xb0000000u,\n		0xf8000000u, 0xdc000000u, 0x7a000000u, 0x9d000000u,\n		0x5a800000u, 0x2fc00000u, 0xa1600000u, 0xf0b00000u,\n		0xda880000u, 0x6fc40000u, 0x81620000u, 0x40bb0000u,\n		0x22878000u, 0xb3c9c000u, 0xfb65a000u, 0xddb2d000u,\n		0x78022800u, 0x9c0b3c00u, 0x5a0fb600u, 0x2d0ddb00u,\n		0xa2878080u, 0xf3c9c040u, 0xdb65a020u, 0x6db2d0b0u,\n		0x800228f8u, 0x400b3cdcu, 0x200fb67au, 0xb00ddb9du\n	);\n\n"), Wn = u(0).toVar("sobolPixelIndex"), Gn = u(0).toVar("sobolPathIndex"), Kn = u(0).toVar("sobolBounceIndex"), qn = g("\n	fn getMaskedSobol( index: u32, directions: array<u32, 32> ) -> u32 {\n\n		var X = 0u;\n		for ( var bit = 0u; bit < 32u; bit ++ ) {\n\n			let mask = ( index >> bit ) & 1u;\n			X ^= mask * directions[ bit ];\n\n		}\n		return X;\n\n	}\n"), Jn = (e = 1) => {
	if (e <= 0) return;
	let t = e > 1 ? `vec${e}u` : "u32", n = g(`
		fn sobolReverseBits_${t}( in: ${t} ) -> ${t} {

			var x = in;
			x = ( ( ( x & ${t}( 0xaaaaaaaau ) ) >> ${t}( 1 ) ) | ( ( x & ${t}( 0x55555555u ) ) << ${t}( 1 ) ) );
			x = ( ( ( x & ${t}( 0xccccccccu ) ) >> ${t}( 2 ) ) | ( ( x & ${t}( 0x33333333u ) ) << ${t}( 2 ) ) );
			x = ( ( ( x & ${t}( 0xf0f0f0f0u ) ) >> ${t}( 4 ) ) | ( ( x & ${t}( 0x0f0f0f0fu ) ) << ${t}( 4 ) ) );
			x = ( ( ( x & ${t}( 0xff00ff00u ) ) >> ${t}( 8 ) ) | ( ( x & ${t}( 0x00ff00ffu ) ) << ${t}( 8 ) ) );
			return ( ( x >> ${t}( 16 ) ) | ( x << ${t}( 16 ) ) );

		}
	`), r = g(`
		fn sobolHashCombine_${t}( seed: u32, v: ${t} ) -> ${t} {

			return ${t}( seed ) ^ ( v + ${t}( ( seed << 6 ) + ( seed >> 2 ) ) );

		}
	`), i = g(`
		fn sobolLaineKarrasPermutation_${t}( in: ${t}, seed: ${t} ) -> ${t} {

			var x = in;
			x += seed;
			x ^= x * 0x6c50b47cu;
			x ^= x * 0xb82f1e52u;
			x ^= x * 0xc7afe638u;
			x ^= x * 0x8d22f6e6u;
			return x;

		}
	`);
	return {
		reverseBits: n,
		hashCombine: r,
		lkPermutation: i,
		scramble: H`
		fn nestedUniformScrambleBase2_${t}( x: ${t}, seed: ${t} ) -> ${t} {

			var res = ${i}( x, seed );
			res = ${n}( res );
			return res;

		}
	`
	};
}, K = Array.from({ length: 5 }, (e, t) => Jn(t)), Yn = H`
  	${[Un]}
	fn generateSobolPoint( id: u32 ) -> vec4f {

		var index = id;
		if ( index >= ${Vn} ) {

			index = index % ${Vn};
			// return vec4( 0.0 );

		}

		// NOTE: this sobol "direction" is also available but we can't write out 5 components
		// uint x = index & 0x00ffffffu;
		let x = ${K[1].reverseBits}( ${qn}( index, SOBOL_DIRECTIONS_1 ) ) & 0x00ffffffu;
		let y = ${K[1].reverseBits}( ${qn}( index, SOBOL_DIRECTIONS_2 ) ) & 0x00ffffffu;
		let z = ${K[1].reverseBits}( ${qn}( index, SOBOL_DIRECTIONS_3 ) ) & 0x00ffffffu;
		let w = ${K[1].reverseBits}( ${qn}( index, SOBOL_DIRECTIONS_4 ) ) & 0x00ffffffu;

		return vec4( f32( x ), f32( y ), f32( z ), f32( w ) ) * ${Hn};

	}
`, Xn = g("\n	fn sobolHash( in: u32 ) -> u32 {\n\n		var x = in;\n		// finalizer from murmurhash3\n		x ^= x >> 16;\n		x *= 0x85ebca6bu;\n		x ^= x >> 13;\n		x *= 0xc2b2ae35u;\n		x ^= x >> 16;\n		return x;\n\n	}\n"), Zn = H`
	fn sobolGetSeed( effect: u32 ) -> u32 {

		return ${Xn}(
			${K[1].hashCombine}(
				${K[1].hashCombine}(
					${Xn}( ${Kn} ),
					${Wn}
				),
				effect
			)
		);

	}
`, Qn = (e = 1, t = Yn) => {
	if (e <= 0) return;
	let n = e > 1 ? `vec${e}u` : "u32", r = e > 1 ? `vec${e}f` : "f32", i = ".r", a = "1u";
	return e === 2 ? (i = ".rg", a = "vec2( 1u, 2u )") : e === 3 ? (i = ".rgb", a = "vec3( 1u, 2u, 3u )") : e === 4 && (i = "", a = "vec4( 1u, 2u, 3u, 4u )"), H`
		fn sobol${e}( effect: u32 ) -> ${r} {

			let seed = ${Zn}( effect );
			let index = ${Gn};

			let shuffle_seed = ${K[1].hashCombine}( seed, 0u );
			let shuffled_index = ${K[1].scramble}( ${K[1].reverseBits}( index ), shuffle_seed );
			let sobol_pt = ${t}( shuffled_index )${i};
			var result = ${n}( sobol_pt * 16777216.0 );

			let seed2 = ${K[e].hashCombine}( seed, ${a} );
			result = ${K[e].scramble}( result, seed2 );

			return ${Hn} * ${r}( result >> ${n}( 8 ) );

		}
	`;
}, $n = Qn(1), er = Qn(2), tr = Qn(3), nr = Qn(4), rr = H`
	fn sobolInit( pixel: vec2u, pathIndex: u32, bounceIndex: u32 ) -> void {

		${Wn} = ( pixel.x << 16 ) | pixel.y;
		${Gn} = pathIndex;
		${Kn} = bounceIndex;

	}
`, ir = H`
	fn sobolNextBounce() -> void {

		${Kn}++;

	}
`, ar = B("random.rngInit", rr), or = B("random.rngNextBounce", ir), sr = B("random.rand1", $n), q = B("random.rand2", er), cr = B("random.rand3", tr);
B("random.rand4", nr);
// node_modules/three-gpu-pathtracer/src/webgpu/nodes/utils.wgsl.js
var lr = g("\n\n	fn inverse(m: mat3x3f) -> mat3x3f {\n		var adj: mat3x3f;\n		adj[0][0] =   (m[1][1] * m[2][2] - m[2][1] * m[1][2]);\n		adj[1][0] = - (m[1][0] * m[2][2] - m[2][0] * m[1][2]);\n		adj[2][0] =   (m[1][0] * m[2][1] - m[2][0] * m[1][1]);\n		adj[0][1] = - (m[0][1] * m[2][2] - m[2][1] * m[0][2]);\n		adj[1][1] =   (m[0][0] * m[2][2] - m[2][0] * m[0][2]);\n		adj[2][1] = - (m[0][0] * m[2][1] - m[2][0] * m[0][1]);\n		adj[0][2] =   (m[0][1] * m[1][2] - m[1][1] * m[0][2]);\n		adj[1][2] = - (m[0][0] * m[1][2] - m[1][0] * m[0][2]);\n		adj[2][2] =   (m[0][0] * m[1][1] - m[1][0] * m[0][1]);\n\n		let det = ( m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])\n			- m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])\n			+ m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]));\n\n		return adj * ( 1.0 / det );\n	}\n\n"), ur = g("\n\n	fn getBasisFromNormal( normal: vec3f ) -> mat3x3f {\n\n		var other: vec3f;\n		if ( abs( normal.x ) > 0.5 ) {\n\n			other = vec3f( 0.0, 1.0, 0.0 );\n\n		} else {\n\n			other = vec3f( 1.0, 0.0, 0.0 );\n\n		}\n\n		let ortho = normalize( cross( normal, other ) );\n		let ortho2 = normalize( cross( normal, ortho ) );\n		return mat3x3f( ortho2, ortho, normal );\n\n	}\n\n"), J = g("\n\n	fn iorToF0( ior: f32 ) -> f32 {\n		return pow( ( 1 - ior ) / ( 1 + ior ), 2 );\n	}\n\n"), dr = g("\n\n	fn iorToF0General( transmittedIor: f32, incidentIor: f32 ) -> f32 {\n\n		return pow( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ), 2 );\n\n	}\n\n"), fr = g("\n\n	fn iorToF0GeneralVec( transmittedIor: vec3f, incidentIor: vec3f ) -> vec3f {\n\n		let v = ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor );\n		return v * v;\n\n	}\n\n"), pr = g("\n\n	fn fresnel0ToIor( f0: vec3f ) -> vec3f {\n\n		let sqrtF0 = sqrt( f0 );\n		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );\n\n	}\n\n"), mr = g("\n\n	fn schlickFresnel( cosine: f32, f0: f32 ) -> f32 {\n\n		return f0 + ( 1.0 - f0 ) * pow( 1.0 - cosine, 5.0 );\n\n	}\n\n"), hr = g("\n\n	fn schlickFresnelVec( cosine: f32, f0: vec3f, f90: vec3f ) -> vec3f {\n\n		return f0 + ( f90 - f0 ) * pow( 1.0 - cosine, 5.0 );\n\n	}\n\n"), gr = g("\n\n	fn totalInternalReflection( cosTheta: f32, eta: f32 ) -> bool {\n\n		let sinTheta = sqrt( 1.0 - cosTheta * cosTheta );\n		return eta * sinTheta > 1.0;\n\n	}\n\n"), _r = g("\n\n	fn totalInternalReflectionVec( cosTheta: f32, eta: vec3f ) -> vec3<bool> {\n\n		let sinTheta = sqrt( 1.0 - cosTheta * cosTheta );\n		return eta * sinTheta > vec3f( 1.0 );\n\n	}\n\n");
g("\n\n	fn evaluateFresnel( cosine: f32, eta: f32, f0: vec3f, f90: vec3f ) -> vec3f {\n\n		if ( totalInternalReflection( cosine, eta ) ) {\n\n			return f90;\n\n		}\n\n		return f0 + ( f90 - f0 ) * pow( 1.0 - cosine, 5.0 );\n	}\n\n", [gr]);
var vr = g("\n\n	fn dielectricFresnel( cosThetaI: f32, eta: f32 ) -> f32 {\n\n		// https://schuttejoe.github.io/post/disneybsdf/\n		let ni = eta;\n		let nt = 1.0;\n\n		// Check for total internal reflection\n		let sinThetaISq = 1.0 - cosThetaI * cosThetaI;\n		let sinThetaTSq = eta * eta * sinThetaISq;\n		if ( sinThetaTSq >= 1.0 ) {\n\n			return 1.0;\n\n		}\n\n		let sinThetaT = sqrt( sinThetaTSq );\n		let cosThetaT = sqrt( max( 0.0, 1.0 - sinThetaT * sinThetaT ) );\n		let rParallel = ( ( nt * cosThetaI ) - ( ni * cosThetaT ) ) / ( ( nt * cosThetaI ) + ( ni * cosThetaT ) );\n		let rPerpendicular = ( ( ni * cosThetaI ) - ( nt * cosThetaT ) ) / ( ( ni * cosThetaI ) + ( nt * cosThetaT ) );\n		return ( rParallel * rParallel + rPerpendicular * rPerpendicular ) / 2.0;\n\n	}\n\n"), yr = g("\n\n	fn disneyFresnel( wo: vec3f, wi: vec3f, wh: vec3f, f0: f32, eta: f32, metalness: f32 ) -> f32 {\n\n		let dotHV = dot( wo, wh );\n		if ( totalInternalReflection( dotHV, eta ) ) {\n\n			return 1.0;\n\n		}\n\n		let dotHL = dot( wi, wh );\n		let dielectricF = dielectricFresnel( abs( dotHV ), eta );\n		let metallicF = schlickFresnel( dotHL, f0 );\n\n		return mix( dielectricF, metallicF, metalness );\n\n	}\n\n", [
	gr,
	vr,
	mr
]), br = g("\n\n	fn isTerminatingScatter( scatterRec: ScatterRecord ) -> bool {\n\n		return scatterRec.pdf <= 0;\n\n	}\n\n", [wn]), Y = g("\n\n	fn clampPathContribution( contribution: vec3f, pathDepth: u32, clampDirect: f32, clampIndirect: f32 ) -> vec3f {\n\n		let limit = select( clampIndirect, clampDirect, pathDepth <= 1u ) * 3.0;\n		if ( limit <= 0.0 ) {\n\n			return contribution;\n\n		}\n\n		let strength = dot( abs( contribution ), vec3f( 1.0 ) );\n		if ( strength > limit ) {\n\n			return contribution * ( limit / strength );\n\n		}\n\n		return contribution;\n\n	}\n\n"), xr = g("\n\n	fn applyWrap( v: f32, wrapMode: i32 ) -> f32 {\n\n		var res = v;\n		if ( wrapMode == 1 ) {\n\n			// ClampToEdge\n			res = clamp( res, 0.0, 1.0 );\n\n		} else if ( wrapMode == 2 ) {\n\n			// MirroredRepeat\n			res = 1.0 - abs( 2.0 * fract( res * 0.5 ) - 1.0 );\n\n		} else {\n\n			// Repeat\n			res = fract( res );\n\n		}\n\n		return res;\n\n	}\n\n"), Sr = g("\n\n	fn offsetRayOrigin( point: vec3f, direction: vec3f, geometricNormal: vec3f ) -> vec3f {\n\n		let normal = normalize( select( -geometricNormal, geometricNormal, dot( direction, geometricNormal ) >= 0.0 ) );\n		let intScale = 256.0;\n		let integerOffset = vec3i( intScale * normal );\n		let pointBits = bitcast<vec3i>( point );\n		let signedOffset = select( integerOffset, -integerOffset, point < vec3f( 0.0 ) );\n		let offsetPoint = bitcast<vec3f>( pointBits + signedOffset );\n		let origin = 1.0 / 32.0;\n		let floatScale = 1.0 / 65536.0;\n		return select( offsetPoint, point + floatScale * normal, abs( point ) < vec3f( origin ) );\n\n	}\n\n"), Cr = g("\n\n	fn wrapTexelIndex( i: i32, size: i32, wrapMode: i32 ) -> i32 {\n\n		if ( wrapMode == 0 ) {\n\n			// Repeat wraps to the opposite edge\n			return ( ( i % size ) + size ) % size;\n\n		}\n\n		// ClampToEdge and MirroredRepeat both fold back onto the edge texel\n		return clamp( i, 0, size - 1 );\n\n	}\n\n"), wr = (e, t, n = "sampleTexel") => H`

	fn ${n}( uv: vec2f, packed: i32, lod: f32 ) -> vec4f {

		let texIndex = packed & 0x7FFFFF;
		let wrapS    = ( packed >> 26 ) & 0x3;
		let wrapT    = ( packed >> 28 ) & 0x3;
		let nearest  = ( packed >> 30 ) & 0x1;

		// look up the texture's rect and page within the atlas. three wraps a
		// uniformArray in a struct ( textureInfoStruct ) with a "value" array member.
		let info   = ${e}[ u32( texIndex ) ];
		let offset = vec2f( vec2u( info.x & 0xFFFFu, info.x >> 16u ) );
		let size   = vec2f( vec2u( info.y & 0xFFFFu, info.y >> 16u ) );
		let page   = i32( info.z & 0xFFFFu );

		// wrap is applied on the logical uv first, then remapped into the tile
		let wrappedUv = vec2f(
			${xr}( uv.x, wrapS ),
			${xr}( uv.y, wrapT ),
		);

		if ( nearest == 1 ) {

			let tileTexel = clamp( vec2i( wrappedUv * size ), vec2i( 0 ), vec2i( size ) - vec2i( 1 ) );
			return textureLoad( ${t}, vec2i( offset ) + tileTexel, page, 0 );

		} else {

			// The tile's neighbors in the atlas are unrelated textures, so hardware
			// filtering cannot supply the taps that fall outside it. Filter here instead
			// and resolve each tap through the wrap mode.
			let texelPos = wrappedUv * size - vec2f( 0.5 );
			let basePos = floor( texelPos );
			let base = vec2i( basePos );
			let f = texelPos - basePos;

			let intSize = vec2i( size );
			let x0 = ${Cr}( base.x,     intSize.x, wrapS );
			let x1 = ${Cr}( base.x + 1, intSize.x, wrapS );
			let y0 = ${Cr}( base.y,     intSize.y, wrapT );
			let y1 = ${Cr}( base.y + 1, intSize.y, wrapT );

			let tile = vec2i( offset );
			let c00 = textureLoad( ${t}, tile + vec2i( x0, y0 ), page, 0 );
			let c10 = textureLoad( ${t}, tile + vec2i( x1, y0 ), page, 0 );
			let c01 = textureLoad( ${t}, tile + vec2i( x0, y1 ), page, 0 );
			let c11 = textureLoad( ${t}, tile + vec2i( x1, y1 ), page, 0 );

			return mix(
				mix( c00, c10, f.x ),
				mix( c01, c11, f.x ),
				f.y,
			);

		}

	}
`, Tr = g("\n\n	fn sampleSphere( uv: vec2f ) -> vec3f {\n\n		let u = ( uv.x - 0.5 ) * 2.0;\n		let t = uv.y * PI * 2.0;\n		let f = sqrt( 1.0 - u * u );\n\n		return vec3f( f * cos( t ), f * sin( t ), u );\n\n	}\n\n", [W]), Er = g("\n\n	fn diffuseDirection( wo: vec3f, uv: vec2f ) -> vec3f {\n\n		var lightDirection = sampleSphere( uv );\n		lightDirection.z += 1.0;\n		lightDirection = normalize( lightDirection );\n\n		return lightDirection;\n\n	}\n\n", [Tr]), Dr = g("\n\n	fn getLobeWeights( wo: vec3f, wi: vec3f, woClearcoat: vec3f, wh: vec3f, clearcoatIor: f32, surf: SurfaceRecord ) -> LobeWeights {\n\n		var weights: LobeWeights;\n		var remaining = 1.0;\n\n		let clearcoatF0 = iorToF0( clearcoatIor );\n		let clearcoatFresnel = schlickFresnel( saturate( woClearcoat.z ), clearcoatF0 );\n		weights.clearcoat = surf.clearcoat * clearcoatFresnel;\n		remaining -= weights.clearcoat;\n\n		// this specular lobe only handles the opaque portion of the specular\n		let fEstimate = disneyFresnel( wo, wi, wh, surf.f0, surf.eta, surf.metalness );\n		weights.specular = remaining * ( surf.metalness + ( 1.0 - surf.metalness ) * ( 1.0 - surf.transmission ) * fEstimate );\n		remaining -= weights.specular;\n\n		// the transmission lobe covers both the reflected and refracted halves of the transmissive portion\n		weights.transmission = remaining * surf.transmission;\n		remaining -= weights.transmission;\n\n		weights.diffuse = remaining;\n\n		return weights;\n\n	}\n\n", [
	yr,
	mr,
	J,
	An,
	W
]), Or = g("\n\n	fn equirectDirectionToUv(direction: vec3f) -> vec2f {\n\n		// from Spherical.setFromCartesianCoords\n		var uv = vec2f( atan2( direction.z, direction.x ), acos( direction.y ) );\n		uv /= vec2f( 2.0 * PI, PI );\n\n		// apply adjustments to get values in range [0, 1] and y right side up\n		uv.x += 0.5;\n		uv.y = 1.0 - uv.y;\n		return uv;\n\n	}\n\n"), kr = g("\n\n	fn sampleHemisphere( n: vec3f, uv: vec2f ) -> vec3f {\n\n		// https://www.rorydriscoll.com/2009/01/07/better-sampling/\n		// https://graphics.pixar.com/library/OrthonormalB/paper.pdf\n		let sign = select( sign( n.z ), 1.0, n.z == 0.0 );\n		let a = - 1.0 / ( sign + n.z );\n		let b = n.x * n.y * a;\n		let b1 = vec3( 1.0 + sign * n.x * n.x * a, sign * b, - sign * n.x );\n		let b2 = vec3( b, sign + n.y * n.y * a, - n.y );\n\n		let r = sqrt( uv.x );\n		let theta = 2.0 * PI * uv.y;\n		let x = r * cos( theta );\n		let y = r * sin( theta );\n		return x * b1 + y * b2 + sqrt( 1.0 - uv.x ) * n;\n\n	}\n\n", [W]), Ar = g("\n\n	fn sampleHenyeyGreenstein( d: vec3f, g: f32, uv: vec2f ) -> vec3f {\n\n		var cosTheta = 1.0 - 2.0 * uv.x;\n		if ( abs( g ) > 0.001 ) {\n\n			let sqrTerm = ( 1.0 - g * g ) / ( 1.0 - g + 2.0 * g * uv.x );\n			cosTheta = clamp( ( 1.0 + g * g - sqrTerm * sqrTerm ) / ( 2.0 * g ), - 1.0, 1.0 );\n\n		}\n\n		// orthonormal basis around \"d\", from https://graphics.pixar.com/library/OrthonormalB/paper.pdf\n		let sign = select( sign( d.z ), 1.0, d.z == 0.0 );\n		let a = - 1.0 / ( sign + d.z );\n		let b = d.x * d.y * a;\n		let b1 = vec3( 1.0 + sign * d.x * d.x * a, sign * b, - sign * d.x );\n		let b2 = vec3( b, sign + d.y * d.y * a, - d.y );\n\n		let sinTheta = sqrt( max( 0.0, 1.0 - cosTheta * cosTheta ) );\n		let phi = 2.0 * PI * uv.y;\n		return normalize( sinTheta * cos( phi ) * b1 + sinTheta * sin( phi ) * b2 + cosTheta * d );\n\n	}\n\n", [W]), jr = g("\n\n	fn misHeuristic( a: f32, b: f32 ) -> f32 {\n\n		// computed as a ratio so squaring large pdfs can't overflow to Inf / Inf\n		if ( a >= b ) {\n\n			let r = b / a;\n			return 1.0 / ( 1.0 + r * r );\n\n		}\n\n		let r = a / b;\n		return r * r / ( 1.0 + r * r );\n\n	}\n\n"), Mr = g("\n\n	fn luminance( color: vec3f ) -> f32 {\n\n		return dot( color, vec3f( 0.2126, 0.7152, 0.0722 ) );\n\n	}\n\n"), Nr = g("\n\n	fn equirectUvToDirection( uvIn: vec2f ) -> vec3f {\n\n		// undo the adjustments applied in equirectDirectionToUv\n		var uv = uvIn;\n		uv.x -= 0.5;\n		uv.y = 1.0 - uv.y;\n\n		let theta = uv.x * 2.0 * PI;\n		let phi = uv.y * PI;\n		let sinPhi = sin( phi );\n\n		return vec3f( sinPhi * cos( theta ), cos( phi ), sinPhi * sin( theta ) );\n\n	}\n\n", [W]);
g("\n\n	fn equirectDirectionPdf( direction: vec3f ) -> f32 {\n\n		let uv = equirectDirectionToUv( direction );\n		let theta = uv.y * PI;\n		let sinTheta = sin( theta );\n		if ( sinTheta == 0.0 ) {\n\n			return 0.0;\n\n		}\n\n		return 1.0 / ( 2.0 * PI * PI * sinTheta );\n\n	}\n\n", [W, Or]);
var Pr = g("\n\n	fn weightedAlphaBlend( prevColor: vec4f, newColor: vec4f, weight: f32 ) -> vec4f {\n\n		let invWeight = 1.0 - weight;\n		let totalAlpha = prevColor.a * invWeight + newColor.a * weight;\n		var blendedColor = vec4f( 0 );\n		if ( totalAlpha != 0.0 ) {\n\n			let prevContrib = prevColor.rgb * invWeight * prevColor.a / totalAlpha;\n			let resContrib = newColor.rgb * weight * newColor.a / totalAlpha;\n			blendedColor = vec4f( prevContrib + resContrib, totalAlpha );\n\n		}\n\n		return blendedColor;\n\n	}\n\n"), Fr = 1e30, Ir = 1e-5, Lr = g("\n\n	fn isMISWeightLight( lightType: i32 ) -> bool {\n\n		return lightType == 5 || lightType == 1 || lightType == 0;\n\n	}\n\n"), Rr = g("\n\n	fn getSpotAttenuation( coneCosine: f32, penumbraCosine: f32, angleCosine: f32 ) -> f32 {\n\n		return smoothstep( coneCosine, penumbraCosine, angleCosine );\n\n	}\n\n"), zr = g("\n\n	fn getDistanceAttenuation( lightDistance: f32, cutoffDistance: f32, decayExponent: f32 ) -> f32 {\n\n		// based upon Frostbite 3 Moving to Physically-based Rendering\n		// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf\n		var distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), EPSILON );\n		if ( cutoffDistance > 0.0 ) {\n\n			let window = clamp( 1.0 - pow( lightDistance / cutoffDistance, 4.0 ), 0.0, 1.0 );\n			distanceFalloff *= window * window;\n\n		}\n\n		return distanceFalloff;\n\n	}\n\n", [W]), Br = g("\n\n	fn intersectsRectangle( center: vec3f, normal: vec3f, u: vec3f, v: vec3f, rayOrigin: vec3f, rayDirection: vec3f ) -> f32 {\n\n		let t = dot( center - rayOrigin, normal ) / dot( rayDirection, normal );\n		if ( t > EPSILON ) {\n\n			let p = rayOrigin + rayDirection * t;\n			let vi = p - center;\n\n			let a1 = dot( u, vi );\n			if ( abs( a1 ) <= 0.5 ) {\n\n				let a2 = dot( v, vi );\n				if ( abs( a2 ) <= 0.5 ) {\n\n					return t;\n\n				}\n\n			}\n\n		}\n\n		return - 1.0;\n\n	}\n\n", [W]), Vr = g("\n\n	fn intersectsCircle( position: vec3f, normal: vec3f, u: vec3f, v: vec3f, rayOrigin: vec3f, rayDirection: vec3f ) -> f32 {\n\n		let t = dot( position - rayOrigin, normal ) / dot( rayDirection, normal );\n		if ( t > EPSILON ) {\n\n			let hit = rayOrigin + rayDirection * t;\n			let vi = hit - position;\n\n			let a1 = dot( u, vi );\n			let a2 = dot( v, vi );\n			if ( length( vec2f( a1, a2 ) ) <= 0.5 ) {\n\n				return t;\n\n			}\n\n		}\n\n		return - 1.0;\n\n	}\n\n", [W]), Hr = g("\n\n	fn randomAreaLightSample( light: Light, rayOrigin: vec3f, ruv: vec2f ) -> LightRecord {\n\n		var randomPos = vec3f( 0.0 );\n		if ( light.lightType == 0 ) {\n\n			randomPos = light.position + light.u * ( ruv.x - 0.5 ) + light.v * ( ruv.y - 0.5 );\n\n		} else if ( light.lightType == 1 ) {\n\n			let r = 0.5 * sqrt( ruv.x );\n			let theta = ruv.y * 2.0 * PI;\n			randomPos = light.position + light.u * ( r * cos( theta ) ) + light.v * ( r * sin( theta ) );\n\n		}\n\n		let toLight = randomPos - rayOrigin;\n		let lightDistSq = dot( toLight, toLight );\n		let dist = sqrt( lightDistSq );\n		let direction = toLight / dist;\n		let lightNormal = normalize( cross( light.u, light.v ) );\n\n		var lightRec: LightRecord;\n		lightRec.lightType = light.lightType;\n		lightRec.emission = light.color * light.intensity;\n		lightRec.dist = dist;\n		lightRec.direction = direction;\n\n		// points behind or edge-on to the light receive no contribution\n		let cosTheta = dot( direction, lightNormal );\n		if ( cosTheta <= 0.0 ) {\n\n			lightRec.pdf = 0.0;\n\n		} else {\n\n			lightRec.pdf = lightDistSq / ( light.area * cosTheta );\n\n		}\n\n		return lightRec;\n\n	}\n\n", [
	On,
	kn,
	W
]), Ur = g("\n\n	fn randomSpotLightSample( light: Light, rayOrigin: vec3f, ruv: vec2f ) -> LightRecord {\n\n		let radius = light.radius * sqrt( ruv.x );\n		let theta = ruv.y * 2.0 * PI;\n		let x = radius * cos( theta );\n		let y = radius * sin( theta );\n\n		let u = light.u;\n		let v = light.v;\n		let normal = normalize( cross( u, v ) );\n\n		let angle = acos( light.coneCos );\n		let angleTan = tan( angle );\n		let startDistance = light.radius / max( angleTan, EPSILON );\n\n		let randomPos = light.position - normal * startDistance + u * x + v * y;\n		let toLight = randomPos - rayOrigin;\n		let lightDistSq = dot( toLight, toLight );\n		let dist = sqrt( lightDistSq );\n\n		let direction = toLight / max( dist, EPSILON );\n		let distanceAttenuation = getDistanceAttenuation( dist, light.distance, light.decay );\n\n		var lightRec: LightRecord;\n		lightRec.lightType = light.lightType;\n		lightRec.dist = dist;\n		lightRec.direction = direction;\n		lightRec.emission = light.color * light.intensity * distanceAttenuation;\n		lightRec.pdf = 1.0;\n\n		return lightRec;\n\n	}\n\n", [
	On,
	kn,
	W,
	zr
]), Wr = g("\n\n	fn getSpotLightNearest( light: Light, position: vec3f ) -> vec2f {\n\n		let normal = normalize( cross( light.u, light.v ) );\n		let startDistance = light.radius / max( tan( acos( light.coneCos ) ), EPSILON );\n		let discCenter = light.position - normal * startDistance;\n\n		let toPosition = position - discCenter;\n		let along = dot( toPosition, - normal );\n		let across = max( length( toPosition + normal * along ) - light.radius, 0.0 );\n		let dist = length( vec2f( along, across ) );\n		return vec2f( along / max( dist, EPSILON ), dist );\n\n	}\n\n", [On, W]), Gr = 1e-6, Kr = 1e-6, qr = .999, Jr = new C({
	inside: "bool",
	object: "uint",
	extinction: "vec3f",
	albedo: "vec3f",
	anisotropy: "float"
}, "Medium"), Yr = new C({
	extinction: "vec3f",
	object: "uint",
	albedo: "vec3f",
	anisotropy: "float",
	inside: "uint"
}, "MediumState"), Xr = H`

	fn storeMedium( medium: ${Jr} ) -> ${Yr} {

		var state: ${Yr};
		state.extinction = medium.extinction;
		state.object = medium.object;
		state.albedo = medium.albedo;
		state.anisotropy = medium.anisotropy;
		state.inside = select( 0u, 1u, medium.inside );
		return state;

	}

`, Zr = H`

	fn loadMedium( state: ${Yr} ) -> ${Jr} {

		var medium: ${Jr};
		medium.inside = state.inside != 0u;
		medium.object = state.object;
		medium.extinction = state.extinction;
		medium.albedo = state.albedo;
		medium.anisotropy = state.anisotropy;
		return medium;

	}

`, Qr = H`

	fn enterMedium( material: ${En}, object: u32 ) -> ${Jr} {

		let anisotropy = clamp( material.scatterAnisotropy, - ${qr}, ${qr} );

		var medium: ${Jr};
		medium.extinction = - log( max( material.attenuationColor, vec3f( ${Gr} ) ) ) / material.attenuationDistance;
		medium.albedo = ${H`

	fn singleScatterAlbedo( multiscatterAlbedo: vec3f, anisotropy: f32 ) -> vec3f {

		let a = multiscatterAlbedo;
		let s = clamp( 4.09712 + 4.20863 * a - sqrt( 9.59217 + 41.6808 * a + 17.7126 * a * a ), vec3f( 0.0 ), vec3f( 1.0 ) );
		let s2 = select( s * s, vec3f( 1.0 ), a <= vec3f( 0.0 ) );
		return ( 1.0 - s2 ) / ( 1.0 - anisotropy * s2 );

	}

`}( material.multiscatterColor * material.scatterStrength, anisotropy );
		medium.inside = any( medium.albedo > vec3f( 0.0 ) ) && any( medium.extinction > vec3f( 0.0 ) );
		medium.object = object;
		medium.anisotropy = anisotropy;
		return medium;

	}

`, $r = H`

	fn mediumChannelPdf( throughput: vec3f, albedo: vec3f ) -> vec3f {

		let weights = abs( throughput * albedo );
		let weightSum = weights.r + weights.g + weights.b;
		if ( weightSum > 0.0 ) {

			return weights / weightSum;

		}

		return vec3f( 1.0 / 3.0 );

	}

`, ei = H`

	fn sampleMediumDistance( medium: ${Jr}, channelPdf: vec3f, u: vec2f ) -> f32 {

		var channel = 2u;
		if ( u.x < channelPdf.r ) {

			channel = 0u;

		} else if ( u.x < channelPdf.r + channelPdf.g ) {

			channel = 1u;

		}

		// a channel with no extinction never scatters, and WGSL doesn't guarantee an infinite quotient
		let extinction = medium.extinction[ channel ];
		if ( extinction <= 0.0 ) {

			return ${Fr};

		}

		return - log( 1.0 - u.y ) / extinction;

	}

`, ti = H`

	fn mediumDistancePdf( medium: ${Jr}, dist: f32, scattered: bool ) -> vec3f {

		let transmittance = exp( - medium.extinction * dist );
		return select( transmittance, medium.extinction * transmittance, scattered );

	}

`, ni = g("\n\n	fn ggxDirection( incidentDir: vec3f, alpha: vec2f, uv: vec2f ) -> vec3f {\n\n		// Implementation from reference [1]\n		// stretch view\n		let V = normalize( vec3f( alpha * incidentDir.xy, incidentDir.z ) );\n\n		// orthonormal basis\n		var T1: vec3f;\n		if ( V.z < 0.9999 ) {\n\n			T1 = normalize( cross( V, vec3( 0.0, 0.0, 1.0 ) ) );\n\n		} else {\n\n			T1 = vec3( 1.0, 0.0, 0.0 );\n\n		}\n\n		let T2 = cross( T1, V );\n\n		// sample point with polar coordinates (r, phi)\n		let a = 1.0 / ( 1.0 + V.z );\n		let r = sqrt( uv.x );\n		var phi: f32;\n		if ( uv.y < a ) {\n\n			phi = uv.y / a * PI;\n\n		} else {\n\n			phi = PI + ( uv.y - a ) / ( 1.0 - a ) * PI;\n\n		}\n\n		let P1 = r * cos( phi );\n		var P2 = r * sin( phi );\n		if ( uv.y >= a ) {\n\n			P2 *= V.z;\n\n		}\n\n		// compute normal\n		var N = P1 * T1 + P2 * T2 + V * sqrt( max( 0.0, 1.0 - P1 * P1 - P2 * P2 ) );\n\n		// unstretch\n		N = normalize( vec3( alpha * N.xy, max( 0.0, N.z ) ) );\n\n		return N;\n\n	}\n\n", [W]), ri = g("\n\n	fn ggxLambda( V: vec3f, alpha: vec2f ) -> f32 {\n\n		let alphaT = alpha.x;\n		let alphaB = alpha.y;\n\n		// abs v.z to support transmitted rays\n		let NdotV = max( abs( V.z ), MIN_INCIDENT_COS );\n		let cos2 = NdotV * NdotV;\n		let t = ( alphaT * alphaT * V.x * V.x + alphaB * alphaB * V.y * V.y ) / cos2;\n		let numerator = - 1.0 + sqrt( 1.0 + t );\n		return numerator / 2.0;\n\n	}\n\n", [W]), ii = g("\n\n	fn ggxShadowMaskG1( V: vec3f, alpha: vec2f ) -> f32 {\n\n		// TODO: this could be collapsed to a simpler form as an optimization\n		return 1.0 / ( 1.0 + ggxLambda( V, alpha ) );\n\n	}\n\n", [ri]), ai = g("\n\n	fn ggxSmithVisibility( V: vec3f, L: vec3f, alpha: vec2f ) -> f32 {\n\n		let alphaT = alpha.x;\n		let alphaB = alpha.y;\n\n		let NdotV = max( V.z, MIN_INCIDENT_COS );\n		let NdotL = max( L.z, MIN_INCIDENT_COS );\n\n		let TdotV = V.x;\n		let TdotL = L.x;\n\n		let BdotV = V.y;\n		let BdotL = L.y;\n\n		let GGXV = NdotL * length( vec3f( alphaT * TdotV, alphaB * BdotV, NdotV ) );\n		let GGXL = NdotV * length( vec3f( alphaT * TdotL, alphaB * BdotL, NdotL ) );\n\n		return 0.5 / ( GGXV + GGXL );\n\n	}\n\n", [W]), oi = g("\n\n	fn ggxDistribution( H: vec3f, alpha: vec2f ) -> f32 {\n\n		let alphaT = alpha.x;\n		let alphaB = alpha.y;\n\n		let NdotH = H.z;\n		let TdotH = H.x;\n		let BdotH = H.y;\n\n		let a2 = alphaT * alphaB;\n		let v = vec3f( alphaB * TdotH, alphaT * BdotH, a2 * NdotH );\n		let v2 = dot( v, v );\n		let w2 = a2 / v2;\n\n		return a2 * w2 * w2 / PI;\n\n	}\n\n", [W]), si = g("\n\n	fn ggxReflectionAdjustedPDF( V: vec3f, H: vec3f, alpha: vec2f ) -> f32 {\n\n		let NdotV = max( V.z, MIN_INCIDENT_COS );\n		let D = ggxDistribution( H, alpha );\n		let G1 = ggxShadowMaskG1( V, alpha );\n\n		return D * G1 / ( 4 * NdotV );\n\n	}\n", [oi, ii]), ci = g("\n\n	fn ggxRefractionAdjustedPDF( V: vec3f, L: vec3f, H: vec3f, alpha: vec2f, eta: f32 ) -> f32 {\n\n		let NdotV = max( V.z, MIN_INCIDENT_COS );\n		let HdotV = dot( V, H );\n		let HdotL = dot( L, H );\n		let D = ggxDistribution( H, alpha );\n		let G1 = ggxShadowMaskG1( V, alpha );\n\n		let denom = eta * HdotV + HdotL;\n		return D * G1 * abs( HdotV ) * abs( HdotL ) / ( NdotV * denom * denom );\n\n	}\n", [oi, ii]), li = H`

	fn ensureValidReflectionNormal( n: vec3f, ng: vec3f, i: vec3f ) -> vec3f {

		// reflected ray
		let R = 2.0 * dot( n, i ) * n - i;

		let Iz = dot( i, ng );

		// reflection rays may always be at least as shallow as the incoming ray
		let threshold = min( 0.9 * Iz, 0.01 );
		if ( dot( ng, R ) >= threshold ) {

			return n;

		}

		// Form coordinate system with Ng as the Z axis and N inside the X-Z-plane.
   		// The X axis is found by normalizing the component of N that's orthogonal to Ng.
   		// The Y axis isn't actually needed.
		let orthoN = n - dot( n, ng ) * ng;
		let orthoLen = length( orthoN );
		let X = select( n, orthoN / orthoLen, orthoLen != 0.0 );

		// Calculate N.z and N.x in the local coordinate system.
		//
		// The goal of this computation is to find a N' that is rotated towards Ng just enough
   		// to lift R' above the threshold (here called t), therefore dot(R', Ng) = t.
		//
		// See the Blender implementation for a full description of the solution.
		let Ix = dot( i, X );

		let a = Ix * Ix + Iz * Iz;
		let b = 2.0 * ( a + Iz * threshold );
		let c = ( threshold + Iz ) * ( threshold + Iz );

		// only one root is valid; the sign of Ix selects it
		var Nz2: f32;
		if ( Ix < 0.0 ) {

			Nz2 = 0.25 * ( b + sqrt( max( b * b - 4.0 * a * c, 0.0 ) ) ) / a;

		} else {

			Nz2 = 0.25 * ( b - sqrt( max( b * b - 4.0 * a * c, 0.0 ) ) ) / a;

		}

		let Nx = sqrt( max( 1.0 - Nz2, 0.0 ) );
		let Nz = sqrt( max( Nz2, 0.0 ) );

		return Nx * X + Nz * ng;

	}

`, ui = H`

	fn ensureValidViewNormal( n: vec3f, ng: vec3f, view: vec3f ) -> vec3f {

		// ensure the view is at least slightly above the surface normal hemisphere
		const MIN_VIEW_COS = 1e-6;

		// if we're positive already then early out
		let c = dot( n, view );
		if ( c > MIN_VIEW_COS ) {

			return n;

		}

		// perpendicular vector to normal and view
		var perp = n - c * view;
		let perpLen = length( perp );

		// if we reach here that means that he view is nearly the opposite direction and
		// we can't derive plan to rotate on towards the view, so just use the geometry
		// normal. This could likely only really happen with a severe normal map application.
		if ( perpLen <= 1e-6 ) {

			return ng;

		}

		perp = perp / perpLen;

		// rotate the normal to be at larger than the above threshold - pythagorean
		// theorem for generating normal with threshold*view component
		return MIN_VIEW_COS * view + sqrt( 1.0 - MIN_VIEW_COS * MIN_VIEW_COS ) * perp;

	}

`, di = 3402823466e29, fi = (e, t, n) => g("\n\n	fn getSurfaceRecord(\n		material: Material,\n		vertexData: bvh_GeometryStruct,\n		side: f32,\n		faceNormal: vec3f,\n		view: vec3f,\n		blurRoughness: f32,\n	) -> SurfaceRecord {\n\n		// \"faceNormal\" is provided on the hit side so flip it back to the geometric side\n		var normal = faceNormal * side;\n		if ( material.flatShading == 0 ) {\n\n			normal = normalize( vertexData.normal.xyz );\n\n		}\n\n		var baseNormal = normal;\n		if ( material.normalMap != -1 ) {\n\n			// some provided tangents can be malformed (0, 0, 0) causing the normal to be degenerate\n			// resulting in NaNs and slow path tracing.\n			if ( length( vertexData.tangent.xyz ) > 0.0 && vertexData.tangent.w != 0.0 ) {\n\n				// TODO: consider re-orthonormalizing against the normal here since attribute\n				// interpolation could result in drift.\n				let tangent = normalize( vertexData.tangent.xyz );\n				let bitangent = normalize( cross( baseNormal, tangent ) * vertexData.tangent.w );\n				let vTBN = mat3x3f( tangent, bitangent, baseNormal );\n\n				let uvPrime = material.normalMapTransform * vec3( getUvFromChannel( vertexData, material.normalMap ), 1.0 );\n				var texNormal = sampleTexel( uvPrime.xy, material.normalMap, 0 ).xyz;\n				texNormal = texNormal * 2.0 - 1.0;\n				texNormal = texNormal * vec3f( material.normalScale, 1.0 );\n				normal = normalize( vTBN * texNormal );\n\n			}\n\n		}\n\n		normal *= side;\n\n		normal = ensureValidViewNormal( normal, faceNormal, view );\n\n		normal = ensureValidReflectionNormal( normal, faceNormal, view );\n\n		var albedo = vec4( material.color, material.opacity );\n		if ( material.vertexColors == 1 ) {\n\n			albedo *= getColor( vertexData );\n\n		}\n\n		if ( material.map != -1 ) {\n\n			let uvPrime = material.mapTransform * vec3f( getUvFromChannel( vertexData, material.map ), 1 );\n			albedo *= sampleTexel( uvPrime.xy, material.map, 0 );\n\n		}\n\n		if ( material.alphaMap != -1 ) {\n\n			let uvPrime = material.alphaMapTransform * vec3f( getUvFromChannel( vertexData, material.alphaMap ), 1 );\n			albedo.a *= sampleTexel( uvPrime.xy, material.alphaMap, 0 ).g;\n\n		}\n\n		var roughness = material.roughness;\n		if ( material.roughnessMap != -1 ) {\n\n			let uvPrime = material.roughnessMapTransform * vec3f( getUvFromChannel( vertexData, material.roughnessMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.roughnessMap, 0 );\n			roughness *= texColor.g;\n\n		}\n\n		var metalness = material.metalness;\n		if ( material.metalnessMap != -1 ) {\n\n			let uvPrime = material.metalnessMapTransform * vec3f( getUvFromChannel( vertexData, material.metalnessMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.metalnessMap, 0 );\n			metalness *= texColor.b;\n\n		}\n\n		var emission = material.emissiveIntensity * material.emissive;\n		if ( material.emissiveMap != -1 ) {\n\n			let uvPrime = material.emissiveMapTransform * vec3f( getUvFromChannel( vertexData, material.emissiveMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.emissiveMap, 0 );\n			emission *= texColor.rgb;\n\n		}\n\n		var transmission = material.transmission;\n		if ( material.transmissionMap != -1 ) {\n\n			let uvPrime = material.transmissionMapTransform * vec3f( getUvFromChannel( vertexData, material.transmissionMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.transmissionMap, 0 );\n			transmission *= texColor.r;\n\n		}\n\n		var clearcoat = material.clearcoat;\n		if ( material.clearcoatMap != -1 ) {\n\n			let uvPrime = material.clearcoatMapTransform * vec3f( getUvFromChannel( vertexData, material.clearcoatMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.clearcoatMap, 0 );\n			clearcoat *= texColor.r;\n\n		}\n\n		var clearcoatRoughness = material.clearcoatRoughness;\n		if ( material.clearcoatRoughnessMap != -1 ) {\n\n			let uvPrime = material.clearcoatRoughnessMapTransform * vec3f( getUvFromChannel( vertexData, material.clearcoatRoughnessMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.clearcoatRoughnessMap, 0 );\n			clearcoatRoughness *= texColor.g;\n\n		}\n\n		var clearcoatNormal = baseNormal;\n		if ( material.clearcoatNormalMap != -1 ) {\n\n			// some provided tangents can be malformed (0, 0, 0) causing the normal to be degenerate\n			// resulting in NaNs and slow path tracing.\n			if ( length( vertexData.tangent.xyz ) > 0.0 && vertexData.tangent.w != 0.0 ) {\n\n				// TODO: consider re-orthonormalizing against the normal here since attribute\n				// interpolation could result in drift.\n				let tangent = normalize( vertexData.tangent.xyz );\n				let bitangent = normalize( cross( baseNormal, tangent ) * vertexData.tangent.w );\n				let vTBN = mat3x3f( tangent, bitangent, baseNormal );\n\n				let uvPrime = material.clearcoatNormalMapTransform * vec3( getUvFromChannel( vertexData, material.clearcoatNormalMap ), 1.0 );\n				var texNormal = sampleTexel( uvPrime.xy, material.clearcoatNormalMap, 0 ).xyz;\n				texNormal = texNormal * 2.0 - 1.0;\n				texNormal = texNormal * vec3f( material.clearcoatNormalScale, 1.0 );\n				clearcoatNormal = normalize( vTBN * texNormal );\n\n			}\n\n		}\n\n		clearcoatNormal *= side;\n\n		clearcoatNormal = ensureValidViewNormal( clearcoatNormal, faceNormal, view );\n\n		clearcoatNormal = ensureValidReflectionNormal( clearcoatNormal, faceNormal, view );\n\n		var sheenColor = material.sheenColor;\n		if ( material.sheenColorMap != -1 ) {\n\n			let uvPrime = material.sheenColorMapTransform * vec3f( getUvFromChannel( vertexData, material.sheenColorMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.sheenColorMap, 0 );\n			sheenColor *= texColor.rgb;\n\n		}\n\n		var sheenRoughness = material.sheenRoughness;\n		if ( material.sheenRoughnessMap != -1 ) {\n\n			let uvPrime = material.sheenRoughnessMapTransform * vec3f( getUvFromChannel( vertexData, material.sheenRoughnessMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.sheenRoughnessMap, 0 );\n			sheenRoughness *= texColor.r;\n\n		}\n\n		var iridescence = material.iridescence;\n		if ( material.iridescenceMap != -1 ) {\n\n			let uvPrime = material.iridescenceMapTransform * vec3f( getUvFromChannel( vertexData, material.iridescenceMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.iridescenceMap, 0 );\n			iridescence *= texColor.r;\n\n		}\n\n		var iridescenceThickness = material.iridescenceThicknessMaximum;\n		if ( material.iridescenceThicknessMap != -1 ) {\n\n			let uvPrime = material.iridescenceThicknessMapTransform * vec3f( getUvFromChannel( vertexData, material.iridescenceThicknessMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.iridescenceThicknessMap, 0 );\n\n			iridescenceThickness = mix(\n				material.iridescenceThicknessMinimum,\n				material.iridescenceThicknessMaximum,\n				texColor.g,\n			);\n\n		}\n\n		var specularColor = material.specularColor;\n		if ( material.specularColorMap != -1 ) {\n\n			let uvPrime = material.specularColorMapTransform * vec3f( getUvFromChannel( vertexData, material.specularColorMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.specularColorMap, 0 );\n			specularColor *= texColor.rgb;\n\n		}\n\n		var specularIntensity = material.specularIntensity;\n		if ( material.specularIntensityMap != -1 ) {\n\n			let uvPrime = material.specularIntensityMapTransform * vec3f( getUvFromChannel( vertexData, material.specularIntensityMap ), 1 );\n			let texColor = sampleTexel( uvPrime.xy, material.specularIntensityMap, 0 );\n			specularIntensity *= texColor.a;\n\n		}\n\n		// extract the anisotropy magnitude vector in tangent space\n		var anisotropyDirVec = material.anisotropy * vec2f( cos( material.anisotropyRotation ), sin( material.anisotropyRotation ) );\n		if ( material.anisotropyMap != -1 ) {\n\n			let uvPrime = material.anisotropyMapTransform * vec3f( getUvFromChannel( vertexData, material.anisotropyMap ), 1.0 );\n			let aniTex = sampleTexel( uvPrime.xy, material.anisotropyMap, 0 );\n\n			// map rg encode the direction ([-1,1]), b the strength; rotate + scale by the material anisotropy.\n			let mapDir = aniTex.rg * 2.0 - vec2f( 1.0 );\n			let mapStr = aniTex.b;\n			let mapLen = length( mapDir );\n			if ( mapLen > EPSILON ) {\n\n				anisotropyDirVec = mat2x2f(\n					anisotropyDirVec.x, anisotropyDirVec.y,\n					- anisotropyDirVec.y, anisotropyDirVec.x\n				) * mapStr * mapDir / mapLen;\n\n			}\n\n		}\n\n		// adjust the surface basis to be oriented along the anisotropic vector\n		let anisotropyStrength = length( anisotropyDirVec );\n		var surfaceBasis = getBasisFromNormal( normal );\n		if ( anisotropyStrength > 0.0 && length( vertexData.tangent.xyz ) > 0.0 && vertexData.tangent.w != 0.0 ) {\n\n			let anisotropyDir = anisotropyDirVec / anisotropyStrength;\n\n			// re-orthonormalize the tangent against the shading normal so the frame stays orthonormal -\n			// normal map adjustments will cause the normal and tangent to become non-orthonormal.\n			let tangent = normalize( vertexData.tangent.xyz - normal * dot( normal, vertexData.tangent.xyz ) );\n			let bitangent = cross( normal, tangent ) * vertexData.tangent.w;\n\n			surfaceBasis = mat3x3f(\n				tangent * anisotropyDir.x + bitangent * anisotropyDir.y,\n				bitangent * anisotropyDir.x - tangent * anisotropyDir.y,\n				normal\n			);\n\n		}\n\n		var surf: SurfaceRecord;\n\n		surf.volumeParticle = false;\n		surf.faceNormal = faceNormal;\n		surf.normal = normal;\n\n		surf.metalness = metalness;\n		surf.diffuseRoughness = material.diffuseRoughness;\n		surf.color = albedo.rgb;\n		surf.emission = emission;\n\n		surf.opacity = select( 1.0, albedo.a, material.transparent != 0 );\n\n		surf.ior = material.ior;\n		surf.transmission = transmission;\n		surf.thinWall = material.thinWall == 1;\n		surf.attenuationColor = material.attenuationColor;\n		surf.attenuationDistance = material.attenuationDistance;\n\n		surf.clearcoatNormal = clearcoatNormal;\n		surf.clearcoat = clearcoat;\n\n		surf.iridescence = iridescence;\n		surf.iridescenceIor = material.iridescenceIor;\n		surf.iridescenceThickness = iridescenceThickness;\n\n		surf.specularColor = specularColor;\n		surf.specularIntensity = specularIntensity;\n\n		surf.sheen = material.sheen;\n		surf.sheenColor = sheenColor;\n\n		let minRoughness = max( MIN_ROUGHNESS, blurRoughness );\n		surf.roughness = clamp( roughness, minRoughness, 1.0 );\n		surf.clearcoatRoughness = clamp( clearcoatRoughness, minRoughness, 1.0 );\n		surf.sheenRoughness = clamp( sheenRoughness, minRoughness, 1.0 );\n		surf.anisotropy = anisotropyStrength;\n\n		// frontFace is used to determine transmissive properties and PDF. If no transmission is used\n		// then we can just always assume this is a front face.\n		surf.frontFace = side == 1.0 || transmission == 0.0;\n		if ( material.thinWall == 1 || surf.frontFace ) {\n\n			surf.eta = 1.0 / material.ior;\n\n		} else {\n\n			surf.eta = material.ior;\n\n		}\n		surf.f0 = iorToF0( surf.eta );\n\n		// get the normal frames\n		surf.normalBasis = surfaceBasis;\n		surf.normalInvBasis = inverse( surf.normalBasis );\n\n		surf.clearcoatBasis = getBasisFromNormal( surf.clearcoatNormal );\n		surf.clearcoatInvBasis = inverse( surf.clearcoatBasis );\n\n		return surf;\n	}\n\n", [
	lr,
	J,
	ur,
	e,
	t,
	n,
	G,
	W,
	li,
	ui
]);
g("\n\n	fn diffuseBrdf( NdotV: f32, NdotL: f32, VdotH: f32, surf: SurfaceRecord ) -> vec3f {\n\n		// https://blog.selfshadow.com/publications/s2015-shading-course/burley/s2015_pbs_disney_bsdf_notes.pdf\n		// See equation (4)\n\n		let fl = schlickFresnel( NdotL, 0.0 );\n		let fv = schlickFresnel( NdotV, 0.0 );\n\n		let alpha = surf.roughness * surf.roughness;\n		let bias = mix( 0.0, 0.5, alpha ) - 1;\n		let energyFactor = mix( 1.0, 1.0 / 1.51, alpha );\n\n		let rr = 2.0 * alpha * VdotH * VdotH;\n		let retro = rr * ( fl + fv + fl * fv * ( rr + 2.0 * bias ) );\n		let fresnel = ( 1.0 + bias * fl ) * ( 1.0f + bias * fv );\n\n		// TODO: subsurface approx?\n\n		return energyFactor * ( surf.color / PI ) * ( retro + fresnel );\n\n	}\n\n", [
	W,
	mr,
	G
]), g("\n\n	fn lambertBrdf( NdotV: f32, NdotL: f32, VdotH: f32, surf: SurfaceRecord ) -> vec3f {\n\n		return surf.color / PI;\n\n	}\n\n", [W, G]);
var pi = g("\n\n	fn specularBrdf( V: vec3f, L: vec3f, H: vec3f, alpha: vec2f ) -> vec3f {\n\n		let alphaT = alpha.x;\n		let alphaB = alpha.y;\n\n		let Vis = ggxSmithVisibility( V, L, alpha );\n		let D = ggxDistribution( H, alpha );\n\n		return vec3f( D * Vis );\n\n	}\n\n", [ai, oi]), mi = g("\n\n	fn isMatchedIor( eta: f32 ) -> bool {\n\n		return abs( eta - 1.0 ) < EPSILON;\n\n	}\n\n", [W]), hi = g("\n\n	fn specularBtdf( V: vec3f, L: vec3f, H: vec3f, alpha: vec2f, eta: f32 ) -> vec3f {\n\n		let NdotV = V.z;\n		let NdotL = L.z;\n		let HdotV = dot( V, H );\n		let HdotL = dot( L, H );\n\n		// Heaviside function for G term\n		if ( NdotV * HdotV < 0.0 || NdotL * HdotL < 0.0 || HdotV * HdotL > 0.0 ) {\n\n			return vec3f( 0.0 );\n\n		}\n\n		let G1_i = ggxShadowMaskG1( V, alpha );\n		let G1_o = ggxShadowMaskG1( L, alpha );\n\n		// separable G2 product, no height correlation\n		let denom = eta * HdotV + HdotL;\n		let Vis = G1_i * G1_o * abs( HdotV ) * abs( HdotL ) /\n			( abs( NdotV ) * abs( NdotL ) * denom * denom );\n\n		let F = dielectricFresnel( abs( HdotV ), eta );\n\n		let D = ggxDistribution( H, alpha );\n\n		return vec3f( ( 1 - F ) * D * Vis );\n\n	}\n\n", [
	ii,
	oi,
	vr
]), gi = g("\n\n	fn thinWallTransmissionRoughness( alpha: f32, eta: f32 ) -> f32 {\n\n		let t = 3.4 * ( eta - 1.0 ) * ( eta - 0.5 ) * ( eta - 0.5 ) / ( eta * eta * eta );\n		return saturate( alpha * sqrt( max( t, 0.0 ) ) );\n\n	}\n\n"), _i = g("\n\n	fn transmissionAttenuation( dist: f32, attColor: vec3f, attDist: f32 ) -> vec3f {\n\n		return pow( attColor, vec3f( dist / attDist ) );\n\n	}\n\n"), vi = H`

	fn applyDispersion( surf: ptr<function, ${G}>, dispersion: f32, wavelength: f32 ) -> void {

		surf.ior = ${g("\n\n	fn dispersionIor( ior: f32, dispersion: f32, wavelength: f32 ) -> f32 {\n\n		let nd = max( ior, 1.0 );\n		let scale = ( nd - 1.0 ) * max( dispersion, 0.0 ) / 20.0;\n		let lambda = clamp( wavelength, 360.0, 830.0 );\n		return max( nd + scale * ( 523655.0 / ( lambda * lambda ) - 1.5168 ), 1.0 );\n\n	}\n\n")}( surf.ior, dispersion, wavelength );
		surf.eta = select( surf.ior, 1.0 / surf.ior, surf.thinWall || surf.frontFace );
		surf.f0 = ${J}( surf.eta );

	}

`, yi = g("\n\n	fn dispersionColorWeight( wavelength: f32 ) -> vec3f {\n\n		let lambda = clamp( wavelength, 360.0, 830.0 );\n\n		let x1 = ( lambda - 442.0 ) * select( 0.0374, 0.0624, lambda < 442.0 );\n		let x2 = ( lambda - 599.8 ) * select( 0.0323, 0.0264, lambda < 599.8 );\n		let x3 = ( lambda - 501.1 ) * select( 0.0382, 0.0490, lambda < 501.1 );\n		let x = 0.362 * exp( - 0.5 * x1 * x1 ) + 1.056 * exp( - 0.5 * x2 * x2 ) - 0.065 * exp( - 0.5 * x3 * x3 );\n\n		let y1 = ( lambda - 568.8 ) * select( 0.0247, 0.0213, lambda < 568.8 );\n		let y2 = ( lambda - 530.9 ) * select( 0.0322, 0.0613, lambda < 530.9 );\n		let y = 0.821 * exp( - 0.5 * y1 * y1 ) + 0.286 * exp( - 0.5 * y2 * y2 );\n\n		let z1 = ( lambda - 437.0 ) * select( 0.0278, 0.0845, lambda < 437.0 );\n		let z2 = ( lambda - 459.0 ) * select( 0.0725, 0.0385, lambda < 459.0 );\n		let z = 1.217 * exp( - 0.5 * z1 * z1 ) + 0.681 * exp( - 0.5 * z2 * z2 );\n\n		let linearRgb = max( vec3f(\n			3.2404542 * x - 1.5371385 * y - 0.4985314 * z,\n			- 0.9692660 * x + 1.8760108 * y + 0.0415560 * z,\n			0.0556434 * x - 0.2040259 * y + 1.0572252 * z,\n		), vec3f( 0.0 ) );\n\n		return linearRgb * vec3f( 2.6699448, 4.0708066, 4.2980494 );\n\n	}\n\n"), bi = g("\n\n	fn fresnelMix( VdotH: f32, f0Color: vec3f, ior: f32, eta: f32, weight: f32, base: vec3f, layer: vec3f ) -> vec3f {\n\n		var f0 = iorToF0( ior ) * f0Color;\n		f0 = min( f0, vec3f( 1.0 ) );\n\n		// reflect all light on total internal reflection, matching the WebGL evaluateFresnel function\n		var fr = vec3f( 1.0 );\n		if ( ! totalInternalReflection( abs( VdotH ), eta ) ) {\n\n			fr = schlickFresnelVec( abs( VdotH ), f0, vec3f( 1.0 ) );\n\n		}\n\n		let maxFr = max( max( fr.r, fr.g ), fr.b );\n\n		return ( 1.0 - weight * maxFr ) * base + weight * fr * layer;\n\n	}\n\n", [
	hr,
	J,
	gr
]), xi = m(3.2404542, -.969266, .0556434, -1.5371385, 1.8760108, -.2040259, -.4985314, .041556, 1.0572252), Si = H`

	fn evalSensitivity( OPD: f32, shift: vec3f ) -> vec3f {

		let phase = 2.0 * ${Math.PI} * OPD * 1.0e-9;
		const val = vec3(5.4856e-13, 4.4201e-13, 5.2481e-13);
		const pos = vec3(1.6810e+06, 1.7953e+06, 2.2084e+06);
		const _var = vec3(4.3278e+09, 9.3046e+09, 6.6121e+09);

		var xyz = val * sqrt(2.0 * ${Math.PI} * _var) * cos(pos * phase + shift) * exp(-phase * phase * _var);
		xyz.x += 9.7470e-14 * sqrt(2.0 * ${Math.PI} * 4.5282e+09) * cos(2.2399e+06 * phase + shift.x) * exp(-4.5282e+09 * phase * phase);
		xyz /= 1.0685e-7;

		let rgb = ${xi} * xyz;
		return rgb;

	}

`, Ci = g("\n\n	fn iridescentFresnel(\n		cosTheta1: f32, baseF0: vec3f, iridescenceIor: f32,\n		outsideIor: f32, iridescenceThickness: f32,\n	) -> vec3f {\n\n		let sinTheta2Sq = pow( outsideIor / iridescenceIor, 2.0 ) * ( 1.0 - pow( cosTheta1, 2.0 ) );\n		let cosTheta2Sq = 1.0 - sinTheta2Sq;\n\n		// Handle total internal reflection\n		if ( cosTheta2Sq < 0.0 ) {\n\n			return vec3( 1.0 );\n\n		}\n\n		let cosTheta2 = sqrt( cosTheta2Sq );\n\n		// First interface: air -> iridescent thin film\n		let R0 = iorToF0General( iridescenceIor, outsideIor );\n		let R12 = schlickFresnel( cosTheta1, R0 );\n		let R21 = R12;\n		let T121 = 1.0 - R12;\n		let phi12 = select( 0.0, PI, iridescenceIor < outsideIor );\n		let phi21 = PI - phi12;\n\n		// Second interface: iridescent thin film -> base material\n		let baseIor = fresnel0ToIor( clamp( baseF0, vec3( 0.0 ), vec3( 0.9999 ) ) ); // guard against 1.0\n		let R1 = iorToF0GeneralVec( baseIor, vec3( iridescenceIor ) );\n		var R23 = schlickFresnelVec( cosTheta2, R1, vec3( 1.0 ) );\n\n		// Handle total internal reflection at the film -> base interface\n		// NOTE: Added separately from the original implementation. Is this correct?\n		R23 = select( R23, vec3( 1.0 ), totalInternalReflectionVec( cosTheta2, vec3( iridescenceIor ) / baseIor ) );\n		let phi23 = select( vec3( 0.0 ), vec3( PI ), baseIor < vec3( iridescenceIor ) );\n\n		// Phase shift\n		let OPD = 2.0 * iridescenceIor * iridescenceThickness * cosTheta2;\n		let phi = vec3( phi21 ) + phi23;\n\n		// Analytical integration\n		// Compound terms\n		let R123 = clamp( R12 * R23, vec3( 1e-5 ), vec3( 0.9999 ) );\n		let r123 = sqrt( R123 );\n		let Rs = T121 * T121 * R23 / ( vec3( 1.0 ) - R123 );\n\n		// Reflectance term for m = 0 (DC term amplitude)\n		let C0 = R12 + Rs;\n		var I = C0;\n\n		// Reflectance term for m > 0 (pairs of diracs)\n		var Cm = Rs - T121;\n		for (var m = 1; m <= 2; m += 1) {\n\n			Cm *= r123;\n			let Sm = 2.0 * evalSensitivity( f32( m ) * OPD, f32( m ) * phi );\n			I += Cm * Sm;\n\n		}\n\n		return max( I, vec3(0.0) );\n\n	}\n\n", [
	dr,
	fr,
	mr,
	pr,
	Si,
	_r
]), wi = (e = Ci) => H`

	fn transmissionFresnel( cosTheta: f32, surf: ${G} ) -> ${Tn} {

		var result: ${Tn};
		let cosine = saturate( abs( cosTheta ) );
		let matchedIor = ${mi}( surf.eta );
		let airIncident = surf.thinWall || surf.frontFace;
		let dielectricFresnel = ${vr}( cosine, surf.eta );

		// Keep matched media transparent unless a real thin-film layer is present. This avoids
		// introducing the non-physical Schlick F90 reflection produced by KHR_materials_specular
		// when the substrate itself has no IOR boundary.
		var reflectance = vec3f( 0.0 );
		if ( ! matchedIor ) {

			let specularF0 = min( surf.f0 * surf.specularColor, vec3f( 1.0 ) );
			let dielectricReflectance = select(
				vec3f( dielectricFresnel ),
				${hr}( cosine, specularF0, vec3f( 1.0 ) ),
				airIncident,
			);
			reflectance = surf.specularIntensity * dielectricReflectance;

		}

		reflectance = clamp( reflectance, vec3f( 0.0 ), vec3f( 1.0 ) );
		var transmittance = vec3f( 1.0 ) - reflectance;

		if ( surf.iridescence > 0.0 ) {

			// The media on either side of the film are air outside and the volume interior as
			// the base. Swap them on interior hits so film-interface TIR remains possible.
			let outsideIor = select( surf.ior, 1.0, airIncident );
			let filmBaseIor = select( 1.0, surf.ior, airIncident );
			let filmReflectance = clamp( ${e}(
				cosine,
				vec3f( ${J}( filmBaseIor ) ),
				surf.iridescenceIor,
				outsideIor,
				surf.iridescenceThickness,
			), vec3f( 0.0 ), vec3f( 1.0 ) );

			reflectance = mix( reflectance, filmReflectance, surf.iridescence );
			transmittance = mix( transmittance, vec3f( 1.0 ) - filmReflectance, surf.iridescence );

		}

		result.reflectance = reflectance;
		result.transmittance = transmittance;

		// Include the base-color tint in the transmission energy, as Cycles does when it
		// computes the glass reflection probability from its two tinted coefficients.
		let reflectEnergy = dot( reflectance, vec3f( 1.0 / 3.0 ) );
		let transmissionTint = select( sqrt( surf.color ), surf.color, surf.thinWall );
		let transmitEnergy = dot( transmittance * transmissionTint, vec3f( 1.0 / 3.0 ) );
		let totalEnergy = reflectEnergy + transmitEnergy;
		result.reflectProbability = select( 0.0, reflectEnergy / max( totalEnergy, EPSILON ), totalEnergy > EPSILON );

		return result;

	}

`, Ti = g("\n\n	fn conductorFresnel( VdotH: f32, f0: vec3f, specular: vec3f ) -> vec3f {\n\n		return specular * schlickFresnelVec( abs( VdotH ), f0, vec3f( 1 ) );\n\n	}\n\n", [hr]), Ei = g("\n\n	fn fresnelCoat( VdotNc: f32, ior: f32, base: vec3f, layer: vec3f, weight: f32 ) -> vec3f {\n\n		let f0 = iorToF0( ior );\n		let F = schlickFresnel( abs( VdotNc ), f0 );\n\n		return mix( base, layer, weight * F );\n\n	}\n\n", [J, mr]), Di = (e) => H`

	fn albedo(
		eta: f32,
		includeFresnel: bool,
		includeRefraction: bool,
		globalId: vec3u,
		layer: u32,
	) -> void {

		// The matched-IOR limit is a unit-energy delta transmission event, so it cannot
		// be integrated with the rough BTDF below.
		if ( includeRefraction && ${mi}( eta ) ) {

			textureStore( ${e}, vec3( globalId.xy, layer ), vec4( 1.0 ) );
			return;

		}

		// sample the brdf directions in a grid pattern
		const GRID_SIZE = 64u;

		// TODO: this sampling means that energy at 0.0 & 1.0 roughness (and 0 and 90deg cos) are never
		// written to the texture due to the half texel inset, resulting in small, though possibly noticeable,
		// error in common cases.
		let dimensions = textureDimensions( ${e} ).xy;
		let uv = ( vec2f( globalId.xy ) + vec2f( 0.5 ) ) / vec2f( dimensions );

		let cosThetaO = uv.x;
		let roughness = uv.y;
		let alpha = roughness * roughness;

		let wo = vec3( sqrt( 1 - cosThetaO * cosThetaO ), 0 , cosThetaO );

		let f0 = ${J}( eta );

		var result = 0.0;
		for ( var x = 0u; x < GRID_SIZE; x++ ) {

			for ( var y = 0u; y < GRID_SIZE; y++ ) {

				// calculate the half vector to sample
				let gridPoint = vec2f( vec2u( x, y ) ) + vec2f( 0.5 );
				let sampleUv = gridPoint / f32( GRID_SIZE );
				let wh = ${ni}( wo, vec2( alpha ), sampleUv );

				var f = 1.0;
				if ( includeFresnel ) {

					// use the exact dielectric fresnel so the table agrees with the fresnel used
					// for lobe sampling
					f = ${vr}( dot( wo, wh ), eta );

				}

				// air-incident reflection is evaluated with schlick in bsdfEval - only the
				// volume-incident ( TIR ) glass reflection uses the exact fresnel
				var reflectionF = f;
				if ( eta < 1.0 ) {

					reflectionF = ${mr}( dot( wo, wh ), f0 );

				}

				// reflection lobe - samples landing below the surface are lost
				let wi = - reflect( wo, wh );
				let reflectionPdf = ${si}( wo, wh, vec2f( alpha ) );
				if ( wi.z > 0.0 && reflectionPdf != 0.0 ) {

					let specular = ${pi}( wo, wi, wh, vec2f( alpha ) );
					result += reflectionF * specular.x * wi.z / reflectionPdf;

				}

				// refraction lobe - the btdf carries its own ( 1 - F ) fresnel weight, and
				// samples landing back above the surface are lost
				if ( includeRefraction ) {

					let wiRefract = refract( - wo, wh, eta );
					if ( wiRefract.z < 0.0 ) {

						let transmission = ${hi}( wo, wiRefract, wh, vec2f( alpha ), eta );
						let pdf = ${ci}( wo, wiRefract, wh, vec2f( alpha ), eta );
						if ( pdf != 0.0 ) {

							result += transmission.x * abs( wiRefract.z ) / pdf;

						}

					}

				}

			}

		}

		result /= f32( GRID_SIZE * GRID_SIZE );

		textureStore( ${e}, vec3( globalId.xy, layer ), vec4( result ) );

	}

`, Oi = /* @__PURE__ */ e({
	rand1: () => Mi,
	rand2: () => Ni,
	rand3: () => Pi,
	rand4: () => Fi,
	rngInit: () => Ai,
	rngNextBounce: () => Ii
}), ki = n("\n\n	struct PcgState {\n		s0: vec4u,\n		s1: vec4u,\n	};\n\n	var<private> g_state: PcgState;\n"), Ai = g("\n	fn pcgInitialize( pixel: vec2u, pathIndex: u32, bounceIndex: u32 ) -> void {\n\n		// white noise seed\n		g_state.s0 = vec4u( pixel | vec2( bounceIndex << 16 ), pathIndex, pixel.x + pixel.y);\n\n		// blue noise seed\n		g_state.s1 = vec4u( pathIndex, pathIndex * 15843, pathIndex * 31 + 4566, pathIndex * 2345 + 58585 );\n\n	}\n", [ki]), ji = g("\n	fn pcg4d( v: ptr<private, vec4u> ) -> void {\n\n		*v = *v * 1664525u + 1013904223u;\n		*v = *v + v.yzxy * v.wxyz;\n		*v = *v ^ ( *v >> vec4u( 16u ) );\n		*v = *v + v.yzxy * v.wxyz;\n	}\n"), Mi = g("\n	fn pcgRand( _id: u32 ) -> f32 {\n\n		pcg4d( &g_state.s0 );\n		return abs( f32( g_state.s0.x ) / f32( 0xffffffffu ) );\n\n	}\n", [ji, ki]), Ni = g("\n	fn pcgRand2( _id: u32 ) -> vec2f {\n\n		pcg4d( &g_state.s0 );\n		return abs( vec2f( g_state.s0.xy ) / f32( 0xffffffffu ) );\n\n	}\n", [ji, ki]), Pi = g("\n	fn pcgRand3( _id: u32 ) -> vec3f {\n\n		pcg4d( &g_state.s0 );\n		return abs( vec3f( g_state.s0.xyz ) / f32( 0xffffffffu ) );\n\n	}\n", [ji, ki]), Fi = g("\n	fn pcgRand4( _id: u32 ) -> vec4f {\n\n		pcg4d( &g_state.s0 );\n		return abs( vec4f( g_state.s0 ) / f32( 0xffffffffu ) );\n\n	}\n", [ji, ki]), Ii = g("fn noop() -> void {}");
// node_modules/three-gpu-pathtracer/src/textures/blueNoise/utils.js
function Li(e, t = Math.random) {
	for (let n = e.length - 1; n > 0; n--) {
		let r = ~~((t() - 1e-6) * n), i = e[n];
		e[n] = e[r], e[r] = i;
	}
}
function Ri(e, t) {
	e.fill(0);
	for (let n = 0; n < t; n++) e[n] = 1;
}
// node_modules/three-gpu-pathtracer/src/textures/blueNoise/BlueNoiseSamples.js
var zi = class {
	constructor(e) {
		this.count = 0, this.size = -1, this.sigma = -1, this.radius = -1, this.lookupTable = null, this.score = null, this.binaryPattern = null, this.resize(e), this.setSigma(1.5);
	}
	findVoid() {
		let { score: e, binaryPattern: t } = this, n = Infinity, r = -1;
		for (let i = 0, a = t.length; i < a; i++) {
			if (t[i] !== 0) continue;
			let a = e[i];
			a < n && (n = a, r = i);
		}
		return r;
	}
	findCluster() {
		let { score: e, binaryPattern: t } = this, n = -Infinity, r = -1;
		for (let i = 0, a = t.length; i < a; i++) {
			if (t[i] !== 1) continue;
			let a = e[i];
			a > n && (n = a, r = i);
		}
		return r;
	}
	setSigma(e) {
		if (e === this.sigma) return;
		let t = ~~(Math.sqrt(20 * e ** 2) + 1), n = 2 * t + 1, r = new Float32Array(n * n), i = e * e;
		for (let e = -t; e <= t; e++) for (let a = -t; a <= t; a++) {
			let o = (t + a) * n + e + t, s = e * e + a * a;
			r[o] = Math.E ** (-s / (2 * i));
		}
		this.lookupTable = r, this.sigma = e, this.radius = t;
	}
	resize(e) {
		this.size !== e && (this.size = e, this.score = new Float32Array(e * e), this.binaryPattern = new Uint8Array(e * e));
	}
	invert() {
		let { binaryPattern: e, score: t, size: n } = this;
		t.fill(0);
		for (let t = 0, r = e.length; t < r; t++) if (e[t] === 0) {
			let r = ~~(t / n), i = t - r * n;
			this.updateScore(i, r, 1), e[t] = 1;
		} else e[t] = 0;
	}
	updateScore(e, t, n) {
		let { size: r, score: i, lookupTable: a } = this, o = this.radius, s = 2 * o + 1;
		for (let c = -o; c <= o; c++) for (let l = -o; l <= o; l++) {
			let u = a[(o + l) * s + c + o], d = e + c;
			d = d < 0 ? r + d : d % r;
			let f = t + l;
			f = f < 0 ? r + f : f % r;
			let p = f * r + d;
			i[p] += n * u;
		}
	}
	addPointIndex(e) {
		this.binaryPattern[e] = 1;
		let t = this.size, n = ~~(e / t), r = e - n * t;
		this.updateScore(r, n, 1), this.count++;
	}
	removePointIndex(e) {
		this.binaryPattern[e] = 0;
		let t = this.size, n = ~~(e / t), r = e - n * t;
		this.updateScore(r, n, -1), this.count--;
	}
	copy(e) {
		this.resize(e.size), this.score.set(e.score), this.binaryPattern.set(e.binaryPattern), this.setSigma(e.sigma), this.count = e.count;
	}
}, Bi = class {
	constructor() {
		this.random = Math.random, this.sigma = 1.5, this.size = 64, this.majorityPointsRatio = .1, this.samples = new zi(1), this.savedSamples = new zi(1);
	}
	generate() {
		let { samples: e, savedSamples: t, sigma: n, majorityPointsRatio: r, size: i } = this;
		e.resize(i), e.setSigma(n);
		let a = Math.floor(i * i * r), o = e.binaryPattern;
		Ri(o, a), Li(o, this.random);
		for (let t = 0, n = o.length; t < n; t++) o[t] === 1 && e.addPointIndex(t);
		for (;;) {
			let t = e.findCluster();
			e.removePointIndex(t);
			let n = e.findVoid();
			if (t === n) {
				e.addPointIndex(t);
				break;
			}
			e.addPointIndex(n);
		}
		let s = new Uint32Array(i * i);
		t.copy(e);
		let c;
		for (c = e.count - 1; c >= 0;) {
			let t = e.findCluster();
			e.removePointIndex(t), s[t] = c, c--;
		}
		let l = i * i;
		for (c = t.count; c < l / 2;) {
			let e = t.findVoid();
			t.addPointIndex(e), s[e] = c, c++;
		}
		for (t.invert(); c < l;) {
			let e = t.findCluster();
			t.removePointIndex(e), s[e] = c, c++;
		}
		return {
			data: s,
			maxValue: l
		};
	}
};
// node_modules/three-gpu-pathtracer/src/textures/BlueNoiseTexture.js
function Vi(e) {
	return e >= 3 ? 4 : e;
}
function Hi(e) {
	switch (e) {
		case 1: return Qe;
		case 2: return Ge;
		default: return P;
	}
}
var Ui = class extends M {
	constructor(e = 64, t = 1) {
		super(/* @__PURE__ */ new Float32Array(4), 1, 1, P, et), this.minFilter = $e, this.magFilter = $e, this.size = e, this.channels = t, this.update();
	}
	update() {
		let e = this.channels, t = this.size, n = new Bi();
		n.channels = e, n.size = t;
		let r = Vi(e), i = Hi(r);
		(this.image.width !== t || i !== this.format) && (this.image.width = t, this.image.height = t, this.image.data = new Float32Array(t ** 2 * r), this.format = i, this.dispose());
		let a = this.image.data;
		for (let t = 0, i = e; t < i; t++) {
			let e = n.generate(), i = e.data, o = e.maxValue;
			for (let e = 0, n = i.length; e < n; e++) {
				let n = i[e] / o;
				a[e * r + t] = n;
			}
		}
		this.needsUpdate = !0;
	}
}, Wi = /* @__PURE__ */ e({
	rand1: () => ea,
	rand2: () => $i,
	rand3: () => Qi,
	rand4: () => Zi,
	rngInit: () => Yi,
	rngNextBounce: () => Xi
}), Gi = 64, Ki = new Ui(Gi, 1), qi = E(Ki), Ji = de(0).toVar("blueDitherSeed"), Yi = H`
	fn blueDitherInitialize( pixel: vec2u, pathIndex: u32, bounceIndex: u32 ) -> void {

		let coord = vec2i( pixel % vec2u( ${Gi}u ) );
		${Ji} = textureLoad( ${qi}, coord, 0 );
		${rr}( vec2u( 0 ), pathIndex, bounceIndex );

	}
`, Xi = H`
	fn blueDitherNextBounce() -> void {

		${ir}();

	}
`, Zi = H`
	fn blueDitherRand4( effect: u32 ) -> vec4f {

		// Get the scrambled sobol stratified sample
		let stratifiedSample = ${nr}( effect );

		// offset it by the blue noise seed and dimension rotation
		return fract( stratifiedSample + ${Ji}.r );

	}
`, Qi = H`
	fn blueDitherRand3( effect: u32 ) -> vec3f {

		return ${Zi}( effect ).xyz;

	}
`, $i = H`
	fn blueDitherRand2( effect: u32 ) -> vec2f {

		return ${Zi}( effect ).xy;

	}
`, ea = H`
	fn blueDitherRand1( effect: u32 ) -> f32 {

		return ${Zi}( effect ).x;

	}
`, ta = Oi, na = Bn, ra = Wi, ia = 0, aa = 1, oa = 2, sa = 2147483648, ca = 1073741824, la = 1073741823, ua = class extends U {
	constructor() {
		let e = {
			material: { value: null },
			envInfo: { value: null },
			lightsInfo: { value: null },
			prevOutputTarget: T(In()).toReadOnly(),
			outputTarget: T(In()).toWriteOnly(),
			sampleCountTarget: T(Ln()).toReadWrite(),
			offset: f(new A()),
			tileSize: f(new A()),
			seed: f(0),
			maxBounces: f(5),
			maxTransparentBounces: f(5, "uint"),
			maxSubsurfaceBounces: f(256, "uint"),
			misEnabled: f(1, "uint"),
			maxSamples: f(0, "uint"),
			filterGlossy: f(1),
			clampDirect: f(0),
			clampIndirect: f(10),
			backgroundInfo: { value: null },
			transmissiveBackground: f(1),
			accumulateAux: f(0, "uint"),
			auxTarget: T(Rn()).toReadWrite(),
			textures: E(new M()),
			textureSampler: h(new M()),
			globalId: y
		}, t = z("bvhData.fns.raycastFirstHit.outputType"), n = B("bvhData.fns.raycastFirstHit"), r = B("bvhData.fns.raycastShadow"), i = B("bvhData.fns.sampleTrianglePoint"), a = B("bvhData.fns.getSurfaceRecord"), o = B("bvhData.fns.getCameraRay"), s = R("material.value.bsdfSample", e), c = R("material.value.bsdfEvalPdf", e), l = z("bvhData.storage.materials"), u = z("bvhData.storage.transforms"), d = L("envInfo.value.totalSumNode", e), p = L("envInfo.value.intensityNode", e), m = L("envInfo.value.sampleColor", e), g = L("envInfo.value.sampleDir", e), _ = L("envInfo.value.getDirPdf", e), v = L("envInfo.value.getWeight", e), b = L("backgroundInfo.value.sampleColor", e), x = L("lightsInfo.value.countNode", e), S = R("lightsInfo.value.randomLightSample", e), ee = R("lightsInfo.value.intersectLightAtIndex", e), C = R("lightsInfo.value.getLightWeight", e), w = R("lightsInfo.value.getLightsWeight", e), te = R("lightsInfo.value.selectLight", e), D = R("lightsInfo.value.isLightVisibleToCamera", e), ne = H`

			fn compute(

				// indices and target
				globalId: vec3u,

				// tiles
				offset: vec2u,
				tileSize: vec2u,

				// settings
				seed: u32,
				maxBounces: u32,
				maxTransparentBounces: u32,
				maxSubsurfaceBounces: u32,
				misEnabled: u32,
				maxSamples: u32,
				filterGlossy: f32,
				clampDirect: f32,
				clampIndirect: f32,

				transmissiveBackground: u32,
				accumulateAux: u32,

			) -> void {

				// make sure we don't bleed over the edge of our tile
				if ( globalId.x >= tileSize.x || globalId.y >= tileSize.y ) {

					return;

				}

				// to screen coordinates
				let indexUV = offset + globalId.xy;
				let targetDimensions = textureDimensions( ${e.outputTarget} );
				if ( indexUV.x >= targetDimensions.x || indexUV.y >= targetDimensions.y ) {

					return;

				}

				// skip the pixel once it has hit the sample limit
				let sampleCount = textureLoad( ${e.sampleCountTarget}, indexUV ).r;
				if ( maxSamples != 0u && sampleCount >= maxSamples ) {

					return;

				}

				let uv = vec2f( indexUV ) / vec2f( targetDimensions );
				${ar}( indexUV.xy, seed, 0 );

				// scene ray
				let jitteredUv = uv + ${q}( ${0} ) / vec2f( targetDimensions );
				var ray: ${I};
				if ( ! ${o}( jitteredUv, vec2f( targetDimensions ), &ray ) ) {

					// a declined pixel never takes a sample, so with a cap it counts as finished
					if ( maxSamples != 0u ) {

						textureStore( ${e.sampleCountTarget}, indexUV, vec4( maxSamples ) );

					}

					return;

				}

				ray.direction = normalize( ray.direction );

				var resultColor = vec4f( 0, 0, 0, 1 );
				var throughputColor = vec3f( 1.0 );
				var bsdfPdf = 0.0;

				// Alpha pass throughs only move where the BVH traversal starts, "rayStart" along the ray, so the
				// ray keeps the origin it scattered from, which its MIS weights are measured from
				var rayStart = 0.0;
				var traceOrigin = ray.origin;
				var isFullyTransmissive = true;
				var minPdf = 1.0;
				var transparentBounce = 0u;

				// the scattering volume the path is in. Media don't nest
				var medium: ${Jr};
				var subsurfaceBounces = 0u;

				// no light is sampled at a scatter event, so whatever the next segment reaches takes full weight
				var mediumScattered = false;

				// A negative value marks a sampled wavelength whose RGB reconstruction weight has not been applied yet.
				var dispersionWavelength = - mix( ${360}.0, ${830}.0, ${sr}( ${7} ) );

				// one-sample NEE chooses between the analytic lights and the environment
				let envActive = ${d} > 0.0 && ${p} > 0.0;
				let lightsCount = ${x};
				var envWeight = 0.0;
				if ( envActive ) {

					envWeight = ${v}();

				}

				// added last, since a camera ray miss overwrites the pixel with the background
				var lightHits = vec3f( 0.0 );
				var cameraHitLight = false;

				// The first surface the path scatters off fills the denoiser's auxiliary images. Until one is found
				// the last mirror or transmission hit stands in, for paths that reach the environment. The albedo
				// is tinted by the throughput of the surfaces looked past to reach it
				var auxFound = false;
				var auxAlbedo = vec3f( 0.0 );
				var auxNormal = vec3f( 0.0 );

				for ( var bounce = 0u; bounce < maxBounces; bounce ++ ) {

					// Inside a medium, sample a scatter event before the next surface and only trace up to it
					var channelPdf = vec3f( 0.0 );
					var scatterDist = 0.0;
					var traceRay = ray;
					traceRay.origin = traceOrigin;
					if ( medium.inside ) {

						channelPdf = ${$r}( throughputColor, medium.albedo );
						scatterDist = ${ei}( medium, channelPdf, ${q}( ${8} ) );
						traceRay.maxDist = select( scatterDist, min( ray.maxDist, scatterDist ), ray.maxDist > 0.0 );

					}

					var hitResult: ${t};
					let didHit = ${n}( traceRay, &hitResult );
					let surfaceDist = select( ${Fr}, hitResult.dist, didHit );

					let segmentInMedium = medium.inside;
					if ( medium.inside ) {

						let scattered = scatterDist < surfaceDist;
						let segmentDist = select( surfaceDist, scatterDist, scattered );
						let transmittance = exp( - medium.extinction * segmentDist );
						let distancePdf = dot( channelPdf, ${ti}( medium, segmentDist, scattered ) );
						if ( distancePdf <= 0.0 ) {

							break;

						}

						if ( ! scattered ) {

							// reaching the surface, weighted by the probability of no scatter event before it
							throughputColor *= transmittance / distancePdf;

						} else {

							throughputColor *= medium.albedo * medium.extinction * transmittance / distancePdf;
							ray.origin = traceOrigin + ray.direction * scatterDist;
							traceOrigin = ray.origin;
							rayStart = 0.0;
							ray.direction = ${Ar}( ray.direction, medium.anisotropy, ${q}( ${9} ) );
							ray.maxDist = 0.0;
							mediumScattered = true;
							isFullyTransmissive = false;

							// subsurface bounces are capped separately from bounces
							subsurfaceBounces ++;
							let maxThroughput = max( max( throughputColor.r, throughputColor.g ), throughputColor.b );
							if ( subsurfaceBounces >= maxSubsurfaceBounces || maxThroughput < ${Kr} ) {

								break;

							}

							${or}();
							bounce --;
							continue;

						}

					}

					// NEE's total weight at the vertex this ray left, for MIS. Camera rays have none, and
					// neither do scatter events in a medium
					let isMISWeighted = misEnabled != 0u && bounce > 0u && ! mediumScattered;
					var lightTotalWeight = 0.0;
					if ( isMISWeighted ) {

						lightTotalWeight = ${w}( ray.origin ) + envWeight;

					}

					// forward hits on area lights along the traced segment. Camera rays only see visibleToCameraRays
					// lights, at full weight
					for ( var li = 0u; li < lightsCount; li ++ ) {

						if ( bounce == 0u && ! ${D}( li ) ) {

							continue;

						}

						var lightRec: ${kn};
						if ( ${ee}( ray.origin, ray.direction, li, &lightRec ) && lightRec.dist > rayStart && lightRec.dist < rayStart + surfaceDist ) {

							var misWeight = 1.0;
							if ( isMISWeighted ) {

								let selectionPdf = ${C}( li, ray.origin ) / lightTotalWeight;
								misWeight = ${jr}( bsdfPdf, lightRec.pdf * selectionPdf );

							}

							lightHits += ${Y}( lightRec.emission * throughputColor * misWeight, bounce, clampDirect, clampIndirect );
							cameraHitLight = cameraHitLight || bounce == 0u;

						}

					}

					if ( didHit ) {

						// whole structs are read from the buffer, not a pointer alias, which Safari fails to compile
						let objectInfo = ${u}[ hitResult.objectIndex ];
						var materialInfo = ${l}[ objectInfo.materialIndex ];

						// a matte surface hit by the camera ray renders as a fully transparent
						if ( materialInfo.matte != 0 && bounce == 0u ) {

							resultColor = vec4f( 0.0 );
							break;

						}

						// apply per-object colors
						materialInfo.color *= objectInfo.color.rgb;
						materialInfo.opacity *= objectInfo.color.a;

						let view = - ray.direction;
						var vertexData = ${i}( hitResult.barycoord, hitResult.indices.xyz );
						vertexData.normal = normalize( transpose( objectInfo.inverseMatrixWorld ) * vertexData.normal );
						vertexData.tangent = vec4f( ( objectInfo.matrixWorld * vec4f( vertexData.tangent.xyz, 0.0 ) ).xyz, vertexData.tangent.w );
						vertexData.position = objectInfo.matrixWorld * vertexData.position;

						// blur glossy surfaces after low-probability bounces to suppress fireflies,
						// from the Cycles "filter glossy" approach in integrator/surface_shader.h
						// The smallest pdf seen along the path for the glossy filter is tracked below
						let blurRoughness = sqrt( clamp( 1.0 - filterGlossy * minPdf, 0.0, 1.0 ) ) * 0.5;

						var surface = ${a}( materialInfo, vertexData, hitResult.side, hitResult.normal, view, blurRoughness );

						// Stochastically pass through partially transparent surfaces by restarting
						// the traversal at the hit point, advancing the rng but not the bounce count.
						if ( ${sr}( ${50} ) > surface.opacity ) {

							// stop once the transparent bounces run out
							if ( transparentBounce >= maxTransparentBounces ) {

								break;

							}

							traceOrigin = ${Sr}( vertexData.position.xyz, ray.direction, hitResult.normal );
							rayStart += hitResult.dist;
							${or}();
							transparentBounce ++;
							bounce --;
							continue;

						}

						let isDispersive = materialInfo.dispersion > 0.0 && surface.ior > 1.0 && surface.transmission > 0.0 && ! surface.thinWall;
						if ( isDispersive ) {

							let wavelength = abs( dispersionWavelength );
							${vi}( &surface, materialInfo.dispersion, wavelength );
							if ( dispersionWavelength < 0.0 ) {

								dispersionWavelength = wavelength;
								throughputColor *= ${yi}( wavelength );

							}

						}

						// attenuate the light transmitted through the volume when exiting a backface. A scattering
						// medium has already applied its transmittance above
						if ( hitResult.side < 0.0 && materialInfo.transmission > 0.0 && ! segmentInMedium ) {

							throughputColor *= ${_i}( hitResult.dist, materialInfo.attenuationColor, materialInfo.attenuationDistance );

						}

						// emission, clamped at the depth of the segment that found it, as in Cycles
						let emission = ${Y}( throughputColor * surface.emission, bounce, clampDirect, clampIndirect );
						resultColor += vec4f( emission, 0.0 );

						// next event estimation: choose one light or the environment by its estimated
						// contribution
						if ( misEnabled != 0u ) {

							let ruv = ${cr}( ${5} );
							var selectionPdf = 0.0;
							let lightIndex = ${te}( vertexData.position.xyz, envWeight, ruv.x, &selectionPdf );
							if ( selectionPdf > 0.0 ) {

								var lightRec: ${kn};
								if ( envActive && lightIndex == lightsCount ) {

									// the environment, sampled from its CDF, as a light of kind ENVIRONMENT
									let envSample = ${g}( ruv.yz );
									lightRec.direction = envSample.direction;
									lightRec.emission = envSample.color;
									lightRec.pdf = envSample.pdf;
									lightRec.dist = ${Fr};
									lightRec.lightType = ${5};

								} else {

									lightRec = ${S}( lightIndex, vertexData.position.xyz, ruv.yz );

								}

								if ( lightRec.pdf > 0.0 ) {

									let evalRec = ${c}( view, lightRec.direction, surface );
									if ( evalRec.pdf > 0.0 ) {

										var shadowRay: ${I};
										shadowRay.origin = ${Sr}( vertexData.position.xyz, lightRec.direction, hitResult.normal );
										shadowRay.direction = lightRec.direction;
										shadowRay.maxDist = lightRec.dist * ( 1.0 - ${Ir} );

										// opaque occlusion up to the light distance, attenuated by the partially
										// transparent surfaces passed
										var shadowHit: ${t};
										let occluded = ${r}( shadowRay, &shadowHit );
										if ( ! occluded ) {

											let lightPdf = lightRec.pdf * selectionPdf;

											// env + area lights are also found by bsdf rays, so MIS-weight them. Punctual lights, and lights
											// past the bounce limit, take full weight. Bsdf rays stopped by faces the shadow ray skipped can't
											// find the light, so their share of the weight moves to the light sample
											let isMISWeighted = ${Lr}( lightRec.lightType ) && bounce + 1u < maxBounces;
											let misWeight = select( 1.0, mix( ${jr}( lightPdf, evalRec.pdf ), 1.0, shadowHit.skippedOcclusion ), isMISWeighted );
											let directLight = throughputColor * lightRec.emission * evalRec.color * misWeight * ( 1.0 - shadowHit.occlusion ) / lightPdf;
											let contribution = ${Y}( directLight, bounce + 1u, clampDirect, clampIndirect );
											resultColor += vec4f( contribution, 0.0 );

										}

									}

								}

							}

						}

						let scatterRec = ${s}( view, surface );

						if ( ! auxFound ) {

							auxFound = ${Mn}( surface, scatterRec );
							auxAlbedo = saturate( throughputColor * surface.color );
							auxNormal = surface.normal;

						}

						if ( ${br}( scatterRec ) ) {

							break;

						}

						isFullyTransmissive = isFullyTransmissive && scatterRec.isTransmissive;

						// track the smallest pdf seen along the path for the glossy filter
						minPdf = min( minPdf, scatterRec.pdf );

						// russian roulette early out:
						// Matches Cycles path_state_continuation_probability in integrator/path_state.h
						if ( bounce >= 3u ) {

							let rrThroughput = throughputColor * scatterRec.color / scatterRec.pdf;
							let rrProb = saturate( sqrt( max( max( rrThroughput.r, rrThroughput.g ), rrThroughput.b ) ) );
							if ( rrProb <= 0.0 || ${sr}( ${6} ) > rrProb ) {

								break;

							}

							throughputColor /= rrProb;

						}

						throughputColor *= scatterRec.color;
						throughputColor /= scatterRec.pdf;
						bsdfPdf = scatterRec.pdf;
						mediumScattered = false;

						// As in "KHR_materials_scatter", the medium's surface bsdf is its boundary: the walk ends when
						// light refracts out through it, and continues inside when it reflects back
						if ( segmentInMedium && hitResult.objectIndex == medium.object && hitResult.side < 0.0 && scatterRec.isTransmissive ) {

							medium.inside = false;

						}

						// refracting into a front face of a scattering material starts a random walk inside it
						if ( scatterRec.isTransmissive && ! surface.thinWall && hitResult.side > 0.0 ) {

							let entered = ${Qr}( materialInfo, hitResult.objectIndex );

							if ( entered.inside ) {

								medium = entered;

							}

						}

						// exit if our throughput is 0.0
						if ( all( throughputColor == vec3f( 0.0 ) ) ) {

							break;

						}

						ray.origin = ${Sr}( vertexData.position.xyz, scatterRec.direction, hitResult.normal );
						ray.direction = scatterRec.direction;
						ray.maxDist = 0.0;
						traceOrigin = ray.origin;
						rayStart = 0.0;

					} else {

						if ( bounce > 0u && ! isFullyTransmissive ) {

							var misWeight = 1.0;
							if ( isMISWeighted && envActive ) {

								// match the env pdf scaling used by the NEE selection so the two estimators balance
								let envPdf = ${_}( ray.direction ) * envWeight / lightTotalWeight;
								misWeight = ${jr}( bsdfPdf, envPdf );

							}

							let environment = ${m}( ray.direction ).rgb * throughputColor * misWeight;
							let contribution = ${Y}( environment, bounce, clampDirect, clampIndirect );
							resultColor += vec4f( contribution, 0.0 );

						} else {

							// hit the background
							// support multiple transparent background blending techniques
							let rng = ${q}( ${1} );
							let bg = ${b}( ray.direction, rng );
							if ( bounce == 0u ) {

								// sample the background directly if this is the primary ray
								let background = ${Y}( bg.a * bg.rgb, bounce, clampDirect, clampIndirect );
								resultColor = vec4f( background, bg.a );

							} else {

								// transmissive ray handling
								let env = ${m}( ray.direction );
								let avg = saturate( dot( throughputColor, vec3f( 1.0 / 3.0 ) ) );
								let transparency = ( 1.0 - bg.a ) * avg;
								var envMisWeight = 1.0;
								if ( misEnabled != 0u && ${d} > 0.0 ) {

									let envPdf = ${_}( ray.direction );
									envMisWeight = ${jr}( bsdfPdf, envPdf );

								}

								if ( transmissiveBackground == ${0}u ) {

									// display the env map through transmissive surfaces
									let background = ${Y}( env.rgb * throughputColor * envMisWeight, bounce, clampDirect, clampIndirect );
									resultColor = vec4f(
										resultColor.rgb + background,
										1.0,
									);

								} else if ( transmissiveBackground == ${2}u ) {

									// fade the background by the throughput color average
									let background = ${Y}( bg.a * bg.rgb * throughputColor * envMisWeight, bounce, clampDirect, clampIndirect );
									resultColor = vec4f(
										resultColor.rgb + background,
										1.0 - transparency,
									);

								} else {

									// fade the background by the throughput color average, mixing in env lighting
									var light = mix( env.rgb, bg.rgb, bg.a ) * envMisWeight;
									let background = ${Y}( light * throughputColor, bounce, clampDirect, clampIndirect );
									resultColor = vec4f(
										resultColor.rgb + background,
										1.0 - transparency,
									);

								}

							}

						}

						break;

					}

					${or}();

				}

				// visible lights are opaque against a transparent background
				resultColor += vec4f( lightHits, 0.0 );
				if ( cameraHitLight ) {

					resultColor.a = 1.0;

				}

				let nextSampleCount = sampleCount + 1;
				// store the color rows top down to match a rasterized render target
				let colorIndex = vec2u( indexUV.x, targetDimensions.y - 1u - indexUV.y );

				let prevColor = textureLoad( ${e.prevOutputTarget}, colorIndex );
				let blendedColor = ${Pr}( prevColor, resultColor, 1.0 / f32( nextSampleCount ) );
				textureStore( ${e.sampleCountTarget}, indexUV, vec4( nextSampleCount ) );
				textureStore( ${e.outputTarget}, colorIndex, blendedColor );

				// the auxiliary images are blended the same way, in the same row order
				if ( accumulateAux != 0u ) {

					var auxPacked: vec3u;
					for ( var layer = 0u; layer < ${3}u; layer ++ ) {

						auxPacked[ layer ] = textureLoad( ${e.auxTarget}, colorIndex, layer ).r;

					}

					auxPacked = ${Fn}( auxPacked, auxAlbedo, auxNormal, 1.0 / f32( nextSampleCount ) );
					for ( var layer = 0u; layer < ${3}u; layer ++ ) {

						textureStore( ${e.auxTarget}, colorIndex, layer, vec4u( auxPacked[ layer ] ) );

					}

				}

			}`;
		super(ne(e)), this.defineUniformAccessors(e);
	}
};
// node_modules/three-gpu-pathtracer/src/utils/TextureUtils.js
function da(e) {
	let t = new Uint16Array(e.length);
	for (let n = 0, r = e.length; n < r; ++n) t[n] = j.toHalfFloat(e[n]);
	return t;
}
// node_modules/three-gpu-pathtracer/src/uniforms/EquirectHdrInfoUniform.js
function fa(e, t, n = 0, r = e.length) {
	let i = n, a = n + r - 1;
	for (; i < a;) {
		let n = i + a >> 1;
		e[n] < t ? i = n + 1 : a = n;
	}
	return i - n;
}
function pa(e, t, n) {
	return .2126 * e + .7152 * t + .0722 * n;
}
function ma(e, t = Pe) {
	let n = e.clone();
	n.source = new Ue({ ...n.image });
	let { width: r, height: i, data: a } = n.image, o = a;
	if (n.type !== t) {
		o = t === 1016 ? new Uint16Array(a.length) : new Float32Array(a.length);
		let e;
		e = a instanceof Int8Array || a instanceof Int16Array || a instanceof Int32Array ? 2 ** (8 * a.BYTES_PER_ELEMENT - 1) - 1 : 2 ** (8 * a.BYTES_PER_ELEMENT) - 1;
		for (let r = 0, i = a.length; r < i; r++) {
			let i = a[r];
			n.type === 1016 && (i = j.fromHalfFloat(a[r])), n.type !== 1015 && n.type !== 1016 && (i /= e), t === 1016 && (o[r] = j.toHalfFloat(i));
		}
		n.image.data = o, n.type = t;
	}
	if (n.flipY) {
		let e = o;
		o = o.slice();
		for (let t = 0; t < i; t++) for (let n = 0; n < r; n++) {
			let a = i - t - 1, s = 4 * (t * r + n), c = 4 * (a * r + n);
			o[c + 0] = e[s + 0], o[c + 1] = e[s + 1], o[c + 2] = e[s + 2], o[c + 3] = e[s + 3];
		}
		n.flipY = !1, n.image.data = o;
	}
	return n;
}
var ha = class {
	constructor() {
		let e = new M(da(new Float32Array([
			0,
			0,
			0,
			0
		])), 1, 1);
		e.type = Pe, e.format = P, e.minFilter = k, e.magFilter = k, e.wrapS = Je, e.wrapT = Je, e.generateMipmaps = !1, e.needsUpdate = !0;
		let t = new M(da(new Float32Array([0, 1])), 1, 2);
		t.type = Pe, t.format = Qe, t.minFilter = k, t.magFilter = k, t.generateMipmaps = !1, t.needsUpdate = !0;
		let n = new M(da(new Float32Array([
			0,
			0,
			1,
			1
		])), 2, 2);
		n.type = Pe, n.format = Qe, n.minFilter = k, n.magFilter = k, n.generateMipmaps = !1, n.needsUpdate = !0, this.map = e, this.marginalWeights = t, this.conditionalWeights = n, this.totalSum = 0;
	}
	getPixelWeight(e, t, n) {
		return pa(e, t, n);
	}
	dispose() {
		this.marginalWeights.dispose(), this.conditionalWeights.dispose(), this.map.dispose();
	}
	updateFrom(e) {
		let t = ma(e);
		t.wrapS = Je, t.wrapT = Ie;
		let { width: n, height: r, data: i } = t.image, a = new Float32Array(n * r), o = new Float32Array(n * r), s = new Float32Array(r), c = new Float32Array(r), l = 0, u = 0;
		for (let e = 0; e < r; e++) {
			let t = 0;
			for (let s = 0; s < n; s++) {
				let c = e * n + s, u = j.fromHalfFloat(i[4 * c + 0]), d = j.fromHalfFloat(i[4 * c + 1]), f = j.fromHalfFloat(i[4 * c + 2]), p = this.getPixelWeight(u, d, f, e, r);
				t += p, l += p, a[c] = p, o[c] = t;
			}
			if (t !== 0) for (let r = e * n, i = e * n + n; r < i; r++) a[r] /= t, o[r] /= t;
			u += t, s[e] = t, c[e] = u;
		}
		if (u !== 0) for (let e = 0, t = s.length; e < t; e++) s[e] /= u, c[e] /= u;
		let d = new Uint16Array(r), f = new Uint16Array(n * r);
		for (let e = 0; e < r; e++) {
			let t = fa(c, (e + 1) / r);
			d[e] = j.toHalfFloat((t + .5) / r);
		}
		for (let e = 0; e < r; e++) for (let t = 0; t < n; t++) {
			let r = e * n + t, i = fa(o, (t + 1) / n, e * n, n);
			f[r] = j.toHalfFloat((i + .5) / n);
		}
		this.dispose();
		let { marginalWeights: p, conditionalWeights: m } = this;
		p.image = {
			width: r,
			height: 1,
			data: d
		}, p.needsUpdate = !0, m.image = {
			width: n,
			height: r,
			data: f
		}, m.needsUpdate = !0, this.totalSum = l, this.map = t, this.cdfMarginal = c, this.cdfConditional = o;
	}
}, ga = class extends ha {
	constructor() {
		super(), this.mapNode = E(this.map), this.mapSampler = h(this.mapNode), this.cdfNode = i(new D(new Float32Array([
			0,
			1,
			0,
			1
		]), 1), "float").toReadOnly(), this.rotationNode = f(new je()), this.intensityNode = f(1), this.totalSumNode = f(this.totalSum), this._initFns();
	}
	getPixelWeight(e, t, n, r, i) {
		let a = Math.PI * (r + .5) / i;
		return super.getPixelWeight(e, t, n) * Math.sin(a);
	}
	updateFrom(e) {
		super.updateFrom(e);
		let { mapNode: t, cdfNode: n, totalSumNode: r } = this;
		t.value = this.map, r.value = this.totalSum;
		let { width: i, height: a } = this.map.image, { cdfMarginal: o, cdfConditional: s } = this, c = new Float32Array(a + 1 + a * (i + 1));
		c.set(o, 1);
		for (let e = 0; e < a; e++) c.set(s.subarray(e * i, e * i + i), a + 1 + e * (i + 1) + 1);
		n.value = new D(c, 1);
	}
	dispose() {
		super.dispose(), this.cdfNode.value.dispose();
	}
	_initFns() {
		let { mapNode: e, mapSampler: t, cdfNode: n, totalSumNode: r, rotationNode: i, intensityNode: a } = this, o = H`
			fn searchEnvCdf( r: f32, offset: u32, count: u32, fraction: ptr<function, f32> ) -> u32 {

				var lower = 0u;
				var upper = count - 1u;
				while ( lower < upper ) {

					let mid = ( lower + upper ) >> 1u;
					if ( ${n}[ offset + mid + 1u ] <= r ) {

						lower = mid + 1u;

					} else {

						upper = mid;

					}

				}

				let start = ${n}[ offset + lower ];
				let end = ${n}[ offset + lower + 1u ];
				*fraction = select( 0.5, saturate( ( r - start ) / ( end - start ) ), end > start );
				return lower;

			}
		`, s = H`
			fn getEnvTexelPdf( texel: vec2u, v: f32 ) -> f32 {

				let resolution = textureDimensions( ${e} );
				let rowOffset = resolution.y + 1u + texel.y * ( resolution.x + 1u );
				let rowPdf = ${n}[ texel.y + 1u ] - ${n}[ texel.y ];
				let pixelPdf = ${n}[ rowOffset + texel.x + 1u ] - ${n}[ rowOffset + texel.x ];

				// the equirect projection stretches each pixel by 1 / sin( theta ) over the sphere
				let sinTheta = sin( ${S} * v );
				return select( 0.0, rowPdf * pixelPdf * f32( resolution.x * resolution.y ) / ( 2.0 * ${S} * ${S} * sinTheta ), sinTheta > 0.0 );

			}
		`;
		this.sampleColor = H`
			fn sampleEnv( direction: vec3f ) -> vec4f {

				let sampleDir = ${i} * direction;
				let mapUv = ${Or}( sampleDir );
				let col = textureSampleLevel( ${e}, ${t}, mapUv, 0 );

				return vec4f( ${a} * col.rgb, col.a );

			}
		`, this.sampleDir = H`
			fn sampleEnvDir( r: vec2f ) -> ${Dn} {

				var result: ${Dn};

				// search the CDFs: marginal picks the row (v), conditional picks the column (u), and the
				// fractions place the sample within the pixel
				let resolution = textureDimensions( ${e} );
				var rowFraction = 0.0;
				var columnFraction = 0.0;
				let row = ${o}( r.x, 0u, resolution.y, &rowFraction );
				let column = ${o}( r.y, resolution.y + 1u + row * ( resolution.x + 1u ), resolution.x, &columnFraction );
				let texel = vec2u( column, row );
				let uv = ( vec2f( texel ) + vec2f( columnFraction, rowFraction ) ) / vec2f( resolution );

				let direction = ${Nr}( uv );
				let color = textureSampleLevel( ${e}, ${t}, uv, 0 ).rgb;

				result.direction = transpose( ${i} ) * direction;
				result.color = color * ${a};
				result.pdf = ${s}( texel, uv.y );

				return result;

			}
		`, this.getWeight = H`
			fn getEnvWeight() -> f32 {

				let resolution = textureDimensions( ${e} );
				return ${a} * ${S} * ${S} * ${r} / ( 2.0 * f32( resolution.x * resolution.y ) );

			}
		`, this.getDirPdf = H`
			fn getEnvDirPdf( direction: vec3f ) -> f32 {

				if ( ${r} == 0.0 ) {

					return 0.0;

				}

				let rotatedDir = ${i} * direction;
				let mapUv = ${Or}( rotatedDir );
				let resolution = textureDimensions( ${e} );
				let texel = min( vec2u( mapUv * vec2f( resolution ) ), resolution - 1u );

				return ${s}( texel, mapUv.y );

			}
		`;
	}
}, _a = class {
	get map() {
		return this.mapNode.value;
	}
	set map(e) {
		this.mapNode.value = e;
	}
	get blur() {
		return this.blurNode.value;
	}
	set blur(e) {
		this.blurNode.value = e;
	}
	get rotation() {
		return this.rotationNode.value;
	}
	get intensity() {
		return this.intensityNode.value;
	}
	set intensity(e) {
		this.intensityNode.value = e;
	}
	constructor() {
		let e = new M(new Uint8Array([
			0,
			0,
			0,
			255
		]), 1, 1, P);
		e.minFilter = k, e.magFilter = k, e.wrapS = Je, e.wrapT = Je, e.generateMipmaps = !1, e.needsUpdate = !0, this.mapNode = E(e), this.mapSampler = h(this.mapNode), this.blurNode = f(0), this.rotationNode = f(new N()), this.intensityNode = f(1), this._initFns();
	}
	dispose() {
		this.map.dispose();
	}
	_initFns() {
		let { mapNode: e, mapSampler: t, blurNode: n, rotationNode: r, intensityNode: i } = this;
		this.sampleColor = H`
			fn sampleBackground( direction: vec3f, uv: vec2f ) -> vec4f {

				let rotatedDir = ( ${r} * vec4f( direction, 0.0 ) ).xyz;
				let offsetDir = ${kr}( rotatedDir, uv ) * 0.5 * ${n};
				let sampleDir = normalize( rotatedDir + offsetDir );

				let mapUv = ${Or}( sampleDir );
				let col = textureSampleLevel( ${e}, ${t}, mapUv, 0 );

				return vec4f( ${i} * col.rgb, col.a );

			}
		`;
	}
}, va = new Ke(), ya = new je();
function ba(e) {
	return `${e.source.uuid}:${e.source.version}`;
}
function xa(e, t, n, r) {
	if (e[t].x + n > r) return -1;
	let i = n, a = 0, o = t;
	for (; i > 0;) {
		if (o >= e.length) return -1;
		a = Math.max(a, e[o].y), i -= e[o].width, o++;
	}
	return a;
}
function Sa(e, t, n, r) {
	let i = t + r, a = [], o = !1;
	for (let s = 0; s < e.length; s++) {
		let c = e[s], l = c.x + c.width;
		l <= t ? a.push(c) : c.x >= i ? (o ||= (a.push({
			x: t,
			y: n,
			width: r
		}), !0), a.push(c)) : (o ||= (a.push({
			x: t,
			y: n,
			width: r
		}), !0), l > i && a.push({
			x: i,
			y: c.y,
			width: l - i
		}));
	}
	o || a.push({
		x: t,
		y: n,
		width: r
	}), e.length = 0;
	for (let t = 0; t < a.length; t++) {
		let n = a[t], r = e[e.length - 1];
		r && r.y === n.y && r.x + r.width === n.x ? r.width += n.width : e.push(n);
	}
}
function Ca(e, t, n, r, i) {
	let a = Infinity, o = 0, s = -1;
	for (let c = 0; c < e.length; c++) {
		let l = xa(e, c, t, r);
		l >= 0 && l + n <= i && l < a && (a = l, o = e[c].x, s = c);
	}
	return s === -1 ? null : (Sa(e, o, a + n, t), {
		x: o,
		y: a
	});
}
var wa = class {
	get width() {
		return this.renderTarget.width;
	}
	get height() {
		return this.renderTarget.height;
	}
	get pageCount() {
		return this.renderTarget.depth;
	}
	get texture() {
		return this.renderTarget.texture;
	}
	constructor(e = {}) {
		this.renderTarget = new it(1, 1, {
			depthBuffer: !1,
			depth: 1,
			...e
		}), this.texture.isArrayTexture = !0, this.textureInfo = [new Ne()], this.hashes = [], this.placements = [], this.quadMesh = new re(new Le()), this.quadMesh.material.blending = 0;
	}
	setTextures(e, t) {
		let n = t.map((e, t) => t);
		if (n.sort((e, n) => t[e].source.uuid < t[n].source.uuid ? -1 : 1), t = n.map((e) => t[e]), this._hashesMatch(t)) {
			this._buildCallerTextureInfo(n);
			return;
		}
		let r = t.reduce((e, t) => Math.max(e, t.width, t.height), 1);
		r = Math.min(e.backend.device.limits.maxTextureDimension2D, r);
		let i = r, a = r, { renderTarget: o } = this, { placements: s, pageCount: c } = this._packTextures(t, i, a);
		o.setSize(i, a, c), this.texture.isArrayTexture = !0, this._renderTextures(e, t, s), this.placements = s;
		let l = Array(t.length);
		for (let e = 0, n = t.length; e < n; e++) {
			let n = ba(t[e]);
			l[e] = n;
		}
		this.hashes = l, this._buildCallerTextureInfo(n);
	}
	_buildCallerTextureInfo(e) {
		let t = Array(e.length);
		for (let n = 0, r = e.length; n < r; n++) t[e[n]] = this.placements[n];
		this._buildTextureInfo(t);
	}
	dispose() {
		this.renderTarget.dispose(), this.quadMesh.material.dispose();
	}
	_hashesMatch(e) {
		let t = this.hashes;
		if (t.length !== e.length) return !1;
		for (let n = 0, r = e.length; n < r; n++) if (t[n] !== ba(e[n])) return !1;
		return !0;
	}
	_packTextures(e, t, n) {
		let r = [];
		for (let i = 0, a = e.length; i < a; i++) {
			let a = e[i];
			r.push({
				index: i,
				w: Math.min(a.width, t),
				h: Math.min(a.height, n)
			});
		}
		let i = r.sort((e, t) => t.h - e.h), a = Array(e.length), o = [];
		for (let e = 0, r = i.length; e < r; e++) {
			let r = i[e], s = null, c = -1;
			for (let e = 0; e < o.length; e++) if (s = Ca(o[e], r.w, r.h, t, n), s) {
				c = e;
				break;
			}
			if (!s) {
				let e = [{
					x: 0,
					y: 0,
					width: t
				}];
				s = Ca(e, r.w, r.h, t, n), o.push(e), c = o.length - 1;
			}
			a[r.index] = {
				x: s.x,
				y: s.y,
				w: r.w,
				h: r.h,
				page: c
			};
		}
		return {
			placements: a,
			pageCount: Math.max(o.length, 1)
		};
	}
	_buildTextureInfo(e) {
		let t = this.textureInfo;
		t.length = 0;
		for (let n = 0, r = e.length; n < r; n++) {
			let { x: r, y: i, w: a, h: o, page: s } = e[n], c = new Ne();
			c.x = r & 65535 | (i & 65535) << 16, c.y = a & 65535 | (o & 65535) << 16, c.z = s & 65535, c.w = 0, t.push(c);
		}
		t.length === 0 && t.push(new Ne(0, 0, 0, 0));
	}
	_renderTextures(e, t, n) {
		let { quadMesh: r, renderTarget: i, width: a, height: o } = this, s = e.getRenderTarget(), c = e.toneMapping, l = e.autoClear, u = e.getScissorTest(), d = e.getClearAlpha();
		e.getClearColor(va), e.toneMapping = 0, e.autoClear = !1, e.setScissorTest(!0), e.setClearColor(0, 0);
		for (let t = 0, n = i.depth; t < n; t++) i.viewport.set(0, 0, a, o), i.scissor.set(0, 0, a, o), e.setRenderTarget(i, t), e.clear();
		for (let a = 0, o = t.length; a < o; a++) {
			let { x: o, y: s, w: c, h: l, page: u } = n[a], d = t[a];
			if (i.viewport.set(o, s, c, l), i.scissor.set(o, s, c, l), e.setRenderTarget(i, u), d.isRenderTargetTexture) {
				let t = d.matrixAutoUpdate;
				ya.copy(d.matrix), d.matrix.identity(), d.matrixAutoUpdate = !1, r.material.map = d, r.render(e), d.matrixAutoUpdate = t, d.matrix.copy(ya);
			} else {
				let t = d.clone();
				t.matrixAutoUpdate = !1, t.matrix.identity(), r.material.map = t, r.render(e), t.dispose();
			}
		}
		i.viewport.set(0, 0, a, o), i.scissor.set(0, 0, a, o), r.material.map = null, e.setClearColor(va, d), e.setScissorTest(u), e.autoClear = l, e.setRenderTarget(s), e.toneMapping = c;
	}
};
// node_modules/three-gpu-pathtracer/src/utils/bufferToHash.js
function Ta(e) {
	let t = 0;
	if (e.byteLength !== 0) {
		let n = new Uint8Array(e);
		for (let r = 0; r < e.byteLength; r++) {
			let e = n[r];
			t = (t << 5) - t + e, t |= 0;
		}
	}
	return t;
}
// node_modules/three-gpu-pathtracer/src/uniforms/LightsInfoUniformStruct.js
var Ea = 6, Da = 11, Oa = 0, ka = 1, Aa = 2, ja = 3, Ma = 4, X = new Ae(), Z = new Ae(), Na = new N(), Pa = new rt(), Fa = new Ae(), Q = new Ae(), Ia = new Ae(0, 1, 0), La = class {
	constructor() {
		let e = new M(/* @__PURE__ */ new Float32Array(4), 1, 1);
		e.format = P, e.type = et, e.wrapS = Ie, e.wrapT = Ie, e.generateMipmaps = !1, e.minFilter = $e, e.magFilter = $e, this.tex = e, this.count = 0;
	}
	updateFrom(e, t = []) {
		let n = this.tex, r = Math.max(e.length * Ea, 1), i = Math.ceil(Math.sqrt(r));
		n.image.width !== i && (n.dispose(), n.image.data = new Float32Array(i * i * 4), n.image.width = i, n.image.height = i);
		let a = n.image.data;
		for (let n = 0, r = e.length; n < r; n++) {
			let r = e[n], i = n * Ea * 4, o = 0;
			for (let e = 0; e < 24; e++) a[i + e] = 0;
			r.getWorldPosition(Z), a[i + o++] = Z.x, a[i + o++] = Z.y, a[i + o++] = Z.z;
			let s = Oa;
			if (r.isRectAreaLight && r.isCircular ? s = ka : r.isSpotLight ? s = Aa : r.isDirectionalLight || r.isSunLight ? s = ja : r.isPointLight && (s = Ma), a[i + o++] = s, a[i + o++] = r.color.r, a[i + o++] = r.color.g, a[i + o++] = r.color.b, a[i + o++] = r.intensity, r.getWorldQuaternion(Pa), r.isRectAreaLight) X.set(r.width, 0, 0).applyQuaternion(Pa), a[i + o++] = X.x, a[i + o++] = X.y, a[i + o++] = X.z, o++, Z.set(0, r.height, 0).applyQuaternion(Pa), a[i + o++] = Z.x, a[i + o++] = Z.y, a[i + o++] = Z.z, a[i + o++] = X.cross(Z).length() * (r.isCircular ? Math.PI / 4 : 1);
			else if (r.isSpotLight) {
				let e = r.radius || 0;
				Fa.setFromMatrixPosition(r.matrixWorld), Q.setFromMatrixPosition(r.target.matrixWorld), Na.lookAt(Fa, Q, Ia), Pa.setFromRotationMatrix(Na), X.set(1, 0, 0).applyQuaternion(Pa), a[i + o++] = X.x, a[i + o++] = X.y, a[i + o++] = X.z, o++, Z.set(0, 1, 0).applyQuaternion(Pa), a[i + o++] = Z.x, a[i + o++] = Z.y, a[i + o++] = Z.z, a[i + o++] = Math.PI * e * e, a[i + o++] = e, a[i + o++] = r.decay, a[i + o++] = r.distance, a[i + o++] = Math.cos(r.angle), a[i + o++] = Math.cos(r.angle * (1 - r.penumbra)), a[i + o++] = r.iesMap ? t.indexOf(r.iesMap) : -1;
			} else if (r.isPointLight) {
				let e = X.setFromMatrixPosition(r.matrixWorld);
				a[i + o++] = e.x, a[i + o++] = e.y, a[i + o++] = e.z, o++, o += 4, o += 1, a[i + o++] = r.decay, a[i + o++] = r.distance;
			} else if (r.isDirectionalLight) {
				let e = X.setFromMatrixPosition(r.matrixWorld), t = Z.setFromMatrixPosition(r.target.matrixWorld);
				Q.subVectors(e, t).normalize(), a[i + o++] = Q.x, a[i + o++] = Q.y, a[i + o++] = Q.z;
			} else r.isSunLight && (Q.setFromMatrixPosition(r.matrixWorld).normalize(), a[i + o++] = Q.x, a[i + o++] = Q.y, a[i + o++] = Q.z);
			a[i + Da] = +!!r.visibleToCameraRays;
		}
		this.count = e.length;
		let o = Ta(a.buffer);
		return this.hash !== o && (this.hash = o, n.needsUpdate = !0, !0);
	}
}, Ra = class extends La {
	constructor() {
		super(), this.countNode = f(this.count, "uint"), this.buffer = new D(new Float32Array(2 * On.getLength()), On.getLength()), this.bufferNode = i(this.buffer, On).toReadOnly().setName("lights"), this.iesAtlas = new wa({ type: Pe }), this.iesProfilesNode = E(this.iesAtlas.texture), this.iesInfoNode = o(this.iesAtlas.textureInfo, "uvec4").setName("iesInfo"), this._initFns();
	}
	updateFrom(e, t) {
		let n = Array.from(new Set(t.map((e) => e.iesMap).filter((e) => e))), r = super.updateFrom(t, n);
		this.iesAtlas.setTextures(e, n), this.iesProfilesNode.value = this.iesAtlas.texture;
		let i = On.getLength(), a = this.count, o = Math.max(a, 2);
		this.buffer.array.length !== o * i && (this.buffer.dispose(), this.buffer = new D(new Float32Array(o * i), i), this.bufferNode.value = this.buffer);
		let s = this.tex.image.data;
		this.buffer.array.set(s.subarray(0, a * i));
		let c = new Int32Array(this.buffer.array.buffer);
		for (let e = 0; e < a; e++) {
			let t = e * i;
			c[t + 3] = Math.round(s[t + 3]), c[t + 11] = Math.round(s[t + 11]), c[t + 21] = Math.round(s[t + 21]);
		}
		return this.buffer.needsUpdate = !0, this.countNode.value = this.count, r;
	}
	_initFns() {
		let { bufferNode: e, countNode: t, iesProfilesNode: n, iesInfoNode: r } = this, i = wr(r, n, "sampleIesTexel");
		this.isLightVisibleToCamera = H`
			fn isLightVisibleToCamera( index: u32 ) -> bool {

				return ${e}[ index ].visibleToCameraRays != 0;

			}
		`, this.getLightWeight = H`
			fn getLightWeight( index: u32, position: vec3f ) -> f32 {

				let light = ${e}[ index ];
				let power = ${Mr}( light.color * light.intensity );
				if ( light.lightType == ${2} ) {

					// the most any point on the spot's disc lights the position. Ies profiles are not
					// evaluated here
					let nearest = ${Wr}( light, position );
					var attenuation = 1.0;
					if ( light.iesProfile < 0 ) {

						attenuation = ${Rr}( light.coneCos, light.penumbraCos, nearest.x );

					}

					return power * attenuation * ${zr}( nearest.y, light.distance, light.decay );

				} else if ( light.lightType == ${4} ) {

					// the point light's world position is packed into the u slot
					let dist = length( light.u - position );
					return power * ${zr}( dist, light.distance, light.decay );

				} else if ( light.lightType == ${3} ) {

					return power;

				} else {

					let toLight = light.position - position;
					let distSq = dot( toLight, toLight );
					if ( distSq == 0.0 ) {

						return 0.0;

					}

					// area lights only emit from their front face, and the distance is held above the size
					// of the light so positions on or near it do not dominate
					let normal = normalize( cross( light.u, light.v ) );
					let cosTheta = dot( toLight, normal ) * inverseSqrt( distSq );
					return power * light.area * max( cosTheta, 0.0 ) / max( distSq, light.area );

				}

			}
		`, this.getLightsWeight = H`
			fn getLightsWeight( position: vec3f ) -> f32 {

				var total = 0.0;
				for ( var i = 0u; i < ${t}; i ++ ) {

					total += ${this.getLightWeight}( i, position );

				}

				return total;

			}
		`, this.selectLight = H`
			fn selectLight( position: vec3f, envWeight: f32, r: f32, selectionPdf: ptr<function, f32> ) -> u32 {

				let count = ${t};
				let totalWeight = ${this.getLightsWeight}( position ) + envWeight;
				if ( totalWeight <= 0.0 ) {

					*selectionPdf = 0.0;
					return 0u;

				}

				let targetWeight = r * totalWeight;
				var accumulated = 0.0;
				var lastWeighted = 0u;
				var index = count;
				for ( var i = 0u; i < count; i ++ ) {

					let lightWeight = ${this.getLightWeight}( i, position );
					accumulated += lightWeight;
					if ( lightWeight > 0.0 ) {

						lastWeighted = i;

					}

					if ( targetWeight < accumulated ) {

						index = i;
						break;

					}

				}

				// rounding can carry the target past the last light when there is no environment
				if ( index == count && envWeight <= 0.0 ) {

					index = lastWeighted;

				}

				var weight = envWeight;
				if ( index < count ) {

					weight = ${this.getLightWeight}( index, position );

				}

				*selectionPdf = weight / totalWeight;
				return index;

			}
		`, this.randomLightSample = H`
			fn randomLightSample( lightIndex: u32, rayOrigin: vec3f, ruv: vec2f ) -> ${kn} {

				let light = ${e}[ lightIndex ];

				var result: ${kn};
				if ( light.lightType == ${2} ) {

					result = ${Ur}( light, rayOrigin, ruv );

					let spotNormal = normalize( cross( light.u, light.v ) );
					let cosTheta = dot( result.direction, spotNormal );
					var spotAttenuation: f32;
					if ( light.iesProfile >= 0 ) {

						// half a texel of the profile's tile in the atlas
						let profileInfo = ${r}[ u32( light.iesProfile ) ];
						let texelInset = 0.5 / vec2f( vec2u( profileInfo.y & 0xFFFFu, profileInfo.y >> 16u ) );

						// tilt spans [ 0, 180 ]deg inset to the texel centers, twist covers [ 0, 359 ]deg and wraps
						let tiltAngle = mix( texelInset.x, 1.0 - texelInset.x, acos( cosTheta ) / PI );
						let twistAngle = ( atan2( dot( result.direction, light.v ), dot( result.direction, light.u ) ) + PI ) / ( 2.0 * PI ) + texelInset.y;
						let packedProfile = ( 1 << 26 ) | light.iesProfile;
						spotAttenuation = ${i}( vec2f( tiltAngle, twistAngle ), packedProfile, 0.0 ).r;

					} else {

						spotAttenuation = ${Rr}( light.coneCos, light.penumbraCos, cosTheta );

					}

					result.emission *= spotAttenuation;

				} else if ( light.lightType == ${4} ) {

					// the point light's world position is packed into the u slot
					let lightRay = light.u - rayOrigin;
					let lightDist = length( lightRay );
					let cutoffDistance = light.distance;
					var distanceFalloff = 1.0 / max( pow( lightDist, light.decay ), 0.01 );
					if ( cutoffDistance > 0.0 ) {

						let window = clamp( 1.0 - pow( lightDist / cutoffDistance, 4.0 ), 0.0, 1.0 );
						distanceFalloff *= window * window;

					}

					result.direction = normalize( lightRay );
					result.dist = lightDist;
					result.pdf = 1.0;
					result.emission = light.color * light.intensity * distanceFalloff;
					result.lightType = light.lightType;

				} else if ( light.lightType == ${3} ) {

					// the directional light's direction is packed into the u slot
					result.dist = ${Fr};
					result.direction = light.u;
					result.pdf = 1.0;
					result.emission = light.color * light.intensity;
					result.lightType = light.lightType;

				} else {

					result = ${Hr}( light, rayOrigin, ruv );

				}

				return result;

			}
		`, this.intersectLightAtIndex = H`
			fn intersectLightAtIndex( rayOrigin: vec3f, rayDirection: vec3f, index: u32, lightRec: ptr<function, ${kn}> ) -> bool {

				let light = ${e}[ index ];

				var u = light.u;
				var v = light.v;
				let normal = normalize( cross( u, v ) );

				// only front-facing area lights can be hit
				if ( dot( normal, rayDirection ) > 0.0 ) {

					u *= 1.0 / dot( u, u );
					v *= 1.0 / dot( v, v );

					var dist = - 1.0;
					if ( light.lightType == ${0} ) {

						dist = ${Br}( light.position, normal, u, v, rayOrigin, rayDirection );

					} else if ( light.lightType == ${1} ) {

						dist = ${Vr}( light.position, normal, u, v, rayOrigin, rayDirection );

					}

					if ( dist > 0.0 ) {

						let cosTheta = dot( rayDirection, normal );
						lightRec.dist = dist;
						lightRec.pdf = ( dist * dist ) / ( light.area * cosTheta );
						lightRec.emission = light.color * light.intensity;
						lightRec.direction = rayDirection;
						lightRec.lightType = light.lightType;
						return true;

					}

				}

				return false;

			}
		`;
	}
	dispose() {
		this.tex.dispose(), this.buffer.dispose(), this.iesAtlas.dispose();
	}
}, za = class extends U {
	constructor() {
		let e = {
			globalId: y,
			outputTarget: T(new v(1, 1)).toWriteOnly()
		}, t = H`
			fn compute( globalId: vec3u ) -> void {

				textureStore( ${e.outputTarget}, ${() => e.outputTarget.value.isArrayTexture ? "globalId.xy, globalId.z" : "globalId.xy"}, vec4( 0, 0, 0, 1 ) );

			}
		`;
		super(t(e)), this.defineUniformAccessors({ target: e.outputTarget });
	}
}, Ba = 0, Va = 1, Ha = class {
	constructor(e) {
		this.renderer = e, this.maxBounces = 15, this.frameBudget = 25e4, this.maxTransparentBounces = 15, this.maxSubsurfaceBounces = 256, this.lowResMode = !1, this.maxSamples = 0, this.asyncCompile = !1, this.compiling = !1, this.timing = {
			count: 0,
			frameTime: 0,
			frameBudget: 0
		}, this._renderTask = null, this._compileState = /* @__PURE__ */ new WeakMap(), this._timestampUIDs = null, this._timingFrame = !1, this.outputTarget = In("Output #0"), this.prevOutputTarget = In("Output #1"), this.sampleCountTarget = Ln("Sample Count"), this.sampleCountClearKernel = new za().setWorkgroupSize(8, 8, 1), this.outputTargetClearKernel = new za().setWorkgroupSize(8, 8, 1), this.auxTargetClearKernel = new za().setWorkgroupSize(8, 8, 1), this.auxTarget = null, this._auxPlaceholder = Rn();
	}
	setAccumulateAux(e) {
		if (!!this.auxTarget !== e) {
			if (this.auxTarget?.dispose(), this.auxTarget = null, e) {
				let { width: e, height: t } = this.outputTarget;
				this.auxTarget = Rn("Auxiliary Images"), this.auxTarget.setSize(e, t, 3);
			}
			this.reset();
		}
	}
	setRandom(e) {}
	setBVHData(e) {}
	setTextures(e) {}
	setMaterial(e) {}
	setFilterGlossy(e) {}
	setClamping(e, t) {}
	setEnvironment(e, t, n) {}
	setLights(e) {}
	setBackground(e, t, n, r) {}
	*compileKernels(e) {
		let { renderer: t, _compileState: n } = this;
		if (!this.asyncCompile || !t.compileComputeAsync) return;
		let r = e.map((e) => e.kernel), i = r.filter((e) => !n.has(e));
		for (i.length > 0 && (this.compiling = !0, yield, i.forEach((e) => n.set(e, Ba)), t.compileComputeAsync(i).catch(() => {}).finally(() => {
			i.forEach((e) => n.set(e, Va));
		})); r.some((e) => n.get(e) !== Va);) this.compiling = !0, yield;
		this.compiling = !1;
	}
	rebuild() {
		this._renderTask = null;
	}
	setSize(e, t) {
		e = Math.ceil(e), t = Math.ceil(t);
		let { width: n, height: r } = this.outputTarget;
		return n === e && r === t ? !1 : (this.outputTarget.dispose(), this.prevOutputTarget.dispose(), this.sampleCountTarget.dispose(), this.outputTarget = this.outputTarget.clone(), this.prevOutputTarget = this.outputTarget.clone(), this.sampleCountTarget = this.sampleCountTarget.clone(), this.outputTarget.setSize(e, t), this.prevOutputTarget.setSize(e, t), this.sampleCountTarget.setSize(e, t), this.auxTarget?.setSize(e, t, 3), this.reset(), !0);
	}
	getSize(e) {
		let { width: t, height: n } = this.outputTarget;
		return e.x = t, e.y = n, e;
	}
	getPreviewPixelBudget() {
		return this.frameBudget;
	}
	update() {
		let { renderer: e } = this;
		if (!e.initialized) return;
		this._renderTask ||= this.createRenderTask();
		let t = e.backend.trackTimestamp && !this._timingFrame;
		this._timestampUIDs = t ? [] : null, this._renderTask.next(), t && this._timestampUIDs.length > 0 && this._measureFrameTime(this._timestampUIDs), this._timestampUIDs = null;
	}
	dispatch(e, t) {
		let { renderer: n } = this;
		n.compute(e.kernel, t), this._timestampUIDs?.push(n.backend.getTimestampUID(e.kernel));
	}
	async _measureFrameTime(e) {
		let { renderer: t, timing: n, frameBudget: r } = this, { backend: i } = t;
		this._timingFrame = !0, await t.resolveTimestampsAsync(We.COMPUTE), this._timingFrame = !1, e.every((e) => i.hasTimestampQuery(e)) && (n.frameTime = e.reduce((e, t) => e + i.getTimestamp(t), 0), n.frameBudget = r, n.count++);
	}
	*createRenderTask() {}
	async getSampleCountsAsync() {
		return {
			min: 0,
			max: 0,
			avg: 0
		};
	}
	resetSeed() {}
	reset() {
		let { renderer: e, outputTargetClearKernel: t, sampleCountClearKernel: n, outputTarget: r, prevOutputTarget: i, sampleCountTarget: a } = this;
		if (!e.initialized) return;
		let { width: o, height: s } = r, c = t.getDispatchSize(o, s);
		if (t.target = r, e.compute(t.kernel, c), t.target = i, e.compute(t.kernel, c), n.target = a, e.compute(n.kernel, c), this.auxTarget) {
			let { auxTargetClearKernel: t } = this;
			t.target = this.auxTarget, e.compute(t.kernel, t.getDispatchSize(o, s, 3));
		}
		this._renderTask = null;
	}
	dispose() {
		this.outputTarget.dispose(), this.prevOutputTarget.dispose(), this.sampleCountTarget.dispose(), this.sampleCountClearKernel.dispose(), this.outputTargetClearKernel.dispose(), this.auxTargetClearKernel.dispose(), this.auxTarget?.dispose(), this._auxPlaceholder.dispose(), this._renderTask = null;
	}
}, Ua = new A(), Wa = class extends Ha {
	constructor(e) {
		super(e), this.envInfo = new ga(), this._completedSamples = 0, this._tileProgress = 0, this.kernel = new ua().setWorkgroupSize(8, 8, 1), this.kernel.envInfo = this.envInfo, this.backgroundInfo = new _a(), this.kernel.backgroundInfo = this.backgroundInfo, this.lightsInfo = new Ra(), this.kernel.lightsInfo = this.lightsInfo;
	}
	resetSeed() {
		this.kernel.seed = 0;
	}
	reset() {
		super.reset(), this._completedSamples = 0, this._tileProgress = 0;
	}
	async getSampleCountsAsync() {
		if (this.lowResMode) return {
			min: 0,
			max: 0,
			avg: 0
		};
		let e = this._completedSamples, t = this._tileProgress;
		return {
			min: t === 1 ? e + 1 : e,
			max: e + 1,
			avg: e + t
		};
	}
	setBVHData(e) {
		this.kernel.context.bvhData = e, this.rebuild();
	}
	rebuild() {
		super.rebuild(), this.kernel.needsUpdate = !0, this.reset();
	}
	setRandom(e) {
		this.kernel.context.random = e, this.kernel.needsUpdate = !0, this.reset();
	}
	setMaterial(e) {
		this.kernel.material = e.getData(), this.kernel.needsUpdate = !0, this.reset();
	}
	setFilterGlossy(e) {
		this.kernel.filterGlossy = e === 0 ? di : 1 / e, this.reset();
	}
	setClamping(e, t) {
		this.kernel.clampDirect = e, this.kernel.clampIndirect = t, this.reset();
	}
	setEnvironment(e) {
		this.envInfo.updateFrom(e);
	}
	setLights(e) {
		this.lightsInfo.updateFrom(this.renderer, e), this.reset();
	}
	setMultipleImportanceSampling(e) {
		this.kernel.misEnabled = +!!e, this.reset();
	}
	setEnvironmentParams(e, t) {
		let { envInfo: n } = this, r = new N().makeRotationFromEuler(t).invert();
		n.rotationNode.value.setFromMatrix4(r), n.intensityNode.value = e;
	}
	setBackground(e) {
		let { backgroundInfo: t } = this;
		t.dispose(), t.map = e;
	}
	setBackgroundParams(e, t, n) {
		let { backgroundInfo: r } = this, i = new N().makeRotationFromEuler(t).invert();
		r.rotationNode.value.copy(i), r.intensity = e, r.blur = n;
	}
	setTransmissiveBackground(e) {
		this.kernel.transmissiveBackground = e, this.reset();
	}
	*createRenderTask() {
		let { renderer: e, kernel: t, maxBounces: n, maxTransparentBounces: r, maxSubsurfaceBounces: i, outputTarget: a, sampleCountTarget: o, lowResMode: s } = this, c = new A();
		t.outputTarget = a, t.sampleCountTarget = o, t.maxBounces = n, t.maxTransparentBounces = r, t.maxSubsurfaceBounces = i, yield* this.compileKernels([t]);
		let l = 0;
		for (;;) {
			if (t.maxSamples = this.maxSamples, t.auxTarget = this.auxTarget ?? this._auxPlaceholder, t.accumulateAux = +!!this.auxTarget, this.maxSamples !== 0 && l >= this.maxSamples) {
				yield;
				continue;
			}
			this.getSize(Ua);
			let n = s ? 1 : Math.max(1, Math.ceil(Ua.x * Ua.y / this.frameBudget));
			c.x = Math.ceil(Math.sqrt(n)), c.y = Math.ceil(n / c.x);
			let r = this.lowResMode ? 1 : c.x * c.y, i = 0, a = t.tileSize;
			s ? this.getSize(a) : this.getSize(a).divide(c).ceil();
			let o = t.getDispatchSize(a.x, a.y);
			t.seed += 1, e.copyTextureToTexture(this.outputTarget, this.prevOutputTarget), [this.outputTarget, this.prevOutputTarget] = [this.prevOutputTarget, this.outputTarget], t.prevOutputTarget = this.prevOutputTarget, t.outputTarget = this.outputTarget;
			for (let e = 0; e < c.x; e++) for (let n = 0; n < c.y; n++) t.offset.set(e, n).multiply(a), this.dispatch(t, o), i = Math.min(i + 1, r), this._completedSamples = l, this._tileProgress = i / r, yield;
			l++;
		}
	}
	dispose() {
		super.dispose(), this.envInfo.dispose(), this.lightsInfo.dispose(), this.kernel.dispose();
	}
}, Ga = class extends C {
	constructor(e, t, n = []) {
		super(e, t), this.dependencies = n;
	}
	setup(e) {
		for (let t of this.dependencies) t.build(e);
		super.setup(e);
	}
}, Ka = {
	throughputColor: "vec3f",
	currentBounce: "uint",
	resultColor: "vec4f",
	emission: "vec3f",
	scatterPdf: "float",
	scatterColor: "vec3f",
	minPdf: "float",
	origin: "vec3f",
	isFullyTransmissive: "uint",
	direction: "vec3f",
	side: "float",
	normal: "vec3f",
	objectIndex: "int",
	barycoord: "vec3f",
	pixelIndex: "uint",
	indices: "vec3u",
	seed: "uint",
	lightDirection: "vec3f",
	lightPdf: "float",
	lightEmission: "vec3f",
	lightDist: "float",
	lightBsdf: "vec3f",
	lightBsdfPdf: "float",
	rayIntersectionIndex: "int",
	shadowRayIntersectionIndex: "int",
	lightType: "int",
	dist: "float",
	alphaDepth: "uint",
	rayStart: "float",
	maxDist: "float",
	dispersionWavelength: "float",
	auxAlbedo: "uint",
	auxNormal: "uint",
	subsurfaceBounces: "uint",
	walkPending: "uint",
	mediumScattered: "uint"
}, $ = new Ga({
	...Ka,
	medium: Yr.name
}, "RayData", [Yr]), qa = new C(Ka).getLength();
$.getLength = () => qa + Yr.getLength();
var Ja = new C({
	origin: "vec3f",
	pixelIndex: "uint",
	direction: "vec3f",
	rngIndex: "uint",
	seed: "uint",
	maxDist: "float",
	_alignment0: "uint",
	_alignment1: "uint"
}, "TraceQueuedRay"), Ya = new C({
	barycoord: "vec3f",
	objectIndex: "int",
	position: "vec3f",
	dist: "float",
	normal: "vec3f",
	side: "float",
	indices: "vec3u"
}, "TraceResult"), Xa = new C({
	objectIndex: "int",
	skippedOcclusion: "float",
	occlusion: "float"
}, "ShadowTraceResult"), Za = class extends U {
	constructor() {
		let e = {
			rayDataStorage: i(new D(1, 1), $),
			pixelQueue: i(new D(1, 1), "uint"),
			targetDimensions: f(new A()),
			frameBudget: f(0, "uint"),
			globalId: y
		}, t = H`
			fn compute( targetDimensions: vec2u, frameBudget: u32, globalId: vec3u ) -> void {

				let rayDataStorage = &${e.rayDataStorage};
				let pixelQueue = &${e.pixelQueue};

				if ( globalId.x >= targetDimensions.x || globalId.y >= targetDimensions.y ) {

					return;

				}

				let rayCount = min( frameBudget, arrayLength( rayDataStorage ) );
				let pixelCount = targetDimensions.x * targetDimensions.y;
				if ( globalId.x == 0u && globalId.y == 0u ) {

					pixelQueue[ ${0}u ] = 0u;
					pixelQueue[ ${1}u ] = select( 0u, pixelCount - rayCount, pixelCount >= rayCount );

				}

				let pixelHash = ( globalId.x << 16 ) | globalId.y;
				let pixelIndex = globalId.x + globalId.y * targetDimensions.x;
				if ( pixelIndex < rayCount ) {

					rayDataStorage[ pixelIndex ].pixelIndex = pixelHash;
					rayDataStorage[ pixelIndex ].resultColor = vec4f( 0.0 );
					rayDataStorage[ pixelIndex ].throughputColor = vec3f( 0.0 );
					rayDataStorage[ pixelIndex ].objectIndex = - 1;
					rayDataStorage[ pixelIndex ].alphaDepth = 0u;
					rayDataStorage[ pixelIndex ].rayIntersectionIndex = - 1;
					rayDataStorage[ pixelIndex ].shadowRayIntersectionIndex = - 1;

				} else {

					pixelQueue[ ${2}u + pixelIndex - rayCount ] = pixelHash;

				}

			}
		`;
		super(t(e)), this.defineUniformAccessors(e);
	}
}, Qa = class extends U {
	constructor() {
		let e = {
			envInfo: { value: null },
			backgroundInfo: { value: null },
			lightsInfo: { value: null },
			prevOutputTarget: T(In()).toReadOnly(),
			outputTarget: T(In()).toWriteOnly(),
			sampleCountTarget: T(Ln()).toReadWrite(),
			auxTarget: T(Rn()).toReadWrite(),
			misEnabled: f(1, "uint"),
			rayCount: f(0, "uint"),
			maxBounces: f(5, "uint"),
			clampDirect: f(0),
			clampIndirect: f(10),
			transmissiveBackground: f(1),
			accumulateAux: f(0, "uint"),
			rayDataStorage: i(new D(1, 1), $),
			rayIntersectionsStorage: i(new D(1, 1), Ya),
			shadowRayIntersectionsStorage: i(new D(1, 1), Xa),
			globalId: y
		}, t = L("envInfo.value.totalSumNode", e), n = L("envInfo.value.intensityNode", e), r = L("envInfo.value.sampleColor", e), a = L("envInfo.value.sampleDir", e), o = L("envInfo.value.getDirPdf", e), s = L("envInfo.value.getWeight", e), c = L("backgroundInfo.value.sampleColor", e), l = L("lightsInfo.value.countNode", e), u = R("lightsInfo.value.randomLightSample", e), d = R("lightsInfo.value.intersectLightAtIndex", e), p = R("lightsInfo.value.getLightWeight", e), m = R("lightsInfo.value.getLightsWeight", e), h = R("lightsInfo.value.selectLight", e), g = R("lightsInfo.value.isLightVisibleToCamera", e), _ = H`

			fn compute(
				// settings
				misEnabled: u32,
				rayCount: u32,
				maxBounces: u32,
				clampDirect: f32,
				clampIndirect: f32,
				transmissiveBackground: u32,
				accumulateAux: u32,

				globalId: vec3u
			) -> void {

				let rayDataStorage = &${e.rayDataStorage};
				let rayIntersectionsStorage = &${e.rayIntersectionsStorage};
				let shadowRayIntersectionsStorage = &${e.shadowRayIntersectionsStorage};

				// bound by "rayCount" rather than the pool length. See MaterialKernel
				let index = globalId.x;
				if ( index >= rayCount ) {

					return;

				}

				// skip slots that have never spawned a ray
				// whole structs are read from the buffer, not the pointer alias, which Safari fails to compile
				let input = ${e.rayDataStorage}[ index ];
				if ( input.rayIntersectionIndex < 0 ) {

					return;

				}

				let indexUV = vec2u( input.pixelIndex >> 16, input.pixelIndex & 0xFFFF );
				${ar}( indexUV, input.seed, input.currentBounce + input.alphaDepth + input.subsurfaceBounces );

				// one-sample NEE chooses between the analytic lights and the environment, matched with
				// the megakernel
				let envActive = ${t} > 0.0 && ${n} > 0.0;
				let lightsCount = ${l};
				var envWeight = 0.0;
				if ( envActive ) {

					envWeight = ${s}();

				}

				var resultColor = input.resultColor;
				var throughputColor = input.throughputColor;

				// added last, since a camera ray miss overwrites the pixel with the background
				var lightHits = vec3f( 0.0 );
				var cameraHitLight = false;

				// resolve the previous surface's NEE shadow ray (pre-scatter throughput). The index
				// is negative when no shadow ray was enqueued last frame
				if ( input.shadowRayIntersectionIndex >= 0 && input.lightPdf > 0.0 ) {

					let shadowHit = ${e.shadowRayIntersectionsStorage}[ u32( input.shadowRayIntersectionIndex ) ];
					let occluded = shadowHit.objectIndex >= 0;
					if ( ! occluded ) {

						// env + area lights are also found by bsdf rays, so MIS-weight them. Punctual lights, and lights
						// past the bounce limit, take full weight. Bsdf rays stopped by faces the shadow ray skipped can't
						// find the light, so their share of the weight moves to the light sample
						let isMISWeighted = ${Lr}( input.lightType ) && input.currentBounce < maxBounces;
						let misWeight = select( 1.0, mix( ${jr}( input.lightPdf, input.lightBsdfPdf ), 1.0, shadowHit.skippedOcclusion ), isMISWeighted );
						let directLight = throughputColor * input.lightEmission * input.lightBsdf * misWeight * ( 1.0 - shadowHit.occlusion ) / input.lightPdf;
						let contribution = ${Y}( directLight, input.currentBounce, clampDirect, clampIndirect );
						resultColor += vec4f( contribution, 0.0 );

					}

				}

				// emission gathered at the previous surface (pre-scatter throughput). Found light clamps
				// at the depth of the segment that found it, as in Cycles, so one less than the current
				let emission = ${Y}( throughputColor * input.emission, max( input.currentBounce, 1u ) - 1u, clampDirect, clampIndirect );
				resultColor += vec4f( emission, 0.0 );

				// reconstruct the scatter record staged by MaterialKernel
				var scatterRec: ${wn};
				scatterRec.color = input.scatterColor;
				scatterRec.pdf = input.scatterPdf;

				// the bounce limit, russian roulette, and terminating scatter checks all ran in
				// MaterialKernel, which stages a zeroed pdf and skips the bounce trace when they fire
				var isTerminated = all( throughputColor == vec3f( 0.0 ) ) || input.currentBounce >= maxBounces || ${br}( scatterRec );

				// apply the scatter across the traced segment, including the weight of a medium walk
				if ( ! isTerminated ) {

					throughputColor *= scatterRec.color / scatterRec.pdf;

				}

				let isWalking = ! isTerminated && input.walkPending != 0u;
				if ( isWalking ) {

					// the walk hasn't reached a surface yet, so there's no hit to stage. Clear what was
					// resolved and let MediumKernel accumulate the walk's weight
					rayDataStorage[ index ].emission = vec3f( 0.0 );
					rayDataStorage[ index ].lightPdf = 0.0;
					rayDataStorage[ index ].shadowRayIntersectionIndex = - 1;
					rayDataStorage[ index ].scatterColor = vec3f( 1.0 );
					rayDataStorage[ index ].scatterPdf = 1.0;

				} else if ( ! isTerminated ) {

					let hitResult = ${e.rayIntersectionsStorage}[ u32( input.rayIntersectionIndex ) ];
					let didHit = hitResult.objectIndex >= 0;
					let surfaceDist = select( ${Fr}, hitResult.dist, didHit );

					// NEE's total weight at the vertex this segment left, for MIS. Camera segments have none,
					// and neither do scatter events in a medium
					let isMISWeighted = misEnabled != 0u && input.currentBounce > 0u && input.mediumScattered == 0u;
					var lightTotalWeight = 0.0;
					if ( isMISWeighted ) {

						lightTotalWeight = ${m}( input.origin ) + envWeight;

					}

					// forward hits on area lights along the traced segment, which starts "rayStart" along the ray.
					// Camera rays only see visibleToCameraRays lights, at full weight
					for ( var li = 0u; li < lightsCount; li ++ ) {

						if ( input.currentBounce == 0u && ! ${g}( li ) ) {

							continue;

						}

						var lightRec: ${kn};
						if ( ${d}( input.origin, input.direction, li, &lightRec ) && lightRec.dist > input.rayStart && lightRec.dist < input.rayStart + surfaceDist ) {

							var misWeight = 1.0;
							if ( isMISWeighted ) {

								let selectionPdf = ${p}( li, input.origin ) / lightTotalWeight;
								misWeight = ${jr}( input.scatterPdf, lightRec.pdf * selectionPdf );

							}

							lightHits += ${Y}( lightRec.emission * throughputColor * misWeight, input.currentBounce, clampDirect, clampIndirect );
							cameraHitLight = cameraHitLight || input.currentBounce == 0u;

						}

					}

					if ( didHit ) {

						// stage the hit for MaterialKernel
						rayDataStorage[ index ].barycoord = hitResult.barycoord;
						rayDataStorage[ index ].normal = hitResult.normal;
						rayDataStorage[ index ].side = hitResult.side;
						rayDataStorage[ index ].indices = hitResult.indices;
						rayDataStorage[ index ].objectIndex = hitResult.objectIndex;
						rayDataStorage[ index ].dist = hitResult.dist;

						// next event estimation: choose one light or the environment by its estimated
						// contribution. MaterialKernel evaluates the bsdf and enqueues the shadow ray.
						var lightPdf = 0.0;
						if ( misEnabled != 0u ) {

							let ruv = ${cr}( ${5} );
							var selectionPdf = 0.0;
							let lightIndex = ${h}( hitResult.position, envWeight, ruv.x, &selectionPdf );
							if ( selectionPdf > 0.0 ) {

								var lightRec: ${kn};
								if ( envActive && lightIndex == lightsCount ) {

									// the environment, sampled from its CDF, as a light of kind ENVIRONMENT
									let envSample = ${a}( ruv.yz );
									lightRec.direction = envSample.direction;
									lightRec.emission = envSample.color;
									lightRec.pdf = envSample.pdf;
									lightRec.dist = ${Fr};
									lightRec.lightType = ${5};

								} else {

									lightRec = ${u}( lightIndex, hitResult.position, ruv.yz );

								}

								lightPdf = lightRec.pdf * selectionPdf;
								rayDataStorage[ index ].lightDirection = lightRec.direction;
								rayDataStorage[ index ].lightEmission = lightRec.emission;
								rayDataStorage[ index ].lightDist = lightRec.dist;
								rayDataStorage[ index ].lightType = lightRec.lightType;

							}

						}

						rayDataStorage[ index ].lightPdf = lightPdf;

					} else {

						// the segment escaped the scene: gather the environment for opaque paths, or
						// the background for camera segments and fully transmissive paths
						if ( input.currentBounce > 0u && input.isFullyTransmissive == 0u ) {

							var misWeight = 1.0;
							if ( isMISWeighted && envActive ) {

								// match the env pdf scaling used by the NEE selection so the two estimators balance
								let envPdf = ${o}( input.direction ) * envWeight / lightTotalWeight;
								misWeight = ${jr}( input.scatterPdf, envPdf );

							}

							let environment = ${r}( input.direction ).rgb * throughputColor * misWeight;
							let contribution = ${Y}( environment, input.currentBounce, clampDirect, clampIndirect );
							resultColor += vec4f( contribution, 0.0 );

						} else {

							// hit the background
							// support multiple transparent background blending techniques
							let rng = ${q}( ${1} );
							let bg = ${c}( input.direction, rng );
							if ( input.currentBounce == 0u ) {

								// sample the background directly if this is the primary ray
								let background = ${Y}( bg.a * bg.rgb, input.currentBounce, clampDirect, clampIndirect );
								resultColor = vec4f( background, bg.a );

							} else {

								// transmissive ray handling
								let env = ${r}( input.direction );
								let avg = saturate( dot( throughputColor, vec3f( 1.0 / 3.0 ) ) );
								let transparency = ( 1.0 - bg.a ) * avg;

								var misWeight = 1.0;
								if ( misEnabled != 0u && envActive ) {

									let envPdf = ${o}( input.direction );
									misWeight = ${jr}( input.scatterPdf, envPdf );

								}

								if ( transmissiveBackground == ${0}u ) {

									// display the env map through transmissive surfaces
									let background = ${Y}( env.rgb * throughputColor * misWeight, input.currentBounce, clampDirect, clampIndirect );
									resultColor = vec4f(
										resultColor.rgb + background,
										1.0,
									);

								} else if ( transmissiveBackground == ${2}u ) {

									// fade the background by the throughput color average
									let background = ${Y}( bg.a * bg.rgb * throughputColor * misWeight, input.currentBounce, clampDirect, clampIndirect );
									resultColor = vec4f(
										resultColor.rgb + background,
										1.0 - transparency,
									);

								} else {

									// fade the background by the throughput color average, mixing in env lighting
									var light = mix( env.rgb, bg.rgb, bg.a ) * misWeight;
									let background = ${Y}( light * throughputColor, input.currentBounce, clampDirect, clampIndirect );
									resultColor = vec4f(
										resultColor.rgb + background,
										1.0 - transparency,
									);

								}

							}

						}

						isTerminated = true;

					}

				}

				// visible lights are opaque against a transparent background
				resultColor += vec4f( lightHits, 0.0 );
				if ( cameraHitLight ) {

					resultColor.a = 1.0;

				}

				// the color rows are stored top down to match a rasterized render target
				let colorIndex = vec2u( indexUV.x, textureDimensions( ${e.outputTarget} ).y - 1u - indexUV.y );
				let storedSamples = textureLoad( ${e.sampleCountTarget}, indexUV ).r & ${la}u;

				if ( isTerminated ) {

					// blend the finished sample into the output and free the slot for a new camera ray
					let sampleCount = storedSamples + 1;
					let prevColor = textureLoad( ${e.prevOutputTarget}, colorIndex );
					let blendedColor = ${Pr}( prevColor, resultColor, 1.0 / f32( sampleCount ) );
					textureStore( ${e.sampleCountTarget}, indexUV, vec4( ${ca}u | sampleCount ) );
					textureStore( ${e.outputTarget}, colorIndex, blendedColor );

					// the auxiliary images are blended the same way, in the same row order
					if ( accumulateAux != 0u ) {

						var auxPacked: vec3u;
						for ( var layer = 0u; layer < ${3}u; layer ++ ) {

							auxPacked[ layer ] = textureLoad( ${e.auxTarget}, colorIndex, layer ).r;

						}

						let albedo = unpack4x8unorm( input.auxAlbedo ).rgb;
						let normal = unpack4x8snorm( input.auxNormal ).xyz;
						auxPacked = ${Fn}( auxPacked, albedo, normal, 1.0 / f32( sampleCount ) );
						for ( var layer = 0u; layer < ${3}u; layer ++ ) {

							textureStore( ${e.auxTarget}, colorIndex, layer, vec4u( auxPacked[ layer ] ) );

						}

					}

					rayDataStorage[ index ].objectIndex = - 1;

				} else {

					// show the path so far, which the first sample overwrites
					if ( storedSamples == 0u ) {

						textureStore( ${e.outputTarget}, colorIndex, resultColor );

					}

					rayDataStorage[ index ].resultColor = resultColor;
					rayDataStorage[ index ].throughputColor = throughputColor;

				}

			}
		`;
		super(_(e)), this.defineUniformAccessors(e);
	}
}, $a = class extends U {
	constructor() {
		let e = {
			material: { value: null },
			seed: f(0, "uint"),
			targetDimensions: f(new A()),
			maxSamples: f(0, "uint"),
			rayCount: f(0, "uint"),
			filterGlossy: f(1),
			maxTransparentBounces: f(5, "uint"),
			maxBounces: f(5, "uint"),
			sampleCountTarget: T(Ln()).toReadWrite(),
			rayDataStorage: i(new D(1, 1), $),
			rayQueue: i(new D(1, 1), Ja),
			shadowRayQueue: i(new D(1, 1), Ja),
			queueCounters: i(new D(1, 1), "uint").toAtomic(),
			pixelQueue: i(new D(1, 1), "uint").toAtomic(),
			globalId: y
		}, t = B("bvhData.fns.getCameraRay"), n = B("bvhData.fns.sampleTrianglePoint"), r = B("bvhData.fns.getSurfaceRecord"), a = R("material.value.bsdfSample", e), o = R("material.value.bsdfEvalPdf", e), s = z("bvhData.storage.materials"), c = z("bvhData.storage.transforms"), l = H`

			fn compute(
				seed: u32,
				targetDimensions: vec2u,
				maxSamples: u32,
				rayCount: u32,
				filterGlossy: f32,
				maxTransparentBounces: u32,
				maxBounces: u32,

				globalId: vec3u
			) -> void {

				let rayDataStorage = &${e.rayDataStorage};
				let rayQueue = &${e.rayQueue};
				let shadowRayQueue = &${e.shadowRayQueue};
				let queueCounters = &${e.queueCounters};
				let pixelQueue = &${e.pixelQueue};

				// bound by "rayCount" rather than the pool length. The dispatch rounds up to the
				// workgroup size and those extra slots hold a zeroed pixel index
				let index = globalId.x;
				if ( index >= rayCount ) {

					return;

				}

				// whole structs are read from the buffer, not the pointer alias, which Safari fails to compile
				let input = ${e.rayDataStorage}[ index ];
				if ( input.objectIndex < 0 ) {

					// the slot's path has terminated: recycle the pixel through the overflow queue and
					// generate a fresh camera ray
					var pixelIndex = input.pixelIndex;
					let elementCount = atomicLoad( &pixelQueue[ ${1}u ] );
					if ( elementCount > 0u ) {

						// TODO: If we've pulled off a pixel that's already finished we currently just
						// write a no-op ray, wasting a frame. It may be better to iterate over a few
						// points in the queue to see if we can find one we can use.
						let queueIndex = atomicAdd( &pixelQueue[ ${0}u ], 1u ) % elementCount;
						pixelIndex = atomicExchange( &pixelQueue[ ${2}u + queueIndex ], pixelIndex );

					}

					let indexUV = vec2u( pixelIndex >> 16, pixelIndex & 0xFFFF );

					// skip the pixel if it has hit the sample limit
					let combinedField = textureLoad( ${e.sampleCountTarget}, indexUV ).r;
					let samples = ( ${la}u & combinedField );
					let isComplete = maxSamples != 0u && samples >= maxSamples;

					if ( isComplete ) {

						rayDataStorage[ index ].pixelIndex = pixelIndex;
						rayDataStorage[ index ].rayIntersectionIndex = - 1;
						rayDataStorage[ index ].shadowRayIntersectionIndex = - 1;
						return;

					}

					${ar}( indexUV, seed + samples, 0 );

					let uv = vec2f( indexUV ) / vec2f( targetDimensions );
					let jitteredUv = uv + ${q}( ${0} ) / vec2f( targetDimensions );
					var ray: ${I};
					if ( ! ${t}( jitteredUv, vec2f( targetDimensions ), &ray ) ) {

						// the camera declined the pixel, so leave the slot dormant for this round. With a
						// sample cap the pixel counts as finished, since it will never take a sample
						// TODO: same as above - this work is a bit wasteful and leaves slots empty for
						// a frame. Is it possible to quickly skip rays outside the mask or are finished?
						if ( maxSamples != 0u ) {

							textureStore( ${e.sampleCountTarget}, indexUV, vec4( ( combinedField & ~${la}u ) | maxSamples ) );

						}

						rayDataStorage[ index ].pixelIndex = pixelIndex;
						rayDataStorage[ index ].rayIntersectionIndex = - 1;
						rayDataStorage[ index ].shadowRayIntersectionIndex = - 1;
						return;

					}

					ray.direction = normalize( ray.direction );

					let rayIndex = atomicAdd( &queueCounters[ ${0}u ], 1u );
					rayQueue[ rayIndex ].origin = ray.origin;
					rayQueue[ rayIndex ].direction = ray.direction;
					rayQueue[ rayIndex ].pixelIndex = pixelIndex;
					rayQueue[ rayIndex ].rngIndex = 0u;
					rayQueue[ rayIndex ].seed = seed + samples;
					rayQueue[ rayIndex ].maxDist = ray.maxDist;

					rayDataStorage[ index ].origin = ray.origin;
					rayDataStorage[ index ].direction = ray.direction;
					rayDataStorage[ index ].pixelIndex = pixelIndex;
					rayDataStorage[ index ].seed = seed + samples;
					rayDataStorage[ index ].currentBounce = 0u;
					rayDataStorage[ index ].throughputColor = vec3f( 1.0 );
					rayDataStorage[ index ].resultColor = vec4f( 0.0, 0.0, 0.0, 1.0 );
					rayDataStorage[ index ].scatterColor = vec3f( 1.0 );
					rayDataStorage[ index ].scatterPdf = 1.0;
					rayDataStorage[ index ].minPdf = 1.0;
					rayDataStorage[ index ].isFullyTransmissive = 1u;
					rayDataStorage[ index ].emission = vec3f( 0.0 );
					rayDataStorage[ index ].lightPdf = 0.0;
					rayDataStorage[ index ].alphaDepth = 0u;
					rayDataStorage[ index ].rayStart = 0.0;
					rayDataStorage[ index ].maxDist = ray.maxDist;
					rayDataStorage[ index ].rayIntersectionIndex = i32( rayIndex );
					rayDataStorage[ index ].shadowRayIntersectionIndex = - 1;
					rayDataStorage[ index ].dispersionWavelength = - mix( ${360}.0, ${830}.0, ${sr}( ${7} ) );
					rayDataStorage[ index ].auxAlbedo = 0u;
					rayDataStorage[ index ].auxNormal = 0u;
					rayDataStorage[ index ].subsurfaceBounces = 0u;
					rayDataStorage[ index ].walkPending = 0u;
					rayDataStorage[ index ].mediumScattered = 0u;
					rayDataStorage[ index ].medium.inside = 0u;

					// write the active params & dispatched flag
					textureStore( ${e.sampleCountTarget}, indexUV, vec4( ${sa}u | ${ca}u | samples ) );

				} else if ( input.walkPending == 0u ) {

					// evaluate the surface staged by LogicKernel. Paths still walking a medium have none
					let indexUV = vec2u( input.pixelIndex >> 16, input.pixelIndex & 0xFFFF );
					${ar}( indexUV, input.seed, input.currentBounce + input.alphaDepth + input.subsurfaceBounces );

					// the medium the path is in, which the bsdf sample may enter or exit
					var medium = ${Zr}( input.medium );
					let segmentInMedium = medium.inside;

					let objectInfo = ${c}[ u32( input.objectIndex ) ];
					var materialInfo = ${s}[ objectInfo.materialIndex ];

					// a matte surface hit by the camera ray renders as a fully transparent
					let isMatte = materialInfo.matte != 0 && input.currentBounce == 0u;
					if ( isMatte ) {

						rayDataStorage[ index ].resultColor = vec4f( 0.0 );
						rayDataStorage[ index ].throughputColor = vec3f( 0.0 );
						rayDataStorage[ index ].emission = vec3f( 0.0 );
						rayDataStorage[ index ].lightPdf = 0.0;
						rayDataStorage[ index ].shadowRayIntersectionIndex = - 1;
						return;

					}

					// apply per-object colors
					materialInfo.color *= objectInfo.color.rgb;
					materialInfo.opacity *= objectInfo.color.a;

					var vertexData = ${n}( input.barycoord, input.indices );
					vertexData.normal = normalize( transpose( objectInfo.inverseMatrixWorld ) * vertexData.normal );
					vertexData.tangent = vec4f( ( objectInfo.matrixWorld * vec4f( vertexData.tangent.xyz, 0.0 ) ).xyz, vertexData.tangent.w );
					vertexData.position = objectInfo.matrixWorld * vertexData.position;

					let view = - input.direction;

					// blur glossy surfaces after low-probability bounces to suppress fireflies,
					// from the Cycles "filter glossy" approach in integrator/surface_shader.h
					let blurRoughness = sqrt( clamp( 1.0 - filterGlossy * input.minPdf, 0.0, 1.0 ) ) * 0.5;

					var surface = ${r}( materialInfo, vertexData, input.side, input.normal, view, blurRoughness );

					// Stochastically pass through partially transparent surfaces by re-enqueueing
					// the ray at the hit point, advancing the alpha depth but not the bounce count.
					let passesThrough = ${sr}( ${50} ) > surface.opacity;
					if ( passesThrough ) {

						// out of transparent bounces, so stop rather than shading a surface that
						// should be invisible. A zeroed throughput terminates in LogicKernel.
						if ( input.alphaDepth >= maxTransparentBounces ) {

							rayDataStorage[ index ].throughputColor = vec3f( 0.0 );
							rayDataStorage[ index ].emission = vec3f( 0.0 );
							rayDataStorage[ index ].lightPdf = 0.0;
							rayDataStorage[ index ].shadowRayIntersectionIndex = - 1;
							return;

						}

						let alphaOrigin = ${Sr}( vertexData.position.xyz, input.direction, input.normal );
						if ( segmentInMedium ) {

							// inside a medium, MediumKernel walks on past the surface, from the surface
							rayDataStorage[ index ].walkPending = 1u;
							rayDataStorage[ index ].origin = alphaOrigin;
							rayDataStorage[ index ].rayStart = 0.0;

						} else {

							let alphaIndex = atomicAdd( &queueCounters[ ${0}u ], 1u );
							rayQueue[ alphaIndex ].origin = alphaOrigin;
							rayQueue[ alphaIndex ].direction = input.direction;
							rayQueue[ alphaIndex ].pixelIndex = input.pixelIndex;
							rayQueue[ alphaIndex ].rngIndex = input.currentBounce + input.alphaDepth + 1u + input.subsurfaceBounces;
							rayQueue[ alphaIndex ].seed = input.seed;
							// the origin advanced to the hit point, so the remaining budget shrinks by the
							// distance already traced
							rayQueue[ alphaIndex ].maxDist = max( input.maxDist - input.dist, 0.0 );
							rayDataStorage[ index ].rayIntersectionIndex = i32( alphaIndex );

							// the ray keeps its origin, and only the queued traversal starts past the surface
							rayDataStorage[ index ].rayStart = input.rayStart + input.dist;

						}

						// the surface is skipped, so no scatter or emission is staged for LogicKernel.
						// "pdf" is left alone so the previous scatter still weights the forward MIS,
						// and "bsdf" matches it so applying the scatter leaves the throughput as is.
						rayDataStorage[ index ].alphaDepth = input.alphaDepth + 1u;
						rayDataStorage[ index ].emission = vec3f( 0.0 );
						rayDataStorage[ index ].scatterColor = vec3f( input.scatterPdf );
						rayDataStorage[ index ].lightPdf = 0.0;
						rayDataStorage[ index ].shadowRayIntersectionIndex = - 1;
						return;

					}

					// apply the hero wavelength to dispersive surfaces, folding the spectral weight
					// into the throughput at the path's first dispersive interaction
					var throughputColor = input.throughputColor;
					let isDispersive = materialInfo.dispersion > 0.0 && surface.ior > 1.0 && surface.transmission > 0.0 && ! surface.thinWall;
					if ( isDispersive ) {

						let wavelength = abs( input.dispersionWavelength );
						${vi}( &surface, materialInfo.dispersion, wavelength );
						if ( input.dispersionWavelength < 0.0 ) {

							rayDataStorage[ index ].dispersionWavelength = wavelength;
							throughputColor *= ${yi}( wavelength );
							rayDataStorage[ index ].throughputColor = throughputColor;

						}

					}

					// attenuate the light transmitted through the volume when exiting a backface so
					// the surface's emission and NEE resolve against the attenuated throughput. MediumKernel
					// already applied a scattering medium's transmittance
					if ( input.side < 0.0 && materialInfo.transmission > 0.0 && ! segmentInMedium ) {

						throughputColor *= ${_i}( input.dist, materialInfo.attenuationColor, materialInfo.attenuationDistance );
						rayDataStorage[ index ].throughputColor = throughputColor;

					}

					// sample the next bounce direction and stage the scatter state for LogicKernel
					var scatterRec = ${a}( view, surface );
					let newBounce = input.currentBounce + 1u;

					// The first surface the path scatters off fills the denoiser's auxiliary images. Until one is
					// found the last mirror or transmission hit stands in, for paths that reach the environment.
					// The albedo is tinted by the throughput of the surfaces looked past to reach it. The packed
					// albedo's alpha marks the surface found
					let auxFound = unpack4x8unorm( input.auxAlbedo ).a != 0.0;
					if ( ! auxFound ) {

						let isAuxSurface = ${Mn}( surface, scatterRec );
						let auxAlbedo = saturate( throughputColor * surface.color );
						rayDataStorage[ index ].auxAlbedo = pack4x8unorm( vec4f( auxAlbedo, select( 0.0, 1.0, isAuxSurface ) ) );
						rayDataStorage[ index ].auxNormal = pack4x8snorm( vec4f( surface.normal, 0.0 ) );

					}

					// decide termination now so finished paths skip the bounce trace entirely - a
					// zeroed pdf reads as a terminating scatter in LogicKernel, which still resolves
					// the surface's emission and NEE before freeing the slot
					var isTerminated = newBounce >= maxBounces || all( scatterRec.color == vec3f( 0.0 ) ) || ${br}( scatterRec );

					// russian roulette early out:
					// Matches Cycles path_state_continuation_probability in integrator/path_state.h
					if ( ! isTerminated && newBounce >= 3u ) {

						let rrThroughput = throughputColor * scatterRec.color / scatterRec.pdf;
						let rrProb = saturate( sqrt( max( max( rrThroughput.r, rrThroughput.g ), rrThroughput.b ) ) );
						isTerminated = rrProb <= 0.0 || ${sr}( ${6} ) > rrProb;
						if ( ! isTerminated ) {

							// fold the survival boost into the scatter color so LogicKernel's
							// throughput update applies it without a separate division
							scatterRec.color /= rrProb;

						}

					}

					// Write the ray storage content here since things like the emissive value is read
					// in the logic kernel on the subsequent frame.
					rayDataStorage[ index ].scatterColor = scatterRec.color;
					rayDataStorage[ index ].scatterPdf = select( scatterRec.pdf, 0.0, isTerminated );
					rayDataStorage[ index ].minPdf = min( input.minPdf, scatterRec.pdf );
					rayDataStorage[ index ].isFullyTransmissive = input.isFullyTransmissive & select( 0u, 1u, scatterRec.isTransmissive );
					rayDataStorage[ index ].emission = surface.emission;
					rayDataStorage[ index ].currentBounce = newBounce;
					rayDataStorage[ index ].mediumScattered = 0u;

					// As in "KHR_materials_scatter", the surface bsdf is the medium's boundary: refracting out
					// ends the walk, reflecting continues it
					if ( segmentInMedium && u32( input.objectIndex ) == medium.object && input.side < 0.0 && scatterRec.isTransmissive ) {

						medium.inside = false;

					}

					// refracting into a front face of a scattering material starts a random walk inside it
					if ( scatterRec.isTransmissive && ! surface.thinWall && input.side > 0.0 ) {

						let entered = ${Qr}( materialInfo, u32( input.objectIndex ) );
						if ( entered.inside ) {

							medium = entered;

						}

					}

					// keep the medium the path left or entered
					if ( segmentInMedium || medium.inside ) {

						// a whole struct is written to the buffer, not through the pointer alias, which Safari fails to compile
						${e.rayDataStorage}[ index ].medium = ${Xr}( medium );

					}

					// the NEE shadow ray below still resolves the surface's direct light, so only
					// the bounce segment is skipped for finished paths. Inside a medium, MediumKernel walks it
					if ( ! isTerminated && medium.inside ) {

						rayDataStorage[ index ].walkPending = 1u;
						rayDataStorage[ index ].origin = ${Sr}( vertexData.position.xyz, scatterRec.direction, input.normal );
						rayDataStorage[ index ].direction = scatterRec.direction;
						rayDataStorage[ index ].rayStart = 0.0;

					} else if ( ! isTerminated ) {

						let rayIndex = atomicAdd( &queueCounters[ ${0}u ], 1u );
						rayQueue[ rayIndex ].origin = ${Sr}( vertexData.position.xyz, scatterRec.direction, input.normal );
						rayQueue[ rayIndex ].direction = scatterRec.direction;
						rayQueue[ rayIndex ].pixelIndex = input.pixelIndex;
						rayQueue[ rayIndex ].rngIndex = newBounce + input.alphaDepth + input.subsurfaceBounces;
						rayQueue[ rayIndex ].seed = input.seed;
						rayQueue[ rayIndex ].maxDist = 0.0;
						rayDataStorage[ index ].rayIntersectionIndex = i32( rayIndex );

						rayDataStorage[ index ].origin = rayQueue[ rayIndex ].origin;
						rayDataStorage[ index ].direction = scatterRec.direction;
						rayDataStorage[ index ].rayStart = 0.0;

					}

					// evaluate the bsdf toward the light LogicKernel selected and enqueue the shadow ray.
					// the light pdf will be 0 if NEE is disabled.
					var lightPdf = input.lightPdf;
					if ( lightPdf > 0.0 ) {

						let evalRec = ${o}( view, input.lightDirection, surface );
						if ( evalRec.pdf > 0.0 ) {

							rayDataStorage[ index ].lightBsdf = evalRec.color;
							rayDataStorage[ index ].lightBsdfPdf = evalRec.pdf;

							let shadowIndex = atomicAdd( &queueCounters[ ${1}u ], 1u );
							shadowRayQueue[ shadowIndex ].origin = ${Sr}( vertexData.position.xyz, input.lightDirection, input.normal );
							shadowRayQueue[ shadowIndex ].direction = input.lightDirection;
							shadowRayQueue[ shadowIndex ].pixelIndex = input.pixelIndex;
							shadowRayQueue[ shadowIndex ].rngIndex = input.currentBounce + input.alphaDepth + input.subsurfaceBounces;
							shadowRayQueue[ shadowIndex ].seed = input.seed;
							shadowRayQueue[ shadowIndex ].maxDist = input.lightDist * ( 1.0 - ${Ir} );
							rayDataStorage[ index ].shadowRayIntersectionIndex = i32( shadowIndex );

						} else {

							lightPdf = 0.0;

						}

					}

					if ( lightPdf <= 0.0 ) {

						rayDataStorage[ index ].lightPdf = 0.0;
						rayDataStorage[ index ].shadowRayIntersectionIndex = - 1;

					}

				}

			}
		`;
		super(l(e)), this.defineUniformAccessors(e);
	}
}, eo = class extends U {
	constructor() {
		let e = {
			rayQueue: i(new D(1, 1), Ja),
			queueCounters: i(new D(1, 1), "uint"),
			rayIntersectionsStorage: i(new D(1, 1), Ya),
			globalId: y
		}, t = z("bvhData.fns.raycastFirstHit.outputType"), n = z("bvhData.fns.raycastFirstHit"), r = H`

			fn compute( globalId: vec3u ) -> void {

				let rayQueue = &${e.rayQueue};
				let queueCounters = &${e.queueCounters};
				let rayIntersectionsStorage = &${e.rayIntersectionsStorage};

				let index = globalId.x;
				if ( index >= queueCounters[ ${0}u ] ) {

					return;

				}

				// whole structs are read from the buffer, not the pointer alias, which Safari fails to compile
				let queuedRay = ${e.rayQueue}[ index ];
				let indexUV = vec2u( queuedRay.pixelIndex >> 16, queuedRay.pixelIndex & 0xFFFF );
				${ar}( indexUV, queuedRay.seed, queuedRay.rngIndex );

				let ray = Ray( queuedRay.origin, queuedRay.direction, queuedRay.maxDist );
				var hitResult: ${t};
				if ( ${n}( ray, &hitResult ) ) {

					rayIntersectionsStorage[ index ].barycoord = hitResult.barycoord;
					rayIntersectionsStorage[ index ].objectIndex = i32( hitResult.objectIndex );
					rayIntersectionsStorage[ index ].position = ray.origin + ray.direction * hitResult.dist;
					rayIntersectionsStorage[ index ].dist = hitResult.dist;
					rayIntersectionsStorage[ index ].normal = hitResult.normal.xyz;
					rayIntersectionsStorage[ index ].side = hitResult.side;
					rayIntersectionsStorage[ index ].indices = hitResult.indices.xyz;

				} else {

					rayIntersectionsStorage[ index ].objectIndex = - 1;

				}

			}
		`;
		super(r(e)), this.defineUniformAccessors(e);
	}
}, to = class extends U {
	constructor() {
		let e = {
			shadowRayQueue: i(new D(1, 1), Ja),
			queueCounters: i(new D(1, 1), "uint"),
			shadowRayIntersectionsStorage: i(new D(1, 1), Xa),
			globalId: y
		}, t = z("bvhData.fns.raycastFirstHit.outputType"), n = z("bvhData.fns.raycastShadow"), r = H`

			fn compute( globalId: vec3u ) -> void {

				let shadowRayQueue = &${e.shadowRayQueue};
				let queueCounters = &${e.queueCounters};
				let shadowRayIntersectionsStorage = &${e.shadowRayIntersectionsStorage};

				let index = globalId.x;
				if ( index >= queueCounters[ ${1}u ] ) {

					return;

				}

				// whole structs are read from the buffer, not the pointer alias, which Safari fails to compile
				let queuedRay = ${e.shadowRayQueue}[ index ];
				let indexUV = vec2u( queuedRay.pixelIndex >> 16, queuedRay.pixelIndex & 0xFFFF );
				${ar}( indexUV, queuedRay.seed, queuedRay.rngIndex );

				let ray = Ray( queuedRay.origin, queuedRay.direction, queuedRay.maxDist );
				var hitResult: ${t};
				let occluded = ${n}( ray, &hitResult );
				shadowRayIntersectionsStorage[ index ].objectIndex = select( - 1, i32( hitResult.objectIndex ), occluded );
				shadowRayIntersectionsStorage[ index ].skippedOcclusion = hitResult.skippedOcclusion;
				shadowRayIntersectionsStorage[ index ].occlusion = hitResult.occlusion;

			}
		`;
		super(r(e)), this.defineUniformAccessors(e);
	}
}, no = class extends U {
	constructor() {
		let e = {
			maxSubsurfaceBounces: f(256, "uint"),
			stepsPerPass: f(16, "uint"),
			rayCount: f(0, "uint"),
			rayDataStorage: i(new D(1, 1), $),
			mediumQueue: i(new D(1, 1), "uint"),
			rayIntersectionsStorage: i(new D(1, 1), Ya),
			globalId: y
		}, t = z("bvhData.fns.raycastFirstHit.outputType"), n = z("bvhData.fns.raycastFirstHit"), r = H`

			fn compute( maxSubsurfaceBounces: u32, stepsPerPass: u32, rayCount: u32, globalId: vec3u ) -> void {

				let rayDataStorage = &${e.rayDataStorage};
				let mediumQueue = &${e.mediumQueue};
				let rayIntersectionsStorage = &${e.rayIntersectionsStorage};

				if ( globalId.x >= mediumQueue[ ${0}u ] ) {

					return;

				}

				let index = mediumQueue[ ${1}u + globalId.x ];
				// whole structs are read from the buffer, not the pointer alias, which Safari fails to compile
				let input = ${e.rayDataStorage}[ index ];
				let medium = ${Zr}( input.medium );

				let indexUV = vec2u( input.pixelIndex >> 16, input.pixelIndex & 0xFFFF );
				${ar}( indexUV, input.seed, input.currentBounce + input.alphaDepth + input.subsurfaceBounces );

				var ray = Ray( input.origin, input.direction, 0.0 );
				var weight = input.scatterColor;
				var subsurfaceBounces = input.subsurfaceBounces;
				var hasScattered = false;
				var isFinished = false;
				var isTerminated = false;

				for ( var i = 0u; i < stepsPerPass; i ++ ) {

					// only trace up to the sampled scatter event
					let channelPdf = ${$r}( input.throughputColor * weight, medium.albedo );
					let scatterDist = ${ei}( medium, channelPdf, ${q}( ${8} ) );
					ray.maxDist = scatterDist;

					var hitResult: ${t};
					let didHit = ${n}( ray, &hitResult );
					let surfaceDist = select( ${Fr}, hitResult.dist, didHit );

					let scattered = scatterDist < surfaceDist;
					let segmentDist = select( surfaceDist, scatterDist, scattered );
					let transmittance = exp( - medium.extinction * segmentDist );
					let distancePdf = dot( channelPdf, ${ti}( medium, segmentDist, scattered ) );
					if ( distancePdf <= 0.0 ) {

						isTerminated = true;
						break;

					}

					if ( ! scattered ) {

						// reaching the surface, weighted by the chance of not scattering before it
						weight *= transmittance / distancePdf;

						// The hit fills the ray results from the back, by the walk's medium queue position, while the
						// traced rays fill them from the front. A path slot walking a medium queued no ray this round,
						// so the two ranges never exceed the slot count or overlap
						let resultIndex = rayCount - 1u - globalId.x;
						rayIntersectionsStorage[ resultIndex ].barycoord = hitResult.barycoord;
						// a walk that leaves without hitting anything is a miss, as in the trace kernel
						rayIntersectionsStorage[ resultIndex ].objectIndex = select( - 1, i32( hitResult.objectIndex ), didHit );
						rayIntersectionsStorage[ resultIndex ].position = ray.origin + ray.direction * hitResult.dist;
						rayIntersectionsStorage[ resultIndex ].dist = hitResult.dist;
						rayIntersectionsStorage[ resultIndex ].normal = hitResult.normal.xyz;
						rayIntersectionsStorage[ resultIndex ].side = hitResult.side;
						rayIntersectionsStorage[ resultIndex ].indices = hitResult.indices.xyz;
						rayDataStorage[ index ].rayIntersectionIndex = i32( resultIndex );

						isFinished = true;
						break;

					}

					weight *= medium.albedo * medium.extinction * transmittance / distancePdf;
					ray.origin += ray.direction * scatterDist;
					ray.direction = ${Ar}( ray.direction, medium.anisotropy, ${q}( ${9} ) );
					hasScattered = true;

					// capped separately from bounces, and ends once the throughput is negligible
					subsurfaceBounces ++;
					let throughput = input.throughputColor * weight / input.scatterPdf;
					if ( subsurfaceBounces >= maxSubsurfaceBounces || max( max( throughput.r, throughput.g ), throughput.b ) < ${Kr} ) {

						isTerminated = true;
						break;

					}

					${or}();

				}

				// a zeroed pdf terminates the path in LogicKernel
				rayDataStorage[ index ].scatterColor = weight;
				rayDataStorage[ index ].scatterPdf = select( input.scatterPdf, 0.0, isTerminated );
				rayDataStorage[ index ].origin = ray.origin;
				rayDataStorage[ index ].direction = ray.direction;
				rayDataStorage[ index ].subsurfaceBounces = subsurfaceBounces;
				rayDataStorage[ index ].walkPending = select( 1u, 0u, isFinished || isTerminated );
				if ( hasScattered ) {

					rayDataStorage[ index ].mediumScattered = 1u;
					rayDataStorage[ index ].isFullyTransmissive = 0u;

				}

			}
		`;
		super(r(e)), this.defineUniformAccessors(e);
	}
}, ro = class extends U {
	constructor() {
		let e = {
			rayCount: f(0, "uint"),
			rayDataStorage: i(new D(1, 1), $).toReadOnly(),
			mediumQueue: i(new D(1, 1), "uint").toAtomic(),
			globalId: y
		}, t = H`

			fn compute( rayCount: u32, globalId: vec3u ) -> void {

				let rayDataStorage = &${e.rayDataStorage};
				let mediumQueue = &${e.mediumQueue};

				let index = globalId.x;
				if ( index >= rayCount ) {

					return;

				}

				if ( rayDataStorage[ index ].walkPending != 0u && rayDataStorage[ index ].objectIndex >= 0 ) {

					let queueIndex = atomicAdd( &mediumQueue[ ${0}u ], 1u );
					atomicStore( &mediumQueue[ ${1}u + queueIndex ], index );

				}

			}
		`;
		super(t(e)), this.defineUniformAccessors(e);
	}
}, io = class extends U {
	constructor(e = 0, t = 64) {
		let n = {
			queueCounters: i(new D(1, 1), "uint").toAtomic(),
			outputDispatch: i(new oe(3, 1), "u32").setName("outputDispatch")
		}, r = H`
			fn compute() -> void {

				let queueCounters = &${n.queueCounters};
				let outputDispatch = &${n.outputDispatch};

				let queueLength = atomicLoad( &queueCounters[ ${e}u ] );
				outputDispatch[ 0 ] = ( queueLength + ${t - 1}u ) / ${t}u;
				outputDispatch[ 1 ] = 1u;
				outputDispatch[ 2 ] = 1u;

			}
		`;
		super(r(n)), this.defineUniformAccessors(n);
	}
}, ao = class extends U {
	constructor() {
		let e = {
			rayDataStorage: i(new D(1, 1), $),
			pixelQueue: i(new D(1, 1), "uint").toAtomic(),
			start: f(0, "uint"),
			end: f(0, "uint"),
			addingSlots: f(0, "uint"),
			globalId: y
		}, t = H`
			fn compute( start: u32, end: u32, addingSlots: u32, globalId: vec3u ) -> void {

				let rayDataStorage = &${e.rayDataStorage};
				let pixelQueue = &${e.pixelQueue};

				let index = start + globalId.x;
				if ( index >= end ) {

					return;

				}

				if ( addingSlots == 0u ) {

					// slots being removed hand their pixel back before the pool is discarded
					let queueIndex = atomicAdd( &pixelQueue[ ${1}u ], 1u );
					atomicStore( &pixelQueue[ ${2}u + queueIndex ], rayDataStorage[ index ].pixelIndex );

				} else {

					// the pool never exceeds the pixel count, so the queue holds enough for every new slot
					let previousCount = atomicSub( &pixelQueue[ ${1}u ], 1u );
					rayDataStorage[ index ].pixelIndex = atomicLoad( &pixelQueue[ ${2}u + previousCount - 1u ] );
					rayDataStorage[ index ].resultColor = vec4f( 0.0 );
					rayDataStorage[ index ].throughputColor = vec3f( 0.0 );
					rayDataStorage[ index ].objectIndex = - 1;
					rayDataStorage[ index ].alphaDepth = 0u;
					rayDataStorage[ index ].rayIntersectionIndex = - 1;
					rayDataStorage[ index ].shadowRayIntersectionIndex = - 1;

				}

			}
		`;
		super(t(e)), this.defineUniformAccessors(e);
	}
}, oo = class extends U {
	constructor(e = {}) {
		let { type: t = "u32" } = e, n = {
			globalId: y,
			outputTarget: i(new oe(1, 1), t)
		}, r = H`
			fn compute( globalId: vec3u ) -> void {

				${n.outputTarget}[ globalId.x ] = 0;

			}
		`;
		super(r(n)), this.defineUniformAccessors({ target: n.outputTarget });
	}
}, so = class extends U {
	constructor(e) {
		let t = {
			source: i(new D(1, 1), e).toReadOnly(),
			target: i(new D(1, 1), e),
			count: f(0, "uint"),
			globalId: y
		}, n = H`
			fn compute( count: u32, globalId: vec3u ) -> void {

				let index = globalId.x;
				if ( index >= count ) {

					return;

				}

				${t.target}[ index ] = ${t.source}[ index ];

			}
		`;
		super(n(t)), this.defineUniformAccessors(t);
	}
}, co = 4294967296, lo = new C({
	minSamples: {
		type: "uint",
		atomic: !0
	},
	maxSamples: {
		type: "uint",
		atomic: !0
	},
	totalLo: {
		type: "uint",
		atomic: !0
	},
	totalHi: {
		type: "uint",
		atomic: !0
	},
	pixelCount: {
		type: "uint",
		atomic: !0
	}
}, "SampleCounters"), uo = class extends U {
	constructor() {
		let e = { counters: i(new D(1, 1), lo) }, t = H`
			fn compute() -> void {

				atomicStore( &${e.counters}[ 0 ].minSamples, 0xFFFFFFFFu );
				atomicStore( &${e.counters}[ 0 ].maxSamples, 0u );
				atomicStore( &${e.counters}[ 0 ].totalLo, 0u );
				atomicStore( &${e.counters}[ 0 ].totalHi, 0u );
				atomicStore( &${e.counters}[ 0 ].pixelCount, 0u );

			}
		`;
		super(t(e)), this.defineUniformAccessors(e);
	}
}, fo = class extends U {
	constructor() {
		let e = {
			globalId: y,
			counters: i(new D(1, 1), lo),
			sampleCountTarget: T(new v(1, 1)).toReadOnly()
		}, t = H`
			fn compute( globalId: vec3u ) -> void {

				let targetDimensions = textureDimensions( ${e.sampleCountTarget} );
				if ( globalId.x >= targetDimensions.x || globalId.y >= targetDimensions.y ) {

					return;

				}

				// pixels without a camera ray aren't part of the image, so skip rather than count zero
				let combinedField = textureLoad( ${e.sampleCountTarget}, globalId.xy ).r;
				if ( ( combinedField & ${ca}u ) == 0u ) {

					return;

				}

				let samples = combinedField & ${la}u;

				atomicMin( &${e.counters}[ 0 ].minSamples, samples );
				atomicMax( &${e.counters}[ 0 ].maxSamples, samples );
				atomicAdd( &${e.counters}[ 0 ].pixelCount, 1u );

				// the sum overflowed if it came out smaller than the value already there, so carry
				// the wrap into "totalHi"
				let previousTotal = atomicAdd( &${e.counters}[ 0 ].totalLo, samples );
				if ( previousTotal + samples < previousTotal ) {

					atomicAdd( &${e.counters}[ 0 ].totalHi, 1u );

				}

			}
		`;
		super(t(e)), this.defineUniformAccessors(e);
	}
}, po = Math.floor(134217728 / ($.getLength() * 4)), mo = 5, ho = class extends Ha {
	constructor(e) {
		super(e), this.seed = 0, this.mediumStepsPerPass = 16, this.envInfo = new ga(), this.backgroundInfo = new _a(), this.lightsInfo = new Ra(), this.rayCount = 0, this.rayDataStorage = null, this.rayQueue = null, this.shadowRayQueue = null, this.queueCounters = new D(/* @__PURE__ */ new Uint32Array(2), 1), this.queueCounters.name = "Queue Counters", this.rayIntersectionsStorage = null, this.shadowRayIntersectionsStorage = null, this.mediumQueue = null, this.pixelQueue = null, this.sampleCountersStorage = new D(/* @__PURE__ */ new Uint32Array(5), 5), this.sampleCountersStorage.name = "Sample Counters", this._samplesPromise = null, this.populatePixelIndicesKernel = new Za().setWorkgroupSize(8, 8, 1), this.logicKernel = new Qa().setWorkgroupSize(64, 1, 1), this.materialKernel = new $a().setWorkgroupSize(64, 1, 1), this.traceRayKernel = new eo().setWorkgroupSize(64, 1, 1), this.traceShadowRayKernel = new to().setWorkgroupSize(64, 1, 1), this.mediumKernel = new no().setWorkgroupSize(64, 1, 1), this.queueMediumWalksKernel = new ro().setWorkgroupSize(64, 1, 1), this.rayDispatchConverter = new io(0).setWorkgroupSize(1, 1, 1), this.shadowDispatchConverter = new io(1).setWorkgroupSize(1, 1, 1), this.mediumDispatchConverter = new io(0).setWorkgroupSize(1, 1, 1), this.primeSampleCountersKernel = new uo().setWorkgroupSize(1, 1, 1), this.tallySampleCountsKernel = new fo().setWorkgroupSize(8, 8, 1), this.resetSlotsKernel = new ao().setWorkgroupSize(64, 1, 1), this.copyRayDataKernel = new so($).setWorkgroupSize(64, 1, 1), this.logicKernel.envInfo = this.envInfo, this.logicKernel.backgroundInfo = this.backgroundInfo, this.logicKernel.lightsInfo = this.lightsInfo, this.zeroDispatchKernel = new oo().setWorkgroupSize(1, 1, 1);
	}
	resetSeed() {
		this.seed = 0;
	}
	reset() {
		super.reset(), this._samplesPromise = null;
	}
	setBVHData(e) {
		this.materialKernel.context.bvhData = e, this.materialKernel.needsUpdate = !0, this.traceRayKernel.context.bvhData = e, this.traceRayKernel.needsUpdate = !0, this.traceShadowRayKernel.context.bvhData = e, this.traceShadowRayKernel.needsUpdate = !0, this.mediumKernel.context.bvhData = e, this.mediumKernel.needsUpdate = !0, this.reset();
	}
	rebuild() {
		super.rebuild(), this.materialKernel.needsUpdate = !0, this.reset();
	}
	setRandom(e) {
		this.logicKernel.context.random = e, this.logicKernel.needsUpdate = !0, this.materialKernel.context.random = e, this.materialKernel.needsUpdate = !0, this.traceRayKernel.context.random = e, this.traceRayKernel.needsUpdate = !0, this.traceShadowRayKernel.context.random = e, this.traceShadowRayKernel.needsUpdate = !0, this.mediumKernel.context.random = e, this.mediumKernel.needsUpdate = !0, this.reset();
	}
	setMaterial(e) {
		this.materialKernel.material = e.getData(), this.materialKernel.needsUpdate = !0, this.reset();
	}
	setFilterGlossy(e) {
		this.materialKernel.filterGlossy = e === 0 ? di : 1 / e, this.reset();
	}
	setClamping(e, t) {
		this.logicKernel.clampDirect = e, this.logicKernel.clampIndirect = t, this.reset();
	}
	setTransmissiveBackground(e) {
		this.logicKernel.transmissiveBackground = e, this.reset();
	}
	setEnvironment(e) {
		this.envInfo.updateFrom(e);
	}
	setLights(e) {
		this.lightsInfo.updateFrom(this.renderer, e), this.reset();
	}
	setEnvironmentParams(e, t) {
		let { envInfo: n } = this, r = new N().makeRotationFromEuler(t).invert();
		n.rotationNode.value.setFromMatrix4(r), n.intensityNode.value = e;
	}
	setMultipleImportanceSampling(e) {
		this.logicKernel.misEnabled = +!!e, this.reset();
	}
	setBackground(e) {
		let { backgroundInfo: t } = this;
		t.dispose(), t.map = e;
	}
	setBackgroundParams(e, t, n) {
		let { backgroundInfo: r } = this, i = new N().makeRotationFromEuler(t).invert();
		r.rotationNode.value.copy(i), r.intensity = e, r.blur = n;
	}
	dispose() {
		super.dispose(), this.envInfo.dispose(), this.lightsInfo.dispose(), this.rayDataStorage?.dispose(), this.rayQueue?.dispose(), this.shadowRayQueue?.dispose(), this.queueCounters.dispose(), this.rayIntersectionsStorage?.dispose(), this.shadowRayIntersectionsStorage?.dispose(), this.mediumQueue?.dispose(), this.sampleCountersStorage.dispose(), this.pixelQueue?.dispose(), this.rayDispatchConverter.outputDispatch.dispose(), this.shadowDispatchConverter.outputDispatch.dispose(), this.mediumDispatchConverter.outputDispatch.dispose(), this.populatePixelIndicesKernel.dispose(), this.logicKernel.dispose(), this.materialKernel.dispose(), this.traceRayKernel.dispose(), this.traceShadowRayKernel.dispose(), this.mediumKernel.dispose(), this.queueMediumWalksKernel.dispose(), this.rayDispatchConverter.dispose(), this.shadowDispatchConverter.dispose(), this.mediumDispatchConverter.dispose(), this.primeSampleCountersKernel.dispose(), this.tallySampleCountsKernel.dispose(), this.resetSlotsKernel.dispose(), this.copyRayDataKernel.dispose(), this.zeroDispatchKernel.dispose();
	}
	_updatePixelQueue(e, t) {
		let n = 2 + Math.max(e * t, 1);
		(!this.pixelQueue || this.pixelQueue.array.length < n) && (this.pixelQueue?.dispose(), this.pixelQueue = new D(new Float32Array(n), n), this.pixelQueue.name = "Pixel Queue", this.materialKernel.pixelQueue = this.pixelQueue, this.populatePixelIndicesKernel.pixelQueue = this.pixelQueue, this.resetSlotsKernel.pixelQueue = this.pixelQueue);
	}
	_resizePool(e, t) {
		let { resetSlotsKernel: n, copyRayDataKernel: r } = this, i = this.rayCount, a = Math.min(i, t), o = Math.min(e, t);
		n.pixelQueue = this.pixelQueue, o < a && (n.rayDataStorage = this.rayDataStorage, n.start = o, n.end = a, n.addingSlots = !1, this.dispatch(n, n.getDispatchSize(a - o, 1, 1)));
		let s = new D(e, $.getLength());
		s.name = "Ray Data";
		let c = new D(e, Ja.getLength());
		c.name = "Ray Queue";
		let l = new D(e, Ja.getLength());
		l.name = "Shadow Ray Queue";
		let u = new D(e, Ya.getLength());
		u.name = "Ray Intersections";
		let d = new D(e, Xa.getLength());
		d.name = "Shadow Ray Intersections";
		let f = 1 + e, p = new D(new Uint32Array(f), f);
		p.name = "Medium Queue";
		let m = Math.min(e, i);
		m > 0 && (r.source = this.rayDataStorage, r.target = s, r.count = m, this.dispatch(r, r.getDispatchSize(m, 1, 1))), this.rayDataStorage?.dispose(), this.rayQueue?.dispose(), this.shadowRayQueue?.dispose(), this.rayIntersectionsStorage?.dispose(), this.shadowRayIntersectionsStorage?.dispose(), this.mediumQueue?.dispose(), this.rayDataStorage = s, this.rayQueue = c, this.shadowRayQueue = l, this.rayIntersectionsStorage = u, this.shadowRayIntersectionsStorage = d, this.mediumQueue = p, this.rayCount = e, o > a && (n.rayDataStorage = s, n.start = a, n.end = o, n.addingSlots = !0, this.dispatch(n, n.getDispatchSize(o - a, 1, 1)));
	}
	_getRequestedSlotCount() {
		return Math.min(po, Math.max(1, Math.floor(this.frameBudget)));
	}
	_getPreviewIterations() {
		return Math.max(1, Math.min(this.maxBounces, mo));
	}
	getPreviewPixelBudget() {
		return Math.min(this.frameBudget / this._getPreviewIterations(), po);
	}
	_applyBudget(e) {
		let t = this._getRequestedSlotCount();
		t !== this.rayCount && this._resizePool(t, e);
	}
	*createRenderTask() {
		let { renderer: e, maxTransparentBounces: t, logicKernel: n, materialKernel: r, traceRayKernel: i, traceShadowRayKernel: a, mediumKernel: o, queueMediumWalksKernel: s, rayDispatchConverter: c, shadowDispatchConverter: l, mediumDispatchConverter: u, zeroDispatchKernel: d, populatePixelIndicesKernel: f } = this, p = new A();
		this.getSize(p), this._updatePixelQueue(p.x, p.y);
		let m = p.x * p.y;
		for (this._applyBudget(m), yield* this.compileKernels([
			n,
			r,
			i,
			a,
			o,
			s,
			c,
			l,
			u,
			d,
			f
		]), d.target = this.queueCounters, this.dispatch(d, [2]), f.rayDataStorage = this.rayDataStorage, f.pixelQueue = this.pixelQueue, f.frameBudget = Math.min(this.rayCount, m), f.targetDimensions.copy(p), this.dispatch(f, f.getDispatchSize(p.x, p.y, 1)), this.seed++;;) {
			let f = Math.min(this._getRequestedSlotCount(), m), h = this.lowResMode ? this._getPreviewIterations() : 1, g = Math.max(h, Math.round(this.frameBudget / f));
			for (let f = 0; f < g; f++) {
				e.copyTextureToTexture(this.outputTarget, this.prevOutputTarget), [this.outputTarget, this.prevOutputTarget] = [this.prevOutputTarget, this.outputTarget], n.prevOutputTarget = this.prevOutputTarget, n.outputTarget = this.outputTarget, n.sampleCountTarget = this.sampleCountTarget, n.auxTarget = this.auxTarget ?? this._auxPlaceholder, n.accumulateAux = +!!this.auxTarget, n.rayDataStorage = this.rayDataStorage, n.rayIntersectionsStorage = this.rayIntersectionsStorage, n.shadowRayIntersectionsStorage = this.shadowRayIntersectionsStorage, n.maxBounces = this.maxBounces, n.rayCount = Math.min(this.rayCount, m), this.dispatch(n, n.getDispatchSize(n.rayCount, 1, 1)), this._applyBudget(m);
				let { rayDataStorage: f, rayQueue: h, shadowRayQueue: g, queueCounters: _, rayIntersectionsStorage: v, shadowRayIntersectionsStorage: y, mediumQueue: b } = this, x = Math.min(this.rayCount, m);
				d.target = _, this.dispatch(d, [2]), d.target = b, this.dispatch(d, [1]), r.rayDataStorage = f, r.rayQueue = h, r.shadowRayQueue = g, r.queueCounters = _, r.pixelQueue = this.pixelQueue, r.sampleCountTarget = this.sampleCountTarget, r.seed = this.seed, r.maxSamples = this.maxSamples, r.rayCount = x, r.maxTransparentBounces = t, r.maxBounces = this.maxBounces, r.targetDimensions.copy(p), this.dispatch(r, r.getDispatchSize(x, 1, 1)), c.queueCounters = _, this.dispatch(c, [
					1,
					1,
					1
				]), i.rayQueue = h, i.queueCounters = _, i.rayIntersectionsStorage = v, this.dispatch(i, c.outputDispatch), l.queueCounters = _, this.dispatch(l, [
					1,
					1,
					1
				]), a.shadowRayQueue = g, a.queueCounters = _, a.shadowRayIntersectionsStorage = y, this.dispatch(a, l.outputDispatch), s.rayDataStorage = f, s.mediumQueue = b, s.rayCount = x, this.dispatch(s, s.getDispatchSize(x, 1, 1)), u.queueCounters = b, this.dispatch(u, [
					1,
					1,
					1
				]), o.rayDataStorage = f, o.mediumQueue = b, o.rayIntersectionsStorage = v, o.rayCount = x, o.maxSubsurfaceBounces = this.maxSubsurfaceBounces, o.stepsPerPass = this.mediumStepsPerPass, this.dispatch(o, u.outputDispatch);
			}
			yield;
		}
	}
	getSampleCountsAsync() {
		if (this._samplesPromise === null) {
			let e = this._measureSampleCounts().finally(() => {
				this._samplesPromise === e && (this._samplesPromise = null);
			});
			this._samplesPromise = e;
		}
		return this._samplesPromise;
	}
	async _measureSampleCounts() {
		let { renderer: e, sampleCountTarget: t, sampleCountersStorage: n, primeSampleCountersKernel: r, tallySampleCountsKernel: i } = this;
		if (!e.initialized || this.lowResMode) return {
			min: 0,
			max: 0,
			avg: 0
		};
		r.counters = n, e.compute(r.kernel, [
			1,
			1,
			1
		]), i.counters = n, i.sampleCountTarget = t, e.compute(i.kernel, i.getDispatchSize(t.width, t.height));
		let a = await e.getArrayBufferAsync(n), o = new Uint32Array(a), s = o[4];
		if (s === 0) return {
			min: 0,
			max: 0,
			avg: 0
		};
		let c = o[3] * co + o[2];
		return {
			min: o[0],
			max: o[1],
			avg: c / s
		};
	}
}, go = "\n\n	// TODO: possibly this should be renamed something related to material or path tracing logic\n\n	#ifndef RAY_OFFSET\n	#define RAY_OFFSET 1e-4\n	#endif\n\n	// adjust the hit point by the surface normal by a factor of some offset and the\n	// maximum component-wise value of the current point to accommodate floating point\n	// error as values increase.\n	vec3 stepRayOrigin( vec3 rayOrigin, vec3 rayDirection, vec3 offset, float dist ) {\n\n		vec3 point = rayOrigin + rayDirection * dist;\n		vec3 absPoint = abs( point );\n		float maxPoint = max( absPoint.x, max( absPoint.y, absPoint.z ) );\n		return point + offset * ( maxPoint + 1.0 ) * RAY_OFFSET;\n\n	}\n\n	// https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md#attenuation\n	vec3 transmissionAttenuation( float dist, vec3 attColor, float attDist ) {\n\n		vec3 ot = - log( attColor ) / attDist;\n		return exp( - ot * dist );\n\n	}\n\n	vec3 getHalfVector( vec3 wi, vec3 wo, float eta ) {\n\n		// get the half vector - assuming if the light incident vector is on the other side\n		// of the that it's transmissive.\n		vec3 h;\n		if ( wi.z > 0.0 ) {\n\n			h = normalize( wi + wo );\n\n		} else {\n\n			// Scale by the ior ratio to retrieve the appropriate half vector\n			// From Section 2.2 on computing the transmission half vector:\n			// https://blog.selfshadow.com/publications/s2015-shading-course/burley/s2015_pbs_disney_bsdf_notes.pdf\n			h = normalize( wi + wo * eta );\n\n		}\n\n		h *= sign( h.z );\n		return h;\n\n	}\n\n	vec3 getHalfVector( vec3 a, vec3 b ) {\n\n		return normalize( a + b );\n\n	}\n\n	// The discrepancy between interpolated surface normal and geometry normal can cause issues when a ray\n	// is cast that is on the top side of the geometry normal plane but below the surface normal plane. If\n	// we find a ray like that we ignore it to avoid artifacts.\n	// This function returns if the direction is on the same side of both planes.\n	bool isDirectionValid( vec3 direction, vec3 surfaceNormal, vec3 geometryNormal ) {\n\n		bool aboveSurfaceNormal = dot( direction, surfaceNormal ) > 0.0;\n		bool aboveGeometryNormal = dot( direction, geometryNormal ) > 0.0;\n		return aboveSurfaceNormal == aboveGeometryNormal;\n\n	}\n\n	// ray sampling x and z are swapped to align with expected background view\n	vec2 equirectDirectionToUv( vec3 direction ) {\n\n		// from Spherical.setFromCartesianCoords\n		vec2 uv = vec2( atan( direction.z, direction.x ), acos( direction.y ) );\n		uv /= vec2( 2.0 * PI, PI );\n\n		// apply adjustments to get values in range [0, 1] and y right side up\n		uv.x += 0.5;\n		uv.y = 1.0 - uv.y;\n		return uv;\n\n	}\n\n	vec3 equirectUvToDirection( vec2 uv ) {\n\n		// undo above adjustments\n		uv.x -= 0.5;\n		uv.y = 1.0 - uv.y;\n\n		// from Vector3.setFromSphericalCoords\n		float theta = uv.x * 2.0 * PI;\n		float phi = uv.y * PI;\n\n		float sinPhi = sin( phi );\n\n		return vec3( sinPhi * cos( theta ), cos( phi ), sinPhi * sin( theta ) );\n\n	}\n\n	// power heuristic for multiple importance sampling\n	float misHeuristic( float a, float b ) {\n\n		float aa = a * a;\n		float bb = b * b;\n		return aa / ( aa + bb );\n\n	}\n\n	// tentFilter from Peter Shirley's 'Realistic Ray Tracing (2nd Edition)' book, pg. 60\n	// erichlof/THREE.js-PathTracing-Renderer/\n	float tentFilter( float x ) {\n\n		return x < 0.5 ? sqrt( 2.0 * x ) - 1.0 : 1.0 - sqrt( 2.0 - ( 2.0 * x ) );\n\n	}\n", _o = class extends ot {
	constructor() {
		super({
			uniforms: {
				envMap: { value: null },
				flipEnvMap: { value: -1 }
			},
			vertexShader: "\n				varying vec2 vUv;\n				void main() {\n\n					vUv = uv;\n					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n				}",
			fragmentShader: `
				#define ENVMAP_TYPE_CUBE_UV

				uniform samplerCube envMap;
				uniform float flipEnvMap;
				varying vec2 vUv;

				#include <common>
				#include <cube_uv_reflection_fragment>

				${go}

				void main() {

					vec3 rayDirection = equirectUvToDirection( vUv );
					rayDirection.x *= flipEnvMap;
					gl_FragColor = textureCube( envMap, rayDirection );

				}`
		}), this.depthWrite = !1, this.depthTest = !1;
	}
}, vo = class {
	constructor(e) {
		this._renderer = e, this._quad = new vn(new _o());
	}
	generate(e, t = null, n = null) {
		if (!e.isCubeTexture) throw Error("CubeToEquirectMaterial: Source can only be cube textures.");
		let r = e.images[0], i = this._renderer, a = this._quad;
		t === null && (t = 4 * r.height), n === null && (n = 2 * r.height);
		let o = new ze(t, n, {
			type: et,
			colorSpace: r.colorSpace
		}), s = r.height, c = Math.log2(s) - 2, l = 1 / s, u = 1 / (3 * Math.max(2 ** c, 112));
		a.material.defines.CUBEUV_MAX_MIP = `${c}.0`, a.material.defines.CUBEUV_TEXEL_WIDTH = u, a.material.defines.CUBEUV_TEXEL_HEIGHT = l, a.material.uniforms.envMap.value = e, a.material.uniforms.flipEnvMap.value = e.isRenderTargetTexture ? 1 : -1, a.material.needsUpdate = !0;
		let d = i.getRenderTarget(), f = i.autoClear;
		i.autoClear = !0, i.setRenderTarget(o), a.render(i), i.setRenderTarget(d), i.autoClear = f;
		let p = new Uint16Array(t * n * 4), m = new Float32Array(t * n * 4);
		i.readRenderTargetPixels(o, 0, 0, t, n, m), o.dispose();
		for (let e = 0, t = m.length; e < t; e++) p[e] = j.toHalfFloat(m[e]);
		let h = new M(p, t, n, P, Pe);
		return h.minFilter = Ye, h.magFilter = k, h.wrapS = Je, h.wrapT = Je, h.mapping = 303, h.needsUpdate = !0, h;
	}
	dispose() {
		this._quad.dispose();
	}
};
// node_modules/three-gpu-pathtracer/src/core/utils/sceneUpdateUtils.js
function yo(e, t) {
	return e.uuid < t.uuid ? 1 : e.uuid > t.uuid ? -1 : 0;
}
function bo(e) {
	return `${e.source.uuid}:${e.colorSpace}`;
}
function xo(e) {
	let t = [];
	return e.traverseVisible((e) => {
		(e.isRectAreaLight || e.isSpotLight || e.isPointLight || e.isDirectionalLight || e.isSunLight) && t.push(e);
	}), t.sort(yo);
}
// node_modules/three-gpu-pathtracer/src/webgpu/nodes/PathtracerBVHComputeData.js
var So = new Ne(), Co = new C({
	matrixWorld: "mat4x4f",
	inverseMatrixWorld: "mat4x4f",
	visible: "uint",
	materialIndex: "uint",
	visibleToShadowRays: "uint",
	_alignment0: "uint",
	color: "vec4f"
}, "TransformStruct"), wo = new C({
	indices: "vec4u",
	normal: "vec3f",
	didHit: "bool",
	barycoord: "vec3f",
	objectIndex: "uint",
	side: "float",
	dist: "float",
	skippedOcclusion: "float",
	occlusion: "float"
}, "PathTracerIntersectionResult"), To = class extends mn {
	constructor(e, t = {}) {
		super(e, {
			attributes: {
				position: "vec4f",
				normal: "vec4f",
				tangent: "vec4f",
				color: "vec4f",
				uv: "vec4f"
			},
			...t
		}), this.structs.transform = Co, this.structs.material = En, this.storage.materials = null, this.materialsMap = /* @__PURE__ */ new Map(), this.materials = [], this.bvhMap = /* @__PURE__ */ new Map(), this.textureAtlas = new wa();
	}
	updateUvAttributesFromScene() {
		let { attributes: e } = this, t = /* @__PURE__ */ new Set(["color"]);
		for (let n = 0; n < 8; n++) {
			let r = n === 0 ? "uv" : "uv" + n;
			delete e[r], t.add(r);
		}
		this.getRootObject().traverse((n) => {
			if (n.geometry) for (let r in n.geometry.attributes) t.has(r) && (e[r] = "vec4f");
		});
	}
	updateUvSampleFunction() {
		let { structs: e, fns: t } = this, n = [], r = null;
		e.attributes.membersLayout.forEach(({ name: e }) => {
			if (/^uv/.test(e)) {
				let t = e === "uv" ? 0 : Number(e.replace(/^uv/, ""));
				n.push(`
					case ${t}u: {

						return vertexData.${e}.xy;

					}
				`), r === null && (r = `vertexData.${e}.xy`);
			}
		}), t.getUvFromChannel = H`
			fn getUvFromChannel( vertexData: ${e.attributes}, packed: i32 ) -> vec2f {

				// the uv channel is packed into bits 23-25 of the "*Map" descriptor
				let channel = u32( ( packed >> 23 ) & 0x7 );
				switch ( channel ) {

					${n.join("\n")}
					default: {

						return ${r ?? "vec2f( 0.0 )"};

					}

				}

			}
		`;
	}
	updateColorSampleFn() {
		let { structs: e, fns: t } = this;
		t.getColor = e.attributes.membersLayout.find(({ name: e }) => e === "color") ? H`
				fn getColor( vertexData: ${e.attributes} ) -> vec4f {

					return vertexData.color;

				}
			` : H`
				fn getColor( vertexData: ${e.attributes} ) -> vec4f {

					return vec4f( 1.0 );

				}
			`;
	}
	useTransparencyRaycastFn() {
		let { textureAtlas: e, storage: t, fns: n } = this, r = e.texture, i = wr(o(e.textureInfo, "uvec4").setName("bvh_textureInfo"), E(r));
		n.getSurfaceRecord = fi(i, n.getUvFromChannel, n.getColor);
		let a = u().toVar("bvh_materialIndex"), s = O(1).toVar("bvh_rayScalar"), c = O(1).toVar("bvh_baseOpacity"), l = _(!1).toVar("bvh_isShadowRay"), d = _(!1).toVar("bvh_skipShadowObject"), f = {
			shapeStruct: I,
			resultStruct: wo,
			boundsOrderFn: H`
				fn getBoundsOrder( ray: ${I}, splitAxis: u32, node: ${ct} ) -> bool {

					return ray.direction[ splitAxis ] >= 0.0;

				}
			`,
			intersectsBoundsFn: H`
				fn rayIntersectsBounds( ray: ${I}, bounds: ${F}, result: ptr<function, ${wo}> ) -> u32 {

					// early-out if our object is completely transparent, or a shadow ray is already occluded
					if ( ${c} == 0.0 || ( ${l} && result.didHit ) ) {

						return 0u;

					}

					let boundsMin = vec3( bounds.min[0], bounds.min[1], bounds.min[2] );
					let boundsMax = vec3( bounds.max[0], bounds.max[1], bounds.max[2] );

					let invDir = 1.0 / ray.direction;
					let tMinPlane = ( boundsMin - ray.origin ) * invDir;
					let tMaxPlane = ( boundsMax - ray.origin ) * invDir;

					let tMinHit = min( tMinPlane, tMaxPlane );
					let tMaxHit = max( tMinPlane, tMaxPlane );

					let t0 = max( max( tMinHit.x, tMinHit.y ), tMinHit.z );
					let t1 = min( min( tMaxHit.x, tMaxHit.y ), tMaxHit.z );

					let dist = max( t0, 0.0 );
					if ( t1 < dist ) {

						return 0u;

					} else if ( ray.maxDist > 0.0 && dist * ${s} >= ray.maxDist ) {

						return 0u;

					} else if ( result.didHit && dist * ${s} >= result.dist ) {

						return 0u;

					} else {

						return 1u;

					}

				}

			`,
			intersectRangeFn: H`
				fn intersectRange( ray: ${I}, offset: u32, count: u32, result: ptr<function, ${wo}> ) -> bool {

					var didHit = false;
					for ( var ti = offset; ti < offset + count; ti = ti + 1u ) {

						let i0 = ${t.index}[ ti * 3u ];
						let i1 = ${t.index}[ ti * 3u + 1u ];
						let i2 = ${t.index}[ ti * 3u + 2u ];

						let a = ${t.attributes}[ i0 ].position.xyz;
						let b = ${t.attributes}[ i1 ].position.xyz;
						let c = ${t.attributes}[ i2 ].position.xyz;

						var triResult = ${Wt}( ray, a, b, c, 0.0 );
						triResult.dist *= ${s};
						if ( triResult.didHit && ( ray.maxDist <= 0.0 || triResult.dist < ray.maxDist ) && ( ! result.didHit || triResult.dist < result.dist ) ) {

							let material = ${t.materials}[ ${a} ];

							// TODO: if material is a transmissive volume we may need to assume double-sidedness
							// shadow rays hit both sides
							if ( ! ${l} && material.side != 0 && triResult.side != material.side ) {

								continue;

							}

							var opacity = ${c};
							if ( material.transparent != 0 || material.alphaTest > 0.0 ) {

								// add support for vertex color opacity
								if ( material.vertexColors == 1 ) {

									let barycoord = triResult.barycoord;
									let a = ${n.getColor}( ${t.attributes}[ i0 ] );
									let b = ${n.getColor}( ${t.attributes}[ i1 ] );
									let c = ${n.getColor}( ${t.attributes}[ i2 ] );
									let col = barycoord.x * a + barycoord.y * b + barycoord.z * c;

									opacity *= col.a;

								}

								// account for alpha component of albedo map
								if ( material.map != - 1 ) {

									let barycoord = triResult.barycoord;
									let a = ${n.getUvFromChannel}( ${t.attributes}[ i0 ], material.map );
									let b = ${n.getUvFromChannel}( ${t.attributes}[ i1 ], material.map );
									let c = ${n.getUvFromChannel}( ${t.attributes}[ i2 ], material.map );
									let uv = barycoord.x * a + barycoord.y * b + barycoord.z * c;
									let uvPrime = material.mapTransform * vec3f( uv, 1 );

									opacity *= ${i}( uvPrime.xy, material.map, 0 ).a;

								}

								// account for green component of alpha map
								if ( material.alphaMap != - 1 ) {

									let barycoord = triResult.barycoord;
									let a = ${n.getUvFromChannel}( ${t.attributes}[ i0 ], material.alphaMap );
									let b = ${n.getUvFromChannel}( ${t.attributes}[ i1 ], material.alphaMap );
									let c = ${n.getUvFromChannel}( ${t.attributes}[ i2 ], material.alphaMap );
									let uv = barycoord.x * a + barycoord.y * b + barycoord.z * c;
									let uvPrime = material.alphaMapTransform * vec3f( uv, 1 );

									opacity *= ${i}( uvPrime.xy, material.alphaMap, 0 ).g;

								}

								// Opacity is resolved at surface processing but skip full transparent hits here.
								if ( material.transparent != 0 && opacity <= 0.0 ) {

									continue;

								}

								if ( opacity < material.alphaTest ) {

									continue;

								}

							}

							// shadow rays skip the objects not visible to them. Record the share of bsdf rays this face
							// would stop: all of them if it's opaque, its opacity if it's partially transparent
							if ( ${d} ) {

								if ( material.side == 0 || triResult.side == material.side ) {

									result.skippedOcclusion += ( 1.0 - result.skippedOcclusion ) * select( 1.0, opacity, material.transparent != 0 );

								}

								continue;

							}

							// shadow rays pass partially transparent surfaces, each blocking its opacity's share of the
							// light still getting through, just as bsdf rays pass them by chance
							if ( ${l} && material.transparent != 0 && opacity < 1.0 ) {

								result.occlusion += ( 1.0 - result.occlusion ) * opacity;
								continue;

							}

							result.didHit = true;
							result.dist = triResult.dist;
							result.normal = triResult.normal;
							result.side = triResult.side;
							result.barycoord = triResult.barycoord;
							result.indices = vec4u( i0, i1, i2, ti );

							didHit = true;

						}

					}

					return didHit;

				}
			`,
			transformShapeFn: H`
				fn transformRay( ray: ptr<function, ${I}>, objectIndex: u32 ) -> void {

					let toLocal = ${t.transforms}[ objectIndex ].inverseMatrixWorld;
					ray.origin = ( toLocal * vec4f( ray.origin, 1.0 ) ).xyz;
					ray.direction = ( toLocal * vec4f( ray.direction, 0.0 ) ).xyz;

					let len = length( ray.direction );
					ray.direction /= len;
					${s} = 1.0 / len;

					let object = ${t.transforms}[ objectIndex ];
					${a} = object.materialIndex;

					let material = ${t.materials}[ object.materialIndex ];
					if ( material.transparent == 1 ) {

						${c} = material.opacity * object.color.a;

					} else {

						${c} = 1.0;

					}

					${d} = ${l} && object.visibleToShadowRays == 0u;

				}
			`,
			transformResultFn: H`
				fn transformResult( hit: ptr<function, ${wo}>, objectIndex: u32 ) -> void {

					let toLocal = ${t.transforms}[ objectIndex ].inverseMatrixWorld;
					hit.normal = normalize( ( transpose( toLocal ) * vec4f( hit.normal, 0.0 ) ).xyz );
					hit.objectIndex = objectIndex;

				}
			`,
			resetShapeFn: H`
				fn resetRayScalar( objectIndex: u32 ) -> void {

					${s} = 1.0;
					${c} = 1.0;

				}
			`
		};
		n.raycastFirstHit = this.getShapecastFn({
			...f,
			name: "raycastFirstHit",
			prefixFn: H`
				fn initFirstHitCull() -> void {

					${l} = false;

				}
			`
		}), n.raycastShadow = this.getShapecastFn({
			...f,
			name: "raycastShadow",
			prefixFn: H`
				fn initShadowCull() -> void {

					${l} = true;

				}
			`
		});
	}
	update() {
		let { structs: e } = this, t = new D(/* @__PURE__ */ new Uint8Array(), e.material.getLength());
		this.storage.materials = i(t, e.material).toReadOnly().setName("bvh_materials"), this.updateUvAttributesFromScene(), this.updateMaterialsMap(), super.update(), this.updateUvSampleFunction(), this.updateColorSampleFn(), this.updateMaterials(), this.bvhMap.clear(), this.useTransparencyRaycastFn();
	}
	updateMaterialsMap() {
		let { materials: e, materialsMap: t } = this;
		t.clear(), e.length = 0, this.getRootObject().traverse((e) => {
			e.material && (Array.isArray(e.material) ? e.material.forEach((e) => e && n(e)) : n(e.material));
		}), e.sort((e, t) => e.uuid < t.uuid ? 1 : -1).forEach((e, n) => {
			t.set(e, n);
		});
		function n(n) {
			t.has(n) || (e.push(n), t.set(n, -1));
		}
	}
	updateMaterials() {
		this.updateMaterialsMap();
		let { materials: e, storage: t, structs: n, bvh: r } = this, { materialData: i, textures: a } = this.writeMaterialsBuffer(e), o = t.materials.proxyNode, s = t.transforms.proxyNode, c = i.length / n.material.getLength();
		o.value.count < c && (o.value.dispose(), o.value = new D(i, n.material.getLength())), o.value.array.set(i), o.value.needsUpdate = !0, this._getTransformMap(r).forEach((e) => {
			this.writeMaterialData(e, e.slot, s.value.array.buffer);
		}), s.value.needsUpdate = !0, this.textures = a;
	}
	writeMaterialsBuffer(e) {
		function t(e) {
			switch (e) {
				case Je: return 0;
				case Ie: return 1;
				case Xe: return 2;
				default: return 0;
			}
		}
		function n(e, n) {
			if (n in e && e[n]) {
				let r = e[n], i = bo(r);
				o.has(i) || (o.set(i, o.size), s.push(r));
				let a = o.get(i), c = r.channel & 7, l = t(r.wrapS), u = t(r.wrapT);
				return (r.magFilter === 1003) << 30 | u << 28 | l << 26 | c << 23 | a & 8388607;
			}
			return -1;
		}
		function r(e, t, n) {
			return t in e ? e[t] : n;
		}
		function i(e, t, n, r) {
			let i = e[t] && e[t].isTexture ? e[t] : null;
			if (i) {
				i.matrixAutoUpdate && i.updateMatrix();
				let e = i.matrix.elements;
				for (let t = 0; t < 3; t++) n[r + 4 * t + 0] = e[3 * t + 0], n[r + 4 * t + 1] = e[3 * t + 1], n[r + 4 * t + 2] = e[3 * t + 2], n[r + 4 * t + 3] = 0;
			}
			return 12;
		}
		let a = 0, o = /* @__PURE__ */ new Map(), s = [], c = Math.max(e.length, 2), l = new Float32Array(c * this.structs.material.getLength()), u = new Int32Array(l.buffer);
		for (let t = 0, o = e.length; t < o; t++) {
			let o = e[t];
			l[a++] = o.color.r, l[a++] = o.color.g, l[a++] = o.color.b, u[a++] = n(o, "map"), l[a++] = r(o, "metalness", 0), u[a++] = n(o, "metalnessMap"), l[a++] = r(o, "roughness", 0), u[a++] = n(o, "roughnessMap"), l[a++] = r(o, "ior", 1.5), l[a++] = r(o, "transmission", 0), u[a++] = n(o, "transmissionMap"), l[a++] = r(o, "emissiveIntensity", 0), "emissive" in o ? (l[a++] = o.emissive.r, l[a++] = o.emissive.g, l[a++] = o.emissive.b) : (l[a++] = 0, l[a++] = 0, l[a++] = 0), u[a++] = n(o, "emissiveMap"), u[a++] = n(o, "normalMap"), a++, "normalScale" in o ? (l[a++] = o.normalScale.x, l[a++] = o.normalScale.y) : (l[a++] = 1, l[a++] = 1), l[a++] = r(o, "clearcoat", 0), u[a++] = n(o, "clearcoatMap"), u[a++] = n(o, "clearcoatNormalMap"), a++, "clearcoatNormalScale" in o ? (l[a++] = o.clearcoatNormalScale.x, l[a++] = o.clearcoatNormalScale.y) : (l[a++] = 1, l[a++] = 1), l[a++] = r(o, "clearcoatRoughness", 0), u[a++] = n(o, "clearcoatRoughnessMap"), u[a++] = n(o, "iridescenceMap"), u[a++] = n(o, "iridescenceThicknessMap"), l[a++] = r(o, "iridescence", 0), l[a++] = r(o, "iridescenceIOR", 1.3), l[a++] = r(o, "iridescenceThicknessMinimum", 100), l[a++] = r(o, "iridescenceThicknessMaximum", 400), l[a++] = r(o, "diffuseRoughness", 0), l[a++] = r(o, "dispersion", 0), "specularColor" in o ? (l[a++] = o.specularColor.r, l[a++] = o.specularColor.g, l[a++] = o.specularColor.b) : (l[a++] = 1, l[a++] = 1, l[a++] = 1), u[a++] = n(o, "specularColorMap"), l[a++] = r(o, "specularIntensity", 1), u[a++] = n(o, "specularIntensityMap");
			let s = r(o, "thickness", 0) === 0 && r(o, "attenuationDistance", Infinity) === Infinity;
			if (u[a++] = Number(s), a++, "attenuationColor" in o ? (l[a++] = o.attenuationColor.r, l[a++] = o.attenuationColor.g, l[a++] = o.attenuationColor.b) : (l[a++] = 1, l[a++] = 1, l[a++] = 1), l[a++] = r(o, "attenuationDistance", Infinity), u[a++] = n(o, "alphaMap"), u[a++] = Number(r(o, "castShadow", !0)), l[a++] = o.opacity, l[a++] = o.alphaTest, !s && o.transmission > 0) l[a++] = 0;
			else switch (o.side) {
				case 0:
					l[a++] = 1;
					break;
				case 1:
					l[a++] = -1;
					break;
				case 2: l[a++] = 0;
			}
			u[a++] = Number(r(o, "matte", !1)), l[a++] = r(o, "sheen", 0), a++, "sheenColor" in o ? (l[a++] = o.sheenColor.r, l[a++] = o.sheenColor.g, l[a++] = o.sheenColor.b) : (l[a++] = 0, l[a++] = 0, l[a++] = 0), u[a++] = n(o, "sheenColorMap"), l[a++] = r(o, "sheenRoughness", 0), u[a++] = n(o, "sheenRoughnessMap"), u[a++] = Number(o.vertexColors), u[a++] = Number(o.flatShading), u[a++] = Number(o.transparent), u[a++] = 0, l[a++] = r(o, "anisotropy", 0), l[a++] = r(o, "anisotropyRotation", 0), u[a++] = n(o, "anisotropyMap"), a++, a++, a++, a += i(o, "map", l, a), a += i(o, "metalnessMap", l, a), a += i(o, "roughnessMap", l, a), a += i(o, "transmissionMap", l, a), a += i(o, "emissiveMap", l, a), a += i(o, "normalMap", l, a), a += i(o, "clearcoatMap", l, a), a += i(o, "clearcoatNormalMap", l, a), a += i(o, "clearcoatRoughnessMap", l, a), a += i(o, "sheenColorMap", l, a), a += i(o, "sheenRoughnessMap", l, a), a += i(o, "iridescenceMap", l, a), a += i(o, "iridescenceThicknessMap", l, a), a += i(o, "specularColorMap", l, a), a += i(o, "specularIntensityMap", l, a), a += i(o, "alphaMap", l, a), a += i(o, "anisotropyMap", l, a);
			let c = r(o, "multiscatterColor", null);
			l[a++] = c ? c.r : 1, l[a++] = c ? c.g : 1, l[a++] = c ? c.b : 1, l[a++] = r(o, "scatterStrength", 0), l[a++] = r(o, "scatterAnisotropy", 0), a += 3;
		}
		return {
			materialData: u,
			textures: s
		};
	}
	writeMaterialData(e, t, n) {
		let { materialsMap: r } = this, { object: i, instanceId: a, root: o } = e, s = i.material;
		if (Array.isArray(s)) {
			let { materialIndex: e } = i.geometry.groups[o];
			s = s[e];
		}
		let c = new Uint32Array(n), l = r.has(s) ? r.get(s) : -1;
		l === -1 && (c[t * Co.getLength() + 32] = 0), c[t * Co.getLength() + 33] = l, i.isInstancedMesh && i.instanceColor ? (i.getColorAt(a, So), So.w = 1) : i.isBatchedMesh && i._colorsTexture ? i.getColorAt(a, So) : So.setScalar(1);
		let u = new Float32Array(n);
		So.toArray(u, t * Co.getLength() + 36);
	}
	writeTransformData(e, t, n, r) {
		super.writeTransformData(e, t, n, r), this.writeMaterialData(e, n, r);
		let i = new Uint32Array(r);
		i[n * this.structs.transform.getLength() + 34] = e.object.visibleToShadowRays === !1 ? 0 : 1;
	}
	getBVH(e, t, n) {
		let { bvhMap: r } = this, i = super.getBVH(e, t, n);
		if (r.has(i)) {
			let e = r.get(i);
			if (Object.assign(n, e.range), i !== e.bvh && i instanceof fe) {
				let t = i.mesh, n = e.bvh.mesh;
				n.matrixWorld.copy(t.matrixWorld).decompose(n.position, n.quaternion, n.scale), i.refit(), i.getBoundingBox(n.boundingBox), i.geometry.computeBoundingBox();
			}
			return e.bvh;
		}
		if (i.indirect) {
			let e = new Re();
			e.attributes = i.geometry.attributes;
			let t;
			if (i.geometry.index) t = i.geometry.index.array.slice(n.start, n.count + n.start);
			else {
				let { start: e, count: r } = n;
				t = new Uint32Array(r);
				for (let r = 0, i = n.count; r < i; r++) t[r] = e + r;
			}
			e.index = new we(t, 1), n.start = 0;
			let a;
			if (i instanceof fe) {
				let t = i.mesh, n = new Fe(e);
				n.copy(t), n.matrixWorld.copy(t.matrixWorld).decompose(n.position, n.quaternion, n.scale), a = new fe(n, {
					strategy: 2,
					targetLeafSize: 5
				});
			} else a = new be(e, {
				strategy: 2,
				targetLeafSize: 5
			});
			return r.set(i, {
				bvh: a,
				range: { ...n }
			}), a;
		}
		return i;
	}
	dispose() {
		let { storage: e } = this;
		for (let t in e) e[t].value?.dispose();
	}
}, Eo = class extends ne {
	set texture(e) {
		this._texNode.value = e;
	}
	set layer(e) {
		this._layerUniform.value = e;
	}
	constructor() {
		super(), this.blending = 0, this._texNode = E(new M()), this._layerUniform = f(0), this.colorNode = g("\n			fn atlasDebug( tex: texture_2d_array<f32>, coord: vec2f, layer: f32 ) -> vec4f {\n\n				// flip y so texel origin shows at the top-left\n				let dims = vec2f( textureDimensions( tex, 0 ).xy );\n				let texel = vec2i( vec2f( coord.x, 1.0 - coord.y ) * dims );\n				return textureLoad( tex, texel, i32( layer ), 0 );\n\n			}\n		")(this._texNode, c(s()), this._layerUniform);
	}
}, Do = class extends ne {
	set texture(e) {
		this._texNode.value = e;
	}
	set minCount(e) {
		this._minUniform.value = e;
	}
	set maxCount(e) {
		this._maxUniform.value = e;
	}
	constructor() {
		super(), this.blending = 0, this._texNode = E(new v(1, 1)), this._minUniform = f(0), this._maxUniform = f(1);
		let e = H`
			fn sampleDensity( tex: texture_2d<u32>, coord: vec2f, minCount: f32, maxCount: f32 ) -> vec4f {

				let dims = vec2f( textureDimensions( tex, 0 ) );
				let texel = vec2i( coord * dims );

				// the high bits hold the ray state flags rather than part of the count
				let samples = textureLoad( tex, texel, 0 ).r & ${la}u;

				// stretched across the recorded range rather than from zero, otherwise a converged
				// image with counts bunched near the max reads as uniformly hot
				let range = max( maxCount - minCount, 1.0 );
				let t = clamp( ( f32( samples ) - minCount ) / range, 0.0, 1.0 );

				return vec4f( ${xn}( t ), 1.0 );

			}
		`;
		this.colorNode = e(this._texNode, c(s()), this._minUniform, this._maxUniform);
	}
}, Oo = class extends ne {
	set texture(e) {
		this._texNode.value = e;
	}
	set showNormal(e) {
		this._showNormalUniform.value = +!!e;
	}
	constructor() {
		super(), this.blending = 0, this._texNode = E(Rn()), this._showNormalUniform = f(0, "uint");
		let e = H`
			fn auxDebug( tex: texture_2d_array<u32>, coord: vec2f, showNormal: u32 ) -> vec4f {

				// the rows are stored top down, so the quad's bottom up uv is flipped
				let texel = vec2u( vec2f( coord.x, 1.0 - coord.y ) * vec2f( textureDimensions( tex, 0 ) ) );
				var packed: vec3u;
				for ( var layer = 0u; layer < ${3}u; layer ++ ) {

					packed[ layer ] = textureLoad( tex, texel, layer, 0 ).r;

				}

				let albedo = ${Nn}( packed );
				let normal = ${Pn}( packed );
				return vec4f( select( albedo, normal, showNormal == 1u ), 1.0 );

			}
		`;
		this.colorNode = e(this._texNode, c(s()), this._showNormalUniform);
	}
};
// node_modules/three-gpu-pathtracer/src/core/utils/GeometryPreparationUtils.js
function ko(e, t) {
	if (!e.index) {
		let t = e.attributes.position.count, n = Array(t);
		for (let e = 0; e < t; e++) n[e] = e;
		e.setIndex(n);
	}
	if (!e.attributes.normal && t && t.includes("normal") && e.computeVertexNormals(), !e.attributes.uv && t && t.includes("uv")) {
		let t = e.attributes.position.count;
		e.setAttribute("uv", new we(new Float32Array(t * 2), 2, !1));
	}
	if (!e.attributes.uv2 && t && t.includes("uv2")) {
		let t = e.attributes.position.count;
		e.setAttribute("uv2", new we(new Float32Array(t * 2), 2, !1));
	}
	if (!e.attributes.tangent && t && t.includes("tangent")) {
		if (e.attributes.uv && e.attributes.normal) e.computeTangents();
		else {
			let t = e.attributes.position.count;
			e.setAttribute("tangent", new we(new Float32Array(t * 4), 4, !1));
		}
	}
	if (!e.attributes.color && t && t.includes("color")) {
		let t = e.attributes.position.count, n = new Float32Array(t * 4);
		n.fill(1), e.setAttribute("color", new we(n, 4));
	}
}
// node_modules/three-gpu-pathtracer/src/webgpu/materials/PathtracingMaterial.js
var Ao = class {
	init() {}
	getBsdfNode() {
		return H`

			fn bsdfSample( worldWo: vec3f, surf: SurfaceRecord ) -> ScatterRecord {

				var record: ScatterRecord;

				let wo = normalize( surf.normalInvBasis * worldWo );
				let wi = ${Er}( wo, ${q}( ${3} ) );
				record.color = surf.color * max( wi.z, 0.0 );
				record.pdf = max( wi.z, 0.0 ) / PI;
				record.direction = normalize( surf.normalBasis * wi );

				return record;

			}

		`;
	}
	getBsdfEvalPdfNode() {
		return H`

			fn bsdfEvalPdf( worldWo: vec3f, worldWi: vec3f, surf: SurfaceRecord ) -> ScatterRecord {

				var record: ScatterRecord;
				record.direction = worldWi;

				let wo = normalize( surf.normalInvBasis * worldWo );
				let wi = normalize( surf.normalInvBasis * worldWi );
				record.color = surf.color * max( wi.z, 0.0 );
				record.pdf = max( wi.z, 0.0 ) / PI;

				return record;

			}

		`;
	}
	getData() {
		return {
			bsdfSample: this.getBsdfNode(),
			bsdfEvalPdf: this.getBsdfEvalPdfNode()
		};
	}
}, jo = g("\n\n	fn eonDirectionalAlbedo( mu: f32, roughness: f32, A: f32 ) -> f32 {\n\n		let muComp = 1.0 - mu;\n		let gOverPi = muComp * (\n			0.0571085289 + muComp * (\n				0.491881867 + muComp * (\n					- 0.332181442 + muComp * 0.0714429953\n				)\n			)\n		);\n		return A * ( 1.0 + roughness * gOverPi );\n\n	}\n\n"), Mo = g("\n\n	fn fonSingleScatter( NdotV: f32, NdotL: f32, VdotH: f32, roughness: f32, A: f32, rho: vec3f ) -> vec3f {\n\n		let VdotL = 2.0 * VdotH * VdotH - 1.0;\n		let s = VdotL - NdotV * NdotL;\n		let sOverT = select( s, s / max( NdotV, NdotL ), s > 0.0 );\n\n		return ( rho / PI ) * A * ( 1.0 + roughness * sOverT );\n\n	}\n\n", [W]);
g("\n\n	fn fonBrdf( NdotV: f32, NdotL: f32, VdotH: f32, surf: SurfaceRecord ) -> vec3f {\n\n		let roughness = surf.diffuseRoughness;\n		if ( roughness < 1e-5 ) {\n\n			return surf.color / PI;\n\n		}\n\n		let rho = saturate( surf.color );\n		let A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );\n\n		return fonSingleScatter( NdotV, NdotL, VdotH, roughness, A, rho );\n\n	}\n\n", [
	W,
	G,
	Mo
]);
var No = g("\n\n	fn eonBrdf( NdotV: f32, NdotL: f32, VdotH: f32, surf: SurfaceRecord ) -> vec3f {\n\n		let roughness = surf.diffuseRoughness;\n		if ( roughness < 1e-5 ) {\n\n			return surf.color / PI;\n\n		}\n\n		let rho = saturate( surf.color );\n		let A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );\n		let singleScatter = fonSingleScatter( NdotV, NdotL, VdotH, roughness, A, rho );\n\n		let averageDirectionalAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );\n		let directionalAlbedoV = eonDirectionalAlbedo( NdotV, roughness, A );\n		let directionalAlbedoL = eonDirectionalAlbedo( NdotL, roughness, A );\n\n		let rhoMultiScatter = rho * rho * averageDirectionalAlbedo /\n			max( vec3f( 1e-7 ), vec3f( 1.0 ) - rho * ( 1.0 - averageDirectionalAlbedo ) );\n		let multiScatter = ( rhoMultiScatter / PI ) *\n			max( 1e-7, 1.0 - directionalAlbedoV ) *\n			max( 1e-7, 1.0 - directionalAlbedoL ) /\n			max( 1e-7, 1.0 - averageDirectionalAlbedo );\n\n		return singleScatter + multiScatter;\n\n	}\n\n", [
	W,
	G,
	jo,
	Mo
]), Po = g("\n\n	fn eonLtcCoeffs( mu: f32, roughness: f32 ) -> vec4f {\n\n		let a = 1.0 + roughness * (\n			0.303392 + ( - 0.518982 + 0.111709 * mu ) * mu +\n			( - 0.276266 + 0.335918 * mu ) * roughness\n		);\n		let b = roughness * (\n			- 1.16407 + 1.15859 * mu + ( 0.150815 - 0.150105 * mu ) * roughness\n		) / ( mu * mu * mu - 1.43545 );\n		let c = 1.0 + roughness * ( 0.20013 + ( - 0.506373 + 0.261777 * mu ) * mu );\n		let d = roughness * (\n			0.540852 + ( - 1.01625 + 0.475392 * mu ) * mu\n		) / ( - 1.0743 + ( 0.0725628 + mu ) * mu );\n\n		return vec4f( a, b, c, d );\n\n	}\n\n"), Fo = g("\n\n	fn eonLtcBasis( wo: vec3f ) -> mat3x3f {\n\n		let lenSqr = dot( wo.xy, wo.xy );\n		let invLen = inverseSqrt( lenSqr );\n		let x = select(\n			vec3f( 1.0, 0.0, 0.0 ),\n			vec3f( wo.x, wo.y, 0.0 ) * invLen,\n			lenSqr > 0.0,\n		);\n		let y = vec3f( - x.y, x.x, 0.0 );\n\n		return mat3x3f( x, y, vec3f( 0.0, 0.0, 1.0 ) );\n\n	}\n\n"), Io = g("\n\n	fn eonCltcPdf( wo: vec3f, wi: vec3f, roughness: f32 ) -> f32 {\n\n		let toLtc = transpose( eonLtcBasis( wo ) );\n		let wiLtc = toLtc * wi;\n		let coeffs = eonLtcCoeffs( saturate( wo.z ), roughness );\n		let a = coeffs.x;\n		let b = coeffs.y;\n		let c = coeffs.z;\n		let d = coeffs.w;\n		let detM = c * ( a - b * d );\n		let wh = vec3f(\n			c * ( wiLtc.x - b * wiLtc.z ),\n			( a - b * d ) * wiLtc.y,\n			- c * ( d * wiLtc.x - a * wiLtc.z ),\n		);\n		let lenSqr = max( dot( wh, wh ), 1e-7 );\n		let vz = inverseSqrt( d * d + 1.0 );\n		let s = 0.5 * ( 1.0 + vz );\n		let jacobian = detM * detM / ( lenSqr * lenSqr );\n\n		return jacobian * max( wh.z, 0.0 ) / ( PI * s );\n\n	}\n\n", [
	W,
	Po,
	Fo
]), Lo = g("\n\n	fn eonCltcDirection( wo: vec3f, roughness: f32, uv: vec2f ) -> vec3f {\n\n		let coeffs = eonLtcCoeffs( saturate( wo.z ), roughness );\n		let a = coeffs.x;\n		let b = coeffs.y;\n		let c = coeffs.z;\n		let d = coeffs.w;\n		let radius = sqrt( uv.x );\n		let phi = 2.0 * PI * uv.y;\n		let y = radius * sin( phi );\n		let vz = inverseSqrt( d * d + 1.0 );\n		let s = 0.5 * ( 1.0 + vz );\n		let x = - mix( sqrt( max( 1.0 - y * y, 0.0 ) ), radius * cos( phi ), s );\n		let wh = vec3f( x, y, sqrt( max( 1.0 - x * x - y * y, 0.0 ) ) );\n		let wiUnnormalized = vec3f(\n			a * wh.x + b * wh.z,\n			c * wh.y,\n			d * wh.x + wh.z,\n		);\n		let wi = normalize( eonLtcBasis( wo ) * wiUnnormalized );\n\n		return wi;\n\n	}\n\n", [
	W,
	Po,
	Fo
]), Ro = g("\n\n	fn eonUniformHemisphereSample( uv: vec2f ) -> vec3f {\n\n		let sinTheta = sqrt( max( 1.0 - uv.x * uv.x, 0.0 ) );\n		let phi = 2.0 * PI * uv.y;\n		return vec3f( sinTheta * cos( phi ), sinTheta * sin( phi ), uv.x );\n\n	}\n\n", [W]), zo = g("\n\n	fn eonUniformProbability( wo: vec3f, roughness: f32 ) -> f32 {\n\n		let mu = saturate( wo.z );\n		return clamp( pow( roughness, 0.1 ), 0.0, 1.0 ) * (\n			0.162925 + ( - 0.372058 + ( 0.538233 - 0.290822 * mu ) * mu ) * mu\n		);\n\n	}\n\n"), Bo = g("\n\n	fn eonDirection( wo: vec3f, roughness: f32, uv: vec2f ) -> vec3f {\n\n		let uniformProbability = eonUniformProbability( wo, roughness );\n		if ( uv.x <= uniformProbability && uniformProbability > 0.0 ) {\n\n			return eonUniformHemisphereSample( vec2f( uv.x / uniformProbability, uv.y ) );\n\n		}\n\n		let cltcProbability = 1.0 - uniformProbability;\n		let cltcUv = vec2f(\n			( uv.x - uniformProbability ) / max( cltcProbability, 1e-7 ),\n			uv.y,\n		);\n		return eonCltcDirection( wo, roughness, cltcUv );\n\n	}\n\n", [
	Lo,
	Ro,
	zo
]), Vo = g("\n\n	fn eonPdf( wo: vec3f, wi: vec3f, roughness: f32 ) -> f32 {\n\n		// The EON proposal is defined over the positive hemisphere.\n		if ( wo.z <= 0.0 || wi.z <= 0.0 ) {\n\n			return 0.0;\n\n		}\n\n		let uniformProbability = eonUniformProbability( wo, roughness );\n		let cltcProbability = 1.0 - uniformProbability;\n		let uniformPdf = 1.0 / ( 2.0 * PI );\n\n		return uniformProbability * uniformPdf +\n			cltcProbability * eonCltcPdf( wo, wi, roughness );\n\n	}\n\n", [
	W,
	Io,
	zo
]), Ho = H`

	fn velvetD( cosThetaH: f32, roughness: f32 ) -> f32 {

		var alpha = max( roughness, 0.07 );
		alpha = alpha * alpha;

		let invAlpha = 1.0 / alpha;
		let sqrCosThetaH = cosThetaH * cosThetaH;
		let sinThetaH = max( 1.0 - sqrCosThetaH, 0.001 );

		return ( 2.0 + invAlpha ) * pow( sinThetaH, 0.5 * invAlpha ) / ( 2.0 * PI );

	}

`, Uo = H`

	fn velvetParamsInterpolate( i: i32, oneMinusAlphaSquared: f32 ) -> f32 {

		let p0 = array<f32, 5>( 25.3245, 3.32435, 0.16801, - 1.27393, - 4.85967 );
		let p1 = array<f32, 5>( 21.5473, 3.82987, 0.19823, - 1.97760, - 4.32054 );

		return mix( p1[ i ], p0[ i ], oneMinusAlphaSquared );

	}

`, Wo = H`

	fn velvetL( x: f32, alpha: f32 ) -> f32 {

		let oneMinusAlpha = 1.0 - alpha;
		let oneMinusAlphaSquared = oneMinusAlpha * oneMinusAlpha;

		let a = ${Uo}( 0, oneMinusAlphaSquared );
		let b = ${Uo}( 1, oneMinusAlphaSquared );
		let c = ${Uo}( 2, oneMinusAlphaSquared );
		let d = ${Uo}( 3, oneMinusAlphaSquared );
		let e = ${Uo}( 4, oneMinusAlphaSquared );

		return a / ( 1.0 + b * pow( abs( x ), c ) ) + d * x + e;

	}

`, Go = H`

	fn velvetLambda( cosTheta: f32, alpha: f32 ) -> f32 {

		if ( abs( cosTheta ) < 0.5 ) {

			return exp( ${Wo}( cosTheta, alpha ) );

		} else {

			return exp( 2.0 * ${Wo}( 0.5, alpha ) - ${Wo}( 1.0 - cosTheta, alpha ) );

		}

	}

`, Ko = H`

	fn velvetG( cosThetaO: f32, cosThetaI: f32, roughness: f32 ) -> f32 {

		var alpha = max( roughness, 0.07 );
		alpha = alpha * alpha;

		return 1.0 / ( 1.0 + ${Go}( cosThetaO, alpha ) + ${Go}( cosThetaI, alpha ) );

	}

`, qo = H`

	fn directionalAlbedoSheen( cosThetaIn: f32, alpha: f32 ) -> f32 {

		let cosTheta = saturate( cosThetaIn );
		let c = 1.0 - cosTheta;
		let c3 = c * c * c;

		return 0.65584461 * c3 + 1.0 / ( 4.16526551 + exp( -7.97291361 * sqrt( alpha ) + 6.33516894 ) );

	}

`, Jo = H`

	fn sheenAlbedoScaling( wo: vec3f, wi: vec3f, surf: ${G} ) -> f32 {

		var alpha = max( surf.sheenRoughness, 0.07 );
		alpha = alpha * alpha;

		let maxSheenColor = max( max( surf.sheenColor.r, surf.sheenColor.g ), surf.sheenColor.b );

		let eWo = ${qo}( clamp( wo.z, 0.001, 1.0 ), alpha );
		let eWi = ${qo}( clamp( wi.z, 0.001, 1.0 ), alpha );

		return min( 1.0 - maxSheenColor * eWo, 1.0 - maxSheenColor * eWi );

	}

`, Yo = H`

	fn sheenColor( wo: vec3f, wi: vec3f, wh: vec3f, surf: ${G} ) -> vec3f {

		let cosThetaO = clamp( wo.z, 0.001, 1.0 );
		let cosThetaI = clamp( wi.z, 0.001, 1.0 );
		let cosThetaH = wh.z;

		let D = ${Ho}( cosThetaH, surf.sheenRoughness );
		let G = ${Ko}( cosThetaO, cosThetaI, surf.sheenRoughness );

		// See equation (1) in http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
		var color = surf.sheenColor;
		color *= D * G / ( 4.0 * abs( cosThetaO * cosThetaI ) );

		return color;

	}

`, Xo = 32, Zo = 16, Qo = class extends ie {
	constructor() {
		super(Xo, Xo, 31), this.type = Pe, this.format = P, this.minFilter = k, this.magFilter = k, this.dielectricLayerCount = 10, this.transmissiveLayerCount = 10, this.minIoR = 1, this.maxIoR = 2.5, this.sampleConductorFn = R("_sampleConductorFn", this), this.sampleDielectricFn = R("_sampleDielectricFn", this), this.sampleTransmissiveFn = R("_sampleTransmissiveFn", this);
	}
	generate(e) {
		let { dielectricLayerCount: n, transmissiveLayerCount: r, minIoR: i, maxIoR: a } = this, o = {
			outputTarget: d(this).toWriteOnly(),
			globalId: y,
			eta: f(1),
			layer: f(0, "uint"),
			includeFresnel: f(0),
			includeRefraction: f(0)
		}, s = [
			Xo / Zo,
			Xo / Zo,
			1
		], c = new U(Di(o.outputTarget)(o), { workgroupSize: [
			Zo,
			Zo,
			1
		] });
		o.layer.value = 0, o.eta.value = 1, o.includeFresnel.value = 0, o.includeRefraction.value = 0, e.compute(c.kernel, s);
		for (let t = 0; t < n; t++) o.layer.value++, o.eta.value = 1 / Me.mapLinear(t, 0, n - 1, i, a), o.includeFresnel.value = 1, e.compute(c.kernel, s);
		o.includeFresnel.value = 1, o.includeRefraction.value = 1;
		for (let t = 0; t < r; t++) {
			let l = Me.mapLinear(t, 0, r - 1, i, a);
			o.layer.value = 1 + n + t, o.eta.value = 1 / l, e.compute(c.kernel, s), o.layer.value = 1 + n + r + t, o.eta.value = l, e.compute(c.kernel, s);
		}
		c.dispose();
		let l = H`
			fn mapLinearClamped( v: f32, a0: f32, a1: f32, b0: f32, b1: f32 ) -> f32 {

				let mapped = saturate( ( v - a0 ) / ( a1 - a0 ) );
				return mix( b0, b1, mapped );

			}
		`, u = t(this).setName("turquinTexture"), p = h(this).setName("turquinSampler"), m = 1 / (1 + n + 2 * r);
		this._sampleConductorFn = H`
			fn sampleConductor( cosTheta0: f32, roughness: f32 ) -> f32 {

				let layer = 0.5;
				let uvw = vec3f( cosTheta0, roughness, layer * ${m} );
				return textureSampleLevel( ${u}, ${p}, uvw, 0 ).r;

			}
		`, this._sampleDielectricFn = H`
			fn sampleDielectric( cosTheta0: f32, roughness: f32, ior: f32 ) -> f32 {

				let blockStart = 1.0;
				let layer = ${l}(
					ior,
					f32( ${i} ), f32( ${a} ),
					0.5, f32( ${n} ) - 0.5,
				) + blockStart;

				let uvw = vec3f( cosTheta0, roughness, layer * ${m} );
				return textureSampleLevel( ${u}, ${p}, uvw, 0 ).r;

			}
		`;
		let g = 1 + n, _ = 1 + n + r;
		this._sampleTransmissiveFn = H`
			fn sampleTransmissive( cosTheta0: f32, roughness: f32, ior: f32, entering: bool ) -> f32 {

				let blockStart = select(
					f32( ${_} ),
					f32( ${g} ),
					entering
				);
				let layer = ${l}(
					ior,
					f32( ${i} ), f32( ${a} ),
					0.5, f32( ${r} ) - 0.5,
				) + blockStart;

				let uvw = vec3f( cosTheta0, roughness, layer * ${m} );
				return textureSampleLevel( ${u}, ${p}, uvw, 0 ).r;

			}
		`;
	}
}, $o = O(1.5), es = O(1e6), ts = class extends Ao {
	constructor(e = {}) {
		super();
		let { specularBrdf: t = pi, specularBtdf: n = hi, diffuseBrdf: r = No, fresnelMix: i = bi, conductorFresnel: a = Ti, fresnelCoat: o = Ei, iridescentFresnel: s = Ci } = e;
		this.turquinTexture = new Qo(), this.specularBrdf = t, this.specularBtdf = n, this.diffuseBrdf = r, this.fresnelMix = i, this.conductorFresnel = a, this.fresnelCoat = o, this.iridescentFresnel = s, this.transmissionFresnel = wi(s);
	}
	init(e) {
		this.turquinTexture.generate(e);
	}
	getBsdfNode() {
		this._bsdfEvalFunc = H`

			// The material is organized as one scoped block per lobe in cascade order - clearcoat,
			// sheen, transmission, specular, diffuse - each accumulating into a shared result and
			// guarding its own hemisphere.
			// TODO: energy only cascades downward through front faces, so the layers are always traversed
			// outside-in and cannot reflect energy back into the glass from below.
			fn bsdfEval( ctx: ${jn}, surf: ${G} ) -> vec3f {

				let NdotV = ctx.V.z;
				let NdotL = ctx.L.z;

				// Each lobe contributes into "result" within its own scope, evaluated in cascade.
				// "attenuation" carries the fraction of energy each layer passes through to
				// the layers beneath it. Every lobe guards its own hemisphere.
				var result = vec3f( 0.0 );
				var attenuation = vec3f( 1.0 );

				// clearcoat
				if ( NdotL > 0.0 && surf.clearcoat > 0.0 ) {

					// the clearcoat evaluates in its own frame
					let toClearcoatMat = surf.clearcoatInvBasis * surf.normalBasis;
					let Vc = normalize( toClearcoatMat * ctx.V );
					let Lc = normalize( toClearcoatMat * ctx.L );
					let Hc = normalize( toClearcoatMat * ctx.H );
					let NdotVc = Vc.z;

					let clearcoatAlpha = surf.clearcoatRoughness * surf.clearcoatRoughness;

					// reuse the same pattern for energy conservation used in the dielectric layer
					let clearcoatEnergySS = max( ${this.turquinTexture.sampleConductorFn}( NdotVc, surf.clearcoatRoughness ), 1e-5 );
					let clearcoatBoost = 1.0 + ${J}( 1.5 ) * ( 1.0 - clearcoatEnergySS ) / clearcoatEnergySS;

					let clearcoatSpecular = ${this.specularBrdf}( Vc, Lc, Hc, vec2( clearcoatAlpha ) ) * clearcoatBoost;
					let clearcoatFresnel = ${mr}( abs( dot( Vc, Hc ) ), ${J}( 1.5 ) );

					// retrieve specular energy reflected by this layer
					let clearcoatFresnelEnergySS = ${this.turquinTexture.sampleDielectricFn}( NdotVc, surf.clearcoatRoughness, 1.5 ) * clearcoatBoost;

					result += surf.clearcoat * clearcoatFresnel * clearcoatSpecular;
					attenuation *= 1.0 - surf.clearcoat * clearcoatFresnelEnergySS;

				}

				// sheen
				if ( NdotL > 0.0 && surf.sheen > 0.0 ) {

					result += attenuation * surf.sheen * ${Yo}( ctx.V, ctx.L, ctx.H, surf );
					attenuation *= mix( 1.0, ${Jo}( ctx.V, ctx.L, surf ), surf.sheen );

				}

				// transmission
				// handles specular reflection and transmission
				if ( surf.transmission > 0.0 ) {

					let matchedIor = ${mi}( surf.eta );

					// anisotropic roughness along tangent, bitangent
					let alphaB = surf.roughness * surf.roughness;
					let alphaT = mix( alphaB, 1.0, surf.anisotropy * surf.anisotropy );
					let alpha = vec2( alphaT, alphaB );

					// multiscatter compensation
					var glassBoost = 0.0;
					if ( matchedIor ) {

						glassBoost = 1.0;

					} else if ( surf.thinWall ) {

						// thin wall halves are reflection-shaped so each is compensated with the conductor albedo at its own roughness.
						glassBoost = 1.0 / max( ${this.turquinTexture.sampleConductorFn}( NdotV, surf.roughness ), 1e-5 );

					} else {

						// volumetric bsdf is scaled by its total reflected + refracted energy
						glassBoost = 1.0 / max( ${this.turquinTexture.sampleTransmissiveFn}( NdotV, surf.roughness, surf.ior, surf.frontFace ), 1e-5 );

					}

					let fresnelCosine = select( ctx.VdotH, NdotV, surf.thinWall );
					let fresnel = ${this.transmissionFresnel}( fresnelCosine, surf );

					if ( NdotL < 0.0 ) {

						var refraction = vec3f( 0.0 );
						if ( surf.thinWall && ! matchedIor ) {

							// evaluate the flipped reflection, compensated at the remapped roughness
							let wiMirror = vec3f( ctx.L.xy, - ctx.L.z );
							let thinWallAlpha = vec2f( ${gi}( alphaB, surf.ior ) );
							let thinWallEnergySS = max( ${this.turquinTexture.sampleConductorFn}( NdotV, sqrt( thinWallAlpha.x ) ), 1e-5 );
							refraction = fresnel.transmittance * ${this.specularBrdf}( ctx.V, wiMirror, ctx.H, thinWallAlpha ) / thinWallEnergySS;

						} else if ( ! matchedIor ) {

							// The default BTDF contains the plain dielectric Fresnel complement. Replace it
							// with the colored thin-film-aware coefficient shared by sampling and the PDF.
							let dielectricTransmittance = 1.0 - ${vr}( abs( ctx.VdotH ), surf.eta );
							if ( dielectricTransmittance > EPSILON ) {

								refraction = ${this.specularBtdf}( ctx.V, ctx.L, ctx.H, alpha, surf.eta ) *
									fresnel.transmittance / dielectricTransmittance * glassBoost;

							}

						}

						// the refracted half is not attenuated by the layers above. A volume is entered and exited,
						// so each crossing takes the square root of the color, as in Cycles
						let transmissionTint = select( sqrt( surf.color ), surf.color, surf.thinWall );
						result += ( 1.0 - surf.metalness ) * surf.transmission * refraction * transmissionTint;

					} else {

						// the raw single scatter lobe scaled by the glass compensation boost rather
						// than the opaque dielectric boost
						let specular = ${this.specularBrdf}( ctx.V, ctx.L, ctx.H, alpha );
						let dielectricSpecular = specular * glassBoost;

						let reflection = dielectricSpecular * fresnel.reflectance;

						result += attenuation * ( 1.0 - surf.metalness ) * surf.transmission * reflection;

					}

				}

				// specular
				// metallic + dielectric + iridescence
				if ( NdotL > 0.0 ) {

					// anisotropic roughness along tangent, bitangent
					let alphaB = surf.roughness * surf.roughness;
					let alphaT = mix( alphaB, 1.0, surf.anisotropy * surf.anisotropy );
					let alpha = vec2( alphaT, alphaB );

					// Sample the single scatter energy for specular at the given roughness
					let energySS = max( ${this.turquinTexture.sampleConductorFn}( NdotV, surf.roughness ), 1e-5 );
					let specular = ${this.specularBrdf}( ctx.V, ctx.L, ctx.H, alpha );

					// metallic with the multiscatter comp
					let metallicBoost = 1.0 + surf.color * ( 1.0 - energySS ) / energySS;
					let metallicSpecular = specular * metallicBoost;
					var metallicReflectance = ${this.conductorFresnel}( ctx.VdotH, surf.color, vec3f( 1.0 ) );

					// dielectric with the multiscatter comp
					let dielectricBoost = 1.0 + surf.f0 * ( 1.0 - energySS ) / energySS;
					let dielectricSpecular = specular * dielectricBoost;

					// KHR_materials_specular: fold the specular color and intensity into the dielectric f0.
					// Schlick is used on both hit sides, matching Cycles - the opaque specular carries no
					// TIR so the energy removed from the base always matches the energy paid back
					let dielectricF0 = min( surf.f0 * surf.specularColor, vec3f( 1.0 ) );
					let dielectricFr = ${hr}( ctx.VdotH, dielectricF0, vec3f( 1.0 ) );
					var dielectricReflectance = surf.specularIntensity * dielectricFr;

					// iridescence
					var filmFresnelMax = 0.0;
					if ( surf.iridescence > 0.0 ) {

						// the media on either side of the film - air outside and the volume interior
						// as the base on front faces, swapped on back faces so TIR can take effect
						let outsideIor = select( surf.ior, 1.0, surf.frontFace );
						let filmBaseIor = select( 1.0, surf.ior, surf.frontFace );

						let metallicFilmFresnel = ${this.iridescentFresnel}( ctx.VdotH, surf.color, surf.iridescenceIor, outsideIor, surf.iridescenceThickness );
						metallicReflectance = mix( metallicReflectance, metallicFilmFresnel, surf.iridescence );

						let dielectricFilmFresnel = ${this.iridescentFresnel}( ctx.VdotH, vec3f( ${J}( filmBaseIor ) ), surf.iridescenceIor, outsideIor, surf.iridescenceThickness );
						dielectricReflectance = mix( dielectricReflectance, dielectricFilmFresnel, surf.iridescence );
						filmFresnelMax = max( max( dielectricFilmFresnel.r, dielectricFilmFresnel.g ), dielectricFilmFresnel.b );

					}

					let metallic = metallicSpecular * metallicReflectance;
					let dielectric = dielectricSpecular * dielectricReflectance;

					// The energy the specular interface takes from the layers below, at the lobe's specular color
					// and intensity. The table holds the albedo at the ior's f0, and the Schlick albedo is linear
					// in f0, so the tinted albedo slides from it toward the conductor albedo at f0 = 1
					let iorEnergySS = ${this.turquinTexture.sampleDielectricFn}( NdotV, surf.roughness, surf.ior );
					let tintedEnergySS = iorEnergySS + ( dielectricF0 - surf.f0 ) * ( energySS - iorEnergySS ) / ( 1.0 - surf.f0 );
					let fresnelEnergySS = surf.specularIntensity * tintedEnergySS * dielectricBoost;

					result += attenuation * mix( ( 1.0 - surf.transmission ) * dielectric, metallic, surf.metalness );
					attenuation *= ( 1.0 - surf.metalness ) * mix( 1.0 - fresnelEnergySS, vec3f( 1.0 - filmFresnelMax ), surf.iridescence );

				}

				// diffuse
				if ( NdotL > 0.0 ) {

					// the dielectric base mixes diffuse with transmission - the transmissive half
					// is carried by the glass lobe above
					let diffuseVdotH = sqrt( saturate( 0.5 * ( 1.0 + dot( ctx.V, ctx.L ) ) ) );
					let reflection = ${this.diffuseBrdf}( NdotV, NdotL, diffuseVdotH, surf );
					let diffuse = ( 1.0 - surf.transmission ) * reflection;

					result += attenuation * diffuse;

				}

				return result;

			}

		`;
		let e = this.getBsdfEvalPdfNode();
		return H`

			fn bsdfSample( worldWo: vec3f, surf: ${G} ) -> ${wn} {

				var result: ${wn};
				result.color = vec3f( 0.0 );
				result.isTransmissive = false;
				result.direction = vec3f( 0.0 );
				result.pdf = 0.0;

				let wo = normalize( surf.normalInvBasis * worldWo );
				let woClearcoat = normalize( surf.clearcoatInvBasis * worldWo );

				// TODO: mirror bsdfEval's layer structure - the glass layer should own both its
				// reflection and refraction halves
				// lobe selection weights and cumulative bounds in cascade order:
				// clearcoat, specular, transmission, diffuse
				let weights = ${Dr}( wo, wo, woClearcoat, vec3( 0, 0, 1 ), ${$o}, surf );
				let cdfClearcoat = weights.clearcoat;
				let cdfSpecular = cdfClearcoat + weights.specular;
				let cdfTransmission = cdfSpecular + weights.transmission;
				let cdfTotal = cdfTransmission + weights.diffuse;

				// random samples for lobes
				let lobeSample = ${sr}( ${2} ) * cdfTotal;
				let directionUV = ${q}( ${3} );

				// output
				var wi: vec3f;
				var wh: vec3f;

				// TODO: see if we can clean up these flags so they're not necessary
				var isTransmissionLobe = false;
				var isDeltaTransmission = false;
				var deltaTransmittance = vec3f( 1.0 );
				var deltaProbability = 1.0;
				var isDead = false;

				if ( lobeSample <= cdfClearcoat ) {

					// clearcoat
					let clearcoatAlpha = surf.clearcoatRoughness * surf.clearcoatRoughness;
					let whCoat = ${ni}( woClearcoat, vec2( clearcoatAlpha ), directionUV );
					let wiCoat = - normalize( reflect( woClearcoat, whCoat ) );

					wi = normalize( surf.normalInvBasis * surf.clearcoatBasis * wiCoat );
					wh = normalize( surf.normalInvBasis * surf.clearcoatBasis * whCoat );

					// reflected rays must leave above the geometry surface - flip rays that land
					// below it due to the shading normal. Rays below the shading hemisphere are
					// left as is since their loss is refunded by the energy compensation tables
					let faceNormal = normalize( surf.normalInvBasis * surf.faceNormal );
					let geomDotDir = dot( wi, faceNormal );
					if ( wi.z > 0.0 && geomDotDir < 0.0 ) {

						wi = normalize( wi - 2.0 * geomDotDir * faceNormal );

					}

				} else if ( lobeSample <= cdfSpecular ) {

					// specular
					// anisotropic roughness along tangent, bitangent
					let alphaB = surf.roughness * surf.roughness;
					let alphaT = mix( alphaB, 1.0, surf.anisotropy * surf.anisotropy );
					let alpha = vec2( alphaT, alphaB );

					wh = ${ni}( wo, alpha, directionUV );
					wi = - normalize( reflect( wo, wh ) );

					// reflected rays must leave above the geometry surface - flip rays that land
					// below it due to the shading normal. Rays below the shading hemisphere are
					// left as is since their loss is refunded by the energy compensation tables
					let faceNormal = normalize( surf.normalInvBasis * surf.faceNormal );
					let geomDotDir = dot( wi, faceNormal );
					if ( wi.z > 0.0 && geomDotDir < 0.0 ) {

						wi = normalize( wi - 2.0 * geomDotDir * faceNormal );

					}

				} else if ( lobeSample <= cdfTransmission ) {

					// transmission
					isTransmissionLobe = true;

					// anisotropic roughness along tangent, bitangent
					let alphaB = surf.roughness * surf.roughness;
					let alphaT = mix( alphaB, 1.0, surf.anisotropy * surf.anisotropy );
					let alpha = vec2( alphaT, alphaB );

					// sample the half vector first and select reflection or refraction by the
					// facet fresnel, matching Cycles - total internal reflection drives the
					// fresnel to 1 so TIR facets always reflect with a matching pdf
					wh = ${ni}( wo, alpha, directionUV );

					let fresnelCosine = select( dot( wo, wh ), wo.z, surf.thinWall );
					let fresnel = ${this.transmissionFresnel}( fresnelCosine, surf );

					let fresnelSample = ( lobeSample - cdfSpecular ) / ( cdfTransmission - cdfSpecular );
					let doReflect = fresnelSample < fresnel.reflectProbability;
					if ( doReflect ) {

						wi = - normalize( reflect( wo, wh ) );

					} else if ( ${mi}( surf.eta ) ) {

						// With no IOR boundary, rough transmission collapses to straight-through
						// delta transmission independent of the sampled microfacet.
						wi = - wo;
						wh = vec3f( 0.0, 0.0, 1.0 );
						isDeltaTransmission = true;
						deltaTransmittance = fresnel.transmittance;
						deltaProbability = 1.0 - fresnel.reflectProbability;

					} else if ( surf.thinWall ) {

						// model the double refraction as a single reflection flipped through the
						// surface at the remapped thin wall roughness
						let thinWallAlpha = vec2f( ${gi}( alphaB, surf.ior ) );
						wh = ${ni}( wo, thinWallAlpha, directionUV );
						wi = - normalize( reflect( wo, wh ) );
						wi = vec3f( wi.xy, - wi.z );

					} else {

						wi = refract( - wo, wh, surf.eta );

						// "refract" returns zero on total internal reflection, so reflect instead and let "isDead" drop it
						if ( dot( wi, wi ) == 0.0 ) {

							wi = - normalize( reflect( wo, wh ) );

						}

					}

					// the facet choice must agree with the resulting hemisphere - reflection above,
					// transmission below. Mismatched samples are dropped since their loss is
					// refunded by the energy compensation tables
					isDead = doReflect != ( wi.z > 0.0 );

				} else if ( lobeSample <= cdfTotal ) {

					// diffuse
					// all diffuse BRDF variants share the EON sampling proposal
					wi = ${Bo}( wo, surf.diffuseRoughness, directionUV );
					wh = normalize( wi + wo );

					// reflected rays must leave above the geometry surface - flip rays that land
					// below it due to the shading normal. Rays below the shading hemisphere are
					// left as is since their loss is refunded by the energy compensation tables
					let faceNormal = normalize( surf.normalInvBasis * surf.faceNormal );
					let geomDotDir = dot( wi, faceNormal );
					if ( wi.z > 0.0 && geomDotDir < 0.0 ) {

						wi = normalize( wi - 2.0 * geomDotDir * faceNormal );

					}

				}

				let worldWi = normalize( surf.normalBasis * wi );
				if ( isDeltaTransmission ) {

					// Cycles represents a singular event with a large matching BSDF and PDF. Their
					// ratio preserves throughput while forward MIS correctly gives the event full weight.
					let transmissionTint = select( sqrt( surf.color ), surf.color, surf.thinWall );
					result.color = ( 1.0 - surf.metalness ) * surf.transmission * transmissionTint *
						deltaTransmittance * ${es};
					result.direction = worldWi;
					result.pdf = weights.transmission * deltaProbability * ${es};
					result.isTransmissive = dot( worldWi, surf.faceNormal ) < 0.0;

				} else {

					// evaluate the shared eval / pdf function for the sampled direction so the sample
					// and light-sampling paths can never disagree on color or pdf
					result = ${e}( worldWo, worldWi, surf );

				}

				// mismatched glass facets and reflection lobe samples that land below the
				// hemisphere carry no energy - their loss is refunded by the compensation tables
				let invalid = isDead || ( ! isTransmissionLobe && wi.z <= 0.0 );
				result.color *= select( 1.0, 0.0, invalid );

				return result;

			}

		`;
	}
	getBsdfEvalPdfNode() {
		if (this._bsdfEvalPdfNode) return this._bsdfEvalPdfNode;
		this._bsdfEvalFunc || this.getBsdfNode();
		let e = this._bsdfEvalFunc;
		return this._bsdfEvalPdfNode = H`

			fn bsdfEvalPdf( worldWo: vec3f, worldWi: vec3f, surf: ${G} ) -> ${wn} {

				var result: ${wn};
				result.color = vec3f( 0.0 );
				result.isTransmissive = false;
				result.direction = worldWi;
				result.pdf = 0.0;

				let wo = normalize( surf.normalInvBasis * worldWo );
				let wi = normalize( surf.normalInvBasis * worldWi );
				let woClearcoat = normalize( surf.clearcoatInvBasis * worldWo );

				let isTransmission = wi.z < 0.0;
				if ( isTransmission && ${mi}( surf.eta ) ) {

					// Delta transmission has no finite solid-angle BSDF or PDF. It is handled
					// explicitly by bsdfSample, matching PBRT-v4's eta == 1 path.
					return result;

				}

				// reconstruct the half vector bsdfSample would have used for this direction -
				// reflections use the standard half vector while refractions use the generalized
				// form scaled by the ior ratio, oriented into the upper hemisphere
				var wh: vec3f;
				if ( ! isTransmission ) {

					wh = normalize( wo + wi );

				} else if ( surf.thinWall ) {

					// thin wall transmission is modeled as a reflection flipped through the surface
					wh = normalize( wo + vec3f( wi.xy, - wi.z ) );

				} else {

					wh = normalize( wi + wo * surf.eta );
					wh *= sign( wh.z );

				}

				let weights = ${Dr}( wo, wo, woClearcoat, vec3( 0, 0, 1 ), ${$o}, surf );

				// TODO: mirror bsdfEval's layer structure - the glass layer should own both its
				// reflection and refraction halves
				// pdf mixture - every lobe that can produce the direction contributes its share,
				// in the same cascade order and with the same terms as bsdfSample

				// clearcoat
				if ( weights.clearcoat > 0.0 ) {

					// the clearcoat lobe evaluates in its own frame
					let toClearcoatMat = surf.clearcoatInvBasis * surf.normalBasis;
					let wiClearcoat = normalize( toClearcoatMat * wi );
					if ( wiClearcoat.z > 0.0 ) {

						let whClearcoat = normalize( toClearcoatMat * wh );
						let clearcoatAlpha = surf.clearcoatRoughness * surf.clearcoatRoughness;
						result.pdf += weights.clearcoat * ${si}( woClearcoat, whClearcoat, vec2( clearcoatAlpha ) );

					}

				}

				// specular
				if ( weights.specular > 0.0 && wi.z > 0.0 ) {

					// anisotropic roughness along tangent, bitangent
					let alphaB = surf.roughness * surf.roughness;
					let alphaT = mix( alphaB, 1.0, surf.anisotropy * surf.anisotropy );
					let alpha = vec2( alphaT, alphaB );

					result.pdf += weights.specular * ${si}( wo, wh, alpha );

				}

				// transmission
				if ( weights.transmission > 0.0 ) {

					// anisotropic roughness along tangent, bitangent
					let alphaB = surf.roughness * surf.roughness;
					let alphaT = mix( alphaB, 1.0, surf.anisotropy * surf.anisotropy );
					let alpha = vec2( alphaT, alphaB );

					// the glass lobe selects reflection or refraction by the facet fresnel so
					// each side carries the corresponding share of the transmission pdf
					let fresnelCosine = select( dot( wo, wh ), wo.z, surf.thinWall );
					let fresnel = ${this.transmissionFresnel}( fresnelCosine, surf );

					if ( wi.z > 0.0 ) {

						result.pdf += weights.transmission * fresnel.reflectProbability * ${si}( wo, wh, alpha );

					} else if ( surf.thinWall ) {

						// the flipped reflection shares the reflection pdf at the remapped roughness
						let thinWallAlpha = vec2f( ${gi}( alphaB, surf.ior ) );
						result.pdf += weights.transmission * ( 1.0 - fresnel.reflectProbability ) * ${si}( wo, wh, thinWallAlpha );

					} else {

						result.pdf += weights.transmission * ( 1.0 - fresnel.reflectProbability ) * ${ci}( wo, wi, wh, alpha, surf.eta );

					}

				}

				// diffuse
				if ( weights.diffuse > 0.0 ) {

					result.pdf += weights.diffuse * ${Vo}( wo, wi, surf.diffuseRoughness );

				}

				//

				// construct the scatter context
				var ctx: ${jn};
				ctx.V = wo;
				ctx.L = wi;
				ctx.H = wh;
				ctx.VdotH = saturate( dot( wo, wh ) );

				// evaluate the bsdf for the direction
				result.color = ${e}( ctx, surf ) * abs( wi.z );

				// a direction crossing below the surface enters or leaves the volume
				result.isTransmissive = isTransmission && dot( worldWi, surf.faceNormal ) < 0.0;

				return result;

			}

		`, this._bsdfEvalPdfNode;
	}
}, ns = new A(), rs = new Ke(), is = 250, as = 16, os = 1.15, ss = 2, cs = 4096, ls = {
	strategy: 2,
	targetLeafSize: 5
}, us = 4, ds = 0, fs = 1, ps = 2;
async function ms(e, t, n) {
	let r = (e) => typeof SharedArrayBuffer < "u" && e.buffer instanceof SharedArrayBuffer ? e : e.slice(), { position: i } = t.attributes, { index: a } = t, o = i.array, s = a ? a.array : null;
	i.array = r(o), a && (a.array = r(s));
	let c = await e.generate(t, n);
	return i.array = o, a && (s.set(a.array), a.array = s, a.needsUpdate = !0), c;
}
var hs = class {
	constructor(e, t) {
		this.key = t, this.renderer = e, this.texture = null, this.hash = null;
		let n = new M(new Uint8Array([
			255,
			255,
			255,
			255
		]), 1, 1);
		n.minFilter = k, n.magFilter = k, this.colorTex = n;
	}
	dispose() {
		this.colorTex.dispose(), this.texture?.dispose();
	}
	setFromScene(e) {
		let { renderer: t, key: n, colorTex: r } = this, i = e[n], a = "";
		if (i) i.isColor ? (r.image.data[0] = i.r * 255, r.image.data[1] = i.g * 255, r.image.data[2] = i.b * 255, r.image.data[3] = 255, i = r, a = r.image.data.join(), r.needsUpdate = a !== this.hash) : i.isCubeTexture ? (a = null, i = new vo(t).generate(i)) : (a = i.uuid + "_" + i.version, a !== this.hash && (i = i.clone(), i.minFilter = k, i.magFilter = k));
		else {
			let e = t.getClearAlpha();
			t.getClearColor(rs), r.image.data[0] = rs.r * 255, r.image.data[1] = rs.g * 255, r.image.data[2] = rs.b * 255, r.image.data[3] = e * 255, i = r, a = r.image.data.join(), r.needsUpdate = a !== this.hash;
		}
		if (a === null) return this.texture?.dispose(), this.texture = i, this.hash = null, !0;
		{
			let e = a !== this.hash;
			return e && (this.texture?.dispose(), this.texture = i, this.hash = a), e;
		}
	}
}, gs = class extends tt {
	get maxBounces() {
		return this._pathTracer.maxBounces;
	}
	set maxBounces(e) {
		this._pathTracer.maxBounces = e, this.reset();
	}
	get frameBudget() {
		return this._pathTracer.frameBudget;
	}
	set frameBudget(e) {
		this._pathTracer.frameBudget = e;
	}
	get frameTime() {
		return this._pathTracer.timing.frameTime;
	}
	get maxTransparentBounces() {
		return this._pathTracer.maxTransparentBounces;
	}
	set maxTransparentBounces(e) {
		this._pathTracer.maxTransparentBounces = e, this.reset();
	}
	get maxSubsurfaceBounces() {
		return this._pathTracer.maxSubsurfaceBounces;
	}
	set maxSubsurfaceBounces(e) {
		this._pathTracer.maxSubsurfaceBounces = e, this.reset();
	}
	get maxSamples() {
		return this._pathTracer.maxSamples;
	}
	set maxSamples(e) {
		this._pathTracer.maxSamples = e, this._denoiser?.reset();
	}
	get complete() {
		let e = this.maxSamples, t = this._denoiser;
		return e > 0 && this._lastSampleCounts.min >= e && (!t || t.complete);
	}
	async getSampleCountsAsync() {
		let e = this._pathTracer, t = this._lastSampleCounts, n = await e.getSampleCountsAsync();
		t.min = n.min, t.max = n.max, t.avg = n.avg;
		let r = this.getRenderTime() / 1e3;
		return t.samplesPerSecond = r > 0 ? t.avg / r : 0, { ...t };
	}
	get transmissiveBackground() {
		return this._transmissiveBackground;
	}
	set transmissiveBackground(e) {
		this._transmissiveBackground !== e && (this._transmissiveBackground = e, this._pathTracer.setTransmissiveBackground(e));
	}
	get filterGlossyFactor() {
		return this._filterGlossyFactor;
	}
	set filterGlossyFactor(e) {
		this._filterGlossyFactor !== e && (this._filterGlossyFactor = e, this._pathTracer.setFilterGlossy(e));
	}
	get multipleImportanceSampling() {
		return this._multipleImportanceSampling;
	}
	set multipleImportanceSampling(e) {
		this._multipleImportanceSampling !== e && this.setMultipleImportanceSampling(e);
	}
	get clampDirect() {
		return this._clampDirect;
	}
	set clampDirect(e) {
		e = Math.max(0, e), this._clampDirect !== e && (this._clampDirect = e, this._pathTracer.setClamping(e, this._clampIndirect));
	}
	get clampIndirect() {
		return this._clampIndirect;
	}
	set clampIndirect(e) {
		e = Math.max(0, e), this._clampIndirect !== e && (this._clampIndirect = e, this._pathTracer.setClamping(this._clampDirect, e));
	}
	get target() {
		return this._pathTracer.outputTarget ?? null;
	}
	get fadeState() {
		return this._fadeState;
	}
	get lowResTarget() {
		return this._lowResTarget;
	}
	get lowResMode() {
		return this._pathTracer.lowResMode;
	}
	get compiling() {
		return this._pathTracer.compiling;
	}
	get textureAtlas() {
		return this._bvhData.textureAtlas;
	}
	useMegakernel(e) {
		let t = this._pathTracer.maxSamples;
		this._pathTracer.dispose(), this._pathTracer = e ? new Wa(this._renderer) : new ho(this._renderer), this._pathTracer.maxSamples = t, this._timingCount = 0, this._pathTracer.setBVHData(this._bvhData), this._pathTracer.setMaterial(this.material), this._pathTracer.setRandom(this.random), this._pathTracer.setMultipleImportanceSampling(this.multipleImportanceSampling), this._pathTracer.setTransmissiveBackground(this._transmissiveBackground), this._pathTracer.setFilterGlossy(this._filterGlossyFactor), this._pathTracer.setClamping(this._clampDirect, this._clampIndirect), this._pathTracer.setAccumulateAux(!!(this._denoiser && this._denoiser.useAuxiliaryBuffers)), this.setCamera(this.camera), this._pathTracer.setEnvironment(this._environmentCache.texture), this._pathTracer.setBackground(this._backgroundCache.texture), this.updateEnvironment(), this.updateLights();
	}
	constructor(e) {
		super(), this._renderer = e, this._timer = new at(), this._environmentCache = new hs(e, "environment"), this._backgroundCache = new hs(e, "background"), this._resetTime = -1, this._fadeState = 0, this._lastSampleCounts = {
			min: 0,
			max: 0,
			avg: 0,
			samplesPerSecond: 0
		}, this._size = new A(), this._blitQuad = new vn(new bn()), this._timingCount = 0, this._frameTimeTotal = 0, this._frameTimeCount = 0, this._warnedTimestamps = !1, this._fullFrameBudget = null, this._lowResTarget = new v(1, 1), this._lowResTarget.type = et, this._lowResTarget.generateMipmaps = !1, this._pathTracer = new ho(e), this._denoiser = null, this._upscaler = null, this._onDenoiserProgress = (e) => this.dispatchEvent({
			type: "progress",
			stage: "denoising",
			progress: e.progress
		}), this._stage = ps, this._sceneRequest = 0, this._pendingBVHs = /* @__PURE__ */ new WeakMap(), this.minSamples = 1, this.renderDelay = 16, this.fadeDuration = 250, this.dynamicLowRes = !0, this.lowResScale = .1, this.adaptiveDynamicRes = !0, this.adaptiveFrameBudget = !0, this.targetFrameTime = 16, this.renderScale = 1, this.synchronizeRenderSize = !0, this.renderToCanvas = !0, this.asyncCompile = !1, this.generateMissingAttributes = !0, this.commonAttributes = ["normal", "tangent"], this.stableNoise = !0, this.pause = !1, this.filterGlossyFactor = 1, this._clampDirect = 0, this._clampIndirect = 10, this.multipleImportanceSampling = !0, this.transmissiveBackground = 1, this.random = na, this.material = new ts(), this._invViewProjectionMatrix = f(new N()), this._cameraRayFnHandle = null, this._BVHWorker = null, this._lastCompleteCheck = 0, this._wasComplete = !1, this.setMaterial(this.material), this.setRandom(this.random), this.setScene(new Te(), new Be());
	}
	setMultipleImportanceSampling(e) {
		this._multipleImportanceSampling = e, this._pathTracer.setMultipleImportanceSampling(e), this.reset();
	}
	setDenoiser(e) {
		this._denoiser?.reset(), this._denoiser?.removeEventListener("progress", this._onDenoiserProgress), this._denoiser = e, e && (e.init(this._renderer), e.addEventListener("progress", this._onDenoiserProgress)), this._pathTracer.setAccumulateAux(!!(e && e.useAuxiliaryBuffers)), this.reset();
	}
	setUpscaler(e) {
		this._upscaler = e, e && e.init(this._renderer);
	}
	setScene(e, t) {
		e.updateMatrixWorld(!0), t.updateMatrixWorld(), e.traverse((e) => {
			this.generateMissingAttributes && e.geometry?.isBufferGeometry && ko(e.geometry, this.commonAttributes), e.isSkinnedMesh ? (e.boundsTree ? e.boundsTree.refit() : e.boundsTree = new fe(e, {
				strategy: 2,
				targetLeafSize: 5,
				indirect: !0
			}), e.boundingBox === null && (e.boundingBox = new ke()), e.boundsTree.getBoundingBox(e.boundingBox)) : e.isMesh && (e.geometry.boundsTree || (e.geometry.boundsTree = new be(e.geometry, ls)));
		});
		let n = new To(e);
		n.update(), n.textureAtlas.setTextures(this._renderer, n.textures), this._bvhData && (this._bvhData.dispose(), this._bvhData.textureAtlas.dispose()), this.scene = e, this._bvhData = n, this._pathTracer.setBVHData(n), this.setCamera(t), this.updateEnvironment(), this.updateLights();
	}
	setBVHWorker(e) {
		this._BVHWorker = e;
	}
	async setSceneAsync(e, t) {
		let n = this._BVHWorker;
		if (!n) throw Error("WebGPUPathTracer: \"setBVHWorker\" must be called before \"setSceneAsync\" can be called.");
		this._sceneRequest++;
		let r = this._sceneRequest, i = this._pendingBVHs, a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
		e.traverse((e) => {
			if (e.isMesh && !e.isSkinnedMesh && !e.geometry.boundsTree) {
				let { geometry: t } = e;
				if (t.attributes.position.isInterleavedBufferAttribute || t.index && t.index.isInterleavedBufferAttribute) return;
				i.has(t) ? o.add(i.get(t)) : a.add(t);
			}
		});
		let s = Array.from(a), c = (e) => (e.index ? e.index.count : e.attributes.position.count) / 3, l = s.reduce((e, t) => e + c(t), 0), u = 0, d = [];
		for (let e = 0, t = Math.min(us, s.length); e < t; e++) d.push(new n());
		this._setStage(ds), this._denoiser?.reset();
		try {
			await Promise.all([...o, ...d.map(async (e) => {
				for (; s.length > 0;) {
					let t = s.shift(), n = c(t), a = 0, o = (e) => {
						u += (e - a) * n, a = e, r === this._sceneRequest && this.dispatchEvent({
							type: "progress",
							stage: "building",
							progress: u / l
						});
					}, d = ms(e, t, {
						...ls,
						onProgress: o
					});
					i.set(t, d);
					try {
						t.boundsTree = await d, o(1);
					} finally {
						i.delete(t);
					}
				}
			})]);
		} finally {
			d.forEach((e) => e.dispose()), r === this._sceneRequest && this._setStage(fs);
		}
		r === this._sceneRequest && this.setScene(e, t);
	}
	getMaterial() {
		return this.material;
	}
	setMaterial(e) {
		this.material = e, this._pathTracer.setMaterial(e), this.reset();
	}
	setRandom(e) {
		this.random = e, this._pathTracer.setRandom(e), this.reset();
	}
	setCamera(e) {
		if (this.camera = e, e.getCameraRayFn) this._cameraRayFnHandle = e.getCameraRayFn();
		else {
			let t = this._invViewProjectionMatrix;
			this._cameraRayFnHandle = {
				update: () => (e.coordinateSystem = Oe, e.updateMatrixWorld(), (e.isOrthographicCamera || e.isPerspectiveCamera) && e.updateProjectionMatrix(), t.value.multiplyMatrices(e.matrixWorld, e.projectionMatrixInverse), !1),
				fn: H`
					fn getCameraRay( uv: vec2f, resolution: vec2f, ray: ptr<function, ${I}> ) -> bool {

						let ndc = uv * 2.0 - vec2f( 1.0 );
						*ray = ${Gt}( ndc, ${t} );
						return true;

					}
				`
			};
		}
		this._bvhData.fns.getCameraRay = this._cameraRayFnHandle.fn, this._cameraRayFnHandle.update(), this._pathTracer.rebuild(), this.reset();
	}
	updateMaterials() {
		let { _bvhData: e, _renderer: t } = this;
		e.updateMaterials(), e.textureAtlas.setTextures(t, e.textures), this.reset();
	}
	updateTransforms() {
		this.scene.updateMatrixWorld(!0), this._bvhData.updateTransforms(), this.reset();
	}
	updateCamera() {
		let { _cameraRayFnHandle: e, _pathTracer: t } = this;
		e.update() && t.rebuild(), this.reset();
	}
	updateEnvironment() {
		let { _pathTracer: e, scene: t, _environmentCache: n, _backgroundCache: r } = this;
		n.setFromScene(t) && e.setEnvironment(n.texture), r.setFromScene(t) && e.setBackground(r.texture), e.setEnvironmentParams(t.environmentIntensity, t.environmentRotation), e.setBackgroundParams(t.backgroundIntensity, t.backgroundRotation, t.backgroundBlurriness), this.reset();
	}
	updateLights() {
		let { _pathTracer: e, scene: t } = this, n = xo(t);
		e.setLights(n), this.reset();
	}
	setSize(e, t) {
		(this._size.x !== e || this._size.y !== t) && (this._size.set(e, t), this.reset());
	}
	reset() {
		this._pathTracer.reset(), this._denoiser?.reset(), this._resetTime = -1, this._fadeState = 0, this._timer.update(), this._lastSampleCounts = {
			min: 0,
			max: 0,
			avg: 0,
			samplesPerSecond: 0
		}, this._lastCompleteCheck = 0, this._wasComplete = !1, this.stableNoise && this._pathTracer.resetSeed(), this._fullFrameBudget !== null && (this.frameBudget = this._fullFrameBudget, this._fullFrameBudget = null);
	}
	_setStage(e) {
		this._stage !== e && (this._stage = e, e === ds ? this.dispatchEvent({
			type: "progress",
			stage: "building",
			progress: 0
		}) : e === fs ? this.dispatchEvent({
			type: "progress",
			stage: "compiling",
			progress: null
		}) : this._dispatchRenderProgress({
			min: 0,
			max: 0,
			avg: 0,
			samplesPerSecond: 0
		}));
	}
	_measureSamples() {
		let e = this._lastSampleCounts;
		this.getSampleCountsAsync().then((t) => {
			if (e === this._lastSampleCounts && this._stage === ps) {
				let { maxSamples: e } = this;
				this._fullFrameBudget === null && e > 0 && t.max >= e && (this._fullFrameBudget = this.frameBudget), this._dispatchRenderProgress(t);
			}
		});
	}
	_dispatchRenderProgress(e) {
		let { maxSamples: t } = this, n = t > 0 ? Math.min(e.avg / t, 1) : null;
		this.dispatchEvent({
			type: "progress",
			stage: "rendering",
			progress: n,
			samples: e
		});
	}
	_readTiming() {
		let { timing: e } = this._pathTracer, { trackTimestamp: t } = this._renderer.backend;
		if (this.adaptiveFrameBudget && !t && !this._warnedTimestamps && (console.warn("WebGPUPathTracer: \"adaptiveFrameBudget\" needs timestamp queries. Create the renderer with \"trackTimestamp: true\" on a device that supports them."), this._warnedTimestamps = !0), e.count === this._timingCount) return;
		this._timingCount = e.count;
		let { frameBudget: n } = e;
		if (!this.adaptiveFrameBudget || n !== this.frameBudget) {
			this._frameTimeTotal = 0, this._frameTimeCount = 0;
			return;
		}
		if (this._frameTimeTotal += e.frameTime, this._frameTimeCount++, this._frameTimeCount < as) return;
		let { targetFrameTime: r } = this, i = this._frameTimeTotal / this._frameTimeCount;
		this._frameTimeTotal = 0, this._frameTimeCount = 0;
		let a = i / r;
		if (a < os && a > 1 / os) return;
		let o = n * r / i, s = Me.clamp(o, n / ss, n * ss);
		this.frameBudget = Math.max(Math.round(s), cs);
	}
	renderSample() {
		let e = this._renderer, t = this._size, n = this._blitQuad, r = this._pathTracer, i = this._lowResTarget, a = this._timer, { renderDelay: o, dynamicLowRes: s, synchronizeRenderSize: c, renderScale: l, adaptiveDynamicRes: u, minSamples: d, maxSamples: f } = this;
		if (a.update(), !this._renderer._initialized) return;
		this.material.initialized || (this.material.init(e), this.material.initialized = !0);
		let p = 1e3 * a.getDelta(), m = this._resetTime === -1;
		m && (this._resetTime = 0, p = 0), this._resetTime += p;
		let h = e.getRenderTarget(), g = e.autoClear;
		if (c) {
			e.getDrawingBufferSize(ns);
			let t = Math.floor(l * ns.x), n = Math.floor(l * ns.y);
			this.setSize(t, n);
		}
		let { width: _, height: v } = t, y = this._resetTime < o || m && s && d !== 0;
		if (y) {
			let e = Math.min(Math.sqrt(r.getPreviewPixelBudget() / (_ * v)), 1);
			u && (this.lowResScale = e);
			let t = Math.min(this.lowResScale, e);
			_ = Math.max(1, Math.floor(t * _)), v = Math.max(1, Math.floor(t * v));
		}
		r.getSize(ns), !y && r.lowResMode && s && (i.setSize(ns.x, ns.y), e.copyTextureToTexture(r.outputTarget, i)), (ns.x !== _ || ns.y !== v) && r.setSize(_, v);
		let b = f > 0 && this._lastSampleCounts.min >= f;
		if (!this.pause && !b && this._stage > ds && (!y || y && s) && (r.lowResMode = y, r.asyncCompile = this.asyncCompile, r.update(), this._readTiming(), this._setStage(r.compiling ? fs : ps)), this._stage < ps) {
			this._resetTime = -1;
			return;
		}
		let x = this._denoiser, S = this._upscaler, ee = !!x && !x.complete && !x.running && f > 0;
		y || (!b && this._fadeState < 1 && d > 0 ? this._measureSamples() : !b && this._resetTime - this._lastCompleteCheck >= is && (this._lastCompleteCheck = this._resetTime, this._measureSamples()), this._lastSampleCounts.avg >= d && (this._fadeState += p / this.fadeDuration, this._fadeState = Math.min(1, this._fadeState) || 1));
		let C = y && s ? 1 : this._fadeState, w = r.outputTarget;
		x && !y && (ee && this._lastSampleCounts.min >= f && x.update(r.outputTarget, r.auxTarget), w = x.texture ?? w), this.renderToCanvas && (S && !y && (w = S.upscale(w, this.camera), e.setRenderTarget(h)), e.autoClear = s ? !0 : C === 1, n.material.transition = s ? C : 1, n.material.opacity = s ? 1 : C, n.material.fromTexture = i, n.material.texture = w, n.render(e)), e.autoClear = g, e.setRenderTarget(h);
		let T = this.complete;
		T && !this._wasComplete && this.dispatchEvent({ type: "complete" }), this._wasComplete = T;
	}
	renderDebugBounds(e = {}) {
		let { displayTLAS: t = !0, displayBLAS: n = !0, stopAtSurface: r = !1, saturationCount: i = 64 } = e, a = this._renderer, o = this.camera;
		if (!a._initialized) return;
		o.updateMatrixWorld(), (this._debugBoundsQuad === void 0 || this._debugBoundsData !== this._bvhData) && this._buildDebugBoundsQuad();
		let s = this._debugBoundsUniforms;
		s.cameraToModelMatrix.value.copy(o.matrixWorld), s.inverseProjectionMatrix.value.copy(o.projectionMatrixInverse), s.displayTLAS.value = +!!t, s.displayBLAS.value = +!!n, s.stopAtSurface.value = +!!r, s.saturationCount.value = i;
		let c = a.getRenderTarget(), l = a.autoClear, u = a.toneMapping;
		a.setRenderTarget(null), a.autoClear = !0, a.toneMapping = 0, this._debugBoundsQuad.render(a), a.setRenderTarget(c), a.autoClear = l, a.toneMapping = u;
	}
	_buildDebugBoundsQuad() {
		let e = this._bvhData, t = Cn(e), n = new ne();
		n.colorNode = t(c(s())), this._debugBoundsQuad === void 0 ? this._debugBoundsQuad = new vn(n) : (this._debugBoundsQuad.material.dispose(), this._debugBoundsQuad.material = n), this._debugBoundsUniforms = t.uniforms, this._debugBoundsData = e;
	}
	renderTextureAtlas(e = 0) {
		let t = this._renderer;
		this._atlasDebugQuad ||= new vn(new Eo());
		let n = this._atlasDebugQuad;
		n.material.texture = this.textureAtlas.texture, n.material.layer = e, t.setRenderTarget(null), n.render(t);
	}
	renderSampleDensity() {
		let e = this._renderer;
		if (!e._initialized) return;
		this.getSampleCountsAsync(), this._sampleDensityQuad ||= new vn(new Do());
		let t = e.toneMapping;
		e.toneMapping = 0;
		let n = this._sampleDensityQuad;
		n.material.texture = this._pathTracer.sampleCountTarget, n.material.minCount = this._lastSampleCounts.min, n.material.maxCount = this._lastSampleCounts.max, e.setRenderTarget(null), n.render(e), e.toneMapping = t;
	}
	renderAuxBuffer(e = "albedo") {
		let t = this._renderer, n = this._pathTracer;
		if (!t._initialized || !n.auxTarget) return;
		this._auxDebugQuad ||= new vn(new Oo());
		let r = t.toneMapping;
		t.toneMapping = 0;
		let i = this._auxDebugQuad;
		i.material.texture = n.auxTarget, i.material.showNormal = e === "normal", t.setRenderTarget(null), i.render(t), t.toneMapping = r;
	}
	dispose() {
		this._pathTracer.dispose(), this._denoiser?.dispose(), this._upscaler?.dispose(), this._bvhData.dispose(), this._bvhData.textureAtlas.dispose(), this._environmentCache.dispose(), this._backgroundCache.dispose(), this._lowResTarget.dispose(), this._blitQuad.dispose(), this._blitQuad.material.dispose(), this._atlasDebugQuad?.dispose(), this._atlasDebugQuad?.material.dispose(), this._sampleDensityQuad?.dispose(), this._sampleDensityQuad?.material.dispose(), this._auxDebugQuad?.dispose(), this._auxDebugQuad?.material.dispose(), this._debugBoundsQuad !== void 0 && (this._debugBoundsQuad.dispose(), this._debugBoundsQuad.material.dispose());
	}
	getRenderTime() {
		return this._resetTime;
	}
}, _s = Math.PI, vs = /*@__PURE__*/ b(([e]) => {
	let t = e.x.sub(.5), n = O(1).sub(e.y), r = t.mul(2 * _s), i = n.mul(_s), o = a(i);
	return p(o.mul(ce(r)), ce(i), o.mul(a(r)));
}), ys = class {
	constructor(e) {
		this.renderer = e, this._blur = f(0), this._pmremNode = le(null, vs(s()), this._blur);
		let t = new x();
		t.colorNode = this._pmremNode, t.toneMapped = !1, this.quad = new re(t), this.renderTarget = new it(1, 1, {
			type: et,
			format: P,
			depthBuffer: !1
		});
	}
	dispose() {
		this._pmremNode.value = null, this._pmremNode.dispose(), this.quad.material.dispose(), this.renderTarget.dispose();
	}
	async generate(e, t = 0, n = null, r = null) {
		let { renderTarget: i, quad: a, renderer: o } = this, s = e.clone();
		n ??= s.image.width, r ??= s.image.height, i.setSize(n, r), i.texture.colorSpace = s.colorSpace, this._pmremNode.value = s, this._blur.value = t;
		let c = o.getRenderTarget();
		o.setRenderTarget(i), a.render(o), o.setRenderTarget(c);
		let l = await o.readRenderTargetPixelsAsync(i, 0, 0, n, r), u = new Uint16Array(n * r * 4);
		for (let e = 0, t = u.length; e < t; e++) u[e] = j.toHalfFloat(l[e]);
		let d = new M(u, n, r, P, Pe);
		return d.minFilter = s.minFilter, d.magFilter = s.magFilter, d.wrapS = s.wrapS, d.wrapT = s.wrapT, d.mapping = 303, d.colorSpace = s.colorSpace, d.needsUpdate = !0, this._pmremNode.value = null, s.dispose(), d;
	}
}, bs = class extends U {
	constructor() {
		let e = {
			auxTarget: T(Rn()).toReadOnly(),
			albedoTarget: T(zn()).toWriteOnly(),
			normalTarget: T(zn()).toWriteOnly(),
			globalId: y
		}, t = H`
			fn compute( globalId: vec3u ) -> void {

				let dims = textureDimensions( ${e.auxTarget} );
				if ( globalId.x >= dims.x || globalId.y >= dims.y ) {

					return;

				}

				var packed: vec3u;
				for ( var layer = 0u; layer < ${3}u; layer ++ ) {

					packed[ layer ] = textureLoad( ${e.auxTarget}, globalId.xy, layer ).r;

				}

				textureStore( ${e.albedoTarget}, globalId.xy, vec4f( ${Nn}( packed ), 1.0 ) );
				textureStore( ${e.normalTarget}, globalId.xy, vec4f( ${Pn}( packed ), 1.0 ) );

			}
		`;
		super(t(e)), this.defineUniformAccessors(e);
	}
}, xs = class extends tt {
	get texture() {
		return this._texture;
	}
	get complete() {
		return this._complete;
	}
	get running() {
		return this._running;
	}
	constructor(e = {}) {
		super();
		let { initUNetFromURL: t, auxWeightsUrl: n, colorWeightsUrl: r, useAuxiliaryBuffers: i = !0, maxTileSize: a = null, dynamicTile: o = null } = e;
		if (!t) throw Error("OIDNDenoiser: \"initUNetFromURL\" from \"oidn-webgpu\" must be provided.");
		this.initUNetFromURL = t, this.auxWeightsUrl = n, this.colorWeightsUrl = r, this.useAuxiliaryBuffers = i, this.maxTileSize = a, this.dynamicTile = o, this.renderer = null, this._texture = null, this._running = !1, this._complete = !1, this._abort = null, this._requestId = 0, this._failed = !1, this._unets = {
			aux: null,
			color: null
		}, this._resultPipeline = null, this._rawTexture = null, this._unpackAuxKernel = new bs().setWorkgroupSize(8, 8, 1), this._albedoTarget = zn("Denoiser Albedo"), this._normalTarget = zn("Denoiser Normal");
	}
	init(e) {
		this.renderer = e;
	}
	update(e, t = null) {
		if (this._complete || this._running || this._failed) return this._texture;
		let n = null, r = null;
		return this.useAuxiliaryBuffers && t && (this._unpackAux(t), n = this._albedoTarget, r = this._normalTarget), this.denoise(e, n, r).catch((e) => {
			this._failed = !0, this.dispatchEvent({
				type: "error",
				error: e
			});
		}), this._texture;
	}
	async denoise(e, t = null, n = null) {
		if (this._complete || this._running) return;
		this._running = !0;
		let r = !!(t && n), i = ++this._requestId, a;
		try {
			a = await this._initUNet(r);
		} catch (e) {
			throw this._running = !1, e;
		}
		if (i !== this._requestId || !this._running) return;
		let { renderer: o } = this, s = o.backend;
		o.initTexture(e);
		let { width: c, height: l } = e, u = {
			color: {
				data: s.get(e).texture,
				width: c,
				height: l
			},
			scheduling: "animation-frame",
			progress: (e, t, n, r, i) => {
				this._copyOutputToTexture(e, c, l), this.dispatchEvent({
					type: "progress",
					progress: (r + 1) / i
				});
			},
			done: (e) => {
				this._running = !1, this._complete = !0, this._abort = null, this._disposeAuxImages();
			}
		};
		r && (o.initTexture(t), o.initTexture(n), u.albedo = {
			data: s.get(t).texture,
			width: c,
			height: l
		}, u.normal = {
			data: s.get(n).texture,
			width: c,
			height: l
		}), this._abort = a.tileExecute(u);
	}
	reset() {
		this._abort?.(), this._abort = null, this._texture?.dispose(), this._texture = null, this._rawTexture?.destroy(), this._rawTexture = null, this._disposeAuxImages(), this._running = !1, this._complete = !1, this._failed = !1;
	}
	dispose() {
		this.reset(), this._unpackAuxKernel.dispose();
		for (let e in this._unets) this._unets[e]?.then((e) => e.dispose()), this._unets[e] = null;
	}
	_unpackAux(e) {
		let { renderer: t, _unpackAuxKernel: n, _albedoTarget: r, _normalTarget: i } = this, { width: a, height: o } = e.image;
		r.setSize(a, o), i.setSize(a, o), n.auxTarget = e, n.albedoTarget = r, n.normalTarget = i, t.compute(n.kernel, n.getDispatchSize(a, o));
	}
	_disposeAuxImages() {
		this._albedoTarget.dispose(), this._normalTarget.dispose();
	}
	_initUNet(e) {
		let t = e ? "aux" : "color";
		return this._unets[t] || (this._unets[t] = (async () => {
			let t = this.renderer.backend.device, n = e ? this.auxWeightsUrl : this.colorWeightsUrl;
			if (!n) throw Error(`OIDNDenoiser: no ${e ? "auxWeightsUrl" : "colorWeightsUrl"} was provided.`);
			let r = {
				aux: e,
				hdr: !0
			};
			return this.maxTileSize !== null && (r.maxTileSize = this.maxTileSize), this.dynamicTile !== null && (r.dynamicTile = this.dynamicTile), this.initUNetFromURL(n, { device: t }, r);
		})()), this._unets[t];
	}
	_copyOutputToTexture(e, t, n) {
		let r = this.renderer.backend.device;
		if (!this._resultPipeline) {
			let e = r.createShaderModule({ code: "\n					@group( 0 ) @binding( 0 ) var<storage, read> src : array<vec4f>;\n					@group( 0 ) @binding( 1 ) var dst : texture_storage_2d<rgba16float, write>;\n\n					@compute @workgroup_size( 8, 8 )\n					fn main( @builtin( global_invocation_id ) gid : vec3u ) {\n\n						let dims = textureDimensions( dst );\n						if ( gid.x >= dims.x || gid.y >= dims.y ) {\n\n							return;\n\n						}\n\n						textureStore( dst, gid.xy, src[ gid.y * dims.x + gid.x ] );\n\n					}\n				" });
			this._resultPipeline = r.createComputePipeline({
				layout: "auto",
				compute: {
					module: e,
					entryPoint: "main"
				}
			});
		}
		this._rawTexture && this._rawTexture.width === t && this._rawTexture.height === n || (this._rawTexture?.destroy(), this._rawTexture = r.createTexture({
			size: [t, n],
			format: "rgba16float",
			usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
		}), this._texture?.dispose(), this._texture = new He(this._rawTexture), this._texture.image = {
			width: t,
			height: n
		});
		let i = r.createBindGroup({
			layout: this._resultPipeline.getBindGroupLayout(0),
			entries: [{
				binding: 0,
				resource: { buffer: e.data }
			}, {
				binding: 1,
				resource: this._rawTexture.createView()
			}]
		}), a = r.createCommandEncoder(), o = a.beginComputePass();
		o.setPipeline(this._resultPipeline), o.setBindGroup(0, i), o.dispatchWorkgroups(Math.ceil(t / 8), Math.ceil(n / 8)), o.end(), r.queue.submit([a.finish()]);
	}
}, Ss = /*@__PURE__*/ new A(), Cs = class {
	constructor(e = {}) {
		let { Upscaler: t, sharpness: n = 1 } = e;
		if (!t) throw Error("FSRUpscaler: the \"Upscaler\" class from \"@pmndrs/upscaler\" must be provided.");
		this.Upscaler = t, this.sharpness = n, this.renderer = null, this._upscaler = null;
	}
	init(e) {
		this.renderer = e, this._upscaler?.dispose(), this._upscaler = new this.Upscaler({ renderer: e }), this._upscaler.init();
	}
	upscale(e, t) {
		let { renderer: n, _upscaler: r } = this;
		return n.initTexture(e), n.getDrawingBufferSize(Ss), (r.displayWidth !== Ss.x || r.displayHeight !== Ss.y || r.renderWidth !== e.width || r.renderHeight !== e.height) && r.configure({
			displayWidth: Ss.x,
			displayHeight: Ss.y,
			renderWidth: e.width,
			renderHeight: e.height,
			path: "spatial"
		}), r.settings.sharpness = this.sharpness, r.dispatch({ color: e }, t), r.outputTexture;
	}
	dispose() {
		this._upscaler?.dispose(), this._upscaler = null;
	}
}, ws = class extends Ee {
	constructor() {
		super(), this.isEquirectCamera = !0;
	}
};
// node_modules/three-gpu-pathtracer/src/webgpu/shims/EquirectCameraShim.js
ws.prototype.getCameraRayFn = function() {
	let e = f(new N());
	return {
		fn: H`
		fn getCameraRay( uv: vec2f, resolution: vec2f, ray: ptr<function, ${I}> ) -> bool {

			// screen uv to spherical direction, matching three.js' equirect orientation
			let theta = ( uv.x - 0.5 ) * 2.0 * ${S};
			let phi = ( 1.0 - uv.y ) * ${S};
			let sinPhi = sin( phi );
			let direction = vec3f( sinPhi * cos( theta ), cos( phi ), sinPhi * sin( theta ) );

			// equirect ignores the projection - orient by the camera world matrix and place the origin.
			// there is no projection far plane, so the trace distance is unbounded
			ray.origin = ( ${e} * vec4f( 0.0, 0.0, 0.0, 1.0 ) ).xyz;
			ray.direction = ( ${e} * vec4f( direction, 0.0 ) ).xyz;
			ray.maxDist = 0.0;
			return true;

		}
	`,
		update: () => (e.value.copy(this.matrixWorld), !1)
	};
};
// node_modules/three-gpu-pathtracer/src/objects/PhysicalCamera.js
var Ts = class extends Be {
	set bokehSize(e) {
		this.fStop = this.getFocalLength() / e;
	}
	get bokehSize() {
		return this.getFocalLength() / this.fStop;
	}
	constructor(...e) {
		super(...e), this.fStop = 1.4, this.apertureBlades = 0, this.apertureRotation = 0, this.focusDistance = 25, this.anamorphicRatio = 1;
	}
	copy(e, t) {
		return super.copy(e, t), this.fStop = e.fStop, this.apertureBlades = e.apertureBlades, this.apertureRotation = e.apertureRotation, this.focusDistance = e.focusDistance, this.anamorphicRatio = e.anamorphicRatio, this;
	}
}, Es = H`
	fn sampleCircle( uv: vec2f ) -> vec2f {

		let angle = 2.0 * ${S} * uv.x;
		let radius = sqrt( uv.y );
		return vec2f( cos( angle ), sin( angle ) ) * radius;

	}
`, Ds = H`
	fn sampleTriangle( a: vec2f, b: vec2f, c: vec2f, rIn: vec2f ) -> vec2f {

		let e1 = a - b;
		let e2 = c - b;

		var r = rIn;
		if ( r.x + r.y > 1.0 ) {

			r = vec2f( 1.0 ) - r;

		}

		return e1 * r.x + e2 * r.y;

	}
`, Os = H`
	fn sampleAperture( blades: i32, uvw: vec3f ) -> vec2f {

		if ( blades == 0 ) {

			return ${Es}( uvw.xy );

		} else {

			return ${H`
	fn sampleRegularPolygon( sidesIn: i32, uvw: vec3f ) -> vec2f {

		let sides = max( sidesIn, 3 );
		let anglePerSegment = 2.0 * ${S} / f32( sides );
		let segment = floor( f32( sides ) * uvw.x );

		let angle1 = anglePerSegment * segment;
		let angle2 = angle1 + anglePerSegment;
		let a = vec2f( sin( angle1 ), cos( angle1 ) );
		let b = vec2f( 0.0, 0.0 );
		let c = vec2f( sin( angle2 ), cos( angle2 ) );

		return ${Ds}( a, b, c, uvw.yz );

	}
`}( blades, uvw );

		}

	}
`, ks = H`
	fn rotateVector( v: vec2f, t: f32 ) -> vec2f {

		let vc = cos( t );
		let vs = sin( t );
		return vec2f( v.x * vc - v.y * vs, v.x * vs + v.y * vc );

	}
`;
// node_modules/three-gpu-pathtracer/src/webgpu/shims/ArrayCameraShim.js
Ts.prototype.getCameraRayFn = function() {
	let e = f(new N()), t = f(new N()), n = f(0), r = f(0), i = f(0, "int"), a = f(0), o = f(1);
	return {
		fn: H`
		fn getCameraRay( uv: vec2f, resolution: vec2f, ray: ptr<function, ${I}> ) -> bool {

			// base ray
			let ndc = uv * 2.0 - vec2f( 1.0 );
			*ray = ${Gt}( ndc, ${e} );

			// camera state
			let forward = normalize( ( ${t} * vec4f( 0.0, 0.0, - 1.0, 0.0 ) ).xyz );
			let cameraOrigin = ( ${t} * vec4f( 0.0, 0.0, 0.0, 1.0 ) ).xyz;

			// depth of field
			// measure focus distance from the camera origin along the optical axis so the focal
			// surface is a flat plane perpendicular to the camera forward vector rather than a sphere
			let focalPoint = cameraOrigin + ray.direction * ( ${n} / dot( ray.direction, forward ) );
			let nearDistance = dot( ray.origin - cameraOrigin, forward );

			// sample the aperture shape
			let shapeUVW = ${cr}( ${4} );
			var apertureSample = ${Os}( ${i}, shapeUVW );
			apertureSample *= ${r} * 0.5 * 1e-3;

			// rotate + squash the sample for anamorphic apertures
			apertureSample =
				${ks}( apertureSample, ${a} )
				* vec2f( ${o}, 1.0 / ${o} );

			// aim from the aperture through the focal point, starting on the near plane like the base ray
			ray.origin = cameraOrigin + ( ${t} * vec4f( apertureSample, 0.0, 0.0 ) ).xyz;
			ray.direction = normalize( focalPoint - ray.origin );
			ray.origin += ray.direction * ( nearDistance / dot( ray.direction, forward ) );

			return true;

		}
	`,
		update: () => (this.coordinateSystem = Oe, this.updateMatrixWorld(), this.updateProjectionMatrix(), e.value.multiplyMatrices(this.matrixWorld, this.projectionMatrixInverse), t.value.copy(this.matrixWorld), n.value = this.focusDistance, r.value = this.bokehSize, i.value = this.apertureBlades, a.value = this.apertureRotation, o.value = this.anamorphicRatio, !1)
	};
}, st.prototype.getCameraRayFn = function() {
	let e = {
		fn: null,
		update: null
	}, t = ue(0), n = o([], "mat4"), r = o([], "vec4");
	return e.fn = H`
		fn getCameraRay( uv: vec2f, resolution: vec2f, ray: ptr<function, ${I}> ) -> bool {

			let pixel = uv * resolution;

			for ( var i = 0u; i < ${t}u; i ++ ) {

				let viewport = ${r}[ i ];
				let viewportMax = viewport.xy + viewport.zw;
				if ( all( pixel >= viewport.xy ) && all( pixel < viewportMax ) ) {

					let cameraUv = ( pixel - viewport.xy ) / viewport.zw;
					let ndc = cameraUv * 2.0 - vec2f( 1.0 );
					*ray = ${Gt}( ndc, ${n}[ i ] );
					return true;

				}

			}

			return false;

		}
	`, e.update = () => {
		let { cameras: e } = this, i = t.node.value !== e.length;
		for (t.node.value = e.length; r.array.length < e.length;) r.array.push(new Ne()), n.array.push(new N());
		n.array.length = e.length, r.array.length = e.length;
		for (let t = 0; t < e.length; t++) {
			let i = e[t], a = i.viewport;
			i.coordinateSystem = Oe, i.updateMatrixWorld(), i.updateProjectionMatrix(), n.array[t].multiplyMatrices(i.matrixWorld, i.projectionMatrixInverse), r.array[t].copy(a);
		}
		return i;
	}, e;
};
export { ys as BlurredEnvMapGenerator, Cs as FSRUpscaler, xs as OIDNDenoiser, ra as RANDOM_BLUE_DITHER, ta as RANDOM_PCG, na as RANDOM_SOBOL, bn as RenderToScreenNodeMaterial, sa as SAMPLE_ACTIVE_FLAG, la as SAMPLE_COUNT_MASK, ca as SAMPLE_DISPATCHED_FLAG, ia as TRANSMISSIVE_BACKGROUND_ENVIRONMENT, aa as TRANSMISSIVE_BACKGROUND_OVERLAY, oa as TRANSMISSIVE_BACKGROUND_TRANSPARENT, gs as WebGPUPathTracer };
