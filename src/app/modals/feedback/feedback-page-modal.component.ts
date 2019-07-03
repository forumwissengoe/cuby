import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';

declare var Email: any;

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback-page-modal.component.html',
  styleUrls: ['./feedback-page-modal.component.scss'],
})
export class FeedbackPageModal implements OnInit {

	feedbackdata:string = "";

	constructor(private modalCtrl: ModalController) { }

	ngOnInit() {

    }

    send()
	{
		// Data
		// SecureToken: "66DE25A7DF509B692D968EF8A71FAB53C3CF0C97E66073787B8A7FF6B62292D2C07B840A0D6088F39B95BE2AA9FADC34",
		// Password: "PtT}Nv+?qY}@jN#n",
		// Host: "firemail.de",
		// Username: "cubyBetaTest@firemail.de",

		console.log("EMAIL: ", Email);
		Email.send({
			Host: "smtp.elasticemail.com",
			Username: "niname408@googlemail.com",
			Password: "84e9165f-9367-4724-94df-1467f48024e1",
			To: "kustodie@gwdg.de",
			From: "cubyBetaTest@firemail.de",
			Subject: "Beta-Test Feedback",
			Body: "Feedback-Nachricht: \n" + this.feedbackdata
		}).then(message => console.log(message));

		this.modalCtrl.dismiss();
	}

    close()
	{
		this.modalCtrl.dismiss();
	}
}
