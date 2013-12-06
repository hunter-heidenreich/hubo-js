// Generated by CoffeeScript 1.6.3
var c, callback, footMatrix, hubo, makeSlider, progress, sign;

footMatrix = null;

$('#controls').tabs();

c = new WebGLRobots.DefaultCanvas("#hubo_container");

hubo = new Hubo('hubo2', callback = function() {
  c.add(hubo);
  $('#load').hide();
  $(".joint").each(function() {
    var id;
    id = $(this).attr("data-name");
    makeSlider(id);
    return $("[data-name=" + id + "] .joint_txt").html(hubo.motors[id].value.toFixed(2));
  });
  return $('#footanchor').on('change', function(event) {
    console.log(event);
    if (this.checked) {
      footMatrix = new THREE.Matrix4;
      return footMatrix.copy(hubo.links.Body_LAR.matrixWorld);
    } else {
      return footMatrix = null;
    }
  });
}, progress = function(step, total, node) {
  return $('#load').html("Loading " + step + "/" + total);
});

makeSlider = function(id) {
  var s;
  s = $("[data-name=" + id + "] .joint_slider");
  s.slider({
    min: parseFloat(hubo.motors[id].lower_limit),
    max: parseFloat(hubo.motors[id].upper_limit),
    step: 0.01,
    value: hubo.motors[id].value
  });
  s.on("slide", function(event, ui) {
    return $("[data-name=" + id + "] .joint_txt").html(ui.value.toFixed(2));
  });
  return s.on("slide", function(event, ui) {
    var a, b;
    hubo.motors[id].value = ui.value;
    if (footMatrix != null) {
      console.log("Fix foot");
      a = new THREE.Matrix4;
      a.getInverse(hubo.links.Body_LAR.matrixWorld);
      b = new THREE.Matrix4;
      b.multiplyMatrices(a, footMatrix);
      return hubo.links.Body_Torso.applyMatrix(b);
    }
  });
};

sign = function(x) {
  if (x) {
    if (x < 0) {
      return -1;
    } else {
      return 1;
    }
  } else {
    return 0;
  }
};