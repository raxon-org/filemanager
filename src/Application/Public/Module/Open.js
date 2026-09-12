import { getSectionById } from "/Module/Section.js";

let open = {};

open.init = (id) => {
    const section = getSectionById(id);
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

export { open }