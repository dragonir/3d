"use strict";(self.webpackChunk_3d_examples=self.webpackChunk_3d_examples||[]).push([[518],{2518:function(e,t,n){n.d(t,{z:function(){return u}});var a=n(3144),o=n(5671),i=n(7326),r=n(136),c=n(4062),s=n(3562),l={type:"change"},m={type:"start"},p={type:"end"},u=function(e){(0,r.Z)(n,e);var t=(0,c.Z)(n);function n(e,a){var r;(0,o.Z)(this,n),r=t.call(this),void 0===a&&console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.'),a===document&&console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'),r.object=e,r.domElement=a,r.domElement.style.touchAction="none",r.enabled=!0,r.target=new s.Pa4,r.minDistance=0,r.maxDistance=1/0,r.minZoom=0,r.maxZoom=1/0,r.minPolarAngle=0,r.maxPolarAngle=Math.PI,r.minAzimuthAngle=-1/0,r.maxAzimuthAngle=1/0,r.enableDamping=!1,r.dampingFactor=.05,r.enableZoom=!0,r.zoomSpeed=1,r.enableRotate=!0,r.rotateSpeed=1,r.enablePan=!0,r.panSpeed=1,r.screenSpacePanning=!0,r.keyPanSpeed=7,r.autoRotate=!1,r.autoRotateSpeed=2,r.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},r.mouseButtons={LEFT:s.RsA.ROTATE,MIDDLE:s.RsA.DOLLY,RIGHT:s.RsA.PAN},r.touches={ONE:s.QmN.ROTATE,TWO:s.QmN.DOLLY_PAN},r.target0=r.target.clone(),r.position0=r.object.position.clone(),r.zoom0=r.object.zoom,r._domElementKeyEvents=null,r.getPolarAngle=function(){return h.phi},r.getAzimuthalAngle=function(){return h.theta},r.getDistance=function(){return this.object.position.distanceTo(this.target)},r.listenToKeyEvents=function(e){e.addEventListener("keydown",$),this._domElementKeyEvents=e},r.saveState=function(){c.target0.copy(c.target),c.position0.copy(c.object.position),c.zoom0=c.object.zoom},r.reset=function(){c.target.copy(c.target0),c.object.position.copy(c.position0),c.object.zoom=c.zoom0,c.object.updateProjectionMatrix(),c.dispatchEvent(l),c.update(),d=u.NONE},r.update=function(){var t=new s.Pa4,n=(new s._fP).setFromUnitVectors(e.up,new s.Pa4(0,1,0)),a=n.clone().invert(),o=new s.Pa4,i=new s._fP,r=2*Math.PI;return function(){var e=c.object.position;t.copy(e).sub(c.target),t.applyQuaternion(n),h.setFromVector3(t),c.autoRotate&&d===u.NONE&&x(2*Math.PI/60/60*c.autoRotateSpeed),c.enableDamping?(h.theta+=f.theta*c.dampingFactor,h.phi+=f.phi*c.dampingFactor):(h.theta+=f.theta,h.phi+=f.phi);var s=c.minAzimuthAngle,m=c.maxAzimuthAngle;return isFinite(s)&&isFinite(m)&&(s<-Math.PI?s+=r:s>Math.PI&&(s-=r),m<-Math.PI?m+=r:m>Math.PI&&(m-=r),h.theta=s<=m?Math.max(s,Math.min(m,h.theta)):h.theta>(s+m)/2?Math.max(s,h.theta):Math.min(m,h.theta)),h.phi=Math.max(c.minPolarAngle,Math.min(c.maxPolarAngle,h.phi)),h.makeSafe(),h.radius*=E,h.radius=Math.max(c.minDistance,Math.min(c.maxDistance,h.radius)),!0===c.enableDamping?c.target.addScaledVector(g,c.dampingFactor):c.target.add(g),t.setFromSpherical(h),t.applyQuaternion(a),e.copy(c.target).add(t),c.object.lookAt(c.target),!0===c.enableDamping?(f.theta*=1-c.dampingFactor,f.phi*=1-c.dampingFactor,g.multiplyScalar(1-c.dampingFactor)):(f.set(0,0,0),g.set(0,0,0)),E=1,!!(v||o.distanceToSquared(c.object.position)>b||8*(1-i.dot(c.object.quaternion))>b)&&(c.dispatchEvent(l),o.copy(c.object.position),i.copy(c.object.quaternion),v=!1,!0)}}(),r.dispose=function(){c.domElement.removeEventListener("contextmenu",J),c.domElement.removeEventListener("pointerdown",Q),c.domElement.removeEventListener("pointercancel",W),c.domElement.removeEventListener("wheel",q),c.domElement.removeEventListener("pointermove",B),c.domElement.removeEventListener("pointerup",G),null!==c._domElementKeyEvents&&c._domElementKeyEvents.removeEventListener("keydown",$)};var c=(0,i.Z)(r),u={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},d=u.NONE,b=1e-6,h=new s.$V,f=new s.$V,E=1,g=new s.Pa4,v=!1,P=new s.FM8,y=new s.FM8,O=new s.FM8,T=new s.FM8,A=new s.FM8,N=new s.FM8,w=new s.FM8,L=new s.FM8,M=new s.FM8,j=[],R={};function k(){return Math.pow(.95,c.zoomSpeed)}function x(e){f.theta-=e}function Y(e){f.phi-=e}var D=function(){var e=new s.Pa4;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),g.add(e)}}(),I=function(){var e=new s.Pa4;return function(t,n){!0===c.screenSpacePanning?e.setFromMatrixColumn(n,1):(e.setFromMatrixColumn(n,0),e.crossVectors(c.object.up,e)),e.multiplyScalar(t),g.add(e)}}(),_=function(){var e=new s.Pa4;return function(t,n){var a=c.domElement;if(c.object.isPerspectiveCamera){var o=c.object.position;e.copy(o).sub(c.target);var i=e.length();i*=Math.tan(c.object.fov/2*Math.PI/180),D(2*t*i/a.clientHeight,c.object.matrix),I(2*n*i/a.clientHeight,c.object.matrix)}else c.object.isOrthographicCamera?(D(t*(c.object.right-c.object.left)/c.object.zoom/a.clientWidth,c.object.matrix),I(n*(c.object.top-c.object.bottom)/c.object.zoom/a.clientHeight,c.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),c.enablePan=!1)}}();function C(e){c.object.isPerspectiveCamera?E/=e:c.object.isOrthographicCamera?(c.object.zoom=Math.max(c.minZoom,Math.min(c.maxZoom,c.object.zoom*e)),c.object.updateProjectionMatrix(),v=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),c.enableZoom=!1)}function S(e){c.object.isPerspectiveCamera?E*=e:c.object.isOrthographicCamera?(c.object.zoom=Math.max(c.minZoom,Math.min(c.maxZoom,c.object.zoom/e)),c.object.updateProjectionMatrix(),v=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),c.enableZoom=!1)}function F(e){P.set(e.clientX,e.clientY)}function H(e){T.set(e.clientX,e.clientY)}function Z(){if(1===j.length)P.set(j[0].pageX,j[0].pageY);else{var e=.5*(j[0].pageX+j[1].pageX),t=.5*(j[0].pageY+j[1].pageY);P.set(e,t)}}function z(){if(1===j.length)T.set(j[0].pageX,j[0].pageY);else{var e=.5*(j[0].pageX+j[1].pageX),t=.5*(j[0].pageY+j[1].pageY);T.set(e,t)}}function X(){var e=j[0].pageX-j[1].pageX,t=j[0].pageY-j[1].pageY,n=Math.sqrt(e*e+t*t);w.set(0,n)}function U(e){if(1==j.length)y.set(e.pageX,e.pageY);else{var t=ne(e),n=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);y.set(n,a)}O.subVectors(y,P).multiplyScalar(c.rotateSpeed);var o=c.domElement;x(2*Math.PI*O.x/o.clientHeight),Y(2*Math.PI*O.y/o.clientHeight),P.copy(y)}function K(e){if(1===j.length)A.set(e.pageX,e.pageY);else{var t=ne(e),n=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);A.set(n,a)}N.subVectors(A,T).multiplyScalar(c.panSpeed),_(N.x,N.y),T.copy(A)}function V(e){var t=ne(e),n=e.pageX-t.x,a=e.pageY-t.y,o=Math.sqrt(n*n+a*a);L.set(0,o),M.set(0,Math.pow(L.y/w.y,c.zoomSpeed)),C(M.y),w.copy(L)}function Q(e){!1!==c.enabled&&(0===j.length&&(c.domElement.setPointerCapture(e.pointerId),c.domElement.addEventListener("pointermove",B),c.domElement.addEventListener("pointerup",G)),function(e){j.push(e)}(e),"touch"===e.pointerType?function(e){switch(te(e),j.length){case 1:switch(c.touches.ONE){case s.QmN.ROTATE:if(!1===c.enableRotate)return;Z(),d=u.TOUCH_ROTATE;break;case s.QmN.PAN:if(!1===c.enablePan)return;z(),d=u.TOUCH_PAN;break;default:d=u.NONE}break;case 2:switch(c.touches.TWO){case s.QmN.DOLLY_PAN:if(!1===c.enableZoom&&!1===c.enablePan)return;c.enableZoom&&X(),c.enablePan&&z(),d=u.TOUCH_DOLLY_PAN;break;case s.QmN.DOLLY_ROTATE:if(!1===c.enableZoom&&!1===c.enableRotate)return;c.enableZoom&&X(),c.enableRotate&&Z(),d=u.TOUCH_DOLLY_ROTATE;break;default:d=u.NONE}break;default:d=u.NONE}d!==u.NONE&&c.dispatchEvent(m)}(e):function(e){var t;switch(e.button){case 0:t=c.mouseButtons.LEFT;break;case 1:t=c.mouseButtons.MIDDLE;break;case 2:t=c.mouseButtons.RIGHT;break;default:t=-1}switch(t){case s.RsA.DOLLY:if(!1===c.enableZoom)return;!function(e){w.set(e.clientX,e.clientY)}(e),d=u.DOLLY;break;case s.RsA.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===c.enablePan)return;H(e),d=u.PAN}else{if(!1===c.enableRotate)return;F(e),d=u.ROTATE}break;case s.RsA.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===c.enableRotate)return;F(e),d=u.ROTATE}else{if(!1===c.enablePan)return;H(e),d=u.PAN}break;default:d=u.NONE}d!==u.NONE&&c.dispatchEvent(m)}(e))}function B(e){!1!==c.enabled&&("touch"===e.pointerType?function(e){switch(te(e),d){case u.TOUCH_ROTATE:if(!1===c.enableRotate)return;U(e),c.update();break;case u.TOUCH_PAN:if(!1===c.enablePan)return;K(e),c.update();break;case u.TOUCH_DOLLY_PAN:if(!1===c.enableZoom&&!1===c.enablePan)return;!function(e){c.enableZoom&&V(e),c.enablePan&&K(e)}(e),c.update();break;case u.TOUCH_DOLLY_ROTATE:if(!1===c.enableZoom&&!1===c.enableRotate)return;!function(e){c.enableZoom&&V(e),c.enableRotate&&U(e)}(e),c.update();break;default:d=u.NONE}}(e):function(e){if(!1===c.enabled)return;switch(d){case u.ROTATE:if(!1===c.enableRotate)return;!function(e){y.set(e.clientX,e.clientY),O.subVectors(y,P).multiplyScalar(c.rotateSpeed);var t=c.domElement;x(2*Math.PI*O.x/t.clientHeight),Y(2*Math.PI*O.y/t.clientHeight),P.copy(y),c.update()}(e);break;case u.DOLLY:if(!1===c.enableZoom)return;!function(e){L.set(e.clientX,e.clientY),M.subVectors(L,w),M.y>0?C(k()):M.y<0&&S(k()),w.copy(L),c.update()}(e);break;case u.PAN:if(!1===c.enablePan)return;!function(e){A.set(e.clientX,e.clientY),N.subVectors(A,T).multiplyScalar(c.panSpeed),_(N.x,N.y),T.copy(A),c.update()}(e)}}(e))}function G(e){ee(e),0===j.length&&(c.domElement.releasePointerCapture(e.pointerId),c.domElement.removeEventListener("pointermove",B),c.domElement.removeEventListener("pointerup",G)),c.dispatchEvent(p),d=u.NONE}function W(e){ee(e)}function q(e){!1!==c.enabled&&!1!==c.enableZoom&&d===u.NONE&&(e.preventDefault(),c.dispatchEvent(m),function(e){e.deltaY<0?S(k()):e.deltaY>0&&C(k()),c.update()}(e),c.dispatchEvent(p))}function $(e){!1!==c.enabled&&!1!==c.enablePan&&function(e){var t=!1;switch(e.code){case c.keys.UP:_(0,c.keyPanSpeed),t=!0;break;case c.keys.BOTTOM:_(0,-c.keyPanSpeed),t=!0;break;case c.keys.LEFT:_(c.keyPanSpeed,0),t=!0;break;case c.keys.RIGHT:_(-c.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),c.update())}(e)}function J(e){!1!==c.enabled&&e.preventDefault()}function ee(e){delete R[e.pointerId];for(var t=0;t<j.length;t++)if(j[t].pointerId==e.pointerId)return void j.splice(t,1)}function te(e){var t=R[e.pointerId];void 0===t&&(t=new s.FM8,R[e.pointerId]=t),t.set(e.pageX,e.pageY)}function ne(e){var t=e.pointerId===j[0].pointerId?j[1]:j[0];return R[t.pointerId]}return c.domElement.addEventListener("contextmenu",J),c.domElement.addEventListener("pointerdown",Q),c.domElement.addEventListener("pointercancel",W),c.domElement.addEventListener("wheel",q,{passive:!1}),r.update(),r}return(0,a.Z)(n)}(s.pBf)}}]);