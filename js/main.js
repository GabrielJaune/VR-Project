// NOTE:
// init = start function

var balls = "ok"
var Buttons = {}
this.Langs = {}
var Langs = this.Langs
var Selected = undefined

var userLang = (navigator.language || navigator.userLanguage || "fr").split("-")[0]; 

console.log("LANG => " + userLang)

const Infos = {
  1: {
    title: "Bac Pro MELEC",
    info: `Le Baccalauréat Professionnel MELEC intervient dans les secteurs du batiment (residentiel, tertiaire, industriel), de l'industrie, de l'agriculture, des services et des infrastructures.\nConsidérant les enjeux de la transition énergétique et l'évolution des techniques et des technologies,\nce métier est en pleine mutation.`,
    redirect: "melec.html"
  },
  2: {
    title: "Bac Pro CIEL",
    info: "Le baccalaureat professionnel SN a pour ambition de former les futurs professionnels de l’informatique.",
    redirect: "sn.html"
  },
  3: {
    title: "BTS Electrotechnique",
    info: "Le BTS electrotechnique se prepare en deux ans après un bac STI2D de preference. C'est un diplôme de niveau bac +2 qui se prepare en formation initiale mais aussi en alternance.",
    redirect: "index.html"
  },
  4: {
    title: "CPGE",
    info: "Description CPGE.",
    redirect: "index.html"
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function LoadLang(Language) {
  // console.log("Loading " + Language + ".json")
  // $.ajax("./languages/" + Language + ".json").done(function(data){
  //   Langs[Language] = i18n.create(data)
  // }).fail(function() {
  //   alert("Failed To Load " + Language + ".json")
  // })
}

async function UpdateNavigator() {
  console.log("navigation update")
  
  var fields = $('.field'), container = $('#navigation')

  do {
    fields = $('.field')
    container = $('#navigation')    
    await sleep(100)
  } while (!fields[0] || !container[0])
  await sleep(100)

  var angle = 0, step = 0, radius = container[0].getAttribute("radius-outer")

  fields.each(function() {
    angle = (this.getAttribute("cam-angle") || 0) / (180 / Math.PI)
    let x = ( radius ) * Math.cos(angle), z = ( radius ) * Math.sin(angle);

    this.setAttribute("position", {"x": x, "y": container[0].getAttribute("position").y, "z": z})

    this.object3D.lookAt(container[0].getAttribute("position"))
    this.setAttribute("visible", "true")
    step += 1
  });
}

let PathName = location.pathname.split("/")
PathName = PathName[PathName.length - 1].split(".")[0].toUpperCase()

async function SwitchArea(Name) {
  let pos = {x: 1, y: 1, z: 1}

  let ok = document.querySelectorAll(".field")
  ok.forEach(function(val) {
    $(val).remove()
  })
  console.log("Changing To Area => " + Name)
  var Sky = $("#sky")

  $("#cur_camera")[0].emit("start_trans")
  await sleep(500)

  $("#MainScene")[0].attributes.template.nodeValue = "src: " + "./resources/pages/" + PathName + "/" + Name + ".html"
  await sleep(100)
  await UpdateNavigator()
  $("#cur_camera")[0].emit("end_trans")
}

AFRAME.registerComponent("info-panel", {
    init: function() {
        this.el.sceneEl.renderer.sortObjects = true;
        this.el.object3D.renderOrder = 100;

        this.onInsideClick  = this.onInsideClick.bind(this);
        this.onOutsideClick = this.onOutsideClick.bind(this);

        // NOTE: Not Outside Since Loading Stuff
        Buttons= document.querySelectorAll(".menu-button")

        this.OldSize = structuredClone(this.el.object3D.scale)
        
        this.el.object3D.scale.set(0, 0, 0)

        this.Title       = document.querySelector("#Info_Title")
        this.Description = document.querySelector("#Info_Description")

        this.Cancel  = document.querySelector("#Info_Cancel")
        this.Confirm = document.querySelector("#Info_Confirm")

        this.Cancel.addEventListener("click", this.onOutsideClick)
        this.Confirm.addEventListener("click", this.onEnter)

        for (var i = 0; i < Buttons.length; ++i) {
            Buttons[i].addEventListener("click", this.onInsideClick)
        }
    },

    onEnter: function (evt) {
        console.log("Enter Clicked")
        if(!Selected) return;
        console.log("Found " + Selected.id)
        window.location.href = Selected.redirect
    },

    onInsideClick: function (evt) {
        Selected = Infos[evt.currentTarget.id]
        this.el.object3D.visible = true
        var obj = [this.OldSize["x"], this.OldSize["y"], this.OldSize["z"]]
        let X, Y, Z;
        [X, Y, Z] = obj
        this.el.object3D.scale.set(X, Y, Z)
        this.Title.setAttribute('text', 'value', Selected.title)
        this.Description.setAttribute('text', 'value', Selected.info)
    },

    onOutsideClick: function (evt) {
        console.log("Exit Clicked")
        this.el.object3D.visible = false
        this.el.object3D.scale.set(0, 0, 0)
    },
})

AFRAME.registerComponent('highlight', {
  init: function () {
    var buttonEls = this.buttonEls = this.el.querySelectorAll('.menu-button');
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.reset = this.reset.bind(this);
    for (var i = 0; i < buttonEls.length; ++i) {
      buttonEls[i].addEventListener('mouseenter', this.onMouseEnter);
      buttonEls[i].addEventListener('mouseleave', this.onMouseLeave);
    }
  },

  onMouseEnter: function (evt) {
    var buttonEls = this.buttonEls;
    evt.target.setAttribute('material', 'color', '#046de7');
    for (var i = 0; i < buttonEls.length; ++i) {
      if (evt.target === buttonEls[i]) { continue; }
      buttonEls[i].setAttribute('material', 'color', 'white');
    }
  },

  onMouseLeave: function (evt) {
    if (this.el.is('clicked')) { return; }
    evt.target.setAttribute('material', 'color', 'white');
  },

  reset: function () {
    var buttonEls = this.buttonEls;
    for (var i = 0; i < buttonEls.length; ++i) {
      this.el.removeState('clicked');
      buttonEls[i].play();
      buttonEls[i].emit('mouseleave');
    }
  }
});


AFRAME.registerComponent('test', {
  init: function () {
    this.onClick = this.onClick.bind(this)
    this.el.addEventListener("click", this.onClick)
  },

  onClick: async function() {
    this.el.firstElementChild.setAttribute("particle-system", "enabled", "false")
    this.el.firstElementChild.setAttribute("particle-system", "enabled", "true")
    // await sleep(1000)
    // this.el.setAttribute("particle-system", "enabled", "false")
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

    this.el.addEventListener("click", this.onClick)
  },

  onClick: async function() {
    console.log("clickd")
    this.moai.object3D.visible = true
    await sleep(1000)
    this.moai.object3D.visible = false
  }
});

AFRAME.registerComponent('scene-changer', {
  init: async function() {
    this.onClick = this.onClick.bind(this)
    this.SceneName = this.el.getAttribute("scene-name") || "default"

    this.el.addEventListener("click", this.onClick)
  },

  onClick: async function() {
    console.log("area")
    SwitchArea(this.SceneName)
  }
})

AFRAME.registerComponent('scene-init', {
  init: async function() {
    console.log("init")
    this.SceneName = this.el.getAttribute("scene-name") || "default"

    SwitchArea(this.SceneName)
  }
})

LoadLang(userLang)