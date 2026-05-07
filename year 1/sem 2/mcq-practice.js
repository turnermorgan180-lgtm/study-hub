(function(){
  var config=window.STUDY_HUB_MCQ||{};
  var state={cards:[],view:[],answers:{},marked:false,shuffle:false};
  var els={};
  function $(id){return document.getElementById(id);}
  function text(node){return (node?node.textContent:'').replace(/\s+/g,' ').trim();}
  function normalise(value){return String(value).toLowerCase().replace(/&/g,' and ').replace(/[^\w\s/%.-]/g,' ').replace(/\s+/g,' ').trim();}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,function(ch){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];});}
  function shuffle(items){var arr=items.slice();for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=arr[i];arr[i]=arr[j];arr[j]=tmp;}return arr;}
  function shortAnswer(html){
    var div=document.createElement('div');
    div.innerHTML=html;
    var cleaned=text(div);
    return cleaned.length>220?cleaned.slice(0,217).replace(/\s+\S*$/,'...'):cleaned;
  }
  function uniqueOptions(card, pool){
    var correct=card.answerHtml;
    var sameTopic=pool.filter(function(item){return item.topic===card.topic&&item.id!==card.id;});
    var otherTopic=pool.filter(function(item){return item.topic!==card.topic;});
    var choices=[correct];
    shuffle(sameTopic.concat(otherTopic)).forEach(function(item){
      if(choices.length>=4)return;
      if(normalise(shortAnswer(item.answerHtml))!==normalise(shortAnswer(correct))&&!choices.some(function(choice){return normalise(shortAnswer(choice))===normalise(shortAnswer(item.answerHtml));})){
        choices.push(item.answerHtml);
      }
    });
    return shuffle(choices).map(function(answer){return{html:answer,correct:answer===correct};});
  }
  function installMathRenderer(doc){
    var style=doc.querySelector('#study-hub-math-style');
    var script=doc.querySelector('#study-hub-math-renderer');
    if(style&&!document.getElementById('study-hub-math-style')){
      document.head.appendChild(style.cloneNode(true));
    }
    if(script&&!window.__studyHubMathRenderer){
      var s=document.createElement('script');
      s.id='study-hub-math-renderer';
      s.text=script.textContent;
      document.body.appendChild(s);
    } else if(window.studyHubTypesetMath) {
      window.studyHubTypesetMath(document.body);
    }
  }
  function loadFlashcards(){
    return fetch(config.flashcardsHref||'flashcards.html').then(function(response){
      if(!response.ok)throw new Error('Could not load flashcards');
      return response.text();
    }).then(function(html){
      var doc=new DOMParser().parseFromString(html,'text/html');
      installMathRenderer(doc);
      state.cards=Array.prototype.slice.call(doc.querySelectorAll('.flashcard')).map(function(card,idx){
        var answer=card.querySelector('.answer');
        var source=card.querySelector('.source-link');
        return{
          id:idx,
          topic:card.getAttribute('data-topic')||text(card.querySelector('.card-topic')),
          prompt:text(card.querySelector('.prompt')),
          answerHtml:answer?answer.innerHTML:'',
          sourceHref:source?source.getAttribute('href'):(config.flashcardsHref||'flashcards.html')
        };
      }).filter(function(card){return card.prompt&&card.answerHtml;});
      buildTopicFilter();
      applyView();
    });
  }
  function buildTopicFilter(){
    var topics=[];
    state.cards.forEach(function(card){if(topics.indexOf(card.topic)===-1)topics.push(card.topic);});
    els.topic.innerHTML='<option value="">All topics</option>'+topics.map(function(topic){return'<option value="'+escapeHtml(topic)+'">'+escapeHtml(topic)+'</option>';}).join('');
  }
  function applyView(){
    var q=normalise(els.search.value);
    var topic=els.topic.value;
    state.view=state.cards.filter(function(card){
      var topicOk=!topic||card.topic===topic;
      var queryOk=!q||normalise(card.prompt+' '+shortAnswer(card.answerHtml)+' '+card.topic).indexOf(q)!==-1;
      return topicOk&&queryOk;
    });
    if(state.shuffle)state.view=shuffle(state.view);
    state.answers={};
    state.marked=false;
    render();
  }
  function render(){
    var total=state.view.length;
    $('total-count').textContent=state.cards.length;
    $('shown-count').textContent=total;
    $('topic-count').textContent=new Set(state.cards.map(function(card){return card.topic;})).size;
    els.meta.textContent=total+' / '+state.cards.length+' questions shown';
    els.questions.innerHTML=state.view.map(function(card,idx){
      var options=uniqueOptions(card,state.cards);
      card.options=options;
      return'<article class="question-card" data-id="'+card.id+'">'+
        '<div class="question-top"><div class="question-topic">'+escapeHtml(card.topic)+'</div><div class="question-count">'+(idx+1)+' / '+total+'</div></div>'+
        '<div class="prompt">'+escapeHtml(card.prompt)+'</div>'+
        '<div class="options">'+options.map(function(option,optIdx){
          return'<label class="option-row"><input type="radio" name="q-'+card.id+'" value="'+optIdx+'"><div class="option-copy">'+option.html+'</div></label>';
        }).join('')+'</div>'+
        '<div class="feedback" id="feedback-'+card.id+'"><strong>Correct answer:</strong> '+card.answerHtml+'</div>'+
        '<div class="question-actions"><a class="source-link" href="'+escapeHtml(card.sourceHref)+'">Source notes</a><span class="question-count">Select one answer</span></div>'+
      '</article>';
    }).join('');
    updateScore();
    if(window.studyHubTypesetMath)window.studyHubTypesetMath(els.questions);
  }
  function updateScore(){
    var total=state.view.length;
    var answered=Object.keys(state.answers).length;
    var correct=0;
    state.view.forEach(function(card){
      var picked=state.answers[card.id];
      if(picked!=null&&card.options[picked]&&card.options[picked].correct)correct++;
    });
    var pct=total?Math.round((correct/total)*100):0;
    els.score.textContent=state.marked?pct+'%':'Not marked';
    els.scoreCopy.textContent=state.marked?(correct+' correct out of '+total+' · '+pct+'%'):(answered+' of '+total+' answered');
  }
  function markAttempt(){
    state.marked=true;
    state.view.forEach(function(card){
      var root=document.querySelector('.question-card[data-id="'+card.id+'"]');
      if(!root)return;
      var picked=state.answers[card.id];
      var correctIdx=card.options.findIndex(function(option){return option.correct;});
      var isCorrect=picked===correctIdx;
      root.classList.toggle('is-correct',isCorrect);
      root.classList.toggle('is-wrong',picked!=null&&!isCorrect);
      Array.prototype.forEach.call(root.querySelectorAll('.option-row'),function(row,idx){
        row.classList.toggle('is-answer',idx===correctIdx);
        row.classList.toggle('is-missed',picked===idx&&idx!==correctIdx);
      });
      var feedback=$('feedback-'+card.id);
      if(feedback)feedback.classList.add('visible');
    });
    updateScore();
    if(window.studyHubTypesetMath)window.studyHubTypesetMath(els.questions);
  }
  function resetAttempt(){
    state.answers={};
    state.marked=false;
    render();
  }
  function bind(){
    els.search=$('mcq-search');
    els.topic=$('topic-filter');
    els.meta=$('deck-meta');
    els.questions=$('question-list');
    els.score=$('score-main');
    els.scoreCopy=$('score-copy');
    els.search.addEventListener('input',applyView);
    els.topic.addEventListener('change',applyView);
    $('clear').addEventListener('click',function(){els.search.value='';els.topic.value='';applyView();});
    $('shuffle').addEventListener('click',function(){state.shuffle=!state.shuffle;this.classList.toggle('is-active',state.shuffle);applyView();});
    $('all-topics').addEventListener('click',function(){els.topic.value='';applyView();});
    $('mark').addEventListener('click',markAttempt);
    $('reset').addEventListener('click',resetAttempt);
    document.addEventListener('change',function(event){
      if(event.target.type!=='radio'||event.target.name.indexOf('q-')!==0)return;
      var id=Number(event.target.name.slice(2));
      state.answers[id]=Number(event.target.value);
      var root=event.target.closest('.question-card');
      Array.prototype.forEach.call(root.querySelectorAll('.option-row'),function(row){row.classList.remove('is-picked');});
      event.target.closest('.option-row').classList.add('is-picked');
      if(state.marked)markAttempt();else updateScore();
    });
  }
  function boot(){
    bind();
    $('module-title').textContent=config.moduleTitle||'Module';
    $('module-eyebrow').textContent=config.eyebrow||'Study Hub · MCQ practice';
    $('module-subtitle').textContent=config.subtitle||'Multiple-choice practice generated from the flashcard deck.';
    loadFlashcards().catch(function(error){
      els.meta.textContent=error.message;
      els.questions.innerHTML='<article class="question-card"><div class="prompt">Could not load the flashcard deck.</div><div class="feedback visible">Open this page through the Study Hub website so the browser can load the local flashcard file.</div></article>';
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
