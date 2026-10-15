// Bascule FR / EN : chaque texte porte les attributs data-fr et data-en.
(function () {
  function appliquer(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-fr]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });
    document.querySelectorAll('[data-href-fr]').forEach(function (el) {
      el.setAttribute('href', el.getAttribute('data-href-' + lang) || el.getAttribute('data-href-fr'));
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('actif', b.dataset.lang === lang);
    });
    try { localStorage.setItem('langue', lang); } catch (e) {}
  }
  var initiale = 'fr';
  try { initiale = localStorage.getItem('langue') || 'fr'; } catch (e) {}
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { appliquer(b.dataset.lang); });
  });
  appliquer(initiale);
})();
