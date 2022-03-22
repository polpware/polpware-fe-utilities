import * as moment from 'moment';

/**
 * Converts the given date and time into a UTC time. 
 * If the given time zone is null or undefined, this 
 * method will not use the local time zone.
 * @param dateInLocal Date in local time
 * @param timeInLocal Time in local time
 * @param timezone Optional time zone
 */
export function convertToUtc(dateInLocal: Date, timeInLocal: Date, timezone?: number) {
    // Construct a new time 
    const workTime = new Date(dateInLocal.getFullYear(),
        dateInLocal.getMonth(),
        dateInLocal.getDay(),
        timeInLocal.getHours(),
        timeInLocal.getMinutes());
    const timeWrapper = moment(workTime);
    // The above time should be interpreted in the given timezone
    if (timezone) {
        // Utc time
        timeWrapper.subtract(timezone, 'hours');
    }

    // Convert to UTC time
    let timeInUtc = new Date(Date.UTC(timeWrapper.year(),
        timeWrapper.month(),
        timeWrapper.day(),
        timeWrapper.hour(),
        timeWrapper.minute(),
        timeWrapper.second()));

    return timeInUtc;
}

/**
 Get the timezone offset between the local time and UTC.
 */
export function getTimezoneOffset() {
    const d = new Date();
    const n = d.getTimezoneOffset();
    return - Math.floor(n / 60);
}

/**
 * A set of commonly used interval.
 */
export enum IntervalEnum {
    Day = 10,
    Week = 50,
    Month = 100,
    Year = 500
}

/**
 * Returns the UTC time this moment.
 * This method uses the current time zone.
 */
export function getUtcNow(): Date {
    const now = new Date();
    const offset = getTimezoneOffset();
    return convertToUtc(now, now, offset);
}

export function hasDST(date = new Date()) {
    const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(january, july) !== date.getTimezoneOffset();
}

/**
 * Converts a local time to Utc string.
 * @param date
 */
export function convertToUtcString(date: Date) {
    return date.toISOString();
}
