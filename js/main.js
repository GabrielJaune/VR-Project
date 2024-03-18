/* Cormon VR Experience - Virtual Reality on the Modern Web
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
    along with this program.  If not, see <https://www.gnu.org/licenses/>. */

// NOTE:
// init = start function

var Epoch = Math.floor(new Date().getTime()/1000.0)

var Used = undefined

let IsVR = false, OldMenu = {["pos"]: undefined, ["parent"]: undefined}
var Selected = undefined
var Buttons = {}, Langs = {}

var userLang = (navigator.language || navigator.userLanguage || "fr").split("-")[0]; 

var SceneData = $("a-scene")
var scene     = SceneData[0]
var MainScene = $("#MainScene")[0]

if(MainScene) MainScene.addEventListener("templaterendered", UpdateNavigator);

console.log("LANG => " + userLang)

const Infos = {
  1: {
    title: "Bac Pro MELEC",
    info: `La clef pour allumer ta carriere!\n\nMetiers de l'ELectricite et\n de ses Environnements Connectes`,
    redirect: [
      {"image": "./resources/images/map.png", "redirect": "melec.html"},
      {"image": "./resources/images/cube.png", "redirect": "atelier.html"}
    ]
  },
  2: {
    title: "Bac Pro CIEL",
    info: "La connexion vers ton avenir!\n\nCybersecurite, Informatique et\nReseaux Eectronique",
    redirect: [
      {"image": "./resources/images/map.png", "redirect": "ciel.html"},
      {"image": "./resources/images/cube.png", "redirect": "demotest.html"}
    ]
  },
  3: {
    title: "BTS Electrotechnique",
    info: "Supercharge ta carriere!\n\n Le Bac+2 pour l'emploi",
    redirect: "bts.html"
  },
  4: {
    title: "CPGE",
    info: "Classe Preparatoire\n aux Grandes Ecoles\n\n Informatique, Sciences de l'Ingenieur,\n Mathematiques, Physiques",
    redirect: [
      {"image": "./resources/images/map.png", "redirect": "cpge.html"},
      {"image": "./resources/images/cube.png", "redirect": "cpge3D.html"}
    ]
  }
}

AFRAME.registerComponent("door", {
  schema: {
    locked: { type: 'boolean', default: false },
    opened: { type: 'boolean', default: false },
    inversed: { type: 'boolean', default: false }
  },
  init: function() {
    // console.log("got a char")
    this.OP = this.el.getAttribute("rotation").y
    this.Locked = this.data.locked
    this.Opened = this.data.opened

    console.log(this.Opened)

    if(this.Opened) this.open();

    this.lock = this.lock.bind(this)
    this.unlock = this.unlock.bind(this)
    this.click   = this.click.bind(this)

    this.el.addEventListener("unlock", this.unlock)
    this.el.addEventListener("lock"  , this.lock)
    this.el.addEventListener("click" , this.click)
  },

  unlock: function() {
    console.log("unlocking")
    this.Locked = false
  },

  lock: function() {
    console.log("locking")
    this.Locked = true
  },

  click: function() {
    console.log("clicked")
    if (this.Locked) return;
    this.Opened = !this.Opened
    if(this.Opened) this.open(); else this.close();
  },

  open: function() {
    console.log("Opening")
    this.el.setAttribute("animation__rot", `property: rotation; to: 0 ${this.OP + (this.data.inversed && -90 || 90)} 0; dur: 500; easing: linear;`)
  },

  close: function() {
    console.log("Closing")
    this.el.setAttribute("animation__rot", `property: rotation; to: 0 ${this.OP} 0; dur: 500; easing: linear;`)
  }
})

AFRAME.registerComponent("controller", {
  init: function() {
    this.onDown = this.onDown.bind(this)
    this.onUp = this.onUp.bind(this)

    this.el.addEventListener("mousedown", this.onDown)
    this.el.addEventListener("mouseup", this.onUp)
  },

  onDown: function(evt) {
    Used = this.el
  },

  onUp: async function(evt) {
    await sleep(200)
    if(Used == this.el) Used = undefined;
  }
})

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function getRndInteger(min, max) { return Math.floor(Math.random() * (max - min) ) + min; }

