{{$response = (object) [
    'application' => config('application'),
    'extension' => $extension,
    'message' => $message,
    'class' => 'dialog dialog-active dialog-message',
    'html' => require(config('controller.dir.view') + 'Application/Dialog.tpl')
]}}
{{raw|>json.encode($response, 'JSON_PRETTY_PRINT')}}