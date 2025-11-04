const fmt = (n, unit='') => (n==null||isNaN(n)) ? '—' : new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2}).format(n)+(unit?` ${unit}`:'');
async function loadJSON(p){const r=await fetch(p);return r.json();}

const state={ whatif:0 };
async function init(){
  const basePath = './data';
  const files=[[`${basePath}/what_if_baseline.json`,'baseline'],
               [`${basePath}/margin_bridge.json`,'bridge'],
               [`${basePath}/abc_waterfall.json`,'abc'],
               [`${basePath}/process_variants.json`,'variants'],
               [`${basePath}/nva_heatmap.json`,'heatmap'],
               [`${basePath}/sla.json`,'sla'],
               [`${basePath}/abc_bom_items.json`,'bomItems'],
               [`${basePath}/abc_products.json`,'products'],
               [`${basePath}/abc_opportunities.json`,'opportunities']];
  for(const [p,k] of files){ state[k]=await loadJSON(p); }
  renderAll();
  setupABCTabs();
  const slider=document.getElementById('whatif');const label=document.getElementById('whatif-val');
  slider.addEventListener('input',()=>{state.whatif=Number(slider.value);label.textContent=slider.value;renderKPIs();});
}
function renderAll(){renderKPIs();renderBridge();renderABC();renderSankey();renderHeatmap();renderABCAnalysis();}

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

// ABC Analysis Functions
function setupABCTabs(){
  const tabs=document.querySelectorAll('.abc-tab');
  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      const target=tab.dataset.tab;
      document.querySelectorAll('.abc-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.abc-tab-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${target}`).classList.add('active');
    });
  });
}

function classifyABC(items, valueKey){
  const sorted=[...items].sort((a,b)=>b[valueKey]-a[valueKey]);
  const total=sorted.reduce((sum,item)=>sum+item[valueKey],0);
  let cumulative=0;
  return sorted.map(item=>{
    const value=item[valueKey];
    const pct=(value/total)*100;
    cumulative+=pct;
    let category='C';
    if(cumulative<=80)category='A';
    else if(cumulative<=95)category='B';
    return {...item,category,pct,cumulative,total};
  });
}

function renderABCAnalysis(){
  renderABCPareto();
  renderBOMTable();
  renderProductsTable();
  renderOpportunities();
}

function renderABCPareto(){
  const bomClassified=classifyABC(state.bomItems.items,'annual_cost');
  const productsClassified=classifyABC(state.products.products,'margin');

  // BoM Pareto chart
  const bomLabels=bomClassified.map(i=>i.name);
  const bomValues=bomClassified.map(i=>i.annual_cost);
  const bomCumulative=bomClassified.map(i=>i.cumulative);
  const bomColors=bomClassified.map(i=>i.category==='A'?'#ff6b6b':i.category==='B'?'#ffa94d':'#51cf66');

  Plotly.newPlot('chart-abc-bom',[
    {type:'bar',x:bomLabels,y:bomValues,name:'Coût annuel',marker:{color:bomColors},yaxis:'y'},
    {type:'scatter',x:bomLabels,y:bomCumulative,name:'% Cumulé',mode:'lines+markers',line:{color:'#5fb3ff',width:2},yaxis:'y2'}
  ],{
    margin:{t:20,l:50,r:50,b:120},
    plot_bgcolor:'#111a33',
    paper_bgcolor:'#111a33',
    font:{color:'#e6f0ff',size:10},
    xaxis:{tickangle:-45},
    yaxis:{title:'Coût annuel (€)',side:'left'},
    yaxis2:{title:'% Cumulé',overlaying:'y',side:'right',range:[0,100]},
    legend:{x:0.02,y:0.98},
    showlegend:true
  },{displayModeBar:false,responsive:true});

  // Products Pareto chart
  const prodLabels=productsClassified.map(i=>i.name);
  const prodValues=productsClassified.map(i=>i.margin);
  const prodCumulative=productsClassified.map(i=>i.cumulative);
  const prodColors=productsClassified.map(i=>i.category==='A'?'#ff6b6b':i.category==='B'?'#ffa94d':'#51cf66');

  Plotly.newPlot('chart-abc-products',[
    {type:'bar',x:prodLabels,y:prodValues,name:'Marge annuelle',marker:{color:prodColors},yaxis:'y'},
    {type:'scatter',x:prodLabels,y:prodCumulative,name:'% Cumulé',mode:'lines+markers',line:{color:'#5fb3ff',width:2},yaxis:'y2'}
  ],{
    margin:{t:20,l:50,r:50,b:120},
    plot_bgcolor:'#111a33',
    paper_bgcolor:'#111a33',
    font:{color:'#e6f0ff',size:10},
    xaxis:{tickangle:-45},
    yaxis:{title:'Marge annuelle (€)',side:'left'},
    yaxis2:{title:'% Cumulé',overlaying:'y',side:'right',range:[0,100]},
    legend:{x:0.02,y:0.98},
    showlegend:true
  },{displayModeBar:false,responsive:true});

  // Update summary stats
  const bomA=bomClassified.filter(i=>i.category==='A');
  const bomB=bomClassified.filter(i=>i.category==='B');
  const bomC=bomClassified.filter(i=>i.category==='C');
  const bomTotal=bomClassified.reduce((s,i)=>s+i.annual_cost,0);

  document.getElementById('stat-bom-a-count').textContent=`${bomA.length} items`;
  document.getElementById('stat-bom-a-value').textContent=`${fmt(bomA.reduce((s,i)=>s+i.annual_cost,0),'€')} (${fmt((bomA.reduce((s,i)=>s+i.annual_cost,0)/bomTotal)*100,'%')})`;
  document.getElementById('stat-bom-b-count').textContent=`${bomB.length} items`;
  document.getElementById('stat-bom-b-value').textContent=`${fmt(bomB.reduce((s,i)=>s+i.annual_cost,0),'€')} (${fmt((bomB.reduce((s,i)=>s+i.annual_cost,0)/bomTotal)*100,'%')})`;
  document.getElementById('stat-bom-c-count').textContent=`${bomC.length} items`;
  document.getElementById('stat-bom-c-value').textContent=`${fmt(bomC.reduce((s,i)=>s+i.annual_cost,0),'€')} (${fmt((bomC.reduce((s,i)=>s+i.annual_cost,0)/bomTotal)*100,'%')})`;
}

