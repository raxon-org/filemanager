{{$dir.root = config('controller.dir.root')}}
{{$dir.root = $dir.root|>string.replace:'/Controller':'/'}}
{{$response = (object) [
    'application' => $application,
    'extension' => $extension,
    'message' => $message,
    'class' => 'dialog dialog-active dialog-message',
    'html' => require($dir.root + '/Application/Dialog.tpl')
]}}
{{$response|>json.encode:'JSON_PRETTY_PRINT'}}