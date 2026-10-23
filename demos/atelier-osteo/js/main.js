document.getElementById('y').textContent = new Date().getFullYear();
  // Statut ouvert / fermé (heure de Paris). Minutes depuis minuit : 450 = 7h30, 1290 = 21h30…
  // 0 = dimanche, 1 = lundi … 6 = samedi.  "call" = sur appel uniquement.
  window.LANG='fr'; function L(fr,en){return window.LANG==='en'?en:fr;}
  function updateStatus(){
    const H = {
      paris:{1:[[510,1290]],2:[[450,1290]],3:[[450,1230]]},
      lyon:{1:'call',2:'call',3:'call',4:[[480,1200]],5:[[480,1200]],6:[[840,1200]]}
    };
    const p = new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    const g = t => (p.find(x=>x.type===t)||{}).value;
    const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday'));
    const m = (+g('hour')%24)*60 + (+g('minute'));
    document.querySelectorAll('.site').forEach(function(card){
      const h = H[card.dataset.site][day], el = card.querySelector('[data-status]');
      if (h === 'call') { el.textContent = L('Sur appel','On call'); el.className = 'status call'; }
      else if (h && h.some(r => m >= r[0] && m < r[1])) { el.textContent = L('Ouvert','Open'); el.className = 'status on'; }
      else { el.textContent = L('Fermé','Closed'); el.className = 'status'; }
      card.querySelectorAll('tr[data-day]').forEach(function(tr){
        const d=+tr.dataset.day, rows={1:[1,2,3],4:[4,5,6,0]};
        if (d===day || (tr.cells[0].textContent.includes('–') && (rows[d]||[]).includes(day))) tr.classList.add('today');
      });
    });
  }
  updateStatus();
  // Carrousel : défile automatiquement toutes les 4 s, flèches, points et glisser du doigt
  (function(){
    const box=document.getElementById('slider'); if(!box) return;
    const slides=[...box.querySelectorAll('.slide')], dots=box.querySelector('.s-dots');
    if(slides.length<2){box.classList.add('single'); slides[0]&&slides[0].classList.add('on'); return;}
    let i=0, timer;
    slides.forEach((_,k)=>{const b=document.createElement('button');b.setAttribute('aria-label','Photo '+(k+1));b.onclick=()=>go(k,true);dots.appendChild(b);});
    function go(n,user){slides[i].classList.remove('on');dots.children[i].classList.remove('on');i=(n+slides.length)%slides.length;slides[i].classList.add('on');dots.children[i].classList.add('on');if(user)restart();}
    function restart(){clearInterval(timer);timer=setInterval(()=>go(i+1),4000);}
    box.querySelector('.s-prev').onclick=()=>go(i-1,true);
    box.querySelector('.s-next').onclick=()=>go(i+1,true);
    let x0=null; box.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
    box.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(i+(dx<0?1:-1),true);x0=null;});
    go(0); restart();
  })();
  // Onglets avis Paris / Lyon
  document.querySelectorAll('.rev-tabs button').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.rev-tabs button').forEach(b=>b.setAttribute('aria-selected',b===btn));
      document.querySelectorAll('.rev-panel').forEach(p=>p.hidden=(p.id!==btn.dataset.tab));
      document.getElementById('rv-note').textContent=window.LANG==='en'?btn.dataset.note.replace(',','.'):btn.dataset.note;
      document.getElementById('rv-nb').textContent=btn.dataset.nb;
      document.getElementById('rv-site').textContent=btn.firstChild.textContent.trim();
    });
  });
  // Langue FR / EN (textes anglais dans les attributs data-en)
  (function(){
    const btn=document.getElementById('lang-btn'), TITLE_FR=document.title,
      TITLE_EN='Atelier Ostéo – Demo';
    function setLang(l){
      window.LANG=l; document.documentElement.lang=l;
      document.querySelectorAll('[data-en]').forEach(function(el){
        if(!el.hasAttribute('data-fr')) el.setAttribute('data-fr',el.innerHTML);
        el.innerHTML=el.getAttribute(l==='en'?'data-en':'data-fr');
      });
      document.title=l==='en'?TITLE_EN:TITLE_FR;
      btn.textContent=l==='en'?'FR':'EN';
      btn.setAttribute('aria-label',l==='en'?'Version française':'English version');
      btn.title=btn.getAttribute('aria-label');
      updateStatus();
      const sel=document.querySelector('.rev-tabs [aria-selected="true"]'); if(sel) sel.click();
      try{localStorage.setItem('lang',l);}catch(e){}
    }
    btn.addEventListener('click',function(){setLang(window.LANG==='en'?'fr':'en');});
    let start='fr';
    try{start=localStorage.getItem('lang')||'';}catch(e){}
    if(/[?&]lang=en/.test(location.search)) start='en';
    if(!start) start=(navigator.language||'fr').toLowerCase().startsWith('fr')?'fr':'en';
    if(start==='en') setLang('en');
  })();
