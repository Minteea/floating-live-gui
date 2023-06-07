import { makeAutoObservable } from 'mobx';

export default class StoreCommon {
  commandInput: string = ""

  constructor() {
    makeAutoObservable(this);
  }
}
