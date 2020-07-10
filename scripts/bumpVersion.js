const fs = require('fs');
const Path = require('path');

const packageJson = require('../package.json');

const packageJsonPath = Path.join( __dirname, '../package.json' );
const androidFilePath = Path.join( __dirname, '../android/app/build.gradle');
const iosFilePath = Path.join( __dirname, '../ios/discovmobile/Info.plist' );

function bump( type, version ){
	let parts = version.split('.').map(v => parseInt(v, 10));

	if( type === 'major' ){
		parts[0]++;
		parts[1] = 0;
		parts[2] = 0;
	}
	else if( type === 'minor' ){
		parts[1]++;
		parts[2] = 0;
	}
	else {
		parts[2]++;
	}

	return parts.join('.');
}

let androidContents = fs.readFileSync(androidFilePath, 'utf8');
let iosContents = fs.readFileSync(iosFilePath, 'utf8');

const type = process.argv[2];
const nextVersion = bump( type, packageJson.version );

packageJson.version = nextVersion;

fs.writeFileSync(
	packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8'
);

fs.writeFileSync(
	androidFilePath,
	androidContents.replace(/versionName\s+"(.*?)"/, `versionName "${nextVersion}"`),
	'utf8'
);

let iosRegex = /CFBundleShortVersionString.*?<string>.*?<\/string>/s;
let ori = iosContents.match(iosRegex)[0];
let updated = ori.replace(/<string>.*?<\/string>/, `<string>${nextVersion}</string>`);
fs.writeFileSync(
	iosFilePath,
	iosContents.replace(iosRegex, updated),
	'utf8'
);

console.log( `Version updated to ${nextVersion}` );