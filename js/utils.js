
function resizeCanvas(e) {
    console.log('canvas resized');

    if (!canvas) return

    canvas.display = 'none'
    canvas.style = ''
    let width = document.body.clientWidth
    let height = document.body.clientHeight
    let ratio = canvas.width / canvas.height
    let ratio2 = width / height
    let newHeight, newWidth, newStyle

    if (ratio > ratio2) {
        newWidth = width //- 1
        newHeight = Math.floor(newWidth / ratio)
        canvas.style.marginTop = Math.floor(height - newHeight) / 2 + 'px'
        //canvas.setAttribute('style', `width: ${newWidth}px; height: ${newHeight}; `) 
    } else {
        newHeight = height //- 1
        newWidth = Math.floor(newHeight * ratio)
        canvas.style.marginLeft = Math.floor(width - newWidth) / 2 + 'px'
    }
    canvas.style.width = newWidth + 'px'
    canvas.style.height = newHeight + 'px'
    canvas.display = 'block'
    // add for recover width and height for others objects
    return [newWidth, newHeight]
}


/**
 * 
 * @param {object} obj
 * 
 * @returns {object} 
 */
function clone(obj) {
    if (obj == null || typeof (obj) != 'object')
        return obj;
    var temp = new obj.constructor();
    for (var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

/**
 * Promise
 * @param {string} fileName Le nom du fichier js extension comprise
 * @return {promise} un objet de type Map ou null
 */
async function importModule(fileName) {
    let moduleName = `./maps/${fileName}`
    try {
        return await import(moduleName).then(m => m.Map)
    } catch (error) {
        return null
    }
}

/**
 * 
 * @param {number} ms in milliseconds
 * 
 * @returns {promise} 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        return window.setTimeout(callback, 1000 / 60);
    };

/* 
            x1,x2,y1,y2
up      : 67,88,593,615
right   : 96,116,620,643
down    : 57.88,651,673
left    : 38,60,620,643
 */
export { 
    clone,
    importModule,
    resizeCanvas,
    sleep 
}
