
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

    if ($(document).width() > 972) {
      $('.banner-image').height(heightImage)

    }

    this.initRellax();
    this.initWow();
    this.initParallax();
    this.initHeader();
  }

}

$(document).ready(() => {
  const app = new App();
  app.init();
});
