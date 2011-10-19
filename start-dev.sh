#!/bin/sh
cd `dirname $0`
exec erl -pa $PWD/ebin \
     -pa /Library/WebServer/Documents/erlang/ChicagoBoss-0.6.3/ebin \
     -pa /Library/WebServer/Documents/erlang/ChicagoBoss-0.6.3/deps/*/ebin \
     -boss developing_app todomanager \
     -boot start_sasl -config boss -s reloader -s boss \
     -sname wildbill
