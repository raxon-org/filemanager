{{dd('{{$response}}')}}
{{block.html()}}
<section name="application-message" class="display-none">
    <div class="{{$class}}">
        <div class="head">
            <h1><img src="/Application/Filemanager/Icon/Icon.png" class="icon"> Message </h1>
            <span class="close"><i class="fas fa-window-close"></i></span><span class="minimize"><i class="far fa-window-minimize"></i></span>
        </div>
        <div class="body">
            <p class="message">' + data?.message + '</p>
            <form name="message">
                <button type="submit" name="ok">Ok</button>
            </form>
        </div>
    </div>
</section>
{{/block}}