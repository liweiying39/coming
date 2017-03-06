class Timer {
  constructor () {
    this.stay_time = 4000;
    this.component = null;
    this.event_id = null;
    this.is_running = false;
    this.is_ignored = false;
  }

  bind (component) {
    this.event_id = null;
    this.component = component;
    return this;
  }

  start (event_id) {
    this.event_id = event_id;
    this.is_running = true;
    this.loop();
  }

  stop () {
    this.is_running = false;
  }

  loop () {
    const self = this;
    setTimeout(() => {
      if (!self.is_running)
        return;

      let group = self.component.$store.state.event_news.news_group[self.event_id];
      if (!self.is_ignored && group && group.length)
        self.component.$store.commit('SHIFT_EVENT_NEWS', self.event_id);
      else
        self.is_ignored = false;

      self.loop()
    }, self.stay_time)
  }

  ignore () {
    console.warn('ignore toggle');
    this.is_ignored = true;
  }
}


const timer = new Timer();
module.exports = timer;
