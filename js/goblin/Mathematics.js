var Mathematics = {
	length: function(p1,p2)	{
		var dX = p2.x-p1.x;
		var dY = p2.y-p1.y;
		return Math.sqrt(dX*dX + dY*dY);
	},
	
	rand: function(start,end) {
		return (Math.random() * (end - start + 1) + start) >> 0;
	},
	
	calcProbability: function(arrProbability) {
		var total = 0;
		var arr = [];
		for(var i = 0; i < arrProbability.length; i++) {
			total += arrProbability[i];
			arr.push(total);
		}
		var res = this.rand(0,total-1);
		for(var i = 0; i < arr.length; i++) {
			var start = 0;
			if(i >= 1) start = arr[i-1];
			if(res >= start && res < arr[i])	{
				return i;
			}
		}
	},
};

function Lerp(v0,v1,t,extra) 
{
	this.start = v0;
	this.end = v1;
	this.time = t;
	this.elapseTime = new Date().getTime();
	if(arguments.length == 4) {
		this.extra = extra;
	} else {
		this.extra = false;
	}
};

Lerp.prototype.init = function() 
{
	this.elapseTime = new Date().getTime();
}

Lerp.prototype.value = function() 
{
	if(this.t() >= 1 && this.extra == false)	
		return this.end;
	
	return this.start + (this.end - this.start)*this.t();
};

Lerp.prototype.t = function()
{
	var curTime = new Date().getTime();
	return (curTime - this.elapseTime)/this.time;
};

function GravityMotion(D,T) 
{
	this.v0 = -4*D/T;
	this.accel = -this.v0*2/T;
	this.time = T;
	this.end = false;
	
	this.elapseTime = new Date().getTime();
};

GravityMotion.prototype.init = function() 
{
	this.elapseTime = new Date().getTime();
};

GravityMotion.prototype.value = function() 
{
	var curTime = new Date().getTime();
	var t = curTime - this.elapseTime;
	//console.log('t: '+ t + ' v0: ' + this.v0 +  ' a: ' + this.accel);
	
	if(t >= this.time ) {
		this.end = true;
		return 0;
	} else {
		return this.v0*t + this.accel*t*t/2;
	}
};

function ParabolicMotion(ps,pe,hs,dh,dur)
{
	this.ps = ps;
	this.pe = pe;
	this.hs = hs;
	this.duration = dur;
	this.v0 = -4*dh/dur;
	this.accel = -this.v0/dur;
	this.elapseTime = new Date().getTime();
	this.tick = 0;
	this.end = false; 
};

ParabolicMotion.prototype.init = function()
{
	this.elapseTime = new Date().getTime();
};

ParabolicMotion.prototype.value = function()
{
	var curTime = new Date().getTime();
	var t = curTime - this.elapseTime;
	this.tick = t/this.duration;

	var pos = {x: 0, y: 0};	
	if(t >= this.duration ) {
		this.end = true;
		pos.x = this.pe;
		pos.y = this.hs;
	} else {
		pos.x = this.ps + (this.pe - this.ps)*this.tick;
		pos.y = this.hs + t*(this.v0 + this.accel*t);
	}
	
	return pos;
};