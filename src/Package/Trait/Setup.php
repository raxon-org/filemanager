<?php
namespace Package\Raxon\Filemanager\Trait;

use Package\Raxon\Desktop\Module\Navigation;
use Package\Raxon\Account\Module\User;
use Package\Raxon\Basic\Trait\Install;
use Raxon\App;
use Raxon\Config;

use Raxon\Exception\DirectoryCreateException;
use Raxon\Module\Cli;
use Raxon\Module\Data;
use Raxon\Module\Dir;
use Raxon\Module\Core;
use Raxon\Module\File;
use Raxon\Node\Module\Node;
use Raxon\Parse\Module\Parse;

use Exception;

trait Setup {
    const NAME = 'Filemanager';
    const ROUTE_NAME = 'application.file.manager';

    use Install;
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
        $application_list = $this->install_system_application(
            $flags,
            $options,
        );
        $list = User::list($object, User::ROLES_ALLOWED);
//        $this->object($object);
        foreach($application_list as $application){
            $this->install_api($options, $application);
            $this->install_application($options, $application);
            Navigation::create(
                $object,
                $list,
                $options,
                $application
            );
        }
        $command = 'app install raxon/account -patch';
        Core::execute($object, $command, $output, $notification);
        if($output){
            echo $output;
        }
        if($notification){
            echo $notification;
        }
    }

    /**
     * @throws Exception
     */
    public function install_list(object $options): void
    {
        $object = $this->object();
        $read = $options->read ?? [];
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
                            if(!property_exists($options->frontend,'subdomain') || empty($options->frontend->subdomain)){
                                $clone_options->set('frontend.host', $options->frontend->domain . '.' . $options->frontend->extension);
                            } else {
                                $clone_options->set('frontend.host', $options->frontend->subdomain . '.' . $options->frontend->domain . '.' . $options->frontend->extension);
                            }
                            if(!property_exists($options->backend,'subdomain')  || empty($options->backend->subdomain)){
                                $clone_options->set('backend.host', $options->backend->domain . '.' . $options->backend->extension);
                            } else {
                                $clone_options->set('backend.host', $options->backend->subdomain . '.' . $options->backend->domain . '.' . $options->backend->extension);
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
                                    $dir_target = Dir::name($file->target);
                                    if(!File::exist($dir_target)){
                                        Dir::create($dir_target, Dir::CHMOD);
                                        File::permission($object, [
                                            'target' => $dir_target,
                                        ]);
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
                                    $dir_target = Dir::name($file->target);
                                    if(!File::exist($dir_target)){
                                        Dir::create($dir_target, Dir::CHMOD);
                                        File::permission($object, [
                                            'target' => $dir_target,
                                        ]);
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
                    $dir_target = Dir::name($file->target);
                    if(!File::exist($dir_target)){
                        Dir::create($dir_target, Dir::CHMOD);
                        File::permission($object, [
                            'target' => $dir_target,
                        ]);
                    }
                    File::copy($file->url, $file->target);
                    File::permission($object, [
                        'target' => $file->target,
                    ]);
                }
            }
        }
    }

    /**
     * @throws Exception
     */
    public function install_api(object $options): void
    {
        $object = $this->object();
        $dir_read = $object->config('project.dir.vendor') .
            $object->request('package') .
            $object->config('ds') .
            'src' .
            $object->config('ds') .
            $object->config('dictionary.api') .
            $object->config('ds')
        ;
        $dir_target = $object->config('project.dir.domain') .
            $options->backend->name .
            $object->config('ds')
        ;
        if(!File::exist($dir_target)){
            Dir::create($dir_target, Dir::CHMOD);
            File::permission($object, [
                'target' => $dir_target,
            ]);
        }
        $dir = new Dir();
        $read = $dir->read($dir_read, true);
        $count = 0;
        foreach($read as $nr => $file){
            if($file->type === File::TYPE){
                $explode = explode($dir_read, $file->url, 2);
                if(array_key_exists(1, $explode)){
                    $file->target = $dir_target . $explode[1];
                }
                $count++;
            } else {
                unset($read[$nr]);
            }
        }
        $options->read = $read;
        echo 'Installing API: ' . $count . ' files' . PHP_EOL;
        $this->install_list($options);
    }

    /**
     * @throws Exception
     */
    public function install_application(object $options): void
    {
        $object = $this->object();
        $dir_read = $object->config('project.dir.vendor') .
            $object->request('package') .
            $object->config('ds') .
            'src' .
            $object->config('ds') .
            $object->config('dictionary.application') .
            $object->config('ds')
        ;
        $dir_target = $object->config('project.dir.domain') .
            $options->frontend->name .
            $object->config('ds') .
            $object->config('dictionary.application') .
            $object->config('ds') .
            self::NAME .
            $object->config('ds')
        ;
        if(!File::exist($dir_target)){
            Dir::create($dir_target, Dir::CHMOD);
            File::permission($object, [
                'target' => $dir_target,
            ]);
        }
        $dir = new Dir();
        $read = $dir->read($dir_read, true);
        $count = 0;
        foreach($read as $nr => $file){
            if($file->type === File::TYPE){
                $explode = explode($dir_read, $file->url, 2);
                if(array_key_exists(1, $explode)){
                    $file->target = $dir_target . $explode[1];
                }
                $count++;
            } else {
                unset($read[$nr]);
            }
        }
        $options->read = $read;
        echo 'Installing Frontend: ' . $count . ' files' . PHP_EOL;
        $this->install_list($options);
    }
}