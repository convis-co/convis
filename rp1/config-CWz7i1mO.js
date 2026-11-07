// src/engine/config.ts
var e = Math.PI / 180, t = {
	fovV: 9.6458,
	cameraZ: 8.97,
	envIntensity: 2.5,
	envRotation: [
		-18 * e,
		75.74 * e,
		-8 * e
	],
	exposure: .75,
	rasterEnv: 1.5,
	rasterFill: .35
}, n = {
	height: 1.321,
	width: .714,
	centerY: .0025
}, r = {
	firstPassSamples: 32,
	targetSamples: 150,
	settleMs: 250,
	maxPixels: 11e5,
	frameBudget: 3e6,
	bounces: 5
}, i = {
	fadeSec: .6,
	facing: .06,
	grazing: .62,
	skew: 4,
	colorOnWhite: [
		.44,
		.47,
		.52
	],
	colorOnBlack: [
		.8,
		.84,
		.9
	]
}, a = {
	HS_01: {
		az: -24,
		polar: 84,
		dist: 2.7
	},
	HS_02: {
		az: 32,
		polar: 82,
		dist: 2.7
	},
	HS_03: {
		az: 158,
		polar: 82,
		dist: 3
	},
	HS_04: {
		az: 24,
		polar: 84,
		dist: 2.3,
		focus: [
			.015,
			.585,
			.02
		]
	},
	HS_05: {
		az: -14,
		polar: 86,
		dist: 3.3
	}
}, o = {
	sec: 1.2,
	ease: "power2.inOut"
}, s = {
	minPolar: 20 * e,
	maxPolar: 95 * e,
	minDist: 1.4,
	maxDistFactor: 1.2
}, c = {
	fps: 25,
	frames: 90,
	blinkStarts: [39, 67],
	blinkFrames: 6,
	rows: 7,
	fadeInMs: 700
}, l = (e) => {
	for (let t of c.blinkStarts) if (e >= t && e < t + c.blinkFrames) return e - t + 1;
	return 0;
}, u = /* @__PURE__ */ new Set(["HS_03"]);
export { s as a, o as c, l as d, t as i, a as l, c as n, r as o, u as r, n as s, e as t, i as u };
