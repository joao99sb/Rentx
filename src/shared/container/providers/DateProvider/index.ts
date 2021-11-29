import { container } from 'tsyringe';

import { IDateProvider } from './IDateProvider';
import { DayjsDateProvider } from './implementations/DayjsDateProvader';

container.registerSingleton<IDateProvider>(
  'DayjsDateProvider',
  DayjsDateProvider
);
