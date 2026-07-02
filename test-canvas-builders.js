const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body><canvas id="c"></canvas></body></html>');
global.window = dom.window;
global.document = dom.window.document;
const fabric = require('fabric').fabric;

const BUILDERS = {}; // Mock
// Just copy the function to test
function setBg(canvas, bg) { canvas.backgroundColor = bg; }
const C = (fabric, o) => new fabric.Circle(o);
const R = (fabric, o) => new fabric.Rect(o);
const IT = (fabric, t, o) => new fabric.IText(t, o);
const L = (fabric, pts, o) => new fabric.Line(pts, o);
const P = (fabric, path, o) => new fabric.Path(path, o);

function logoCircle(canvas, fabric, cx, cy, r, stroke, fill) {
  canvas.add(new fabric.Circle({ left: cx-r, top: cy-r, radius: r, fill: fill || 'transparent', stroke: stroke, strokeWidth: 2 }));
}

function buildHorizontalBrownTriangles_Front(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(new fabric.Polygon([{x:0,y:0},{x:300,y:0},{x:0,y:300}], { fill:'#78350f', selectable:false, evented:false }))
  canvas.add(new fabric.Polygon([{x:0,y:H},{x:0,y:H-200},{x:200,y:H}], { fill:'#451a03', selectable:false, evented:false }))
  canvas.add(IT(fabric, 'Your Name', { left:W*0.4, top:H/2-20, fontSize:44, fill:'#451a03', fontFamily:'Arial, sans-serif', fontWeight:'bold', name:'Name' }))
  canvas.add(IT(fabric, 'Architect', { left:W*0.4, top:H/2+30, fontSize:18, fill:'#78350f', fontFamily:'Arial, sans-serif', name:'Title' }))
  logoCircle(canvas, fabric, W-150, H/2, 60, '#78350f', 'rgba(120,53,15,0.1)')
}

try {
  const canvas = new fabric.Canvas('c');
  canvas.width = 900;
  canvas.height = 540;
  buildHorizontalBrownTriangles_Front(canvas, fabric);
  console.log('Success! No errors thrown.');
} catch (e) {
  console.error('Error in builder:', e);
}
