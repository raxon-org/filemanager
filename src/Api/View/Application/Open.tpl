{{$response = (object) [
    'extension' => $extension,
    'message' => $message,
    'class' => 'dialog dialog-active dialog-message',
    'html' => require('./Dialog.tpl')
]}}
{{$response|>json.encode:'JSON_PRETTY_PRINT'}}