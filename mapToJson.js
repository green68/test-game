import { clone, importModule } from "./js/utils.js";
import { saveAs } from "./js/FileSaver.js";
// import { Map } from "./js/maps/map-0.js";
// import { Clarity } from "./js/Clarity.js"


console.log('dans gestion-map')


const file = document.querySelector('#fileupload')
const result_json = document.querySelector('#result_json')
const btnJson = document.querySelector('#btnJson')
const btnRead = document.querySelector('#btnRead')
const label_file = document.querySelector('#label_file')
const result_js = document.querySelector('#result_js')

// btnRead.onclick = readFile
btnJson.onclick = saveJson

let Map
let fileJS

// ************************
// pour conversion en json une map.js
function convertJson() {
    function jsToJson(jsMap) {
        function funcToStr(key, value) {
            if (typeof value === 'function') {
                return value.toString()
            }
            return value
        }
        let mapStr = JSON.stringify(jsMap, funcToStr)
        // console.log(mapStr)
        result_json.value = mapStr
    }

    let map = clone(Map)
    jsToJson(map)
}

function saveJson() {
    let text = result_json.value;
    let filename = fileJS ? fileJS.replace(/.js/, '') : "map-temp"
    let blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename + ".json")
    console.log(`"${filename}.json" enregistré`);
}

document.querySelector("#fileupload").onchange = e => {
    e.preventDefault()
    label_file.innerHTML = 'Résultat en json'
    fileJS = file.files[0].name
    importModule(fileJS)
        .then(map => {
            if (map) {
                Map = map
                
                convertJson()
                result_js.innerHTML = readFile()
                // result_js.getElementsByTagName('code')[0].innerHTML = result_json.value
                console.log(`conversion de la map effectuée`);
            }
        })
        .catch(err => console.log(err))

};

function readFile() {
    var selectedFile = document.getElementById('fileupload').files[0];
    if (selectedFile) {
        label_js.innerHTML = 'Résultat en js'
        var content = result_js;
        var reader = new FileReader();
        reader.onload = function (event) { 
            content.innerHTML = reader.result; 
            // document.querySelector('.test').innerHTML = `<pre><code class="language-javascript">${content.innerHTML}</code></pre>`
        };
        reader.readAsText(selectedFile);
    }
}

function objToString(obj, ndeep) {
    if (obj == null) { return String(obj); }
    switch (typeof obj) {
        case "string": return '"' + obj + '"';
        case "function": return obj.name || obj.toString();
        case "object":
            var indent = Array(ndeep || 1).join('\t'), isArray = Array.isArray(obj);
            return '{['[+isArray] + Object.keys(obj).map(function (key) {
                return '\n\t' + indent + key + ': ' + objToString(obj[key], (ndeep || 1) + 1);
            }).join(',') + '\n' + indent + '}]'[+isArray];
        default: return obj.toString();
    }
}
