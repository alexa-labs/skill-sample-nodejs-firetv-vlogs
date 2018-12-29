/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const numbers = require('./numbers');
const noAplSpeechText = 'This is a sample that shows video logs. ' + 
                        'Try it on an Echo Show, Echo Spot or Fire TV device.'

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to my FireTV Vlogs! Check out the most recent vlogs now!';

    if(supportsAPL(handlerInput))
    {
        return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('FireTV Vlogs', speechText)
        .addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            token: "homepage",
            document: require('./launchRequest.json'),
            datasources: require('./sampleDataSource.json')
        })
        .getResponse();
    }
    else
    {
        return handlerInput.responseBuilder
        .speak(noAplSpeechText)
        .getResponse();
    }
  },
};

const ListItemPressedHandler = {
  canHandle(handlerInput) { 
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'Alexa.Presentation.APL.UserEvent' && request.arguments.length > 0;
  },
  handle(handlerInput) {
    const selectedItem = Number(handlerInput.requestEnvelope.request.arguments[0]);
    return handlerInput.responseBuilder
          .speak("Here is the video, enjoy!")
          .addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            token: "VideoPlayerToken",
            document: require('./videoPlayer.json'),
            datasources: {
              "fireTVVlogsData": {
                  "type": "object",
                  "properties": {
                      "selectedItem": selectedItem,
                      "videoItems": VLOG_DATA
                  }
                }
            }
          })
          .addDirective({
              type: "Alexa.Presentation.APL.ExecuteCommands",
              token: "VideoPlayerToken",
              commands: [
                {
                  type: "ControlMedia",
                  componentId: "myVideoPlayer",
                  command: "play"
                }
              ]
          })
          .getResponse();
  }
}

const GetVideoByNumberHandler = {
    canHandle: (handlerInput) => {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'SelectByNumberIntent';
    },
    handle: (handlerInput) => {
        const slotValue = handlerInput.requestEnvelope.request.intent.slots.ordinal.value || handlerInput.requestEnvelope.request.intent.slots.cardinal.value;

        console.log(`Got Slot number: ${slotValue}`);
        const selectedItem = numbers.ordinalToNumber(slotValue) - 1;
        console.log(`Number resolved to: ${selectedItem}`);
    
        if(isNaN(selectedItem)) {
            return handlerInput.responseBuilder
                            .speak('Sorry, I didn\'t recognize that video, please try again!')
                            .reprompt('Which video would you like to watch?')        
                            .getResponse();
        }
    
        const numItems = VLOG_DATA.length;
        if(selectedItem > numItems) {
            return handlerInput.responseBuilder
                               .speak('Sorry, I couldn\'t find that video, please say a number between 1 and ' + numItems)
                               .reprompt('Which video would you like to watch?')        
                               .getResponse();
        }
    
        if(supportsAPL(handlerInput))
        {
            return handlerInput.responseBuilder
            .speak("Here is the video, enjoy!")
            .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: "VideoPlayerToken",
                document: require('./videoPlayer.json'),
                datasources: {
                "fireTVVlogsData": {
                    "type": "object",
                    "properties": {
                        "selectedItem": selectedItem,
                        "videoItems": VLOG_DATA
                    }
                    }
                }
            })
            .addDirective({
                type: "Alexa.Presentation.APL.ExecuteCommands",
                token: "VideoPlayerToken",
                commands: [
                    {
                    type: "ControlMedia",
                    componentId: "myVideoPlayer",
                    command: "play"
                    }
                ]
            })
            .getResponse();                   
        }
        else
        {
            return handlerInput.responseBuilder
            .speak(noAplSpeechText)
            .getResponse();
        }
    }
}

const GetVideoByTitleHandler = {
    canHandle: (handlerInput) => {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'GetVideoIntent';
    },
    handle: (handlerInput) => {
        const titleValue = handlerInput.requestEnvelope.request.intent.slots.title.value;
        console.log('titlevalue ' + titleValue);
        
        var selectedItem = 0;
        while(selectedItem < VLOG_DATA.length) {
          if (titleValue == VLOG_DATA[selectedItem].title) {
            break;
          }
        }
        if (selectedItem == VLOG_DATA.length && titleValue != VLOG_DATA[selectedItem].title) {
            return handlerInput.responseBuilder
                            .speak('Sorry, I didn\'t recognize that title, try again!')
                            .reprompt('Which video would you like to watch?')        
                            .getResponse();
        }
        
        if(supportsAPL(handlerInput))
        {
            return handlerInput.responseBuilder
            .speak("Here is the video, enjoy!")
            .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                document: require('./videoPlayer.json'),
                token: "VideoPlayerToken",
                datasources: {
                "fireTVVlogsData": {
                    "type": "object",
                    "properties": {
                        "selectedItem": selectedItem,
                        "videoItems": VLOG_DATA
                    }
                    }
                }
            })
            .addDirective({
                type: "Alexa.Presentation.APL.ExecuteCommands",
                token: "VideoPlayerToken",
                commands: [
                    {
                    type: "ControlMedia",
                    componentId: "myVideoPlayer",
                    command: "play"
                    }
                ]
                })
            .getResponse();
        }
        else
        {
            return handlerInput.responseBuilder
            .speak(noAplSpeechText)
            .getResponse();
        }
    }
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can select a video from the list by saying the title or the number!';

    if(supportsAPL(handlerInput))
    {
        return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('FireTV Vlogs', speechText)
        .addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: require('./launchRequest.json'),
            datasources: require('./sampleDataSource.json')
        })
        .getResponse();
    }
    else
    {
        return handlerInput.responseBuilder
        .speak(noAplSpeechText)
        .getResponse();
    }
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const VLOG_DATA = [
  {
    "title": "Adventure in NYC",
    "description": "This is me in NYC, what a wild ride that was.",
    "color": "#A3836A",
    "imgSrc": "https://cdn.fodors.com/wp-content/uploads/2016/02/1-Ultimate-New-York-Hero.jpg",
    "vidSrc": "http://techslides.com/demos/sample-videos/small.mp4"
  },
  {
    "title": "How did I get to Budapest?",
    "description": "How did I get here! This trip was insane!",
    "color": "#6F74A9",
    "imgSrc": "https://i2.wp.com/welovebudapest.com/en/wp-content/uploads/sites/2/2014/08/7b7752427fd698b5f8ed43da8e07cd61.jpg?resize=1920%2C1080&ssl=1",
    "vidSrc": "http://techslides.com/demos/sample-videos/small.mp4"
  },
  {
    "title": "Lost in Paris",
    "description": "I have realized I don't speak French. This will be interesting.",
    "color": "#98311F",
    "imgSrc": "https://a1.r9cdn.net/rimg/dimg/bd/d1/2f268866-city-36014-1651555f8a8.jpg?width=1280&height=800&xhint=2006&yhint=1809&crop=true",
    "vidSrc": "http://techslides.com/demos/sample-videos/small.mp4"
  },
  {
    "title": "Surprize! I ended up in Jerusalem",
    "description": "Got to see some friends and try new food.",
    "color": "#E9BC68",
    "imgSrc": "https://static.metro.se/0ab/df9/architecture-3197435_1920-LARGE.jpg",
    "vidSrc": "http://techslides.com/demos/sample-videos/small.mp4"
  }
];

function supportsAPL(handlerInput) {
    const supportedInterfaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
    const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
    return aplInterface != null && aplInterface != undefined;
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    ListItemPressedHandler,
    GetVideoByNumberHandler,
    GetVideoByTitleHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
