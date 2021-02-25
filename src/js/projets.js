import TweenMax from "gsap/TweenMax";
import $ from "jquery";
var imagesLoaded = require('imagesloaded');
var createjs = require('preload-js');


export function projets(){


  {
      const MathUtils = {
          lineEq: (y2, y1, x2, x1, currentVal) => {
              const m = (y2 - y1) / (x2 - x1);
              const b = y1 - m * x1;
              return m * currentVal + b;
          },
          lerp: (a, b, n) => (1 - n) * a + n * b,
          getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
      };
      const body = document.body;
      const docEl = document.documentElement;

      let winsize;
      const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
      calcWinsize();
      window.addEventListener('resize', calcWinsize);

      // Gets the mouse position. From http://www.quirksmode.org/js/events_properties.html#position
      const getMousePos = (ev) => {
          let posx = 0;
          let posy = 0;
          if (!ev) e = window.event;
          if (ev.pageX || ev.pageY)   {
              posx = ev.pageX;
              posy = ev.pageY;
          }
          else if (ev.clientX || ev.clientY)  {
              posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
              posy = ev.clientY + body.scrollTop + docEl.scrollTop;
          }
          return { x : posx, y : posy }
      };
      let mousepos = {x: winsize.width/2, y: winsize.height/2};
      window.addEventListener('mousemove', ev => mousepos = getMousePos(ev));

      let activeTilt = {
          columns: true,
          letters: true,
      }

      // Vertical images column
      class Column {
          constructor(el) {
              this.DOM = {el: el};

              // The column's height
              const rect = this.DOM.el.getBoundingClientRect();
              this.height = rect.height;

              // Check if the column starts on the top of the viewport or if it ends on the bottom of the viewport. This will define the column's translation direction.
              this.isBottom = this.DOM.el.classList.contains('column--bottom');

              // Tilt the column on mousemove.
              this.tilt();
          }
          tilt() {
              let translationVals = {tx: 0, ty: 0};
              const randX = MathUtils.getRandomFloat(5,20);
              const rY1 = this.isBottom ? MathUtils.getRandomFloat(10,30) : MathUtils.getRandomFloat(30,80);
              const rY2 = this.isBottom ? MathUtils.getRandomFloat(30,80) : MathUtils.getRandomFloat(10,30);
              const render = () => {
                  if ( activeTilt.columns ) {
                      translationVals.tx = MathUtils.lerp(translationVals.tx, MathUtils.lineEq(-randX, randX, winsize.width, 0, mousepos.x), 0.03);
                      translationVals.ty = MathUtils.lerp(translationVals.ty, MathUtils.lineEq(-rY1, rY2, winsize.height, 0, mousepos.y), 0.03);
                      TweenMax.set(this.DOM.el, {
                          x: translationVals.tx,
                          y: translationVals.ty,
                          rotation: 0.01
                      });
                  }
                  else {
                      translationVals = {tx: 0, ty: 0};
                  }
                  requestAnimationFrame(render);
              }

              requestAnimationFrame(render);
          }
      }

      class ContentItem {
          constructor(el) {
              this.DOM = {el: el};
              this.DOM.title = this.DOM.el.querySelector('.item__content-title');
              // Create spans out of every letter
              charming(this.DOM.title);
              this.DOM.titleLetters = [...this.DOM.title.querySelectorAll('span')];
              this.titleLettersTotal = this.DOM.titleLetters.length;

              this.DOM.backCtrl = this.DOM.el.querySelector('.item__content-back');
              this.initEvents()
          }
          initEvents() {
              this.DOM.backCtrl.addEventListener('click', (ev) => {
                  ev.preventDefault();
                  menu.closeItem()
              });
          }
          setCurrent() {
              this.DOM.el.classList.add('item--current');
          }
          resetCurrent() {
              this.DOM.el.classList.remove('item--current');
          }
      }


      // Content elements
      const content = {
          first: document.querySelector('.content--first'),
          second: document.querySelector('.content--second')
      };



      // content.first inner moving element (reveal/unreveal effect purposes)
      const contentMove = content.first.querySelector('.content__move');

      // The image columns behind the menu
      const columnsWrap = document.querySelector('.columns');
      const columnsElems = columnsWrap.querySelectorAll('.column');
      const columnsTotal = columnsElems.length;
      let columns;

      // The Menu

      // Activate the enter/leave/click methods of the custom cursor when hovering in/out on every <a> and when clicking anywhere

      // Preload all the images in the page
      imagesLoaded(document.querySelectorAll('.column__img'), {background: true}, () => {
          columns = Array.from(columnsElems, column => new Column(column));
          document.body.classList.remove('loading');
      });
  }

}
