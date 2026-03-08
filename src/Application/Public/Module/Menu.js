import { file } from "/Application/Filemanager/Module/File.js";
import { getSection } from "/Module/Section.js";
import { taskbar } from "/Application/Desktop/Module/Taskbar.js";
import create from "/Module/Create.js";
import user from "/Module/User.js";
//import {exception} from "/Module/Exception/Js/Exception.js";

let menu = {};

menu.init = () => {
    menu.file();
    menu.application();
    menu.refresh();
    menu.upload();
}

menu.application = () => {
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    if(typeof _('dialog').click === 'function'){
        _('dialog').click(section, '.menu-application-file-manager');
    }
}

menu.refresh = () => {
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    const menu = section.select('.menu-application-file-manager');
    if(!menu){
        return;
    }
    const refresh = menu.select('.refresh');
    if(!refresh){
        return;
    }
    refresh.on('click', (event) => {
        const section = getSection(file.data.get('section.id'));
        if(!section){
            return;
        }
        const input = section.select('input[name="address"]');
        if(!input){
            return;
        }
        if(input.val()){
            refresh.addClass('fa-spin');
            input.trigger('change');
        }
    });
}

menu.upload = () => {
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    const menu = section.select('.menu-application-file-manager');
    if(!menu){
        return;
    }
    const upload = menu.select('.upload');
    if(!upload){
        return;
    }
    upload.on('click', (event) => {
        const section = getSection(file.data.get('section.id'));
        if(!section){
            return;
        }
        const body = section.select('.body');
        if(!body){
            return;
        }
        const list = body.select('.list');
        if(!list){
            return;
        }
        const input = section.select('input[name="address"');
        if(!input){
            return;
        }
        let upload = body.select('.upload');
        if(!upload){
            list.addClass('has-upload');
            upload = create('div', 'dropzone upload');
            upload.attribute('id', 'upload-' + file.data.get('section.id'));
            body.appendChild(upload);
            let drop = new Dropzone(
                '#' + upload.attribute('id'), {
                    url: file.data.get('route.backend.upload'),
                    maxFilesize: file.data.get('upload.max.filesize'),
                    headers : {
                        "Authorization" : "Bearer " + user.token()
                    },
                    params : {
                        directory : input.val()
                    }
                }
            );
            drop.on("sending", function(file, xhr, formData) {
                //xhr.setRequestHeader('Authorization', 'Bearer ' + user.token());
                /*
                exception.authorization(() => {

                });
                 */
            });
            drop.on("complete", function(file) {
                const refresh = section.select('.refresh');
                if(!refresh){
                    return;
                }
                refresh.trigger('click');
            });
        } else {
            list.removeClass('has-upload');
            upload.remove();
        }
    });
}


menu.file = () => {
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    const menu = section.select('.menu');
    if(!menu){
        return;
    }
    const li = menu.select('li.file');
    if(!li){
        return;
    }
    const menu_file = menu.select('.menu-file');
    const menu_file_protector = menu.select('.menu-file-protector');
    li.on('click', (event) => {
        if(menu_file) {
            menu_file.toggleClass('display-none');
        }
        if(menu_file_protector){
            menu_file_protector.toggleClass('display-none');
        }
    });
    if(menu_file_protector){
        menu_file_protector.on('click', (event) => {
            if(menu_file){
                menu_file.addClass('display-none');
                menu_file_protector.addClass('display-none');
            }
        });
    }
    const menu_file_exit = menu.select('.menu-file-exit');
    if(menu_file_exit){
        menu_file_exit.on('click', (event) => {
            taskbar.delete(section.attribute('id'));
            section.remove();
        });
    }
    if(typeof _('dialog').click === 'function'){
        _('dialog').click(section, '.menu');
    }
}

export { menu }