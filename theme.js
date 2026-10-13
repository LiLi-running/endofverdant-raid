// 녹채반역 공용 테마 전환. <head>에서 바로 불러 깜빡임 없이 적용합니다.
// 저장 키 'theme' 는 레이드 화면과 같은 값을 공유합니다 ('dark' | 'light').
(function () {
  var KEY = 'theme';
  function preferred() {
    try { var t = localStorage.getItem(KEY); if (t === 'light' || t === 'dark') return t; } catch (e) {}
    return window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function apply(t) { document.documentElement.classList.toggle('light', t === 'light'); }
  apply(preferred());
  window.toggleSiteTheme = function () {
    var t = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    try { localStorage.setItem(KEY, t); } catch (e) {}
    apply(t);
  };
  var ICON = '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
    + '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      if (!b.innerHTML.trim()) b.innerHTML = ICON;
      b.classList.add('theme-btn');
      b.setAttribute('aria-label', '밝은/어두운 테마 전환');
      b.title = '밝은/어두운 테마 전환';
      b.addEventListener('click', window.toggleSiteTheme);
    });
  });
})();
