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
}


class mb implements convertableToString
{
	data:string = "";
	constructor(data:string) {this.data = data;}
	toString():string {return this.data;}
}