const aws = require('aws-sdk');

const s3 = new aws.S3();


exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    //const bucket = "dev-geocore-transform-input-1";
    const bucket = event.Records[0].s3.bucket.name;
    
    //const key = "7add724f-8c71-44c3-bcad-0f5df7abc2ea.json";
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    const params = {
        Bucket: bucket,
        Key: key,
    };

    const obj = await s3.getObject(params).promise();

    const data = JSON.parse(obj.Body);
    
    //Sub Fields are structured with Bracket Notation // eg. data["@xmlns:gco"];
    // "id" = data["gmd:fileIdentifier"]["gco:CharacterString"]["#text"];

// const group: These const are used for iterating over arrays and can be seen in the use of .forEach.
    let coord
    try {
      coord = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:extent"];
    } catch (error) {
      coord = null;
    }
    
    let date
    try {
      date = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:citation"]["gmd:CI_Citation"]["gmd:date"];
    } catch (error) {
      date = null;
    }
    
    let distributor
    try {
      distributor = data["gmd:distributionInfo"]["gmd:MD_Distribution"]["gmd:distributor"]["gmd:MD_Distributor"]["gmd:distributorContact"]["gmd:CI_ResponsibleParty"];
    } catch (error) {
      distributor = null;
    }
    
    const keyword = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:descriptiveKeywords"];

    let options
    try {
      options = data["gmd:distributionInfo"]["gmd:MD_Distribution"]["gmd:transferOptions"];
    } catch (error) {
      options = null;
    }

    let graphicOverview
    try {
      graphicOverview = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:graphicOverview"];
    } catch (error) {
      graphicOverview = null;
    }

    let contact
    try {
      contact = data["gmd:contact"];
    } catch (error) {
      contact = null;
    }

    let credits
    try {
      credits = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:credit"];
    } catch (error) {
      credits = null;
    }
    
    let citedResponsibleParty
    try {
      citedResponsibleParty = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:citation"]["gmd:CI_Citation"]["gmd:citedResponsibleParty"]["gmd:CI_ResponsibleParty"];
    } catch (error) {
      citedResponsibleParty = null;
    }
    
//Variables are in the order that they appear in the geoCore format, although the order does not matter.

var west;
var east;
var north;
var south;

if (coord.constructor === Array) {
    
    try {
      west = Number(coord[1]["gmd:EX_Extent"]["gmd:geographicElement"]["gmd:EX_GeographicBoundingBox"]["gmd:westBoundLongitude"]["gco:Decimal"]["#text"]);
    } catch (error) {
      west = null;
    }

   
    try {
      south = Number(coord[1]["gmd:EX_Extent"]["gmd:geographicElement"]["gmd:EX_GeographicBoundingBox"]["gmd:southBoundLatitude"]["gco:Decimal"]["#text"]);
    } catch (error) {
      south = null;
    }

    
    try {
      east = Number(coord[1]["gmd:EX_Extent"]["gmd:geographicElement"]["gmd:EX_GeographicBoundingBox"]["gmd:eastBoundLongitude"]["gco:Decimal"]["#text"]);
    } catch (error) {
      east = null;
    }

   
    try {
      north = Number(coord[1]["gmd:EX_Extent"]["gmd:geographicElement"]["gmd:EX_GeographicBoundingBox"]["gmd:northBoundLatitude"]["gco:Decimal"]["#text"]);
    } catch (error) {
      north = null;
    }

} else {
    
    
    try {
      west = Number(coord["gmd:EX_Extent"]["gmd:geographicElement"]["gmd:EX_GeographicBoundingBox"]["gmd:westBoundLongitude"]["gco:Decimal"]["#text"]);
    } catch (error) {
      west = null;
    }

   
    try {
      south = Number(coord["gmd:EX_Extent"]["gmd:geographicElement"]["gmd:EX_GeographicBoundingBox"]["gmd:southBoundLatitude"]["gco:Decimal"]["#text"]);
    } catch (error) {
      south = null;
    }

    
    try {
      east = Number(coord["gmd:EX_Extent"]["gmd:geographicElement"]["gmd:EX_GeographicBoundingBox"]["gmd:eastBoundLongitude"]["gco:Decimal"]["#text"]);
    } catch (error) {
      east = null;
    }

    
    try {
      north = Number(coord["gmd:EX_Extent"]["gmd:geographicElement"]["gmd:EX_GeographicBoundingBox"]["gmd:northBoundLatitude"]["gco:Decimal"]["#text"]);
    } catch (error) {
      north = null;
    }
    
}

    let id
    try {
      id = data["gmd:fileIdentifier"]["gco:CharacterString"]["#text"];
    } catch (error) {
      id = null;
    }

    let title_en
    try {
      title_en = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:citation"]["gmd:CI_Citation"]["gmd:title"]["gco:CharacterString"]["#text"];
    } catch (error) {
      title_en = null;
    }

    let title_fr
    try {
      title_fr = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:citation"]["gmd:CI_Citation"]["gmd:title"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
    } catch (error) {
      title_fr = null;
    }

    let description_en
    try {
      description_en = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:abstract"]["gco:CharacterString"]["#text"];
    } catch (error) {
      description_en = null;
    }

    let description_fr
    try {
      description_fr = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:abstract"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
    } catch (error) {
      description_fr = null;
    }

var keyword_Arr;    
var keyword_Array = [];
var keyword_Parsed;

