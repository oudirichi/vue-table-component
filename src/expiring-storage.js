class ExpiringStorage {
  static get(key) {
    const cached = JSON.parse(localStorage.getItem(key));

    if (!cached) {
      return null;
    }

    const expires = new Date(cached.expires);

    if (expires < new Date()) {
      localStorage.removeItem(key);
      return null;
    }

    return cached.value;
  }

  static has(key) {
    return this.get(key) !== null;
  }

  static set(key, value, lifeTimeInMinutes) {
    const currentTime = new Date().getTime();

    const secondsInMinute = 60;
    const milisecondsInSecond = 1000;

    const expires = new Date(currentTime + (lifeTimeInMinutes * secondsInMinute * milisecondsInSecond));

    localStorage.setItem(key, JSON.stringify({ value, expires }));
  }
}

export default ExpiringStorage;
