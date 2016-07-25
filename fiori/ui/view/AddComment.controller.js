sap.ui.core.mvc.Controller.extend("sap.ui.demo.tdg.view.AddComment", {

	oAddCommentFormAlertDialog : null,
	oAddCommentSuccessDialog : null,
	oAddCommentErrorDialog : null,

	onInit : function() {
		this.getView().setModel(new sap.ui.model.json.JSONModel(), "newCommentModel");
		this.initializeNewCommentData();
	},

	initializeNewCommentData : function() {
		// TODO: find better solution
		var currEventTitle = (sap.ui.getCore().byId("__xmlview1")).byId("list").getSelectedItem().getProperty("title");

		var newCommentModel = this.getView().getModel("newCommentModel");
		newCommentModel.setData({
			Details: {
				currEventTitle : currEventTitle,
				nickname : "",
				comment : "",
				rating : 0
			}
		});
	},
	
	checkIfAllCommentPropertiesDefined : function() {
		var newCommentModel = this.getView().getModel("newCommentModel");

		if (newCommentModel.getProperty("/Details/nickname") !== ""
				|| newCommentModel.getProperty("/Details/comment") !== ""
				|| newCommentModel.getProperty("/Details/rating") > 0) {
			return true;
		} else {
			return false;
		}
	},

	onSubmit : function() {
		if (this.checkIfAllCommentPropertiesDefined()) {
			var bindPath = sap.ui.getCore().byId("__xmlview2").getElementBinding().sPath;
			var	currEventId =  bindPath.substring(bindPath.indexOf("(")+1,bindPath.indexOf(")"));
			var newCommentModel = this.getView().getModel("newCommentModel");
			var	comment =  newCommentModel.getProperty("/Details/comment");
			var	nickname =  newCommentModel.getProperty("/Details/nickname");
			var	rating =  newCommentModel.getProperty("/Details/rating");
			
			var oComment = {};
			oComment.id = 0;
			oComment.timestamp = (new Date()).toISOString(); // '2013-05-01T01:02:03.000Z' will anyhow be overwritten on server side;
			oComment["onEvent.id"] = currEventId;
			oComment.nickname = nickname;
			oComment.comment = comment;
			oComment.rating = rating;
			var oDataModel = this.getView().getModel();

			oDataModel.create("/Comment", oComment, {
				success : jQuery.proxy(function(mResponse) {
					this.successMsg();
					this.onCancel();
				}, this),
				error : jQuery.proxy(function() {
					this.errorMsg();
				}, this)
			});
		}else{
			if (!this.oAddCommentFormAlertDialog) {
				this.oAddCommentFormAlertDialog = sap.ui.xmlfragment("sap.ui.demo.tdg.view.AddCommentFormAlertDialog", this);
				this.getView().addDependent(this.oAddCommentFormAlertDialog);
			}
			this.oAddCommentFormAlertDialog.open();
		}
		
	},

	successMsg : function() {
		if (!this.oAddCommentSuccessDialog) {
			this.oAddCommentSuccessDialog = sap.ui.xmlfragment("sap.ui.demo.tdg.view.AddCommentSuccessDialog", this);
			this.getView().addDependent(this.oAddCommentSuccessDialog);
		}
		this.oAddCommentSuccessDialog.open();
	},

	errorMsg : function() {
		if (!this.oAddCommentErrorDialog) {
			this.oAddCommentErrorDialog = sap.ui.xmlfragment("sap.ui.demo.tdg.view.AddCommentErrorDialog", this);
			this.getView().addDependent(this.oAddCommentErrorDialog);
		}
		this.oAddCommentErrorDialog.open();
	},

	onCancel : function() {
		this.initializeNewCommentData();
		sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
	},

	dialogCloseButton : function(oEvent) {
		oEvent.getSource().getParent().close();
	}

});