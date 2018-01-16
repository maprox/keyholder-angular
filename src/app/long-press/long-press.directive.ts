import {
    Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit,
    Output
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { ISubscription } from 'rxjs/Subscription';

@Directive({
    selector: '[appLongPress]'
})
export class LongPressDirective implements OnInit, OnDestroy {
    @Input() public appLongPress;
    @Output() public onRelease: EventEmitter<MouseEvent> = new EventEmitter();

    private timer: Observable<number>;
    private subscription: ISubscription;

    constructor() { }

    public ngOnInit() {
        this.timer = TimerObservable.create(this.appLongPress || 500);
    }

    public ngOnDestroy() {
        this.unsubscribe();
    }

    @HostListener('mouseup')
    @HostListener('touchend')
    public onMouseUp(): void {
        this.unsubscribe();
    }

    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    public onMouseDown(event: MouseEvent): void {
        this.subscription = this.timer.subscribe(() => {
            this.unsubscribe();
            this.onRelease.emit(event);
        });
    }

    private unsubscribe(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
}
