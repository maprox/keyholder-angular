import {
    Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit,
    Output
} from '@angular/core';
import { Observable, SubscriptionLike as ISubscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

const SCROLL_DISTANCE = 10;

@Directive({
    selector: '[appLongPress]'
})
export class LongPressDirective implements OnInit, OnDestroy {
    @Input() public appLongPress;
    @Output() public onRelease: EventEmitter<MouseEvent> = new EventEmitter();

    private timer: Observable<number>;
    private subscription: ISubscription;
    private distance: number;

    constructor() { }

    public ngOnInit() {
        this.timer = TimerObservable.create(this.appLongPress || 500);
    }

    public ngOnDestroy() {
        this.unsubscribe();
    }

    @HostListener('mousemove', ['$event'])
    public onMouseMove(event: MouseEvent): void {
        if (!this.subscription) {
            return;
        }
        this.distance += Math.abs(event.movementY);
        if (this.distance > SCROLL_DISTANCE) {
            this.unsubscribe();
        }
    }

    @HostListener('mouseup')
    @HostListener('touchend')
    public onMouseUp(): void {
        this.unsubscribe();
    }

    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    public onMouseDown(event: MouseEvent): void {
        this.distance = 0;
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
