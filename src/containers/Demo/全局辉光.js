// https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_unreal_bloom.html

renderer.toneMapping = THREE.ReinhardToneMapping;

const params = {
  exposure: 1,
  bloomStrength: .5,
  bloomThreshold: .1,
  bloomRadius: .1
};
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;
composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  composer && composer.render();
  stats && stats.update();
  TWEEN && TWEEN.update();
}