function LoadLang(Language) {
  // console.log("Loading " + Language + ".json")
  // $.ajax("./languages/" + Language + ".json").done(function(data){
  //   Langs[Language] = i18n.create(data)
  // }).fail(function() {
  //   alert("Failed To Load " + Language + ".json")
  // })
}

async function UpdateNavigator() {
  await sleep(100)

  console.log("navigation update")
  $("#cur_camera")[0].emit("end_trans")
}

let PathName = location.pathname.split("/")
PathName = (PathName[PathName.length - 1].split(".")[0] || "index").toUpperCase()
console.log(PathName)

async function SwitchArea(Name) {
  let ok = document.querySelectorAll(".field")
  ok.forEach(function(val) { $(val).remove() })
  console.log("Changing To Area => " + Name)

  $("#cur_camera")[0].emit("start_trans")
  await sleep(500)

  MainScene.attributes.template.nodeValue = "src: " + "./resources/pages/" + PathName + "/" + Name + ".html"
}

async function OnVRChange() {
  let Menu = $("#Menu")[0]

  if(!Menu) return;

  if(!OldMenu["pos"]) OldMenu["pos"] = AFRAME.utils.coordinates.stringify(Menu.getAttribute("position"));
  if(!OldMenu["parent"]) OldMenu["parent"] = Menu.object3D.parent;

  switch(IsVR) {
    case true:
      $('#leftController')[0].object3D.attach(Menu.object3D)
      Menu.setAttribute('position', "0 0 -.12")
      Menu.setAttribute('rotation', "0 -10 180")
      break;
    case false:
      OldMenu["parent"].attach(Menu.object3D)
      Menu.setAttribute('position', OldMenu['pos'])
      break;
    default:
      alert("Unknown IsVR Value")
  }
}

AFRAME.registerComponent("info-panel", {
    init: function() {
      this.onHover    = this.onHover.bind(this);
      this.onRelease  = this.onRelease.bind(this);

      this.onExtra1  = this.onExtra1.bind(this);
      this.onExtra2  = this.onExtra2.bind(this);

      this.Extra = {
        1: null,
        2: null,
      }

      this.onConfirm  = this.onConfirm.bind(this);
      this.onButton   = this.onButton.bind(this);
      this.onCancel   = this.onCancel.bind(this);

      this.onButton = this.onButton.bind(this);
      this.onCancel = this.onCancel.bind(this);

      // NOTE: Not Outside Since Loading Stuff
      Buttons = document.querySelectorAll(".menu-button")

      this.Video = $("#BACKGROUND_VIDEO")[0]
      this.src = ["./resources/videos/ari.mp4", "./resources/videos/NoHit.mp4","./resources/videos/sans.mp4"]
      
      this.ConfirmMode = false

      this.Clicked = false
      this.el.object3D.scale.set(0, 0, 0)

      this.el.addEventListener("mouseenter", this.onHover)
      this.el.addEventListener("mouseleave", this.onRelease)

      this.Title       = this.el.querySelector("#Info_Title")
      this.Description = this.el.querySelector("#Info_Description")

      this.Cancel  = this.el.querySelector("#Info_Cancel")
      this.Confirm = this.el.querySelector("#Info_Confirm")

      this.Extra1 = this.Confirm.querySelector("#Extra1")
      this.Extra2 = this.Confirm.querySelector("#Extra2")
      
      this.Extra1.addEventListener('click', this.onExtra1)
      this.Extra2.addEventListener('click', this.onExtra2)

      this.Cancel.addEventListener("click", this.onCancel)
      this.Confirm.addEventListener("click", this.onConfirm)

      for (var i = 0; i < Buttons.length; ++i) {
          Buttons[i].addEventListener("click", this.onButton)
      }
    },

    onHover: function () {
      this.el.emit("pause")
    },

    onRelease: function() {
      this.el.emit("resume")
    },

    onConfirm: function (evt) {
        if(!Selected) return;
        this.ConfirmMode = !this.ConfirmMode

        if(typeof(Selected["redirect"]) == "string") {
          window.location.href = Selected.redirect
        } else {
          this.Extra1.setAttribute('visible', this.ConfirmMode)
          this.Extra2.setAttribute('visible', this.ConfirmMode)

          if(!this.ConfirmMode) return;

          Selected["redirect"].forEach(function(value, index) {
            index += 1
            console.log(value)
            this.Extra[index] = value
            let x = "Extra" + index
            this["Extra" + index].setAttribute("material", "src", value["image"])
          }, this)
        }
    },

    onExtra1: function (evt) {
      if(!this.Extra[1]) return;
      var cur = this.Extra[1]["redirect"]
      window.location.href = cur
    },

    onExtra2: function (evt) {
      if(!this.Extra[2]) return;
      var cur = this.Extra[2]["redirect"]
      window.location.href = cur
    },

    onButton: function (evt) {
        if(this.Clicked) { return }
        let cool = $("#4K1080P")[0]
        this.Clicked = true
        Selected = Infos[evt.currentTarget.id]
        this.Video.src = "./resources/videos/" + evt.currentTarget.id + ".mp4"
        this.Video.play()
        cool.setAttribute("visible", "true")
        cool.components.sound.playSound()
        this.el.emit("enter")
        this.Title.setAttribute('text', 'value', Selected.title)
        this.Description.setAttribute('text', 'value', Selected.info)
    },

    onCancel: function (evt) {
      if(!this.Clicked) { return }

      this.Extra1.setAttribute('visible', "false")
      this.Extra2.setAttribute('visible', "false")

      let cool = $("#4K1080P")[0]
      this.Clicked = false
      cool.components.sound.stopSound()
      cool.setAttribute("visible", "false")
      this.Video.src = "" //this.src[getRndInteger(0, this.src.length)]
      this.el.emit("cancel")
    },
})


