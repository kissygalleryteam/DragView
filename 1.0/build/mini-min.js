/*!build time : 2014-04-03 6:10:11 PM*/
KISSY.add("gallery/dragview/1.0/index",function(a,b,c,d,e){function f(a,b){var c=this;c.config=b,c.viewsEl=g(a),c.views=b.views,c.viewsCount=b.views.length,c.currentView=b.currentView,c.currentViewIndex=b.currentViewIndex,c.currentViewClsPrefix="."+(c.config.viewClsPrefix||"inview_"),c.viewClsPrefix="."+(c.config.viewClsPrefix||"view_"),c.init(),c._views={},c.views.map(function(a,b){c._views[a]={view:a,index:b,path:function(a){return new d(location.href).resolve("./"+a).getPath()}(a),loaded:b===c.currentViewIndex?!0:!1}})}var g=b.all;return f.prototype={init:function(){var a=this;a.initDS(),a.initEvents(),a.initRouter(),a.config.isFirstViewLoaded&&a.router.navigate(a.currentView)},initDS:function(){var a=this,b=a.viewsEl.width();a.ds=new e(a.viewsEl,{senDistance:a.config.senDistance||10,angle:Math.PI/4,checkEnabled:null,disable:!1,binds:[null,{moveSelf:!0,maxDistance:a.config.maxDistance||b/a.viewsCount,validDistance:a.config.validDistance||50,checkEnabled:function(){return!(a.currentViewIndex===a.viewsCount-1)}},null,{moveSelf:!0,maxDistance:-a.config.maxDistance||-b/a.viewsCount,validDistance:a.config.validDistance||50,checkEnabled:function(){return!(0===a.currentViewIndex)}}]})},initEvents:function(){var a=this;a.ds.on("rightPassed",function(){a.moveHandler(1,!0)},a),a.ds.on("leftPassed",function(){a.moveHandler(-1,!0)},a)},initRouter:function(){var a=this;a.router={inited:!1,changeState:function(b){var c=new d(location.href).resolve("./"+b);history.pushState(a._views[a.currentView],a.currentView,c)},listen:function(){window.addEventListener("popstate",function(){if(!a.router.inited)return void(a.router.inited=!0);var b=new d(location.href).getPath();a.router._navigate(b)},!1)},navigate:function(b){var c=a.router._navigate(b,!0);c||(location.href=b)},_navigate:function(b,c){var e=new d(location.href).resolve(b).getPath();for(var f in a._views)if(a._views.hasOwnProperty(f)&&a._views[f].view&&a._views[f].path===e){var g=a._views[f];return console.log(g),g&&g.index!=a.currentViewIndex&&a.moveHandler(g.index-a.currentViewIndex,c),!0}return!1}},a.router.listen(),window.router=a.router},moveHandler:function(a,b){var c=this;c.views.map(function(a,b){c.viewsEl.removeClass(c.currentViewClsPrefix+b)}),c.currentViewIndex=c.currentViewIndex+a,c.viewsEl.addClass(c.currentViewClsPrefix+c.currentViewIndex),c.currentView=c.views[c.currentViewIndex],c.setViewContent(c.currentViewIndex),b&&c.router.changeState(c.currentView)},setViewContent:function(a){var b=this,d=a,e=b.views[d],f=b._views[e],g=b.config.viewAjax+e;(!f.loaded||b.config.reload)&&c.get(g,function(a){var c=b.viewsEl.one(b.viewClsPrefix+d);c.html(a),f.loaded=!0})}},f},{requires:["node","io","uri","gallery/DragSwitch/1.0/"]}),KISSY.add("gallery/dragview/1.0/mini",function(a,b){return b},{requires:["./index"]});