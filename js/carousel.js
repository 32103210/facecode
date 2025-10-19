// 轮播图组件

class Carousel {
  constructor(trackElement, prevBtn, nextBtn, indicatorsContainer) {
    this.track = trackElement;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.indicatorsContainer = indicatorsContainer;
    this.currentIndex = 0;
    this.slides = [];
    this.indicators = [];

    this.init();
  }

  init() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    this.track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });

    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) {
        this.next();
      }
      if (touchEndX > touchStartX + 50) {
        this.prev();
      }
    };

    this.handleSwipe = handleSwipe;
  }

  loadImages(images) {
    this.track.innerHTML = '';
    this.indicatorsContainer.innerHTML = '';
    this.slides = [];
    this.indicators = [];

    images.forEach((img, index) => {
      // 创建幻灯片
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      
      const imgElement = document.createElement('img');
      imgElement.src = img.url;
      imgElement.alt = img.age;
      
      const label = document.createElement('div');
      label.className = 'age-label';
      label.textContent = img.age;
      
      slide.appendChild(imgElement);
      slide.appendChild(label);
      this.track.appendChild(slide);
      this.slides.push(slide);

      // 创建指示器
      const indicator = document.createElement('div');
      indicator.className = 'carousel-indicator';
      if (index === 0) {
        indicator.classList.add('active');
      }
      indicator.addEventListener('click', () => this.goTo(index));
      this.indicatorsContainer.appendChild(indicator);
      this.indicators.push(indicator);
    });

    this.updatePosition();
  }

  goTo(index) {
    this.currentIndex = index;
    this.updatePosition();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updatePosition();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updatePosition();
  }

  updatePosition() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    // 更新指示器
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  getCurrentImage() {
    if (this.slides.length === 0) return null;
    const img = this.slides[this.currentIndex].querySelector('img');
    return img ? img.src : null;
  }
}

