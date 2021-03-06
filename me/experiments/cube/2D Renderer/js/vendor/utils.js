Math.TWO_PI = Math.PI * 2
Math.PHI = Math.PI / 180

const _canvas = document.createElement('canvas').getContext('2d')
const Sin = Math.sin
const Cos = Math.cos

const getRandRGB = () => {
    _canvas.fillStyle = `hsl(${random(360)}, 100%, 50%)`
    return hexToRgb(_canvas.fillStyle.slice(1))
}

const getRandHEX = () => {
    _canvas.fillStyle = `hsl(${random(360)}, 100%, 50%)`
    return _canvas.fillStyle
}

//By 'David'
//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
const hexToRgb = (hex) => {
    const arrBuff = new ArrayBuffer(4);
    const vw = new DataView(arrBuff);
    vw.setUint32(0, parseInt(hex, 16), false);
    const arrByte = new Uint8Array(arrBuff);
    return [arrByte[1], arrByte[2], arrByte[3]]
}

const overlays = {
    button(name, f) {
        const btn = document.createElement('input')
        btn.type = 'button'
        btn.value = name
        btn.style.position = 'absolute'
        btn.onclick = f
        btn.style.top = '10px'
        btn.style.left = '10px'
        btn.name = 'AAAAA'
        document.body.appendChild(btn)
        return btn
    },
    range(mi, ma, on) {
        const btn = document.createElement('input')
        btn.type = 'range'
        btn.max = ma
        btn.min = mi
        btn.value = name
        btn.style.position = 'absolute'
        btn.onchange = e => { on(e) }
        btn.style.top = '30px'
        btn.style.left = '5px'
        btn.name = 'AAAAA'
        document.body.appendChild(btn)
        return btn
    },


}

const toRad = (v) => v * Math.PHI 


const range = (n, s = 0, f = 1) => new Array(n).fill(1).map(i => i = s += f)

const UUID = (a = 4, b = 4) => new Array(a).fill(0).map(i => new Array(b).fill(0).map(e => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')).join('-')

const random = (v) => Math.floor(Math.random() * v)
//By 'Francisc'
//http://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
const randIntBetw = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)


const createCanvas = (w, h,auto = true) => {
    const canvas = document.createElement('canvas')
    if (!w) {
        document.body.style.margin = '0px'
        canvas.style.display = 'block'
        w = canvas.height = window.innerHeight
        h = canvas.width = window.innerWidth
    } else {
        canvas.height = h
        canvas.width = w
    }
    auto && document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    ctx.clear = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
    ctx.circle = (x = 0, y = 0, r = 5) => {
        ctx.beginPath()
        ctx.ellipse(x, y, r, r, 0, 0, Math.TWO_PI)
        ctx.fill()
    }
    return ctx
}


const getText = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.text())

const getJSON = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.json())

const getBlob = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.blob())

const getArrayBuffer = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.arrayBuffer())

//Copied from mozilla docs
//https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
const flatten = arr => arr.reduce((a, b) => a.concat(b))

//By 'jolly.exe'
//http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const utilData = {
    textFormats: ['txt', 'glsl'],
    imageFormats: ['png', 'bmp', 'gif', 'jpg', 'jpeg'],
    videoFormats: ['mov', 'webm', 'mp4', 'swf'],
    audioFormats: ['mp3', 'ogg', 'wav'],
    parseableFormats: ['js', 'css', 'html'],
    deniedFormats: [],
}

const loadScript = (url) => {
    return new Promise((res, rej) => {
        const script = document.createElement('script')
        script.src = url
        document.body.appendChild(script)
        script.onerror = e => rej(e)
        script.onload = e => res(e)
    })
}

const pixelToGlCoord = (event, canvas) => {
    var x = event.clientX, y = event.clientY;
    var midX = canvas.width / 2, midY = canvas.height / 2;
    var rect = event.target.getBoundingClientRect();
    x = ((x - rect.left) - midX) / midX;
    y = (midY - (y - rect.top)) / midY;
    return { x, y }
}
class ShaderDescriptor {
    constructor(a, b) {
        this.location = a
        this.type = b
    }
    validateInput(data){
        if (data){
            return true
        }
    }
}

const getE3ShaderData = (str) => {
    let shaderData = { uniform: [], in: [] }
    let data = str.match(/in.*;|uniform.*;/g)
    data && data.map(item => {
        let [input, type, name] = item.split(' ')
        name = name.slice(0, name.length - 1)
        shaderData[input].push(new ShaderDescriptor(name, type))
    })
    shaderData.isVertexShader = /gl_Position/.test(str)
    return shaderData
}

