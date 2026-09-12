<section id="{{$id}}" name="{{config('controller.name')}}-open" class="display-none">
    <div class="dialog dialog-{{config('controller.name')}}-open">
        <div class="head">
            <h1><i class="fas fa-cog"></i> Applications</h1>
            <span class="close"><i class="fas fa-window-close"></i></span>
        </div>
        <div class="body">
            <ul class="application-open">
            {{if(is.array($request.nodeList))}}
                {{foreach($request.nodeList as $nr => $node)}}
                    {{$node.url = parse.string($node.url)}}
                    {{$node.icon_url = parse.string($node.icon_url)}}
                    {{$request.extension = $request.file|>file.extension}}
                    {{$node.contentType = config('contentType.' + $request.extension)}}
                    <li data-file="{{$request.file|>default:''}}" data-extension="{{$request.extension|>default:''}}" data-url="{{$node.url|>default:''}}" data-contenttype="{{$node.contentType|>default:''}}">
                        <img class="icon-url" src="{{$node.icon_url|>default:''}}" alt="" />
                        <span class="name">
                        {{$node.name}}
                        </span>
                    </li>
                {{/foreach}}
            {{/if}}
            </ul>
        </div>
    </div>
</section>