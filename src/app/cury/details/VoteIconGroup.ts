import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
	selector: 'vote-icon-group',
	template: `<div class="main">
		<div #acceptIcon class="accepted">
			<ion-icon name="checkmark-circle-outline" color="success"></ion-icon>
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
	
	move_a:boolean = false;
	move_d:boolean = false;
	offset_a:number = 0;
	offset_d:number = 0;
	origin_a:number = 0;
	origin_d:number = 0;
	
	distance:number = null;
	
	constructor()
	{
	
	}
	
	ngAfterViewInit()
	{
		console.log("VOTEGROUP, AFTERVIEWINIT");
		let document = window.document;
		this.setUpAccept(document, () => { this.vote(true); });
		this.setUpDecline(document, () => { this.vote(false); });
		setTimeout(() => {
			this.origin_a = this.acceptIcon.nativeElement.offsetLeft;
			this.origin_d = this.declineIcon.nativeElement.offsetLeft;
		}, 2000);
	}
	
	setUpAccept(document:any, clicked:() => void)
	{
		const self = this;
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
		});
		
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
			
		});
		
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
				}
			}
		}, true);
		
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
				}
			}
		}, true);
		
		document.addEventListener('mousemove', function funcMOVE_A(event) {
			
			if(self.move_a && event.cancelable)
			{
				event.stopPropagation();
				self.acceptIcon.nativeElement.style.left = (event.clientX + self.offset_a) + 'px';
				let op = event.clientX/self.distance;
				self.declineIcon.nativeElement.style.opacity = 1 - (4/3*op);
			}
		}, true);
		
		document.addEventListener('touchmove', function funcMOVE_A(event) {
			
			if(self.move_a && event.cancelable)
			{
				event.stopPropagation();
				self.acceptIcon.nativeElement.style.left = (event.touches[0].clientX + self.offset_a) + 'px';
				let op = event.touches[0].clientX/self.distance;
				self.declineIcon.nativeElement.style.opacity = 1 - (4/3*op);
			}
		}, true);
		
		document.addEventListener('touchcancel', (event) => {
			if(self.move_a && event.cancelable)
			{
				event.stopPropagation();
				self.acceptIcon.nativeElement.style.left = self.origin_a;
				self.declineIcon.nativeElement.style.opacity = 1;
			}
		})
	}
	
	setUpDecline(document:any, clicked:() => void)
	{
		const self = this;
		this.declineIcon.nativeElement.addEventListener('mousedown', function funcDOWN(event) {
			if(event.cancelable)
			{
				event.stopPropagation();
				if(self.distance == null)
					self.distance = self.declineIcon.nativeElement.offsetLeft - self.acceptIcon.nativeElement.offsetLeft;
				self.move_d = true;
				self.origin_d = self.declineIcon.nativeElement.style.left;
				self.offset_d = self.declineIcon.nativeElement.offsetLeft - event.clientX;
				
			}
		});
		
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
		});
		
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
				}
			}
		}, true);
		
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
				}
			}
		}, true);
		
		document.addEventListener('mousemove', function funcMOVE_D(event) {
			if(self.move_d && event.cancelable)
			{
				event.stopPropagation();
				self.declineIcon.nativeElement.style.left = (event.clientX + self.offset_d + 'px');
				let op = 1 - event.clientX/self.distance;
				self.acceptIcon.nativeElement.style.opacity = 1 - (4/3*op);
			}
		}, true);
		
		document.addEventListener('touchmove', function funcMOVE_D(event) {
			if(self.move_d && event.cancelable)
			{
				event.stopPropagation();
				self.declineIcon.nativeElement.style.left = (event.touches[0].clientX + self.offset_d + 'px');
				let op = 1 - event.touches[0].clientX/self.distance;
				self.acceptIcon.nativeElement.style.opacity = 1 - (4/3*op);
			}
		}, true);
		
		document.addEventListener('touchcancel', (event) => {
			if(self.move_d && event.cancelable)
			{
				event.stopPropagation();
				self.declineIcon.nativeElement.style.left = self.origin_d;
				self.acceptIcon.nativeElement.style.opacity = 1;
			}
		});
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
	
	vote(like: boolean)
	{
	
	}
}