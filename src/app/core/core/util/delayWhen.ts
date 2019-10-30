import {Observable, Subscription} from 'rxjs';

export function delayWhenObservable(callback: () => Observable<boolean>, initial?: boolean) {
  return function <T>(source: Observable<T>) {
    let cache: T[] = [];
    let conditionSubscription: Subscription;
    let fireEvents: boolean;

    return Observable.create(subscriber => {
      const condition = callback();

      fireEvents = initial;
      const tearDownFunction = () => {
        if (conditionSubscription) {
          conditionSubscription.unsubscribe();
        }
      };

      const chainSubscription = source.subscribe(
        (data: T) => {
          if (fireEvents) {
            subscriber.next(data);
          } else {
            cache.push(data);
          }
        },
        (err: any) => subscriber.error(err),
        () => tearDownFunction);

      conditionSubscription = condition.subscribe(
        (data: boolean) => {
          fireEvents = data;
          if (data) {
            cache.forEach(c => subscriber.next(c));
            cache = [];
          }
        },
        (err: any) => {
          subscriber.error(err);
        },
        tearDownFunction);

      return () => {
        tearDownFunction();
        chainSubscription.unsubscribe();
      };
    });
  };
}

