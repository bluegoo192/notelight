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
    noteStorage.uid = notes.length;
  }
}

var filters = {
  all: function(notes) {
    return notes;
  }
}

Vue.component('note-page', {
  props: ['note'],
  template: '<div class="note" :draggable="draggable" @dragstart="dragStart"\
              @dragend="drop" @click="moveToTop" :style="note.location">\
              <div class="header">\
                <input class="textbox" @focus="toggledrag" @blur="toggledrag" v-model.lazy="note.title"></input>\
              </div>\
              <textarea class="content textbox" @focus="toggledrag" @blur="toggledrag" v-model.lazy="note.content"\
                placeholder="Enter a note">\
              </textarea>\
              <button class="deleteButton" @click="$emit(\'remove\')">\
                Delete\
              </button>\
            </div>',
  data: function () {
    return {
      draggable: true,
      leftOffset: '0',
      rightOffset: '0'
    }
  },
  methods: {
    dragStart: function (event) {
      this.moveToTop(event);
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
      this.validateLocation();
      return false;
    },
    toggledrag: function() {
      this.draggable = !this.draggable;
    },
    moveToTop: function(event) {
      var style = window.getComputedStyle(this.$el, null);
      this.note.location.width = style.getPropertyValue("width");
      this.note.location.height = style.getPropertyValue("height");
      if (parseInt(this.note.location.zIndex, 10) == 10) return;
      this.note.location.zIndex = '11';
      this.$emit('pushdown');
    },
    validateLocation: function () {
      if (parseInt(this.note.location.left, 10) < 0) {
        this.note.location.left = '0px';
      } else if (parseInt(this.note.location.left, 10) > (window.innerWidth - 100)) {
        this.note.location.left = (window.innerWidth - 200) + 'px';
      }
      if (parseInt(this.note.location.top, 10) < 0) {
        this.note.location.top = '0px';
      } else if (parseInt(this.note.location.top, 10) > (window.innerHeight - 100)) {
        this.note.location.top = (window.innerHeight - 200) + 'px';
      }
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
      this.pushdown();
      this.notes.push({
        id: noteStorage.uid++,
        title: 'Title',
        content: 'content',
        location: {
          left: '100px',
          top: '100px',
          width: 'auto',
          height: 'auto',
          zIndex: '10'
        }
      });
    },
    pushdown: function () {
      this.notes.forEach(function(element) {
        var intz = parseInt(element.location.zIndex, 10) - 1;
        element.location.zIndex = intz + '';
      });
    }
  },
  watch: {
    notes: {
      handler: function (notes) {
        noteStorage.save(notes);
      },
      deep: true
    }
  }
})
