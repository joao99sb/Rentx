import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../IDateProvider';

dayjs.extend(utc);

export class DayjsDateProvider implements IDateProvider {
  compareIfBefore(startDate: Date, endDate: Date): boolean {
    return dayjs(startDate).isBefore(endDate);
  }
  addDays(days: number): Date {
    return dayjs().add(days, 'days').toDate();
  }
  dateNow(): Date {
    return dayjs().toDate();
  }
  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }
  compareInHours(startDate: Date, endDate: Date): number {
    const endDateUtc = this.convertToUTC(endDate);
    const startDateUtc = this.convertToUTC(startDate);

    return dayjs(endDateUtc).diff(startDateUtc, 'hours');
  }
  compareInDays(startDate: Date, endDate: Date): number {
    const endDateUtc = this.convertToUTC(endDate);
    const startDateUtc = this.convertToUTC(startDate);

    return dayjs(endDateUtc).diff(startDateUtc, 'days');
  }
  addHours(hours: number): Date {
    return dayjs().add(hours, 'hour').toDate();
  }
}
