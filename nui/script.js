$(document).ready(function () {
  
  HealthIndicator = new ProgressBar.Circle("#HealthIndicator", {
    color: "rgb(0, 182, 91)",
    trailColor: "green",
    strokeWidth: 15,
    trailWidth: 15,
    duration: 250,
    easing: "easeInOut",
  });

  ArmorIndicator = new ProgressBar.Circle("#ArmorIndicator", {
    color: "rgb(12,107,164)",
    trailColor: "rgb(11,89,147)",
    strokeWidth: 15,
    trailWidth: 15,
    duration: 250,
    easing: "easeInOut",
  });

  HungerIndicator = new ProgressBar.Circle("#HungerIndicator", {
    color: "rgb(125,46,19)",
    trailColor: "rgb(212,68,27)",
    strokeWidth: 15,
    trailWidth: 15,
    duration: 250,
    easing: "easeInOut",
  });

  ThirstIndicator = new ProgressBar.Circle("#ThirstIndicator", {
    color: "rgb(0, 85, 155)",
    trailColor: "rgb(0, 140, 255)",
    strokeWidth: 15,
    trailWidth: 15,
    duration: 250,
    easing: "easeInOut",
  });

  StressIndicator = new ProgressBar.Circle("#StressIndicator", {
    color: "rgb(102,0,0)",
    trailColor: "rgb(140,0,0)",
    strokeWidth: 15,
    trailWidth: 15,
    duration: 250,
    easing: "easeInOut",
  });

  OxygenIndicator = new ProgressBar.Circle("#OxygenIndicator", {
    color: "rgb(82,102,104)",
    trailColor: "rgb(50,59,65)",
    strokeWidth: 15,
    trailWidth: 15,
    duration: 250,
    easing: "easeInOut",
  });

  Speedometer = new ProgressBar.Circle("#SpeedCircle", {
    color: "rgba(222, 222, 222, 1)",
    trailColor: "rgba(222, 222, 222, 0.3)",
    strokeWidth: 12,
    duration: 100,
    trailWidth: 12,
    easing: "easeInOut",
  });

  FuelIndicator = new ProgressBar.Circle("#FuelCircle", {
    color: "rgba(222, 222, 222, 1)",
    trailColor: "rgba(222, 222, 222, 0.3)",
    strokeWidth: 12,
    duration: 2000,
    trailWidth: 12,
    easing: "easeInOut",
  });

  VoiceIndicator = new ProgressBar.Circle("#VoiceIndicator", {
    color: "#AAAAAA",
    trailColor: "#AAAAAA",
    strokeWidth: 15,
    trailWidth: 15,
    duration: 250,
    easing: "easeInOut",
  });
  VoiceIndicator.animate(0.1);
});

window.addEventListener("message", function (event) {
  let data = event.data;

  if (data.action == "update_hud") {
    HealthIndicator.animate((data.hp/3) / 100);
    ArmorIndicator.animate(data.armor / 100);
    HungerIndicator.animate( 100 - data.hunger / 100);
    ThirstIndicator.animate( 100 - data.thirst / 100);
    StressIndicator.animate(data.stress / 100);
    OxygenIndicator.animate(data.oxygen / 100);
  }

 // Get current voice level and animate path
 if (data.actionv == "voice_level") {
  switch (data.voicelevel) {
    case 1:
      data.voicelevel = 33;
      break;
    case 2:
      data.voicelevel = 66;
      break;
    case 3:
      data.voicelevel = 100;
      break;
    default:
      data.voicelevel = 33;
      break;
  }
  VoiceIndicator.animate(data.voicelevel/100);
}

  // Light up path if talking
  if (data.talking == 1) {
    VoiceIndicator.path.setAttribute("stroke", "red");
  } else if (data.talking == false) {
    VoiceIndicator.path.setAttribute("stroke", "white");
  }

  // Headset icon if using radio
  if (data.radio == true) {
    $("#VoiceIcon").removeClass("fa-microphone");
    $("#VoiceIcon").addClass("fa-headset");
  } else if (data.radio == false) {
    $("#VoiceIcon").removeClass("fa-headset");
    $("#VoiceIcon").addClass("fa-microphone");
  }

  // Hide stress if disabled
  if (data.action == "disable_stress") {
    $("#StressIndicator").hide();
  }

  // Hide voice if disabled
  if (data.action == "disable_voice") {
    $("#VoiceIndicator").hide();
  }

  // Show oxygen if underwater
  if (data.showOxygen == true) {
    $("#OxygenIndicator").show();
  } else if (data.showOxygen == false) {
    $("#OxygenIndicator").hide();
  }



  // Hide armor if 0
  if (data.armor == 0) {
    $("#ArmorIndicator").fadeOut();
  } else if (data.armor > 0) {
    $("#ArmorIndicator").fadeIn();
  }

  if (data.stress == 0) {
    $("#StressIndicator").fadeOut();
  } else if (data.stress > 0) {
    $("#StressIndicator").fadeIn();
  }

// Change color and icon if HP is 0 (dead)
  if (data.hp < 1) {
    HealthIndicator.animate(0);
    HealthIndicator.trail.setAttribute("stroke", "red");
    $("#hp-icon").removeClass("fa-heart");
    $("#hp-icon").addClass("fa-skull");
  } else if (data.hp > 0) {
    HealthIndicator.trail.setAttribute("stroke", "green");
    $("#hp-icon").removeClass("fa-skull");
    $("#hp-icon").addClass("fa-heart");
  }

  // Flash if thirst is low
  if (data.thirst > 75) {
    $("#ThirstIcon").toggleClass("flash");
  }
  // Flash if hunger is low
  if (data.hunger > 75) {
    $("#HungerIcon").toggleClass("flash");
  }

  if (data.speed > 0) {
    $("#SpeedIndicator").text(data.speed);
    let multiplier = data.maxspeed * 0.1;
    let SpeedoLimit = data.maxspeed + multiplier;
    Speedometer.animate(data.speed / SpeedoLimit);
    Speedometer.path.setAttribute("stroke", "white");
  } else if (data.speed == 0) {
    $("#SpeedIndicator").text("0");
    $("#SpeedIndicator2").text("MHP");
    Speedometer.path.setAttribute("stroke", "none");
  }

  if (data.action == "update_fuel") {
    let finalfuel = (data.fuel / 100);
    if (finalfuel > 0.9) {
      FuelIndicator.animate(1.0);
    } else if (finalfuel < 0.9) {
      FuelIndicator.animate(finalfuel);
    }
    if (finalfuel < 0.2) {
      FuelIndicator.path.setAttribute("stroke", "red");
    } else if (finalfuel > 0.2) {
      FuelIndicator.path.setAttribute("stroke", "white");
    }
  }

  if (data.showSpeedo == true) {
    $("#VehicleContainer").fadeIn();
  } else if (data.showSpeedo == false) {
    $("#VehicleContainer").fadeOut();
  }

  if (data.showFuel == true) {
    $("#FuelCircle").show();
  } else if (data.showFuel == false) {
    $("#FuelCircle").hide();
  }

  if (data.showUi == true) {
    $(".container").show();
  } else if (data.showUi == false) {
    $(".container").hide();
  }

  if (data.action == "toggle_hud") {
    $("body").fadeToggle()
  }
});
