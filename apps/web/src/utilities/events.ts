function subscribe(
  eventName: string,
  listener: EventListenerOrEventListenerObject,
) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(
  eventName: string,
  listener: EventListenerOrEventListenerObject,
) {
  document.removeEventListener(eventName, listener);
}

function publish<T>(eventName: string, detail: T) {
  const event = new CustomEvent(eventName, { detail });
  document.dispatchEvent(event);
}

export { publish, subscribe, unsubscribe };
