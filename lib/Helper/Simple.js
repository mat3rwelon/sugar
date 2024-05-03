require('../config.js');
const {
	downloadContentFromMessage,
	delay
} = require('baileys');
const {
	FormData,
	Blob
} = require('formdata-node')
const { fileTypeFromBuffer } = require('file-type')
const uploadToImgbb = require('imgbb-uploader');

/**
 * Function to check if the user is an admin in the group.
 * @param {object} ctx - The context object.
 * @param {string} id - The ID of the user.
 * @returns {number} Returns 1 if the user is an admin, otherwise returns 0.
 */
async function checkAdmin(ctx, id) {
	const group = await ctx._client.groupMetadata(ctx.id);
	const formattedId = `${id}@s.whatsapp.net`;

	return group.participants.filter(v => (v.admin === 'superadmin' || v.admin === 'admin') && v.id == formattedId).length ? true : false;
}

let lastDate = new Date();
let counter = 1;

/**
 * Function to generate a unique file name with a counter.
 * @returns {string} Returns the generated file name.
 */
function generateFileName() {
	let currentDate = new Date();

	if (currentDate.getDate() !== lastDate.getDate()) {
		counter = 1;
		lastDate = currentDate;
	}

	let year = currentDate.getFullYear();
	let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
	let day = currentDate.getDate().toString().padStart(2, '0');
	let index = counter.toString().padStart(3, '0');
	counter++;
	return `FILE-${year}${month}${day}-${index}`;
}

/**
 * Function to convert milliseconds to human-readable duration.
 * @param {number} ms - The time duration in milliseconds.
 * @returns {string} Returns the human-readable duration string.
 */
exports.convertMsToDuration = (ms) => {
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / (1000 * 60)) % 60);
	const hours = Math.floor(ms / (1000 * 60 * 60));
	let durationString = '';

	if (hours > 0) durationString += hours + ' jam ';

	if (minutes > 0) durationString += minutes + ' menit ';

	if (seconds > 0) durationString += seconds + ' detik';

	return durationString;
}

/**
 * Function to upload an image buffer and return the image link.
 * @param {Buffer} buffer - The image buffer to upload.
 * @returns {Promise<string>} Returns a promise that resolves to the image link.
 */
exports.getImageLink = async (buffer) => {
	const options = {
		apiKey: global.apiKey.imgbb,
		name: generateFileName(),
		expiration: 3600,
		base64string: buffer.toString('base64')
	};

	return await uploadToImgbb(options);
}

exports.getImageLinkV2 = async buffer => {
	const { ext, mime } = await fileTypeFromBuffer(buffer)
	let form = new FormData()
	const blob = new Blob([buffer.buffer], { type: mime })
	form.append('file', blob, 'tmp.' + ext)
	let res = await fetch('https://telegra.ph/upload', {
		method: 'POST',
		body: form
	})
	let img = await res.json()
	if (img.error) throw img.error
	return 'https://telegra.ph' + img[0].src
}

/**
 * Function to download content from a message.
 * @param {object} object - The object containing message content.
 * @param {string} type - The type of content to download.
 * @returns {Buffer} Returns the downloaded content as a buffer.
 */
exports.download = async (object, type) => {
	const stream = await downloadContentFromMessage(object, type);
	let buffer = Buffer.from([]);

	for await (const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk]);
	}

	return buffer;
}

/**
 * Function to format file size into human-readable format.
 * @param {number} bytes - The size of the file in bytes.
 * @returns {string} Returns the human-readable file size string.
 */
exports.formatSize = (bytes) => {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

	if (bytes === 0) return '0 Byte';

	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

/**
 * Function to check if a message is a command.
 * @param {object} m - The message object.
 * @param {object} ctx - The context object.
 * @returns {boolean} Returns true if the message is a command, otherwise false.
 */
exports.isCmd = (m, ctx) => {
	const prefixRegex = new RegExp(ctx._config.prefix, 'i');
	const content = m.content.trim();

	if (!prefixRegex.test(content)) return false;

	const [cmdName] = content.slice(1).trim().toLowerCase().split(/\s+/);

	for (const cmd of ctx._config.cmd.values()) {
		if (cmd.name === cmdName || (cmd.aliases && cmd.aliases.includes(cmdName))) return true;
	}

	return false;
}

/**
 * Function to check if the user is an admin.
 * @param {object} ctx - The context object.
 * @returns {number} Returns 1 if the user is an admin, otherwise returns 0.
 */
exports.isAdmin = async (ctx, jid) => {
	jid = jid || ctx._sender.jid.split('@')[0].split(':')[0]
	const isAdmin = await checkAdmin(ctx, jid);
	return isAdmin ? 1 : 0;
}

/**
 * Function to check if the bot is an admin of the group.
 * @param {object} ctx - The context object.
 * @returns {number} Returns 1 if the bot is an admin of the group, otherwise returns 0.
 */
exports.isAdminOf = async (ctx) => {
	const isAdminOfGroup = await checkAdmin(ctx, ctx._client.user.id.split(':')[0]);
	return isAdminOfGroup ? 1 : 0;
}

/**
 * Function to check if the user is the owner.
 * @param {object} ctx - The context object.
 * @returns {number} Returns 1 if the user is the owner, otherwise returns 0.
 */
exports.isOwner = (ctx) => {
	const isOwner = ctx._sender.jid.includes(global.owner.number);
	return isOwner ? 1 : 0;
}

/**
 * Function to convert a string to title case.
 * @param {string} str - The string to convert.
 * @returns {string} Returns the title cased string.
 */
exports.ucword = (str) => {
	return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}

exports.toJID = (number) => {
	number = number.toString()
	number = number.replace(/(\++)?(\s+)?(\-+)?(\@+)?(\.+)?([a-zA-Z]+)?/g, '')
	number = number.startsWith('08') ? '628' + number.slice(2) : number
	number = number + '@s.whatsapp.net'
	return number
}

const toNumber = (jid) => jid.split('@')[0].split(':')[0]
exports.toNumber = toNumber

exports.isGroup = (jid) => jid.endsWith('@g.us')

exports.Msg = (flx) => {
	return flx?.m || flx?._msg || flx?._self.m
}

exports.Sender = (flx) => {
	let m = flx?.m || flx?._msg || flx?._self.m
	let from = jid = m.key.remoteJid
	let sender = jid.endsWith('@g.us') ? (m.key.participant) : jid
	return { jid: jid, sender: sender, pushName: m.pushName }
}

exports.input = (text) => {
	const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout })
	return new Promise((res, rej) => {
		try {
			rl.question(text, res)
		} catch (error) {
			rej(error)
		}
	})
}

