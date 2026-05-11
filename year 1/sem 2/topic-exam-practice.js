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
      var hay=norm([q.topic,q.format,q.prompt,q.scenario,(q.plan||[]).join(' ')].join(' '));
      return (!topic||q.topic===topic)&&(!format||q.format===format)&&(!query||hay.indexOf(query)!==-1);
    });
    return state.shuffle?shuffle(out):out;
  }
  function render(){
    var items=filtered();
    $('question-count').textContent=questions.length;
    $('shown-count').textContent=items.length;
    $('topic-count').textContent=uniq(questions.map(function(q){return q.topic;})).length;
    $('deck-meta').textContent=items.length+' / '+questions.length+' questions shown';
    $('question-list').innerHTML=items.map(function(q,idx){
      var plan=(q.plan||[]).map(function(p){return'<li>'+esc(p)+'</li>';}).join('');
      return'<article class="question-card" data-id="'+q.id+'"><div class="q-top"><div><div class="q-topic">'+esc(q.topic)+'</div><div class="q-meta">'+(idx+1)+' / '+items.length+' · '+esc(q.marks||'')+'</div></div><span class="format-pill">'+esc(q.format)+'</span></div><div class="prompt">'+esc(q.prompt)+'</div><div class="scenario">'+esc(q.scenario||'')+'</div><div class="answer-plan" id="plan-'+q.id+'"><strong>Answer plan / self-mark checklist</strong><ul>'+plan+'</ul></div><div class="q-actions"><a class="source-link" href="'+esc(q.source||'index.html')+'">Source notes</a><button class="tool-btn" type="button" data-plan="'+q.id+'">Show plan</button></div></article>';
    }).join('');
  }
  function boot(){
    document.body.classList.add('page-transition-init');
    window.addEventListener('load',function(){requestAnimationFrame(function(){document.body.classList.remove('page-transition-init');document.body.classList.add('page-transition-ready');});});
    document.addEventListener('click',function(event){
      var btn=event.target.closest('[data-plan]');
      if(btn){var plan=$('plan-'+btn.getAttribute('data-plan'));if(plan){plan.classList.toggle('visible');btn.textContent=plan.classList.contains('visible')?'Hide plan':'Show plan';}return;}
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
    $('practice-search').addEventListener('input',render);
    $('topic-filter').addEventListener('change',render);
    $('format-filter').addEventListener('change',render);
    $('clear').addEventListener('click',function(){$('practice-search').value='';$('topic-filter').value='';$('format-filter').value='';render();});
    $('shuffle').addEventListener('click',function(){state.shuffle=!state.shuffle;this.classList.toggle('is-active',state.shuffle);render();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
