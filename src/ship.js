export class Ship {
  constructor(length) {
    if (typeof length !== "number" || length < 2 || length > 5) {
      throw new Error(
        "Ship length must be no less than 2 and no greater than 5.",
      );
    }
    this.length = length;
    this.hitCount = 0;
    this.isSunkStatus = false;
  }

  hit() {
    this.hitCount += 1;
    return this.hitCount;
  }

  isSunk() {
    if (this.hitCount >= this.length) this.isSunkStatus = true;
    return this.isSunkStatus;
  }
}
