"use strict";(self.webpackChunk_3d_examples=self.webpackChunk_3d_examples||[]).push([[212],{708:function(e,a,n){var t=n(6892),i={animateCamera:function(e,a,n,i){var o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:2e3,s=arguments.length>5?arguments[5]:void 0,r=new t.w.Tween({x1:e.position.x,y1:e.position.y,z1:e.position.z,x2:a.target.x,y2:a.target.y,z2:a.target.z});r.to({x1:n.x,y1:n.y,z1:n.z,x2:i.x,y2:i.y,z2:i.z},o),r.onUpdate((function(n){e.position.x=n.x1,e.position.y=n.y1,e.position.z=n.z1,a.target.x=n.x2,a.target.y=n.y2,a.target.z=n.z2,a.update()})),r.onComplete((function(){a.enabled=!0,s()})),r.easing(t.w.Easing.Cubic.InOut),r.start()}};a.Z=i},4212:function(e,a,n){n.r(a),n.d(a,{default:function(){return P}});var t=n(4165),i=n(5861),o=n(5671),s=n(3144),r=n(7326),l=n(136),c=n(4062),d=n(7313),u=n(3562),h=n(2518),m=(n(7943),n(708),function e(a,n){if(a&&n&&n.length)if("string"!=typeof a){var t=a.getContext("2d");a.width=a.clientWidth,a.height=a.clientHeight;var i={},o=28,s=function(e,n){this.x=(1+.1*n/Math.random())*a.width,this.y=e.range[0]*a.height+(e.range[1]-e.range[0])*a.height*Math.random()+36,this.y<o?this.y=o:this.y>a.height-o&&(this.y=a.height-o),this.moveX=1+3*Math.random(),this.opacity=.8+.2*Math.random(),this.params=e,this.draw=function(){var e=this.params;t.strokeStyle=e.color,t.font='bold 28px "microsoft yahei", sans-serif',t.fillStyle="rgba(255,255,255,"+this.opacity+")",t.fillText(e.value,this.x,this.y),t.strokeText(e.value,this.x,this.y)}};n.forEach((function(e,a){i[a]=new s(e,a)}));!function e(){t.clearRect(0,0,a.width,a.height),function(){for(var e in i){var n=i[e];n.x-=n.moveX,n.x<-1*a.width*1.5&&(n.x=(1+.1*e/Math.random())*a.width,n.y=(n.params.range[0]+(n.params.range[1]-n.params.range[0])*Math.random())*a.height,n.y<o?n.y=o:n.y>a.height-o&&(n.y=a.height-o),n.moveX=1+3*Math.random()),i[e].draw()}}(),requestAnimationFrame(e)}()}else e(a=document.querySelector(a),n)}),g=[{value:"\u4f7f\u7528\u7684\u662f\u9759\u6001\u6b7b\u6570\u636e",color:"blue",range:[0,.5]},{value:"\u5b89\u53ef\uff01\u5b89\u53ef\uff01\u5b89\u53ef\uff01\u5b89\u53ef\uff01\u5b89\u53ef\uff01",color:"blue",range:[0,.6]},{value:"\u53ef\u4ee5\u63a7\u5236\u533a\u57df\u548c\u5782\u76f4\u5206\u5e03\u8303\u56f4",color:"blue",range:[0,.5]},{value:"\u5b57\u4f53\u5927\u5c0f\u548c\u901f\u5ea6\u5728\u65b9\u6cd5\u5185\u8bbe\u7f6e",color:"black",range:[.1,1]},{value:"\u9002\u5408\u7528\u5728\u4e00\u4e9b\u9759\u6001\u9875\u9762\u4e0a",color:"black",range:[.2,1]},{value:"\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764\u2764",color:"red",range:[.2,.9]},{value:"\u5361\u54c7\u4f0a \u2764 \u5361\u54c7\u4f0a \u2764 \u5361\u54c7\u4f0a \u2764 \u5361\u54c7\u4f0a \u2764 \u5361\u54c7\u4f0a \u2764 \u5361\u54c7\u4f0a \u2764 \u5361\u54c7\u4f0a \u2764 \u5361\u54c7\u4f0a \u2764",color:"black",range:[.2,1]},{value:"\u53ef\u4ee5\u8bbe\u7f6e\u8fb9\u6846\u989c\u8272",color:"black",range:[.2,1]},{value:"\u8fd9\u4e5f\u592a\u597d\u770b\u4e86\u5427\uff0c\u7edd\u7edd\u5b50\uff01",color:"black",range:[.2,.9]},{value:"HongKong HongKong HongKong HongKong HongKong",color:"black",range:[.2,1]},{value:"\u521d\u97f3\u672a\u6765\uff0cmiku miku miku miku miku miku miku",color:"black",range:[.6,.7]},{value:"\u521d\u97f3\u672a\u6765\uff0c\u8001\u5a46\uff01\u521d\u97f3\u672a\u6765\uff0c\u8001\u5a46\uff01\u521d\u97f3\u672a\u6765\uff0c\u8001\u5a46\uff01\u521d\u97f3\u672a\u6765\uff0c\u8001\u5a46\uff01",color:"red",range:[.2,1]},{value:"\u53ef\u4ee5\u56de\u5230\u539f\u6587",color:"black",range:[0,.9]},{value:"\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1\u26a1",color:"yellow",range:[.7,1]},{value:"\u4e0b\u9762\u5c31\u662f\u5360\u4f4d\u5f39\u5e55\u4e86",color:"black",range:[.7,.95]},{value:"\u524d\u65b9\u9ad8\u80fd\u9884\u8b66\uff01\uff01\uff01",color:"orange",range:[.5,.8]},{value:"\u524d\u65b9\u9ad8\u80fd\u9884\u8b66\uff01\uff01\uff01",color:"green",range:[.5,.9]},{value:"\u524d\u65b9\u9ad8\u80fd\u9884\u8b66\uff01\uff01\uff01",color:"orange",range:[0,1]},{value:"\u524d\u65b9\u9ad8\u80fd\u9884\u8b66\uff01\uff01\uff01",color:"yellow",range:[0,1]}],p=n(6892),v=n(40),f=n(9794),w=n(1620),x=n(6942),y=n(9099),b=n(4309),k=n(6417),P=function(e){(0,l.Z)(d,e);var a=(0,c.Z)(d);function d(e){var n;return(0,o.Z)(this,d),(n=a.call(this,e)).state={loadingProcess:0,inputValue:""},n.initThree=function(){var e,a,o,s,l=(0,r.Z)(n),c=[];!function(){(o=new u.CP7({antialias:!0,alpha:!0})).setPixelRatio(window.devicePixelRatio),o.setSize(600,600),o.setClearAlpha(0),o.shadowMap.enabled=!0,l.renderer=o,document.getElementById("miku").appendChild(o.domElement),(a=new u.xsS).fog=new u.ybr(15658734,0,100),l.scene=a,(e=new u.cPb(60,1,.1,1e3)).position.set(4,0,20),e.lookAt(new u.Pa4(0,0,0)),l.camera=e;var n=new u.DvJ(.001,.001,.001),r=new u.YBo({color:16777215}),d=new u.Kj0(n,r);(s=new u.Ox3(11907521,1)).intensity=1.4,s.position.set(20,20,20),s.castShadow=!0,s.target=d,s.shadow.mapSize.width=6144,s.shadow.mapSize.height=6144,s.shadow.camera.top=130,s.shadow.camera.bottom=-80,s.shadow.camera.left=-70,s.shadow.camera.right=80,a.add(s);var m=new u.Mig(16777215);a.add(m);var g=new u.lLk;g.onStart=function(e,a,n){},g.onLoad=function(){},g.onProgress=function(){var e=(0,i.Z)((0,t.Z)().mark((function e(a,n,i){return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:100===Math.floor(n/i*100)?(l.loadingProcessTimeout&&clearTimeout(l.loadingProcessTimeout),l.loadingProcessTimeout=setTimeout((function(){l.setState({loadingProcess:Math.floor(n/i*100)})}),800)):l.setState({loadingProcess:Math.floor(n/i*100)});case 1:case"end":return e.stop()}}),e)})));return function(a,n,t){return e.apply(this,arguments)}}(),new v.E(g).load(f,(function(e){e.scene.traverse((function(e){e.isMesh&&(c.push(e),"mesh_0"===e.name&&(e.material.metalness=0,e.material.roughness=.3),"mesh_1"===e.name&&(e.material.metalness=.6,e.material.roughness=.4,e.material.emissiveIntensity=1.6))})),e.scene.position.set(2,-11,0),e.scene.scale.set(10,10,10),a.add(e.scene),l.miku=e,l.playAnimation(5)}));var p=new h.z(e,o.domElement);p.target.set(0,0,0),p.enablePan=!1,p.enableZoom=!1,l.controls=p,l.animate()}();var d=new u.iMs,m=new u.FM8;o.domElement.style.touchAction="none",o.domElement.addEventListener("click",(function(a){m.x=a.clientX/window.innerWidth*2-1,m.y=-a.clientY/window.innerHeight*2+1,d.setFromCamera(m,e);d.intersectObjects(c);l.playAnimation(Math.floor(6*Math.random())+0)}),!1),n.loadLogo(),n.loadHeart()},n.loadLogo=function(){var e=null,a=new u.CP7({antialias:!0,alpha:!0});a.setPixelRatio(window.devicePixelRatio),a.setSize(250,250),a.setClearAlpha(0),document.getElementById("logo").appendChild(a.domElement);var n=new u.xsS,t=new u.cPb(60,1,.1,1e3);t.position.set(0,0,10),t.lookAt(new u.Pa4(0,0,0)),(new v.E).load(x,(function(a){a.scene.traverse((function(e){e.isMesh&&(e.material.metalness=.2,e.material.roughness=.4,e.material.color=new u.Ilk(41471))})),a.scene.position.set(-1,2,0),a.scene.scale.set(.012,.012,.012),e=a.scene,n.add(a.scene)}));var i=new u.Mig(16777215);i.intensity=1.2,n.add(i);!function i(){requestAnimationFrame(i),a.render(n,t),e&&(e.rotation.y+=.008)}()},n.loadHeart=function(){var e=null,a=new u.CP7({antialias:!0,alpha:!0});a.setPixelRatio(window.devicePixelRatio),a.setSize(250,250),a.setClearAlpha(0),document.getElementById("heart").appendChild(a.domElement);var n=new u.xsS,t=new u.cPb(60,1,.1,1e3);t.position.set(0,0,10),t.lookAt(new u.Pa4(0,0,0)),(new v.E).load(w,(function(a){a.scene.traverse((function(e){"mesh_0"===e.name&&(e.material.metalness=.6,e.material.roughness=.4,e.material.color=new u.Ilk(16662343),e.material.emissiveIntensity=1.6)})),a.scene.position.set(-2,-4,0),a.scene.scale.set(.05,.05,.05),n.add(a.scene),e=a.scene}));var i=new u.Mig(16777215);n.add(i);!function i(){requestAnimationFrame(i),a.render(n,t),e&&(e.rotation.y+=.04)}()},n.animate=function(){requestAnimationFrame(n.animate),n.renderer.render(n.scene,n.camera),n.stats&&n.stats.update(),p.w&&p.w.update(),n.mixer&&n.mixer.update(n.clock.getDelta()),n.controls&&n.controls.update(),n.heart&&(n.heart.rotation.y+=.05)},n.playAnimation=function(e){var a=n.miku.animations[e];n.mixer=new u.Xcj(n.miku.scene);var t=a;t=n.mixer.clipAction(t).play().getClip()},n.handleInputChange=function(e){n.setState({inputValue:e.target.value})},n.handleInputKeypress=function(e){console.log(e),13!==e.charCode&&13!==e.keyCode||n.handleSend()},n.handleSend=function(){var e=n.state.inputValue;n.barrageList.push({value:"\u968f\u673a\u5faa\u73af\u64ad\u653e",color:"red",range:[.2,1]});["\u6162\u76f4\u64ad","\u865a\u62df\u4e3b\u64ad","\u521d\u97f3\u672a\u6765","\u5b89\u53ef","\u5143\u5b87\u5b99","\u5361\u54c7\u4f0a"].map((function(a,t){e.includes(a)&&n.playAnimation(t)})),n.setState({inputValue:""})},n.scene=null,n.renderer=null,n.camera=null,n.stats=null,n.mixer=null,n.controls=null,n.clock=new u.SUY,n.miku=null,n.barrageList=g,n.heart=null,n.gltfLoader=new v.E,n}return(0,s.Z)(d,[{key:"componentDidMount",value:function(){this.initThree(),m("#barrage",g)}},{key:"componentWillUnmount",value:function(){this.renderer.forceContextLoss(),this.renderer.dispose(),this.scene.clear()}},{key:"render",value:function(){return(0,k.jsxs)("div",{className:"live",children:[(0,k.jsx)("video",{id:"video",className:"video",src:n(6935),muted:!0,autoPlay:!0,loop:!0}),(0,k.jsx)("canvas",{id:"barrage",className:"barrage"}),(0,k.jsx)("div",{id:"miku",className:"three"}),(0,k.jsx)("div",{id:"heart",className:"three"}),(0,k.jsx)("div",{id:"logo",className:"three"}),100===this.state.loadingProcess?"":(0,k.jsx)("div",{className:"live_loading",children:(0,k.jsxs)("div",{className:"box",children:[this.state.loadingProcess," %"]})}),(0,k.jsxs)("div",{className:"decorate",children:[(0,k.jsx)("i",{className:"live_icon",children:"LIVE"}),(0,k.jsxs)("div",{className:"live_banner",children:[(0,k.jsx)("i",{className:"icon"}),(0,k.jsx)("div",{className:"title",children:(0,k.jsx)("span",{className:"text",children:"\u6162\u76f4\u64ad\uff1a\u9999\u6e2f\u591c\u666f\u662f\u4e16\u754c\u4e09\u5927\u591c\u666f\u4e4b\u4e00\uff0c\u5176\u4e2d\u7ef4\u591a\u5229\u4e9a\u6e2f\u591c\u666f\u3001\u592a\u5e73\u5c71\u9876\u591c\u666f\u666f\u8272\u6700\u4e3a\u58ee\u89c2\u52a8\u4eba\u3002"})})]})]}),(0,k.jsxs)("div",{className:"input_zone",children:[(0,k.jsxs)("div",{className:"tips",children:[(0,k.jsx)("b",{children:"1566"}),"\u4eba\u6b63\u5728\u770b\uff0c\u5df2\u586b\u88c5",(0,k.jsx)("b",{children:"8896"}),"\u6761\u5f39\u5e55\uff01"]}),(0,k.jsx)(b.Z,{className:"input",placeholder:"\u8f93\u5165\u201c\u6162\u76f4\u64ad\u3001\u865a\u62df\u4e3b\u64ad\u3001\u521d\u97f3\u672a\u6765\u3001\u5b89\u53ef\u3001\u5143\u5b87\u5b99\u3001\u5361\u54c7\u4f0a \u2764\u201d\u7b49\u5b57\u6837\u53ef\u4ee5\u89e6\u53d1\u5f69\u86cb\u54e6\uff01",onChange:this.handleInputChange.bind(this),onKeyPress:this.handleInputKeypress.bind(this),value:this.state.inputValue,variant:"contained"}),(0,k.jsx)(y.Z,{className:"send_button",onClick:this.handleSend,variant:"contained",children:"\u53d1\u9001"})]})]})}}]),d}(d.Component)},9794:function(e,a,n){e.exports=n.p+"static/media/Miku.bafc0aafec53b6d24e8a.glb"},1620:function(e,a,n){e.exports=n.p+"static/media/heart.d6fb3895b74938715330.glb"},6942:function(e,a,n){e.exports=n.p+"static/media/logo.d0ce5d3c50d7caedb0dc.glb"},6935:function(e,a,n){e.exports=n.p+"static/media/demo.156174e4e1451eaf5a8f.mp4"}}]);