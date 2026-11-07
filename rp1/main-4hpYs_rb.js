// node_modules/oidn-webgpu/lib/tza.js
var e = class {
	dims = [];
	paddedDims = [];
	layout = "x";
	dataType = "Float32";
	getByteSize() {
		let e = 1;
		for (let t of this.paddedDims) e *= t;
		return this.dataType === "Float32" ? e *= 4 : this.dataType === "Float16" && (e *= 2), e;
	}
}, t = class {
	desc;
	data;
	constructor(e, t) {
		this.desc = e, this.data = t;
	}
}, n = class {
	_view;
	offset = 0;
	constructor(e) {
		this._view = e;
	}
	read(e) {
		let t = this._view, n = this.offset;
		switch (this.offset += e, e) {
			case 1: return t.getUint8(n);
			case 2: return t.getUint16(n, !0);
			case 4: return t.getUint32(n, !0);
			case 8: return Number(t.getBigUint64(n, !0));
			default: throw Error("unsupported read size");
		}
	}
};
function r(r) {
	let i = new Uint8Array(r), a = new n(new DataView(r));
	if (a.read(2) !== 16855) throw Error("invalid or corrupted weights blob");
	let o = a.read(1);
	if (a.read(1), o !== 2) throw Error("unsupported weights blob version");
	a.offset = a.read(8);
	let s = a.read(4), c = /* @__PURE__ */ new Map();
	for (let n = 0; n < s; ++n) {
		let n = new e(), r = a.read(2), o = new TextDecoder().decode(i.subarray(a.offset, a.offset + r));
		a.offset += r;
		let s = a.read(1);
		for (let e = 0; e < s; ++e) n.dims.push(a.read(4));
		n.paddedDims = [...n.dims], new TextDecoder().decode(i.subarray(a.offset, a.offset + s)) === "oihw" && (n.layout = "oihw"), a.offset += s;
		let l = String.fromCharCode(a.read(1));
		if (l === "f") n.dataType = "Float32";
		else if (l === "h") n.dataType = "Float16";
		else throw Error("invalid tensor data type");
		let u = a.read(8), d = i.slice(u, u + n.getByteSize());
		c.set(o, new t(n, d));
	}
	return c;
}
// node_modules/oidn-webgpu/lib/WGPUComputePass.js
function i(e, t) {
	return e.channels === t.channels;
}
var a = class {
	autoUpdateOutputBuffer = !0;
	_label;
	_device;
	_outputBuffers = {};
	_pipeline;
	_bindGroups = [];
	_needsUpdatePipeline = !0;
	_needsResizeBuffer = !0;
	_inputs = [];
	_outputs = [];
	_uniforms = [];
	_uniformBuffers = {};
	_width = 10;
	_height = 10;
	_execWidth;
	_execHeight;
	_csCode = "";
	_csMain;
	_csDefine;
	_groupOffsets = {
		inputs: 0,
		uniforms: 1,
		outputs: 2
	};
	constructor(e, t, n) {
		this._label = e, this._device = t, this._csMain = n.csMain, this._csDefine = n.csDefine, this._inputs = n.inputs, this._outputs = n.outputs, this._uniforms = n.uniforms, this.autoUpdateOutputBuffer = n.autoUpdateOutputBuffer ?? !0, n.uniforms.forEach((e) => {
			this._uniformBuffers[e.label] = t.createBuffer({
				label: this._label,
				size: e.data.byteLength,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
			}), this._device.queue.writeBuffer(this._uniformBuffers[e.label], 0, e.data);
		});
	}
	setCSCode({ csDefine: e, csMain: t }) {
		this._csDefine = e, this._csMain = t, this._needsUpdatePipeline = !0;
	}
	setSize(e, t) {
		e = Math.ceil(e), t = Math.ceil(t);
		let n = e !== this._width || t !== this._height;
		this._width = e, this._height = t, n && (this._needsResizeBuffer = !0, this._needsUpdatePipeline = !0);
	}
	setExecuteSize(e, t) {
		e = Math.ceil(e), t = Math.ceil(t), this._execWidth = e, this._execHeight = t;
	}
	setOutputParams(e) {
		this.autoUpdateOutputBuffer && this._updateOutputBuffers(e), this._needsUpdatePipeline = !0;
	}
	setOutputBuffers(e) {
		this._outputBuffers = Object.keys(e).reduce((t, n) => (t[n] = {
			buffer: e[n],
			params: { channels: 4 }
		}, t), {});
	}
	setUniform(e, t) {
		let n = this._uniformBuffers[e];
		this._device.queue.writeBuffer(n, 0, t);
	}
	getOutput(e) {
		return this._needsResizeBuffer && this.autoUpdateOutputBuffer && (this._resizeOutputBuffers(), this._needsResizeBuffer = !1), this._outputBuffers[e].buffer;
	}
	dispose(e = !0) {
		Object.keys(this._uniformBuffers).forEach((e) => {
			this._uniformBuffers[e].destroy();
		}), e && Object.keys(this._outputBuffers).forEach((e) => {
			this._outputBuffers[e].buffer.destroy();
		});
	}
	_createBuffer(e) {
		let t = this._width * this._height * 4 * 4;
		return this._device.createBuffer({
			label: this._label,
			size: Math.max(t, 80),
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
		});
	}
	_resizeOutputBuffers() {
		let e = this._outputBuffers;
		for (let t in e) {
			let { buffer: n, params: r } = e[t];
			n.destroy(), e[t].buffer = this._createBuffer(r);
		}
	}
	_updateOutputBuffers(e) {
		let t = this._outputBuffers;
		for (let n in e) {
			let r = e[n];
			i(r, t[n]?.params || {}) || (t[n]?.buffer.destroy(), t[n] = {
				buffer: this._createBuffer(r),
				params: r
			});
		}
	}
	_updatePipeline(e, t) {
		if (!this._needsUpdatePipeline) return;
		this._needsUpdatePipeline = !1;
		let n = this._device, r = this._getFullCs(e, t);
		r !== this._csCode && (this._csCode = r, this._pipeline = n.createComputePipeline({
			label: this._label,
			layout: "auto",
			compute: {
				module: n.createShaderModule({
					label: this._label,
					code: r
				}),
				entryPoint: "main"
			}
		}), this._updateBindGroups());
	}
	_getFullCs(e, t) {
		let n = this._inputs, r = this._uniforms, i = 0, a = this._groupOffsets = {
			inputs: 0,
			uniforms: 0,
			outputs: 0
		};
		return n.length > 0 && i++, r.length > 0 && (a.uniforms = i, i++), a.outputs = i, `
${n.sort().map((n, r) => {
			let i = `@group(${a.inputs}) @binding(${r}) `, o = `in_${n}`;
			return t[n] === "texture" ? `${i} var ${o}: texture_2d<f32>;` : `${i} var<storage, read> ${o}: array<vec${e[n].channels}f>;`;
		}).join("\n")}
${this._uniforms.map((e, t) => `@group(${a.uniforms}) @binding(${t}) var<uniform> ${e.label}: ${e.type};`).join("\n")}

${this._outputs.map((e, t) => `@group(${a.outputs}) @binding(${t}) var<storage, read_write> out_${e}: array<vec${this._outputBuffers[e].params.channels}f>;`).join("\n")}
${this._csDefine ?? ""}
@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) globalId: vec3u) {
${this._csMain}
}
`;
	}
	_updateBindGroups() {
		let e = [], t = this._device, n = this._groupOffsets;
		this._uniforms.length > 0 && (e[n.uniforms] = t.createBindGroup({
			label: this._label,
			layout: this._pipeline.getBindGroupLayout(n.uniforms),
			entries: this._uniforms.map((e, t) => ({
				binding: t,
				resource: { buffer: this._uniformBuffers[e.label] }
			}))
		})), this._bindGroups = e;
	}
	createPass(e, t) {
		this._needsResizeBuffer && this.autoUpdateOutputBuffer && (this._resizeOutputBuffers(), this._needsResizeBuffer = !1);
		let n = this._inputs.reduce((e, n) => (e[n] = t[n].buffer ? "buffer" : "texture", e), {});
		this._updatePipeline(t, n);
		let r = this._groupOffsets;
		this._inputs.length > 0 && (this._bindGroups[r.inputs] = this._device.createBindGroup({
			label: this._label,
			layout: this._pipeline.getBindGroupLayout(r.inputs),
			entries: this._inputs.map((e, n) => ({
				binding: n,
				resource: t[e].buffer ? { buffer: t[e].buffer } : t[e].texture.createView()
			}))
		})), this._bindGroups[r.outputs] = this._device.createBindGroup({
			label: this._label,
			layout: this._pipeline.getBindGroupLayout(r.outputs),
			entries: this._outputs.map((e, t) => ({
				binding: t,
				resource: { buffer: this._outputBuffers[e].buffer }
			}))
		});
		let i = e.beginComputePass();
		i.setPipeline(this._pipeline), this._bindGroups.forEach((e, t) => {
			i.setBindGroup(t, e);
		}), i.dispatchWorkgroups(Math.ceil((this._execWidth ?? this._width) / 8), Math.ceil((this._execHeight ?? this._height) / 8), 1), i.end();
	}
}, o = 34028234663852886e22;
function s(e, t, n) {
	return Number.isNaN(e) ? 0 : Math.min(Math.max(e, t), n);
}
var c = "\nconst FLT_MAX = 3.4028234663852886e38;\nfn sanitize(v: vec3f, lo: f32, hi: f32) -> vec3f {\n  let bits = bitcast<vec3u>(v);\n  let magnitude = bits & vec3u(0x7fffffffu);\n  let negative = (bits & vec3u(0x80000000u)) != vec3u(0u);\n  let infinite = select(vec3f(hi), vec3f(lo), negative);\n  let clamped = select(clamp(v, vec3f(lo), vec3f(hi)), infinite, magnitude == vec3u(0x7f800000u));\n  return select(clamped, vec3f(0.0), magnitude > vec3u(0x7f800000u));\n}\n", l = 1412.83765, u = 1.64593172, d = .431384981, f = -.00294139609, p = .192653254, m = .00626026094, h = .998620152, g = 15794576e-13, _ = .0322087631, v = .00223151711, y = .370974749, b = T(65504), x = 1 / b, S = b, C = Math.log(65505), w = 1 / C;
function T(e) {
	return e <= g ? l * e : e <= _ ? u * e ** +d + f : p * Math.log(e + m) + h;
}
function E(e) {
	return e <= v ? e / l : e <= y ? ((e - f) / u) ** (1 / d) : Math.exp((e - h) / p) - m;
}
function ee(e, t) {
	return t === "log" ? Math.log(e + 1) * w : T(e) * x;
}
function te(e, t) {
	return t === "log" ? Math.exp(e * C) - 1 : E(e * S);
}
function ne({ data: e, channels: t, inputScale: n, transfer: r = "pu" }) {
	let i = new Float32Array(e);
	for (let e = 0; e < i.length; e += t) for (let t = 0; t < 3; t++) i[e + t] = ee(s(i[e + t] * n, 0, o), r);
	return i;
}
function re({ data: e, channels: t, inputScale: n, transfer: r = "pu" }) {
	let i = new Float32Array(e), a = 1 / n;
	for (let e = 0; e < i.length; e += t) for (let t = 0; t < 3; t++) i[e + t] = te(s(i[e + t], 0, o), r) * a;
	return i;
}
function ie({ data: e, channels: t }) {
	let n = 0;
	for (let r = 0; r < e.length; r += t) {
		let t = s(e[r], 0, o), i = s(e[r + 1], 0, o), a = s(e[r + 2], 0, o), c = .212671 * t + .71516 * i + .072169 * a;
		n += Math.log2(c + 1e-4);
	}
	let r = e.length / t;
	return .18 / 2 ** (n / r);
}
var ae = `
const a = ${l};
const b = ${u};
const c = ${d};
const d = ${f};
const e = ${p};
const f = ${m};
const g = ${h};
const y0 =${g};
const y1 =${_};
const x0 =${v};
const x1 =${y};

const normScale = ${x};
const rcpNormScale = ${S};
`;
function oe(e) {
	return `
${ae}
const logXMax = ${C};
const logNormScale = ${w};
${e === "log" ? "fn HDRForward(y: f32) -> f32 { return log(y + 1.0) * logNormScale; }" : "fn HDRForward(y: f32) -> f32 {\n  if (y <= y0) { return a * y * normScale; }\n  else if (y <= y1) { return (b * pow(y, c) + d) * normScale; }\n  else { return (e * log(y + f) + g) * normScale; }\n}"}`;
}
function se(e) {
	return `
${ae}
const logXMax = ${C};
${e === "log" ? "fn HDRInverse(x: f32) -> f32 { return exp(x * logXMax) - 1.0; }" : "fn HDRInverse(x: f32) -> f32 {\n  let y = x * rcpNormScale;\n  if (y <= x0) { return y / a; }\n  else if (y <= x1) { return pow((y - d) / b, 1 / c); }\n  else { return exp((y - g) / e) - f; }\n}"}
`;
}
// node_modules/oidn-webgpu/lib/process.js
var ce = class {
	x;
	y;
	width;
	height;
	constructor(e, t, n, r) {
		this.x = e, this.y = t, this.width = n, this.height = r;
	}
}, le = class {
	_device;
	_isHDR;
	_hdrTransfer;
	_inputPassAux;
	_inputPassColor;
	_outputPass;
	_copyPass;
	_isInputTexture;
	constructor(e, t, n = "pu") {
		this._device = e, this._isHDR = t, this._hdrTransfer = n;
		let r = [
			{
				label: "inputScale",
				type: "f32",
				data: new Float32Array([1])
			},
			{
				label: "inputSize",
				type: "vec2i",
				data: /* @__PURE__ */ new Int32Array(2)
			},
			{
				label: "outputSize",
				type: "vec2i",
				data: /* @__PURE__ */ new Int32Array(2)
			},
			{
				label: "inputOffset",
				type: "vec2i",
				data: /* @__PURE__ */ new Int32Array(2)
			}
		];
		this._inputPassAux = new a("inputPassAux", this._device, {
			inputs: [
				"color",
				"albedo",
				"normal"
			],
			outputs: [
				"color",
				"albedo",
				"normal"
			],
			uniforms: r,
			csDefine: "",
			csMain: ""
		}), this._inputPassColor = new a("inputPassColor", this._device, {
			inputs: ["color"],
			outputs: ["color"],
			uniforms: r,
			csDefine: "",
			csMain: ""
		}), this._outputPass = new a("outputPass", this._device, {
			inputs: ["color", "raw"],
			outputs: ["color"],
			uniforms: [
				{
					label: "inputScale",
					type: "f32",
					data: new Float32Array([1])
				},
				{
					label: "inputSize",
					type: "vec2i",
					data: /* @__PURE__ */ new Int32Array(2)
				},
				{
					label: "outputSize",
					type: "vec2i",
					data: /* @__PURE__ */ new Int32Array(2)
				},
				{
					label: "imageSize",
					type: "vec2i",
					data: /* @__PURE__ */ new Int32Array(2)
				},
				{
					label: "inputOffset",
					type: "vec2i",
					data: /* @__PURE__ */ new Int32Array(2)
				},
				{
					label: "outputOffset",
					type: "vec2i",
					data: /* @__PURE__ */ new Int32Array(2)
				}
			],
			csDefine: "",
			csMain: ""
		}), this._copyPass = new a("copyPass", this._device, {
			inputs: ["color"],
			outputs: ["color"],
			autoUpdateOutputBuffer: !1,
			uniforms: [{
				label: "size",
				type: "vec2i",
				data: /* @__PURE__ */ new Int32Array(2)
			}],
			csMain: "\nlet outIdx = i32(globalId.x + globalId.y * u32(size.x));\nout_color[outIdx] = textureLoad(in_color, globalId.xy, 0);\n"
		}), this._inputPassAux.setOutputParams({
			color: { channels: 3 },
			albedo: { channels: 3 },
			normal: { channels: 3 }
		}), this._inputPassColor.setOutputParams({ color: { channels: 3 } }), this._outputPass.setOutputParams({ color: { channels: 4 } });
	}
	_updatePasses(e, t = !1) {
		if (this._isInputTexture != null && this._isInputTexture === e) return;
		this._isInputTexture = e;
		let n = this._isHDR, r = oe(this._hdrTransfer) + c;
		function i(t) {
			return e ? `textureLoad(in_${t}, vec2u(inputPosition), 0)` : `in_${t}[inIdx]`;
		}
		let a = `
let x = i32(globalId.x);
let y = i32(globalId.y);
let inputPosition = clamp(
  vec2i(x, y) + inputOffset,
  vec2i(0),
  inputSize - vec2i(1)
);
let inIdx = inputPosition.y * inputSize.x + inputPosition.x;
let col = ${i("color")};

let outIdx = y * outputSize.x + x;

if (${t}) {
  // Denoise the inversed alpha. Or the anti aliased edge will be too dark after denoised
  out_color[outIdx] = sanitize(vec3f(1.0 - col.a), 0.0, 1.0);
}
else if (${n}) {
  let scaled = sanitize(col.rgb * inputScale, 0.0, FLT_MAX);
  out_color[outIdx] = vec3f(HDRForward(scaled.r), HDRForward(scaled.g), HDRForward(scaled.b));
}
else {
  out_color[outIdx] = sanitize(col.rgb, 0.0, 1.0);
}
`;
		this._inputPassAux.setCSCode({
			csDefine: r,
			csMain: `
${a}
let alb = ${i("albedo")};
let nor = ${i("normal")};
// Normals arrive [0, 1]-encoded, so OIDN's [-1, 1] clamp becomes [0, 1].
out_normal[outIdx] = sanitize(nor.rgb, 0.0, 1.0);
out_albedo[outIdx] = sanitize(alb.rgb, 0.0, 1.0);
  `
		}), this._inputPassColor.setCSCode({
			csDefine: r,
			csMain: `
${a}
`
		}), this._outputPass.setCSCode({
			csDefine: se(this._hdrTransfer) + c,
			csMain: `
let x = i32(globalId.x);
let y = i32(globalId.y);
if (x >= outputSize.x || y >= outputSize.y) {
  return;
}
let inIdx = (y + inputOffset.y) * inputSize.x + x + inputOffset.x;
let outIdx = (y + outputOffset.y) * imageSize.x + x + outputOffset.x;
let col = in_color[inIdx];
let raw = ${e ? "textureLoad(in_raw, globalId.xy + vec2u(outputOffset), 0)" : "in_raw[outIdx]"};

// The network output may contain negative values or NaNs.
let denoised = sanitize(col.rgb, 0.0, ${n && !t ? "FLT_MAX" : "1.0"});
if (${t}) {
  out_color[outIdx] = vec4f(raw.rgb, 1.0 - denoised.r);
}
else if (${n}) {
  out_color[outIdx] = vec4f(
    vec3f(HDRInverse(denoised.r), HDRInverse(denoised.g), HDRInverse(denoised.b)) / inputScale,
    // Pick the alpha
    raw.a
  );
}
else {
  out_color[outIdx] = vec4f(denoised, raw.a);
}
`
		});
	}
	setImageSize(e, t) {
		this._inputPassAux.setUniform("inputSize", new Int32Array([e, t])), this._inputPassColor.setUniform("inputSize", new Int32Array([e, t])), this._outputPass.setUniform("imageSize", new Int32Array([e, t])), this._outputPass.setSize(e, t), this._copyPass.setSize(e, t), this._copyPass.setUniform("size", new Int32Array([e, t]));
	}
	setInputTile(e) {
		let t = new Int32Array([e.width, e.height]);
		[this._inputPassAux, this._inputPassColor].forEach((n) => {
			n.setUniform("inputOffset", new Int32Array([e.x, e.y])), n.setUniform("outputSize", t), n.setSize(t[0], t[1]);
		}), this._outputPass.setUniform("inputSize", t);
	}
	setOutputTile(e, t) {
		let n = this._outputPass, r = new Int32Array([e.width, e.height]), i = e.x - t.x, a = e.y - t.y;
		n.setUniform("outputSize", r), n.setUniform("inputOffset", new Int32Array([i, a])), n.setUniform("outputOffset", new Int32Array([e.x, e.y])), n.setExecuteSize(r[0], r[1]);
	}
	forward(e, t, n, r) {
		let i = e instanceof GPUTexture;
		this._updatePasses(i, r);
		let a = this._inputPassAux, o = this._inputPassColor, s = this._device.createCommandEncoder();
		function c(e) {
			return e instanceof GPUTexture ? {
				texture: e,
				channels: 4
			} : {
				buffer: e,
				channels: 4
			};
		}
		return t && n ? a.createPass(s, {
			color: c(e),
			albedo: c(t),
			normal: c(n)
		}) : o.createPass(s, { color: c(e) }), this._device.queue.submit([s.finish()]), t && n ? {
			color: a.getOutput("color"),
			albedo: a.getOutput("albedo"),
			normal: a.getOutput("normal")
		} : { color: o.getOutput("color") };
	}
	inverse(e, t) {
		let n = this._device.createCommandEncoder(), r = this._outputPass;
		return r.createPass(n, {
			color: {
				buffer: e,
				channels: 4
			},
			raw: t instanceof GPUBuffer ? {
				buffer: t,
				channels: 4
			} : {
				texture: t,
				channels: 4
			}
		}), this._device.queue.submit([n.finish()]), r.getOutput("color");
	}
	copyInputDataToOutput(e) {
		let t = this._device.createCommandEncoder(), n = this._outputPass.getOutput("color"), r = this._copyPass;
		e instanceof GPUTexture ? (r.setOutputBuffers({ color: n }), r.createPass(t, { color: {
			texture: e,
			channels: 4
		} })) : t.copyBufferToBuffer(e, 0, n, 0, n.size), this._device.queue.submit([t.finish()]);
	}
	dispose() {
		this._outputPass.dispose(), this._inputPassAux.dispose(), this._inputPassColor.dispose(), this._copyPass.dispose(!1);
	}
}, ue = 256, de = 432, fe = 16, pe = 16;
function me(e, t) {
	return Math.ceil(e / t) * t;
}
function he(e, t) {
	return Math.floor(e / t) * t;
}
function ge(e, t, n) {
	return {
		start: Math.round(n * e / t),
		end: Math.round((n + 1) * e / t)
	};
}
function _e(e, t, n, r = 0) {
	let i = t - e, a = Math.max(r, me(i, 16)), o = e - Math.floor((a - i) / 2);
	return o = ye(o, 0, Math.max(0, n - a)), {
		start: o,
		end: o + a
	};
}
function ve(e, t, n, r) {
	if (!Number.isInteger(e) || e <= 0 || !Number.isInteger(t) || t <= 0) throw Error("Tile grid dimensions must be positive integers");
	if (!Number.isFinite(n) || n <= 0) throw Error("Maximum tile size must be positive");
	if (!Number.isFinite(r) || r < 0) throw Error("Tile overlap must be non-negative");
	let i = Math.max(16, he(n, 16)), a = me(r, 16), o = Math.max(1, Math.ceil(e / i)), s = Math.max(1, Math.ceil(t / i)), c = [], l = 0, u = 0;
	for (let n = 0; n < s; n++) {
		let r = ge(t, s, n);
		for (let i = 0; i < o; i++) {
			let d = ge(e, o, i), f = {
				start: i === 0 ? d.start : Math.max(0, d.start - a),
				end: i === o - 1 ? d.end : Math.min(e, d.end + a)
			}, p = {
				start: n === 0 ? r.start : Math.max(0, r.start - a),
				end: n === s - 1 ? r.end : Math.min(t, r.end + a)
			}, m = _e(f.start, f.end, e), h = _e(p.start, p.end, t), g = {
				x: d.start,
				y: r.start,
				width: d.end - d.start,
				height: r.end - r.start
			}, _ = {
				x: m.start,
				y: h.start,
				width: m.end - m.start,
				height: h.end - h.start
			};
			l = Math.max(l, g.width), u = Math.max(u, g.height), c.push({
				column: i,
				row: n,
				input: _,
				output: g
			});
		}
	}
	let d = () => new Set(c.map(({ input: e }) => `${e.width}x${e.height}`));
	if (d().size > 2) {
		let n = Math.max(...c.map(({ input: e }) => e.width)), r = Math.max(...c.map(({ input: e }) => e.height));
		if (c.reduce((e, { input: t }) => e + n * t.height, 0) <= c.reduce((e, { input: t }) => e + t.width * r, 0)) for (let t of c) {
			let r = _e(t.input.x, t.input.x + t.input.width, e, n);
			t.input.x = r.start, t.input.width = r.end - r.start;
		}
		else for (let e of c) {
			let n = _e(e.input.y, e.input.y + e.input.height, t, r);
			e.input.y = n.start, e.input.height = n.end - n.start;
		}
	}
	let f = d(), p = c.reduce((e, { input: t }) => e + t.width * t.height, 0);
	return {
		columns: o,
		rows: s,
		overlap: a,
		maxOutputWidth: l,
		maxOutputHeight: u,
		inputPixelCount: p,
		inputShapeCount: f.size,
		tiles: c
	};
}
function ye(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function be(e, t) {
	let n = [...e].sort((e, t) => e - t);
	return n[Math.ceil(n.length * t) - 1];
}
var xe = class {
	enabled;
	maxTileSize;
	minTileSize;
	targetTileTimeMs;
	_tileSize;
	_adjustmentStep;
	_smoothedTileTimeMs;
	_completeExecutionsSinceChange = 0;
	constructor(e, t = !0) {
		let n = typeof t == "object" ? t : {};
		this.enabled = t !== !1, this.maxTileSize = Math.max(16, he(e, 16)), this.minTileSize = ye(me(n.minTileSize ?? ue, 16), 16, this.maxTileSize), this.targetTileTimeMs = Math.max(1, n.targetTileTimeMs ?? fe), this._adjustmentStep = Math.max(16, me(n.adjustmentStep ?? pe, 16)), this._tileSize = this.enabled ? ye(me(n.initialTileSize ?? de, 16), this.minTileSize, this.maxTileSize) : this.maxTileSize;
	}
	get tileSize() {
		return this._tileSize;
	}
	observe(e) {
		if (!this.enabled || e.length === 0) return !1;
		let t = e.filter((e) => Number.isFinite(e) && e >= 0);
		if (t.length === 0) return !1;
		let n = be(t.length >= 3 ? t.slice(1) : t, .75);
		if (this._smoothedTileTimeMs = this._smoothedTileTimeMs === void 0 ? n : this._smoothedTileTimeMs * .65 + n * .35, this._completeExecutionsSinceChange++, this._completeExecutionsSinceChange < 2) return !1;
		let r = this._tileSize;
		return this._smoothedTileTimeMs > this.targetTileTimeMs * 1.25 ? r -= this._adjustmentStep : this._smoothedTileTimeMs < this.targetTileTimeMs * .65 && (r += this._adjustmentStep), r = ye(me(r, 16), this.minTileSize, this.maxTileSize), r !== this._tileSize && (this._tileSize = r, this._smoothedTileTimeMs = void 0, this._completeExecutionsSinceChange = 0, !0);
	}
};
// node_modules/oidn-webgpu/lib/modelSpec.js
function D(e, t) {
	return {
		op: "conv2d",
		id: e,
		input: t,
		weight: `${e}.weight`,
		bias: `${e}.bias`,
		activation: "relu",
		padding: "same"
	};
}
function Se(e, t) {
	return {
		op: "maxPool2d",
		id: e,
		input: t,
		size: 2,
		stride: 2,
		padding: "same"
	};
}
function Ce(e, t) {
	return {
		op: "upsample2d",
		id: e,
		input: t,
		scale: 2,
		mode: "nearest"
	};
}
function we(e, t, n) {
	return {
		op: "concat",
		id: e,
		inputs: [t, n],
		axis: "channels"
	};
}
var Te = {
	schemaVersion: 1,
	id: "oidn-unet-small-v1",
	family: "oidn-unet-small",
	input: "input",
	output: "dec_conv0",
	receptiveField: 174,
	nodes: [
		D("enc_conv0", "input"),
		D("enc_conv1", "enc_conv0"),
		Se("pool1", "enc_conv1"),
		D("enc_conv2", "pool1"),
		Se("pool2", "enc_conv2"),
		D("enc_conv3", "pool2"),
		Se("pool3", "enc_conv3"),
		D("enc_conv4", "pool3"),
		Se("pool4", "enc_conv4"),
		D("enc_conv5a", "pool4"),
		D("enc_conv5b", "enc_conv5a"),
		Ce("up4", "enc_conv5b"),
		we("concat4", "up4", "pool3"),
		D("dec_conv4a", "concat4"),
		D("dec_conv4b", "dec_conv4a"),
		Ce("up3", "dec_conv4b"),
		we("concat3", "up3", "pool2"),
		D("dec_conv3a", "concat3"),
		D("dec_conv3b", "dec_conv3a"),
		Ce("up2", "dec_conv3b"),
		we("concat2", "up2", "pool1"),
		D("dec_conv2a", "concat2"),
		D("dec_conv2b", "dec_conv2a"),
		Ce("up1", "dec_conv2b"),
		we("concat1", "up1", "input"),
		D("dec_conv1a", "concat1"),
		D("dec_conv1b", "dec_conv1a"),
		D("dec_conv0", "dec_conv1b")
	]
}, Ee = {
	schemaVersion: 1,
	id: "oidn-unet-large-v1",
	family: "oidn-unet-large",
	input: "input",
	output: "dec_conv1c",
	receptiveField: 202,
	nodes: [
		D("enc_conv1a", "input"),
		D("enc_conv1b", "enc_conv1a"),
		Se("pool1", "enc_conv1b"),
		D("enc_conv2a", "pool1"),
		D("enc_conv2b", "enc_conv2a"),
		Se("pool2", "enc_conv2b"),
		D("enc_conv3a", "pool2"),
		D("enc_conv3b", "enc_conv3a"),
		Se("pool3", "enc_conv3b"),
		D("enc_conv4a", "pool3"),
		D("enc_conv4b", "enc_conv4a"),
		Se("pool4", "enc_conv4b"),
		D("enc_conv5a", "pool4"),
		D("enc_conv5b", "enc_conv5a"),
		Ce("up4", "enc_conv5b"),
		we("concat4", "up4", "pool3"),
		D("dec_conv4a", "concat4"),
		D("dec_conv4b", "dec_conv4a"),
		Ce("up3", "dec_conv4b"),
		we("concat3", "up3", "pool2"),
		D("dec_conv3a", "concat3"),
		D("dec_conv3b", "dec_conv3a"),
		Ce("up2", "dec_conv3b"),
		we("concat2", "up2", "pool1"),
		D("dec_conv2a", "concat2"),
		D("dec_conv2b", "dec_conv2a"),
		Ce("up1", "dec_conv2b"),
		we("concat1", "up1", "input"),
		D("dec_conv1a", "concat1"),
		D("dec_conv1b", "dec_conv1a"),
		D("dec_conv1c", "dec_conv1b")
	]
}, De = [Te, Ee];
function Oe(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.nodes) n.op === "conv2d" && (t.add(n.weight), t.add(n.bias));
	return t;
}
function ke(e) {
	return e.desc.getByteSize();
}
function Ae(e) {
	return [...e].sort().join(", ");
}
function je(e, t = De) {
	let n = t.filter((t) => {
		let n = Oe(t);
		return [...n].some((t) => !e.has(t)) ? !1 : t.allowAdditionalTensors === !0 || [...e.keys()].every((e) => n.has(e));
	});
	if (n.length === 1) return n[0];
	throw n.length > 1 ? Error(`Ambiguous OIDN model topology: ${n.map((e) => e.id).join(", ")}`) : Error(`Unsupported OIDN model topology. TZA tensors: ${Ae([...e.keys()])}`);
}
function Me(e, t, n) {
	let r = e.get(t);
	if (!r) throw Error(`Model ${n} is missing tensor ${t}`);
	if (r.data.byteLength !== ke(r)) throw Error(`Tensor ${t} has ${r.data.byteLength} bytes, expected ${ke(r)}`);
	return r;
}
function Ne(e, t = je(e)) {
	if (t.schemaVersion !== 1) throw Error(`Unsupported model descriptor schema ${t.schemaVersion}`);
	let n = Oe(t);
	if (!t.allowAdditionalTensors) {
		let r = [...e.keys()].filter((e) => !n.has(e));
		if (r.length > 0) throw Error(`Model ${t.id} has unexpected tensors: ${Ae(r)}`);
	}
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set([t.input]), s, c, l = (e, n) => {
		let i = r.get(e);
		if (i === void 0) throw Error(`Model ${t.id} node ${n} reads unknown or forward value ${e}`);
		return i;
	};
	for (let n of t.nodes) {
		if (o.has(n.id)) throw Error(`Model ${t.id} produces duplicate value ${n.id}`);
		if (n.op === "conv2d") {
			let o = Me(e, n.weight, t.id), u = Me(e, n.bias, t.id), d = o.desc.dims;
			if (o.desc.layout !== "oihw" || d.length !== 4) throw Error(`Tensor ${n.weight} must use OIHW layout`);
			if (d[2] !== 3 || d[3] !== 3) throw Error(`Tensor ${n.weight} must use a 3x3 kernel`);
			if (u.desc.layout !== "x" || u.desc.dims.length !== 1) throw Error(`Tensor ${n.bias} must be a one-dimensional bias`);
			if (u.desc.dims[0] !== d[0]) throw Error(`Tensor ${n.bias} has ${u.desc.dims[0]} channels, expected ${d[0]}`);
			if (o.desc.dataType !== u.desc.dataType) throw Error(`Weight and bias dtype differ for ${n.id}`);
			if (c && c !== o.desc.dataType) throw Error(`Mixed tensor dtypes are not supported by model ${t.id}`);
			c = o.desc.dataType, n.input === t.input && s === void 0 && (s = d[1], r.set(t.input, s));
			let f = l(n.input, n.id);
			if (f !== d[1]) throw Error(`Tensor ${n.weight} expects ${d[1]} input channels, but ${n.input} provides ${f}`);
			r.set(n.id, d[0]), i.set(n.id, {
				weight: o,
				bias: u,
				inputChannels: d[1],
				outputChannels: d[0],
				kernelHeight: d[2],
				kernelWidth: d[3]
			}), a.set(n.id, {
				inputChannels: d[1],
				outputChannels: d[0]
			});
		} else if (n.op === "concat") {
			if (n.inputs.length < 2) throw Error(`Concat ${n.id} requires at least two inputs`);
			let e = n.inputs.reduce((e, t) => e + l(t, n.id), 0);
			r.set(n.id, e);
		} else r.set(n.id, l(n.input, n.id));
		o.add(n.id);
	}
	if (s === void 0 || c === void 0) throw Error(`Model ${t.id} has no convolution reading its input`);
	let u = r.get(t.output);
	if (u === void 0) throw Error(`Model ${t.id} output ${t.output} is not produced`);
	if (u !== 3) throw Error(`Model ${t.id} must produce 3 channels, got ${u}`);
	return {
		spec: t,
		inputChannels: s,
		outputChannels: u,
		tensorDataType: c,
		channelsByValue: r,
		convChannels: a,
		convTensors: i
	};
}
// node_modules/oidn-webgpu/lib/graphOptimizer.js
function Pe(e) {
	return e.op === "concat" ? e.inputs : [e.input];
}
function Fe(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.nodes) for (let e of Pe(n)) {
		let r = t.get(e) ?? [];
		r.push(n), t.set(e, r);
	}
	return t;
}
function Ie(e, t, n) {
	let r = e.get(t);
	if (r !== void 0 && r.length === 1 && r[0].op === n) return r[0];
}
function Le(e, t = {}) {
	let n = e.spec, r = Fe(n), i = new Map(n.nodes.map((e) => [e.id, e])), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map(), s = 0, c = 0;
	if (t.fuseConvPool !== !1) for (let e of n.nodes) {
		if (e.op !== "conv2d" || e.activation !== "relu") continue;
		let t = Ie(r, e.id, "maxPool2d");
		t && t.op === "maxPool2d" && t.size === 2 && t.stride === 2 && (a.add(e.id), o.set(t.id, {
			op: "fusedConvReluMaxPool2d",
			id: t.id,
			input: e.input,
			conv: e,
			pool: t
		}), s++);
	}
	if (t.fuseUpsampleConcatConv !== !1) for (let t of n.nodes) {
		if (t.op !== "conv2d") continue;
		let n = i.get(t.input);
		if (n?.op !== "concat" || n.inputs.length !== 2 || Ie(r, n.id, "conv2d")?.id !== t.id) continue;
		let s = e.channelsByValue.get(n.inputs[0]);
		if (s === void 0 || s % 4 != 0) continue;
		let l = n.inputs.map((e) => {
			let t = i.get(e);
			return t?.op === "upsample2d" && t.scale === 2 && t.mode === "nearest" && Ie(r, t.id, "concat")?.id === n.id ? {
				value: t.input,
				upsample: t
			} : { value: e };
		});
		if (l.filter((e) => e.upsample).length === 1) {
			a.add(n.id);
			for (let e of n.inputs) {
				let t = i.get(e);
				t?.op === "upsample2d" && a.add(t.id);
			}
			o.set(t.id, {
				op: "fusedUpsampleConcatConv2d",
				id: t.id,
				inputs: l,
				conv: t
			}), c++;
		}
	}
	let l = [];
	for (let e of n.nodes) {
		let t = o.get(e.id);
		t ? l.push(t) : a.has(e.id) || l.push(e);
	}
	return {
		spec: n,
		nodes: l,
		fusions: {
			convPool: s,
			upsampleConcatConv: c
		}
	};
}
function Re(e) {
	return e.op === "concat" ? e.inputs : e.op === "fusedUpsampleConcatConv2d" ? e.inputs.map((e) => e.value) : [e.input];
}
function ze(e, t) {
	return e.width === t.width && e.height === t.height;
}
function Be(e, t, n, r) {
	if (!Number.isInteger(t) || t <= 0 || !Number.isInteger(n) || n <= 0) throw Error(`Invalid model input size ${t}x${n}`);
	let i = Le(e, r), a = {
		width: t,
		height: n,
		channels: e.inputChannels
	}, o = /* @__PURE__ */ new Map([[e.spec.input, a]]), s = [], c = (e, t) => {
		let n = o.get(e);
		if (!n) throw Error(`Planned node ${t} reads missing value ${e}`);
		return n;
	};
	for (let t of i.nodes) {
		let n;
		if (t.op === "conv2d") {
			let r = c(t.input, t.id);
			n = {
				width: r.width,
				height: r.height,
				channels: e.convChannels.get(t.id).outputChannels
			};
		} else if (t.op === "maxPool2d") {
			let e = c(t.input, t.id);
			n = {
				width: Math.ceil(e.width / 2),
				height: Math.ceil(e.height / 2),
				channels: e.channels
			};
		} else if (t.op === "upsample2d") {
			let e = c(t.input, t.id);
			n = {
				width: e.width * 2,
				height: e.height * 2,
				channels: e.channels
			};
		} else if (t.op === "concat") {
			let e = t.inputs.map((e) => c(e, t.id));
			if (e.some((t) => !ze(t, e[0]))) throw Error(`Concat ${t.id} has mismatched spatial shapes`);
			n = {
				width: e[0].width,
				height: e[0].height,
				channels: e.reduce((e, t) => e + t.channels, 0)
			};
		} else if (t.op === "fusedConvReluMaxPool2d") {
			let r = c(t.input, t.id);
			n = {
				width: Math.ceil(r.width / 2),
				height: Math.ceil(r.height / 2),
				channels: e.convChannels.get(t.conv.id).outputChannels
			};
		} else {
			let r = t.inputs.map((e) => {
				let n = c(e.value, t.id);
				return e.upsample ? {
					...n,
					width: n.width * 2,
					height: n.height * 2
				} : n;
			});
			if (r.some((e) => !ze(e, r[0]))) throw Error(`Fused decoder ${t.id} has mismatched spatial shapes`);
			n = {
				width: r[0].width,
				height: r[0].height,
				channels: e.convChannels.get(t.conv.id).outputChannels
			};
		}
		o.set(t.id, n), s.push(n);
	}
	let l = /* @__PURE__ */ new Map();
	i.nodes.forEach((e, t) => {
		for (let n of Re(e)) l.set(n, t);
	}), l.set(e.spec.output, i.nodes.length);
	let u = i.nodes.map((e, t) => ({
		node: e,
		outputShape: s[t],
		lastUse: l.get(e.id) ?? t
	}));
	return {
		...i,
		inputShape: a,
		valueShapes: o,
		plannedNodes: u
	};
}
// node_modules/oidn-webgpu/lib/gpuTypes.js
var O = {
	MAP_READ: 1,
	MAP_WRITE: 2,
	COPY_SRC: 4,
	COPY_DST: 8,
	INDEX: 16,
	VERTEX: 32,
	UNIFORM: 64,
	STORAGE: 128,
	INDIRECT: 256,
	QUERY_RESOLVE: 512
}, Ve = {
	READ: 1,
	WRITE: 2
}, He = 8, Ue = 10, We = 9;
function Ge(e, t, n = !1) {
	let r = e === "fp16" ? 2 : 4;
	return (100 * t + (n ? We * t * 4 : 0)) * 4 * r;
}
function Ke(e) {
	return e === "fp16" ? "vec4<f16>" : "vec4<f32>";
}
function qe(e) {
	return e === "fp16" ? "enable f16;\n" : "";
}
function Je(e, t, n) {
	let r = (e) => `${n}[weightBase + ${e}u]`;
	return e === "fp16" ? `
        let inputValue = vec4<f16>(${t});
        var partial = vec4<f16>(0.0h);
        partial = fma(${r(0)}, vec4<f16>(inputValue.x), partial);
        partial = fma(${r(1)}, vec4<f16>(inputValue.y), partial);
        partial = fma(${r(2)}, vec4<f16>(inputValue.z), partial);
        partial = fma(${r(3)}, vec4<f16>(inputValue.w), partial);
        acc += vec4<f32>(partial);
` : `
        let inputValue = vec4<f32>(${t});
        acc = fma(vec4<f32>(${r(0)}), vec4<f32>(inputValue.x), acc);
        acc = fma(vec4<f32>(${r(1)}), vec4<f32>(inputValue.y), acc);
        acc = fma(vec4<f32>(${r(2)}), vec4<f32>(inputValue.z), acc);
        acc = fma(vec4<f32>(${r(3)}), vec4<f32>(inputValue.w), acc);
`;
}
function Ye(e, t, n, r = !1) {
	if (!Number.isInteger(n) || n < 1) throw Error(`Final RGB shader requires positive input blocks, got ${n}`);
	let i = Ke(e), a = 100 * n, o = We * n * 4, s = t === "relu" ? "max(acc, vec4<f32>(0.0))" : "acc", c = Je(e, "inputTile[patchBase + inputBlock]", r ? "weightTile" : "weights");
	return `${qe(e)}
struct Params {
  inputWidth: u32,
  inputHeight: u32,
  outputWidth: u32,
  outputHeight: u32,
  inputBlocks: u32,
  outputBlocks: u32,
}

@group(0) @binding(0) var<storage, read> inputData: array<${i}>;
@group(0) @binding(1) var<storage, read> weights: array<${i}>;
@group(0) @binding(2) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> outputData: array<vec4<f32>>;
@group(0) @binding(4) var<uniform> params: Params;

var<workgroup> inputTile: array<${i}, ${a}>;
${r ? `var<workgroup> weightTile: array<${i}, ${o}>;` : ""}

@compute @workgroup_size(${He}, ${He}, 1)
fn main(
  @builtin(local_invocation_id) localId: vec3<u32>,
  @builtin(global_invocation_id) gid: vec3<u32>,
  @builtin(workgroup_id) workgroupId: vec3<u32>
) {
  let localLinear = localId.y * ${He}u + localId.x;
  for (
    var loadIndex = localLinear;
    loadIndex < ${a}u;
    loadIndex += 64u
  ) {
    let tilePixel = loadIndex / ${n}u;
    let inputBlock = loadIndex % ${n}u;
    let tileX = tilePixel % ${Ue}u;
    let tileY = tilePixel / ${Ue}u;
    let inputX = i32(workgroupId.x * ${He}u + tileX) - 1;
    let inputY = i32(workgroupId.y * ${He}u + tileY) - 1;
    var value = ${i}(0.0);
    if (
      inputX >= 0 && inputX < i32(params.inputWidth) &&
      inputY >= 0 && inputY < i32(params.inputHeight)
    ) {
      let inputIndex =
        (u32(inputY) * params.inputWidth + u32(inputX)) *
        ${n}u + inputBlock;
      value = inputData[inputIndex];
    }
    inputTile[loadIndex] = value;
  }

${r ? `  for (
    var loadIndex = localLinear;
    loadIndex < ${o}u;
    loadIndex += 64u
  ) {
    weightTile[loadIndex] = weights[loadIndex];
  }

` : ""}  // Out-of-range invocations must reach this barrier before returning.
  workgroupBarrier();

  let outputInBounds =
    gid.x < params.outputWidth &&
    gid.y < params.outputHeight &&
    gid.z < params.outputBlocks;
  if (!outputInBounds) {
    return;
  }

  var acc = bias[gid.z];
  for (var ky = 0u; ky < 3u; ky++) {
    let inputY = i32(gid.y) + i32(ky) - 1;
    if (inputY < 0 || inputY >= i32(params.inputHeight)) {
      continue;
    }
    for (var kx = 0u; kx < 3u; kx++) {
      let inputX = i32(gid.x) + i32(kx) - 1;
      if (inputX < 0 || inputX >= i32(params.inputWidth)) {
        continue;
      }
      let patchBase =
        ((localId.y + ky) * ${Ue}u + localId.x + kx) *
        ${n}u;
      for (var inputBlock = 0u; inputBlock < ${n}u; inputBlock++) {
        let weightBase =
          ((ky * 3u + kx) * ${n}u + inputBlock) * 4u;
        ${c}
      }
    }
  }

  let outputIndex =
    (gid.y * params.outputWidth + gid.x) * 1u + gid.z;
  outputData[outputIndex] = ${s};
}
`;
}
// node_modules/oidn-webgpu/lib/resourceTracker.js
var Xe = class {
	_stats = /* @__PURE__ */ new Map();
	track(e, t) {
		let n = this._stats.get(e);
		return n || (n = {
			created: 0,
			destroyed: 0,
			live: 0,
			peakLive: 0,
			resources: /* @__PURE__ */ new Set()
		}, this._stats.set(e, n)), n.resources.has(t) || (n.resources.add(t), n.created++, n.live++, n.peakLive = Math.max(n.peakLive, n.live)), t;
	}
	release(e, t, n) {
		if (!t) return !1;
		let r = this._stats.get(e);
		if (!r?.resources.delete(t)) return !1;
		try {
			n();
		} finally {
			r.destroyed++, r.live--;
		}
		return !0;
	}
	snapshot(e = 0) {
		let t = 0, n = 0, r = 0, i = 0, a = {};
		for (let [e, o] of this._stats) {
			let s = {
				created: o.created,
				destroyed: o.destroyed,
				live: o.live,
				peakLive: o.peakLive
			};
			a[e] = s, t += s.live, n += s.created, r += s.destroyed, i += s.peakLive;
		}
		return {
			live: t,
			created: n,
			destroyed: r,
			peakLive: i,
			pending: e,
			byKind: a
		};
	}
}, Ze = /* @__PURE__ */ new WeakMap();
function Qe(e) {
	let t = Ze.get(e);
	return t || (t = /* @__PURE__ */ new Map(), Ze.set(e, t)), t;
}
var k = 8, $e = 8, A = 8, et = 10;
function j(e) {
	let [t, n] = e.workgroupSize;
	return {
		workgroupX: t,
		workgroupY: n,
		rowsPerThread: e.rowsPerThread,
		tileM: n * e.rowsPerThread,
		tileNBlocks: t,
		tileKBlocks: $e
	};
}
function M(e) {
	let t = j(e), n = e.sharedLayout === "padded" || e.sharedLayout === "padded-input", r = e.sharedLayout === "padded" || e.sharedLayout === "padded-weights";
	return {
		input: t.tileM * t.tileKBlocks + (n ? t.workgroupY : 0),
		weights: t.tileKBlocks * t.tileNBlocks * (r ? 5 : 4)
	};
}
function tt(e, t) {
	return t.sharedLayout === "padded" || t.sharedLayout === "padded-input" ? `(${e}) + (${e}) / ${t.rowsPerThread * $e}u` : e;
}
function nt(e, t) {
	return t.sharedLayout === "padded" || t.sharedLayout === "padded-weights" ? `(${e}) + (${e}) / 4u` : e;
}
function rt(e, t) {
	return Math.ceil(e / t) * t;
}
function N(e) {
	return Math.ceil(e / 4);
}
function it(e, t) {
	return e.width * e.height * N(e.channels) * 4 * t;
}
var at;
function ot(e) {
	let t = e & 32768 ? -1 : 1, n = e >>> 10 & 31, r = e & 1023;
	return n === 0 ? t * r * 2 ** -24 : n === 31 ? r === 0 ? t * Infinity : NaN : t * (1 + r / 1024) * 2 ** (n - 15);
}
var st = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(4));
function ct(e) {
	st.setFloat32(0, e);
	let t = st.getUint32(0), n = t >>> 16 & 32768, r = t >>> 23 & 255, i = t & 8388607;
	if (r === 255) return n | 31744 | (i ? 512 : 0);
	let a = r - 127 + 15;
	if (a >= 31) return n | 31744;
	if (a <= 0) {
		if (a < -10) return n;
		let e = i | 8388608, t = 14 - a, r = e >>> t, o = e & (1 << t) - 1, s = 1 << t - 1;
		return n | (o > s || o === s && r & 1 ? r + 1 : r);
	}
	let o = a << 10 | i >>> 13, s = i & 8191;
	return n | (s > 4096 || s === 4096 && o & 1 ? o + 1 : o);
}
function lt() {
	if (!at) {
		at = /* @__PURE__ */ new Float32Array(65536);
		for (let e = 0; e < at.length; e++) at[e] = ot(e);
	}
	return at;
}
function ut(e) {
	if (e.desc.dataType === "Float32") return new Float32Array(e.data.buffer, e.data.byteOffset, e.data.byteLength / 4);
	let t = new Uint16Array(e.data.buffer, e.data.byteOffset, e.data.byteLength / 2), n = new Float32Array(t.length);
	if (t.length < 4096) for (let e = 0; e < t.length; e++) n[e] = ot(t[e]);
	else {
		let e = lt();
		for (let r = 0; r < t.length; r++) n[r] = e[t[r]];
	}
	return n;
}
function dt(e, t, n, r) {
	let i = rt(n.byteLength, 4), a = e.createBuffer({
		label: t,
		size: i,
		usage: r,
		mappedAtCreation: !0
	});
	return new Uint8Array(a.getMappedRange()).set(n), a.unmap(), a;
}
function ft(e, t, n) {
	let r = new Uint32Array(rt(n.length, 4));
	return r.set(n), dt(e, t, new Uint8Array(r.buffer, r.byteOffset, r.byteLength), O.UNIFORM);
}
function pt(e, t, n, r, i) {
	let a = N(n.inputChannels), o = N(n.outputChannels), s = o * n.kernelHeight * n.kernelWidth * a * 4 * 4, c = r === "fp16" && n.weight.desc.dataType === "Float16", l = r === "fp16" ? new Uint16Array(s) : void 0, u = l ? void 0 : new Float32Array(s), d = c ? new Uint16Array(n.weight.data.buffer, n.weight.data.byteOffset, n.weight.data.byteLength / 2) : void 0, f = d ? void 0 : ut(n.weight);
	for (let e = 0; e < o; e++) for (let t = 0; t < n.kernelHeight; t++) for (let r = 0; r < n.kernelWidth; r++) for (let s = 0; s < a; s++) for (let c = 0; c < 4; c++) {
		let p = e * 4 + c;
		for (let m = 0; m < 4; m++) {
			let h = s * 4 + m, g = (i === "k-major" ? (((t * n.kernelWidth + r) * a + s) * o + e) * 16 : (((e * n.kernelHeight + t) * n.kernelWidth + r) * a + s) * 16) + m * 4 + c;
			if (p < n.outputChannels && h < n.inputChannels) {
				let e = ((p * n.inputChannels + h) * n.kernelHeight + t) * n.kernelWidth + r;
				l ? l[g] = d ? d[e] : ct(f[e]) : u[g] = f[e];
			}
		}
	}
	let p = new Float32Array(o * 4);
	p.set(ut(n.bias));
	let m = dt(e, `oidn/${t}/weights/${r}/${i}`, l ? new Uint8Array(l.buffer) : new Uint8Array(u.buffer), O.STORAGE);
	try {
		return {
			weights: m,
			weightLayout: i,
			bias: dt(e, `oidn/${t}/bias`, new Uint8Array(p.buffer), O.STORAGE)
		};
	} catch (e) {
		throw m.destroy(), e;
	}
}
function P(e) {
	return e === "fp16" ? "vec4<f16>" : "vec4<f32>";
}
function F(e) {
	return e === "fp16" ? "enable f16;\n" : "";
}
function I(e, t) {
	return t === "fp16" ? `vec4<f16>(${e})` : e;
}
function L(e, t) {
	return t === "relu" ? `max(${e}, vec4<f32>(0.0))` : e;
}
function mt(e, t, n) {
	return n === "fp32" ? `
let inputValue = vec4<f32>(${e});
let weightBase = ${t};
acc = fma(vec4<f32>(weights[weightBase]), vec4<f32>(inputValue.x), acc);
acc = fma(vec4<f32>(weights[weightBase + 1u]), vec4<f32>(inputValue.y), acc);
acc = fma(vec4<f32>(weights[weightBase + 2u]), vec4<f32>(inputValue.z), acc);
acc = fma(vec4<f32>(weights[weightBase + 3u]), vec4<f32>(inputValue.w), acc);
` : `
let inputValue = vec4<f16>(${e});
let weightBase = ${t};
var partial = vec4<f16>(0.0h);
partial = fma(weights[weightBase], vec4<f16>(inputValue.x), partial);
partial = fma(weights[weightBase + 1u], vec4<f16>(inputValue.y), partial);
partial = fma(weights[weightBase + 2u], vec4<f16>(inputValue.z), partial);
partial = fma(weights[weightBase + 3u], vec4<f16>(inputValue.w), partial);
acc += vec4<f32>(partial);
`;
}
function ht(e, t, n) {
	let r = n === "fp16" ? "vec4<f16>" : "vec4<f32>";
	return `
let inputValue = ${r}(${e});
let weightBase = ${t};
${n === "fp16" ? `var partial = vec4<f16>(0.0h);
partial = fma(subgroupBroadcast(weights[weightBase], 0u), ${r}(inputValue.x), partial);
partial = fma(subgroupBroadcast(weights[weightBase + 1u], 0u), ${r}(inputValue.y), partial);
partial = fma(subgroupBroadcast(weights[weightBase + 2u], 0u), ${r}(inputValue.z), partial);
partial = fma(subgroupBroadcast(weights[weightBase + 3u], 0u), ${r}(inputValue.w), partial);
acc += vec4<f32>(partial);` : "acc = fma(subgroupBroadcast(weights[weightBase], 0u), vec4<f32>(inputValue.x), acc);\nacc = fma(subgroupBroadcast(weights[weightBase + 1u], 0u), vec4<f32>(inputValue.y), acc);\nacc = fma(subgroupBroadcast(weights[weightBase + 2u], 0u), vec4<f32>(inputValue.z), acc);\nacc = fma(subgroupBroadcast(weights[weightBase + 3u], 0u), vec4<f32>(inputValue.w), acc);"}
`;
}
function gt(e, t, n) {
	return e === "fp16" && (t.loadMode === "packed-all" || n && t.loadMode === "packed-weights");
}
function _t(e, t) {
	return t ? `bitcast<vec4<f16>>(${e})` : e;
}
function vt(e, t) {
	let { rowsPerThread: n, tileNBlocks: r, tileKBlocks: i } = j(t);
	if (!t.unrollRows || t.accumulationOrder === "row-major") return yt(e, t);
	let a = `(tileK * ${r}u + localId.x) * ${t.sharedLayout === "padded" || t.sharedLayout === "padded-weights" ? 5 : 4}u`, o = Array.from({ length: n }, (e, t) => t), s = P(e);
	return `
    ${e === "fp16" ? o.map((e) => `var partial${e} = vec4<f16>(0.0h);`).join("\n    ") : ""}
    for (var tileK = 0u; tileK < ${i}u; tileK++) {
      let weightBase = ${a};
      let w0 = weightTile[weightBase];
      let w1 = weightTile[weightBase + 1u];
      let w2 = weightTile[weightBase + 2u];
      let w3 = weightTile[weightBase + 3u];
      ${o.map((r) => {
		let a = tt(`(localId.y * ${n}u + ${r}u) * ${i}u + tileK`, t), o = e === "fp16" ? `partial${r}` : `acc[${r}]`;
		return `let v${r} = inputTile[${a}];\n      ` + [
			"x",
			"y",
			"z",
			"w"
		].map((e, t) => `${o} = fma(w${t}, ${s}(v${r}.${e}), ${o});`).join("\n      ");
	}).join("\n      ")}
    }
    ${e === "fp16" ? o.map((e) => `acc[${e}] += vec4<f32>(partial${e});`).join("\n    ") : ""}
`;
}
function yt(e, t) {
	let { rowsPerThread: n, tileNBlocks: r, tileKBlocks: i } = j(t), a = tt(`tileSpatial * ${i}u + tileK`, t), o = `(tileK * ${r}u + localId.x) * ${t.sharedLayout === "padded" || t.sharedLayout === "padded-weights" ? 5 : 4}u`;
	if (t.accumulationOrder === "row-major") {
		let t = P(e), r = e === "fp16" ? "partial" : "acc[row]";
		return `
    for (var row = 0u; row < ${n}u; row++) {
      ${e === "fp16" ? "var partial = vec4<f16>(0.0h);" : ""}
      let tileSpatial = localId.y * ${n}u + row;
      for (var tileK = 0u; tileK < ${i}u; tileK++) {
        let weightBase = ${o};
        let inputValue = inputTile[${a}];
        ${r} = fma(weightTile[weightBase], ${t}(inputValue.x), ${r});
        ${r} = fma(weightTile[weightBase + 1u], ${t}(inputValue.y), ${r});
        ${r} = fma(weightTile[weightBase + 2u], ${t}(inputValue.z), ${r});
        ${r} = fma(weightTile[weightBase + 3u], ${t}(inputValue.w), ${r});
      }
      ${e === "fp16" ? "acc[row] += vec4<f32>(partial);" : ""}
    }
`;
	}
	return e === "fp16" ? `
    var partial: array<vec4<f16>, ${n}>;
    for (var row = 0u; row < ${n}u; row++) {
      partial[row] = vec4<f16>(0.0h);
    }
    for (var tileK = 0u; tileK < ${i}u; tileK++) {
      let weightBase =
        ${o};
      for (var row = 0u; row < ${n}u; row++) {
        let tileSpatial =
          localId.y * ${n}u + row;
        let inputValue =
          inputTile[${a}];
        partial[row] = fma(
          weightTile[weightBase],
          vec4<f16>(inputValue.x),
          partial[row]
        );
        partial[row] = fma(
          weightTile[weightBase + 1u],
          vec4<f16>(inputValue.y),
          partial[row]
        );
        partial[row] = fma(
          weightTile[weightBase + 2u],
          vec4<f16>(inputValue.z),
          partial[row]
        );
        partial[row] = fma(
          weightTile[weightBase + 3u],
          vec4<f16>(inputValue.w),
          partial[row]
        );
      }
    }
    for (var row = 0u; row < ${n}u; row++) {
      acc[row] += vec4<f32>(partial[row]);
    }
` : `
    for (var tileK = 0u; tileK < ${i}u; tileK++) {
      let weightBase =
        ${o};
      for (var row = 0u; row < ${n}u; row++) {
        let tileSpatial =
          localId.y * ${n}u + row;
        let inputValue =
          inputTile[${a}];
        acc[row] = fma(
          weightTile[weightBase],
          vec4<f32>(inputValue.x),
          acc[row]
        );
        acc[row] = fma(
          weightTile[weightBase + 1u],
          vec4<f32>(inputValue.y),
          acc[row]
        );
        acc[row] = fma(
          weightTile[weightBase + 2u],
          vec4<f32>(inputValue.z),
          acc[row]
        );
        acc[row] = fma(
          weightTile[weightBase + 3u],
          vec4<f32>(inputValue.w),
          acc[row]
        );
      }
    }
`;
}
function bt(e, t, n, r, i) {
	let a = P(e), o = P(e), s = P(t), c = I(L("acc", n), t);
	return `${F(e)}
struct Params {
  inputWidth: u32,
  inputHeight: u32,
  outputWidth: u32,
  outputHeight: u32,
  inputBlocks: u32,
  outputBlocks: u32,
}

@group(0) @binding(0) var<storage, read> inputData: array<${a}>;
@group(0) @binding(1) var<storage, read> weights: array<${o}>;
@group(0) @binding(2) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> outputData: array<${s}>;
@group(0) @binding(4) var<uniform> params: Params;

@compute @workgroup_size(${k}, ${k}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= params.outputWidth || gid.y >= params.outputHeight || gid.z >= ${i}u) {
    return;
  }
  var acc = bias[gid.z];
  for (var ky = 0u; ky < 3u; ky++) {
    let inputY = i32(gid.y) + i32(ky) - 1;
    if (inputY < 0 || inputY >= i32(params.inputHeight)) { continue; }
    for (var kx = 0u; kx < 3u; kx++) {
      let inputX = i32(gid.x) + i32(kx) - 1;
      if (inputX < 0 || inputX >= i32(params.inputWidth)) { continue; }
      let pixelBase = (u32(inputY) * params.inputWidth + u32(inputX)) * ${r}u;
      for (var inputBlock = 0u; inputBlock < ${r}u; inputBlock++) {
        ${mt("inputData[pixelBase + inputBlock]", `((((gid.z * 3u + ky) * 3u + kx) * ${r}u + inputBlock) * 4u)`, e)}
      }
    }
  }
  let outputIndex = (gid.y * params.outputWidth + gid.x) * ${i}u + gid.z;
  outputData[outputIndex] = ${c};
}
`;
}
function xt(e, t, n, r, i) {
	let a = P(e), o = P(e), s = P(t), c = I(L("acc", n), t);
	return `${F(e)}
enable subgroups;
struct Params {
  inputWidth: u32,
  inputHeight: u32,
  outputWidth: u32,
  outputHeight: u32,
  inputBlocks: u32,
  outputBlocks: u32,
}
@group(0) @binding(0) var<storage, read> inputData: array<${a}>;
@group(0) @binding(1) var<storage, read> weights: array<${o}>;
@group(0) @binding(2) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> outputData: array<${s}>;
@group(0) @binding(4) var<uniform> params: Params;

@compute @workgroup_size(${k}, ${k}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let outputInBounds =
    gid.x < params.outputWidth && gid.y < params.outputHeight;
  var acc = bias[gid.z];
  for (var ky = 0u; ky < 3u; ky++) {
    let inputY = i32(gid.y) + i32(ky) - 1;
    let clampedY = u32(clamp(inputY, 0, i32(params.inputHeight) - 1));
    for (var kx = 0u; kx < 3u; kx++) {
      let inputX = i32(gid.x) + i32(kx) - 1;
      let clampedX = u32(clamp(inputX, 0, i32(params.inputWidth) - 1));
      let inputInBounds =
        outputInBounds && inputX >= 0 && inputY >= 0 &&
        inputX < i32(params.inputWidth) && inputY < i32(params.inputHeight);
      let pixelBase =
        (clampedY * params.inputWidth + clampedX) * ${r}u;
      for (var inputBlock = 0u; inputBlock < ${r}u; inputBlock++) {
        ${ht(`select(${a}(0.0), inputData[pixelBase + inputBlock], inputInBounds)`, `((((gid.z * 3u + ky) * 3u + kx) * ${r}u + inputBlock) * 4u)`, e)}
      }
    }
  }
  if (outputInBounds) {
    let outputIndex =
      (gid.y * params.outputWidth + gid.x) * ${i}u + gid.z;
    outputData[outputIndex] = ${c};
  }
}
`;
}
function St(e, t, n, r, i) {
	let a = P(e), o = P(t), s = I(L("acc", n), t), c = 100 * r;
	return `${F(e)}
struct Params {
  inputWidth: u32,
  inputHeight: u32,
  outputWidth: u32,
  outputHeight: u32,
  inputBlocks: u32,
  outputBlocks: u32,
}
@group(0) @binding(0) var<storage, read> inputData: array<${a}>;
@group(0) @binding(1) var<storage, read> weights: array<${a}>;
@group(0) @binding(2) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> outputData: array<${o}>;
@group(0) @binding(4) var<uniform> params: Params;

var<workgroup> inputPatch: array<${a}, ${c}>;

@compute @workgroup_size(${A}, ${A}, 1)
fn main(
  @builtin(local_invocation_id) localId: vec3<u32>,
  @builtin(workgroup_id) workgroupId: vec3<u32>
) {
  let localLinear =
    localId.y * ${A}u + localId.x;
  for (
    var loadIndex = localLinear;
    loadIndex < ${c}u;
    loadIndex += 64u
  ) {
    let patchPixel = loadIndex / ${r}u;
    let inputBlock = loadIndex % ${r}u;
    let patchX = patchPixel % ${et}u;
    let patchY = patchPixel / ${et}u;
    let inputX =
      i32(workgroupId.x * ${A}u + patchX) - 1;
    let inputY =
      i32(workgroupId.y * ${A}u + patchY) - 1;
    var value = ${a}(0.0);
    if (
      inputX >= 0 && inputX < i32(params.inputWidth) &&
      inputY >= 0 && inputY < i32(params.inputHeight)
    ) {
      let inputIndex =
        (u32(inputY) * params.inputWidth + u32(inputX)) *
        ${r}u + inputBlock;
      value = inputData[inputIndex];
    }
    inputPatch[loadIndex] = value;
  }
  workgroupBarrier();

  let outputX =
    workgroupId.x * ${A}u + localId.x;
  let outputY =
    workgroupId.y * ${A}u + localId.y;
  let outputBlock = workgroupId.z;
  if (
    outputX >= params.outputWidth || outputY >= params.outputHeight ||
    outputBlock >= ${i}u
  ) {
    return;
  }

  var acc = bias[outputBlock];
  for (var ky = 0u; ky < 3u; ky++) {
    for (var kx = 0u; kx < 3u; kx++) {
      let patchBase =
        ((localId.y + ky) * ${et}u + localId.x + kx) *
        ${r}u;
      for (var inputBlock = 0u; inputBlock < ${r}u; inputBlock++) {
        ${mt("inputPatch[patchBase + inputBlock]", `((((outputBlock * 3u + ky) * 3u + kx) * ${r}u + inputBlock) * 4u)`, e)}
      }
    }
  }
  let outputIndex =
    (outputY * params.outputWidth + outputX) * ${i}u + outputBlock;
  outputData[outputIndex] = ${s};
}
`;
}
function Ct(e, t, n, r) {
	let { workgroupX: i, workgroupY: a, tileM: o, tileKBlocks: s } = j(n), c = t ? "params.outputWidth" : "params.inputWidth", l = t ? "params.outputHeight" : "params.inputHeight", u = n.addressMode === "base-offset", d = r ? r.blocks.map((e, t) => `cachedBase${t}[load] = (${t === r.upsampled ? "y / 2u" : "y"} * params.source${t}Width + ${t === r.upsampled ? "x / 2u" : "x"}) * ${e}u;`).join("\n    ") : `cachedBase0[load] = (y * params.inputWidth + x) * ${e}u;`, f = o * s / (i * a);
	return `
  ${u ? `var cachedBase0: array<u32, ${f}>;
  ${r ? `var cachedBase1: array<u32, ${f}>;` : ""}` : `var cachedX: array<u32, ${f}>;
  var cachedY: array<u32, ${f}>;`}
  var cachedMask: array<u32, ${f}>;
  for (var load = 0u; load < ${f}u; load++) {
    let loadIndex = localLinear + load * ${i * a}u;
    let spatial = workgroupId.x * ${o}u + loadIndex / ${s}u;
    let x = spatial % params.outputWidth;
    let y = spatial / params.outputWidth;
    ${u ? d : "cachedX[load] = x;\n    cachedY[load] = y;"}
    let columns =
      select(0u, 0x049u, x > 0u && x - 1u < ${c}) |
      select(0u, 0x092u, x < ${c}) |
      select(0u, 0x124u, x + 1u < ${c});
    let rows =
      select(0u, 0x007u, y > 0u && y - 1u < ${l}) |
      select(0u, 0x038u, y < ${l}) |
      select(0u, 0x1c0u, y + 1u < ${l});
    cachedMask[load] = select(0u, columns & rows, spatial < spatialCount)${u && r ? " | ((x & 1u) << 9u) | ((y & 1u) << 10u)" : ""};
  }
  var channelBlock = (localLinear % ${s}u) % ${e}u;
  var filterPosition = (localLinear % ${s}u) / ${e}u;
`;
}
function wt(e, t) {
	let { tileKBlocks: n } = j(t);
	return `
    channelBlock += ${n % e}u;
    let carry = channelBlock >= ${e}u;
    channelBlock -= select(0u, ${e}u, carry);
    filterPosition += ${Math.floor(n / e)}u + select(0u, 1u, carry);
`;
}
function Tt(e, t, n) {
	let { workgroupX: r, workgroupY: i, tileM: a, tileKBlocks: o } = j(n);
	return `
    let inputBlock = channelBlock;
    let kernelY = filterPosition / 3u;
    let kernelX = filterPosition % 3u;
    for (var load = 0u; load < ${a * o / (r * i)}u; load++) {
      let loadIndex = localLinear + load * ${r * i}u;
      var value = ${e}(0.0);
      if (filterPosition < 9u && (cachedMask[load] & (1u << filterPosition)) != 0u) {
        ${n.addressMode === "base-offset" ? "" : "let inputX = i32(cachedX[load]) + i32(kernelX) - 1;\n        let inputY = i32(cachedY[load]) + i32(kernelY) - 1;"}
        ${t}
      }
      inputTile[${tt("loadIndex", n)}] = value;
    }
`;
}
function Et(e, t, n, r, i, a) {
	let { workgroupX: o, workgroupY: s, rowsPerThread: c, tileM: l, tileNBlocks: u, tileKBlocks: d } = j(a), { addressMode: f, weightLayout: p } = a, m = P(e), h = P(t), g = gt(e, a, !1), _ = gt(e, a, !0), v = g ? "vec2<u32>" : m, y = _ ? "vec2<u32>" : m, b = I(L("acc", n), t), x = o * s, S = l * d, C = d * u * 4;
	return `${F(e)}
struct Params {
  inputWidth: u32,
  inputHeight: u32,
  outputWidth: u32,
  outputHeight: u32,
  inputBlocks: u32,
  outputBlocks: u32,
}
@group(0) @binding(0) var<storage, read> inputData: array<${v}>;
@group(0) @binding(1) var<storage, read> weights: array<${y}>;
@group(0) @binding(2) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> outputData: array<${h}>;
@group(0) @binding(4) var<uniform> params: Params;

var<workgroup> inputTile: array<${m}, ${M(a).input}>;
var<workgroup> weightTile: array<${m}, ${M(a).weights}>;

@compute @workgroup_size(${o}, ${s}, 1)
fn main(
  @builtin(local_invocation_id) localId: vec3<u32>,
  @builtin(workgroup_id) workgroupId: vec3<u32>
) {
  let spatialBase =
    workgroupId.x * ${l}u +
    localId.y * ${c}u;
  let outputBlock =
    workgroupId.y * ${u}u + localId.x;
  let spatialCount = params.outputWidth * params.outputHeight;
  var acc: array<vec4<f32>, ${c}>;
  if (outputBlock < ${i}u) {
    for (var row = 0u; row < ${c}u; row++) {
      acc[row] = bias[outputBlock];
    }
  }

  let localLinear =
    localId.y * ${o}u + localId.x;
  ${f === "analytic" ? "" : Ct(r, !1, a)}
  let totalK = ${r * 9}u;
  for (var kBase = 0u; kBase < totalK; kBase += ${d}u) {
    ${f === "analytic" ? `
    for (
      var loadIndex = localLinear;
      loadIndex < ${S}u;
      loadIndex += ${x}u
    ) {
      let tileSpatial = loadIndex / ${d}u;
      let tileK = loadIndex % ${d}u;
      let inputSpatialIndex =
        workgroupId.x * ${l}u + tileSpatial;
      let kIndex = kBase + tileK;
      var value = ${m}(0.0);
      if (inputSpatialIndex < spatialCount && kIndex < totalK) {
        let outputY = inputSpatialIndex / params.outputWidth;
        let outputX = inputSpatialIndex % params.outputWidth;
        let inputBlock = kIndex % ${r}u;
        let kernelIndex = kIndex / ${r}u;
        let kernelY = kernelIndex / 3u;
        let kernelX = kernelIndex % 3u;
        let inputY = i32(outputY) + i32(kernelY) - 1;
        let inputX = i32(outputX) + i32(kernelX) - 1;
        if (
          inputY >= 0 && inputY < i32(params.inputHeight) &&
          inputX >= 0 && inputX < i32(params.inputWidth)
        ) {
          let inputIndex =
            (u32(inputY) * params.inputWidth + u32(inputX)) *
            ${r}u + inputBlock;
          value = ${_t("inputData[inputIndex]", g)};
        }
      }
      inputTile[${tt("loadIndex", a)}] = value;
    }
    ` : Tt(m, `
        ${f === "base-offset" ? `let offset = (i32(kernelY) - 1) * i32(params.inputWidth) + i32(kernelX) - 1;
        let inputIndex = cachedBase0[load] + u32(offset * ${r}) + inputBlock;` : `let inputIndex = (u32(inputY) * params.inputWidth + u32(inputX)) *
          ${r}u + inputBlock;`}
        value = ${_t("inputData[inputIndex]", g)};
    `, a)}

    for (
      var loadIndex = localLinear;
      loadIndex < ${C}u;
      loadIndex += ${x}u
    ) {
      let tileK = loadIndex / ${u * 4}u;
      let outputRemainder = loadIndex % ${u * 4}u;
      let tileOutputBlock = outputRemainder / 4u;
      let outputLane = outputRemainder % 4u;
      let loadedOutputBlock =
        workgroupId.y * ${u}u + tileOutputBlock;
      let kIndex = kBase + tileK;
      var value = ${m}(0.0);
      if (loadedOutputBlock < ${i}u && kIndex < totalK) {
        ${p === "k-major" ? `
        let weightIndex = (kIndex * ${i}u + loadedOutputBlock) * 4u + outputLane;
        ` : f === "analytic" ? `
        let inputBlock = kIndex % ${r}u;
        let kernelIndex = kIndex / ${r}u;
        let kernelY = kernelIndex / 3u;
        let kernelX = kernelIndex % 3u;
        let weightIndex =
          ((((loadedOutputBlock * 3u + kernelY) * 3u + kernelX) *
            ${r}u + inputBlock) * 4u + outputLane);
        ` : `
        let weightIndex = (loadedOutputBlock * ${r * 9}u + kIndex) * 4u + outputLane;
        `}
        value = ${_t("weights[weightIndex]", _)};
      }
      weightTile[${nt("loadIndex", a)}] = value;
    }

    workgroupBarrier();
    ${vt(e, a)}
    workgroupBarrier();
    ${f === "analytic" ? "" : wt(r, a)}
  }

  if (outputBlock < ${i}u) {
    for (var row = 0u; row < ${c}u; row++) {
      let spatialIndex = spatialBase + row;
      if (spatialIndex < spatialCount) {
        let outputIndex = spatialIndex * ${i}u + outputBlock;
        outputData[outputIndex] = ${b.replaceAll("acc", "acc[row]")};
      }
    }
  }
}
`;
}
function Dt(e, t, n, r) {
	let i = P(e), a = L("acc", t);
	return `${F(e)}
struct Params {
  inputWidth: u32,
  inputHeight: u32,
  outputWidth: u32,
  outputHeight: u32,
  inputBlocks: u32,
  outputBlocks: u32,
}
@group(0) @binding(0) var<storage, read> inputData: array<${i}>;
@group(0) @binding(1) var<storage, read> weights: array<${i}>;
@group(0) @binding(2) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> outputData: array<${i}>;
@group(0) @binding(4) var<uniform> params: Params;

@compute @workgroup_size(${k}, ${k}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= params.outputWidth || gid.y >= params.outputHeight || gid.z >= ${r}u) {
    return;
  }
  var pooled = vec4<f32>(-3.402823466e+38);
  for (var py = 0u; py < 2u; py++) {
    let centerY = gid.y * 2u + py;
    if (centerY >= params.inputHeight) { continue; }
    for (var px = 0u; px < 2u; px++) {
      let centerX = gid.x * 2u + px;
      if (centerX >= params.inputWidth) { continue; }
      var acc = bias[gid.z];
      for (var ky = 0u; ky < 3u; ky++) {
        let inputY = i32(centerY) + i32(ky) - 1;
        if (inputY < 0 || inputY >= i32(params.inputHeight)) { continue; }
        for (var kx = 0u; kx < 3u; kx++) {
          let inputX = i32(centerX) + i32(kx) - 1;
          if (inputX < 0 || inputX >= i32(params.inputWidth)) { continue; }
          let pixelBase = (u32(inputY) * params.inputWidth + u32(inputX)) * ${n}u;
          for (var inputBlock = 0u; inputBlock < ${n}u; inputBlock++) {
            ${mt("inputData[pixelBase + inputBlock]", `((((gid.z * 3u + ky) * 3u + kx) * ${n}u + inputBlock) * 4u)`, e)}
          }
        }
      }
      pooled = max(pooled, ${a});
    }
  }
  let outputIndex = (gid.y * params.outputWidth + gid.x) * ${r}u + gid.z;
  outputData[outputIndex] = ${I("pooled", e)};
}
`;
}
function Ot(e, t, n) {
	let r = P(e);
	return `${F(e)}
struct Params {
  inputWidth: u32,
  inputHeight: u32,
  outputWidth: u32,
  outputHeight: u32,
  outputBlocks: u32,
}
@group(0) @binding(0) var<storage, read> inputData: array<${r}>;
@group(0) @binding(1) var<storage, read_write> outputData: array<${r}>;
@group(0) @binding(2) var<uniform> params: Params;

@compute @workgroup_size(${k}, ${k}, 1)
fn main(
  @builtin(global_invocation_id) gid: vec3<u32>${n ? ",\n  @builtin(num_workgroups) groupCount: vec3<u32>" : ""}
) {
  ${n ? `let linearX = gid.x + gid.z * groupCount.x * ${k}u;
  let outputBlock = linearX % ${t}u;
  let outputX = linearX / ${t}u;` : "let outputBlock = gid.z;\n  let outputX = gid.x;"}
  if (
    outputX >= params.outputWidth ||
    gid.y >= params.outputHeight ||
    outputBlock >= ${t}u
  ) {
    return;
  }
  var pooled = vec4<f32>(-3.402823466e+38);
  for (var py = 0u; py < 2u; py++) {
    let inputY = gid.y * 2u + py;
    if (inputY >= params.inputHeight) { continue; }
    for (var px = 0u; px < 2u; px++) {
      let inputX = outputX * 2u + px;
      if (inputX >= params.inputWidth) { continue; }
      let inputIndex =
        (inputY * params.inputWidth + inputX) * ${t}u + outputBlock;
      pooled = max(pooled, vec4<f32>(inputData[inputIndex]));
    }
  }
  let outputIndex =
    (gid.y * params.outputWidth + outputX) * ${t}u + outputBlock;
  outputData[outputIndex] = ${I("pooled", e)};
}
`;
}
function kt(e, t, n, r, i, a, o) {
	let { workgroupX: s, workgroupY: c, rowsPerThread: l, tileM: u, tileNBlocks: d, tileKBlocks: f } = j(o), { addressMode: p, weightLayout: m } = o, h = P(e), g = P(t), _ = gt(e, o, !1), v = gt(e, o, !0), y = _ ? "vec2<u32>" : h, b = v ? "vec2<u32>" : h, x = r[0] + r[1], S = I(L("acc[row]", n), t), C = s * c, w = u * f, T = f * d * 4, E = (e, t) => `
          {
            let sourceBlock = ${t};
            ${p === "base-offset" ? `let dx = ${e === i ? "(i32((cachedMask[load] >> 9u) & 1u) + i32(kernelX) - 1) >> 1u" : "i32(kernelX) - 1"};
            let dy = ${e === i ? "(i32((cachedMask[load] >> 10u) & 1u) + i32(kernelY) - 1) >> 1u" : "i32(kernelY) - 1"};
            let offset = (dy * i32(params.source${e}Width) + dx) * ${r[e]};
            let sourceIndex = cachedBase${e}[load] + u32(offset) + sourceBlock;` : `let sourceX = ${e === i ? "u32(inputX) / 2u" : "u32(inputX)"};
            let sourceY = ${e === i ? "u32(inputY) / 2u" : "u32(inputY)"};
            let sourceIndex =
              (sourceY * params.source${e}Width + sourceX) *
              ${r[e]}u + sourceBlock;`}
            value = ${_t(`input${e}[sourceIndex]`, _)};
          }`;
	return `${F(e)}
struct Params {
  outputWidth: u32,
  outputHeight: u32,
  outputBlocks: u32,
  inputBlocks: u32,
  source0Width: u32,
  source0Height: u32,
  source1Width: u32,
  source1Height: u32,
}
@group(0) @binding(0) var<storage, read> input0: array<${y}>;
@group(0) @binding(1) var<storage, read> input1: array<${y}>;
@group(0) @binding(2) var<storage, read> weights: array<${b}>;
@group(0) @binding(3) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> outputData: array<${g}>;
@group(0) @binding(5) var<uniform> params: Params;

var<workgroup> inputTile: array<${h}, ${M(o).input}>;
var<workgroup> weightTile: array<${h}, ${M(o).weights}>;

@compute @workgroup_size(${s}, ${c}, 1)
fn main(
  @builtin(local_invocation_id) localId: vec3<u32>,
  @builtin(workgroup_id) workgroupId: vec3<u32>
) {
  let spatialBase =
    workgroupId.x * ${u}u +
    localId.y * ${l}u;
  let outputBlock =
    workgroupId.y * ${d}u + localId.x;
  let spatialCount = params.outputWidth * params.outputHeight;
  var acc: array<vec4<f32>, ${l}>;
  if (outputBlock < ${a}u) {
    for (var row = 0u; row < ${l}u; row++) {
      acc[row] = bias[outputBlock];
    }
  }

  let localLinear =
    localId.y * ${s}u + localId.x;
  ${p === "analytic" ? "" : Ct(x, !0, o, {
		blocks: r,
		upsampled: i
	})}
  let totalK = ${x * 9}u;
  for (var kBase = 0u; kBase < totalK; kBase += ${f}u) {
    ${p === "analytic" ? `
    for (
      var loadIndex = localLinear;
      loadIndex < ${w}u;
      loadIndex += ${C}u
    ) {
      let tileSpatial = loadIndex / ${f}u;
      let tileK = loadIndex % ${f}u;
      let outputSpatialIndex =
        workgroupId.x * ${u}u + tileSpatial;
      let kIndex = kBase + tileK;
      var value = ${h}(0.0);
      if (outputSpatialIndex < spatialCount && kIndex < totalK) {
        let outputY = outputSpatialIndex / params.outputWidth;
        let outputX = outputSpatialIndex % params.outputWidth;
        let inputBlock = kIndex % ${x}u;
        let kernelIndex = kIndex / ${x}u;
        let kernelY = kernelIndex / 3u;
        let kernelX = kernelIndex % 3u;
        let inputY = i32(outputY) + i32(kernelY) - 1;
        let inputX = i32(outputX) + i32(kernelX) - 1;
        if (
          inputY >= 0 && inputY < i32(params.outputHeight) &&
          inputX >= 0 && inputX < i32(params.outputWidth)
        ) {
          if (inputBlock < ${r[0]}u) {
            ${E(0, "inputBlock")}
          } else {
            ${E(1, `inputBlock - ${r[0]}u`)}
          }
        }
      }
      inputTile[${tt("loadIndex", o)}] = value;
    }
    ` : o.decoderLoad === "source-first" ? `
    if (channelBlock < ${r[0]}u) {
      ${Tt(h, E(0, "inputBlock"), o)}
    } else {
      ${Tt(h, E(1, `inputBlock - ${r[0]}u`), o)}
    }
    ` : Tt(h, `
        if (inputBlock < ${r[0]}u) {
          ${E(0, "inputBlock")}
        } else {
          ${E(1, `inputBlock - ${r[0]}u`)}
        }
    `, o)}

    for (
      var loadIndex = localLinear;
      loadIndex < ${T}u;
      loadIndex += ${C}u
    ) {
      let tileK = loadIndex / ${d * 4}u;
      let outputRemainder = loadIndex % ${d * 4}u;
      let tileOutputBlock = outputRemainder / 4u;
      let outputLane = outputRemainder % 4u;
      let loadedOutputBlock =
        workgroupId.y * ${d}u + tileOutputBlock;
      let kIndex = kBase + tileK;
      var value = ${h}(0.0);
      if (loadedOutputBlock < ${a}u && kIndex < totalK) {
        ${m === "k-major" ? `
        let weightIndex = (kIndex * ${a}u + loadedOutputBlock) * 4u + outputLane;
        ` : p === "analytic" ? `
        let inputBlock = kIndex % ${x}u;
        let kernelIndex = kIndex / ${x}u;
        let kernelY = kernelIndex / 3u;
        let kernelX = kernelIndex % 3u;
        let weightIndex =
          ((((loadedOutputBlock * 3u + kernelY) * 3u + kernelX) *
            ${x}u + inputBlock) * 4u + outputLane);
        ` : `
        let weightIndex = (loadedOutputBlock * ${x * 9}u + kIndex) * 4u + outputLane;
        `}
        value = ${_t("weights[weightIndex]", v)};
      }
      weightTile[${nt("loadIndex", o)}] = value;
    }

    workgroupBarrier();
    ${vt(e, o)}
    workgroupBarrier();
    ${p === "analytic" ? "" : wt(x, o)}
  }

  if (outputBlock < ${a}u) {
    for (var row = 0u; row < ${l}u; row++) {
      let spatialIndex = spatialBase + row;
      if (spatialIndex < spatialCount) {
        let outputIndex = spatialIndex * ${a}u + outputBlock;
        outputData[outputIndex] = ${S};
      }
    }
  }
}
`;
}
function At(e, t, n, r, i, a, o) {
	let { workgroupX: s, workgroupY: c, rowsPerThread: l, tileM: u, tileNBlocks: d, tileKBlocks: f } = j(o), p = s * c, m = u * f / p, h = P(e), g = gt(e, o, !1), _ = gt(e, o, !0), v = r[i], y = 1 - i;
	r[y];
	let b = (t, n) => {
		let i = r[t], s = n ? 4 : 9, c = n ? `phase * ${4 * v * a * 4}u` : `${Yt * v * a * 4}u`, l = n ? `(i32(tap / 2u) + i32(phaseY) - 1) * i32(params.source${t}Width) + i32(tap % 2u) + i32(phaseX) - 1` : `(i32(tap / 3u) - 1) * i32(params.source${t}Width) + i32(tap % 3u) - 1`;
		return `
  for (var kBase = 0u; kBase < ${s * i}u; kBase += ${f}u) {
    let inputK = kBase + localLinear % ${f}u;
    let tap = inputK / ${i}u;
    let channel = inputK % ${i}u;
    for (var load = 0u; load < ${m}u; load++) {
      let i = localLinear + load * ${p}u;
      var value = ${h}(0.0);
      if (tap < ${s}u && (mask${t}[load] & (1u << tap)) != 0u) {
        let offset = ${l};
        let index = u32(base${t}[load] + offset) * ${i}u + channel;
        value = ${_t(`input${t}[index]`, g)};
      }
      inputTile[${tt("i", o)}] = value;
    }
    for (var i = localLinear; i < ${f * d * 4}u; i += ${p}u) {
      let k = kBase + i / ${d * 4}u;
      let outputBlock = workgroupId.y * ${d}u + (i % ${d * 4}u) / 4u;
      var value = ${h}(0.0);
      if (k < ${s * i}u && outputBlock < ${a}u) {
        let index = ${c} + (k * ${a}u + outputBlock) * 4u + i % 4u;
        value = ${_t("weights[index]", _)};
      }
      weightTile[${nt("i", o)}] = value;
    }
    workgroupBarrier();
    ${vt(e, o)}
    workgroupBarrier();
  }`;
	}, x = (e, t) => {
		let n = t ? 4 : 9, r = t ? 2 : 3;
		return `
    let x${e} = i32(${t ? "x" : "x * 2u + phaseX"});
    let y${e} = i32(${t ? "y" : "y * 2u + phaseY"});
    base${e}[load] = y${e} * i32(params.source${e}Width) + x${e};
    var bits${e} = 0u;
    for (var tap = 0u; tap < ${n}u; tap++) {
      let sx = x${e} + i32(tap % ${r}u) ${t ? "+ i32(phaseX)" : ""} - 1;
      let sy = y${e} + i32(tap / ${r}u) ${t ? "+ i32(phaseY)" : ""} - 1;
      if (valid && sx >= 0 && sy >= 0 && sx < i32(params.source${e}Width) && sy < i32(params.source${e}Height)) {
        bits${e} |= 1u << tap;
      }
    }
    mask${e}[load] = bits${e};`;
	};
	return `${F(e)}
struct Params {
  outputWidth: u32, outputHeight: u32, outputBlocks: u32, inputBlocks: u32,
  source0Width: u32, source0Height: u32, source1Width: u32, source1Height: u32,
}
@group(0) @binding(0) var<storage, read> input0: array<${g ? "vec2<u32>" : h}>;
@group(0) @binding(1) var<storage, read> input1: array<${g ? "vec2<u32>" : h}>;
@group(0) @binding(2) var<storage, read> weights: array<${_ ? "vec2<u32>" : h}>;
@group(0) @binding(3) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> outputData: array<${P(t)}>;
@group(0) @binding(5) var<uniform> params: Params;
var<workgroup> inputTile: array<${h}, ${M(o).input}>;
var<workgroup> weightTile: array<${h}, ${M(o).weights}>;

@compute @workgroup_size(${s}, ${c}, 1)
fn main(@builtin(local_invocation_id) localId: vec3<u32>, @builtin(workgroup_id) workgroupId: vec3<u32>) {
  let phase = workgroupId.z;
  let phaseX = phase & 1u;
  let phaseY = phase >> 1u;
  let phaseWidth = (params.outputWidth + 1u) / 2u;
  let localLinear = localId.y * ${s}u + localId.x;
  let outputBlock = workgroupId.y * ${d}u + localId.x;
  var acc: array<vec4<f32>, ${l}>;
  if (outputBlock < ${a}u) {
    for (var row = 0u; row < ${l}u; row++) { acc[row] = bias[outputBlock]; }
  }
  var base0: array<i32, ${m}>;
  var base1: array<i32, ${m}>;
  var mask0: array<u32, ${m}>;
  var mask1: array<u32, ${m}>;
  for (var load = 0u; load < ${m}u; load++) {
    let spatial = workgroupId.x * ${u}u + (localLinear + load * ${p}u) / ${f}u;
    let x = spatial % phaseWidth;
    let y = spatial / phaseWidth;
    let valid = x * 2u + phaseX < params.outputWidth && y * 2u + phaseY < params.outputHeight;
    ${x(i, !0)}
    ${x(y, !1)}
  }
  ${b(i, !0)}
  ${b(y, !1)}
  if (outputBlock < ${a}u) {
    for (var row = 0u; row < ${l}u; row++) {
      let spatial = workgroupId.x * ${u}u + localId.y * ${l}u + row;
      let x = (spatial % phaseWidth) * 2u + phaseX;
      let y = (spatial / phaseWidth) * 2u + phaseY;
      if (x < params.outputWidth && y < params.outputHeight) {
        outputData[(y * params.outputWidth + x) * ${a}u + outputBlock] = ${I(L("acc[row]", n), t)};
      }
    }
  }
}
`;
}
function jt(e, t, n, r, i, a) {
	let o = P(e), s = P(t), c = r[0] + r[1], l = (t, n) => {
		let a = t === i;
		return `
      {
        let sourceX = ${a ? "u32(inputX) / 2u" : "u32(inputX)"};
        let sourceY = ${a ? "u32(inputY) / 2u" : "u32(inputY)"};
        let sourcePixelBase = (sourceY * params.source${t}Width + sourceX) * ${r[t]}u;
        for (var sourceBlock = 0u; sourceBlock < ${r[t]}u; sourceBlock++) {
          let inputBlock = ${n}u + sourceBlock;
          ${mt(`input${t}[sourcePixelBase + sourceBlock]`, `((((gid.z * 3u + ky) * 3u + kx) * ${c}u + inputBlock) * 4u)`, e)}
        }
      }
`;
	}, u = I(L("acc", n), t);
	return `${F(e)}
struct Params {
  outputWidth: u32,
  outputHeight: u32,
  outputBlocks: u32,
  inputBlocks: u32,
  source0Width: u32,
  source0Height: u32,
  source1Width: u32,
  source1Height: u32,
}
@group(0) @binding(0) var<storage, read> input0: array<${o}>;
@group(0) @binding(1) var<storage, read> input1: array<${o}>;
@group(0) @binding(2) var<storage, read> weights: array<${o}>;
@group(0) @binding(3) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> outputData: array<${s}>;
@group(0) @binding(5) var<uniform> params: Params;

@compute @workgroup_size(${k}, ${k}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= params.outputWidth || gid.y >= params.outputHeight || gid.z >= ${a}u) {
    return;
  }
  var acc = bias[gid.z];
  for (var ky = 0u; ky < 3u; ky++) {
    let inputY = i32(gid.y) + i32(ky) - 1;
    if (inputY < 0 || inputY >= i32(params.outputHeight)) { continue; }
    for (var kx = 0u; kx < 3u; kx++) {
      let inputX = i32(gid.x) + i32(kx) - 1;
      if (inputX < 0 || inputX >= i32(params.outputWidth)) { continue; }
      ${l(0, 0)}
      ${l(1, r[0])}
    }
  }
  let outputIndex = (gid.y * params.outputWidth + gid.x) * ${a}u + gid.z;
  outputData[outputIndex] = ${u};
}
`;
}
function Mt(e, t, n, r, i, a) {
	let o = P(e), s = P(t), c = r[0] + r[1], l = 100 * c, u = I(L("acc", n), t), d = (e, t) => `
      let sourceBlock = ${t};
      let sourceIndex =
        (${e === i ? "u32(inputY) / 2u" : "u32(inputY)"} * params.source${e}Width + ${e === i ? "u32(inputX) / 2u" : "u32(inputX)"}) *
        ${r[e]}u + sourceBlock;
      value = input${e}[sourceIndex];`;
	return `${F(e)}
struct Params {
  outputWidth: u32,
  outputHeight: u32,
  outputBlocks: u32,
  inputBlocks: u32,
  source0Width: u32,
  source0Height: u32,
  source1Width: u32,
  source1Height: u32,
}
@group(0) @binding(0) var<storage, read> input0: array<${o}>;
@group(0) @binding(1) var<storage, read> input1: array<${o}>;
@group(0) @binding(2) var<storage, read> weights: array<${o}>;
@group(0) @binding(3) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> outputData: array<${s}>;
@group(0) @binding(5) var<uniform> params: Params;

var<workgroup> inputPatch: array<${o}, ${l}>;

@compute @workgroup_size(${A}, ${A}, 1)
fn main(
  @builtin(local_invocation_id) localId: vec3<u32>,
  @builtin(workgroup_id) workgroupId: vec3<u32>
) {
  let localLinear =
    localId.y * ${A}u + localId.x;
  for (
    var loadIndex = localLinear;
    loadIndex < ${l}u;
    loadIndex += 64u
  ) {
    let patchPixel = loadIndex / ${c}u;
    let inputBlock = loadIndex % ${c}u;
    let patchX = patchPixel % ${et}u;
    let patchY = patchPixel / ${et}u;
    let inputX =
      i32(workgroupId.x * ${A}u + patchX) - 1;
    let inputY =
      i32(workgroupId.y * ${A}u + patchY) - 1;
    var value = ${o}(0.0);
    if (
      inputX >= 0 && inputX < i32(params.outputWidth) &&
      inputY >= 0 && inputY < i32(params.outputHeight)
    ) {
      if (inputBlock < ${r[0]}u) {
        ${d(0, "inputBlock")}
      } else {
        ${d(1, `inputBlock - ${r[0]}u`)}
      }
    }
    inputPatch[loadIndex] = value;
  }
  workgroupBarrier();

  let outputX =
    workgroupId.x * ${A}u + localId.x;
  let outputY =
    workgroupId.y * ${A}u + localId.y;
  let outputBlock = workgroupId.z;
  if (
    outputX >= params.outputWidth || outputY >= params.outputHeight ||
    outputBlock >= ${a}u
  ) {
    return;
  }

  var acc = bias[outputBlock];
  for (var ky = 0u; ky < 3u; ky++) {
    for (var kx = 0u; kx < 3u; kx++) {
      let patchBase =
        ((localId.y + ky) * ${et}u + localId.x + kx) *
        ${c}u;
      for (var inputBlock = 0u; inputBlock < ${c}u; inputBlock++) {
        ${mt("inputPatch[patchBase + inputBlock]", `((((outputBlock * 3u + ky) * 3u + kx) * ${c}u + inputBlock) * 4u)`, e)}
      }
    }
  }
  let outputIndex =
    (outputY * params.outputWidth + outputX) * ${a}u + outputBlock;
  outputData[outputIndex] = ${u};
}
`;
}
function Nt(e, t) {
	let n = P(e), r = Array.from({ length: t }, (e, t) => `@group(0) @binding(${t}) var<storage, read> input${t}: array<vec4<f32>>;`).join("\n"), i = Array.from({ length: t }, (e, t) => {
		let n = t * 3;
		return `if (channel < ${n + 3}u) { return input${t}[pixel][channel - ${n}u]; }`;
	}).join("\n  "), a = t, o = t + 1;
	return `${F(e)}
struct Params {
  width: u32,
  height: u32,
  outputBlocks: u32,
  inputChannels: u32,
}
${r}
@group(0) @binding(${a}) var<storage, read_write> outputData: array<${n}>;
@group(0) @binding(${o}) var<uniform> params: Params;

fn readChannel(pixel: u32, channel: u32) -> f32 {
  ${i}
  return 0.0;
}

@compute @workgroup_size(${k}, ${k}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= params.width || gid.y >= params.height || gid.z >= params.outputBlocks) {
    return;
  }
  let pixel = gid.y * params.width + gid.x;
  let firstChannel = gid.z * 4u;
  let value = vec4<f32>(
    readChannel(pixel, firstChannel),
    readChannel(pixel, firstChannel + 1u),
    readChannel(pixel, firstChannel + 2u),
    readChannel(pixel, firstChannel + 3u)
  );
  outputData[pixel * params.outputBlocks + gid.z] = ${I("value", e)};
}
`;
}
var Pt = "chromium-experimental-subgroup-matrix", Ft = "wgpu-cooperative-matrix", It = 32, Lt = 8, Rt = 4, zt = 1024;
function Bt(e, t = "f32") {
	let n = e.features.has(Pt) ? "tint" : e.features.has(Ft) ? "naga" : void 0;
	if (!n || !e.features.has("subgroups")) return;
	let r = e.adapterInfo, i = r?.subgroupMaxSize ?? 0;
	if (!r || !i || r.subgroupMinSize !== i) return;
	let a = t === "f16" ? [
		["f16", "f16"],
		["f16", "f32"],
		["f32", "f32"]
	] : [
		["f16", "f32"],
		["f32", "f32"],
		["f16", "f16"]
	], o = e.features.has("shader-f16");
	for (let [e, t] of a) if (o || e !== "f16" && t !== "f16") {
		for (let a of [8, 16]) if (r.subgroupMatrixConfigs?.find((n) => n.componentType === e && n.resultComponentType === t && n.M === a && n.N === a && n.K === a)) return {
			componentType: e,
			resultType: t,
			size: a,
			subgroupSize: i,
			dialect: n
		};
	}
}
function Vt(e, t) {
	return t.outputFragments ?? 2;
}
function Ht(e, t, n, r) {
	let i = e.componentType === "f16" ? 2 : 4, a = e.resultType === "f16" ? 2 : 4, o = e.size, s = 340 * o, c = n ? 16 : 9;
	return i * (r ? 2 : 1) * (s + c * o * o * t) + a * Rt * It * o;
}
function Ut(e) {
	let t = e.size, n = e.dialect === "naga", r = (e, r, i) => n ? `coop_mat${t}x${t}<${e}, ${i}>` : `subgroup_matrix_${r}<${e}, ${t}, ${t}>`, i = r(e.resultType, "result", "C");
	return {
		left: r(e.componentType, "left", "A"),
		right: r(e.componentType, "right", "B"),
		result: i,
		load: (e, t, r, i) => n ? `coopLoadT<${e}>(&${t}[${r}], ${i})` : `subgroupMatrixLoad<${e}, row_major>(&${t}, ${r}, ${i})`,
		store: (e, t, r, i) => n ? `coopStoreT(${r}, &${e}[${t}], ${i});` : `subgroupMatrixStore<row_major>(&${e}, ${t}, ${r}, ${i});`,
		multiplyAdd: n ? "coopMultiplyAdd" : "subgroupMatrixMultiplyAccumulate",
		declare: (e) => n ? `var ${e}: ${i};` : `var ${e} = ${i}();`,
		extensions: n ? "enable wgpu_cooperative_matrix;" : "enable subgroups;\nenable chromium_experimental_subgroup_matrix;\ndiagnostic(off, chromium_experimental.subgroup_matrix_uniformity);"
	};
}
function Wt(e, t, n, r, i, a, o) {
	let s = (e, t, n) => `{
        let staged = vec4<${a}>(${t});
        let base = ${n} + i * 4u;
        ${e.array}[base] = staged.x;
        ${e.array}[base + 1u] = staged.y;
        ${e.array}[base + 2u] = staged.z;
        ${e.array}[base + 3u] = staged.w;
      }`, c = (e) => t.map((t) => `
    for (var batch = 0u; batch < ${Math.ceil(t.vectors / r)}u; batch++) {
      let i = localIndex + batch * ${r}u;
      if (i < ${t.vectors}u) {
        var value = ${i}(0.0);
        ${t.read}
        ${s(t, "value", e(t))}
      }
    }`).join(""), l = (e) => t.map((t) => `let ${t.array}Base = ${e} * ${(t.stride ?? t.vectors) * 4}u;`).join("\n    ");
	if (!o || e < 2) return `
  for (var chunk = 0u; chunk < ${e}u; chunk++) {
    let stageChunk = chunk;
    ${l("0u")}
    ${c((e) => `${e.array}Base`)}
    workgroupBarrier();
    ${n}
    workgroupBarrier();
  }`;
	let u = t.map((e) => Math.ceil(e.vectors / r)), d = t.map((e, t) => Array.from({ length: u[t] }, (n, a) => `
      {
        let i = localIndex + ${a * r}u;
        var value = ${i}(0.0);
        if (i < ${e.vectors}u) {
          ${e.read}
        }
        prefetch${t}_${a} = value;
      }`).join("")).join(""), f = t.map((e, t) => Array.from({ length: u[t] }, (e, n) => `var prefetch${t}_${n} = ${i}(0.0);`).join("\n    ")).join("\n    "), p = t.map((e, t) => Array.from({ length: u[t] }, (n, i) => `
      {
        let i = localIndex + ${i * r}u;
        if (i < ${e.vectors}u) ${s(e, `prefetch${t}_${i}`, `next * ${(e.stride ?? e.vectors) * 4}u`)}
      }`).join("")).join("");
	return `
  {
    let stageChunk = 0u;
    ${c(() => "0u")}
  }
  workgroupBarrier();
  for (var chunk = 0u; chunk < ${e}u; chunk++) {
    let buffer = chunk & 1u;
    let next = 1u - buffer;
    ${l("buffer")}
    ${f}
    if (chunk + 1u < ${e}u) {
      let stageChunk = chunk + 1u;
      ${d}
    }
    ${n}
    if (chunk + 1u < ${e}u) {
      ${p}
    }
    workgroupBarrier();
  }`;
}
function Gt(e, t) {
	return e.dialect === "naga" ? Array.from({ length: 9 }, (e, n) => `{ let tap = ${n}u; ${t} }`).join("\n") : `for (var tap = 0u; tap < 9u; tap++) { ${t} }`;
}
function Kt(e, t, n, r, i, a, o, s, c, l = !1) {
	let u = a.size, d = a.componentType, f = a.resultType, p = It, m = s ? 2 : 1, h = u / 4, g = Math.ceil(r / h), _ = o * u, v = p / u, y = Rt * a.subgroupSize, b = P(e), x = P(t), { left: S, right: C, load: w, store: T, multiplyAdd: E, declare: ee, extensions: te } = Ut(a), ne = [];
	for (let e = 0; e < 2; e++) for (let t = 0; t < v; t++) for (let n = 0; n < o; n++) ne.push(`acc${e}_${t}_${n}`);
	let re = ne.map(ee).join("\n  "), ie = Array.from({ length: o }, (e, t) => `let b${t} = ${w(C, "weightTile", `weightTileBase + tap * ${u * _}u + ${t * u}u`, `${_}u`)};`).join("\n      "), ae = [];
	for (let e = 0; e < 2; e++) for (let t = 0; t < v; t++) ae.push(`{
        let a = ${w(S, "inputTile", `inputTileBase + ((rowBase + ${e}u + ky) * 34u + ${t * u}u + kx) * ${u}u`, `${u}u`)};
        ${Array.from({ length: o }, (n, r) => `acc${e}_${t}_${r} = ${E}(a, b${r}, acc${e}_${t}_${r});`).join("\n        ")}
      }`);
	let oe = Gt(a, `let ky = tap / 3u;
      let kx = tap % 3u;
      ${ie}
      ${ae.join("\n      ")}`), se = [];
	if (l) for (let e = 0; e < o; e++) se.push(`{
    var pooled = vec4<f32>(-3.402823e38);
    let pixel = lane / ${h}u;
    let outputBlock = blockBase + ${e * h}u + lane % ${h}u;
    ${Array.from({ length: 2 }, (t, n) => `
    ${Array.from({ length: v }, (t, r) => T("resultTile", `resultBase + ${r * u * u}u`, `acc${n}_${r}_${e}`, `${u}u`)).join("\n    ")}
    workgroupBarrier();
    {
      let base = resultBase + pixel * ${u * 2}u + (lane % ${h}u) * 4u;
      let first = vec4<f32>(resultTile[base], resultTile[base + 1u], resultTile[base + 2u], resultTile[base + 3u]);
      let second = vec4<f32>(resultTile[base + ${u}u], resultTile[base + ${u + 1}u], resultTile[base + ${u + 2}u], resultTile[base + ${u + 3}u]);
      if (tileY + rowBase + ${n}u < params.inputHeight) {
        pooled = max(pooled, first);
        if (tileX + pixel * 2u + 1u < params.inputWidth) { pooled = max(pooled, second); }
      }
    }
    workgroupBarrier();`).join("\n    ")}
    let outputX = tileX / 2u + pixel;
    let outputY = (tileY + rowBase) / 2u;
    if (outputX < params.outputWidth && outputY < params.outputHeight && outputBlock < ${i}u) {
      let acc = pooled + bias[outputBlock];
      outputData[(outputY * params.outputWidth + outputX) * ${i}u + outputBlock] = ${I(L("acc", n), t)};
    }
  }`);
	else for (let e = 0; e < 2; e++) for (let r = 0; r < o; r++) se.push(`{
    ${Array.from({ length: v }, (t, n) => T("resultTile", `resultBase + ${n * u * u}u`, `acc${e}_${n}_${r}`, `${u}u`)).join("\n    ")}
    workgroupBarrier();
    let outputY = tileY + rowBase + ${e}u;
    for (var e = lane; e < ${p * h}u; e += ${a.subgroupSize}u) {
      let pixel = e / ${h}u;
      let outputX = tileX + pixel;
      let outputBlock = blockBase + ${r * h}u + e % ${h}u;
      if (outputX < params.outputWidth && outputY < params.outputHeight && outputBlock < ${i}u) {
        let base = resultBase + pixel * ${u}u + (e % ${h}u) * 4u;
        let acc = vec4<f32>(f32(resultTile[base]), f32(resultTile[base + 1u]),
          f32(resultTile[base + 2u]), f32(resultTile[base + 3u])) + bias[outputBlock];
        outputData[(outputY * params.outputWidth + outputX) * ${i}u + outputBlock] = ${I(L("acc", n), t)};
      }
    }
    workgroupBarrier();
  }`);
	let ce = c ? (() => {
		let [e, t] = c.sourceBlocks, n = (e) => e === c.upsampledSource ? `min(u32(inputY) / 2u, params.source${e}Height - 1u) * params.source${e}Width + min(u32(inputX) / 2u, params.source${e}Width - 1u)` : `u32(inputY) * params.source${e}Width + u32(inputX)`;
		return `if (block < ${e}u) {
          value = input0[(${n(0)}) * ${e}u + block];
        } else {
          value = input1[(${n(1)}) * ${t}u + block - ${e}u];
        }`;
	})() : `value = inputData[(u32(inputY) * params.inputWidth + u32(inputX)) * ${r}u + block];`, le = c ? `struct Params {
  outputWidth: u32,
  outputHeight: u32,
  outputBlocks: u32,
  inputBlocks: u32,
  source0Width: u32,
  source0Height: u32,
  source1Width: u32,
  source1Height: u32,
}
@group(0) @binding(0) var<storage, read> input0: array<${b}>;
@group(0) @binding(1) var<storage, read> input1: array<${b}>;
@group(0) @binding(2) var<storage, read> weights: array<${b}>;
@group(0) @binding(3) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> outputData: array<${x}>;
@group(0) @binding(5) var<uniform> params: Params;` : `struct Params {
  inputWidth: u32,
  inputHeight: u32,
  outputWidth: u32,
  outputHeight: u32,
  inputBlocks: u32,
  outputBlocks: u32,
}
@group(0) @binding(0) var<storage, read> inputData: array<${b}>;
@group(0) @binding(1) var<storage, read> weights: array<${b}>;
@group(0) @binding(2) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> outputData: array<${x}>;
@group(0) @binding(4) var<uniform> params: Params;`, ue = c ? "params.outputWidth" : "params.inputWidth", de = c ? "params.outputHeight" : "params.inputHeight";
	return `${e === "fp16" || t === "fp16" || d === "f16" || f === "f16" ? "enable f16;\n" : ""}${te}
${le}

var<workgroup> inputTile: array<${d}, ${m * 10 * 34 * u}>;
var<workgroup> weightTile: array<${d}, ${m * 9 * u * _}>;
var<workgroup> resultTile: array<${f}, ${128 * u}>;

@compute @workgroup_size(${y})
fn main(
  @builtin(local_invocation_index) localIndex: u32,
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(subgroup_id) subgroup: u32,
  @builtin(subgroup_invocation_id) lane: u32
) {
  let tileX = workgroupId.x * ${p}u;
  let tileY = workgroupId.y * ${Lt}u;
  let blockBase = workgroupId.z * ${_ / 4}u;
  let rowBase = subgroup * 2u;
  let resultBase = subgroup * ${p * u}u;
  ${re}

  ${Wt(g, [{
		array: "inputTile",
		vectors: 340 * h,
		read: `let pixel = i / ${h}u;
      let block = stageChunk * ${h}u + i % ${h}u;
      let inputX = i32(tileX + pixel % 34u) - 1;
      let inputY = i32(tileY + pixel / 34u) - 1;
      if (block < ${r}u && inputX >= 0 && inputY >= 0 &&
          inputX < i32(${ue}) && inputY < i32(${de})) {
        ${ce}
      }`
	}, {
		array: "weightTile",
		vectors: 9 * u * _ / 4,
		read: `let quad = i % ${_ / 4}u;
      let row = i / ${_ / 4}u;
      let tap = row / ${u}u;
      let inputChannel = stageChunk * ${u}u + row % ${u}u;
      let outputBlock = blockBase + quad;
      if (inputChannel < ${r * 4}u && outputBlock < ${i}u) {
        value = weights[((tap * ${r}u + inputChannel / 4u) * ${i}u + outputBlock) * 4u + inputChannel % 4u];
      }`
	}], oe, y, b, d, s)}

  ${se.join("\n  ")}
}
`;
}
var qt = [[-1, 0], [0, 1]], Jt = [[[0], [1, 2]], [[0, 1], [2]]], Yt = 16;
function Xt(e, t, n, r, i, a) {
	let o = N(n.outputChannels), s = i[a], c = i[1 - a], l = a === 0 ? 0 : i[0] * 4, u = a === 0 ? i[0] * 4 : 0, d = Yt * s * o * 16, f = new Float32Array(d + 9 * c * o * 16), p = ut(n.weight), m = (e, t, r, i) => e < n.outputChannels && t < n.inputChannels ? p[((e * n.inputChannels + t) * 3 + r) * 3 + i] : 0;
	for (let e = 0; e < o * 4; e++) {
		let t = e >> 2, n = e & 3;
		for (let r = 0; r < s * 4; r++) for (let i = 0; i < 4; i++) for (let a = 0; a < 4; a++) {
			let c = 0;
			for (let t of Jt[i >> 1][a >> 1]) for (let n of Jt[i & 1][a & 1]) c += m(e, l + r, t, n);
			let u = ((i * 4 + a) * s + (r >> 2)) * o + t;
			f[u * 16 + (r & 3) * 4 + n] = c;
		}
		for (let r = 0; r < c * 4; r++) for (let i = 0; i < 9; i++) {
			let a = (i * c + (r >> 2)) * o + t;
			f[d + a * 16 + (r & 3) * 4 + n] = m(e, u + r, i / 3 | 0, i % 3);
		}
	}
	let h;
	if (r === "fp16") {
		let e = new Uint16Array(f.length);
		for (let t = 0; t < f.length; t++) e[t] = ct(f[t]);
		h = new Uint8Array(e.buffer);
	} else h = new Uint8Array(f.buffer);
	let g = new Float32Array(o * 4);
	g.set(ut(n.bias));
	let _ = dt(e, `oidn/${t}/weights/${r}/subpixel`, h, O.STORAGE);
	try {
		return {
			weights: _,
			weightLayout: "k-major",
			bias: dt(e, `oidn/${t}/bias`, new Uint8Array(g.buffer), O.STORAGE)
		};
	} catch (e) {
		throw _.destroy(), e;
	}
}
function Zt(e, t, n, r, i, a, o, s, c) {
	let l = i.size, u = c ? 2 : 1, d = i.componentType, f = i.resultType, p = It, m = Lt, h = l / 4, g = o[s], _ = o[1 - s], v = Math.ceil(g / h), y = Math.ceil(_ / h), b = a * l, x = m / 2, S = p / 2 / l, C = Rt * i.subgroupSize, w = P(e), T = P(t), { left: E, right: ee, load: te, store: ne, multiplyAdd: re, declare: ie, extensions: ae } = Ut(i), oe = (e, t, n) => `acc${e}_${t}_${n}`, se = [];
	for (let e = 0; e < x; e++) for (let t = 0; t < S; t++) for (let n = 0; n < a; n++) se.push(ie(oe(e, t, n)));
	let ce = (e, t) => {
		let n = [];
		for (let r = 0; r < x; r++) for (let i = 0; i < S; i++) n.push(`{
        let a = ${te(E, "inputTile", `inputTileBase + ${e(r, i)}`, t)};
        ${Array.from({ length: a }, (e, t) => `${oe(r, i, t)} = ${re}(a, b${t}, ${oe(r, i, t)});`).join("\n        ")}
      }`);
		return n.join("\n      ");
	}, le = (e) => Array.from({ length: a }, (t, n) => `let b${n} = ${te(ee, "weightTile", `weightTileBase + ${e} * ${l * b}u + ${n * l}u`, `${b}u`)};`).join("\n      "), ue = (e, t, n) => `(${n} * params.source${e}Width + ${t}) * ${o[e]}u`, de = 340 * h, fe = Yt * l * b / 4, pe = (e, t, n) => ({
		array: "weightTile",
		vectors: e * l * b / 4,
		stride: fe,
		read: `let quad = i % ${b / 4}u;
      let row = i / ${b / 4}u;
      let matrix = row / ${l}u;
      let inputChannel = stageChunk * ${l}u + row % ${l}u;
      let outputBlock = blockBase + quad;
      if (inputChannel < ${t * 4}u && outputBlock < ${r}u) {
        value = weights[${n}u + ((matrix * ${t}u + inputChannel / 4u) * ${r}u + outputBlock) * 4u + inputChannel % 4u];
      }`
	}), me = (e, t, n) => ({
		array: "inputTile",
		vectors: e * t * h,
		stride: de,
		read: `let pixel = i / ${h}u;
      let block = stageChunk * ${h}u + i % ${h}u;
      ${n}`
	}), he = `let inputX = i32(tileX / 2u + pixel % 18u) - 1;
      let inputY = i32(tileY / 2u + pixel / 18u) - 1;
      if (block < ${g}u && inputX >= 0 && inputY >= 0 &&
          inputX < i32(params.source${s}Width) && inputY < i32(params.source${s}Height)) {
        value = input${s}[${ue(s, "u32(inputX)", "u32(inputY)")} + block];
      }`, ge = 1 - s, _e = `let inputX = i32(tileX + pixel % 34u) - 1;
      let inputY = i32(tileY + pixel / 34u) - 1;
      if (block < ${_}u && inputX >= 0 && inputY >= 0 &&
          inputX < i32(params.outputWidth) && inputY < i32(params.outputHeight)) {
        value = input${ge}[${ue(ge, "u32(inputX)", "u32(inputY)")} + block];
      }`, ve = [];
	for (let e = 0; e < 2; e++) for (let t = 0; t < 2; t++) ve.push(`{
      let matrix = phase * 4u + ${e * 2 + t}u;
      let offsetY = select(${qt[0][e] + 1}u, ${qt[1][e] + 1}u, phaseY == 1u);
      let offsetX = select(${qt[0][t] + 1}u, ${qt[1][t] + 1}u, phaseX == 1u);
      ${le("matrix")}
      ${ce((e, t) => `((${e}u + offsetY) * 18u + ${t * l}u + offsetX) * ${l}u`, `${l}u`)}
    }`);
	let ye = Gt(i, `let ky = tap / 3u;
      let kx = tap % 3u;
      ${le("tap")}
      ${ce((e, t) => `((phaseY + ${e * 2}u + ky) * 34u + phaseX + kx + ${t * l * 2}u) * ${l}u`, `${l * 2}u`)}`), be = [];
	for (let e = 0; e < x; e++) for (let o = 0; o < a; o++) be.push(`{
    ${Array.from({ length: S }, (t, n) => ne("resultTile", `resultBase + ${n * l * l}u`, oe(e, n, o), `${l}u`)).join("\n    ")}
    workgroupBarrier();
    let outputY = tileY + phaseY + ${e * 2}u;
    for (var e = lane; e < ${p / 2 * h}u; e += ${i.subgroupSize}u) {
      let pixel = e / ${h}u;
      let outputX = tileX + phaseX + pixel * 2u;
      let outputBlock = blockBase + ${o * h}u + e % ${h}u;
      if (outputX < params.outputWidth && outputY < params.outputHeight && outputBlock < ${r}u) {
        let base = resultBase + pixel * ${l}u + (e % ${h}u) * 4u;
        let acc = vec4<f32>(f32(resultTile[base]), f32(resultTile[base + 1u]),
          f32(resultTile[base + 2u]), f32(resultTile[base + 3u])) + bias[outputBlock];
        outputData[(outputY * params.outputWidth + outputX) * ${r}u + outputBlock] = ${I(L("acc", n), t)};
      }
    }
    workgroupBarrier();
  }`);
	return `${e === "fp16" || t === "fp16" || d === "f16" || f === "f16" ? "enable f16;\n" : ""}${ae}
struct Params {
  outputWidth: u32,
  outputHeight: u32,
  outputBlocks: u32,
  inputBlocks: u32,
  source0Width: u32,
  source0Height: u32,
  source1Width: u32,
  source1Height: u32,
}
@group(0) @binding(0) var<storage, read> input0: array<${w}>;
@group(0) @binding(1) var<storage, read> input1: array<${w}>;
@group(0) @binding(2) var<storage, read> weights: array<${w}>;
@group(0) @binding(3) var<storage, read> bias: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> outputData: array<${T}>;
@group(0) @binding(5) var<uniform> params: Params;

var<workgroup> inputTile: array<${d}, ${u * de * 4}>;
var<workgroup> weightTile: array<${d}, ${u * fe * 4}>;
var<workgroup> resultTile: array<${f}, ${p / 2 * Rt * l}>;

@compute @workgroup_size(${C})
fn main(
  @builtin(local_invocation_index) localIndex: u32,
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(subgroup_id) subgroup: u32,
  @builtin(subgroup_invocation_id) lane: u32
) {
  let tileX = workgroupId.x * ${p}u;
  let tileY = workgroupId.y * ${m}u;
  let blockBase = workgroupId.z * ${b / 4}u;
  let phase = subgroup;
  let phaseY = subgroup >> 1u;
  let phaseX = subgroup & 1u;
  let resultBase = subgroup * ${p / 2 * l}u;
  ${se.join("\n  ")}

  ${Wt(v, [me(6, 18, he), pe(Yt, g, 0)], ve.join("\n    "), C, w, d, c)}

  ${Wt(y, [me(10, 34, _e), pe(9, _, Yt * g * r * 4)], ye, C, w, d, c)}

  ${be.join("\n  ")}
}
`;
}
function Qt(e) {
	return e.op === "concat" ? e.inputs : e.op === "fusedUpsampleConcatConv2d" ? e.inputs.map((e) => e.value) : [e.input];
}
function $t(e, t = "auto") {
	let n = e.features.has("shader-f16");
	if (t === "fp16" && !n) throw Error("OIDN FP16 was requested but the OIDNGPUDevice does not have shader-f16 enabled");
	return t === "auto" ? n ? "fp16" : "fp32" : t;
}
var en = class {
	_device;
	usedKernels = /* @__PURE__ */ new Set();
	get weightBuffers() {
		return [...this._packedConvs.values()].flatMap((e) => [e.weights, e.bias]);
	}
	precision;
	kernelSetting;
	gemm;
	maxSpatialInputBlocks;
	subgroupsAvailable;
	subgroupMatrix;
	subgroupMatrixOutputFragments;
	subgroupMatrixSubPixel;
	subgroupMatrixDoubleBuffer;
	_subgroupMatrixFixedFragments;
	_model;
	_gemmByOutputBlocks = /* @__PURE__ */ new Map();
	_packedConvs = /* @__PURE__ */ new Map();
	_pipelineCache;
	_executionCache = /* @__PURE__ */ new Map();
	_retiredExecutions = /* @__PURE__ */ new Set();
	_clock = 0;
	_shapeCacheSize;
	_profileNextExecution = !1;
	_profileOperations = 0;
	_resources = new Xe();
	_disposed = !1;
	constructor(e, t, n = {}) {
		this._device = e, this._pipelineCache = Qe(e), this.precision = $t(e, n.precision ?? "auto"), this.kernelSetting = n.kernel ?? "auto";
		let r = n.gemm?.workgroupSize ?? [8, 8];
		if (this.gemm = Object.freeze({
			tilePolicy: n.gemm?.tilePolicy ?? (n.gemm?.workgroupSize ? "fixed" : "output-aligned"),
			decoderLoad: n.gemm?.decoderLoad ?? "per-load",
			decoderSubPixel: n.gemm?.decoderSubPixel ?? this.precision === "fp16",
			unrollRows: n.gemm?.unrollRows ?? !1,
			poolLayout: n.gemm?.poolLayout ?? "channels",
			sharedLayout: n.gemm?.sharedLayout ?? (this.precision === "fp16" ? "padded-input" : "padded"),
			accumulationOrder: n.gemm?.accumulationOrder ?? "k-major",
			finalLayer: n.gemm?.finalLayer ?? "shared-auto",
			loadMode: n.gemm?.loadMode ?? "native",
			addressMode: n.gemm?.addressMode ?? "incremental",
			weightLayout: n.gemm?.weightLayout ?? "k-major",
			rowsPerThread: n.gemm?.rowsPerThread ?? 8,
			workgroupSize: Object.freeze([r[0], r[1]])
		}), !["fixed", "output-aligned"].includes(this.gemm.tilePolicy)) throw Error(`Unsupported GEMM tile policy: ${this.gemm.tilePolicy}`);
		if (!["per-load", "source-first"].includes(this.gemm.decoderLoad)) throw Error(`Unsupported GEMM decoder load: ${this.gemm.decoderLoad}`);
		if (!["spatial", "channels"].includes(this.gemm.poolLayout)) throw Error(`Unsupported GEMM pool layout: ${this.gemm.poolLayout}`);
		if (![
			"linear",
			"padded",
			"padded-input",
			"padded-weights"
		].includes(this.gemm.sharedLayout)) throw Error(`Unsupported GEMM shared layout: ${this.gemm.sharedLayout}`);
		if (!["k-major", "row-major"].includes(this.gemm.accumulationOrder)) throw Error(`Unsupported GEMM accumulation order: ${this.gemm.accumulationOrder}`);
		if (![
			"direct",
			"shared-input",
			"shared-input-weights",
			"shared-auto"
		].includes(this.gemm.finalLayer)) throw Error(`Unsupported GEMM final layer: ${this.gemm.finalLayer}`);
		if (![
			"native",
			"packed-weights",
			"packed-all"
		].includes(this.gemm.loadMode)) throw Error(`Unsupported GEMM load mode: ${this.gemm.loadMode}`);
		if (![
			"analytic",
			"incremental",
			"base-offset"
		].includes(this.gemm.addressMode)) throw Error(`Unsupported GEMM address mode: ${this.gemm.addressMode}`);
		if (!["output-major", "k-major"].includes(this.gemm.weightLayout)) throw Error(`Unsupported GEMM weight layout: ${this.gemm.weightLayout}`);
		let i = j(this.gemm), a = (M(this.gemm).input + M(this.gemm).weights) * 4 * (this.precision === "fp16" ? 2 : 4);
		if (![
			2,
			4,
			8
		].includes(i.rowsPerThread) || ![
			4,
			8,
			16
		].includes(i.workgroupX) || ![4, 8].includes(i.workgroupY) || r.length !== 2 || i.workgroupX > e.limits.maxComputeWorkgroupSizeX || i.workgroupY > e.limits.maxComputeWorkgroupSizeY || i.workgroupX * i.workgroupY > e.limits.maxComputeInvocationsPerWorkgroup || a > e.limits.maxComputeWorkgroupStorageSize) throw Error("Unsupported GEMM tile configuration for this OIDNGPUDevice");
		this.subgroupsAvailable = e.features.has("subgroups");
		let o = n.subgroupMatrix ?? {}, s = this.kernelSetting === "subgroup-matrix" ? Bt(e, o.accumulation) : void 0;
		this.subgroupMatrixOutputFragments = s ? Vt(s, o) : 0, this.subgroupMatrixSubPixel = o.subPixel ?? !0, this._subgroupMatrixFixedFragments = o.outputFragments !== void 0;
		let c = (t) => s !== void 0 && Ht(s, this.subgroupMatrixOutputFragments, this.subgroupMatrixSubPixel, t) <= e.limits.maxComputeWorkgroupStorageSize;
		if (s && o.outputFragments === void 0 && !c(!1) && (this.subgroupMatrixOutputFragments = 1), this.subgroupMatrixDoubleBuffer = (o.doubleBuffer ?? !1) && c(!0), s && Rt * s.subgroupSize <= e.limits.maxComputeInvocationsPerWorkgroup && Rt * s.subgroupSize <= e.limits.maxComputeWorkgroupSizeX && c(this.subgroupMatrixDoubleBuffer) && (this.subgroupMatrix = s), this.maxSpatialInputBlocks = this.precision === "fp16" && e.limits.maxComputeInvocationsPerWorkgroup >= 64 && e.limits.maxComputeWorkgroupSizeX >= A && e.limits.maxComputeWorkgroupSizeY >= A ? Math.floor(e.limits.maxComputeWorkgroupStorageSize / 800) : 0, this._shapeCacheSize = Math.max(1, n.shapeCacheSize ?? 2), t.inputChannels % 3 != 0 || t.inputChannels < 3 || t.inputChannels > 9) throw Error(`Native OIDN expects 3, 6, or 9 input channels, got ${t.inputChannels}`);
		this._model = {
			spec: t.spec,
			inputChannels: t.inputChannels,
			outputChannels: t.outputChannels,
			channelsByValue: new Map(t.channelsByValue),
			convChannels: new Map(t.convChannels)
		};
		let l = /* @__PURE__ */ new Map();
		for (let e of Le(this._model, { fuseConvPool: this._matrixPool() }).nodes) {
			if (e.op === "fusedUpsampleConcatConv2d") {
				let t = this._subPixelDecoder(e);
				t && l.set(e.conv.id, t);
			}
			if (e.op !== "conv2d" && e.op !== "maxPool2d" && e.op !== "fusedConvReluMaxPool2d" && e.op !== "fusedUpsampleConcatConv2d") throw Error(`Native OIDN descriptor ${t.spec.id} leaves unsupported ${e.op} node ${e.id} after graph optimization`);
		}
		try {
			for (let [n, r] of t.convTensors) {
				let i = this._selectConvKernel(N(r.inputChannels), n === t.spec.output), a = i === "implicit-gemm" ? this.gemm.weightLayout : i === "subgroup-matrix" ? "k-major" : "output-major", o = l.get(n), s = o ? Xt(e, n, r, this.precision, o.sourceBlocks, o.upsampledSource) : pt(e, n, r, this.precision, a);
				this._resources.track("gpu-buffer", s.weights), this._resources.track("gpu-buffer", s.bias), this._packedConvs.set(n, s);
			}
		} catch (e) {
			for (let e of this._packedConvs.values()) this._releaseBuffer(e.weights), this._releaseBuffer(e.bias);
			throw this._packedConvs.clear(), e;
		}
	}
	_pipeline(e, t) {
		let n = this._pipelineCache.get(e);
		return n || (n = this._device.createComputePipeline({
			label: `oidn/${e}`,
			layout: "auto",
			compute: {
				module: this._device.createShaderModule({
					label: `oidn/${e}`,
					code: t
				}),
				entryPoint: "main"
			}
		}), this._pipelineCache.set(e, n)), n;
	}
	_nodePipelineSpec(e, t, n = this.subgroupMatrixOutputFragments) {
		if (e.op === "conv2d") {
			let r = t ? "fp32" : this.precision, i = N(this._model.convChannels.get(e.id).inputChannels), a = N(this._model.convChannels.get(e.id).outputChannels), o = this._gemmForOutput(a), s = this._selectConvKernel(i, t), c = o.finalLayer === "shared-input-weights" || o.finalLayer === "shared-auto" && Ge(this.precision, i, !0) <= this._device.limits.maxComputeWorkgroupStorageSize;
			return s !== "subgroup-matrix" && t && this._model.convChannels.get(e.id).outputChannels === 3 && (this.kernelSetting === "auto" || this.kernelSetting === "implicit-gemm" || this.kernelSetting === "subgroup-matrix") && o.finalLayer !== "direct" && this._device.limits.maxComputeWorkgroupSizeX >= 8 && this._device.limits.maxComputeWorkgroupSizeY >= 8 && this._device.limits.maxComputeInvocationsPerWorkgroup >= 64 && Ge(this.precision, i, c) <= this._device.limits.maxComputeWorkgroupStorageSize ? {
				key: `conv-final-rgb/${this.precision}/${e.activation}/in${i}/weights-${c ? "shared" : "storage"}`,
				kernel: "direct",
				code: Ye(this.precision, e.activation, i, c)
			} : s === "subgroup-matrix" ? this._subgroupMatrixSpec(`conv/${e.activation}/in${i}/out${a}`, r, e.activation, i, a, n) : {
				key: `conv-${s}/${this.precision}/${r}/${e.activation}/in${i}/out${a}` + (s === "implicit-gemm" ? `/address-${o.addressMode}/weights-${o.weightLayout}-v1/tile-${o.workgroupSize.join("x")}-r${o.rowsPerThread}/loads-${o.loadMode}/shared-${o.sharedLayout}/acc-${o.accumulationOrder}/unroll-${Number(o.unrollRows)}` : ""),
				kernel: s,
				code: s === "implicit-gemm" ? Et(this.precision, r, e.activation, i, a, o) : s === "spatial" ? St(this.precision, r, e.activation, i, a) : s === "subgroup" ? xt(this.precision, r, e.activation, i, a) : bt(this.precision, r, e.activation, i, a)
			};
		}
		if (e.op === "maxPool2d") {
			let t = N(this._model.channelsByValue.get(e.id)), n = this._coalescedPool();
			return {
				key: `max-pool/${this.precision}/out${t}/${n ? "channels" : "spatial"}`,
				kernel: "direct",
				code: Ot(this.precision, t, n)
			};
		}
		if (e.op === "fusedConvReluMaxPool2d") {
			let t = N(this._model.convChannels.get(e.conv.id).inputChannels), r = N(this._model.convChannels.get(e.conv.id).outputChannels);
			return this._matrixPool() ? this._subgroupMatrixSpec(`conv-pool/${e.conv.activation}/in${t}/out${r}`, this.precision, e.conv.activation, t, r, n, void 0, !0) : {
				key: `conv-pool/${this.precision}/${e.conv.activation}/in${t}/out${r}`,
				kernel: "direct",
				code: Dt(this.precision, e.conv.activation, t, r)
			};
		}
		if (e.op === "fusedUpsampleConcatConv2d") {
			if (e.inputs.length !== 2) throw Error(`Native fused decoder ${e.id} requires two inputs`);
			let r = e.inputs.map((e) => N(this._model.channelsByValue.get(e.value))), i = e.inputs.findIndex((e) => e.upsample);
			if (i !== 0 && i !== 1) throw Error(`Native fused decoder ${e.id} has no upsample input`);
			let a = r[0] + r[1], o = t ? "fp32" : this.precision, s = this._selectConvKernel(a, t), c = s === "subgroup" ? "direct" : s, l = N(this._model.convChannels.get(e.conv.id).outputChannels);
			if (c === "subgroup-matrix" && this._subPixelDecoder(e)) {
				let t = this.subgroupMatrix;
				return {
					key: `subgroup-matrix-subpixel/${this.precision}/${o}/${t.dialect}/${t.componentType}-${t.resultType}-${t.size}-sg${t.subgroupSize}/n${n}${this.subgroupMatrixDoubleBuffer ? "-db" : ""}/${e.conv.activation}/${r.join("+")}/out${l}/up${i}`,
					kernel: "subgroup-matrix",
					code: Zt(this.precision, o, e.conv.activation, l, t, n, r, i, this.subgroupMatrixDoubleBuffer)
				};
			}
			if (c === "subgroup-matrix") return this._subgroupMatrixSpec(`decoder/${e.conv.activation}/${r.join("+")}/out${l}/up${i}`, o, e.conv.activation, a, l, n, {
				sourceBlocks: r,
				upsampledSource: i
			});
			let u = this._gemmForOutput(l);
			return {
				key: `decoder-${c}${c === "implicit-gemm" && this._subPixelDecoder(e) ? "-subpixel" : ""}/${this.precision}/${o}/${e.conv.activation}/${r.join("+")}/out${l}/up${i}` + (c === "implicit-gemm" ? `/address-${u.addressMode}/weights-${u.weightLayout}-v1/tile-${u.workgroupSize.join("x")}-r${u.rowsPerThread}/loads-${u.loadMode}/shared-${u.sharedLayout}/acc-${u.accumulationOrder}/unroll-${Number(u.unrollRows)}/decoder-${u.decoderLoad}` : ""),
				kernel: c,
				code: c === "implicit-gemm" ? (this._subPixelDecoder(e) ? At : kt)(this.precision, o, e.conv.activation, r, i, l, u) : c === "spatial" ? Mt(this.precision, o, e.conv.activation, r, i, l) : jt(this.precision, o, e.conv.activation, r, i, l)
			};
		}
		throw Error(`Native OIDN does not implement unfused ${e.op} node ${e.id}`);
	}
	_subPixelDecoder(e) {
		if (e.id === this._model.spec.output || e.inputs.length !== 2) return;
		let t = this._selectConvKernel(N(this._model.convChannels.get(e.conv.id).inputChannels), !1);
		if (!(t === "subgroup-matrix" && this.subgroupMatrixSubPixel) && !(t === "implicit-gemm" && this.gemm.decoderSubPixel && this.gemm.weightLayout === "k-major")) return;
		let n = e.inputs[0].upsample ? 0 : e.inputs[1].upsample ? 1 : -1;
		if (n !== -1) return {
			sourceBlocks: e.inputs.map((e) => N(this._model.channelsByValue.get(e.value))),
			upsampledSource: n
		};
	}
	_subgroupMatrixSpec(e, t, n, r, i, a, o, s = !1) {
		let c = this.subgroupMatrix;
		return {
			key: `subgroup-matrix/${this.precision}/${t}/${c.dialect}/${c.componentType}-${c.resultType}-${c.size}-sg${c.subgroupSize}/n${a}${this.subgroupMatrixDoubleBuffer ? "-db" : ""}/${e}`,
			kernel: "subgroup-matrix",
			code: Kt(this.precision, t, n, r, i, c, a, this.subgroupMatrixDoubleBuffer, o, s)
		};
	}
	_subgroupMatrixFragmentsFor(e) {
		let t = Math.min(this.subgroupMatrixOutputFragments, Math.ceil(N(e.channels) * 4 / this.subgroupMatrix.size));
		return this._subgroupMatrixFixedFragments || t === 1 ? t : Math.ceil(e.width / It) * Math.ceil(e.height / Lt) * Math.ceil(N(e.channels) * 4 / (t * this.subgroupMatrix.size)) < zt ? 1 : t;
	}
	_gemmForOutput(e) {
		if (this.gemm.tilePolicy !== "output-aligned" || this.gemm.workgroupSize[0] !== 8 || e <= 0 || e % 16 != 0) return this.gemm;
		let t = this._gemmByOutputBlocks.get(e);
		if (t) return t;
		let n = Object.freeze({
			...this.gemm,
			workgroupSize: Object.freeze([16, this.gemm.workgroupSize[1]])
		}), r = j(n), i = M(n), a = this._device.limits, o = r.workgroupX <= a.maxComputeWorkgroupSizeX && r.workgroupY <= a.maxComputeWorkgroupSizeY && r.workgroupX * r.workgroupY <= a.maxComputeInvocationsPerWorkgroup && (i.input + i.weights) * 4 * (this.precision === "fp16" ? 2 : 4) <= a.maxComputeWorkgroupStorageSize ? n : this.gemm;
		return this._gemmByOutputBlocks.set(e, o), o;
	}
	_matrixPool() {
		let e = this.subgroupMatrix;
		return this._model.spec.family === "oidn-unet-large" && this.precision === "fp16" && e?.dialect === "naga" && e.size === 8 && e.subgroupSize === 32 && e.componentType === "f16" && e.resultType === "f32";
	}
	_coalescedPool() {
		return this.gemm.poolLayout === "channels" && (this.kernelSetting === "auto" || this.kernelSetting === "implicit-gemm" || this.kernelSetting === "subgroup-matrix");
	}
	_selectConvKernel(e, t) {
		let n = this.precision === "fp16" && e <= this.maxSpatialInputBlocks;
		return this.kernelSetting === "direct" ? "direct" : this.kernelSetting === "spatial" ? n ? "spatial" : "direct" : this.kernelSetting === "implicit-gemm" ? t ? "direct" : "implicit-gemm" : this.kernelSetting === "subgroup" ? this.subgroupsAvailable ? "subgroup" : "direct" : this.kernelSetting === "subgroup-matrix" ? t ? this.subgroupMatrix?.dialect === "naga" ? "subgroup-matrix" : "direct" : this.subgroupMatrix ? "subgroup-matrix" : "implicit-gemm" : t ? "direct" : "implicit-gemm";
	}
	_nodePipeline(e, t) {
		let { key: n, code: r } = this._nodePipelineSpec(e, t);
		return this._pipeline(n, r);
	}
	_createExecution(e, t) {
		let n = this._matrixPool(), r = Be(this._model, e, t, { fuseConvPool: n }), i = /* @__PURE__ */ new Map(), a = [], o = [], s = /* @__PURE__ */ new Map();
		r.nodes.forEach((e, t) => {
			for (let n of Qt(e)) s.set(n, t);
		}), s.set(r.spec.output, r.nodes.length);
		let c = [], l = (e) => (c.push(e), this._resources.track("gpu-buffer", e));
		try {
			let c = (e, t, r, i) => {
				let a = it(t, r), c = o.filter((e) => e.lastUse < i), l = c.filter((e) => e.capacity >= a).sort((e, t) => e.capacity - t.capacity)[0];
				!l && n && (l = c.sort((e, t) => t.capacity - e.capacity)[0]), l || (l = {
					capacity: 0,
					lastUse: -2,
					values: []
				}, o.push(l)), l.capacity = Math.max(l.capacity, a), l.lastUse = s.get(e) ?? -1, l.values.push(e);
			};
			c(r.spec.input, r.inputShape, this.precision === "fp16" ? 2 : 4, -1), r.plannedNodes.forEach(({ node: e, outputShape: t }, n) => {
				let i = e.id === r.spec.output;
				c(e.id, t, i || this.precision === "fp32" ? 4 : 2, n);
			}), o.forEach((n, r) => {
				let o = l(this._device.createBuffer({
					label: `oidn/activation/${e}x${t}/${r}`,
					size: rt(n.capacity, 4),
					usage: O.STORAGE | O.COPY_SRC | O.COPY_DST
				}));
				a.push({
					buffer: o,
					capacity: n.capacity
				});
				for (let e of n.values) i.set(e, o);
			});
			let u = this._model.inputChannels / 3, d = `pack/${this.precision}/${u}`, f = this._pipeline(d, Nt(this.precision, u)), p = [], m = [], h = [], g = [], _ = [];
			r.plannedNodes.forEach(({ node: n, outputShape: a }, o) => {
				let s = n.id === r.spec.output, c = this.subgroupMatrix ? this._subgroupMatrixFragmentsFor(a) : 0, u = this._nodePipelineSpec(n, s, c);
				u.kernel && this.usedKernels.add(u.kernel);
				let d = this._pipeline(u.key, u.code);
				p.push(d), m.push(u.kernel ?? "direct"), h.push(u.kernel === "subgroup-matrix" ? c : 0);
				let f = i.get(n.id), v, y, b;
				if (n.op === "conv2d") {
					let e = r.valueShapes.get(n.input);
					b = n.id, y = [
						e.width,
						e.height,
						a.width,
						a.height,
						N(e.channels),
						N(a.channels)
					];
					let t = this._packedConvs.get(b);
					v = [
						{
							binding: 0,
							resource: { buffer: i.get(n.input) }
						},
						{
							binding: 1,
							resource: { buffer: t.weights }
						},
						{
							binding: 2,
							resource: { buffer: t.bias }
						},
						{
							binding: 3,
							resource: { buffer: f }
						}
					];
				} else if (n.op === "maxPool2d") {
					let e = r.valueShapes.get(n.input);
					y = [
						e.width,
						e.height,
						a.width,
						a.height,
						N(a.channels)
					], v = [{
						binding: 0,
						resource: { buffer: i.get(n.input) }
					}, {
						binding: 1,
						resource: { buffer: f }
					}];
				} else if (n.op === "fusedConvReluMaxPool2d") {
					let e = r.valueShapes.get(n.input);
					b = n.conv.id, y = [
						e.width,
						e.height,
						a.width,
						a.height,
						N(e.channels),
						N(a.channels)
					];
					let t = this._packedConvs.get(b);
					v = [
						{
							binding: 0,
							resource: { buffer: i.get(n.input) }
						},
						{
							binding: 1,
							resource: { buffer: t.weights }
						},
						{
							binding: 2,
							resource: { buffer: t.bias }
						},
						{
							binding: 3,
							resource: { buffer: f }
						}
					];
				} else if (n.op === "fusedUpsampleConcatConv2d") {
					b = n.conv.id;
					let e = r.valueShapes.get(n.inputs[0].value), t = r.valueShapes.get(n.inputs[1].value);
					y = [
						a.width,
						a.height,
						N(a.channels),
						N(this._model.convChannels.get(b).inputChannels),
						e.width,
						e.height,
						t.width,
						t.height
					];
					let o = this._packedConvs.get(b);
					v = [
						{
							binding: 0,
							resource: { buffer: i.get(n.inputs[0].value) }
						},
						{
							binding: 1,
							resource: { buffer: i.get(n.inputs[1].value) }
						},
						{
							binding: 2,
							resource: { buffer: o.weights }
						},
						{
							binding: 3,
							resource: { buffer: o.bias }
						},
						{
							binding: 4,
							resource: { buffer: f }
						}
					];
				} else throw Error(`Unexpected native node ${n.op}`);
				let x = l(ft(this._device, `oidn/${n.id}/params/${e}x${t}`, y));
				_.push(x), v.push({
					binding: v.length,
					resource: { buffer: x }
				}), g.push(this._device.createBindGroup({
					label: `oidn/${n.id}/bindings`,
					layout: d.getBindGroupLayout(0),
					entries: v
				}));
			});
			let v = l(ft(this._device, `oidn/input/params/${e}x${t}`, [
				e,
				t,
				N(this._model.inputChannels),
				this._model.inputChannels
			]));
			return _.push(v), {
				plan: r,
				valueBuffers: i,
				slots: a,
				nodeBindings: g,
				nodePipelines: p,
				nodeKernels: m,
				nodeFragments: h,
				inputPipeline: f,
				inputUniform: v,
				ownedBuffers: _,
				lastUsed: ++this._clock
			};
		} catch (e) {
			for (let e of c) this._releaseBuffer(e);
			throw e;
		}
	}
	_execution(e, t) {
		if (this._disposed) throw Error("Native OIDN executor is disposed");
		let n = `${e}x${t}`, r = this._executionCache.get(n);
		if (!r && (r = this._createExecution(e, t), this._executionCache.set(n, r), this._executionCache.size > this._shapeCacheSize)) {
			let e = [...this._executionCache.entries()].filter(([e]) => e !== n).sort((e, t) => e[1].lastUsed - t[1].lastUsed)[0];
			e && (this._executionCache.delete(e[0]), this._retireExecution(e[1]));
		}
		return r.lastUsed = ++this._clock, r;
	}
	_retireExecution(e) {
		this._destroyExecution(e);
	}
	prewarm(e) {
		for (let t of e) this._execution(t.width, t.height);
	}
	profileNextExecution() {
		return this._device.features.has("timestamp-query") ? (this._profileNextExecution = !0, !0) : !1;
	}
	packedInputBuffer(e, t) {
		let n = this._execution(e, t);
		return n.valueBuffers.get(n.plan.spec.input);
	}
	executePacked(e, t) {
		return this._execute([], e, t, !0);
	}
	execute(e, t, n) {
		return this._execute(e, t, n, !1);
	}
	_execute(e, t, n, r) {
		let i = this._model.inputChannels / 3;
		if (!r && e.length !== i) throw Error(`Native OIDN expected ${i} input buffers, got ${e.length}`);
		let a = this._execution(t, n), o = [...r ? [] : ["input-pack"], ...a.plan.nodes.map((e) => e.id)], s = this._profileNextExecution && this._device.features.has("timestamp-query");
		this._profileNextExecution = !1;
		let c = o.length * 2, l = s ? this._resources.track("gpu-query-set", this._device.createQuerySet({
			type: "timestamp",
			count: c
		})) : void 0, u = c * 8, d, f;
		try {
			d = s ? this._resources.track("gpu-buffer", this._device.createBuffer({
				label: `oidn/profile/resolve/${t}x${n}`,
				size: u,
				usage: O.QUERY_RESOLVE | O.COPY_SRC
			})) : void 0, f = s ? this._resources.track("gpu-buffer", this._device.createBuffer({
				label: `oidn/profile/readback/${t}x${n}`,
				size: u,
				usage: O.COPY_DST | O.MAP_READ
			})) : void 0;
		} catch (e) {
			throw this._releaseBuffer(f), this._releaseBuffer(d), this._releaseQuerySet(l), e;
		}
		let p = (e, t) => ({
			label: e,
			...l ? { timestampWrites: {
				querySet: l,
				beginningOfPassWriteIndex: t * 2,
				endOfPassWriteIndex: t * 2 + 1
			} } : {}
		});
		try {
			let o = this._device.createCommandEncoder({ label: `oidn/native/${t}x${n}` });
			if (!r) {
				let r = e.map((e, t) => ({
					binding: t,
					resource: { buffer: e }
				}));
				r.push({
					binding: i,
					resource: { buffer: a.valueBuffers.get(a.plan.spec.input) }
				}), r.push({
					binding: i + 1,
					resource: { buffer: a.inputUniform }
				});
				let s = this._device.createBindGroup({
					label: "oidn/input/bindings",
					layout: a.inputPipeline.getBindGroupLayout(0),
					entries: r
				}), c = o.beginComputePass(p("oidn/input-pack", 0));
				c.setPipeline(a.inputPipeline), c.setBindGroup(0, s), c.dispatchWorkgroups(Math.ceil(t / k), Math.ceil(n / k), N(this._model.inputChannels)), c.end();
			}
			a.plan.plannedNodes.forEach(({ node: e, outputShape: t }, n) => {
				let i = o.beginComputePass(p(`oidn/${a.plan.nodes[n].id}`, n + +!r));
				if (i.setPipeline(a.nodePipelines[n]), i.setBindGroup(0, a.nodeBindings[n]), e.op === "maxPool2d" && this._coalescedPool()) {
					let e = Math.ceil(t.width * N(t.channels) / k), n = this._device.limits.maxComputeWorkgroupsPerDimension;
					i.dispatchWorkgroups(Math.min(e, n), Math.ceil(t.height / k), Math.ceil(e / n));
				} else if (a.nodeKernels[n] === "subgroup-matrix") i.dispatchWorkgroups(Math.ceil(t.width * (e.op === "fusedConvReluMaxPool2d" ? 2 : 1) / It), Math.ceil(t.height * (e.op === "fusedConvReluMaxPool2d" ? 2 : 1) / Lt), Math.ceil(N(t.channels) / (a.nodeFragments[n] * this.subgroupMatrix.size / 4)));
				else if (a.nodeKernels[n] === "implicit-gemm") {
					let n = j(this._gemmForOutput(N(t.channels))), r = e.op === "fusedUpsampleConcatConv2d" && this._subPixelDecoder(e) !== void 0;
					i.dispatchWorkgroups(Math.ceil((r ? Math.ceil(t.width / 2) * Math.ceil(t.height / 2) : t.width * t.height) / n.tileM), Math.ceil(N(t.channels) / n.tileNBlocks), r ? 4 : 1);
				} else i.dispatchWorkgroups(Math.ceil(t.width / k), Math.ceil(t.height / k), N(t.channels));
				i.end();
			}), l && (o.resolveQuerySet(l, 0, c, d, 0), o.copyBufferToBuffer(d, 0, f, 0, u)), this._device.queue.submit([o.finish()]);
		} catch (e) {
			throw this._releaseBuffer(f), this._releaseBuffer(d), this._releaseQuerySet(l), e;
		}
		return l && (this._profileOperations++, this._readProfile(l, d, f, o)), a.valueBuffers.get(a.plan.spec.output);
	}
	_readProfile(e, t, n, r) {
		this._releaseQuerySet(e), this._releaseBuffer(t), this._releaseBuffer(n), this._profileOperations--;
	}
	_releaseBuffer(e) {
		this._resources.release("gpu-buffer", e, () => e.destroy());
	}
	_releaseQuerySet(e) {
		this._resources.release("gpu-query-set", e, () => e.destroy());
	}
	_destroyExecution(e) {
		e.slots.forEach((e) => this._releaseBuffer(e.buffer)), e.ownedBuffers.forEach((e) => this._releaseBuffer(e));
	}
	getResourceInfo() {
		return this._resources.snapshot(this._retiredExecutions.size + this._profileOperations);
	}
	dispose() {
		if (!this._disposed) {
			this._disposed = !0;
			for (let e of this._packedConvs.values()) this._releaseBuffer(e.weights), this._releaseBuffer(e.bias);
			this._packedConvs.clear();
			for (let e of this._executionCache.values()) this._destroyExecution(e);
			this._executionCache.clear();
			for (let e of this._retiredExecutions) this._destroyExecution(e);
			this._retiredExecutions.clear();
		}
	}
};
// node_modules/oidn-webgpu/lib/nativeUNet.js
function tn(e) {
	return e;
}
function nn(e, t) {
	return $t(tn(e), t);
}
function rn(e, t) {
	return Bt(tn(e), t);
}
var an = /* @__PURE__ */ new WeakMap(), on = class extends en {
	_lastExecutionProfile;
	constructor(e, t, n) {
		super(tn(e), t, n);
	}
	execute(e, t, n) {
		return super.execute(e, t, n);
	}
	get _asyncDevice() {
		return this._device;
	}
	get _pipelinePromises() {
		let e = an.get(this._device);
		return e || (e = /* @__PURE__ */ new Map(), an.set(this._device, e)), e;
	}
	getLastExecutionProfile() {
		return this._lastExecutionProfile;
	}
	_pipelineAsync(e, t) {
		let n = this._pipelineCache.get(e);
		if (n) return Promise.resolve(n);
		let r = this._pipelinePromises.get(e);
		if (r) return r;
		let i = this._asyncDevice.createComputePipelineAsync({
			label: `oidn/${e}`,
			layout: "auto",
			compute: {
				module: this._device.createShaderModule({
					label: `oidn/${e}`,
					code: t
				}),
				entryPoint: "main"
			}
		}).then((t) => (this._pipelineCache.set(e, t), this._pipelinePromises.delete(e), t), (t) => {
			throw this._pipelinePromises.delete(e), t;
		});
		return this._pipelinePromises.set(e, i), i;
	}
	_retireExecution(e) {
		this._retiredExecutions.add(e), this._asyncDevice.queue.onSubmittedWorkDone().catch(() => void 0).then(() => {
			this._retiredExecutions.delete(e), this._destroyExecution(e);
		});
	}
	async prepare() {
		if (this._disposed) throw Error("Native OIDN executor is disposed");
		let e = Le(this._model, { fuseConvPool: !1 }), t = this._model.inputChannels / 3, n = [{
			key: `pack/${this.precision}/${t}`,
			code: Nt(this.precision, t)
		}, ...e.nodes.map((t) => this._nodePipelineSpec(t, t.id === e.spec.output))];
		await Promise.all(n.map(({ key: e, code: t }) => this._pipelineAsync(e, t)));
	}
	_readProfile(e, t, n, r) {
		this._lastExecutionProfile = (async () => {
			try {
				await n.mapAsync(Ve.READ);
				let e = new Uint32Array(n.getMappedRange()), t = (t) => e[t * 2 + 1] * 4294967296 + e[t * 2], i = r.map((e, n) => ({
					id: e,
					durationMs: (t(n * 2 + 1) - t(n * 2)) / 1e6
				}));
				return {
					totalMs: i.reduce((e, t) => e + t.durationMs, 0),
					layers: i
				};
			} finally {
				n.mapState === "mapped" && n.unmap(), this._releaseQuerySet(e), this._releaseBuffer(t), this._releaseBuffer(n), this._profileOperations--;
			}
		})();
	}
	async executeCPU(e, t, n) {
		let r = t * n * this._model.inputChannels;
		if (e.length !== r) throw Error(`Native OIDN CPU input has ${e.length} values, expected ${r}`);
		let i = this._execution(t, n), a = this._model.inputChannels / 3, o = t * n;
		i.cpuInputBuffers || (i.cpuInputBuffers = Array.from({ length: a }, (e, r) => {
			let a = this._device.createBuffer({
				label: `oidn/cpu-input/${t}x${n}/${r}`,
				size: o * 16,
				usage: O.STORAGE | O.COPY_DST
			});
			return this._resources.track("gpu-buffer", a), i.ownedBuffers.push(a), a;
		}), i.cpuReadbackBuffer = this._device.createBuffer({
			label: `oidn/cpu-readback/${t}x${n}`,
			size: o * 16,
			usage: O.COPY_DST | O.MAP_READ
		}), this._resources.track("gpu-buffer", i.cpuReadbackBuffer), i.ownedBuffers.push(i.cpuReadbackBuffer));
		for (let t = 0; t < a; t++) {
			let n = new Float32Array(o * 4);
			for (let r = 0; r < o; r++) {
				let i = r * this._model.inputChannels + t * 3, a = r * 4;
				n[a] = e[i], n[a + 1] = e[i + 1], n[a + 2] = e[i + 2];
			}
			this._device.queue.writeBuffer(i.cpuInputBuffers[t], 0, new Uint8Array(n.buffer, n.byteOffset, n.byteLength));
		}
		let s = super.execute(i.cpuInputBuffers, t, n), c = this._device.createCommandEncoder({ label: `oidn/cpu-readback/${t}x${n}` });
		c.copyBufferToBuffer(s, 0, i.cpuReadbackBuffer, 0, o * 16), this._device.queue.submit([c.finish()]), await i.cpuReadbackBuffer.mapAsync(Ve.READ);
		let l = new Float32Array(i.cpuReadbackBuffer.getMappedRange()), u = new Float32Array(o * 3);
		for (let e = 0; e < o; e++) u[e * 3] = l[e * 4], u[e * 3 + 1] = l[e * 4 + 1], u[e * 3 + 2] = l[e * 4 + 2];
		return i.cpuReadbackBuffer.unmap(), u;
	}
}, sn = "This is not an object", cn = "This is not a Float16Array object", ln = "This constructor is not a subclass of Float16Array", un = "The constructor property value is not an object", dn = "Species constructor didn't return TypedArray object", fn = "Derived constructor created TypedArray object which was too small length", pn = "Attempting to access detached ArrayBuffer", mn = "Cannot convert undefined or null to object", hn = "Cannot mix BigInt and other types, use explicit conversions", gn = "@@iterator property is not callable", _n = "Reduce of empty array with no initial value", vn = "The comparison function must be either a function or undefined", yn = "Offset is out of bounds";
// node_modules/@petamoriken/float16/src/_util/primordials.mjs
function R(e) {
	return (t, ...n) => z(e, t, n);
}
function bn(e, t) {
	return R(wn(e, t).get);
}
var { apply: z, construct: xn, defineProperty: Sn, get: Cn, getOwnPropertyDescriptor: wn, getPrototypeOf: Tn, has: En, ownKeys: Dn, set: On, setPrototypeOf: kn } = Reflect, An = Proxy, { EPSILON: jn, MAX_SAFE_INTEGER: Mn, isFinite: Nn, isNaN: Pn } = Number, { iterator: B, species: Fn, toStringTag: In, for: Ln } = Symbol, Rn = Object, { create: zn, defineProperty: Bn, freeze: Vn, is: Hn } = Rn, Un = Rn.prototype, Wn = Un.__lookupGetter__ ? R(Un.__lookupGetter__) : (e, t) => {
	if (e == null) throw K(mn);
	let n = Rn(e);
	do {
		let e = wn(n, t);
		if (e !== void 0) return V(e, "get") ? e.get : void 0;
	} while ((n = Tn(n)) !== null);
}, V = Rn.hasOwn || R(Un.hasOwnProperty), Gn = Array, Kn = Gn.isArray, qn = Gn.prototype, Jn = R(qn.join), Yn = R(qn.push), Xn = R(qn.toLocaleString), Zn = qn[B], Qn = R(Zn), { abs: $n, trunc: er } = Math, tr = ArrayBuffer, nr = tr.isView, rr = tr.prototype, ir = R(rr.slice), ar = bn(rr, "byteLength"), or = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : null, sr = or && bn(or.prototype, "byteLength"), cr = Tn(Uint8Array), lr = cr.from, H = cr.prototype, ur = H[B], dr = R(H.keys), fr = R(H.values), pr = R(H.entries), mr = R(H.set), hr = R(H.reverse), gr = R(H.fill), _r = R(H.copyWithin), vr = R(H.sort), yr = R(H.slice), br = R(H.subarray), U = bn(H, "buffer"), xr = bn(H, "byteOffset"), W = bn(H, "length"), Sr = bn(H, In), Cr = Uint8Array, G = Uint16Array, wr = (...e) => z(lr, G, e), Tr = Uint32Array, Er = Float32Array, Dr = Tn([][B]()), Or = R(Dr.next), kr = R((function* () {})().next), Ar = Tn(Dr), jr = DataView.prototype;
jr.getUint16, jr.setUint16;
var K = TypeError, Mr = RangeError, Nr = WeakSet, Pr = Nr.prototype, Fr = R(Pr.add), Ir = R(Pr.has), Lr = WeakMap, Rr = Lr.prototype, zr = R(Rr.get), Br = R(Rr.has), Vr = R(Rr.set), Hr = new Lr(), Ur = zn(null, {
	next: { value: function() {
		return Or(zr(Hr, this));
	} },
	[B]: { value: function() {
		return this;
	} }
});
function Wr(e) {
	if (e[B] === Zn && Dr.next === Or) return e;
	let t = zn(Ur);
	return Vr(Hr, t, Qn(e)), t;
}
var Gr = new Lr(), Kr = zn(Ar, { next: {
	value: function() {
		return kr(zr(Gr, this));
	},
	writable: !0,
	configurable: !0
} });
for (let e of Dn(Dr)) e !== "next" && Bn(Kr, e, wn(Dr, e));
function qr(e) {
	let t = zn(Kr);
	return Vr(Gr, t, e), t;
}
// node_modules/@petamoriken/float16/src/_util/is.mjs
function Jr(e) {
	return typeof e == "object" && !!e || typeof e == "function";
}
function Yr(e) {
	return typeof e == "object" && !!e;
}
function Xr(e) {
	return Sr(e) !== void 0;
}
function Zr(e) {
	let t = Sr(e);
	return t === "BigInt64Array" || t === "BigUint64Array";
}
function Qr(e) {
	try {
		return !Kn(e) && (ar(e), !0);
	} catch {
		return !1;
	}
}
function $r(e) {
	if (or === null) return !1;
	try {
		return sr(e), !0;
	} catch {
		return !1;
	}
}
function ei(e) {
	return Qr(e) || $r(e);
}
function ti(e) {
	return Kn(e) ? e[B] === Zn && Dr.next === Or : !1;
}
function ni(e) {
	return Xr(e) ? e[B] === ur && Dr.next === Or : !1;
}
function ri(e) {
	if (typeof e != "string") return !1;
	let t = +e;
	return e !== t + "" || !Nn(t) ? !1 : t === er(t);
}
// node_modules/@petamoriken/float16/src/_util/brand.mjs
var ii = Ln("__Float16Array__");
function ai(e) {
	if (!Yr(e)) return !1;
	let t = Tn(e);
	if (!Yr(t)) return !1;
	let n = t.constructor;
	if (n === void 0) return !1;
	if (!Jr(n)) throw K(un);
	return En(n, ii);
}
// node_modules/@petamoriken/float16/src/_util/converter.mjs
var oi = 1 / jn;
function si(e) {
	return e + oi - oi;
}
var ci = 6103515625e-14, li = 65504, ui = .0009765625, di = ui * ci, fi = ui * oi;
function pi(e) {
	let t = +e;
	if (!Nn(t) || t === 0) return t;
	let n = t > 0 ? 1 : -1, r = $n(t);
	if (r < ci) return n * si(r / di) * di;
	let i = (1 + fi) * r, a = i - (i - r);
	return a > li || Pn(a) ? n * Infinity : n * a;
}
var mi = new tr(4), hi = new Er(mi), gi = new Tr(mi), q = new G(512), J = new Cr(512);
for (let e = 0; e < 256; ++e) {
	let t = e - 127;
	t < -24 ? (q[e] = 0, q[e | 256] = 32768, J[e] = 24, J[e | 256] = 24) : t < -14 ? (q[e] = 1024 >> -t - 14, q[e | 256] = 1024 >> -t - 14 | 32768, J[e] = -t - 1, J[e | 256] = -t - 1) : t <= 15 ? (q[e] = t + 15 << 10, q[e | 256] = t + 15 << 10 | 32768, J[e] = 13, J[e | 256] = 13) : t < 128 ? (q[e] = 31744, q[e | 256] = 64512, J[e] = 24, J[e | 256] = 24) : (q[e] = 31744, q[e | 256] = 64512, J[e] = 13, J[e | 256] = 13);
}
function Y(e) {
	hi[0] = pi(e);
	let t = gi[0], n = t >> 23 & 511;
	return q[n] + ((t & 8388607) >> J[n]);
}
var _i = new Tr(2048);
for (let e = 1; e < 1024; ++e) {
	let t = e << 13, n = 0;
	for (; !(t & 8388608);) t <<= 1, n -= 8388608;
	t &= -8388609, n += 947912704, _i[e] = t | n;
}
for (let e = 1024; e < 2048; ++e) _i[e] = 939524096 + (e - 1024 << 13);
var vi = new Tr(64);
for (let e = 1; e < 31; ++e) vi[e] = e << 23;
vi[31] = 1199570944, vi[32] = 2147483648;
for (let e = 33; e < 63; ++e) vi[e] = 2147483648 + (e - 32 << 23);
vi[63] = 3347054592;
var yi = new G(64);
for (let e = 1; e < 64; ++e) e !== 32 && (yi[e] = 1024);
function X(e) {
	let t = e >> 10;
	return gi[0] = _i[yi[t] + (e & 1023)] + vi[t], hi[0];
}
// node_modules/@petamoriken/float16/src/_util/spec.mjs
function bi(e) {
	let t = +e;
	return Pn(t) || t === 0 ? 0 : er(t);
}
function xi(e) {
	let t = bi(e);
	return t < 0 ? 0 : t < Mn ? t : Mn;
}
function Si(e, t) {
	if (!Jr(e)) throw K(sn);
	let n = e.constructor;
	if (n === void 0) return t;
	if (!Jr(n)) throw K(un);
	return n[Fn] ?? t;
}
function Ci(e) {
	if ($r(e)) return !1;
	try {
		return ir(e, 0, 0), !1;
	} catch {}
	return !0;
}
function wi(e, t) {
	let n = Pn(e), r = Pn(t);
	if (n && r) return 0;
	if (n) return 1;
	if (r || e < t) return -1;
	if (e > t) return 1;
	if (e === 0 && t === 0) {
		let n = Hn(e, 0), r = Hn(t, 0);
		if (!n && r) return -1;
		if (n && !r) return 1;
	}
	return 0;
}
// node_modules/@petamoriken/float16/src/Float16Array.mjs
var Ti = 2, Ei = new Lr();
function Di(e) {
	return Br(Ei, e) || !nr(e) && ai(e);
}
function Z(e) {
	if (!Di(e)) throw K(cn);
}
function Oi(e, t) {
	let n = Di(e), r = Xr(e);
	if (!n && !r) throw K(dn);
	if (typeof t == "number") {
		let r;
		if (r = W(n ? Q(e) : e), r < t) throw K(fn);
	}
	if (Zr(e)) throw K(hn);
}
function Q(e) {
	let t = zr(Ei, e);
	if (t !== void 0) {
		if (Ci(U(t))) throw K(pn);
		return t;
	}
	let n = e.buffer;
	if (Ci(n)) throw K(pn);
	return zr(Ei, xn($, [
		n,
		e.byteOffset,
		e.length
	], e.constructor));
}
function ki(e) {
	let t = W(e), n = [];
	for (let r = 0; r < t; ++r) n[r] = X(e[r]);
	return n;
}
var Ai = new Nr();
for (let e of Dn(H)) {
	if (e === In) continue;
	let t = wn(H, e);
	V(t, "get") && typeof t.get == "function" && Fr(Ai, t.get);
}
var ji = Vn({
	get(e, t, n) {
		return ri(t) && V(e, t) ? X(Cn(e, t)) : Ir(Ai, Wn(e, t)) ? Cn(e, t) : Cn(e, t, n);
	},
	set(e, t, n, r) {
		return ri(t) && V(e, t) ? On(e, t, Y(n)) : On(e, t, n, r);
	},
	getOwnPropertyDescriptor(e, t) {
		if (ri(t) && V(e, t)) {
			let n = wn(e, t);
			return n.value = X(n.value), n;
		}
		return wn(e, t);
	},
	defineProperty(e, t, n) {
		return ri(t) && V(e, t) && V(n, "value") && (n.value = Y(n.value)), Sn(e, t, n);
	}
}), $ = class e {
	constructor(e, t, n) {
		let r;
		if (Di(e)) r = xn(G, [Q(e)], new.target);
		else if (Jr(e) && !ei(e)) {
			let t, n;
			if (Xr(e)) {
				if (t = e, n = W(e), Ci(U(e))) throw K(pn);
				if (Zr(e)) throw K(hn);
				r = xn(G, [new tr(n * Ti)], new.target);
			} else {
				let i = e[B];
				if (i != null && typeof i != "function") throw K(gn);
				i == null ? (t = e, n = xi(t.length)) : ti(e) ? (t = e, n = e.length) : (t = [...e], n = t.length), r = xn(G, [n], new.target);
			}
			for (let e = 0; e < n; ++e) r[e] = Y(t[e]);
		} else r = xn(G, arguments, new.target);
		let i = new An(r, ji);
		return Vr(Ei, i, r), i;
	}
	static from(t, ...n) {
		let r = this;
		if (!En(r, ii)) throw K(ln);
		if (r === e) {
			if (Di(t) && n.length === 0) {
				let n = Q(t), r = new G(U(n), xr(n), W(n));
				return new e(U(yr(r)));
			}
			if (n.length === 0) return new e(U(wr(t, Y)));
			let r = n[0], i = n[1];
			return new e(U(wr(t, function(e, ...t) {
				return Y(z(r, this, [e, ...Wr(t)]));
			}, i)));
		}
		let i, a, o = t[B];
		if (o != null && typeof o != "function") throw K(gn);
		if (o != null) ti(t) ? (i = t, a = t.length) : ni(t) ? (i = t, a = W(t)) : (i = [...t], a = i.length);
		else {
			if (t == null) throw K(mn);
			i = Rn(t), a = xi(i.length);
		}
		let s = new r(a);
		if (n.length === 0) for (let e = 0; e < a; ++e) s[e] = i[e];
		else {
			let e = n[0], t = n[1];
			for (let n = 0; n < a; ++n) s[n] = z(e, t, [i[n], n]);
		}
		return s;
	}
	static of(...t) {
		let n = this;
		if (!En(n, ii)) throw K(ln);
		let r = t.length;
		if (n === e) {
			let n = new e(r), i = Q(n);
			for (let e = 0; e < r; ++e) i[e] = Y(t[e]);
			return n;
		}
		let i = new n(r);
		for (let e = 0; e < r; ++e) i[e] = t[e];
		return i;
	}
	keys() {
		return Z(this), dr(Q(this));
	}
	values() {
		Z(this);
		let e = Q(this);
		return qr((function* () {
			for (let t of fr(e)) yield X(t);
		})());
	}
	entries() {
		Z(this);
		let e = Q(this);
		return qr((function* () {
			for (let [t, n] of pr(e)) yield [t, X(n)];
		})());
	}
	at(e) {
		Z(this);
		let t = Q(this), n = W(t), r = bi(e), i = r >= 0 ? r : n + r;
		if (!(i < 0 || i >= n)) return X(t[i]);
	}
	with(t, n) {
		Z(this);
		let r = Q(this), i = W(r), a = bi(t), o = a >= 0 ? a : i + a, s = +n;
		if (o < 0 || o >= i) throw Mr(yn);
		let c = new G(U(r), xr(r), W(r)), l = new e(U(yr(c))), u = Q(l);
		return u[o] = Y(s), l;
	}
	map(t, ...n) {
		Z(this);
		let r = Q(this), i = W(r), a = n[0], o = Si(r, e);
		if (o === e) {
			let n = new e(i), o = Q(n);
			for (let e = 0; e < i; ++e) {
				let n = X(r[e]);
				o[e] = Y(z(t, a, [
					n,
					e,
					this
				]));
			}
			return n;
		}
		let s = new o(i);
		Oi(s, i);
		for (let e = 0; e < i; ++e) {
			let n = X(r[e]);
			s[e] = z(t, a, [
				n,
				e,
				this
			]);
		}
		return s;
	}
	filter(t, ...n) {
		Z(this);
		let r = Q(this), i = W(r), a = n[0], o = [];
		for (let e = 0; e < i; ++e) {
			let n = X(r[e]);
			z(t, a, [
				n,
				e,
				this
			]) && Yn(o, n);
		}
		let s = new (Si(r, e))(o);
		return Oi(s), s;
	}
	reduce(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n);
		if (r === 0 && t.length === 0) throw K(_n);
		let i, a;
		t.length === 0 ? (i = X(n[0]), a = 1) : (i = t[0], a = 0);
		for (let t = a; t < r; ++t) i = e(i, X(n[t]), t, this);
		return i;
	}
	reduceRight(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n);
		if (r === 0 && t.length === 0) throw K(_n);
		let i, a;
		t.length === 0 ? (i = X(n[r - 1]), a = r - 2) : (i = t[0], a = r - 1);
		for (let t = a; t >= 0; --t) i = e(i, X(n[t]), t, this);
		return i;
	}
	forEach(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n), i = t[0];
		for (let t = 0; t < r; ++t) z(e, i, [
			X(n[t]),
			t,
			this
		]);
	}
	find(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n), i = t[0];
		for (let t = 0; t < r; ++t) {
			let r = X(n[t]);
			if (z(e, i, [
				r,
				t,
				this
			])) return r;
		}
	}
	findIndex(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n), i = t[0];
		for (let t = 0; t < r; ++t) if (z(e, i, [
			X(n[t]),
			t,
			this
		])) return t;
		return -1;
	}
	findLast(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n), i = t[0];
		for (let t = r - 1; t >= 0; --t) {
			let r = X(n[t]);
			if (z(e, i, [
				r,
				t,
				this
			])) return r;
		}
	}
	findLastIndex(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n), i = t[0];
		for (let t = r - 1; t >= 0; --t) if (z(e, i, [
			X(n[t]),
			t,
			this
		])) return t;
		return -1;
	}
	every(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n), i = t[0];
		for (let t = 0; t < r; ++t) if (!z(e, i, [
			X(n[t]),
			t,
			this
		])) return !1;
		return !0;
	}
	some(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n), i = t[0];
		for (let t = 0; t < r; ++t) if (z(e, i, [
			X(n[t]),
			t,
			this
		])) return !0;
		return !1;
	}
	set(e, ...t) {
		Z(this);
		let n = Q(this), r = bi(t[0]);
		if (r < 0) throw Mr(yn);
		if (e == null) throw K(mn);
		if (Zr(e)) throw K(hn);
		if (Di(e)) return mr(Q(this), Q(e), r);
		if (Xr(e) && Ci(U(e))) throw K(pn);
		let i = W(n), a = Rn(e), o = xi(a.length);
		if (r === Infinity || o + r > i) throw Mr(yn);
		for (let e = 0; e < o; ++e) n[e + r] = Y(a[e]);
	}
	reverse() {
		return Z(this), hr(Q(this)), this;
	}
	toReversed() {
		Z(this);
		let t = Q(this), n = new G(U(t), xr(t), W(t)), r = new e(U(yr(n)));
		return hr(Q(r)), r;
	}
	fill(e, ...t) {
		return Z(this), gr(Q(this), Y(e), ...Wr(t)), this;
	}
	copyWithin(e, t, ...n) {
		return Z(this), _r(Q(this), e, t, ...Wr(n)), this;
	}
	sort(e) {
		Z(this);
		let t = Q(this), n = e === void 0 ? wi : e;
		return vr(t, (e, t) => n(X(e), X(t))), this;
	}
	toSorted(t) {
		Z(this);
		let n = Q(this);
		if (t !== void 0 && typeof t != "function") throw new K(vn);
		let r = t === void 0 ? wi : t, i = new G(U(n), xr(n), W(n)), a = new e(U(yr(i)));
		return vr(Q(a), (e, t) => r(X(e), X(t))), a;
	}
	slice(t, n) {
		Z(this);
		let r = Q(this), i = Si(r, e);
		if (i === e) {
			let i = new G(U(r), xr(r), W(r));
			return new e(U(yr(i, t, n)));
		}
		let a = W(r), o = bi(t), s = n === void 0 ? a : bi(n), c;
		c = o === -Infinity ? 0 : o < 0 ? a + o > 0 ? a + o : 0 : a < o ? a : o;
		let l;
		l = s === -Infinity ? 0 : s < 0 ? a + s > 0 ? a + s : 0 : a < s ? a : s;
		let u = l - c > 0 ? l - c : 0, d = new i(u);
		if (Oi(d, u), u === 0) return d;
		if (Ci(U(r))) throw K(pn);
		let f = 0;
		for (; c < l;) d[f] = X(r[c]), ++c, ++f;
		return d;
	}
	subarray(t, n) {
		Z(this);
		let r = Q(this), i = Si(r, e), a = br(new G(U(r), xr(r), W(r)), t, n), o = new i(U(a), xr(a), W(a));
		return Oi(o), o;
	}
	indexOf(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n), i = bi(t[0]);
		if (i === Infinity) return -1;
		i < 0 && (i += r, i < 0 && (i = 0));
		for (let t = i; t < r; ++t) if (V(n, t) && X(n[t]) === e) return t;
		return -1;
	}
	lastIndexOf(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n), i = t.length >= 1 ? bi(t[0]) : r - 1;
		if (i === -Infinity) return -1;
		i >= 0 ? i = i < r - 1 ? i : r - 1 : i += r;
		for (let t = i; t >= 0; --t) if (V(n, t) && X(n[t]) === e) return t;
		return -1;
	}
	includes(e, ...t) {
		Z(this);
		let n = Q(this), r = W(n), i = bi(t[0]);
		if (i === Infinity) return !1;
		i < 0 && (i += r, i < 0 && (i = 0));
		let a = Pn(e);
		for (let t = i; t < r; ++t) {
			let r = X(n[t]);
			if (a && Pn(r) || r === e) return !0;
		}
		return !1;
	}
	join(e) {
		return Z(this), Jn(ki(Q(this)), e);
	}
	toLocaleString(...e) {
		return Z(this), Xn(ki(Q(this)), ...Wr(e));
	}
	get [In]() {
		if (Di(this)) return "Float16Array";
	}
};
Bn($, "BYTES_PER_ELEMENT", { value: Ti }), Bn($, ii, {}), kn($, cr);
var Mi = $.prototype;
Bn(Mi, "BYTES_PER_ELEMENT", { value: Ti }), Bn(Mi, B, {
	value: Mi.values,
	writable: !0,
	configurable: !0
}), kn(Mi, H);
// node_modules/oidn-webgpu/lib/webnnUNet.js
var Ni = /* @__PURE__ */ new WeakMap();
function Pi(e, t) {
	let n = Ni.get(e);
	n || (n = /* @__PURE__ */ new Map(), Ni.set(e, n));
	let r = n.get(t);
	if (!r) {
		let i = e.createShaderModule({
			label: `oidn/webnn/input-pack/${t}`,
			code: Vi(t)
		}), a = e.createShaderModule({
			label: "oidn/webnn/output-unpack",
			code: Hi()
		});
		r = {
			input: e.createComputePipeline({
				label: `oidn/webnn/input-pack/${t}`,
				layout: "auto",
				compute: {
					module: i,
					entryPoint: "main"
				}
			}),
			output: e.createComputePipeline({
				label: "oidn/webnn/output-unpack",
				layout: "auto",
				compute: {
					module: a,
					entryPoint: "main"
				}
			})
		}, n.set(t, r);
	}
	return r;
}
var Fi = 8;
function Ii(e, t) {
	return Math.ceil(e / t) * t;
}
function Li(e, t, n, r) {
	let i = e.createBuffer({
		label: t,
		size: Ii(n.byteLength, 4),
		usage: r,
		mappedAtCreation: !0
	});
	return new Uint8Array(i.getMappedRange()).set(new Uint8Array(n.buffer, n.byteOffset, n.byteLength)), i.unmap(), i;
}
function Ri(e, t, n) {
	let r = new Uint32Array(Ii(n.length, 4));
	return r.set(n), Li(e, t, r, GPUBufferUsage.UNIFORM);
}
function zi(e, t, n, r) {
	return !!e?.[t]?.[n]?.dataTypes?.includes?.(r);
}
function Bi(e, t) {
	if (t === "fp16" && e.desc.dataType === "Float16" || t === "fp32" && e.desc.dataType === "Float32") return new Uint8Array(e.data.buffer, e.data.byteOffset, e.data.byteLength);
	let n = e.desc.dataType === "Float32" ? new Float32Array(e.data.buffer, e.data.byteOffset, e.data.byteLength / 4) : new $(e.data.buffer, e.data.byteOffset, e.data.byteLength / 2), r = t === "fp16" ? new $(n) : new Float32Array(n);
	return new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
}
function Vi(e) {
	let t = Array.from({ length: e }, (e, t) => `@group(0) @binding(${t}) var<storage, read> input${t}: array<vec4<f32>>;`).join("\n"), n = Array.from({ length: e }, (e, t) => {
		let n = t * 3;
		return `if (channel < ${n + 3}u) {
      return input${t}[pixel][channel - ${n}u];
    }`;
	}).join("\n  ");
	return `enable f16;
struct Params { width: u32, height: u32, channels: u32, padding: u32 }
${t}
@group(0) @binding(${e}) var<storage, read_write> outputData: array<f16>;
@group(0) @binding(${e + 1}) var<uniform> params: Params;

fn readChannel(pixel: u32, channel: u32) -> f32 {
  ${n}
  return 0.0;
}

@compute @workgroup_size(${Fi}, ${Fi}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= params.width || gid.y >= params.height || gid.z >= params.channels) {
    return;
  }
  let pixel = gid.y * params.width + gid.x;
  let outputIndex = (gid.z * params.height + gid.y) * params.width + gid.x;
  outputData[outputIndex] = f16(readChannel(pixel, gid.z));
}
`;
}
function Hi() {
	return `enable f16;
struct Params { width: u32, height: u32, padding0: u32, padding1: u32 }
@group(0) @binding(0) var<storage, read> inputData: array<f16>;
@group(0) @binding(1) var<storage, read_write> outputData: array<vec4<f32>>;
@group(0) @binding(2) var<uniform> params: Params;

@compute @workgroup_size(${Fi}, ${Fi}, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= params.width || gid.y >= params.height) { return; }
  let pixel = gid.y * params.width + gid.x;
  let plane = params.width * params.height;
  outputData[pixel] = vec4<f32>(
    f32(inputData[pixel]),
    f32(inputData[plane + pixel]),
    f32(inputData[plane * 2u + pixel]),
    0.0
  );
}
`;
}
function Ui(e, t) {
	if (t === "fp32") throw Error("OIDN WebNN GPU interop currently requires FP16 exportable tensors");
	if (!e.features.has("shader-f16")) throw Error("OIDN WebNN requires shader-f16 on the shared GPUDevice");
	return "fp16";
}
function Wi(e, t, n) {
	return n === "relu" ? e.relu(t) : t;
}
var Gi = class {
	_device;
	_model;
	precision;
	support;
	_context;
	_builderConstructor;
	_shapeCache = /* @__PURE__ */ new Map();
	_shapePromises = /* @__PURE__ */ new Map();
	_retiredExecutions = /* @__PURE__ */ new Set();
	_pendingCreationCount = 0;
	_shapeCacheSize;
	_clock = 0;
	_inputPipeline;
	_outputPipeline;
	_resources = new Xe();
	_disposed = !1;
	constructor(e, t, n = {}) {
		this._device = e, this._model = t, this.precision = Ui(e, n.precision ?? "auto"), this._shapeCacheSize = Math.max(1, n.shapeCacheSize ?? 2), this.support = {
			available: !1,
			fp16Conv: !1,
			gpuInterop: !1
		};
		let r = Pi(e, t.inputChannels / 3);
		this._inputPipeline = r.input, this._outputPipeline = r.output;
	}
	async prepare() {
		if (this._disposed) throw Error("OIDN WebNN executor is disposed");
		let e = globalThis.navigator?.ml, t = globalThis.MLGraphBuilder;
		if (!e?.createContext || typeof t != "function") throw this.support.reason = "WebNN is not exposed by this browser", Error(this.support.reason);
		this._builderConstructor = t;
		try {
			try {
				this._context = await e.createContext({
					deviceType: "gpu",
					powerPreference: "high-performance"
				});
			} catch {
				this._context = await e.createContext({ deviceType: "gpu" });
			}
			if (this._resources.track("ml-context", this._context), this._disposed) throw Error("OIDN WebNN executor is disposed");
			if (typeof this._context.createExportableTensor != "function" || typeof this._context.exportToGPU != "function") throw this.support.reason = "WebNN WebGPU tensor interop is unavailable", Error(this.support.reason);
			let t = this._context.opSupportLimits?.() ?? {};
			if (this.support.fp16Conv = zi(t, "conv2d", "input", "float16") && zi(t, "conv2d", "filter", "float16") && zi(t, "conv2d", "output", "float16"), !this.support.fp16Conv) throw this.support.reason = "WebNN does not support FP16 conv2d", Error(this.support.reason);
			let n, r;
			try {
				n = this._resources.track("ml-tensor", await this._context.createExportableTensor({
					dataType: "float16",
					shape: [4]
				}, this._device)), r = this._resources.track("gpu-buffer", await this._context.exportToGPU(n)), this.support.gpuInterop = !0;
			} catch (e) {
				throw this.support.reason = `WebNN FP16 WebGPU interop failed: ${String(e)}`, Error(this.support.reason);
			} finally {
				this._releaseBuffer(r), this._releaseTensor(n);
			}
			this.support.available = !0;
		} catch (e) {
			throw this._releaseContext(), e;
		}
	}
	_constant(e, t) {
		return e.constant({
			dataType: "float16",
			shape: [...t.desc.dims]
		}, Bi(t, this.precision));
	}
	async _createExecution(e, t) {
		if (this._disposed) throw Error("OIDN WebNN executor is disposed");
		let n = new this._builderConstructor(this._context), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
		r.set(this._model.spec.input, n.input("input", {
			dataType: "float16",
			shape: [
				1,
				this._model.inputChannels,
				t,
				e
			]
		})), i.set(this._model.spec.input, [
			this._model.inputChannels,
			t,
			e
		]);
		for (let e of this._model.spec.nodes) {
			let t, a;
			if (e.op === "conv2d") {
				let o = i.get(e.input), s = this._model.convTensors.get(e.id);
				t = Wi(n, n.conv2d(r.get(e.input), this._constant(n, s.weight), {
					bias: this._constant(n, s.bias),
					padding: [
						1,
						1,
						1,
						1
					],
					inputLayout: "nchw",
					filterLayout: "oihw"
				}), e.activation), a = [
					s.outputChannels,
					o[1],
					o[2]
				];
			} else if (e.op === "maxPool2d") {
				let o = i.get(e.input);
				t = n.maxPool2d(r.get(e.input), {
					windowDimensions: [2, 2],
					strides: [2, 2],
					padding: [
						0,
						o[1] % 2,
						0,
						o[2] % 2
					],
					layout: "nchw"
				}), a = [
					o[0],
					Math.ceil(o[1] / 2),
					Math.ceil(o[2] / 2)
				];
			} else if (e.op === "upsample2d") {
				let o = i.get(e.input);
				t = n.resample2d(r.get(e.input), {
					mode: "nearest-neighbor",
					axes: [2, 3],
					scales: [2, 2]
				}), a = [
					o[0],
					o[1] * 2,
					o[2] * 2
				];
			} else {
				let o = e.inputs.map((e) => i.get(e));
				if (o.some((e) => e[1] !== o[0][1] || e[2] !== o[0][2])) throw Error(`WebNN concat ${e.id} has mismatched spatial shapes`);
				t = n.concat(e.inputs.map((e) => r.get(e)), 1), a = [
					o.reduce((e, t) => e + t[0], 0),
					o[0][1],
					o[0][2]
				];
			}
			r.set(e.id, t), i.set(e.id, a);
		}
		let a, o, s, c, l, u;
		try {
			return a = this._resources.track("ml-graph", await n.build({ output: r.get(this._model.spec.output) })), o = this._resources.track("ml-tensor", await this._context.createExportableTensor({
				dataType: "float16",
				shape: [
					1,
					this._model.inputChannels,
					t,
					e
				],
				writable: !0
			}, this._device)), s = this._resources.track("ml-tensor", await this._context.createExportableTensor({
				dataType: "float16",
				shape: [
					1,
					this._model.outputChannels,
					t,
					e
				],
				readable: !0
			}, this._device)), c = this._resources.track("gpu-buffer", this._device.createBuffer({
				label: `oidn/webnn/output/${e}x${t}`,
				size: e * t * 4 * 4,
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
			})), l = this._resources.track("gpu-buffer", Ri(this._device, `oidn/webnn/input/${e}x${t}`, [
				e,
				t,
				this._model.inputChannels
			])), u = this._resources.track("gpu-buffer", Ri(this._device, `oidn/webnn/output/${e}x${t}`, [e, t])), {
				graph: a,
				inputTensor: o,
				outputTensor: s,
				outputBuffer: c,
				inputUniform: l,
				outputUniform: u,
				width: e,
				height: t,
				lastUsed: ++this._clock
			};
		} catch (e) {
			throw this._releaseBuffer(u), this._releaseBuffer(l), this._releaseBuffer(c), this._releaseTensor(s), this._releaseTensor(o), this._releaseGraph(a), e;
		}
	}
	async _execution(e, t) {
		let n = `${e}x${t}`, r = this._shapeCache.get(n);
		if (!r) {
			let i = this._shapePromises.get(n);
			i || (i = (async () => {
				this._pendingCreationCount++;
				try {
					return await this._createExecution(e, t);
				} finally {
					this._pendingCreationCount--;
				}
			})(), this._shapePromises.set(n, i));
			try {
				if (r = await i, this._disposed) throw this._destroyExecution(r), Error("OIDN WebNN executor is disposed");
				this._shapeCache.set(n, r);
			} finally {
				this._shapePromises.get(n) === i && this._shapePromises.delete(n);
			}
			if (this._shapeCache.size > this._shapeCacheSize) {
				let e = [...this._shapeCache.entries()].filter(([e]) => e !== n).sort((e, t) => e[1].lastUsed - t[1].lastUsed)[0];
				e && (this._shapeCache.delete(e[0]), this._retireExecution(e[1]));
			}
		}
		return r.lastUsed = ++this._clock, r;
	}
	async prewarm(e) {
		for (let t of e) await this._execution(t.width, t.height);
	}
	async execute(e, t, n) {
		let r = this._model.inputChannels / 3;
		if (e.length !== r) throw Error(`OIDN WebNN expected ${r} input buffers, got ${e.length}`);
		let i = await this._execution(t, n), a = this._resources.track("gpu-buffer", await this._context.exportToGPU(i.inputTensor));
		try {
			let o = e.map((e, t) => ({
				binding: t,
				resource: { buffer: e }
			}));
			o.push({
				binding: r,
				resource: { buffer: a }
			}), o.push({
				binding: r + 1,
				resource: { buffer: i.inputUniform }
			});
			let s = this._device.createBindGroup({
				label: "oidn/webnn/input-bindings",
				layout: this._inputPipeline.getBindGroupLayout(0),
				entries: o
			}), c = this._device.createCommandEncoder({ label: "oidn/webnn/input-pack" }), l = c.beginComputePass();
			l.setPipeline(this._inputPipeline), l.setBindGroup(0, s), l.dispatchWorkgroups(Math.ceil(t / Fi), Math.ceil(n / Fi), this._model.inputChannels), l.end(), this._device.queue.submit([c.finish()]);
		} finally {
			this._releaseBuffer(a);
		}
		this._context.dispatch(i.graph, { input: i.inputTensor }, { output: i.outputTensor });
		let o = this._resources.track("gpu-buffer", await this._context.exportToGPU(i.outputTensor));
		try {
			let e = this._device.createBindGroup({
				label: "oidn/webnn/output-bindings",
				layout: this._outputPipeline.getBindGroupLayout(0),
				entries: [
					{
						binding: 0,
						resource: { buffer: o }
					},
					{
						binding: 1,
						resource: { buffer: i.outputBuffer }
					},
					{
						binding: 2,
						resource: { buffer: i.outputUniform }
					}
				]
			}), r = this._device.createCommandEncoder({ label: "oidn/webnn/output-unpack" }), a = r.beginComputePass();
			a.setPipeline(this._outputPipeline), a.setBindGroup(0, e), a.dispatchWorkgroups(Math.ceil(t / Fi), Math.ceil(n / Fi)), a.end(), this._device.queue.submit([r.finish()]);
		} finally {
			this._releaseBuffer(o);
		}
		return i.outputBuffer;
	}
	async executeCPU(e, t, n) {
		let r = await this._execution(t, n), i = t * n, a = new $(i * this._model.inputChannels);
		for (let t = 0; t < i; t++) for (let n = 0; n < this._model.inputChannels; n++) a[n * i + t] = e[t * this._model.inputChannels + n];
		this._context.writeTensor(r.inputTensor, a), this._context.dispatch(r.graph, { input: r.inputTensor }, { output: r.outputTensor });
		let o = new $(await this._context.readTensor(r.outputTensor)), s = new Float32Array(i * this._model.outputChannels);
		for (let e = 0; e < i; e++) for (let t = 0; t < this._model.outputChannels; t++) s[e * this._model.outputChannels + t] = o[t * i + e];
		return s;
	}
	_destroyExecution(e) {
		this._releaseGraph(e.graph), this._releaseTensor(e.inputTensor), this._releaseTensor(e.outputTensor), this._releaseBuffer(e.outputBuffer), this._releaseBuffer(e.inputUniform), this._releaseBuffer(e.outputUniform);
	}
	_retireExecution(e) {
		this._retiredExecutions.add(e), this._device.queue.onSubmittedWorkDone().catch(() => void 0).then(() => {
			this._retiredExecutions.delete(e), this._destroyExecution(e);
		});
	}
	_releaseBuffer(e) {
		this._resources.release("gpu-buffer", e, () => e.destroy());
	}
	_releaseTensor(e) {
		this._resources.release("ml-tensor", e, () => e.destroy());
	}
	_releaseGraph(e) {
		this._resources.release("ml-graph", e, () => e.destroy?.());
	}
	_releaseContext() {
		this._resources.release("ml-context", this._context, () => this._context.destroy?.());
	}
	getResourceInfo() {
		return this._resources.snapshot(this._pendingCreationCount + this._retiredExecutions.size);
	}
	dispose() {
		if (!this._disposed) {
			this._disposed = !0;
			for (let e of this._shapeCache.values()) this._destroyExecution(e);
			this._shapeCache.clear();
			for (let e of this._retiredExecutions) this._destroyExecution(e);
			this._retiredExecutions.clear(), this._shapePromises.clear(), this._releaseContext();
		}
	}
}, Ki = 100;
function qi(e, t) {
	return Math.ceil(e / t) * t;
}
function Ji(e) {
	return e.data instanceof GPUBuffer || e.data instanceof GPUTexture;
}
var Yi = class {
	_device;
	_aux;
	_hdr;
	_hdrTransfer;
	_dataProcessGPU;
	_nativeExecutor;
	_webNNExecutor;
	_modelSpec;
	_inputChannels;
	_engine;
	_dynamicTileController;
	_lastExecution;
	_profileNextImage = !1;
	_lastImageProfile;
	_activeExecutionFailures = /* @__PURE__ */ new Set();
	_deviceLostObserved = !1;
	_deviceLostSettled = !1;
	_deviceLostReason;
	constructor(e, t, n = {}) {
		this._aux = n.aux || !1, this._hdr = n.hdr || !1, this._hdrTransfer = n.hdrTransfer ?? "pu", this._engine = n.engine ?? "auto";
		let r = Ne(e, n.modelSpec ?? je(e));
		this._modelSpec = r.spec, this._inputChannels = r.inputChannels;
		let i = this._aux ? 9 : 3;
		if (r.inputChannels !== i) throw Error(`OIDN model expects ${r.inputChannels} input channels, but aux=${this._aux} provides ${i}`);
		this._dynamicTileController = new xe(n.maxTileSize ?? 512, n.dynamicTile), this._device = t, this._observeDeviceLoss(), this._engine === "webnn" ? this._webNNExecutor = new Gi(this._device, r, { precision: n.precision }) : this._nativeExecutor = new on(this._device, r, {
			precision: n.precision,
			kernel: n.kernel,
			gemm: n.gemm,
			subgroupMatrix: n.subgroupMatrix
		});
	}
	getDevice() {
		return this._device;
	}
	async prepare() {
		if (this._webNNExecutor) {
			await this._webNNExecutor.prepare();
			let e = qi(this._modelSpec.receptiveField / 2, 16), t = [this._dynamicTileController.tileSize, this._dynamicTileController.minTileSize];
			await this._webNNExecutor.prewarm([...new Set(t)].map((t) => ({
				width: t + 2 * e,
				height: t + 2 * e
			})));
		} else await this._nativeExecutor.prepare();
	}
	async prepareForImage(e, t, n = {}) {
		let r = qi(this._modelSpec.receptiveField / 2, 16), i = n.tileOverlap === void 0 ? r : qi(Math.max(0, n.tileOverlap), 16), a = ve(e, t, n.wholeImage ? qi(Math.max(e, t), 16) : this._dynamicTileController.tileSize, i), o = [...new Map(a.tiles.map(({ input: e }) => [`${e.width}x${e.height}`, {
			width: e.width,
			height: e.height
		}])).values()];
		await this._webNNExecutor?.prewarm(o), this._nativeExecutor?.prewarm(o);
	}
	getRuntimeInfo() {
		return {
			configuredEngine: this._engine,
			gpuEngine: this._webNNExecutor ? "webnn" : "wgsl",
			precision: (this._webNNExecutor ?? this._nativeExecutor).precision,
			kernel: this._nativeExecutor ? {
				configured: this._nativeExecutor.kernelSetting,
				gemm: this._nativeExecutor.gemm,
				maxSpatialInputBlocks: this._nativeExecutor.maxSpatialInputBlocks,
				subgroupsAvailable: this._nativeExecutor.subgroupsAvailable,
				subgroupMatrix: this._nativeExecutor.subgroupMatrix
			} : void 0,
			webnn: this._webNNExecutor?.support,
			resources: (this._webNNExecutor ?? this._nativeExecutor).getResourceInfo(),
			model: this._modelSpec.id,
			modelFamily: this._modelSpec.family,
			inputChannels: this._inputChannels,
			hdrTransfer: this._hdrTransfer,
			dynamicTile: {
				enabled: this._dynamicTileController.enabled,
				currentTileSize: this._dynamicTileController.tileSize,
				minTileSize: this._dynamicTileController.minTileSize,
				maxTileSize: this._dynamicTileController.maxTileSize,
				targetTileTimeMs: this._dynamicTileController.targetTileTimeMs
			},
			lastExecution: this._lastExecution,
			activeExecutionCount: this._activeExecutionFailures.size
		};
	}
	_observeDeviceLoss() {
		if (this._activeExecutionFailures ??= /* @__PURE__ */ new Set(), this._deviceLostObserved) return;
		this._deviceLostObserved = !0;
		let e = this._device.lost;
		if (!e) return;
		let t = (e) => {
			if (this._deviceLostSettled) return;
			this._deviceLostSettled = !0, this._deviceLostReason = e;
			let t = [...this._activeExecutionFailures];
			this._activeExecutionFailures.clear();
			for (let n of t) n(e);
		};
		e.then((e) => t(/* @__PURE__ */ Error(`WebGPU device lost: ${e.message}`)), t);
	}
	_registerExecutionFailure(e) {
		return this._observeDeviceLoss(), this._activeExecutionFailures.add(e), this._deviceLostSettled && (this._activeExecutionFailures.delete(e), queueMicrotask(() => e(this._deviceLostReason))), () => this._activeExecutionFailures.delete(e);
	}
	profileNextExecution() {
		return !this._nativeExecutor || !this._device.features.has("timestamp-query") ? !1 : (this._profileNextImage = !0, !0);
	}
	getLastExecutionProfile() {
		return this._lastImageProfile ? Promise.resolve(this._lastImageProfile) : void 0;
	}
	_processImageData(e, t, n, r) {
		let i = e.data, a = i.length / 4, o = this._aux ? 9 : 3, s = new Float32Array(a * o);
		if (t && !n || n && !t) throw Error("Normal map and albedo map are both required");
		if (t && n && (t.width !== n.width || t.height !== n.height || e.width !== t.width || e.height !== t.height)) throw Error("Image size mismatch");
		let c = t?.data, l = n?.data, u = c instanceof Float32Array ? 1 : 255, d = l instanceof Float32Array ? 1 : 255;
		for (let e = 0; e < i.length; e += 4) {
			let t = e / 4 * o;
			for (let n = 0; n < 3; n++) r ? s[t + n] = i[e + n] : s[t + n] = i[e + n] / 255, c && (s[t + n + 3] = c[e + n] / u), l && (s[t + n + 6] = l[e + n] / d);
		}
		return s;
	}
	_readTile(e, t, n, r) {
		let i = new Float32Array(n.width * n.height * t), a = e.length / (r * t);
		for (let o = 0; o < n.height; o++) for (let s = 0; s < n.width; s++) {
			let c = Math.min(r - 1, s + n.x), l = (Math.min(a - 1, o + n.y) * r + c) * t, u = (o * n.width + s) * t;
			for (let n = 0; n < t; n++) i[u + n] = e[l + n];
		}
		return i;
	}
	_writeTile(e, t, n, r, i, a) {
		let { data: o, width: s } = e, c = n.x - t.x, l = n.y - t.y;
		for (let t = 0; t < n.height; t++) for (let u = 0; u < n.width; u++) {
			let d = ((t + l) * i + u + c) * 3, f = ((t + n.y) * s + (u + n.x)) * 4;
			for (let e = 0; e < 3; e++) a ? o[f + e] = r[d + e] : o[f + e] = Math.min(Math.max(r[d + e] * 255, 0), 255);
			e.data[f + 3] = a ? 1 : 255;
		}
	}
	async _executeTile(e, t, n, r, i, a, o, s, c) {
		let l = this._aux ? 9 : 3, u = new ce(r.input.x, r.input.y, r.input.width, r.input.height), d = new ce(r.output.x, r.output.y, r.output.width, r.output.height), f = u.width, p = u.height, m, h, g = 1, _ = this._device, v = this._dataProcessGPU;
		if (e instanceof Float32Array) {
			let t = this._readTile(e, l, u, a);
			s && (g = ie({
				data: t,
				channels: l
			}), t = ne({
				data: t,
				channels: l,
				inputScale: g,
				transfer: this._hdrTransfer
			})), h = await (this._webNNExecutor ?? this._nativeExecutor).executeCPU(t, f, p);
		} else {
			v ||= this._dataProcessGPU = new le(_, s, this._hdrTransfer), v.setImageSize(a, o), v.setInputTile(u), i && v.copyInputDataToOutput(e.color);
			let { color: t, albedo: n, normal: r } = v.forward(e.color, this._aux ? e.albedo : void 0, this._aux ? e.normal : void 0, c);
			m = await (this._webNNExecutor ?? this._nativeExecutor).execute(this._aux ? [
				t,
				n,
				r
			] : [t], f, p);
		}
		let y;
		if (e instanceof Float32Array) {
			s && (h = re({
				data: h,
				channels: 3,
				inputScale: g,
				transfer: this._hdrTransfer
			})), this._writeTile(n, u, d, h, u.width, s);
			for (let e = 0; e < d.height; e++) for (let r = 0; r < d.width; r++) {
				let i = (e * d.width + r) * 4, o = ((e + d.y) * a + (r + d.x)) * 4;
				for (let e = 0; e < 4; e++) t.data[i + e] = n.data[o + e];
			}
		} else v.setOutputTile(d, u), y = v.inverse(m, e.color);
		return y;
	}
	tileExecute({ color: e, albedo: t, normal: n, done: r, progress: i, denoiseAlpha: a, tileOverlap: o, wholeImage: s, scheduling: c = "event-loop", error: l }) {
		if (this._aux && (!t || !n)) throw Error("Normal map and albedo map are both required");
		if (!this._aux && (t || n)) throw Error("Normal map and albedo map are not required");
		let u = e.width, d = e.height, f = this._dynamicTileController.tileSize, p = s ? qi(Math.max(u, d), 16) : f, m = qi(this._modelSpec.receptiveField / 2, 16), h = ve(u, d, p, o === void 0 ? m : qi(Math.max(0, o), 16)), g = h.tiles.length > 1, _ = this._hdr || !1, v;
		Ji(e) || (v = this._processImageData(e, t, n, _));
		function y(e, t) {
			return _ ? {
				data: new Float32Array(e * t * 4),
				width: e,
				height: t
			} : new ImageData(e, t);
		}
		let b = Ji(e) ? void 0 : y(u, d), x = "active", S, C, w = () => !1, T = () => typeof performance > "u" ? Date.now() : performance.now(), E = T(), ee = [], te = this._profileNextImage === !0;
		this._profileNextImage = !1;
		let ne = /* @__PURE__ */ new Map(), re = () => {
			S !== void 0 && (clearTimeout(S), S = void 0), C !== void 0 && typeof cancelAnimationFrame < "u" && (cancelAnimationFrame(C), C = void 0);
		}, ie = (e) => {
			console.error("OIDN error callback failed", e);
		}, ae = (e) => {
			if (x === "active") {
				if (x = "settled", re(), w(), l) try {
					Promise.resolve(l(e)).catch(ie);
				} catch (e) {
					ie(e);
				}
				else console.error("OIDN execution failed", e);
			}
		}, oe = (e) => {
			if (c === "event-loop" || typeof requestAnimationFrame > "u") S = setTimeout(() => {
				S = void 0, e();
			}, 0);
			else {
				let t = () => {
					re(), e();
				};
				C = requestAnimationFrame(t), S = setTimeout(t, Ki);
			}
		}, se = async (o) => {
			if (x !== "active") return;
			let s = h.tiles[o], c = Ji(e) ? void 0 : y(s.output.width, s.output.height), l = T();
			te && this._nativeExecutor.profileNextExecution();
			let f = await this._executeTile(Ji(e) ? {
				color: e.data,
				albedo: t?.data,
				normal: n?.data
			} : v, c, b, s, o === 0, u, d, _, a);
			if (te) {
				let e = await this._nativeExecutor.getLastExecutionProfile();
				for (let t of e?.layers ?? []) ne.set(t.id, (ne.get(t.id) ?? 0) + t.durationMs);
			}
			if (x !== "active") return;
			let p = b || {
				data: f,
				width: u,
				height: d
			};
			if (i && await i(p, c, new ce(s.output.x, s.output.y, s.output.width, s.output.height), o, h.tiles.length), x !== "active") return;
			let m = o + 1 < h.tiles.length;
			await this._device.queue.onSubmittedWorkDone(), x === "active" && await (async () => {
				if (ee.push(T() - l), x === "active") {
					if (m) oe(() => {
						x === "active" && se(o + 1).catch(ae);
					});
					else {
						let e = [...ee].sort((e, t) => e - t), t = Math.floor(e.length / 2), n = e.length % 2 ? e[t] : (e[t - 1] + e[t]) / 2;
						if (this._lastExecution = {
							width: u,
							height: d,
							tileCount: h.tiles.length,
							tileColumns: h.columns,
							tileRows: h.rows,
							tileOverlap: h.overlap,
							inputPixelCount: h.inputPixelCount,
							inputShapeCount: h.inputShapeCount,
							durationMs: T() - E,
							tileTimeMs: {
								min: e[0],
								median: n,
								mean: e.reduce((e, t) => e + t, 0) / e.length,
								max: e[e.length - 1]
							}
						}, g && this._dynamicTileController.observe(ee), w(), te) {
							let e = [...ne].map(([e, t]) => ({
								id: e,
								durationMs: t
							}));
							this._lastImageProfile = {
								totalMs: e.reduce((e, t) => e + t.durationMs, 0),
								layers: e
							};
						}
						await r(p), x === "active" && (x = "settled");
					}
				}
			})();
		};
		return w = this._registerExecutionFailure(ae), se(0).catch(ae), () => {
			x === "active" && (x = "aborted", re(), w());
		};
	}
	dispose() {
		this._dataProcessGPU?.dispose(), this._nativeExecutor?.dispose(), this._webNNExecutor?.dispose();
	}
};
// node_modules/oidn-webgpu/lib/backend.js
async function Xi() {
	if (!navigator.gpu) throw Error("WebGPU is not available");
	let e = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
	if (!e) throw Error("No WebGPU adapter is available");
	let t = {}, n = [];
	e.features.has("timestamp-query") && n.push("timestamp-query"), e.features.has("bgra8unorm-storage") && n.push("bgra8unorm-storage"), e.features.has("shader-f16") && n.push("shader-f16");
	for (let t of ["subgroups", "chromium-experimental-subgroup-matrix"]) e.features.has(t) && n.push(t);
	t.requiredFeatures = n;
	let r = e.limits;
	return t.requiredLimits = {
		maxComputeWorkgroupStorageSize: r.maxComputeWorkgroupStorageSize,
		maxComputeWorkgroupsPerDimension: r.maxComputeWorkgroupsPerDimension,
		maxStorageBufferBindingSize: r.maxStorageBufferBindingSize,
		maxBufferSize: r.maxBufferSize,
		maxComputeWorkgroupSizeX: r.maxComputeWorkgroupSizeX,
		maxComputeInvocationsPerWorkgroup: r.maxComputeInvocationsPerWorkgroup
	}, e.requestDevice(t);
}
// node_modules/oidn-webgpu/lib/main.js
async function Zi(e, t, n) {
	let i = t?.device ?? await Xi(), a = new Yi(r(e), i, n);
	return await a.prepare(), a;
}
async function Qi(e, t, n) {
	return fetch(e).then((e) => e.arrayBuffer()).then((e) => Zi(e, t, n));
}
export { on as NativeUNetExecutor, Ee as OIDN_UNET_LARGE_SPEC, Te as OIDN_UNET_SMALL_SPEC, Yi as UNet, Gi as WebNNUNetExecutor, je as detectUNetModelSpec, Zi as initUNetFromBuffer, Qi as initUNetFromURL, Le as optimizeModelGraph, r as parseTZA, Be as planModelExecution, ve as planTileGrid, nn as resolveNativeUNetPrecision, rn as selectSubgroupMatrixConfig, Ne as validateUNetModel };
