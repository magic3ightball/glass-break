// 타격 직후 시간대별 프레임: node test/frames.js outDir [glass]
const path=require('path'),{chromium}=require('playwright');
const OUT=process.argv[2], GLS=(process.argv[3]||'normal').split(',');
(async()=>{require('fs').mkdirSync(OUT,{recursive:true});
const br=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined,args:['--use-gl=swiftshader','--no-sandbox']});
const pg=await br.newPage({viewport:{width:1100,height:720}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file://'+path.resolve(__dirname,'..','index.html'));await pg.waitForTimeout(400);
for(const g of GLS){await pg.click(`[data-glass="${g}"]`);await pg.click('#reset');await pg.waitForTimeout(300);
const b=await pg.evaluate(()=>glassTest.bbox);const x=b.x+b.w*0.45,y=b.y+b.h*0.45;
await pg.mouse.move(x,y);await pg.mouse.down();await pg.mouse.up();
const t0=Date.now();for(const ms of [40,110,200,350,800]){const w=ms-(Date.now()-t0);if(w>0)await pg.waitForTimeout(w);
await pg.screenshot({path:path.join(OUT,`${g}-${ms}ms.png`),clip:{x:b.x,y:b.y,width:b.w,height:b.h}});}}
console.log('errors',errs);await br.close();})();
