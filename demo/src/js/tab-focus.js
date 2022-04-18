// Setup tab focus
const container = document.getElementById('container');
const tabClassName = 'tab-focus';

// Remove class on blur
document.addEventListener('focusout', (event) => {
  if (!event.target.classList || container.contains(event.target)) {
    return;
  }

  event.target.classList.remove(tabClassName);
});

// Add classname to tabbed elements
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') {
    return;
  }

  // Delay the adding of classname until the focus has changed
  // This event fires before the focusin event
  setTimeout(() => {
    const focused = document.activeElement;

    if (!focused || !focused.classList || container.contains(focused)) {
      return;
    }

    focused.classList.add(tabClassName);
  }, 10);
});
