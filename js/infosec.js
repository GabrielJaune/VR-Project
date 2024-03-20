function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function randrange(num) { return Math.floor(Math.random() * num) }
function choice(Array) { return Array[Math.floor(Math.random() * Array.length)] }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

var ActiveNotif = ""
var HasPhone = false

var ActiveAudio = undefined
var Call = undefined

function Notify(Path) {
    //console.log(Path)
    ActiveNotif = undefined
    if(Call) { Call.pause(); Call = undefined }
    if(ActiveAudio) { ActiveAudio.pause(); ActiveAudio = undefined }
    ActiveAudio = new Audio(Path);
    ActiveAudio.play();
}

function CreateNotif(Path) {
    if(ActiveAudio) { ActiveAudio.pause(); ActiveAudio = undefined }
    ActiveNotif = Path

    if(Call && Call.ended) { Call = undefined }

    if(!Call) {
    Call = new Audio("./resources/GameInfo/Sounds/phone.mp3");
    Call.play();
}

    setTimeout(function() {
        ActiveNotif = undefined
    }, 10000); // 10s
}

function HandlePhone() {
    console.log("hzdsfihgzeiruir")
    if(!ActiveNotif) return;
    console.log("Got A Notif")
    HasPhone = true
    console.log(ActiveNotif)
    Notify(ActiveNotif)
}

AFRAME.registerComponent('limbo', {
    init: function () {
        this.onLimbo = this.onLimbo.bind(this)
        this.regen = this.regen.bind(this)
        this.shuff = this.shuff.bind(this)
        this.Handle = this.Handle.bind(this)

    this.limbod = false
     this.rotations = 6
     this.Buttons = this.el.querySelector("#buttons")
     this.Rows = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
     ]

     this.pos = {
        1: {x: -2.2, y: 2.6 , z: 0.12424},
        2: {x:  0  , y: 2.6 , z: 0.12424},
        3: {x:  2.2, y: 2.6 , z: 0.12424},
        4: {x: -2.2, y: .9  , z: 0.12424},
        5: {x:  0  , y: .9  , z: 0.12424},
        6: {x:  2.2, y: .9  , z: 0.12424},
        7: {x: -2.2, y: -.79, z: 0.12424},
        8: {x:  0  , y: -.79, z: 0.12424},
        9: {x:  2.2, y: -.79, z: 0.12424}
     }

     this.OLDRows = this.Rows.slice()
    
     this.el.addEventListener("limbo", this.onLimbo)
    },

    regen: function() {
        let e = 0
        this.Rows.forEach(Row => {
            Row.forEach(x => {
                e += 1
                let el = this.Buttons.querySelector(`#b${(x).toString()}`)
                let pos = this.pos[e]
                el.setAttribute(`animation__bro`, `property: position; to: ${AFRAME.utils.coordinates.stringify(pos)}; dur: 200; easing: linear;`)
            });
        });
    },

    shuff: async function() {
        for (let i = 0; i < this.rotations; i++) {
            let times = 10
            for (let i = 0; i < times; i++) {
                var mode = randrange(14)
                // console.warn(mode)
                var [ar1, ar2, Array2, Array1] = [undefined, undefined, undefined, undefined]
                switch (mode) {
                    case 1 || 9 || 0:
                        await this.Handle(1, choice(this.Rows))
                        break;
                    case 2 || 10:
                        [ar1, ar2] = [randrange(this.Rows.length), randrange(this.Rows.length)]
                        if(ar2 == ar1) { ar2 = randrange(this.Rows.length) }
                        ar1 = this.Rows[ar1]
                        ar2 = this.Rows[ar2]
                        await this.Handle(2, ar1, ar2)
                        break;
                    case 3 || 11:
                        Array1 = choice(this.Rows)
                        [ar1, ar2] = [randrange(this.Rows.length), randrange(this.Rows.length)]
                        if(ar2 == ar1) { ar2 = randrange(this.Rows.length) }
                        ar1 = this.Rows[ar1]
                        ar2 = this.Rows[ar2]
                        await this.Handle(3, Array1, ar1, ar2)
                        break;
                    case 4 || 12:
                        Array1 = choice(this.Rows)
                        Array2 = choice(this.Rows)
    
                        ar1 = randrange(Array1.length)
                        ar2 = randrange(Array2.length)
    
                        await this.Handle(4, Array1, ar1, Array2, ar2)
                        break;
                    case 5 || 13:
                        await this.Handle(5, choice(this.Rows))
                        break;
                    case 6 || 14: 
                        await this.Handle(5, this.Rows)
                    case 7 || 15:
                        await this.Handle(6, this.Rows)
                    case 8 || 16:
                        await this.Handle(2, this.Rows[0], this.Rows[this.Rows.length - 1])
                
                    default:
                        break;
                }
                this.regen()
                await sleep(50)
            }
        await sleep(100)
        }
    },

    Handle: async function(...args) {
        var [Array2, Array1, ok1, ok2, Val1, Val2, Clone1, Clone2, b] = [undefined, undefined]
        // console.log("mode ::", args[0])
        switch(args[0]) {
            case 1:
                args[1].reverse();
                break;
            case 2:
                ok1 = args[2].slice()
                ok2 = args[1].slice()
                args[2] = ok2
                args[1] = ok1
                break;
            case 3:
                Array1 = args[1]
                Val1 = args[2]
                Val2 = args[3]
                Clone1 = args[1][Val1]
                Clone2 = args[1][Val2]
                args[1][Val1] = Clone2
                args[1][Val2] = Clone1
                break;
            case 4:
                Array1 = args[1]
                Array2 = args[3]
    
                Val1 = args[2]
                Val2 =  args[4]
    
                Clone1 = Array1[Val1]
                Clone2 = Array2[Val2]
    
                args[1][Val1] = Clone2
                args[3][Val2] = Clone1
                break;
            case 5:
                shuffleArray(args[1])
                break;
            case 6:
                b = 0
                args[1].forEach(el => {
                    Clone1 = el[0]
                    Clone2 = el[el.length - 1]
                    args[1][b][el.length - 1] = Clone1
                    args[1][b][0] = Clone2
                    b += 1
                });              
        }
    },

    onLimbo: async function () {
       //CreateNotif("./resources/GameInfo/Voices/mark.mp3")
        if(this.limbod) return;
        let b = new Audio("./resources/GameInfo/Sounds/limbo.mp3");
        b.play();
        b.currentTime = 176
        this.limbod = true
        let button = randrange(9)
        if(button == 0) button = 1;
        console.log("code is", button)
        await sleep(4000)
        for (x = 1; x < 10 ; x++) {
            let el = this.Buttons.querySelector(`#b${(x).toString()}`)
            el.querySelector("#text").setAttribute("text", "value", "-")
        }
        this.Buttons.querySelector(`#b${button}`).querySelector("#text").setAttribute("text", "value", "X")
        await sleep(200)
        this.Buttons.querySelector(`#b${button}`).querySelector("#text").setAttribute("text", "value", "-")
        await sleep(500)
        this.el.setAttribute("digi", "code", button)
        this.shuff()

    },
});