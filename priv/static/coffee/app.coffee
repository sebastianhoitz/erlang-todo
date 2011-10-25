$ = jQuery

class Todo extends Spine.Model
	@configure "Todo", "id", "subject", "done"

	@extend Spine.Model.Ajax

	@url: "/todo/index"

	@active: ->
		@select (item) -> !item.done

	@done: ->
		@select (item) -> !!item.done


class Todos extends Spine.Controller
	events:
		"change input[type=checkbox]": "toggle"
		"dblclick": "edit"
		"blur input[type=text]": "close"
		"keypress input[type=text]": "blurOnEnter"
	
	elements:
		"input[type=text]": "input"

	constructor: ->
		super
		@item.bind("update", @render)
		@item.bind("destroy", @remove)

	render: =>
		@replace $("#todoTemplate").tmpl(@item)
		@

	toggle: ->
		@item.done = !@item.done
		@item.save()
	
	edit: ->
		@el.addClass("editing")
		@input.focus()
	
	blurOnEnter: (e) ->
		if e.keyCode is 13 then e.target.blur()
	
	close: ->
		@el.removeClass("editing")
		@item.updateAttributes({subject: @input.val()})

	remove: =>
		@el.remove()

class App extends Spine.Controller
	events:
		"submit form": "create"
		"click .clear": "clear"

	elements:
		".items": "items"
		"form input": "input"
		".countVal": "count"

	constructor: ->
		super

		@log("Inizialized")
		Todo.bind("create", @addOne)
		Todo.bind("refresh", @addAll)
		Todo.bind("refresh change", @renderCount)
		Todo.fetch()

	# Add a single todo item
	addOne: (todo) =>
		view = new Todos(item: todo)
		@items.append(view.render().el)

	# After a refresh
	addAll: =>
		Todo.each(@addOne)

	# Create a new todo
	create: (e) ->
		e.preventDefault()
		Todo.create(subject: @input.val())
		@input.val("")
	
	renderCount: =>
		active = Todo.active().length
		@count.text(active)

window.App = App
window.Todo = Todo
window.Todos = Todos

$ ->

	# We have to load this as external file, because otherwise
	# Erlang throws errors because it wants to interpret {{if}} conditions by
	# jQuery tmpl.
	$.get "/static/views/todoTemplate.html", (template) ->
		$("body").append template

		# Once the templates are loaded, we can start the app.
		new App(el: $("#app"))
