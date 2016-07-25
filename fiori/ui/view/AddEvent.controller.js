sap.ui.core.mvc.Controller.extend("sap.ui.demo.tdg.view.AddEvent", {

	oAddEventFormAlertDialog : null,
	oAddEventSuccessDialog : null,
	oAddEventErrorDialog : null,

	onInit : function() {
		this.getView().setModel(new sap.ui.model.json.JSONModel(), "newEventModel");
		this.initializeNewEventData();
	},

	initializeNewEventData : function() {
		var newEventModel = this.getView().getModel("newEventModel");
		newEventModel.setData({
			Details: {
				title: "",
				abstract : "",
				startDate : null,
				endDate : null,
				city : ""
			}
		});
	},
	
	checkIfAllEventPropertiesDefined : function() {
		var newEventModel = this.getView().getModel("newEventModel");

		if (newEventModel.getProperty("/Details/title")!==""
				&& newEventModel.getProperty("/Details/abstract")!==""
				&& newEventModel.getProperty("/Details/startDate")!==null
				&& newEventModel.getProperty("/Details/endDate")!==null
				&& newEventModel.getProperty("/Details/city")!=="" ) {
			return true;
		} else {
			return false;
		}
	},

	onSubmit : function() {
		if (this.checkIfAllEventPropertiesDefined()) {
			var newEventModel = this.getView().getModel("newEventModel");
			var	eventTitle =  newEventModel.getProperty("/Details/title");
			var	eventAbstract =  newEventModel.getProperty("/Details/abstract");
			var eventStartDate =  newEventModel.getProperty("/Details/startDate"); 
			var eventEndDate =  newEventModel.getProperty("/Details/endDate"); 
			var eventCity =  newEventModel.getProperty("/Details/city"); 
				
			var newevent = {};
			newevent.id = 1; // this id will be replaced on server by a generated one
			newevent.title = eventTitle;
			newevent.startDate = eventStartDate.toISOString();//'2013-05-01T01:02:03.000Z';
			newevent.endDate = eventEndDate.toISOString();//'2013-05-01T01:02:03.000Z';
			newevent.abstract = eventAbstract;
			newevent.city = eventCity;
			
			var oDataModel = this.getView().getModel();

			oDataModel.create("/Event", newevent, {
				success : jQuery.proxy(function(mResponse) {
					this.successMsg();
					this.onCancel();
				}, this),
				error : jQuery.proxy(function() {
					this.errorMsg();
				}, this)
			});
		}else{
			if (!this.oAddEventFormAlertDialog) {
				this.oAddEventFormAlertDialog = sap.ui.xmlfragment("sap.ui.demo.tdg.view.AddEventFormAlertDialog", this);
				this.getView().addDependent(this.oAddEventFormAlertDialog);
			}
			this.oAddEventFormAlertDialog.open();
		}
	},

	successMsg : function(newEventTitle) {
		if (!this.oAddEventSuccessDialog) {
			this.oAddEventSuccessDialog = sap.ui.xmlfragment("sap.ui.demo.tdg.view.AddEventSuccessDialog", this);
			this.getView().addDependent(this.oAddEventSuccessDialog);
		}
		this.oAddEventSuccessDialog.open();
	},

	errorMsg : function() {
		if (!this.oAddEventErrorDialog) {
			this.oAddEventErrorDialog = sap.ui.xmlfragment("sap.ui.demo.tdg.view.AddEventErrorDialog", this);
			this.getView().addDependent(this.oAddEventErrorDialog);
		}
		this.oAddEventErrorDialog.open();
	},
	
	selectNewEventInMasterView : function(newEventTitle) {
		if(newEventTitle){
			var oEventsList = sap.ui.getCore().byId("__xmlview1").byId("list");
			var items = oEventsList.getItems();

			for (var int = 0; int < items.length; int++) {
				if(items[int].getProperty("title")===newEventTitle){
					oEventsList.setSelectedItemById(items[int].getId());
					return;
				}
			}
		}
	},
	
	onCancel : function() {
		this.initializeNewEventData();
		sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
	},

	dialogCloseButton : function(oEvent) {
		oEvent.getSource().getParent().close();
	}

});