const getE2ShaderData = (str) => {
    let shaderData = { uniform: {}, attribute: {} }
    let data = str.match(/attribute.*;|uniform.*;/g)
    data && data.map(item => {
        let [type1, type2, name] = item.split(' ')
        name = name.slice(0, name.length - 1)
        shaderData[type1][name] = {}
        shaderData[type1][name].location = name
        shaderData[type1][name].type = type2
    })
    shaderData.isFragmentShader = /gl_FragColor/.test(str)
    shaderData.isVertexShader = /gl_Position/.test(str)
    return shaderData
}



const loadAll = (obj = {}) => {
    let resolved = {}
    // iDontKnowHowToNameThis é um objeto que lembra os 'index' dos itens para 
    //coloca-los de volta em um objeto igual o da 
    //entrada e que sera usado para criar um outro objeto quando a Promisse for
    //resolvida   
    let iDontKnowHowToNameThis = {}
    let promisseArray = []
    let keys = Object.keys(obj)

    for (let i of Object.keys(obj)) {
        let path = obj[i]
        let ext = getFileExtension(path)
        if (isEqualToAny(ext, utilData.textFormats)) {
            iDontKnowHowToNameThis[i] = promisseArray.push(getText(path)) - 1
        } else if (isEqualToAny(ext, utilData.audioFormats)) {
            iDontKnowHowToNameThis[i] = promisseArray.push(Url2Tag(path, 'audio')) - 1
        } else if (isEqualToAny(ext, utilData.videoFormats)) {
            iDontKnowHowToNameThis[i] = promisseArray.push(Url2Tag(path, 'video')) - 1
        } else if (isEqualToAny(ext, utilData.imageFormats)) {
            iDontKnowHowToNameThis[i] = promisseArray.push(Url2Tag(path, 'image')) - 1
        } else if (isEqualToAny(ext, utilData.parseableFormats)) {
            iDontKnowHowToNameThis[i] = promisseArray.push(Url2Tag(path, 'script')) - 1
        } else if (isEqualToAny(ext, utilData.deniedFormats)) {
            throw new Error('u got a virus m9.')
        } else if (ext === 'json') {
            iDontKnowHowToNameThis[i] = promisseArray.push(getJSON(path)) - 1
        }
    }
    return Promise.all(promisseArray).then(data => {
        for (let i of Object.keys(iDontKnowHowToNameThis)) {
            resolved[i] = data[iDontKnowHowToNameThis[i]]
        }
        return resolved
    })
}
//Modified version, by 'adnasa'
//https://gist.github.com/adnasa/94e26f50082454910657
const getFileExtension = (filePath = '') => {
    const ext = filePath.split('.')
    return ext[ext.length - 1]
}

const isEqualToAny = (input, items = []) => {
    let res = false
    items.map(i => !res && (res = i === input))
    return res
}

const hasAllStrs = (input, strArr = []) => {
    let res = true
    strArr.map(val => !input.includes(val) && (res = false))
    return res
}

const extensionToMediaType = (name) => {
    if (isEqualToAny(name, utilData.videoFormats))
        return 'video'
    else if (isEqualToAny(name, utilData.audioFormats))
        return 'audio'
    else if (isEqualToAny(name, utilData.parseableFormats))
        return 'script'
    else if (isEqualToAny(name, utilData.imageFormats))
        return 'image'
    else return 'none'
}
//Magic
const Url2Tag = (url, type) => {
    let result;
    const ext = type || extensionToMediaType(getFileExtension(url))
    switch (ext.toLowerCase()) {
        case 'audio':
            result = fetch(url, { mode: 'no-cors' }).then(r => r.blob().then(r => {
                let uri = URL.createObjectURL(r)
                let tag = document.createElement('audio')
                tag.src = uri
                return tag
            }))
            break;
        case 'video':
            result = fetch(url, { mode: 'no-cors' }).then(r => r.blob().then(r => {
                let uri = URL.createObjectURL(r)
                let tag = document.createElement('video')
                tag.src = uri
                return tag
            }))
            break;
        case 'image':
            result = fetch(url, { mode: 'no-cors' }).then(r => r.blob().then(r => {
                let uri = URL.createObjectURL(r)
                let tag = document.createElement('img')
                tag.src = uri
                return tag
            }))
            break;
        case 'script':
            result = fetch(url, { mode: 'no-cors' }).then(r => r.blob().then(r => {
                let uri = URL.createObjectURL(r)
                let tag = document.createElement('script')
                tag.src = uri
                return tag
            }))
            break;
        default:
            return new Error(`Unknow format ${ext}.`)
            break;
    }
    return result;
}
/*Usage:
new KeyListener({
    'KeyW':{
        press(){player.jump()},
        release(){ player.speed = 0; player.direction = -1}
    }
} ,gl.canvas)*/
class KeyListener {
    constructor(obj, element = window) {
        element.addEventListener('keyup', this.keyUp.bind(this), false);
        element.addEventListener('keydown', this.keyDown.bind(this), false);
        this.elememt = element
        this.keys = {}
        for (let key in obj) {
            this.keys[key] = {
                isDown: false,
                press: obj[key].press,
                release: obj[key].release
            }
        }
    }
    keyUp(e) {
        if (this.keys[e.code] && this.keys[e.code].isDown) {
            e.preventDefault()
            this.keys[e.code].isDown = false
            this.keys[e.code].release && this.keys[e.code].release()
        }
    }
    keyDown(e) {
        if (this.keys[e.code] && !this.keys[e.code].isDown) {
            e.preventDefault()
            this.keys[e.code].isDown = true
            this.keys[e.code].press && this.keys[e.code].press()
        }
    }
    detach() {
        this.elememt.removeEventListener('keydown', this.keyDown, false)
        this.elememt.removeEventListener('keyup', this.keyUp, false)
    }
}
/*Usage
const keys = new BooleanicKeys({
    'KeyW'(dt){player.x+=10*dt}
},gl.canvas) 

let loop = (dt)=>{
    //paramter is optional
    keys.update(dt)
}
 */
