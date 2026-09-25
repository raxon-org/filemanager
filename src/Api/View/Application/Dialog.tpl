{{$id = 'uuid-' + uuid()}}
{{block.html()}}
<section name="application-message" class="display-none" id="{{$id}}">
    <div class="dialog dialog-active dialog-message">
        <div class="head">
            <h1><img src="/Application/Filemanager/Icon/Message.png" class="icon"> Message </h1>
            <span class="close"><i class="fas fa-window-close"></i></span><span class="minimize"><i class="far fa-window-minimize"></i></span>
        </div>
        <div class="body">
            <p class="message">{{$message}}</p>
            <form name="message">
                <button type="submit" name="ok">Ok</button>
            </form>
        </div>
    </div>
</section>
{{/block}}