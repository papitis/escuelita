window.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('renderCanvas');
  var engine = new BABYLON.Engine(canvas, true);
  var createScene = function() {
    delete engine;
    engine = new BABYLON.Engine(canvas, true, {
        deterministicLockstep: true,
        lockstepMaxSteps: 4
    });

    // This creates a basic Babylon Scene object (non-mesh)

    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
        scene.enablePhysics(gravityVector, physicsPlugin);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FollowCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    var borderLeft, borderRight, borderBottom, borderTop
    borderRight = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 0.1, depth: 10, faceColors: [0,0,0,0]}, scene)
    borderRight.position.y = 0.1
    borderRight.position.x = 4.9
    borderRight.position.z = 0
    borderRight.physicsImpostor = new BABYLON.PhysicsImpostor(borderRight, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 100, restitution: 0.9 }, scene);
    

    borderLeft = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 0.1, depth: 10, faceColors: [0,0,0,0]}, scene)
    borderLeft.position.y = 0.1
    borderLeft.position.x = -4.9
    borderLeft.position.z = 0
    borderLeft.physicsImpostor = new BABYLON.PhysicsImpostor(borderLeft, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 100, restitution: 0.9 }, scene);



    borderTop = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 9.5, depth: 0.1, faceColors: [0,0,0,0]}, scene)
    borderTop.position.y = 0.1
    borderTop.position.x = 0
    borderTop.position.z = 4.9
    borderTop.physicsImpostor = new BABYLON.PhysicsImpostor(borderTop, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 100, restitution: 0.9 }, scene);

    borderBottom = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 9.5, depth: 0.1, faceColors: [0,0,0,0]}, scene)
    borderBottom.position.y = 0.1
    borderBottom.position.x = 0
    borderBottom.position.z = -4.9
    borderBottom.physicsImpostor = new BABYLON.PhysicsImpostor(borderBottom, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 100, restitution: 0.9 }, scene);




    var boxLeft = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 0.1, depth: 3, faceColors: [0,0,0,0]}, scene);
    boxLeft.position.y = 0.1
    boxLeft.position.x = 3
    boxLeft.position.z = 1
    boxLeft.physicsImpostor = new BABYLON.PhysicsImpostor(boxLeft, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1000, restitution: 0.9 }, scene);
      //boxLeft.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(3, 0, 1));
    boxLeft.physicsImpostor.applyImpulse(new BABYLON.Vector3(100, 100, 100), boxLeft.getAbsolutePosition());

    var boxRight = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 0.1, depth: 3, faceColors: [0,0,0,0]}, scene);
    boxRight.position.y = 0.1
    boxRight.position.x = -3
    boxRight.position.z = 1
    boxRight.physicsImpostor = new BABYLON.PhysicsImpostor(boxRight, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1000, restitution: 0.9 }, scene)
      //boxRight.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(3, 0, 1))
    boxRight.physicsImpostor.applyImpulse(new BABYLON.Vector3(100, 100, 100), boxRight.getAbsolutePosition());

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 0.2, scene);
    sphere.position.y = 0.1;
    sphere.position.x = 0;
    sphere.position.z = 0;

    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 8, restitution: 0.9 }, scene);
    sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(4, 0, 0));
    sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(10, 10, 0), sphere.getAbsolutePosition());
    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    //var ground = BABYLON.Mesh.CreateGround("ground1",{height:10, width:10, subdivisions: 1, faceColors: [230,230,230,1]}, scene);
    var ground = BABYLON.MeshBuilder.CreateGround('ground1', {height:10, width:10, subdivisions: 1, faceColors: [230,230,230,1]}, scene)

    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);




    scene.onAfterStepObservable.add(function(theScene){
      //console.log("Performing game logic, AFTER animations and physics for stepId: "+theScene.getStepId());
      if(sphere.physicsImpostor.getLinearVelocity().length() < BABYLON.PhysicsEngine.Epsilon) {          
          console.log("sphere is at rest on stepId: "+theScene.getStepId());
          theScene.onAfterStepObservable.clear();
          theScene.onBeforeStepObservable.clear();
      }
    });

    scene.registerAfterRender(function () {
        document.addEventListener("keydown", function(event) {
            if (event.keyCode == 38) {
                  boxLeft.translate(BABYLON.Axis.Z, 0.001, BABYLON.Space.LOCAL);
            }
            if (event.keyCode == 40) {
                  boxLeft.translate(BABYLON.Axis.Z, -0.001, BABYLON.Space.LOCAL);
            }

            if (event.keyCode == 87) {
                  boxRight.translate(BABYLON.Axis.Z, 0.001, BABYLON.Space.LOCAL);
            }
            if (event.keyCode == 83) {
                  boxRight.translate(BABYLON.Axis.Z, -0.001, BABYLON.Space.LOCAL);
            }
            });
    })

    return scene;
  }
  var scene = createScene();
  engine.runRenderLoop(function() {
    //for(var i= 0; i<20; i++){
      scene.render();
    //}
  });
  window.addEventListener('resize', function() {
      engine.resize();
  });
});
