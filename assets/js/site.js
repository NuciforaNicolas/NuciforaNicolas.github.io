// Theme switch: follows the system until the visitor picks a theme
var themeSwitch = document.querySelector('.theme-switch');
if (themeSwitch) {
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: light)');
  var isDark = function () {
    var forced = root.getAttribute('data-theme');
    return forced ? forced === 'dark' : !media.matches;
  };
  var sync = function () { themeSwitch.setAttribute('aria-checked', String(isDark())); };
  sync();
  media.addEventListener('change', sync);
  themeSwitch.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
  });
}

// Language switch: English lives in the markup, Italian in data-it attributes
var langButtons = document.querySelectorAll('.lang-switch button');
var langAttrs = { label: 'aria-label', alt: 'alt' };
var setLang = function (lang) {
  var it = lang === 'it';
  document.querySelectorAll('[data-it]').forEach(function (el) {
    if (el.dataset.en === undefined) el.dataset.en = el.textContent;
    el.textContent = it ? el.dataset.it : el.dataset.en;
  });
  Object.keys(langAttrs).forEach(function (key) {
    var attr = langAttrs[key];
    var itKey = 'it' + key.charAt(0).toUpperCase() + key.slice(1);
    var enKey = 'en' + key.charAt(0).toUpperCase() + key.slice(1);
    document.querySelectorAll('[data-it-' + key + ']').forEach(function (el) {
      if (el.dataset[enKey] === undefined) el.dataset[enKey] = el.getAttribute(attr) || '';
      el.setAttribute(attr, it ? el.dataset[itKey] : el.dataset[enKey]);
    });
  });
  document.documentElement.lang = lang;
  langButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
  document.documentElement.classList.remove('i18n-pending');
};
setLang(document.documentElement.lang === 'it' ? 'it' : 'en');
langButtons.forEach(function (b) {
  b.addEventListener('click', function () {
    setLang(b.dataset.lang);
    try { localStorage.setItem('lang', b.dataset.lang); } catch (e) {}
  });
});

// YouTube facade: loads the player only on click
document.querySelectorAll('.video[data-yt]').forEach(function (el) {
  var id = el.dataset.yt;
  el.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + id + '/hqdefault.jpg)';
  el.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
    f.title = el.getAttribute('aria-label') || 'Video';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    el.appendChild(f);
    el.classList.add('playing');
  }, { once: true });
});

// Gallery lightbox
var links = Array.prototype.slice.call(document.querySelectorAll('.gallery a'));
if (links.length && window.HTMLDialogElement) {
  var box = document.createElement('dialog');
  box.className = 'lightbox';
  box.innerHTML = '<img alt=""><button class="prev" aria-label="Previous">&#8249;</button>' +
    '<button class="next" aria-label="Next">&#8250;</button><button class="close" aria-label="Close">&#215;</button>';
  document.body.appendChild(box);
  var img = box.querySelector('img');
  var current = 0;

  var show = function (i) {
    current = (i + links.length) % links.length;
    img.src = links[current].href;
    img.alt = links[current].querySelector('img').alt;
  };

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
      box.showModal();
    });
  });
  box.querySelector('.prev').onclick = function () { show(current - 1); };
  box.querySelector('.next').onclick = function () { show(current + 1); };
  box.querySelector('.close').onclick = function () { box.close(); };
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.open) return;
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}