function renderBOMTable(){
  const classified=classifyABC(state.bomItems.items,'annual_cost');
  const tbody=document.getElementById('bom-table-body');
  tbody.innerHTML='';

  classified.forEach(item=>{
    const row=document.createElement('tr');
    const catClass=item.category==='A'?'cat-a':item.category==='B'?'cat-b':'cat-c';
    row.innerHTML=`
      <td><span class="category-badge ${catClass}">${item.category}</span></td>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${fmt(item.annual_cost,'€')}</td>
      <td>${fmt(item.pct,'%')}</td>
      <td>${fmt(item.cumulative,'%')}</td>
      <td>${item.supplier}</td>
      <td>${item.lead_time_days}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderProductsTable(){
  const classified=classifyABC(state.products.products,'margin');
  const tbody=document.getElementById('products-table-body');
  tbody.innerHTML='';

  classified.forEach(item=>{
    const row=document.createElement('tr');
    const catClass=item.category==='A'?'cat-a':item.category==='B'?'cat-b':'cat-c';
    row.innerHTML=`
      <td><span class="category-badge ${catClass}">${item.category}</span></td>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.type}</td>
      <td>${fmt(item.annual_units)}</td>
      <td>${fmt(item.margin,'€')}</td>
      <td>${fmt(item.margin_pct,'%')}</td>
      <td>${fmt(item.pct,'%')}</td>
      <td>${fmt(item.cumulative,'%')}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderOpportunities(){
  const opps=state.opportunities.opportunities;
  const sorted=[...opps].sort((a,b)=>{
    const priority={'High':3,'Medium':2,'Low':1};
    if(priority[b.priority]!==priority[a.priority])return priority[b.priority]-priority[a.priority];
    return b.potential_savings_annual-a.potential_savings_annual;
  });

  const container=document.getElementById('opportunities-list');
  container.innerHTML='';

  sorted.forEach(opp=>{
    const card=document.createElement('div');
    card.className='opportunity-card';
    const priorityClass=opp.priority==='High'?'priority-high':opp.priority==='Medium'?'priority-medium':'priority-low';

    const rootCauses=opp.root_causes.map(rc=>`<li>${rc}</li>`).join('');
    const actions=opp.actions.map(ac=>`<li>${ac}</li>`).join('');

    card.innerHTML=`
      <div class="opp-header">
        <div>
          <h4>${opp.title}</h4>
          <span class="opp-category">${opp.category}</span>
          <span class="opp-priority ${priorityClass}">${opp.priority} Priority</span>
        </div>
        <div class="opp-savings">${fmt(opp.potential_savings_annual,'€')}/an</div>
      </div>
      <div class="opp-metrics">
        <div class="metric"><span class="metric-label">Économies:</span> ${fmt(opp.potential_savings_annual,'€')}/an (${opp.savings_pct}%)</div>
        <div class="metric"><span class="metric-label">Investissement:</span> ${fmt(opp.implementation_cost,'€')}</div>
        <div class="metric"><span class="metric-label">ROI:</span> ${fmt(opp.roi_months)} mois</div>
      </div>
      <div class="opp-details">
        <div class="detail-section">
          <strong>Causes racines:</strong>
          <ul>${rootCauses}</ul>
        </div>
        <div class="detail-section">
          <strong>Actions recommandées:</strong>
          <ul>${actions}</ul>
        </div>
        <div class="detail-section">
          <strong>Impact KPI:</strong>
          <div class="kpi-impacts">
            ${Object.entries(opp.kpi_impact).map(([k,v])=>`<span class="kpi-badge ${v<0?'positive':'neutral'}">${k}: ${v>0?'+':''}${fmt(v,k.includes('pct')||k.includes('rate')?'%':'')}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Update summary
  const totalSavings=opps.reduce((s,o)=>s+o.potential_savings_annual,0);
  const totalInvestment=opps.reduce((s,o)=>s+o.implementation_cost,0);
  const avgROI=opps.reduce((s,o)=>s+o.roi_months,0)/opps.length;
  const highPriority=opps.filter(o=>o.priority==='High').length;

  document.getElementById('total-savings').textContent=fmt(totalSavings,'€');
  document.getElementById('total-investment').textContent=fmt(totalInvestment,'€');
  document.getElementById('avg-roi').textContent=fmt(avgROI,'mois');
  document.getElementById('high-priority-count').textContent=highPriority;
}

init();
