/**	This class implements the iiiF Presentation API for the use in the app "cuby".
 * 	Developed by: Timon Vogt
 * 	Based on: https://iiif.io/api/presentation/2.1/
 *
 * 	This implementation DOES NOT claim to be a full implementation of the iiiF Presentation API and
 * 	DOES NOT implement every feature of the API. It is intended to extract and provide only the
 * 	features needed in the app from a iiiF manifest.
 */

export class IiiFObject
{
	
	manifest_url:string = "";
	manifest:string     = "";
	
	
	record_id:string = "";
	image_data:any[] = [];

	// Manifest data
	//  Technical
	context:string = "";
	id:string = "";
	type:string = "sc:Manifest";
	
	//	Label
	label:string = "";
	
	//	Metadata
	//		Tree-structure: metadata -> [{label, value -> [{@value,@language}}]]
	metadata:any = [{ label: "", value: [{ "@value": "", "@language": "" }]}];
	
	//	Description
	description:string = "";
	
	//	Thumbnail
	//		Tree-structure: {@id, service -> {@context, @id, profile}}
	thumbnail:any = { "@id": "", service: { "@context": "", "@id": "", profile: "" }};
	
	//	Presentation information: currently not supported
	
	//	Rights information
	license:string = "";
	attribution:any = [];
	
	// 	Logo
	//		Tree-structure: {@id, service -> {@context, @id, profile}}
	logo:any = { "@id": "", service: { "@context": "", "id": "", profile: "" }};
	
	//	Rendering: currently not supported (api unstable)
	
	// see also
	// 		Tree-structure: {@id, label, format}
	seeAlso:any = { "@id": "", label: "", format: "" };
	
	// sequence
	//
	sequence:any = { id: "", type: "sc:Sequence", label: "", viewingHint: "", viewingDirection: "", startCanvas: "", within: "", canvases: [{}]};
	
	constructor(manifest_url?:string)
	{
		if(manifest_url != undefined) this.manifest_url = manifest_url;
	}
	
	loadManifest(manifest_string:string)
	{
		this.manifest = manifest_string;
		let data = JSON.parse(manifest_string);
		
		if(data["@context"] != undefined) 		this.context = data["@context"];
		if(data["@id"] != undefined)			this.id = data["@id"];
		if(data["@type"] != undefined)			this.type = data["@type"];
		if(data.label != undefined)				this.label = data.label;
		if(data.description != undefined)		this.description = data.description;
		if(data.license != undefined)			this.license = data.license;
		if(data.attribution != undefined)		this.attribution = data.attribution;
		
		if(data.metadata != undefined)			this.metadata = data.metadata;
		if(data.logo != undefined)				this.logo = data.logo;
		if(data.thumbnail != undefined)			this.thumbnail = data.thumbnail;
		if(data.seeAlso != undefined)			this.seeAlso = data.seeAlso;
		
		// Sequence (currently only supporting the first sequence)
		if(data.sequences != undefined)
		{
			let seq = data.sequences;
			if(seq instanceof Array)
				seq = data.sequences[0];
			
			if(seq["@id"] != undefined) 		this.sequence.id = seq["@id"];
			if(seq["@type"] != undefined)		this.sequence.type = seq["@type"];
			if(seq.label != undefined)			this.sequence.label = seq.label;
			if(seq.viewingHint != undefined)	this.sequence.viewingHint = seq.viewingHint;
			if(seq.viewingDirection != undefined) this.sequence.viewingDirection = seq.viewingDirection;
			if(seq.startCanvas != undefined)	this.sequence.startCanvas = seq.startCanvas;
			if(seq.within != undefined)			this.sequence.within = seq.within;
			
			// Canvases
			if(seq.canvases != undefined)
			{
				let result = [];
				for(let a = 0; a < seq.canvases.length; a++)
				{
					let current = seq.canvases[a];
					let tmp = {context: "", id: "", type: "", label: "", width: "", height: "", within: "", thumbnail: "", images: []};
					if(current["@context"] != undefined)	tmp.context = current["@context"];
					if(current["@id"] != undefined)			tmp.id = current["@id"];
					if(current["@type"] != undefined)		tmp.type = current["@type"];
					if(current["label"] != undefined)		tmp.label = current["label"];
					if(current["height"] != undefined)		tmp.height = current["height"];
					if(current["width"] != undefined)		tmp.width = current["width"];
					if(current["within"] != undefined)		tmp.within = current["within"];
					
					// Rendering and otherContent not supported, as currently unused
					// Thumbnail @id property is used
					if(current["thumbnail"] != undefined)
					{
						if(current["thumbnail"] instanceof Array)
							current["thumbnail"] = current["thumbnail"][0];
						if(current["thumbnail"]["@id"] != undefined)	tmp.thumbnail = current["thumbnail"]["@id"];
					}
					
					let res = [];
					for(let b = 0; b < current["images"].length; b++)
					{
						// Resource data from images is enough
						let img = current["images"][b]["resource"];
						if(img != undefined)
						{
							let res_tmp = {width: "", height: "", format: "", service: null};
							if(img["width"] != undefined)		res_tmp.width = img["width"];
							if(img["height"] != undefined)		res_tmp.height = img["height"];
							if(img["format"] != undefined)		res_tmp.format = img["format"];
							
							if(img["service"] != undefined)
							{
								res_tmp.service = new IiiFService(img["service"]);
								this.addImageService(img);
							}
							res.push(res_tmp);
						}
					}
					tmp.images = res;
					
					result.push(tmp);
				}
				this.sequence.canvases = result;
			}
		}
		
		
		this.manifest = manifest_string;
		let i1 = this.id.indexOf("iiif/manifests/") + "iiif/manifests/".length;
		let i2 = this.id.lastIndexOf("/manifest");
		this.record_id = this.id.substring(i1, i2);
	}
	
