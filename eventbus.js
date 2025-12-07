
export class EventBus {
    constructor() {
        this.tileCallSubscribers = {}; //map to reduce lookups
        this.dirtyTilesSubscribers = []; 
    }

    unsubscribeAllTileCall() {
        this.tileCallSubscribers = {};
    }

    subscribeDirtyTile(handler) {
        this.dirtyTilesSubscribers.push(handler);
    }

    subscribeTileCall(address, handler) {
        if (!this.tileCallSubscribers[address]) {
            this.tileCallSubscribers[address] = []
        }

        this.tileCallSubscribers[address].push(handler);
    }

    publishTileCall(address, data) {
        const subscribers = this.tileCallSubscribers[address];
        if (subscribers) {
            subscribers.forEach(handler => {
                handler(data);
            });
        }
    }

    publishDirtyTile(data) {
        this.dirtyTilesSubscribers.forEach(handler => {
            handler(data);
        });
    }
}