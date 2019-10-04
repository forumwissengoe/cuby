import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';

@Component({
	selector: "feedback-response-overlay",
	template: `<div #feedbackOverlay class="feedback-overlay">
					<div class="text">
						{{current_message}}
					</div>
			   <ion-icon name="close-circle-outline" (click)="close()"></ion-icon>
			   </div>`,
	styleUrls: ['./feedback-response-overlay.scss']
})

export class FeedbackResponseOverlay implements OnInit
{
	@ViewChild('feedbackOverlay') overlay:ElementRef;
	current_message: string = "";
	
	messages: string[] = [];
	latest_nonce: number = 0;
	
	constructor(private renderer:Renderer2, private storage: Storage) {}
	
	ngOnInit()
	{
		this.storage.get("FEEDBACK_MESSAGES_NONCE").then((nonce) => {
			this.latest_nonce = nonce;
			if(this.latest_nonce == undefined || this.latest_nonce == null)
				this.latest_nonce = 0;
			console.log("Latest nonce: ", this.latest_nonce);
			
			const xhr = new XMLHttpRequest();
			xhr.open("GET", "http://wissenskiosk.uni-goettingen.de/cuby/messages.json");
			xhr.onload = (ev) => {
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
					{
						let arr = JSON.parse(xhr.responseText);
						if(arr !== undefined && Array.isArray(arr))
						{
							if(arr.length > 0)
							{
								for(let i = 0; i < arr.length; i++)
									if(arr[i].nonce > this.latest_nonce)
										this.messages.push(arr[i].message);
								this.latest_nonce = arr[arr.length-1].nonce;
								this.storage.set("FEEDBACK_MESSAGES_NONCE", this.latest_nonce);
								this.messages = this.messages.reverse();
								
								if(this.messages.length > 0)
								{
									this.current_message = this.messages.pop();
									this.open();
								}
							} // else: no new messages
						}
						else {
							console.log("ERROR. Messages transmission error.");
						}
						
					}
					else {
						console.log("ERROR. Messages could not be loaded.");
						return;
					}
				}
			};
			xhr.send();
		});
	}
	
	close()
	{
		if(this.messages.length > 0)
			this.current_message = this.messages.pop();
		else
			this.renderer.removeClass(this.overlay.nativeElement, "shown");
	}
	
	open()
	{
		this.renderer.addClass(this.overlay.nativeElement, "shown");
	}
}

