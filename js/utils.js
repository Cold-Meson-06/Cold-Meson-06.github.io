//I like of these as globals
const C$ = str => document.getElementById(str);
const Sin = Math.sin
const Cos = Math.cos

const utils = (_ => {

    const toRadFactor = Math.PI / 180

    Math.toRad = (v) => v * toRadFactor
    Math.TWO_PI = Math.PI * 2

    const _canvas = document.createElement('canvas').getContext('2d')

    let New2DGrid = function(x, y, increment){
        return {
            _:{
                currentX:-increment,
                currentY:-increment,
                maxX:x,
                maxY:y,
                increment:increment
            },
            x(){
                if ((this._.currentX += this._.increment) > this._.maxX){
                    this._.currentY += this._.increment
                    console.log('a',this)
                    return this._.currentX = 0
                }else{
                    console.log('b',this)
                    return this._.currentX
                }
            },
            y(){
                return this._.currentY
            }
        }
    }
    
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

    let __;

    const arrayOf = (n = 1, s = 0) => new Array(n).fill(1).map(i => new s())

    const arrayBy = (n = 1, s = _ => 0) => new Array(n).fill(1).map(i => s())

    const range = (n, s = 0, f = 1) => new Array(n).fill(1).map(i => i = s += f)

    const UUID = (a = 4, b = 4) => new Array(a).fill(0).map(i => new Array(b).fill(0).map(e => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')).join('-')

    const random = (v) => Math.floor(Math.random() * v)


    //By 'Francisc'
    //http://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    const randIntBetw = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

    const randomOf = (obj, _) => Array.isArray(obj) ? obj[randIntBetw(0, obj.length - 1)] : (_ = Object.keys(obj), obj[_[randIntBetw(0, _.length)]])

    const createCanvas = (w, h, auto = true) => {
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
        items.map(_i_ => !res && (res = (_i_ === input)))
        return res
    }

    const hasAllStrings = (input, strArr = []) => {
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
                console.warn(`Unknow format ${ext}.`)
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

    async function loadJSON() {
        return await fetch('test.json').then(r => r.json())
    }

    let loop = (fn, hd) => {
        let handle;
        let stoped = false;
        let lp = function (dt) {
            fn(dt)
            handle = requestAnimationFrame(lp)
        }
        lp()
        let result = {
            stop: _ => cancelAnimationFrame(handle),
            play: _ => lp(),
            toggle: _ => (stoped = !stoped) ? result.stop():result.play() 
        }
        return result
    }

    let playFromSoundCloud = async function (url) {
        let audio = new Audio()
        audio.crossOrigin = "anonymous"
        let link = `https://api.soundcloud.com/resolve.json?url=${encodeURIComponent(url)}&client_id=17a992358db64d99e492326797fff3e8`
        let result = await fetch(link).then(res => res.json()).then(json => json)
        audio.src = `http://api.soundcloud.com/tracks/${result.id}/stream?client_id=17a992358db64d99e492326797fff3e8`
        audio.play()

        return { audio, result }
    }

    return Object.assign({
        New2DGrid,
        getRandRGB,
        getRandHEX,
        hexToRgb,
        range,
        UUID,
        random,
        randIntBetw,
        createCanvas,
        getText,
        getJSON,
        getBlob,
        getArrayBuffer,
        flatten,
        getParameterByName,
        loadScript,
        pixelToGlCoord,
        getE3ShaderData,
        getE2ShaderData,
        loadAll,
        getFileExtension,
        isEqualToAny,
        hasAllStrings,
        Url2Tag,
        KeyListener,
        BooleanicKeys,
        loadJSON,
        loop,
        arrayOf,
        arrayBy,
        randomOf,
        playFromSoundCloud
    }, {
            //By 'Keith Peters' 2007 (colorized)
            //https://github.com/bit101
            lerp: (norm, min, max) => (max - min) * norm + min,
            norm: (value, min, max) => (value - min) / (max - min),
            distance: (p0, p1) => Math.sqrt(p1.x - p0.x ** 2 + p1.y - p0.y ** 2),
            distanceXY: (x0, y0, x1, y1) => Math.sqrt(x1 - x0 ** 2 + y1 - y0 ** 2),
            circleCollision: (c0, c1) => utils.distance(c0, c1) <= c0.radius + c1.radius,
            inRange: (value, min, max) => value >= Math.min(min, max) && value <= Math.max(min, max),
            clamp: (value, min, max) => Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max)),
            circlePointCollision: (x, y, circle) => utils.distanceXY(x, y, circle.x, circle.y) < circle.radius,
            pointInRect: (x, y, rect) => utils.inRange(x, rect.x, rect.x + rect.width) && utils.inRange(y, rect.y, rect.y + rect.height),
            map: (value, sourceMin, sourceMax, destMin, destMax) => utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax),
            rangeIntersect: (min0, max0, min1, max1) => Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1),
            rectIntersect: (r0, r1) => utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) && utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height),
        })
})()
