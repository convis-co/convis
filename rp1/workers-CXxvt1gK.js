import { B as e, I as t } from "./stage-C_LUPXd6.js";
import { d as n, s as r, t as i, u as a } from "./MeshBVH-DinRuPeE.js";
// node_modules/three-mesh-bvh/src/workers/utils/WorkerBase.js
var o = class {
	constructor(e) {
		this.name = "WorkerBase", this.running = !1, this.worker = e, this.worker.onerror = (e) => {
			throw e.message ? Error(`${this.name}: Could not create Web Worker with error "${e.message}"`) : Error(`${this.name}: Could not create Web Worker.`);
		};
	}
	runTask() {}
	generate(...e) {
		if (this.running) throw Error("GenerateMeshBVHWorker: Already running job.");
		if (this.worker === null) throw Error("GenerateMeshBVHWorker: Worker has been disposed.");
		this.running = !0;
		let t = this.runTask(this.worker, ...e);
		return t.finally(() => {
			this.running = !1;
		}), t;
	}
	dispose() {
		this.worker.terminate(), this.worker = null;
	}
}, s = class extends o {
	constructor() {
		let e = new Worker(new URL(
			/* @vite-ignore */
			new URL("assets/generateMeshBVH.worker-WryugPXK.js", import.meta.url).href,
			"" + import.meta.url
		), { type: "module" });
		super(e), this.name = "GenerateMeshBVHWorker";
	}
	runTask(n, r, a = {}) {
		return new Promise((o, s) => {
			if (r.getAttribute("position").isInterleavedBufferAttribute || r.index && r.index.isInterleavedBufferAttribute) throw Error("GenerateMeshBVHWorker: InterleavedBufferAttribute are not supported for the geometry attributes.");
			n.onerror = (e) => {
				s(/* @__PURE__ */ Error(`GenerateMeshBVHWorker: ${e.message}`));
			}, n.onmessage = (c) => {
				let { data: l } = c;
				if (l.error) s(Error(l.error)), n.onmessage = null;
				else if (l.serialized) {
					let { serialized: s, position: c } = l, u = i.deserialize(s, r, { setIndex: !1 }), d = Object.assign({ setBoundingBox: !0 }, a);
					if (r.attributes.position.array = c, s.index) {
						if (r.index) r.index.array = s.index;
						else {
							let t = new e(s.index, 1, !1);
							r.setIndex(t);
						}
					}
					d.setBoundingBox && (r.boundingBox = u.getBoundingBox(new t())), a.onProgress && a.onProgress(l.progress), o(u), n.onmessage = null;
				} else a.onProgress && a.onProgress(l.progress);
			};
			let c = r.index ? r.index.array : null, l = r.attributes.position.array, u = [l];
			c && u.push(c), n.postMessage({
				index: c,
				position: l,
				options: {
					...a,
					onProgress: null,
					includedProgressCallback: !!a.onProgress,
					groups: [...r.groups]
				}
			}, u.map((e) => e.buffer).filter((e) => typeof SharedArrayBuffer > "u" || !(e instanceof SharedArrayBuffer)));
		});
	}
}, c = typeof navigator < "u" ? navigator.hardwareConcurrency : 4, l = class extends o {
	constructor() {
		let e = new Worker(new URL(
			/* @vite-ignore */
			new URL("assets/parallelMeshBVH.worker-DiTmB4kW.js", import.meta.url).href,
			"" + import.meta.url
		), { type: "module" });
		if (super(e), this.name = "ParallelMeshBVHWorker", this.maxWorkerCount = Math.max(c, 4), !n()) throw Error("ParallelMeshBVHWorker: Shared Array Buffers are not supported.");
	}
	runTask(n, o, s = {}) {
		return new Promise((c, l) => {
			if (s.indirect || r(o, s), o.getAttribute("position").isInterleavedBufferAttribute || o.index && o.index.isInterleavedBufferAttribute) throw Error("ParallelMeshBVHWorker: InterleavedBufferAttribute are not supported for the geometry attributes.");
			n.onerror = (e) => {
				l(/* @__PURE__ */ Error(`ParallelMeshBVHWorker: ${e.message}`));
			}, n.onmessage = (r) => {
				let { data: a } = r;
				if (a.error) l(Error(a.error)), n.onmessage = null;
				else if (a.serialized) {
					let { serialized: r, position: l } = a, u = i.deserialize(r, o, { setIndex: !1 }), d = {
						setBoundingBox: !0,
						...s
					};
					if (o.attributes.position.array = l, r.index) {
						if (o.index) o.index.array = r.index;
						else {
							let t = new e(r.index, 1, !1);
							o.setIndex(t);
						}
					}
					d.setBoundingBox && (o.boundingBox = u.getBoundingBox(new t())), s.onProgress && s.onProgress(a.progress), c(u), n.onmessage = null;
				} else s.onProgress && s.onProgress(a.progress);
			};
			let u = o.index ? o.index.array : null, d = o.attributes.position.array;
			n.postMessage({
				operation: "BUILD_BVH",
				maxWorkerCount: this.maxWorkerCount,
				index: a(u, SharedArrayBuffer),
				position: a(d, SharedArrayBuffer),
				options: {
					...s,
					onProgress: null,
					includedProgressCallback: !!s.onProgress,
					groups: [...o.groups]
				}
			});
		});
	}
}, u = class {
	constructor() {
		if (n()) return new l();
		{
			console.warn("ParallelMeshBVHWorker: SharedArrayBuffers not supported. Falling back to single-threaded GenerateMeshBVHWorker.");
			let e = new s();
			return e.maxWorkerCount = c, e;
		}
	}
};
export { s as GenerateMeshBVHWorker, u as ParallelMeshBVHWorker };
