import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

const handlers = [];
const modules = [CqrsModule];

@Global()
@Module({
  imports: [...modules],
  controllers: [],
  providers: [...handlers],
  exports: [...handlers, CqrsModule],
})
export class EventSourcingModule {}
