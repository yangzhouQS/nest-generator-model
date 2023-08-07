import { Injectable } from '@nestjs/common';
import { AutoOptions, SequelizeAuto } from './sequelize-auto';
import { config } from './config';
import * as $lodash from 'lodash';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  generatorModel(): string {
    const auto = new SequelizeAuto(
      config.database,
      config.username,
      config.password,
      config as AutoOptions,
    );

    auto.run();
    return 'generatorModel';
  }
}
