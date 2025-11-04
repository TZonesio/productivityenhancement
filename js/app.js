const fmt = (n, unit='') => (n==null||isNaN(n)) ? '—' : new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2}).format(n)+(unit?` ${unit}`:'');
async function loadJSON(p){const r=await fetch(p);return r.json();}

const state={ whatif:0 };
async function init(){
  const basePath = '.';
  const files=[[`${basePath}/data/what_if_baseline.json`,'baseline'],
               [`${basePath}/data/margin_bridge.json`,'bridge'],
               [`${basePath}/data/abc_waterfall.json`,'abc'],
               [`${basePath}/data/process_variants.json`,'variants'],
               [`${basePath}/data/nva_heatmap.json`,'heatmap'],
               [`${basePath}/data/sla.json`,'sla']];
  for(const [p,k] of files){ state[k]=await loadJSON(p); }
  renderAll();
  const slider=document.getElementById('whatif');const label=document.getElementById('whatif-val');
  slider.addEventListener('input',()=>{state.whatif=Number(slider.value);label.textContent=slider.value;renderKPIs();});
}
function renderAll(){renderKPIs();renderBridge();renderABC();renderSankey();renderHeatmap();}

function renderKPIs(){
  const b=state.baseline, sla=state.sla.overall_pct;
  const delta=b.rework_cost_per_unit*(state.whatif/100);
  const eur=b.eur_per_unit - delta;
  const marge=b.margin_pct + (delta/b.revenue_per_unit)*100;
  document.getElementById('kpi-eur').textContent=fmt(eur,'€');
  document.getElementById('kpi-marge').textContent=fmt(marge,'%');
  document.getElementById('kpi-oee').textContent=fmt(b.oee_proxy,'%');
  document.getElementById('kpi-sla').textContent=fmt(sla,'%');
}
function renderBridge(){
  const d=state.bridge;
  Plotly.newPlot('chart-bridge',[{type:'waterfall',orientation:'v',measure:d.measures,x:d.labels,y:d.values,text:d.text,connector:{line:{width:1}}}],{margin:{t:20,l:30,r:10,b:40},plot_bgcolor:'#111a33',paper_bgcolor:'#111a33',font:{color:'#e6f0ff'}},{displayModeBar:false,responsive:true});
}
function renderABC(){
  const d=state.abc;
  Plotly.newPlot('chart-waterfall',[{type:'waterfall',orientation:'v',measure:d.measures,x:d.labels,y:d.values,connector:{line:{width:1}}}],{margin:{t:20,l:30,r:10,b:40},plot_bgcolor:'#111a33',paper_bgcolor:'#111a33',font:{color:'#e6f0ff'}},{displayModeBar:false,responsive:true});
}
function renderSankey(){
  const v=state.variants;
  const link={source:v.links.map(l=>l.source),target:v.links.map(l=>l.target),value:v.links.map(l=>l.value)};
  Plotly.newPlot('chart-sankey',[{type:'sankey',arrangement:'snap',node:{pad:15,thickness:14,line:{color:'rgba(255,255,255,0.1)',width:1},label:v.nodes.map(n=>n.name),color:v.nodes.map(n=>n.color)},link}],{margin:{t:20,l:20,r:20,b:20},plot_bgcolor:'#111a33',paper_bgcolor:'#111a33',font:{color:'#e6f0ff'}},{displayModeBar:false,responsive:true});
}
function renderHeatmap(){
  const h=state.heatmap;
  Plotly.newPlot('chart-heatmap',[{z:h.matrix,x:h.columns,y:h.rows,type:'heatmap',hoverongaps:false,colorscale:'YlOrRd'}],{margin:{t:20,l:80,r:10,b:60},plot_bgcolor:'#111a33',paper_bgcolor:'#111a33',font:{color:'#e6f0ff'}},{displayModeBar:false,responsive:true});
}

init();