AFRAME.registerComponent('test', {
  init: function () {
    this.onClick = this.onClick.bind(this)
    this.el.addEventListener("click", this.onClick)
  },

  onClick: async function() {
    this.el.firstElementChild.setAttribute("particle-system", "enabled", "false")
    this.el.firstElementChild.setAttribute("particle-system", "enabled", "true")
  }
});

AFRAME.registerComponent('toggleclick', {
  init: function () {
    this.onClick = this.onClick.bind(this)
    this.el.addEventListener("click", this.onClick)
  },

  onClick: async function() {
    let ok = document.querySelector(this.el.getAttribute("src"))
    this.el.object3D.visible = !this.el.object3D.visible
    if (this.el.object3D.visible) {
      ok.play()
    } else {
      ok.pause()
      ok.currentTime = 0
    }
  }
});


AFRAME.registerComponent('moai', {
  init: function () {
    this.onClick = this.onClick.bind(this)
    this.moai = document.querySelector("#moai_entity")
    this.Clicked = false
    this.src = ["moai.png"]

    this.el.addEventListener("click", this.onClick)
  },

  onClick: async function() {
    if(this.Cooldown) return;
    this.Cooldown = true
    if(!this.Clicked) {
      this.moai.object3D.visible = true
      let rn = getRndInteger(0, this.src.length)
      let cool = "./resources/images/memes/" + this.src[rn]
      console.log(rn, this.src[rn])
      $("#moai")[0].setAttribute("src", cool)
      this.moai.emit("in")
      await sleep(1000)
    } else {
    this.moai.emit("out")
    await sleep(1000)
    }

    this.Clicked  = !this.Clicked
    this.Cooldown = false
  }
});

AFRAME.registerComponent('btn-mode', {
  schema: {
    mode : {type: 'string', default: 'input'},
    input: {type: 'string', default: "1"}
  },
})

AFRAME.registerComponent('scene-changer', {
  schema: {
    name : {type: 'string', default: 'default'},
    angle: {type: 'int', default: 0}
  },

  init: async function() {
    this.onClick = this.onClick.bind(this)
    this.update = this.update.bind(this)

    this.SceneName = this.data["name"]
    this.el.addEventListener("click", this.onClick)
  },

  update: async function() {  
    console.log("update")
    // ------ \\
    let newData = this.data
    this.SceneName = newData["name"]
    // ------ \\
    let container = $("#navigation")[0]
    let angle = newData["angle"] / (180 / Math.PI), radius = container.getAttribute("radius-outer")
    let x = ( radius ) * Math.cos(angle), z = ( radius ) * Math.sin(angle);
  
    this.el.setAttribute("position", {"x": x, "y": container.getAttribute("position").y, "z": z})
  
    this.el.object3D.lookAt(container.getAttribute("position"))
    this.el.setAttribute("visible", "true")
  },

  onClick: async function() {
    console.log("area")
    SwitchArea(this.SceneName)
  }
})

