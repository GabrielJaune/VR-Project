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

AFRAME.registerComponent("name", {
    init: function() {
        console.log("Init Executed on Element")
    }
})

AFRAME.registerComponent("info-panel", {
    init: function() {
        this.el.sceneEl.renderer.sortObjects = true;
        this.el.object3D.renderOrder = 100;
        console.log("OK BUDDY")
        this.onInsideClick  = this.onInsideClick.bind(this);
        this.onOutsideClick = this.onOutsideClick.bind(this);
        // NOTE: Not Outside Since Loading Stuff
        Buttons= document.querySelectorAll(".menu-button")

        this.OldSize = structuredClone(this.el.object3D.scale)
        
        this.el.object3D.scale.set(0, 0, 0)

        this.Title       = document.querySelector("#Info_Title")
        this.Description = document.querySelector("#Info_Description")

        for (var i = 0; i < Buttons.length; ++i) {
            console.log(Buttons[i])
            Buttons[i].addEventListener("click", this.onInsideClick)
        }
    },

    onInsideClick: function (evt) {
        var CurrentInfo = Infos[evt.currentTarget.id]
        this.el.object3D.visible = true
        var obj = [this.OldSize["x"], this.OldSize["y"], this.OldSize["z"]]
        let X, Y, Z;
        [X, Y, Z] = obj
        this.el.object3D.scale.set(X, Y, Z)
        this.Title.setAttribute('text', 'value', CurrentInfo.title)
        this.Description.setAttribute('text', 'value', CurrentInfo.info)
    },

    onOutsideClick: function (evt) {
        console.log("Outside Click")
        this.el.object3D.visible = false
        this.el.object3D.scale.set(0, 0, 0)
    }
})

console.log("Loaded Elemnt yay")