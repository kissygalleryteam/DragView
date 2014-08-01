/*
combined files : 

kg/DragView/2.0.0/index

*/
/**
 * @fileoverview 
 * @author 筱谷<xiaogu.gxb@taobao.com>
 * @module dragview
 **/
KISSY.add('kg/DragView/2.0.0/index',function(S, Node, IO, Uri, DS){
    var $ = Node.all;

    function DragView(el, config) {
        var self = this;
        self.config               = config;
        self.viewsEl              = $(el);
        self.views                = config.views;
        self.viewsCount           = config.views.length;
        self.currentView          = config.currentView;
        self.currentViewIndex     = config.currentViewIndex;
        self.currentViewClsPrefix = "." + (self.config.viewClsPrefix || "inview_");
        self.viewClsPrefix        = "." + (self.config.viewClsPrefix || "view_");
        self.init();
        self._views               = {}
        self.views.map(function(val, key){
            self._views[val] = {
                view: val,
                index: key,
                path: (function(path){
                    return new Uri(location.href).resolve("./" + path).getPath();
                })(val),
                loaded: key === self.currentViewIndex ? true : false
            }
        });

    }

    DragView.prototype = {
        init: function() {
            var self = this;
            self.initDS();
            self.initEvents();
            self.initRouter();
            if(self.config.isFirstViewLoaded) {
                self.router.navigate(self.currentView);
            }
        },

        initDS: function() {
            var self = this,
                viewsWidth = self.viewsEl.width();
            self.ds = new DS(self.viewsEl, {
                senDistance : self.config.senDistance || 10,
                angle       : Math.PI / 4,
                checkEnabled: null,
                disable     : false,
                binds       : [
                    null, 
                    {
                        moveSelf      : true,
                        maxDistance   : self.config.maxDistance || viewsWidth/self.viewsCount,    //注意正负值
                        validDistance : self.config.validDistance || 50, 
                        checkEnabled  : function() {
                            return !(self.currentViewIndex === self.viewsCount - 1);
                        }
                    },
                    null,
                    {
                        moveSelf      : true,
                        maxDistance   : -self.config.maxDistance || -viewsWidth/self.viewsCount,    //注意正负值
                        validDistance : self.config.validDistance || 50, 
                        checkEnabled  : function() {
                            return !(self.currentViewIndex === 0);
                        }
                    }
                ]
            });            
        },

        initEvents: function() {
            var self = this;
            self.ds.on("rightPassed", function(){
                self.moveHandler(+1, true);
            }, self);
            self.ds.on("leftPassed", function(){
                self.moveHandler(-1, true);
            }, self);
        },

        initRouter: function() {
            var self = this;
            self.router = {
                inited: false,
                changeState: function(view) {
                    var url = new Uri(location.href).resolve("./" + view);
                    history.pushState(self._views[self.currentView], self.currentView, url);
                },
                listen: function() {
                    // 需要阻止第一次触发
                    window.addEventListener('popstate', function(){
                        if(!self.router.inited) {
                            self.router.inited = true;
                            return;
                        }
                        var url = new Uri(location.href).getPath();
                        self.router._navigate(url);

                    }, false)
                },
                navigate: function(path) {
                    var success = self.router._navigate(path, true);
                    if(!success) location.href = path;
                },
                _navigate: function(path, changeState) {
                    var newUrl = new Uri(location.href).resolve(path).getPath();
                    for(var key in self._views) {
                        if(!self._views.hasOwnProperty(key)) continue;
                        if(!self._views[key].view) continue;
                        if(self._views[key].path === newUrl) {
                            var currentState = self._views[key];
                            console.log(currentState);
                            if(currentState && currentState.index != self.currentViewIndex) {
                                self.moveHandler(currentState.index - self.currentViewIndex, changeState);
                            }
                            return true;
                            break;
                        }
                    }
                    return false;
                }

            }
            self.router.listen();
            window.router = self.router;
        },

        moveHandler: function(step, changeState) {
            var self = this;
            self.views.map(function(name, index){
                self.viewsEl.removeClass(self.currentViewClsPrefix + index);
            });
            self.currentViewIndex = self.currentViewIndex + step;
            self.viewsEl.addClass(self.currentViewClsPrefix + self.currentViewIndex);
            self.currentView = self.views[self.currentViewIndex];
            self.setViewContent(self.currentViewIndex);
            if(changeState) self.router.changeState(self.currentView);
        },

        setViewContent: function(viewIndex) {
            var self = this,
                index = viewIndex,
                view = self.views[index],
                _view = self._views[view],
                url = self.config.viewAjax + view;
            if(!_view.loaded || self.config.reload) {
                IO.get(url, function(data){
                    var el = self.viewsEl.one(self.viewClsPrefix + index);
                    el.html(data);
                    _view.loaded = true;
                });
            }
        }
    }

    return DragView;
}, {
    requires: ["node", "io", "uri", "kg/DragSwitch/2.0.0/"]
});
