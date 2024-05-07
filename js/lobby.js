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
    
const Infos = {
  1: {
    title: "Bac Pro MELEC",
    info: `La clef pour allumer ta carriere!\n\nMetiers de l'ELectricite et\n de ses Environnements Connectes\n\nBienvenue a Melec Plage!`,
    redirect: "melec3D.html",
  },
  2: {
    title: "Bac Pro MELEC",
    info: `La clef pour allumer ta carriere!\n\nMetiers de l'ELectricite et\n de ses Environnements Connectes\n\nExploration 360 des plateaux`,
    redirect: "melec.html",
  },
  3: {
    title: "Bac Pro CIEL",
    info: "La connexion vers ton avenir!\n\nCybersecurite, Informatique et\nReseaux Electronique\n\nExploration VR Labo RISC\nUtilisez les touches\n'WASD' pour naviguer",
    redirect: "ciel3D.html",
  },
  4: {
    title: "Bac Pro CIEL",
    info: "La connexion vers ton avenir!\n\nCybersecurite, Informatique et\nReseaux Electronique\n\nExploration 360 Labo RISC",
    redirect: "ciel.html",
  },
  5: {
    title: "BTS Electrotechnique",
    info: "Supercharge ta carriere!\n\n Le Bac+2 pour l'emploi\n\nDecouverte des plateaux BTS",
    redirect: "bts.html",
  },
  6: {
    title: "CPGE",
    info: "Classe Preparatoire\n aux Grandes Ecoles\n\n Informatique, Sciences de l'Ingenieur,\n Mathematiques, Physiques\n\nDecouverte VR CPGE\nUtilisez les touches\n'WASD' pour naviguer",
    redirect: "cpge3D.html",
  },
  7: {
    title: "CPGE",
    info: "Classe Preparatoire\n aux Grandes Ecoles\n\n Informatique, Sciences de l'Ingenieur,\n Mathematiques, Physiques\n\nExploration ateliers CPGE",
    redirect: "cpge.html",
  },
  8: {
    title: "INFOSEC GAME",
    info: "NOUVEAUTE\n\nUne introduction ludique\na la securite de l'information",
    redirect: "infosec.html",
  },
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