一、如果我们在场景图上标识一些文字，有2种常用的方法
1、采用threeJs的精灵（Sprite），具体用法查看我另一篇博客https://my.oschina.net/u/2612473/blog/3038066
 2、使用CSS2DRenderer

二、2种方法主要特征
精灵：文字是在canvas中画的，精灵的材质就是加载的带有文字的canvas。
 CSS2DRenderer：渲染器是生成一个DIV容器，它的作用是能把HTML元素绑定到三维物体上,在DIV容器中各自的DOM元素分别封装到CSS2DObject的实例中，并在scene中增加。

相对于精灵CSS2DRenderer有更好的灵活性，可以更好的通过css控制样式，并且也更方便的进行页面的跳转（通过a元素）

三、CSS2DRenderer方法：
（1）getSize()：返回包含宽度和长度的对象

（2）render ( scene : Scene, camera : Camera ) : null    // 用相机渲染场景

（3）setSize (width : Number, height : Number) : null   //设置渲染器的宽度和高度