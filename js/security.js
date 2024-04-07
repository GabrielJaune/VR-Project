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

AFRAME.registerComponent('digi', {
  schema: {
    code: { type: 'string', default: "1234" },
    disabled: { type: 'boolean', default: false },
    // ---- \\
    object: { type: 'selector' },
    event: { type: 'string', default: "unlock" }
  },

  init: function () {
    this.onClick = this.onClick.bind(this)

    this.CurrentCode = ""
    this.Buttons = this.el.querySelector("#buttons")

    this.ClickSound = this.el.querySelector("#click")
    this.DenySound = this.el.querySelector("#deny")
    this.AcceptSound = this.el.querySelector("#accept")

    let [XPos, CurX, CurY] = [undefined, undefined, undefined]
    let [CurRow, MaxRowX] = [0, 3]
    let [Xdiff, Ydiff] = [2.2, 1.7]

    for (x = 1; x < this.Buttons.children.length + 1; x++) {
      CurRow += 1
      if (CurRow > MaxRowX) {
        CurY -= Ydiff
        CurX = XPos
        CurRow = 1
      }

      let el = this.Buttons.querySelector(`#b${(x).toString()}`)
      let Pos = el.getAttribute("position")

      if (typeof (CurY) != "number") { CurY = Pos.y; }
      if (typeof (CurX) != "number") { CurX = Pos.x; XPos = CurX }

      let Type = el.getAttribute("btn-mode")
      let [Mode, Input] = [Type.mode, Type.input]

      el.querySelector("#text").setAttribute("text", "value", (Mode == "input" && Input) || Mode.toUpperCase())
      el.setAttribute("position", { x: CurX, y: CurY, z: Pos.z })
      el.addEventListener("click", this.onClick)

      CurX += Xdiff
    }
  },


  onClick: function (element) {
    if(this.data.disabled == true) return;

    let el = element.target
    let Type = el.getAttribute("btn-mode")

    let [Mode, Input] = [Type.mode, Type.input]

    if (this.ClickSound) { this.ClickSound.components.sound.playSound() }

    switch (Mode) {
      case "input":
        this.el.emit("digi_input")
        this.CurrentCode = this.CurrentCode + Input
        break;

      case "clr":
        this.el.emit("digi_clear")
        this.CurrentCode = ""
        break;

      case "ent":
        if (this.CurrentCode == this.data.code) {
          this.el.emit("digi_accept")
          if (this.data.object && this.data.event) { this.data.object.emit(this.data.event) }
          if (this.AcceptSound) { this.AcceptSound.components.sound.playSound() }
        } else {
          this.el.emit("digi_deny")
          if (this.DenySound) { this.DenySound.components.sound.playSound() }
        }

        this.CurrentCode = ""
        break;
    }
  },
})