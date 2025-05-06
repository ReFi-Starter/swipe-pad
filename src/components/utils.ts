// Helper functions for external swipe triggers
export const swipeLeft = (ref: HTMLDivElement) => {
  if (!ref) return;
  ref.style.transform = `translateX(-200px) rotate(-20deg)`;
  ref.style.transition = 'transform 0.5s ease-out';
  setTimeout(() => {
    const parent = ref.parentElement;
    if (parent) parent.classList.add('moving-left');
  }, 100);
};

export const swipeRight = (ref: HTMLDivElement) => {
  if (!ref) return;
  ref.style.transform = `translateX(200px) rotate(20deg)`;
  ref.style.transition = 'transform 0.5s ease-out';
  setTimeout(() => {
    const parent = ref.parentElement;
    if (parent) parent.classList.add('moving-right');
  }, 100);
}; 