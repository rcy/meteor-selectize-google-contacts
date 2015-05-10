Template.selectizeGoogleContacts.onRendered(function () {
  this.$('input').selectize({
    plugins: ['remove_button'],
    persist: true,  // keep items in dropdown even after deleted
    openOnFocus: false,  // don't show drop down right away
    closeAfterSelect: true, // hide dropdown once chosing an option
    create: true, // allow creating items not in list
    createFilter: /.@./, // creating items must match this
    maxItems: null,
    maxOptions: 10,
    valueField: 'email',
    labelField: 'name',
    searchField: ['name', 'email'],
    delimiter: ';',
    render: {
      item: function(item, escape) {
        return '<div>' +
          (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
          (item.email ? '<span class="email"> &lt;' + escape(item.email) + '&gt;</span> ': '') +
          '</div>';
      },
      option: function(item, escape) {
        return '<div>' +
          (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
          (item.email ? '<span class="email"> &lt;' + escape(item.email) + '&gt;</span>' : '') +
          '</div>';
      }
    },
    load: function(query, callback) {
      if (!query.length) return callback();

      GoogleApi.get('/m8/feeds/contacts/default/full', {params: {alt: 'json', q: query, 'max-results': 100, v:"3.0"}},
                    function (err, data) {
                      var array = [];

                      if (Meteor._get(data, 'feed', 'entry')) {
                        data.feed.entry.forEach(function (entry) {
                          if (entry && entry.gd$email) {
                            entry.gd$email.forEach(function (email) {
                              array.push({
                                name: Meteor._get(entry, 'gd$name', 'gd$fullName', '$t'),
                                email: email.address,
                                updated: entry.updated.$t
                              });
                            });
                          }
                        });
                      }

                      callback(array);
                    });
    }
  });
});
