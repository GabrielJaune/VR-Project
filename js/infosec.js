/*
    Cormon VR Experience - Virtual Reality on the Modern Web
    Copyright (C) 2023-2024  Yanis M., Matthieu Farcot

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// 󠁭󠁹󠀠󠁢󠁡󠁬󠁬󠁳

const Call = document.querySelector("#PHONE_CALL")
const Ring = document.querySelector("#PHONE_RING")
let obj = $("#PHONE_ASSET")

Call.addEventListener('ended', function() {
    console.warn("audio over")
    obj.attr('src', "./resources/GameInfo/phone.png")
})

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

function StopAudio(audio) {
    audio.pause()
    audio.currentTime = audio.duration || 0
    console.log(audio)
}

var ActiveNotif = ""

var Data = {
    GameLang: undefined,
    Badges: [],
    Calls : 0,
    Found : 0
}

var Badges = {
    1: "Employee Of The Month", // Find All Objects
    2: "Love Letter", // find paper, thing in trash, phone
    3: "InfoSec Guru", // Find guru
    4: "Really?", // Fail code
    5: "Mobiphobe", // Don't Answer Phone
    6: "I Am Legend", // All Achivements
    7: "Like A Boss", // Fail (incorrect code) and end the game (before auto ending)
    8: "Any%", // Pick Up All Interactible At The Same Time
    9: "OMG IT`S BLUE" // complete the hidden easter egg game
    // or add "I VERIFIED THE GOLDEN" idk
}

let ALang = ["fr", "en"]
let trans = [] // gender

let langData = {}
async function LangInt() { 
    let baseFR = await fetch('./languages/fr.json')
    langData["fr"] = await baseFR.json()

    let baseEN = await fetch('./languages/en.json')
    langData["en"] = await baseEN.json()
}
LangInt()

var NotifID = 0
var ActiveAudio = undefined

function Notify(Path) {
    NotifID = NotifID + 1
    ActiveNotif = undefined

    StopAudio(Call)
    StopAudio(Ring)

    obj.removeClass("shake")
    obj.attr('src', "./resources/GameInfo/phone_call.png")

    Call.src = Path
    Call.currentTime = 0
    Call.play()
}

async function CreateNotif(FileName, NoLang, extension) {
    var curnotif = NotifID
    let File = `./resources/GameInfo/Voices/${FileName}${ NoLang && "" || ("-" + Data["GameLang"].toUpperCase()) }.${extension || "mp3"}`
    ActiveNotif = File

    StopAudio(Ring)
    StopAudio(Call)

    Ring.src = "./resources/GameInfo/Sounds/phone.mp3"

    Ring.play();

    $("#PHONE_ASSET").addClass("shake")

    setTimeout(function() {
        if(NotifID != curnotif) return;
        ActiveNotif = undefined
        StopAudio(Ring)
        $("#PHONE_ASSET").removeClass("shake")
    }, 5000); // 5s
}

function GiveBadge(BadgeID) {
    console.log("giving badge")
    Data.Badges.push(BadgeID)
}

function HandlePhone() {
    console.log("hzdsfihgzeiruir")
    if(!ActiveNotif) return;
    console.log("Got A Notif")
    Data["Calls"] += 1
    console.log(ActiveNotif)
    Notify(ActiveNotif)
}

AFRAME.registerComponent("phoneanswer", {
    init: function() {
        this.el.addEventListener("click", function() {
            HandlePhone()
        })
    }
})

AFRAME.registerComponent('infoloader', {
    schema: { default: "", type: "string" },
  
    init: function () {
      $("#PHONE_ASSET").hide()
      this.OnClick = this.OnClick.bind(this)
      this.OnLang = this.OnLang.bind(this)
      this.rig = document.querySelector("#rig")
      this.cursorTeleport = this.rig.components["cursor-teleport"]
      this.clicker = this.el.querySelector("#clicker")
  
      this.ob = this.data.split(",")
      this.Count = 0
      this.Used = false
  
      this.langs = this.el.querySelector("#langs")

      this.clicker.setAttribute("src", this.ob[0])
  
      this.clicker.addEventListener("click", this.OnClick)
  
      this.Entry = this.el.querySelector("#Entry")
      this.Exit = this.el.querySelector("#Exit")
      this.cursorTeleport.teleportTo(this.Entry.object3D.position, this.Entry.object3D.quaternion) 

      ALang.forEach(element => {
        this.langs.querySelector(`#${element}`).addEventListener('click', this.OnLang)
      }, this);

      this.el.addEventListener('int', this.OnClick)
    },
  
    OnLang: function(lang) {
        if(Data.GameLang) { return }
        console.log(lang.target.id)
        Data.GameLang = lang.target.id
        this.langs.setAttribute('visible', false)
        this.clicker.setAttribute('visible', true)
        trans.forEach(element => {
            element.emit("int")
        });
        this.langs.setAttribute("position", "0 0 50")
        },

    OnClick: function() {
      if(!Data.GameLang) { return }
      let test = this.ob[this.Count]
      if(!test) {
        if(this.Used) { return }
        this.Used = true
        this.cursorTeleport.teleportTo(this.Exit.object3D.position, this.Exit.object3D.quaternion);
        document.querySelector("#audiobox").emit("click");
        $("#PHONE_ASSET").show();
        CreateNotif("Intro")
        return
      }
      this.clicker.setAttribute("src", `./resources/GameInfo/Slides/${Data.GameLang}/${test}.jpeg`)
      this.Count += 1
    }
});

AFRAME.registerComponent('translate', {
    schema: {type: "string", default: "image"},

    init: async function () {
        this.run = this.run.bind(this)

        trans.push(this.el)

        if(Data.GameLang) { this.run(); }

        this.el.addEventListener('int', this.run)
    },

    run: async function() {
        console.log("running", this.el.id, "on case", this.data)
        let val = langData[Data.GameLang][this.el.id]
        if(!val) { return }
        let ok = this.data
        console.log(ok)
        switch(ok) {
            case "text":
                console.log("ni")
                this.el.setAttribute("text", "value", val)
                break;
            case "image":
                console.log("on")
                this.el.setAttribute("material", "src", val)
                break;
            default:
                break;
        }
    },

    update: function () {
      // Do something when component's data is updated.
    },

    remove: function () {
      // Do something the component or its entity is detached.
    },

    tick: function (time, timeDelta) {
      // Do something on every scene tick or frame.
    }
});


AFRAME.registerComponent('interactive', {
    schema: {
        vrposition: {type: "vec3", default: {x: 0, y: -.1, z: -.2}},
        position: {type: "vec3", default: {x: 0, y: -.02, z: -.3}},
        rotation: {type: "vec3", default: {x: 0, y: 180, z: 0}},
        vrrotation: {type: "vec3", default: {x: 90, y: 180, z: 0}}
    },

    init: function () {
        this.onClick   = this.onClick.bind(this)
    
        this.grabbed = false
        this.LastParent = this.el.object3D.parent
        this.OldPos = AFRAME.utils.coordinates.stringify(this.el.getAttribute("position"))
        this.OldRot = AFRAME.utils.coordinates.stringify(this.el.getAttribute("rotation"))
    
        this.Click = 0
        this.el.addEventListener("click", this.onClick)
    },

    onClick: function() {  
        if(this.Click == 0) {
            this.grabbed = true
            switch (IsVR) {
                case true:
                  Used.object3D.attach(this.el.object3D)
        
                  this.el.setAttribute("position", this.data.vrposition)
                  this.el.setAttribute("rotation", this.data.vrrotation)
                  break
                case false:
                  $("#cur_camera")[0].object3D.attach(this.el.object3D)
        
                  this.el.setAttribute("position", this.data.position)
                  this.el.setAttribute("rotation", this.data.rotation)
                  break
              }
        }

        if(this.Click == 1) {
            this.grabbed = false
            this.LastParent.attach(this.el.object3D)
            this.el.setAttribute("position", this.OldPos)
            this.el.setAttribute("rotation", this.OldRot)

            this.Click = -1
        }
        
        this.Click += 1
    },

    update: function() {
        if(this.grabbed) {
            switch (IsVR) {
                case true:
                  Used.object3D.attach(this.el.object3D)
        
                  this.el.setAttribute("position", this.data.vrposition)
                  this.el.setAttribute("rotation", this.data.vrrotation)
                  break
                case false:
                  $("#cur_camera")[0].object3D.attach(this.el.object3D)
        
                  this.el.setAttribute("position", this.data.position)
                  this.el.setAttribute("rotation", this.data.rotation)
                  break
              }
        }
    }
});


AFRAME.registerComponent('object', {
    schema: {
        soundname: {default: 'null', type: "string"},
        badge: {default: 0, type: "number"},
        selected : {default: false, type: "boolean"}
    },

    init: function () {
      this.onClick = this.onClick.bind(this)

      this.el.addEventListener('click', this.onClick)
    },

    onClick: function() {
        if(this.data.selected) { return; }
        this.data.selected = true
        Data.Found += 1
        let mylight = this.el.querySelector("#light")
        if(mylight) {
            mylight.setAttribute("visible", true)
        }
        if(this.data.soundname != "null") {
            CreateNotif(this.data.soundname)
        }
        if(this.data.badge != 0) {
            // let achiv = this.el.querySelector("#achiv")
            // if(achiv) { achiv.components['particle-system'].startParticles(); }
            // new Audio('./resources/GameInfo/Sounds/unlock.mp3').play();
            GiveBadge(this.data.badge)
        }
    }
});


AFRAME.registerComponent('limbo', {
    init: function () {
        this.onLimbo = this.onLimbo.bind(this)
        this.regen = this.regen.bind(this)
        this.shuff = this.shuff.bind(this)
        this.Handle = this.Handle.bind(this)

    this.limbod = false
     this.rotations = 7
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
                var mode = randrange(16)
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
                await sleep(100)
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
        b.volume = 1
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

if(scene) {
    scene.addEventListener("enter-vr", function() {
      IsVR = true
      OnVRChange()
    })
  
    scene.addEventListener("exit-vr", function() {
      IsVR = false
      OnVRChange()
    })
}