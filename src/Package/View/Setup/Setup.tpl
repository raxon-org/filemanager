{{$register = Package.Raxon.Filemanager:Init:register()}}
{{if(!is.empty($register))}}
{{Package.Raxon.Filemanager:Import:role.system()}}
{{$flags = flags()}}
{{$options = options()}}
{{Package.Raxon.Filemanager:Main:install($flags, $options)}}
{{/if}}