	private addImageService(img:any)
	{
		let service = img["service"];
		if(service["width"] == undefined && img["width"] != undefined)
			service["width"] = img["width"];
		if(service["height"] == undefined && img["height"] != undefined)
			service["height"] = img["height"];
		if(service["protocol"] == undefined)
			service["protocol"] = "http://iiif.io/api/image";
		if(service["tiles"] == undefined)
			service["tiles"] = [{ "scaleFactors": [ 1, 2, 4, 8, 16, 32 ], "width": 512 }];
		this.image_data.push(service);
	}
	
	// Getter and setter (for convenience)
	
	getThumbnailImageUrl():string
	{
		if(this.thumbnail != undefined)
			return this.thumbnail["@id"];
	}
	
	getThumbnailForAttributes(width?:number, height?:number, rotation?:number, type?:string, region?:string):string
	{
		let _size:string = "";
		if(width == undefined && height == undefined) _size = "max";
		else if(width == undefined) _size = "," + Math.ceil(height);
		else if(height == undefined) _size = Math.ceil(width) + ",";
		else _size = Math.ceil(width) + "," + Math.ceil(height);
		
		if(rotation == undefined) rotation = 0;
		else rotation = Math.ceil(rotation);
		
		if(type == undefined) type = "default";
		if(region == undefined) region = "full";
		
		if(this.thumbnail.service == undefined)
			return "";
		
		if(!(this.thumbnail.service instanceof Array))
			return this.thumbnail.service["@id"] + "/" + region + "/" + _size + "/" + rotation + "/" + type + this.thumbnail.service["@id"].substr(this.thumbnail.service["@id"].lastIndexOf("."));
		
		for (let serv in this.thumbnail.service) {
			if(serv["@context"] === "http://iiif.io/api/image/2/context.json")
				return serv["@id"] + "/" + region + "/" + _size + "/" + rotation + "/" + type + serv["@id"].substr(serv["@id"].lastIndexOf("."));
		}
		return "";
	}
	
	getMetadata()
	{
		return this.metadata;
	}
	
