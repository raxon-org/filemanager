{{$response = (object) [
    'extension' => $extension,
    'message' => $message,
    'class' => 'dialog dialog-active dialog-message', 
    'html' => require(config('controller.dir.view') + 'Application/Dialog.tpl')
]}}
{{$response|>json.encode:'JSON_PRETTY_PRINT'}}