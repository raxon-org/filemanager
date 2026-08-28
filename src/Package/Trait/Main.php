<?php
namespace Package\Raxon\Filemanager\Trait;

use Exception;
use Raxon\App;
use Raxon\Config;
use Raxon\Exception\DirectoryCreateException;
use Raxon\Exception\ObjectException;
use Raxon\Module\Cli;
use Raxon\Module\Data;
use Raxon\Module\Dir;
use Raxon\Module\Core;
use Raxon\Module\File;
use Raxon\Node\Module\Node;
use Raxon\Parse\Module\Parse;

trait Main {
    const NAME = 'Filemanager';
    const ROUTE_NAME = 'application.file.manager';

    const ROLES_ALLOWED = [
        'ROLE_ADMIN',
        'ROLE_USER',
        'ROLE_BACKLOG',
        'ROLE_SYSTEM',
        'ROLE_DOCUMENTER',
        'ROLE_TESTER',
    ];

    /**
     * @throws DirectoryCreateException
     * @throws Exception
     */
    public function install($flags, $options): void
    {
        $object = $this->object();
        if($object->config(Config::POSIX_ID) !== 0){
            return;
        }
        $has_frontend = false;
        if(property_exists($options, 'frontend')){
            if(property_exists($options->frontend, 'host')){                
                $has_frontend = true;
                $frontend_options = [
                    'where' => [
                        [
                            'value' => $options->frontend->host,
                            'attribute' => 'name',
                            'operator' => 'partial',
                        ]
                    ]
                ];
            }                
        }        
        $has_backend = false;
        if(property_exists($options, 'backend')){
            if(property_exists($options->backend, 'host')){                
                $has_backend = true;
                $backend_options = [
                    'where' => [
                        [
                            'value' => $options->backend->host,
                            'attribute' => 'name',
                            'operator' => 'partial',
                        ]
                    ]
                ];                
            }
        }
        if($has_frontend === false){
            throw new Exception('Frontend.host option is required and must be defined in Node/System.Host.json aborting...');
        }
        if($has_backend === false){
            throw new Exception('Backend.host option is required and must be defined in Node/System.Host.json aborting...');
        }
        $class = 'System.Host';
        $node = new Node($object);
        $response_frontend = $node->record($class, $node->role_system(), $frontend_options);
        $response_backend = $node->record($class, $node->role_system(), $backend_options);
        if($response_frontend === null){
            throw new Exception('Frontend.host option is required and must be defined in Node/System.Host.json aborting...');
        }
        if($response_backend     === null){
            throw new Exception('Backend.host option is required and must be defined in Node/System.Host.json aborting...');
        }
        $dir_read = $object->config('project.dir.vendor') .
            $object->request('package') .
            $object->config('ds') .
            'src' .
            $object->config('ds') .
            $object->config('dictionary.application') .
            $object->config('ds')
        ;
        $dir_application = $object->config('project.dir.domain') .
            $response_frontend['node']->name .
            $object->config('ds') .
            $object->config('dictionary.application') .
            $object->config('ds')
        ;
        $dir_target = $dir_application .
            self::NAME .
            $object->config('ds')
        ;
        if(!File::exist($dir_target)){
            Dir::create($dir_target, Dir::CHMOD);
            File::permission($object, [
                'target' => $dir_target,
                'application' => $dir_application,
            ]);
        }
        $dir = new Dir();
        $read = $dir->read($dir_read, true);
        foreach($read as $nr => $file){
            $explode = explode($dir_read, $file->url, 2);
            if(array_key_exists(1, $explode)){
                $file->target = $dir_target . $explode[1];
            }
        }
        foreach($read as $nr => $file){
            if($file->type === Dir::TYPE){
                if(!File::exist($file->target)){
                    Dir::create($file->target, Dir::CHMOD);
                    File::permission($object, [
                        'target' => $file->target,
                    ]);
                }
            }
        }
        $patch = $options->patch ?? null;
        foreach($read as $nr => $file){
            if($file->type === File::TYPE){
                $file->extension = File::extension($file->target);
                if($file->extension === 'rax'){
                    $explode = explode('.rax', $file->target, 2);
                    if(array_key_exists(1, $explode)){
                        $file->target = $explode[0];
                        $file->original_extension = File::extension($file->target);
                        if(!File::exist($file->target) || $patch !== null){
                            $clone_options = new Data();
                            if(!property_exists($response_frontend['node'],'subdomain')){
                                $clone_options->set('frontend.host', $response_frontend['node']->domain . '.' . $response_frontend['node']->extension);
                            } else {
                                $clone_options->set('frontend.host', $response_frontend['node']->subdomain . '.' . $response_frontend['node']->domain . '.' . $response_frontend['node']->extension);
                            }
                            if(!property_exists($response_backend['node'],'subdomain')){
                                $clone_options->set('backend.host', $response_backend['node']->domain . '.' . $response_backend['node']->extension);
                            } else {
                                $clone_options->set('backend.host', $response_backend['node']->subdomain . '.' . $response_backend['node']->domain . '.' . $response_backend['node']->extension);
                            }
                            $data = new Data($object->data());
                            $clone = clone $object;
                            $clone->data(App::OPTIONS, $clone_options->data());                                                        
                            switch($file->original_extension){
                                case 'json':                                    
                                    echo Cli::info('Processing file:') . $file->target . PHP_EOL;
                                    $content = $clone->parse_read($file->url);                                    
                                    if($patch !== null) {
                                        File::delete($file->target);
                                    }                                    
                                    File::write($file->target, Core::object($content->data(), Core::JSON));
                                    File::permission($object, [
                                        'target' => $file->target,
                                    ]);
                                    //imports should be in a json file (class => url/contains)
                                    if(str_contains($file->target, 'System.Route')){
                                        $command = 'app raxon/node object import -class=System.Route -url="' . $file->target . '" -patch';
                                        Core::execute($object, $command, $output, $notification);
                                        if($output){
                                            echo $output;
                                        }
                                        if($notification){
                                            echo $notification;
                                        }
                                    }
                                break;
                                default:
                                    echo Cli::info('Processing file:') . $file->target . PHP_EOL;
                                    $clone_options->set('source', $file->url);
                                    $flags = App::flags($clone);
                                    $parse = new Parse($clone, $data, $flags, $clone_options->data());
                                    $read = File::read($file->url);                                                                                                            
                                    $content = $parse->compile($read, $data);
                                    if($patch !== null) {
                                        File::delete($file->target);
                                    }                                    
                                    File::write($file->target, $content);
                                    File::permission($object, [
                                        'target' => $file->target,
                                    ]);
                                break;
                            }
                        }                                    
                    }
                } else {
                    if($patch !== null) {
                        File::delete($file->target);
                    }
                    echo Cli::info('Processing file:') . $file->target . PHP_EOL;
                    File::copy($file->url, $file->target);                    
                    File::permission($object, [
                        'target' => $file->target,
                    ]);
                }                
            }
        }
        $command = 'app install raxon/account -patch';
        Core::execute($object, $command, $output, $notification);
        if($output){
            echo $output;
        }
        if($notification){
            echo $notification;
        }
        // get all admin users

        $list = $this->user_list();
        $this->navigation_create($list, $options);
    }

