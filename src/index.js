import {main} from './js/main';
import {home} from './js/home';
import {apropos} from './js/apropos';
import css from "./scss/style.scss";
import TweenMax from "gsap/TweenMax";
import $ from "jquery";
import Barba from 'barba.js/dist/barba';


var links = document.querySelectorAll('a[href]');
var cbk = function(e) {
  if(e.currentTarget.href === window.location.href) {
    e.preventDefault();
    e.stopPropagation();
  }
};

for(var i = 0; i < links.length; i++) {
  links[i].addEventListener('click', cbk);
}

function delay(n) {
  n = n || 2000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n);
  });
}

/********** Par page ***********/
// set up barba
document.addEventListener("DOMContentLoaded", function() {

  // assign some variables
  var lastElementClicked;
  var isAnimating = false;
  var $body = document.querySelector('body');
  var $html = document.querySelector('html');

  // options
  Barba.Pjax.Dom.wrapperId = 'barba-wrapper';
  Barba.Pjax.Dom.containerClass = 'barba-container';

  // ---------------- //
  // VIEWS - Sert à injecter les .js correspondant aux pages
  // ---------------- //
  var homeView = Barba.BaseView.extend({
    namespace: 'homepage',
    onLeave: function() {
      console.log('loading home')
    },
    onLeaveCompleted: function() {
      // Une fois terminé
    },
    onEnter: function(){

    },
    onEnterCompleted: function(){

      new home();
      $('.menu-open .m-open a, #profil a, #scroll .next-project-title, .menu .m-main').css('color', 'initial');
      $('svg.logo path, #social svg path').attr('style', "fill:#29262b");
      $('.menu svg').css('stroke', '#29262b');
    },
    start: function(){

    }
  });

  var detailView = Barba.BaseView.extend({
    namespace: 'apropos',
    onEnterCompleted: function() {
      new apropos();
    },
    onLeave: function() {
      // A new Transition toward a new page has just started.
      $body.classList.remove('loaded');
      $html.style.overflow = 'hidden';
    },
    onLeaveCompleted: function() {
      $html.style.overflow = 'initial';
    },
    start: function() {
      var tl = new TimelineMax({
        onComplete: function() {
          $body.classList.add('loaded');
          isAnimating = false;
        }
      });
    }
  });

  var contactView = Barba.BaseView.extend({
    namespace: 'contact',
    onEnterCompleted: function() {
      new contact();
    },
    onLeave: function() {
      // A new Transition toward a new page has just started.
      $body.classList.remove('loaded');
      $html.style.overflow = 'hidden';
    },
    onLeaveCompleted: function() {
      $html.style.overflow = 'initial';
    },
    start: function() {
      var tl = new TimelineMax({
        onComplete: function() {
          $body.classList.add('loaded');
          isAnimating = false;
        }
      });
    }
  });

  var projetsView = Barba.BaseView.extend({
    namespace: 'projets',
    onLeave: function() {
      //en partant
      console.log('loading projets');
    },
    onLeaveCompleted: function() {
      // Une fois terminé
    },
    start: function() {
      var tl = new TimelineMax({
        onComplete: function() {
          $body.classList.add('loaded');
          isAnimating = false;
        }
      });
    },
    onEnter: function(){

    },
    onEnterCompleted: function(){
      new projets();
      $('.menu-open .m-open a, #profil a, #scroll .next-project-title, .menu .m-main').css('color', 'initial');
      $('svg.logo path, #social svg path').attr('style', "fill:#29262b");
      $('.menu svg').css('stroke', '#29262b');
    }
  });

  // Don't forget to init the view!
  homeView.init();
  detailView.init();
  projetsView.init();
  contactView.init();
  Barba.Pjax.init();
  Barba.Prefetch.init();

  // listen to the event on click
  // can now reference lastElementClicked to scroll to where it's been clicked
  Barba.Dispatcher.on('linkClicked', function(el) {
    lastElementClicked = el;
  });

  // -------------------- //
  // TRANSITION FUNCTIONS
  // -------------------- //
  var revealProject = Barba.BaseTransition.extend({
    start: function() {
      isAnimating = true;

      // set up functions asynchronously
      Promise
      .all([this.newContainerLoading, this.scrollToProject()])
      .then(this.showNewPage.bind(this));
    },

    // first transition function
    scrollToProject: function() {
      var deferred = Barba.Utils.deferred();

      var outTransition = new TimelineMax();
      var svgslide = ".slide__title span, .slide__title .menu-open .is-active span.m2, .menu-open .is-active .slide__title span.m2, .slide__title .menu-open .is-active span.m3, .menu-open .is-active .slide__title span.m3, .slide__title .menu-open .no-active span.m2, .menu-open .no-active .slide__title span.m2, .slide__title .menu-open .no-active span.m3, .menu-open .no-active .slide__title span.m3";

      outTransition

      .fromTo('.bloc', 2, { x: -500},{ x: 100, ease: Power4.easeInOut, onComplete: function() {    deferred.resolve();}}, .5) // OnComplete
      //.set(nextSlide, {y:"0%"})
      .fromTo('#header-home .title .tiret', .4, {opacity:1}, {opacity: 0}, .1)
      .fromTo('.count', .4, {opacity:1}, {opacity: 0}, .1)
      .fromTo('#header-home .title h2 span.one', .5, { height:30 }, {height:0}, .5 )
      .fromTo('#header-home .title h1 span', .5, { height:132 }, {height:0}, .8 )
      .fromTo('.slider__images .clip-path span', .5, { height:132}, {height:0}, .8 )
      .fromTo('#header-home .title #container a.cursor-link span span', .5, { height:20 }, {height:0}, .4 )
      .to('.slide__image',2, { clip:"path(0px,600px,600px,600px)",ease:Expo.easeOut}, 1)
      .fromTo(svgslide, .75, { height: 206} , {height:0}, .5)
      .fromTo('.slide__sub span', .75, { height: 50} , {height:0}, .5 )

      .fromTo('.box1', 0.6, {visibility:"initial"}, {visibility:"hidden"}, 2)
      //.to('.title_real .one', .7, {height:0}, 1.2 )
      //.to('.title_real .two', .7, {height:0}, 1.4 )
      //.to('.title_real .three', .7, {height:0}, 1.6 )

      //call﻿(function() {    $('.title_real .one').addClass("disappear");﻿}﻿, null, null, 2);









      return deferred.promise;
    },

    // transition to new page / object
    showNewPage: function() {
      var _this = this;
      var $el = $(this.newContainer);

      TweenMax.set($(this.oldContainer), { display: "none" });
      TweenMax.set($el, { visibility: "visible", opacity: 0, });

      TweenMax.to($el, 0.1, {
        opacity: 1,
        onComplete: function() {
          _this.done();


        }
      });

    }
  });

  var closeProject = Barba.BaseTransition.extend({
    start: function() {
      isAnimating = true;

      Promise
      // Promise Async, do this, then this before load --- our animation
      // functions in the .all will run first
      .all([this.newContainerLoading, this.scrollTop()])
      .then(this.hideNewPage.bind(this));
    },
    scrollTop: function() {
      var deferred = Barba.Utils.deferred();


      var outTransition = new TimelineMax();

      outTransition
      .to('.title_real .one', .7, {height:0}, .2 )
      .to('.title_real .two', .7, {height:0}, .4 )
      .to('.txt_real p', .7, {height:0}, .4 )
      .to('.title_real .three', .7, {height:0,onComplete: function() {    deferred.resolve();}}, .6 )
      .to('.txt_real_right span span', .7, {height:0}, .2 )
      .fromTo('.left', .5, {opacity:1},{opacity:0}, .0)
      .to('.overlay-propos', .7, {visibility:"initial"}, {visibility:"hidden"}, 1)

      //call﻿(function() {    $('.title_real .one').addClass("disappear");﻿}﻿, null, null, 2);





      return deferred.promise;


    },

    // transition out new page / object
    hideNewPage: function() {
      var _this = this;
      var $el = $(this.newContainer);
      TweenMax.set($(this.oldContainer), { display: "none" });
      TweenMax.set($el, { visibility: "visible", opacity: 0, });

      TweenMax.to($el, 0, {
        opacity: 1,
        onComplete: function() {
          _this.done();


        }
      });

    }
  });

  var allProjects = Barba.BaseTransition.extend({
    start: function() {
      isAnimating = true;

      // set up functions asynchronously
      Promise
      .all([this.newContainerLoading, this.scrollToProject()])
      .then(this.showNewPage.bind(this));
    },

    // first transition function
    scrollToProject: function() {
      var deferred = Barba.Utils.deferred();


      var outTransition = new TimelineMax();

      outTransition
      .to('.title_real .one', .7, {height:0}, .2 )
      .to('.title_real .two', .7, {height:0}, .4 )
      .to('.txt_real p', .7, {height:0}, .4 )
      .to('.title_real .three', .7, {height:0,onComplete: function() {    deferred.resolve();}}, .6 )
      .to('.txt_real_right span span', .7, {height:0}, .2 )
      .fromTo('.left', .5, {opacity:1},{opacity:0}, .0)
      .to('.overlay-propos', .7, {visibility:"initial"}, {visibility:"hidden"}, 1)









      return deferred.promise;
    },

    // transition to new page / object
    showNewPage: function() {
      var _this = this;
      var $el = $(this.newContainer);

      TweenMax.set($(this.oldContainer), { display: "none" });
      TweenMax.set($el, { visibility: "visible", opacity: 0, });

      TweenMax.to($el, 0, {
        opacity: 1,
        onComplete: function() {
          _this.done();


        }
      });

    }
  });


  var contactProjects = Barba.BaseTransition.extend({
    start: function() {
      isAnimating = true;

      // set up functions asynchronously
      Promise
      .all([this.newContainerLoading, this.scrollToProject()])
      .then(this.showNewPage.bind(this));
    },

    // first transition function
    scrollToProject: function() {
      var deferred = Barba.Utils.deferred();

      var outTransition = new TimelineMax();

      outTransition

      .fromTo('#pageContact h2 span', .5, { height:100 }, {height:0}, .5 )
      .fromTo('#pageContact p.bottom span', .5, { height:20 }, {height:0}, .75 )
      .fromTo('#pageContact p.social span', .5, { height:20 }, {height:0}, .75 )
      .fromTo('#pageContact p.ss_contact span', .5, { height:30 }, {height:0, onComplete: function() {    deferred.resolve();}}, .65 )









      return deferred.promise;
    },

    // transition to new page / object
    showNewPage: function() {
      var _this = this;
      var $el = $(this.newContainer);

      TweenMax.set($(this.oldContainer), { display: "none" });
      TweenMax.set($el, { visibility: "visible", opacity: 0, });

      TweenMax.to($el, 0, {
        opacity: 1,
        onComplete: function() {
          _this.done();


        }
      });

    }
  });

  // -------------------- //
  // SET TRANSITIONS
  // -------------------- //
  Barba.Pjax.getTransition = function() {
    var transitionPage = revealProject;

    // if a page has a namespace of 'apropos' use the following transition
    if (Barba.HistoryManager.prevStatus().namespace === 'apropos') {
      transitionPage = closeProject;
    }
    if (Barba.HistoryManager.prevStatus().namespace === 'contact') {
      transitionPage = contactProjects;
    }
    if (Barba.HistoryManager.prevStatus().namespace === 'projets') {
      transitionPage = allProjects;
    }

    return transitionPage;
  };
});