AFRAME.registerComponent('scene-init', {
  schema: {type: 'string', default: 'default'},
  init: async function() {
    console.log("init")
    this.SceneName = this.data
    console.log(this.SceneName)

    SwitchArea(this.SceneName)
  }
})

AFRAME.registerComponent('redirect', {
  init: function() {
    this.onClick   = this.onClick.bind(this)
    this.redirect  = this.el.getAttribute("redirect") || "index.html"

    this.el.addEventListener('click', this.onClick)
  },
  onClick: async function() {
    var win = $("#cur_camera")[0]
    if(SceneData) { SceneData.empty() };
    if(win) { win.emit("start_trans"); await sleep(500) };
    window.location.href = this.redirect
  }
})

AFRAME.registerComponent('infospot', {
  schema: {type: 'string', default: 'default'},
  init: async function() {
    this.onClick   = this.onClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.OldRotation = this.el.rotation

    this.InfoPanel = document.querySelector("#NotifPanel")
    this.InfoDes   = this.InfoPanel.querySelector("#Info_Description")
    this.Info      = this.data || "No Info Provided"

    this.el.addEventListener('mouseenter', this.onMouseEnter);
    this.el.addEventListener('mouseleave', this.onMouseLeave)
    this.el.addEventListener("click", this.onClick)
  },

  onClick: async function() {
    console.log("clicked Info => ", this.Info)
    this.InfoPanel.setAttribute("position", "0 0 -1.5")
    this.InfoPanel.setAttribute("visible", "true")
    this.InfoDes.setAttribute('text', 'value', this.Info)
  },

  onMouseLeave: async function() {
    this.el.emit("start_trans")
    console.log("enter")
  },

  onMouseEnter: async function() {
    this.el.emit("end_trans")
    console.log("leave")
  }
})

AFRAME.registerComponent('spotinfo', {
  init: async function() {
    this.onClick   = this.onClick.bind(this)
    this.InfoDes   = this.el.querySelector("#Info_Description")


    this.el.setAttribute("visible", "false")
    this.el.setAttribute("position", "0 0 20")
    this.el.addEventListener("click", this.onClick)

    $.getJSON("./resources/Notification.json", function( data ) {
      data.forEach(function(Obj) {
        let canuse = false
        let enabled = Obj["Until"] && (Obj["Until"] <= Epoch) || Obj["Enabled"]
        if(!enabled) return;

        if(Obj["Only"]) {
          if(typeof(Obj["Only"]) == "string") {
            if(Obj["Only"] == PathName.toLowerCase()) canuse = true;
          } else {
            Obj["Only"].forEach(function(asset) {
              if(asset == PathName.toLowerCase()) canuse = true;
            })
          }
        } else { canuse = true }

        if(!canuse) return;

        console.log("showing notification")

        this.el.setAttribute("position", "0 0 -1.5")
        this.el.setAttribute("visible", "true")
        this.InfoDes.setAttribute('text', 'value', Obj["Content"])

      }, this)
    }.bind(this), this);
  },

  onClick: async function() {
    this.el.setAttribute("visible", "false")
    this.el.setAttribute("position", "0 0 20")
  }
})

AFRAME.registerComponent('pc', {
  init: async function() {
    this.onClick   = this.onClick.bind(this)

    this.Enabled = true
    this.screen = this.el.querySelector("#SCREEN")
    this.light  =  this.el.querySelector("#LIGHT")

    this.el.addEventListener("click", this.onClick)

    this.onClick()
  },

  onClick: async function() {
    this.Enabled = !this.Enabled
    if (this.Enabled) this.screen.emit("womp")
    this.screen.setAttribute("material", "src", "./resources/images/PC_" + (this.Enabled && "ON" || "OFF") + ".png")
    this.light.setAttribute("visible", this.Enabled && "true" || "false")
  }
})

