var STORAGE_KEY = 'notelight-dev'

var noteStorage = {
  fetch: function () {
    var notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    notes.forEach(function (note, index) {
      note.id = index;
    });
    noteStorage.uid = notes.length;
    return notes;
  },
  save: function (notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }
}

var filters = {
  all: function(notes) {
    return notes;
  }
}

Vue.component('note-page', {
  props: ['note'],
  template: '<div class="note" draggable="true" @dragstart="dragStart"\
              @dragend="drop" :style="note.location">\
              <div class="header">\
                <input class="textbox" v-model="note.title"></input>\
                <span>{{ saveStatus }}</span>\
              </div>\
              <textarea class="content textbox" v-model="note.content"\
                placeholder="Enter a note">\
              </textarea>\
              <button class="deleteButton" @click="$emit(\'remove\')">\
                Delete\
              </button>\
            </div>',
  data: function () {
    return {
      leftOffset: '0',
      rightOffset: '0'
    }
  },
  methods: {
    dragStart: function (event) {
      var style = window.getComputedStyle(event.target, null);
      event.dataTransfer.setData("text/plain",
      (parseInt(style.getPropertyValue("left"),10) - event.screenX) + ',' +
      (parseInt(style.getPropertyValue("top"),10) - event.screenY));
    },
    drop: function(event) {
      var offset = event.dataTransfer.getData("text/plain").split(',');
      this.note.location.left = (event.screenX + parseInt(offset[0],10)) + 'px';
      this.note.location.top = (event.screenY + parseInt(offset[1],10)) + 'px';
      //validate drop location to stop people from dragging notes offscreen
      validateLocation();
      return false;
    },
    validateLocation: function(event) {
    }
  }
})

var app = new Vue({
  el: '#main',
  data: {
    notes: noteStorage.fetch()
  },
  methods: {
    makeNote: function() {
      this.notes.push({
        id: noteStorage.uid++,
        title: 'Title',
        content: 'content',
        zindex: 10,
        location: {
          left: '100px',
          top: '100px'
        }
      });
      console.log('pushed');
    }
  },
  watch: {
    notes: {
      handler: function (notes) {
        noteStorage.save(notes);
        console.log(JSON.stringify(notes));
      },
      deep: true
    }
  }
})
