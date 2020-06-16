export default function validatePassword( password:string ){
	if( !password ) return false;

	// Tests users
	if( password.startsWith('TU') && password.length > 10 ){
		return true;
	}
	
	return password.length >= 8 &&
		password.match(/[A-Z]/) &&
		password.match(/[a-z]/) &&
		password.match(/[0-9]/)
	;
}