import './style.scss'
import gsap from "gsap";

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

  window.addEventListener('load', redrawRects);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      redrawRects();
    }, 100);
  });
}

/* const clock = document.getElementById("clock");
const hands = document.getElementById("hands");
function updateClock() {

  const hourHand = document.getElementById("hour");
  const minuteHand = document.getElementById("minute");
  const secondHand = document.getElementById("second");

  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  const hourRotation = (hours % 12) * 30 + (minutes / 60) * 30;
  const minuteRotation = minutes * 6 + (seconds / 60) * 6;
  const secondRotation = seconds * 6;

  hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minuteRotation}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${secondRotation}deg)`;
}

let isWarping = false;

clock.addEventListener("mouseenter", () => {
  if (isWarping) return;
  isWarping = true;
  hands.classList.add("warp");

  clock.addEventListener(
    "animationend",
    () => {
      hands.classList.remove("warp");
      isWarping = false;
    },
    { once: true }
  );
});

setInterval(updateClock, 1000);
updateClock(); */

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

  gsap.to(closeBtn, {
    scale: 1,
    rotation: 0,
    opacity: 1,
    duration: 0.6,
    ease: "back.out(1.7)",
    delay: 0.2,
    onStart: () => {
      gsap.set(closeBtn, { scale: 0, rotation: -90, opacity: 0 });
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

    setInterval(updateClock, 10000);
    updateClock(); 

    function getDayPeriod() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'morning';   // 5am–11:59am
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon'; // 12pm–4:59pm
  } else if (hour >= 17 && hour < 21) {
    return 'evening';   // 5pm–8:59pm
  } else {
    return 'night';     // 9pm–4:59am
  }
}

const period = getDayPeriod();

const dialogText = document.getElementById('dialog-text'); 
dialogText.textContent = `Good ${period} !`;
const dialog = document.getElementById('dialog');

dialog.addEventListener('click', () => {
  dialogText.textContent = "Welcome to my portfolio !";
});