import { IDisplayService } from "@merchant-iframe/interfaces/business";
import {
  IHypernetCoreRepository,
  IHypernetCoreRepositoryType,
} from "@merchant-iframe/interfaces/data";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class DisplayService implements IDisplayService {
  constructor(
    @inject(IHypernetCoreRepositoryType)
    protected hypernetCoreRepository: IHypernetCoreRepository,
  ) {}
  public displayRequested(): ResultAsync<void, never> {
    return this.hypernetCoreRepository.emitDisplayRequested();
  }

  public closeRequested(): ResultAsync<void, never> {
    return this.hypernetCoreRepository.emitCloseRequested();
  }
}
