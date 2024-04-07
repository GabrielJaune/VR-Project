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
  
      this.lock = this.lock.bind(this)
      this.unlock = this.unlock.bind(this)
      this.click   = this.click.bind(this)
  
      this.LockSound = this.el.querySelector("#lock")
      this.OpenSound = this.el.querySelector("#open")
      this.CloseSound = this.el.querySelector("#close")
  
      if(this.Opened) this.open();
  
      this.el.addEventListener("unlock", this.unlock)
      this.el.addEventListener("lock"  , this.lock)
      this.el.addEventListener("click" , this.click)
    },

    update: function() {
      this.Locked = this.data.locked
      this.Opened = this.data.opened
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
      if (this.Locked) {
        if(this.LockSound) { this.LockSound.emit("go") };
        return;
      }
      this.Opened = !this.Opened
      if(this.Opened) this.open(); else this.close();
    },
  
    open: function() {
      console.log("Opening")
      if(this.OpenSound) { this.OpenSound.emit("go") };
      this.el.setAttribute("animation__rot", `property: rotation; to: 0 ${this.OP + (this.data.inversed && -90 || 90)} 0; dur: 500; easing: linear;`)
    },
  
    close: function() {
      console.log("Closing")
      if(this.CloseSound) { this.CloseSound.emit("go") };
      this.el.setAttribute("animation__rot", `property: rotation; to: 0 ${this.OP} 0; dur: 500; easing: linear;`)
    }
  })

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