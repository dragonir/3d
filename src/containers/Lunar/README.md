# Three.js 实现虎年春节3D创意页面

THREE.OrbitControls参数控制

传送门
iBlender中文版插件 老外教你用汉字中文字体 Font 3D Chinese And Japanese Characters Blender 插件 教程
https://www.bilibili.com/video/BV1Sv411871T?from=search&seid=3205263975436057796&spm_id_from=333.337.0.0

```js
//鼠标控制是否可用
controls.enabled = true;
//聚焦坐标
controls.target = new THREE.Vector3();
//最大最小相机移动距离(PerspectiveCamera 景深相机)
controls.minDistance = 0;
controls.maxDistance = Infinity;
//最大最小鼠标缩放大小（OrthographicCamera正交相机）
controls.minZoom = 0;
controls.maxZoom = Infinity;
//最大仰视角和俯视角，范围是 `0` 到 `Math.PI`
controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI; // radians
// How far you can orbit horizontally, upper and lower limits.
// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
//水平方向视角限制
controls.minAzimuthAngle = - Infinity; // radians
controls.maxAzimuthAngle = Infinity; // radians
// Set to true to enable damping (inertia)
// If damping is enabled, you must call controls.update() in your animation loop
//惯性滑动，滑动大小默认0.25
controls.enableDamping = false;
controls.dampingFactor = 0.25;
// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
// Set to false to disable zooming
//滚轮是否可控制zoom，zoom速度默认1
controls.enableZoom = true;
controls.zoomSpeed = 1.0;
// Set to false to disable rotating
//是否可旋转，旋转速度
controls.enableRotate = true;
controls.rotateSpeed = 1.0;
// Set to false to disable panning
//是否可平移，默认移动速度为7px
controls.enablePan = true;
controls.keyPanSpeed = 7.0;// pixels moved per arrow key push
// Set to true to automatically rotate around the target
// If auto-rotate is enabled, you must call controls.update() in your animation loop
//是否自动旋转，自动旋转速度。默认每秒30圈
controls.autoRotate = false;
controls.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60
// Set to false to disable use of the keys
//是否能使用键盘
controls.enableKeys = true;
// The four arrow keys
//默认键盘控制上下左右的键
controls.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
//鼠标点击按钮
controls.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
```

在线预览
https://dragonir.github.io/3d/#/lunar

