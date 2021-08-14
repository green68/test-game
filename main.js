
import { clone, resizeCanvas, sleep } from "./js/utils.js";
// import { Map } from "./js/maps/map-1.js";
// import { Clarity } from "./js/Clarity.js"
import { GGame } from "./js/GGame.js"
import { Editor } from "./js/Editor.js";


/* 
    TODO :
    [x] dans  la map apres rechargement le passage reste ouvert - voir clone()
    [x] affichage des messages dans une fenetre modale
    [ ] gestion du touch pour version mobile
    [ ] creation service worker pour jeu sans reseau
    [ ] editeur de map / gestion en .json avec chargement fetch
    [ ] sprite sous forme d'image
    [ ] ...
 */

console.log('dans main.js');

const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    infosBox = document.querySelector('.infos-box'),
    infosBtn = document.querySelector('.infos-btn'),
    infosMessage = document.querySelector('.infos-message')

canvas.width = 360;
canvas.height = 640;
resize()

// const $screen = document.querySelector('#screen-infos')
// let w = document.body.clientWidth
// let h = document.body.clientHeight
// $screen.textContent = `screen : ${w}x${h}`

// const $canvas = document.querySelector('#canvas-infos')
// w = ctx.canvas.width
// h = ctx.canvas.height
// $canvas.textContent = `canvas : ${w}x${h}`

const arrows = document.querySelector('#arrows')

// ************************
// pour sauvegarder en json une map en js
// function saveToJson() {
//     function jsToJson(jsMap) {
//         function funcToStr(key, value) {
//             if(typeof value === 'function') {
//                 return value.toString()
//             }
//             return value
//         }
//         // let mapStr = JSON.stringify(jsMap, funcToStr, 2)
//         let mapStr = JSON.stringify(jsMap, funcToStr)
//         console.log(mapStr)
//     }
    
//     let map = clone(Map)
//     jsToJson(map)
// }
// saveToJson()
// debugger

// *********************
// pour test passage d'une map a une autre

let map = 'map-2.js'
let state = "running"
let fileMap



let game = new GGame();
game.set_viewport(canvas.width, canvas.height)
game.load_map(map)
game.infosBox = infosBox
game.infosBtn = infosBtn
game.infosMessage = infosMessage
game.state = 'infos'
let editor = new Editor(game)

function Loop() {

    switch (game.state) {
        case 'running':
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            game.update()
            if(editor) editor.update()
            game.draw(ctx);
            // game.editor ? editor.draw : null            
            break
        case 'editor':
            debugger
            break
        case 'message':
            game.infosBox.classList.remove('hidden')
            game.infosBtn.focus()
            game.state = 'infos'
            sleepButton(500)
            break
            case 'callback':
                if(typeof game.callback === 'function') {
                    game.callback.call(game)
                }
                game.callback = null
                game.state = 'running'
                break
        case 'infos':
        case 'loading':         
        case 'loaded':
            break
        default:
    }
    if(game.state !== 'end') window.requestAnimFrame(Loop)
};

function jsonToJs(jsonMap) {
    function strToFunc(key, value) {
        if (typeof value === "string" && value.startsWith('function')) {
            return new Function('return ' + value)();
        }
        return value
    }
    let mapJS = JSON.parse(jsonMap, strToFunc)
    return mapJS
}
function getFile() {
    mapFetch(`/js/maps/${fileMap}.json`)
    .then( json => {
        map = jsonToJs(json)
        state = 'loading'
        fileMap = null
        window.requestAnimationFrame(Loop)   
    })
    .catch(error => console.error(error))
}


async function mapFetch(file) {
    const response = await fetch(location.origin + file);
    let json = await response.text();
    return json 
}

async function sleepButton(ms) {
    infosBtn.classList.add('hidden')
    await sleep(ms)
    infosBtn.classList.remove('hidden')
    infosBtn.focus()
}



function resize(e) {
    let [w,h] = resizeCanvas(e)
    console.log("resize")
    infosBox.style.maxWidth = `${w-10}px`
}

window.addEventListener('resize', resize)
infosBtn.addEventListener('click', e => {
    infosBox.classList.add('hidden')
    game.state = "callback"
})

infosBtn.focus()
Loop()


