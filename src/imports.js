import * as THREE from 'three'
import { EffectComposer, RenderPass } from 'postprocessing'
import 'lib/livereload'
import 'lib/global'
import 'assets/globalStyles.scss'

window.THREE = THREE
window.EffectComposer = EffectComposer
window.RenderPass = RenderPass

window.Physijs = require('physijs-browserify')(THREE)
Physijs.scripts.worker = '/physijs_worker.js';
Physijs.scripts.ammo = '/ammo.js';