class BooleanicKeys {
    constructor(obj, element = window) {
        element.addEventListener('keyup', this.keyUp.bind(this), false);
        element.addEventListener('keydown', this.keyDown.bind(this), false);
        this.elememt = element
        this.keys = {}
        for (let key in obj) {
            this.keys[key] = {
                isDown: false,
                press: obj[key],
            }
        }
    }
    keyUp(e) {
        if (this.keys[e.code] && this.keys[e.code].isDown) {
            e.preventDefault()
            this.keys[e.code].isDown = false
        }
    }
    keyDown(e) {
        if (this.keys[e.code] && !this.keys[e.code].isDown) {
            e.preventDefault()
            this.keys[e.code].isDown = true
        }
    }
    update(val) {
        for (let key in this.keys) {
            this.keys[key].isDown && this.keys[key].press(val)
        }
    }
    detach() {
        this.elememt.removeEventListener('keydown', this.keyDown, false)
        this.elememt.removeEventListener('keyup', this.keyUp, false)
    }
}
//TODO: CLEAN THIS BULLSHIT OR DOWNLOAD 84,6KB ONLY TO CHANGE THE CSS
function mini$(obj) {
    let styleSheet
    let element
    let type = 0
    let className
    if (typeof obj === 'string') {
        if (obj[0] === '#') {
            element = document.getElementById(obj.slice(1))
        } else if (obj[0] === '.') {
            type = 1
            if (!document.head.getElementsByClassName(obj.slice(1))[0]) {
                styleSheet = document.createElement('style')
                styleSheet.className = obj.slice(1)
                document.head.appendChild(styleSheet)
            } else {
                styleSheet = document.head.getElementsByClassName(obj.slice(1))[0]
            }
            element = document.getElementsByClassName(obj.slice(1))
            className = obj
        } else {
            element = document.getElementById(obj)
        }
    } else if (obj instanceof HTMLElement) {
        element = obj
    }
    let me = {
        css(dat, reset = false) {
            if (dat) {
                if (type) {
                    if (reset) {
                        styleSheet.textContent = `${className}{${dat}}`
                    } else {
                        let usfeullData = styleSheet.textContent
                        let trimm = usfeullData.split(className)[1]
                        trimm[trimm.indexOf('{')] = ' '
                        trimm[trimm.lastIndexOf('}')] = ' '
                        trimm = `${className}{${trimm}\n$${dat}}`
                        styleSheet.textContent = trimm
                    }
                } else {
                    if (reset) {
                        element.style.cssText = dat
                    } else {
                        element.style.cssText += `\n${dat}`
                    }
                }
                return me
            }
            else return element.style.cssText
        },
        html(dat) {
            const html = element.innerHTML
            if (dat) {
                html = dat
                return me
            } else
                return html
        },
        setParent() {
            if (typeof obj === 'string') {
                if (obj[0] === '#') {
                    document.getElementById(obj.slice(1)).appendChild(element)
                } else if (obj[0] === '.') {
                    document.getElementsByClassName(obj.slice(1))[0].appendChild(element)
                } else {
                    document.getElementById(obj).appendChild(element)
                }
            } else if (obj instanceof HTMLElement) {
                obj.appendChild(element)
            } else {
                document.body.appendChild(element)
            }
            return me
        },
    }
    element.mini$ = me
    return me
}


async function load() {

    var d = await fetch('test.json').then(r => r.json())

    console.log(d);

}