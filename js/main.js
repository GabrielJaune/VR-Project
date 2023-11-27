// NOTE:
// init = start function

const Infos = {
    1: {
        title: "Test 1",
        info: "This Is An Info Text",
        redirect: "/main.html"
    },
    2: {
        title: "Test 2",
        info: "This Is Another Info Text",
        redirect: "/main.html"
    },
    3: {
        title: "Test 3",
        info: "This Is The Last Info Text",
        redirect: "/main.html"
    }
}

var Buttons = {}
var Selected = undefined

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
  