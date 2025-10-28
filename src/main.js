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

    function updateClock() {
      const clock = document.getElementById('clock');
      const now = new Date();

      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';

      // convert to 12-hour format
      hours = hours % 12 || 12;

      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      clock.textContent = timeString;
    }

    // update every second
    setInterval(updateClock, 1000);
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

document.getElementById('period-text').textContent = `Good ${period}`;