const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const navWrap = document.querySelector(".nav-wrap");

function closeMenu() {
  navLinks?.classList.remove("open");
  menuBtn?.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded", "false");
}

menuBtn?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (!menuBtn?.contains(event.target) && !navLinks?.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

document.querySelectorAll(".demo-reload").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    const frame = targetId ? document.getElementById(targetId) : null;

    if (!frame) return;

    const source = frame.src;
    frame.src = "";

    window.setTimeout(() => {
      frame.src = source;
    }, 60);
  });
});

window.addEventListener(
  "scroll",
  () => {
    navWrap?.classList.toggle("nav-shadow", window.scrollY > 8);
  },
  { passive: true }
);
