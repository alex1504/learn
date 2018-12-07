class Publisher {
    constructor() {
        this.subs = {}
    }

    subscribe(ev, cb) {
        if (typeof cb !== 'function') {
            throw Error('Callback must be a function')
        }
        if (typeof this.subs[ev] === 'undefined') {
            this.subs[ev] = []
        }
        this.subs[ev].push(cb)
    }

    unsubscribe(ev, cb) {
        if (typeof cb !== 'function') {
            throw Error('Callback must be a function')
        }
        if (this.subs[ev] && this.subs[ev].length) {
            const cbList = this.subs[ev]
            for (let i = 0; i < cbList.length; i++) {
                if (cbList[i] === cb) {
                    this.subs[ev].splice(i, 1)
                }
            }
        }
    }

    publish(ev, ...args) {
        if (this.subs[ev]) {
            for (let i = 0; i < this.subs[ev].length; i++) {
                this.subs[ev][i](...args)
            }
        }
    }
}

const publisher = new Publisher()

publisher.subscribe('event', (...args) => {
    console.log(args)
})

setTimeout(() => {
    publisher.publish('event', 'mydata', 'otherdata')
}, 1000);
