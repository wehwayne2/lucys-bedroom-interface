import './style.scss'
import gsap from "gsap";

/*----------------------- theme based on dayperiod & theme toggle-----------------------*/
const toggleButton = document.getElementById('theme-toggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {

  root.removeAttribute('data-theme');
  localStorage.setItem('theme', 'light');
  /*   const period = getDayPeriod();
  
    if (period === 'evening' || period === 'night') {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } */
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
    x: "100vw",
    opacity: 0,
    rotation: 0,
    duration: 0.6,
    ease: "power2.in",
    delay: 0.1,
    onComplete: () => {
      modal.classList.add('hidden');
      gsap.set(modal, { clearProps: "all" });
    }
  });
}


closeBtn.addEventListener('click', (event) => {
  event.stopPropagation(); //important
  hideModal();
});

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
/*----------------------- menu icon and sidebar -----------------------*/
const menuHamburger = document.querySelector('.menu-icon');
const sidebar = document.getElementById("sidebar");

menuHamburger.addEventListener("click", (event) => {
  menuHamburger.classList.toggle("open");
  sidebar.classList.toggle("sidebar-pop-out");
});

document.addEventListener("click", (event) => {
  const isClickInsideSidebar = sidebar.contains(event.target);
  const isClickOnMenuIcon = menuHamburger.contains(event.target);

  if (!isClickInsideSidebar && !isClickOnMenuIcon && sidebar.classList.contains("sidebar-pop-out")) {
    sidebar.classList.remove("sidebar-pop-out");
    menuHamburger.classList.remove("open");
  }
});

/*----------------------- loading page-----------------------*/
const bar = document.getElementById('bar-fill');
const enterBtn = document.getElementById('enterBtn');
const muteBtn = document.querySelector('#enterBtn-mute');

function getStates() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) {
    // Only 2 states on mobile
    return {
      slow: document.querySelector('.mobile-lucy-slow'),
      fast: document.querySelector('.mobile-lucy-fast'),
      finished: document.querySelector('.mobile-lucy-finished')
    };
  } else {
    // 3 states on desktop
    return {
      slow: document.querySelector('.state.slow'),
      fast: document.querySelector('.state.fast'),
      finished: document.querySelector('.state.finished')
    };
  }
}

let states = getStates();

function showState(stateName) {
  Object.values(states).forEach(s => s.classList.remove('visible'));
  states[stateName].classList.add('visible');
}

function updateStatePosition(progress) {
  Object.values(states).forEach(stateDiv => {
    stateDiv.style.left = progress + '%';
  });
}

function simulateLoading() {
  let progress = 0;
  const interval = setInterval(() => {
    let speed = Math.random() * 3;
    progress += speed;
    /*     statusText.textContent = `${Math.floor(progress)}%`; */

    if (progress < 30) showState('slow');
    else if (progress < 100) showState('fast');
    else {
      progress = 100;
      showState('finished');
      enterBtn.classList.add('enabled');
      enterBtn.disabled = false;

      muteBtn.classList.add('enabled');
      muteBtn.disabled = false;

      clearInterval(interval);

    }
    progress = Math.min(progress, 100)//for better simulation
    bar.style.width = progress + '%';
    updateStatePosition(progress)
  }, 100);
}

simulateLoading();

const loadingPage = document.getElementById('loading-container')
let enterBtns = [enterBtn, muteBtn];

enterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    loadingPage.classList.toggle('loading-hidden');
    loadingPage.addEventListener('animationend', () => {
      loadingPage.style.pointerEvents = 'none';
      loadingPage.style.visibility = 'hidden';
    }, { once: true });
  })
})
