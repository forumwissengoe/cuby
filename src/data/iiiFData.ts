
export class iiiFData
{
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