exports.serialize = (f, m) => {
	let user = f?.core?.user || f?._core?.user || f?._client?.user
	m.isGroup = m.key.remoteJid.endsWith('@g.us')
	m.jid = m.key.remoteJid
	m.sender = m.isGroup ? (m.key.participant) : m.jid
	m.isRetry = false
	try {
		const tipe = Object.keys(m.message)[0]
		m.type = m.messageType || tipe
	} catch (e) {
		m.type = null
	}
	try {
		const context = m.message[m.type].contextInfo
		const quoted = context.quotedMessage
		if (quoted.ephemeralMessage) {
			m.quoted = quoted.ephemeralMessage.message
		} else {
			m.quoted = quoted
		}
		m.isQuoted = true
		m.quoted.sender = m.message[m.type].contextInfo.participant
		m.quoted.fromMe = m.quoted.sender === user.id.split(':')[0] + '@s.whatsapp.net' ? true : false
		m.quoted.type = Object.keys(m.quoted)[0]
		let anu = m.quoted
		let _a = ''
		if (anu.conversation) {
			_a = anu.conversation
		} else if (anu.imageMessage && anu.imageMessage.caption) {
			_a = anu.imageMessage.caption
		} else if (anu.videoMessage && anu.videoMessage.caption) {
			_a = anu.videoMessage.caption
		} else if (anu.documentMessage && anu.documentMessage.caption) {
			_a = anu.documentMessage.caption
		} else if (anu.extendedTextMessage && anu.extendedTextMessage.text) {
			_a = anu.extendedTextMessage.text
		} else if (anu.buttonsMessage && anu.buttonsMessage.contentText) {
			_a = anu.buttonsMessage.contentText
		} else if (anu.viewOnceMessage) {
			let _v = anu.viewOnceMessage.message
			if (_v.imageMessage && _v.imageMessage.caption) {
				_a = _v.imageMessage.caption
			} else if (_v.videoMessage && _v.videoMessage.caption) {
				_a = _v.videoMessage.caption
			}
		} else if (anu.viewOnceMessageV2) {
			let _v = anu.viewOnceMessageV2.message
			if (_v.imageMessage && _v.imageMessage.caption) {
				_a = _v.imageMessage.caption
			} else if (_v.videoMessage && _v.videoMessage.caption) {
				_a = _v.videoMessage.caption
			}
		}
		m.quoted.chats = _a
		m.quoted.id = m.message[m.type].contextInfo.stanzaId
		m.quoted.key = {
			remoteJid: m.quoted.sender,
			fromMe: m.quoted.fromMe,
			id: m.quoted.id
		}
		m.quoted.message = JSON.parse(JSON.stringify(quoted))
		m.quoted.number = toNumber(m.quoted.sender)
		let type_ = m.quoted.type
		if (type_ == 'imageMessage') {
			m.quoted.download = async () => {
				return await download(m.quoted.imageMessage, 'image')
			}
		} else if (type_ == 'documentMessage') {
			m.quoted.download = async () => {
				return await download(m.quoted.documentMessage, 'document')
			}
		} else if (type_ == 'audioMessage') {
			m.quoted.download = async () => {
				return await download(m.quoted.audioMessage, 'audio')
			}
		} else if (type_ == 'videoMessage') {
			m.quoted.download = async () => {
				return await download(m.quoted.videoMessage, 'video')
			}
		} else if (type_ == 'stickerMessage') {
			m.quoted.download = async () => {
				return await download(m.quoted.stickerMessage, 'image')
			}
		} else if (type_ == 'viewOnceMessage') {
			let m_ = m.quoted.viewOnceMessage.message
			let _type = Object.keys(m_)[0]
			if (_type == 'imageMessage') {
				m.quoted.download = async () => {
					return await download(m_.imageMessage, 'image')
				}
			} else if (_type == 'videoMessage') {
				m.quoted.download = async () => {
					return await download(m_.videoMessage, 'video')
				}
			}
		} else if (type_ == 'viewOnceMessageV2') {
			m_ = m.quoted.viewOnceMessageV2.message
			_type = Object.keys(m_)[0]
			if (_type == 'imageMessage') {
				m.quoted.download = async () => {
					return await download(m_.imageMessage, 'image')
				}
			} else if (_type == 'videoMessage') {
				m.quoted.download = async () => {
					return await download(m_.videoMessage, 'video')
				}
			}
		} else if (type_ == 'viewOnceMessageV2Extension') {
			m.quoted.download = async () => {
				return await download(m.quoted.viewOnceMessageV2Extension.message.audioMessage, 'audio')
			}
		}
		if (m.quoted.download) m.quoted.dl = m.quoted.download
	} catch (e) {
		m.quoted = null
		m.isQuoted = false
	}
	global.quoted = m.quoted
	try {
		const mention = m.message[m.type].contextInfo.mentionedJid
		m.mentions = mention
	} catch (e) {
		m.mentions = []
	}
	if (m.isGroup) {
		m.sender = m.participant || m.key.participant
	} else {
		m.sender = m.key.remoteJid
	}
	if (m.key.fromMe) {
		m.sender = user.id.split(':')[0] + '@s.whatsapp.net'
	}
	
	m.now = m.messageTimestamp
	m.fromMe = m.key.fromMe
	m.number = toNumber(m.sender)
	
	let ano = m.message
	let _b = ''
	let _c = null
	if (ano.conversation) {
		_b = ano.conversation
		_c = 'conversation'
	} else if (ano.imageMessage && ano.imageMessage.caption) {
		_b = ano.imageMessage.caption
		_c = 'imageMessage'
	} else if (ano.videoMessage && ano.videoMessage.caption) {
		_b = ano.videoMessage.caption
		_c = 'videoMessage'
	} else if (ano.documentMessage && ano.documentMessage.caption) {
		_b = ano.documentMessage.caption
		_c = 'documentMessage'
	} else if (ano.extendedTextMessage && ano.extendedTextMessage.text) {
		_b = ano.extendedTextMessage.text
		_c = 'extendedTextMessage'
	} else if (ano.buttonsMessage && ano.buttonsMessage.contentText) {
		_b = ano.buttonsMessage.contentText
		_c = 'buttonsMessage'
	} else if (ano.viewOnceMessage) {
		let _v = ano.viewOnceMessage.message
		_c = 'viewOnceMessage'
		if (_v.imageMessage && _v.imageMessage.caption) {
			_b = _v.imageMessage.caption
		} else if (_v.videoMessage && _v.videoMessage.caption) {
			_b = _v.videoMessage.caption
		}
	} else if (ano.viewOnceMessageV2) {
		let _v = ano.viewOnceMessageV2.message
		_c = 'viewOnceMessageV2'
		if (_v.imageMessage && _v.imageMessage.caption) {
			_b = _v.imageMessage.caption
		} else if (_v.videoMessage && _v.videoMessage.caption) {
			_b = _v.videoMessage.caption
		}
	}
	let type_ = m.type
	if (type_ == 'imageMessage') {
		m.download = async () => {
			return await download(m.imageMessage, 'image')
		}
	} else if (type_ == 'documentMessage') {
		m.download = async () => {
			return await download(m.documentMessage, 'document')
		}
	} else if (type_ == 'audioMessage') {
		m.download = async () => {
			return await download(m.audioMessage, 'audio')
		}
	} else if (type_ == 'videoMessage') {
		m.download = async () => {
			return await download(m.videoMessage, 'video')
		}
	} else if (type_ == 'stickerMessage') {
		m.download = async () => {
			return await download(m.stickerMessage, 'image')
		}
	} else if (type_ == 'viewOnceMessage') {
		let m_ = m.viewOnceMessage.message
		let _type = Object.keys(m_)[0]
		if (_type == 'imageMessage') {
			m.download = async () => {
				return await download(m_.imageMessage, 'image')
			}
		} else if (_type == 'videoMessage') {
			m.download = async () => {
				return await download(m_.videoMessage, 'video')
			}
		}
	} else if (type_ == 'viewOnceMessageV2') {
		m_ = m.viewOnceMessageV2.message
		_type = Object.keys(m_)[0]
		if (_type == 'imageMessage') {
			m.download = async () => {
				return await download(m_.imageMessage, 'image')
			}
		} else if (_type == 'videoMessage') {
			m.download = async () => {
				return await download(m_.videoMessage, 'video')
			}
		}
	} else if (type_ == 'viewOnceMessageV2Extension') {
		m.download = async () => {
			return await download(m.viewOnceMessageV2Extension.message.audioMessage, 'audio')
		}
	}
	if (m.download) m.dl = m.download
	m.chats = _b
	m[_c] = m.message[_c]
	return m
}