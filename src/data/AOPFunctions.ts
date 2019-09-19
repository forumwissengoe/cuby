export function cache(target: any, propertyKey: string, descriptor: PropertyDescriptor)
{
	const origValue = descriptor.value;
	const cache = new Map<any[], any>();
	descriptor.value = function(...args: any[])
	{
		for(let k of cache.keys()) {
			if(JSON.stringify(k) === JSON.stringify(args)) {
				return cache.get(k); }}
		
		const result = origValue.apply(this, args);
		cache.set(args, result);
		return result;
	}
}

var callNumber = 0x1;

export function log(target: any, propertyKey: string, descriptor: PropertyDescriptor)
{
	const origValue = descriptor.value;
	descriptor.value = function(...args: any[])
	{
		const cn = callNumber++;
		console.log(`Call\t[${cn}]: ${propertyKey}(${args.join(", ")})`);
		const start = new Date().getTime();
		var result = origValue.apply(this, args);
		console.log(`Result\t[${cn}]: ${result} \t(time: ${new Date().getTime() - start} ms)`);
		return result;
	}
}

export function watch(watcher:(value) => void)
{
	return function(target: Object, key: string | symbol)
	{
		let val = target[key];
		const getter = () => { return val; };
		const setter = (next) => { val = next; watcher(val); };
		
		Object.defineProperty(target, key, {get: getter, set: setter});
	}
}
