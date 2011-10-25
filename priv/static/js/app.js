(function() {
  var $, App, Todo, Todos;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  Todo = (function() {
    __extends(Todo, Spine.Model);
    function Todo() {
      Todo.__super__.constructor.apply(this, arguments);
    }
    Todo.configure("Todo", "id", "subject", "done");
    Todo.extend(Spine.Model.Ajax);
    Todo.url = "/todo/index";
    Todo.active = function() {
      return this.select(function(item) {
        return !item.done;
      });
    };
    Todo.done = function() {
      return this.select(function(item) {
        return !!item.done;
      });
    };
    return Todo;
  })();
  Todos = (function() {
    __extends(Todos, Spine.Controller);
    Todos.prototype.events = {
      "change input[type=checkbox]": "toggle",
      "dblclick": "edit",
      "blur input[type=text]": "close",
      "keypress input[type=text]": "blurOnEnter"
    };
    Todos.prototype.elements = {
      "input[type=text]": "input"
    };
    function Todos() {
      this.remove = __bind(this.remove, this);
      this.render = __bind(this.render, this);      Todos.__super__.constructor.apply(this, arguments);
      this.item.bind("update", this.render);
      this.item.bind("destroy", this.remove);
    }
    Todos.prototype.render = function() {
      this.replace($("#todoTemplate").tmpl(this.item));
      return this;
    };
    Todos.prototype.toggle = function() {
      this.item.done = !this.item.done;
      return this.item.save();
    };
    Todos.prototype.edit = function() {
      this.el.addClass("editing");
      return this.input.focus();
    };
    Todos.prototype.blurOnEnter = function(e) {
      if (e.keyCode === 13) {
        return e.target.blur();
      }
    };
    Todos.prototype.close = function() {
      this.el.removeClass("editing");
      return this.item.updateAttributes({
        subject: this.input.val()
      });
    };
    Todos.prototype.remove = function() {
      return this.el.remove();
    };
    return Todos;
  })();
  App = (function() {
    __extends(App, Spine.Controller);
    App.prototype.events = {
      "submit form": "create",
      "click .clear": "clear"
    };
    App.prototype.elements = {
      ".items": "items",
      "form input": "input",
      ".countVal": "count"
    };
    function App() {
      this.renderCount = __bind(this.renderCount, this);
      this.addAll = __bind(this.addAll, this);
      this.addOne = __bind(this.addOne, this);      App.__super__.constructor.apply(this, arguments);
      this.log("Inizialized");
      Todo.bind("create", this.addOne);
      Todo.bind("refresh", this.addAll);
      Todo.bind("refresh change", this.renderCount);
      Todo.fetch();
    }
    App.prototype.addOne = function(todo) {
      var view;
      view = new Todos({
        item: todo
      });
      return this.items.append(view.render().el);
    };
    App.prototype.addAll = function() {
      return Todo.each(this.addOne);
    };
    App.prototype.create = function(e) {
      e.preventDefault();
      Todo.create({
        subject: this.input.val()
      });
      return this.input.val("");
    };
    App.prototype.renderCount = function() {
      var active;
      active = Todo.active().length;
      return this.count.text(active);
    };
    return App;
  })();
  window.App = App;
  window.Todo = Todo;
  window.Todos = Todos;
  $(function() {
    return $.get("/static/views/todoTemplate.html", function(template) {
      $("body").append(template);
      return new App({
        el: $("#app")
      });
    });
  });
}).call(this);
