request.onupgradeneeded = (event) => {
  db = event.target.result;
  if (!db.objectStoreNames.contains(storeName)) {
    db.createObjectStore(storeName, { keyPath: "date" });
  }
  if (!db.objectStoreNames.contains(goalStoreName)) {
    db.createObjectStore(goalStoreName, { keyPath: "id" });
  }
  if (!db.objectStoreNames.contains(timerStateStore)) {
    db.createObjectStore(timerStateStore, { keyPath: "id" });
  }
};
