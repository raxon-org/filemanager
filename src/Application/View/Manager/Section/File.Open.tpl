<section id="{{$id}}" name="application-file-{{config('controller.name')}}-open" class="display-none">
    <div class="dialog dialog-{{config('controller.name')}}-open">
        <div class="head">
            <h1><i class="fas fa-cog"></i> Applications</h1>
            <span class="close"><i class="fas fa-window-close"></i></span>
        </div>
        <div class="body">
            <ul class="application-open">
            {{if(is.array($request.list))}}
                {{foreach($request.list as $nr => $node)}}
                {{dd($node)}}
                    {{$node.url = parse.string($node.url)}}// $url.$environment : new writing in parse todo...
                    {{$node.icon = parse.string($node.icon)}}
                    {{$request.extension = $request.file|>file.extension}}
                    {{$node.contentType = config('contentType.' + $request.extension)}}
                    <li data-file="{{$request.file|>default:''}}" data-extension="{{$request.extension|>default:''}}" data-url="{{$node.url|>default:''}}" data-contenttype="{{$node.contentType|>default:''}}">
                        <img class="icon-url" src="{{$node.icon|>default:''}}" alt="" />
                        <span class="name">
                        {{$node.display.name|>default:$node.name|>default:''}}
                        </span>
                    </li>
                {{/foreach}}
            {{/if}}
            </ul>
        </div>
    </div>
</section>