AFRAME.registerComponent('collider', {
  init: function() {
    this.el.addEventListener('hit', (e) => {
     console.log('hit')
    })
    this.el.addEventListener('hitend', (e) => {
      console.log('hitend')
    })
  }
})


AFRAME.registerComponent('phone', {
  schema: {default: ''},

  init: async function() {
    this.onClick   = this.onClick.bind(this)
    this.Asset = document.querySelector(this.data)

    this.LastParent = this.el.object3D.parent
    this.OldPos = AFRAME.utils.coordinates.stringify(this.el.getAttribute("position"))
    this.OldRot = AFRAME.utils.coordinates.stringify(this.el.getAttribute("rotation"))
  console.log(this.OldPos)

    this.Click = -1
    this.el.addEventListener("click", this.onClick)
  },

  onClick: async function(evt) {
    this.Click += 1
    let Target = evt.currentTarget

    if(this.Click == 0) {
      switch (IsVR) {
        case true:
          Used.object3D.attach(this.el.object3D)

          this.el.setAttribute("position", "0 -.1 -.2")
          this.el.setAttribute("rotation", "0 180 0")
          break
        case false:
          $("#cur_camera")[0].object3D.attach(this.el.object3D)

          this.el.setAttribute("position", "0 -.02 -.3")
          this.el.setAttribute("rotation", "-90 180 0")
          break
      }
    }

    if(this.Click == 1) {
        this.Asset.play()
    }

    if (this.Click == 2) {
      this.Click = -1

        this.LastParent.attach(this.el.object3D)
        this.el.setAttribute("position", this.OldPos)
        this.el.setAttribute("rotation", this.OldRot)

        this.Asset.pause()
        this.Asset.currentTime = 0
    }
  }
})

// PROJECTOR \\

AFRAME.registerComponent('projector', {
  init: function() {
    this.onClick = this.onClick.bind(this)
    this.cooldown = false
    this.enabled = true

    this.projector = document.querySelector(this.el.getAttribute("projector"))
    this.light = this.projector.querySelector("#light")
    this.source = this.projector.querySelector("#source")

    this.cover = this.el.querySelector("#cover")
    this.asset = this.el.querySelector("#asset")
    this.sound = this.projector.querySelector("#sound")

    if(!this.cover || !this.asset) { console.log("end"); alert("No cover/asset Found"); return }

    this.FileList  = (this.el.getAttribute("images") || "").split(", ")
    this.Directory = this.el.getAttribute("folder") || "./"
    this.Current = 0

    this.projector.addEventListener('click', this.onClick)
    this.projector.addEventListener('newimage', this.switchPage)
  },

  onClick: async function() {
    if(this.cooldown) { return; }
    this.cooldown = true
    console.log("play")
    this.sound.components.sound.playSound();
    this.switchPage()
    await sleep(1000)
    this.cooldown = false
  },

  switchPage: async function() {
    this.cover.emit("hide")
    this.light.setAttribute("visible", "false")
    this.source.setAttribute("visible", "false")
    if(this.Current == this.FileList.length) { this.Current = 0 }
    await sleep(500)
    this.asset.setAttribute('material', 'src', this.Directory + "/" + this.FileList[this.Current])
    this.Current += 1
    await sleep(500)
    this.light.setAttribute("visible", "true") 
    this.source.setAttribute("visible", "true") 
    this.cover.emit("show")
  }
})

// 3D MODEL \\

function updateMaterial(Material, Side) {
  if(!Material) return;
  Material.side = Side
  Material.needsUpdate = true
}

function updateMaterialSide(material, side) {
  if (!material) return;

  if (material instanceof window.THREE.Material) {
    updateMaterial(material, side)
  } else if (material instanceof window.THREE.MultiMaterial) {
    material.materials.forEach(function(childMaterial) {
      updateMaterial(childMaterial, side);
    });
  }
}

function traverse(node) {
  node.children.forEach(function(child) {
    if (child.children) {
      traverse(child);
    }

    updateMaterial(child['material'], window.THREE.DoubleSide);
  });
}

AFRAME.registerComponent('modelfix', {
  init: function() {
    this.el.addEventListener('model-loaded', function(evt) {
      var model = evt.detail.model;
      traverse(model);
  });
  }
})


