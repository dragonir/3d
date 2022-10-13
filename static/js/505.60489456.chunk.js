"use strict";(self.webpackChunk_3d_examples=self.webpackChunk_3d_examples||[]).push([[505],{2505:function(e,t,i){i.r(t),i.d(t,{default:function(){return p}});var n=i(5671),o=i(3144),a=i(136),r=i(4062),s=i(7313),d=i(3562),l=i(40),c=i(3497),h=i(1864),w=i(6417);"gravity"===window.location.hash.split("/")[1]&&function(e,t){var i,n,o,a,r=document,s=window,d=r.documentElement,l=document.createElement("style");function c(){var e=d.getBoundingClientRect().width;t||(t=540),e>t&&(e=t);var i=100*e/750;l.innerHTML="html{font-size:"+i+"px;}"}(n="width=device-width,initial-scale=1,maximum-scale=1.0,user-scalable=no,viewport-fit=cover",i=r.querySelector('meta[name="viewport"]'))?i.setAttribute("content",n):((i=r.createElement("meta")).setAttribute("name","viewport"),i.setAttribute("content",n),d.firstElementChild?d.firstElementChild.appendChild(i):((a=r.createElement("div")).appendChild(i),r.write(a.innerHTML),a=null));(c(),d.firstElementChild)?d.firstElementChild.appendChild(l):((a=r.createElement("div")).appendChild(l),r.write(a.innerHTML),a=null);s.addEventListener("resize",(function(){clearTimeout(o),o=setTimeout(c,300)}),!1),s.addEventListener("pageshow",(function(e){e.persisted&&(clearTimeout(o),o=setTimeout(c,300))}),!1),"complete"===r.readyState?r.body.style.fontSize="16px":r.addEventListener("DOMContentLoaded",(function(e){r.body.style.fontSize="16px"}),!1)}(0,750);var p=function(e){(0,a.Z)(i,e);var t=(0,r.Z)(i);function i(){var e;(0,n.Z)(this,i);for(var o=arguments.length,a=new Array(o),r=0;r<o;r++)a[r]=arguments[r];return(e=t.call.apply(t,[this].concat(a))).initThree=function(){var e={width:window.innerWidth,height:window.innerHeight},t=document.querySelector("canvas.webgl"),i=new d.CP7({canvas:t,antialias:!0});i.setPixelRatio(Math.min(window.devicePixelRatio,2)),i.setSize(e.width,e.height),i.toneMapping=d.LY2;var n=new d.xsS,o=new d.cPb(45,e.width/e.height,.1,1e3);o.position.z=150,o.lookAt(new d.Pa4(0,0,0)),n.add(o),window.addEventListener("resize",(function(){e.width=window.innerWidth,e.height=window.innerHeight,i.setSize(e.width,e.height),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),o.aspect=e.width/e.height,o.updateProjectionMatrix()}));var a=function(e,t){return e+Math.random()*(t-e)},r=null,s=0;n.fog=new d.yo9(0,.005);for(var w=new d.u9r,p=new d.UY4({color:16777215,size:10,alphaTest:.8,map:(new d.dpR).load(h)}),u=[],A=[],m=0;m<1e3;m++){u.push(a(20,30)*Math.cos(m),a(20,30)*Math.sin(m),a(-1500,0));var v=new d.Ilk(16777215*Math.random());A.push(v.r,v.g,v.b)}var f=new d.a$l(u,3),g=new d.a$l(A,3);w.attributes.position=f,w.attributes.color=g;var x=new d.woe(w,p);n.add(x),(new l.E).load(c,(function(e){(r=e.scene).material=new d.YBo,r.scale.set(5e-4,5e-4,5e-4),r.position.z=-10,n.add(r)}));var z=new d.cek(16777215,.5);z.position.x=-50,z.position.y=-50,z.position.z=75,n.add(z),(z=new d.cek(16777215,.5)).position.x=50,z.position.y=50,z.position.z=75,n.add(z),(z=new d.cek(16777215,.3)).position.x=25,z.position.y=50,z.position.z=200,n.add(z),z=new d.Mig(16777215,.02),n.add(z),function e(){!function(){x.position.x=.2*Math.cos(s),x.position.y=.2*Math.cos(s),x.rotation.z+=.015,o.lookAt(x.position);for(var e=0;e<u.length;e++)if((e+1)%3===0){u[e]-o.position.z>=0&&(u[e]=a(-1e3,-500)),u[e]+=2.5;var t=new d.a$l(u,3);w.attributes.position=t}x.geometry.verticesNeedUpdate=!0}(),r&&(r.position.z=.08*Math.sin(s)+(o.position.z-.2),r.rotation.x+=.015,r.rotation.y+=.015,r.rotation.z+=.01),function(){var e=t.clientWidth,n=t.clientHeight;(t.width!==e||t.height!==n)&&(i.setSize(e,n,!1),o.aspect=t.clientWidth/t.clientHeight,o.updateProjectionMatrix())}(),i.render(n,o),requestAnimationFrame(e),s+=.01}(),window.addEventListener("mousemove",(function(e){var t=window.innerWidth/2,i=window.innerHeight/2,n=(t-e.clientX)/t*-1,a=(i-e.clientY)/i*-1;o.position.x=5*n,o.position.y=5*a,r.position.x=5*n,r.position.y=5*a}))},e}return(0,o.Z)(i,[{key:"componentDidMount",value:function(){this.initThree()}},{key:"render",value:function(){return(0,w.jsxs)("div",{className:"gravrity_page",children:[(0,w.jsx)("canvas",{className:"webgl"}),(0,w.jsxs)("div",{className:"title-zone",children:[(0,w.jsx)("h1",{className:"title",children:"GRAVITY"}),(0,w.jsx)("h2",{className:"subtitle",children:"\u8ff7\u5931\u592a\u7a7a"})]}),(0,w.jsxs)("a",{className:"github",href:"https://github.com/dragonir/3d",target:"_blank",rel:"noreferrer",children:[(0,w.jsx)("svg",{height:"36","aria-hidden":"true",viewBox:"0 0 16 16",version:"1.1",width:"36","data-view-component":"true",children:(0,w.jsx)("path",{fill:"#FFFFFF",fillRule:"evenodd",d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"})}),(0,w.jsx)("span",{className:"author",children:"@dragonir"})]})]})}}]),i}(s.Component)},3497:function(e,t,i){e.exports=i.p+"static/media/astronaut.314d86a43264fb71e7f2.glb"},1864:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgSURBVHgB7cmxDQAACALBj/vvrIWUJCzAtQf1VtwNlR3vKwf7lmC9zQAAAABJRU5ErkJggg=="}}]);