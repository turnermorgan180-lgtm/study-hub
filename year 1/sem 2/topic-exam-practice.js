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
      return '<section class="wb-question"><div class="wb-meta">'+esc(q.topic)+' · '+esc(q.format)+' · '+esc(q.marks||'')+'</div><h2>Question '+(idx+1)+'</h2><p class="wb-prompt">'+esc(q.prompt)+'</p><p class="wb-scenario">'+esc(q.scenario||'')+'</p>'+workbookLines(q.marks)+'</section>';
    }).join('');
    var markHtml=includeMarks?'<section class="mark-scheme"><h1>Model Answers and Self-Mark Checklists</h1>'+items.map(function(q,idx){
      var plan=(q.plan||[]).map(function(p){return'<li>'+esc(p)+'</li>';}).join('');
      return '<article class="scheme-item"><div class="wb-meta">'+esc(q.topic)+' · '+esc(q.format)+' · '+esc(q.marks||'')+'</div><h2>Question '+(idx+1)+'</h2><div class="scheme-model">'+modelHtml(q)+'</div><h3>Self-mark checklist</h3><ul>'+plan+'</ul></article>';
    }).join('')+'</section>':'';
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+esc(title)+'</title><style>'+
      '@page{size:A4;margin:16mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#111;line-height:1.45}.cover{page-break-after:always}h1{font-size:24px;margin:0 0 10px}h2{font-size:16px;margin:6px 0 8px}h3{font-size:13px;margin:12px 0 4px}.wb-meta{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#555;margin-bottom:5px}.wb-prompt{font-size:14px;font-weight:700}.wb-scenario{font-size:13px}.wb-question{page-break-inside:avoid;margin-bottom:16px}.write-line{height:18px;border-bottom:1px solid #bbb;margin-bottom:7px}.topic-list{columns:2;margin-top:14px}.mark-scheme{page-break-before:always}.scheme-item{page-break-inside:avoid;border-top:1px solid #ccc;padding-top:10px;margin-top:12px}.scheme-model p{font-size:12.5px;margin:0 0 7px}li{font-size:12.5px;margin-bottom:3px}.note{font-size:12px;color:#444;margin-top:12px}@media print{button{display:none}}'+
      '</style></head><body><section class="cover"><h1>'+esc(title)+'</h1><p>'+items.length+' exam-style questions. '+(includeMarks?'Model answers and self-mark checklists are included at the back.':'Mark schemes are not included in this version.')+'</p><p class="note">Use the lined space under each question for workings, plans and full written answers.</p><h2>Topics included</h2><ul class="topic-list">'+grouped.map(function(t){return'<li>'+esc(t)+'</li>';}).join('')+'</ul></section>'+questionsHtml+markHtml+'<script>window.onload=function(){setTimeout(function(){window.print();},250);};<\/script></body></html>';
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
