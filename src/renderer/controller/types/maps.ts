import { FloatingValueMap, Message } from "floating-live";
import { FloatingSnapshot } from "./api";

export interface ControllerHookMap {
  send: { name: string; args: any[] };
  message: { message: Message.All };
}

export interface ControllerEventMap {
  snapshot: (snapshot: FloatingSnapshot) => void;
  message: (message: Message.All) => void;
  "command:add": (name: string, fromController: boolean) => void;
  "command:remove": (name: string, fromController: boolean) => void;
  "value:add": (name: keyof ControllerValueMap) => void;
  "value:remove": (name: keyof ControllerValueMap) => void;
}

export interface ControllerCommandMap {
  get: <N extends keyof (ControllerValueMap | FloatingValueMap)>(
    name: N
  ) => ControllerValueMap[N] | Promise<FloatingValueMap[N]>;
  set: <N extends keyof (ControllerValueMap | FloatingValueMap)>(
    name: N,
    value: ControllerValueMap[N] | FloatingValueMap[N]
  ) => boolean | Promise<boolean>;
}

export interface ControllerValueMap {}
