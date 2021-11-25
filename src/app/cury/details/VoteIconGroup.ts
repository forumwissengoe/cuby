import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';

@Component({
	selector: 'vote-icon-group',
	template: `<div class="main">
		<div #acceptIcon class="accepted">
			<ion-icon name="checkmark-circle-outline" color="success"></ion-icon>
		</div>
		<div #moveRightIcons class="moveRightIcons">
			<ion-icon name="md-arrow-dropright" color="light"></ion-icon>
			<ion-icon name="md-arrow-dropright" color="light"></ion-icon>
		</div>
		<div #moveLeftIcons class="moveLeftIcons">
			<ion-icon name="md-arrow-dropleft" color="light"></ion-icon>
			<ion-icon name="md-arrow-dropleft" color="light"></ion-icon>
		</div>
		<div #declineIcon class="declined">
			<ion-icon name="close-circle-outline" color="danger"></ion-icon>
		</div>
	</div>`,
	styleUrls: ["./VoteIconGroup.scss"]
})

export class VoteIconGroup implements AfterViewInit
{
	@ViewChild('acceptIcon') acceptIcon: ElementRef;
	@ViewChild('declineIcon') declineIcon: ElementRef;
	@ViewChild('moveRightIcons') moveRightIcons: ElementRef;
	@ViewChild('moveLeftIcons') moveLeftIcons: ElementRef;
	
	move_a:boolean = false;
	move_d:boolean = false;
	offset_a:number = 0;
	offset_d:number = 0;
	origin_a:number = 0;
	origin_d:number = 0;
	original_a:number = 0;
	original_d:number = 0;
	
	decline_x_base:number = 0;
	distance:number = null;
	
	@Output() voted = new EventEmitter<boolean>();
	
	constructor()
	{
	
	}
	
	vote(like:boolean)
	{
		this.voted.emit(like);
	}
	
	ngAfterViewInit()
	{
		let document = window.document;
		this.setUpAccept(document, () => { this.vote(true); });
		this.setUpDecline(document, () => { this.vote(false); });
		setTimeout(() => {
			this.origin_a = this.acceptIcon.nativeElement.offsetLeft;
			this.origin_d = this.declineIcon.nativeElement.offsetLeft;
			this.original_a = this.acceptIcon.nativeElement.offsetLeft;
			this.original_d = this.declineIcon.nativeElement.offsetLeft;
		}, 2000);
	}
	
	reset()
	{
		this.acceptIcon.nativeElement.style.left = "";
		this.declineIcon.nativeElement.style.left = "";
		
		this.acceptIcon.nativeElement.style.opacity = 1.0;
		this.declineIcon.nativeElement.style.opacity = 1.0;
		this.moveLeftIcons.nativeElement.style.opacity = 1.0;
		this.moveRightIcons.nativeElement.style.opacity = 1.0;
		
		this.move_a = false;
		this.move_d = false;
		this.offset_a = 0;
		this.offset_d = 0;
		this.origin_a = this.original_a;
		this.origin_d = this.original_d;
		
		this.decline_x_base = 0;
		this.distance = null;
		
		this.setUpAccept(document, () => { this.vote(true); });
		this.setUpDecline(document, () => { this.vote(false); });
	}
	
