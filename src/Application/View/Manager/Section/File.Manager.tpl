{{RAX}}
{{block.html()}}
<section id="{{$id}}" name="{{$section.name}}" class="display-none">
    <div class="dialog dialog-{{config('controller.name')}}-main">
        <div class="head" data-title="{{__('file.manager.title')}} | {{$request.file|>default:''}}">
            <h1><img src="{{route.get($section.name + '-icon')}}" class="icon" /> {{__('file.manager.title')}}</h1>
            <span class="close"><i class="fas fa-window-close"></i></span>
            <span class="minimize"><i class="far fa-window-minimize"></i></span>
        </div>
        <div class="menu">
            <ul>
                <li class="file">{{__('file.manager.file')}}</li>
            </ul>
            <div class="menu-file-protector display-none">
            </div>
            <div class="menu-file display-none">
                <ul>
                    /*
                    <li>New</li>
                    <li>Open</li>
                    <li class="menu-file-save">Save</li>
                    <li>Save as</li>
                    <li>Print</li>
                    */
                    <li class="menu-file-exit">{{__('file.manager.exit')}}</li>
                </ul>
            </div>
        </div>
        <div class="menu-application-file-manager">
            <ul>
                <li class="previous" title="{{__('file.manager.previous')}}"><i class="fas fa-chevron-left"></i></li>
                <li class="next" title="{{__('file.manager.next')}}"><i class="fas fa-chevron-right"></i></li>
                <li class="refresh" title="{{__('file.manager.refresh')}}"><i class="fas fa-sync"></i></li>
                <li class="upload" title="{{__('file.manager.upload')}}"><i class="fas fa-upload"></i></li>
            </ul>
        </div>
        <div class="body">
            <div class="address-bar">
            </div>
            <div class="tree">
            </div>
            <div class="list">
                <p class="loading">
                    <i class="fas fa-spinner fa-spin"></i><br>
                    <span>{{__('file.manager.loading')}}</span>
                </p>
            </div>
        </div>
        <div class="footer">
            <span class="item"></span>
            <span class="size"></span>
        </div>
    </div>
</section>
{{/block}}