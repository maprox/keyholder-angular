import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-fork-me',
    templateUrl: './fork-me.component.html',
    styleUrls: ['./fork-me.component.scss'],
    standalone: false
})
export class ForkMeComponent {
    @Input() public url;
    constructor() { }
}
