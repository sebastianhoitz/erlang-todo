-module(todomanager_index_controller, [Req]).
-compile(export_all).

index('GET', []) ->
	Todos = boss_db:find(todo, []),
	{ok, [{todos, Todos}]}.

observer('GET', []) ->
	{ok, Timestamp, Messages} = boss_mq:pull("updates", now),
	{output, Messages}.
