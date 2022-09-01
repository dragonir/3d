# 掘金1000粉！使用Three.js实现一个创意纪念页面 🏆



https://observablehq.com/@makio135/matcaps?ui=classic

https://github.com/nidorx/matcaps

http://jeanmoreno.com/unity/matcap/

MeshMatcapMaterial

```js
MeshMatcapMaterial 由一个材质捕捉（MatCap，或光照球（Lit Sphere））纹理所定义，其编码了材质的颜色与明暗。

由于mapcap图像文件编码了烘焙过的光照，因此MeshMatcapMaterial 不对灯光作出反应。
它将会投射阴影到一个接受阴影的物体上(and shadow clipping works)，但不会产生自身阴影或是接受阴影。

// iOS iframe auto-resize workaround
if ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) {
const scene = document.getElementById( 'scene' );
scene.style.width = getComputedStyle( scene ).width;
scene.style.height = getComputedStyle( scene ).height;
scene.setAttribute( 'scrolling', 'no' );
}

构造函数(Constructor)
MeshMatcapMaterial( parameters : Object )
parameters - (可选)用于定义材质外观的对象，具有一个或多个属性。
材质的任何属性都可以从此处传入(包括从Material继承的任何属性)。

属性color例外，其可以作为十六进制字符串传递，默认情况下为 0xffffff（白色），内部调用Color.set(color)。

属性(Properties)
共有属性请参见其基类Material。

.alphaMap : Texture
alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。
默认值为null。

仅使用纹理的颜色，忽略alpha通道（如果存在）。
对于RGB和RGBA纹理，WebGL渲染器在采样此纹理时将使用绿色通道，
因为在DXT压缩和未压缩RGB 565格式中为绿色提供了额外的精度。
Luminance-only以及luminance/alpha纹理也仍然有效。

.bumpMap : Texture
用于创建凹凸贴图的纹理。黑色和白色值映射到与光照相关的感知深度。凹凸实际上不会影响对象的几何形状，只影响光照。如果定义了法线贴图，则将忽略该贴图。

.bumpScale : Float
凹凸贴图会对材质产生多大影响。典型范围是0-1。默认值为1。

.color : Color
材质的颜色(Color)，默认值为白色 (0xffffff)。

.displacementMap : Texture
位移贴图会影响网格顶点的位置，与仅影响材质的光照和阴影的其他贴图不同，移位的顶点可以投射阴影，阻挡其他对象，
以及充当真实的几何体。位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位。

.displacementScale : Float
位移贴图对网格的影响程度（黑色是无位移，白色是最大位移）。如果没有设置位移贴图，则不会应用此值。默认值为1。

.displacementBias : Float
位移贴图在网格顶点上的偏移量。如果没有设置位移贴图，则不会应用此值。默认值为0。

.flatShading : Boolean
定义材质是否使用平面着色进行渲染。默认值为false。

.map : Texture
颜色贴图。默认为null。纹理贴图颜色由漫反射颜色.color调节。

.matcap : Texture
matcap贴图，默认为null。

.morphNormals : Boolean
定义是否使用morphNormals。设置为true可将morphNormal属性从geometry传递到shader。默认值为false。

.morphTargets : Boolean
定义材质是否使用morphTargets。默认值为false。

.normalMap : Texture
用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照。
In case the material has a normal map authored using the left handed convention, the y component of normalScale
should be negated to compensate for the different handedness.

.normalMapType : Integer
法线贴图的类型。

选项为THREE.TangentSpaceNormalMap（默认）和THREE.ObjectSpaceNormalMap。

.normalScale : Vector2
法线贴图对材质的影响程度。典型范围是0-1。默认值是Vector2设置为（1,1）。
```
