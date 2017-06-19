require(['NodeController'], function (nodeController) {

    //// Only one node controller is really needed. I'm sure it'll be ok to load the conversational data from the current area cache straight in and parse it out. If there's truly performance issues, then will look at another way.
    /// You could quite easily re-engineer this 'thing' to use for scripted events also. With a couple of async and event callbacks. I'd suggest bolting on a module to the core however, as it should be left pristine.
    // Data mockup (we'd likely auto-generate this on the fly). So for each new node made with text, it gets a guid. Then when we set a link to it, we plant that guid in the linked bit. Or an index, whatever works.
    var json = [{
        "id": "0",
        "text": "Huh.",
        "linked": ["1"],
        "actions": []
    }, {
        "id": "1",
        "text": "You don't look like you're from around here.",
        "linked": ["2", "3"],
        "actions": []
    }, {
        "id": "2",
        "text": "I've lived here all my life!",
        "linked": ["4"],
        "actions": []
    }, {
        "id": "3",
        "text": "I came here from Newton.",
        "linked": ["4"],
        "actions": []
    }, {
        "id": "4",
        "text": "I don't care either way. This was fun.",
        "linked": [],
        "actions": []
    }];

    // Actions would be small nodes on their own that might trigger certain events. It may be wise to set some sort of 'async' flag, as if set, you could run them all at once whilst the conversation happens. Such as if you have people talking in a cutscene, but need to walk around also. You may also want some sort of 'wait' mechanism to halt it at certain points. This, is out of the scope of this tool however.
    // Actions should also just be id's in this instance. It makes no sense to carry that extra weight around. It 'might' even make sense to do this for nodes too.
    // ...

    ///// And to test the lot out:
    nodeController.ParseData(json, function (d) {
        console.log("Conversation done:", d);
    }, true);

    /// If you really feel daring, consider adding 'events' to the enter and exit of the nodes. This will add for even more flexibility. 'If'.
    let output = document.getElementById("output");
    let next = document.getElementById("next");
    let firstrun = true;

    // Note: You 'must' start the chain to have the conversation.
    next.addEventListener('click', function(){
        
        let result = firstrun ? nodeController.Start() : nodeController.Next();
        firstrun = false;

        console.log(result);

        if(result.length <= 1) {
            // Is not question, carry on
            // ...
        } else {
            // Is question, wait for human input
            // ...
        }

    });

});