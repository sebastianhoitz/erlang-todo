-module(todomanager_todo_controller, [Req]).
-compile(export_all).

%% GET todo/index
index('GET', []) ->
	Todos = boss_db:find(todo, []),
	{json, [{todos, Todos}]}.

%% GET todo/read/todo-1
read('GET', [Id]) ->
	Todo = boss_db:find(Id),
	% TODO for some reason, when we have a non-existent todo, we still output the json
	% data and don't jump to the not_found section.
	case Todo of
		Todo ->
			{json, [{todo, Todo}]};
		[] ->
			not_found
	end.

%% POST /todo/create
create('POST', []) ->
	Todo = todo:new(id, Req:post_param("subject")),
	{json, [{todo, element(2, Todo:save())}]}.

%% POST /todo/update/todo-1
update('POST', [Id]) ->
	Todo = boss_db:find(Id),
	NewTodo = Todo:subject(Req:post_param("subject")),
	{json, [{todo, element(2, NewTodo:save())}]}.
