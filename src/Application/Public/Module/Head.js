//import { create } from "/Module/Create/Js/Create.js";
import { file } from "/Application/Filemanager/Module/File.js";
import { getSection } from "/Module/Section.js";
// import {editor} from "../../../Ace/Public/Module/Editor";
import { taskbar } from "/Application/Desktop/Module/Taskbar.js";
//import { user } from "/Module/User/Js/User.js";
//import {exception} from "/Module/Exception/Js/Exception.js";

let head = {};

head.init = () => {
    head.select();
    head.close();
}

head.close = () => {
    let section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    let close = section.select('.close');
    close.on('click', (event) => {
        taskbar.delete(section.attribute('id'));
    });
}

head.select = () => {
    const section = getSection(file.data.get('section.id'));
    if(!section){
        return;
    }
    const head = section.select('.head');
    head.on('mousedown', (event) => {
        const div = event.target.closest('div');
        if(!div){
            return;
        }
        const dialog = div.parentNode;
        if(!dialog){
            return;
        }
        const section = dialog.parentNode;
        if(!section){
            return;
        }
        file.data.set('section.id', section.attribute('id'));
        let is_active = file.data.get('context.menu.active');
        let time_is_active = file.data.get('context.menu.time.active');
        if(is_active && (microtime(true) > time_is_active + 0.5)){
            let ctx_menu = section.select('.context-menu');
            if(ctx_menu){
                ctx_menu.remove();
                file.data.delete('context.menu');
            }
            let ctx_menu_item = section.select('.context-menu-item');
            if(ctx_menu_item){
                ctx_menu_item.remove();
                file.data.delete('context.menu.item');
            }
        }
    });
}

export { head }