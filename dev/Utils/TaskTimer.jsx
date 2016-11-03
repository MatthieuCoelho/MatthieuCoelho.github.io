import EventEmitter from 'eventemitter3';

const DEFAULT = {
    INTERVAL: 1000
};


class TaskTimer extends EventEmitter {

    constructor(interval = DEFAULT.INTERVAL) {
        super();
        this._ = {};
        this._reset();
        this._.interval = interval;
    }
    get interval() {
        return this._.interval;
    }
    set interval(value) {
        this._.interval = value || DEFAULT.INTERVAL;
    }

    get state() {
        return this._.state;
    }

    get time() {
        let current = this.state !== TaskTimer.State.STOPPED ? Date.now() : this._.stopTime;
        return Object.freeze({
            started: this._.startTime,
            stopped: this._.stopTime,
            elapsed: current - this._.startTime
        });
    }

  
    get tickCount() {
        return this._.tickCount;
    }

    get taskCount() {
        return Object.keys(this._.tasks).length;
    }

   
    _stop() {
        if (this._.timer) {
            clearInterval(this._.timer);
            this._.timer = null;
        }
    }

   
    _reset() {
        this._stop();
        var interval = this._.interval;
        this._ = {
            interval: interval,
            timer: null,
            state: TaskTimer.State.IDLE,
            tasks: {},
            tickCount: 0,
            startTime: 0,
            stopTime: 0
        };
    }

    _tick() {
        let name, task,
            tasks = this._.tasks;

        this._.tickCount += 1;
        this.emit(TaskTimer.Event.TICK);

        for (name in this._.tasks) {
            if (tasks[name]) {
                task = tasks[name];
                if (task.firstTick == 0) {
                    task.firstTick = this._.tickCount-1
                }
                if(name == "Sorts Hot" && task.currentRuns < task.totalRuns){
                    console.log("task name"+name);
                    console.log("task.firstTick   "+task.firstTick);
                    console.log("this._.tickCount   "+this._.tickCount);
                    console.log(" task.tickInterval    "+ task.tickInterval);
                    console.log("(this._.tickCount-task.firstTick) % task.tickInterval    "+(this._.tickCount-task.firstTick) % task.tickInterval);
                }

                if ((this._.tickCount-task.firstTick) % task.tickInterval === 0) {
                    if (!task.totalRuns || task.currentRuns < task.totalRuns) {
                        task.currentRuns += 1;
                        if (typeof task.callback === 'function') {
                            task.callback(task);
                        }
                        this.emit(TaskTimer.Event.TASK, task);
                    }
                }
            }
        }
    }

    _run() {
        this._.timer = setInterval(() => {
            // safe to use parent scope `this` in arrow functions.
            this._tick();
            this._.state = TaskTimer.State.RUNNING;
        }, this._.interval);
    }

  
    emit(eventName, object) {
        var event = {
            type: eventName,
            source: this
        };
        switch (eventName) {
            case TaskTimer.Event.TASK:
            case TaskTimer.Event.TASK_ADDED:
            case TaskTimer.Event.TASK_REMOVED:
                event.task = object;
                break;
            default:
                break;
        }
        super.emit(eventName, event);
        return this;
    }
  
    fire(eventName, object) {
        return this.emit(eventName, object);
    }

  
    getTask(name) {
        return this._.tasks[name];
    }

    
    addTask(options = { tickInterval: 1, totalRuns: 0 }) {
        if (typeof options === 'string') {
            options = {
                name: options,
                tickInterval: 1,
                totalRuns: 0
            };
        }
        if (!options.name) {
            throw new Error('Task name is required.');
        }
        if (this._.tasks[options.name]) {
            throw new Error('Task with name "' + options.name + '" already exists.');
        }
        let task = _defaults(options, {
            currentRuns: 0,
            firstTick: 0, 
            tickInterval : 100
        });
        this._.tasks[options.name] = task;
        this.emit(TaskTimer.Event.TASK_ADDED, this.getTask(options.name));
        return this;
    }

  
    resetTask(name) {
        if (!name || !this._.tasks[name]) {
            //throw new Error('Task with name "' + name + '" does not exist.');
            return false;
        }
        this._.tasks[name].currentRuns = 0;
        this._.tasks[name].firstTick = 0;
        return true;
    }

    removeAllTask() {
        for (name in this._.tasks) {
           this.removeTask(name);
        }
    }
 
