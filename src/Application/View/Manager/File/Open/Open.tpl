{{require(config('controller.dir.view') + 'Application/Init.tpl')}}
{{$request.method = 'replace-with-or-append-to'}}
{{$request.target = html.target.create('section', ['name' => config('controller.name') + '-open'])}}
{{$request.append.to = 'body'}}
{{script('module')}}{{require(config('controller.dir.view') + config('controller.title') + '/Module/Open.js')}}{{/script}}
{{require(config('controller.dir.view') + config('controller.title') + '/Open/Section/Dialog.tpl')}}