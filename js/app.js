/* 心型・止念 HeartType Stoic Pause — static simulator. All physiology is generated in-browser. */
(() => {
  'use strict';

  const STORE_KEY = 'ht-stoic-pause-v1';
  const MEASURE_DUR = 90;
  const BREATH_IN = 4;
  const BREATH_OUT = 6;
  const BREATH_TOTAL = 120;
  const WAIT_SEC = 600;
  const AGE_MEDIAN_RMSSD = 27;
  const PC_MIN = 300, PC_MAX = 1400;

  const TYPES = {
    LFBQ:{zh:'晨湖',en:'Morning Lake', d:'心率從容，心跳隨呼吸輕輕起伏，坐下不久就靜下來，像清晨無風的湖面。'},
    LFBG:{zh:'竹林',en:'Bamboo Grove', d:'心率從容、隨呼吸擺動，需要一點時間才完全靜下來，像風過竹林後慢慢停歇。'},
    LFWQ:{zh:'潮汐',en:'Tide', d:'心率從容，以緩慢的長波起伏為主，很快找到自己的節奏，像規律來去的潮汐。'},
    LFWG:{zh:'山嵐',en:'Mountain Mist', d:'心率從容、起伏緩長，慢慢沉靜下來，像山間緩緩散開的霧。'},
    LSBQ:{zh:'燈塔',en:'Lighthouse', d:'心率從容、節奏穩定，隨呼吸有細微變化，很快進入狀態，像夜裡穩定閃爍的燈塔。'},
    LSBG:{zh:'古鐘',en:'Temple Bell', d:'心率從容、穩定，餘韻慢慢收斂，像古鐘敲響後的回音。'},
    LSWQ:{zh:'河床',en:'Riverbed', d:'心率從容、穩定，以長波起伏為主，很快安定下來，像水流下穩固的河床。'},
    LSWG:{zh:'雪原',en:'Snowfield', d:'心率從容、穩定而安靜，慢慢進入休息狀態，像一片靜謐的雪原。'},
    AFBQ:{zh:'海風',en:'Sea Breeze', d:'節拍輕快，隨呼吸明顯起伏，很快就靜下來，像一陣清爽的海風。'},
    AFBG:{zh:'溪流',en:'Brook', d:'節拍輕快、隨呼吸流動，需要一點時間才放慢，像不停奔流的溪水。'},
    AFWQ:{zh:'浪花',en:'Surf', d:'節拍輕快、起伏有力，很快找到節奏，像一波波拍岸的浪花。'},
    AFWG:{zh:'雲雀',en:'Skylark', d:'節拍輕快、起伏大，慢慢才安定下來，像在空中盤旋的雲雀。'},
    ASBQ:{zh:'節拍器',en:'Metronome', d:'節拍輕快而精準，隨呼吸有細微變化，很快進入狀態，像穩定擺動的節拍器。'},
    ASBG:{zh:'鼓手',en:'Drummer', d:'節拍輕快穩定，需要一點時間才放慢，像暖身中的鼓手。'},
    ASWQ:{zh:'列車',en:'Express', d:'節拍輕快穩定，以長波起伏為主，很快進入巡航，像準點出發的列車。'},
    ASWG:{zh:'星火',en:'Spark', d:'節拍輕快、穩定而專注，慢慢才降溫，像持續發亮的星火。'},
  };
  const AX = { L:'緩板', A:'快板', F:'靈活', S:'穩定', B:'呼吸型', W:'長波型', Q:'速靜', G:'漸靜' };
  const AXL = { tempo:'節拍', flex:'彈性', pat:'律動', set:'沉靜' };

  const QUOTES = [
    { t:'有些事在我們能力之內，有些則否。', by:'愛比克泰德《手冊》第 1 節', who:'Epictetus' },
    { t:'擾亂我們的不是事情本身，而是我們對事情的判斷。', by:'愛比克泰德《手冊》第 5 節', who:'Epictetus' },
    { t:'不要強求事情如你所願，而要願事情如其所是，你就能過得好。', by:'愛比克泰德《手冊》第 8 節', who:'Epictetus' },
    { t:'不能做自己主人的人，就不自由。', by:'愛比克泰德《言談》', who:'Epictetus' },
    { t:'你能主宰的是自己的心，不是外在的事。明白這一點，你就有力量。', by:'奧理略《沉思錄》', who:'Marcus Aurelius' },
    { t:'若你因外物苦惱，痛苦不來自事物本身，而來自你對它的評價；而這評價，你可以立刻撤銷。', by:'奧理略《沉思錄》8.47', who:'Marcus Aurelius' },
    { t:'阻擋行動的事物，反而推進行動。擋在路上的，就成為路。', by:'奧理略《沉思錄》5.20', who:'Marcus Aurelius' },
    { t:'把你的注意力收回來。它們不該再漫遊在別人身上。', by:'奧理略《沉思錄》', who:'Marcus Aurelius' },
    { t:'我們在想像中所受的苦，往往多於現實。', by:'塞內卡《書信集》13', who:'Seneca' },
    { t:'憤怒最好的解藥，就是延遲。', by:'塞內卡《論憤怒》', who:'Seneca' },
    { t:'人生並非太短，而是我們浪費了太多。', by:'塞內卡《論生命之短促》', who:'Seneca' },
    { t:'真正的幸福，是享受當下，而不焦慮地依賴未來。', by:'塞內卡《書信集》', who:'Seneca' },
  ];

  const EMOTIONS = ['焦慮','無聊','疲憊','孤單','壓力','習慣','難過','空虛','慶祝','開心','煩躁','犒賞自己'];
  const ALTS = ['喝一杯水','起身走三分鐘','寫下剛才的念頭','伸展肩頸','打開窗戶看外面','傳訊給一位朋友'];
  const TRIGGERS = ['工作壓力','深夜滑手機','社交場合','獨自在家','睡眠不足','與人爭執','完成任務後','路過超商','看了美食影片','無聊空隙'];

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2,'0');
  const reduceMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const uid = () => Math.random().toString(36).slice(2,10) + Date.now().toString(36);
  const clamp = (n,a,b) => Math.max(a, Math.min(b,n));
  function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
  const gauss = r => (r()+r()+r()+r()-2)*0.87;
  function hashStr(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619);} return h>>>0; }
  function todayStr(d=new Date()){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
  function addDays(ds, n){ const [y,m,d]=ds.split('-').map(Number); const dt=new Date(y,m-1,d); dt.setDate(dt.getDate()+n); return todayStr(dt); }
  function fmtDate(ds){ const [y,m,d]=ds.split('-'); return `${y}/${m}/${d}`; }
  function fmtTime(ts){ const d=new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }
  function dayLabel(ds){ const t=todayStr(); if(ds===t) return '今天'; if(ds===addDays(t,-1)) return '昨天'; return `${+ds.slice(5,7)}/${+ds.slice(8)}`; }
  function greet(){
    const h=new Date().getHours();
    if(h<5) return '夜深了';
    if(h<11) return '早安';
    if(h<14) return '午安';
    if(h<18) return '下午好';
    return '晚上好';
  }
  function quoteFor(seed){ return QUOTES[seed % QUOTES.length]; }

  function hintFor(code){
    const [tempo,flex,pat,set]=code;
    let core;
    if(tempo==='A' && flex==='S') core='今日節拍偏快、彈性偏低，較容易被壓力推著走。情緒性進食的風險相對較高——這不是評分，只是提醒：渴望來時，先停一次。';
    else if(tempo==='A' && flex==='F') core='今日節拍偏快，但心跳仍有彈性。匆忙與咖啡可能放大食欲訊號。停下來分辨：是身體餓了，還是節奏太快？';
    else if(tempo==='L' && flex==='S') core='今日從容而穩定。身體的飢飽訊號通常比較清楚，適合練習正念進食。';
    else core='今日調節能力不錯，像水面還算平靜。渴望出現時，你比較有空間選擇。';
    const extras=[];
    if(pat==='B') extras.push('心跳跟著呼吸走，放慢吐氣，渴望的浪會小一些。');
    if(pat==='W') extras.push('心跳以較慢的長波起伏為主。久坐時起身走一走，再決定要不要吃。');
    if(set==='G') extras.push('坐下後需要多一點時間才沉靜，忙碌中先給自己兩分鐘。');
    if(set==='Q') extras.push('你能較快切換到休息狀態，止念呼吸會很適合你。');
    return extras.length ? core+' '+extras[0] : core;
  }

  /* ---------- simulation (adapted from HeartType kiosk) ---------- */
  function scenarioForDate(ds){
    const r = mulberry32(hashStr('ht-'+ds));
    return {
      hr: 56 + r()*24,
      rsa: 8 + r()*58,
      slow: 10 + r()*30,
      noise: 3 + r()*8,
      settle: 3 + r()*12,
      tau: 10 + r()*100,
      pvc: [], af:null, poor:[],
      seed: hashStr('beat-'+ds)
    };
  }
  function genBeats(sc, dur){
    const r=mulberry32(sc.seed); const beats=[]; let t=0.4, pauseNext=false;
    while(t<dur){
      const hr=sc.hr + sc.settle*Math.exp(-t/sc.tau);
      let rr=60/hr + sc.rsa/1000*Math.sin(2*Math.PI*0.25*t) + sc.slow/1000*Math.sin(2*Math.PI*0.06*t+1) + sc.noise/1000*gauss(r);
      let type='N';
      if(pauseNext){ rr*=1.42; pauseNext=false; }
      else if(r()<0.012){ rr*=0.62; type='V'; pauseNext=true; }
      t+=rr;
      if(t>=dur) break;
      beats.push({t,rr,type,af:false,noise:false});
    }
    return beats;
  }
  function analyse(sc, beats, dur){
    const ok=beats.filter(b=>!b.noise); const n=ok.length||1;
    const nN=ok.filter(b=>b.type==='N').length, nV=ok.filter(b=>b.type==='V').length;
    const hr=60/(ok.reduce((a,b)=>a+b.rr,0)/n);
    const nn=[];
    for(let i=1;i<ok.length-1;i++){
      const b=ok[i];
      if(b.type==='N' && ok[i-1].type==='N' && ok[i+1].type==='N') nn.push(b.rr*1000);
    }
    const mean=a=>a.reduce((s,x)=>s+x,0)/Math.max(1,a.length);
    const sd=a=>{ const m=mean(a); return Math.sqrt(mean(a.map(x=>(x-m)**2))); };
    const d=nn.slice(1).map((x,i)=>x-nn[i]);
    const rmssd=d.length?Math.sqrt(mean(d.map(x=>x*x))):20;
    const sdnn=nn.length?sd(nn):20;
    const sd1=Math.sqrt(.5)*sd(d||[0]);
    const sd2=Math.sqrt(Math.max(0, 2*sdnn*sdnn - sd1*sd1));
    const ratio=sd2?sd1/sd2:0.4;
    const pctile=Math.round(100/(1+Math.exp(-(Math.log(Math.max(8,rmssd))-Math.log(AGE_MEDIAN_RMSSD))/0.35)));
    const hrWin=(a,b)=>{ const bs=ok.filter(x=>x.t>=a&&x.t<b); return bs.length?60/mean(bs.map(x=>x.rr)):null; };
    const fin=hrWin(dur-30,dur); let settle=90;
    for(let s=0;s<=90;s+=5){ const h=hrWin(s,s+20); if(h && fin && Math.abs(h-fin)<=2){ settle=s; break; } }
    const pts=[];
    for(let i=1;i<ok.length;i++){
      const a=ok[i-1], b=ok[i];
      if(b.t-a.t>2.5) continue;
      const k=(a.type==='V'||b.type==='V')?'v':'n';
      pts.push({x:a.rr*1000,y:b.rr*1000,k});
    }
    const code=(hr<70?'L':'A')+(pctile>=50?'F':'S')+(ratio>=.5?'B':'W')+(settle<=40?'Q':'G');
    const meanRR=nn.length?mean(nn):(60000/hr);
    return {n,nN,nV,hr,rmssd,sdnn,sd1,sd2,ratio,pctile,settle,pts,code,meanRR};
  }
  function packBaseline(ds, R, sc){
    const T=TYPES[R.code]; const q=quoteFor(hashStr(ds+'q'));
    return {
      date:ds, code:R.code, name:T.zh, en:T.en, desc:T.d,
      hr:+R.hr.toFixed(1), rmssd:+R.rmssd.toFixed(1),
      sd1:+R.sd1.toFixed(1), sd2:+R.sd2.toFixed(1),
      ratio:+R.ratio.toFixed(2), pctile:R.pctile, settle:R.settle,
      meanRR:+R.meanRR.toFixed(1), seed:sc.seed,
      hint:hintFor(R.code), quote:q.t, quoteBy:q.by
    };
  }
  function baselineForDate(ds){
    const sc=scenarioForDate(ds);
    const beats=genBeats(sc, MEASURE_DUR);
    const R=analyse(sc, beats, MEASURE_DUR);
    return { sc, beats, R, rec:packBaseline(ds,R,sc) };
  }

  const g = (x,mu,s) => Math.exp(-((x-mu)*(x-mu))/(2*s*s));
  function ecgAt(tau, beats, opt){
    let v=0.04*Math.sin(2*Math.PI*0.3*tau);
    if(opt && opt.noise) v += 0.2*(Math.random()-.5);
    else v += (Math.random()-.5)*0.015;
    for(let i=beats.length-1;i>=0;i--){
      const b=beats[i], x=tau-b.t; if(x<-0.3) continue; if(x>0.6) break;
      if(b.type==='V'){ v += -0.25*g(x,-0.01,0.03)+1.3*g(x,0.03,0.03)-0.55*g(x,0.32,0.07); }
      else { v += 0.12*g(x,-0.16,0.022)-0.1*g(x,-0.022,0.008)+1.15*g(x,0,0.0105)-0.3*g(x,0.024,0.009)+0.27*g(x,0.29,0.045); }
    }
    return v;
  }
  function fit(c){
    const r=c.getBoundingClientRect(), d=window.devicePixelRatio||1;
    c.width=Math.max(1,Math.round(r.width*d)); c.height=Math.max(1,Math.round(r.height*d));
    const x=c.getContext('2d'); x.setTransform(d,0,0,d,0,0); return {x,w:r.width,h:r.height};
  }
  const COL={ brand:'#00d5be', v:'#e4e4e7', line:'rgba(255,255,255,.12)', grid:'rgba(255,255,255,.06)', text:'#9f9fa9' };
  function pcFrame(ctx,w,h,pad){
    const s=Math.min(w,h)-pad*2, ox=(w-s)/2, oy=(h-s)/2;
    const map=v=>(v-PC_MIN)/(PC_MAX-PC_MIN)*s;
    return {s,ox,oy,X:v=>ox+map(v),Y:v=>oy+s-map(v)};
  }
  function drawPcAxes(ctx,f){
    ctx.strokeStyle=COL.grid; ctx.lineWidth=1;
    for(let v=400;v<=1300;v+=100){
      ctx.beginPath(); ctx.moveTo(f.X(v),f.oy); ctx.lineTo(f.X(v),f.oy+f.s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(f.ox,f.Y(v)); ctx.lineTo(f.ox+f.s,f.Y(v)); ctx.stroke();
    }
    ctx.strokeStyle=COL.line; ctx.setLineDash([4,5]);
    ctx.beginPath(); ctx.moveTo(f.X(PC_MIN),f.Y(PC_MIN)); ctx.lineTo(f.X(PC_MAX),f.Y(PC_MAX)); ctx.stroke();
    ctx.setLineDash([]);
  }
  function dot(ctx,x,y,k,r=2.4){
    ctx.fillStyle=k==='v'?COL.v:COL.brand; ctx.shadowColor=ctx.fillStyle; ctx.shadowBlur=7;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
  }
  function drawEmblem(c, rec, pts){
    const {x,w,h}=fit(c); const cx=w/2, cy=h/2, rad=Math.min(w,h)/2-3;
    const grd=x.createRadialGradient(cx,cy,0,cx,cy,rad);
    grd.addColorStop(0,'rgba(0,213,190,.22)'); grd.addColorStop(1,'rgba(0,213,190,0)');
    x.fillStyle=grd; x.beginPath(); x.arc(cx,cy,rad,0,Math.PI*2); x.fill();
    x.strokeStyle='rgba(0,213,190,.35)'; x.lineWidth=1;
    [1,.7,.42].forEach(k=>{ x.beginPath(); x.arc(cx,cy,rad*k,0,Math.PI*2); x.stroke(); });
    if(!pts || !pts.length) return;
    const sc=rad*0.85/Math.max(60, 2.6*Math.max(rec.sd2||40, (rec.sd1||20)*1.4));
    pts.forEach(p=>{
      if(p.k!=='n') return;
      const dx=(p.x-rec.meanRR)*sc, dy=(p.y-rec.meanRR)*sc;
      if(dx*dx+dy*dy>rad*rad*0.9) return;
      x.fillStyle='rgba(0,213,190,.85)'; x.shadowColor=COL.brand; x.shadowBlur=5;
      x.beginPath(); x.arc(cx+dx,cy-dy,1.5,0,Math.PI*2); x.fill();
    });
    x.shadowBlur=0;
  }

  /* ---------- store ---------- */
  function emptyState(){
    return { v:1, theme: document.documentElement.getAttribute('data-theme')||'dark', onboarded:false, demoSpeed:true, speedMult:12, baselines:[], pauses:[], journals:[], weightLogs:[] };
  }
  let S = emptyState();
  function load(){
    try{
      const raw=localStorage.getItem(STORE_KEY);
      if(raw){ S={...emptyState(), ...JSON.parse(raw)}; }
    }catch(e){}
    applyTheme(S.theme);
  }
  function save(){
    try{ localStorage.setItem(STORE_KEY, JSON.stringify(S)); }catch(e){}
  }
  function applyTheme(th){
    S.theme=th;
    document.documentElement.setAttribute('data-theme', th);
    const meta=$('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', th==='dark'?'#18181b':'#fafafa');
    try{ localStorage.setItem('ht-theme', th); }catch(e){}
  }
  function todayBaseline(){ return S.baselines.find(b=>b.date===todayStr()); }
  function todayJournal(){ return S.journals.find(j=>j.date===todayStr()); }
  function todayPauses(){ return S.pauses.filter(p=>p.date===todayStr()).sort((a,b)=>b.ts-a.ts); }
  function speed(){ return S.demoSpeed ? (S.speedMult||12) : 1; }
  function isSuccess(p){ return p.outcome==='held' || p.outcome==='alt' || p.outcome==='mindful'; }

  function seedDemo(){
    const today=todayStr();
    const baselines=[], pauses=[], journals=[], weightLogs=[];
    let kg=74.6;
    for(let i=29;i>=0;i--){
      const ds=addDays(today,-i);
      const pack=baselineForDate(ds);
      baselines.push(pack.rec);
      const r=mulberry32(hashStr('p-'+ds));
      const nP=i===0?1: (r()<0.15?0: 1+Math.floor(r()*3));
      const emos=EMOTIONS, trigs=TRIGGERS;
      for(let k=0;k<nP;k++){
        const hour=10+Math.floor(r()*12);
        const choiceR=r();
        const choice=choiceR<0.34?'wait':choiceR<0.62?'alt':'mindful';
        let outcome=choice==='wait'?(r()<0.72?'held':'ate'):choice;
        if(choice==='mindful') outcome='mindful';
        const emo=[emos[Math.floor(r()*emos.length)]];
        if(r()<0.35) emo.push(emos[Math.floor(r()*emos.length)]);
        pauses.push({
          id:uid(), date:ds,
          ts: new Date(+ds.slice(0,4), +ds.slice(5,7)-1, +ds.slice(8), hour, Math.floor(r()*60)).getTime(),
          hunger: 2+Math.floor(r()*8),
          emotions:[...new Set(emo)],
          choice, alt: choice==='alt'?ALTS[Math.floor(r()*ALTS.length)]:'',
          outcome, rmssdStart: +(pack.rec.rmssd-4+r()*6).toFixed(1),
          rmssdEnd: +(pack.rec.rmssd+6+r()*10).toFixed(1),
          durationSec: BREATH_TOTAL
        });
      }
      if(r()>0.28 || i===0){
        const used=[];
        const nt=1+Math.floor(r()*3);
        for(let t=0;t<nt;t++) used.push(trigs[Math.floor(r()*trigs.length)]);
        journals.push({
          date:ds,
          successes: i===0?'':'今天有一次先喝水再決定，感覺選擇回到自己手上。',
          triggers:[...new Set(used)],
          text: i===0?'':'晚上回顧：渴望來時我有停下來。不是每天都完美，但判斷比昨天清楚一點。',
          rating: 2+Math.floor(r()*4)
        });
      }
      kg += (r()-0.58)*0.12;
      if(i%2===0) weightLogs.push({date:ds, kg:+kg.toFixed(1)});
    }
    S.baselines=baselines; S.pauses=pauses; S.journals=journals; S.weightLogs=weightLogs; S.onboarded=true;
    save();
  }

  /* ---------- charts ---------- */
  function lineChart(canvas, points, opt){
    const {x,w,h}=fit(canvas);
    x.clearRect(0,0,w,h);
    const pad={l:36,r:8,t:12,b:22};
    const iw=w-pad.l-pad.r, ih=h-pad.t-pad.b;
    const ys=points.map(p=>p.y);
    let min=Math.min(...ys), max=Math.max(...ys);
    if(min===max){ min-=2; max+=2; }
    const span=max-min; min-=span*0.12; max+=span*0.12;
    const X=i=>pad.l + (points.length<=1?iw/2: i/(points.length-1)*iw);
    const Y=v=>pad.t + (1-(v-min)/(max-min))*ih;
    const grid = getComputedStyle(document.documentElement).getPropertyValue('--divider').trim()||'#3f3f47';
    const text = getComputedStyle(document.documentElement).getPropertyValue('--text-3').trim()||'#9f9fa9';
    const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()||'#00d5be';
    x.strokeStyle=grid; x.lineWidth=1;
    for(let g=0;g<4;g++){
      const yy=pad.t+ih*g/3;
      x.beginPath(); x.moveTo(pad.l,yy); x.lineTo(pad.l+iw,yy); x.stroke();
    }
    x.fillStyle=text; x.font='11px Roboto, Noto Sans TC, sans-serif';
    x.textAlign='right'; x.textBaseline='middle';
    x.fillText(max.toFixed(0), pad.l-6, Y(max));
    x.fillText(min.toFixed(0), pad.l-6, Y(min));
    if(points.length){
      x.textAlign='left'; x.textBaseline='top';
      x.fillText(points[0].label||'', X(0)-2, pad.t+ih+6);
      x.textAlign='right';
      x.fillText(points[points.length-1].label||'', X(points.length-1)+2, pad.t+ih+6);
    }
    if(points.length>1){
      const grd=x.createLinearGradient(0,pad.t,0,pad.t+ih);
      grd.addColorStop(0, brand); grd.addColorStop(1,'transparent');
      x.beginPath();
      points.forEach((p,i)=>{ const xx=X(i), yy=Y(p.y); i?x.lineTo(xx,yy):x.moveTo(xx,yy); });
      x.lineTo(X(points.length-1), pad.t+ih); x.lineTo(X(0), pad.t+ih); x.closePath();
      x.globalAlpha=.18; x.fillStyle=brand; x.fill(); x.globalAlpha=1;
      x.beginPath();
      points.forEach((p,i)=>{ const xx=X(i), yy=Y(p.y); i?x.lineTo(xx,yy):x.moveTo(xx,yy); });
      x.strokeStyle=brand; x.lineWidth=2; x.stroke();
      points.forEach((p,i)=>{ x.fillStyle=brand; x.beginPath(); x.arc(X(i),Y(p.y),2.4,0,Math.PI*2); x.fill(); });
    }
    if(opt && opt.unit){
      x.fillStyle=text; x.textAlign='left'; x.textBaseline='top'; x.fillText(opt.unit, pad.l, 0);
    }
  }

  /* ---------- toast / clock ---------- */
  let toastT;
  function toast(m){
    const t=$('#toast'); t.textContent=m; t.classList.add('show');
    clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'), 2400);
  }
  function tickClock(){
    const n=new Date();
    $('#sbTime').textContent=`${pad(n.getHours())}:${pad(n.getMinutes())}`;
  }

  /* ---------- navigation ---------- */
  let tab='home';
  function showTab(id){
    tab=id;
    $$('.screen').forEach(s=>s.classList.toggle('on', s.dataset.tab===id));
    $$('#tabbar .tab').forEach(b=>b.classList.toggle('on', b.dataset.tab===id));
    if(id==='home') renderHome();
    if(id==='pause') renderPause();
    if(id==='journal') renderJournal();
    if(id==='dash') renderDash();
    if(id==='settings') renderSettings();
  }

  /* ---------- HOME ---------- */
  function renderHome(){
    const el=$('#sc-home');
    const b=todayBaseline();
    const ps=todayPauses();
    const done=ps.filter(isSuccess).length;
    const lastQ = b ? {t:b.quote, by:b.quoteBy} : quoteFor(hashStr(todayStr()));
    const pts = b ? baselineForDate(b.date).R.pts : null;
    el.innerHTML = `
      <div class="top">
        <div>
          <div class="greet">${greet()} · <span class="num">${fmtDate(todayStr())}</span></div>
          <h1>今日</h1>
          <div class="sub">所有數字皆為模擬</div>
        </div>
        <button class="icon-btn" type="button" data-act="theme" aria-label="切換主題"><span class="ms">${S.theme==='dark'?'light_mode':'dark_mode'}</span></button>
      </div>
      ${b ? `
        <div class="type-hero">
          <div class="row">
            <canvas class="emb" id="homeEmb"></canvas>
            <div class="sp">
              <div class="kick">今日心型 · 模擬 HRV</div>
              <h2>${b.name}型 <small>${b.en} · ${b.code}</small></h2>
              <div class="codes">${[...b.code].map(c=>`<b title="${AX[c]}">${c}</b>`).join('')}</div>
            </div>
          </div>
          <div class="d">${b.desc}</div>
          <div class="hint-box">${b.hint}</div>
          <div class="quote">「${b.quote}」<cite>—— ${b.quoteBy}</cite></div>
        </div>` : `
        <div class="card empty-hero">
          <span class="ms">monitor_heart</span>
          <h2>還沒有今日心型</h2>
          <p class="muted">做一次模擬晨間基線（約 90 秒心律，可加速），會得到今日心型、狀態提示與一句斯多葛引言。</p>
          <button class="btn-hero pulse" type="button" data-act="morning" style="margin-top:14px"><span class="ms">ecg</span>開始晨間基線</button>
        </div>`}
      <div class="stats3">
        <div class="stat"><b class="num">${ps.length}</b><span>今日止念</span></div>
        <div class="stat"><b class="num">${ps.length?Math.round(done/ps.length*100)+'%':'—'}</b><span>清醒選擇</span></div>
        <div class="stat"><b class="num">${b?Math.round(b.rmssd):'—'}</b><span>模擬 RMSSD</span></div>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="ct">今日止念紀錄</div>
        <div class="cs">${ps.length?'渴望來時你停下來的次數':'還沒有止念。食欲出現時，按中間的心。'}</div>
        ${ps.slice(0,5).map(p=>`
          <div class="list-item">
            <i class="dot ${p.outcome==='ate'?'warn':p.outcome==='pending'?'mute':''}"></i>
            <div class="sp">
              <b>${outcomeLabel(p)}</b>
              <div class="muted num">${fmtTime(p.ts)} · 飢餓 ${p.hunger}/10${p.emotions.length?' · '+p.emotions.join('、'):''}</div>
            </div>
          </div>`).join('') || '<p class="muted" style="margin:10px 0 0">按「我想吃東西」開始一次止念。</p>'}
      </div>
      ${b?'':''}
      <div class="card">
        <div class="ct">今日引言</div>
        <p style="margin:8px 0 0">「${lastQ.t}」</p>
        <div class="muted">—— ${lastQ.by}</div>
      </div>
      ${b?`<button class="btn block" type="button" data-act="morning" style="margin-top:12px"><span class="ms sm">replay</span>再量一次晨間基線</button>`:''}
    `;
    if(b && $('#homeEmb')) drawEmblem($('#homeEmb'), b, pts);
  }
  function outcomeLabel(p){
    return ({held:'等過了，沒有立刻吃', mindful:'正念地吃', alt:'做了替代行動', ate:'後來還是吃了', pending:'等待中'})[p.outcome] || p.choice;
  }

  /* ---------- PAUSE ---------- */
  let pauseDraft = { hunger:5, emotions:[], step:'idle', id:null };
  function renderPause(){
    const el=$('#sc-pause');
    const b=todayBaseline();
    const step=pauseDraft.step;
    if(step==='idle'){
      el.innerHTML=`
        <div class="top"><div><div class="greet">核心練習</div><h1>止念</h1><div class="sub">先停，再決定要不要吃</div></div></div>
        <button class="crave-btn" type="button" data-act="crave">
          <span class="ms">restaurant</span>
          <b>我想吃東西</b>
          <span>兩分鐘慢呼吸 · 吸 4 秒　吐 6 秒</span>
        </button>
        <p class="muted" style="text-align:center;margin:12px 12px 0">渴望的出現不在你完全控制之內；停下來、選擇，才是。${b?`今日心型：${b.name}型。`:''}</p>
        <div class="card" style="margin-top:16px">
          <div class="ct">這兩分鐘在做什麼</div>
          <p class="muted" style="margin:8px 0 0">拉長吐氣，模擬中的 RMSSD（心跳間隔變異）會慢慢上升——這是放鬆反應的示意，不是真實量測。示範模式可加速。</p>
        </div>`;
      return;
    }
    if(step==='reflect'){
      el.innerHTML=`
        <div class="top"><div><div class="greet">止念之後</div><h1>這是哪一種飢餓？</h1><div class="sub">身體飢餓，或情緒飢餓</div></div></div>
        <div class="card">
          <div class="ct">身體飢餓感</div>
          <div class="cs">1 幾乎不餓　·　10 胃在叫</div>
          <div class="scale">
            <div class="val num" id="hungerVal">${pauseDraft.hunger}</div>
            <input type="range" min="1" max="10" value="${pauseDraft.hunger}" id="hunger" aria-label="飢餓程度">
            <div class="ends"><span>情緒／習慣</span><span>身體需要</span></div>
          </div>
        </div>
        <div class="card">
          <div class="ct">此刻的情緒（可多選）</div>
          <div class="chip-row" id="emoChips">
            ${EMOTIONS.map(e=>`<button type="button" class="chip ${pauseDraft.emotions.includes(e)?'on':''}" data-act="emo" data-v="${e}">${e}</button>`).join('')}
          </div>
        </div>
        <button class="btn pri block" type="button" data-act="toChoice" style="margin-top:14px">下一步：選擇</button>`;
      return;
    }
    if(step==='choose'){
      el.innerHTML=`
        <div class="top"><div><div class="greet">控制之內的事</div><h1>你要怎麼做？</h1><div class="sub">三種都算練習，沒有失敗</div></div></div>
        <button class="choice" type="button" data-act="choose" data-v="mindful"><span class="ms">ramen_dining</span><div><b>正念地吃</b><small>坐下、放下螢幕，吃到飽足的八分。承認這是選擇，不是失控。</small></div></button>
        <button class="choice" type="button" data-act="choose" data-v="wait"><span class="ms">hourglass</span><div><b>再等 10 分鐘</b><small>塞內卡說，憤怒最好的解藥是延遲。渴望也一樣。示範模式會加速。</small></div></button>
        <button class="choice" type="button" data-act="choose" data-v="alt"><span class="ms">directions_walk</span><div><b>做一件別的事</b><small>${ALTS.join('、')}</small></div></button>`;
      return;
    }
    if(step==='wait'){
      const left=pauseDraft.waitLeft ?? WAIT_SEC;
      el.innerHTML=`
        <div class="top"><div><div class="greet">延遲即解藥</div><h1>等這波過去</h1><div class="sub">模擬倒數 · ${S.demoSpeed?'示範加速':'即時 10 分鐘'}</div></div></div>
        <div class="wait-big num" id="waitClock">${fmtWait(left)}</div>
        <p class="muted" style="text-align:center">你不需要趕走渴望，只要不立刻服從它。</p>
        <div class="stack" style="margin-top:18px">
          <button class="btn pri block" type="button" data-act="waitEnd" data-v="held">時間到了，我沒有立刻吃</button>
          <button class="btn block" type="button" data-act="waitEnd" data-v="mindful">我決定正念地吃</button>
          <button class="btn ghost block" type="button" data-act="waitEnd" data-v="ate">還是吃了</button>
        </div>`;
      return;
    }
    if(step==='done'){
      const p=S.pauses.find(x=>x.id===pauseDraft.id);
      el.innerHTML=`
        <div class="card empty-hero" style="margin-top:24px">
          <span class="ms">spa</span>
          <h2>這一次，你停下來了</h2>
          <p class="muted">${p?outcomeLabel(p)+'。':''}停念本身就是勝利。體重數字不是今天的評分。</p>
          <button class="btn pri" type="button" data-act="pauseReset" style="margin-top:12px">回到止念</button>
          <button class="btn ghost" type="button" data-tab="journal" style="margin-top:8px">寫入夜誌</button>
        </div>`;
    }
  }
  function fmtWait(s){ s=Math.max(0,Math.round(s)); return `${pad(Math.floor(s/60))}:${pad(s%60)}`; }

  /* ---------- JOURNAL ---------- */
  function renderJournal(){
    const el=$('#sc-journal');
    const j=todayJournal() || {date:todayStr(), successes:'', triggers:[], text:'', rating:0};
    const ps=todayPauses();
    el.innerHTML=`
      <div class="top"><div><div class="greet">塞內卡式回顧</div><h1>夜誌</h1><div class="sub">不是懺悔，是檢查判斷</div></div></div>
      <div class="card">
        <div class="ct">今日的停念</div>
        <div class="cs">${ps.length?`完成 ${ps.length} 次`:'今天還沒有止念紀錄'}</div>
        ${ps.map(p=>`<div class="list-item"><i class="dot ${p.outcome==='ate'?'warn':''}"></i><div><b>${outcomeLabel(p)}</b><div class="muted num">${fmtTime(p.ts)} · ${p.emotions.join('、')||'未標情緒'}</div></div></div>`).join('')}
      </div>
      <label class="fld" for="jSuccess">哪一次我選擇得比較好？</label>
      <textarea class="box" id="jSuccess" placeholder="寫一件具體的事，例如：下午三點想吃甜的，我先喝水再等。">${esc(j.successes)}</textarea>
      <div class="ct" style="margin-top:14px">觸發渴望的情境</div>
      <div class="chip-row" id="trigChips">
        ${TRIGGERS.map(t=>`<button type="button" class="chip ${j.triggers.includes(t)?'on':''}" data-act="trig" data-v="${t}">${t}</button>`).join('')}
      </div>
      <label class="fld" for="jText">自由書寫</label>
      <textarea class="box" id="jText" placeholder="對自己誠實就好。沒有人會看到。">${esc(j.text)}</textarea>
      <label class="fld">今日節制——不是道德分數，是清醒程度</label>
      <div class="stars" id="stars">
        ${[1,2,3,4,5].map(n=>`<button type="button" data-act="rate" data-v="${n}" class="${j.rating>=n?'on':''}" aria-label="${n} 分"><span class="ms">${j.rating>=n?'star':'star'}</span></button>`).join('')}
      </div>
      <button class="btn pri block" type="button" data-act="saveJournal" style="margin-top:16px">儲存夜誌</button>
      <p class="muted" style="margin-top:8px">塞內卡每晚自問：我改正了什麼惡習？哪方面還更好？資料只存在這台裝置的瀏覽器。</p>`;
    journalDraft = { ...j };
  }
  let journalDraft = null;
  function esc(s){ return String(s||'').replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }

  /* ---------- DASH ---------- */
  let dashRange = 7;
  function renderDash(){
    const el=$('#sc-dash');
    const days=dashRange;
    const from=addDays(todayStr(), -(days-1));
    const pauses=S.pauses.filter(p=>p.date>=from);
    const succ=pauses.filter(isSuccess).length;
    const rate=pauses.length?Math.round(succ/pauses.length*100):0;
    const bases=S.baselines.filter(b=>b.date>=from).sort((a,b)=>a.date.localeCompare(b.date));
    const weights=S.weightLogs.filter(w=>w.date>=from).sort((a,b)=>a.date.localeCompare(b.date));
    const trigCount={};
    S.journals.filter(j=>j.date>=from).forEach(j=>j.triggers.forEach(t=>{ trigCount[t]=(trigCount[t]||0)+1; }));
    pauses.forEach(p=>p.emotions.forEach(t=>{ /* emotions are not triggers */ }));
    const trigs=Object.entries(trigCount).sort((a,b)=>b[1]-a[1]).slice(0,6);
    const maxT=trigs.length?trigs[0][1]:1;
    const lastW=weights.length?weights[weights.length-1].kg:null;
    const firstW=weights.length?weights[0].kg:null;
    const wDelta=lastW!=null && firstW!=null ? (lastW-firstW) : null;
    el.innerHTML=`
      <div class="top">
        <div><div class="greet">模擬趨勢</div><h1>儀表板</h1><div class="sub">止念為主，體重為輔</div></div>
        <div class="seg" style="width:120px">
          <button type="button" data-act="range" data-v="7" class="${days===7?'on':''}">7 日</button>
          <button type="button" data-act="range" data-v="30" class="${days===30?'on':''}">30 日</button>
        </div>
      </div>
      <div class="stats3">
        <div class="stat"><b class="num">${pauses.length}</b><span>止念次數</span></div>
        <div class="stat"><b class="num">${pauses.length?rate+'%':'—'}</b><span>清醒選擇率</span></div>
        <div class="stat"><b class="num">${bases.length?Math.round(bases.reduce((a,b)=>a+b.rmssd,0)/bases.length):'—'}</b><span>平均模擬 RMSSD</span></div>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="ct">模擬 HRV 趨勢</div>
        <div class="cs">晨間基線 RMSSD（毫秒）· 非真實生理訊號</div>
        <div class="chart-box"><canvas id="hrvChart"></canvas></div>
      </div>
      <div class="card">
        <div class="ct">觸發情境</div>
        <div class="cs">來自夜誌標籤（模擬或你自己點的）</div>
        <div class="bars">
          ${trigs.length?trigs.map(([n,c])=>`<div class="bar-row"><span>${n}</span><i style="width:${Math.max(8,c/maxT*100)}%"></i><span class="n num">${c}</span></div>`).join(''):'<p class="muted">先寫幾則夜誌，或到設定植入 30 日示範資料。</p>'}
        </div>
      </div>
      <div class="card">
        <div class="ct">體重（次要）</div>
        <div class="cs">斯多葛練習不把體重當成績單。此為示範曲線。</div>
        <div class="row" style="margin-top:8px">
          <div><b class="num" style="font-size:28px">${lastW!=null?lastW:'—'}</b><span class="muted"> kg</span></div>
          <div class="sp"></div>
          <div class="muted num">${wDelta==null?'': (wDelta>0?'+':'')+wDelta.toFixed(1)+' kg / '+days+' 日'}</div>
        </div>
        <div class="chart-box" style="height:110px"><canvas id="wChart"></canvas></div>
        <div class="weight-note">可在設定裡記錄今天的體重。數字只存在本機。</div>
      </div>`;
    const hrvPts=bases.map(b=>({y:b.rmssd, label:b.date.slice(5).replace('-','/')}));
    if($('#hrvChart') && hrvPts.length) lineChart($('#hrvChart'), hrvPts, {unit:'ms'});
    else if($('#hrvChart')) { const {x,w,h}=fit($('#hrvChart')); x.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--text-3'); x.font='13px Noto Sans TC, sans-serif'; x.fillText('尚無基線資料', 16, h/2); }
    if($('#wChart') && weights.length) lineChart($('#wChart'), weights.map(w=>({y:w.kg, label:w.date.slice(5).replace('-','/')})));
  }

  /* ---------- SETTINGS ---------- */
  function renderSettings(){
    const el=$('#sc-settings');
    const lastW=S.weightLogs.slice().sort((a,b)=>a.date.localeCompare(b.date)).at(-1);
    el.innerHTML=`
      <div class="top"><div><div class="greet">示範控制</div><h1>設定</h1><div class="sub">本機儲存 · 無後端</div></div></div>
      <div class="card">
        <div class="set-row">
          <div><div class="t">外觀</div><div class="s">深色／淺色</div></div>
          <div class="seg" style="width:140px">
            <button type="button" data-act="themeSet" data-v="light" class="${S.theme==='light'?'on':''}">淺色</button>
            <button type="button" data-act="themeSet" data-v="dark" class="${S.theme==='dark'?'on':''}">深色</button>
          </div>
        </div>
        <div class="set-row">
          <div><div class="t">示範加速</div><div class="s">晨間量測、呼吸與等待倒數</div></div>
          <div class="seg" style="width:140px">
            <button type="button" data-act="demoSpeed" data-v="1" class="${S.demoSpeed?'on':''}">開</button>
            <button type="button" data-act="demoSpeed" data-v="0" class="${!S.demoSpeed?'on':''}">關</button>
          </div>
        </div>
        <div class="set-row">
          <div><div class="t">加速倍率</div><div class="s">目前 ×${S.speedMult||12}</div></div>
          <div class="seg" style="width:180px">
            ${[6,12,20].map(n=>`<button type="button" data-act="mult" data-v="${n}" class="${(S.speedMult||12)===n?'on':''}">×${n}</button>`).join('')}
          </div>
        </div>
        <div class="set-row">
          <div><div class="t">今日體重（次要）</div><div class="s">${lastW?`上次 ${lastW.kg} kg · ${fmtDate(lastW.date)}`:'尚未記錄'}</div></div>
        </div>
        <div class="row">
          <input class="box" id="wInput" type="number" inputmode="decimal" step="0.1" min="30" max="250" placeholder="kg" value="${lastW && lastW.date===todayStr()?lastW.kg:''}" style="min-height:44px">
          <button class="btn pri" type="button" data-act="saveW">記錄</button>
        </div>
      </div>
      <div class="card">
        <div class="ct">示範資料</div>
        <div class="cs">植入或清空本機紀錄，方便簡報。</div>
        <div class="stack" style="margin-top:12px">
          <button class="btn block" type="button" data-act="seed">植入 30 日示範資料</button>
          <button class="btn block" type="button" data-act="reset">清除全部資料</button>
        </div>
      </div>
      <div class="card">
        <div class="ct">語言</div>
        <p class="muted" style="margin:8px 0 0">介面為繁體中文（台灣，zh-Hant-TW）。心型名稱沿用現場量測原型：晨湖、竹林、潮汐、山嵐、燈塔、古鐘、河床、雪原、海風、溪流、浪花、雲雀、節拍器、鼓手、列車、星火。四軸為 L/A 節拍、F/S 彈性、B/W 律動、Q/G 沉靜。</p>
      </div>
      <div class="disc">
        <b style="color:var(--text)">聲明。</b>
        本頁是產品概念的靜態模擬器，所有 HRV、心電圖、Poincaré 圖、體重與統計皆為演算法生成的<b>模擬資料</b>，僅供展示交互與文案。內容屬健康促進與哲學練習資訊，<b>不是診斷、治療、醫療器材或飲食處方</b>。心型切點與常模為示範值。證據上：HRV 可反映自律神經狀態，但尚不能單獨「治療」肥胖；正念／延遲進食與認知行為策略有文獻支持，效果因人而異。若有進食疾患或心臟症狀，請尋求專業協助。
        <div style="margin-top:8px">線上版本：<span class="num">https://lion5835.github.io/stoic-pause-simulator/</span></div>
      </div>`;
  }

  /* ---------- morning measure ---------- */
  let M=null, mRAF=null, revealTimers=[];
  function later(fn,ms){ revealTimers.push(setTimeout(fn,ms)); }
  function clearReveal(){ revealTimers.forEach(clearTimeout); revealTimers=[]; }

  function startMorning(){
    const ds=todayStr();
    const pack=baselineForDate(ds);
    const ov=$('#ovMeasure');
    ov.classList.add('on');
    ov.innerHTML=`
      <div class="ov-head">
        <button class="icon-btn" type="button" data-act="cancelMeasure" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:#f4f4f5"><span class="ms">close</span></button>
        <h2>晨間基線 · 模擬</h2>
        <div class="sp"></div>
        <button class="btn" type="button" data-act="toggleSpeed" style="min-height:36px;font-size:12px;background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:#f4f4f5" id="spdBtn">${S.demoSpeed?'加速 ×'+(S.speedMult||12):'即時'}</button>
      </div>
      <div class="ov-body">
        <div class="panel ecg-box"><div class="plabel"><i></i>模擬心電圖 · 非正式量測</div><canvas id="ecgBg"></canvas><canvas id="ecgFg"></canvas></div>
        <div class="panel pc-box"><div class="plabel">心跳指紋正在成形</div><canvas id="pcBg"></canvas><canvas id="pcFg"></canvas></div>
        <div class="live3 num">
          <div><b id="lvLeft">01:30</b><span>剩餘</span></div>
          <div><b id="lvHr">—</b><span>模擬心率</span></div>
          <div><b id="lvR">—</b><span>RMSSD ms</span></div>
        </div>
        <button class="btn ghost block" type="button" data-act="skipMeasure" style="border-color:rgba(255,255,255,.18);color:#f4f4f5">略過動畫，看今日心型</button>
      </div>`;
    requestAnimationFrame(()=>bootMeasure(pack));
  }
  function bootMeasure(pack){
    const e1=fit($('#ecgBg')), e2=fit($('#ecgFg')), p1=fit($('#pcBg')), p2=fit($('#pcFg'));
    const WIN=e1.w<320?3:5, mm=e1.w/(WIN*25);
    e1.x.lineWidth=1;
    for(let i=0;i*mm<=e1.w;i++){ e1.x.strokeStyle=i%5===0?'rgba(255,255,255,.09)':'rgba(255,255,255,.035)'; e1.x.beginPath(); e1.x.moveTo(i*mm+.5,0); e1.x.lineTo(i*mm+.5,e1.h); e1.x.stroke(); }
    for(let j=0;j*mm<=e1.h;j++){ e1.x.strokeStyle=j%5===0?'rgba(255,255,255,.09)':'rgba(255,255,255,.035)'; e1.x.beginPath(); e1.x.moveTo(0,j*mm+.5); e1.x.lineTo(e1.w,j*mm+.5); e1.x.stroke(); }
    const pf=pcFrame(p1.x,p1.w,p1.h,28); drawPcAxes(p1.x,pf);
    M={ pack, WIN, t0:performance.now(), last:performance.now(), sim:0, bi:0, pi:0, e2, p2, pf, mm, live:[], liveNext:0.3, lastX:0, r:mulberry32(99), pauseNext:false };
    cancelAnimationFrame(mRAF); mRAF=requestAnimationFrame(measureLoop);
  }
  function liveBeat(M){
    const sc=M.pack.sc, t=M.sim, r=M.r;
    const hr=sc.hr+sc.settle*Math.exp(-t/sc.tau);
    let rr=60/hr + sc.rsa/1000*Math.sin(2*Math.PI*0.25*M.liveNext) + sc.noise/1000*gauss(r);
    let type='N';
    if(M.pauseNext){ rr*=1.42; M.pauseNext=false; }
    else if(r()<0.02){ rr*=0.62; type='V'; M.pauseNext=true; }
    M.live.push({t:M.liveNext+rr, rr, type});
    M.liveNext+=rr;
    if(M.live.length>28) M.live.shift();
  }
  function measureLoop(now){
    if(!M) return;
    const dt=Math.min(0.08,(now-M.last)/1000); M.last=now;
    const rt=(now-M.t0)/1000;
    M.sim=Math.min(MEASURE_DUR, M.sim + dt*speed());
    while(M.liveNext<rt+0.8) liveBeat(M);
    const {x:ex,w:ew,h:eh}=M.e2, WIN=M.WIN, gain=10*M.mm, mid=eh*0.62;
    const curX=(rt%WIN)/WIN*ew;
    const drawSeg=(fromX,toX,tEnd)=>{
      ex.clearRect(fromX,0,Math.min(ew,toX+16)-fromX,eh);
      ex.strokeStyle=COL.brand; ex.lineWidth=1.5; ex.shadowColor=COL.brand; ex.shadowBlur=6; ex.beginPath();
      for(let px=fromX;px<=toX;px+=1){ const tau=tEnd-(toX-px)/ew*WIN; const y=mid-ecgAt(tau,M.live,{})*gain; px===fromX?ex.moveTo(px,y):ex.lineTo(px,y); }
      ex.stroke(); ex.shadowBlur=0;
    };
    if(curX>=M.lastX) drawSeg(M.lastX,curX,rt);
    else { const tWrap=rt-curX/ew*WIN; drawSeg(M.lastX,ew,tWrap); drawSeg(0,curX,rt); }
    M.lastX=curX;
    const {x:px2}=M.p2;
    while(M.bi<M.pack.beats.length && M.pack.beats[M.bi].t<=M.sim){
      M.bi++;
      while(M.pi<M.pack.R.pts.length && M.pi<M.bi-1){
        const p=M.pack.R.pts[M.pi++];
        dot(px2, M.pf.X(p.x), M.pf.Y(p.y), p.k);
      }
    }
    const left=MEASURE_DUR-M.sim;
    const leftEl=$('#lvLeft'); if(leftEl) leftEl.textContent=`${pad(Math.floor(left/60))}:${pad(Math.floor(left%60))}`;
    const recent=M.pack.beats.filter(b=>b.t<=M.sim && b.t>M.sim-18);
    const hrEl=$('#lvHr'); if(hrEl) hrEl.textContent=recent.length>2?Math.round(60/(recent.reduce((a,b)=>a+b.rr,0)/recent.length)):'—';
    const nn=[]; const ok=M.pack.beats.filter(b=>b.t<=M.sim && b.type==='N');
    for(let i=1;i<ok.length;i++) nn.push(ok[i].rr*1000);
    const d=nn.slice(1).map((x,i)=>x-nn[i]);
    const rm=d.length>4?Math.sqrt(d.reduce((s,x)=>s+x*x,0)/d.length):null;
    const rEl=$('#lvR'); if(rEl) rEl.textContent=rm?rm.toFixed(0):'—';
    if(M.sim>=MEASURE_DUR){ finishMorning(M.pack); return; }
    mRAF=requestAnimationFrame(measureLoop);
  }
  function cancelMeasure(){
    M=null; cancelAnimationFrame(mRAF);
    $('#ovMeasure').classList.remove('on'); $('#ovMeasure').innerHTML='';
  }
  function finishMorning(pack){
    M=null; cancelAnimationFrame(mRAF);
    $('#ovMeasure').classList.remove('on'); $('#ovMeasure').innerHTML='';
    const rec=pack.rec;
    S.baselines=S.baselines.filter(b=>b.date!==rec.date).concat([rec]);
    save();
    showReveal(pack);
  }
  function showReveal(pack){
    const rec=pack.rec, ov=$('#ovReveal');
    ov.classList.add('on');
    ov.innerHTML=`
      <div class="reveal">
        <div class="kicker">你的今日心型是</div>
        <div class="cards4" id="rvCards">
          ${[
            {k:'tempo',l:rec.code[0]},
            {k:'flex',l:rec.code[1]},
            {k:'pat',l:rec.code[2]},
            {k:'set',l:rec.code[3]}
          ].map(a=>`<div class="fc"><div class="fr">?<small>${AXL[a.k]}</small></div><div class="bk"><b>${a.l}</b><span>${AX[a.l]}</span></div></div>`).join('')}
        </div>
        <div class="tname" id="rvName">${rec.name}型</div>
        <div class="tdesc" id="rvDesc">${rec.desc}</div>
        <div class="hint-box" id="rvHint" style="opacity:0;transition:opacity .4s">${rec.hint}</div>
        <div class="quote" id="rvQ" style="opacity:0;transition:opacity .4s">「${rec.quote}」<cite>—— ${rec.quoteBy}</cite></div>
        <button class="btn-hero" type="button" data-act="closeReveal" style="margin-top:16px;opacity:0;transition:opacity .4s" id="rvGo">開始今天</button>
      </div>`;
    const cards=[...ov.querySelectorAll('.fc')];
    clearReveal();
    if(reduceMotion()){
      cards.forEach(c=>c.classList.add('flip'));
      ['#rvName','#rvDesc'].forEach(s=>$(s).classList.add('in'));
      ['#rvHint','#rvQ','#rvGo'].forEach(s=>$(s).style.opacity=1);
      return;
    }
    cards.forEach((c,i)=>later(()=>c.classList.add('flip'), 280+i*420));
    later(()=>{ $('#rvName').classList.add('in'); $('#rvDesc').classList.add('in'); }, 280+4*420);
    later(()=>{ ['#rvHint','#rvQ','#rvGo'].forEach(s=>$(s).style.opacity=1); }, 280+4*420+280);
  }
  function closeReveal(){
    clearReveal();
    $('#ovReveal').classList.remove('on'); $('#ovReveal').innerHTML='';
    showTab('home');
  }

  /* ---------- breath ---------- */
  let B=null, bRAF=null;
  function startCrave(){
    pauseDraft={ hunger:5, emotions:[], step:'breathe', id:uid(), waitLeft:WAIT_SEC };
    const b0=todayBaseline();
    const startR=b0?b0.rmssd:28;
    const ov=$('#ovBreath');
    ov.classList.add('on');
    ov.innerHTML=`
      <div class="ov-head">
        <button class="icon-btn" type="button" data-act="cancelBreath" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:#f4f4f5"><span class="ms">close</span></button>
        <h2>止念呼吸 · 模擬</h2>
        <div class="sp"></div>
        <button class="btn" type="button" data-act="toggleSpeed" style="min-height:36px;font-size:12px;background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:#f4f4f5" id="spdBtn2">${S.demoSpeed?'加速 ×'+(S.speedMult||12):'即時'}</button>
      </div>
      <div class="breath-wrap">
        <div class="breath-ring">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle class="trk" cx="50" cy="50" r="46" fill="none" stroke-width="3"/>
            <circle class="bar" id="brBar" cx="50" cy="50" r="46" fill="none" stroke-width="3" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
          </svg>
          <div class="breath-orb" id="orb"></div>
        </div>
        <div class="phase" id="brPhase">吸氣</div>
        <div class="phase-sub num" id="brSub">準備</div>
        <div class="rmssd-live">
          <div><b class="num" id="brR">${startR.toFixed(0)}</b><span>模擬 RMSSD ms</span></div>
          <div><b class="num" id="brT">02:00</b><span>剩餘</span></div>
        </div>
        <p class="muted" style="margin-top:14px;max-width:22em">吸氣 4 秒，吐氣 6 秒。數字會上升是示意副交感活性，不是真實訊號。</p>
        <button class="btn ghost" type="button" data-act="skipBreath" style="margin-top:8px;border-color:rgba(255,255,255,.18);color:#f4f4f5">略過，進入反思</button>
      </div>`;
    B={ t0:performance.now(), last:performance.now(), sim:0, startR, endR:startR+14 };
    cancelAnimationFrame(bRAF); bRAF=requestAnimationFrame(breathLoop);
  }
  function breathLoop(now){
    if(!B) return;
    const dt=Math.min(0.08,(now-B.last)/1000); B.last=now;
    B.sim=Math.min(BREATH_TOTAL, B.sim + dt*speed());
    const cycle=BREATH_IN+BREATH_OUT;
    const p=B.sim%cycle;
    const inhaling=p<BREATH_IN;
    const k=inhaling? p/BREATH_IN : (p-BREATH_IN)/BREATH_OUT;
    const ease=0.5-0.5*Math.cos(Math.PI*k);
    const scale=inhaling? 0.68+0.34*ease : 1.02-0.34*ease;
    const orb=$('#orb'); if(orb) orb.style.transform=`scale(${scale})`;
    const phase=$('#brPhase'); if(phase) phase.textContent=inhaling?'吸氣':'吐氣';
    const left=BREATH_TOTAL-B.sim;
    const sub=$('#brSub'); if(sub) sub.textContent=inhaling?`還有 ${(BREATH_IN-p).toFixed(0)} 秒`:`慢慢吐 · ${(BREATH_OUT-(p-BREATH_IN)).toFixed(0)} 秒`;
    const tEl=$('#brT'); if(tEl) tEl.textContent=`${pad(Math.floor(left/60))}:${pad(Math.floor(left%60))}`;
    const bar=$('#brBar'); if(bar) bar.setAttribute('stroke-dashoffset', (100-B.sim/BREATH_TOTAL*100).toFixed(2));
    const rise=B.startR + (B.endR-B.startR)*(B.sim/BREATH_TOTAL) + Math.sin(B.sim*0.7)*0.8;
    const rEl=$('#brR'); if(rEl) rEl.textContent=rise.toFixed(0);
    B.curR=rise;
    if(B.sim>=BREATH_TOTAL){ finishBreath(); return; }
    bRAF=requestAnimationFrame(breathLoop);
  }
  function finishBreath(){
    const rmssdEnd=B?B.curR:30, rmssdStart=B?B.startR:28;
    B=null; cancelAnimationFrame(bRAF);
    $('#ovBreath').classList.remove('on'); $('#ovBreath').innerHTML='';
    pauseDraft.step='reflect';
    pauseDraft.rmssdStart=+rmssdStart.toFixed(1);
    pauseDraft.rmssdEnd=+rmssdEnd.toFixed(1);
    showTab('pause');
  }
  function cancelBreath(){
    B=null; cancelAnimationFrame(bRAF);
    $('#ovBreath').classList.remove('on'); $('#ovBreath').innerHTML='';
    pauseDraft.step='idle';
    renderPause();
  }

  /* ---------- wait timer ---------- */
  let W=null, wRAF=null;
  function startWait(){
    pauseDraft.step='wait';
    pauseDraft.waitLeft=WAIT_SEC;
    renderPause();
    W={ t0:performance.now(), last:performance.now(), sim:0 };
    cancelAnimationFrame(wRAF); wRAF=requestAnimationFrame(waitLoop);
  }
  function waitLoop(now){
    if(!W || pauseDraft.step!=='wait') return;
    const dt=Math.min(0.1,(now-W.last)/1000); W.last=now;
    W.sim=Math.min(WAIT_SEC, W.sim + dt*speed());
    pauseDraft.waitLeft=WAIT_SEC-W.sim;
    const el=$('#waitClock'); if(el) el.textContent=fmtWait(pauseDraft.waitLeft);
    if(W.sim>=WAIT_SEC){ W=null; toast('10 分鐘到了。你現在怎麼決定？'); return; }
    wRAF=requestAnimationFrame(waitLoop);
  }
  function stopWait(){ W=null; cancelAnimationFrame(wRAF); }

  function logPause(choice, outcome, extra){
    const rec={
      id: pauseDraft.id || uid(),
      date: todayStr(),
      ts: Date.now(),
      hunger: pauseDraft.hunger,
      emotions: [...pauseDraft.emotions],
      choice, alt: extra && extra.alt || '',
      outcome,
      rmssdStart: pauseDraft.rmssdStart||null,
      rmssdEnd: pauseDraft.rmssdEnd||null,
      durationSec: BREATH_TOTAL
    };
    S.pauses=S.pauses.filter(p=>p.id!==rec.id).concat([rec]);
    pauseDraft.id=rec.id;
    save();
    return rec;
  }

  /* ---------- onboarding ---------- */
  let ob=0;
  function renderOb(){
    const root=$('#onboarding');
    const shell=$('.phone-screen');
    if(S.onboarded){ root.classList.remove('on'); shell.classList.remove('ob-open'); return; }
    root.classList.add('on');
    shell.classList.add('ob-open');
    $$('.ob-slide', root).forEach(s=>s.classList.toggle('on', +s.dataset.ob===ob));
    $$('#obDots i').forEach((d,i)=>d.classList.toggle('on', i===ob));
    $('#obBack').hidden = ob===0;
    $('#obNext').textContent = ob===3 ? '進入模擬器' : '繼續';
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e=>{
    const tabBtn=e.target.closest('[data-tab]');
    if(tabBtn && !e.target.closest('[data-act]')){
      if(!S.onboarded) return;
      showTab(tabBtn.dataset.tab);
      return;
    }
    const b=e.target.closest('[data-act]'); if(!b) return;
    const a=b.dataset.act, v=b.dataset.v;
    switch(a){
      case 'morning': startMorning(); break;
      case 'cancelMeasure': cancelMeasure(); break;
      case 'skipMeasure': if(M) finishMorning(M.pack); else startMorning(); break;
      case 'closeReveal': closeReveal(); break;
      case 'toggleSpeed':
        S.demoSpeed=!S.demoSpeed; save();
        $$('#spdBtn, #spdBtn2').forEach(el=>{ if(el) el.textContent=S.demoSpeed?'加速 ×'+(S.speedMult||12):'即時'; });
        toast(S.demoSpeed?'示範加速已開啟':'改為即時速度');
        break;
      case 'crave': startCrave(); break;
      case 'cancelBreath': cancelBreath(); break;
      case 'skipBreath': finishBreath(); break;
      case 'emo': {
        const i=pauseDraft.emotions.indexOf(v);
        if(i>=0) pauseDraft.emotions.splice(i,1); else pauseDraft.emotions.push(v);
        b.classList.toggle('on');
        break;
      }
      case 'toChoice': pauseDraft.step='choose'; renderPause(); break;
      case 'choose':
        if(v==='wait'){ logPause('wait','pending'); startWait(); }
        else if(v==='alt'){
          const alt=ALTS[Math.floor(Math.random()*ALTS.length)];
          logPause('alt','alt',{alt});
          pauseDraft.step='done'; stopWait(); renderPause();
          toast('替代行動：'+alt);
        } else {
          logPause('mindful','mindful');
          pauseDraft.step='done'; renderPause();
        }
        break;
      case 'waitEnd':
        stopWait();
        logPause('wait', v);
        pauseDraft.step='done'; renderPause();
        break;
      case 'pauseReset': pauseDraft={hunger:5,emotions:[],step:'idle',id:null}; renderPause(); break;
      case 'trig': {
        if(!journalDraft) return;
        const i=journalDraft.triggers.indexOf(v);
        if(i>=0) journalDraft.triggers.splice(i,1); else journalDraft.triggers.push(v);
        b.classList.toggle('on');
        break;
      }
      case 'rate':
        if(!journalDraft) return;
        journalDraft.rating=+v;
        $$('#stars button').forEach((x,i)=>x.classList.toggle('on', i<journalDraft.rating));
        break;
      case 'saveJournal': {
        journalDraft.successes=($('#jSuccess')||{}).value||'';
        journalDraft.text=($('#jText')||{}).value||'';
        journalDraft.date=todayStr();
        S.journals=S.journals.filter(j=>j.date!==journalDraft.date).concat([{...journalDraft}]);
        save(); toast('夜誌已存在這台裝置');
        break;
      }
      case 'range': dashRange=+v; renderDash(); break;
      case 'theme': applyTheme(S.theme==='dark'?'light':'dark'); save(); renderHome(); break;
      case 'themeSet': applyTheme(v); save(); renderSettings(); break;
      case 'demoSpeed': S.demoSpeed=v==='1'; save(); renderSettings(); break;
      case 'mult': S.speedMult=+v; save(); renderSettings(); break;
      case 'saveW': {
        const n=parseFloat(($('#wInput')||{}).value);
        if(!n || n<20 || n>300){ toast('請輸入合理的公斤數'); break; }
        S.weightLogs=S.weightLogs.filter(w=>w.date!==todayStr()).concat([{date:todayStr(), kg:+n.toFixed(1)}]);
        save(); toast('已記錄今日體重（次要指標）'); renderSettings();
        break;
      }
      case 'seed': seedDemo(); toast('已植入 30 日示範資料'); showTab('dash'); break;
      case 'reset':
        if(!confirm('確定清除本機全部模擬資料？')) break;
        S=emptyState(); S.onboarded=true; save();
        pauseDraft={hunger:5,emotions:[],step:'idle',id:null};
        toast('已清除'); showTab('home');
        break;
    }
  });
  document.addEventListener('input', e=>{
    if(e.target.id==='hunger'){
      pauseDraft.hunger=+e.target.value;
      const v=$('#hungerVal'); if(v) v.textContent=pauseDraft.hunger;
    }
  });
  $('#obNext').addEventListener('click', ()=>{
    if(ob<3){ ob++; renderOb(); }
    else { S.onboarded=true; save(); renderOb(); showTab('home'); }
  });
  $('#obBack').addEventListener('click', ()=>{ if(ob>0){ ob--; renderOb(); } });

  window.addEventListener('resize', ()=>{
    if(tab==='dash') renderDash();
    if(tab==='home' && todayBaseline() && $('#homeEmb')){
      const b=todayBaseline();
      drawEmblem($('#homeEmb'), b, baselineForDate(b.date).R.pts);
    }
  });

  /* ---------- boot ---------- */
  load();
  tickClock(); setInterval(tickClock, 10000);
  renderOb();
  if(S.onboarded) showTab('home');
})();
