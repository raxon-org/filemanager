{{$register = Package.Raxon.App.Filemanager:Init:register()}}
{{if(!is.empty($register))}}
{{Package.Raxon.App.Filemanager:Import:role.system()}}
{{$flags = flags()}}
{{$options = options()}}
{{Package.Raxon.App.Filemanager:Main:install($flags, $options)}}
{{/if}}