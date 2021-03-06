/**
 * This is the main application class of "dbind"
 *
 * @asset(dbind/*)
 */
qx.Class.define("dbind.Application", {
  extend: qx.application.Standalone,

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members: {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main: function () {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }


      const itemSchema = {
        name: "New Project",
        description: "Empty",
        thumbnail: "https://imgplaceholder.com/171x96/cccccc/757575/ion-plus-round",
        created: null
      };
      this.__buildLayout(itemSchema);


      // const USER = new dbind.data.User();


      // Data model --------------
      const rawData = dbind.data.Fake.createProjectDescriptors();
      // http://www.qooxdoo.org/current/api/#qx.data.Array
      // A wrapper around raw array to make it "bindable"
      var data = new qx.data.Array(rawData);

      // binding ----------------
      let controller = new qx.data.controller.List(data, this.__projectsList, 'name');

      // https://www.qooxdoo.org/current/pages/data_binding/single_value_binding.html#options-conversion-and-validation
      // http://www.qooxdoo.org/current/api/#qx.data.SingleValueBinding~bind
      controller.setDelegate({
        configureItem: function (item) {
          // http://www.qooxdoo.org/5.0.2/api/#qx.ui.basic.Atom
          item.set({
            iconPosition: "top",
            gap: 0,
            rich: true,
            allowGrowY: false,
            maxWidth: 200
          });
        },
        bindItem: function (controler, item, id) {
          controler.bindProperty("name", "label", {
            converter: function (data, model, source, target) {
              return "<b>" + data + "</b>: " + model.getDescription();
            }
          }, item, id);
          controler.bindProperty("thumbnail", "icon", {
            converter: function (data) {
              return data === null ? "http://via.placeholder.com/171x96" : data;
            }
          }, item, id);
        }
      });

      // creates a form
      let controllerFrm = new qx.data.controller.Form(controller.getSelection(), this.__form);


      controller.getSelection().addListener("change", function (e) {
        const selectedItem = e.getTarget().toArray()[0];
        controllerFrm.setModel(selectedItem);
        console.debug("Selected Item:", selectedItem.getName());
      }, this);
      

      //searchTxt.bind("changeValue", );
      this.__searchTxf.addListener("changeValue", function (e) {
        console.debug("Search string: ", e.getData());

      }, this);
    },

    /**
     * Components 
     */    
    __searchTxf: null,

    __projectsList: null,

    __form: null,

    __buildLayout: function (modelSkeleton) {
      let layout = new qx.ui.layout.VBox().set({
        spacing: 10
      });
      let container = new qx.ui.container.Composite(layout).set({
        backgroundColor: 'yellow',
      });

      let searchTxt = new qx.ui.form.TextField().set({
        placeholder: "Search",
        liveUpdate: true
      });
      container.add(this.__searchTxf = searchTxt);

      let list = new qx.ui.form.List();
      list.set({
        orientation: "horizontal",
        spacing: 0,
        // layout
        allowGrowY: false
      });
      container.add(this.__projectsList = list);

      let form = this.__form = new qx.ui.form.Form();
      form.addGroupHeader("Selected Item");

      // Builds a form out a JSON
      for (var key in modelSkeleton)
      {
        form.add(new qx.ui.form.TextField().set({ readOnly: true }), key);
      }
      container.add( new qx.ui.form.renderer.Single(this.__form) );

      this.getRoot().add(container, {
        edge: 5
      });
    }
  } // members
});