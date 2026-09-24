{{require(config('controller.dir.view') + 'Application/Dialog.tpl')}}
/*
{{$response = (object) [
    'application' => config('application'),
    'extension' => $extension,
    'message' => $message,
    'html' => require(config('controller.dir.view') + 'Application/Dialog.tpl'),
    'script' => $script,
    'link' => $link
]}}
{{raw|>json.encode($response, 'JSON_PRETTY_PRINT')}}
*/