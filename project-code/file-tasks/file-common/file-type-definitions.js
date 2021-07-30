const fileType = require("file-type");

const imageMimeTypeStrings = defineImageTypes();
const documentMimeTypeStrings = defineDocumentTypes();
const driverMimeTypeStrings = defineDriverTypes();
const allMimeTypeStrings = defineAllTypes();


function defineImageTypes()
{
	var imgTypes = [];
	
	imgTypes.push("image/jpeg");
	imgTypes.push("image/png");
	imgTypes.push("image/webp");
	imgTypes.push("image/bmp");
	imgTypes.push("image/tiff");
	imgTypes.push("image/x-icon");
	
	return imgTypes;
}


function defineDocumentTypes()
{
	var docTypes = [];
	
	docTypes.push("application/pdf");
	docTypes.push("application/vnd.oasis.opendocument.text");
	docTypes.push("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
	docTypes.push("application/rtf");
	
	return docTypes;
}


function defineDriverTypes()
{
	var driverTypes = imageMimeTypeStrings.concat(documentMimeTypeStrings);
	return driverTypes;
}


function defineAllTypes()
{
	var allTypes = fileType.mimeTypes;
	return allTypes;
}



module.exports =
{
	imageTypes: imageMimeTypeStrings,
	documentTypes: documentMimeTypeStrings,
	driverTypes: driverMimeTypeStrings,
	allTypes: allMimeTypeStrings
};