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
  newButton("Click to enter fullscreen mode")
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
        .checkboxWarning("You have to consent before continuing...")
        .print()
    ,
    newButton("continue", "Click to continue")
        .center()
        .css("font-size", "medium")
        .print()
        .wait(getHtml("consent_form").test.complete()
                  .failure(getHtml("consent_form").warn())
        )
)


newTrial("feedback",
    newText("feedback_question", "Do you have any comments or remarks for the experimenters?")
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
    
    newButton("Click to continue")
        .center()
        .print()
        .wait()
)


// Transition
newTrial("transition",
     // Automatically print all Text elements, centered
    defaultText.center().print()
    ,
    newText("myText", "The practice session is over. The real study is about to begin!<br><br>")
        .center()
        .print()
    ,
    newButton("continue", "Click to continue")
        .center()
        .css("font-size", "medium")
        .print()
        .wait()
)


// Transition to feedback text field
newTrial("transToFeedback",
    newText("myText", "You have reached the end of the experiment!<br><br>")
        .center()
        .print()
    ,
    newButton("continue", "Click to continue")
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
    newButton("continue", "Click to continue")
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
        newText("myText", "Press the SPACE bar to view the next example.")
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
        newText("<h3>"+row.sentence+"</h3><br>&nbsp;")
        .center()
        .print()
        ,
        newController("myController", "Question", {
            instructions: "Answer using the D or K key.",
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
        newText("myText", "Press the SPACE bar to view the next example.")
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
                | row.list === "1d" | row.list === "2d" | row.list === "3d"
                    ? newImage("target", row.picture) 
                    : newText("")
            )
            .center()
            .print()
        ,
        newText("<h3>"+row.sentence+"</h3><br>&nbsp;")
        .center()
        .print()
        ,
        newController("myController", "Question", {
            instructions: "Answer using the D or K key.",
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
    newText("<p>Thanks for your participation!</p>")
        .center()
        .print()
    ,
 // This is where you should put the link from the last step.
    newText("<p><a href='https://app.prolific.com/submissions/complete?cc=COOPRURX'>Click here to validate your participation on Prolific.</a></p>")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
    ).setOption("countsForProgressBar", false)