if (keyword.constructor === Array) {

keyword.forEach(function (keywords, index) {
  
  var keywordArray = keyword[index]["gmd:MD_Keywords"]["gmd:keyword"];

          if (keywordArray.constructor === Array) {
          
          keywordArray.forEach(function (keywordsArray, index) {
          
          let keyword_en
          try {
            keyword_en = keywordArray[index]["gco:CharacterString"]["#text"];
          } catch (error) {
            keyword_en = null;
          }
          
          let keyword_fr
          try {
            keyword_fr = keywordArray[index]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
          } catch (error) {
            keyword_fr = null;
          }
          
          let keyword_en_item
          if (keyword_en) {
          keyword_en_item = '"en": "' + keyword_en + '"';
          } else {
            keyword_en_item = '"en": ' + keyword_en;
          }
          
          let keyword_fr_item
          if (keyword_fr) {
          keyword_fr_item = '"fr": "' + keyword_fr + '"';
          } else {
            keyword_fr_item = '"fr": ' + keyword_fr;
          }
          
          keyword_Arr = "{" + keyword_en_item + ", " + keyword_fr_item + "}";
          keyword_Parsed = JSON.parse(keyword_Arr);
          keyword_Array.push(keyword_Parsed);
          
          });
          
          } else {
          
          let keyword_en
          try {
            keyword_en = keywordArray["gco:CharacterString"]["#text"];
          } catch (error) {
            keyword_en = null;
          }
          
          let keyword_fr
          try {
            keyword_fr = keywordArray["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
          } catch (error) {
            keyword_fr = null;
          }
          
          let keyword_en_item
          if (keyword_en) {
          keyword_en_item = '"en": "' + keyword_en + '"';
          } else {
            keyword_en_item = '"en": ' + keyword_en;
          }
          
          let keyword_fr_item
          if (keyword_fr) {
          keyword_fr_item = '"fr": "' + keyword_fr + '"';
          } else {
            keyword_fr_item = '"fr": ' + keyword_fr;
          }
          
          keyword_Arr = "{" + keyword_en_item + ", " + keyword_fr_item + "}";
          keyword_Parsed = JSON.parse(keyword_Arr);
          keyword_Array.push(keyword_Parsed);
          }
});

} else {

  var keywordArray = keyword["gmd:MD_Keywords"]["gmd:keyword"];

  let keyword_en
          try {
            keyword_en = keywordArray["gco:CharacterString"]["#text"];
          } catch (error) {
            keyword_en = null;
          }
          
          let keyword_fr
          try {
            keyword_fr = keywordArray["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
          } catch (error) {
            keyword_fr = null;
          }
          
          let keyword_en_item
          if (keyword_en) {
          keyword_en_item = '"en": "' + keyword_en + '"';
          } else {
            keyword_en_item = '"en": ' + keyword_en;
          }
          
          let keyword_fr_item
          if (keyword_fr) {
          keyword_fr_item = '"fr": "' + keyword_fr + '"';
          } else {
            keyword_fr_item = '"fr": ' + keyword_fr;
          }
          
          keyword_Arr = "{" + keyword_en_item + ", " + keyword_fr_item + "}";
          keyword_Parsed = JSON.parse(keyword_Arr);
          keyword_Array = keyword_Parsed;
}


    let topicCategory
    try {
      topicCategory = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:topicCategory"]["gmd:MD_TopicCategoryCode"];
    } catch (error) {
      topicCategory = null;
    }
    
    var date_text_publication;
    var date_publication;
    var date_text_creation;
    var date_creation;
    var date_text;

 if (date) {
   
   if (date.constructor === Array) {
 
    date.forEach(function (dates, index) {
    
    var CI_Date = date[index]["gmd:CI_Date"];

      try {
        date_text = CI_Date["gmd:dateType"]["gmd:CI_DateTypeCode"]["#text"];
          if (date_text.includes('publication')) {
            date_text_publication = date_text;
            date_publication = CI_Date["gmd:date"]["gco:Date"]["#text"];
          } else {
            date_text_creation = date_text;
            date_creation = CI_Date["gmd:date"]["gco:Date"]["#text"];
          }
      } catch (error) {
        date_text = null;
          if (date_text === null) {
            date_text_publication = date_text;
            date_publication = null;
          } else {
            date_text_creation = date_text;
            date_creation = null;
          }
        }

    });
  
   } else {
     
         var CI_Date = date["gmd:CI_Date"];

      try {
        date_text = CI_Date["gmd:dateType"]["gmd:CI_DateTypeCode"]["#text"];
          if (date_text.includes('publication')) {
            date_text_publication = date_text;
            date_publication = CI_Date["gmd:date"]["gco:Date"]["#text"];
          } else {
            date_text_creation = date_text;
            date_creation = CI_Date["gmd:date"]["gco:Date"]["#text"];
          }
      } catch (error) {
        date_text = null;
          if (date_text === null) {
            date_text_publication = date_text;
            date_publication = null;
          } else {
            date_text_creation = date_text;
            date_creation = null;
          }
        }
        
   }
    
}

    
    let spatialRepresentation
    try {
      spatialRepresentation = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:spatialRepresentationType"]["gmd:MD_SpatialRepresentationTypeCode"]["#text"];
    } catch (error) {
      spatialRepresentation = null;
    }

    let type
    try {
      type = data["gmd:hierarchyLevel"]["gmd:MD_ScopeCode"]["#text"];
    } catch (error) {
      type = null;
    }

    let temporalExtent_begin
    try {
      temporalExtent_begin = coord[0]["gmd:EX_Extent"]["gmd:temporalElement"]["gmd:EX_TemporalExtent"]["gmd:extent"]["gml:TimePeriod"]["gml:beginPosition"];
    } catch (error) {
      temporalExtent_begin = null;
    }

    let temporalExtent_end
    try {
      temporalExtent_end = coord[0]["gmd:EX_Extent"]["gmd:temporalElement"]["gmd:EX_TemporalExtent"]["gmd:extent"]["gml:TimePeriod"]["gml:endPosition"];
    } catch (error) {
      temporalExtent_end = null;
    }

    let refSys
    try {
      refSys = data["gmd:referenceSystemInfo"]["gmd:MD_ReferenceSystem"]["gmd:referenceSystemIdentifier"]["gmd:RS_Identifier"]["gmd:code"]["gco:CharacterString"]["#text"];
    } catch (error) {
      refSys = null;
    }

    let refSys_version
    try {
      refSys_version = data["gmd:referenceSystemInfo"]["gmd:MD_ReferenceSystem"]["gmd:referenceSystemIdentifier"]["gmd:RS_Identifier"]["gmd:version"]["gco:CharacterString"]["#text"];
    } catch (error) {
      refSys_version = null;
    }

    let status
    try {
      status = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:status"]["gmd:MD_ProgressCode"]["#text"];
    } catch (error) {
      status = null;
    }

    let maintenance
    try {
      maintenance = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:resourceMaintenance"]["gmd:MD_MaintenanceInformation"]["gmd:maintenanceAndUpdateFrequency"]["gmd:MD_MaintenanceFrequencyCode"]["#text"];
    } catch (error) {
      maintenance = null;
    }

    let metadataStandard_en
    try {
      metadataStandard_en = data["gmd:metadataStandardName"]["gco:CharacterString"]["#text"];
    } catch (error) {
      metadataStandard_en = null;
    }

    let metadataStandard_fr
    try {
      metadataStandard_fr = data["gmd:metadataStandardName"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
    } catch (error) {
      metadataStandard_fr = null;
    }

    let metadataStandardVersion
    try {
      metadataStandardVersion = data["gmd:metadataStandardVersion"]["gco:CharacterString"]["#text"];
    } catch (error) {
      metadataStandardVersion = null;
    }
    
    var graphicOverviews;
    var goArray = [];
    var goParsed;
  
  if (graphicOverview) {
    
  if (graphicOverview.constructor === Array) {
  
    graphicOverview.forEach(function (graphics, index) {

        let overviewFileName
        try {
          overviewFileName = graphicOverview[index]["gmd:MD_BrowseGraphic"]["gmd:fileName"]["gco:CharacterString"]["#text"];
        } catch (error) {
          overviewFileName = null;
        }
        
        let overviewFileDescription
        try {
          overviewFileDescription = graphicOverview[index]["gmd:MD_BrowseGraphic"]["gmd:fileDescription"]["gco:CharacterString"]["#text"];
        } catch (error) {
          overviewFileDescription = null;
        }
        
        let overviewFileType
        try {
          overviewFileType = graphicOverview[index]["gmd:MD_BrowseGraphic"]["gmd:fileType"]["gco:CharacterString"]["#text"];
        } catch (error) {
          overviewFileType = null;
        }
        
        let FileName
        if (overviewFileName) {
        FileName = '"overviewFileName": "' + overviewFileName + '"';
        } else {
          FileName = '"overviewFileName": ' + overviewFileName;
        }
        
        let FileDescription
        if (overviewFileDescription) {
        FileDescription = '"overviewFileDescription": "' + overviewFileDescription + '"';
        } else {
          FileDescription = '"overviewFileDescription": ' + overviewFileDescription;
        }
        
        let FileType
        if (overviewFileType) {
        FileType = '"overviewFileType": "' + overviewFileType + '"';
        } else {
          FileType = '"overviewFileTupe": ' + overviewFileType;
        }
        
        graphicOverviews = "{" + FileName + ", " + FileDescription + ", " + FileType + "}";
        goParsed = JSON.parse(graphicOverviews);
        goArray.push(goParsed);
    });

} else {
        
        let overviewFileName
        try {
          overviewFileName = graphicOverview["gmd:MD_BrowseGraphic"]["gmd:fileName"]["gco:CharacterString"]["#text"];
        } catch (error) {
          overviewFileName = null;
        }
        
        let overviewFileDescription
        try {
          overviewFileDescription = graphicOverview["gmd:MD_BrowseGraphic"]["gmd:fileDescription"]["gco:CharacterString"]["#text"];
        } catch (error) {
          overviewFileDescription = null;
        }
        
        let overviewFileType
        try {
          overviewFileType = graphicOverview["gmd:MD_BrowseGraphic"]["gmd:fileType"]["gco:CharacterString"]["#text"];
        } catch (error) {
          overviewFileType = null;
        }
        
        let FileName
        if (overviewFileName) {
        FileName = '"overviewFileName": "' + overviewFileName + '"';
        } else {
          FileName = '"overviewFileName": ' + overviewFileName;
        }
        
        let FileDescription
        if (overviewFileDescription) {
        FileDescription = '"overviewFileDescription": "' + overviewFileDescription + '"';
        } else {
          FileDescription = '"overviewFileDescription": ' + overviewFileDescription;
        }
        
        let FileType
        if (overviewFileType) {
        FileType = '"overviewFileType": "' + overviewFileType + '"';
        } else {
          FileType = '"overviewFileTupe": ' + overviewFileType;
        }
        
        graphicOverviews = "{" + FileName + "," + FileDescription + "," + FileType + "}";
        goParsed = JSON.parse(graphicOverviews);
        goArray.push(goParsed);
}}

        let distributionFormat_name
        try {
          distributionFormat_name = data["gmd:distributionInfo"]["gmd:MD_Distribution"]["gmd:distributionFormat"]["gmd:MD_Format"]["gmd:name"]["gco:CharacterString"]["#text"];
        } catch (error) {
          distributionFormat_name = null;
        }

        let distributionFormat_format
        try {
          distributionFormat_format = data["gmd:distributionInfo"]["gmd:MD_Distribution"]["gmd:distributionFormat"]["gmd:MD_Format"]["gmd:version"]["gco:CharacterString"]["#text"];
        } catch (error) {
          distributionFormat_format = null;
        }

        let useLimits_en
        try {
          useLimits_en = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:resourceConstraints"]["gmd:MD_LegalConstraints"]["gmd:useLimitation"]["gco:CharacterString"]["#text"];
        } catch (error) {
          useLimits_en = null;
        }

        let useLimits_fr
        try {
          useLimits_fr = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:resourceConstraints"]["gmd:MD_LegalConstraints"]["gmd:useLimitation"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        } catch (error) {
          useLimits_fr = null;
        }

        let accessConstraints
        try {
          accessConstraints = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:resourceConstraints"]["gmd:MD_LegalConstraints"]["gmd:accessConstraints"]["gmd:MD_RestrictionCode"]["#text"];
        } catch (error) {
          accessConstraints = null;
        }

        let useConstraints
        try {
          useConstraints = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:resourceConstraints"]["gmd:MD_LegalConstraints"]["gmd:useConstraints"]["gmd:MD_RestrictionCode"]["#text"];
        } catch (error) {
          useConstraints = null;
        }

        let otherConstraints_en
        try {
          otherConstraints_en = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:resourceConstraints"]["gmd:MD_LegalConstraints"]["gmd:otherConstraints"]["gco:CharacterString"]["#text"];
        } catch (error) {
          otherConstraints_en = null;
        }

        let otherConstraints_fr
        try {
          otherConstraints_fr = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:resourceConstraints"]["gmd:MD_LegalConstraints"]["gmd:otherConstraints"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        } catch (error) {
          otherConstraints_fr = null;
        }
        
        let dateStamp
        try {
          dateStamp = data["gmd:dateStamp"]["gco:DateTime"]["#text"];
        } catch (error) {
          dateStamp = null;
        }

        let dataSetURI
          try {
            dataSetURI = data["gco:CharacterString"]["#text"];
          } catch (error) {
            dataSetURI = null;
        }

        let locale_language
        try {
          locale_language = data["gmd:locale"]["gmd:PT_Locale"]["gmd:languageCode"]["gmd:LanguageCode"]["#text"];
        } catch (error) {
          locale_language = null;
        }

        let locale_country
        try {
          locale_country = data["gmd:locale"]["gmd:PT_Locale"]["gmd:country"]["gmd:Country"]["#text"];
        } catch (error) {
          locale_country = null;
        }

        let locale_encoding
        try {
          locale_encoding = data["gmd:locale"]["gmd:PT_Locale"]["gmd:characterEncoding"]["gmd:MD_CharacterSetCode"]["#text"];
        } catch (error) {
          locale_encoding = null;
        }

        let language
        try {
          language = data["gmd:language"]["gco:CharacterString"]["#text"];
        } catch (error) {
          language = null;
        }

        let characterSet
        try {
          characterSet = data["gmd:characterSet"]["gmd:MD_CharacterSetCode"]["#text"];
        } catch (error) {
          characterSet = null;
        }

        let environmentDescription
        try {
          environmentDescription = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:environmentDescription"]["gco:CharacterString"]["#text"];
        } catch (error) {
          environmentDescription = null;
        }

        let supplementalInformation_en
        try {
          supplementalInformation_en = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:supplementalInformation"]["gco:CharacterString"]["#text"];
        } catch (error) {
          supplementalInformation_en = null;
        }

        let supplementalInformation_fr
        try {
          supplementalInformation_fr = data["gmd:identificationInfo"]["gmd:MD_DataIdentification"]["gmd:supplementalInformation"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        } catch (error) {
          supplementalInformation_fr = null;
        }

var contacts_Arr;
var contacts_Parsed;
var contacts_Array = [];

if (contact) {

if (contact.constructor === Array) {

contact.forEach(function (contacts, index) {

      var ResponsibleParty = contact[index]["gmd:CI_ResponsibleParty"];

      let individual
      try {
        individual = ResponsibleParty["gmd:individualName"]["gco:CharacterString"]["#text"];
      } catch (error) {
        individual = null;
      }

      let position_en
      try {
        position_en = ResponsibleParty["gmd:positionName"]["gco:CharacterString"]["#text"];
        if (position_en == null) {
          position_en = null;
        }
      } catch (error) {
        position_en = null;
      }

      let position_fr
      try {
        position_fr = ResponsibleParty["gmd:positionName"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (position_fr == null) {
          position_fr = null;
        }
      } catch (error) {
        position_fr = null;
      }

      let organisation_en
      try {
        organisation_en = ResponsibleParty["gmd:organisationName"]["gco:CharacterString"]["#text"];
        if (organisation_en == null ) {
          organisation_en = null;
        }
      } catch (error) {
        organisation_en = null;
      }

      let organisation_fr
      try {
        organisation_fr = ResponsibleParty["gmd:organisationName"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (organisation_fr == null ) {
          organisation_fr = null;
        }
      } catch (error) {
        organisation_fr = null;
      }

      let telephone_en
      try {
        telephone_en = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:voice"]["gco:CharacterString"]["#text"];
        if (telephone_en == null) {
          telephone_en = null;
        }
      } catch (error) {
        telephone_en = null;
      }

      let telephone_fr
      try {
        telephone_fr = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:voice"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (telephone_fr == null) {
          telephone_fr = null;
        }
      } catch (error) {
        telephone_fr = null;
      }

      let fax
      try {
        fax = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:facsimile"]["gco:CharacterString"]["#text"];
      } catch (error) {
        fax = null;
      }

      let address_en
      try {
        address_en = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:deliveryPoint"]["gco:CharacterString"]["#text"];
        if (address_en == null) {
          address_en = null;
        }
      } catch (error) {
        address_en = null;
      }

      let address_fr
      try {
        address_fr = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:deliveryPoint"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (address_fr == null ) {
          address_fr = null;
        }
      } catch (error) {
        address_fr = null;
      }

      let city
      try {
        city = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:city"]["gco:CharacterString"]["#text"];
      } catch (error) {
        city = null;
      }

      let pt_en
      try {
        pt_en = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:administrativeArea"]["gco:CharacterString"]["#text"];
        if (pt_en == null) {
          pt_en = null;
        }
      } catch (error) {
        pt_en = null;
      }
      
      let pt_fr
      try {
        pt_fr = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:administrativeArea"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (pt_fr == null) {
          pt_fr = null;
        }
      } catch (error) {
        pt_fr = null;
      }
      
      let postalCode
      try {
        postalCode = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:postalCode"]["gco:CharacterString"]["#text"];
      } catch (error) {
        postalCode = null;
      }

      let country_en
      try {
        country_en = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:country"]["gco:CharacterString"]["#text"];
        if (country_en == null) {
          country_en = null;
        }
      } catch (error) {
        country_en = null;
      }

      let country_fr
      try {
        country_fr = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:country"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (country_fr == null) {
          country_fr = null;
        }
      } catch (error) {
        country_fr = null;
      }

      let email_en
      try {
        email_en = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:electronicMailAddress"]["gco:CharacterString"]["#text"];
        if (email_en == null) {
          email_en = null;
        }
      } catch (error) {
        email_en = null;
      }

      let email_fr
      try {
        email_fr = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:electronicMailAddress"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (email_fr == null) {
          email_fr = null;
        }
      } catch (error) {
        email_fr = null;
      }

      let onlineResource
      try {
        onlineResource = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:linkage"]["gmd:URL"];
        if (onlineResource == null) {
          onlineResource = null;
        }
      } catch (error) {
        onlineResource = null;
      }

      let onlineResource_Protocol
      try {
        onlineResource_Protocol = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:protocol"]["gco:CharacterString"]["#text"];
        if (onlineResource_Protocol == null) {
          onlineResource_Protocol = null;
        }
      } catch (error) {
        onlineResource_Protocol = null;
      }

      let onlineResource_Name
      try {
        onlineResource_Name = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:name"]["gco:CharacterString"]["#text"];
        if (onlineResource_Name == null) {
          onlineResource_Name = null;
        }
      } catch (error) {
        onlineResource_Name = null;
      }

      let onlineResource_Description
      try {
        onlineResource_Description = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:description"]["gco:CharacterString"]["#text"];
        if (onlineResource_Description == null) {
          onlineResource_Description = null;
        }
      } catch (error) {
        onlineResource_Description = null;
      }

      let hoursOfService
      try {
        hoursOfService = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:hoursOfService"]["gco:CharacterString"]["#text"];
      } catch (error) {
        hoursOfService = null;
      }

      let role
      try {
        role = ResponsibleParty["gmd:role"]["gmd:CI_RoleCode"]["#text"];
      } catch (error) {
        role = null;
      }
      
      let a_individual
      if (individual) {
      a_individual = '"individual": "' + individual + '"';
      } else {
        a_individual = '"individual": ' + individual;
      }
        
      let a_position
      let pos_en
      if (position_en) {
        pos_en = '"en": "' + position_en + '"';
      } else {
        pos_en = '"en": ' + position_en;
       }
       
      let pos_fr
      if (position_fr) {
        pos_fr = '"fr": "' + position_fr + '"';
      } else {
        pos_fr = '"fr": ' + position_fr;
      }
      
      a_position = '"position": {' + pos_en + ',' + pos_fr + '}';
        
      let a_organisation
      let org_en
      if (organisation_en) {
        org_en = '"en": "' + organisation_en + '"';
      } else {
        org_en = '"en": ' + organisation_en;
      }
      
      let org_fr
      if (organisation_fr) {
        org_fr = '"fr": "' + organisation_fr + '"';
      } else {
        org_fr = '"fr": ' + organisation_fr;
      }
      
      a_organisation = '"organisation": {' + org_en + ',' + org_fr + '}';
      
      let a_telephone
      
      let tel_en
      if (telephone_en) {
        tel_en = '"en": "' + telephone_en + '"';
      } else {
        tel_en = '"en": ' + telephone_en;
      }
      
      let tel_fr
      if (telephone_fr) {
        tel_fr = '"fr": "' + telephone_fr + '"';
      } else {
        tel_fr = '"fr": ' + telephone_fr;
      }
      
      a_telephone = '"telephone": {' + tel_en + ',' + tel_fr + '}';
      
      let a_fax
      if (fax) {
        a_fax = '"fax": "' + fax + '"';
      } else {
        a_fax = '"fax": ' + fax;
      }
      
      let a_address
      let add_en
      if (address_en) {
        add_en = '"en": "' + address_en + '"';
      } else {
        add_en = '"en": ' + address_en;
      }
      
      let add_fr
      if (address_fr) {
        add_fr = '"fr": "' + address_fr + '"';
      } else {
        add_fr = '"fr": ' + address_fr;
      }
      
      a_address = '"address": {' + add_en + ',' + add_fr + '}';
      
      let a_city
      if (city) {
        a_city = '"city": "' + city + '"';
      } else {
        a_city = '"city": ' + city;
      }
      
      let a_pt
      let a_pt_en
      if (pt_en) {
        a_pt_en = '"en": "' + pt_en + '"';
      } else {
        a_pt_en = '"en": ' + pt_en;
      }
      
      let a_pt_fr
      if (pt_fr) {
        a_pt_fr = '"fr": "' + pt_fr + '"';
      } else {
        a_pt_fr = '"fr": ' + pt_fr;
      }
      
      a_pt = '"pt": {' + a_pt_en + ',' + a_pt_fr + '}';
      
      let a_postalCode
      if (postalCode) {
      a_postalCode = '"postalcode": "' + postalCode + '"';
      } else {
        a_postalCode = '"postalcode": ' + postalCode;
      }
      
      let a_country
      let co_en
      if (country_en) {
        co_en = '"en": "' + country_en + '"';
      } else {
        co_en = '"en": ' + country_en;
      }
      
      let co_fr
      if (country_fr) {
        co_fr = '"fr": "' + country_fr + '"';
      } else {
        co_fr = '"fr": ' + country_fr;
      }
      
      a_country = '"country": {' + co_en + ',' + co_fr + '}';
      
      let a_email
      let em_en
      if (email_en) {
        em_en = '"en": "' + email_en + '"';
      } else {
        em_en = '"en": ' + email_en;
      }
      
      let em_fr
      if (email_fr) {
        em_fr = '"fr": "' + email_fr + '"';
      } else {
        em_fr = '"fr": ' + email_fr;
      }
      
      a_email = '"email": {' + em_en + ',' + em_fr + '}';
      
      let a_onlineResource
      let or
      if (onlineResource) {
        or = '"onlineResource": "' + onlineResource + '"';
      } else {
        or = '"onlineResource": ' + onlineResource;
      }
      
      let orn
      if (onlineResource_Name) {
        orn = '"onlineResource_Name": "' + onlineResource_Name + '"';
      } else {
        orn = '"onlineResource_Name": ' + onlineResource_Name;
      }
      
      let orp
      if (onlineResource_Protocol) {
        orp = '"onlineResource_Protocol": "' + onlineResource_Protocol + '"';
      } else {
        orp = '"onlineResource_Protocol": ' + onlineResource_Protocol;
      }
      
      let ord
      if (onlineResource_Description) {
        ord = '"onlineResource_Description": "' + onlineResource_Description + '"';
      } else {
        ord = '"onlineResource_Description": ' + onlineResource_Description;
      }
      
      a_onlineResource = '"onlineResource": {' + or + ',' + orn + ',' + orp + ',' + ord + '}';
      
      let a_hoursOfService
      if (hoursOfService) {
        a_hoursOfService = '"hoursOfService": "' + hoursOfService + '"';
      } else {
        a_hoursOfService = '"hoursOfService": ' + hoursOfService;
      }
      
      let a_role
      if (role) {
      a_role = '"role": "' + role + '"';
      } else {
        a_role = '"role": ' + role;
      }
      
      
      contacts_Arr = "{" + a_individual + "," + a_position + "," + a_organisation + "," + a_telephone + "," + a_fax + "," + a_address + "," + a_city + "," + a_pt + "," + a_postalCode + "," + a_country + "," + a_email + "," + a_onlineResource + "," + a_hoursOfService + "," + a_role + "}";
      contacts_Parsed = JSON.parse(contacts_Arr);
      contacts_Array.push(contacts_Parsed);

});

} else {
      
      var ResponsibleParty = contact["gmd:CI_ResponsibleParty"];

      let individual
      try {
        individual = ResponsibleParty["gmd:individualName"]["gco:CharacterString"]["#text"];
      } catch (error) {
        individual = null;
      }

      let position_en
      try {
        position_en = ResponsibleParty["gmd:positionName"]["gco:CharacterString"]["#text"];
        if (position_en == null) {
          position_en = null;
        }
      } catch (error) {
        position_en = null;
      }

      let position_fr
      try {
        position_fr = ResponsibleParty["gmd:positionName"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (position_fr == null) {
          position_fr = null;
        }
      } catch (error) {
        position_fr = null;
      }

      let organisation_en
      try {
        organisation_en = ResponsibleParty["gmd:organisationName"]["gco:CharacterString"]["#text"];
        if (organisation_en == null) {
          organisation_en = null;
        }
      } catch (error) {
        organisation_en = null;
      }

      let organisation_fr
      try {
        organisation_fr = ResponsibleParty["gmd:organisationName"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (organisation_fr == null) {
          organisation_fr = null;
        }
      } catch (error) {
        organisation_fr = null;
      }

      let telephone_en
      try {
        telephone_en = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:voice"]["gco:CharacterString"]["#text"];
        if (telephone_en == null) {
          telephone_en = null;
        }
      } catch (error) {
        telephone_en = null;
      }

      let telephone_fr
      try {
        telephone_fr = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:voice"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (telephone_fr == null) {
          telephone_fr = null;
        }
        if (telephone_fr == null) {
          telephone_fr = null;
        }
      } catch (error) {
        telephone_fr = null;
      }

      let fax
      try {
        fax = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:facsimile"]["gco:CharacterString"]["#text"];
        if (fax == null) {
          fax = null;
        }
      } catch (error) {
        fax = null;
      }

      let address_en
      try {
        address_en = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:deliveryPoint"]["gco:CharacterString"]["#text"];
        if (address_en == null) {
          address_en = null;
        }
        if (address_en == null ) {
          address_en = null;
        }
      } catch (error) {
        address_en = null;
      }

      let address_fr
      try {
        address_fr = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:deliveryPoint"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (address_fr == null) {
          address_fr = null;
        }
        if (address_fr == null) {
          address_fr = null;
        }
      } catch (error) {
        address_fr = null;
      }

      let city
      try {
        city = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:city"]["gco:CharacterString"]["#text"];
        if (city == null) {
          city = null;
        }
      } catch (error) {
        city = null;
      }

      let pt_en
      try {
        pt_en = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:administrativeArea"]["gco:CharacterString"]["#text"];
        if (pt_en == null) {
          pt_en = null;
        }
        if (pt_en == null) {
          pt_en = null;
        }
      } catch (error) {
        pt_en = null;
      }

      let pt_fr
      try {
        pt_fr = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:administrativeArea"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (pt_fr == null) {
          pt_fr = null;
        }
        if (pt_fr == null) {
          pt_fr = null;
        }
        
      } catch (error) {
        pt_fr = null;
      }

      let postalCode
      try {
        postalCode = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:postalCode"]["gco:CharacterString"]["#text"];
        if (postalCode == null ) {
          postalCode = null;
        }
      } catch (error) {
        postalCode = null;
      }

      let country_en
      try {
        country_en = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:country"]["gco:CharacterString"]["#text"];
        if (country_en == null) {
          country_en = null;
        }
        if (country_en == null) {
          country_en = null;
        }
      } catch (error) {
        country_en = null;
      }

      let country_fr
      try {
        country_fr = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:country"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (country_fr == null) {
          country_fr = null;
        }
        if (country_fr == null) {
          country_fr = null;
        }
        
      } catch (error) {
        country_fr = null;
      }

      let email_en
      try {
        email_en = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:electronicMailAddress"]["gco:CharacterString"]["#text"];
        if (email_en == null){
          email_en = null;
        }
        if (email_en == null) {
          email_en = null;
        }
        
      } catch (error) {
        email_en = null;
      }

      let email_fr
      try {
        email_fr = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:electronicMailAddress"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (email_fr == null){
          email_fr = null;
        }
        if (email_fr == null) {
          email_fr = null;
        }
        
      } catch (error) {
        email_fr = null;
      }

      let onlineResource
      try {
        onlineResource = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:linkage"]["gmd:URL"];
        if (onlineResource == null){
          onlineResource = null;
        }
      } catch (error) {
        onlineResource = null;
      }

      let onlineResource_Protocol
      try {
        onlineResource_Protocol = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:protocol"]["gco:CharacterString"]["#text"];
        if (onlineResource_Protocol == null) {
          onlineResource_Protocol = null;
        }
      } catch (error) {
        onlineResource_Protocol = null;
      }

      let onlineResource_Name
      try {
        onlineResource_Name = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:name"]["gco:CharacterString"]["#text"];
        if (onlineResource_Name == null) {
          onlineResource_Name = null;
        }
      } catch (error) {
        onlineResource_Name = null;
      }

      let onlineResource_Description
      try {
        onlineResource_Description = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:description"]["gco:CharacterString"]["#text"];
        if (onlineResource_Description == null) {
          onlineResource_Description = null;
        }
      } catch (error) {
        onlineResource_Description = null;
      }

      let hoursOfService
      try {
        hoursOfService = ResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:hoursOfService"]["gco:CharacterString"]["#text"];
      } catch (error) {
        hoursOfService = null;
      }

      let role
      try {
        role = ResponsibleParty["gmd:role"]["gmd:CI_RoleCode"]["#text"];
      } catch (error) {
        role = null;
      }
      
      let a_individual
      if (individual) {
      a_individual = '"individual": "' + individual + '"';
      } else {
        a_individual = '"individual": ' + individual;
      }
        
      let a_position
      let pos_en
      if (position_en) {
        pos_en = '"en": "' + position_en + '"';
      } else {
        pos_en = '"en": ' + position_en;
       }
       
      let pos_fr
      if (position_fr) {
        pos_fr = '"fr": "' + position_fr + '"';
      } else {
        pos_fr = '"fr": ' + position_fr;
      }
      
      a_position = '"position": {' + pos_en + ',' + pos_fr + '}';
        
      let a_organisation
      let org_en
      if (organisation_en) {
        org_en = '"en": "' + organisation_en + '"';
      } else {
        org_en = '"en": ' + organisation_en;
      }
      
      let org_fr
      if (organisation_fr) {
        org_fr = '"fr": "' + organisation_fr + '"';
      } else {
        org_fr = '"fr": ' + organisation_fr;
      }
      
      a_organisation = '"organisation": {' + org_en + ',' + org_fr + '}';
      
      let a_telephone
      
      let tel_en
      if (telephone_en) {
        tel_en = '"en": "' + telephone_en + '"';
      } else {
        tel_en = '"en": ' + telephone_en;
      }
      
      let tel_fr
      if (telephone_fr) {
        tel_fr = '"fr": "' + telephone_fr + '"';
      } else {
        tel_fr = '"fr": ' + telephone_fr;
      }
      
      a_telephone = '"telephone": {' + tel_en + ',' + tel_fr + '}';
      
      let a_fax
      if (fax) {
        a_fax = '"fax": "' + fax + '"';
      } else {
        a_fax = '"fax": ' + fax;
      }
      
      let a_address
      let add_en
      if (address_en) {
        add_en = '"en": "' + address_en + '"';
      } else {
        add_en = '"en": ' + address_en;
      }
      
      let add_fr
      if (address_fr) {
        add_fr = '"fr": "' + address_fr + '"';
      } else {
        add_fr = '"fr": ' + address_fr;
      }
      
      a_address = '"address": {' + add_en + ',' + add_fr + '}';
      
      let a_city
      if (city) {
        a_city = '"city": "' + city + '"';
      } else {
        a_city = '"city": ' + city;
      }
      
      let a_pt
      let a_pt_en
      if (pt_en) {
        a_pt_en = '"en": "' + pt_en + '"';
      } else {
        a_pt_en = '"en": ' + pt_en;
      }
      
      let a_pt_fr
      if (pt_fr) {
        a_pt_fr = '"fr": "' + pt_fr + '"';
      } else {
        a_pt_fr = '"fr": ' + pt_fr;
      }
      
      a_pt = '"pt": {' + a_pt_en + ',' + a_pt_fr + '}';
      
      let a_postalCode
      if (postalCode) {
      a_postalCode = '"postalcode": "' + postalCode + '"';
      } else {
        a_postalCode = '"postalcode": ' + postalCode;
      }
      
      let a_country
      let co_en
      if (country_en) {
        co_en = '"en": "' + country_en + '"';
      } else {
        co_en = '"en": ' + country_en;
      }
      
      let co_fr
      if (country_fr) {
        co_fr = '"fr": "' + country_fr + '"';
      } else {
        co_fr = '"fr": ' + country_fr;
      }
      
      a_country = '"country": {' + co_en + ',' + co_fr + '}';
      
      let a_email
      let em_en
      if (email_en) {
        em_en = '"en": "' + email_en + '"';
      } else {
        em_en = '"en": ' + email_en;
      }
      
      let em_fr
      if (email_fr) {
        em_fr = '"fr": "' + email_fr + '"';
      } else {
        em_fr = '"fr": ' + email_fr;
      }
      
      a_email = '"email": {' + em_en + ',' + em_fr + '}';
      
      let a_onlineResource
      let or
      if (onlineResource) {
        or = '"onlineResource": "' + onlineResource + '"';
      } else {
        or = '"onlineResource": ' + onlineResource;
      }
      
      let orn
      if (onlineResource_Name) {
        orn = '"onlineResource_Name": "' + onlineResource_Name + '"';
      } else {
        orn = '"onlineResource_Name": ' + onlineResource_Name;
      }
      
      let orp
      if (onlineResource_Protocol) {
        orp = '"onlineResource_Protocol": "' + onlineResource_Protocol + '"';
      } else {
        orp = '"onlineResource_Protocol": ' + onlineResource_Protocol;
      }
      
      let ord
      if (onlineResource_Description) {
        ord = '"onlineResource_Description": "' + onlineResource_Description + '"';
      } else {
        ord = '"onlineResource_Description": ' + onlineResource_Description;
      }
      
      a_onlineResource = '"onlineResource": {' + or + ',' + orn + ',' + orp + ',' + ord + '}';
      
      let a_hoursOfService
      if (hoursOfService) {
        a_hoursOfService = '"hoursOfService": "' + hoursOfService + '"';
      } else {
        a_hoursOfService = '"hoursOfService": ' + hoursOfService;
      }
      
      let a_role
      if (role) {
      a_role = '"role": "' + role + '"';
      } else {
        a_role = '"role": ' + role;
      }
      
      contacts_Arr = "{" + a_individual + "," + a_position + "," + a_organisation + "," + a_telephone + "," + a_fax + "," + a_address + "," + a_city + "," + a_pt + "," + a_postalCode + "," + a_country + "," + a_email + "," + a_onlineResource + "," + a_hoursOfService + "," + a_role + "}";
      contacts_Parsed = JSON.parse(contacts_Arr);
      contacts_Array.push(contacts_Parsed);

}}

