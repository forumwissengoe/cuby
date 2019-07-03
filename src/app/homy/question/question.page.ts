import {Component, OnInit, ViewChild} from '@angular/core';
import {ImageOverlay} from '../../additions/overlay/image-overlay.component';
import {QuestionController} from './question.controller.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {StorageService} from '../../storage.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {
	
	@ViewChild('overlay') overlay:ImageOverlay;
	
	//title:string = "Frage 1 / 1";
	title:string = "";
	current:number = 0;
	total:number = 0;
	first:boolean = true;
	
	type:number = -1;
	
	question:{question:string, images:ImagePair[], answers:Answer[], record_id: string, correct:number} =
		{
			question: "",
			images: [],
			answers: [],
			record_id: "",
			correct: 0
		};
		
	dummy:{question:string, images:ImagePair[], answers:Answer[], correct:number} =
		{question: "Finden Sie die Gemeinsamkeit",
		images: [{
			a: {img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_946619/record_kuniweb_946619_444796.jpg/full/600,400/0/default.jpg", service: [], id: "record_kuniweb_946619" },
			b: {img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_937611/record_kuniweb_937611_391502.jpg/full/600,400/0/default.jpg", service: [], id: "record_kuniweb_937611" }},{
			a: {img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_948640/record_kuniweb_948640_444883.jpg/full/600,400/0/default.jpg", service: [], id: "record_kuniweb_948640" },
			b: {img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_675781/record_kuniweb_675781_433888.jpg/full/600,400/0/default.jpg", service: [], id: "record_kuniweb_675781" }}],
		answers: [	{answer: "Botanik", selected: false, correct: false, wrong: false}, {answer: "Kunst", selected: false, correct: false, wrong: false},
					{answer: "Ethnologie", selected: false, correct: false, wrong: false}, {answer: "Geologie", selected: false, correct: false, wrong: false}],
		correct: 2};
	
	selectedIndex:number = -1;
	selectIntervalID:any = null;
	
	constructor(private questionController:QuestionController, private storageService:StorageService, private router:Router, private route: ActivatedRoute)
	{}
	
	ngOnInit() {}
	
	ionViewWillEnter()
	{
		// Setup
		this.first = true;
		this.type = -1; // Loading
		this.title = "";
		this.total = 0;
		this.current = 0;
		this.question = { question: "", images: [], answers: [], record_id: "", correct: 0 };
		
		this.questionController.categoryID = this.route.snapshot.paramMap.get('id');
		this.questionController.setLoadingFinishedCallback(this.loadingFinishedCallback.bind(this));
		this.questionController.loadAllQuestions();
	}

	loadingFinishedCallback()
	{
		if(this.first)
		{
			this.first = false;
			this.setQuestion();
			console.log("Loading finished");
		}
		this.total = this.questionController.available;
		this.title = this.questionController.categoryName;
		this.type = this.questionController.categoryType; // Loading finished
	}
	
  	openImage(image:{img:string, service:any[], id:string})
	{
		this.overlay.setImageService(image.service);
		this.overlay.open();
	}
	
	selectAnswer(answer:Answer, index:number) {
		if (this.selectIntervalID != null)
			clearInterval(this.selectIntervalID);
		
		for (let i = 0; i < this.question.answers.length; i++)
			this.question.answers[i].selected = false;
		
		const _self = this;
		this.selectedIndex = index;
		answer.selected = true;
		
		this.selectIntervalID = setTimeout(() => {
			let dex = 0;
			for (; dex < this.question.answers.length; dex++)
				if (answer === this.question.answers[dex])
					break;
			
			if(this.storageService.homyState.index)
				this.storageService.homyState.index++;
			
			answer.selected = false;
			if (dex == this.question.correct)
			{
				answer.correct = true;
				if(this.storageService.homyState.current_points != undefined)
					this.storageService.homyState.current_points++;
				
				if(this.storageService.homyState.total_points != undefined)
					this.storageService.homyState.total_points++;

				if(this.storageService.homyState.correct_records != undefined)
					this.storageService.homyState.correct_records.push(this.question.record_id);
				
				console.log("Current points: ", this.storageService.homyState.current_points);
			}
			else
			{
				answer.wrong = true;
				if(this.question.answers[this.question.correct])
					this.question.answers[this.question.correct].correct = true;
			}
			
			setTimeout(() => this.quizFinished(), 500);
			
		}, 1000);
	}
	
	quizFinished()
	{
		if(this.questionController.next() != -1)
		{
			if(this.questionController.questionIndex % 10 == 0)
			{
				this.router.navigate(['/milestone', this.questionController.categoryID ]);
			}
			else
				this.setQuestion();
		}
		else
			this.router.navigate(['/milestone', this.questionController.categoryID ]);
	}
	
	setQuestion()
	{
		for(let i = 0; i < this.question.answers.length; i++)
		{
			this.question.answers[i].correct  = false;
			this.question.answers[i].selected = false;
			this.question.answers[i].wrong	  = false;
		}
		this.question = this.questionController.getCurrentQuestion();
		this.current = this.questionController.available != 0 ? this.questionController.questionIndex +1 : 0;
	}
	
	setAnswerStyle(answer:Answer)
	{
		let tmp = {};
		if(answer.selected) 	tmp = {'background-color': '#ffd500'};
		else if(answer.correct) tmp = {'background-color': '#00cc00'};
		else if(answer.wrong)	tmp = {'background-color': '#ff4000'};
		return tmp;
	}
}

export interface ImagePair
{
	a:{img:string, service:any[], id:string}
	b:{img:string, service:any[], id:string}
}

export interface Answer
{
	answer: string,
	selected: boolean,
	correct: boolean,
	wrong: boolean,
}
