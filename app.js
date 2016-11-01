Vue.component('header-test', {
  template: '<div class="header">\
  <input class="textbox" v-model="title"></input>\
  <span>{{ saveStatus }}</span></div>',
  data: function () {
    return {
      title: 'New Note2',
      saveStatus: 'Saved'
    }
  }
})

var app = new Vue({
  el: '#main',
  data: {
    title: 'New Note',
    content: '',
    saveStatus: 'Saved',
    location: {
      left: '10px',
      top: '10px'
    }
  },
  methods: {
    dragStart: function (event) {
      var style = window.getComputedStyle(event.target, null);
      event.dataTransfer.setData("text/plain",
      (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' +
      (parseInt(style.getPropertyValue("top"),10) - event.clientY));
    },
    drop: function(event) {
      var offset = event.dataTransfer.getData("text/plain").split(',');
      this.location.left = (event.clientX + parseInt(offset[0],10)) + 'px';
      this.location.top = (event.clientY + parseInt(offset[1],10)) + 'px';
      return false;
    },
    save: function () {
      this.saveStatus = 'Saving...';
      this.saveStatus = 'Saved';
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
