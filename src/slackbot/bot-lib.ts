
import Activity from "../activities/entity"

// that's the message Olly sends away when the server running Olly starts
export const ollyOnStart = "Olly is here for you!"

// that's the message Olly sends away when the user types "@Olly intro"
export const ollyOnIntro = "Let me know about yourself"

// that's the message Olly sends when the user submits answers to the 3 intro questions
export const ollyIntroQuestionsThanks = "Thanks! Now, I'll be able to match you with the right people!"

// that's the message Olly sends away when the user types "@Olly match", it appears above the 3 drop-down questions
export const ollyOnMatch = "While you’re here, can you let me know what you’re up for this week?"

// that's the message Olly sends when there are no available matches
export const noMatchesText = "No matches available. Try again next week"

// that's the message Olly sends when there is ONE SINGLE match found
export const yourMatch = "You matched with "

// that's the message Olly sends when there are MULTIPLE matches found
export const yourMatches = "Your matches are "

// that's the message Olly sends when you already exist in the database
export const youDontExist = "You already exist"

export const departments = ["Development", "Marketing", "Customer Success", "Human Resources", "Analytics", "Legal"]
export const categories = ["socialize", "network"] 
export const channel = "your-olly"

export const threeButtonsFunc = async () => {
    const activities = await Activity.find()
    const fallback = "If you could read this message, you'd be choosing something fun to do right now."
    const callbackId = "weekly_update"

    let threeButtons: any = await [
            {
                "text": "I want to ...",
                "fallback": fallback,
                "color": "#3AA3E3",
                "attachment_type": "default",
                "callback_id": callbackId,
                "actions": [
                    {
                        "name": "category",
                        "text": "Pick a category",
                        "type": "select",
                        "options": categories.map(cat => ({
                            text: cat,
                            value: cat
                        }))                 
                    }
                ]
            },
                    {
                "text": "... by doing ...",
                "fallback": fallback,
                "color": "#3AA3E3",
                "attachment_type": "default",
                "callback_id": callbackId,
                "actions": [
                    {
                        "name": "activity",
                        "text": "Pick an activity",
                        "type": "select",
                        "options": await activities.map(activ => { return {
                                    text: activ.activityName,
                                    value: activ.id
                                } 
                            } )
                    }
                ]
            },
            {
                "text": " ... with ...",
                "fallback": fallback,
                "color": "#3AA3E3",
                "attachment_type": "default",
                "callback_id": callbackId,
                "actions": [
                    {
                        "name": "department",
                        "text": "Pick buddy/buddies",
                        "type": "select",
                        "options": await departments.map(dept => { return {
                                    text: dept,
                                    value: dept.toLowerCase().split(" ").join("_")
                                } 
                            } )
                    }
                ]
            },
            {
                "fallback": fallback,
                "title": "Submit Your Answer",
                "callback_id": callbackId,
                "color": "#66BD96",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": "submit",
                        "style": "primary",
                        "text": "Submit Answers",
                        "type": "button",
                        "value": "submit"
                    }
                ]
            }
    ]
    return await threeButtons
}
       
export const introButton = [
			{
				"text": "Tell Me More",
				"fallback": "You can't click on this button at the moment",
				"callback_id": "intro_me",
				"color": "#3AA3E3",
				"attachment_type": "default",
				"actions": [
					{
						"name": "Tell Me More",
						"text": "Tell Me More",
						"type": "button",
						"value": "intro",
						"style": "primary"
					}
				]
			}
]

export const threeIntroQuestions = async (trgId, callbId) => {
	let threeQ = 
		{
			"trigger_id": `${trgId}`,
			"dialog": {
				"callback_id": `${callbId}`,
				"title": "Your Department",
				"submit_label": "Submit",
				"notify_on_cancel": true,
				"elements": [
					{
						"label": "Your Department",
						"type": "select",
						"name": "choose_dept",
						"options": await departments.map(dept => { return {
							label: dept,
							value: dept.toLowerCase().split(" ").join("_")
							}
						})
					},
					{
						"label": "Funfact About You",
						"name": "fun_fact",
						"type": "text",
						"placeholder": "Once, I ate the whole birthday cake of Joanna from Marketing ..."
					},
					{
						"label": "Your Interests",
						"name": "your_interests",
						"type": "text",
						"placeholder": "Interested in knitting, javascript or sustainability? Let me know what you are most passionate about!"
					}
				]

			}
		}
	return await threeQ
}