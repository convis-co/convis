import { i as e, r as t, s as n } from "./config-CWz7i1mO.js";
var r = {
	headline: "Born to be OPEN.",
	blurb: [
		"Explore the key systems.",
		"Open the shell.",
		"See how it's built."
	],
	launch: "Launch interactive view",
	panelPath: "SYS // ROBOTO 01",
	title: ["ROBOTO 01:", "Full-stack open-source humanoid"],
	points: [
		{
			id: "HS_01",
			side: "left",
			title: "Stability & locomotion",
			label: "AGILE LOCOMOTION",
			description: "Locomotion algorithms built for stability and rapid fall recovery, running at up to 4 m/s and climbing 30° slopes.",
			readouts: [
				{
					label: "Max running speed",
					value: "4",
					unit: "m/s"
				},
				{
					label: "Slope climbing",
					value: "30",
					unit: "degrees"
				},
				{
					label: "Max step height",
					value: "50",
					unit: "mm"
				}
			],
			rows: [
				["Payload", "3 kg"],
				["Degrees of freedom per leg", "6"],
				["Obstacle avoidance, minimum size", "50 mm"]
			]
		},
		{
			id: "HS_02",
			side: "right",
			title: "High-torque joint modules",
			label: "160 N·m JOINTS",
			description: "In-house joint modules with two-stage planetary gearing; the 100 mm model delivers 160 N·m of peak torque.",
			readouts: [
				{
					label: "Module peak torque",
					value: "160",
					unit: "N·m, 100 mm model"
				},
				{
					label: "In-house designs",
					value: "4",
					unit: "joint modules"
				},
				{
					label: "Active DoF",
					value: "24/30",
					unit: "RP1 / RP1 Pro"
				}
			],
			rows: [
				["Gearing", "Two-stage planetary"],
				["Motors", "Inner-rotor"],
				["Joint protection", "Enclosed, pinch-resistant"]
			]
		},
		{
			id: "HS_03",
			side: "right",
			title: "Hot-swap power",
			label: "3 h RUNTIME",
			description: "A 10 Ah dual-battery design gives 3 hours of operation, hot-swappable without shutdown, with 140 W USB-C and magnetic fast charging.",
			readouts: [
				{
					label: "Operating time",
					value: "3",
					unit: "hours"
				},
				{
					label: "Battery capacity",
					value: "10",
					unit: "Ah, dual-battery"
				},
				{
					label: "USB-C fast charge",
					value: "140",
					unit: "W"
				}
			],
			rows: [
				["Charging time", "1.5 h"],
				["Battery replacement", "Hot-swappable without shutdown"],
				["Operation while charging", "Supported"],
				["Access", "Rear-access battery"]
			]
		},
		{
			id: "HS_04",
			side: "right",
			title: "Built to be customised",
			label: "MODULAR HEADS & HANDS",
			description: "Four interchangeable heads, an open wrist for different hands, and reserved interfaces (19 V, 12 V, Type-C, Ethernet, USB) for whatever you build next.",
			readouts: [
				{
					label: "Head configurations",
					value: "4",
					unit: "interchangeable"
				},
				{
					label: "Hand concepts",
					value: "3",
					unit: "RP, Inspire, Linker"
				},
				{
					label: "Reserved interfaces",
					value: "8",
					unit: "power and data"
				}
			],
			rows: [
				["Heads", "Locomotion, perception, interaction, data capture"],
				["Power", "19 V, 12 V"],
				["Data", "Type-C, ETH ×2, USB ×3"],
				["End-effector wiring", "Internal 24 V with adapter board"]
			]
		},
		{
			id: "HS_05",
			side: "left",
			title: "Full-stack open source",
			label: "OPEN SOURCE",
			description: "Open hardware and software, from mechanical design and electronics to training and inference, so developers can customise deeply and build on top.",
			readouts: [],
			rows: [
				["Hardware", "Mechanical drawings, BOM, interfaces, PCB designs, 3D models"],
				["Software", "OS, motor drivers, locomotion algorithms, perception and decision models"],
				["Tooling", "ROS 2 middleware, SDK, simulation, training code"],
				["Base compute", "RK3588"]
			]
		}
	]
}, i = ":root,[data-theme=dark]{--surface:#050505;--surface-raised:#121212;--surface-sunken:#000;--line:#262626;--line-strong:#6a6a66;--ink:#f2f2ee;--ink-muted:#8e8e8a;--accent:#9cf216;--accent-ink:#9cf216;--on-accent:#0a0a0a;--accent-glow:#9cf21629;--alert:#ff4d2e;--brand-black:#000;--brand-white:#fff;--glow-accent:0 0 0 1px #9cf21699, 0 0 24px #9cf21659}[data-theme=light]{--surface:#f2f2ee;--surface-raised:#fff;--surface-sunken:#e4e4df;--line:#cfcfca;--line-strong:#7a7a75;--ink:#0a0a0a;--ink-muted:#5e5e5a;--accent:#9cf216;--accent-ink:#3d6600;--on-accent:#0a0a0a;--accent-glow:#9cf21647;--alert:#c2290f;--brand-black:#000;--brand-white:#fff;--glow-accent:0 0 0 1px #3d6600b3, 0 0 16px #9cf21673}:root{--space-1:4px;--space-2:8px;--space-3:12px;--space-4:16px;--space-6:24px;--space-8:32px;--space-12:48px;--space-20:80px;--radius-none:0;--radius-xs:2px;--radius-icon:19.4%;--chamfer-sm:6px;--chamfer-md:12px;--chamfer-lg:24px;--font-display:\"Bytesized\", \"JetBrains Mono\", monospace;--font-head:\"Chakra Petch\", \"Arial Narrow\", sans-serif;--font-mono:\"JetBrains Mono\", ui-monospace, monospace}.display-xl{font-family:var(--font-display);font-size:128px;font-weight:400;line-height:1}.display-lg{font-family:var(--font-display);font-size:64px;font-weight:400;line-height:1}.display-md{font-family:var(--font-display);font-size:32px;font-weight:400;line-height:1}.h1{font-family:var(--font-head);letter-spacing:-.01em;font-size:56px;font-weight:600;line-height:56px}.h2{font-family:var(--font-head);font-size:32px;font-weight:600;line-height:36px}.h3{font-family:var(--font-head);letter-spacing:.04em;font-size:20px;font-weight:600;line-height:24px}.body{font-family:var(--font-head);font-size:16px;font-weight:400;line-height:24px}.body-sm{font-family:var(--font-head);font-size:14px;font-weight:400;line-height:20px}.label{font-family:var(--font-mono);letter-spacing:.16em;font-size:11px;font-weight:500;line-height:16px}.data{font-family:var(--font-mono);font-size:13px;font-weight:400;line-height:20px}.button{font-family:var(--font-mono);letter-spacing:.12em;font-size:13px;font-weight:500;line-height:16px}", a = "@import \"https://fonts.googleapis.com/css2?family=Bytesized&family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\";body{background:var(--surface);color:var(--ink);font-family:var(--font-head);-webkit-font-smoothing:antialiased;margin:0}.cv-root{padding:var(--space-6);gap:var(--space-6);flex-wrap:wrap;align-items:flex-start;display:flex}.cv-on-light{display:none}[data-theme=light] .cv-on-light{display:block}[data-theme=light] .cv-on-dark{display:none}.cv-label{font-family:var(--font-mono);letter-spacing:.16em;text-transform:uppercase;color:var(--ink-muted);font-size:11px;font-weight:500;line-height:16px}.cv-label--active{color:var(--accent-ink)}.cv-data{font-family:var(--font-mono);color:var(--ink);font-size:13px;line-height:20px}.cv-code{font-family:var(--font-display);letter-spacing:0;font-size:32px;line-height:1}.cv-frame{--cut:var(--chamfer-md);background:var(--line-strong);clip-path:polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut));padding:1px;position:relative}.cv-frame>.cv-frame__in{background:var(--surface-raised);padding:var(--space-6);clip-path:polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut))}.cv-frame--lit{background:var(--accent)}.cv-brackets{--b:var(--accent-ink);--l:14px;background:linear-gradient(var(--b), var(--b)) top left / var(--l) 1px no-repeat, linear-gradient(var(--b), var(--b)) top left / 1px var(--l) no-repeat, linear-gradient(var(--b), var(--b)) top right / var(--l) 1px no-repeat, linear-gradient(var(--b), var(--b)) top right / 1px var(--l) no-repeat, linear-gradient(var(--b), var(--b)) bottom left / var(--l) 1px no-repeat, linear-gradient(var(--b), var(--b)) bottom left / 1px var(--l) no-repeat, linear-gradient(var(--b), var(--b)) bottom right / var(--l) 1px no-repeat, linear-gradient(var(--b), var(--b)) bottom right / 1px var(--l) no-repeat;position:relative}.cv-blueprint{background-color:var(--surface);background-image:linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px), linear-gradient(color-mix(in srgb, var(--line) 45%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--line) 45%, transparent) 1px, transparent 1px);background-size:40px 40px,40px 40px,8px 8px,8px 8px}.cv-scan{position:relative}.cv-scan:after{content:\"\";pointer-events:none;mix-blend-mode:multiply;background:repeating-linear-gradient(0deg,#00000038 0 1px,#0000 1px 3px);position:absolute;inset:0}.cv-led{border-radius:var(--radius-xs);background:var(--accent);width:8px;height:8px;box-shadow:var(--glow-accent);vertical-align:middle;display:inline-block}.cv-led--off{background:var(--line-strong);box-shadow:none}.cv-btn{--cut:var(--chamfer-sm);appearance:none;cursor:pointer;align-items:center;gap:var(--space-2);font-family:var(--font-mono);letter-spacing:.12em;text-transform:uppercase;padding:var(--space-3) var(--space-6);color:var(--on-accent);background:var(--accent);clip-path:polygon(0 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%);border:0;font-size:13px;font-weight:500;line-height:16px;transition:filter .12s steps(2,end);display:inline-flex}.cv-btn:hover{filter:brightness(1.12)}.cv-btn:focus-visible{outline:2px solid var(--accent-ink);outline-offset:3px}.cv-btn--ghost{color:var(--ink);box-shadow:inset 0 0 0 1px var(--line-strong);clip-path:none;background:0 0}.cv-btn--ghost:hover{box-shadow:inset 0 0 0 1px var(--accent-ink);color:var(--accent-ink);filter:none}.cv-btn[disabled]{background:var(--surface-sunken);color:var(--ink-muted);box-shadow:inset 0 0 0 1px var(--line);cursor:not-allowed;filter:none}.cv-chip{--cut:var(--chamfer-sm);align-items:center;gap:var(--space-2);padding:4px var(--space-2);font-family:var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ink);box-shadow:inset 0 0 0 1px var(--line-strong);font-size:11px;display:inline-flex}.cv-chip b{font-family:var(--font-display);letter-spacing:0;color:var(--accent-ink);font-size:16px;font-weight:400}", o = 348, s = (e) => e.replace(/@import\s+url\([^)]*\)[^;]*;/g, "").replace(/(^|[}\s])body\s*\{[^}]*\}/, "$1").replace(/:root/g, ":host"), c = `
${s(i)}
${s(a)}

:host { display: block; position: relative; container-type: inline-size; color: var(--ink); font-family: var(--font-head); -webkit-font-smoothing: antialiased; }
* { box-sizing: border-box; }
button { font: inherit; color: inherit; }
.root { position: relative; }

/* Crossfading grounds: blueprint on dark surface, blueprint on light surface */
.ground { position: absolute; inset: 0; transition: opacity .6s linear; }
.ground.light { opacity: 0; }
[data-xray-theme="light"] > .ground.light, [data-xray-theme="light"] > * > .ground.light { opacity: 1; }
[data-xray-theme="light"] > .ground.dark, [data-xray-theme="light"] > * > .ground.dark { opacity: 0; }

/* ----- inline section ----- */
.inline { position: relative; height: 100vh; min-height: 620px; overflow: hidden; color: var(--ink); transition: color .6s linear; }
.corner { position: absolute; top: 104px; z-index: 3; }
.corner.l { left: var(--space-8); }
.corner.r { right: var(--space-8); text-align: right; }
.corner .cv-label { color: var(--ink); transition: color .6s linear; display: block; }
.cells { display: grid; grid-template-columns: repeat(23, 8px); gap: 3px; margin-top: var(--space-2); justify-content: end; }
.cells i { height: 8px; background: var(--line); }
.cells i.on { background: var(--accent); }
.head { position: absolute; top: 132px; left: 0; right: 0; margin: 0; z-index: 1; text-align: center; white-space: nowrap; color: var(--ink);
  font: 600 min(10.2cqw, 24vh)/1 var(--font-head); letter-spacing: -.01em; transition: color .6s linear; }
.head br { display: none; }
.stage-slot { position: absolute; inset: 0; z-index: 2; }
.stage-host { position: absolute; inset: 0; }
.stage-host canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; opacity: 0; transition: opacity .25s steps(3); pointer-events: none; }
.stage-host.ready canvas { opacity: 1; }
.stage-host canvas.trace { opacity: 0; transition: opacity .12s linear; }
.stage-host canvas.trace.on { opacity: 1; transition: opacity .7s ease-out; }
/* During a blink the raster canvas sits above the path trace and draws only the eye display. */
.stage-host canvas.over { z-index: 1; }
.inline-foot { position: absolute; left: var(--space-8); right: var(--space-8); bottom: var(--space-12); z-index: 3; display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-6); pointer-events: none; }
.inline-foot > * { pointer-events: auto; }
.blurb { margin: 0; font: 400 20px/28px var(--font-head); color: var(--ink); transition: color .6s linear; }
.actions { display: flex; gap: var(--space-2); align-items: center; flex-wrap: wrap; justify-content: flex-end; }
.cv-btn { white-space: nowrap; }
.cv-btn.power { animation: power .14s steps(2) 2; }
@keyframes power { 50% { opacity: .15; } }

/* ----- hotspots: target bracket and cell on a sunken plate ----- */
.spots { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.hs { position: absolute; left: 0; top: 0; width: 0; height: 0; pointer-events: auto; appearance: none; border: 0; padding: 0; background: none; cursor: pointer; will-change: transform; transition: opacity .12s steps(2); }
.hs.hidden { opacity: 0; pointer-events: none; }
.hs .plate { position: absolute; left: -16px; top: -16px; width: 32px; height: 32px; display: grid; place-items: center; background: var(--surface-sunken); transition: background-color .6s linear; }
.hs .tgt { display: block; position: relative; width: 26px; height: 26px; --b: var(--ink); --l: 7px; }
.hs .tgt::after { content: ""; position: absolute; left: 10px; top: 10px; width: 6px; height: 6px; background: var(--ink); transition: background-color .12s steps(2); }
.hs:hover .tgt, .hs.hot .tgt { --b: var(--accent-ink); }
.hs.hot .tgt::after { background: var(--accent-ink); }
.hs:focus-visible { outline: none; }
.hs:focus-visible .plate { outline: 2px solid var(--accent-ink); outline-offset: 2px; }
.hs.lit .tgt { --b: var(--accent-ink); }
.hs.lit .tgt::after { left: 9px; top: 9px; width: 8px; height: 8px; border-radius: var(--radius-xs); background: var(--accent); box-shadow: var(--glow-accent); }
.hs.lit { animation: power .07s steps(2) 2; }
/* On the far side of the robot, seen through it */
.hs.behind .plate { background: none; }
.hs.behind .tgt { --b: var(--ink-muted); }
.hs.behind .tgt::after { background: none; box-shadow: inset 0 0 0 1px var(--ink-muted); }
.hs.behind:hover .tgt, .hs.behind.hot .tgt { --b: var(--accent-ink); }

/* ----- overlay ----- */
dialog.overlay { position: fixed; inset: 0; width: 100vw; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; background: var(--surface); color: var(--ink); overflow: hidden; }
dialog.overlay::backdrop { background: #000; }
.model { position: absolute; inset: 0; z-index: 1; }
.model .stage-host canvas { pointer-events: auto; cursor: grab; touch-action: none; }
.model .stage-host canvas:active { cursor: grabbing; }
.model .stage-host canvas.trace { pointer-events: none; }
.leaders { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; overflow: visible; }
.leaders path { fill: none; stroke: var(--line-strong); stroke-width: 1; transition: stroke .12s steps(2); }
.leaders path.hot { stroke: var(--accent-ink); }
.leaders path.lit { stroke: var(--accent-ink); }
/* Markers sit above the lines, so they end cleanly at the plate. */
.overlay .spots { z-index: 3; }

.masthead { position: absolute; left: var(--space-8); top: var(--space-6); z-index: 4; pointer-events: none; transition: opacity .12s steps(2); }
.masthead .cv-label { transition: color .6s linear; }
.title { font: 600 32px/36px var(--font-head); margin-top: var(--space-2); transition: color .6s linear; color: var(--ink); }
.topright { position: absolute; right: var(--space-8); top: var(--space-6); z-index: 5; display: flex; gap: var(--space-4); align-items: center; }
.icon-btn { padding: 6px 10px; min-width: 32px; justify-content: center; }

/* Toggles: one per point, on the side nearest it */
.toggles { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
.tg { --cut: var(--chamfer-sm); position: absolute; left: 0; top: 0; width: ${o}px; appearance: none; border: 0; cursor: pointer; pointer-events: auto; text-align: left; transition: opacity .12s steps(2), background-color .12s steps(2); }
.tg .cv-frame__in { display: grid; grid-template-columns: 44px 1fr 16px; align-items: center; gap: 4px; padding: 10px 12px; transition: background-color .6s linear; }
.tg b { font: 400 32px/24px var(--font-display); color: var(--ink-muted); }
.tg .tg-txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.tg .name { font: 600 16px/20px var(--font-head); letter-spacing: .03em; text-transform: uppercase; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tg .g { font: 400 16px/1 var(--font-mono); color: var(--ink-muted); text-align: right; }
.toggles.hovering .tg:not(.hot) { opacity: .4; }
.tg.hot { background: var(--accent-ink); }
.tg.hot b, .tg.hot .g { color: var(--accent-ink); }
.tg:focus-visible { outline: 2px solid var(--accent-ink); outline-offset: 3px; }
.focused .tg { opacity: 0; pointer-events: none; }
/* The panel carries the title once a point is open */
.focused .title { opacity: 0; transition: opacity .12s steps(2); }
.focused .hs:not(.lit) { opacity: 0; pointer-events: none; }

/* Detail panel: more is revealed once a point is opened */
.detail { --cut: var(--chamfer-md); position: absolute; z-index: 4; top: 50%; transform: translateY(-50%); width: min(460px, 34vw); max-height: calc(100% - 200px); background: var(--accent-ink); }
.detail[hidden] { display: none; }
.detail[data-side="left"] { right: min(calc(50% + 15vw), calc(100% - var(--space-8) - min(460px, 34vw))); }
.detail[data-side="right"] { left: min(calc(50% + 15vw), calc(100% - var(--space-8) - min(460px, 34vw))); }
.detail .cv-frame__in { max-height: calc(100dvh - 202px); overflow-y: auto; transition: background-color .6s linear; }
.detail.reveal { animation: reveal .2s steps(4); }
@keyframes reveal { from { opacity: 0; } to { opacity: 1; } }
.d-hdr { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); }
.d-title { display: flex; align-items: baseline; gap: var(--space-3); margin-top: var(--space-6); }
.d-title b { font: 400 32px/24px var(--font-display); color: var(--accent-ink); }
.d-title h3 { margin: 0; font: 600 20px/24px var(--font-head); letter-spacing: .04em; text-transform: uppercase; color: var(--ink); }
.d-desc { margin: var(--space-4) 0 0; font: 400 16px/24px var(--font-head); color: var(--ink); max-width: 68ch; }
.readouts { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); margin-top: var(--space-6); }
.ro { border-top: 1px solid var(--line-strong); padding-top: var(--space-2); display: flex; flex-direction: column; gap: var(--space-1); min-width: 0; }
.ro .cv-label { font-size: 10px; line-height: 14px; letter-spacing: .12em; min-height: 28px; }
.ro .v { font: 400 32px/1.1 var(--font-display); color: var(--ink); margin-top: var(--space-1); }
.ro .u { font: 400 11px/14px var(--font-mono); color: var(--ink-muted); }
.specs { margin: var(--space-6) 0 0; }
.specs div { display: grid; grid-template-columns: 42% 1fr; gap: var(--space-3); padding: var(--space-2) 0; border-top: 1px solid var(--line); }
.specs dt { font: 500 11px/16px var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-muted); }
.specs dd { margin: 0; font: 400 13px/18px var(--font-mono); color: var(--ink); }

.foot { position: absolute; left: var(--space-8); right: var(--space-8); bottom: var(--space-6); z-index: 4; display: flex; justify-content: space-between; align-items: flex-end; pointer-events: none; }
.foot > * { pointer-events: auto; }
.foot-l { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-2); }
.foot-l .cv-label { pointer-events: none; min-height: 16px; transition: color .6s linear; }
.nv { display: flex; gap: var(--space-2); }
.nv .cv-btn { padding: 12px 16px; }

/* Narrow screens: model on top, list below, no columns or lines */
dialog.overlay.compact { overflow-y: auto; }
.compact .model { position: relative; inset: auto; height: 42dvh; margin-top: 88px; }
.compact .leaders { display: none; }
.compact .masthead { left: var(--space-4); top: var(--space-3); }
.compact .title { font-size: 20px; line-height: 24px; }
.compact .topright { right: var(--space-4); top: var(--space-3); }
.compact .toggles, .toggles.compact { position: relative; inset: auto; padding: var(--space-3); display: flex; flex-direction: column; gap: var(--space-2); }
.compact .tg { position: relative; width: 100%; }
.compact.focused .toggles { display: none; }
.compact .detail { position: relative; top: auto; left: auto; right: auto; transform: none; width: auto; max-height: none; margin: var(--space-3); }
.compact .detail .cv-frame__in { max-height: none; }
.compact .foot { position: relative; left: auto; right: auto; bottom: auto; padding: var(--space-3); }
@container (max-width: 760px) {
  .inline { height: min(100dvh, 860px); min-height: 640px; }
  .head { font-size: 15cqw; white-space: normal; line-height: .95; top: 72px; }
  .head br { display: inline; }
  .corner { top: var(--space-6); }
  .corner.l { left: var(--space-4); }
  .corner.r { right: var(--space-4); }
  .cells { grid-template-columns: repeat(23, 4px); gap: 2px; }
  .cells i { height: 6px; }
  .inline-foot { left: var(--space-4); right: var(--space-4); bottom: var(--space-4); flex-direction: column; align-items: flex-start; }
  .blurb { font-size: 16px; line-height: 22px; }
  .actions { justify-content: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
`, l = 23, u = 1e3, d = 348, f = (e) => String(e).padStart(2, "0"), p = (e) => e.replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), m = "https://fonts.googleapis.com/css2?family=Bytesized&family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap", h = class extends HTMLElement {
	static observedAttributes = ["xray-background", "accent"];
	root;
	stage = null;
	io = null;
	ro = null;
	started = !1;
	online = !1;
	selected = -1;
	hovered = -1;
	xray = !1;
	opened = !1;
	onScreen = !1;
	spots = /* @__PURE__ */ new Map();
	prevBodyOverflow = "";
	lastFocus = null;
	selectionToken = 0;
	$(e) {
		return this.root.querySelector(e);
	}
	get xrayBackground() {
		return this.getAttribute("xray-background") === "black" ? "black" : "white";
	}
	get compact() {
		return innerWidth < u;
	}
	connectedCallback() {
		this.root || (this.root = this.attachShadow({ mode: "open" }), this.renderShell(), this.bind()), this.applyAccent(), this.ensureFonts(), this.io = new IntersectionObserver((e) => this.onVisibility(e[0].isIntersecting), { rootMargin: "200px 0px" }), this.io.observe(this), addEventListener("scroll", this.onScroll, { passive: !0 }), addEventListener("hashchange", this.closeOverlay), addEventListener("keydown", this.onKey);
	}
	disconnectedCallback() {
		this.io?.disconnect(), this.ro?.disconnect(), removeEventListener("scroll", this.onScroll), removeEventListener("hashchange", this.closeOverlay), removeEventListener("keydown", this.onKey), this.stage?.dispose(), this.stage = null, this.started = !1, this.online = !1;
	}
	attributeChangedCallback(e) {
		this.root && (e === "accent" && this.applyAccent(), e === "xray-background" && (this.stage?.setXrayBackground(this.xrayBackground), this.applyTheme()));
	}
	applyAccent() {
		let e = this.root?.querySelector(".root");
		if (!e) return;
		let t = this.getAttribute("accent");
		for (let n of ["--accent", "--accent-ink"]) t ? e.style.setProperty(n, t) : e.style.removeProperty(n);
		t ? (e.style.setProperty("--glow-accent", `0 0 12px ${t}`), e.style.setProperty("--accent-glow", `color-mix(in srgb, ${t} 16%, transparent)`)) : (e.style.removeProperty("--glow-accent"), e.style.removeProperty("--accent-glow"));
	}
	ensureFonts() {
		if ([...document.fonts].some((e) => e.family.replace(/["']/g, "") === "Chakra Petch") || document.querySelector(`link[href="${m}"]`)) return;
		let e = document.createElement("link");
		e.rel = "stylesheet", e.href = m, document.head.appendChild(e);
	}
	renderShell() {
		let e = r, t = e.headline.split(" "), n = `${p(t.slice(0, -1).join(" "))}<br> ${p(t[t.length - 1])}`;
		this.root.innerHTML = `
      <style>${c}</style>
      <div class="root" data-theme="dark">
        <section class="inline" aria-label="${p(e.title.join(" "))}">
          <div class="ground dark cv-blueprint" data-theme="dark"></div>
          <div class="ground light cv-blueprint" data-theme="light"></div>
          <div class="corner l"><span class="cv-label" id="status-l">SYS // INITIALISING</span></div>
          <div class="corner r"><span class="cv-label" id="status-r" aria-live="polite">LOADING · 0%</span><div class="cells" id="cells" aria-hidden="true">${"<i></i>".repeat(l)}</div></div>
          <h2 class="head">${n}</h2>
          <div class="stage-slot" id="slot-inline"><div class="stage-host" id="host"><div class="spots" id="spots"></div></div></div>
          <div class="inline-foot">
            <p class="blurb">${e.blurb.map(p).join("<br>")}</p>
            <div class="actions">
              <button class="cv-btn cv-btn--ghost" id="xray-inline" type="button" aria-pressed="false" disabled>Show internals <span aria-hidden="true">⊕</span></button>
              <button class="cv-btn" id="launch" type="button" disabled>${p(e.launch)} <span aria-hidden="true">→</span></button>
            </div>
          </div>
        </section>
        <dialog class="overlay" id="dialog" aria-label="${p(e.title.join(" "))}">
          <div class="ground dark cv-blueprint" data-theme="dark"></div>
          <div class="ground light cv-blueprint" data-theme="light"></div>
          <div class="model" id="slot-overlay"></div>
          <svg class="leaders" id="leaders" aria-hidden="true">${e.points.map((e, t) => `<path id="ld-${t}" />`).join("")}</svg>
          <div class="masthead">
            <span class="cv-label">${p(e.panelPath)}</span>
            <div class="title">${e.title.map(p).join("<br>")}</div>
          </div>
          <div class="topright">
            <span class="cv-label" id="counter" aria-live="polite"></span>
            <button class="cv-btn cv-btn--ghost icon-btn" id="close" type="button" aria-label="Close interactive view">×</button>
          </div>
          <div class="toggles" id="toggles">${e.points.map((e, t) => `
            <button class="tg cv-frame" id="tg-${t}" data-i="${t}" data-side="${e.side}" type="button" aria-pressed="false" aria-controls="detail">
              <span class="cv-frame__in">
                <b>${f(t + 1)}</b>
                <span class="tg-txt"><span class="name">${p(e.title)}</span><span class="cv-label">${p(e.label)}</span></span>
                <span class="g" aria-hidden="true">+</span>
              </span>
            </button>`).join("")}
          </div>
          <aside class="detail cv-frame" id="detail" aria-live="polite" hidden><div class="cv-frame__in" id="detail-in"></div></aside>
          <div class="foot">
            <div class="foot-l">
              <span class="cv-label" id="readout"></span>
              <button class="cv-btn cv-btn--ghost" id="xray" type="button" aria-pressed="false">Show internals <span aria-hidden="true">⊕</span></button>
            </div>
            <span class="nv">
              <button class="cv-btn cv-btn--ghost" id="prev" type="button" aria-label="Previous point">←</button>
              <button class="cv-btn cv-btn--ghost" id="next" type="button" aria-label="Next point">→</button>
            </span>
          </div>
        </dialog>
      </div>`;
	}
	bind() {
		this.$("#launch").addEventListener("click", () => this.openOverlay()), this.$("#close").addEventListener("click", this.closeOverlay), this.$("#prev").addEventListener("click", () => this.step(-1)), this.$("#next").addEventListener("click", () => this.step(1)), this.$("#xray").addEventListener("click", () => this.toggleXray()), this.$("#xray-inline").addEventListener("click", () => this.toggleXray());
		let e = this.$("#toggles");
		e.addEventListener("click", (e) => {
			let t = e.target.closest(".tg");
			if (!t) return;
			let n = +t.dataset.i;
			this.select(this.selected === n ? -1 : n);
		});
		let t = (e, t) => {
			let n = e.target.closest?.(".tg");
			n && this.setHover(t ? +n.dataset.i : -1);
		};
		e.addEventListener("pointerover", (e) => t(e, !0)), e.addEventListener("pointerout", (e) => t(e, !1)), e.addEventListener("focusin", (e) => {
			e.target.matches(":focus-visible") && t(e, !0);
		}), e.addEventListener("focusout", (e) => t(e, !1)), this.$("#dialog").addEventListener("cancel", (e) => {
			e.preventDefault(), this.selected >= 0 ? this.select(-1) : this.closeOverlay();
		}), this.$("#host").addEventListener("dblclick", () => {
			this.opened && this.select(-1);
		}), this.$("#detail").addEventListener("click", (e) => {
			e.target.closest("#back") && this.select(-1);
		});
	}
	onVisibility(e) {
		this.onScreen = e, e && !this.started && (this.started = !0, this.boot()), this.stage && (e || this.opened ? this.stage.start() : this.stage.stop());
	}
	async boot() {
		let { Stage: e } = await import("./stage-C_LUPXd6.js"), t = new URLSearchParams(location.search), n = new e({
			onProgress: (e) => this.setProgress(e),
			onTrace: (e) => this.setReadout(e),
			onFrame: () => this.updateSpots()
		}, { forceRaster: this.getAttribute("render") === "raster" || t.get("rp1") === "raster" });
		this.stage = n;
		let r = this.$("#host");
		r.prepend(n.canvas), this.ro = new ResizeObserver(() => this.layout()), this.ro.observe(this), this.ro.observe(r);
		let i = this.getAttribute("asset-base") || new URL("./assets/", "" + import.meta.url).href;
		try {
			await n.load(i.endsWith("/") ? i : i + "/");
		} catch (e) {
			console.error("[convis-rp1-viewer]", e), this.$("#status-l").textContent = "SYS // OFFLINE", this.$("#status-r").textContent = "LOAD FAILED";
			return;
		}
		n.setXrayBackground(this.xrayBackground), this.layout(), this.buildSpots(n.anchors), r.classList.add("ready"), n.start(), this.goOnline(), this.onScroll(), t.get("rp1debug") !== null && (window.__rp1 = {
			el: this,
			stage: n
		}), (window.requestIdleCallback || ((e) => setTimeout(e, 300)))(() => n.startPathTracer().catch((e) => {
			console.warn("[convis-rp1-viewer] path tracing unavailable", e), n.canPathTrace = !1;
		}));
	}
	setProgress(e) {
		let t = Math.floor(e * 100);
		this.$("#status-r").textContent = `LOADING · ${t}%`;
		let n = Math.floor(e * l);
		this.$("#cells").querySelectorAll("i").forEach((e, t) => e.classList.toggle("on", t < n));
	}
	goOnline() {
		this.online = !0, this.$("#status-l").textContent = "SYS // ONLINE", this.$("#status-r").textContent = "3D INTERACT", this.$("#cells").style.display = "none";
		let e = this.$("#launch");
		e.disabled = !1, e.classList.add("power"), this.$("#xray-inline").disabled = !1;
	}
	setReadout(e) {
		let t = this.root.getElementById("readout");
		t && t.textContent !== e && (t.textContent = e);
	}
	layout() {
		let e = this.stage;
		if (!e) return;
		let t = this.$("#host").getBoundingClientRect();
		if (e.resize(t.width, t.height), this.opened) this.placeToggles();
		else {
			let t = this.$(".head").getBoundingClientRect(), n = this.$(".inline").getBoundingClientRect(), r = parseFloat(getComputedStyle(this.$(".head")).fontSize), i = (t.bottom - r * .42 - n.top) / n.height, a = this.$(".inline-foot").getBoundingClientRect(), o = n.width <= 760 ? (a.top - n.top) / n.height - .01 : .94;
			e.setInlineFrame(Math.max(.05, i), o);
		}
		this.updateSpots();
	}
	placeToggles() {
		let t = this.stage;
		if (!t) return;
		let i = this.$("#toggles"), a = this.compact;
		this.$("#dialog").classList.toggle("compact", a);
		let o = innerWidth, s = this.$("#slot-overlay").clientHeight || innerHeight, c = [...i.querySelectorAll(".tg")];
		if (a) {
			for (let e of c) e.style.transform = "";
			return;
		}
		let l = s / (2 * t.overviewDistance() * Math.tan(e.fovV * Math.PI / 360)), u = n.width / 2 * l, f = {
			left: [],
			right: []
		};
		r.points.forEach((e, r) => {
			let i = t.anchors.find((t) => t.id === e.id), a = i ? s / 2 - (i.position.y - n.centerY) * l : s / 2;
			f[e.side].push({
				i: r,
				y: a
			});
		});
		let p = s - 96;
		for (let e of ["left", "right"]) {
			let t = f[e].sort((e, t) => e.y - t.y), n = 30;
			for (let e of t) e.y = Math.max(e.y - 33, n + 82), n = e.y;
			let r = p - 66 + 82;
			for (let e = t.length - 1; e >= 0; e--) t[e].y = Math.min(t[e].y, r - 82), r = t[e].y;
			for (let n of t) {
				let t = e === "left" ? Math.max(24, o / 2 - u - 72 - d) : Math.min(o - 24 - d, o / 2 + u + 72);
				c[n.i].style.transform = `translate(${t.toFixed(0)}px, ${n.y.toFixed(0)}px)`;
			}
		}
	}
	onScroll = () => {
		if (!this.stage || this.opened || !this.onScreen) return;
		let e = this.getBoundingClientRect(), t = (innerHeight + e.height) / 2;
		this.stage.setScrollProgress((innerHeight / 2 - (e.top + e.height / 2)) / t), this.stage.start();
	};
	buildSpots(e) {
		let t = this.$("#spots");
		t.innerHTML = "", this.spots.clear(), r.points.forEach((n, r) => {
			let i = e.find((e) => e.id === n.id);
			if (!i) return;
			let a = document.createElement("button");
			a.type = "button", a.className = "hs", a.dataset.i = String(r), a.setAttribute("aria-label", `Point ${f(r + 1)}: ${n.label}`), a.innerHTML = "<span class=\"plate\"><i class=\"tgt cv-brackets\"></i></span>", a.addEventListener("click", () => {
				this.opened ? this.select(this.selected === r ? -1 : r) : this.openOverlay(r);
			}), a.addEventListener("pointerenter", () => this.setHover(r)), a.addEventListener("pointerleave", () => this.setHover(-1)), t.appendChild(a), this.spots.set(n.id, {
				el: a,
				anchor: i,
				visible: !0,
				x: 0,
				y: 0
			});
		}), this.updateSpots();
	}
	updateSpots = () => {
		let e = this.stage;
		if (e) {
			for (let n of this.spots.values()) {
				let r = e.project(n.anchor);
				n.x = r.x, n.y = r.y, n.el.style.transform = `translate3d(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px, 0)`;
				let i = !r.visible && r.onScreen && t.has(n.anchor.id);
				n.el.classList.toggle("behind", i);
				let a = r.visible || i;
				a !== n.visible && (n.visible = a, n.el.classList.toggle("hidden", !a), n.el.tabIndex = a ? 0 : -1);
			}
			this.opened && !this.compact && this.updateLeaders();
		}
	};
	updateLeaders() {
		if (!this.stage) return;
		let e = this.$("#dialog").getBoundingClientRect();
		r.points.forEach((t, n) => {
			let r = this.root.getElementById(`ld-${n}`), i = this.spots.get(t.id);
			if (!r || !i) return;
			let a = this.selected === n;
			if (!(this.selected < 0 || a) || !i.visible) {
				r.setAttribute("d", "");
				return;
			}
			let o = (a ? this.$("#detail") : this.$(`#tg-${n}`)).getBoundingClientRect(), s = t.side === "left", c = (s ? o.right : o.left) - e.left, l = a ? Math.min(Math.max(i.y, o.top - e.top + 24), o.bottom - e.top - 24) : o.top + o.height / 2 - e.top, u = c + (s ? 28 : -28);
			r.setAttribute("d", `M${c.toFixed(1)} ${l.toFixed(1)}H${u.toFixed(1)}L${i.x.toFixed(1)} ${i.y.toFixed(1)}`), r.setAttribute("class", a ? "lit" : this.hovered === n ? "hot" : "");
		});
	}
	setHover(e) {
		this.hovered !== e && (this.hovered = e, this.$("#toggles").classList.toggle("hovering", e >= 0 && this.selected < 0), this.$("#toggles").querySelectorAll(".tg").forEach((t, n) => t.classList.toggle("hot", n === e)), r.points.forEach((t, n) => this.spots.get(t.id)?.el.classList.toggle("hot", n === e)), this.opened && this.updateLeaders());
	}
	detailHtml(e, t) {
		let n = t.readouts.length ? `<div class="readouts">${t.readouts.map((e) => `
      <div class="ro"><span class="cv-label">${p(e.label)}</span><span class="v">${p(e.value)}</span><span class="u">${p(e.unit)}</span></div>`).join("")}</div>` : "", r = `<dl class="specs">${t.rows.map(([e, t]) => `<div><dt>${p(e)}</dt><dd>${p(t)}</dd></div>`).join("")}</dl>`;
		return `
      <div class="d-hdr">
        <button class="cv-btn cv-btn--ghost icon-btn" id="back" type="button"><span aria-hidden="true">←</span> All systems</button>
        <span class="cv-label cv-label--active">${p(t.label)}</span>
      </div>
      <div class="d-title"><b>${f(e + 1)}</b><h3>${p(t.title)}</h3></div>
      <p class="d-desc">${p(t.description)}</p>
      ${n}${r}`;
	}
	select(e) {
		let t = this.stage;
		if (!t) return;
		let n = this.selected;
		this.selected = e;
		let i = ++this.selectionToken;
		this.$("#dialog").classList.toggle("focused", e >= 0), this.$("#toggles").classList.remove("hovering"), this.$("#toggles").querySelectorAll(".tg").forEach((t, n) => {
			let r = n === e;
			t.classList.toggle("on", r), t.setAttribute("aria-pressed", String(r)), t.tabIndex = e >= 0 ? -1 : 0, t.querySelector(".g").textContent = r ? "−" : "+";
		}), this.$("#counter").textContent = e >= 0 ? `${f(e + 1)}/${f(r.points.length)}` : "";
		for (let e of this.spots.values()) e.el.classList.remove("active", "lit");
		let a = this.$("#detail");
		if (e < 0) {
			a.hidden = !0, t.goToOverview(), this.updateLeaders(), n >= 0 && this.root.getElementById(`tg-${n}`)?.focus({ preventScroll: !0 });
			return;
		}
		let o = r.points[e];
		a.dataset.side = o.side, this.$("#detail-in").innerHTML = this.detailHtml(e, o), a.hidden = !1, a.classList.remove("reveal"), a.offsetWidth, a.classList.add("reveal");
		let s = this.spots.get(o.id);
		s?.el.classList.add("active"), t.goToPoint(o.id, this.compact ? 0 : o.side === "left" ? -1 : 1, () => {
			i === this.selectionToken && s?.el.classList.add("lit");
		}), this.$("#back").focus({ preventScroll: !0 }), this.updateSpots();
	}
	step(e) {
		let t = r.points.length;
		this.select(this.selected < 0 ? e > 0 ? 0 : t - 1 : (this.selected + e + t) % t);
	}
	openOverlay(e = -1) {
		let t = this.stage;
		if (!t || !this.online || this.opened) return;
		let n = this.$("#dialog");
		this.lastFocus = this.root.activeElement, this.opened = !0, n.showModal(), this.prevBodyOverflow = document.body.style.overflow, document.body.style.overflow = "hidden", this.$("#slot-overlay").prepend(this.$("#host")), t.setMode("overlay"), t.start(), this.layout(), e >= 0 ? (t.goToOverview(void 0, 0), this.select(e)) : (this.selected = -1, t.goToOverview(void 0, .9), this.$("#close").focus({ preventScroll: !0 }));
	}
	closeOverlay = () => {
		let e = this.stage;
		if (!e || !this.opened) return;
		this.opened = !1, ++this.selectionToken;
		let t = this.$("#dialog");
		t.close(), t.classList.remove("focused"), document.body.style.overflow = this.prevBodyOverflow, this.$("#slot-inline").prepend(this.$("#host")), this.selected = -1, this.setHover(-1), this.$("#detail").hidden = !0, this.$("#counter").textContent = "", this.$("#toggles").querySelectorAll(".tg").forEach((e) => {
			e.classList.remove("on"), e.setAttribute("aria-pressed", "false"), e.tabIndex = 0, e.querySelector(".g").textContent = "+";
		});
		for (let e of this.spots.values()) e.el.classList.remove("active", "lit");
		e.setMode("inline"), this.layout(), e.goToInline(), this.onScroll(), this.lastFocus?.focus?.({ preventScroll: !0 });
	};
	onKey = (e) => {
		this.opened && (e.key === "ArrowRight" && (e.preventDefault(), this.step(1)), e.key === "ArrowLeft" && (e.preventDefault(), this.step(-1)));
	};
	toggleXray() {
		if (this.stage && this.online) {
			this.xray = !this.xray, this.stage.setXray(this.xray);
			for (let e of ["#xray", "#xray-inline"]) {
				let t = this.$(e);
				t.setAttribute("aria-pressed", String(this.xray)), t.innerHTML = this.xray ? "Hide internals <span aria-hidden=\"true\">×</span>" : "Show internals <span aria-hidden=\"true\">⊕</span>";
			}
			this.applyTheme(), this.updateSpots();
		}
	}
	applyTheme() {
		let e = this.xray && this.xrayBackground === "white", t = this.$(".root");
		t.dataset.theme = e ? "light" : "dark";
		for (let t of [this.$(".inline"), this.$("#dialog")]) t.setAttribute("data-xray-theme", e ? "light" : "dark");
	}
	setPoint(e) {
		this.opened && this.select(e);
	}
	open() {
		this.openOverlay();
	}
	close() {
		this.closeOverlay();
	}
};
// src/main.ts
customElements.get("convis-rp1-viewer") || customElements.define("convis-rp1-viewer", h);
export { h as ConvisRp1Viewer };
