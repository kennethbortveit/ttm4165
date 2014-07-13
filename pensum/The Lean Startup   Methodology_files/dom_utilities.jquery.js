/**
 * DOM Utilies Object for handling basic DOM actions
 * @author					Dave Shepard
 * @version					1.0
 * @required libraries:		JQuery 1.3.2 or later
 * 
 * Usage:
 *     $(document).ready(function(){
 *     		DOMUtilities.init();
 *     });
 *     
 * Can be initialized via the init(); method to apply to entire <body> or
 * a scope can be passed to limit the initialization to the child elements
 * of a particular element. Individual methods can als be called and passed
 * a scope.
 */
var DOMUtilities = {
	targetBlank: function(locality){
		// XHTML 1.0 Strict work around for external links
		$(locality+' a[rel*="external"]').attr("target","_blank");
	},
	inputAutoClear: function(locality){
		$(locality+' input.clearField').focus(function(){
			if(this.defaultValue == this.value) this.value='';
		}).blur(function(){
			if(this.value == '') this.value = this.defaultValue;
		});
	},
	imgRollover: function(locality){
		// Image roll-over setup
		$(locality+' img.rollOver, '+locality+' input[type="image"].rollOver')
			.mouseover(function(){
				if (this.src.indexOf("_i.") != -1) {
					this.src = this.src.replace("_i.", "_o.");
				}
			}).mouseout(function(){
				if (this.src.indexOf("_o.") != -1) {
					this.src = this.src.replace("_o.", "_i.");
				}
				if(this.src.indexOf("_a.")) {
					this.src = this.src.replace("_a.","_i.");
				}
			}).filter("input").mousedown(function(){
				this.src = this.src.replace("_o.","_a.");
			}).mouseup(function(){
				this.src = this.src.replace("_a.","_i.");
			});
	},
	init: function(locality){
		if(locality == null) {
			locality = "body";
		}
		this.targetBlank(locality);
		this.inputAutoClear(locality);
		this.imgRollover(locality);
	}
}
