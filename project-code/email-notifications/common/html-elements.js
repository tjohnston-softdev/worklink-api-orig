function writeVerificationURLElement(eVerificationRoot, eVerificationID)
{
	var fullURL = eVerificationRoot + eVerificationID;
	var verificationElement = writeURLElement(fullURL, "_blank", "here");
	return verificationElement;
}

function writeURLElement(eTargetLink, eTargetMode, eHeaderLabel)
{
	var elementText = "";
	
	elementText += "<a href=";
	elementText += '"';
	elementText += eTargetLink;
	elementText += '" target="';
	elementText += eTargetMode;
	elementText += '">';
	elementText += eHeaderLabel;
	elementText += "</a>";
	
	return elementText;
}

function writeBracketFieldText(eFieldLabel, eFieldContents)
{
	var elementText = "";
	
	elementText += "(";
	elementText += eFieldLabel;
	elementText += ": ";
	elementText += eFieldContents;
	elementText += ")";
	
	return elementText;
}

function writeLineFieldText(eFieldLabel, eFieldContents)
{
	var elementText = "";
	
	elementText += "<br>";
	elementText += eFieldLabel;
	elementText += ": ";
	elementText += eFieldContents;
	elementText += "<br>";
	
}


module.exports =
{
	writeVerificationURL: writeVerificationURLElement,
	writeURL: writeURLElement,
	writeBracketField: writeBracketFieldText,
	writeLineField: writeLineFieldText
};