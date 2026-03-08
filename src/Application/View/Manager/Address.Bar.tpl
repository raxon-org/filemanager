{{RAX}}
{{require(config('controller.dir.view') + config('controller.title') + '/Init.tpl')}}
{{$request.method = 'replace'}}
{{$request.target = html.target.create('section', ['id' => $id])}}
{{$request.target += ' .address-bar'}}
{{block.html()}}
<div class="left">
</div>
<div class="middle">
    <input type="text" name="address" value="" class="file-manager-address" />
    <button type="button" class="button-up"><i class="fas fa-chevron-up"></i></button>
    <input type="search" name="search" value="" placeholder="{{__('file.manager.search')}}" />
    <button class="microphone">mic</button>
</div>
{{/block}}