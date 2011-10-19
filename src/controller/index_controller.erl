-module(todomanager_index_controller, [Req]).
-compile(export_all).


index('GET', []) ->
	Todos = boss_db:find(todo, []),
	{ok, [{todos, Todos}]};

index('GET', ["format", Format]) ->
	Todos = boss_db:find(todo, []),
	{json, [{todos, Todos}]}.