var credits_en_Arr;
var credits_en_Array = [];
var credits_en_Parsed = [];
var credits_fr_Arr;
var credits_fr_Array = [];
var credits_fr_Parsed = [];
var credits_Array = [];
var credits_Arr;
var credits_Array_Parsed = [];

if (credits) {
if (credits.constructor === Array) {

credits.forEach(function (forcredit, index) {

      let credit_en
      try {
        credit_en = credits[index]["gco:CharacterString"]["#text"];
        if (credit_en == null) {
          credit_en = null;
        }
      } catch (error) {
        credit_en = null;
      }
      
      let credit_fr
      try {
        credit_fr = credits[index]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (credit_fr == null) {
          credit_fr = null;
        }
      } catch (error) {
        credit_fr = null;
      }
      
      var r_credits_en = credit_en.replace(/\n\n/,'');
      
      let credits_en_item
      if (r_credits_en) {
        credits_en_item = '"en": "' + r_credits_en + '"';
      } else {
        credits_en_item = '"en": ' + r_credits_en;
      }
      
      var r_credits_fr = credit_fr.replace(/\n\n/,'');
      
      let credits_fr_item
      if (r_credits_fr) {
        credits_fr_item = '"fr": "' + r_credits_fr + '"';
      } else {
        credits_fr_item = '"fr": ' + r_credits_fr;
      }
      
      credits_Arr = "{" + credits_en_item + ", " + credits_fr_item + "}";
      credits_Array_Parsed = JSON.parse(credits_Arr);
      credits_Array.push(credits_Array_Parsed);
      
      
});

} else {
        
      let credit_en
      try {
        credit_en = credits["gco:CharacterString"]["#text"];
        if (credit_en == null) {
          credit_en = null;
        }
      } catch (error) {
        credit_en = null;
      }
      
      let credit_fr
      try {
        credit_fr = credits["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
        if (credit_fr == null) {
          credit_fr = null;
        }
      } catch (error) {
        credit_fr = null;
      }
      
      if (credit_en) {
      var r_credits_en = credit_en.replace(/\n\n/,'');
      } else {
        r_credits_en = null;
      }
      
      let credits_en_item
      if (r_credits_en) {
        credits_en_item = '"en": "' + r_credits_en + '"';
      } else {
        credits_en_item = '"en": ' + r_credits_en;
      }
      
      if (credit_fr) {
      var r_credits_fr = credit_fr.replace(/\n\n/,'');
      } else {
        r_credits_fr = null;
      }
      
      let credits_fr_item
      if (r_credits_fr) {
        credits_fr_item = '"fr": "' + r_credits_fr + '"';
      } else {
        credits_fr_item = '"fr": ' + r_credits_fr;
      }
      
      credits_Arr = "{" + credits_en_item + ", " + credits_fr_item + "}";
      credits_Array_Parsed = JSON.parse(credits_Arr);
      credits_Array.push(credits_Array_Parsed);
}}

    //cited
if (citedResponsibleParty) {
    
    let cited_individualName
    try {
      cited_individualName = citedResponsibleParty["gmd:individualName"]["gco:CharacterString"]["#text"]
      if (cited_individualName == null) {
        cited_individualName = null;
      }
    } catch (error) {
      cited_individualName = null;
    }

    let cited_organisationName_en
    try {
      cited_organisationName_en = citedResponsibleParty["gmd:organisationName"]["gco:CharacterString"]["#text"];
      if (cited_organisationName_en == null) {
        cited_organisationName_en = null;
      }
    } catch (error) {
      cited_organisationName_en = null;
    }

    let cited_organisationName_fr
    try {
      cited_organisationName_fr = citedResponsibleParty["gmd:organisationName"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (cited_organisationName_fr == null) {
        cited_organisationName_fr = null;
      }
    } catch (error) {
      cited_organisationName_fr = null;
    }

    let cited_positionName_en
    try {
      cited_positionName_en = citedResponsibleParty["gmd:positionName"]["gco:CharacterString"]["#text"];
      if (cited_positionName_en == null) {
        cited_positionName_en = null;
      }
    } catch (error) {
      cited_positionName_en = null;
    }

    let cited_positionName_fr
    try {
      cited_positionName_fr = citedResponsibleParty["gmd:positionName"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (cited_positionName_fr == null) {
        cited_positionName_fr = null;
      }
    } catch (error) {
      cited_positionName_fr = null;
    }

    let cited_telephone_en
    try {
      cited_telephone_en = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:voice"]["gco:CharacterString"]["#text"];
      if (cited_telephone_en == null) {
        cited_telephone_en = null;
      }
    } catch (error) {
      cited_telephone_en = null;
    }

    let cited_telephone_fr
    try {
      cited_telephone_fr = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:voice"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (cited_telephone_fr == null) {
        cited_telephone_fr = null;
      }
    } catch (error) {
      cited_telephone_fr = null;
    }

    let cited_fax
    try {
      cited_fax = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:facsimile"]["gco:CharacterString"]["#text"];
    } catch (error) {
      cited_fax = null;
    }

    let cited_address_en
    try {
      cited_address_en = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:deliveryPoint"]["gco:CharacterString"]["#text"];
      if (cited_address_en == null) {
        cited_address_en = null;
      }
    } catch (error) {
      cited_address_en = null;
    }

    let cited_address_fr
    try {
      cited_address_fr = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:deliveryPoint"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (cited_address_fr == null) {
        cited_address_fr = null;
      }
    } catch (error) {
      cited_address_fr = null;
    }

    let cited_city
    try {
      cited_city = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:city"]["gco:CharacterString"]["#text"];
    } catch (error) {
      cited_city = null;
    }

    let cited_pt_en
    try {
      cited_pt_en = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:administrativeArea"]["gco:CharacterString"]["#text"];
      if (cited_pt_en == null) {
        cited_pt_en = null;
      }
    } catch (error) {
      cited_pt_en = null;
    }

    let cited_pt_fr
    try {
      cited_pt_fr = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:administrativeArea"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (cited_pt_fr == null) {
        cited_pt_fr = null;
      }
    } catch (error) {
      cited_pt_fr = null;
    }

    let cited_postalCode
    try {
      cited_postalCode = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:postalCode"]["gco:CharacterString"]["#text"];
    } catch (error) {
      cited_postalCode = null;
    }

    let cited_country_en
    try {
      cited_country_en = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:country"]["gco:CharacterString"]["#text"];
      if (cited_country_en == null){
        cited_country_en = null;
      }
    } catch (error) {
      cited_country_en = null;
    }

    let cited_country_fr
    try {
      cited_country_fr = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:country"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (cited_country_fr == null) {
        cited_country_fr = null;
      }
    } catch (error) {
      cited_country_fr = null;
    }

    let cited_email_en
    try {
      cited_email_en = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:electronicMailAddress"]["gco:CharacterString"]["#text"];
      if (cited_email_en == null) {
        cited_email_en = null;
      }
    } catch (error) {
      cited_email_en = null;
    }

    let cited_email_fr
    try {
      cited_email_fr = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:electronicMailAddress"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (cited_email_fr == null) {
        cited_email_fr = null;
      }
    } catch (error) {
      cited_email_fr = null;
    }

    let cited_onlineResource
    try {
      cited_onlineResource = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:linkage"]["gmd:URL"];
      if (cited_onlineResource == null) {
        cited_onlineResource = null;
      }
    } catch (error) {
      cited_onlineResource = null;
    }

    let cited_onlineResource_Protocol
    try {
      cited_onlineResource_Protocol = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:protocol"]["gco:CharacterString"]["#text"];
      if (cited_onlineResource_Protocol == null) {
        cited_onlineResource_Protocol = null;
      }
    } catch (error) {
      cited_onlineResource_Protocol = null;
    }

    let cited_onlineResource_Name
    try {
      cited_onlineResource_Name = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:name"]["gco:CharacterString"]["#text"];
      if (cited_onlineResource_Name == null) {
        cited_onlineResource_Name = null;
      }
    } catch (error) {
      cited_onlineResource_Name = null;
    }

    let cited_onlineResource_Description
    try {
      cited_onlineResource_Description = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:description"]["gco:CharacterString"]["#text"];
      if (cited_onlineResource_Description == null) {
        cited_onlineResource_Description = null;
      }
    } catch (error) {
      cited_onlineResource_Description = null;
    }

    let cited_hoursOfService
    try {
      cited_hoursOfService = citedResponsibleParty["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:hoursOfService"]["gco:CharacterString"]["#text"];
    } catch (error) {
      cited_hoursOfService = null;
    }

    let cited_role
    try {
      cited_role = citedResponsibleParty["gmd:role"]["gmd:CI_RoleCode"]["#text"];
    } catch (error) {
      cited_role = null;
    }
    
      let c_individual
      if (cited_individualName) {
        c_individual = '"individual": "' + cited_individualName + '"';
      } else {
        c_individual = '"individual": ' + cited_individualName;
      }
        
      let c_position
      let pos_en
      if (cited_positionName_en) {
        pos_en = '"en": "' + cited_positionName_en + '"';
      } else {
        pos_en = '"en": ' + cited_positionName_en;
       }
       
      let pos_fr
      if (cited_positionName_fr) {
        pos_fr = '"fr": "' + cited_positionName_fr + '"';
      } else {
        pos_fr = '"fr": ' + cited_positionName_fr;
      }
      
      c_position = '"position": {' + pos_en + ',' + pos_fr + '}';
        
      let c_organisation
      let org_en
      if (cited_organisationName_en) {
        org_en = '"en": "' + cited_organisationName_en + '"';
      } else {
        org_en = '"en": ' + cited_organisationName_en;
      }
      
      let org_fr
      if (cited_organisationName_fr) {
        org_fr = '"fr": "' + cited_organisationName_fr + '"';
      } else {
        org_fr = '"fr": ' + cited_organisationName_fr;
      }
      
      c_organisation = '"organisation": {' + org_en + ',' + org_fr + '}';
      
      let c_telephone
      
      let tel_en
      if (cited_telephone_en) {
        tel_en = '"en": "' + cited_telephone_en + '"';
      } else {
        tel_en = '"en": ' + cited_telephone_en;
      }
      
      let tel_fr
      if (cited_telephone_fr) {
        tel_fr = '"fr": "' + cited_telephone_fr + '"';
      } else {
        tel_fr = '"fr": ' + cited_telephone_fr;
      }
      
      c_telephone = '"telephone": {' + tel_en + ',' + tel_fr + '}';
      
      let c_fax
      if (cited_fax) {
        c_fax = '"fax": "' + cited_fax + '"';
      } else {
        c_fax = '"fax": ' + cited_fax;
      }
      
      let c_address
      let add_en
      if (cited_address_en) {
        add_en = '"en": "' + cited_address_en + '"';
      } else {
        add_en = '"en": ' + cited_address_en;
      }
      
      let add_fr
      if (cited_address_fr) {
        add_fr = '"fr": "' + cited_address_fr + '"';
      } else {
        add_fr = '"fr": ' + cited_address_fr;
      }
      
      c_address = '"address": {' + add_en + ',' + add_fr + '}';
      
      let c_city
      if (cited_city) {
        c_city = '"city": "' + cited_city + '"';
      } else {
        c_city = '"city": ' + cited_city;
      }
      
      let c_pt
      let c_pt_en
      if (cited_pt_en) {
        c_pt_en = '"en": "' + cited_pt_en + '"';
      } else {
        c_pt_en = '"en": ' + cited_pt_en;
      }
      
      let c_pt_fr
      if (cited_pt_fr) {
        c_pt_fr = '"fr": "' + cited_pt_fr + '"';
      } else {
        c_pt_fr = '"fr": ' + cited_pt_fr;
      }
      
      c_pt = '"pt": {' + c_pt_en + ',' + c_pt_fr + '}';
      
      let c_postalCode
      if (cited_postalCode) {
        c_postalCode = '"postalcode": "' + cited_postalCode + '"';
      } else {
        c_postalCode = '"postalcode": ' + cited_postalCode;
      }
      
      let c_country
      let co_en
      if (cited_country_en) {
        co_en = '"en": "' + cited_country_en + '"';
      } else {
        co_en = '"en": ' + cited_country_en;
      }
      
      let co_fr
      if (cited_country_fr) {
        co_fr = '"fr": "' + cited_country_fr + '"';
      } else {
        co_fr = '"fr": ' + cited_country_fr;
      }
      
      c_country = '"country": {' + co_en + ',' + co_fr + '}';
      
      let c_email
      let em_en
      if (cited_email_en) {
        em_en = '"en": "' + cited_email_en + '"';
      } else {
        em_en = '"en": ' + cited_email_en;
      }
      
      let em_fr
      if (cited_email_fr) {
        em_fr = '"fr": "' + cited_email_fr + '"';
      } else {
        em_fr = '"fr": ' + cited_email_fr;
      }
      
      c_email = '"email": {' + em_en + ',' + em_fr + '}';
      
      let c_onlineResource
      let or
      if (cited_onlineResource) {
        or = '"onlineResource": "' + cited_onlineResource + '"';
      } else {
        or = '"onlineResource": ' + cited_onlineResource;
      }
      
      let orn
      if (cited_onlineResource_Name) {
        orn = '"onlineResource_Name": "' + cited_onlineResource_Name + '"';
      } else {
        orn = '"onlineResource_Name": ' + cited_onlineResource_Name;
      }
      
      let orp
      if (cited_onlineResource_Protocol) {
        orp = '"onlineResource_Protocol": "' + cited_onlineResource_Protocol + '"';
      } else {
        orp = '"onlineResource_Protocol": ' + cited_onlineResource_Protocol;
      }
      
      let ord
      if (cited_onlineResource_Description) {
        ord = '"onlineResource_Description": "' + cited_onlineResource_Description + '"';
      } else {
        ord = '"onlineResource_Description": ' + cited_onlineResource_Description;
      }
      
      c_onlineResource = '"onlineResource": {' + or + ',' + orn + ',' + orp + ',' + ord + '}';
      
      let c_hoursOfService
      if (cited_hoursOfService) {
        c_hoursOfService = '"hoursOfService": "' + cited_hoursOfService + '"';
      } else {
        c_hoursOfService = '"hoursOfService": ' + cited_hoursOfService;
      }
      
      let c_role
      if (cited_role) {
        c_role = '"role": "' + cited_role + '"';
      } else {
        c_role = '"role": ' + cited_role;
      }
      
      
    var cited_Arr = "{" + c_individual + "," + c_position + "," + c_organisation + "," + c_telephone + "," + c_fax + "," + c_address + "," + c_city + "," + c_pt + "," + c_postalCode + "," + c_country + "," + c_email + "," + c_onlineResource + "," + c_hoursOfService + "," + c_role + "}";
    var cited_Parsed = JSON.parse(cited_Arr);
    var cited_Array = [];
    cited_Array.push(cited_Parsed);

}

    //dist
