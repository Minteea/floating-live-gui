import { makeAutoObservable } from 'mobx';

export default class StoreCommon {
  command_input: string = ""

  constructor() {
    makeAutoObservable(this);
  }
}
