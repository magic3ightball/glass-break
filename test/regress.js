// 회귀 테스트: node test/regress.js [outDir]
// 유리5 × 대상5 × 도구4 × 뷰포트3 + 배경4 전환, pageerror 0건 확인, 커터 1200조각 fps 측정
const path = require('path');
const { chromium } = require('playwright');
const OUT = process.argv[2] || path.join(__dirname, 'out');
const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const GL = ['normal','tempered','temperedOld','laminated','thick'];
const OBJ = ['pane','bulb','tube','block','bottle'];
const TOOL = ['finger','hammer','ball','cutter'];
const VP = [[1100,720],[420,800],[1400,600]];
(async () => {
  require('fs').mkdirSync(OUT, {recursive:true});
  const br = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args:['--use-gl=swiftshader','--no-sandbox'] });
  const errs = []; let combos = 0;
  for (const [w,h] of VP) {
    const pg = await br.newPage({ viewport:{width:w,height:h} });
    pg.on('pageerror', e => errs.push(`${w}x${h}: ${e.message}`));
    await pg.goto(URL); await pg.waitForTimeout(400);
    for (let i=0;i<4;i++){ await pg.click('#bgbtn'); await pg.waitForTimeout(80); }
    for (const o of OBJ) for (const g of GL) for (const t of TOOL) {
      await pg.click(`[data-obj="${o}"]`); await pg.click(`[data-glass="${g}"]`); await pg.click(`[data-tool="${t}"]`);
      const b = await pg.evaluate(() => glassTest.bbox);
      const cx = b.x + b.w/2, cy = b.y + b.h/2;
      if (t === 'cutter') { await pg.mouse.move(b.x+5, cy); await pg.mouse.down(); await pg.mouse.move(b.x+b.w-5, cy+10, {steps:8}); await pg.mouse.up(); }
      else for (let k=0;k<3;k++){ await pg.mouse.move(cx+k*15, cy-k*10); await pg.mouse.down(); await pg.waitForTimeout(t==='hammer'?120:30); await pg.mouse.up(); await pg.waitForTimeout(60); }
      combos++;
    }
    await pg.click('[data-obj="pane"]'); await pg.click('[data-glass="normal"]'); await pg.click('[data-tool="hammer"]');
    const b = await pg.evaluate(() => glassTest.bbox);
    await pg.mouse.move(b.x+b.w/2, b.y+b.h/2); await pg.mouse.down(); await pg.waitForTimeout(150); await pg.mouse.up();
    await pg.waitForTimeout(250);
    await pg.screenshot({ path: path.join(OUT, `shot-${w}x${h}.png`) });
    if (w === 1100) {
      await pg.click('#reset'); await pg.click('[data-tool="cutter"]'); await pg.waitForTimeout(600);
      for (let k=0;k<60 && (await pg.evaluate(()=>(glassTest.shards||[]).length)) < 1200;k++){
        const y0 = b.y + 5 + Math.random()*(b.h-10), y1 = b.y + 5 + Math.random()*(b.h-10);
        await pg.mouse.move(b.x+3, y0); await pg.mouse.down(); await pg.mouse.move(b.x+b.w-3, y1, {steps:6}); await pg.mouse.up();
        const x0 = b.x + 5 + Math.random()*(b.w-10), x1 = b.x + 5 + Math.random()*(b.w-10);
        await pg.mouse.move(x0, b.y+3); await pg.mouse.down(); await pg.mouse.move(x1, b.y+b.h-3, {steps:6}); await pg.mouse.up();
      }
      const fps = await pg.evaluate(() => new Promise(r => { let n=0; const t0=performance.now(); (function f(){ n++; if(performance.now()-t0<2000) requestAnimationFrame(f); else r({shards:(glassTest.shards||[]).length, fps:+(n/((performance.now()-t0)/1000)).toFixed(1)}); })(); }));
      console.log('cutter fps', JSON.stringify(fps), 'bench', JSON.stringify(await pg.evaluate(()=>glassTest.bench())));
    }
    await pg.close();
  }
  await br.close();
  console.log(`combos=${combos} errors=${errs.length}`); errs.slice(0,10).forEach(e=>console.log(' ', e));
  process.exit(errs.length ? 1 : 0);
})();
