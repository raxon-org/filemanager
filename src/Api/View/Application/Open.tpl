{{$response = (object) [
    'extension' => $extension,
    'class' => 'dialog dialog-active dialog-message'
]}}
{{$response|>json.encode:'JSON_PRETTY_PRINT'}}