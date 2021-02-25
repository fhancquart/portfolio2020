import TweenMax from "gsap/TweenMax";
import $ from "jquery";

export function contact(){
  $('body').attr('style', "overflow:hidden");

  // The Transition has just finished
  // can now use functions/events specifically for this page
  $('.menu-open .m-open a, #profil a, #scroll .next-project-title, .menu .m-main').css('color', 'white');
  $('svg.logo path, #social svg path').attr('style', "fill:#fff");
  $('.menu svg').css('stroke', '#fff');


  {
    // from http://www.quirksmode.org/js/events_properties.html#position
    const getMousePos = (e) => {
      let posx = 0;
      let posy = 0;
      if (!e) e = window.event;
      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      }
      else if (e.clientX || e.clientY)  {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      return { x : posx, y : posy }
    }

    // Effect 5
    class HoverImgFx5 {
      constructor(el) {
        this.DOM = {el: el};

        this.DOM.reveal = document.createElement('div');
        this.DOM.reveal.className = 'hover-reveal';
        this.DOM.reveal.style.overflow = 'hidden';
        this.DOM.reveal.innerHTML = `<div class="hover-reveal__inner"><div class="hover-reveal__img" style="background-image:url(${this.DOM.el.dataset.img})"></div></div>`;
        this.DOM.el.appendChild(this.DOM.reveal);
        this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner');
        this.DOM.revealInner.style.overflow = 'hidden';
        this.DOM.revealImg = this.DOM.revealInner.querySelector('.hover-reveal__img');

        this.initEvents();
      }
      initEvents() {
        this.positionElement = (ev) => {
          const mousePos = getMousePos(ev);
          const docScrolls = {
            left : document.body.scrollLeft + document.documentElement.scrollLeft,
            top : document.body.scrollTop + document.documentElement.scrollTop
          };
          this.DOM.reveal.style.top = `${mousePos.y+20-docScrolls.top}px`;
          this.DOM.reveal.style.left = `${mousePos.x+20-docScrolls.left}px`;
        };
        this.mouseenterFn = (ev) => {
          this.positionElement(ev);
          this.showImage();
        };
        this.mousemoveFn = ev => requestAnimationFrame(() => {
          this.positionElement(ev);
        });
        this.mouseleaveFn = () => {
          this.hideImage();
        };

        this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
        this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
        this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
      }
      showImage() {
        TweenMax.killTweensOf(this.DOM.reveal);
        TweenMax.killTweensOf(this.DOM.revealInner);
        TweenMax.killTweensOf(this.DOM.revealImg);
        TweenMax.killTweensOf(this.DOM.revealDeco);

        this.tl = new TimelineMax({
          onStart: () => {
            this.DOM.reveal.style.opacity = 1;
            TweenMax.set(this.DOM.el, {zIndex: 1000});
          }
        })
        .add('begin')
        .set(this.DOM.revealInner, {x: '100%'})

        .add(new TweenMax(this.DOM.revealInner, 0.3, {
          ease: Expo.easeOut,
          startAt: {x: '100%'},
          x: '0%'
        }), 'begin+=0.15')
        .add(new TweenMax(this.DOM.revealImg, 0.3, {
          ease: Expo.easeOut,
          startAt: {x: '-100%'},
          x: '0%'
        }), 'begin+=0.15')
        .add(new TweenMax(this.DOM.revealImg, .3, {
          ease: Expo.easeOut,
          startAt: {scale: 1.3},
          scale: 1
        }), 'begin+=0.15')
        .add(new TweenMax(this.DOM.reveal, 0.3, {
          ease: Quint.easeOut,
          startAt: {x: '20%', rotation: 10},
          x: '0%',
          rotation: 0
        }), 'begin');
      }
      hideImage() {
        TweenMax.killTweensOf(this.DOM.reveal);
        TweenMax.killTweensOf(this.DOM.revealInner);
        TweenMax.killTweensOf(this.DOM.revealImg);

        this.tl = new TimelineMax({
          onStart: () => {
            TweenMax.set(this.DOM.el, {zIndex: 999});
          },
          onComplete: () => {
            TweenMax.set(this.DOM.el, {zIndex: ''});
            TweenMax.set(this.DOM.reveal, {opacity: 0});
          }
        })
        .add('begin')
        .add(new TweenMax(this.DOM.revealInner, 0.1, {
          ease: Sine.easeOut,
          x: '-100%'
        }), 'begin')
        .add(new TweenMax(this.DOM.revealImg, 0.1, {
          ease: Sine.easeOut,
          x: '100%'
        }), 'begin')
      }

    }



    Array.from(document.querySelectorAll('[data-fx="5"] > h2 > span > span > a.chat')).forEach(link => new HoverImgFx5(link));

  }


}
