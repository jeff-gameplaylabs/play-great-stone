/**
 * @author Taehong Jong
 */

/*
 * argo.unit : unit time in msec
 * argo.onTick : function (argo, timer) { ... }
 * argo.argo : argo for callback
 */
function Timer(argo) {
	this.unit = argo.unit;
	this.onTick = argo.onTick;
	this.argo = argo.argo;
	this.isSleeping = false;
	this.count = 0;
	this.elapsed = 0;
	this.current = this.getTime();
	this.previous = this.getTime();
};
Timer.prototype.tick = function() {
	if (this.isSleeping)
		return;
	this.current = this.getTime();
	this.elapsed = this.current - this.previous;
	if (this.elapsed >= this.unit) {
		this.onTick(this.argo, this);
		this.previous = this.current;
		this.count++;
	}
};
/*
 * Pause
 */
Timer.prototype.sleep = function() {
	this.isSleeping = true;
};
/*
 * Restart
 */
Timer.prototype.wake = function() {
	this.isSleeping = false;
};
/*
 * Reset
 */
Timer.prototype.reset = function() {
	this.current = this.getTime();
	this.previous = this.getTime();
	this.elapsed = 0;
	this.count = 0;
};
Timer.prototype.getTime = function() {
	return (new Date()).getTime();
};