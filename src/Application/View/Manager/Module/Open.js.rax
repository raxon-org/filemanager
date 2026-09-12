//{{RAX}}
import { open } from "/Application/Module/Open.js";
import { dialog } from "/Dialog/Module/Dialog.js";
import { root } from "/Module/Web.js";
import { version } from "/Module/Priya.js";

require(
    [
        root() + 'Application/Css/Open.css?' + version(),
        root() + 'Dialog/Css/Dialog.css?' + version(),
    ],
    () => {
        open.init("{{$id}}");
        dialog.init("{{$id}}");
    }
);