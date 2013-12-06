// Generated by CoffeeScript 1.6.3
var FT_Sensor, flashLED, interpColor;

window.serial_stateRef = new Firebase('https://hubo-firebase.firebaseIO.com/serial_state');

window.ledTimeoutId = null;

flashLED = function() {
  window.clearTimeout(window.ledTimeoutId);
  $('#led').show();
  return window.ledTimeoutId = setTimeout(function() {
    return $('#led').hide();
  }, 100);
};

FT_Sensor = (function() {
  function FT_Sensor(name) {
    this.name = name;
    this.m_x_obj = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 0.1, 0xFF0000);
    this.m_y_obj = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 0.1, 0x00FF00);
    this.f_z_obj = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 0), 0.1, 0x00FF00);
    this.axis = new THREE.Object3D();
    this.axis.add(this.m_x_obj);
    this.axis.add(this.m_y_obj);
    this.axis.add(this.f_z_obj);
  }

  FT_Sensor.prototype.updateColor = function() {
    var fz_gradient, fz_max, fz_min, mx_gradient, mx_max, mx_min, my_gradient, my_max, my_min, temp;
    mx_min = $("#" + this.name + " .m_x_min").val();
    mx_max = $("#" + this.name + " .m_x_max").val();
    my_min = $("#" + this.name + " .m_y_min").val();
    my_max = $("#" + this.name + " .m_y_max").val();
    fz_min = $("#" + this.name + " .f_z_min").val();
    fz_max = $("#" + this.name + " .f_z_max").val();
    mx_gradient = interpColor(mx_min, mx_max, 0, this.m_x);
    my_gradient = interpColor(my_min, my_max, 0, this.m_y);
    fz_gradient = interpColor(fz_min, fz_max, 0, this.f_z);
    temp = new THREE.Color();
    temp.setRGB(mx_gradient, 1 - mx_gradient, 0);
    this.axis.children[0].setColor(temp.getHex());
    temp.setRGB(my_gradient, 1 - my_gradient, 0);
    this.axis.children[1].setColor(temp.getHex());
    temp.setRGB(fz_gradient, 1 - fz_gradient, 0);
    return this.axis.children[2].setColor(temp.getHex());
  };

  return FT_Sensor;

})();

interpColor = function(min, max, zero, t) {
  if (t > max) {
    t = max;
  }
  if (t < min) {
    t = min;
  }
  if (t < zero) {
    return Math.min((zero - t) / (zero - min), 1);
  } else {
    return Math.min((t - zero) / (max - zero), 1);
  }
};

