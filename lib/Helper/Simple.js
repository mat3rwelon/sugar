const {
	downloadContentFromMessage
} = require('baileys');

/**
 * Function to download content from a message.
 * @param {object} object - The object containing message content.
 * @param {string} type - The type of content to download.
 * @returns {Buffer} Returns the downloaded content as a buffer.
 */
const download = async (object, type) => {
	const stream = await downloadContentFromMessage(object, type);
	let buffer = Buffer.from([]);

	for await (const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk]);
	}

	return buffer;
}

const toJID = (number) => {
	number = number.toString()
	number = number.replace(/(\++)?(\s+)?(\-+)?(\@+)?(\.+)?([a-zA-Z]+)?/g, '')
	number = number.startsWith('08') ? '628' + number.slice(2) : number
	number = number + '@s.whatsapp.net'
	return number
}

const toNumber = (jid) => jid.split('@')[0].split(':')[0]

exports.download = download
exports.toJID = toJID
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