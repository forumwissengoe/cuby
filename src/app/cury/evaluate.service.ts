import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class EvaluateService {
	
	private level1:string[] = [];
	private		currentLevel1:string[] = [];
	private level2:string[] = [];
	private 	currentLevel2:string[] = [];
	private level3:Level3Likability[] = [];
	
	constructor() { }
	
	publishLikabilityLevel1(record:string)
	{
		console.log("Publish Level 1", record);
		this.level1.push(record);
		this.currentLevel1.push(record);
	}
	
	publishLikabilityLevel2(record:string)
	{
		console.log("Publish Level 2", record);
		this.level2.push(record);
		this.currentLevel2.push(record);
	}
	
	publishLikabilityLevel3(record:Level3Likability)
	{
		console.log("Publish Level 3");
		this.level3.push(record);
	}
	
	getLikabilityLevel1()
	{
		return this.level1;
	}
	
	getCurrentLikabilityLevel1()
	{
		console.log("Get current Level 1", this.currentLevel1);
		return this.currentLevel1;
	}
	
	getLikabilityLevel2()
	{
		return this.level2;
	}
	
	getCurrentLikabilityLevel2()
	{
		console.log("Get current Level 2", this.currentLevel2);
		return this.currentLevel2;
	}
	
	getLikabilityLevel3()
	{
		return this.level3;
	}
	
	removeCurrentLevel1(record:string)
	{
		EvaluateService.removeObj(this.currentLevel1, record);
	}
	
	removeCurrentLevel2(record:string)
	{
		EvaluateService.removeObj(this.currentLevel2, record);
	}
	
	stringify()
	{
		let data = {level1: this.level1, currentLevel1: this.currentLevel1, level2: this.currentLevel2, level3: this.level3};
		return JSON.stringify(data);
	}
	
	parseFromString(str:string)
	{
		let data = JSON.parse(str);
		this.level1 = data.level1;
		this.level2 = data.level2;
		this.level3 = data.level3;
		this.currentLevel1 = data.currentLevel1;
		this.currentLevel2 = data.currentLevel2;
	}
	
	private static removeObj(arr:string[], obj:string)
	{
		let index = arr.indexOf(obj);
		if(index != -1) arr.splice(index, 1);
	}
}

export class Level3Likability
{
	recordID:string = "";
	likedFields:string[] = [];
	comment:string = "";
}