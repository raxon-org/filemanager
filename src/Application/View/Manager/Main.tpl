{{RAX}}
{{require(config('controller.dir.view') + config('controller.title') + '/Init.tpl')}}
{{$request.method = 'replace-with-or-append-to'}}
{{$request.target = html.target.create('section', ['id' => $id])}}
{{$request.append.to = 'body'}}
{{require(config('controller.dir.view') + config('controller.title') + '/Section.tpl')}}
{{script('module')}}
{{require(config('controller.dir.view') + config('controller.title') + '/Module/Main.js')}}
{{/script}}