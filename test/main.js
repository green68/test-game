const canvas = document.querySelector('#canvas')
let w = canvas.width = 640
let h = canvas.height = 360
let loopId = null
let color = {
    bound: 'rgba(0, 0, 255, 0.8)'
}

function keypress(e) {
  e.preventDefault()
  console.log(e.key)
  switch (e.key) {
    case 'Escape':
        window.cancelAnimationFrame(loopId)
        loopId = start = null
        break;
    case 'l':
        loopId ? null : loop()       
        break;
    case '-':
        entity.frame.delay > 10 ? entity.frame.delay -= 10 : null       
        console.log(entity.frame.delay);     
        break;
    case '+':
        entity.frame.delay < 2000 ? entity.frame.delay += 10 : null  
        console.log(entity.frame.delay);     
        break;
    case 'ArrowRight':
        entity.acc.x = entity.vit.x()
        break;
    case 'ArrowLeft':
        entity.acc.x = -entity.vit.x()
        break;
    default:
        break;
  }
  
}

let Entity = function(){
    this.loc = { x: 0, y: 0}
    this.acc = { x: 0, y: 0}
    this.vel = {x: 0, y: 0}
    this.size = {w: 50, h:72, scale: .5}
    this.vit =  { 
        x: _ => {return (this.size.w  * this.size.scale) / 10},
        y: _ => {return (this.size.h * this.size.scale)  / 10}
    }
    this.image = document.querySelector('#sheet')
    this.frame = { num: 0, max: 9, delay: 150 },
    this.draw = function(ctx) {
        ctx.drawImage(this.image, this.frame.num * this.size.w,0,this.size.w, this.size.h, this.loc.x, this.loc.y, this.size.w * this.size.scale, this.size.h  * this.size.scale )
        ctx.strokeStyle = color.bound
        ctx.strokeRect(this.loc.x, this.loc.y, this.size.w * this.size.scale, this.size.h  * this.size.scale)
        // this.redraw = false
    },
    this.update = function(timestamp){
        this.vel.x += this.acc.x
        this.vel.y += this.acc.y
        this.loc.x = Math.round(this.loc.x + this.vel.x)
        this.loc.y = Math.round(this.loc.y + this.vel.y)
        // clean acceleration
        this.acc.x = this.acc.y = 0
        // implement friction
        this.vel.x =  Math.abs(this.vel.x) > 0.01 ? this.vel.x * 0.9 : 0 
        this.vel.y *= 0.9
        // bound collide ?
        if(this.loc.x <= 0) {
            this.loc.x = -this.vel.x
            // this.vel.x = -0.4
        }
        if(this.loc.x + (this.size.w  * this.size.scale) >= canvas.width) this.loc.x = canvas.width - (this.size.w  * this.size.scale ) - this.vel.x


        if(!this.frame.start) this.frame.start = timestamp
        if(timestamp - this.frame.start < this.frame.delay) return





        this.frame.num ++
        this.frame.num > this.frame.max ? this.frame.num = 0 : null 
        this.frame.start = timestamp
        // this.redraw=true

    }
}
let entity = new Entity()

const ctx = canvas.getContext('2d')
console.clear()

function draw(ctx) {
    ctx.fillStyle= 'transparent'
    ctx.clearRect(0,0,w,h)
    ctx.fillRect(Math.round(entity.loc.x), Math.round(entity.loc.y), entity.size.w, entity.size.h)
    entity.draw(ctx)
    ctx.fillStyle= 'white'
    ctx.font = '16px serif';
    ctx.fillText(`num: ${entity.frame.num}, delay: ${entity.frame.delay}`, 50, 16);
    ctx.fillText(`loc.x: ${entity.loc.x}, vel.x: ${entity.vel.x}`, 50, 32);
    
}
function update(time) {
    entity.update(time)
}

let start = null
function loop(time) {
    if(!start) start = time
    if(time - start >= 60/24) {
        start = time
        draw(ctx)
    }
    
    update(time)

    loopId = window.requestAnimationFrame(loop)  
}

window.addEventListener('keydown', keypress)
canvas.focus() // not working ?
loop()