    removeTask(name) {
        if (!name || !this._.tasks[name]) {
            console.log('Warning : Task with name "' + name + '" does not exist.');
            return;
        }
        var removedTask = this._.tasks[name];
        this._.tasks[name] = null;
        delete this._.tasks[name];
        this.emit(TaskTimer.Event.TASK_REMOVED, removedTask);
        return this;
    }

    start() {
        this._stop();
        this._.startTime = Date.now();
        this._.stopTime = 0;
        this._.tickCount = 0;
        this._run();
        this._.state = TaskTimer.State.RUNNING;
        this.emit(TaskTimer.Event.STARTED);
        return this;
    }

   
    pause() {
        if (this.state !== TaskTimer.State.RUNNING) return this;
        this._stop();
        this._.state = TaskTimer.State.PAUSED;
        this.emit(TaskTimer.Event.PAUSED);
        return this;
    }

    
    resume() {
        if (this.state !== TaskTimer.State.PAUSED) return this;
        this._run();
        this._.state = TaskTimer.State.RUNNING;
        this.emit(TaskTimer.Event.RESUMED);
        return this;
    }

 
    stop() {
        if (this.state !== TaskTimer.State.RUNNING) return this;
        this._stop();
        this._.stopTime = Date.now();
        this._.state = TaskTimer.State.STOPPED;
        this.emit(TaskTimer.Event.STOPPED);
        return this;
    }

  
    reset() {
        this._reset();
        this.emit(TaskTimer.Event.RESET);
        return this;
    }

    listenerCount(eventName) {
        return this.listeners(eventName).length;
    }

}


TaskTimer.Event = Object.freeze({
    /**
     * Emitted on each tick (interval) of `TaskTimer`.
     * @memberof TaskTimer.Event
     * @type {String}
     */
    TICK: 'tick',
    /**
     * Emitted when the timer is put in `RUNNING` state; such as when the timer is
     * started.
     * @memberof TaskTimer.Event
     * @type {String}
     */
    STARTED: 'started',
    /**
     * Emitted when the timer is put in `RUNNING` state; such as when the timer is
     * resumed.
     * @memberof TaskTimer.Event
     * @type {String}
     */
    RESUMED: 'resumed',
    /**
     * Emitted when the timer is put in `PAUSED` state.
     * @memberof TaskTimer.Event
     * @type {String}
     */
    PAUSED: 'paused',
    /**
     * Emitted when the timer is put in `STOPPED` state.
     * @memberof TaskTimer.Event
     * @type {String}
     */
    STOPPED: 'stopped',
    /**
     * Emitted when the timer is reset.
     * @memberof TaskTimer.Event
     * @type {String}
     */
    RESET: 'reset',
    /**
     * Emitted when a task is executed.
     * @memberof TaskTimer.Event
     * @type {String}
     */
    TASK: 'task',
    /**
     * Emitted when a task is added to `TaskTimer` instance.
     * @memberof TaskTimer.Event
     * @type {String}
     */
    TASK_ADDED: 'taskAdded',
    /**
     * Emitted when a task is removed from `TaskTimer` instance.
     * Note that this will not be emitted when `.reset()` is called; which
     * removes all tasks silently.
     * @memberof TaskTimer.Event
     * @type {String}
     */
    TASK_REMOVED: 'taskRemoved'
});

/**
 * Enumerates the `TaskTimer` states.
 * @enum {Number}
 * @readonly
 */
TaskTimer.State = Object.freeze({
    /**
     * Indicates that the timer is in `IDLE` state.
     * This is the initial state when the `TaskTimer` instance is first created.
     * Also when an existing timer is reset, it will be `IDLE`.
     * @memberof TaskTimer.State
     * @type {Number}
     */
    IDLE: 0,
    /**
     * Indicates that the timer is in `RUNNING` state; such as when the timer is
     * started or resumed.
     * @memberof TaskTimer.State
     * @type {Number}
     */
    RUNNING: 1,
    /**
     * Indicates that the timer is in `PAUSED` state.
     * @memberof TaskTimer.State
     * @type {Number}
     */
    PAUSED: 2,
    /**
     * Indicates that the timer is in `STOPPED` state.
     * @memberof TaskTimer.State
     * @type {Number}
     */
    STOPPED: 3
});

function _defaults(object, defaults) {
    if (!object) return defaults || {};
    if (!defaults) return object || {};
    var key;
    for (key in defaults) {
        if (defaults.hasOwnProperty(key)
            && object[key] === undefined) {
            object[key] = defaults[key];
        }
    }
    return object;
}

export default TaskTimer;