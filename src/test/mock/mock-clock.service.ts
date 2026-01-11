import { ClockService } from "../../app/service/clock.service";

export class MockClockService extends ClockService {
    private _now: Date;

    constructor(now: Date) {
        super();
        this._now = now;
    }

    override now(): Date {
        return this._now;
    }
}