	setUpAccept(document:any, clicked:() => void)
	{
		const self = this;
		this.acceptIcon.nativeElement.addEventListener('click', function funcClick(event)
		{
			if(event.cancelable)
			{
				event.stopPropagation();
				if(self.distance == null)
					self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
				let pos = self.acceptIcon.nativeElement.offsetLeft;
				const id = setInterval(() => {
					if(parseInt(self.acceptIcon.nativeElement.style.left, 10) >= self.distance/2)
						clearInterval(id);
					else
					{
						pos += 2;
						self.acceptIcon.nativeElement.style.left = pos + "px";
					}
				}, 5);
				self.moveLeftIcons.nativeElement.style.opacity = 0;
				self.moveRightIcons.nativeElement.style.opacity = 0;
				self.declineIcon.nativeElement.style.opacity = 0;
				self.removeAllListeners();
				clicked();
			}
		}, {passive: true});
		this.acceptIcon.nativeElement.addEventListener('mousedown', function funcDown(event) {
			if(event.cancelable)
			{
				event.stopPropagation();
				if(self.distance == null)
					self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
				self.move_a = true;
				self.origin_a = self.acceptIcon.nativeElement.style.left;
				self.offset_a = self.acceptIcon.nativeElement.offsetLeft - event.clientX;
			}
		}, {passive: true});
		
		this.acceptIcon.nativeElement.addEventListener('touchstart', function funcDown(event) {
			if(event.cancelable)
			{
				event.stopPropagation();
				if(self.distance == null)
					self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
				self.move_a = true;
				self.origin_a = self.acceptIcon.nativeElement.style.left;
				self.offset_a = self.acceptIcon.nativeElement.offsetLeft - event.touches[0].clientX;
			}
			
		}, {passive: true});
		
		document.addEventListener('mouseup', function funcUP_A(event) {
			if(self.move_a && event.cancelable) {
				event.stopPropagation();
				self.move_a = false;
				if(self.acceptIcon.nativeElement.offsetLeft/self.distance > 0.7)
				{
					self.acceptIcon.nativeElement.style.left = self.origin_d;
					let pos = parseInt(self.acceptIcon.nativeElement.style.left, 10);
					let id = setInterval(() => {
						if(parseInt(self.acceptIcon.nativeElement.style.left, 10) <= self.distance/2)
							clearInterval(id);
						else
						{
							pos -= 2;
							self.acceptIcon.nativeElement.style.left = pos + "px";
						}
					}, 5);
					self.declineIcon.nativeElement.style.opacity = 0;
					self.removeAllListeners();
					clicked();
				}
				else
				{
					self.acceptIcon.nativeElement.style.left = self.origin_a;
					self.declineIcon.nativeElement.style.opacity = 1;
					self.moveRightIcons.nativeElement.style.opacity = 1;
					self.moveLeftIcons.nativeElement.style.opacity = 1;
				}
			}
		}, {passive: true, capture: true});
		
		document.addEventListener('touchend', function funcUP_A(event) {
			if(self.move_a && event.cancelable) {
				event.stopPropagation();
				self.move_a = false;
				if(self.acceptIcon.nativeElement.offsetLeft/self.distance > 0.7)
				{
					self.acceptIcon.nativeElement.style.left = self.origin_d;
					let pos = parseInt(self.acceptIcon.nativeElement.style.left, 10);
					let id = setInterval(() => {
						if(parseInt(self.acceptIcon.nativeElement.style.left, 10) <= self.distance/2)
							clearInterval(id);
						else
						{
							pos -= 2;
							self.acceptIcon.nativeElement.style.left = pos + "px";
						}
					}, 5);
					self.declineIcon.nativeElement.style.opacity = 0;
					self.removeAllListeners();
					clicked();
				}
				else
				{
					self.acceptIcon.nativeElement.style.left = self.origin_a;
					self.declineIcon.nativeElement.style.opacity = 1;
					self.moveRightIcons.nativeElement.style.opacity = 1;
					self.moveLeftIcons.nativeElement.style.opacity = 1;
				}
			}
		}, {passive: true, capture: true});
		
		document.addEventListener('mousemove', function funcMOVE_A(event) {
			
			if(self.move_a && event.cancelable)
			{
				event.stopPropagation();
				self.acceptIcon.nativeElement.style.left = (event.clientX + self.offset_a) + 'px';
				let op = event.clientX/self.distance;
				self.declineIcon.nativeElement.style.opacity = 1 - (4/3*op);
				if(op > 0.25)
				{
					self.moveRightIcons.nativeElement.style.opacity = 0;
					self.moveLeftIcons.nativeElement.style.opacity = 0;
				}
			}
		}, {passive: true, capture: true});
		
		document.addEventListener('touchmove', function funcMOVE_A(event) {
			
			if(self.move_a && event.cancelable)
			{
				event.stopPropagation();
				self.acceptIcon.nativeElement.style.left = (event.touches[0].clientX + self.offset_a) + 'px';
				let op = event.touches[0].clientX/self.distance;
				self.declineIcon.nativeElement.style.opacity = 1 - (4/3*op);
				if(op > 0.25)
				{
					self.moveRightIcons.nativeElement.style.opacity = 0;
					self.moveLeftIcons.nativeElement.style.opacity = 0;
				}
			}
		}, {passive: true, capture: true});
		
		document.addEventListener('touchcancel', (event) => {
			if(self.move_a && event.cancelable)
			{
				event.stopPropagation();
				self.acceptIcon.nativeElement.style.left = self.origin_a;
				self.declineIcon.nativeElement.style.opacity = 1;
			}
		}, {passive: true})
	}
	
