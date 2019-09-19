import { Injectable } from '@angular/core';
import {IiiFObject} from '../../../data/IiiFObject';
import {DataLoader} from '../../../data/DataLoader';
import {StorageService} from '../../storage.service';
import {Answer, ImagePair} from './question.page';

@Injectable({
  providedIn: 'root'
})
export class QuestionController
{
	dummyQuestion:QuestionType1 = new QuestionType1();
	
	categoryName:string = "";
	categoryID:string = "";
	categoryURL:string = "";
	categoryType:number = 0;
	
	allQuestions:any[] = [];
	currentQuestion:any = null;
	questionIndex:number = 0;
	available:number = 0;
	
	loadingFinishedCallback:() => void = null;

  	constructor(private storageService:StorageService) {}
	
	loadDummyQuestion()
	{
		this.dummyQuestion.loadDummy(this.storageService).then(() => {
			this.currentQuestion = this.dummyQuestion;
			if(this.loadingFinishedCallback != null)
				this.loadingFinishedCallback();
		});
	}
	
	loadAllQuestions()
	{
		this.questionIndex = 0;
		this.allQuestions = [];
		this.currentQuestion = null;
		this.categoryType = 0;
		
		if(!this.categoryID) // TODO Error
		{
			return;
		}
		
		this.available = 0;
		this.categoryURL = this.storageService.getCategoryUrlForType(this.categoryID);
		this.categoryName = this.storageService.getCategoryNameForType(this.categoryID);
		if(this.categoryURL == "") // TODO Error
		{
			return;
		}
		console.log("URL: ", this.categoryURL, "  ID: ", this.categoryID);
		
		DataLoader.loadHomyQuestions(this.categoryURL, this.categoryID).then(questions =>
		{
			// TODO change back to return
			if(!questions.questions || !questions.type)
				//questions.type = "break";
				return;
				
			if(questions.type.startsWith("qtype_01"))
			{
				this.categoryType = 1;
				let first:boolean = true;
				for(let q of questions.questions)
				{
					let obj = new QuestionType1();
					obj.loadQData(this.storageService, new QDataType1(q.question, q.records, q.answers, q.correct)).then( () =>
					{
						this.allQuestions.push(obj);
						this.available++;
						
						if(first)
						{
							first = false;
							this.currentQuestion = this.allQuestions[this.questionIndex];
						}
						if(this.loadingFinishedCallback != null)
							this.loadingFinishedCallback();
					})
				}
			}
			
			else if(questions.type.startsWith("qtype_02"))
			{
				this.categoryType = 2;
				let first:boolean = true;
				for(let q of questions.questions)
				{
					let obj = new QuestionType2();
					obj.loadQData(this.storageService, new QDataType2(q.question, q.record, q.answers, q.correct)).then( () =>
					{
						this.allQuestions.push(obj);
						this.available++;
						
						if(first)
						{
							first = false;
							this.currentQuestion = this.allQuestions[this.questionIndex];
						}
						if(this.loadingFinishedCallback != null)
							this.loadingFinishedCallback();
					})
				}
			}
			
			else if(questions.type.startsWith("qtype_03"))
			{
				this.categoryType = 3;
				let first:boolean = true;
				for(let q of questions.questions)
				{
					let obj = new QuestionType3();
					obj.loadQData(q.question, q.position, q.answers, q.correct);
					this.allQuestions.push(obj);
					this.available++;
					
					if(first)
					{
						first = false;
						this.currentQuestion = this.allQuestions[this.questionIndex];
					}
					
					if(this.loadingFinishedCallback != null)
						this.loadingFinishedCallback();
				}
			}
			
			else if(questions.type.startsWith("qtype_04"))
			{
				this.categoryType = 4;
				let first:boolean = true;
				for(let q of questions.questions)
				{
					let obj = new QuestionType4();
					obj.loadQData(q.question, q.timeframe, q.timestamp, q.answers, q.correct);
					this.allQuestions.push(obj);
					this.available++;
					
					if(first)
					{
						first = false;
						this.currentQuestion = this.allQuestions[this.questionIndex];
					}
					
					if(this.loadingFinishedCallback != null)
						this.loadingFinishedCallback();
				}
			}
			
			/*// TODO change to questions.type
			else if(this.categoryID.startsWith("qtype_03"))
			{
				this.categoryType = 3;
				this.allQuestions.push(new QuestionType3().loadQData());
				this.currentQuestion = this.allQuestions[this.questionIndex];
				this.available = 1;
				if(this.loadingFinishedCallback != null)
					this.loadingFinishedCallback();
			}
			
			else if(this.categoryID.startsWith("qtype_04"))
			{
				this.categoryType = 4;
				this.allQuestions.push(new QuestionType4().loadQData());
				this.currentQuestion = this.allQuestions[this.questionIndex];
				this.available = 1;
				if(this.loadingFinishedCallback != null)
					this.loadingFinishedCallback();
			}*/
		});
	}
	
	setLoadingFinishedCallback(cb:() => void)
	{
		this.loadingFinishedCallback = cb;
	}
	
	next():number
	{
		if(this.questionIndex + 1 > this.allQuestions.length -1)
			return -1;
		else
			return ++this.questionIndex;
	}
	
