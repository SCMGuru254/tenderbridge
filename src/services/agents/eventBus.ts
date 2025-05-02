
import { BrowserEventEmitter } from '@/utils/BrowserEventEmitter';
import { Message } from './types';

export const agentEventBus = new BrowserEventEmitter();

export const sendMessage = (message: Message) => {
  agentEventBus.emit('message', message);
};
