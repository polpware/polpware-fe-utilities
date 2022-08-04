import moment from 'moment';

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
        dateInLocal.getDate(),
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
        timeWrapper.date(),
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
    Year = 500,
    Custom = 1000
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

export enum MonthEnum {
    January = 1,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December
}

export function getMonthsOfYear() {
    const ret = [];
    for (var enumMember in MonthEnum) {
        var isValueProperty = parseInt(enumMember, 10) >= 0
        if (isValueProperty) {
            ret.push({
                value: enumMember,
                text: 'polpCronJob.' + MonthEnum[enumMember]
            });
        }
    }
    return ret;
}


export enum DayOfWeekEnum {
    Sunday = 0,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}


export function getDaysOfWeek() {
    const ret = [];
    for (var enumMember in DayOfWeekEnum) {
        var isValueProperty = parseInt(enumMember, 10) >= 0
        if (isValueProperty) {
            ret.push({
                value: enumMember,
                text: 'polpCronJob.' + DayOfWeekEnum[enumMember]
            });
        }
    }
    return ret;
}

export function getDaysOfMonth() {
    const ret = [];
    for (let i = 1; i < 32; i++) {
        ret.push({
            value: i,
            text: i.toString()
        });
    }
    return ret;
}
