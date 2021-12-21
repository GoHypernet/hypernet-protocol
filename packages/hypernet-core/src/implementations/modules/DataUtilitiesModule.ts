import { ContainerModule, interfaces } from "inversify";

import { StorageUtils } from "@implementations/data/utilities";

import { IStorageUtils, IStorageUtilsType } from "@interfaces/data/utilities";

export const dataUtilitiesModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IStorageUtils>(IStorageUtilsType).to(StorageUtils).inRequestScope();
  },
);
