
function throttle(func, wait, options) {
  let context,
    args,
    result;
  let timeout = null;
  let previous = 0;
  options || (options = {});

  const later = function later() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    context = args = null;
  };

  return function () {
    const now = Date.now();
    if (!previous && options.leading === false) previous = now;

    const remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

class App {
  isTouchDevice() {
    return ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0);
  }

  initWow() {
    new window.WOW().init();
  }

  initRellax() {
    const rellax = new window.Rellax('.rellax');
    console.log(rellax);
  }

  initParallax() {
    if (this.isTouchDevice()) {
      return;
    }
    $('.gw-parallax').each((index, item) => {
      const instance = new window.Parallax($(item)[0]);
      console.log(instance);
    });
  }

  initHeader() {
    $(window).on('scroll', throttle(this.checkNavbar, 50));
    this.checkNavbar();

    $('#gw-navbar')
      .on('show.bs.collapse', () => {
        $('body').addClass('open-navbar');
      })
      .on('hide.bs.collapse', () => {
        $('body').removeClass('open-navbar');
      });
  }

  checkNavbar() {
    const $navbar = $('#js-navbar');
    const $body = $(window);
    const currScrollTop = $body.scrollTop();
    $navbar.toggleClass('gw-navbar--sticky', currScrollTop > $navbar.height());
  }


  init() {
    if (!this.isTouchDevice()) {
      document.body.classList.add('no-touch-device');
    }
    const heightImage = $('.gw-visual__wrapper').height()
    $('.banner-image').height(heightImage)


    this.initTestimonial();
    this.initLogo();
    this.initRellax();
    this.initWow();
    this.initParallax();
    this.initHeader();
  }

  initLogo() {
    const $slider = $('.swiper-container--logo');
    if ($slider.length) {
      new window.Swiper($slider[0], { //eslint-disable-line
        slidesPerView: 6,
        spaceBetween: 32,
        loop: true,
        autoplay: {
          disableOnInteraction: false,
          delay: 3000,
        },
        breakpoints: {
          559: {
            slidesPerView: 'auto',
            spaceBetween: 16,
          },
          739: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
          979: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
          1263: {
            slidesPerView: 4,
            spaceBetween: 32,
          },
        },
      });
    }
  }

  initTestimonial() {
    const $slider = $('.swiper-container--classes');
    if ($slider.length) {
      const $section = $slider.parents('.gw-section');
      new window.Swiper($slider[0], { //eslint-disable-line
        slidesPerView: 4,
        spaceBetween: 32,
        breakpoints: {
          739: {
            slidesPerView: 1,
            spaceBetween: 32,
          },
          1263: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
        },
        // If we need pagination
        // navigation: {
        //   nextEl: $section.find('.gw-section__next'),
        //   prevEl: $section.find('.gw-section__prev'),
        // },
        pagination: {
          el: $slider.find('.swiper-pagination'),
          clickable: true,
        },
      });
    }
  }
}

$(document).ready(() => {
  const app = new App();
  app.init();
});
