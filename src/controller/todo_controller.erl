-module(todomanager_todo_controller, [Req]).
-compile(export_all).

%% GET todo/index
index('GET', []) ->
	Todos = boss_db:find(todo, []),
	{json, Todos};

%% GET todo/index/todo-1
index('GET', [Id]) ->
	Todo = boss_db:find(Id),
	% TODO for some reason, when we have a non-existent todo, we still output the json
	% data and don't jump to the not_found section.
	case Todo of
		Todo ->
			{json, [{todo, Todo}]};
		[] ->
			not_found
	end;

%% POST todo/index
index('POST', []) ->
	Body = element(2, mochijson:decode(Req:request_body())),
	io:format("~p", [proplists:get_value("subject", Body)]),
	Todo = todo:new(id, proplists:get_value("subject", Body), false),
	%io:format("~p", [Todo]),
	{json, [{todo, element(2, Todo:save())}]};

%% PUT todo/index/123
index('PUT', [Id]) ->
	Todo = boss_db:find(Id),
	Body = element(2, mochijson:decode(Req:request_body())),
	%% Set the new values
	NewTodo = Todo:attributes([
			{subject, proplists:get_value("subject", Body)},
			{done, proplists:get_value("done", Body)}
		])
,
	{json, [{todo, element(2, NewTodo:save())}]}.

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
