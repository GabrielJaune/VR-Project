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

var Sam = new SamJs({ debug: 1, pitch: 64, speed: 72, mouth: 128, throat: 128 });
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
}

let obj = $("#PHONE_ASSET")
const Ring = document.querySelector("#PHONE_RING")
const Call = document.querySelector("#PHONE_CALL")

Call.addEventListener('ended', function() {
    obj.attr('src', "./resources/GameInfo/phone.png")
})

let UsedAlarm = false
let AlarmAudio = undefined
var ActiveNotif = ""

var Data = {
    GameLang: undefined,
    Badges: [],
    Objects: [],
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

function EndAlarm() {
    if(AlarmAudio == undefined) return false;
    AlarmAudio.pause();
    AlarmAudio = undefined
    let lights = document.querySelector("#corridorlight")

    for (x = 1; x < lights.children.length + 1; x++) {     
        let el = lights.querySelector(`#cool${(x).toString()}`)
        el.setAttribute('light', 'intensity', '50')
        el.querySelector('#shadow').setAttribute('light', 'intensity', '1')
    }

    document.querySelector("#liftdoor1").emit('animopen')
    document.querySelector("#liftdoor2").emit('animopen')

    document.querySelector("#ender").emit("fail")

    return true
}

AFRAME.registerComponent("phoneanswer", {
    init: function() {
        this.el.addEventListener("click", function() {
            HandlePhone()
        })
    }
})

AFRAME.registerComponent('handler', {
    init: function() {
        this.CodeFail = this.CodeFail.bind(this)

        this.el.addEventListener("digi_deny", this.CodeFail)
    },

    CodeFail: async function() {
        if(UsedAlarm) return;
        UsedAlarm = true
        await sleep(1200)
        AlarmAudio = new Audio('./resources/sounds/Alarm.mp3');
        AlarmAudio.play();

        let lights = document.querySelector("#corridorlight")

        for (x = 1; x < lights.children.length + 1; x++) {     
            let el = lights.querySelector(`#cool${(x).toString()}`)
            el.setAttribute('light', 'intensity', '20')
            el.querySelector('#shadow').setAttribute('light', 'intensity', '.1')
        }

        setTimeout(function() {
            document.querySelector("#liftdoor1").emit('animclose')
            document.querySelector("#liftdoor2").emit('animclose')
        }, 500);

        setTimeout(function() {
            if(AlarmAudio == undefined) return;
            console.log("ended")
            EndAlarm()
        }, 5000);
    }
});

AFRAME.registerComponent('maindoor', {
    init: function() {
        this.digi = this.digi.bind(this)
        this.used = false
        this.el.addEventListener('unlock', this.digi)
    },

    digi: function() {
        console.log("aceepted")
        if(this.used) return;
        this.used = true
        Data.Found += 1
        Data.Objects.push(3)
        CreateNotif("3")
        let mylight = document.querySelector("#assetlight").querySelector(`#L3`)
        if(mylight) {
            mylight.setAttribute("light", "intensity", '5')
        }
    }
})


AFRAME.registerComponent('ender', { // dragon
    init: function () {
      this.onClick = this.onClick.bind(this)
      this.Success = this.Success.bind(this)
      this.Failure = this.Failure.bind(this)
      this.Enable  = this.Enable.bind(this)

      this.Used = false

      this.Action = this.el.querySelector("#action")
      this.Text   = this.el.querySelector("#text")
      this.Badge  = this.el.querySelector("#badge")
      this.part   = this.el.querySelector("#part")

      this.rig = document.querySelector("#rig")
      this.cursorTeleport = this.rig.components["cursor-teleport"]

      this.Exit =  document.querySelector("#Exit")

      this.Action.addEventListener('click', this.onClick)
      this.el.addEventListener("fail", this.Failure)
      this.el.addEventListener("win", this.Failure)

      // this.Text.setAttribute("visible", false)é
      // this.Badge.setAttribute("visible", false)
    },

    onClick: function () {
        if(this.Used) { return }
        this.Used = true

        this.Success()
    },

    Enable: async function (win) {
        UsedAlarm = true
        document.querySelector("#door-main").setAttribute("door", "locked", "false")
        document.querySelector("#door-A").setAttribute("door", "locked", "false")

        setTimeout(async function(){
            Sam.speak(`You have ${win && "finished" || "failed"} the experiment`);
            await sleep(3000)
            Sam.speak(`Educational mode activated`)
        }, 2000)

        this.cursorTeleport.teleportTo(this.Exit.object3D.position, this.Exit.object3D.quaternion) 

        document.querySelector("#liftdoor1").emit('animclose')
        document.querySelector("#liftdoor2").emit('animclose')

        document.querySelector("#text-asset").setAttribute('visible', 'true')

        document.querySelector("#Corridor_Walls").setAttribute('material', 'wireframe', true)

        let lights = document.querySelector("#assetlight")
        for (x = 1; x < 11 + 1; x++) {     
            let el = lights.querySelector(`#L${(x).toString()}`)
            if(!el) { continue }
            if(!Data.Objects.includes((x).toString())) {
                el.setAttribute('light', 'intensity', '5')
                el.setAttribute('light', 'color', '#ff0000')
            }
        }

        await sleep(1500)

        document.querySelector("#liftdoor1").emit('animopen')
        document.querySelector("#liftdoor2").emit('animopen')
    },

    Success: async function () {
        let b = new Audio('./resources/GameInfo/Sounds/buzzer.mp3')
        b.volume = .5
        b.play(); 
        // new Audio('./resources/GameInfo/Sounds/epicwin.mp3').play();
        // this.part.components['particle-system'].startParticles()
        // HideView()
        this.Enable(true)
    },

    Failure: async function () {
        new Audio('./resources/GameInfo/Sounds/buzzer.mp3').play(); 
        this.Enable(false)
    }
});

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

      let lights = document.querySelector("#assetlight")

      for (x = 1; x < 11 + 1; x++) {     
          let el = lights.querySelector(`#L${(x).toString()}`)
          if(!el) { continue }
          el.setAttribute('light', 'intensity', '0')
      }

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
        document.querySelector("#liftdoor1").emit('animclose')
        document.querySelector("#liftdoor2").emit('animclose')
        setTimeout(function() {
            document.querySelector("#liftdoor1").emit('animopen')
            document.querySelector("#liftdoor2").emit('animopen')
        }, 3000);
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
    }
});

AFRAME.registerComponent('object', {
    schema: {
        soundname: {default: 'null', type: "string"},
        id: {default: 0, type: "number"},
        click: {default: 1, type: "number"},
        badge: {default: 0, type: "number"},
        locked : {default: false, type: "boolean"}
    },

    init: function () {
      this.onClick = this.onClick.bind(this)
      this.CurClick = 0

      this.el.addEventListener('click', this.onClick)
    },

    onClick: function() {
        if(this.data.locked || UsedAlarm) { return }
        this.CurClick += 1
        if(this.CurClick == this.data.click) {
            this.data.locked = true
            Data.Found += 1
            Data.Objects.push(this.data.id)
            let mylight = document.querySelector("#assetlight").querySelector(`#L${this.data.id}`)
            if(mylight) {
                mylight.setAttribute("light", "intensity", '5')
            }
            if(this.data.soundname != "null") {
                CreateNotif(this.data.soundname)
            }
            if(this.data.badge != 0) {
                new Audio('./resources/GameInfo/Sounds/unlock.mp3').play();
                GiveBadge(this.data.badge)
            }
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