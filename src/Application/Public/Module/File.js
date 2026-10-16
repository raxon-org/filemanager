import { date } from "/Module/Date.js";
import { getSectionById } from "/Module/Section.js";
import { object } from "/Module/Object.js";
import { round } from "/Module/Round.js";
import { __ } from "/Module/Translation.js";
import create from "/Module/Create.js";
import user from "/Module/User.js";
import { dialog } from "/Dialog/Module/Dialog.js";

let file = {};
file.data = {
    data : {},
    set : (attribute, value) => {
        if(typeof attribute === 'object'){
            for(let attr in attribute){
                object.set(attr, attribute[attr], file.data.data);
            }
        } else {
            object.set(attribute, value, file.data.data);
        }
    },
    has : (attribute) => {
        return object.has(attribute, file.data.data);
    },
    get : (attribute) => {
        return object.get(attribute, file.data.data);
    },
    delete : (attribute) => {
        return object.delete(attribute, file.data.data);
    }
};

file.read = () => {

    console.log(file.data.get());
}

file.header = (thead, tr) => {
    let th = create('th');
    tr.appendChild(th);
    th = create('th');
    th.html(__('file.manager.name'));
    tr.appendChild(th);
    th = create('th');
    th.html(__('file.manager.modified'));
    tr.appendChild(th);
    th = create('th');
    th.html(__('file.manager.type'));
    tr.appendChild(th);
    th = create('th');
    th.html(__('file.manager.size'));
    tr.appendChild(th);
    thead.appendChild(tr);
    return thead;
}

file.size = (size) => {
    const bytes = 1024;
    if(size > bytes * bytes * bytes * bytes){
        size = round(size / (bytes * bytes * bytes * bytes), 2) + '&nbsp;' + __('file.manager.TB');
    }
    else if(size > bytes * bytes * bytes){
        size = round(size / (bytes * bytes * bytes), 2) + '&nbsp;' + __('file.manager.GB');
    }
    else if(size > bytes * bytes){
        size = round(size / (bytes * bytes), 2) + '&nbsp;' + __('file.manager.MB');
    }
    else if(size > bytes){
        size = round(size / bytes, 2) + '&nbsp;' + __('file.manager.KB');
    } else {
        size += '&nbsp;' + __('file.manager.B');
    }
    return size;
}

