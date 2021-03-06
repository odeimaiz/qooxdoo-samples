qx.Class.define("wam.ui.window.Preferences", {
    extend: qx.ui.window.Window,

    construct: function () {
        this.base(arguments, this.tr("Account Settings"));

        // window 
        // TODO: fix-sized modal preference window
        this.set({
            modal: true,
            width: 500,
            height: 500 * 1.2,
            showClose: true,
            showMaximize: false,
            showMinimize: false,
            resizable: false
        });
        this.setLayout(new qx.ui.layout.VBox(10));


        var tabView = new qx.ui.tabview.TabView().set({
            barPosition: 'left'
        });
        tabView.add(this.__getGeneral());
        tabView.add(this.__getSecurity());
        // TODO: groups?
        // TODO: notifications?
        tabView.add(this.__getDisplay());
        tabView.add(this.__getAdvanced());

        this.add(tabView, {
            flex: 1
        });
    },

    members: {
        _data: null,

        __createPage: function (name, iconSrc = null) {
            let page = new qx.ui.tabview.Page(name, iconSrc);
            page.setLayout(new qx.ui.layout.VBox(10).set({
                spacing: 10,
                alignX: "center"
            }));

            //title
            page.add(new qx.ui.basic.Label("<h3>" + name + " Settings</h3>").set({
                rich: true
            }));

            // spacer
            page.add(new qx.ui.core.Spacer(null, 10)); // TODO add decorator?
            return page;
        },

        __getGeneral: function () {
            const iconUrl = wam.utils.placeholders.getIcon("ion-ios-settings", 32);
            let page = this.__createPage("General", iconUrl);

            // content
            let username = new qx.ui.form.TextField().set({
                value: "bizzi",
                placeholder: "User Name"
            })
            page.add(username);

            let fullname = new qx.ui.form.TextField().set({
                placeholder: "Full Name"
            });

            page.add(fullname);

            let email = new qx.ui.form.TextField().set({
                placeholder: "Email",
            });
            page.add(email);

            // const url = wam.utils.placeholders.getIcon("fa-user", 200);
            let img = new qx.ui.basic.Image().set({
                source: wam.utils.placeholders.getGravatar(email.getValue() || "bizzi@simcore.io", 200)
            });
            page.add(img);

            return page;
        },

        __getSecurity: function () {
            const iconUrl = wam.utils.placeholders.getIcon("fa-lock", 32);
            let page = this.__createPage("Security", iconUrl);

            // content
            page.add(new qx.ui.form.PasswordField().set({
                placeholder: "Password"
            }));

            page.add( new qx.ui.form.PasswordField().set({
                placeholder: "Re-type Password"
            }) );

            page.add(new qx.ui.basic.Atom("<h3>DAT-CORE</h3>").set({
                rich: true
            }));
            
            let tokens = new qx.ui.form.TextField();
            tokens.set({
                placeholder: "Personal Access Token"
            })
            page.add(tokens);

            return page;
        },

        __getDisplay: function () {
            const iconUrl = wam.utils.placeholders.getIcon("fa-eye", 32);
            let page = this.__createPage("Display", iconUrl);

            return page;
        },

        __getAdvanced: function () {
            const iconUrl = wam.utils.placeholders.getIcon("fa-rebel", 32);
            let page = this.__createPage("Advanced", iconUrl);

            return page;
        }
    }

});