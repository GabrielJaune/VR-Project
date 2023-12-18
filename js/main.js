// NOTE:
// init = start function

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
    redirect: "melec.html"
  },
  2: {
    title: "Bac Pro CIEL",
    info: "La connexion vers ton avenir!\n\nCybersecurite, Informatique et\nReseaux Eectronique",
    redirect: "sn.html"
  },
  3: {
    title: "BTS Electrotechnique",
    info: "Supercharge ta carriere!\n\n Le Bac+2 pour l'emploi",
    redirect: "index.html"
  },
  4: {
    title: "CPGE",
    info: "Classe Preparatoire\n aux Grandes Ecoles\n\n Informatique, Sciences de l'Ingenieur,\n Mathematiques, Physiques",
    redirect: "cpge.html"
  }
}

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
  
  // var fields = $('.field'), container = $('#navigation')
  // if(!fields || !container) { $("#cur_camera")[0].emit("end_trans"); return; }

  // var angle = 0, step = 0, radius = container[0].getAttribute("radius-outer")

  // fields.each(function() {
  //   angle = (this.getAttribute("cam-angle") || 0) / (180 / Math.PI)
  //   let x = ( radius ) * Math.cos(angle), z = ( radius ) * Math.sin(angle);

  //   this.setAttribute("position", {"x": x, "y": container[0].getAttribute("position").y, "z": z})

  //   this.object3D.lookAt(container[0].getAttribute("position"))
  //   this.setAttribute("visible", "true")
  //   step += 1
  // });

  $("#cur_camera")[0].emit("end_trans")
}

let PathName = location.pathname.split("/")
PathName = PathName[PathName.length - 1].split(".")[0].toUpperCase()

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
      this.onHover  = this.onHover.bind(this);
      this.onRelease  = this.onRelease.bind(this);

      this.onConfirm  = this.onConfirm.bind(this);
      this.onButton = this.onButton.bind(this);
      this.onCancel = this.onCancel.bind(this);

      // NOTE: Not Outside Since Loading Stuff
      Buttons = document.querySelectorAll(".menu-button")

      this.Video = $("#BACKGROUND_VIDEO")[0]
      this.src = ["./resources/videos/ari.mp4", "./resources/videos/NoHit.mp4","./resources/videos/sans.mp4"]
      this.Clicked = false
      this.el.object3D.scale.set(0, 0, 0)

      this.el.addEventListener("mouseenter", this.onHover)
      this.el.addEventListener("mouseleave", this.onRelease)

      this.Title       = this.el.querySelector("#Info_Title")
      this.Description = this.el.querySelector("#Info_Description")

      this.Cancel  = this.el.querySelector("#Info_Cancel")
      this.Confirm = this.el.querySelector("#Info_Confirm")

      this.Cancel.addEventListener("click", this.onCancel)
      this.Confirm.addEventListener("click", this.onConfirm)

      for (var i = 0; i < Buttons.length; ++i) {
          Buttons[i].addEventListener("click", this.onButton)
      }
    },

    onHover: function () {
      // this.el.setAttribute("material", "topColor", "topColor: #FFFFFF")
      this.el.emit("pause")
      // this.el.emit("hover")
      console.log("hover")
    },

    onRelease: function() {
      this.el.emit("resume")
      console.log("release")
    },

    onConfirm: function (evt) {
        if(!Selected) return;
        console.log("Found " + Selected.id)
        window.location.href = Selected.redirect
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
    this.src = ["moai.png", "troll.png"]

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
  init: async function() {
    this.onClick   = this.onClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.OldRotation = this.el.rotation

    this.InfoPanel = document.querySelector("#infoPanel")
    this.InfoDes   = this.InfoPanel.querySelector("#Info_Description")
    this.Info      = this.el.getAttribute("infospot") || "No Info Provided"

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

    this.el.setAttribute("visible", "false")
    this.el.setAttribute("position", "0 0 20")
    this.el.addEventListener("click", this.onClick)
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

// InfoSec

AFRAME.registerComponent('infosec', {
  init: function() {
    this.onClick = this.onClick.bind(this)

    this.Static = false
    this.Video = $("#infovid")[0]
    this.Found = 0
    this.Time  = 60
    this.sound = "src: ./resources/sounds/found.mp3; on: found"

    this.ToFind = this.el.querySelectorAll("#find")

    this.ToFind.forEach(function(element) {
      console.log(this.sound)
      let On = this.onClick
      console.log(On)
      element.addEventListener('click', function() { On(element) })
      element.setAttribute("sound", this.sound)
    }, this)

    $("#infovid")[0].addEventListener('ended', function() {
      this.Video.setAttribute('loop', 'true')
      this.Video.setAttribute('src', "./resources/videos/Finder/none.mp4")
    }.bind(this))

  },

  onClick: async function(Element) {
    var Finder = Element.getAttribute("Finder") || "none"
    console.log("Found " + Finder)

    console.log(this.Video)
    this.Video.removeAttribute('loop')
    this.Video.setAttribute('src', "./resources/videos/Finder/" + Finder + ".mp4")

    Element.querySelector("#light").setAttribute("visible", "true")
    Element.emit("found")
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