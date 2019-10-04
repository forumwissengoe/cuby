import * as xml from "xml2js"
import {convertableToString} from 'xml2js';
import {Promise} from 'es6-promise'

export class LidoReader
{
    constructor(){}

    readLido(data: any)
    {
    	data = data.replace(/lido:/g, "");
    	let s:mb = new mb(data);
    	return new Promise<any>( (resolve) => {
    		new xml.Parser().parseString(s, (error, result) => {
    			resolve(result);
			})
		});
    }
	
	getRecordID():string
	{
		if(this.data.hasOwnProperty("lido") &&
			this.data.lido.hasOwnProperty("lidoRecID") &&
			this.data.lido.lidoRecID instanceof Array &&
			this.data.lido.lidoRecID[0].hasOwnProperty("_"))
			return this.data.lido.lidoRecID[0]._;
		else
			return null;
	}
	
	getObjectPublishedIDs()
	{
		let result = [];
		if(this.data.hasOwnProperty("lido") && this.data.lido.hasOwnProperty("objectPublishedID"))
		{
			for(let link of this.data.lido.objectPublishedID)
				if(link.hasOwnProperty("_"))
					result.push({link: link["_"]});
		}
	}
	
	getCategories():any[]
	{
		if(this.data.hasOwnProperty("lido") &&
			this.data.lido.hasOwnProperty("category"))
		{
			if(this.data.lido.category instanceof Array)
			{
				let result = [];
				for(let cat of this.data.lido.category)
				{
					if(cat.hasOwnProperty("term") && cat.term instanceof Array)
					{
						let res = [];
						for(let t of cat.term)
						{
							let tmp = {category: "", language: ""};
							if(t.hasOwnProperty("_"))
								tmp.category = t._;
							if(t.hasOwnProperty("$") && t.$.hasOwnProperty("xml:lang"))
								tmp.language = t.$["xml:lang"];
							res.push(tmp);
						}
						result.push(res);
					}
				}
				return result;
			}
		}
		return null;
	}
	
	data:any = {};
	loadMetadata()
	{
		if(this.data.hasOwnProperty("lido") && this.data.lido.hasOwnProperty("descriptiveMetadata"))
		{
			let meta = [];
			for(let descr of this.data.lido.descriptiveMetadata)
			{
				let tmp_meta = {language: "", classification: null, identification: null, relation: null};
				if(descr.hasOwnProperty("$") && descr.$.hasOwnProperty("xml:lang"))
				{
					tmp_meta.language = descr.$["xml:lang"];
					
					// Object Classification Wrap
					let classific = [];
					for(let workType of descr.objectClassificationWrap[0].objectWorkTypeWrap)
					{
						if(workType.objectWorkType == undefined)
							continue;
						let tmp_wType = {conceptID: "", type: "", term: "", obj: true};
						if(workType.objectWorkType[0].hasOwnProperty("$") && workType.objectWorkType[0].$.hasOwnProperty("type"))
							tmp_wType.type = workType.objectWorkType[0].$.type;
						if(workType.objectWorkType[0].hasOwnProperty("conceptID"))
							tmp_wType.conceptID = workType.objectWorkType[0].conceptID[0]._;
						if(workType.objectWorkType[0].hasOwnProperty("term"))
							tmp_wType.term = workType.objectWorkType[0].term[0];
						classific.push(tmp_wType);
					}
					for(let c of descr.objectClassificationWrap[0].classificationWrap)
					{
						if(c.classification == undefined)
							continue;
						let tmp_classific = {conceptID: "", type: "", term: "", obj: false};
						if(c.classification[0].hasOwnProperty("$") && c.classification[0].$.hasOwnProperty("type"))
							tmp_classific.type = c.classification[0].$.type;
						if(c.classification[0].hasOwnProperty("conceptID"))
							tmp_classific.conceptID = c.classification[0].conceptID[0]._;
						if(c.classification[0].hasOwnProperty("term"))
							tmp_classific.term = c.classification[0].term;
						classific.push(tmp_classific);
					}
					tmp_meta.classification = classific;
					
					
					// Object Identification Wrap
					let ident = [];
					for(let title of descr.objectIdentificationWrap[0].titleWrap)
					{
						if(title.titleSet == undefined)
							continue;
						let tmp_title = {value: "", source: "", type: "TITLE"};
						console.log("T", title.titleSet);
						if(title.titleSet[0].hasOwnProperty("appellationValue"))
							if(title.titleSet[0].appelationValue instanceof Array)
								tmp_title.value = title.titleSet[0].appelationValue[0]; // multiple languages missing
							else
								tmp_title.value = title.titleSet[0].appelationValue;
						if(title.titleSet[0].hasOwnProperty("sourceAppellation"))
							tmp_title.source = title.titleSet[0].sourceAppellation;
						ident.push(tmp_title);
					}
				}
				meta.push(tmp_meta);
			}
			//this.metadata = meta;
		}
	}
	
	/*private loadData()
	{
		let tmp = null;
		let x = null;
		let self = this;
		
		if((this.objectPublishedID = this.parsedXML.getElementsByTagName("objectPublishedID")[0].innerHTML) == undefined)
		this.objectPublishedID = "";
		
		if((this.recordID = this.parsedXML.getElementsByTagName("lidoRecID")[0].innerHTML) == undefined)
			this.recordID = "";
		
		if((tmp = this.parsedXML.getElementsByTagName("objectWorkType")) != undefined)
		{
			console.log("TMP", tmp);
			x = {conceptID: null, term: null};
			for(let i = 0; i < tmp.length; i++)
			{
				let obj = tmp.item(i);
				console.log("OBJ", obj);
				if (obj.children[0].tagName == "conceptID" && obj.children[1].tagName == "term") {
					x.conceptID = obj.children[0].innerHTML;
					x.term = obj.children[1].innerHTML;
				} else if (obj.children[0].tagName == "term" && obj.children[1].tagName == "conceptID") {
					x.term = obj.children[0].innerHTML;
					x.conceptID = obj.children[1].innerHTML;
				} else {
					console.log("ObjectWorkType not found");
					break;
				}
				self.objectWorkType.push(x);
			}
		}
		
		if((tmp = this.parsedXML.getElementsByTagName("classification")) != undefined)
		{
			x = {conceptID: null, term: null};
			for(let obj of tmp)
			{
				if(obj.children[0].tagName == "conceptID" && obj.children[1].tagName == "term")
				{
					x.conceptID = obj.children[0].innerHTML;
					x.term = obj.children[1].innerHTML;
				}
				else if(obj.children[0].tagName == "term" && obj.children[1].tagName == "conceptID")
				{
					x.term = obj.children[0].innerHTML;
					x.conceptID = obj.children[1].innerHTML;
				}
				else
				{
					console.log("ObjectWorkType not found");
					break;
				}
				this.classification.push(x);
			}
		}
	}*/
}


class mb implements convertableToString
{
	data:string = "";
	constructor(data:string) {this.data = data;}
	toString():string {return this.data;}
}
