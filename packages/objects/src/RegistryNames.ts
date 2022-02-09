import { RegistryName } from "@objects/RegistryName";

export class RegistryNames {
  constructor(
    public hypernetProfiles: RegistryName | null,
    public gateways: RegistryName | null,
    public liquidityProviders: RegistryName | null,
    public paymentTokens: RegistryName | null,
    public registryModules: RegistryName | null,
    public hypernetID: RegistryName | null,
  ) {}
}
