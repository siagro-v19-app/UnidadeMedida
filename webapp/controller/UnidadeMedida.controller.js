sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function(Controller, MessageBox) {
	"use strict";

	return Controller.extend("br.com.idxtecUnidadeMedida.controller.UnidadeMedida", {
		onInit: function(){
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());	
		},
		
		onRefresh: function(){
			var oModel = this.getOwnerComponent().getModel();
			oModel.refresh(true);
			this.getView().byId("tableUnidade").clearSelection();
		},
		
		onIncluir: function(){
			var oDialog = this._criarDialog();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getOwnerComponent().getModel("view");
			
			oViewModel.setData({
				titulo: "Inserir Unidade de Medida",
				msgSave: "Unidade de Medida inserida com sucesso!"
			});
			
			oDialog.unbindElement();
			oDialog.setEscapeHandler(function(oPromise){
				if(oModel.hasPendingChanges()){
					oModel.resetChanges();
				}
			});
			
			var oContext = oModel.createEntry("/UnidadeMedidas", {
				properties:{
					"Id": 0,
					"Sigla": "",
					"Descricao": ""
				}
			});
			
			oDialog.setBindingContext(oContext);
			oDialog.open();
		},
		
		onEditar: function(){
			var oDialog = this._criarDialog();
			var oTable = this.byId("tableUnidade");
			var nIndex = oTable.getSelectedIndex();
			var oViewModel = this.getOwnerComponent().getModel("view");
			
			oViewModel.setData({
				titulo: "Editar Unidade de Medida",
				msgSave: "Unidade de Medida alterada com sucesso!"
			});
			
			if(nIndex === -1){
				MessageBox.warning("Selecione uma unidade de medida da tabela!");
				return;
			}
			
			var oContext = oTable.getContextByIndex(nIndex);
			
			oDialog.bindElement(oContext.sPath);
			oDialog.open();
		},
		
		onRemover: function(){
			var that = this;
			var oTable = this.byId("tableUnidade");
			var nIndex = oTable.getSelectedIndex();
			
			if(nIndex === -1){
				MessageBox.warning("Selecione uma unidade de medida da tabela!");
				return;
			}
			
			MessageBox.confirm("Deseja remover essa unidade de medida?", {
				onClose: function(sResposta){
					if(sResposta === "OK"){
						MessageBox.success("Unidade de medida removida com sucesso!");
						that._remover(oTable, nIndex);
					} 
				}      
			});
		},
		
		_remover: function(oTable, nIndex){
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oTable.getContextByIndex(nIndex);
			
			oModel.remove(oContext.sPath,{
				success: function(){
					oModel.refresh(true);
					oTable.clearSelection();
				}
			});
		},
		
		_criarDialog: function(){
			var oView = this.getView();
			var oDialog = this.byId("GravarUnidadeDialog"); 
			
			if(!oDialog){
				oDialog = sap.ui.xmlfragment(oView.getId(), "br.com.idxtecUnidadeMedida.view.GravarUnidade", this);
				oView.addDependent(oDialog);
			}
			
			return oDialog;
		},
		
		onSaveDialog: function(){
			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getOwnerComponent().getModel("view");
			
			oModel.submitChanges({
				success: function(oResponse){
					var erro = oResponse.__batchResponses[0].response;
					if(!erro){
						oModel.refresh(true);
						MessageBox.success(oViewModel.getData().msgSave);
						oView.byId("GravarUnidadeDialog").close();
						oView.byId("tableUnidade").clearSelection();	
					}
				}
			});
		},
		
		onCloseDialog: function(){
			var oModel = this.getOwnerComponent().getModel();
			
			if(oModel.hasPendingChanges()){
				oModel.resetChanges();
			}
			
			this.byId("GravarUnidadeDialog").close();
		}
	});
});