if (distributor) {

    let dist_individualName
    try {
      dist_individualName = distributor["gmd:individualName"]["gco:CharacterString"]["#text"];
    } catch (error) {
      dist_individualName = null;
    }

    let dist_organisationName_en
    try {
      dist_organisationName_en = distributor["gmd:organisationName"]["gco:CharacterString"]["#text"];
      if (dist_organisationName_en == null) {
        dist_organisationName_en = null;
      }
    } catch (error) {
      dist_organisationName_en = null;
    }

    let dist_organisationName_fr
    try {
      dist_organisationName_fr = distributor["gmd:organisationName"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (dist_organisationName_fr == null) {
        dist_organisationName_fr = null;
      }
    } catch (error) {
      dist_organisationName_fr = null;
    }

    let dist_positionName_en
    try {
      dist_positionName_en = distributor["gmd:positionName"]["gco:CharacterString"]["#text"];
      if (dist_positionName_en == null) {
        dist_positionName_en = null;
      }
    } catch (error) {
      dist_positionName_en = null;
    }

    let dist_positionName_fr
    try {
      dist_positionName_fr = distributor["gmd:positionName"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (dist_positionName_fr == null) {
        dist_positionName_fr = null;
      }
    } catch (error) {
      dist_positionName_fr = null;
    }

    let dist_telephone_en
    try {
      dist_telephone_en = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:voice"]["gco:CharacterString"]["#text"];
      if (dist_telephone_en == null ) {
        dist_telephone_en = null;
      }
    } catch (error) {
      dist_telephone_en = null;
    }

    let dist_telephone_fr
    try {
      dist_telephone_fr = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:voice"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (dist_telephone_fr == null) {
        dist_telephone_fr = null;
      }
    } catch (error) {
      dist_telephone_fr = null;
    }

    let dist_fax
    try {
      dist_fax = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:phone"]["gmd:CI_Telephone"]["gmd:facsimile"]["gco:CharacterString"]["#text"];
      if (dist_fax == null) {
        dist_fax = null;
      }
    } catch (error) {
      dist_fax = null;
    }

    let dist_address_en
    try {
      dist_address_en = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:deliveryPoint"]["gco:CharacterString"]["#text"];
      if (dist_address_en == null) {
        dist_address_en = null;
      }
    } catch (error) {
      dist_address_en = null;
    }

    let dist_address_fr
    try {
      dist_address_fr = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:deliveryPoint"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (dist_address_fr == null) {
        dist_address_fr = null;
      }
    } catch (error) {
      dist_address_fr = null;
    }

    let dist_city
    try {
      dist_city = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:city"]["gco:CharacterString"]["#text"];
      if (dist_city == null) {
        dist_city = null;
      }
    } catch (error) {
      dist_city = null;
    }

    let dist_pt_en
    try {
      dist_pt_en = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:administrativeArea"]["gco:CharacterString"]["#text"];
      if (dist_pt_en) {
        dist_pt_en = null;
      }
    } catch (error) {
      dist_pt_en = null;
    }

    let dist_pt_fr
    try {
      dist_pt_fr = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:administrativeArea"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (dist_pt_fr == null) {
        dist_pt_fr = null;
      }
    } catch (error) {
      dist_pt_fr = null;
    }

    let dist_postalCode
    try {
      dist_postalCode = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:postalCode"]["gco:CharacterString"]["#text"];
      if (dist_postalCode == null) {
        dist_postalCode = null;
      }
    } catch (error) {
      dist_postalCode = null;
    }

    let dist_country_en
    try {
      dist_country_en = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:country"]["gco:CharacterString"]["#text"];
      if (dist_country_en == null) {
        dist_country_en = null;
      }
    } catch (error) {
      dist_country_en = null;
    }

    let dist_country_fr
    try {
      dist_country_fr = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:country"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (dist_country_fr == null) {
        dist_country_fr = null;
      }
    } catch (error) {
      dist_country_fr = null;
    }

    let dist_email_en
    try {
      dist_email_en = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:electronicMailAddress"]["gco:CharacterString"]["#text"];
      if (dist_email_en == null) {
        dist_email_en = null;
      }
    } catch (error) {
      dist_email_en = null;
    }

    let dist_email_fr
    try {
      dist_email_fr = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:address"]["gmd:CI_Address"]["gmd:electronicMailAddress"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (dist_email_fr == null) {
        dist_email_fr = null;
      }
    } catch (error) {
      dist_email_fr = null;
    }

    let dist_onlineResource
    try {
      dist_onlineResource = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:linkage"]["gmd:URL"];
      if (dist_onlineResource == null) {
        dist_onlineResource = null;
      }
    } catch (error) {
      dist_onlineResource = null;
    }

    let dist_onlineResource_Protocol
    try {
      dist_onlineResource_Protocol = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:protocol"]["gco:CharacterString"]["#text"];
      if (dist_onlineResource_Protocol == null) {
        dist_onlineResource_Protocol = null;
      }
    } catch (error) {
      dist_onlineResource_Protocol = null;
    }

    let dist_onlineResource_Name
    try {
      dist_onlineResource_Name = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:name"]["gco:CharacterString"]["#text"];
      if (dist_onlineResource_Name == null) {
        dist_onlineResource_Name = null;
      }
    } catch (error) {
      dist_onlineResource_Name = null;
    }

    let dist_onlineResource_Description
    try {
      dist_onlineResource_Description = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:onlineResource"]["gmd:CI_OnlineResource"]["gmd:description"]["gco:CharacterString"]["#text"];
      if (dist_onlineResource_Description == null) {
        dist_onlineResource_Description = null;
      }
    } catch (error) {
      dist_onlineResource_Description = null;
    }

    let dist_hoursOfService
    try {
      dist_hoursOfService = distributor["gmd:contactInfo"]["gmd:CI_Contact"]["gmd:hoursOfService"]["gco:CharacterString"]["#text"];
    } catch (error) {
      dist_hoursOfService = null;
    }

    let dist_role
    try {
      dist_role = distributor["gmd:role"]["gmd:CI_RoleCode"]["#text"];
    } catch (error) {
      dist_role = null;
    }
 
      let d_individual
      if (dist_individualName) {
        d_individual = '"individual": "' + dist_individualName + '"';
      } else {
        d_individual = '"individual": ' + dist_individualName;
      }
        
      let d_position
      let pos_en
      if (dist_positionName_en) {
        pos_en = '"en": "' + dist_positionName_en + '"';
      } else {
        pos_en = '"en": ' + dist_positionName_en;
       }
       
      let pos_fr
      if (dist_positionName_fr) {
        pos_fr = '"fr": "' + dist_positionName_fr + '"';
      } else {
        pos_fr = '"fr": ' + dist_positionName_fr;
      }
      
      d_position = '"position": {' + pos_en + ',' + pos_fr + '}';
        
      let d_organisation
      let org_en
      if (dist_organisationName_en) {
        org_en = '"en": "' + dist_organisationName_en + '"';
      } else {
        org_en = '"en": ' + dist_organisationName_en;
      }
      
      let org_fr
      if (dist_organisationName_fr) {
        org_fr = '"fr": "' + dist_organisationName_fr + '"';
      } else {
        org_fr = '"fr": ' + dist_organisationName_fr;
      }
      
      d_organisation = '"organisation": {' + org_en + ',' + org_fr + '}';
      
      let d_telephone
      
      let tel_en
      if (dist_telephone_en) {
        tel_en = '"en": "' + dist_telephone_en + '"';
      } else {
        tel_en = '"en": ' + dist_telephone_en;
      }
      
      let tel_fr
      if (dist_telephone_fr) {
        tel_fr = '"fr": "' + dist_telephone_fr + '"';
      } else {
        tel_fr = '"fr": ' + dist_telephone_fr;
      }
      
      d_telephone = '"telephone": {' + tel_en + ',' + tel_fr + '}';
      
      let d_fax
      if (dist_fax) {
        d_fax = '"fax": "' + dist_fax + '"';
      } else {
        d_fax = '"fax": ' + dist_fax;
      }
      
      let d_address
      let add_en
      if (dist_address_en) {
        add_en = '"en": "' + dist_address_en + '"';
      } else {
        add_en = '"en": ' + dist_address_en;
      }
      
      let add_fr
      if (dist_address_fr) {
        add_fr = '"fr": "' + dist_address_fr + '"';
      } else {
        add_fr = '"fr": ' + dist_address_fr;
      }
      
      d_address = '"address": {' + add_en + ',' + add_fr + '}';
      
      let d_city
      if (dist_city) {
        d_city = '"city": "' + dist_city + '"';
      } else {
        d_city = '"city": ' + dist_city;
      }
      
      let d_pt
      let d_pt_en
      if (dist_pt_en) {
        d_pt_en = '"en": "' + dist_pt_en + '"';
      } else {
        d_pt_en = '"en": ' + dist_pt_en;
      }
      
      let d_pt_fr
      if (dist_pt_fr) {
        d_pt_fr = '"fr": "' + dist_pt_fr + '"';
      } else {
        d_pt_fr = '"fr": ' + dist_pt_fr;
      }
      
      d_pt = '"pt": {' + d_pt_en + ',' + d_pt_fr + '}';
      
      let d_postalCode
      if (dist_postalCode) {
        d_postalCode = '"postalcode": "' + dist_postalCode + '"';
      } else {
        d_postalCode = '"postalcode": ' + dist_postalCode;
      }
      
      let d_country
      let co_en
      if (dist_country_en) {
        co_en = '"en": "' + dist_country_en + '"';
      } else {
        co_en = '"en": ' + dist_country_en;
      }
      
      let co_fr
      if (dist_country_fr) {
        co_fr = '"fr": "' + dist_country_fr + '"';
      } else {
        co_fr = '"fr": ' + dist_country_fr;
      }
      
      d_country = '"country": {' + co_en + ',' + co_fr + '}';
      
      let d_email
      let em_en
      if (dist_email_en) {
        em_en = '"en": "' + dist_email_en + '"';
      } else {
        em_en = '"en": ' + dist_email_en;
      }
      
      let em_fr
      if (dist_email_fr) {
        em_fr = '"fr": "' + dist_email_fr + '"';
      } else {
        em_fr = '"fr": ' + dist_email_fr;
      }
      
      d_email = '"email": {' + em_en + ',' + em_fr + '}';
      
      let d_onlineResource
      let or
      if (dist_onlineResource) {
        or = '"onlineResource": "' + dist_onlineResource + '"';
      } else {
        or = '"onlineResource": ' + dist_onlineResource;
      }
      
      let orn
      if (dist_onlineResource_Name) {
        orn = '"onlineResource_Name": "' + dist_onlineResource_Name + '"';
      } else {
        orn = '"onlineResource_Name": ' + dist_onlineResource_Name;
      }
      
      let orp
      if (dist_onlineResource_Protocol) {
        orp = '"onlineResource_Protocol": "' + dist_onlineResource_Protocol + '"';
      } else {
        orp = '"onlineResource_Protocol": ' + dist_onlineResource_Protocol;
      }
      
      let ord
      if (dist_onlineResource_Description) {
        ord = '"onlineResource_Description": "' + dist_onlineResource_Description + '"';
      } else {
        ord = '"onlineResource_Description": ' + dist_onlineResource_Description;
      }
      
      d_onlineResource = '"onlineResource": {' + or + ',' + orn + ',' + orp + ',' + ord + '}';
      
      let d_hoursOfService
      if (dist_hoursOfService) {
        d_hoursOfService = '"hoursOfService": "' + dist_hoursOfService + '"';
      } else {
        d_hoursOfService = '"hoursOfService": ' + dist_hoursOfService;
      }
      
      let d_role
      if (dist_role) {
        d_role = '"role": "' + dist_role + '"';
      } else {
        d_role = '"role": ' + dist_role;
      }
      
      
    var dist_Arr = "{" + d_individual + "," + d_position + "," + d_organisation + "," + d_telephone + "," + d_fax + "," + d_address + "," + d_city + "," + d_pt + "," + d_postalCode + "," + d_country + "," + d_email + "," + d_onlineResource + "," + d_hoursOfService + "," + d_role + "}";
    var dist_Parsed = JSON.parse(dist_Arr);
    var dist_Array = [];
    dist_Array.push(dist_Parsed);
  
}
 
  var options_Arr;
  var options_Array = [];
  var options_Parsed;

  if (options) {
    
    if (options.constructor === Array) {
  
  options.forEach(function (transferOption, index) {

    let url
    try {
      url = options[index]["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:linkage"]["gmd:URL"];
      if (url == null) {
        url = null;
      }
    } catch (error) {
      url = null;
    }

    let protocol
    try {
      protocol = options[index]["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:protocol"]["gco:CharacterString"]["#text"];
      if (protocol == null) {
        protocol = null;
      }
    } catch (error) {
      protocol = null;
    }

    let name_en
    try {
      name_en = options[index]["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:name"]["gco:CharacterString"]["#text"];
      if (name_en == null) {
        name_en = null;
      }
    } catch (error) {
      name_en = null;
    }

    let name_fr
    try {
      name_fr = options[index]["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:name"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (name_fr == null) {
        name_fr = null;
      }
    } catch (error) {
      name_fr = null;
    }

    let option_description_en
    try {
      option_description_en = options[index]["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:description"]["gco:CharacterString"]["#text"];
      if (option_description_en == null) {
        option_description_en = null;
      }
    } catch (error) {
      option_description_en = null;
    }

    let option_description_fr
    try {
      option_description_fr = options[index]["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:description"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (option_description_fr == null) {
        option_description_fr = null;
      }
    } catch (error) {
      option_description_fr = null;
    }
    
    let o_url
    if (url) {
      o_url = '"url": "' + url + '"';
    } else {
      o_url = '"url": ' + url;
    }
      
    let o_protocol
    if (protocol) {
      o_protocol = '"protocol": "' + protocol + '"';
    } else {
      o_protocol = '"protocol": ' + protocol;
    }
    
    let o_name
    let name_en_item
    if (name_en) {
      name_en_item = '"en": "' + name_en + '"';
    } else {
      name_en_item = '"en": ' + name_en;
    }
    
    let name_fr_item
    if (name_fr) {
      name_fr_item = '"fr": "' + name_fr + '"';
    } else {
      name_fr_item = '"fr": ' + name_fr;
    }
    
    o_name = '"name": {' + name_en_item + ',' + name_fr_item + '}';
      
    let o_option
    let desc_en
    if (option_description_en) {
      desc_en = '"en": "' + option_description_en + '"';
    } else {
      desc_en = '"en": ' + option_description_en;
    }
    
    let desc_fr
    if (option_description_fr) {
      desc_fr = '"fr": "' + option_description_fr + '"';
    } else {
      desc_fr = '"fr": ' + option_description_fr;
    }
    
    o_option = '"description": {' + desc_en + ',' + desc_fr + '}';
      
    options_Arr = "{" + o_url + "," + o_protocol + "," + o_name + "," + o_option + "}";
    options_Parsed = JSON.parse(options_Arr);
    options_Array.push(options_Parsed);
    
  });
    } else {
      
          let url
    try {
      url = options["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:linkage"]["gmd:URL"];
      if (url == null) {
        url = null;
      }
    } catch (error) {
      url = null;
    }

    let protocol
    try {
      protocol = options["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:protocol"]["gco:CharacterString"]["#text"];
      if (protocol == null) {
        protocol = null;
      }
    } catch (error) {
      protocol = null;
    }

    let name_en
    try {
      name_en = options["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:name"]["gco:CharacterString"]["#text"];
      if (name_en == null) {
        name_en = null;
      }
    } catch (error) {
      name_en = null;
    }

    let name_fr
    try {
      name_fr = options["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:name"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (name_fr == null) {
        name_fr = null;
      }
    } catch (error) {
      name_fr = null;
    }

    let option_description_en
    try {
      option_description_en = options["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:description"]["gco:CharacterString"]["#text"];
      if (option_description_en == null) {
        option_description_en = null;
      }
    } catch (error) {
      option_description_en = null;
    }

    let option_description_fr
    try {
      option_description_fr = options["gmd:MD_DigitalTransferOptions"]["gmd:onLine"]["gmd:CI_OnlineResource"]["gmd:description"]["gmd:PT_FreeText"]["gmd:textGroup"]["gmd:LocalisedCharacterString"]["#text"];
      if (option_description_fr == null) {
        option_description_fr = null;
      }
    } catch (error) {
      option_description_fr = null;
    }
    
    let o_url
    if (url) {
      o_url = '"url": "' + url + '"';
    } else {
      o_url = '"url": ' + url;
    }
      
    let o_protocol
    if (protocol) {
      o_protocol = '"protocol": "' + protocol + '"';
    } else {
      o_protocol = '"protocol": ' + protocol;
    }
    
    let o_name
    let name_en_item
    if (name_en) {
      name_en_item = '"en": "' + name_en + '"';
    } else {
      name_en_item = '"en": ' + name_en;
    }
    
    let name_fr_item
    if (name_fr) {
      name_fr_item = '"fr": "' + name_fr + '"';
    } else {
      name_fr_item = '"fr": ' + name_fr;
    }
    
    o_name = '"name": {' + name_en_item + ',' + name_fr_item + '}';
      
    let o_option
    let desc_en
    if (option_description_en) {
      desc_en = '"en": "' + option_description_en + '"';
    } else {
      desc_en = '"en": ' + option_description_en;
    }
    
    let desc_fr
    if (option_description_fr) {
      desc_fr = '"fr": "' + option_description_fr + '"';
    } else {
      desc_fr = '"fr": ' + option_description_fr;
    }
    
    o_option = '"description": {' + desc_en + ',' + desc_fr + '}';
      
    options_Arr = "{" + o_url + "," + o_protocol + "," + o_name + "," + o_option + "}";
    options_Parsed = JSON.parse(options_Arr);
    options_Array.push(options_Parsed);
      
      
    }
  }

  var geoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type":"Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [ west, south ], [ east, south ], [ east, north ], [ west, north ], [ west, south]

            ]]
      },
      "properties": {
        "id": id,
        "title": {
          "en": title_en,
          "fr": title_fr
        },
        "description": {
          "en": description_en,
          "fr": description_fr
        },
        "keywords": keyword_Array,
        "topicCategory": topicCategory,
        "date": {
          "published": {
            "text": date_text_publication,
            "date": date_publication
          },
          "created": {
            "text": date_text_creation,
            "date": date_creation
          }
        },
        "spatialRepresentation": spatialRepresentation,
        "type": type,
        "temporalExtent": {
          "begin": temporalExtent_begin,
          "end": temporalExtent_end
        },
        "refSys": refSys,
        "refSys_version": refSys_version,
        "status": status,
        "maintenance": maintenance,
        "metadataStandard": {
          "en": metadataStandard_en,
          "fr": metadataStandard_fr
        },
        "metadataStandardVersion": metadataStandardVersion,
        "graphicOverview": goArray,
        "distributionFormat_name": distributionFormat_name,
        "distributionFormat_format": distributionFormat_format,
        "useLimits": {
          "en": useLimits_en,
          "fr": useLimits_fr
        },
        "accessConstraints": accessConstraints,
        "otherConstraints": {
          "en": otherConstraints_en,
          "fr": otherConstraints_fr
        },
        "dateStamp": dateStamp,
        "dataSetURI": dataSetURI,
        "locale": {
          "language": locale_language,
          "country": locale_country,
          "encoding": locale_encoding
        },
        "language": language,
        "characterSet": characterSet,
        "environmentDescription": environmentDescription,
        "supplementalInformation": {
          "en": supplementalInformation_en,
          "fr": supplementalInformation_fr
        },
        "contact": contacts_Array,
        "credits": credits_Array,
        "cited": cited_Array,
        "distributor": dist_Array,
        "options": options_Array
      }
    }]
  };
  
    // output configuration
    const bucketoutput = "dev-geocore-transform-output-1";
    const keyName = id + ".geojson";
    const content = JSON.stringify(geoJSON);
    
    try {
      const paramsoutput = {
            Bucket: bucketoutput,
            Key: keyName,
            Body: content
        };
            
      const put = await s3.putObject(paramsoutput).promise(); 
    
    } catch (error) {
        console.log(error);
        return;
    }
    

    
    // This is for testing purposes only
    /*const response = {
        statusCode: 200,
        body: geoJSON
        //body: data
    };
    return response;*/
};
