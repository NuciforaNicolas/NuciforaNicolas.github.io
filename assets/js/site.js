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
