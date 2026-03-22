PennController.ResetPrefix(null); // Shorten command names (keep this line here))

Header(
// void
)
.log( "PROLIFIC_PID" , GetURLParameter("PROLIFIC_PID") )
.log( "STUDY_ID" , GetURLParameter("STUDY_ID") )
.log( "SESSION_ID" , GetURLParameter("SESSION_ID") )

DebugOff() // Uncomment this line only when you are 100% done designing your experiment


// Empty progress bar label (default is "progress"):
var progressBarText = "";



// First show instructions, then experiment trials, send results and show end screen

Sequence("counter", "fullscreen", "consent", "instructions", "practice-trial", "transition",
         randomize("experimental-trial"), "transToFeedback", "feedback", "send",
         "confirmation-prolific")

SetCounter("counter", "inc", 1);

// Fullscreen
newTrial("fullscreen",
  newButton("Cliquez pour passer en mode plein écran")
    .center()
    .print()
    .wait()
  ,
  fullscreen()
)

// Consent form
newTrial("consent",
    newHtml("consent_form", "consent.html")
        .cssContainer({"width":"700px"})
        .checkboxWarning("Vous devez donner votre consentement avant de continuer...")
        .print()
    ,
    newButton("continue", "Cliquez pour continuer")
        .center()
        .css("font-size", "medium")
        .print()
        .wait(getHtml("consent_form").test.complete()
                  .failure(getHtml("consent_form").warn())
        )
)


newTrial("feedback",
    newText("feedback_question", "Avez-vous des commentaires ou remarques à transmettre aux expérimentateurs ?")
        .center()
        .print()
    ,

    newTextInput("feedback_response", "")
        .center()
        .log()
        .lines(0)
        .size(500, 200)
        .css("margin","1em")
        .print()
    ,
    
    newButton("Cliquez pour continuer")
        .center()
        .print()
        .wait()
)


// Transition
newTrial("transition",
     // Automatically print all Text elements, centered
    defaultText.center().print()
    ,
    newText("myText", "La session d’entraînement est terminée. L’étude réelle va commencer !<br><br>")
        .center()
        .print()
    ,
    newButton("continue", "Cliquez pour continuer")
        .center()
        .css("font-size", "medium")
        .print()
        .wait()
)


// Transition to feedback text field
newTrial("transToFeedback",
    newText("myText", "Vous êtes arrivé à la fin de l’expérience !<br><br>")
        .center()
        .print()
    ,
    newButton("continue", "Cliquez pour continuer")
        .center()
        .css("font-size", "medium")
        .print()
        .wait()
)



// List-specific instructions
Template("dummy.csv", row =>
    newTrial("instructions",
     // Automatically print all Text elements, centered
    defaultText.center().print()
    ,
    newHtml("instructions", "instr-"+row.list.charAt(1)+".html")
        .cssContainer({"width":"700px"})
        .print()
    ,
    newButton("continue", "Cliquez pour continuer")
        .center()
        .css("font-size", "medium")
        .print()
        .wait()
    )
)


// Practice trial
Template("practice.csv", row =>
    newTrial("practice-trial",
        newCanvas("myWaitCanvas", 400, 400)
            .add(0, 0, newText("myWaitCanvasText", ""))
            .center()
            .print()
        ,
        newText("myText", "Appuyez sur la barre ESPACE pour voir l’exemple suivant.")
        .center()
        .print()
        ,
        newKey("space", " ")
            .wait()
        ,
        getCanvas("myWaitCanvas")
        .remove()
        ,
        getText("myText")
        .remove()
        ,
        defaultImage.size(400, 400),
        newCanvas("images", 400, 400)
            .add(
                0, 0, 
                row.list === "1b" | row.list === "2b" | row.list === "3b"
                | row.list === "4b" | row.list === "5b" | row.list === "6b"
                | row.list === "1d" | row.list === "2d" | row.list === "3d"
                | row.list === "4d" | row.list === "5d" | row.list === "6d"
                    ? newImage("target", row.picture) 
                    : newText("")
            )
            .center()
            .print()
        ,
        newText("<h3>"+row.sentence+"</h3><br> ")
        .center()
        .print()
        ,
        newController("myController", "Question", {
            instructions: "Répondez en appuyant sur la touche D ou K.",
            q: row.question,
            as: [["D", "<b>"+row.option_1+"</b> (D)"], ["K", "<b>"+row.option_2+"</b> (K)"]],
            randomOrder: false,
            hasCorrect: false, // most of them have correct, but will compare given and true answers later on in R instead
            presentHorizontally: true})
        .center()
        .print()
        .log()
        .wait()
        .remove()
    )
    .log("item", row.item)
    .log("condition", row.condition)
    .log("group", row.list)
    //.log("sentence", row.sentence)  // already logged by PCIbex in DashedSentence by default
    //.log("question", row.question)  // already logged by PCIbex in Question by default
    .log("option_1", row.option_1)
    .log("option_2", row.option_2)
    .log("exp_answer", row.exp_answer)
)

// Experimental trial
Template("data.csv", row =>
    newTrial("experimental-trial",
        newCanvas("myWaitCanvas", 400, 400)
            .add(0, 0, newText("myWaitCanvasText", ""))
            .center()
            .print()
        ,
        newText("myText", "Appuyez sur la barre ESPACE pour voir l’exemple suivant.")
        .center()
        .print()
        ,
        newKey("space", " ")
            .wait()
        ,
        getCanvas("myWaitCanvas")
        .remove()
        ,
        getText("myText")
        .remove()
        ,
        defaultImage.size(400, 400),
        newCanvas("images", 400, 400)
            .add(
                0, 0, 
                row.list === "1b" | row.list === "2b" | row.list === "3b"
                | row.list === "4b" | row.list === "5b" | row.list === "6b"
                | row.list === "1d" | row.list === "2d" | row.list === "3d"
                | row.list === "4d" | row.list === "5d" | row.list === "6d"
                    ? newImage("target", row.picture) 
                    : newText("")
            )
            .center()
            .print()
        ,
        newText("<h3>"+row.sentence+"</h3><br> ")
        .center()
        .print()
        ,
        newController("myController", "Question", {
            instructions: "Répondez en appuyant sur la touche D ou K.",
            q: row.question,
            as: [["D", "<b>"+row.option_1+"</b> (D)"], ["K", "<b>"+row.option_2+"</b> (K)"]],
            randomOrder: false,
            hasCorrect: false, // most of them have correct, but will compare given and true answers later on in R instead
            presentHorizontally: true})
        .center()
        .print()
        .log()
        .wait()
        .remove()
    )
    .log("item", row.item)
    .log("condition", row.condition)
    .log("group", row.list)
    //.log("sentence", row.sentence)  // already logged by PCIbex in DashedSentence by default
    //.log("question", row.question)  // already logged by PCIbex in Question by default
    .log("option_1", row.option_1)
    .log("option_2", row.option_2)
    .log("exp_answer", row.exp_answer)
)


// Send results manually
SendResults("send")

// Completion screen
newTrial("confirmation-prolific" ,
    newText("<p>Merci pour votre participation !</p>")
        .center()
        .print()
    ,
 // This is where you should put the link from the last step.
    newText("<p><a href='https://app.prolific.com/submissions/complete?cc=COOPRURX'>Cliquez ici pour valider votre participation sur Prolific.</a></p>")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
    ).setOption("countsForProgressBar", false)
