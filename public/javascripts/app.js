var NOTE_STORAGE_KEY = 'notelight-dev-notes'
var FOLDER_STORAGE_KEY = 'notelight-dev-folders'

var noteStorage = {
  fetch: function () {
    var notes = JSON.parse(localStorage.getItem(NOTE_STORAGE_KEY) || '[]');
    notes.forEach(function (note, index) {
      note.id = index;
    });
    noteStorage.uid = notes.length;
    return notes;
  },
  save: function (notes) {
    localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notes));
    noteStorage.uid = notes.length;
  }
}

var folderStorage = {
  fetch: function () {
    var folders = JSON.parse(localStorage.getItem(FOLDER_STORAGE_KEY) || '[]');
    folders.forEach(function (folder, index) {
      folder.id = index;
    });
    folderStorage.uid = folders.length;
    return folders;
  },
  save: function (folders) {
    localStorage.setItem(FOLDER_STORAGE_KEY, JSON.stringify(folders));
    folderStorage.uid = folders.length;
  }
}

var filters = {
  all: function(notes) {
    return notes;
  }
}

Vue.component('note-page', {
  props: ['note'],
  template: '<div class="note" :class="{ newnote: note.isNew }" :draggable="draggable" @dragstart="dragStart"\
              @dragend="drop" @click="moveToTop" :style="note.location">\
              <div class="header">\
                <input class="textbox" @focus="toggledrag" @blur="toggledrag" v-model="note.title"></input>\
              </div>\
              <textarea class="content textbox" @focus="toggledrag" @blur="toggledrag" v-model="note.content"\
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
      //console.log(parseInt(this.note.location.width.slice(0, -2), 10));
    },
    drop: function(event) {
      var offset = event.dataTransfer.getData("text/plain").split(',');
      var style = window.getComputedStyle(this.$el, null);
      this.note.location.left = (event.screenX + parseInt(offset[0],10)) + 'px';
      this.note.location.top = (event.screenY + parseInt(offset[1],10)) + 'px';
      //validate drop location to stop people from dragging notes offscreen
      console.log("LEFT: " + style.getPropertyValue("left") + "  RIGHT: " +style.getPropertyValue("right"));
      console.log(parseInt(style.getPropertyValue("right"), 10));
      //console.log(style);
      this.validateLocation();
      this.note.isNew = false;
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
      } else if ( parseInt(this.note.location.left, 10) > (window.innerWidth - 200) ) {
        this.note.location.left = (window.innerWidth - 200) + 'px';
      }
      if (parseInt(this.note.location.top, 10) < 0) {
        this.note.location.top = '0px';
      } else if ( parseInt(this.note.location.top, 10) > (window.innerHeight - 200) ) {
        this.note.location.top = (window.innerHeight - 200) + 'px';
      }
    }
  }
})

var app = new Vue({
  el: '#main',
  data: {
    notes: noteStorage.fetch(),
    folders: folderStorage.fetch(),
    showProfileBox: true
  },
  mounted: function () {
    this.howProfileBox = true;
  },
  methods: {
    makeNote: function() {
      this.pushdown();
      this.notes.push({
        id: noteStorage.uid++,
        title: 'Title',
        content: 'content',
        isNew: true,
        location: {
          left: '100px',
          top: '100px',
          width: 'auto',
          height: 'auto',
          zIndex: '10'
        }
      });
    },
    makeFolder: function (note) {
      this.folders.push({
        id: folderStorage.uid++,
        name: "new folder",
        contents: [note]
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
    },
    folders: {
      handler: function (folders) {
        folderStorage.save(folders);
      },
      deep: true
    }
  }
})
