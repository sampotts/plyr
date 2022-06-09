const DETACH_STATES = {
  init: 0,
  ready: 1,
  detached: 2,
};

class Detachable {
  constructor(element) {
    this.container = element;
    if (typeof element === 'string') {
      this.container = document.querySelector(element);
    }
    if (this.container == null) {
      throw new Error('unknown element', element);
    }
    this.container.className += 'plyr__detachable';
    this.currentState = DETACH_STATES.init;
    this.containerPrevStyles = {};
    this.initObserver();
  }

  initObserver() {
    const defaultObserverOptions = {
      root: document.querySelector('#scrollArea'),
      rootMargin: '0px',
      threshold: [0, 0.1, 0.5, 0.9, 1],
    };

    this.intersectionObserver = new IntersectionObserver(this.intersectionCallback.bind(this), defaultObserverOptions);
    this.intersectionObserver.observe(this.container.parentNode);
  }

  intersectionCallback(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.becomeVisible();
      } else {
        this.becomeInvisible();
      }
    });
  }

  onContainerVisible() {
  }

  becomeVisible() {
    if (this.currentState === DETACH_STATES.ready) {
      this.onContainerVisible();
      return;
    }
    this.restoreContainerSize();
    this.currentState = DETACH_STATES.ready;
    this.container.className = this.container.className.replace(' detached', '');
  }

  becomeInvisible() {
    if (this.currentState === DETACH_STATES.ready) {
      this.holdContainerSize();
      this.container.className += ' detached';
      this.currentState = DETACH_STATES.detached;
    }
  }

  holdContainerSize() {
    const { parentNode } = this.container;
    const { width, height } = parentNode.style;
    this.containerPrevStyles = { width, height };

    const actualSize = window.getComputedStyle(parentNode);
    parentNode.style.width = actualSize.width;
    parentNode.style.height = actualSize.height;
  }

  restoreContainerSize() {
    const { parentNode } = this.container;
    parentNode.style.width = this.containerPrevStyles.width;
    parentNode.style.height = this.containerPrevStyles.height;
  }
}

export default Detachable;
