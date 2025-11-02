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

/*----------------------- dialog -----------------------*/
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

dialog.addEventListener(
  "click",
  (e) => {
    dialogText.textContent = "Welcome to my portfolio!";
  });
/*----------------------- menu icon and sidebar -----------------------*/
const menuHamburger = document.getElementById("menu-icon");
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





const bar = document.getElementById('bar-fill');
  const statusText = document.getElementById('status');
  const enterBtn = document.getElementById('enterBtn');
  const movingImg = document.getElementById('movingImg');
  const loadingBar = document.getElementById('loading-bar');

  let progress = 0;

  const images = {
    slow: "/lucy-svgs/lucy-slow.svg",
    fast: "/lucy-svgs/lucy-fast.svg",
    finished: "/lucy-svgs/lucy-smile.svg"
  };

  const simulateLoading = () => {
    const interval = setInterval(() => {
      // Random speed
      let speed = Math.random() * 3;
      progress += speed;
statusText.textContent = `${Math.floor(progress)}%`;
      if (progress < 30) {
        movingImg.src = images.slow;
        movingImg.dataset.state = "slow";
      } else if (progress < 100) {
        movingImg.src = images.fast;
        movingImg.dataset.state = "fast";
      } else {
        progress = 100;
        movingImg.src = images.finished;
        movingImg.dataset.state = "finished";
        enterBtn.classList.add('enabled');
        enterBtn.disabled = false;
        clearInterval(interval);
      }

      bar.style.width = progress + '%';

      const barWidth = loadingBar.offsetWidth;
      const imgWidth = movingImg.offsetWidth;
      let leftPos = (progress / 100) * (barWidth - imgWidth);
      movingImg.style.left = leftPos + "px";

    }, 100);
  }

  simulateLoading();

  const LoadingPage = document.getElementById('loading-container')
  enterBtn.addEventListener('click', () => {
    LoadingPage.classList.toggle('loading-hidden');
  });