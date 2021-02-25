import TweenMax from "gsap/TweenMax";
import $ from "jquery";
var createjs = require('preload-js');


export function home(){


    /**
    * demo.js
    * http://www.codrops.com
    *
    * Licensed under the MIT license.
    * http://www.opensource.org/licenses/mit-license.php
    *
    * Copyright 2019, Codrops
    * http://www.codrops.com
    */

      // helper functions
      const MathUtils = {
        // map number x from range [a, b] to [c, d]
        map: (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c,
        // linear interpolation
        lerp: (a, b, n) => (1 - n) * a + n * b
      };

      // body element
      const body = document.body;

      // calculate the viewport size
      let winsize;
      const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
      calcWinsize();
      // and recalculate on resize
      window.addEventListener('resize', calcWinsize);

      // scroll position and update function
      let docScroll;
      const getPageYScroll = () => docScroll = window.pageYOffset || document.documentElement.scrollTop;
      window.addEventListener('scroll', getPageYScroll);

      // Item
      class Item {
        constructor(el) {
          // the .item element
          this.DOM = {el: el};
          // the inner image
          this.DOM.image = this.DOM.el.querySelector('.item__img');
          this.renderedStyles = {
            // here we define which property will change as we scroll the page and the items is inside the viewport
            // in this case we will be translating the image on the y-axis
            // we interpolate between the previous and current value to achieve a smooth effect
            innerTranslationY: {
              // interpolated value
              previous: 0,
              // current value
              current: 0,
              // amount to interpolate
              ease: 0.1,
              // the maximum value to translate the image is set in a CSS variable (--overflow)
              maxValue: parseInt(getComputedStyle(this.DOM.image).getPropertyValue('--overflow'), 10),
              // current value setter
              // the value of the translation will be:
              // when the item's top value (relative to the viewport) equals the window's height (items just came into the viewport) the translation = minimum value (- maximum value)
              // when the item's top value (relative to the viewport) equals "-item's height" (item just exited the viewport) the translation = maximum value
              setValue: () => {
                const maxValue = this.renderedStyles.innerTranslationY.maxValue;
                const minValue = -1 * maxValue;
                return Math.max(Math.min(MathUtils.map(this.props.top - docScroll, winsize.height, -1 * this.props.height, minValue, maxValue), maxValue), minValue)
              }
            }
          };
          // set the initial values
          this.update();
          // use the IntersectionObserver API to check when the element is inside the viewport
          // only then the element translation will be updated
          this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => this.isVisible = entry.intersectionRatio > 0);
          });
          this.observer.observe(this.DOM.el);
          // init/bind events
          this.initEvents();
        }
        update() {
          // gets the item's height and top (relative to the document)
          this.getSize();
          // sets the initial value (no interpolation)
          for (const key in this.renderedStyles ) {
            this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
          }
          // translate the image
          this.layout();
        }
        getSize() {
          const rect = this.DOM.el.getBoundingClientRect();
          this.props = {
            // item's height
            height: rect.height,
            // offset top relative to the document
            top: docScroll + rect.top
          }
        }
        initEvents() {
          window.addEventListener('resize', () => this.resize());
        }
        resize() {
          // on resize rest sizes and update the translation value
          this.update();
        }
        render() {
          // update the current and interpolated values
          for (const key in this.renderedStyles ) {
            this.renderedStyles[key].current = this.renderedStyles[key].setValue();
            this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
          }
          // and translates the image
          this.layout();
        }
        layout() {
          // translates the image
          this.DOM.image.style.transform = `translate3d(0,${this.renderedStyles.innerTranslationY.previous}px,0)`;
        }
      }

      // SmoothScroll
      class SmoothScroll {
        constructor() {
          // the <main> element
          this.DOM = {main: document.querySelector('main')};
          // the scrollable element
          // we translate this element when scrolling (y-axis)
          this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]');
          // the items on the page
          this.items = [];
          [...this.DOM.main.querySelectorAll('.content > .item')].forEach(item => this.items.push(new Item(item)));
          // here we define which property will change as we scroll the page
          // in this case we will be translating on the y-axis
          // we interpolate between the previous and current value to achieve the smooth scrolling effect
          this.renderedStyles = {
            translationY: {
              // interpolated value
              previous: 0,
              // current value
              current: 0,
              // amount to interpolate
              ease: 0.1,
              // current value setter
              // in this case the value of the translation will be the same like the document scroll
              setValue: () => docScroll
            }
          };
          // set the body's height
          this.setSize();
          console.log(document.querySelector('div[data-scroll]').scrollHeight)
          // set the initial values
          this.update();
          // the <main> element's style needs to be modified
          this.style();
          // init/bind events
          this.initEvents();
          // start the render loop
          requestAnimationFrame(() => this.render());
        }
        update() {
          // sets the initial value (no interpolation) - translate the scroll value
          for (const key in this.renderedStyles ) {
            this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
          }
          // translate the scrollable element
          this.layout();
        }
        layout() {
          // translates the scrollable element
          this.DOM.scrollable.style.transform = `translate3d(0,${-1*this.renderedStyles.translationY.previous}px,0)`;
        }
        setSize() {
          // set the heigh of the body in order to keep the scrollbar on the page
          var that = this;
          setTimeout(function(){
            body.style.height = `${that.DOM.scrollable.scrollHeight}px`;
          },1500);
        }
        style() {
          // the <main> needs to "stick" to the screen and not scroll
          // for that we set it to position fixed and overflow hidden
          this.DOM.main.style.position = 'fixed';
          this.DOM.main.style.width = this.DOM.main.style.height = '100%';
          this.DOM.main.style.top = this.DOM.main.style.left = 0;
          this.DOM.main.style.overflow = 'hidden';
        }
        initEvents() {
          // on resize reset the body's height
          window.addEventListener('resize', () => this.setSize());
        }
        render() {
          // update the current and interpolated values
          for (const key in this.renderedStyles ) {
            this.renderedStyles[key].current = this.renderedStyles[key].setValue();
            this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
          }
          // and translate the scrollable element
          this.layout();

          // for every item
          for (const item of this.items) {
            // if the item is inside the viewport call it's render function
            // this will update the item's inner image translation, based on the document scroll value and the item's position on the viewport
            if ( item.isVisible ) {
              item.render();
            }
          }

          // loop..
          requestAnimationFrame(() => this.render());
        }
      }

      /***********************************/
      /********** Preload stuff **********/
      // Get the scroll position
      getPageYScroll();
      // Initialize the Smooth Scrolling
      new SmoothScroll();
    


    /*** Timer ***/
    const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

    let countDown = new Date('Aug 21, 2021 14:00:00').getTime(),
    x = setInterval(function() {

      let now = new Date().getTime(),
      distance = countDown - now;

      document.getElementById('days').innerText = Math.floor(distance / (day)),
      document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour)),
      document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute)),
      document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);

      if (distance < 0) {
       clearInterval(x);
       "C'EST AUJOURD'HUI !!!";
      }

    }, second);



    /*** PrelaodJS ***/

    var queue = new createjs.LoadQueue(false);
    var state = $('#state');

    queue.on("fileload", handleFileComplete);
    queue.on('progress', event => {
      var progress = Math.round(event.loaded * 100);
      state.text(progress + '%');
    })
    queue.on('complete', event => {

      var tl = new TimelineMax();

      tl.to("#overlay", 1.5, {
        y: -1500,
        ease: Expo.easeInOut,
      }, 0);
      /*** Ink anim ***/
      tl.to('.js-ink-trigger', .5, {
        css:{className:'+=is-active'}
      }, 0);
      tl.to('.ink-transition', .5, {
        display: 'block'
      }, .5);
    })
    queue.loadManifest([
      {
        id:   '1',
        src:  '../img/test-img.jpg',
        types:"IMAGE"
      },
      {
        id:   '2',
        src:  '../img/anneaux.png',
        types:"IMAGE"
      },
      {
        id:   '3',
        src:  '../img/bague.jpg',
        types:"IMAGE"
      },
      {
        id:   '4',
        src:  '../img/demande.jpg',
        types:"IMAGE"
      },
      {
        id:   '5',
        src:  '../img/lesagapes.jpg',
        types:"IMAGE"
      }
    ]);

    function handleFileComplete(event) {

      var item = event.item;
      var type = item.type;


      // Add any images to the page body.
      if (type == "image") {
        if (item.id == 1) {
          $("#js-ink-trigger").append('<img class="ink-transition-img" alt="Santorin" src="' + item.src + '" />');
        }
        if (item.id == 2) {
          $("#anneaux_img").append('<img class="anneaux" alt="Anneaux" src="' + item.src + '" />');
        }
        if (item.id == 3) {
          $("#bague").append('<img class="bague" alt="bague" src="' + item.src + '" />');
        }
        if (item.id == 4) {
          $("#demande").append('<img class="demande" alt="demande" src="' + item.src + '" />');
        }
        if (item.id == 5) {
          $("#agapes").append('<img class="agapes" alt="agapes" src="' + item.src + '" />');
        }
      }

    }

}
