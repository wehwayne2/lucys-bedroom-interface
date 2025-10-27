import './style.scss'

const toggleButton = document.getElementById('theme-toggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
}

toggleButton.addEventListener('click', () => {
  const currentTheme = root.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});


// fix svg redraw issue on firefox
const isFirefox = typeof InstallTrigger !== 'undefined';

if (isFirefox) {
  const svgs = document.querySelectorAll('.border-svg');

  function redrawRects() {
    svgs.forEach(svg => {
      const rect = svg.querySelector('rect');
      if (!rect) return;

      const newRect = rect.cloneNode(true);
      svg.removeChild(rect);
      svg.appendChild(newRect);
    });
  }
  
    redrawRects();
    
  window.addEventListener('DOMContentLoaded', redrawRects);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      redrawRects();
    }, 100);
  });
}