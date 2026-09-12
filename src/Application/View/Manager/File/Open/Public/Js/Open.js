_('application.open').element = (type, id) => {
    let name;
    let section;
    let menu;
    switch(type){
        case 'section' :
            name = _('application.open').collection('section.name');
            console.log(name);
            section = select('section[name="' + name + '"]');
            if (section) {
                return section;
            }
            break;
        case 'menu' :
            section = _('application.open').getSection(id);
            if(!section){
                return;
            }
            menu = section.select('.menu');
            if(menu){
                return menu;
            }
            break;
        default :
            console.warn('application.open element (' + type + ') undefined...');
    }
}

_('application.open').select = (nodeList, id) => {
    let index;
    for(index=0; index < nodeList.length; index++){
        let node = nodeList[index];
        if(typeof node.attribute === 'function'){
            if(node.attribute('id') === id){
                return node;
            }
        }
    }
}


_('application.open').getSection = (id) => {
    let section = _('application.open').element('section');
    if(!section){
        return;
    }
    if(is.nodeList(section)) {
        if (id) {
            section = _('application.open').select(section, id);
            if (!section) {
                return;
            }
        }
    }
    return section;
}


_('application.open').open = (id) => {
    const section = _('application.open').getSection(id);
    if(!section){
        return;
    }
    section.removeClass('display-none');
    const li = section.select('li');
    let node;
    if(is.nodeList(li)){
        node = li[0];
        let index;
        for(index=0; index < li.length; index++){
            let item = li[index];
            item.on('click', (event) => {
                event.preventDefault();
                section.remove();
                item.request();
            });
        }
    } else {
        node = li;
        if(typeof node.on === 'function'){
            node.on('click', (event) => {
                event.preventDefault();
                section.remove();
                node.request();
            });
        }
    }
    if(node){
        li.removeClass('selected');
        node.addClass('selected');
    }
}