    /**
     * @throws ObjectException
     * @throws Exception
     */
    public function navigation_create(array $list, object|null $options=null): void
    {
        $patch = $options->patch ?? null;
        $object = $this->object();
        foreach($list as $nr => $user){
            if(
                is_object($user) &&
                property_exists($user, 'uuid')
            ) {
                $node = new Node($object);
                $class = 'Application.Desktop.Navigation';
                $role = $node->role_system();
                $response = $node->record(
                    $class,
                    $role,
                    [
                        'where' => [
                            [
                                'attribute' => 'name',
                                'operator' => '===',
                                'value' => self::NAME,
                            ],
                            'and',
                            [
                                'attribute' => 'user',
                                'operator' => '===',
                                'value' => $user->uuid,
                            ]
                        ],
                        'relation' => false
                    ]
                );
                if ($response === null) {
                    $record = [
                        "name" => self::NAME,
                        "user" => $user->uuid ?? null,
                        "route" => (object)[
                            'name' => self::ROUTE_NAME,
                            'get' => '{{route.name($this.name)}}'
                        ],
                        "url" => '{{route.get($this.route.get)}}',
                        "svg" => '/Application/' . self::NAME . '/Icon/Icon.png',
                        "icon" => '/Application/' . self::NAME . '/Icon/Icon.png'
                    ];
                    $response = $node->create($class, $role, $record);
                    dd($response);
                }
                elseif(
                    $response &&
                    $patch
                ) {
                    dd($response);
                    $patch_record = [
                        "name" => self::NAME,
                        "user" => $user->uuid ?? null,
                        "route" => (object)[
                            'name' => self::ROUTE_NAME,
                            'get' => '{{route.name($this.name)}}'
                        ],
                        "url" => '{{route.get($this.route.get)}}',
                        "svg" => '/Application/' . self::NAME . '/Icon/Icon.png',
                        "icon" => '/Application/' . self::NAME . '/Icon/Icon.png'
                    ];
                    $response = $node->patch($class, $role, $patch_record);
                    ddd($response);
                }
            }
        }
    }

    /**
     * @throws ObjectException
     * @throws Exception
     */
    public function user_list(): array
    {
        $object = $this->object();
        $list = [];
        $node = new Node($object);
        $class = 'Account.User';
        $role_system = $node->role_system();
        $limit = 100;
        $count = $node->count($class, $role_system);
        $page_count = 1;
        if($limit > 0){
            $page_count = ceil($count / $limit);
        }
        $sort = $object->request('sort');
        if(empty($sort)){
            $sort = [
                'uuid' => 'ASC'
            ];
        }
        $filter = $object->request('filter');
        if(empty($filter)){
            $filter = [];
        }
        elseif(!is_array($filter)){
            throw new Exception('Filter must be an array.');
        }
        for($page = 1; $page <= $page_count; $page++){
            $response = $node->list($class, $role_system, [
                "relation" => true,
                'sort' => $sort,
                'filter' => $filter,
                'limit' =>  $limit,
                'page' => $page
            ]);
            if(
                $response !== null &&
                is_array($response) &&
                array_key_exists('list', $response)
            ){
                foreach($response['list'] as $nr => $user){
                    foreach($user->role as $user_role){
                        if(in_array($user_role->name, self::ROLES_ALLOWED, true)){
                            $user->password = '[redacted]';
                            $list[] = $user;
                        }
                    }
                }
            }
        }
        return $list;
    }
}