	setUpDecline(document:any, clicked:() => void)
	{
		const self = this;
		this.declineIcon.nativeElement.addEventListener('click', function funcClick(event)
		{
			if(event.cancelable)
			{
				event.stopPropagation();
				if(self.distance == null)
					self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
				let pos = self.declineIcon.nativeElement.offsetLeft;
				const id = setInterval(() => {
					if(parseInt(self.declineIcon.nativeElement.style.left, 10) <= self.distance/2)
						clearInterval(id);
					else
					{
						pos -= 2;
						self.declineIcon.nativeElement.style.left = pos + "px";
					}
				}, 5);
				self.moveLeftIcons.nativeElement.style.opacity = 0;
				self.moveRightIcons.nativeElement.style.opacity = 0;
				self.acceptIcon.nativeElement.style.opacity = 0;
				self.removeAllListeners();
				clicked();
			}
		}, {passive: true});
		this.declineIcon.nativeElement.addEventListener('mousedown', function funcDOWN(event) {
			if(event.cancelable)
			{
				event.stopPropagation();
				if(self.distance == null)
					self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
				self.move_d = true;
				self.origin_d = self.declineIcon.nativeElement.style.left;
				self.offset_d = self.declineIcon.nativeElement.offsetLeft - event.clientX;
				self.decline_x_base = event.clientX - self.distance;
			}
		}, {passive: true});
		
		this.declineIcon.nativeElement.addEventListener('touchstart', function funcDOWN(event) {
			if(event.cancelable)
			{
				event.stopPropagation();
				if(self.distance == null)
					self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
				self.move_d = true;
				self.origin_d = self.declineIcon.nativeElement.style.left;
				self.offset_d = self.declineIcon.nativeElement.offsetLeft - event.touches[0].clientX;
			}
		}, {passive: true});
		
		document.addEventListener('mouseup', function funcUP_D(event) {
			if(self.move_d && event.cancelable) {
				event.stopPropagation();
				self.move_d = false;
				if(self.declineIcon.nativeElement.offsetLeft/self.distance < 0.30)
				{
					self.declineIcon.nativeElement.style.left = self.origin_a;
					let pos = parseInt(self.declineIcon.nativeElement.style.left, 10);
					let id = setInterval(() => {
						if(parseInt(self.declineIcon.nativeElement.style.left, 10) >= self.distance/2)
							clearInterval(id);
						else
						{
							pos += 2;
							self.declineIcon.nativeElement.style.left = pos + "px";
						}
					}, 5);
					self.acceptIcon.nativeElement.style.opacity = 0;
					self.removeAllListeners();
					clicked();
				}
				else
				{
					self.declineIcon.nativeElement.style.left = self.origin_d;
					self.acceptIcon.nativeElement.style.opacity = 1;
					self.moveRightIcons.nativeElement.style.opacity = 1;
					self.moveLeftIcons.nativeElement.style.opacity = 1;
				}
			}
		}, {passive: true, capture: true});
		
		document.addEventListener('touchend', function funcUP_D(event) {
			if(self.move_d && event.cancelable) {
				event.stopPropagation();
				self.move_d = false;
				if(self.declineIcon.nativeElement.offsetLeft/self.distance < 0.3)
				{
					self.declineIcon.nativeElement.style.left = self.origin_a;
					let pos = parseInt(self.declineIcon.nativeElement.style.left, 10);
					let id = setInterval(() => {
						if(parseInt(self.declineIcon.nativeElement.style.left, 10) >= self.distance/2)
							clearInterval(id);
						else
						{
							pos += 2;
							self.declineIcon.nativeElement.style.left = pos + "px";
						}
					}, 5);
					self.acceptIcon.nativeElement.style.opacity = 0;
					self.removeAllListeners();
					clicked();
				}
				else
				{
					self.declineIcon.nativeElement.style.left = self.origin_d;
					self.acceptIcon.nativeElement.style.opacity = 1;
					self.moveRightIcons.nativeElement.style.opacity = 1;
					self.moveLeftIcons.nativeElement.style.opacity = 1;
				}
			}
		}, {passive: true, capture: true});
		
		document.addEventListener('mousemove', function funcMOVE_D(event) {
			if(self.move_d && event.cancelable)
			{
				event.stopPropagation();
				self.declineIcon.nativeElement.style.left = (event.clientX + self.offset_d + 'px');
				let op = 1 - (event.clientX - self.decline_x_base)/self.distance;
				self.acceptIcon.nativeElement.style.opacity = 1 - (6/3*op);
				if(op > 0.05)
				{
					self.moveRightIcons.nativeElement.style.opacity = 0;
					self.moveLeftIcons.nativeElement.style.opacity = 0;
				}
			}
		}, {passive: true, capture: true});
		
		document.addEventListener('touchmove', function funcMOVE_D(event) {
			if(self.move_d && event.cancelable)
			{
				event.stopPropagation();
				self.declineIcon.nativeElement.style.left = (event.touches[0].clientX + self.offset_d + 'px');
				let op = 1 - (event.touches[0].clientX - self.decline_x_base)/self.distance;
				self.acceptIcon.nativeElement.style.opacity = 1 - (6/3*op);
				if(op > 0.05)
				{
					self.moveRightIcons.nativeElement.style.opacity = 0;
					self.moveLeftIcons.nativeElement.style.opacity = 0;
				}
			}
		}, {passive: true, capture: true});
		
		document.addEventListener('touchcancel', (event) => {
			if(self.move_d && event.cancelable)
			{
				event.stopPropagation();
				self.declineIcon.nativeElement.style.left = self.origin_d;
				self.acceptIcon.nativeElement.style.opacity = 1;
			}
		}, {passive: true});
	}
	
	removeAllListeners()
	{
		let tmp = this.acceptIcon.nativeElement.cloneNode(true);
		this.acceptIcon.nativeElement.parentElement.replaceChild(tmp, this.acceptIcon.nativeElement);
		this.acceptIcon.nativeElement = tmp;
		tmp = this.declineIcon.nativeElement.cloneNode(true);
		this.declineIcon.nativeElement.parentElement.replaceChild(tmp, this.declineIcon.nativeElement);
		this.declineIcon.nativeElement = tmp;
	}
}
