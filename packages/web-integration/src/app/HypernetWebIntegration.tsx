import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { TransactionList } from 'web-ui';
import MainContainer from '../containers/MainContainer';
import Authentication from '../screens/Authentication';
import { IHypernetWebIntegration } from './HypernetWebIntegration.interface';
import { StoreProvider } from '../contexts';
import {
  MAIN_CONTANER_ID_SELECTOR,
  TRANSACTION_LIST_ID_SELECTOR,
} from '../constants';

export default class HypernetWebIntegration implements IHypernetWebIntegration {
  constructor(options?: object) {
    if (!!HypernetWebIntegration.instance) {
      return HypernetWebIntegration.instance;
    }
    HypernetWebIntegration.instance = this;

    // Get whatever we want from client window object
    // Initialize hypernet invisible iframe
    this.hypernetCoreInstance.transactionList = [
      {
        id: 2,
        amount: window?.amount || 43,
      },
      {
        id: 5,
        amount: 54,
      },
    ];
  }
  public hypernetCoreInstance: any = {};
  private static instance: HypernetWebIntegration;

  private generateDomElement(selector: string) {
    this.removeExitedElement(selector);

    const element = document.createElement('div');
    element.setAttribute('id', selector);
    document.body.appendChild(element);
    document.getElementById(selector);

    return element;
  }

  private removeExitedElement(selector: string) {
    const element = document.getElementById(selector);
    if (element) {
      element.remove();
    }
  }

  private bootstrapComponent(component: React.ReactNode) {
    return (
      <StoreProvider
        initialData={{
          hypernetProtocol: { anything: 'anything asdsad' },
          ethAddress: 'ethAdress ggggg',
        }}
      >
        <MainContainer>{component}</MainContainer>
      </StoreProvider>
    );
  }

  public renderAuthentication(selector: string = MAIN_CONTANER_ID_SELECTOR) {
    ReactDOM.render(
      this.bootstrapComponent(<Authentication />),
      this.generateDomElement(selector)
    );
  }

  public renderTransactionList(
    selector: string = TRANSACTION_LIST_ID_SELECTOR
  ) {
    ReactDOM.render(
      this.bootstrapComponent(
        <TransactionList
          transactionDataList={this.hypernetCoreInstance.transactionList}
        />
      ),
      this.generateDomElement(selector)
    );
  }
}

declare let window: any;

window.HypernetWebIntegration = HypernetWebIntegration;
