!function(){"use strict";L.Marker.Measurement=L[L.Layer?"Layer":"Class"].extend({options:{pane:"markerPane"},initialize:function(e,t,s,n,a){L.setOptions(this,a),this._latlng=e,this._measurement=t,this._title=s,this._rotation=n},addTo:function(e){return e.addLayer(this),this},onAdd:function(e){this._map=e;var t=this.getPane?this.getPane():e.getPanes().markerPane,s=this._element=L.DomUtil.create("div","leaflet-zoom-animated leaflet-measure-path-measurement",t),n=L.DomUtil.create("div","",s);n.title=this._title,n.innerHTML=this._measurement,e.on("zoomanim",this._animateZoom,this),this._setPosition()},onRemove:function(e){e.off("zoomanim",this._animateZoom,this),(this.getPane?this.getPane():e.getPanes().markerPane).removeChild(this._element),this._map=null},_setPosition:function(){L.DomUtil.setPosition(this._element,this._map.latLngToLayerPoint(this._latlng)),this._element.style.transform+=" rotate("+this._rotation+"rad)"},_animateZoom:function(e){var t=this._map._latLngToNewLayerPoint(this._latlng,e.zoom,e.center).round();L.DomUtil.setPosition(this._element,t),this._element.style.transform+=" rotate("+this._rotation+"rad)"}}),L.marker.measurement=function(e,t,s,n,a){return new L.Marker.Measurement(e,t,s,n,a)};var e=function(e){var t;return this._measurementOptions.imperial?e>404.685642?(e/=4046.85642,t="ac"):(e/=.09290304,t="ftÂ˛"):this._measurementOptions.ha?e>1e9?(e/=1e9,t="kmÂ˛"):e>1e4?(e/=1e4,t="ha"):t="mÂ˛":e>1e6?(e/=1e6,t="kmÂ˛"):t="mÂ˛",e<100?e.toFixed(1)+" "+t:Math.round(e)+" "+t},t=6378137,s=function(){var e=this.options.measurementOptions&&this.options.measurementOptions.showOnHover;this.options.showMeasurements&&!e&&this.showMeasurements(),this.options.showMeasurements&&e&&(this.on("mouseover",(function(){this.showMeasurements()})),this.on("mouseout",(function(){this.hideMeasurements()})))},n=function(e,t,s){return s?function(){return t.apply(this,arguments),e.apply(this,arguments)}:function(){var s=e.apply(this,arguments),n=Array.prototype.slice.call(arguments);return n.push(s),t.apply(this,n)}};L.Polyline.include({showMeasurements:function(e){return!this._map||this._measurementLayer||(this._measurementOptions=L.extend({showOnHover:e&&e.showOnHover||!1,minPixelDistance:30,showDistances:!0,showArea:!0,showTotalDistance:!0,lang:{totalLength:"Total length",totalArea:"Total area",segmentLength:"Segment length"}},e||{}),this._measurementLayer=L.layerGroup().addTo(this._map),this.updateMeasurements(),this._map.on("zoomend",this.updateMeasurements,this)),this},hideMeasurements:function(){return this._map?(this._map.off("zoomend",this.updateMeasurements,this),this._measurementLayer?(this._map.removeLayer(this._measurementLayer),this._measurementLayer=null,this):this):this},onAdd:n(L.Polyline.prototype.onAdd,(function(e){var t=this.options.measurementOptions&&this.options.measurementOptions.showOnHover;return this.options.showMeasurements&&!t&&this.showMeasurements(this.options.measurementOptions),e})),onRemove:n(L.Polyline.prototype.onRemove,(function(e){return this.hideMeasurements(),e}),!0),setLatLngs:n(L.Polyline.prototype.setLatLngs,(function(e){return this.updateMeasurements(),e})),spliceLatLngs:n(L.Polyline.prototype.spliceLatLngs,(function(e){return this.updateMeasurements(),e})),formatDistance:function(e){var t,s;return this._measurementOptions.imperial?(s=e/.3048)>3e3?(e/=1609.344,t="mi"):(e=s,t="ft"):e>1e3?(e/=1e3,t="km"):t="m",e<100?e.toFixed(1)+" "+t:Math.round(e)+" "+t},formatArea:e,updateMeasurements:function(){if(!this._measurementLayer)return this;var e,s,n,a,i,r,o=this.getLatLngs(),m=this instanceof L.Polygon,h=this._measurementOptions,u=0;if(o&&o.length&&L.Util.isArray(o[0])&&(o=o[0]),this._measurementLayer.clearLayers(),this._measurementOptions.showDistances&&o.length>1){e=this._measurementOptions.formatDistance||L.bind(this.formatDistance,this);for(var l=1,p=o.length;m&&l<=p||l<p;l++)s=o[l-1],n=o[l%p],u+=r=s.distanceTo(n),a=this._map.latLngToLayerPoint(s),i=this._map.latLngToLayerPoint(n),a.distanceTo(i)>=h.minPixelDistance&&L.marker.measurement(this._map.layerPointToLatLng([(a.x+i.x)/2,(a.y+i.y)/2]),e(r),h.lang.segmentLength,this._getRotation(s,n),h).addTo(this._measurementLayer);!m&&this._measurementOptions.showTotalDistance&&L.marker.measurement(n,e(u),h.lang.totalLength,0,h).addTo(this._measurementLayer)}if(m&&h.showArea&&o.length>2){e=h.formatArea||L.bind(this.formatArea,this);var d=function(e){var s,n,a,i,r,o=function(e){return e*Math.PI/180},m=0,h=e.length;if(h>2){for(var u=0;u<h;u++)u===h-2?(a=h-2,i=h-1,r=0):u===h-1?(a=h-1,i=0,r=1):(a=u,i=u+1,r=u+2),s=e[a],n=e[i],m+=(o(e[r].lng)-o(s.lng))*Math.sin(o(n.lat));m=m*t*t/2}return Math.abs(m)}(o);L.marker.measurement(this.getBounds().getCenter(),e(d),h.lang.totalArea,0,h).addTo(this._measurementLayer)}return this},_getRotation:function(e,t){var s=this._map.project(e),n=this._map.project(t);return Math.atan((n.y-s.y)/(n.x-s.x))}}),L.Polyline.addInitHook((function(){s.call(this)})),L.Circle.include({showMeasurements:function(e){return!this._map||this._measurementLayer||(this._measurementOptions=L.extend({showOnHover:!1,showArea:!0,lang:{totalArea:"Total area"}},e||{}),this._measurementLayer=L.layerGroup().addTo(this._map),this.updateMeasurements(),this._map.on("zoomend",this.updateMeasurements,this)),this},hideMeasurements:function(){return this._map?(this._map.on("zoomend",this.updateMeasurements,this),this._measurementLayer?(this._map.removeLayer(this._measurementLayer),this._measurementLayer=null,this):this):this},onAdd:n(L.Circle.prototype.onAdd,(function(e){var t=this.options.measurementOptions&&this.options.measurementOptions.showOnHover;return this.options.showMeasurements&&!t&&this.showMeasurements(this.options.measurementOptions),e})),onRemove:n(L.Circle.prototype.onRemove,(function(e){return this.hideMeasurements(),e}),!0),setLatLng:n(L.Circle.prototype.setLatLng,(function(e){return this.updateMeasurements(),e})),setRadius:n(L.Circle.prototype.setRadius,(function(e){return this.updateMeasurements(),e})),formatArea:e,updateMeasurements:function(){if(this._measurementLayer){var e,s,n=this.getLatLng(),a=this._measurementOptions,i=a.formatArea||L.bind(this.formatArea,this);if(this._measurementLayer.clearLayers(),a.showArea){i=a.formatArea||L.bind(this.formatArea,this);var r=(e=this.getRadius(),s=e/t,2*Math.PI*t*t*(1-Math.cos(s)));L.marker.measurement(n,i(r),a.lang.totalArea,0,a).addTo(this._measurementLayer)}}}}),L.Circle.addInitHook((function(){s.call(this)}))}();