import { Injectable } from '@angular/core';
import {IiiFObject} from '../../../data/IiiFObject';
import {DataLoader} from '../../../data/DataLoader';
import {StorageService} from '../../storage.service';
import {Answer, ImagePair} from './question.page';
import * as Q from 'q';

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
			if(!questions.questions || !questions.type)
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
		})
	}
	
	/*_loadAllQuestions()
	{
		this.available = 0;

		if(this.storageService.questionsConfig.categories && Array.isArray(this.storageService.questionsConfig.categories))
		{
			for(let cat of this.storageService.questionsConfig.categories)
			{
				if(cat.name == this.categoryName)
				{
					let first:boolean = true;
					for(let q of cat.questions.questions)
					{
						let obj = new QuestionType1();
						obj.loadQData(this.storageService, new QDataType1(q.question, q.records, q.answers, q.correct)).then(() => {
							if(obj.answers.length != 4)
								return;
							this.allQuestions.push(obj);
							this.available++;
							if(first)
							{
								first = false;
								this.currentQuestion = this.allQuestions[this.questionIndex];
							}
							if(this.loadingFinishedCallback != null)
								this.loadingFinishedCallback();
						});
					}
				}
			}
		}
	}*/
	
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
		this.currentQuestion = this.allQuestions[this.questionIndex];
		let tmp:{question:string, images:ImagePair[], answers:Answer[], correct:number} =
			{question: this.currentQuestion.question,
			images: [],
			answers: [],
			correct: this.currentQuestion.correct};
		
		for(let i = 0; i < this.currentQuestion.answers.length; i++)
			tmp.answers[i] = {answer: this.currentQuestion.answers[i], selected: false, correct: false, wrong: false};
		
		let x = null;
		let w = this.storageService.config.viewWidth * (this.categoryType == 1 ? 0.5 : 0.9);
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
}

export class QuestionType1
{
	records:string[] = ["record_kuniweb_946619", "record_kuniweb_937611", "record_kuniweb_948640", "record_kuniweb_675781" ];
	
	question:string = "";
	images:IiiFObject[] = [];
	answers:string[] = [];
	correct:number = 0;
	
	loadDummy(storageService:StorageService)
	{
		return new Promise( (resolve, reject) => {
			this.question = "Finden Sie die Sammlung";
			this.correct = 2;
			this.answers = ["Botanik", "Kunst", "Ethnologie", "Geologie"];
			
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
	
	loadQData(storageService:StorageService, qdata:QDataType2)
	{
		return new Promise((resolve, reject) => {
			this.question = qdata.question;
			this.correct = qdata.correct;
			
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

