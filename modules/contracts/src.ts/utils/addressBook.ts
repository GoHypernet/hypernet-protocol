import fs from "fs";

import { AddressBookEntry, AddressBook as AddressBookJson } from "@connext/types";
import { AddressZero } from "@ethersproject/constants";

export interface AddressBook {
  getEntry: (contractName: string) => AddressBookEntry;
  setEntry: (contractName: string, entry: AddressBookEntry) => void;
}

export const getAddressBook = (path: string, chainId: string): AddressBook => {
  if (!path) throw new Error(`A path to the address book file is required.`);
  if (!chainId) throw new Error(`A chainId is required.`);
  let addressBook: AddressBookJson = { [chainId]: {} };

  try {
    addressBook = JSON.parse(fs.readFileSync(path, "utf8") || "{}") as AddressBookJson;
  } catch (e) {
    if (e.message.includes("ENOENT: no such file")) {
      fs.writeFileSync(path, `{"${chainId}":{}}`);
    } else {
      throw e;
    }
  }

  addressBook = addressBook || {};
  addressBook[chainId] = addressBook[chainId] || {};

  return {
    getEntry: (contractName: string): AddressBookEntry => {
      try {
        return addressBook[chainId][contractName] || { address: AddressZero };
      } catch (e) {
        return { address: AddressZero };
      }
    },
    setEntry: (contractName: string, entry: AddressBookEntry): void => {
      addressBook[chainId][contractName] = entry;
      try {
        fs.writeFileSync(path, JSON.stringify(addressBook, null, 2));
      } catch (e) {
        console.log(`Error saving artifacts: ${e.message}`);
      }
    },
  };
};
