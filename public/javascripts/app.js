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
  template: '<div class="note" draggable="true" @dragstart="dragStart"\
              @dragend="drop" :style="location">\
              <div class="header">\
                <input class="textbox" v-model="title"></input>\
                <span>{{ saveStatus }}</span>\
              </div>\
              <textarea class="content textbox" v-model="content"\
                placeholder="Enter a note">\
              </textarea>\
              <button class="deleteButton" @click="$emit(\'remove\')">\
                Delete\
              </button>\
            </div>',
  data: function () {
    return {
      title: 'New Note',
      content: '',
      saveStatus: 'Saved',
      leftOffset: '0',
      rightOffset: '0',
      location: {
        left: '50px',
        top: '50px'
      }
    }
  },
  methods: {
    dragStart: function (event) {
      var style = window.getComputedStyle(event.target, null);
      event.dataTransfer.setData("text/plain",
      (parseInt(style.getPropertyValue("left"),10) - event.screenX) + ',' +
      (parseInt(style.getPropertyValue("top"),10) - event.screenY));
    },
    save: function () {
      this.saveStatus = 'Saving...';
      this.saveStatus = 'Saved';
    },
    drop: function(event) {
      var offset = event.dataTransfer.getData("text/plain").split(',');
      this.location.left = (event.screenX + parseInt(offset[0],10)) + 'px';
      this.location.top = (event.screenY + parseInt(offset[1],10)) + 'px';
      //console.log('drop at '+ this.location.left + ', ');
      return false;
    }
  },
  watch: {
    title: function (noteTitle) {
      this.save();
    },
    content: function (noteContent) {
      this.save();
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
        title: 'test title',
        content: ''
      });
      console.log('pushed');
    }
  },
  watch: {
    notes: {
      handler: function (notes) {
        noteStorage.save(notes);
        console.log(JSON.stringify(notes));
      }
    }
  }
})
