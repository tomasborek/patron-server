import { EventData, IObserver } from './observer';

interface IPublisher {
  subscribe: (observer: IObserver) => void;
  unsubscribe: (observer: IObserver) => void;
  notify: (data: EventData) => void;
}

export default class Publisher implements IPublisher {
  private observers: IObserver[] = [];

  subscribe = (observer: IObserver) => {
    this.observers.push(observer);
  };

  unsubscribe = (observer: IObserver) => {
    this.observers = this.observers.filter((obs) => obs !== observer);
  };

  notify = (data: EventData) => {
    this.observers.forEach((observer) => observer.update(data));
  };
}
