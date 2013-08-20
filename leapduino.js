var LD = (function() {
  var
  socket,
  lastAng = 0, lastRot = 0, angDiff, rotDiff, __active = false,
  button = document.getElementById("button");

  button.addEventListener("click", function(){
    if (__active) {
      LD.stop();
    } else {
      LD.start();
    }
  });

  document.addEventListener("keydown", function(e) {
    if (e.which === 27) {
      LD.stop();
    } else if (e.which === 32) {
      LD.start();
    }
  })

  Leap.loop(function(frame) {
    if (!__active) {
      return;
    }

    var hand = frame.hands[0], ang, rot;

    socket = socket || io.connect("http://192.168.2.25:8080");

    if (hand) {
      rot = Math.round(hand.direction[0] * 90) + 90;
      ang = Math.round(hand.direction[1] * 90);

      if (ang !== lastAng && rot !== lastRot) {
        angDiff = ang - lastAng;
        rotDiff = rot - lastRot;

        if (angDiff > 2) {
          angDiff = 2
        } else if (angDiff < -2) {
          angDiff = -2
        }

        if (rotDiff > 2) {
          rotDiff = 2
        } else if (rotDiff < -2) {
          rotDiff = -2
        }

        ang = lastAng + angDiff;
        rot = lastRot + rotDiff;

        rot = Math.max(Math.min(rot, 180), 0);
        ang = Math.max(Math.min(ang, 90), 0);

        lastAng = ang;
        lastRot = rot;

        ang = ang+"";
        rot = rot+"";

        while (ang.length < 3) {
          ang = "0"+ang;
        }

        while (rot.length < 3) {
          rot = "0"+rot;
        }

        console.log(rot + ang);
        socket.emit("pos", rot + ang);
      }
    }
  });

  return {
    start: function() {
      __active = true;
      button.innerText = "Stop";
    },
    stop: function() {
      __active = false;
      button.innerText = "Start";
    }
  };
}());