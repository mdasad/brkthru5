sap.ui.core.mvc.Controller.extend("sap.ui.demo.tdg.view.Detail", {

	onInit : function() {
		var oView = this.getView();

		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
			// when detail navigation occurs, update the binding context
			if (oEvent.getParameter("name") === "evt") {

				var Event = "/" + oEvent.getParameter("arguments").evt;

				oView.bindElement(Event);

				// Check that the evt specified actually was found
				oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
					var oData = oView.getModel().getData(Event);
					if (!oData) {
						sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							currentView : oView,
							targetViewName : "sap.ui.demo.tdg.view.NotFound",
							targetViewType : "XML"
						});
					}
				}, this));


				// Make sure the master is here
				var oIconTabBar = oView.byId("idIconTabBar");
				oIconTabBar.getItems().forEach(function(oItem) {
					oItem.bindElement(sap.ui.demo.tdg.util.Formatter.uppercaseFirstChar(oItem.getKey()));
				});

				// Which tab?
				var sTabKey = oEvent.getParameter("arguments").tab || "CommentsOnEvent";
				if (oIconTabBar.getSelectedKey() !== sTabKey) {
					oIconTabBar.setSelectedKey(sTabKey);
				}

				// Make sure ... TODO
				var oReviewsList = oView.byId("commentsListId");
				oReviewsList.bindItems(oView.getElementBinding().sPath + "/CommentsOnEvent", oReviewsList.mBindingInfos.items.template);

				var oRatingIndicator = oView.byId("commentsRatingIndicatorId");
				oRatingIndicator.bindElement(oView.getElementBinding().sPath + "/StatusUpdate");
				var oNoRatingIndicator = oView.byId("noCommentsRatingIndicatorId");
				oNoRatingIndicator.bindElement(oView.getElementBinding().sPath + "/StatusUpdate");
				
				var oRatingText = oView.byId("commentsRatingTextId");
				oRatingText.bindElement(oView.getElementBinding().sPath + "/StatusUpdate");
				var oNoRatingText = oView.byId("noCommentsRatingTextId");
				oNoRatingText.bindElement(oView.getElementBinding().sPath + "/StatusUpdate");
			}
		}, this);
	},
	
	onNavBack : function() {
		// This is only relevant when running on phone devices
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("main");
	},

	onDetailSelect : function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("evt",{
			evt : oEvent.getSource().getBindingContext().getPath().slice(1),
			tab: oEvent.getParameter("selectedKey")
		}, true);

	},

	onAddComment : function() {
		this.initializeAddCommentView();
		sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
			currentView : this.getView(),
			targetViewName : "sap.ui.demo.tdg.view.AddComment",
			targetViewType : "XML",
			transition : "slide"
		});
	},

	initializeAddCommentView : function() {
		// TODO: find better solution
		var xmlView3 = sap.ui.getCore().byId("__xmlview3");
		if(xmlView3 && xmlView3.sViewName=="sap.ui.demo.tdg.view.AddComment"){
			xmlView3.getController().initializeNewCommentData();
		}
		var xmlView4 = sap.ui.getCore().byId("__xmlview4");
		if(xmlView4 && xmlView4.sViewName=="sap.ui.demo.tdg.view.AddComment"){
			xmlView4.getController().initializeNewCommentData();
		}
	}
});