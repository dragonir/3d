"use strict";(self.webpackChunk_3d_examples=self.webpackChunk_3d_examples||[]).push([[229],{6229:function(e,t,n){n.r(t),n.d(t,{default:function(){return p}});var i=n(5671),r=n(3144),a=n(136),o=n(4062),s=n(7313),c=n(3562),d=n(6892),l=n(4849),u=n(40),h=n(7943),f=n(6417),p=function(e){(0,a.Z)(s,e);var t=(0,o.Z)(s);function s(){var e;return(0,i.Z)(this,s),(e=t.call(this)).initThree=function(){var t,i=document.getElementsByClassName("section")[0],r=i.clientWidth,a=i.clientHeight,o=new c.xsS,s=new c.CP7({canvas:document.querySelector("#canvas-container"),antialias:!0,alpha:!0,powerPreference:"high-performance"});s.autoClear=!0,s.setPixelRatio(Math.min(window.devicePixelRatio,1)),s.setSize(r,a),s.outputEncoding=c.knz;var f=new c.CP7({canvas:document.querySelector("#canvas-container-details"),antialias:!1});f.setPixelRatio(Math.min(window.devicePixelRatio,1)),f.setSize(r,a),f.outputEncoding=c.knz;var p=new c.ZAu;o.add(p);var m=new c.cPb(35,r/a,1,100);m.position.set(19,1.54,-.1),p.add(m);var v=new c.cPb(35,i.clientWidth/i.clientHeight,1,100);v.position.set(3.2,2.8,3.2),v.rotation.set(0,1,0),o.add(v);var y=new h.Z;document.documentElement.appendChild(y.dom),window.addEventListener("resize",(function(){m.aspect=i.clientWidth/i.clientHeight,m.updateProjectionMatrix(),v.aspect=i.clientWidth/i.clientHeight,v.updateProjectionMatrix(),s.setSize(i.clientWidth,i.clientHeight),f.setSize(i.clientWidth,i.clientHeight),s.setPixelRatio(Math.min(window.devicePixelRatio,1)),f.setPixelRatio(Math.min(window.devicePixelRatio,1))}));var g=new c.Ox3(4414578,.08);g.position.set(-100,0,-100),o.add(g);var _=new c.cek(8958681,2.7,4,3);_.position.set(30,3,1.8),o.add(_);var w=document.querySelector(".lds-roller"),b=document.getElementById("loading-text-intro"),x=new c.lLk;x.onLoad=function(){document.querySelector(".content").style.visibility="visible";var e={y:0};new d.w.Tween(e).to({y:100},900).easing(d.w.Easing.Quadratic.InOut).start().onUpdate((function(){b.style.setProperty("transform","translate( 0, ".concat(e.y,"%)"))})).onComplete((function(){b.parentNode.removeChild(document.getElementById("loading-text-intro")),d.w.remove(this)})),new d.w.Tween(m.position.set(0,4,2)).to({x:0,y:2.4,z:6.8},3500).easing(d.w.Easing.Quadratic.InOut).start().onComplete((function(){d.w.remove(this),document.querySelector(".header").classList.add("ended"),document.querySelector(".description").classList.add("ended")})),w.parentNode.removeChild(w),window.scroll(0,0)};var k=new l._;k.setDecoderPath("libs/draco/"),k.setDecoderConfig({type:"js"});var I=new u.E(x);function T(e,t){new d.w.Tween(v.position).to(e,1800).easing(d.w.Easing.Quadratic.InOut).start().onComplete((function(){d.w.remove(this)})),new d.w.Tween(v.rotation).to(t,1800).easing(d.w.Easing.Quadratic.InOut).start().onComplete((function(){d.w.remove(this)}))}I.setDRACOLoader(k),I.load(n(1023),(function(e){e.scene.traverse((function(e){e.isMesh&&(t=e.material,e.material=new c.xoR({shininess:45}))})),o.add(e.scene),t.dispose(),s.renderLists.dispose()})),document.getElementById("aglaea").addEventListener("click",(function(){document.getElementById("aglaea").classList.add("active"),document.getElementById("euphre").classList.remove("active"),document.getElementById("thalia").classList.remove("active"),document.getElementById("content").innerHTML="She was venerated as the goddess of beauty, splendor, glory, magnificence, and adornment. She is the youngest of the Charites according to Hesiod. Aglaea is one of three daughters of Zeus and either the Oceanid Eurynome, or of Eunomia, the goddess of good order and lawful conduct.",T({x:3.2,y:2.8,z:3.2},{y:1})})),document.getElementById("thalia").addEventListener("click",(function(){document.getElementById("thalia").classList.add("active"),document.getElementById("aglaea").classList.remove("active"),document.getElementById("euphre").classList.remove("active"),document.getElementById("content").innerHTML="Thalia, in Greek religion, one of the nine Muses, patron of comedy; also, according to the Greek poet Hesiod, a Grace (one of a group of goddesses of fertility). She is the mother of the Corybantes, celebrants of the Great Mother of the Gods, Cybele, the father being Apollo, a god related to music and dance. In her hands she carried the comic mask and the shepherd\u2019s staff.",T({x:-1.4,y:2.8,z:4.4},{y:-.1})})),document.getElementById("euphre").addEventListener("click",(function(){document.getElementById("euphre").classList.add("active"),document.getElementById("aglaea").classList.remove("active"),document.getElementById("thalia").classList.remove("active"),document.getElementById("content").innerHTML='Euphrosyne is a Goddess of Good Cheer, Joy and Mirth. Her name is the female version of a Greek word euphrosynos, which means "merriment". The Greek poet Pindar states that these goddesses were created to fill the world with pleasant moments and good will. Usually the Charites attended the goddess of beauty Aphrodite.',T({x:-4.8,y:2.9,z:3.2},{y:-.75})}));var E={x:0,y:0},C=new c.SUY,S=0;!function t(){d.w.update(),e.secondContainer?f.render(o,v):s.render(o,m);var n=C.getElapsedTime(),i=n-S;S=n;var r=E.y;_.position.y-=(9*r+_.position.y-2)*i;var a=E.x;_.position.x+=2*(8*a-_.position.x)*i,p.position.z-=2*(r/3+p.position.z)*i,p.position.x+=2*(a/3-p.position.x)*i,y&&y.update(),requestAnimationFrame(t)}(),document.addEventListener("mousemove",(function(e){e.preventDefault(),E.x=e.clientX/window.innerWidth-.5,E.y=e.clientY/window.innerHeight-.5,P(e)}),!1);var j=document.querySelector(".cursor"),P=function(e){var t=e.clientX,n=e.clientY;j.style.cssText="left: ".concat(t,"px; top: ").concat(n,"px;")}},e.handleMenu=function(){var t=new IntersectionObserver((function(t){t[0].intersectionRatio>.05?e.secondContainer=!0:e.secondContainer=!1}),{threshold:.05}),n=document.querySelector(".second");t.observe(n);var i=document.querySelectorAll("nav > .a");function r(e){var t=this.querySelector("span");if("mouseleave"===e.type)t.style.cssText="";else{var n=e.offsetX,i=e.offsetY,r=n/this.offsetWidth*40-20,a=i/this.offsetHeight*40-20;t.style.cssText="transform: translate(".concat(r,"px, ").concat(a,"px);")}}i.forEach((function(e){return e.addEventListener("mousemove",r)})),i.forEach((function(e){return e.addEventListener("mouseleave",r)}))},e.secondContainer=!1,e}return(0,r.Z)(s,[{key:"componentDidMount",value:function(){this.initThree(),this.handleMenu()}},{key:"componentWillUnmount",value:function(){this.setState=function(){}}},{key:"render",value:function(){return(0,f.jsxs)("div",{className:"shadow_page",children:[(0,f.jsxs)("div",{className:"lds-roller",children:[(0,f.jsx)("div",{}),(0,f.jsx)("div",{}),(0,f.jsx)("div",{}),(0,f.jsx)("div",{}),(0,f.jsx)("div",{}),(0,f.jsx)("div",{}),(0,f.jsx)("div",{}),(0,f.jsx)("div",{})]}),(0,f.jsx)("div",{id:"loading-text-intro",children:(0,f.jsx)("p",{children:"Loading"})}),(0,f.jsxs)("div",{className:"content",style:{visibility:"hidden"},children:[(0,f.jsxs)("nav",{className:"header",children:[(0,f.jsx)("b",{className:"active a",children:(0,f.jsx)("span",{children:"\u9996\u9875"})}),(0,f.jsx)("b",{className:"a",children:(0,f.jsx)("span",{children:"\u5173\u4e8e"})}),(0,f.jsx)("b",{className:"a",children:(0,f.jsx)("span",{children:"\u4f5c\u54c1"})}),(0,f.jsx)("b",{className:"a",children:(0,f.jsx)("span",{children:"\u6211\u7684"})}),(0,f.jsx)("b",{className:"a",children:(0,f.jsx)("span",{children:"\u4e86\u89e3\u66f4\u591a"})}),(0,f.jsx)("div",{className:"cursor"})]}),(0,f.jsxs)("section",{className:"section first",children:[(0,f.jsxs)("div",{className:"info",children:[(0,f.jsx)("h2",{className:"name",children:"DRAGONIR"}),(0,f.jsx)("h1",{className:"title",children:"KING OF KINGS"}),(0,f.jsx)("p",{className:"description",children:"\u4e0d\u8981\u6e29\u987a\u7684\u8d70\u8fdb\u90a3\u4e2a\u826f\u591c\uff0c\u6fc0\u60c5\u4e0d\u80fd\u88ab\u6d88\u6c89\u7684\u66ae\u8272\u6df9\u6ca1\uff0c\u5486\u54ee\u5427\uff0c\u5486\u54ee\uff0c\u75db\u65a5\u90a3\u5149\u7684\u9000\u7f29\uff0c\u667a\u8005\u5728\u4e34\u7ec8\u7684\u65f6\u5019\uff0c\u5bf9\u9ed1\u6697\u59a5\u534f\uff0c\u662f\u56e0\u4e3a\u5b83\u4eec\u7684\u8bed\u8a00\u5df2\u9eef\u7136\u5931\u8272\uff0c\u5b83\u4eec\u4e0d\u60f3\u88ab\u591c\u8272\u8ff7\u60d1\uff0c\u5486\u54ee\u5427\uff0c\u5486\u54ee\uff0c\u75db\u65a5\u90a3\u5149\u7684\u9000\u7f29\u3002"})]}),(0,f.jsx)("canvas",{id:"canvas-container",className:"webgl"})]}),(0,f.jsxs)("section",{className:"section second",children:[(0,f.jsxs)("div",{className:"second-container",children:[(0,f.jsxs)("ul",{children:[(0,f.jsx)("li",{id:"aglaea",className:"active",children:"Aglaea"}),(0,f.jsx)("li",{id:"thalia",children:(0,f.jsx)("b",{children:"Thalia"})}),(0,f.jsx)("li",{id:"euphre",children:"Euphre"})]}),(0,f.jsx)("p",{id:"content",children:"She was venerated as the goddess of beauty, splendor, glory, magnificence, and adornment. She is the youngest of the Charites according to Hesiod. Aglaea is one of three daughters of Zeus and either the Oceanid Eurynome, or of Eunomia, the goddess of good order and lawful conduct."})]}),(0,f.jsx)("canvas",{id:"canvas-container-details",className:"webgl"})]}),(0,f.jsxs)("section",{className:"section third",children:[(0,f.jsx)("h1",{children:"The Making"}),(0,f.jsxs)("p",{children:["Canova's assistants roughly blocked out the marble, leaving Canova to perform the final carving and shape the stone to highlight the Graces soft flesh. This was a trademark of the artist, and the piece shows a strong allegiance to the Neo-Classical movement in sculpture, of which Canova is the prime exponent.",(0,f.jsx)("br",{}),(0,f.jsx)("br",{})," The three goddesses are shown nude, huddled together, their heads almost touching in what many have referred to as an erotically charged piece. They stand, leaning slightly inward \u2014 perhaps discussing a common issue, or simply enjoying their closeness. Their hair-styles are similar, braided atop their heads."]})]}),(0,f.jsx)("h4",{className:"footer",children:"Created by dragonir \xa9 2022"})]}),(0,f.jsx)("a",{className:"github",href:"https://github.com/dragonir/3d",target:"_blank",rel:"noreferrer",title:"dragonir",children:(0,f.jsx)("svg",{height:"36","aria-hidden":"true",viewBox:"0 0 16 16",version:"1.1",width:"36","data-view-component":"true",children:(0,f.jsx)("path",{fill:"#FFFFFF",fillRule:"evenodd",d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"})})})]})}}]),s}(s.Component)},1023:function(e,t,n){e.exports=n.p+"static/media/kas.4e32557cec37d768dce5.glb"},7943:function(e,t){var n=function e(){var t=0,n=document.createElement("div");function i(e){return n.appendChild(e.dom),e}function r(e){for(var i=0;i<n.children.length;i++)n.children[i].style.display=i===e?"block":"none";t=e}n.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",n.addEventListener("click",(function(e){e.preventDefault(),r(++t%n.children.length)}),!1);var a=(performance||Date).now(),o=a,s=0,c=i(new e.Panel("FPS","#0ff","#002")),d=i(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var l=i(new e.Panel("MB","#f08","#201"));return r(0),{REVISION:16,dom:n,addPanel:i,showPanel:r,begin:function(){a=(performance||Date).now()},end:function(){s++;var e=(performance||Date).now();if(d.update(e-a,200),e>=o+1e3&&(c.update(1e3*s/(e-o),100),o=e,s=0,l)){var t=performance.memory;l.update(t.usedJSHeapSize/1048576,t.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:n,setMode:r}};n.Panel=function(e,t,n){var i=1/0,r=0,a=Math.round,o=a(window.devicePixelRatio||1),s=80*o,c=48*o,d=3*o,l=2*o,u=3*o,h=15*o,f=74*o,p=30*o,m=document.createElement("canvas");m.width=s,m.height=c,m.style.cssText="width:80px;height:48px";var v=m.getContext("2d");return v.font="bold "+9*o+"px Helvetica,Arial,sans-serif",v.textBaseline="top",v.fillStyle=n,v.fillRect(0,0,s,c),v.fillStyle=t,v.fillText(e,d,l),v.fillRect(u,h,f,p),v.fillStyle=n,v.globalAlpha=.9,v.fillRect(u,h,f,p),{dom:m,update:function(c,y){i=Math.min(i,c),r=Math.max(r,c),v.fillStyle=n,v.globalAlpha=1,v.fillRect(0,0,s,h),v.fillStyle=t,v.fillText(a(c)+" "+e+" ("+a(i)+"-"+a(r)+")",d,l),v.drawImage(m,u+o,h,f-o,p,u,h,f-o,p),v.fillRect(u+f-o,h,o,p),v.fillStyle=n,v.globalAlpha=.9,v.fillRect(u+f-o,h,o,a((1-c/y)*p))}}},t.Z=n},6892:function(e,t,n){n.d(t,{w:function(){return a}});var i=function(){this._tweens={},this._tweensAddedDuringUpdate={}};i.prototype={getAll:function(){return Object.keys(this._tweens).map(function(e){return this._tweens[e]}.bind(this))},removeAll:function(){this._tweens={}},add:function(e){this._tweens[e.getId()]=e,this._tweensAddedDuringUpdate[e.getId()]=e},remove:function(e){delete this._tweens[e.getId()],delete this._tweensAddedDuringUpdate[e.getId()]},update:function(e,t){var n=Object.keys(this._tweens);if(0===n.length)return!1;for(e=void 0!==e?e:a.now();0<n.length;){this._tweensAddedDuringUpdate={};for(var i=0;i<n.length;i++){var r=this._tweens[n[i]];r&&!1===r.update(e)&&(r._isPlaying=!1,t||delete this._tweens[n[i]])}n=Object.keys(this._tweensAddedDuringUpdate)}return!0}};var r,a=new i;a.Group=i,a._nextId=0,a.nextId=function(){return a._nextId++},"undefined"==typeof self&&"undefined"!=typeof process&&process.hrtime?a.now=function(){var e=process.hrtime();return 1e3*e[0]+e[1]/1e6}:"undefined"!=typeof self&&void 0!==self.performance&&void 0!==self.performance.now?a.now=self.performance.now.bind(self.performance):void 0!==Date.now?a.now=Date.now:a.now=function(){return(new Date).getTime()},a.Tween=function(e,t){this._object=e,this._valuesStart={},this._valuesEnd={},this._valuesStartRepeat={},this._duration=1e3,this._repeat=0,this._repeatDelayTime=void 0,this._yoyo=!1,this._isPlaying=!1,this._reversed=!1,this._delayTime=0,this._startTime=null,this._easingFunction=a.Easing.Linear.None,this._interpolationFunction=a.Interpolation.Linear,this._chainedTweens=[],this._onStartCallback=null,this._onStartCallbackFired=!1,this._onUpdateCallback=null,this._onCompleteCallback=null,this._onStopCallback=null,this._group=t||a,this._id=a.nextId()},a.Tween.prototype={getId:function(){return this._id},isPlaying:function(){return this._isPlaying},to:function(e,t){return this._valuesEnd=Object.create(e),void 0!==t&&(this._duration=t),this},duration:function(e){return this._duration=e,this},start:function(e){for(var t in this._group.add(this),this._isPlaying=!0,this._onStartCallbackFired=!1,this._startTime=void 0!==e?"string"==typeof e?a.now()+parseFloat(e):e:a.now(),this._startTime+=this._delayTime,this._valuesEnd){if(this._valuesEnd[t]instanceof Array){if(0===this._valuesEnd[t].length)continue;this._valuesEnd[t]=[this._object[t]].concat(this._valuesEnd[t])}void 0!==this._object[t]&&(this._valuesStart[t]=this._object[t],this._valuesStart[t]instanceof Array==0&&(this._valuesStart[t]*=1),this._valuesStartRepeat[t]=this._valuesStart[t]||0)}return this},stop:function(){return this._isPlaying&&(this._group.remove(this),this._isPlaying=!1,null!==this._onStopCallback&&this._onStopCallback(this._object),this.stopChainedTweens()),this},end:function(){return this.update(1/0),this},stopChainedTweens:function(){for(var e=0,t=this._chainedTweens.length;e<t;e++)this._chainedTweens[e].stop()},group:function(e){return this._group=e,this},delay:function(e){return this._delayTime=e,this},repeat:function(e){return this._repeat=e,this},repeatDelay:function(e){return this._repeatDelayTime=e,this},yoyo:function(e){return this._yoyo=e,this},easing:function(e){return this._easingFunction=e,this},interpolation:function(e){return this._interpolationFunction=e,this},chain:function(){return this._chainedTweens=arguments,this},onStart:function(e){return this._onStartCallback=e,this},onUpdate:function(e){return this._onUpdateCallback=e,this},onComplete:function(e){return this._onCompleteCallback=e,this},onStop:function(e){return this._onStopCallback=e,this},update:function(e){var t,n,i;if(e<this._startTime)return!0;for(t in!1===this._onStartCallbackFired&&(null!==this._onStartCallback&&this._onStartCallback(this._object),this._onStartCallbackFired=!0),n=(e-this._startTime)/this._duration,n=0===this._duration||1<n?1:n,i=this._easingFunction(n),this._valuesEnd)if(void 0!==this._valuesStart[t]){var r=this._valuesStart[t]||0,a=this._valuesEnd[t];a instanceof Array?this._object[t]=this._interpolationFunction(a,i):("string"==typeof a&&(a="+"===a.charAt(0)||"-"===a.charAt(0)?r+parseFloat(a):parseFloat(a)),"number"==typeof a&&(this._object[t]=r+(a-r)*i))}if(null!==this._onUpdateCallback&&this._onUpdateCallback(this._object),1!==n)return!0;if(0<this._repeat){for(t in isFinite(this._repeat)&&this._repeat--,this._valuesStartRepeat){if("string"==typeof this._valuesEnd[t]&&(this._valuesStartRepeat[t]=this._valuesStartRepeat[t]+parseFloat(this._valuesEnd[t])),this._yoyo){var o=this._valuesStartRepeat[t];this._valuesStartRepeat[t]=this._valuesEnd[t],this._valuesEnd[t]=o}this._valuesStart[t]=this._valuesStartRepeat[t]}return this._yoyo&&(this._reversed=!this._reversed),void 0!==this._repeatDelayTime?this._startTime=e+this._repeatDelayTime:this._startTime=e+this._delayTime,!0}null!==this._onCompleteCallback&&this._onCompleteCallback(this._object);for(var s=0,c=this._chainedTweens.length;s<c;s++)this._chainedTweens[s].start(this._startTime+this._duration);return!1}},a.Easing={Linear:{None:function(e){return e}},Quadratic:{In:function(e){return e*e},Out:function(e){return e*(2-e)},InOut:function(e){return(e*=2)<1?.5*e*e:-.5*(--e*(e-2)-1)}},Cubic:{In:function(e){return e*e*e},Out:function(e){return--e*e*e+1},InOut:function(e){return(e*=2)<1?.5*e*e*e:.5*((e-=2)*e*e+2)}},Quartic:{In:function(e){return e*e*e*e},Out:function(e){return 1- --e*e*e*e},InOut:function(e){return(e*=2)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2)}},Quintic:{In:function(e){return e*e*e*e*e},Out:function(e){return--e*e*e*e*e+1},InOut:function(e){return(e*=2)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2)}},Sinusoidal:{In:function(e){return 1-Math.cos(e*Math.PI/2)},Out:function(e){return Math.sin(e*Math.PI/2)},InOut:function(e){return.5*(1-Math.cos(Math.PI*e))}},Exponential:{In:function(e){return 0===e?0:Math.pow(1024,e-1)},Out:function(e){return 1===e?1:1-Math.pow(2,-10*e)},InOut:function(e){return 0===e?0:1===e?1:(e*=2)<1?.5*Math.pow(1024,e-1):.5*(2-Math.pow(2,-10*(e-1)))}},Circular:{In:function(e){return 1-Math.sqrt(1-e*e)},Out:function(e){return Math.sqrt(1- --e*e)},InOut:function(e){return(e*=2)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1)}},Elastic:{In:function(e){return 0===e?0:1===e?1:-Math.pow(2,10*(e-1))*Math.sin(5*(e-1.1)*Math.PI)},Out:function(e){return 0===e?0:1===e?1:Math.pow(2,-10*e)*Math.sin(5*(e-.1)*Math.PI)+1},InOut:function(e){return 0===e?0:1===e?1:(e*=2)<1?-.5*Math.pow(2,10*(e-1))*Math.sin(5*(e-1.1)*Math.PI):.5*Math.pow(2,-10*(e-1))*Math.sin(5*(e-1.1)*Math.PI)+1}},Back:{In:function(e){return e*e*(2.70158*e-1.70158)},Out:function(e){return--e*e*(2.70158*e+1.70158)+1},InOut:function(e){var t=2.5949095;return(e*=2)<1?e*e*((1+t)*e-t)*.5:.5*((e-=2)*e*((1+t)*e+t)+2)}},Bounce:{In:function(e){return 1-a.Easing.Bounce.Out(1-e)},Out:function(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375},InOut:function(e){return e<.5?.5*a.Easing.Bounce.In(2*e):.5*a.Easing.Bounce.Out(2*e-1)+.5}}},a.Interpolation={Linear:function(e,t){var n=e.length-1,i=n*t,r=Math.floor(i),o=a.Interpolation.Utils.Linear;return t<0?o(e[0],e[1],i):1<t?o(e[n],e[n-1],n-i):o(e[r],e[n<r+1?n:r+1],i-r)},Bezier:function(e,t){for(var n=0,i=e.length-1,r=Math.pow,o=a.Interpolation.Utils.Bernstein,s=0;s<=i;s++)n+=r(1-t,i-s)*r(t,s)*e[s]*o(i,s);return n},CatmullRom:function(e,t){var n=e.length-1,i=n*t,r=Math.floor(i),o=a.Interpolation.Utils.CatmullRom;return e[0]===e[n]?(t<0&&(r=Math.floor(i=n*(1+t))),o(e[(r-1+n)%n],e[r],e[(r+1)%n],e[(r+2)%n],i-r)):t<0?e[0]-(o(e[0],e[0],e[1],e[1],-i)-e[0]):1<t?e[n]-(o(e[n],e[n],e[n-1],e[n-1],i-n)-e[n]):o(e[r?r-1:0],e[r],e[n<r+1?n:r+1],e[n<r+2?n:r+2],i-r)},Utils:{Linear:function(e,t,n){return(t-e)*n+e},Bernstein:function(e,t){var n=a.Interpolation.Utils.Factorial;return n(e)/n(t)/n(e-t)},Factorial:function(){var e=[1];return function(t){var n=1;if(e[t])return e[t];for(var i=t;1<i;i--)n*=i;return e[t]=n}}(),CatmullRom:function(e,t,n,i,r){var a=.5*(n-e),o=.5*(i-t),s=r*r;return(2*t-2*n+a+o)*(r*s)+(-3*t+3*n-2*a-o)*s+a*r+t}}},r=void 0,"function"==typeof define&&define.amd?define([],(function(){return a})):"undefined"!=typeof module&&"object"==typeof exports?module.exports=a:void 0!==r&&(r.TWEEN=a)},4849:function(e,t,n){n.d(t,{_:function(){return d}});var i=n(5671),r=n(3144),a=n(136),o=n(4062),s=n(3562),c=new WeakMap,d=function(e){(0,a.Z)(n,e);var t=(0,o.Z)(n);function n(e){var r;return(0,i.Z)(this,n),(r=t.call(this,e)).decoderPath="",r.decoderConfig={},r.decoderBinary=null,r.decoderPending=null,r.workerLimit=4,r.workerPool=[],r.workerNextTaskID=1,r.workerSourceURL="",r.defaultAttributeIDs={position:"POSITION",normal:"NORMAL",color:"COLOR",uv:"TEX_COORD"},r.defaultAttributeTypes={position:"Float32Array",normal:"Float32Array",color:"Float32Array",uv:"Float32Array"},r}return(0,r.Z)(n,[{key:"setDecoderPath",value:function(e){return this.decoderPath=e,this}},{key:"setDecoderConfig",value:function(e){return this.decoderConfig=e,this}},{key:"setWorkerLimit",value:function(e){return this.workerLimit=e,this}},{key:"load",value:function(e,t,n,i){var r=this,a=new s.hH6(this.manager);a.setPath(this.path),a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,(function(e){var n={attributeIDs:r.defaultAttributeIDs,attributeTypes:r.defaultAttributeTypes,useUniqueIDs:!1};r.decodeGeometry(e,n).then(t).catch(i)}),n,i)}},{key:"decodeDracoFile",value:function(e,t,n,i){var r={attributeIDs:n||this.defaultAttributeIDs,attributeTypes:i||this.defaultAttributeTypes,useUniqueIDs:!!n};this.decodeGeometry(e,r).then(t)}},{key:"decodeGeometry",value:function(e,t){var n=this;for(var i in t.attributeTypes){var r=t.attributeTypes[i];void 0!==r.BYTES_PER_ELEMENT&&(t.attributeTypes[i]=r.name)}var a,o=JSON.stringify(t);if(c.has(e)){var s=c.get(e);if(s.key===o)return s.promise;if(0===e.byteLength)throw new Error("THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.")}var d=this.workerNextTaskID++,l=e.byteLength,u=this._getWorker(d,l).then((function(n){return a=n,new Promise((function(n,i){a._callbacks[d]={resolve:n,reject:i},a.postMessage({type:"decode",id:d,taskConfig:t,buffer:e},[e])}))})).then((function(e){return n._createGeometry(e.geometry)}));return u.catch((function(){return!0})).then((function(){a&&d&&n._releaseTask(a,d)})),c.set(e,{key:o,promise:u}),u}},{key:"_createGeometry",value:function(e){var t=new s.u9r;e.index&&t.setIndex(new s.TlE(e.index.array,1));for(var n=0;n<e.attributes.length;n++){var i=e.attributes[n],r=i.name,a=i.array,o=i.itemSize;t.setAttribute(r,new s.TlE(a,o))}return t}},{key:"_loadLibrary",value:function(e,t){var n=new s.hH6(this.manager);return n.setPath(this.decoderPath),n.setResponseType(t),n.setWithCredentials(this.withCredentials),new Promise((function(t,i){n.load(e,t,void 0,i)}))}},{key:"preload",value:function(){return this._initDecoder(),this}},{key:"_initDecoder",value:function(){var e=this;if(this.decoderPending)return this.decoderPending;var t="object"!==typeof WebAssembly||"js"===this.decoderConfig.type,n=[];return t?n.push(this._loadLibrary("draco_decoder.js","text")):(n.push(this._loadLibrary("draco_wasm_wrapper.js","text")),n.push(this._loadLibrary("draco_decoder.wasm","arraybuffer"))),this.decoderPending=Promise.all(n).then((function(n){var i=n[0];t||(e.decoderConfig.wasmBinary=n[1]);var r=l.toString(),a=["/* draco decoder */",i,"","/* worker */",r.substring(r.indexOf("{")+1,r.lastIndexOf("}"))].join("\n");e.workerSourceURL=URL.createObjectURL(new Blob([a]))})),this.decoderPending}},{key:"_getWorker",value:function(e,t){var n=this;return this._initDecoder().then((function(){if(n.workerPool.length<n.workerLimit){var i=new Worker(n.workerSourceURL);i._callbacks={},i._taskCosts={},i._taskLoad=0,i.postMessage({type:"init",decoderConfig:n.decoderConfig}),i.onmessage=function(e){var t=e.data;switch(t.type){case"decode":i._callbacks[t.id].resolve(t);break;case"error":i._callbacks[t.id].reject(t);break;default:console.error('THREE.DRACOLoader: Unexpected message, "'+t.type+'"')}},n.workerPool.push(i)}else n.workerPool.sort((function(e,t){return e._taskLoad>t._taskLoad?-1:1}));var r=n.workerPool[n.workerPool.length-1];return r._taskCosts[e]=t,r._taskLoad+=t,r}))}},{key:"_releaseTask",value:function(e,t){e._taskLoad-=e._taskCosts[t],delete e._callbacks[t],delete e._taskCosts[t]}},{key:"debug",value:function(){console.log("Task load: ",this.workerPool.map((function(e){return e._taskLoad})))}},{key:"dispose",value:function(){for(var e=0;e<this.workerPool.length;++e)this.workerPool[e].terminate();return this.workerPool.length=0,this}}]),n}(s.aNw);function l(){var e,t;function n(e,t,n,i,r,a){var o=a.num_components(),s=n.num_points()*o,c=s*r.BYTES_PER_ELEMENT,d=function(e,t){switch(t){case Float32Array:return e.DT_FLOAT32;case Int8Array:return e.DT_INT8;case Int16Array:return e.DT_INT16;case Int32Array:return e.DT_INT32;case Uint8Array:return e.DT_UINT8;case Uint16Array:return e.DT_UINT16;case Uint32Array:return e.DT_UINT32}}(e,r),l=e._malloc(c);t.GetAttributeDataArrayForAllPoints(n,a,d,c,l);var u=new r(e.HEAPF32.buffer,l,s).slice();return e._free(l),{name:i,array:u,itemSize:o}}onmessage=function(i){var r=i.data;switch(r.type){case"init":e=r.decoderConfig,t=new Promise((function(t){e.onModuleLoaded=function(e){t({draco:e})},DracoDecoderModule(e)}));break;case"decode":var a=r.buffer,o=r.taskConfig;t.then((function(e){var t=e.draco,i=new t.Decoder,s=new t.DecoderBuffer;s.Init(new Int8Array(a),a.byteLength);try{var c=function(e,t,i,r){var a,o,s=r.attributeIDs,c=r.attributeTypes,d=t.GetEncodedGeometryType(i);if(d===e.TRIANGULAR_MESH)a=new e.Mesh,o=t.DecodeBufferToMesh(i,a);else{if(d!==e.POINT_CLOUD)throw new Error("THREE.DRACOLoader: Unexpected geometry type.");a=new e.PointCloud,o=t.DecodeBufferToPointCloud(i,a)}if(!o.ok()||0===a.ptr)throw new Error("THREE.DRACOLoader: Decoding failed: "+o.error_msg());var l={index:null,attributes:[]};for(var u in s){var h=self[c[u]],f=void 0,p=void 0;if(r.useUniqueIDs)p=s[u],f=t.GetAttributeByUniqueId(a,p);else{if(-1===(p=t.GetAttributeId(a,e[s[u]])))continue;f=t.GetAttribute(a,p)}l.attributes.push(n(e,t,a,u,h,f))}d===e.TRIANGULAR_MESH&&(l.index=function(e,t,n){var i=3*n.num_faces(),r=4*i,a=e._malloc(r);t.GetTrianglesUInt32Array(n,r,a);var o=new Uint32Array(e.HEAPF32.buffer,a,i).slice();return e._free(a),{array:o,itemSize:1}}(e,t,a));return e.destroy(a),l}(t,i,s,o),d=c.attributes.map((function(e){return e.array.buffer}));c.index&&d.push(c.index.array.buffer),self.postMessage({type:"decode",id:r.id,geometry:c},d)}catch(l){console.error(l),self.postMessage({type:"error",id:r.id,error:l.message})}finally{t.destroy(s),t.destroy(i)}}))}}}}}]);