AFRAME.registerComponent('collider-check', {
  dependencies: ['raycaster'],

  init: function () {
    this.OldCall = undefined

    this.el.addEventListener('raycaster-intersection', function (e) {
      this.OldCall = e.detail.els
      console.log(this.OldCall)
      e.detail.els.forEach(function(el) {
        el.emit("detect")
      })
      console.log('Player enter collision !');
      console.log(this.OldCall)

    });

    this.el.addEventListener('raycaster-intersection-cleared', function (e) {
    //   console.log(this.OldCall)

    //   this.OldCall.forEach(function(el) {
    //     el.emit("clear-detect")
    //   })
    //   console.log('Player removed collision !');
    });
  }
});

// 0.19 X   |   0.22 Y
AFRAME.registerComponent('security', {
  init: function() {
    this.onDetection = this.onDetection.bind(this)
    this.Trigger     = this.Trigger.bind(this)
    // is ticking a good idea? EDIT: nvm im doing every seconds
    this.stick       = this.stick.bind(this)
    this.onClick     = this.onClick.bind(this)

    this.Code = "69420"
    this.CurrentCode = ""

    this.Blast    = false
    this.Detected = false
    this.Armed    = true

    this.VisibleLight = true

    this.Delay = 2 // in" seconds idiot, we are not using ms here
    this.CurDelay = undefined

    this.Cam = this.el.querySelectorAll("#Camera")
    this.Alarm = this.el.querySelector("#alarm")
    this.Siren = this.el.querySelector("#siren")

    this.Cam.forEach(function(element) {
      let hitbox = element.querySelector("#light").querySelector("#hitbox")
      hitbox.addEventListener("detect", (event) => {
        this.onDetection(element)
        console.log("detect called");
      });

      hitbox.addEventListener("clear-detect", (event) => {
        console.log("cancel called");
      });
    }, this)

    this.Buttons = this.el.querySelector("#control").querySelector("#buttons")

    let XPos = undefined
    let CurX = undefined

    let CurY = undefined

    let CurRow  = 0
    let MaxRowX = 3

    let Xdiff = 0.2
    let Ydiff = 0.3
    // IT GOES IDC, Y, X
    // 0.
    // ^^ Why is there a 0
    for (x = 1; x < this.Buttons.children.length + 1 ; x++) {
      CurRow += 1
      if(CurRow > MaxRowX) {
        CurY -= Ydiff
        CurX = XPos
        CurRow = 1
      }

      let el = this.Buttons.querySelector(`#b${(x).toString()}`)
      let Pos = el.getAttribute("position")
      if (!CurY) CurY = Pos.y; 
      if (!CurX) { CurX = Pos.z; XPos = CurX }

      let Type  = el.getAttribute("btn-mode")
      let Mode  = Type.mode
      let Input = Type.input

      el.querySelector("#text").setAttribute("text", "value", (Mode == "input" && Input) || Mode.toUpperCase())
      
      el.setAttribute("position", {x: Pos.x, y: CurY, z: CurX})

      el.addEventListener("click", this.onClick)

      CurX -= Xdiff
    }
    this.stick()
  },


  onClick: function(element) {
    let el = element.target
    let Type  = el.getAttribute("btn-mode")

    let Mode  = Type.mode
    let Input = Type.input

    switch(Mode) {
      case "input":
        console.log("you CLICK :", Input)
        this.CurrentCode = this.CurrentCode + Input
        console.log("NEW CODE :", this.CurrentCode)
      break;

      case "clr":
        console.log("CLEARED")
        this.CurrentCode = ""
      break;

      case "ent":
        if(this.CurrentCode == this.Code) { 
          console.log("CORRECT");
          this.Armed = !this.Armed;
          this.Blast = false;
          this.Detected = false
          this.CurDelay = this.Armed && this.CurDelay || undefined
          this.Alarm.setAttribute("visible", false)
          this.Siren.components.sound.stopSound();
        } else console.log("WRONG");
        this.CurrentCode = ""
      break;
    }
  },

  stick: function() {
    let Time = new Date().getTime() / 1000
    if(!this.Armed) this.CurDelay = undefined;
    if(this.CurDelay && Time > this.CurDelay && this.Detected) {
      this.Trigger()
      this.CurDelay = undefined
    }

    if(this.Blast) {
      console.log("WOMP")
      this.VisibleLight =  !this.VisibleLight
      this.Alarm.setAttribute("visible", this.VisibleLight)
    }

    setTimeout(this.stick, 300) // Hacky way since I don't want every tick
    // kys im keeping it this way
  }, 

  onDetection: function(el) {
    if(this.Detected) {console.log("Already Detected"); return }
    if(!this.Armed)   {console.log("System Is Not Armed"); return }
    this.Detected = true
    let Time = new Date().getTime() / 1000
    this.CurDelay = Time + this.Delay
  },

  Trigger: function() {
    if(this.Siren) this.Siren.components.sound.playSound();
    this.Blast = true
    console.log("ALARM TIME womp womp")
  }
})

