import TweenMax from "gsap/TweenMax";
import $ from "jquery";

 export function apropos(){

   /*--------------------
   Vars
   --------------------*/
   const grids = []

   /*--------------------
   Mouse & Listeners
   --------------------*/
   const mouse = {
   x: window.innerWidth / 2,
   y: window.innerHeight / 2,
   oldX: window.innerWidth / 2,
   oldY: window.innerHeight / 2,
   startX: 0,
   startY: 0,
   speedX: 0,
   speedY: 0
   }
   const getMouse = (e) => {
   mouse.x = e.clientX || e.touches[0].clientX
   mouse.y = e.clientY || e.touches[0].clientY
   mouse.speedX = mouse.oldX - mouse.x
   mouse.speedY = mouse.oldY - mouse.y
   e.stopPropagation()
   return false
   }
   document.addEventListener('mousemove', getMouse)
   document.addEventListener('touchmove', getMouse)

   const setMouseStart = (e) => {
   mouse.startX = e.clientX || e.touches[0].clientX
   mouse.startY = e.clientY || e.touches[0].clientY
   }
   window.addEventListener('mousedown', setMouseStart)
   window.addEventListener('touchstart', setMouseStart)


   /*--------------------
   Win & Listeners
   --------------------*/
   const win = {
   width: window.innerWidth,
   height: window.innerHeight
   }
   const getWin = () => {
   win.height = window.innerHeight
   win.width = window.innerWidth
   }
   window.addEventListener('resize', getWin)


   /*--------------------
   Grids Helpers
   --------------------*/
   const dragOff = () => {
   grids.forEach(g => {
   if (g.isDragging) {
    g.isReleased = true
   }
   })
   }
   window.addEventListener('mouseup', dragOff)
   window.addEventListener('mouseleave', dragOff)
   window.addEventListener('touchend', dragOff)
   window.addEventListener('touchleave', dragOff)


   /*--------------------
   Animate
   --------------------*/
   const animate = () => {
   grids.forEach(g => {
    g.draw()
   })
   mouse.oldX = mouse.x
   mouse.oldY = mouse.y
   requestAnimationFrame(animate)
   }
   animate()


   /*--------------------
   Grid
   --------------------*/
   class Grid {
   constructor(o) {
    this.el = document.getElementsByClassName('grid')[0]
    this.radius = o.radius || 10
    this.x = o.x || window.innerWidth / 2
    this.y = o.y || window.innerHeight / 2
    this.endX = this.x
    this.endY = this.y
    this.smoothness = this.smoothness || 0.1
    this.isDragging = false
    this.isReleased = false

    this.bounds = this.el.getBoundingClientRect()
    this.el.style.margin = `-${this.bounds.height / 2}px -${this.bounds.width / 2}px`
    this.events()
   }

   events() {
    ['mousedown', 'touchstart'].forEach(e => {
      this.el.addEventListener(e, () => {
        this.isDragging = true
      })
    })
   }

   draw() {
    if (this.isReleased && this.isDragging) {
      this.actualX = this.x
      this.actualY = this.y
      this.isReleased = false
      this.isDragging = false
      document.body.classList.remove('dragging')
    }

    if (this.isDragging) {
      document.body.classList.add('dragging')
      console.log(mouse.startX - mouse.x)
      this.endX = Math.max(-this.bounds.width / 2 + win.width, Math.min(this.x - (mouse.startX - mouse.x), this.bounds.width / 2))
      this.endY = Math.max(-this.bounds.height / 2 + win.height, Math.min(this.y - (mouse.startY - mouse.y), this.bounds.height / 2))
    }


    this.x += (this.endX - this.x) * this.smoothness
    this.y += (this.endY - this.y) * this.smoothness
    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`
   }
   }

   grids.push(new Grid({radius: 10, x: win.width / 2, y: win.height / 2}))


 }
