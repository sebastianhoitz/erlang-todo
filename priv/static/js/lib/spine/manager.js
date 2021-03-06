(function() {
  var $;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  if (typeof Spine === "undefined" || Spine === null) {
    Spine = require('spine');
  }
  $ = Spine.$;
  Spine.Manager = (function() {
    __extends(Manager, Spine.Module);
    Manager.include(Spine.Events);
    function Manager() {
      this.controllers = [];
      this.bind('change', this.change);
      this.add.apply(this, arguments);
    }
    Manager.prototype.add = function() {
      var cont, controllers, _i, _len, _results;
      controllers = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = controllers.length; _i < _len; _i++) {
        cont = controllers[_i];
        _results.push(this.addOne(cont));
      }
      return _results;
    };
    Manager.prototype.addOne = function(controller) {
      controller.bind('active', __bind(function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.trigger.apply(this, ['change', controller].concat(__slice.call(args)));
      }, this));
      controller.bind('release', __bind(function() {
        return this.controllers.splice(this.controllers.indexOf(controller), 1);
      }, this));
      return this.controllers.push(controller);
    };
    Manager.prototype.deactivate = function() {
      return this.trigger.apply(this, ['change', false].concat(__slice.call(arguments)));
    };
    Manager.prototype.change = function() {
      var args, cont, current, _i, _len, _ref, _results;
      current = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = this.controllers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cont = _ref[_i];
        _results.push(cont === current ? cont.activate.apply(cont, args) : cont.deactivate.apply(cont, args));
      }
      return _results;
    };
    return Manager;
  })();
  Spine.Controller.include({
    active: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (typeof args[0] === 'function') {
        this.bind('active', args[0]);
      } else {
        args.unshift('active');
        this.trigger.apply(this, args);
      }
      return this;
    },
    isActive: function() {
      return this.el.hasClass('active');
    },
    activate: function() {
      this.el.addClass('active');
      return this;
    },
    deactivate: function() {
      this.el.removeClass('active');
      return this;
    }
  });
  if (typeof module !== "undefined" && module !== null) {
    module.exports = Spine.Manager;
  }
}).call(this);
