import { container } from 'tsyringe';

import { IDateProvider } from './DateProvider/IDateProvider';
import { DayjsDateProvider } from './DateProvider/implementations/DayjsDateProvader';

container.registerSingleton<IDateProvider>(
  'DayjsDateProvider',
  DayjsDateProvider
);
