

.1 认识后期处理
后期处理，其实就是原有的页面效果不能满足审美需求，通过一些技术手段以达到预期的效果，实现的过程就是后期处理。
在three.js中实现后期处理，需要经过以下几步

创建效果组合器
效果组合器是各种处理通道的入口，three.js提供了一个 EffectComposer 对象，使用它来创建一个效果组合器，从某种程度上说这个效果组合器是各种通道的容器，创建时需要一个渲染器的实例

添加通道
在后期处理过程中 renderPass 通道 必须要有，这个通道在指定的场景和相机的基础上渲染出一个新的场景，这里需要通过RenderPass对象创建一个通道实例，然后将它添加到效果组合器中；three.js 中提供了很多后期处理的通道，你可以直接来使用它们，只需要创建对应的通道，配置一些参数，将它们添加到效果组合器就可以了，这里特别说一下，three.js还提供了一个 ShaderPass 通道，它支持使用自定义的Shader创建高级的后期处理通道

更新通道
在render循环中，调用效果组合器的render函数，效果组合器会依次使用添加的处理通道来处理场景将最终的结果输出


2.2.1 GlitchPass通道介绍
GlitchPass通道产生模拟电磁风暴效果，它只有一个参数配置

goWild 该属性接收一个布尔值，指定是否持续产生电磁风暴效果


### OctahedronBufferGeometry

八面缓冲几何体（OctahedronGeometry）
发布于 2021-07-10 字数 1198 浏览 1079 评论 0
一个用于创建八面体的类。

// iOS iframe auto-resize workaround
if ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) {
const scene = document.getElementById( ‘scene’ );
scene.style.width = getComputedStyle( scene ).width;
scene.style.height = getComputedStyle( scene ).height;
scene.setAttribute( ‘scrolling’, ‘no’ );
}

构造器
OctahedronGeometry(radius : Float, detail : Integer)
radius — 八面体的半径，默认值为1。
detail — 默认值为0，将这个值设为一个大于0的数将会为它增加一些顶点，使其不再是一个八面体。

属性
共有属性请参见其基类PolyhedronGeometry。

.parameters : Object
一个包含着构造函数中每个参数的对象。在对象实例化之后，对该属性的任何修改都不会改变这个几何体。

方法(Methods)
共有方法请参见其基类PolyhedronGeometry。

### TorusBufferGeometry

### ConeBufferGeometry
