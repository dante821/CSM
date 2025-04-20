// Переключение темы
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

// Проверяем сохраненную тему
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (currentTheme === 'dark') {
        themeToggle.checked = true;
    }
}

// Обработчик переключения
themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dots = Array.from(document.querySelectorAll('.dot'));
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    let currentIndex = 0;
    const slideCount = slides.length;
    
    // Обновление позиции карусели
    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Обновление индикаторов
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };
    
    // Переход к слайду
    const goToSlide = (index) => {
      currentIndex = (index + slideCount) % slideCount;
      updateCarousel();
    };
    
    // Следующий слайд
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
    });
    
    // Предыдущий слайд
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
    });
    
    // Клик по индикаторам
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.index));
      });
    });
    
    // Автопрокрутка (опционально)
    let interval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
    
    // Пауза при наведении
    track.addEventListener('mouseenter', () => clearInterval(interval));
    track.addEventListener('mouseleave', () => {
      interval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5000);
    });
  });