	getCurrentQuestion()
	{
		/*if(this.categoryType === 3)
		{
		
		}
		else if(this.categoryType === 4)
		{
			let tmp = this.allQuestions[this.questionIndex];
			for(let i = 0; i < tmp)
		}*/
		
		this.currentQuestion = this.allQuestions[this.questionIndex];
		
		if(this.currentQuestion.hasImages)
		{
			let tmp:{question:string, images:ImagePair[], answers:Answer[], record_id:string, correct:number} =
				{
					question: this.currentQuestion.question,
					images: [],
					answers: [],
					record_id: this.currentQuestion.record_id,
					correct: this.currentQuestion.correct
				};
			
			for(let i = 0; i < this.currentQuestion.answers.length; i++)
				tmp.answers[i] = {answer: this.currentQuestion.answers[i], selected: false, correct: false, wrong: false};
			
			let x = null;
			let w = this.storageService.configuration.viewWidth * (this.categoryType == 1 ? 0.5 : 0.9);
			for(let i = 0; i < this.currentQuestion.images.length; i++)
			{
				if(x == null)
					x = {img: this.currentQuestion.images[i].getThumbnailForAttributes(w), service: this.currentQuestion.images[i].getImageService(), id: this.currentQuestion.images[i].record_id };
				else
				{
					tmp.images.push({a: x, b: {img: this.currentQuestion.images[i].getThumbnailForAttributes(w), service: this.currentQuestion.images[i].getImageService(), id: this.currentQuestion.images[i].record_id }});
					x = null;
				}
			}
			if(x != null)
				tmp.images.push({a: x, b: {img: "", service: [], id: ""} });
			return tmp;
		}
		else {
			let tmp = this.allQuestions[this.questionIndex];
			for(let i = 0; i < tmp.answers.length; i++)
				tmp.answers[i] = {answer: tmp.answers[i], selected: false, correct: false, wrong: false};
			return tmp;
		}
	}
}

export class QuestionType1
{
	records:string[] = ["record_kuniweb_946619", "record_kuniweb_937611", "record_kuniweb_948640", "record_kuniweb_675781" ];
	
	question:string = "";
	images:IiiFObject[] = [];
	answers:string[] = [];
	correct:number = 0;

	record_id:string = "";
	
	hasImages:boolean = true;
	
	loadDummy(storageService:StorageService)
	{
		return new Promise( (resolve, reject) => {
			this.question = "Finden Sie die Sammlung";
			this.correct = 2;
			this.answers = ["Botanik", "Kunst", "Ethnologie", "Geologie"];
			this.record_id = "record_kuniweb_946619";
			
			DataLoader.loadGallery(storageService, this.records).then( ({iiif, error}) => {
				for(let i of iiif)
					this.images.push(i);
				resolve();
			}).catch(() => reject() );
		});
	}
	
	loadQData(storageService:StorageService, qdata:QDataType1)
	{
		return new Promise((resolve, reject) => {
			this.question = qdata.question;
			this.correct = qdata.correct;
			this.record_id = qdata.records[Math.random() * Math.floor(qdata.records.length)];

 		
			for(let a of qdata.answers)
				if(a && a.replace(" ", "") != "")
					this.answers.push(a);
			
			DataLoader.loadGallery(storageService, qdata.records).then(({iiif, error}) => {
				for(let i of iiif)
					this.images.push(i);
				resolve();
			}).catch(() => reject() );
		})
	}
}

export class QDataType1
{
	question:string;
	records:string[];
	answers:string[];
	correct:number;
	
	constructor(question:string, records:string[], answers:string[], correct:number)
	{
		this.question = question;
		this.records = records;
		this.answers = answers;
		this.correct = correct;
	}
}

export class QuestionType2
{
	record:string = "record_kuniweb_946619";
	
	question:string = "";
	images:IiiFObject[] = [];
	answers:string[] = [];
	correct:number = 0;

	record_id:string = "";
	
	hasImages:boolean = true;
	
	loadQData(storageService:StorageService, qdata:QDataType2)
	{
		return new Promise((resolve, reject) => {
			this.question = qdata.question;
			this.correct = qdata.correct;
			this.record_id = this.record;
			
			for(let a of qdata.answers)
				if(a !== "")
					this.answers.push(a);
			
			DataLoader.downloadManifest(storageService, qdata.record).then(iiif =>
			{
				this.images.push(iiif);
				resolve();
			}).catch(() => reject() );
		})
	}
}

export class QDataType2
{
	question:string;
	record:string;
	answers:string[];
	correct:number;
	
	constructor(question:string, record:string, answers:string[], correct:number)
	{
		this.question = question;
		this.record = record;
		this.answers = answers;
		this.correct = correct;
	}
}

export class QuestionType3
{
	question:string = "";
	position:number[] = [];
	answers:string[] = [];
	correct:number = 0;
	
	hasImages:boolean = false;
	
	loadQData(question:string, position:number[], answers:string[], correct:number)
	{
		this.question = "Wer ist hier geboren?";
		this.position = [51.534399, 9.934757];
		this.answers = ["Hans Zimmer", "Frauke Ludowig", "Herbert Grönemeyer", "Bully Herbig"];
		this.correct = 2;
		
		this.question = question;
		this.position = position;
		this.answers = answers;
		this.correct = correct;
		
		return this;
	}
}

export class QuestionType4
{
	question:string = "";
	timeframe:number[] = [];
	timestamp:number = 0;
	answers:string[] = [];
	correct:number = 0;
	
	hasImages:boolean = false;
	
	loadQData(question:string, timeframe:number[], timestamp:number, answers:string[], correct:number)
	{
		this.question = "Wer wurde hier geboren?";
		this.timeframe = [1700, 1900];
		this.timestamp = 1769;
		this.answers = ["Napoleon Bonaparte", "Kleopatra VII. Philopator", "Otto von Bismarck", "Christoph Kolumbus"];
		this.correct = 0;
		
		this.question = question;
		this.timeframe = timeframe;
		this.timestamp = timestamp;
		this.answers = answers;
		this.correct = correct;
		
		return this;
	}
}