file.context_menu = ({
    event,
    node,
    section,
    element
}) => {
    console.log(node);
    let is_active = file.data.get('context.menu.active');
    if(is_active){
        return;
    }
    file.data.set('context.menu.active', true);
    file.data.set('context.menu.time.active', microtime(true));
    // let dialog = section.select('.dialog');
    const dialog = section.select('.dialog-manager-main');
    let td_icon = element.select('.icon');
    let create_div = section.select('.context-menu');
    if(!create_div){
        create_div = create('div');
        create_div.addClass('context-menu');
    } else {
        console.log(dialog.style.zIndex);
    }
    let calculate = element.calculate('all');
    create_div.style.top = calculate.top + 'px';
    create_div.style.left = calculate.left + 'px';
    // create_div.style.top = event.clientY + 'px';
    // create_div.style.left = event.clientX + 'px';
    create_div.style.zIndex = parseInt(dialog.style.zIndex) + 1;
    let table = create('table');
    table.attribute('cellspacing', 0);
    table.attribute('cellpadding', 0);
    let tbody = create('tbody');
    let table_tr = create('tr', 'header');
    let th = create('th');
    th.html('<h3><i class="keyboard-shortcut">esc</i> Context-menu <i class="icon fas fa-window-close"></i></h3>');
    th.colSpan = 4;
    table_tr.appendChild(th);
    tbody.appendChild(table_tr);
    /**/

    /*
    let url = file.data.get('route.backend.context.menu');
    let token = user.token();
    //need api url
    //need file and content type
    let data = {
        'file' : tr.data('file'),
        'extension' : tr.data('extension')
    };
    header("Authorization", 'Bearer ' + token);
    request(url, data, (url, response) => {
        console.log(response);
    });
    console.log(url);
    console.log(data);
     */
    let index;
    for(index = 0; index < node?.contextMenu?.length; index++){
        let item = node.contextMenu[index];
        table_tr = create('tr');
        let td = create('td');
        let i = create('i');
        i.addClass(item?.icon?.class);
        i.on('mouseover', (event) => {
            let keyboard_shortcut = event.target.closest('.keyboard-shortcut');
            if(keyboard_shortcut){
                keyboard_shortcut.addClass('active');
            }
        });
        i.on('mouseout', (event) => {
            let keyboard_shortcut = event.target.closest('.keyboard-shortcut');
            if(keyboard_shortcut){
                keyboard_shortcut.removeClass('active');
            }
        });
        td.appendChild(i);
        // td.html('<i class="icon far fa-file"></i>');
        table_tr.appendChild(td);
        td = create('td');
        let keyboard_shortcut = !is.empty(item?.keyboard) ?  item.keyboard : '&nbsp;';
        td.html('<i class="keyboard-shortcut">' + keyboard_shortcut +'</i>');
        table_tr.appendChild(td);
        td = create('td');
        td.html(__(item.name));
        table_tr.appendChild(td);
        td = create('td');
        if(item?.submenu){
            let submenu = item?.submenu
            console.log(submenu);
            td.html('&#10219;');
            td.on('click', (event) => {
                file.context_menu_item({event, submenu, section, element, td});
            });
            table_tr.appendChild(td);
            tbody.appendChild(table_tr);
            table_tr.on('click', (event) => {
                file.context_menu_item({event, submenu, section, element, td});
            });
        } else {
            td.html('');
            table_tr.appendChild(td);
            tbody.appendChild(table_tr);
            table_tr.on('click', (event) => {
                console.log('name: ' + item.name);
                switch(__(item.name)){
                    case __('file.manager.contextmenu.open_with'): {
                        if(element.data('type') === 'File'){
                            file.open_file_with(element);
                        } else {
                            file.open(element);
                        }
                        break;
                    }
                    case __('file.manager.contextmenu.download'): {
                        alert('download');
                        break;
                    }
                    case __('file.manager.contextmenu.new'): {
                        alert('new');
                        break;
                    }
                    case __('file.manager.contextmenu.new_file'): {
                        alert('new file');
                        break;
                    }
                    case __('file.manager.contextmenu.new_directory'): {
                        alert('new directory');
                        break;
                    }
                    case __('file.manager.contextmenu.cut'): {
                        const context_menu = section.select('.context-menu');
                        const context_menu_item = section.select('.context-menu-item');
                        file.data.delete('context.menu.active');
                        file.data.delete('context.menu.item.active');
                        if(context_menu){
                            context_menu.remove();
                        }
                        if(context_menu_item){
                            context_menu_item.remove();
                        }
                        if(element.data('type') === 'File'){
                            let temp = element.data('file').split(element.data('dir'));
                            let name = temp.pop();
                            let item = {
                                'type': 'File',
                                'dir' : element.data('dir'),
                                'file' : element.data('file'),
                                'name' : name,
                                'extension' : element.data('extension')
                            }
                            file.data.delete('clipboard.copy');
                            let cut = file.data.get('clipboard.cut') ?? [];
                            let index;
                            let is_found = false;
                            for(index = 0; index < cut.length; index++){
                                let cut_item = cut[index];
                                if(item.file === cut_item.file){
                                    is_found = true;
                                    break;
                                }
                            }
                            if(!is_found){
                                cut.push(item);
                                file.data.set('clipboard.cut', cut);
                            }
                        } else {
                            let temp = element.data('dir').split('/');
                            temp.pop();
                            let name = temp.pop();
                            let item = {
                                'type': 'Directory',
                                'dir' : element.data('dir'),
                                'name' : name,
                            }
                            file.data.delete('clipboard.copy');
                            let cut = file.data.get('clipboard.cut') ?? [];
                            let index;
                            let is_found = false;
                            for(index = 0; index < cut.length; index++){
                                let cut_item = cut[index];
                                if(item.file === cut_item.file){
                                    is_found = true;
                                    break;
                                }
                            }
                            if(!is_found){
                                cut.push(item);
                                file.data.set('clipboard.cut', cut);
                            }
                        }
                        break;
                    }
                    case __('file.manager.contextmenu.copy'): {
                        const context_menu = section.select('.context-menu');
                        const context_menu_item = section.select('.context-menu-item');
                        file.data.delete('context.menu.active');
                        file.data.delete('context.menu.item.active');
                        if(context_menu){
                            context_menu.remove();
                        }
                        if(context_menu_item){
                            context_menu_item.remove();
                        }
                        if(element.data('type') === 'File'){
                            let temp = element.data('file').split(element.data('dir'));
                            let name = temp.pop();
                            let item = {
                                'type': 'File',
                                'dir' : element.data('dir'),
                                'file' : element.data('file'),
                                'name' : name,
                                'extension' : element.data('extension')
                            }
                            file.data.delete('clipboard.cut');
                            let copy = file.data.get('clipboard.copy') ?? [];
                            let index;
                            let is_found = false;
                            for(index = 0; index < copy.length; index++){
                                let copy_item = copy[index];
                                if(item.file === copy_item.file){
                                    is_found = true;
                                    break;
                                }
                            }
                            if(!is_found){
                                copy.push(item);
                                file.data.set('clipboard.copy', copy);
                            }
                        } else {
                            let temp = element.data('dir').split('/');
                            temp.pop();
                            let name = temp.pop();
                            let item = {
                                'type': 'Directory',
                                'dir' : element.data('dir'),
                                'name' : name,
                            }
                            file.data.delete('clipboard.cut');
                            let copy = file.data.get('clipboard.copy') ?? [];
                            let index;
                            let is_found = false;
                            for(index = 0; index < copy.length; index++){
                                let copy_item = copy[index];
                                if(item.file === copy_item.file){
                                    is_found = true;
                                    break;
                                }
                            }
                            if(!is_found){
                                copy.push(item);
                                file.data.set('clipboard.copy', copy);
                            }
                        }
                        break;
                    }
                    case __('file.manager.contextmenu.paste'): {
                        const context_menu = section.select('.context-menu');
                        const context_menu_item = section.select('.context-menu-item');
                        file.data.delete('context.menu.active');
                        file.data.delete('context.menu.item.active');
                        if(context_menu){
                            context_menu.remove();
                        }
                        if(context_menu_item){
                            context_menu_item.remove();
                        }
                        const route = {
                            rename : file.data.get('route.backend.file.rename'),
                            copy : file.data.get('route.backend.file.copy')
                        };
                        if(element.data('type') === 'File'){
                            let cut = file.data.get('clipboard.cut') ?? [];
                            let index;
                            for(index=0; index < cut.length; index++){
                                let cut_item = cut[index];
                                if(cut_item.type === 'File'){
                                    let node = {
                                        source : cut_item.file,
                                        destination : element.data('dir') + cut_item.name
                                    };
                                    const token = user.token();
                                    const refresh_token = user.refreshToken();
                                    const url_login = user.url.login();
                                    header("Authorization", 'Bearer ' + token);
                                    request(route.rename, node, (url, response) => {
                                        if(
                                            response?.class &&
                                            in_array(
                                                response?.class, [
                                                    'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                    'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                ],
                                                true
                                            )
                                        ) {
                                            user.authorization((url, data) => {
                                                if (
                                                    data?.class &&
                                                    in_array(
                                                        data?.class, [
                                                            'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                            'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                        ],
                                                        true
                                                    ) &&
                                                    refresh_token
                                                ) {
                                                    if (url_login) {
                                                        redirect(url_login);
                                                    }
                                                } else if (
                                                    data.node?.token &&
                                                    data.node?.refresh_token
                                                ) {
                                                    user.token(data.node?.token);
                                                    user.refreshToken(data.node?.refresh_token);
                                                    const original = user.data();
                                                    const user_node = data?.node || {};
                                                    delete user_node?.token;
                                                    delete user_node?.refresh_token;
                                                    const merge = {...original, ...user_node};
                                                    user.data(merge);
                                                    header("Authorization", 'Bearer ' + user.token());
                                                    request(route.rename, node, (url, response) => {
                                                        const refresh = section.select('.refresh');
                                                        refresh.click();
                                                    });
                                                }
                                            });
                                        } else {
                                            const refresh = section.select('.refresh');
                                            refresh.click();
                                        }
                                    });
                                } else {
                                    let node = {
                                        source : cut_item.dir,
                                        destination : element.data('dir') + cut_item.name  + '/'
                                    };
                                    const token = user.token();
                                    const refresh_token = user.refreshToken();
                                    const url_login = user.url.login();
                                    header("Authorization", 'Bearer ' + token);
                                    request(route.rename, node, (url, response) => {
                                        if(
                                            response?.class &&
                                            in_array(
                                                response?.class, [
                                                    'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                    'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                ],
                                                true
                                            )
                                        ) {
                                            user.authorization((url, data) => {
                                                if (
                                                    data?.class &&
                                                    in_array(
                                                        data?.class, [
                                                            'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                            'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                        ],
                                                        true
                                                    ) &&
                                                    refresh_token
                                                ) {
                                                    if (url_login) {
                                                        redirect(url_login);
                                                    }
                                                } else if (
                                                    data.node?.token &&
                                                    data.node?.refresh_token
                                                ) {
                                                    user.token(data.node?.token);
                                                    user.refreshToken(data.node?.refresh_token);
                                                    const original = user.data();
                                                    const user_node = data?.node || {};
                                                    delete user_node?.token;
                                                    delete user_node?.refresh_token;
                                                    const merge = {...original, ...user_node};
                                                    user.data(merge);
                                                    header("Authorization", 'Bearer ' + user.token());
                                                    request(route.rename, node, (url, response) => {
                                                        const refresh = section.select('.refresh');
                                                        refresh.click();
                                                    });
                                                }
                                            });
                                        } else {
                                            const address = section.select('input[name="address"]');
                                            if(address){
                                                address.value = node.destination;
                                                address.trigger('change');
                                            }
                                        }
                                    });
                                }
                            }
                            file.data.delete('clipboard.cut');
                            let copy = file.data.get('clipboard.copy') ?? [];
                            for(index=0; index < copy.length; index++){
                                let copy_item = copy[index];
                                let node = {
                                    source : copy_item.file,
                                    destination : element.data('dir') + copy_item.name
                                };
                                const token = user.token();
                                const refresh_token = user.refreshToken();
                                const url_login = user.url.login();
                                header("Authorization", 'Bearer ' + token);
                                request(route.copy, node, (url, response) => {
                                    if(
                                        response?.class &&
                                        in_array(
                                            response?.class, [
                                                'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                            ],
                                            true
                                        )
                                    ) {
                                        user.authorization((url, data) => {
                                            if (
                                                data?.class &&
                                                in_array(
                                                    data?.class, [
                                                        'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                        'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                    ],
                                                    true
                                                ) &&
                                                refresh_token
                                            ) {
                                                if (url_login) {
                                                    redirect(url_login);
                                                }
                                            } else if (
                                                data.node?.token &&
                                                data.node?.refresh_token
                                            ) {
                                                user.token(data.node?.token);
                                                user.refreshToken(data.node?.refresh_token);
                                                const original = user.data();
                                                const user_node = data?.node || {};
                                                delete user_node?.token;
                                                delete user_node?.refresh_token;
                                                const merge = {...original, ...user_node};
                                                user.data(merge);
                                                header("Authorization", 'Bearer ' + user.token());
                                                request(route.copy, node, (url, response) => {
                                                    const refresh = section.select('.refresh');
                                                    refresh.click();
                                                });
                                            }
                                        });
                                    } else {
                                        const refresh = section.select('.refresh');
                                        refresh.click();
                                    }
                                });
                            }
                            file.data.delete('clipboard.copy');
                        } else {
                            let cut = file.data.get('clipboard.cut') ?? [];
                            let index;
                            for(index=0; index < cut.length; index++){
                                let cut_item = cut[index];
                                console.log(cut_item);
                                if(cut_item.type === 'File'){
                                    let node = {
                                        source : cut_item.file,
                                        destination : element.data('dir') + cut_item.name
                                    };
                                    const token = user.token();
                                    const refresh_token = user.refreshToken();
                                    const url_login = user.url.login();
                                    header("Authorization", 'Bearer ' + token);
                                    request(route.rename, node, (url, response) => {
                                        if(
                                            response?.class &&
                                            in_array(
                                                response?.class, [
                                                    'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                    'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                ],
                                                true
                                            )
                                        ) {
                                            user.authorization((url, data) => {
                                                if (
                                                    data?.class &&
                                                    in_array(
                                                        data?.class, [
                                                            'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                            'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                        ],
                                                        true
                                                    ) &&
                                                    refresh_token
                                                ) {
                                                    if (url_login) {
                                                        redirect(url_login);
                                                    }
                                                } else if (
                                                    data.node?.token &&
                                                    data.node?.refresh_token
                                                ) {
                                                    user.token(data.node?.token);
                                                    user.refreshToken(data.node?.refresh_token);
                                                    const original = user.data();
                                                    const user_node = data?.node || {};
                                                    delete user_node?.token;
                                                    delete user_node?.refresh_token;
                                                    const merge = {...original, ...user_node};
                                                    user.data(merge);
                                                    header("Authorization", 'Bearer ' + user.token());
                                                    request(route.rename, node, (url, response) => {
                                                        const refresh = section.select('.refresh');
                                                        refresh.click();
                                                    });
                                                }
                                            });
                                        } else {
                                            const refresh = section.select('.refresh');
                                            refresh.click();
                                        }
                                    });
                                } else {
                                    let node = {
                                        source : cut_item.dir,
                                        destination : element.data('dir') + cut_item.name  + '/'
                                    };
                                    const token = user.token();
                                    const refresh_token = user.refreshToken();
                                    const url_login = user.url.login();
                                    header("Authorization", 'Bearer ' + token);
                                    request(route.rename, node, (url, response) => {
                                        if(
                                            response?.class &&
                                            in_array(
                                                response?.class, [
                                                    'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                    'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                ],
                                                true
                                            )
                                        ) {
                                            user.authorization((url, data) => {
                                                if (
                                                    data?.class &&
                                                    in_array(
                                                        data?.class, [
                                                            'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                            'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                        ],
                                                        true
                                                    ) &&
                                                    refresh_token
                                                ) {
                                                    if (url_login) {
                                                        redirect(url_login);
                                                    }
                                                } else if (
                                                    data.node?.token &&
                                                    data.node?.refresh_token
                                                ) {
                                                    user.token(data.node?.token);
                                                    user.refreshToken(data.node?.refresh_token);
                                                    const original = user.data();
                                                    const user_node = data?.node || {};
                                                    delete user_node?.token;
                                                    delete user_node?.refresh_token;
                                                    const merge = {...original, ...user_node};
                                                    user.data(merge);
                                                    header("Authorization", 'Bearer ' + user.token());
                                                    request(route.rename, node, (url, response) => {
                                                        const address = section.select('input[name="address"]');
                                                        if(address){
                                                            address.value = node.destination;
                                                            address.trigger('change');
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            const address = section.select('input[name="address"]');
                                            if(address){
                                                address.value = node.destination;
                                                address.trigger('change');
                                            }
                                        }
                                    });
                                }
                            }
                            file.data.delete('clipboard.cut');
                            let copy = file.data.get('clipboard.copy') ?? [];
                            for(index=0; index < copy.length; index++){
                                let copy_item = copy[index];
                                if(copy_item.type === 'File'){
                                    let node = {
                                        source : copy_item.file,
                                        destination : element.data('dir') + copy_item.name
                                    };
                                    const token = user.token();
                                    const refresh_token = user.refreshToken();
                                    const url_login = user.url.login();
                                    header("Authorization", 'Bearer ' + token);
                                    request(route.copy, node, (url, response) => {
                                        if(
                                            response?.class &&
                                            in_array(
                                                response?.class, [
                                                    'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                    'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                ],
                                                true
                                            )
                                        ) {
                                            user.authorization((url, data) => {
                                                if (
                                                    data?.class &&
                                                    in_array(
                                                        data?.class, [
                                                            'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                            'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                        ],
                                                        true
                                                    ) &&
                                                    refresh_token
                                                ) {
                                                    if (url_login) {
                                                        redirect(url_login);
                                                    }
                                                } else if (
                                                    data.node?.token &&
                                                    data.node?.refresh_token
                                                ) {
                                                    user.token(data.node?.token);
                                                    user.refreshToken(data.node?.refresh_token);
                                                    const original = user.data();
                                                    const user_node = data?.node || {};
                                                    delete user_node?.token;
                                                    delete user_node?.refresh_token;
                                                    const merge = {...original, ...user_node};
                                                    user.data(merge);
                                                    header("Authorization", 'Bearer ' + user.token());
                                                    request(route.copy, node, (url, response) => {
                                                        const refresh = section.select('.refresh');
                                                        refresh.click();
                                                    });
                                                }
                                            });
                                        } else {
                                            const refresh = section.select('.refresh');
                                            refresh.click();
                                        }

                                    });
                                } else {
                                    let node = {
                                        source : copy_item.dir,
                                        destination : element.data('dir') + copy_item.name  + '/'
                                    };
                                    const token = user.token();
                                    const refresh_token = user.refreshToken();
                                    const url_login = user.url.login();
                                    header("Authorization", 'Bearer ' + token);
                                    request(route.copy, node, (url, response) => {
                                        if(
                                            response?.class &&
                                            in_array(
                                                response?.class, [
                                                    'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                    'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                ],
                                                true
                                            )
                                        ) {
                                            user.authorization((url, data) => {
                                                if (
                                                    data?.class &&
                                                    in_array(
                                                        data?.class, [
                                                            'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                                            'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                                        ],
                                                        true
                                                    ) &&
                                                    refresh_token
                                                ) {
                                                    if (url_login) {
                                                        redirect(url_login);
                                                    }
                                                } else if (
                                                    data.node?.token &&
                                                    data.node?.refresh_token
                                                ) {
                                                    user.token(data.node?.token);
                                                    user.refreshToken(data.node?.refresh_token);
                                                    const original = user.data();
                                                    const user_node = data?.node || {};
                                                    delete user_node?.token;
                                                    delete user_node?.refresh_token;
                                                    const merge = {...original, ...user_node};
                                                    user.data(merge);
                                                    header("Authorization", 'Bearer ' + user.token());
                                                    request(route.copy, node, (url, response) => {
                                                        const refresh = section.select('.refresh');
                                                        refresh.click();
                                                    });
                                                }
                                            });
                                        } else {
                                            const refresh = section.select('.refresh');
                                            refresh.click();
                                        }
                                    });
                                }
                            }
                            file.data.delete('clipboard.copy');
                        }
                        break;
                    }
                    case __('file.manager.contextmenu.rename'): {
                        file.rename(element);
                        break;
                    }
                    case __('file.manager.contextmenu.share'): {
                        file.download(element);
                        break;
                    }
                    case __('file.manager.contextmenu.delete'): {
                        file.delete(element);
                        break;
                    }
                    case __('file.manager.contextmenu.audio_options'): {
                        alert('audio options');
                        break;
                    }
                    case __('file.manager.contextmenu.audio_options_song_play'): {
                        alert('audio play');
                        break;
                    }
                    case __('file.manager.contextmenu.audio_options_song_queue'): {
                        alert('audio queue');
                        break;
                    }

                }
            });
        }
        table_tr.on('mouseover', (event) => {
            let keyboard_shortcut = run(event.target.closest('.keyboard-shortcut'));
            console.log(keyboard_shortcut);
            if(keyboard_shortcut){
                console.log(keyboard_shortcut);
                keyboard_shortcut.addClass('active');
            }
        });
        table_tr.on('mouseout', (event) => {
            let keyboard_shortcut = run(event.target.closest('.keyboard-shortcut'));
            console.log(keyboard_shortcut);
            if (keyboard_shortcut) {
                console.log(keyboard_shortcut);
                keyboard_shortcut.removeClass('active');
            }
        });
        tbody.appendChild(table_tr);
    }
    table.appendChild(tbody);
    /*
    li.on('click', (event) => {
        //context-menu-item
        file.context_menu_item({
            'event' : event,
            'node' : node,
            'section' : section,
            'tr' : tr,
            'li' : li
        });
        // file.open_file_with(tr);
    });
     */
    /*
    li.on('click', (event) => {
        file.open_file_with(tr);
    });
     */
    // ul.appendChild(li);
    //cut
    //copy
    //paste
    //--------------------
    //download file raw / folder (folder as zip archive)
    //download file as zip archive
    //upload dialog
    //backup file / folder
    //--------------------
    //refresh folder
    //sort by
    //filter by
    //search
    create_div.appendChild(table);
    section.appendChild(create_div);
    let ctx_calculate = create_div.calculate('all');
    if(ctx_calculate?.top + ctx_calculate?.height > (ctx_calculate?.window.height)){
        let body_calculate = section.select('.body')?.calculate('all');
        if(body_calculate){
            create_div.style.top = (body_calculate.window.height - body_calculate.bottom - ctx_calculate.height) + 'px';
        }
    }
    let close = create_div.select('.header .icon');
    if(close){
        close.on('click', (event) => {
            file.data.delete('context.menu.active');
            const menu_item_active = file.data.get('context.menu.item.active');
            if(menu_item_active){
                let div_menu_item = section.select('.context-menu-item');
                file.data.delete('context.menu.item.active');
                div_menu_item.remove();
            }
            create_div.remove();
        });
    }
}

file.context_menu_item = ({
    event,
    submenu,
    section,
    element,
    td
}) => {
    let is_active = file.data.get('context.menu.item.active');
    if(is_active){
        return;
    }
    file.data.set('context.menu.item.active', true);
    file.data.set('context.menu.time.item.active', microtime(true));
    let dialog = section.select('.dialog');
    let ctx_menu = section.select('.context-menu');
    console.log(ctx_menu.style.zIndex);
    console.log(event);
    console.log(submenu);
    console.log(section);
    console.log(element);
    console.log(td);
    let td_calculation = td.calculate('all');
    console.log(td_calculation);
    event.preventDefault();
    event.stopPropagation();
    let create_div = section.select('.context-menu-item');
    if(!create_div){
        create_div = create('div');
        create_div.addClass('context-menu-item');
    } else {
    }
    create_div.style.top = td_calculation.top + 'px';
    create_div.style.left = td_calculation.left + 'px';
    create_div.style.zIndex = parseInt(ctx_menu.style.zIndex);
    let table = create_div.select('table');
    if(table){
        table.remove();
    }
    table = create('table');
    table.attribute('cellspacing', 0);
    table.attribute('cellpadding', 0);
    let tbody = create('tbody');
    let table_tr = create('tr', 'header');
    let table_td = create('td');
    table_td.html('&#10218;');
    table_td.on('click', (event) => {
        file.data.delete('context.menu.item.active');
        create_div.remove();
        td.html('&#10219;');
    });
    table_td.colSpan = 4;
    table_tr.appendChild(table_td);
    tbody.appendChild(table_tr);
    /**/
    if(submenu.length > 0){
        let index;
        for(index = 0; index < submenu.length; index++){
            let menu_item = submenu[index];
            let table_tr_submenu = create('tr');
            let table_td_submenu = create('td');
            let i = create('i');
            i.addClass(menu_item?.icon?.class);
            i.on('mouseover', (event) => {
                let keyboard_shortcut = event.target.closest('.keyboard-shortcut');
                if(keyboard_shortcut){
                    keyboard_shortcut.addClass('active');
                }
            });
            i.on('mouseout', (event) => {
                let keyboard_shortcut = event.target.closest('.keyboard-shortcut');
                if(keyboard_shortcut){
                    keyboard_shortcut.removeClass('active');
                }
            });
            table_td_submenu.appendChild(i);
            table_tr_submenu.appendChild(table_td_submenu);
            table_td_submenu = create('td');
            let keyboard_shortcut = !is.empty(menu_item?.keyboard) ?  menu_item.keyboard : '&nbsp;';
            table_td_submenu.html('<i class="keyboard-shortcut">' + keyboard_shortcut +'</i>');
            table_tr_submenu.appendChild(table_td_submenu);
            table_td_submenu = create('td');
            table_tr_submenu.appendChild(table_td_submenu);
            table_td_submenu.html(__(menu_item.name));
            table_tr_submenu.appendChild(table_td_submenu);
            table_td_submenu = create('td');
            if(submenu?.submenu){
                submenu = submenu?.submenu
                console.log(submenu);
                table_td_submenu.html('&#10219;');
                table_td_submenu.on('click', (event) => {
                    file.context_menu_item({event, submenu, section, element, td});
                });
            } else {
                td.html('');
            }
            table_tr_submenu.appendChild(table_td_submenu);
            tbody.appendChild(table_tr_submenu);
            table_tr_submenu.on('click', (event) => {
                switch(__(menu_item.name)){
                    case __('file.manager.contextmenu.open_with'): {
                        file.open_file_with(element);
                        break;
                    }
                    case __('file.manager.contextmenu.download'): {
                        alert('download');
                        break;
                    }
                    case __('file.manager.contextmenu.new'): {
                        alert('new');
                        break;
                    }
                    case __('file.manager.contextmenu.new_file'): {
                        file.new_file(element);
                        break;
                    }
                    case __('file.manager.contextmenu.new_directory'): {
                        file.new_directory(element);
                        break;
                    }
                    case __('file.manager.contextmenu.cut'): {
                        alert('cut');
                        break;
                    }
                    case __('file.manager.contextmenu.copy'): {
                        alert('copy');
                        break;
                    }
                    case __('file.manager.contextmenu.paste'): {
                        alert('paste');
                        break;
                    }
                    case __('file.manager.contextmenu.rename'): {
                        file.rename(element);
                        break;
                    }
                    case __('file.manager.contextmenu.share'): {
                        alert('share');
                        file.download(element);
                        break;
                    }
                    case __('file.manager.contextmenu.delete'): {
                        file.delete(element);
                        break;
                    }
                    case __('file.manager.contextmenu.audio_options'): {

                    }
                    case __('file.manager.contextmenu.audio_options_song_play'): {
                        alert('audio play');
                        break;
                    }
                    case __('file.manager.contextmenu.audio_options_song_queue'): {
                        alert('audio queue');
                        break;
                    }
                }
            });
            table_tr_submenu.on('mouseover', (event) => {
                let keyboard_shortcut = event.target.closest('.keyboard-shortcut');
                console.log(keyboard_shortcut);
                if(keyboard_shortcut){
                    keyboard_shortcut.addClass('active');
                }
            });
            table_tr_submenu.on('mouseout', (event) => {
                let keyboard_shortcut = event.target.closest('.keyboard-shortcut');
                if(keyboard_shortcut){
                    keyboard_shortcut.removeClass('active');
                }
            });
        }
    }
    table.appendChild(tbody);
    create_div.appendChild(table);
    section.appendChild(create_div);
}

file.dirname = (url) => {
    return url.substring(0, url.lastIndexOf('/')) + '/';
}

file.recycle_overview = (response) => {
    const section = getSectionById(file.data.get('section.id'));
    console.log(file.data.get('section.id'));
    console.log(section);
    console.log(response);
    if (!section) {
        return;
    }
    let totalBytes = 0;
    let totalItems = response?.nodeList?.length ?? 0;
    /*
    let column = 0;
    let ul = create('ul');
    ul.addClass('recycle-overview');
    let li_item = create('li');
    li_item.addClass('restore-recycle-bin');
    li_item.html('' +
        '<div>' +
        '<span class="restore-recycle-bin">Restore recycle-bin</span>' +
        '</div>'
    );
    ul.appendChild(li_item);
    column++;
    li_item = create('li');
    li_item.addClass('empty-recycle-bin');
    li_item.html('' +
        '<div>' +
        '<span class="empty-recycle-bin">Empty recycle-bin</span>' +
        '</div>'
    );
    ul.appendChild(li_item);
    column++;
     */
    const list = section.select('.list');
    if(list) {
        list.html('');
        //file.calculate_list(list, column);
    }
    let ul_list = [];
    let ul_list_column = [];
    let column;
    let ul = create('ul');
    ul.addClass('recycle-list');
    let li = create('li');
    li.addClass('title header date');
    li.html('<div><br></div>');
    ul.appendChild(li);
    column++;
    li = create('li');
    li.addClass('title header source');
    li.html('<div>' +
        '<span class="restore">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640">' +
        '<!--! Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2025 Fonticons, Inc. -->' +
        '<path fill="currentColor" d="M216.3 124C262.5 44 378 44 424.2 124L461.5 188.6L489.2 172.6C497.6 167.7 508.1 168.4 515.8 174.3C523.5 180.2 526.9 190.2 524.4 199.6L500.9 287C497.5 299.8 484.3 307.4 471.5 304L384.1 280.6C374.7 278.1 367.8 270.2 366.5 260.6C365.2 251 369.9 241.5 378.3 236.7L406 220.7L368.7 156.1C347.1 118.8 293.3 118.8 271.7 156.1L266.4 165.2C257.6 180.5 238 185.7 222.7 176.9C207.4 168.1 202.2 148.5 211 133.1L216.3 124zM513.7 343.1C529 334.3 548.6 339.5 557.4 354.8L562.7 363.9C608.9 443.9 551.2 543.9 458.8 543.9L384.2 543.9L384.2 575.9C384.2 585.6 378.4 594.4 369.4 598.1C360.4 601.8 350.1 599.8 343.2 592.9L279.2 528.9C269.8 519.5 269.8 504.3 279.2 495L343.2 431C350.1 424.1 360.4 422.1 369.4 425.8C378.4 429.5 384.2 438.3 384.2 448L384.2 480L458.8 480C501.9 480 528.9 433.3 507.3 396L502 386.9C493.2 371.6 498.4 352 513.7 343.2zM115 299.4L87.3 283.4C78.9 278.5 74.2 269.1 75.5 259.5C76.8 249.9 83.7 242 93.1 239.5L180.5 216C193.3 212.6 206.5 220.2 209.9 233L233.3 320.4C235.8 329.8 232.4 339.7 224.7 345.7C217 351.7 206.5 352.3 198.1 347.4L170.4 331.4L133.1 396C111.5 433.3 138.5 480 181.6 480L192.2 480C209.9 480 224.2 494.3 224.2 512C224.2 529.7 209.9 544 192.2 544L181.6 544C89.3 544 31.6 444 77.8 364L115 299.4z"/>' +
        '</svg>' +
        __('file.manager.recycle.bin.restore.complete') +
        '</span>' +
        '<span class="empty">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640">' +
        '<!--! Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2025 Fonticons, Inc. -->' +
        '<path fill="currentColor" d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/>'+
        '</svg>' +
        __('file.manager.recycle.bin.empty.complete') +
        '</span>' +
        '<br>' +
        '</div>');
    ul.appendChild(li);
    column++;
    li = create('li');
    li.addClass('title header size');
    li.html('<div><br></div>');
    ul.appendChild(li);
    column++;
    li = create('li');
    li.addClass('title header options');
    li.html('<div><br></div>');
    ul.appendChild(li);
    for(let date in response.nodeList){
        column = 0;
        let li = create('li');
        li.addClass('header date');
        li.html('<div>' + date + '<br></div>');
        ul.appendChild(li);
        column++;
        li = create('li');
        li.addClass('header source');
        li.html('<div>Source:<br></div>');
        ul.appendChild(li);
        column++;
        li = create('li');
        li.addClass('header size');
        li.html('<div>Size:<br></div>');
        ul.appendChild(li);
        column++;
        li = create('li');
        li.addClass('header options');
        li.html('<div >' +
            '<span class="restore" title="Restore: '+ date +' data-point">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640">' +
            '<!--! Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2025 Fonticons, Inc. -->' +
            '<path fill="currentColor" d="M263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9C237.1 56.8 249.3 48 263.1 48zM128 208L512 208L490.9 531.1C489.3 556.4 468.3 576 443 576L197 576C171.7 576 150.7 556.4 149.1 531.1L128 208zM337 287C327.6 277.6 312.4 277.6 303.1 287L231.1 359C221.7 368.4 221.7 383.6 231.1 392.9C240.5 402.2 255.7 402.3 265 392.9L296 361.9L296 464C296 477.3 306.7 488 320 488C333.3 488 344 477.3 344 464L344 361.9L375 392.9C384.4 402.3 399.6 402.3 408.9 392.9C418.2 383.5 418.3 368.3 408.9 359L336.9 287z"/>' +
            '</svg>' +
            '</span>' +
            '<span class="delete" title="Delete: '+ date +' data-point">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">' + "\n" +
                '<path d="M6.5 3.5V2.8A1.3 1.3 0 0 1 7.8 1.5h4.4a1.3 1.3 0 0 1 1.3 1.3v.7M2.5 4.5h15M4.2 4.5l.9 12.1a1.5 1.5 0 0 0 1.5 1.4h5.1M15.8 4.5l-.4 5.2M8 7.2l.4 7.1M11.5 7.2l-.2 3.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' + "\n" +
                '<circle cx="14.8" cy="14.8" r="4.1" fill="currentColor" stroke="white" stroke-width=".5"/>' + "\n" +
                '<path d="m13.3 13.3 3 3m0-3-3 3" stroke="white" stroke-width="1.2" stroke-linecap="round"/>' + "\n" +
            '</svg>' +
            '</span>' +
            '</div>');
        ul.appendChild(li);
        column++;
        let list = response.nodeList[date];
        let li_item;
        for(let index=0; index < list.length; index++){
            let node = list[index];
            totalBytes+=node.size;
            li_item = create('li');
            li_item.addClass('date');
            let attribute = node.attribute ?? [];
            let elem = attribute[attribute.length-1];
            if(elem && elem.type){
                if(elem.type === 'Dir'){
                    li_item.html('<div><span class="type"><i class="far fa-folder"></i></span></div>');
                }
                else if (elem.type === 'Link'){
                    li_item.html('<div><span class="type"><i class="far fa-link"></i></span></div>');
                }
                else {
                    li_item.html('<div><span class="type"><i class="far fa-file"></i></span></div>');
                }
                ul.appendChild(li_item);
            }
            li_item = create('li');
            li_item.addClass('source');
            li_item.html('' +
                '<div>' +
                '<span class="value">' + node.source +'</span>' +
                '</div>'
            );
            ul.appendChild(li_item);
            li_item = create('li');
            li_item.addClass('size');
            li_item.html('' +
                '<div>' +
                '<span class="value">' + node.size_format + '</span>' +
                '</div>'
            );
            ul.appendChild(li_item);
            li_item = create('li');
            li_item.addClass('options');
            li_item.html('' +
                '<div>' +
                '<span class="restore">'+
                '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640">' +
                '<!--! Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2025 Fonticons, Inc. -->' +
                '<path fill="currentColor" d="M216.3 124C262.5 44 378 44 424.2 124L461.5 188.6L489.2 172.6C497.6 167.7 508.1 168.4 515.8 174.3C523.5 180.2 526.9 190.2 524.4 199.6L500.9 287C497.5 299.8 484.3 307.4 471.5 304L384.1 280.6C374.7 278.1 367.8 270.2 366.5 260.6C365.2 251 369.9 241.5 378.3 236.7L406 220.7L368.7 156.1C347.1 118.8 293.3 118.8 271.7 156.1L266.4 165.2C257.6 180.5 238 185.7 222.7 176.9C207.4 168.1 202.2 148.5 211 133.1L216.3 124zM513.7 343.1C529 334.3 548.6 339.5 557.4 354.8L562.7 363.9C608.9 443.9 551.2 543.9 458.8 543.9L384.2 543.9L384.2 575.9C384.2 585.6 378.4 594.4 369.4 598.1C360.4 601.8 350.1 599.8 343.2 592.9L279.2 528.9C269.8 519.5 269.8 504.3 279.2 495L343.2 431C350.1 424.1 360.4 422.1 369.4 425.8C378.4 429.5 384.2 438.3 384.2 448L384.2 480L458.8 480C501.9 480 528.9 433.3 507.3 396L502 386.9C493.2 371.6 498.4 352 513.7 343.2zM115 299.4L87.3 283.4C78.9 278.5 74.2 269.1 75.5 259.5C76.8 249.9 83.7 242 93.1 239.5L180.5 216C193.3 212.6 206.5 220.2 209.9 233L233.3 320.4C235.8 329.8 232.4 339.7 224.7 345.7C217 351.7 206.5 352.3 198.1 347.4L170.4 331.4L133.1 396C111.5 433.3 138.5 480 181.6 480L192.2 480C209.9 480 224.2 494.3 224.2 512C224.2 529.7 209.9 544 192.2 544L181.6 544C89.3 544 31.6 444 77.8 364L115 299.4z"/>' +
                '</svg>' +
            '</span>' +
                '<span class="delete">'+
                '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640">' +
                '<!--! Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2025 Fonticons, Inc. -->' +
                '<path fill="currentColor" d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/>'+
                '</svg>' +
                '</span>' +
                '</div>'
            );
            ul.appendChild(li_item);
        }
        // ul_list.push(ul);
        // ul_list_column.push(column);
    }
    if(list) {
        list.appendChild(ul);
        file.calculate_list(list, 4);
        /*
        for(let index=0; index < ul_list.length; index++){
            list.appendChild(ul_list[index]);
        }
         */

    }
    const footer = section.select('.footer');
    if(footer){
        const item = footer.select('.item');
        if(item){
            if(totalItems === 1){
                item.html(totalItems + ' ' + __('file.manager.item'));
            } else {
                item.html(totalItems + ' ' + __('file.manager.items'));
            }
        }
        const size = footer.select('.size');
        if(size){
            size.html(file.size(totalBytes));
        }
    }
}

file.list = (response) => {
    const section = getSectionById(file.data.get('section.id'));
    console.log(file.data.get('section.id'));
    console.log(section);
    console.log(response);
    if(!section){
        return;
    }
    console.log(response)
    let column = 0;
    let totalBytes = 0;
    let totalItems = response?.nodeList?.length ?? 0;
    let create_ul = create('ul');
    create_ul.addClass('file-list');
    let li = create('li');
    li.addClass('header icon');
    li.html(__('file.manager.icon'));
    create_ul.appendChild(li);
    column++;
    li = create('li');
    li.addClass('header name');
    li.html(__('file.manager.name'));
    create_ul.appendChild(li);
    column++;
    li = create('li');
    li.addClass('header modified');
    li.html(__('file.manager.modified'));
    create_ul.appendChild(li);
    column++;
    li = create('li');
    li.addClass('header type');
    li.html(__('file.manager.type'));
    create_ul.appendChild(li);
    column++;
    li = create('li');
    li.addClass('header size');
    li.html(__('file.manager.size'));
    create_ul.appendChild(li);
    column++;
    let index;
    for(index = 0; index < totalItems; index++){
        let node = response.nodeList[index];
        let node_context = node;
        let element_context;
        if(node.type.toLowerCase() === 'dir'){
            li = create('li');
            li.addClass('icon');
            li.html('<i class="far fa-folder"></i>');
            li.data('dir', node.url);
            li.data('type', node.type);
            create_ul.appendChild(li);
            element_context = li;
            li.on('click', async (event) => {
                //load context menu...
                await file.context_menu({
                    'event' : event,
                    'node' : node,
                    'section' : section,
                    'element' : event.target.closest('li'),
                });
            });
            li.on('contextmenu', async (event) => {
                event.preventDefault();
                await file.context_menu({
                    'event' : event,
                    'node' : node_context,
                    'section' : section,
                    'element' : element_context,
                });
            });
            li = create('li');
            li.data('dir', node.url);
            li.data('type', node.type);
            li.addClass('name');
            li.html(node.name);
            li.on('click', (event) => {
                file.open(event);
            });
            li.on('contextmenu', async (event) => {
                event.preventDefault();
                await file.context_menu({
                    'event' : event,
                    'node' : node_context,
                    'section' : section,
                    'element' : element_context,
                });
            });
            create_ul.appendChild(li);
            li = create('li');
            li.data('dir', node.url);
            li.data('type', node.type);
            li.addClass('modified');
            li.html(date('Y-m-d H:i', node.mtime));
            li.on('click', (event) => {
                file.open(event);
            });
            li.on('contextmenu', async (event) => {
                event.preventDefault();
                await file.context_menu({
                    'event' : event,
                    'node' : node_context,
                    'section' : section,
                    'element' : element_context,
                });
            });
            create_ul.appendChild(li);
            li = create('li');
            li.data('dir', node.url);
            li.data('type', node.type);
            li.addClass('type');
            if(node.type.toLowerCase() === 'dir'){
                li.html(__('file.manager.dir'));
            }
            else if(node.extension) {
                li.html(node.extension);
            } else {
                li.html('&bsp;');
            }
            li.on('click', (event) => {
                file.open(event);
            });
            li.on('contextmenu', async (event) => {
                event.preventDefault();
                await file.context_menu({
                    'event' : event,
                    'node' : node_context,
                    'section' : section,
                    'element' : element_context,
                });
            });
            create_ul.appendChild(li);
            li = create('li');
            li.data('dir', node.url);
            li.data('type', node.type);
            li.addClass('size');
            li.html(file.size(node.size));
            li.on('click', (event) => {
                file.open(event);
            });
            li.on('contextmenu', async (event) => {
                event.preventDefault();
                await file.context_menu({
                    'event' : event,
                    'node' : node_context,
                    'section' : section,
                    'element' : element_context,
                });
            });
            create_ul.appendChild(li);
        } else {
            li = create('li');
            li.addClass('icon');
            li.html('<i class="far fa-file"></i>');
            li.on('click', async (event) => {
                //load context menu...
                await file.context_menu({
                    'event' : event,
                    'node' : node,
                    'section' : section,
                    'element' : event.target.closest('li'),
                });
            });
            element_context = li;
            li.on('contextmenu', async (event) => {
                event.preventDefault();
                element_context = event.target.closest('li');
                await file.context_menu({
                    'event' : event,
                    'node' : node_context,
                    'section' : section,
                    'element' : element_context,
                });
            });
            li.data('file', node.url);
            li.data('dir', file.dirname(node.url));
            li.data('extension', node.extension);
            li.data('type', node.type);
            create_ul.appendChild(li);
            li = create('li');
            li.data('file', node.url);
            li.data('dir', file.dirname(node.url));
            li.data('extension', node.extension);
            li.data('type', node.type);
            li.addClass('name');
            li.html(node.name);
            li.on('click', (event) => {
                file.open(event);
            });
            li.on('contextmenu', async (event) => {
                event.preventDefault();
                await file.context_menu({
                    'event' : event,
                    'node' : node_context,
                    'section' : section,
                    'element' : element_context,
                });
            });
            create_ul.appendChild(li);
            li = create('li');
            li.data('file', node.url);
            li.data('dir', file.dirname(node.url));
            li.data('extension', node.extension);
            li.data('type', node.type);
            li.addClass('modified');
            li.html(date('Y-m-d H:i', node.mtime));
            li.on('click', (event) => {
                file.open(event);
            });
            li.on('contextmenu', async (event) => {
                event.preventDefault();
                await file.context_menu({
                    'event' : event,
                    'node' : node_context,
                    'section' : section,
                    'element' : element_context,
                });
            });
            create_ul.appendChild(li);
            li = create('li');
            li.data('file', node.url);
            li.data('dir', file.dirname(node.url));
            li.data('extension', node.extension);
            li.data('type', node.type);
            li.addClass('type');
            if(node.type.toLowerCase() === 'dir'){
                li.html(__('file.manager.dir'));
            } else if(node.extension) {
                li.html(node.extension);
            } else {
                li.html('&nbsp;');
            }
            li.on('click', (event) => {
                file.open(event);
            });
            li.on('contextmenu', async (event) => {
                event.preventDefault();
                await file.context_menu({
                    'event' : event,
                    'node' : node_context,
                    'section' : section,
                    'element' : element_context,
                });
            });
            create_ul.appendChild(li);
            li = create('li');
            li.data('file', node.url);
            li.data('dir', file.dirname(node.url));
            li.data('extension', node.extension);
            li.data('type', node.type);
            li.addClass('size');
            li.html(file.size(node.size));
            li.on('click', (event) => {
                file.open(event);
            });
            li.on('contextmenu', async (event) => {
                event.preventDefault();
                await file.context_menu({
                    'event' : event,
                    'node' : node_context,
                    'section' : section,
                    'element' : element_context,
                });
            });
            create_ul.appendChild(li);
        }
        totalBytes+=node.size;
    }
    const list = section.select('.list');
    if(list){
        list.html('');
        list.appendChild(create_ul, list.firstChild);
        file.calculate_list(list, column);
    }
    const footer = section.select('.footer');
    if(footer){
        const item = footer.select('.item');
        if(item){
            if(totalItems === 1){
                item.html(totalItems + ' ' + __('file.manager.item'));
            } else {
                item.html(totalItems + ' ' + __('file.manager.items'));
            }

        }
        const size = footer.select('.size');
        if(size){
            size.html(file.size(totalBytes));
        }
    }
    // create_ul.addClass('tree');
    /*
    let create_table = create('table');
    let thead = create('thead');
    let th = create('tr');
    let tbody = create('tbody');
    let totalBytes = 0;
    let totalItems = 0;
    thead = file.header(thead, th);
    create_table.appendChild(thead);
    if(is.array(response.nodeList)){
        let files = [];
        for(let index in response.nodeList){
            files.push(response.nodeList[index]);
        }
        response.files = files;
    }
    if(is.array(response.files)){
        console.log(response.files);
        let index;
        totalItems = response.files.length;
        for(index=0; index < response.files.length; index++){
            let node = response.files[index];
            let tr = create('tr');
            let td = create('td', 'icon');
            if(node.type.toLowerCase() === 'dir'){
                td.html('<i class="far fa-folder"></i>');
                tr.data('dir', node.url);
            } else {
                td.html('<i class="far fa-file"></i>');
                td.on('click', (event) => {
                    //load context menu...
                    file.context_menu({
                        'event' : event,
                        'node' : node,
                        'section' : section,
                        'tr' : tr,
                    });
                });
                tr.data('file', node.url);
                tr.data('extension', node.extension);
                4
            }
            tr.appendChild(td);
            td = create('td');
            td.html(node.name);
            tr.appendChild(td);
            td = create('td');
            td.html(date('Y-m-d H:i', node.mtime));
            tr.appendChild(td);
            td = create('td');
            td.html(node.extension);
            tr.appendChild(td);
            td = create('td');
            td.html(file.size(node.size));
            tr.appendChild(td);
            tr.on('click', (event) => {
                file.open(event);
            });
            tbody.appendChild(tr);
        }
    }
    create_table.appendChild(tbody);
    const list = section.select('.list');
    if(list){
        list.html('');
        list.appendChild(create_table, list.firstChild);
    }
    const footer = section.select('.footer');
    if(footer){
        const item = footer.select('.item');
        if(item){
            if(totalItems === 1){
                item.html(totalItems + ' ' + __('file.manager.item'));
            } else {
                item.html(totalItems + ' ' + __('file.manager.items'));
            }

        }
        const size = footer.select('.size');
        if(size){
            size.html(file.size(totalBytes));
        }
    }
    table.resize(section.select('.list table'), '2px solid rgba(255, 124, 13, 1)', true);
     */
    const refresh = section.select('.refresh');
    if(!refresh){
        return;
    }
    refresh.removeClass('fa-spin');
}

file.scrollbar_width = (element) =>  {

    let div = create('div');
    div.css('width', '100px');
    div.css('height', '100px');
    div.css('overflow', 'auto');
    div.css('position', 'absolute');
    div.css('top', '-1000px');
    div.css('top', '0px');
    div.css('left', '-1000px');
    div.css('left', '0px');
    let div_child = create('div');
    div_child.css('width', '100%');
    div_child.css('height', '200px');
    div.appendChild(div_child);
    element.appendChild(div);
    let result = div.offsetWidth - div.clientWidth;
    element.removeChild(div);
    return result;
}

file.calculate_list = (list, column) => {
    let total_width = list.computedStyle('width');
    let content_width = list.contentWidth;
    console.log(content_width);
    const scrollbar_width = file.scrollbar_width(list);
    /*
    if(content_width.split('px').length > 1){
        content_width = parseFloat(content_width.split('px')[0]);
        if(total_width.split('px').length > 1){
            total_width = parseFloat(total_width.split('px')[0]);
            if(total_width != content_width){
                total_width = total_width - scrollbar_width;
            }
        }
    } else {

    }
     */
    if(total_width.split('px').length > 1) {
        total_width = parseFloat(total_width.split('px')[0]);
    }
    let li = list.select('li');
    let index = 0;
    let row_number = 0;
    let table = [];
    let height = 0;
    for(index=0; index < li.length; index++){
        let width = li[index].computedStyle('width');
        if(width.split('px').length > 1){
            width = parseFloat(width.split('px')[0]);
        }
        let padding_left = li[index].computedStyle('padding-left');
        if(padding_left.split('px').length > 1){
            padding_left = parseFloat(padding_left.split('px')[0]);
        }
        let padding_right = li[index].computedStyle('padding-right');
        if(padding_right.split('px').length > 1){
            padding_right = parseFloat(padding_right.split('px')[0]);
        }
        let margin_left = li[index].computedStyle('margin-left');
        if(margin_left.split('px').length > 1){
            margin_left = parseFloat(margin_left.split('px')[0]);
        }
        let margin_right = li[index].computedStyle('margin-right');
        if(margin_right.split('px').length > 1){
            margin_right = parseFloat(margin_right.split('px')[0]);
        }
        if(index > 0 && index % column === 0){
            row_number++;
            let li_height = li[index].computedStyle('height');
            if(li_height.split('px').length > 1){
                li_height = parseFloat(li_height.split('px')[0]);
            }
            height += li_height;
        }
        let column_number = index % column;
        if(!table[row_number]){
            table[row_number] = [];
        }
        table[row_number][column_number] = {
            'width': width,
            'padding': {
                'left': padding_left,
                'right': padding_right
            },
            'margin': {
                'left': margin_left,
                'right': margin_right
            },
            'width_total': width + padding_left + padding_right + margin_left + margin_right
        };
        // totalWidth -= width;
    }
    let max_width_column = [];
    let max_width_column_total = [];
    let row;
    for(index = 0; index < table.length; index++){
        row = table[index];
        let totalWidthRow = 0;
        let column_nr;
        for(column_nr = 0; column_nr < row.length; column_nr++){
            if(!max_width_column[column_nr]){
                max_width_column[column_nr] = row[column_nr].width;
                max_width_column_total[column_nr] = row[column_nr].width_total;
            }
            else if (row[column_nr].width_total > max_width_column[column_nr]){
                max_width_column[column_nr] = row[column_nr].width;
                max_width_column_total[column_nr] = row[column_nr].width_total;
            }
        }
    }
    let column_biggest_width;
    let column_biggest_index;
    let max_width_column_size = 0;
    for(index = 0; index < max_width_column.length; index++){
        if(!column_biggest_width){
            column_biggest_width = max_width_column[index];
            column_biggest_index = index;
        }
        else if (max_width_column[index] > column_biggest_width){
            column_biggest_width = max_width_column[index];
            column_biggest_index = index;
        }
        max_width_column_size += max_width_column_total[index];
    }
    if(max_width_column_size > total_width){
        total_width = max_width_column_size;
        list.select('ul').css('min-width', max_width_column_size + 'px');
    } else {
        list.select('ul').css('min-width', total_width + 'px');
    }
    for(index = 0; index < li.length; index++) {
        let column_index = index % column;
        if (column_index === column_biggest_index) {
            let j;
            let max_width = total_width;
            for (j = 0; j < max_width_column.length; j++) {
                if (j === column_biggest_index) {
                    max_width -= (max_width_column_total[j] - max_width_column[j]);
                    continue;
                }
                max_width -= max_width_column_total[j];
            }
            li[index].css('width', max_width + 'px');

        } else {
            li[index].css('width', max_width_column[column_index] + 'px');
        }
    }
    list.select('ul').css('min-height', height + 'px');
}

file.open = (event) => {
    const section = getSectionById(file.data.get('section.id'));
    if(!section){
        return;
    }
    const context_menu = section.select('.context-menu');
    const context_menu_item = section.select('.context-menu-item');
    file.data.delete('context.menu.active');
    file.data.delete('context.menu.item.active');
    if(context_menu){
        context_menu.remove();
    }
    if(context_menu_item){
        context_menu_item.remove();
    }
    if (event.detail === 1) {
        const list = section.select('.list li');
        const element = event.target.closest('li');
        if (
            list &&
            element
        ) {
            list.removeClass('selected');
            element.addClass('selected');
            let index;
            for(index = 0; index < list.length; index++){
                if(element === list[index]){
                    let j;
                    for(j = index; j >= 0; j--){
                        list[j].addClass('selected');
                        if(list[j].hasClass('icon')){
                            break;
                        }
                    }
                    for(j = index; j < list.length; j++){
                        list[j].addClass('selected');
                        if(list[j].hasClass('size')){
                            break;
                        }
                    }
                    break;
                }
            }
        }
    } else {
        let element;
        if(!event.target){
           element = event;
        } else {
           element = event.target.closest('li');
        }
        const address = section.select('input[name="address"]');
        if(
            element &&
            element.data('file')
        ){
            file.open_file_with(element);
        }
        else if (
            element &&
            element.data('dir') &&
            address
        ){
            address.data('dir', element.data('dir'));
            address.value = element.data('dir');
            address.trigger('change');
        }
    }
}

file.exception = {
    message : (section, data) => {
        const dialog_active = section.select('.dialog-active');
        if(dialog_active){
            dialog_active.removeClass('dialog-active');
        }
        if(data?.class === 'Raxon\\Exception\\AuthorizationException'){
            let section_message = create('section');
            section_message.name = 'application-message';
            section_message.id = 'application-message-authorization';
            section_message.html('<div class="dialog dialog-active dialog-message">' +
                '        <div class="head">\n' +
                '        <h1><img src="/Application/Filemanager/Icon/Message.png" class="icon"> Message </h1>\n' +
                '        <span class="close"><i class="fas fa-window-close"></i></span><span class="minimize"><i class="far fa-window-minimize"></i></span>\n' +
                '        </div>\n' +
                '        <div class="body">' +
                '        <p class="message">' + _('_').str_replace("\n", "<br>\n", data.message) + '</p>' +
                '        <form name="message">\n' +
                '        <button type="submit" name="ok">Ok</button>\n' +
                '        </form>'+
                '        </div>' +
                '        </div>');
            document.body.appendChild(section_message);
            //document.body.insertAdjacentHTML("beforeend", section_message.html());
            dialog.init(section_message?.id);
        } else {
            document.body.insertAdjacentHTML("beforeend", data.message);
            let section_message = select('body section[name="application-message"]');
            if(is.nodeList(section_message)){
                for(let index=0; index < section_message.length - 1; index++){
                    section_message[index].remove();
                }
            }
            section_message = select('body section[name="application-message"]');
            if(!section_message){
                return;
            }
            const dialog_message = section_message.select('.dialog');
            const message = dialog_message.select('.message');
            const form = dialog_message.select('form');
            form.on('submit', (event) => {
                event.preventDefault();
                section_message.remove();
            });
            dialog.init(section_message?.id);
        }
    }
};

file.open_file_with = (element) => {
    const section = getSectionById(file.data.get('section.id'));
    if(!section){
        return;
    }
    const context_menu = section.select('.context-menu');
    const context_menu_item = section.select('.context-menu-item');
    file.data.delete('context.menu.active');
    file.data.delete('context.menu.item.active');
    if(context_menu){
        context_menu.remove();
    }
    if(context_menu_item){
        context_menu_item.remove();
    }
    const route = {
        backend : file.data.get('route.backend.file.open'),
        frontend : file.data.get('route.frontend.application')
    };
    let node = {
        "extension" : element.data('extension'),
    };
    if(!node?.extension){
        node.extension = 'txt';
    }
    const token = user.token();
    const refresh_token = user.refreshToken();
    header("Authorization", 'Bearer ' + token);
    let exception_message = file.data.get('open.with.exception.message') ?? [
        'Package\\Raxon\\Filemanager\\Exception\\ApplicationNotFoundException'
    ];
    request(route.backend, node, (url, response) => {
        if(
            response?.class &&
            in_array(response?.class, [
                'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                'Package\\Raxon\\Account\\Exception\\AuthorizationException',
            ], true) &&
            refresh_token
        ){
            user.authorization((url, data) => {
                if(
                    data?.class &&
                    in_array(data?.class, [
                        'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                        'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                    ], true) &&
                    refresh_token
                ){
                    redirect(user.url.login());
                } else {
                    user.token(data.node?.token);
                    user.refreshToken(data.node?.refresh_token);
                    /* dont do:
                    const node = data?.node;
                    delete node?.token;
                    delete node?.refresh_token;
                    user.data(node);
                     */
                    file.open_file_with(element);
                    /*
                    header('Authorization', 'Bearer ' + user.token());
                    request(route.backend, node, (url, data) => {
                        if(data?.list){
                            request(
                                route.frontend, {
                                    'file' : element.data('file'),
                                    'list' : data.list,
                                }, (url, response) => {
                                });
                        }
                    });
                     */
                }
            });
        }
        else if(
            response?.class &&
            in_array(response?.class, [
                'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                'Package\\Raxon\\Account\\Exception\\AuthorizationException',
            ], true) &&
            !refresh_token
        ){
            redirect(user.url.login());
        }
        else if(
            response?.class &&
            in_array(response?.class, exception_message, true)
        ){
            file.exception.message(section, response);
        } else if(response?.list){
            request(
                route.frontend, {
                    'file' : element.data('file'),
                    'list' : response.list,
                }, (url, data) => {
                });
        } else {
            console.log(response);
        }
    });
}

file.delete = (element) => {
    const section = getSectionById(file.data.get('section.id'));
    if(!section){
        return;
    }
    const context_menu = section.select('.context-menu');
    const context_menu_item = section.select('.context-menu-item');
    file.data.delete('context.menu.active');
    file.data.delete('context.menu.item.active');
    if(context_menu){
        context_menu.remove();
    }
    if(context_menu_item){
        context_menu_item.remove();
    }

    const route = {
        delete : file.data.get('route.backend.file.delete')
    };
    const token = user.token();
    const refresh_token = user.refreshToken();
    let node;
    if(element.data('type') === 'File'){
        node = {
            "url": element.data('file'),
            "request-method": "DELETE"
        }
    } else {
        node = {
            "url": element.data('dir'),
            "request-method": "DELETE"
        }
    }
    header("Authorization", 'Bearer ' + token);
    request(route.delete, node, (url, response) => {
        if(
            response?.class &&
            in_array(
                response?.class, [
                    'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                    'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                ],
                true
            )
        ){
            user.authorization((url, data) => {
                if (
                    data?.class &&
                    in_array(
                        data?.class, [
                            'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                            'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                        ],
                        true
                    ) &&
                    refresh_token
                ) {
                    if(user.url.login()){
                        redirect(user.url.login());
                    }
                }
                else if (
                    data.node?.token &&
                    data.node?.refresh_token
                ){
                    user.token(data.node?.token);
                    user.refreshToken(data.node?.refresh_token);
                    const original = user.data();
                    const user_node = data?.node || {};
                    delete user_node?.token;
                    delete user_node?.refresh_token;
                    const merge = { ...original, ...user_node };
                    user.data(merge);
                    file.delete(element);
                    /*
                    header("Authorization", 'Bearer ' + user.token());
                    request(route.delete, node, (url, response) => {
                        const refresh = section.select('.refresh');
                        refresh.click();
                    });
                     */
                } else {
                    file.delete(element);
                    /*
                    const refresh = section.select('.refresh');
                    refresh.click();
                     */
                }
            });
        }
        else if(response?.error){
            console.log(response);
        }
        else {
            const refresh = section.select('.refresh');
            refresh.click();
        }
    });
}

file.download = async (element) => {
    const section = getSectionById(file.data.get('section.id'));
    if(!section){
        return;
    }
    const context_menu = section.select('.context-menu');
    const context_menu_item = section.select('.context-menu-item');
    file.data.delete('context.menu.active');
    file.data.delete('context.menu.item.active');
    if(context_menu){
        context_menu.remove();
    }
    if(context_menu_item){
        context_menu_item.remove();
    }

    const route = {
        url : file.data.get('route.backend.file.download')
    };
    const token = user.token();
    let node;
    if(element.data('type') === 'File'){
        node = {
            "url": _('_').urlencode(element.data('file')),
            "type": element.data('type'),
        }
    } else {
        node = {
            "url": _('_').urlencode(element.data('dir')),
            "type": element.data('type'),
        }
        //not sure yet, maybe an archive...
        return;
    }
    console.log(node);
    let user_current = user.data();
    const url = route.url + '?url=' + node.url + '&key=' + user_current?.key + '&type=' + node.type;
    const a = document.createElement('a');
    a.href = url;
    a.download = _('_').basename(element.data('file')); // Change as needed
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();



    /*
    console.log(url);
    console.log('https://api.workandtravel.staging/FileSystem/?url=%2Fmnt%2FVps3%2FMount%2FAudio%2FMusic%2F17-2026%2FRaXon+-+Roadtrip.230.mp3&key=6d783970-a88f-4ff2-a528-25cf47ae6de2-3df28013-1afc-408b-9435-57ee2e330c65');

    console.log(node);


    const response = await fetch(route.url, {
        method: 'POST', // HTTP method
        body: JSON.stringify(node),
        headers: {
            'Authorization': 'Bearer ' + token,
            // 'Accept': 'application/octet-stream'
        }
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    // Convert response to Blob
    const blob = await response.blob();

    // Create temporary URL
    const blobUrl = URL.createObjectURL(blob);

    // Create anchor element for download
    const a = document.createElement('a');
    a.href = blobUrl;
    console.log(_('_').basename(element.data('file')));
    a.download = _('_').basename(element.data('file')); // Change as needed
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Release memory
    URL.revokeObjectURL(blobUrl);
     */
}

file.rename = (element) => {
    const section = getSectionById(file.data.get('section.id'));
    if(!section){
        return;
    }
    const context_menu = section.select('.context-menu');
    const context_menu_item = section.select('.context-menu-item');
    file.data.delete('context.menu.active');
    file.data.delete('context.menu.item.active');
    if(context_menu){
        context_menu.remove();
    }
    if(context_menu_item){
        context_menu_item.remove();
    }

    const route = {
        rename : file.data.get('route.backend.file.rename')
    };
    let editable = element.next('li');
    let name = editable.textContent;
    editable.html('<form name="file-rename"><input type="hidden" name="source" value="' + name + '"><input type="text" name="destination" value="' + name + '"></form>');
    let destination = editable.select('input[name="destination"]');
    let form_rename = editable.select('form[name="file-rename"]');
    form_rename.on('submit', (event) => {
        event.preventDefault();
    });
    destination.on('change', (event) => {
        if(!editable.data('submit')){
            const token = user.token();
            let node;
            if(editable.data('type') === 'File'){
                node = {
                    "source": editable.data('dir') + editable.select('input[name="source"]').value,
                    "destination": editable.data('dir') + editable.select('input[name="destination"]').value,
                }
            } else {
                let dir = editable.data('dir');
                dir = dir.split('/');
                dir.pop();
                dir.pop();
                dir.push('');
                dir = dir.join('/');
                node = {
                    "source": dir + editable.select('input[name="source"]').value,
                    "destination": dir + editable.select('input[name="destination"]').value,
                }
            }
            editable.data('submit', true);
            editable.html(editable.select('input[name="destination"]').value + '&nbsp;<i class="fas fa-spinner fa-spin"></i>');
            header("Authorization", 'Bearer ' + token);
            request(route.rename, node, (url, response) => {
                if(
                    response?.class &&
                    in_array(
                        response?.class, [
                            'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                            'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                        ],
                        true
                    )
                ){
                    user.authorization((url, data) => {
                        if (
                            data?.class &&
                            in_array(
                                data?.class, [
                                    'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                    'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                ],
                                true
                            ) &&
                            refresh_token
                        ) {
                            if(url_login){
                                redirect(url_login);
                            }
                        }
                        else if (
                            data.node?.token &&
                            data.node?.refresh_token
                        ){
                            user.token(data.node?.token);
                            user.refreshToken(data.node?.refresh_token);
                            const original = user.data();
                            const user_node = data?.node || {};
                            delete user_node?.token;
                            delete user_node?.refresh_token;
                            const merge = { ...original, ...user_node };
                            user.data(merge);
                            header("Authorization", 'Bearer ' + user.token());
                            request(route.rename, node, (url, response) => {
                                const refresh = section.select('.refresh');
                                refresh.click();
                            });
                        } else {
                            const refresh = section.select('.refresh');
                            refresh.click();
                        }
                    });
                }

            });
        }
    })
    destination.focus();
    destination.on('blur', (event) => {
        if(!editable.data('submit')){
            const token = user.token();
            let node;
            if(editable.data('type') === 'File'){
                node = {
                    "source": editable.data('dir') + editable.select('input[name="source"]').value,
                    "destination": editable.data('dir') + editable.select('input[name="destination"]').value,
                }
            } else {
                let dir = editable.data('dir');
                dir = dir.split('/');
                dir.pop();
                dir.pop();
                dir.push('');
                dir = dir.join('/');
                node = {
                    "source": dir + editable.select('input[name="source"]').value,
                    "destination": dir + editable.select('input[name="destination"]').value,
                }
            }
            editable.html(editable.select('input[name="destination"]').value + '&nbsp;<i class="fas fa-spinner fa-spin"></i>');
            editable.data('submit', true);
            header("Authorization", 'Bearer ' + token);
            request(route.rename, node, (url, response) => {
                if(
                    response?.class &&
                    in_array(
                        response?.class, [
                            'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                            'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                        ],
                        true
                    )
                ){
                    user.authorization((url, data) => {
                        if (
                            data?.class &&
                            in_array(
                                data?.class, [
                                    'Package\\Raxon\\Account\\Exception\\TokenExpiredException',
                                    'Package\\Raxon\\Account\\Exception\\AuthorizationException',
                                ],
                                true
                            ) &&
                            refresh_token
                        ) {
                            if(url_login){
                                redirect(url_login);
                            }
                        }
                        else if (
                            data.node?.token &&
                            data.node?.refresh_token
                        ){
                            user.token(data.node?.token);
                            user.refreshToken(data.node?.refresh_token);
                            const original = user.data();
                            const user_node = data?.node || {};
                            delete user_node?.token;
                            delete user_node?.refresh_token;
                            const merge = { ...original, ...user_node };
                            user.data(merge);
                            header("Authorization", 'Bearer ' + user.token());
                            request(route.rename, node, (url, response) => {
                                const refresh = section.select('.refresh');
                                refresh.click();
                            });
                        } else {
                            const refresh = section.select('.refresh');
                            refresh.click();
                        }
                    });
                }
            });
        }
    });
}

file.new_file = (element) => {
    const section = getSectionById(file.data.get('section.id'));
    if(!section){
        return;
    }
    const context_menu = section.select('.context-menu');
    const context_menu_item = section.select('.context-menu-item');
    file.data.delete('context.menu.active');
    file.data.delete('context.menu.item.active');
    if(context_menu){
        context_menu.remove();
    }
    if(context_menu_item){
        context_menu_item.remove();
    }
    const route = {
        file : {
            new: file.data.get('route.backend.file.create.file')
        },
        // frontend : file.data.get('route.frontend.application')
    };
    let div = create('div');
    const dialog_active = section.select('.dialog-active');
    dialog_active.removeClass('dialog-active');
    div.addClass('dialog dialog-active dialog-new-file');
    div.innerHTML = '<div class="head"><h1><img src="/Application/Filemanager/Icon/Icon.png" class="icon"> New file</h1><span class="close"><i class="fas fa-window-close"></i></span><span class="minimize"><i class="far fa-window-minimize"></i></span></div><div class="body"><form name="file-new"><input type="text" name="file_new" placeholder="New filename" /><br><button type="submit" name="ok">Ok</button><button type="button" name="cancel">Cancel</button></form></div>';
    // let body = element.closest('.body');

    const dialog = section.select('.dialog-manager-main');
    div.style.zIndex = parseInt(dialog.style.zIndex) + 1;
    section.appendChild(div);
    let form = div.select('form[name="file-new"]');
    let input_file_new = div.select('input[name="file_new"]');
    form.on('submit', (event) => {
        event.preventDefault();
        const token = user.token();
        let node = {
            "type": "File",
            "url": _('prototype').str_replace('../','', element.data('dir') + input_file_new.value)
        }
        header("Authorization", 'Bearer ' + token);
        request(route.file.new, node, (url, response) => {
            const refresh = section.select('.refresh');
            refresh.click();
            div.remove();
        });
    });
    // button_ok.on('click', (event) => {});

    let button_cancel = div.select('button[name="cancel"]');
    button_cancel.on('click', (event) => {
        div.remove();
    });
    let button_close = div.select('.close');
    button_close.on('click', (event) => {
        div.remove();
    })
    div.on('click', (event) => {
        div.addClass('dialog-active');
    });
    dialog.init(file.data.get('section.id'));
    input_file_new.focus();
}

file.new_directory = (element) => {
    const section = getSectionById(file.data.get('section.id'));
    if(!section){
        return;
    }
    const context_menu = section.select('.context-menu');
    const context_menu_item = section.select('.context-menu-item');
    file.data.delete('context.menu.active');
    file.data.delete('context.menu.item.active');
    if(context_menu){
        context_menu.remove();
    }
    if(context_menu_item){
        context_menu_item.remove();
    }
    const route = {
        directory : {
            new : file.data.get('route.backend.file.create.directory')
        },
        // frontend : file.data.get('route.frontend.application')
    };
    let div;
    div = section.select('.dialog-new-directory');
    const dialog = section.select('.dialog-manager-main');
    let button_ok;
    let button_cancel;
    let button_close;
    if(div){
        const dialog_active = section.select('.dialog-active');
        if(dialog_active){
            dialog_active.removeClass('dialog-active');
        }
        div.addClass('dialog dialog-active dialog-new-directory');
        button_ok = div.select('button[name="ok"]');
        button_cancel = div.select('button[name="cancel"]');
        button_close = div.select('.close');
    } else {
        div = create('div');
        const dialog_active = section.select('.dialog-active');
        if(dialog_active){
            dialog_active.removeClass('dialog-active');
        }
        div.addClass('dialog dialog-active dialog-new-directory');
        /*
        div.style.position = 'absolute';
        div.style.top = '50%';
        div.style.left = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.zIndex = '1000';
        div.style.backgroundColor = '#fff';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        div.style.textAlign = 'center';
        div.style.width = '300px';
        div.style.height = '100px';
         */
        div.innerHTML = '<div class="head"><h1><img src="/Application/Filemanager/Icon/Icon.png" class="icon"> New directory</h1><span class="close"><i class="fas fa-window-close"></i></span><span class="minimize"><i class="far fa-window-minimize"></i></span></div><div class="body"><form name="directory-new"><input type="text" name="directory_new" placeholder="New directory" /><br><button type="submit" name="ok">Ok</button><button type="button" name="cancel">Cancel</button></form></div>';
        // let body = element.closest('.body');
        div.style.zIndex = parseInt(dialog.style.zIndex) + 1;
        section.appendChild(div);
        let body = div.select('body');
        let form = div.select('form[name="directory-new"]');
        let input_directory_new = div.select('input[name="directory_new"]');
        button_ok = div.select('button[name="ok"]');
        form.on('submit', (event) => {
            event.preventDefault();
            const token = user.token();
            let node = {
                "type": "Dir",
                "url": _('prototype').str_replace('../','', element.data('dir') + input_directory_new.value)
            }
            header("Authorization", 'Bearer ' + token);
            request(route.directory.new, node, (url, data) => {
                if(data?.class === 'Raxon\\Exception\\DirectoryNotExistException'){
                    if(data?.message){
                        const section = getSectionById(file.data.get('section.id'));
                        if(!section){
                            return;
                        }
                        let form = section.select('form[name="directory-new"]');
                        let body = form.closest('.body');
                        let message = body.select('.message');
                        message.html(data?.message);
                    }
                }
                else if(data?.class === 'Raxon\\Exception\\DirectoryCreateException'){
                    const section = getSectionById(file.data.get('section.id'));
                    if(!section){
                        return;
                    }
                    let form = section.select('form[name="directory-new"]');
                    let body = form.closest('.body');
                    let message = body.select('.message');
                    message.html(data?.message);
                }
                else {
                    const refresh = section.select('.refresh');
                    refresh.click();
                    div.remove();
                }
            });
        });
        // button_ok.on('click', (event) => {});

        button_cancel = div.select('button[name="cancel"]');
        button_cancel.on('click', (event) => {
            div.remove();
        });
        button_close = div.select('.close');
        button_close.on('click', (event) => {
            div.remove();
        })
        div.on('click', (event) => {
            div.addClass('dialog-active');
        });
    }
    dialog.init(file.data.get('section.id'));
    button_ok.focus();
    //input_directory_new.focus();
}

file.section_active = (id) => {
    let active = file.data.get('active');
    let index;
    for(index=0; index < active.length; index++){
        if(id === active[index]){
            file.data.set('section.id', id);
            return;
        }
    }
}

export { file }