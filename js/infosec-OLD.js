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