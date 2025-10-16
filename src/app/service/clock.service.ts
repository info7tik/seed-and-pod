export default class ClockService {
    private readonly IS_LESS_THAN = 1;
    private readonly IS_GREATER_THAN = 2;
    private readonly IS_EQUAL = 3;

    now() {
        return new Date();
    }

    /**
     * Check if a date is in the future (only the year, month and day are considered)
     * @param date - The date to compare to the current date
     * @returns True if the date is in the future or equal to the current date, false otherwise
     */
    isFuture(date: Date): boolean {
        const now = this.now();
        const yearComparison = this.compare(now.getFullYear(), date.getFullYear());
        if (yearComparison !== this.IS_EQUAL) {
            return yearComparison === this.IS_LESS_THAN;
        }
        const monthComparison = this.compare(now.getMonth(), date.getMonth());
        if (monthComparison !== this.IS_EQUAL) {
            return monthComparison === this.IS_LESS_THAN;
        }
        return this.compare(now.getDate(), date.getDate()) !== this.IS_GREATER_THAN;
    }

    private compare(n1: number, n2: number): number {
        if (n1 < n2) {
            return this.IS_LESS_THAN;
        }
        if (n1 > n2) {
            return this.IS_GREATER_THAN;
        }
        return this.IS_EQUAL;
    }
}