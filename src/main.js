import './style.scss'
import gsap from "gsap";

/*----------------------- theme based on dayperiod & theme toggle-----------------------*/
const toggleButton = document.getElementById('theme-toggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  const period = getDayPeriod();

  if (period === 'evening' || period === 'night') {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
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

/*----------------------- fix redraw issue for firebox -----------------------*/
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

  window.addEventListener('load', redrawRects);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      redrawRects();
    }, 100);
  });
}

/*----------------------- modal close open -----------------------*/
const closeBtn = document.getElementById('close-btn');
const modal = document.getElementsByClassName('modal');

function showModal() {
  modal.classList.remove('hidden');

  gsap.to(modal, {
    scale: 1,
    rotation: 0,
    opacity: 1,
    duration: 0.8,
    ease: "back.out(1.7)",
    onStart: () => {
      gsap.set(modal, { scale: 0.5, rotation: -5, opacity: 0 });
    }
  });
}

function hideModal() {

  gsap.to(closeBtn, {
    scale: 0,
    rotation: 180,
    opacity: 0,
    duration: 0.5,
    ease: "back.in(1.7)",
    onComplete: () => {
      gsap.set(closeBtn, { clearProps: "all" });
    }
  });

  gsap.to(modal, {
    scale: 0,
    rotation: -5,
    opacity: 0,
    duration: 0.6,
    ease: "back.in(1.5)",
    delay: 0.1,
    onComplete: () => {
      modal.classList.add('hidden');
      gsap.set(modal, { clearProps: "all" });
    }
  });
}

if (closeBtn) {
  closeBtn.addEventListener('click', hideModal);
}

/*----------------------- digital clock -----------------------*/
function updateClock() {
  const clock = document.getElementById('clock');
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  clock.textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

/*----------------------- modal close open -----------------------*/
function getDayPeriod() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'evening';
  } else {
    return 'night';
  }
}

const period = getDayPeriod();

const dialogText = document.getElementById('dialog-text');
dialogText.textContent = `Good ${period} !`;
const dialog = document.getElementById('dialog');

dialog.addEventListener('click', () => {
  dialogText.textContent = "Welcome to my portfolio !";
});

const menuHamburger = document.getElementById("menu-icon");
const navLinks = document.getElementById("sidebar");

menuHamburger.addEventListener('click', () => {
  menuHamburger.classList.toggle('open');
  navLinks.classList.toggle('sidebar-pop-out');
});