AFRAME.registerComponent('infoloader', {
  schema: { default: "", type: "string" },

  init: function () {
    this.OnClick = this.OnClick.bind(this)
    this.rig = document.querySelector("#rig")
    this.cursorTeleport = this.rig.components["cursor-teleport"]
    this.clicker = this.el.querySelector("#clicker")

    this.ob = this.data.split(",")
    this.Count = 1

    this.clicker.setAttribute("text", "value", this.ob[0])

    this.clicker.addEventListener("click", this.OnClick)

    this.Entry = this.el.querySelector("#Entry")
    this.Exit = this.el.querySelector("#Exit")
    this.cursorTeleport.teleportTo(this.Entry.object3D.position, this.Entry.object3D.quaternion) 
  },

  OnClick: function() {
    let test = this.ob[this.Count]
    if(!test) { this.cursorTeleport.teleportTo(this.Exit.object3D.position, this.Exit.object3D.quaternion); return }
    this.clicker.setAttribute("text", "value", test)
    this.Count += 1
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


AFRAME.registerComponent('digi', {
  schema: {
    code: { type: 'string', default: "1234" },
    object: {type: 'selector'},
    event: {type: 'string', default: "unlock"}
  },

  init: function() {
    this.onClick     = this.onClick.bind(this)

    this.Code = this.data.code
    this.CurrentCode = ""

    this.Buttons = this.el.querySelector("#buttons")
    console.log(this.Buttons)

    let XPos = undefined
    let CurX = undefined

    let CurY = undefined

    let CurRow  = 0
    let MaxRowX = 3

    let Xdiff = 2.2
    let Ydiff = 1.7
    // IT GOES IDC, Y, X
    // 0.
    // ^^ Why is there a 0
    for (x = 1; x < this.Buttons.children.length + 1 ; x++) {
      CurRow += 1
      if(CurRow > MaxRowX) {
        CurY -= Ydiff
        CurX = XPos
        CurRow = 1
      }

      let el = this.Buttons.querySelector(`#b${(x).toString()}`)
      let Pos = el.getAttribute("position")
      if (typeof(CurY) != "number") CurY = Pos.y; 
      if (typeof(CurX) != "number") { CurX = Pos.x; XPos = CurX }

      let Type  = el.getAttribute("btn-mode")
      let Mode  = Type.mode
      let Input = Type.input

      el.querySelector("#text").setAttribute("text", "value", (Mode == "input" && Input) || Mode.toUpperCase())
      
      el.setAttribute("position", {x: CurX, y: CurY, z: Pos.z})

      el.addEventListener("click", this.onClick)

      CurX += Xdiff
    }
  },


  onClick: function(element) {
    let el = element.target
    let Type  = el.getAttribute("btn-mode")

    let Mode  = Type.mode
    let Input = Type.input

    switch(Mode) {
      case "input":
        console.log("you CLICK :", Input)
        this.CurrentCode = this.CurrentCode + Input
        console.log("NEW CODE :", this.CurrentCode)
      break;

      case "clr":
        console.log("CLEARED")
        this.CurrentCode = ""
      break;

      case "ent":
        if(this.CurrentCode == this.Code) { 
          console.log("CORRECT");
          this.data.object.emit(this.data.event)
        } else console.log("WRONG");
        this.CurrentCode = ""
      break;
    }
  },

  stick: function() {
    let Time = new Date().getTime() / 1000
    if(!this.Armed) this.CurDelay = undefined;
    if(this.CurDelay && Time > this.CurDelay && this.Detected) {
      this.Trigger()
      this.CurDelay = undefined
    }

    if(this.Blast) {
      console.log("WOMP")
      this.VisibleLight =  !this.VisibleLight
      this.Alarm.setAttribute("visible", this.VisibleLight)
    }

    setTimeout(this.stick, 300) // Hacky way since I don't want every tick
    // kys im keeping it this way
  }, 
})

// InfoSec

AFRAME.registerComponent('infosec', {
  init: function() {
    this.onClick = this.onClick.bind(this)

    this.onTimer    = this.onTimer.bind(this)
    this.TimerCheck = this.TimerCheck.bind(this)

    this.onSuccess = this.onSuccess.bind(this)
    this.onFail    = this.onFail.bind(this)

    this.Static = false
    this.Found  = 0
    this.Time   = 60

    this.Lamp = this.el.querySelector('#lamp')

    this.Video  = $("#infovid")[0]
    this.tv     = this.el.querySelector("#tv")
    this.tvideo = this.tv.querySelector("#video")
    this.sound  = "src: ./resources/sounds/found.mp3; on: found"

    this.ToFind = this.el.querySelectorAll("#find")

    this.ToFind.forEach(function(element) {
      let On = this.onClick
      let Used = false
      element.addEventListener('click', function() {
        if(Used) return;
        Used = true
        On(element)
      })
      element.setAttribute("sound", this.sound)
    }, this)

    this.Video.addEventListener('ended', function() {
      this.Static = false
      this.tvideo.components.sound.playSound()
      this.Video.muted = true
      this.Video.setAttribute('loop', 'true')
      this.Video.setAttribute('src', "./resources/videos/Finder/none.mp4")
    }.bind(this))

    this.onTimer()
  },

  onClick: async function(Element) {
    this.Found += 1

    var Finder = Element.getAttribute("Finder") || "none"
    console.log("Found " + Finder)

    if(this.Static) { this.tv.emit("crit") }
    this.Static = true

    this.tvideo.components.sound.stopSound()

    this.Video.muted = false
    this.Video.removeAttribute('loop')
    this.Video.setAttribute('src', "./resources/videos/Finder/" + Finder + ".mp4")

    Element.querySelector("#light").setAttribute("visible", "true")
    Element.emit("found")

    // console.log(this.Found)
  },

  onTimer: async function() {
    if(this.Found >= this.ToFind.length) { this.onSuccess(); return }
    this.Time -= 1

    this.TimerCheck()

    if(this.Time <= 0) { this.onFail(); return; }

    setTimeout(this.onTimer, 1000)
  },

  TimerCheck: async function() {
    // I love math
    this.tvideo.setAttribute('sound', 'volume', 60 - this.Time)

    if(this.Time == 20) {
      // Why did I even do that print?
      console.log("ehbezfygrufezhuzefuefhusezfhorihoefhoehuirebjriezfgfezjbkhidbfezfv_hezfnklqcsgysvmcqshbsjopsqdfhiozefuçze_çy")
      this.Lamp.querySelector('#alarm').setAttribute('visible', 'true')
      this.Lamp.querySelector('#light').setAttribute('visible', 'false')
      this.Lamp.emit("womp")
    }
  },

  onSuccess: async function() {
    alert("SUCCESS")
    this.Lamp.components.sound.stopSound()
    this.Lamp.querySelector('#alarm').setAttribute('visible', 'false')

  },

  onFail: async function() {
    alert("FAILURE")
  }
})

if(scene) {
  scene.addEventListener("enter-vr", function() {
    IsVR = true
    OnVRChange()
  })

  scene.addEventListener("exit-vr", function() {
    IsVR = false
    OnVRChange()
  })

  scene.addEventListener("loaded", function() {
    OnVRChange()
  })
}

// Audio

AFRAME.registerComponent('audiohandler', {
  init: async function() {
    this.onClick = this.onClick.bind(this)
    this.playing = false

    this.el.addEventListener('click', this.onClick);
  },

  onClick: async function() {
    this.playing = !this.playing
    if(this.playing) {
      this.el.components.sound.playSound()
    } else {
      this.el.components.sound.stopSound()
    }
  }
})

// This code is toooooo long
// oh my god