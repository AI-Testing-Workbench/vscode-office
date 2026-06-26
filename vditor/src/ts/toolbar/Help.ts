import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";
// @ts-ignore
import sponsorIconUrl from "../../assets/sponsor-icon.png";

export class Help extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);

        const btn = this.element.children[0] as HTMLElement;
        btn.setAttribute("aria-label", "About");
        btn.innerHTML = `<img src="${sponsorIconUrl}" alt="About" class="vditor-sponsor-toolbar-icon" draggable="false"/>`;

        const opts = vditor.options;
        btn.addEventListener(getEventName(), (event) => {
            event.preventDefault();
            if (opts.onAboutOpen) {
                opts.onAboutOpen();
            }
        });
    }
}
