var APP_DATA = {
  "scenes": [
    {
      "id": "0-plateau-scurit-sret-1",
      "name": "Plateau Sécurité Sûreté (1)",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 2992,
      "initialViewParameters": {
        "yaw": -2.2587027684739027,
        "pitch": 0.20364448591407935,
        "fov": 1.4337299731675692
      },
      "linkHotspots": [
        {
          "yaw": 0.5559564746642067,
          "pitch": 0.29081271833247513,
          "rotation": 0,
          "target": "1-plateau-scurit-sret-2"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-plateau-scurit-sret-2",
      "name": "Plateau Sécurité Sûreté (2)",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 2992,
      "initialViewParameters": {
        "yaw": -3.1157976635328364,
        "pitch": 0.29418448337441205,
        "fov": 1.4337299731675692
      },
      "linkHotspots": [
        {
          "yaw": -0.19261535867933688,
          "pitch": 0.09775405823788219,
          "rotation": 0,
          "target": "0-plateau-scurit-sret-1"
        }
      ],
      "infoHotspots": []
    }
  ],

  "HotSpots": {
    "PC_HotSpot": {
      "scene" : "1-plateau-scurit-sret-2",
      "coords" : { yaw: 2.15, pitch: 10.101 },
      "opts" : { perspective: { radius: 1820, extraTransforms: "rotateZ(-0deg)" }},
    },

    "PC_HotSpot2": {
      "scene" : "1-plateau-scurit-sret-2",
      "coords" : { yaw: 0.562, pitch: 0.2 },
      "opts" : { perspective: { radius: 1820, extraTransforms: "rotateY(-30deg) rotateZ(6.1deg) rotateX(-5deg)" }}
    }
  },

  "name": "Project Title",

  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": true,
    "viewControlButtons": true
  }
};
