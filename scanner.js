"use strict";

// #############
// Basic usage
// - see "Basic usage" section in README for an explanation
// #############

var io = require('socket.io-client');

// without Babel in ES2015
const { NFC } = require('nfc-pcsc');

const message = {
	tag_uid:'',
	items:[],
	duds:[]
};

const duds = ['0469c3fa2f4d81','0461c3fa2f4d81','0459c3fa2f4d81','0451c3fa2f4d81','044ac2fa2f4d81'];

const nfc = new NFC(); // optionally you can pass logger

nfc.on('reader', reader => {

	console.log(`${reader.reader.name}  device attached`);
	
	reader.aid = 'F222222222';
	
	const socket = io.connect('http://192.168.1.197:3000');

	reader.on('card', card => {
		let uid = card.uid
		
		if(uid.length === 8) {
			console.log('User has scanned their tag: ' + uid);
			message.tag_uid = uid;
			socket.emit('user-submit', message);
			clearMessage();
		} else {
			if(duds.includes(uid)) {
				console.log('A Dud item has been scanned: ' + uid);
				message.duds.push(uid);
				socket.emit('dud-added', uid);
			} else {
				if(!message.items.includes(uid)) {
					console.log('Item has been scanned: ' + uid);
					message.items.push(uid);
					socket.emit('item-added', uid);
				} else {
					console.log('Item has already been added: ' + uid);
					socket.emit('item-already-added', uid);
				}
			}
		}
		
	});

	// reader.on('card.off', card => {
	// 	console.log(`${reader.reader.name}  card removed`, card);
	// });

	// reader.on('error', err => {
	// 	console.log(`${reader.reader.name}  an error occurred`, err);
	// });

	// reader.on('end', () => {
	// 	console.log(`${reader.reader.name}  device removed`);
	// });

});

nfc.on('error', err => {
	console.log('an error occurred', err);
});

function clearMessage() {
	message.tag_uid = '';
	message.items = [];
	message.duds = [];
}