	getMetadataForLanguage(language:string)
	{
		if(this.metadata == undefined)
			return [];
		if(!(this.metadata instanceof Array))
			return this.metadata;
		
		let result = [];
		for(let i = 0; i < this.metadata.length; i++)
		{
			let meta = this.metadata[i];
			let label = "";
			let value = "";
			if(meta.label instanceof Array)
			{
				for(let a = 0; a < meta.label.length; a++)
				{
					let l = meta.label[a];
					if (l.hasOwnProperty("@language") && l["@language"] == language)
						label = l["@value"];
				}
			}
			else label = meta.label;
			if(meta.value instanceof Array)
			{
				for(let a = 0; a < meta.value.length; a++)
				{
					let v = meta.value[a];
					if(v.hasOwnProperty("@language") && v["@language"] == language)
						value = v["@value"];
				}
			}
			else value = meta.value;
			result.push({label: label, value: value});
		}
		return result;
	}
	
	getAttribution()
	{
		return this.attribution;
	}
	
	getAttributionForLanguage(language:string)
	{
		if(this.attribution == undefined)
			return "";
		
		if(!(this.attribution instanceof Array))
			return this.attribution;
		
		for(let i = 0; i < this.attribution.length; i++)
		{
			let attrib = this.attribution[i];
			if(attrib.hasOwnProperty("@language") && attrib["@language"] == language)
				return attrib["@value"];
		}
		return "";
	}
	
	getLogo()
	{
		return this.logo["@id"];
	}
	
	getLIDO()
	{
		if(this.seeAlso == undefined)
			return "";
		
		if(!(this.seeAlso instanceof Array))
			if(this.seeAlso.hasOwnProperty("label") && this.seeAlso.label == "LIDO")
				return this.seeAlso["@id"];
			else
				return "";
		
		for(let i = 0; i < this.seeAlso.length; i++)
		{
			let see = this.seeAlso[i];
			if(see.hasOwnProperty("label") && see.label)
				return see["@id"];
		}
		return "";
	}
	
	getImageService()
	{
		return this.image_data;
	}
	
	static compactifyIIIFmetadata(data:any):any
	{
		let new_metadata = [];
		for(let m of data)
		{
			let i = 0;
			for(; i < m.label.length; i++)
				if (m.label[i].language === "de")
					break;
			new_metadata.push({label: m.label[i].value, value: m.value});
		}
		return new_metadata;
	}
}

export class IiiFService
{
	context:string = "";
	id:string = "";
	profile:any = {};
	
	protocol:string = "";
	width:number = 0;
	height:number = 0;
	sizes:any = [];
	tiles:any = {width: 0, scaleFactors: []};
	
	constructor(service_manifest:any)
	{
		if(service_manifest["@context"] != undefined)	this.context = service_manifest["@context"];
		if(service_manifest["@id"] != undefined)		this.id = service_manifest["@id"];
		
		if(service_manifest["width"] != undefined)		this.width = parseInt(service_manifest["width"]);
		if(service_manifest["height"] != undefined)		this.height = parseInt(service_manifest["height"]);
		if(service_manifest["protocol"] != undefined)	this.protocol = service_manifest["protocol"];
		
		if(service_manifest["sizes"] != undefined && service_manifest["sizes"] instanceof Array)
		{
			for(let entry in service_manifest["sizes"])
			{
				let s = {width: 0, height: 0};
				if(entry["width"] != undefined) 	s.width = parseInt(entry["width"]);
				if(entry["height"] != undefined)	s.height = parseInt(entry["height"]);
				this.sizes.push(s);
			}
		}
		if(service_manifest["tiles"] != undefined)
		{
			if(service_manifest["tiles"] instanceof Array)
				service_manifest["tiles"] = service_manifest["tiles"][0];
			
			if(service_manifest["tiles"]["width"] != undefined)			this.tiles.width = parseInt(service_manifest["tiles"]["width"]);
			if(service_manifest["tiles"]["scaleFactors"] != undefined)	this.tiles.scaleFactors = service_manifest["tiles"]["scaleFactors"];
		}
		if(service_manifest["profile"] != undefined)
		{
			if(service_manifest["profile"] instanceof Array)
				this.profile = service_manifest["profile"][0];
			else
				this.profile = service_manifest["profile"];
		}
	}
}