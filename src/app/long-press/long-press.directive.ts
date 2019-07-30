import {
    Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit,
    Output
} from '@angular/core';
import { Observable, SubscriptionLike as ISubscription, timer } from 'rxjs';

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
    private lastY: number;

    constructor() { }

    public ngOnInit() {
        this.timer = timer(this.appLongPress || 500);
    }

    public ngOnDestroy() {
        this.unsubscribe();
    }

    private addDistance(value: number) {
        this.distance += Math.abs(value);
        if (this.distance > SCROLL_DISTANCE) {
            this.unsubscribe();
        }
    }

    @HostListener('touchmove', ['$event'])
    public onTouchMove(event: TouchEvent): void {
        if (!this.subscription) {
            return;
        }
        const { clientY } = event.touches[0];
        this.addDistance(clientY - (this.lastY || clientY));
        this.lastY = clientY;
    }

    @HostListener('mousemove', ['$event'])
    public onMouseMove(event: MouseEvent): void {
        if (!this.subscription) {
            return;
        }
        this.addDistance(event.movementY);
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
        this.lastY = 0;
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
