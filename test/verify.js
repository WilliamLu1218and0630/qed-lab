// Solvability harness: extracts the pure engine region from ../index.html, rolls every
// floor's gen() many times, and asserts verifyInstance passes and the hard-coded fallback
// is never reached. 0 fallback === the random generator always produces a solvable instance.
//
//   node test/verify.js
//
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const START = 'function mod(a,m){ a%=m;';
const END = '// ============================== State ==';
const s = html.indexOf(START), e = html.indexOf(END);
if (s < 0 || e < 0) { console.error('engine markers not found in index.html', s, e); process.exit(2); }
let code = html.slice(s, e);

// Override rollInstance to count fallback usage, then expose the engine internals.
code += `
let __fallback = 0;
rollInstance = function(build, fallback){
  for(let i=0;i<800;i++){ const inst=build(); if(inst && verifyInstance(inst)) return inst; }
  __fallback++; verifyInstance(fallback); return fallback;
};
return { CHAPTERS, verifyInstance, getFallback: ()=>__fallback, resetFallback: ()=>{__fallback=0;} };
`;

const { CHAPTERS, verifyInstance, getFallback, resetFallback } = new Function(code)();

const N = Number(process.argv[2]) || 3000;
let totalFail = 0, totalFb = 0, floors = 0;
console.log(`Rolling ${N}x per floor across ${CHAPTERS.length} chapters\n`);
for (const ch of CHAPTERS) {
  for (const def of ch.floors) {
    resetFallback();
    let fail = 0;
    for (let i = 0; i < N; i++) { if (!verifyInstance(def.gen({ energy: def.energy }))) fail++; }
    const fb = getFallback();
    totalFail += fail; totalFb += fb; floors++;
    const tag = (fail === 0 && fb === 0) ? 'OK ' : 'FAIL';
    console.log(`[${tag}] Ch${ch.id} ${def.name.padEnd(12)} fail=${fail} fallback=${fb}`);
  }
}
console.log(`\n${floors} floors · TOTAL fail=${totalFail} fallback=${totalFb}`);
process.exit(totalFail === 0 && totalFb === 0 ? 0 : 1);
