(function(){
  var cfg=window.STUDY_HUB_TOPIC_PRACTICE||{};
  var questions=(cfg.questions||[]).map(function(q,i){q.id=i;return q;});
  var state={shuffle:false};
  function $(id){return document.getElementById(id);}
  function esc(v){return String(v).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
  function norm(v){return String(v).toLowerCase().replace(/[^\w\s/%.-]/g,' ').replace(/\s+/g,' ').trim();}
  function uniq(arr){return arr.filter(function(x,i){return arr.indexOf(x)===i;});}
  function shuffle(arr){var a=arr.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function fillFilters(){
    $('topic-filter').innerHTML='<option value="">All topics</option>'+uniq(questions.map(function(q){return q.topic;})).map(function(t){return'<option value="'+esc(t)+'">'+esc(t)+'</option>';}).join('');
    $('format-filter').innerHTML='<option value="">All formats</option>'+uniq(questions.map(function(q){return q.format;})).map(function(t){return'<option value="'+esc(t)+'">'+esc(t)+'</option>';}).join('');
  }
  function filtered(){
    var query=norm($('practice-search').value), topic=$('topic-filter').value, format=$('format-filter').value;
    var out=questions.filter(function(q){
      var model=Array.isArray(q.model)?q.model.join(' '):(q.model||'');
      var hay=norm([q.topic,q.format,q.prompt,q.scenario,model,(q.plan||[]).join(' ')].join(' '));
      return (!topic||q.topic===topic)&&(!format||q.format===format)&&(!query||hay.indexOf(query)!==-1);
    });
    return state.shuffle?shuffle(out):out;
  }
  function modelHtml(q){
    var model=Array.isArray(q.model)?q.model:(q.model?[q.model]:['A strong answer should apply the topic directly to the scenario, use the correct method or theory, and finish with a clear judgement or interpretation.']);
    return model.map(function(p){return'<p>'+esc(p)+'</p>';}).join('');
  }
  function workbookLines(marks){
    var n=/15/.test(marks||'')?18:(/12|10/.test(marks||'')?14:10);
    var out='';
    for(var i=0;i<n;i++)out+='<div class="write-line"></div>';
    return out;
  }
  function workbookHtml(items, includeMarks, title){
    var grouped=uniq(items.map(function(q){return q.topic;}));
    var questionsHtml=items.map(function(q,idx){
      return '<section class="wb-question"><div class="wb-card-top"><div><div class="wb-meta">'+esc(q.topic)+'</div><h2>Question '+(idx+1)+'</h2></div><div class="wb-pill">'+esc(q.format)+' · '+esc(q.marks||'')+'</div></div><p class="wb-prompt">'+esc(q.prompt)+'</p><p class="wb-scenario">'+esc(q.scenario||'')+'</p><div class="answer-space">'+workbookLines(q.marks)+'</div></section>';
    }).join('');
    var markHtml=includeMarks?'<section class="mark-scheme"><h1>Model Answers and Self-Mark Checklists</h1>'+items.map(function(q,idx){
      var plan=(q.plan||[]).map(function(p){return'<li>'+esc(p)+'</li>';}).join('');
      return '<article class="scheme-item"><div class="wb-card-top"><div><div class="wb-meta">'+esc(q.topic)+'</div><h2>Question '+(idx+1)+'</h2></div><div class="wb-pill">'+esc(q.format)+' · '+esc(q.marks||'')+'</div></div><div class="scheme-model">'+modelHtml(q)+'</div><h3>Self-mark checklist</h3><ul>'+plan+'</ul></article>';
    }).join('')+'</section>':'';
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+esc(title)+'</title><style>'+
      '@page{size:A4;margin:14mm}*{box-sizing:border-box}body{margin:0;background:#f5f1e8;color:#201a12;font-family:Arial,Helvetica,sans-serif;line-height:1.45}.cover{min-height:250mm;page-break-after:always;background:#0e0f11;color:#f0ede8;padding:24mm 20mm;border-radius:2mm;position:relative;overflow:hidden}.cover:before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 90% 50% at 15% 0%,rgba(201,168,76,.2),transparent 60%),radial-gradient(ellipse 70% 45% at 90% 100%,rgba(91,143,168,.16),transparent 60%)}.cover>*{position:relative}.brand{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#c9a84c;margin-bottom:18mm}.cover h1{font-family:Georgia,serif;font-size:34px;line-height:1.05;margin:0 0 8mm}.cover-copy{max-width:145mm;color:#d8d2c8;font-size:14px}.cover-panel{margin-top:16mm;border:1px solid rgba(255,255,255,.12);background:#16181c;padding:8mm;border-radius:3mm}.topic-list{columns:2;column-gap:12mm;margin:5mm 0 0;padding-left:5mm}.topic-list li{break-inside:avoid;color:#f0ede8}.note{font-size:12px;color:#9ea2aa;margin-top:8mm}.wb-question{page-break-inside:avoid;background:#fffaf0;border:1px solid #d8c99b;border-left:4px solid #c9a84c;border-radius:3mm;padding:7mm;margin:0 0 8mm;box-shadow:0 1mm 4mm rgba(0,0,0,.05)}.wb-card-top{display:flex;justify-content:space-between;gap:8mm;align-items:flex-start;border-bottom:1px solid #e5d9b8;padding-bottom:3mm;margin-bottom:4mm}.wb-meta{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5b8fa8;margin-bottom:1mm}.wb-pill{font-size:9px;letter-spacing:.09em;text-transform:uppercase;color:#6d5618;border:1px solid #d4b870;background:#f7edcf;border-radius:999px;padding:1.5mm 3mm;white-space:nowrap}h1{font-family:Georgia,serif;font-size:26px;margin:0 0 8mm}h2{font-family:Georgia,serif;font-size:17px;margin:0;color:#201a12}h3{font-size:12px;margin:5mm 0 2mm;color:#6d5618;text-transform:uppercase;letter-spacing:.08em}.wb-prompt{font-size:14px;font-weight:700;margin:0 0 3mm}.wb-scenario{font-size:13px;color:#3c3428;margin:0 0 5mm}.answer-space{background:linear-gradient(#fffdf8,#fff9ec);border:1px solid #eadfbe;border-radius:2mm;padding:2mm 4mm}.write-line{height:18px;border-bottom:1px solid #c8bea4;margin-bottom:7px}.mark-scheme{page-break-before:always}.scheme-item{page-break-inside:avoid;background:#fffaf0;border:1px solid #d8c99b;border-left:4px solid #5b8fa8;border-radius:3mm;padding:7mm;margin:0 0 8mm}.scheme-model p{font-size:12.5px;margin:0 0 3mm}li{font-size:12.5px;margin-bottom:1.5mm}.footer-strip{position:fixed;bottom:5mm;left:14mm;right:14mm;color:#7a7469;font-size:9px;border-top:1px solid #ddd0ad;padding-top:2mm}@media print{button{display:none}.cover{-webkit-print-color-adjust:exact;print-color-adjust:exact}.wb-question,.scheme-item{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'+
      '</style></head><body><section class="cover"><div class="brand">Study Hub · Exam Workbook</div><h1>'+esc(title)+'</h1><p class="cover-copy">'+items.length+' exam-style questions. '+(includeMarks?'Model answers and self-mark checklists are included at the back after all questions.':'Mark schemes are not included in this version.')+'</p><p class="note">Use the generous lined space under each question for workings, plans and full written answers.</p><div class="cover-panel"><h2>Topics included</h2><ul class="topic-list">'+grouped.map(function(t){return'<li>'+esc(t)+'</li>';}).join('')+'</ul></div></section><div class="footer-strip">Study Hub workbook · generated from topic exam practice</div>'+questionsHtml+markHtml+'<script>window.onload=function(){setTimeout(function(){window.print();},250);};<\/script></body></html>';
  }
  function exportWorkbook(scope){
    var items=scope==='all'?questions.slice():filtered();
    if(!items.length)return;
    var includeMarks=$('include-marks')&&$('include-marks').checked;
    var title=(cfg.title||'Topic Exam Practice')+' Workbook '+(scope==='all'?'Full Module':'Current Selection');
    var win=window.open('', '_blank');
    if(!win){
      alert('Please allow pop-ups for this page so the printable PDF workbook can open.');
      return;
    }
    win.document.open();
    win.document.write(workbookHtml(items, includeMarks, title));
    win.document.close();
  }
  function render(){
    var items=filtered();
    $('question-count').textContent=questions.length;
    $('shown-count').textContent=items.length;
    $('topic-count').textContent=uniq(questions.map(function(q){return q.topic;})).length;
    $('deck-meta').textContent=items.length+' / '+questions.length+' questions shown';
    $('question-list').innerHTML=items.map(function(q,idx){
      var plan=(q.plan||[]).map(function(p){return'<li>'+esc(p)+'</li>';}).join('');
      return'<article class="question-card" data-id="'+q.id+'"><div class="q-top"><div><div class="q-topic">'+esc(q.topic)+'</div><div class="q-meta">'+(idx+1)+' / '+items.length+' · '+esc(q.marks||'')+'</div></div><span class="format-pill">'+esc(q.format)+'</span></div><div class="prompt">'+esc(q.prompt)+'</div><div class="scenario">'+esc(q.scenario||'')+'</div><div class="answer-plan" id="plan-'+q.id+'"><strong>Model answer</strong><div class="model-answer">'+modelHtml(q)+'</div><strong>Self-mark checklist</strong><ul>'+plan+'</ul></div><div class="q-actions"><a class="source-link" href="'+esc(q.source||'index.html')+'">Source notes</a><button class="tool-btn" type="button" data-plan="'+q.id+'">Show answer</button></div></article>';
    }).join('');
  }
  function boot(){
    document.body.classList.add('page-transition-init');
    window.addEventListener('load',function(){requestAnimationFrame(function(){document.body.classList.remove('page-transition-init');document.body.classList.add('page-transition-ready');});});
    document.addEventListener('click',function(event){
      var btn=event.target.closest('[data-plan]');
      if(btn){var plan=$('plan-'+btn.getAttribute('data-plan'));if(plan){plan.classList.toggle('visible');btn.textContent=plan.classList.contains('visible')?'Hide answer':'Show answer';}return;}
      var link=event.target.closest('a[href]');
      if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      if(link.target&&link.target!=='_self')return;
      var href=link.getAttribute('href'); if(!href||href.charAt(0)==='#'||/^(mailto:|tel:|javascript:)/i.test(href))return;
      var url=new URL(link.href,window.location.href); if(url.origin!==window.location.origin)return;
      event.preventDefault(); document.body.classList.remove('page-transition-ready'); document.body.classList.add('page-transition-leaving'); window.setTimeout(function(){window.location.href=url.href;},180);
    });
    $('module-title').textContent=cfg.title||'Topic Exam Practice';
    $('module-eyebrow').textContent=cfg.eyebrow||'Study Hub · Topic practice';
    $('module-subtitle').textContent=cfg.subtitle||'Exam-style questions organised by topic.';
    fillFilters(); render();
    var toolbar=document.querySelector('.toolbar');
    if(toolbar){
      var row=document.createElement('div');
      row.className='workbook-row';
      row.innerHTML='<label class="workbook-check"><input id="include-marks" type="checkbox"> Include mark schemes at back</label><button class="tool-btn" id="pdf-current" type="button">PDF current filter</button><button class="tool-btn" id="pdf-all" type="button">PDF whole module</button>';
      toolbar.appendChild(row);
    }
    $('practice-search').addEventListener('input',render);
    $('topic-filter').addEventListener('change',render);
    $('format-filter').addEventListener('change',render);
    $('clear').addEventListener('click',function(){$('practice-search').value='';$('topic-filter').value='';$('format-filter').value='';render();});
    $('shuffle').addEventListener('click',function(){state.shuffle=!state.shuffle;this.classList.toggle('is-active',state.shuffle);render();});
    $('pdf-current').addEventListener('click',function(){exportWorkbook('current');});
    $('pdf-all').addEventListener('click',function(){exportWorkbook('all');});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
