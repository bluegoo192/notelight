var note = new Vue({
  el: '#note',
  data: {
    title: 'New Note',
    content: '',
    saveStatus: 'Saved'
  },
  methods: {
    drag: function () {
      console.log('drag');
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