$(document).ready(function() {
  var c, callback, progress;
  $("#mouse_info_dialog").dialog({
    autoOpen: false,
    closeOnEscape: true,
    buttons: {
      OK: function() {
        return $(this).dialog("close");
      }
    }
  });
  $("#mouse_info_button").on("click", function() {
    return $("#mouse_info_dialog").dialog("open");
  });
  window.stats = new Stats();
  stats.setMode(0);
  $('#hubo_container').append(stats.domElement);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '400px';
  stats.domElement.style.top = '0px';
  c = new WebGLRobots.DefaultCanvas("#hubo_container");
  return window.hubo = new Hubo("hubo2", callback = function() {
    c.add(hubo);
    hubo.autorender = false;
    $("#load").hide();
    if (hubo.ft == null) {
      hubo.ft = {};
    }
    hubo.ft.HUBO_FT_R_HAND = new FT_Sensor("HUBO_FT_R_HAND");
    hubo.ft.HUBO_FT_L_HAND = new FT_Sensor("HUBO_FT_L_HAND");
    hubo.ft.HUBO_FT_R_FOOT = new FT_Sensor("HUBO_FT_R_FOOT");
    hubo.ft.HUBO_FT_L_FOOT = new FT_Sensor("HUBO_FT_L_FOOT");
    hubo.links.Body_RWP.add(hubo.ft.HUBO_FT_R_HAND.axis);
    hubo.links.Body_LWP.add(hubo.ft.HUBO_FT_L_HAND.axis);
    hubo.links.Body_RAR.add(hubo.ft.HUBO_FT_R_FOOT.axis);
    hubo.links.Body_LAR.add(hubo.ft.HUBO_FT_L_FOOT.axis);
    hubo.ft.HUBO_FT_R_HAND.axis.position = new THREE.Vector3(0, 0, -0.1);
    hubo.ft.HUBO_FT_L_HAND.axis.position = new THREE.Vector3(0, 0, -0.1);
    hubo.ft.HUBO_FT_R_FOOT.axis.position = new THREE.Vector3(-0.05, 0, -0.11);
    hubo.ft.HUBO_FT_L_FOOT.axis.position = new THREE.Vector3(-0.05, 0, -0.11);
    serial_stateRef.on('value', function(snapshot) {
      var serial_state, state;
      stats.end();
      stats.begin();
      serial_state = snapshot.val();
      console.log(serial_state);
      state = JSON.parse(serial_state);
      console.log(state);
      flashLED();
      hubo.ft["HUBO_FT_R_HAND"].m_x = state.ft[0];
      hubo.ft["HUBO_FT_R_HAND"].m_y = state.ft[1];
      hubo.ft["HUBO_FT_R_HAND"].f_z = state.ft[2];
      hubo.ft["HUBO_FT_R_HAND"].updateColor();
      hubo.ft["HUBO_FT_L_HAND"].m_x = state.ft[3];
      hubo.ft["HUBO_FT_L_HAND"].m_y = state.ft[4];
      hubo.ft["HUBO_FT_L_HAND"].f_z = state.ft[5];
      hubo.ft["HUBO_FT_L_HAND"].updateColor();
      hubo.ft["HUBO_FT_R_FOOT"].m_x = state.ft[6];
      hubo.ft["HUBO_FT_R_FOOT"].m_y = state.ft[7];
      hubo.ft["HUBO_FT_R_FOOT"].f_z = state.ft[8];
      hubo.ft["HUBO_FT_R_FOOT"].updateColor();
      hubo.ft["HUBO_FT_L_FOOT"].m_x = state.ft[9];
      hubo.ft["HUBO_FT_L_FOOT"].m_y = state.ft[10];
      hubo.ft["HUBO_FT_L_FOOT"].f_z = state.ft[11];
      hubo.ft["HUBO_FT_L_FOOT"].updateColor();
      hubo.motors["WST"].value = state.joint[0];
      hubo.motors["NKY"].value = state.joint[1];
      hubo.motors["NK1"].value = state.joint[2];
      hubo.motors["NK2"].value = state.joint[3];
      hubo.motors["LSP"].value = state.joint[4];
      hubo.motors["LSR"].value = state.joint[5];
      hubo.motors["LSY"].value = state.joint[6];
      hubo.motors["LEP"].value = state.joint[7];
      hubo.motors["LWY"].value = state.joint[8];
      hubo.motors["LWP"].value = state.joint[10];
      hubo.motors["RSP"].value = state.joint[11];
      hubo.motors["RSR"].value = state.joint[12];
      hubo.motors["RSY"].value = state.joint[13];
      hubo.motors["REP"].value = state.joint[14];
      hubo.motors["RWY"].value = state.joint[15];
      hubo.motors["RWP"].value = state.joint[17];
      hubo.motors["LHY"].value = state.joint[19];
      hubo.motors["LHR"].value = state.joint[20];
      hubo.motors["LHP"].value = state.joint[21];
      hubo.motors["LKP"].value = state.joint[22];
      hubo.motors["LAP"].value = state.joint[23];
      hubo.motors["LAR"].value = state.joint[24];
      hubo.motors["RHY"].value = state.joint[26];
      hubo.motors["RHR"].value = state.joint[27];
      hubo.motors["RHP"].value = state.joint[28];
      hubo.motors["RKP"].value = state.joint[29];
      hubo.motors["RAP"].value = state.joint[30];
      hubo.motors["RAR"].value = state.joint[31];
      hubo.motors["RF1"].value = state.joint[32];
      hubo.motors["RF2"].value = state.joint[33];
      hubo.motors["RF3"].value = state.joint[34];
      hubo.motors["RF4"].value = state.joint[35];
      hubo.motors["RF5"].value = state.joint[36];
      hubo.motors["LF1"].value = state.joint[37];
      hubo.motors["LF2"].value = state.joint[38];
      hubo.motors["LF3"].value = state.joint[39];
      hubo.motors["LF4"].value = state.joint[40];
      hubo.motors["LF5"].value = state.joint[41];
      return hubo.canvas.render();
    });
    return c.render();
  }, progress = function(step, total, node) {
    return $("#load").html("Loading " + step + "/" + total);
  });
});