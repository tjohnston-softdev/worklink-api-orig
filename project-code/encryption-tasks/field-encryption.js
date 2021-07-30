const cryptoModule = require("crypto");
const encryptionMethod = "aes-128-cbc";
const encryptionKey = "KEY GOES HERE";

function encryptStringValue(originalString)
{
	var fieldCipher = cryptoModule.createCipher(encryptionMethod, encryptionKey);
	var encryptedText = fieldCipher.update(originalString, 'utf8', 'hex');
	encryptedText += fieldCipher.final('hex');
	
	return encryptedText;
}

function decryptStringValue(encryptedText)
{
	var fieldDecipher = cryptoModule.createDecipher(encryptionMethod, encryptionKey);
	var decryptedText = fieldDecipher.update(encryptedText, 'hex', 'utf8');
	decryptedText += fieldDecipher.final('utf8');
	
	return decryptedText;
}


module.exports =
{
	encryptString: encryptStringValue,
	decryptString: decryptStringValue
};