[1]. [使用Three.js实现炫酷的酸性风格3D页面](https://juejin.cn/post/7012996721693163528)
[2]. [Three.js 实现脸书元宇宙3D动态Logo](https://juejin.cn/post/7031893833163997220)
[3]. [Three.js 实现3D全景侦探小游戏](https://juejin.cn/post/7042298964468564005)


### 阴影材质(ShadowMaterial)

此材质可以接收阴影，但在其他方面完全透明。

例子(Example)
var planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
planeGeometry.rotateX( - Math.PI / 2 );

var planeMaterial = new THREE.ShadowMaterial();
planeMaterial.opacity = 0.2;

var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.position.y = -200;
plane.receiveShadow = true;
scene.add( plane );
构造函数(Constructor)
ShadowMaterial( parameters : Object )
parameters - (可选)用于定义材质外观的对象，具有一个或多个属性。 材质的任何属性都可以从此处传入(包括从Material 和 ShaderMaterial继承的任何属性)。

属性(Properties)
共有属性请参见其基类Material和ShaderMaterial。

.isShadowMaterial : Boolean
用于检查此类或派生类是否为阴影材质。默认值为 true。

因为其通常用在内部优化，所以不应该更改该属性值。

.transparent : Boolean
定义此材质是否透明。默认值为 true。

方法(Methods)
共有方法请参见其基类Material和ShaderMaterial。



### Phong网格材质(MeshPhongMaterial)

一种用于具有镜面高光的光泽表面的材质。

该材质使用非物理的Blinn-Phong模型来计算反射率。 与MeshLambertMaterial中使用的Lambertian模型不同，该材质可以模拟具有镜面高光的光泽表面（例如涂漆木材）。

使用Phong着色模型计算着色时，会计算每个像素的阴影（在fragment shader， AKA pixel shader中），与MeshLambertMaterial使用的Gouraud模型相比，该模型的结果更准确，但代价是牺牲一些性能。 MeshStandardMaterial和MeshPhysicalMaterial也使用这个着色模型。

在MeshStandardMaterial或MeshPhysicalMaterial上使用此材质时，性能通常会更高 ，但会牺牲一些图形精度。

构造函数(Constructor)
MeshPhongMaterial( parameters : Object )
parameters - (可选)用于定义材质外观的对象，具有一个或多个属性。 材质的任何属性都可以从此处传入(包括从Material继承的任何属性)。

属性color例外，其可以作为十六进制字符串传递，默认情况下为 0xffffff（白色），内部调用Color.set(color)。

属性(Properties)
共有属性请参见其基类Material。

.alphaMap : Texture
alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。 默认值为null。

仅使用纹理的颜色，忽略alpha通道（如果存在）。 对于RGB和RGBA纹理，WebGL渲染器在采样此纹理时将使用绿色通道， 因为在DXT压缩和未压缩RGB 565格式中为绿色提供了额外的精度。 Luminance-only以及luminance/alpha纹理也仍然有效。

.aoMap : Texture
该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UVs，因此将忽略repeat和offset属性。

.aoMapIntensity : Float
环境遮挡效果的强度。默认值为1。零是不遮挡效果。

.bumpMap : Texture
用于创建凹凸贴图的纹理。黑色和白色值映射到与光照相关的感知深度。凹凸实际上不会影响对象的几何形状，只影响光照。如果定义了法线贴图，则将忽略该贴图。

.bumpScale : Float
凹凸贴图会对材质产生多大影响。典型范围是0-1。默认值为1。

.color : Color
材质的颜色(Color)，默认值为白色 (0xffffff)。

.combine : Integer
如何将表面颜色的结果与环境贴图（如果有）结合起来。

选项为THREE.Multiply（默认值），THREE.MixOperation， THREE.AddOperation。如果选择多个，则使用.reflectivity在两种颜色之间进行混合。

.displacementMap : Texture
位移贴图会影响网格顶点的位置，与仅影响材质的光照和阴影的其他贴图不同，移位的顶点可以投射阴影，阻挡其他对象， 以及充当真实的几何体。位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位。

.displacementScale : Float
位移贴图对网格的影响程度（黑色是无位移，白色是最大位移）。如果没有设置位移贴图，则不会应用此值。默认值为1。

.displacementBias : Float
位移贴图在网格顶点上的偏移量。如果没有设置位移贴图，则不会应用此值。默认值为0。

.emissive : Color
材质的放射（光）颜色，基本上是不受其他光照影响的固有颜色。默认为黑色。

.emissiveMap : Texture
设置放射（发光）贴图。默认值为null。放射贴图颜色由放射颜色和强度所调节。 如果你有一个放射贴图，请务必将放射颜色设置为黑色以外的其他颜色。

.emissiveIntensity : Float
放射光强度。调节发光颜色。默认为1。

.envMap : TextureCube
环境贴图。默认值为null。

.isMeshPhongMaterial : Boolean
用于检查此类或派生类是否为Phong网格材质。默认值为 true。

因为其通常用在内部优化，所以不应该更改该属性值。

.lightMap : Texture
光照贴图。默认值为null。lightMap需要第二组UVs，因此将忽略repeat和offset纹理属性。

.lightMapIntensity : Float
烘焙光的强度。默认值为1。

.map : Texture
颜色贴图。默认为null。纹理贴图颜色由漫反射颜色.color调节。

.morphNormals : boolean
定义是否使用morphNormals。设置为true可将morphNormal属性从Geometry传递到shader。默认值为false。

.morphTargets : Boolean
定义材质是否使用morphTargets。默认值为false。

.normalMap : Texture
用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照。

.normalMapType : Integer
法线贴图的类型。

选项为THREE.TangentSpaceNormalMap（默认）和THREE.ObjectSpaceNormalMap。

.normalScale : Vector2
法线贴图对材质的影响程度。典型范围是0-1。默认值是Vector2设置为（1,1）。

.reflectivity : Float
环境贴图对表面的影响程度; 见.combine。默认值为1，有效范围介于0（无反射）和1（完全反射）之间。

.refractionRatio : Float
空气的折射率（IOR）（约为1）除以材质的折射率。它与环境映射模式THREE.CubeRefractionMapping 和THREE.EquirectangularRefractionMapping一起使用。 折射率不应超过1。默认值为0.98。

.shininess : Float
.specular高亮的程度，越高的值越闪亮。默认值为 30。

.skinning : Boolean
材质是否使用蒙皮。默认值为false。

.specular : Color
材质的高光颜色。默认值为0x111111（深灰色）的颜色Color。

这定义了材质的光泽度和光泽的颜色。

.specularMap : Texture
镜面反射贴图值会影响镜面高光以及环境贴图对表面的影响程度。默认值为null。

.wireframe : Boolean
将几何体渲染为线框。默认值为false（即渲染为平面多边形）。

.wireframeLinecap : String
定义线两端的外观。可选值为 'butt'，'round' 和 'square'。默认为'round'。

该属性对应2D Canvas lineJoin属性， 并且会被WebGL渲染器忽略。

.wireframeLinejoin : String
定义线连接节点的样式。可选值为 'round', 'bevel' 和 'miter'。默认值为 'round'。

该属性对应2D Canvas lineJoin属性， 并且会被WebGL渲染器忽略。

.wireframeLinewidth : Float
控制线框宽度。默认值为1。

由于OpenGL Core Profile与 大多数平台上WebGL渲染器的限制，无论如何设置该值，线宽始终为1。

方法(Methods)
共有方法请参见其基类Material。



### LoadingManager

其功能时处理并跟踪已加载和待处理的数据。如果未手动设置加强管理器，则会为加载器创建和使用默认全局实例加载器管理器 - 请参阅 DefaultLoadingManager.

一般来说，默认的加载管理器已足够使用了，但有时候也需要设置单独的加载器 - 例如，如果你想为对象和纹理显示单独的加载条。

下面的例子将介绍，如何使用加载管理器来跟踪 OBJLoader 的加载进度流程。

var manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onLoad = function ( ) {

    console.log( 'Loading complete!');

};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

    console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onError = function ( url ) {

    console.log( 'There was an error loading ' + url );

};

var loader = new THREE.OBJLoader( manager );
loader.load( 'file.obj', function ( object ) {

    //

} );
除了观察进度流程之外，还可以使用LoadingManager在加载期间覆写资源URL。当某资源来自拖拽事件、 WebSockets、WebRTC或其他API时，此方法可以有所帮助。下面显示了如何使用Blob URL加载内存模型的示例。

// 将文件拖入网页时创建的Blob或File对象。
var blobs = {'fish.gltf': blob1, 'diffuse.png': blob2, 'normal.png': blob3};

var manager = new THREE.LoadingManager();

// 使用URL回调初始化加载管理器。
var objectURLs = [];
manager.setURLModifier( ( url ) => {

    url = URL.createObjectURL( blobs[ url ] );

    objectURLs.push( url );

    return url;

} );

// 像通常一样加载，然后撤消blob URL
var loader = new THREE.GLTFLoader( manager );
loader.load( 'fish.gltf', (gltf) => {

    scene.add( gltf.scene );

    objectURLs.forEach( ( url ) => URL.revokeObjectURL( url ) );

});
构造方法
LoadingManager( onLoad : Function, onProgress : Function, onError : Function )
onLoad	(可选) 所有加载器加载完成后，将调用此函数。
onProgress	(可选) 当每个项目完成后，将调用此函数。
onError	(可选) 当一个加载器遇到错误时，将调用此函数。
创建一个新的 LoadingManager.

属性
.onStart : Function
此换上咋加载开始时，被调用. 有如下参数:

url	被加载的项的url。
itemsLoaded	目前已加载项的个数。
itemsTotal	总共所需要加载项的个数。
此方法默认时未定义。

.onLoad : Function
所有的项加载完成后将调用此函数。默认情况下，此方法时未定义的，除非在构造函数中进行传递。

.onProgress : Function
此方法加载每一个项，加载完成时进行调用。 有如下参数:

url	被加载的项的url。
itemsLoaded	目前已加载项的个数。
itemsTotal	总共所需要加载项的个数。
默认情况下，此方法时未定义的，除非在构造函数中进行传递。

.onError : Function
此方法将在任意项加载错误时，进行调用。 有如下参数:

url — 所加载出错误的项的url

默认情况下，此方法时未定义的，除非在构造函数中进行传递。


本文介绍一个补间动画库tweenjs的基本用法，配合threejs可以实现很多动画效果。

### tweenjs

动画效果就是使一个对象在一定时间内从一个状态到另外一个状态

// position = {x: 1}
var tween = new TWEEN.Tween(position)
.delay(100) // 等待100ms
.to({x: 200}, 1000) // 1s时间，x到200
.onUpdate(render) // 变更期间执行render方法
.onComplete(() => {
    // 动画完成
})
.onStop(() => {
    // 动画停止
})
.start(); // 开启动画
基本的使用就如上面的例子，此外还有其他的API，如stop、pause等，可以直接看TWEENJS源码。

要让动画真正动起来，我们一般在requestAnimationFrame中调用update方法：

TWEEN.update()
缓动类型
tweenjs最强大的地方在于提供了很多常用的缓动动画类型，由api easing()指定，tweenjs本质就是一系列缓动函数算法，因此可以结合canvas、threejs很简单就能实现很多效果。

链式调用
tweenjs支持链式调用，如在动画A结束后要执行动画B，我们可以：

tween1.chain(tween2)
利用链式调用我们可以创建往复来回循环的动画：

var tween1 = new TWEEN.Tween(position).to({x: 200}, 1000);
var tween2 = new TWEEN.Tween(position).to({x: 0}, 1000);

tween1.chain(tween2);
tween2.chain(tween1);

tween1.start();