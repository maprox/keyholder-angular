import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-fork-me',
    templateUrl: './fork-me.component.html',
    styleUrls: ['./fork-me.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ForkMeComponent {
    @Input() public url;
    constructor() { }
}
