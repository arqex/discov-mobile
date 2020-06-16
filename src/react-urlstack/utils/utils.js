export function memoize( fn ){
	var args, value;

	function recalculate( fnArgs ){
		args = fnArgs
		value = fn.apply( null, fnArgs )
		return value;
	}

	return function memoized(){
		if( !args || args.length !== arguments.length ){
			return recalculate( arguments )
		}

		let i = 0;
		while( i < args.length ){
			if( args[i] !== arguments[i] ){
				return recalculate( arguments )
			}
			i++
		}

		return value
	}
}

export function createId(){
  return Math.round( Math.random() * 10000000 ).toString(36);
}

export function nofn(){}

export function bind( that, methods ){
	methods.forEach( m => {
		that[m] = that[m].bind(that)
	})
}
